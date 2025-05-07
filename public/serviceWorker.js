const CACHE_NAME = 'eeeflix-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/',
  '/static/js/',
  '/assets/',
  '/favicon.ico',
  '/manifest.json'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests (network first, fallback to cache)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If valid response, clone it and store in cache
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to get it from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request since it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since it can only be used once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete obsolete caches
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  // Tell the active service worker to take control of the page immediately
  self.clients.claim();
});

// Handle background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Helper function to sync forms when back online
function syncForms() {
  return caches.open('form-data')
    .then(cache => cache.keys())
    .then(keys => {
      return Promise.all(keys.map(key => {
        return caches.open('form-data')
          .then(cache => cache.match(key))
          .then(response => response.json())
          .then(formData => {
            // Send the stored form data to the server
            return fetch(key.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            }).then(response => {
              if (response.ok) {
                // If successful, remove from cache
                return caches.open('form-data')
                  .then(cache => cache.delete(key));
              }
            });
          });
      }));
    });
} 