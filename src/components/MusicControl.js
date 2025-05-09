import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioContext } from '../contexts/AudioContext';

const MusicControlContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  /* For mobile devices, keep it at bottom left */
  @media (max-width: 768px) {
    bottom: 20px;
    left: 20px;
  }
  
  &:hover {
    opacity: 1;
  }
`;

const MusicButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(229, 9, 20, 0.5);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  
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
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
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
  top: 4px;
  right: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #E50914;
`;

const MusicControl = () => {
  const { 
    isMusicPlaying, 
    volume, 
    setMusicVolume
  } = useContext(AudioContext);
  
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  
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
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10) / 100;
    setMusicVolume(newVolume);
  };
  
  return (
    <MusicControlContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 1,
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      <AnimatePresence>
        {showVolumeControl && (
          <VolumeControl
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ 
              duration: 0.3,
              ease: [0.33, 1, 0.68, 1]
            }}
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
        onMouseEnter={() => {
          setShowLabel(true);
          setShowVolumeControl(true);
        }}
        onMouseLeave={() => {
          setShowLabel(false);
          setShowVolumeControl(false);
        }}
      >
        <AnimatePresence>
          {showLabel && (
            <MusicLabel
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              Now Playing
            </MusicLabel>
          )}
        </AnimatePresence>
        
        <MusicStatus />
        
        <MusicIcon>
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
        </MusicIcon>
      </MusicButton>
    </MusicControlContainer>
  );
};

export default MusicControl; 