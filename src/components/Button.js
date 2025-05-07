import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ButtonStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.8rem 1.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  letter-spacing: 0.5px;
  will-change: transform;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  
  /* Improved touch target for mobile */
  @media (max-width: 576px) {
    padding: 0.9rem 1.6rem;
    min-height: 44px;
    font-size: 0.95rem;
    border-radius: 6px; /* Slightly larger radius for mobile */
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  /* For devices that support hover */
  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  /* For touch devices */
  @media (hover: none) {
    &:active {
      transform: scale(0.98);
    }
  }
  
  span {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
`;

// Digital edge glow effect
const ButtonGlow = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  z-index: 0;
  opacity: 0;
  box-shadow: ${props => props.theme.shadows.buttonGlow};
  transition: opacity 0.3s ease;
  background: radial-gradient(circle at center, rgba(229, 9, 20, 0.15) 0%, rgba(229, 9, 20, 0) 70%);
`;

// Digital grid overlay
const ButtonGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='rgba(255, 255, 255, 0.05)' stroke-width='0.5'%3E%3Cpath d='M0 10h20M10 0v20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
`;

// Digital scan line
const ButtonScanline = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.5), transparent);
  opacity: 0;
  z-index: 1;
  pointer-events: none;
`;

// Add touch feedback style
const TouchRipple = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 100%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: touchRipple 0.5s linear;
  z-index: 3;
  pointer-events: none;
  
  @keyframes touchRipple {
    0% {
      opacity: 0.6;
      width: 0;
      height: 0;
    }
    100% {
      opacity: 0;
      width: 200px;
      height: 200px;
    }
  }
`;

const StyledButton = styled(motion.button)`
  ${ButtonStyles}
  background: ${props => 
    props.variant === 'outline' 
      ? 'transparent' 
      : props.variant === 'secondary' 
        ? 'rgba(40, 40, 40, 0.7)' 
        : props.variant === 'premium'
          ? props.theme.colors.gradientAccent
          : '#E50914'};
  color: ${props => props.variant === 'outline' ? '#B3B3B3' : '#FFFFFF'};
  border: ${props => 
    props.variant === 'outline' 
      ? `1px solid rgba(229, 9, 20, 0.3)` 
      : props.variant === 'gold'
        ? `1px solid #E50914`
        : 'none'};
        
  // Digital border for all buttons
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(229, 9, 20, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: ${props => 
      props.variant === 'outline' 
        ? 'rgba(229, 9, 20, 0.05)' 
        : props.variant === 'secondary' 
          ? 'rgba(40, 40, 40, 0.9)' 
          : props.variant === 'premium'
            ? props.theme.colors.gradientButtonHover
            : props.variant === 'gold'
              ? 'rgba(229, 9, 20, 0.9)'
              : '#F40612'};
    transform: translateY(-2px);
    box-shadow: ${props => 
      props.variant === 'premium' 
        ? '0 8px 25px rgba(229, 9, 20, 0.4), 0 0 0 1px rgba(229, 9, 20, 0.4)' 
        : props.variant === 'gold'
          ? props.theme.shadows.digitalGlow
          : '0 8px 20px rgba(229, 9, 20, 0.3)'};
    
    ${ButtonGlow} {
      opacity: ${props => (props.variant === 'premium' || props.variant === 'gold') ? 0.8 : 0.4};
    }
    
    ${ButtonGrid} {
      opacity: 0.8;
    }
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #333;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
      
      ${ButtonGrid} {
        opacity: 0;
      }
    }
    
    &:before, &::after {
      display: none;
    }
  }
`;

const StyledLinkButton = styled(motion(Link))`
  ${ButtonStyles}
  background: ${props => 
    props.variant === 'outline' 
      ? 'transparent' 
      : props.variant === 'secondary' 
        ? 'rgba(40, 40, 40, 0.7)' 
        : props.variant === 'premium'
          ? props.theme.colors.gradientAccent
          : '#E50914'};
  color: #FFFFFF;
  border: ${props => 
    props.variant === 'outline' 
      ? `1px solid rgba(229, 9, 20, 0.3)` 
      : 'none'};
  
  // Digital border for all buttons
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(229, 9, 20, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: ${props => 
      props.variant === 'outline' 
        ? 'rgba(229, 9, 20, 0.05)' 
        : props.variant === 'secondary' 
          ? 'rgba(40, 40, 40, 0.9)' 
          : props.variant === 'premium'
            ? props.theme.colors.gradientButtonHover
            : '#F40612'};
    transform: translateY(-2px);
    box-shadow: ${props => 
      props.variant === 'premium' 
        ? '0 8px 25px rgba(229, 9, 20, 0.4), 0 0 0 1px rgba(229, 9, 20, 0.4)' 
        : '0 8px 20px rgba(229, 9, 20, 0.3)'};
    
    ${ButtonGlow} {
      opacity: ${props => props.variant === 'premium' ? 0.8 : 0.4};
    }
    
    ${ButtonGrid} {
      opacity: 0.8;
    }
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Ripple effect component
const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transform: scale(0);
  z-index: 1;
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  onClick, 
  disabled = false,
  onMouseEnter,
  icon,
  iconPosition = 'left',
  mobileFriendly = true,
  ...props 
}) => {
  const [rippleArray, setRippleArray] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [showScanline, setShowScanline] = useState(false);
  const [touchRipple, setTouchRipple] = useState(null);
  const buttonRef = React.useRef(null);
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const scanlineVariants = {
    initial: { top: '-2px', opacity: 0 },
    hover: { 
      top: '100%',
      opacity: 0.8,
      transition: { 
        top: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop'
        },
        opacity: {
          duration: 0.3
        }
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const handleRipple = (e) => {
    // Skip complex animations on mobile for better performance
    if (window.matchMedia('(max-width: 576px)').matches && !mobileFriendly) {
      return;
    }
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
    
    setRippleArray([...rippleArray, newRipple]);
    
    // Clean up ripples after animation completes
    setTimeout(() => {
      setRippleArray(prevRipples => prevRipples.filter(r => r.id !== newRipple.id));
    }, 600);
  };
  
  // Add touch feedback
  const handleTouchStart = (e) => {
    if (!mobileFriendly || disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;
    
    setTouchRipple({
      id: Math.random(),
      x: touchX,
      y: touchY
    });
    
    setTimeout(() => {
      setTouchRipple(null);
    }, 500);
  };
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
    handleRipple(e);
  };
  
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const renderContent = () => (
    <>
      <span>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
      
      {/* Animated elements for desktop */}
      {!disabled && (
        <>
          <ButtonGlow animate={{ opacity: isHovered ? 0.4 : 0 }} />
          <ButtonGrid style={{ opacity: isHovered ? 0.8 : 0 }} />
          <AnimatePresence>
            {showScanline && (
              <ButtonScanline
                initial={{ top: 0, opacity: 0 }}
                animate={{ top: '100%', opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {rippleArray.map(({ x, y, size, id }) => (
              <Ripple
                key={id}
                style={{ left: x, top: y }}
                initial={{ width: 0, height: 0, opacity: 0.6 }}
                animate={{ width: size, height: size, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                exit={{ opacity: 0 }}
              />
            ))}
          </AnimatePresence>
          
          {/* Touch ripple for mobile */}
          {touchRipple && (
            <TouchRipple
              style={{
                left: touchRipple.x,
                top: touchRipple.y
              }}
            />
          )}
        </>
      )}
    </>
  );
  
  if (to) {
    return (
      <StyledLinkButton
        to={to}
        variant={variant}
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap={!disabled ? "tap" : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        {...props}
      >
        {renderContent()}
      </StyledLinkButton>
    );
  }
  
  return (
    <StyledButton
      variant={variant}
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap={!disabled ? "tap" : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      {...props}
    >
      {renderContent()}
    </StyledButton>
  );
};

export default Button;
