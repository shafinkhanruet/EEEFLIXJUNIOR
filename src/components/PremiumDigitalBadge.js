import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Badge = styled(motion.div)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #141414 0%, #1C1C1C 100%);
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 
    0 0 10px rgba(229, 9, 20, 0.5),
    0 0 20px rgba(229, 9, 20, 0.2);
  border: 1px solid rgba(229, 9, 20, 0.3);
`;

const GlowingBorder = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 4px;
  padding: 1px;
  background: linear-gradient(90deg, #E50914, transparent 40%, transparent 60%, #E50914);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.8;
  z-index: 0;
`;

const CircuitPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='rgba(229, 9, 20, 0.3)' stroke-width='0.5' d='M5,5 L10,5 L10,10 L15,10 L15,15 L20,15 L20,20 L25,20 M25,10 L20,10 L20,15 L15,15 L15,20 L10,20 L10,25 L5,25'/%3E%3C/svg%3E");
  opacity: 0.15;
  z-index: -1;
`;

const DotGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  z-index: 1;
  opacity: 0.3;
`;

const Dot = styled.div`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: rgba(229, 9, 20, 0.8);
  margin: auto;
`;

const ScanLine = styled(motion.div)`
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.6), transparent);
  opacity: 0.5;
  z-index: 2;
`;

const Content = styled.span`
  position: relative;
  z-index: 2;
`;

const PremiumDigitalBadge = ({ text = "Premium", className, style, onClick }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Start animation after component mount with slight delay
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Badge 
      className={className}
      style={style}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 15px rgba(229, 9, 20, 0.6), 0 0 30px rgba(229, 9, 20, 0.3)'
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      }}
    >
      <GlowingBorder 
        animate={{ 
          background: showAnimation ? 
            ['linear-gradient(90deg, #E50914, transparent 40%, transparent 60%, #E50914)', 
             'linear-gradient(90deg, transparent 40%, #E50914, transparent 60%)', 
             'linear-gradient(90deg, transparent 60%, transparent 40%, #E50914)'] : 
            'linear-gradient(90deg, #E50914, transparent 40%, transparent 60%, #E50914)' 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: 'reverse',
          ease: 'linear' 
        }}
      />
      <CircuitPattern />
      <DotGrid>
        {[...Array(9)].map((_, i) => (
          <Dot key={i} />
        ))}
      </DotGrid>
      <ScanLine 
        initial={{ top: '-1px' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1
        }}
      />
      <Content>{text}</Content>
    </Badge>
  );
};

export default PremiumDigitalBadge; 