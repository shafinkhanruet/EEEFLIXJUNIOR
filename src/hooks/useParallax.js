import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useSpring, motion, useMotionValue, useVelocity } from 'framer-motion';

/**
 * Advanced parallax hook with spring physics for smoother animations
 * 
 * @param {Object} options Configuration options
 * @param {number} options.speed Parallax speed factor (default: 0.1)
 * @param {boolean} options.direction Direction of movement (true = same as scroll, false = opposite)
 * @param {number} options.springConfig.stiffness Spring stiffness (lower = smoother but slower)
 * @param {number} options.springConfig.damping Spring damping (higher = less oscillation)
 * @param {boolean} options.useVelocityFactor Whether to use velocity for dynamic speed adjustment
 * @returns {Object} Parallax animation properties and ref
 */
export const useParallax = ({
  speed = 0.1,
  direction = false,
  springConfig = { stiffness: 80, damping: 20 },
  useVelocityFactor = false
} = {}) => {
  const ref = useRef(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Get scroll progress within viewport
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const velocityFactor = useMotionValue(1);
  
  // Set initial measurements
  useEffect(() => {
    const element = ref.current;
    
    const onResize = () => {
      setElementTop(element?.offsetTop || 0);
      setClientHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    
    onResize();
    window.addEventListener('resize', onResize);
    
    return () => window.removeEventListener('resize', onResize);
  }, []);
  
  // Update velocity factor for dynamic parallax speed
  useEffect(() => {
    if (!useVelocityFactor) return;
    
    return scrollVelocity.onChange((latestVelocity) => {
      const clampedVelocity = Math.min(Math.max(Math.abs(latestVelocity) / 1000, 0.2), 2);
      velocityFactor.set(clampedVelocity);
    });
  }, [scrollVelocity, velocityFactor, useVelocityFactor]);
  
  // Calculate parallax offset
  const baseOffset = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    direction ? [speed * -100, speed * 100] : [speed * 100, speed * -100]
  );
  
  // Apply spring physics for smoother animation
  const smoothOffset = useSpring(baseOffset, springConfig);
  
  return {
    ref,
    style: { y: smoothOffset },
    baseOffset,
    smoothOffset,
    velocityFactor,
    scrollY
  };
};

/**
 * Creates smooth parallax layer effects for multiple elements
 * 
 * @param {Object} options Configuration options
 * @param {number} options.count Number of layers
 * @param {Array} options.speeds Array of speed values for each layer
 * @param {Array} options.directions Array of direction values for each layer
 * @returns {Array} Array of parallax configurations for each layer
 */
export const useParallaxLayers = ({
  count = 3,
  speeds = [0.02, 0.05, 0.1],
  directions = [false, true, false],
  springConfigs = [
    { stiffness: 100, damping: 30 },
    { stiffness: 80, damping: 25 },
    { stiffness: 60, damping: 20 }
  ]
} = {}) => {
  const layers = [];
  
  for (let i = 0; i < count; i++) {
    layers.push(
      useParallax({
        speed: speeds[i] || 0.05 * (i + 1),
        direction: directions[i] !== undefined ? directions[i] : i % 2 === 0,
        springConfig: springConfigs[i] || { stiffness: 100 - (i * 10), damping: 30 - (i * 2) },
        useVelocityFactor: i === count - 1 // Only use velocity factor on last layer
      })
    );
  }
  
  return layers;
};

/**
 * Hook for 3D tilt effect on components
 * 
 * @param {Object} options Configuration options
 * @param {number} options.max Maximum rotation angle
 * @param {number} options.perspective Perspective value for 3D effect
 * @param {number} options.scale Scale factor on hover
 * @param {boolean} options.reverse Reverse the tilt direction
 * @returns {Object} Tilt props and event handlers
 */
export const useParallaxTilt = ({
  max = 10,
  perspective = 1000,
  scale = 1.05,
  speed = 500,
  reverse = false,
  transitionProps = {
    type: "spring",
    stiffness: 400,
    damping: 30
  }
} = {}) => {
  const [tilt, setTilt] = useState({
    xPercent: 0,
    yPercent: 0,
    hover: false
  });
  
  const modifier = reverse ? -1 : 1;
  
  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to element (0-1)
    const xVal = (e.clientX - rect.left) / width;
    const yVal = (e.clientY - rect.top) / height;
    
    // Convert to percentage (-50 to 50) and apply modifier
    const xPercent = modifier * (xVal - 0.5) * 100;
    const yPercent = modifier * (yVal - 0.5) * 100;
    
    setTilt({
      xPercent,
      yPercent,
      hover: true
    });
  };
  
  const handleMouseLeave = () => {
    setTilt({
      xPercent: 0,
      yPercent: 0,
      hover: false
    });
  };
  
  // Calculate rotation based on mouse position
  const rotateX = (tilt.yPercent / 100) * max;
  const rotateY = -(tilt.xPercent / 100) * max;
  
  const transformStyle = {
    perspective: perspective,
    transformStyle: "preserve-3d",
    transition: tilt.hover ? undefined : `transform ${speed}ms ease-out`,
    transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${tilt.hover ? scale : 1})`,
    willChange: "transform"
  };
  
  // For use with Framer Motion
  const motionProps = {
    transformStyle: "preserve-3d",
    style: {
      perspective: perspective,
      willChange: "transform"
    },
    animate: {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: tilt.hover ? scale : 1,
      z: tilt.hover ? 50 : 0
    },
    transition: transitionProps
  };
  
  return {
    tilt,
    transformStyle,
    motionProps,
    eventHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave
    }
  };
};

export default {
  useParallax,
  useParallaxLayers,
  useParallaxTilt
}; 