import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for optimized scroll events
 * @param {number} delay - Debounce delay in ms
 * @returns {Object} - Scroll position and scroll direction
 */
const useScrollOptimizer = (delay = 15) => {
  const [scrollPosition, setScrollPosition] = useState({
    x: typeof window !== 'undefined' ? window.scrollX : 0,
    y: typeof window !== 'undefined' ? window.scrollY : 0,
  });
  const [scrollDirection, setScrollDirection] = useState('none');
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Throttled scroll handler using requestAnimationFrame for smoother performance
  const handleScroll = useCallback(() => {
    let ticking = false;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setScrollPosition({
          x: window.scrollX,
          y: currentScrollY,
        });
        
        // Determine scroll direction
        if (currentScrollY > lastScrollTop) {
          setScrollDirection('down');
        } else if (currentScrollY < lastScrollTop) {
          setScrollDirection('up');
        }
        
        setLastScrollTop(currentScrollY);
        ticking = false;
      });
      
      ticking = true;
    }
  }, [lastScrollTop]);

  useEffect(() => {
    // Passive true improves scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return { scrollPosition, scrollDirection };
};

export default useScrollOptimizer; 