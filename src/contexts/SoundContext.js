import React, { createContext, useContext, useCallback } from 'react';

// Define sound effect paths
const SOUND_EFFECTS = {
  click: '/assets/sounds/click.mp3',
  hover: '/assets/sounds/hover.mp3',
  notification: '/assets/sounds/notification.mp3',
  success: '/assets/sounds/success.mp3',
  error: '/assets/sounds/error.mp3',
};

// Create the context with simplified values
export const SoundContext = createContext({
  soundEnabled: true, // Always enabled
  playSound: () => {},
});

// Custom hook to use the sound context
export const useSoundContext = () => useContext(SoundContext);

// Provider component with automatic sound functionality
export const SoundProvider = ({ children }) => {
  // Sound is always enabled, no toggle functionality
  const soundEnabled = true;
  
  // Fixed volume for all sounds
  const volume = 0.5;
  
  // Play a sound effect without any checks
  const playSound = useCallback((soundName) => {
    try {
      // Simple approach - create a new audio element each time
      const soundPath = SOUND_EFFECTS[soundName] || `/assets/sounds/${soundName}.mp3`;
      const audio = new Audio(soundPath);
      audio.volume = volume;
      
      // Play the sound
      audio.play().catch(error => {
        console.warn(`Failed to play sound effect: ${soundName}`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound: ${soundName}`, error);
    }
  }, []);
  
  // Context value with minimal functionality
  const contextValue = {
    soundEnabled,
    playSound,
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
}; 