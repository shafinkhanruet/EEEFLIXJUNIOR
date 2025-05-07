import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useTransform, useScroll, AnimatePresence } from 'framer-motion';
import { FaPlay, FaInfoCircle, FaArrowDown, FaMusic } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { SoundContext } from '../contexts/SoundContext';
import { AudioContext } from '../contexts/AudioContext';

// Import the logo directly
import circuitsLogo from '../assets/images/logos/circuits-of-minds-logo.png';

const HeroContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 1;
  padding-top: 60px; /* Space for the navbar */
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 80vh;
    align-items: flex-start;
    padding-top: 80px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-height: 90vh;
    padding-top: 70px;
  }
`;

const AnimatedGradientOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(229, 9, 20, 0.1) 50%,
    rgba(0, 0, 0, 0.85) 100%
  );
  opacity: 0.4;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
`;

const HeroBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://i.postimg.cc/3Jtrm7bb/477575715-967699118653522-4375073918279317182-n.jpg');
  background-size: cover;
  background-position: center 30%;
  filter: blur(1.5px) brightness(0.9);
  z-index: -1;
  transform-origin: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    background-position: center 25%;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.85) 0%,
      rgba(0, 0, 0, 0.7) 20%,
      rgba(0, 0, 0, 0.6) 60%,
      rgba(0, 0, 0, 0.5) 100%
    ),
    linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 20%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }
`;

const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
`;

const Particle = styled(motion.div)`
  position: absolute;
  background: ${props => props.color || 'rgba(229, 9, 20, 0.3)'};
  width: ${props => props.size || '5px'};
  height: ${props => props.size || '5px'};
  border-radius: 50%;
  box-shadow: 0 0 10px ${props => props.color || 'rgba(229, 9, 20, 0.5)'};
  filter: blur(1px);
`;

const HeroContent = styled(motion.div)`
  max-width: 1100px;
  width: 100%;
  padding: 0 3rem;
  margin-left: 3rem;
  z-index: 2;
  will-change: transform;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 2rem;
    margin-left: 1.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 1.25rem;
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const HeroTextContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 550px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 0.75rem;
    max-width: 100%;
  }
`;

const CircuitLogo = styled(motion.img)`
  height: 80px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
  transform-origin: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 60px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 50px;
  }
`;

const LogoGlow = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(229, 9, 20, 0.6) 0%, rgba(229, 9, 20, 0) 70%);
  filter: blur(15px);
  opacity: 0;
  z-index: -1;
`;

const BrandTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #FFFFFF;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
  transform-origin: left;
  position: relative;
  
  span {
    color: #E50914;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #E50914;
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.5s ease;
    }
  }
  
  &:hover span:after {
    transform: scaleX(1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.8rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.2rem;
    margin-bottom: 0.25rem;
  }
`;

const TopTen = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  transform-origin: left;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
`;

const TopTenBadge = styled(motion.div)`
  background-color: #E50914;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  transform-origin: center;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.5);
`;

const TopTenText = styled(motion.span)`
  color: #fff;
  font-size: 0.9rem;
  transform-origin: left;
`;

const HeroDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0.5rem 0;
  max-width: 550px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  transform-origin: left;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0.25rem 0;
  }
`;

const MaturityContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0.5rem 0 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: 0.25rem 0 0.75rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const MaturityRating = styled.div`
  display: inline-block;
  background-color: rgba(51, 51, 51, 0.8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    padding: 0.15rem 0.4rem;
  }
`;

const Tags = styled.span`
  color: #ddd;
  font-size: 0.9rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

const HighlightedSection = styled(motion.span)`
  background: ${props => props.theme.colors.gradientAccent};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  display: inline-block;
  margin-right: 0.5rem;
  box-shadow: ${props => props.theme.shadows.accentGlow};
  transform-origin: left;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.theme.colors.gradientShimmer};
    transform: rotate(45deg);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-150%) rotate(45deg); }
    100% { transform: translateX(150%) rotate(45deg); }
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  transform-origin: left;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.75rem;
    width: 100%;
  }
`;

const NetflixPlayButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  color: black;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 38px;
  transform-origin: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }
  
  svg {
    font-size: 1.3rem;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: 0.5s;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.4rem 1.2rem;
    font-size: 1rem;
    height: 36px;
    flex: 1;
    min-width: 120px;
    
    svg {
      font-size: 1.1rem;
    }
  }
`;

const NetflixMoreInfoButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 38px;
  transform-origin: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: rgba(109, 109, 110, 0.5);
  }
  
  svg {
    font-size: 1.3rem;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.4rem 1.2rem;
    font-size: 1rem;
    height: 36px;
    flex: 1;
    min-width: 120px;
    
    svg {
      font-size: 1.1rem;
    }
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 5;
  
  svg {
    color: white;
    font-size: 1.5rem;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
  }
  
  span {
    color: white;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 500;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 20px;
  }
`;

// Add new styled component for music notification
const MusicNotification = styled(motion.div)`
  position: absolute;
  top: 90px;
  right: 30px;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  border: 1px solid rgba(229, 9, 20, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  z-index: 10;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: 80px;
    right: 20px;
    left: 20px;
    max-width: none;
  }
`;

const MusicIcon = styled(FaMusic)`
  color: #E50914;
  flex-shrink: 0;
`;

const NotificationText = styled.p`
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const NotificationButton = styled(motion.button)`
  background: #E50914;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  margin-left: auto;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  
  &:hover {
    background: #c20710;
  }
`;

// Generate random particles
const generateParticles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2 + 'px',
    color: i % 5 === 0 ? 'rgba(229, 9, 20, 0.4)' : 'rgba(255, 255, 255, 0.2)',
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));
};

const Hero = () => {
  const { scrollY } = useScroll();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [isMounted, setIsMounted] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);
  const [particles, setParticles] = useState([]);
  
  // Get audio context
  const { toggleMusic, isMusicPlaying } = useContext(AudioContext);
  
  // Add state for music notification
  const [showMusicNotification, setShowMusicNotification] = useState(true);
  
  useEffect(() => {
    setIsMounted(true);
    setParticles(generateParticles(30));
  }, []);
  
  // Enhanced parallax effects
  const titleY = useTransform(scrollY, [0, 500], [0, -50]);
  const backgroundScale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const contentScale = useTransform(scrollY, [0, 200], [1, 0.98]);
  
  useEffect(() => {
    if (!isMounted) return;
    
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView, isMounted]);
  
  // Scroll to content function
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      scale: 1.05,
      filter: "drop-shadow(0 0 15px rgba(229, 9, 20, 0.7))",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(229, 9, 20, 0.6)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const scrollIndicatorVariants = {
    initial: { y: 0, opacity: 0.7 },
    animate: { 
      y: [0, 10, 0],
      opacity: [0.7, 1, 0.7],
      transition: { 
        y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };
  
  const gradientVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0.2, 0.4, 0.2],
      rotate: [0, 5, 0],
      scale: [1, 1.1, 1],
      transition: { 
        duration: 8, 
        repeat: Infinity,
        ease: "easeInOut" 
      }
    }
  };
  
  const handleLogoError = () => {
    setLogoLoaded(false);
  };
  
  const title = "EEEFLIX";
  
  // Add useEffect to automatically hide notification after delay
  useEffect(() => {
    if (showMusicNotification) {
      const timer = setTimeout(() => {
        setShowMusicNotification(false);
      }, 10000); // Hide after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showMusicNotification]);
  
  return (
    <HeroContainer ref={ref}>
      {/* Music notification */}
      <AnimatePresence>
        {showMusicNotification && (
          <MusicNotification
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <MusicIcon />
            <NotificationText>
              Experience "Circuits of Minds" with our background music.
            </NotificationText>
            <NotificationButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toggleMusic();
                setShowMusicNotification(false);
              }}
            >
              {isMusicPlaying ? 'Pause' : 'Play'}
            </NotificationButton>
          </MusicNotification>
        )}
      </AnimatePresence>
      
      <HeroBackground 
        style={{ 
          scale: backgroundScale,
          y: backgroundY,
          transition: { duration: 0.5 }
        }}
      />
      
      <AnimatedGradientOverlay
        variants={gradientVariants}
        initial="initial"
        animate="animate"
      />
      
      <FloatingParticles>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            size={particle.size}
            color={particle.color}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              opacity: 0
            }}
            animate={{
              x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`],
              y: [`${particle.y}%`, `${particle.y + (Math.random() * 10 - 5)}%`],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </FloatingParticles>
      
      <HeroContent
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        style={{
          opacity: contentOpacity,
          scale: contentScale,
          y: titleY
        }}
      >
        <HeroTextContent>
          {logoLoaded ? (
            <motion.div style={{ position: 'relative' }}>
              <LogoGlow 
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <CircuitLogo 
                src={circuitsLogo}
                alt="Circuit of Minds Logo"
                variants={logoVariants}
                onError={handleLogoError}
                whileHover="hover"
              />
            </motion.div>
          ) : (
            <BrandTitle>
              {Array.from(title).map((letter, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {letter}
                </motion.span>
              ))}
              {" "}
              <motion.span 
                style={{ fontSize: "0.6em", fontWeight: "400" }}
                variants={textVariants}
              >
                A Section
              </motion.span>
            </BrandTitle>
          )}
          
          <TopTen variants={textVariants}>
            <TopTenBadge
              animate={{
                boxShadow: ["0 0 15px rgba(229, 9, 20, 0.5)", "0 0 25px rgba(229, 9, 20, 0.8)", "0 0 15px rgba(229, 9, 20, 0.5)"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              A
            </TopTenBadge>
            <TopTenText>Section EEE Students Platform</TopTenText>
          </TopTen>
          
          <HeroDescription variants={textVariants}>
            <HighlightedSection 
              variants={highlightVariants}
              whileHover="hover"
            >
              Premium Experience
            </HighlightedSection> 
            <motion.span variants={textVariants}>
              Welcome to the exclusive platform for Electrical and Electronics Engineering 
              students at RUET. Discover exceptional profiles, premium resources, and connect 
              with the brilliant minds of A Section.
            </motion.span>
          </HeroDescription>
          
          <MaturityContainer variants={textVariants}>
            <MaturityRating variants={textVariants}>A-SEC</MaturityRating>
            <Tags variants={textVariants}>Innovation • Technology • A Section • 2023</Tags>
          </MaturityContainer>
          
          <ButtonContainer variants={textVariants}>
            <NetflixPlayButton
              onClick={() => {
                window.location.href = '/students';
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaPlay /> Play
            </NetflixPlayButton>
            
            <NetflixMoreInfoButton
              onClick={() => {
                window.location.href = '/about';
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaInfoCircle /> More Info
            </NetflixMoreInfoButton>
          </ButtonContainer>
        </HeroTextContent>
      </HeroContent>
      
      <ScrollIndicator
        onClick={scrollToContent}
        variants={scrollIndicatorVariants}
        initial="initial"
        animate="animate"
      >
        <FaArrowDown />
        <span>Scroll</span>
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default Hero;
