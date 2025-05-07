import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Container
const SectionContainer = styled.section`
  padding: 5rem 0;
  background: #0A0A0A;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #E50914, transparent);
    opacity: 0.6;
  }
`;

// Background grid
const BackgroundLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='rgba(229, 9, 20, 0.03)' stroke-width='0.5'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
  z-index: 0;
`;

// Content styling
const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
  
  span {
    color: #E50914;
  }
`;

const Subtitle = styled.p`
  color: #B3B3B3;
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  line-height: 1.6;
  position: relative;
`;

// Feature cards grid
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// Feature card
const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(229, 9, 20, 0.1);
  
  &:hover {
    border: 1px solid rgba(229, 9, 20, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(229, 9, 20, 0.1);
  }
`;

const IconContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(229, 9, 20, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    width: 35px;
    height: 35px;
    color: #E50914;
  }
`;

const FeatureTitle = styled.h3`
  color: #FFFFFF;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1rem;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`;

const FeatureDescription = styled.p`
  color: #B3B3B3;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: center;
`;

// Feature component
const Feature = ({ icon, title, description }) => {
  return (
    <FeatureCard
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <div>
        <IconContainer>
          {icon}
        </IconContainer>
        <FeatureTitle>{title}</FeatureTitle>
      </div>
      <FeatureDescription>{description}</FeatureDescription>
    </FeatureCard>
  );
};

// Main component
const PremiumFeatureSection = () => {
  // Icons
  const directoryIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1 6 6 0 0 1 6-6 6 6 0 0 1 6 6zm-2 0c0-2.21-1.79-4-4-4s-4 1.79-4 4h8zm-6-8a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2z" />
    </svg>
  );
  
  const academicIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM12 18.72L5 15v-3.73L12 15l7-3.73V15l-7 3.72z" />
    </svg>
  );
  
  const interfaceIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
    </svg>
  );
  
  const departmentIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
    </svg>
  );

  return (
    <SectionContainer>
      <BackgroundLayer />
      
      <ContentWrapper>
        <HeaderContainer>
          <SectionTitle>
            Why Choose <span>EEEFlix</span>
          </SectionTitle>
          
          <Subtitle>
            Discover the benefits of our premium platform for Electrical &
            Electronic Engineering students and faculty.
          </Subtitle>
        </HeaderContainer>
        
        <FeaturesGrid>
          <Feature
            icon={directoryIcon}
            title="Student Directory"
            description="Browse through detailed profiles of all 60 students in the EEE department, complete with contact information and achievements."
          />
          
          <Feature
            icon={academicIcon}
            title="Academic Resources"
            description="Access course materials, lecture notes, and academic resources to support your studies in Electrical & Electronic Engineering."
          />
          
          <Feature
            icon={interfaceIcon}
            title="Interactive Interface"
            description="Experience a premium user interface with smooth animations, sound effects, and responsive design across all devices."
          />
          
          <Feature
            icon={departmentIcon}
            title="Department Information"
            description="Stay updated with the latest news, events, and information about the Electrical & Electronic Engineering department."
          />
        </FeaturesGrid>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default PremiumFeatureSection;