import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animations
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(229, 9, 20, 0.5), 0 0 10px rgba(229, 9, 20, 0.2); }
  50% { box-shadow: 0 0 8px rgba(229, 9, 20, 0.6), 0 0 15px rgba(229, 9, 20, 0.3); }
`;

const scanAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const ProgressContainer = styled.div`
  position: relative;
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '1rem 0'};
`;

const ProgressTrack = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.height || '5px'};
  background: rgba(51, 51, 51, 0.7);
  border-radius: ${props => props.rounded ? '10px' : '2px'};
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='6' height='1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h2v1H0z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const ProgressBarWrapper = styled.div`
  position: relative;
  height: 100%;
  width: ${props => `${props.percent}%`};
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: ${props => props.gradient ? 
    'linear-gradient(90deg, #E50914, #FF5F5F)' : 
    '#E50914'};
  border-radius: ${props => props.rounded ? '10px' : '2px'};
  animation: ${pulseGlow} 2s ease-in-out infinite;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

const DigitalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    animation: ${scanAnimation} 1.5s linear infinite;
  }
`;

const GridLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='4' height='100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='0' y2='100%' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E");
  background-repeat: space;
  opacity: 0.3;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-family: 'Poppins', sans-serif;
`;

const Label = styled.div`
  font-size: 0.85rem;
  color: ${props => props.primary ? '#FFFFFF' : '#B3B3B3'};
  font-weight: ${props => props.primary ? '600' : '400'};
`;

const PercentageLabel = styled(motion.div)`
  position: absolute;
  top: ${props => props.showAbove ? '-20px' : 'auto'};
  bottom: ${props => props.showAbove ? 'auto' : '-20px'};
  right: ${props => props.alignRight ? '0' : 'auto'};
  left: ${props => props.alignRight ? 'auto' : `calc(${props.percent}% - 15px)`};
  transform: ${props => props.alignRight ? 'none' : `translateX(${props.percent > 10 ? '-50%' : '0'})`};
  background: linear-gradient(135deg, #0F0F0F, #1A1A1A);
  border: 1px solid rgba(229, 9, 20, 0.3);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  color: #E50914;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: ${props => props.showAbove ? '100%' : 'auto'};
    bottom: ${props => props.showAbove ? 'auto' : '100%'};
    left: ${props => props.alignRight ? 'auto' : '50%'};
    right: ${props => props.alignRight ? '10px' : 'auto'};
    transform: ${props => props.alignRight ? 'none' : 'translateX(-50%)'};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: ${props => props.showAbove ? '5px solid #1A1A1A' : 'none'};
    border-bottom: ${props => props.showAbove ? 'none' : '5px solid #1A1A1A'};
  }
`;

const DigitalProgressBar = ({
  percent = 0,
  label,
  showPercentage = true,
  height,
  width,
  margin,
  gradient = true,
  rounded = false,
  percentageAbove = false,
  percentageAlignRight = false,
  maxLabel,
  animate = true,
  className,
  style
}) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  
  useEffect(() => {
    if (animate) {
      // Animate the percentage
      const interval = setInterval(() => {
        setDisplayPercent(prev => {
          if (prev < percent) {
            return Math.min(prev + 1, percent);
          }
          clearInterval(interval);
          return prev;
        });
      }, 15);
      
      return () => clearInterval(interval);
    } else {
      setDisplayPercent(percent);
    }
  }, [percent, animate]);
  
  return (
    <ProgressContainer 
      className={className}
      style={style}
      width={width}
      margin={margin}
    >
      {(label || maxLabel) && (
        <LabelContainer>
          {label && <Label primary>{label}</Label>}
          {maxLabel && <Label>{maxLabel}</Label>}
        </LabelContainer>
      )}
      
      <ProgressTrack height={height} rounded={rounded}>
        <ProgressBarWrapper percent={displayPercent}>
          <ProgressFill gradient={gradient} rounded={rounded} />
          <GridLines />
          <DigitalOverlay />
        </ProgressBarWrapper>
      </ProgressTrack>
      
      {showPercentage && (
        <PercentageLabel
          initial={{ opacity: 0, y: percentageAbove ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          percent={displayPercent}
          showAbove={percentageAbove}
          alignRight={percentageAlignRight}
        >
          {displayPercent}%
        </PercentageLabel>
      )}
    </ProgressContainer>
  );
};

export default DigitalProgressBar; 