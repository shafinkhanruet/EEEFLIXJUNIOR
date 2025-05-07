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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // References for audio elements
  const backgroundMusicRef = useRef(null);
  
  // Initialize and preload audio elements
  useEffect(() => {
    let isMounted = true;
    
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
        }
      }
    };
    
    loadAudio();
    
    // Clean up function
    return () => {
      isMounted = false;
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);
  
  // Toggle play/pause music
  const toggleMusic = () => {
    if (!backgroundMusicRef.current) {
      console.error('Audio element not initialized');
      return;
    }
    
    if (isMusicPlaying) {
      console.log('Pausing music');
      backgroundMusicRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      console.log('Attempting to play music');
      
      // Force reload the audio element to bypass potential issues
      backgroundMusicRef.current.currentTime = 0;
      
      // Handle autoplay restrictions by using user interaction
      const playPromise = backgroundMusicRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Music started playing successfully');
            setIsMusicPlaying(true);
          })
          .catch(error => {
            console.error('Autoplay was prevented:', error);
            
            // Try a different approach - create a new audio element
            const newAudio = new Audio(AUDIO_PATH);
            newAudio.volume = backgroundMusicRef.current.volume;
            newAudio.loop = true;
            
            const newPlayPromise = newAudio.play();
            if (newPlayPromise !== undefined) {
              newPlayPromise
                .then(() => {
                  console.log('Music started playing with new audio element');
                  if (backgroundMusicRef.current) {
                    backgroundMusicRef.current.pause();
                  }
                  backgroundMusicRef.current = newAudio;
                  setIsMusicPlaying(true);
                })
                .catch(newError => {
                  console.error('Still unable to play audio:', newError);
                  alert('Unable to play music. This may be due to browser autoplay restrictions. Please try again by clicking the play button.');
                });
            }
          });
      } else {
        console.log('Play promise is undefined, assuming music is playing');
        setIsMusicPlaying(true);
      }
    }
    
    setIsInitialized(true);
  };
  
  // Toggle mute/unmute music
  const toggleMute = () => {
    if (!backgroundMusicRef.current) return;
    
    backgroundMusicRef.current.muted = !isMusicMuted;
    setIsMusicMuted(!isMusicMuted);
  };
  
  // Set music volume
  const setMusicVolume = (value) => {
    if (!backgroundMusicRef.current) return;
    
    const newVolume = Math.max(0, Math.min(1, value));
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
      if (document.hidden) {
        if (backgroundMusicRef.current && isMusicPlaying) {
          backgroundMusicRef.current.pause();
        }
      } else {
        if (backgroundMusicRef.current && isMusicPlaying) {
          backgroundMusicRef.current.play();
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