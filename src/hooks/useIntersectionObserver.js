import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for using IntersectionObserver with optimized performance
 * @param {Object} options - IntersectionObserver options
 * @param {Number} options.threshold - Threshold for intersection (0-1)
 * @param {String} options.root - Root element (default: null - viewport)
 * @param {String} options.rootMargin - Root margin
 * @param {Boolean} options.freezeOnceVisible - Freeze once element becomes visible
 * @returns {Object} - Reference object and inView state
 */
const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
} = {}) => {
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;
    
    // Skip if already frozen as visible
    if (freezeOnceVisible && hasBeenInView) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;
        
        setInView(isVisible);
        
        if (isVisible && freezeOnceVisible) {
          setHasBeenInView(true);
        }
      },
      {
        threshold,
        root: root ? document.querySelector(root) : null,
        rootMargin,
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, freezeOnceVisible, hasBeenInView]);
  
  return { elementRef, inView, hasBeenInView };
};

export default useIntersectionObserver; 