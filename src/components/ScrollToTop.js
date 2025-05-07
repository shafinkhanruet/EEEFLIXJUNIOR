import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import useScrollOptimizer from '../hooks/useScrollOptimizer';

const ScrollButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(229, 9, 20, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  box-shadow: 0 4px 20px rgba(229, 9, 20, 0.4);
  will-change: transform;
  
  &:before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(229, 9, 20, 0.6));
    z-index: -1;
    opacity: 0.5;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 20px;
    right: 20px;
    width: 42px;
    height: 42px;
  }
`;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const { scrollPosition } = useScrollOptimizer();

  useEffect(() => {
    setVisible(scrollPosition.y > window.innerHeight / 2);
  }, [scrollPosition]);

  const scrollToTop = () => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <ScrollButton
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15 
          }}
          whileHover={{ 
            scale: 1.1, 
            boxShadow: '0 6px 25px rgba(229, 9, 20, 0.6)' 
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowUp />
        </ScrollButton>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop; 