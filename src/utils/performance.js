/**
 * Performance optimization utilities for smooth animations and interactions
 */

// Throttle function to limit execution frequency
export const throttle = (callback, delay = 16) => {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return callback(...args);
    }
  };
};

// Debounce function to delay execution until after a pause
export const debounce = (callback, delay = 100) => {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
    };
    
// RAF (requestAnimationFrame) based throttle for smoother animations
export const rafThrottle = (callback) => {
  let scheduled = false;
  
  return function(...args) {
    if (scheduled) return;
    
    scheduled = true;
    
    requestAnimationFrame(() => {
      callback(...args);
      scheduled = false;
  });
  };
};

// Detect browser capabilities for optimized rendering
export const detectBrowserCapabilities = () => {
  const capabilities = {
    supportsWebP: false,
    supportsAvif: false,
    supportsTouchEvents: false,
    supportsPassiveEvents: false,
    devicePixelRatio: 1,
    isHighEndDevice: false,
    isLowEndDevice: false,
    prefersReducedMotion: false
  };
  
  // Check for passive event support
  try {
    const options = {
      get passive() {
        capabilities.supportsPassiveEvents = true;
        return true;
      }
    };
    
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (err) {
    capabilities.supportsPassiveEvents = false;
  }
  
  // Touch event support
  capabilities.supportsTouchEvents = 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    navigator.msMaxTouchPoints > 0;
  
  // Device pixel ratio
  capabilities.devicePixelRatio = window.devicePixelRatio || 1;

  // High/low end device detection
  // Simple heuristic based on pixel ratio and memory
  if (navigator.deviceMemory) {
    capabilities.isLowEndDevice = navigator.deviceMemory < 4 && capabilities.devicePixelRatio <= 2;
    capabilities.isHighEndDevice = navigator.deviceMemory >= 8 && capabilities.devicePixelRatio >= 2;
  } else {
    capabilities.isLowEndDevice = capabilities.devicePixelRatio < 2;
    capabilities.isHighEndDevice = capabilities.devicePixelRatio >= 3;
  }
  
  // Reduced motion preference
  capabilities.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return capabilities;
};

// Apply performance optimizations based on device capabilities
export const applyPerformanceOptimizations = () => {
  const capabilities = detectBrowserCapabilities();
  
  // Add performance-related classes to the body for CSS optimizations
  if (capabilities.isLowEndDevice) {
    document.body.classList.add('low-end-device');
  }
  
  if (capabilities.isHighEndDevice) {
    document.body.classList.add('high-end-device');
  }
  
  if (capabilities.prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
  }
  
  // Optimize event listeners for touch devices
  if (capabilities.supportsTouchEvents) {
    document.body.classList.add('touch-device');
  }
  
  return capabilities;
};

// Apply rAF (requestAnimationFrame) based scroll listener for smoother performance
export const createSmoothScrollListener = (callback) => {
  let ticking = false;
  let lastKnownScrollPosition = 0;
  
  const onScroll = () => {
    lastKnownScrollPosition = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(lastKnownScrollPosition);
        ticking = false;
      });
      
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', onScroll, capabilities.supportsPassiveEvents ? { passive: true } : false);
  
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
};

// Check if element is in viewport for optimized intersection handling
export const isElementInViewport = (element, threshold = 0) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Check if element is in viewport with threshold
  return (
    rect.top <= windowHeight * (1 - threshold) &&
    rect.bottom >= windowHeight * threshold
  );
};

// Apply will-change property strategically for better GPU acceleration
export const optimizeForAnimation = (element, property = 'transform', duration = 300) => {
  if (!element) return null;
  
  // Apply will-change property before animation
  element.style.willChange = property;
  
  // Clear will-change after animation completes to free GPU resources
  const cleanup = () => {
    setTimeout(() => {
      element.style.willChange = 'auto';
    }, duration);
  };
  
  return cleanup;
};

// Use Intersection Observer for optimized animations on scroll
export const createScrollAnimationObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => callback(entry));
  }, mergedOptions);
  
  return {
    observe: (element) => {
      if (element) observer.observe(element);
    },
    unobserve: (element) => {
      if (element) observer.unobserve(element);
    },
    disconnect: () => observer.disconnect()
  };
};

// Utility to preload images for smoother transitions
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload images for better performance
export const preloadImages = (sources) => {
  return Promise.all(sources.map(src => preloadImage(src)));
};

// Enable hardware acceleration globally for smoother animations
export const enableHardwareAcceleration = () => {
  const style = document.createElement('style');
  
  style.textContent = `
    .hw-accelerated {
      transform: translateZ(0);
      will-change: transform;
      backface-visibility: hidden;
    }
  `;
  
  document.head.appendChild(style);
};

// Apply optimizations right away
const capabilities = applyPerformanceOptimizations();
enableHardwareAcceleration();

export default {
  throttle,
  debounce,
  rafThrottle,
  detectBrowserCapabilities,
  applyPerformanceOptimizations,
  createSmoothScrollListener,
  isElementInViewport,
  optimizeForAnimation,
  createScrollAnimationObserver,
  preloadImage,
  preloadImages,
  enableHardwareAcceleration,
  capabilities
};
