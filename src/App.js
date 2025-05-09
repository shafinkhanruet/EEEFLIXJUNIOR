import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// Theme
import { darkTheme } from './theme';

// Context
import { SoundContext } from './contexts/SoundContext';
import { AudioProvider } from './contexts/AudioContext';

// Components - Import synchronously for faster initial load
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import DigitalOverlay from './components/DigitalOverlay';
import MusicControl from './components/MusicControl';
import ScrollToTop from './components/ScrollToTop';

// Lazy loaded components
const SplashScreen = lazy(() => import('./components/SplashScreen'));
const ParallaxBackground = lazy(() => import('./components/ParallaxBackground'));
const Home = lazy(() => import('./pages/Home'));
const Students = lazy(() => import('./pages/Students'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const Resources = lazy(() => import('./pages/Resources'));
const StudentContactManager = lazy(() => import('./components/StudentContactManager'));

// Add page transition styles
const TransitionStyle = createGlobalStyle`
  .page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 400ms, transform 400ms;
  }
  .page-transition-exit {
    opacity: 1;
  }
  .page-transition-exit-active {
    opacity: 0;
    transition: opacity 300ms;
  }
`;

// Add digital scanline animations
const DigitalOverlays = createGlobalStyle`
  @keyframes scanline {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100vh);
    }
  }
  
  @keyframes flicker {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  
  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }
  
  @keyframes dataFlow {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  position: relative;
  z-index: 1;
`;

// Digital scanline effect
const Scanline = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.6), transparent);
  box-shadow: 0 0 12px rgba(229, 9, 20, 0.4);
  opacity: 0.15;
  z-index: 999;
  pointer-events: none;
`;

// Digital grid overlay
const DigitalGrid = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='rgba(229, 9, 20, 0.03)' stroke-width='0.25'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.25;
  z-index: 998;
  pointer-events: none;
`;

// CRT flicker effect
const CRTFlicker = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  opacity: 0;
  z-index: 997;
  pointer-events: none;
  animation: flicker 8s ease-in-out infinite;
`;

// Page Transition Wrapper
const PageTransition = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

// Create a component for the background to improve performance
const BackgroundContainer = React.memo(() => (
  <Suspense fallback={null}>
    <ParallaxBackground />
  </Suspense>
));

// Always enable premium digital effects
const ENABLE_PREMIUM_DIGITAL_EFFECTS = true;

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(false); 
  const [contentReady, setContentReady] = useState(false);
  const [splashError, setSplashError] = useState(false);
  
  // Control when to show the navbar and other elements
  const [showUI, setShowUI] = useState(false);
  
  // Always show digital overlay - remove the toggle state
  
  // Create a sound context value with enabled functionality
  const soundContextValue = {
    soundEnabled: true, // Always enabled
    playSound: (sound) => {
      // Simple sound playing function that always plays the sound
      try {
        const audio = new Audio(`/assets/sounds/${sound}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(err => console.warn('Could not play sound:', err));
      } catch (error) {
        console.warn('Error playing sound:', error);
      }
    }
  };
  
  // Preload and autoplayer background audio
  useEffect(() => {
    // Only attempt to play audio when UI is shown to avoid autoplay restrictions
    if (showUI) {
      try {
        // Create ambient background sound
        const backgroundAudio = new Audio('/assets/sounds/ambient.mp3');
        backgroundAudio.volume = 0.1;
        backgroundAudio.loop = true;
        
        // Play the sound with a slight delay to avoid competing with other resources
        const audioTimer = setTimeout(() => {
          backgroundAudio.play().catch(error => {
            console.warn('Could not autoplay background audio:', error);
          });
        }, 1000);
        
        // Clean up on component unmount
        return () => {
          clearTimeout(audioTimer);
          backgroundAudio.pause();
          backgroundAudio.src = '';
        };
      } catch (error) {
        console.warn('Error setting up background audio:', error);
      }
    }
  }, [showUI]);

  useEffect(() => {
    // Immediately start loading the main content
    setContentReady(true);
    
    // Safety timeout - ensure content is shown quickly
    const safetyTimer = setTimeout(() => {
      if (!showUI) {
        console.log('Safety timeout triggered - forcing app to show UI');
        setSplashError(true);
        setShowSplash(false);
        setShowUI(true);
      }
    }, 5000);

    // Skip splash screen on Vercel production to avoid loading issues
    const isVercelProduction = window.location.hostname.includes('vercel.app');
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash || isVercelProduction) {
      // Skip splash if already seen or on Vercel
      setShowSplash(false);
      setShowUI(true);
    } else {
      // Show splash only if not seen before and not on Vercel
      setTimeout(() => setShowSplash(true), 100);
    }
    
    return () => clearTimeout(safetyTimer);
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    try {
      // Mark that user has seen the splash screen in this session
      sessionStorage.setItem('hasSeenSplash', 'true');
      
      setShowSplash(false);
      setShowUI(true);
    } catch (error) {
      console.error('Error in splash completion:', error);
      // Ensure the app continues to function even if there's an error
      setShowSplash(false);
      setShowUI(true);
    }
  };

  // Handle errors in the splash screen
  const handleSplashError = () => {
    console.error('Splash screen encountered an error');
    setSplashError(true);
    setShowSplash(false);
    setShowUI(true);
  };

  // Animation variants for main content
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Animation for the scanline
  const scanlineVariants = {
    initial: { top: '-2px' },
    animate: { top: '100vh' }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AudioProvider>
      <SoundContext.Provider value={soundContextValue}>
        <TransitionStyle />
        <DigitalOverlays />
        <AppContainer>
          <BackgroundContainer />
          
            {/* Digital effects */}
            {ENABLE_PREMIUM_DIGITAL_EFFECTS && (
              <>
          <Scanline
                  variants={scanlineVariants}
                  initial="initial"
                  animate="animate"
            transition={{
              repeat: Infinity,
                    duration: 5,
                    ease: "linear"
            }}
          />
          <DigitalGrid />
          <CRTFlicker />
                <DigitalOverlay enabled={true} />
              </>
            )}
            
            {/* Show Splash Screen */}
            <AnimatePresence mode="wait">
              {showSplash && !splashError && (
                <Suspense fallback={<LoadingSpinner />}>
                  <SplashScreen 
                    onComplete={handleSplashComplete} 
                    onError={handleSplashError}
                  />
                </Suspense>
              )}
            </AnimatePresence>
          
            {/* Main app content */}
            <AnimatePresence mode="wait">
              {showUI && contentReady && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Navbar scrolled={location.pathname !== '/'} />
              
              <MainContent>
                <AnimatePresence mode="wait">
                      <PageTransition
                        key={location.pathname}
                        initial={{ opacity: 0, filter: "blur(8px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(4px)" }}
                        transition={{ 
                          duration: 0.4,
                          ease: [0.33, 1, 0.68, 1]  // cubic-bezier for smoother motion
                        }}
                      >
                        <Routes location={location}>
                          <Route path="/" element={
                            <Suspense fallback={<LoadingSpinner />}>
                              <Home />
                            </Suspense>
                          } />
                          <Route path="/students" element={
                            <Suspense fallback={<LoadingSpinner />}>
                              <Students />
                            </Suspense>
                          } />
                          <Route path="/student/:id" element={
                            <Suspense fallback={<LoadingSpinner />}>
                              <StudentProfile />
                            </Suspense>
                          } />
                          <Route path="/about" element={
                            <Suspense fallback={<LoadingSpinner />}>
                              <About />
                            </Suspense>
                          } />
                          <Route path="/contact" element={
                            <Suspense fallback={<LoadingSpinner />}>
                              <Contact />
                            </Suspense>
                          } />
                          <Route path="/resources" element={
                  <Suspense fallback={<LoadingSpinner />}>
                              <Resources />
                            </Suspense>
                          } />
                    </Routes>
                      </PageTransition>
                </AnimatePresence>
              </MainContent>
              
              <Footer />
                  <MusicControl />
                  <ScrollToTop />
                </motion.div>
            )}
          </AnimatePresence>
            
            {!showSplash && !showUI && <LoadingSpinner />}
        </AppContainer>
      </SoundContext.Provider>
      </AudioProvider>
    </ThemeProvider>
  );
}

// Error boundary to catch errors in splash screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.props.onError && this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // Render nothing on error, let parent handle the error state
    }
    return this.props.children;
  }
}

export default App;
