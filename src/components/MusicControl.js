import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioContext } from '../contexts/AudioContext';

const MusicControlContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MusicButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(229, 9, 20, 0.7);
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:focus {
    outline: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(229, 9, 20, 0.2), transparent);
    z-index: -1;
  }
`;

const MusicIcon = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
`;

const VolumeControl = styled(motion.div)`
  width: 100px;
  height: 28px;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(229, 9, 20, 0.4);
`;

const VolumeSlider = styled.input.attrs({ type: 'range', min: 0, max: 100, step: 1 })`
  width: 100%;
  height: 3px;
  -webkit-appearance: none;
  background: linear-gradient(to right, #E50914 0%, #E50914 ${props => props.value}%, #666 ${props => props.value}%, #666 100%);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #E50914;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid white;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #E50914;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid white;
  }
  
  &::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.5);
  }
`;

const EqualizerBars = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 20px;
  width: 20px;
  gap: 2px;
`;

const Bar = styled(motion.div)`
  width: 2px;
  background-color: white;
  border-radius: 1px;
`;

const MusicLabel = styled(motion.div)`
  position: absolute;
  top: -30px;
  background: rgba(20, 20, 20, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const MusicStatus = styled(motion.div)`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#E50914' : '#666'};
`;

// Add loading indicator styled component
const LoadingIndicator = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
`;

const MusicControl = () => {
  const { 
    isMusicPlaying, 
    isMusicMuted, 
    volume, 
    toggleMusic, 
    toggleMute, 
    setMusicVolume,
    audioLoaded 
  } = useContext(AudioContext);
  
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Bar heights for equalizer animation
  const barHeights = [
    [5, 7, 10, 12, 8],
    [12, 8, 5, 9, 12],
    [8, 12, 14, 8, 6],
    [10, 6, 8, 12, 10]
  ];
  
  // Animation variants for the equalizer bars
  const variants = {
    playing: (custom) => ({
      height: barHeights.map(set => set[custom % set.length]),
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }),
    paused: {
      height: 5
    }
  };
  
  // Loading animation
  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10) / 100;
    setMusicVolume(newVolume);
  };

  // Handle music toggle with loading state
  const handleMusicToggle = () => {
    if (!audioLoaded) {
      setIsLoading(true);
    }
    toggleMusic();
  };
  
  // Reset loading state when audio is loaded or playing changes
  useEffect(() => {
    if (audioLoaded || isMusicPlaying) {
      setIsLoading(false);
    }
  }, [audioLoaded, isMusicPlaying]);
  
  return (
    <MusicControlContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <AnimatePresence>
        {showVolumeControl && (
          <VolumeControl
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeSlider
              value={volume * 100}
              onChange={handleVolumeChange}
            />
          </VolumeControl>
        )}
      </AnimatePresence>
      
      <MusicButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMusicToggle}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        onFocus={() => setShowVolumeControl(true)}
        onBlur={() => setShowVolumeControl(false)}
        disabled={isLoading}
      >
        <AnimatePresence>
          {showLabel && (
            <MusicLabel
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? 'Loading...' : isMusicPlaying ? 'Pause Music' : 'Play Music'}
            </MusicLabel>
          )}
        </AnimatePresence>
        
        <MusicStatus active={isMusicPlaying} />
        
        <MusicIcon>
          {isLoading ? (
            <LoadingIndicator 
              variants={loadingVariants}
              animate="animate"
            />
          ) : isMusicPlaying ? (
            <EqualizerBars>
              {[0, 1, 2, 3, 4].map((i) => (
                <Bar
                  key={i}
                  custom={i}
                  variants={variants}
                  animate="playing"
                  initial="paused"
                />
              ))}
            </EqualizerBars>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
              <path d="M9.5 8.5L16.5 12L9.5 15.5V8.5Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </MusicIcon>
      </MusicButton>
    </MusicControlContainer>
  );
};

export default MusicControl; 