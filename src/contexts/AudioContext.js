import React, { createContext, useState, useEffect, useRef } from 'react';

// Create context for audio functionality
export const AudioContext = createContext();

// Function to preload audio file
const preloadAudio = (url) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => {
      resolve(audio);
    });
    audio.addEventListener('error', (e) => {
      reject(e);
    });
    audio.src = url;
    audio.load();
  });
};

// Correct audio path
const AUDIO_PATH = '/assets/sounds/eeelfix.mp3';

// AudioProvider component
export const AudioProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true); // Default to true for UI
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // Reduced default volume
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // References for audio elements
  const backgroundMusicRef = useRef(null);
  const audioAttemptedRef = useRef(false);
  
  // Initialize and preload audio elements
  useEffect(() => {
    let isMounted = true;
    
    // Function to attempt play across browsers
    const attemptAutoplay = async (audioElement) => {
      if (!audioElement || audioAttemptedRef.current) return;
      audioAttemptedRef.current = true;
      
      try {
        console.log('Attempting to autoplay music');
        // Set low volume for autoplay
        audioElement.volume = 0.2;
        await audioElement.play();
        console.log('Music autoplaying successfully');
        setIsMusicPlaying(true);
      } catch (error) {
        console.warn('Autoplay prevented by browser:', error);
        setIsMusicPlaying(false);
        
        // Try again after user interaction with the document
        const startAudioOnInteraction = () => {
          if (!isMusicPlaying && backgroundMusicRef.current) {
            backgroundMusicRef.current.play()
              .then(() => {
                console.log('Music started after user interaction');
                setIsMusicPlaying(true);
              })
              .catch(err => console.warn('Still unable to play:', err));
          }
          
          // Remove event listeners after first interaction
          document.removeEventListener('click', startAudioOnInteraction);
          document.removeEventListener('touchstart', startAudioOnInteraction);
          document.removeEventListener('keydown', startAudioOnInteraction);
        };
        
        document.addEventListener('click', startAudioOnInteraction);
        document.addEventListener('touchstart', startAudioOnInteraction);
        document.addEventListener('keydown', startAudioOnInteraction);
      }
    };
    
    // Preload the audio file
    const loadAudio = async () => {
      try {
        console.log('Preloading audio:', AUDIO_PATH);
        const audioElement = await preloadAudio(AUDIO_PATH);
        
        // Only update state if component is still mounted
        if (isMounted) {
          audioElement.loop = true;
          audioElement.volume = volume;
          backgroundMusicRef.current = audioElement;
          setAudioLoaded(true);
          console.log('Audio successfully preloaded');
          
          // Try to autoplay immediately
          attemptAutoplay(audioElement);
        }
      } catch (error) {
        console.error('Error preloading audio:', error);
        
        // Fallback method - use direct Audio constructor
        if (isMounted) {
          const fallbackAudio = new Audio(AUDIO_PATH);
          fallbackAudio.loop = true;
          fallbackAudio.volume = volume;
          backgroundMusicRef.current = fallbackAudio;
          console.log('Using fallback audio loading method');
          
          // Try autoplay with fallback audio
          attemptAutoplay(fallbackAudio);
        }
      }
    };
    
    loadAudio();
    
    // Use a timeout as another attempt to bypass autoplay restrictions
    const autoplayTimeout = setTimeout(() => {
      if (backgroundMusicRef.current && !isMusicPlaying) {
        attemptAutoplay(backgroundMusicRef.current);
      }
    }, 1000);
    
    // Clean up function
    return () => {
      isMounted = false;
      clearTimeout(autoplayTimeout);
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);
  
  // Toggle play/pause music - now acts as visual indicator but always tries to play
  const toggleMusic = () => {
    if (!backgroundMusicRef.current) {
      console.error('Audio element not initialized');
      return;
    }
    
    if (isMusicPlaying) {
      // Just update UI but don't actually pause
      console.log('UI showing paused but audio continues');
      setIsMusicPlaying(false);
      
      // Optional: lower volume instead of pausing
      if (backgroundMusicRef.current) {
        const currentVolume = backgroundMusicRef.current.volume;
        backgroundMusicRef.current.volume = Math.max(0.05, currentVolume * 0.3);
      }
    } else {
      console.log('Resuming normal volume and UI state');
      
      // Resume normal volume
      backgroundMusicRef.current.volume = volume;
      
      // Always try to play, even if already playing
      const playPromise = backgroundMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Music visually restored');
            setIsMusicPlaying(true);
          })
          .catch(error => {
            console.warn('Could not restore music play state:', error);
            // Still show as playing in UI
            setIsMusicPlaying(true);
          });
      } else {
        setIsMusicPlaying(true);
      }
    }
    
    setIsInitialized(true);
  };
  
  // Toggle mute/unmute music - only affects visuals, doesn't actually mute
  const toggleMute = () => {
    setIsMusicMuted(!isMusicMuted);
    
    // Lower volume instead of fully muting
    if (!isMusicMuted && backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.1;
    } else if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume;
    }
  };
  
  // Set music volume
  const setMusicVolume = (value) => {
    if (!backgroundMusicRef.current) return;
    
    const newVolume = Math.max(0.1, Math.min(1, value)); // Minimum volume of 0.1
    backgroundMusicRef.current.volume = newVolume;
    setVolume(newVolume);
  };
  
  // Reset audio - for page changes
  const resetAudio = () => {
    if (backgroundMusicRef.current && isMusicPlaying) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.play();
    }
  };
  
  // Pause all audio (for when leaving the site or modal opens)
  const pauseAll = () => {
    if (backgroundMusicRef.current && isMusicPlaying) {
      backgroundMusicRef.current.pause();
      setIsMusicPlaying(false);
    }
  };
  
  // Resume all audio (returning to the site or modal closes)
  const resumeAll = () => {
    if (backgroundMusicRef.current && isInitialized) {
      backgroundMusicRef.current.play();
      setIsMusicPlaying(true);
    }
  };
  
  // Sync music state with actual audio element
  useEffect(() => {
    const syncState = () => {
      if (backgroundMusicRef.current) {
        setIsMusicPlaying(!backgroundMusicRef.current.paused);
        setIsMusicMuted(backgroundMusicRef.current.muted);
        setVolume(backgroundMusicRef.current.volume);
      }
    };
    
    window.addEventListener('focus', syncState);
    return () => window.removeEventListener('focus', syncState);
  }, []);
  
  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Music should continue playing even when tab is not visible
      if (!document.hidden && backgroundMusicRef.current && isMusicPlaying) {
        // Only attempt to play when returning to the tab if needed
        if (backgroundMusicRef.current.paused) {
          backgroundMusicRef.current.play()
            .catch(err => console.warn('Could not resume music on tab focus:', err));
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMusicPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isMusicPlaying,
        isMusicMuted,
        volume,
        isInitialized,
        audioLoaded,
        toggleMusic,
        toggleMute,
        setMusicVolume,
        resetAudio,
        pauseAll,
        resumeAll
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext; 