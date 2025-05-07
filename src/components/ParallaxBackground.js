import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { throttle } from '../utils/performance';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: #0F0F0F;
`;

const NoiseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
`;

const GradientOverlay = styled(motion.div)`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(30, 30, 30, 0.15) 0%,
    transparent 40%
  );
  opacity: 0.5;
  will-change: opacity;
  pointer-events: none;
`;

const NetflixParallelogram = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 120%;
  top: -10%;
  background: linear-gradient(to bottom right, rgba(229, 9, 20, 0.03), transparent 70%);
  transform: skewY(-5deg);
  z-index: 0;
`;

// Add new digital elements
const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='rgba(229, 9, 20, 0.05)' stroke-width='0.5'%3E%3Cpath d='M60 0v60H0V0h60z'/%3E%3Cpath d='M30 0v60M0 30h60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
  z-index: 0;
`;

const ScanLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.5), transparent);
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.5);
  opacity: 0.3;
  z-index: 1;
`;

const CircuitPatterns = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='rgba(229, 9, 20, 0.06)' stroke-width='1' d='M10,10 L30,10 L30,30 L50,30 L50,50 L70,50 L70,70 L90,70 M90,30 L70,30 L70,50 L50,50 L50,70 L30,70 L30,90 L10,90'/%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: 0;
`;

const DiagonalLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='rgba(229, 9, 20, 0.03)' stroke-width='0.5'%3E%3Cpath d='M-10,50 L50,-10 M-30,70 L70,-30 M10,30 L30,10'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: 0;
`;

const RedGlowPulse = styled(motion.div)`
  position: absolute;
  top: 70%;
  left: 30%;
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(229, 9, 20, 0.05) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 0;
`;

const ParallaxBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const glowControls = useAnimation();
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use throttle for mouse move event to reduce calculations
  useEffect(() => {
    if (!isMounted) return;
    
    const handleMouseMove = throttle((e) => {
      // Update CSS variables for the gradient position
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX / window.innerWidth * 100}%`);
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY / window.innerHeight * 100}%`);
      }
    }, 100); // Throttle to 100ms

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMounted]);

  return (
    <BackgroundContainer ref={containerRef}>
      <NoiseOverlay />
      <GridOverlay />
      <CircuitPatterns />
      <DiagonalLines />
      <NetflixParallelogram 
        animate={{ 
          opacity: 0.5,
          y: 10
        }}
        initial={{
          opacity: 0.3,
          y: 0
        }}
        transition={{
          duration: 10,
          yoyo: Infinity,
          ease: 'easeInOut',
        }}
      />
      <ScanLine
        initial={{ top: '-2px' }}
        animate={{ top: '100vh' }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <RedGlowPulse 
        animate={{
          opacity: 0.6,
          scale: 1.2
        }}
        initial={{
          opacity: 0.3,
          scale: 1
        }}
        transition={{
          opacity: {
            duration: 4,
            yoyo: Infinity,
            ease: 'easeInOut',
          },
          scale: {
            duration: 4,
            yoyo: Infinity,
            ease: 'easeInOut',
          }
        }}
      />
      <GradientOverlay />
    </BackgroundContainer>
  );
};

export default ParallaxBackground;
