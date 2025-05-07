import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PremiumBanner = styled(motion.div)`
  background-color: #E50914;
  color: white;
  padding: 10px 25px;
  border-radius: 5px;
  display: inline-block;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  box-shadow: 
    0 0 10px rgba(229, 9, 20, 0.5),
    0 0 20px rgba(229, 9, 20, 0.3),
    0 0 30px rgba(229, 9, 20, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const PremiumExperience = ({ className, style, onClick }) => {
  return (
    <PremiumBanner
      className={className}
      style={style}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      Premium Experience
    </PremiumBanner>
  );
};

export default PremiumExperience; 