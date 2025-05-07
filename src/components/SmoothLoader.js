import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const LoaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #0F0F0F;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ProgressBarContainer = styled.div`
  width: 200px;
  height: 3px;
  background: #333;
  margin-top: 1.5rem;
  position: relative;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #E50914, #FF5433);
  border-radius: 2px;
  transform-origin: left;
`;

const Logo = styled(motion.div)`
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: #E50914;
    transform: scaleX(0);
    transform-origin: left;
    animation: fillLogo 1.5s ease-in-out infinite;
  }
  
  @keyframes fillLogo {
    0%, 100% { transform: scaleX(0); transform-origin: left; }
    50% { transform: scaleX(1); transform-origin: left; }
    50.1% { transform-origin: right; }
    51%, 100% { transform: scaleX(0); transform-origin: right; }
  }
`;

const LoadingText = styled(motion.p)`
  color: #999;
  font-size: 0.9rem;
  margin-top: 2rem;
  letter-spacing: 3px;
  font-weight: 300;
`;

const PageElements = styled(motion.div)`
  opacity: 0;
  height: 100%;
`;

const SparkleEffect = styled(motion.div)`
  position: absolute;
  width: 3px;
  height: 3px;
  background: #E50914;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.8);
  z-index: 2;
`;

const SmoothLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  
  // Generate random sparkle positions
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 20; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 2 + 1
        });
      }
      setSparkles(newSparkles);
    };
    
    generateSparkles();
  }, []);
  
  // Simulate loading progress
  useEffect(() => {
    let timer;
    
    if (loading) {
      // Simulate faster initial progress, then slow down
      const incrementProgress = () => {
        setProgress(prev => {
          // Slower progress as we approach 100%
          if (prev < 30) return prev + 3;
          if (prev < 60) return prev + 2;
          if (prev < 85) return prev + 0.7;
          if (prev < 98) return prev + 0.2;
          
          // Complete loading
          clearInterval(timer);
          
          // Add small delay before hiding loader
          setTimeout(() => {
            setLoading(false);
          }, 800);
          
          return 100;
        });
      };
      
      // Start progress updates
      timer = setInterval(incrementProgress, 40);
    }
    
    return () => clearInterval(timer);
  }, [loading]);
  
  // Reset loader when page is refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      setLoading(true);
      setProgress(0);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <LoaderContainer
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { 
                duration: 0.8, 
                ease: [0.645, 0.045, 0.355, 1.0]
              }
            }}
          >
            {sparkles.map(sparkle => (
              <SparkleEffect
                key={sparkle.id}
                style={{ 
                  left: sparkle.x, 
                  top: sparkle.y, 
                  width: sparkle.size, 
                  height: sparkle.size 
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: sparkle.duration, 
                  repeat: Infinity, 
                  repeatDelay: Math.random() * 3
                }}
              />
            ))}
            
            <Logo
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              EEEFLIX
            </Logo>
            
            <ProgressBarContainer>
              <ProgressBar 
                style={{ scaleX: progress / 100 }}
              />
            </ProgressBarContainer>
            
            <LoadingText
              animate={{ 
                opacity: [0.5, 1, 0.5],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {progress < 100 ? "LOADING..." : "READY"}
            </LoadingText>
          </LoaderContainer>
        )}
      </AnimatePresence>
      
      <PageElements
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: loading ? 0 : 1,
          transition: { 
            duration: 0.5, 
            delay: 0.3,
            ease: "easeInOut"
          }
        }}
      >
        {children}
      </PageElements>
    </>
  );
};

export default SmoothLoader; 