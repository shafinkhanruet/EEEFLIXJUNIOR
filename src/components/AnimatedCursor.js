import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styled from 'styled-components';

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
  mix-blend-mode: difference;
`;

const Cursor = styled(motion.div)`
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(229, 9, 20, 0.6);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: exclusion;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.7);
`;

const FollowerCursor = styled(motion.div)`
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(229, 9, 20, 0.4);
  pointer-events: none;
  z-index: 9998;
  will-change: transform;
`;

const PointerHover = styled(motion.div)`
  position: fixed;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  pointer-events: none;
  border: 1px solid rgba(229, 9, 20, 0.15);
  z-index: 9997;
  opacity: 0;
  will-change: transform, opacity, width, height;
  backdrop-filter: invert(10%);
`;

const AnimatedCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Create spring animations for smoother following
  const springConfig = { damping: 25, stiffness: 300 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);
  
  // Even smoother spring for the outer ring
  const pointerX = useSpring(cursorX, { damping: 15, stiffness: 150 });
  const pointerY = useSpring(cursorY, { damping: 15, stiffness: 150 });

  // Function to throttle frequent events for performance
  const throttle = (callback, delay) => {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(...args);
      }
    };
  };

  useEffect(() => {
    const updateMousePosition = throttle((e) => {
      cursorX.set(e.clientX - 10); // Center cursor
      cursorY.set(e.clientY - 10);
    }, 8); // Super small delay for smooth but responsive feeling

    window.addEventListener('mousemove', updateMousePosition);
    
    // Show cursor only after it moves
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Add listener for interactive elements
    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.classList.contains('clickable') ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.closest('.clickable')
      ) {
        setIsHovering(true);
      }
    };
    
    const handleMouseOut = () => {
      setIsHovering(false);
    };
    
    // Add event listeners for hovering
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    // Mouse leave/enter for window
    document.addEventListener('mouseleave', () => setIsVisible(false));
    document.addEventListener('mouseenter', () => setIsVisible(true));

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseleave', () => setIsVisible(false));
      document.removeEventListener('mouseenter', () => setIsVisible(true));
      clearTimeout(timer);
    };
  }, []);

  return (
    <CursorWrapper>
      <Cursor 
        style={{ 
          x: cursorX, 
          y: cursorY,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0 : 1,
        }}
        animate={{
          scale: isHovering ? 0 : [1, 0.98, 1],
          transition: {
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }}
      />
      <FollowerCursor 
        style={{ 
          x: followerX, 
          y: followerY,
          opacity: isVisible ? 0.6 : 0,
          scale: isHovering ? 1.5 : 1,
        }}
        animate={{
          scale: isHovering ? 1.5 : [1, 1.05, 1],
          transition: {
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }}
      />
      <PointerHover 
        style={{ 
          x: pointerX, 
          y: pointerY,
          opacity: isHovering ? 0.5 : 0,
          scale: isHovering ? 1 : 0.5,
        }}
      />
    </CursorWrapper>
  );
};

export default AnimatedCursor; 