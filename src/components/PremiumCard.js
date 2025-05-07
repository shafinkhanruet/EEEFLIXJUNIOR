import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animations
const borderFlow = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 300% 0%;
  }
`;

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

// Styled components
const CardContainer = styled(motion.div)`
  position: relative;
  background: linear-gradient(135deg, #141414 0%, #1C1C1C 100%);
  border-radius: 8px;
  padding: 2px;
  overflow: hidden;
  width: ${props => props.width || '280px'};
  height: ${props => props.height || 'auto'};
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 2px;
    background: linear-gradient(90deg, #E50914, #FF5F5F, #E50914);
    background-size: 300% 100%;
    animation: ${borderFlow} 8s linear infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: ${props => (props.active ? 0.9 : 0.3)};
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.9;
  }
`;

const CardContent = styled.div`
  position: relative;
  background: #0F0F0F;
  border-radius: 6px;
  padding: 20px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5);
`;

const CardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  
  /* Grid pattern */
  background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='rgba(229, 9, 20, 0.2)' stroke-width='0.5'%3E%3Cpath d='M0 15h30M15 0v30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  
  /* Circuit pattern overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='rgba(229, 9, 20, 0.15)' stroke-width='0.5' d='M10,10 L30,10 L30,30 L50,30 L50,50 L70,50 L70,70 M70,10 L50,10 L50,30 L30,30 L30,50 L10,50 L10,70'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const ScanlineEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.4), transparent);
  opacity: 0.7;
  animation: ${scanline} 3s linear infinite;
  z-index: 5;
  pointer-events: none;
`;

const CardTitle = styled.h3`
  color: #FFFFFF;
  font-size: 1.3rem;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  margin: 0 0 12px 0;
  position: relative;
  z-index: 2;
  
  /* Digital text effect */
  text-shadow: 0 0 2px rgba(229, 9, 20, 0.4);
`;

const CardDescription = styled.p`
  color: #B3B3B3;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 15px 0;
  position: relative;
  z-index: 2;
`;

const DotGrid = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  grid-template-columns: repeat(3, 4px);
  grid-template-rows: repeat(3, 4px);
  gap: 3px;
  z-index: 3;
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#E50914' : 'rgba(229, 9, 20, 0.3)'};
  transition: background-color 0.2s ease;
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  padding-top: 15px;
  border-top: 1px solid rgba(229, 9, 20, 0.1);
`;

const FooterText = styled.span`
  color: ${props => props.highlight ? '#E50914' : '#999999'};
  font-size: 0.8rem;
  font-weight: ${props => props.highlight ? '600' : '400'};
`;

const PremiumTag = styled.div`
  background: linear-gradient(90deg, #E50914, #FF5F5F);
  color: white;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${borderFlow} 2s infinite;
  }
`;

const PremiumCard = ({ 
  title, 
  description, 
  footerLeft, 
  footerRight, 
  width, 
  height, 
  isPremium,
  onClick 
}) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <CardContainer 
      width={width} 
      height={height}
      active={isActive}
      onClick={onClick}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      whileHover={{ 
        scale: 1.03,
        y: -5,
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(229, 9, 20, 0.2)' 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <CardContent>
        <CardBackground />
        
        {isActive && <ScanlineEffect />}
        
        <DotGrid>
          {[...Array(9)].map((_, i) => (
            <Dot key={i} active={isActive} />
          ))}
        </DotGrid>
        
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        
        <CardFooter>
          <FooterText highlight={isActive}>{footerLeft}</FooterText>
          {isPremium ? (
            <PremiumTag>Premium</PremiumTag>
          ) : (
            <FooterText>{footerRight}</FooterText>
          )}
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
};

export default PremiumCard; 