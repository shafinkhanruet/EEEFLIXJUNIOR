import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

// Animation keyframes
const matrixRain = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
`;

const scanAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const flickerAnimation = keyframes`
  0%, 100% { opacity: 0.03; }
  5% { opacity: 0.05; }
  10% { opacity: 0.03; }
  15% { opacity: 0.05; }
  20% { opacity: 0.03; }
  25% { opacity: 0.05; }
  30% { opacity: 0.03; }
  35% { opacity: 0.06; }
  40% { opacity: 0.03; }
  45% { opacity: 0.02; }
  50% { opacity: 0.05; }
  55% { opacity: 0.03; }
  60% { opacity: 0.04; }
  65% { opacity: 0.03; }
  70% { opacity: 0.05; }
  75% { opacity: 0.04; }
  80% { opacity: 0.03; }
  85% { opacity: 0.05; }
  90% { opacity: 0.04; }
  95% { opacity: 0.03; }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.3;
    filter: blur(20px);
  }
  50% {
    opacity: 0.5;
    filter: blur(25px);
  }
`;

// Component styles
const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
`;

const MatrixRainLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='10' font-family='monospace' font-size='10' fill='rgba(229, 9, 20, 0.1)' transform='rotate(90, 100, 100)'%3E10101%3C/text%3E%3Ctext x='30' y='30' font-family='monospace' font-size='10' fill='rgba(229, 9, 20, 0.1)' transform='rotate(90, 100, 100)'%3E01010%3C/text%3E%3Ctext x='50' y='50' font-family='monospace' font-size='10' fill='rgba(229, 9, 20, 0.1)' transform='rotate(90, 100, 100)'%3E10101%3C/text%3E%3Ctext x='70' y='70' font-family='monospace' font-size='10' fill='rgba(229, 9, 20, 0.1)' transform='rotate(90, 100, 100)'%3E01010%3C/text%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.03;
  animation: ${matrixRain} 120s linear infinite;
`;

const GridLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='rgba(229, 9, 20, 0.05)' stroke-width='0.5'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.05;
`;

const CircuitLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='rgba(229, 9, 20, 0.05)' stroke-width='1' d='M10,10 L30,10 L30,30 L50,30 L50,50 L70,50 L70,70 L90,70 M90,30 L70,30 L70,50 L50,50 L50,70 L30,70 L30,90 L10,90'/%3E%3C/svg%3E");
  opacity: 0.1;
`;

const ScanlineEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.3), transparent);
  opacity: 0.5;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.2);
  animation: ${scanAnimation} 6s linear infinite;
`;

const FlickerEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.07) 100%);
  animation: ${flickerAnimation} 10s infinite;
`;

const RedGlowEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 30%;
  width: 40%;
  height: 30%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(229, 9, 20, 0.1) 0%, transparent 70%);
  filter: blur(30px);
  animation: ${pulseGlow} 8s ease-in-out infinite;
`;

const VigilanceEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(229, 9, 20, 0.01) 3px,
      rgba(229, 9, 20, 0.01) 4px
    );
  opacity: 0.3;
`;

const DigitalNoiseEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05' fill='%23E50914'/%3E%3C/svg%3E");
`;

const DigitalOverlay = () => {
  return (
    <OverlayContainer>
      <MatrixRainLayer />
      <GridLayer />
      <CircuitLayer />
      <VigilanceEffect />
      <DigitalNoiseEffect />
      <FlickerEffect />
      <RedGlowEffect />
      <ScanlineEffect />
    </OverlayContainer>
  );
};

export default DigitalOverlay; 