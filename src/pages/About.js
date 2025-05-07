import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGraduationCap, FaUsers, FaLightbulb, FaAward, FaAngleRight, FaSearch, FaUserGraduate, FaBell } from 'react-icons/fa';

// Components
import Section from '../components/Section';
import ParallaxBackground from '../components/ParallaxBackground';

const PageContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.backgroundPrimary || 'linear-gradient(to bottom, #0f0f0f, #000000)'};
  min-height: 100vh;
  padding-bottom: 5rem;
  font-family: ${props => props.theme.fonts.main || "'Montserrat', sans-serif"};
  overflow: hidden;
`;

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.4;
`;

const PageHeader = styled.div`
  padding: 10rem 0 8rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
              url('/assets/images/eee-background.jpg') center/cover no-repeat;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #E50914, transparent);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent);
    z-index: 1;
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: 3.2rem;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 2;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background-color: #E50914;
    margin: 0.8rem auto 0;
  }
`;

const PageDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary || '#E5E5E5'};
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  position: relative;
  z-index: 2;
`;

const CTAButton = styled(motion.button)`
  background: #E50914;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
  position: relative;
  z-index: 2;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const AboutText = styled(motion.div)`
  position: relative;
  padding: 3rem;
  background: ${props => props.theme.effects?.glass?.background || 'rgba(20, 20, 20, 0.8)'};
  backdrop-filter: ${props => props.theme.effects?.glass?.backdropFilter || 'blur(15px)'};
  border-radius: 10px;
  border: ${props => props.theme.effects?.glass?.border || '1px solid rgba(70, 70, 70, 0.3)'};
  box-shadow: ${props => props.theme.shadows?.glass || '0 15px 35px rgba(0, 0, 0, 0.5)'};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(229, 9, 20, 0.05), transparent);
    border-radius: 10px;
    z-index: -1;
  }
`;

const AboutTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  position: relative;
  font-weight: 600;
  letter-spacing: 0.5px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 2px;
    background-color: #E50914;
  }
`;

const AboutParagraph = styled.p`
  color: ${props => props.theme.colors.textSecondary || '#E5E5E5'};
  line-height: 1.6;
  margin-bottom: 1.2rem;
  font-size: 1rem;
`;

const FeaturesSection = styled.div`
  background: linear-gradient(to right, rgba(20, 20, 20, 0.8), rgba(15, 15, 15, 0.9));
  padding: 6rem 0;
  margin: 5rem 0;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(229, 9, 20, 0.5), transparent);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(229, 9, 20, 0.5), transparent);
  }
`;

const FeatureTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background-color: #E50914;
    margin: 0.8rem auto 0;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FeatureItem = styled(motion.div)`
  text-align: center;
  padding: 3rem 2rem;
  background: ${props => props.theme.effects?.glass?.background || 'rgba(25, 25, 25, 0.7)'};
  backdrop-filter: ${props => props.theme.effects?.glass?.backdropFilter || 'blur(15px)'};
  border-radius: 10px;
  border: ${props => props.theme.effects?.glass?.border || '1px solid rgba(70, 70, 70, 0.3)'};
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-15px);
    background: rgba(30, 30, 30, 0.8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3.5rem;
  color: #E50914;
  margin-bottom: 2rem;
`;

const FeatureItemTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary || '#E5E5E5'};
  line-height: 1.6;
`;

const StatsSection = styled.div`
  background: linear-gradient(to right, rgba(20, 20, 20, 0.8), rgba(15, 15, 15, 0.9));
  padding: 6rem 0;
  margin: 6rem 0;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(229, 9, 20, 0.5), transparent);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(229, 9, 20, 0.5), transparent);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 2.5rem;
  background: ${props => props.theme.effects?.glass?.background || 'rgba(25, 25, 25, 0.7)'};
  backdrop-filter: ${props => props.theme.effects?.glass?.backdropFilter || 'blur(15px)'};
  border-radius: 10px;
  border: ${props => props.theme.effects?.glass?.border || '1px solid rgba(70, 70, 70, 0.3)'};
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-15px);
    background: rgba(30, 30, 30, 0.8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2);
  }
`;

const StatIcon = styled.div`
  font-size: 3.5rem;
  color: #E50914;
  margin-bottom: 1.8rem;
`;

const StatNumber = styled.div`
  font-size: 2.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  margin-bottom: 0.5rem;
`;

const StatTitle = styled.h4`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary || '#E5E5E5'};
  margin-top: 0.6rem;
  font-weight: 500;
`;

const CTASection = styled.div`
  text-align: center;
  margin: 6rem auto;
  padding: 6rem 2rem;
  background: ${props => props.theme.effects?.glass?.background || 'rgba(20, 20, 20, 0.7)'};
  backdrop-filter: ${props => props.theme.effects?.glass?.backdropFilter || 'blur(15px)'};
  border-radius: 10px;
  border: ${props => props.theme.effects?.glass?.border || '1px solid rgba(70, 70, 70, 0.3)'};
  box-shadow: ${props => props.theme.shadows?.glass || '0 20px 40px rgba(0, 0, 0, 0.5)'};
  max-width: 1200px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(229, 9, 20, 0.05), transparent);
    z-index: -1;
  }
`;

const CTATitle = styled(motion.h2)`
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const CTADescription = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary || '#E5E5E5'};
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const Button = styled(motion.button)`
  background: #E50914;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
`;

// Floating gradient elements similar to Home page
const FloatingGradient = styled(motion.div)`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(229, 9, 20, 0.05) 0%, rgba(229, 9, 20, 0) 70%);
  filter: blur(60px);
  opacity: 0.4;
  pointer-events: none;
`;

// Developer section styles
const DeveloperSection = styled.div`
  padding: 5rem 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const DeveloperTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background-color: #E50914;
    margin: 0.8rem auto 0;
  }
`;

const DeveloperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  padding: 0 2rem;
`;

const DeveloperCard = styled(motion.div)`
  text-align: center;
  padding: 2.5rem 2rem;
  background: ${props => props.theme.effects?.glass?.background || 'rgba(25, 25, 25, 0.7)'};
  backdrop-filter: ${props => props.theme.effects?.glass?.backdropFilter || 'blur(15px)'};
  border-radius: 10px;
  border: ${props => props.theme.effects?.glass?.border || '1px solid rgba(70, 70, 70, 0.3)'};
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(30, 30, 30, 0.8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.1);
  }
`;

const DeveloperAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #E50914;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
`;

const DeveloperName = styled.h3`
  font-size: 1.4rem;
  color: ${props => props.theme.colors.textPrimary || '#FFFFFF'};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const DeveloperRole = styled.p`
  color: #E50914;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const DeveloperBio = styled.p`
  color: ${props => props.theme.colors.textSecondary || '#E5E5E5'};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const About = ({ soundContext }) => {
  // Add fallback for soundContext
  const playSound = useMemo(() => {
    return soundContext?.playSound || (() => {});
  }, [soundContext]);
  
  // Animation controls
  const aboutControls = useAnimation();
  const featuresControls = useAnimation();
  const statsControls = useAnimation();
  const ctaControls = useAnimation();
  const developerControls = useAnimation();
  
  const [aboutRef, aboutInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  const [statsRef, statsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  const [ctaRef, ctaInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  const [developerRef, developerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  // Use effect to trigger animations when sections come into view
  React.useEffect(() => {
    if (aboutInView) aboutControls.start('visible');
    if (featuresInView) featuresControls.start('visible');
    if (statsInView) statsControls.start('visible');
    if (ctaInView) ctaControls.start('visible');
    if (developerInView) developerControls.start('visible');
  }, [aboutInView, featuresInView, statsInView, ctaInView, developerInView, aboutControls, featuresControls, statsControls, ctaControls, developerControls]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };
  
  const handleButtonHover = () => {
    playSound('hover');
  };
  
  const handleButtonClick = () => {
    playSound('click');
  };

  return (
    <PageContainer>
      {/* Background Elements */}
      <BackgroundWrapper>
        <ParallaxBackground />
        {/* Floating gradient elements */}
        <FloatingGradient 
          initial={{ x: '-10%', y: '10%' }}
          animate={{ 
            x: ['0%', '10%', '0%'],
            y: ['10%', '15%', '10%'],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        <FloatingGradient 
          initial={{ x: '80%', y: '30%' }}
          animate={{ 
            x: ['80%', '70%', '80%'],
            y: ['30%', '40%', '30%'],
            scale: [1.2, 0.9, 1.2],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      </BackgroundWrapper>
      
      {/* Header Section */}
      <PageHeader>
        <PageTitle
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          Find Your Rollmate and Connect with the EEE Family
        </PageTitle>
        <PageDescription
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          Join a network of EEE students, from juniors to seniors, making your university life easier and more connected.
        </PageDescription>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <CTAButton 
            onMouseEnter={handleButtonHover}
            onClick={handleButtonClick}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(229, 9, 20, 0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            Start Connecting <FaAngleRight />
          </CTAButton>
        </motion.div>
      </PageHeader>
      
      {/* Developers Section - Premium Digital Style */}
      <Section style={{ padding: 0, margin: 0 }}>
        <div 
          ref={developerRef}
          style={{ 
            background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95), rgba(5, 5, 5, 0.98))',
            padding: '0',
            margin: '0 0 5rem',
            borderBottom: '2px solid rgba(229, 9, 20, 0.5)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Digital circuit lines */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'30\' height=\'30\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 30 0 L 0 0 0 30\' fill=\'none\' stroke=\'rgba(229, 9, 20, 0.05)\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")',
            opacity: 0.3,
            zIndex: 0
          }}></div>
          
          {/* Digital radial gradients */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(229, 9, 20, 0.08) 0%, rgba(229, 9, 20, 0) 60%)',
            filter: 'blur(60px)',
            opacity: 0.6,
            zIndex: 0
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(229, 9, 20, 0.1) 0%, rgba(229, 9, 20, 0) 60%)',
            filter: 'blur(60px)',
            opacity: 0.7,
            zIndex: 0
          }}></div>
          
          <motion.div
            initial="hidden"
            animate={developerControls}
            variants={containerVariants}
            style={{ 
              maxWidth: '1200px', 
              margin: '0 auto', 
              padding: '7rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Tech-inspired section title */}
            <motion.div 
              variants={itemVariants}
              style={{ marginBottom: '3rem', textAlign: 'center', position: 'relative' }}
            >
              <h2 style={{
                 fontSize: '2.4rem',
                 color: '#FFFFFF',
                 fontWeight: '700',
                 letterSpacing: '1px',
                 textTransform: 'uppercase',
                 margin: '0 0 1rem',
                 textShadow: '0 0 10px rgba(229, 9, 20, 0.3)'
               }}>
                  <span style={{ 
                    position: 'relative', 
                    zIndex: 2,
                    background: 'linear-gradient(90deg, #fff, #f5f5f5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>Developer</span>
                  <span style={{
                    position: 'absolute',
                    left: '-2px',
                    top: '2px',
                    zIndex: 1,
                    color: 'rgba(229, 9, 20, 0.7)',
                    WebkitTextFillColor: 'rgba(229, 9, 20, 0.7)'
                  }}>Developer</span>
                </h2>
               
               <div style={{
                 width: '160px',
                 height: '2px',
                 background: 'linear-gradient(to right, transparent, #E50914, transparent)',
                 margin: '0 auto',
                 position: 'relative'
               }}>
               </div>
            </motion.div>
            
            {/* Premium digital card */}
            <motion.div 
              variants={itemVariants}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '850px',
                background: 'rgba(22, 22, 25, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '4rem 3rem',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(229, 9, 20, 0.15)',
                border: '1px solid rgba(120, 120, 120, 0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Digital corner accents */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '60px',
                height: '60px',
                borderTop: '2px solid rgba(229, 9, 20, 0.7)',
                borderLeft: '2px solid rgba(229, 9, 20, 0.7)',
                borderTopLeftRadius: '12px',
              }}></div>
              
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '60px',
                height: '60px',
                borderTop: '2px solid rgba(229, 9, 20, 0.7)',
                borderRight: '2px solid rgba(229, 9, 20, 0.7)',
                borderTopRightRadius: '12px',
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '60px',
                height: '60px',
                borderBottom: '2px solid rgba(229, 9, 20, 0.7)',
                borderLeft: '2px solid rgba(229, 9, 20, 0.7)',
                borderBottomLeftRadius: '12px',
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '60px',
                height: '60px',
                borderBottom: '2px solid rgba(229, 9, 20, 0.7)',
                borderRight: '2px solid rgba(229, 9, 20, 0.7)',
                borderBottomRightRadius: '12px',
              }}></div>
              
              {/* Futuristic avatar frame */}
              <div style={{
                position: 'relative',
                marginBottom: '3rem',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 180deg at 50% 50%, rgba(229, 9, 20, 0.8) 0deg, rgba(229, 9, 20, 0.1) 90deg, rgba(229, 9, 20, 0) 180deg, rgba(229, 9, 20, 0.1) 270deg, rgba(229, 9, 20, 0.8) 360deg)',
                  zIndex: 1,
                  animation: 'rotate 8s linear infinite',
                }}></div>
                
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '6px',
                  background: 'linear-gradient(135deg, rgba(40, 40, 45, 0.9), rgba(20, 20, 25, 0.9))',
                  borderRadius: '50%',
                }}>
                  <img 
                    src="/assets/images/avatar/avatar-30.jpg" 
                    alt="Shafin Khan"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid rgba(30, 30, 35, 0.9)',
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(229, 9, 20, 0.3)',
                    }}
                  />
                </div>
              </div>
              
              {/* Modern typography */}
              <h3 style={{
                fontSize: '2.4rem',
                background: 'linear-gradient(90deg, #fff, #d0d0d0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '700',
                letterSpacing: '1px',
                margin: '0 0 0.8rem',
                textAlign: 'center',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
              }}>
                Shafin Khan
              </h3>
              
              <div style={{
                color: '#E50914',
                fontSize: '1.2rem',
                fontWeight: '500',
                margin: '0 0 2rem',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '35px',
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(229, 9, 20, 0.8))'
                }}></span>
                LEAD DEVELOPER
                <span style={{
                  display: 'inline-block',
                  width: '35px',
                  height: '1px',
                  background: 'linear-gradient(to left, transparent, rgba(229, 9, 20, 0.8))'
                }}></span>
              </div>
              
              {/* Digital-style text container */}
              <div style={{
                background: 'rgba(15, 15, 18, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '2rem 2.5rem',
                maxWidth: '700px',
                border: '1px solid rgba(90, 90, 95, 0.1)',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.2)',
              }}>
                <p style={{
                  color: 'rgba(220, 220, 225, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '1.15rem',
                  textAlign: 'center',
                  margin: '0',
                  fontWeight: '300',
                  letterSpacing: '0.3px'
                }}>
                  Hi, I'm Shafin Khan — a passionate graphics designer and the creator of EEEFlix. Driven by curiosity and a desire to support junior students, I developed this platform to help EEE students easily connect with their rollmates and seniors, fostering a collaborative and inclusive academic community. I believe in using design as a tool to solve real-world problems, and I'm committed to making the academic journey smoother for those who come after me.
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          <style jsx global>{`
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Section>
      
      {/* Story Section */}
      <Section>
        <AboutContent>
          <AboutText
            ref={aboutRef}
            initial="hidden"
            animate={aboutControls}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <AboutTitle>The Story Behind EEEFlix</AboutTitle>
              <AboutParagraph>
                It all started with a simple question: "Who are the people around me?"
                As a junior in the EEE department, I often found myself wondering who my rollmates were, how to reach out to seniors for help, or how to simply connect with someone in my class. The answers weren't always easy to find.
              </AboutParagraph>
              <AboutParagraph>
                That curiosity sparked an idea — what if there was a platform where students could find each other effortlessly, without logins, without confusion? A place where names and roll numbers meant more than just a list — where they became the start of real conversations, shared struggles, and collaborative learning.
              </AboutParagraph>
              <AboutParagraph>
                And so, EEEFlix was born.
              </AboutParagraph>
              <AboutParagraph>
                Created with the intention to support, connect, and uplift the EEE student community, EEEFlix makes it easy to discover your rollmates, seek academic guidance, and build bonds that go beyond the classroom. Whether you're looking for a study partner, a senior's advice, or just a familiar name to say hello to — this platform is for you.
              </AboutParagraph>
              <AboutParagraph>
                Because in the end, learning becomes richer when we grow together.
              </AboutParagraph>
            </motion.div>
          </AboutText>
        </AboutContent>
      </Section>
      
      {/* Features Section */}
      <FeaturesSection ref={featuresRef}>
        <motion.div
          initial="hidden"
          animate={featuresControls}
          variants={containerVariants}
          style={{ width: '100%' }}
        >
          <motion.div variants={itemVariants}>
            <FeatureTitle>How EEEFlix Helps</FeatureTitle>
          </motion.div>
          <FeaturesGrid>
            <FeatureItem
              variants={itemVariants}
              whileHover={{ 
                y: -15, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <FeatureIcon>
                <FaSearch />
              </FeatureIcon>
              <FeatureItemTitle>Find Your Rollmate</FeatureItemTitle>
              <FeatureDescription>
                Search through batches and roll numbers to easily find students you can connect with.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem
              variants={itemVariants}
              whileHover={{ 
                y: -15, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <FeatureIcon>
                <FaUserGraduate />
              </FeatureIcon>
              <FeatureItemTitle>Connect with Seniors</FeatureItemTitle>
              <FeatureDescription>
                Get guidance, mentorship, and help with projects from seniors.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem
              variants={itemVariants}
              whileHover={{ 
                y: -15, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <FeatureIcon>
                <FaBell />
              </FeatureIcon>
              <FeatureItemTitle>Event Notifications</FeatureItemTitle>
              <FeatureDescription>
                Stay informed about upcoming academic and social events.
              </FeatureDescription>
            </FeatureItem>
          </FeaturesGrid>
        </motion.div>
      </FeaturesSection>
      
      {/* Stats Section */}
      <StatsSection ref={statsRef}>
        <motion.div
          initial="hidden"
          animate={statsControls}
          variants={containerVariants}
        >
          <StatsGrid>
            <StatItem
              variants={itemVariants}
              whileHover={{ 
                y: -15, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <StatIcon>
                <FaGraduationCap />
              </StatIcon>
              <StatNumber>60</StatNumber>
              <StatTitle>Students Per Batch</StatTitle>
            </StatItem>
            
            <StatItem
              variants={itemVariants}
              whileHover={{ 
                y: -15, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <StatIcon>
                <FaUsers />
              </StatIcon>
              <StatNumber>30+</StatNumber>
              <StatTitle>Faculty Members</StatTitle>
            </StatItem>
            
            <StatItem
              variants={itemVariants}
              whileHover={{ 
                y: -15, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <StatIcon>
                <FaLightbulb />
              </StatIcon>
              <StatNumber>100+</StatNumber>
              <StatTitle>Research Projects</StatTitle>
            </StatItem>
            
            <StatItem
              variants={itemVariants}
              whileHover={{ 
                y: -15, 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <StatIcon>
                <FaAward />
              </StatIcon>
              <StatNumber>50+</StatNumber>
              <StatTitle>Publications Per Year</StatTitle>
            </StatItem>
          </StatsGrid>
        </motion.div>
      </StatsSection>
      
      {/* CTA Section */}
      <Section>
        <CTASection ref={ctaRef}>
          <motion.div
            initial="hidden"
            animate={ctaControls}
            variants={containerVariants}
          >
            <CTATitle variants={itemVariants}>
              Don't get lost in your first year. Join EEEFlix today!
            </CTATitle>
            <CTADescription variants={itemVariants}>
              No more searching for the right connections. With EEEFlix, you'll find your rollmates and start your journey together. Our platform connects students across all years of study, making your university experience richer and more collaborative.
            </CTADescription>
            <motion.div variants={itemVariants}>
              <Button 
                onMouseEnter={handleButtonHover}
                onClick={handleButtonClick}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(229, 9, 20, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                Join Now <FaAngleRight />
              </Button>
            </motion.div>
          </motion.div>
        </CTASection>
      </Section>
    </PageContainer>
  );
};

export default About;
