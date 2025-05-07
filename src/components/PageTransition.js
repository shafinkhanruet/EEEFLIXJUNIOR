import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const TransitionWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
`;

const TransitionLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.color || '#E50914'};
  z-index: 9999;
`;

const transitionVariants = {
  initial: {
    y: '100%',
  },
  animate: (custom) => ({
    y: '0%',
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.0],
      delay: custom * 0.1,
    },
  }),
  exit: (custom) => ({
    y: '-100%',
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.0],
      delay: custom * 0.1,
    },
  }),
};

// Logo animation for transition
const LogoAnimation = styled(motion.div)`
  position: relative;
  z-index: 10000;
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.div`
  position: relative;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
`;

// Number of layers to create a smooth transition
const LAYERS = 3;

const PageTransition = ({ isPresent }) => {
  const layers = Array.from({ length: LAYERS }, (_, i) => i);
  
  return (
    <AnimatePresence>
      {isPresent && (
        <TransitionWrapper>
          {layers.map((layer, index) => (
            <TransitionLayer
              key={`layer-${index}`}
              color={index === 0 ? '#E50914' : index === 1 ? '#141414' : '#0A0A0A'}
              custom={LAYERS - index - 1} // reverse order for staggered effect
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transitionVariants}
            />
          ))}
          
          <LogoAnimation
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 1.2, 0.8],
              transition: { 
                times: [0, 0.3, 0.7, 1],
                duration: 1.4
              }
            }}
          >
            <Logo>EEEFLIX</Logo>
          </LogoAnimation>
        </TransitionWrapper>
      )}
    </AnimatePresence>
  );
};

export default PageTransition; 