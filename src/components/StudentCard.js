import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCrown, FaCode, FaStar, FaPlus } from 'react-icons/fa';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const CardContainer = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(17, 17, 17, 0.9) 0%,
    rgba(25, 25, 25, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 0 80px rgba(229, 9, 20, 0.06);
  cursor: pointer;
  padding: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  isolation: isolate;
  will-change: transform, box-shadow;
  transform-style: preserve-3d;
  perspective: 1000px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 250px;
    height: 370px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 220px;
    height: 340px;
    border-radius: 18px;
    
    /* Mobile optimizations for better performance */
    box-shadow: 
      0 10px 20px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.smallMobile}) {
    width: 100%;
    min-width: 160px;
    max-width: 200px;
    height: 320px;
  }

  &:before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(
      45deg,
      rgba(229, 9, 20, 0.6),
      rgba(255, 255, 255, 0.1),
      rgba(229, 9, 20, 0.6)
    );
    border-radius: 24px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    padding: 1px;
    pointer-events: none;
    transition: all 0.4s ease;
    animation: borderGlow 3s infinite;
    z-index: 1;
  }

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(229, 9, 20, 0.2),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2;
    mix-blend-mode: soft-light;
  }

  .bottom-shadow {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%) translateY(var(--shadow-y, 0));
    width: 90%;
    height: 40px;
    background: radial-gradient(
      ellipse at var(--mouse-x, 50%) 0%,
      rgba(229, 9, 20, 0.5),
      rgba(0, 0, 0, 0) 70%
    );
    opacity: 0;
    transition: all 0.3s ease;
    filter: blur(8px);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02) rotateY(5deg);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(229, 9, 20, 0.4),
      0 0 0 1px rgba(229, 9, 20, 0.2),
      inset 0 0 80px rgba(229, 9, 20, 0.3);

    .bottom-shadow {
      opacity: 1;
      --shadow-y: ${props => props.isBottomHovered ? '-10px' : '0'};
      background: radial-gradient(
        ellipse at var(--mouse-x, 50%) 0%,
        ${props => props.isBottomHovered ? 'rgba(229, 9, 20, 0.8)' : 'rgba(229, 9, 20, 0.5)'},
        rgba(0, 0, 0, 0) 70%
      );
      width: ${props => props.isBottomHovered ? '95%' : '90%'};
    }

    &:after {
      opacity: 1;
    }

    &:before {
      background: linear-gradient(
        45deg,
        rgba(229, 9, 20, 0.8),
        rgba(255, 255, 255, 0.2),
        rgba(229, 9, 20, 0.8)
      );
      filter: brightness(1.3) contrast(1.3);
    }
  }

  @keyframes borderGlow {
    0%, 100% {
      filter: brightness(1) blur(0px);
    }
    50% {
      filter: brightness(1.3) blur(2px);
    }
  }

  /* Add specific mobile hover effects */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    &:hover, &:active {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 
        0 15px 30px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(229, 9, 20, 0.3);
    }
  }
  
  /* Add 3D card tilt effect */
  &.tilt {
    transform-style: preserve-3d;
    transform: perspective(1000px);
  }
  
  &.tilt .card-content {
    transform-style: preserve-3d;
  }
`;

// Add new 3D content wrapper
const CardContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Enhance ImageContainer with more 3D effects
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 70%;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(17, 17, 17, 0.4) 70%,
      rgba(17, 17, 17, 0.9) 100%
    );
    z-index: 2;
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(229, 9, 20, 0.3) 0%,
      transparent 100%
    );
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s;
  }

  ${CardContainer}:hover &:before {
    opacity: 1;
  }
  
  /* Add 3D effect */
  transform: translateZ(20px);
`;

// Add the ProfileImage component
const ProfileImage = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: contrast(1.1) brightness(0.9) saturate(1.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  will-change: transform, filter, opacity;
  
  ${CardContainer}:hover & {
    transform: scale(1.05) translateZ(0);
    filter: contrast(1.2) brightness(1) saturate(1.3);
    animation: subtleShift 4s ease-in-out infinite alternate;
  }
  
  @keyframes subtleShift {
    0% {
      background-position: center;
    }
    100% {
      background-position: center 52%;
    }
  }
`;

// Enhance PremiumBadge with more interactive effects
const PremiumBadge = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 3;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 12px rgba(255, 215, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2),
    inset 0 0 8px rgba(255, 165, 0, 0.4);
  animation: float 3s ease-in-out infinite;
  transform: translateZ(30px);
  
  svg {
    color: white;
    font-size: 1.1rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }

  &:before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.5), rgba(255, 165, 0, 0.5));
    border-radius: 50%;
    z-index: -1;
    animation: pulse 2s infinite;
  }

  ${CardContainer}:hover & {
    svg {
      transform: rotate(15deg) scale(1.1);
      filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateZ(30px);
    }
    50% {
      transform: translateY(-5px) translateZ(30px);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.4);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 30px;
    height: 30px;
    top: 0.8rem;
    left: 0.8rem;
    
    svg {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.smallMobile}) {
    width: 26px;
    height: 26px;
    top: 0.7rem;
    left: 0.7rem;
    
    svg {
      font-size: 0.8rem;
    }
  }
`;

// Enhance ContentContainer with 3D effects
const ContentContainer = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.8rem;
  z-index: 3;
  background: none;
  transform: translateY(0) translateZ(15px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      0deg,
      rgba(17, 17, 17, 0.95) 0%,
      rgba(17, 17, 17, 0.8) 50%,
      transparent 100%
    );
    z-index: -1;
    opacity: 1;
    transition: opacity 0.4s ease;
  }

  ${CardContainer}:hover & {
    transform: translateY(-8px) translateZ(25px);
    
    &:before {
      opacity: 0.9;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1.5rem 1.2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.smallMobile}) {
    padding: 1.2rem 1rem;
  }
`;

// Update UserName with 3D effect
const UserName = styled(motion.h3)`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5),
               0 2px 8px rgba(0, 0, 0, 0.3),
               0 0 20px rgba(229, 9, 20, 0.3);
  letter-spacing: 0.5px;
  line-height: 1.2;
  transform: translateY(0) translateZ(10px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(229, 9, 20, 0.8),
      rgba(229, 9, 20, 0.4)
    );
    transition: width 0.3s ease;
  }
  
  ${CardContainer}:hover & {
    transform: translateY(-4px) translateZ(20px);
    color: rgba(255, 255, 255, 1);
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6),
                 0 2px 12px rgba(0, 0, 0, 0.4),
                 0 0 30px rgba(229, 9, 20, 0.5);
    
    &:after {
      width: 100%;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.smallMobile}) {
    font-size: 1rem;
  }
`;

// Update UserId with 3D effect
const UserId = styled(motion.span)`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5),
               0 1px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  font-weight: 500;
  opacity: 0.9;
  transform: translateY(0) translateZ(5px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.85),
    rgba(229, 9, 20, 0.4)
  );
  -webkit-background-clip: text;
  background-clip: text;
  
  ${CardContainer}:hover & {
    transform: translateY(-4px) translateZ(15px);
    opacity: 1;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1),
      rgba(229, 9, 20, 0.8)
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.85rem;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DefaultAvatar = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(42, 26, 26, 0.9));
  backdrop-filter: blur(12px);
  color: rgba(229, 9, 20, 0.8);
  font-size: 4rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${CardContainer}:hover & {
    color: rgba(229, 9, 20, 0.9);
    
    svg {
      transform: scale(1.1);
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  z-index: 2;
`;

const StudentCard = ({ student, delay = 0, playSound }) => {
  // Safety check - if student is not an object, create a fallback
  const safeStudent = typeof student === 'object' && student !== null ? student : {};
  
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imagePath, setImagePath] = useState(safeStudent.image || '');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isBottomHovered, setIsBottomHovered] = useState(false);
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { elementRef, inView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px', // Start loading earlier for smoother experience
    freezeOnceVisible: true
  });

  // Card tilt effect
  const handleTilt = (e) => {
    if (!cardRef.current || window.matchMedia('(max-width: 576px)').matches) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  useEffect(() => {
    if (safeStudent.image) {
      const img = new Image();
      img.src = safeStudent.image;
      img.onload = () => {
        setImagePath(safeStudent.image);
        setImageError(false);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${safeStudent.image}`);
        setImageError(true);
      };
    }
  }, [safeStudent.image]);

  // Preload image when in view
  useEffect(() => {
    if (inView && !imageLoaded) {
      const img = new Image();
      img.src = safeStudent.image;
      img.onload = () => setImageLoaded(true);
    }
  }, [inView, safeStudent.image, imageLoaded]);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: 'blur(10px)',
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smoother motion
        staggerChildren: 0.1
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        mass: 0.8
      }
    }
  };

  const premiumVariants = {
    hidden: { 
      scale: 0,
      rotate: -180 
    },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const getPremiumIcon = (role) => {
    switch (role) {
      case 'CR':
        return <FaCrown />;
      case 'Developer':
        return <FaCode />;
      default:
        return null;
    }
  };

  const handleMouseMove = (e) => {
    if (window.matchMedia('(max-width: 576px)').matches) {
      // Skip complex effects on mobile for better performance
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
    
    const isBottomHalf = y > 60;
    if (isBottomHalf !== isBottomHovered) {
      setIsBottomHovered(isBottomHalf);
    }
    
    // Apply card tilt effect
    handleTilt(e);
  };

  // Add touch event handler
  const handleTouch = (e) => {
    // For mobile, just set a fixed highlight position
    e.currentTarget.style.setProperty('--mouse-x', '50%');
    e.currentTarget.style.setProperty('--mouse-y', '50%');
    setIsBottomHovered(true);
  };

  if (!safeStudent) {
    return null;
  }

  return (
    <Link 
      to={safeStudent.id ? `/student/${encodeURIComponent(safeStudent.id)}` : '#'} 
      style={{ textDecoration: 'none' }}
      onClick={(e) => {
        if (!safeStudent.id) {
          e.preventDefault();
          console.error("Cannot navigate - student ID is missing");
          return;
        }
        if (playSound) playSound('click');
      }}
    >
      <CardContainer
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: delay * 0.1
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onTouchStart={handleTouch}
        onTouchEnd={() => setIsBottomHovered(false)}
        isBottomHovered={isBottomHovered}
        whileTap={{ scale: 0.98 }}
        className="tilt"
      >
        <div className="bottom-shadow" />
        <CardContent className="card-content">
          <ImageContainer>
            {!imageError && imagePath ? (
              <ProfileImage 
                image={imagePath}
                onError={() => setImageError(true)}
              />
            ) : (
              <DefaultAvatar>
                <FaUser />
              </DefaultAvatar>
            )}
            {safeStudent.role && (
              <PremiumBadge
                variants={premiumVariants}
                initial="hidden"
                animate="visible"
              >
                {getPremiumIcon(safeStudent.role)}
              </PremiumBadge>
            )}
          </ImageContainer>
          
          <ContentContainer>
            <UserInfo>
              <UserName>{safeStudent.name || `Student ${safeStudent.id || 'Unknown'}`}</UserName>
              <UserId>ID: {safeStudent.id || 'N/A'}</UserId>
            </UserInfo>
          </ContentContainer>
        </CardContent>
      </CardContainer>
    </Link>
  );
};

export default React.memo(StudentCard);
