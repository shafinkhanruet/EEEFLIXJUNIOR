import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animation keyframes
const pulse = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(229, 9, 20, 0.3), 0 0 15px rgba(229, 9, 20, 0.1); }
  50% { text-shadow: 0 0 15px rgba(229, 9, 20, 0.4), 0 0 25px rgba(229, 9, 20, 0.2); }
`;

const scanline = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styled components
const HeadingContainer = styled(motion.div)`
  position: relative;
  margin: ${props => props.margin || '0 0 2rem 0'};
  width: fit-content;
`;

const MainHeading = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: ${props => props.size || '2.5rem'};
  color: #FFFFFF;
  letter-spacing: ${props => props.letterSpacing || '0.05em'};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  margin: 0;
  padding: 0;
  position: relative;
  animation: ${pulse} 4s ease-in-out infinite;
  
  span {
    display: inline-block;
    color: #E50914;
    position: relative;
  }
`;

const RedLine = styled(motion.div)`
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #E50914, #FF5F5F);
  border-radius: 2px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    animation: ${scanline} 2s ease-in-out infinite;
  }
`;

const SubHeading = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: ${props => props.size || '1rem'};
  color: #B3B3B3;
  margin: ${props => props.hasLine ? '15px 0 0 0' : '5px 0 0 0'};
  max-width: ${props => props.maxWidth || '600px'};
`;

const GridDots = styled.div`
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: repeat(3, 4px);
  grid-template-rows: repeat(3, 4px);
  gap: 4px;
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #E50914;
  opacity: ${props => props.active ? 0.8 : 0.3};
`;

const CircuitLine = styled.div`
  position: absolute;
  top: 50%;
  left: -30px;
  width: 20px;
  height: 1px;
  background-color: #E50914;
  opacity: 0.5;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 0;
    width: 1px;
    height: 10px;
    background-color: #E50914;
    opacity: 0.5;
  }
`;

const PremiumHeading = ({
  children,
  subheading,
  size,
  subSize,
  margin,
  uppercase,
  letterSpacing,
  hasLine = true,
  maxWidth,
  className,
  style,
  highlightText,
}) => {
  // Function to wrap highlighted text in span
  const renderHighlighted = (text) => {
    if (!highlightText || !text.includes(highlightText)) {
      return text;
    }
    
    const parts = text.split(highlightText);
    return (
      <>
        {parts[0]}<span>{highlightText}</span>{parts[1]}
      </>
    );
  };
  
  return (
    <HeadingContainer
      className={className}
      style={style}
      margin={margin}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CircuitLine />
      
      <MainHeading 
        size={size}
        uppercase={uppercase}
        letterSpacing={letterSpacing}
      >
        {highlightText ? renderHighlighted(children) : children}
      </MainHeading>
      
      {hasLine && (
        <RedLine 
          initial={{ width: '0%', opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
      )}
      
      {subheading && (
        <SubHeading
          size={subSize}
          hasLine={hasLine}
          maxWidth={maxWidth}
        >
          {subheading}
        </SubHeading>
      )}
      
      <GridDots>
        {[...Array(9)].map((_, i) => (
          <Dot key={i} active={i % 2 === 0} />
        ))}
      </GridDots>
    </HeadingContainer>
  );
};

export default PremiumHeading;