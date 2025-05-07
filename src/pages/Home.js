import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useScroll, useTransform, useInView } from 'framer-motion';
import { SoundContext } from '../contexts/SoundContext';

// Components
import Section from '../components/Section';
import Button from '../components/Button';
import StudentCard from '../components/StudentCard';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ParallaxBackground from '../components/ParallaxBackground';
import PremiumFeatureSection from '../components/PremiumFeatureSection';

// Mock data
import { featuredStudents } from '../data/students';

// Styled Components
const PageContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.4; /* Reduced opacity for better performance */
`;

const SectionWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.gradientOverlay};
  z-index: -1;
  pointer-events: none;
`;

const ScrollProgress = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #E50914;
  transform-origin: 0%;
  z-index: 1000;
`;

const ViewAllButton = styled(motion.div)`
  margin-top: 3rem;
  text-align: center;
`;

// Add these styled components for enhanced section headings
const EnhancedSectionTitle = styled.h2`
  color: #FFFFFF;
  font-size: 3.2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1.2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  display: inline-block;
  letter-spacing: 0.5px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: #E50914;
    box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2.2rem;
  }
`;

const EnhancedSectionSubtitle = styled.p`
  color: #B3B3B3;
  font-size: 1.3rem;
  text-align: center;
  max-width: 700px;
  margin: 2.5rem auto 3rem;
  line-height: 1.7;
  letter-spacing: 0.3px;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 2rem auto 2.5rem;
    padding: 0 1.5rem;
  }
`;

const ParallaxSection = styled.div`
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const ParallaxLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  will-change: transform;
`;

const FloatingGradient = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(229, 9, 20, 0.15) 0%, 
    rgba(229, 9, 20, 0) 70%
  );
  filter: blur(30px);
  opacity: 0.5;
  pointer-events: none;
`;

// Add these styled components for the Features section
const EnhancedFeaturesWrapper = styled.div`
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #0F0F0F;
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(229, 9, 20, 0) 0%, 
      rgba(229, 9, 20, 0.6) 50%, 
      rgba(229, 9, 20, 0) 100%
    );
  }
`;

// Enhanced Styling for Featured Students section
const PremiumFeaturedSection = styled.div`
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #0F0F0F;
    z-index: -1;
  }
`;

const SectionHeading = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const PremiumTitle = styled.h2`
  color: #FFFFFF;
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: #E50914;
    box-shadow: 0 0 15px rgba(229, 9, 20, 0.5);
    border-radius: 2px;
  }
`;

const PremiumSubtitle = styled.p`
  color: #B3B3B3;
  font-size: 1.2rem;
  text-align: center;
  max-width: 800px;
  margin: 2rem auto 3rem;
  line-height: 1.7;
  letter-spacing: 0.5px;
`;

const FeaturedStudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  margin: 2rem auto;
  padding: 0 4rem;
  max-width: 1400px;
  justify-items: center;
  
  @media (max-width: 1400px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    & > div {
      flex: 0 0 calc(25% - 2rem);
      margin: 1rem;
      min-width: 220px;
    }
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    & > div {
      flex: 0 0 calc(50% - 2rem);
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 2rem;
    & > div {
      flex: 0 0 calc(50% - 2rem);
    }
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    padding: 0 1.5rem;
    & > div {
      flex: 0 0 100%;
    }
  }
`;

const ViewAllButtonWrapper = styled(motion.div)`
  margin-top: 4rem;
  text-align: center;
  
  button, a {
    padding: 1rem 2.2rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }
  }
`;

// Add new styled components for the CR section
const CRSectionWrapper = styled(motion.div)`
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
  text-align: center;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(15, 15, 15, 0.9), rgba(20, 20, 20, 0.8));
    z-index: -1;
  }
`;

const CRTitle = styled(motion.h2)`
  color: #FFFFFF;
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  display: inline-block;
  letter-spacing: 0.5px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #E50914;
    box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
    border-radius: 2px;
  }
`;

const CRSubtitle = styled(motion.p)`
  color: #B3B3B3;
  font-size: 1.1rem;
  text-align: center;
  max-width: 700px;
  margin: 1.5rem auto 2rem;
  line-height: 1.5;
  font-weight: 300;
`;

const CRCardsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }
`;

const CRCardWrapper = styled(motion.div)`
  position: relative;
  transition: transform 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 5px;
    background: radial-gradient(ellipse at center, rgba(229, 9, 20, 0.5) 0%, rgba(229, 9, 20, 0) 70%);
    filter: blur(5px);
    opacity: 0.6;
  }
`;

const CRLabelBadge = styled(motion.div)`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #E50914, #B20710);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
  z-index: 10;
  white-space: nowrap;
`;

const Home = () => {
  const { playSound } = useContext(SoundContext);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Add a state to handle fetching students
  const [students, setStudents] = useState([]);
  
  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Animation controls
  const studentControls = useAnimation();
  const featuresControls = useAnimation();
  
  // Multiple refs for different sections
  const studentsRef = useRef(null);
  const featuresRef = useRef(null);
  const studentsInView = useInView(studentsRef, {
    threshold: 0.1,
    triggerOnce: true
  });
  
  const featuresInView = useInView(featuresRef, {
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Add state for class representatives
  const [classReps, setClassReps] = useState([]);
  
  // Handle intro video completion
  const handleIntroComplete = () => {
    setIsIntroComplete(true);
  };
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    // Ensure featuredStudents is an array and set it to state
    if (featuredStudents && Array.isArray(featuredStudents)) {
      setStudents(featuredStudents);
    } else {
      // If featuredStudents is not available or not an array, use an empty array
      console.error('featuredStudents is not an array or is undefined');
      setStudents([]);
    }
  }, []);
  
  useEffect(() => {
    // Filter out the class representatives from the students data
    if (featuredStudents && Array.isArray(featuredStudents)) {
      const crs = featuredStudents.filter(student => student.role === 'CR');
      console.log('Class representatives:', crs);
      setClassReps(crs);
    }
  }, []);
  
  // Trigger animations when sections come into view
  useEffect(() => {
    // Only start animations if component is mounted
    if (!isMounted) return;
    
    if (studentsInView) {
      studentControls.start('visible');
    }
    if (featuresInView) {
      featuresControls.start('visible');
    }
  }, [studentsInView, featuresInView, studentControls, featuresControls, isMounted]);
  
  // Improved variants for animations
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
    if (playSound) playSound('hover');
  };
  
  const handleButtonClick = () => {
    if (playSound) playSound('click');
  };

  return (
    <PageContainer>
      {/* Scroll Progress Bar */}
      <ScrollProgress style={{ scaleX, willChange: 'transform' }} />
      
      {/* Background Effect */}
      <BackgroundWrapper>
        <ParallaxBackground />
        {/* Floating gradient elements */}
        <FloatingGradient 
          style={{ 
            x: useTransform(scrollYProgress, [0, 1], ['-10%', '30%']),
            y: useTransform(scrollYProgress, [0, 1], ['10%', '60%']),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1])
          }} 
        />
        <FloatingGradient 
          style={{ 
            x: useTransform(scrollYProgress, [0, 1], ['80%', '50%']),
            y: useTransform(scrollYProgress, [0, 1], ['30%', '70%']),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 0.8, 1.4])
          }} 
        />
      </BackgroundWrapper>
      
      {/* Hero Section */}
      <Hero />
      
      {/* Class Representatives Section */}
      <SectionWrapper
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <CRSectionWrapper>
          <motion.div variants={itemVariants}>
            <CRTitle>Class Representatives</CRTitle>
            <CRSubtitle>
              Meet the dedicated student leaders of EEE '23 Section A who represent and support our class.
            </CRSubtitle>
          </motion.div>
          
          <CRCardsContainer variants={containerVariants}>
            {classReps && classReps.length > 0 ? 
              classReps.map((cr, index) => (
                <CRCardWrapper 
                  key={cr?.id || `cr-${index}`} 
                  variants={itemVariants}
                  whileHover={{ y: -15, transition: { duration: 0.3 } }}
                >
                  <CRLabelBadge
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                  >
                    Class Representative
                  </CRLabelBadge>
                  <StudentCard student={cr} />
                </CRCardWrapper>
              )) : (
                <motion.div variants={itemVariants}>
                  <CRCardWrapper whileHover={{ y: -15, transition: { duration: 0.3 } }}>
                    <CRLabelBadge>Class Representative</CRLabelBadge>
                    <StudentCard 
                      student={{
                        id: "2301019",
                        name: "ABDUL BAKEU BORSHON",
                        role: "CR",
                        image: "/assets/images/avatar/avatar-19.jpg"
                      }} 
                    />
                  </CRCardWrapper>
                </motion.div>
              )}
              
              {(!classReps || classReps.length < 2) && (
                <motion.div variants={itemVariants}>
                  <CRCardWrapper whileHover={{ y: -15, transition: { duration: 0.3 } }}>
                    <CRLabelBadge>Class Representative</CRLabelBadge>
                    <StudentCard 
                      student={{
                        id: "2301054",
                        name: "TAHMIDUL HAQUE SAIF",
                        role: "CR",
                        image: "/assets/images/avatar/avatar-54.jpg"
                      }} 
                    />
                  </CRCardWrapper>
                </motion.div>
              )}
          </CRCardsContainer>
        </CRSectionWrapper>
      </SectionWrapper>
      
      {/* Replace the Features Section with our new PremiumFeatureSection */}
      <PremiumFeatureSection />
      
      {/* Featured Students Section */}
      <SectionWrapper
        ref={studentsRef}
        initial="hidden"
        animate={studentControls}
        variants={containerVariants}
      >
        <PremiumFeaturedSection>
          <SectionHeading variants={itemVariants}>
            <PremiumTitle>Featured Students</PremiumTitle>
            <PremiumSubtitle>
              Meet our exceptional students who are making a difference in the
              field of Electrical & Electronic Engineering with groundbreaking 
              research and innovative solutions.
            </PremiumSubtitle>
          </SectionHeading>
          
          <FeaturedStudentsGrid>
            {students && students.length > 0 ? 
              students.slice(0, 4).map((student, index) => (
                <motion.div 
                  key={student?.id || `student-${index}`} 
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <StudentCard student={student} />
                </motion.div>
              )) : (
                <p style={{ color: '#ffffff', textAlign: 'center', width: '100%' }}>
                  Loading student profiles...
                </p>
              )
            }
          </FeaturedStudentsGrid>
          
          <ViewAllButtonWrapper variants={itemVariants}>
            <Button 
              to="/students"
              variant="premium"
              onMouseEnter={handleButtonHover}
              onClick={handleButtonClick}
            >
              View All Students
            </Button>
          </ViewAllButtonWrapper>
        </PremiumFeaturedSection>
      </SectionWrapper>
      
      <GradientOverlay />
    </PageContainer>
  );
};

export default Home;
