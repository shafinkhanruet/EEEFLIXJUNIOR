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
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  
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
    
    setRipples([...ripples, newRipple]);
    
    // Clean up ripples after animation completes
    setTimeout(() => {
      setRipples(prevRipples => prevRipples.filter(r => r.id !== newRipple.id));
    }, 600);
  };
  
  const handleClick = (e) => {
    handleRipple(e);
    if (onClick) onClick(e);
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
      <ButtonGlow />
      <ButtonGrid />
      <AnimatePresence>
        {isHovered && (
          <ButtonScanline
            variants={scanlineVariants}
            initial="initial"
            animate="hover"
            exit="exit"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <Ripple
            key={ripple.id}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
          />
        ))}
      </AnimatePresence>
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
