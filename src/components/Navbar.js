import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SoundContext } from '../contexts/SoundContext';

// Import the logo directly
import eeeflixLogo from '../assets/images/logos/eeeflix-logo.png';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: ${props => props.scrolled 
    ? 'rgba(10, 10, 20, 0.85)' 
    : 'linear-gradient(to bottom, rgba(10, 10, 20, 0.8) 0%, transparent 100%)'
  };
  backdrop-filter: ${props => props.scrolled ? 'blur(15px)' : 'blur(10px)'};
  box-shadow: ${props => props.scrolled 
    ? '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(229, 9, 20, 0.1)' 
    : 'none'
  };
  border-bottom: ${props => props.scrolled 
    ? '1px solid rgba(229, 9, 20, 0.15)' 
    : 'none'
  };
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${props => props.scrolled ? '1px' : '0'};
    background: linear-gradient(90deg, transparent, #E50914, transparent);
    opacity: 0.7;
    transition: all 0.3s ease;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.scrolled ? '0.8rem 5%' : '1rem 5%'};
  max-width: 1400px;
  margin: 0 auto;
  transition: all 0.3s ease;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.scrolled ? '0.8rem 15px' : '1rem 15px'};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  z-index: 2;
  position: relative;
  
  &:hover img {
    filter: drop-shadow(0 4px 12px rgba(229, 9, 20, 0.7));
    transform: scale(1.05);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    transform: scale(0.85);
    transform-origin: left center;
  }
`;

const LogoImage = styled.img`
  height: 45px;
  filter: drop-shadow(0 4px 8px rgba(229, 9, 20, 0.5));
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const LogoText = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #E50914;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  text-shadow: 0 0 20px rgba(229, 9, 20, 0.8);
  
  span {
    color: #FFFFFF;
    font-weight: 600;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.8rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)'};
  font-weight: ${props => props.active ? '600' : '500'};
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 6px;
  background: ${props => props.active ? 'rgba(229, 9, 20, 0.15)' : 'transparent'};
  
  &:hover {
    color: #FFFFFF;
    background: rgba(229, 9, 20, 0.1);
    transform: translateY(-2px);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${props => props.active ? '50%' : '0'};
    height: 2px;
    background: #E50914;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: ${props => props.active ? '1' : '0'};
    transform: translateX(-50%);
    border-radius: 2px;
  }
  
  &:hover:after {
    width: 50%;
    opacity: 1;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: rgba(15, 15, 25, 0.85);
  border: none;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  position: relative;
  cursor: pointer;
  z-index: 101;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(229, 9, 20, 0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 12px;
    width: 52px;
    height: 52px;
  }
  
  // Hide the original icons
  svg {
    display: none;
  }
  
  &:hover {
    background: rgba(20, 20, 30, 0.95);
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(229, 9, 20, 0.3);
  }
`;

const MenuDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #fff;
  margin: 2px;
  box-shadow: 0 0 5px rgba(229, 9, 20, 0.7);
  transition: all 0.3s ease;
  
  ${MobileMenuButton}:hover & {
    background-color: rgba(229, 9, 20, 0.9);
    box-shadow: 0 0 8px rgba(229, 9, 20, 0.9);
  }
  
  // Center dot grows on hover
  &.center {
    ${MobileMenuButton}:hover & {
      transform: scale(1.2);
    }
  }
  
  // Corner dots shrink on hover
  &.corner {
    ${MobileMenuButton}:hover & {
      transform: scale(0.8);
    }
  }
  
  // Diagonal dots grow when menu is open
  ${props => props.isOpen && `
    &.diagonal {
      background-color: rgba(229, 9, 20, 0.9);
      transform: scale(1.2);
    }
    
    &.anti-diagonal {
      background-color: rgba(229, 9, 20, 0.9);
      transform: scale(0.8);
    }
  `}
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh; /* Use dynamic viewport height for better mobile support */
  background: rgba(10, 10, 20, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
  padding-top: env(safe-area-inset-top);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(229, 9, 20, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  text-align: center;
  position: relative; 
  z-index: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 2.2rem;
    width: 90%;
  }
`;

const MobileNavLink = styled(NavLink)`
  font-size: 1.5rem;
  padding: 1rem 2.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.4rem;
    padding: 1.2rem;
    width: 100%;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Navbar = ({ scrolled: propScrolled, toggleDigitalOverlay }) => {
  const [scrolled, setScrolled] = useState(propScrolled || false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const soundContext = useContext(SoundContext);
  // Set default sound functions to prevent errors
  const playSound = soundContext?.playSound || (() => {});
  const [logoLoaded, setLogoLoaded] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = () => {
    // Safely call playSound with a check
    if (typeof playSound === 'function') {
      playSound('click');
    }
    setMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    // Safely call playSound with a check
    if (typeof playSound === 'function') {
      playSound('click');
    }
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoError = () => {
    setLogoLoaded(false);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.08
      } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1]
      } 
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      clipPath: "circle(0% at calc(100% - 23px) 23px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      clipPath: "circle(150% at calc(100% - 23px) 23px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
        staggerChildren: 0.08,
        when: "beforeChildren"
      }
    }
  };
  
  const mobileItemVariants = {
    closed: { opacity: 0, y: 15 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.16, 1, 0.3, 1]
      } 
    }
  };

  return (
    <NavContainer 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      scrolled={scrolled}
    >
      <NavContent scrolled={scrolled}>
        <Logo 
          to="/" 
          onClick={() => {
            if (typeof playSound === 'function') playSound('click');
          }}
          onMouseEnter={() => {
            if (typeof playSound === 'function') playSound('hover');
          }}
        >
          {!logoLoaded ? (
            <LogoText>
              EEE<span>FLIX</span>
            </LogoText>
          ) : (
            <LogoImage 
              src={eeeflixLogo}
              alt="EEEFlix Logo" 
              onError={handleLogoError}
            />
          )}
        </Logo>
        
        <NavLinks scrolled={scrolled}>
          <motion.div variants={childVariants}>
            <NavLink 
              to="/" 
              active={location.pathname === '/'}
              onClick={handleLinkClick}
              onMouseEnter={() => {
                if (typeof playSound === 'function') playSound('hover');
              }}
            >
              Home
            </NavLink>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <NavLink 
              to="/students" 
              active={location.pathname === '/students'}
              onClick={handleLinkClick}
              onMouseEnter={() => {
                if (typeof playSound === 'function') playSound('hover');
              }}
            >
              Students
            </NavLink>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <NavLink 
              to="/about" 
              active={location.pathname === '/about'}
              onClick={handleLinkClick}
              onMouseEnter={() => {
                if (typeof playSound === 'function') playSound('hover');
              }}
            >
              About
            </NavLink>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <NavLink 
              to="/contact" 
              active={location.pathname === '/contact'}
              onClick={handleLinkClick}
              onMouseEnter={() => {
                if (typeof playSound === 'function') playSound('hover');
              }}
            >
              Contact
            </NavLink>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <NavLink 
              to="/resources" 
              active={location.pathname === '/resources'}
              onClick={handleLinkClick}
              onMouseEnter={() => {
                if (typeof playSound === 'function') playSound('hover');
              }}
            >
              Resources
            </NavLink>
          </motion.div>
        </NavLinks>
        
        <MobileMenuButton 
          onClick={handleMenuToggle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          animate={mobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
        >
          {Array(9).fill().map((_, i) => (
            <MenuDot 
              key={i}
              className={
                i === 4 ? "center" : 
                (i === 0 || i === 8) ? "diagonal" : 
                (i === 2 || i === 6) ? "anti-diagonal" : 
                (i === 0 || i === 2 || i === 6 || i === 8) ? "corner" : ""
              }
              isOpen={mobileMenuOpen}
            />
          ))}
        </MobileMenuButton>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <MobileMenu
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <MobileNavLinks>
                <motion.div variants={mobileItemVariants}>
                  <MobileNavLink 
                    to="/" 
                    active={location.pathname === '/'}
                    onClick={handleLinkClick}
                  >
                    Home
                  </MobileNavLink>
                </motion.div>
                
                <motion.div variants={mobileItemVariants}>
                  <MobileNavLink 
                    to="/students" 
                    active={location.pathname === '/students'}
                    onClick={handleLinkClick}
                  >
                    Students
                  </MobileNavLink>
                </motion.div>
                
                <motion.div variants={mobileItemVariants}>
                  <MobileNavLink 
                    to="/about" 
                    active={location.pathname === '/about'}
                    onClick={handleLinkClick}
                  >
                    About
                  </MobileNavLink>
                </motion.div>
                
                <motion.div variants={mobileItemVariants}>
                  <MobileNavLink 
                    to="/contact" 
                    active={location.pathname === '/contact'}
                    onClick={handleLinkClick}
                  >
                    Contact
                  </MobileNavLink>
                </motion.div>
                
                <motion.div variants={mobileItemVariants}>
                  <MobileNavLink 
                    to="/resources" 
                    active={location.pathname === '/resources'}
                    onClick={handleLinkClick}
                  >
                    Resources
                  </MobileNavLink>
                </motion.div>
              </MobileNavLinks>
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;
