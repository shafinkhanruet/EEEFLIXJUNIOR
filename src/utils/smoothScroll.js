import { useEffect } from 'react';

// Main smooth scroll function with Lerp (Linear Interpolation)
export const smoothScrollTo = (targetY, duration = 1000, easing = 'easeInOutCubic') => {
  const startY = window.pageYOffset;
  const difference = targetY - startY;
  const startTime = performance.now();
  
  const easingFunctions = {
    linear: t => t,
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  };
  
  const animateScroll = currentTime => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = easingFunctions[easing](progress);
    
    window.scrollTo(0, startY + difference * easedProgress);
    
    if (elapsedTime < duration) {
      requestAnimationFrame(animateScroll);
    }
  };
  
  requestAnimationFrame(animateScroll);
};

// React hook for smooth scrolling to elements
export const useSmoothScroll = () => {
  useEffect(() => {
    // Intercept all anchor clicks for smooth scrolling
    const handleAnchorClick = e => {
      const target = e.target.closest('a');
      
      if (!target) return;
      
      const href = target.getAttribute('href');
      
      if (!href || !href.startsWith('#')) return;
      
      // Prevent default anchor behavior
      e.preventDefault();
      
      const targetId = href === '#' ? 'body' : href;
      const targetElement = document.querySelector(targetId);
      
      if (!targetElement && targetId !== 'body') return;
      
      const targetY = targetId === 'body' ? 0 : targetElement.getBoundingClientRect().top + window.pageYOffset;
      
      // Smooth scroll to target
      smoothScrollTo(targetY, 800, 'easeInOutCubic');
      
      // Update URL hash without scrolling
      window.history.pushState(null, null, href);
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};

// Class for implementing custom smooth scrolling with Lerp
export class SmoothScroller {
  constructor(options = {}) {
    this.DOM = {
      scrollable: options.scrollable || document.querySelector('.smooth-scroll-container'),
      container: options.container || document.body
    };
    
    // Scrollable element style
    if (this.DOM.scrollable) {
      this.DOM.scrollable.style.position = 'fixed';
      this.DOM.scrollable.style.width = '100%';
      this.DOM.scrollable.style.height = '100%';
      this.DOM.scrollable.style.top = '0';
      this.DOM.scrollable.style.left = '0';
      this.DOM.scrollable.style.overflow = 'hidden';
    }
    
    this.lerp = options.lerp || 0.1; // Lower = smoother
    this.current = 0;
    this.target = 0;
    this.limit = 0;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    // Set document height
    this.setDocumentHeight();
    
    // Initial scroll position
    this.target = this.current = window.scrollY;
    
    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.render = this.render.bind(this);
    
    // Event listeners
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
    
    // Start animation
    this.startAnimation();
  }
  
  setDocumentHeight() {
    // Set document height
    this.limit = this.DOM.container.getBoundingClientRect().height - window.innerHeight;
    document.body.style.height = `${this.limit + window.innerHeight}px`;
  }
  
  handleResize() {
    // Update sizes on resize
    this.setDocumentHeight();
  }
  
  handleScroll() {
    // Update target on scroll
    if (!this.isAnimating) {
      this.target = window.scrollY;
    }
  }
  
  render() {
    // Lerp calculation for smooth interpolation
    this.current = this.lerp * this.target + (1 - this.lerp) * this.current;
    
    // Small threshold for stopping animation when values are very close
    if (Math.abs(this.target - this.current) < 0.1) {
      this.current = this.target;
    }
    
    // Update the view
    if (this.DOM.scrollable) {
      this.DOM.scrollable.style.transform = `translate3d(0, ${-this.current}px, 0)`;
    }
    
    // Continue animation loop
    this.requestId = requestAnimationFrame(this.render);
  }
  
  startAnimation() {
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(this.render);
    }
    this.isAnimating = true;
  }
  
  stopAnimation() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    this.isAnimating = false;
  }
  
  destroy() {
    // Clean up event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    
    // Stop animation
    this.stopAnimation();
    
    // Reset styles
    if (this.DOM.scrollable) {
      this.DOM.scrollable.style.position = '';
      this.DOM.scrollable.style.width = '';
      this.DOM.scrollable.style.height = '';
      this.DOM.scrollable.style.top = '';
      this.DOM.scrollable.style.left = '';
      this.DOM.scrollable.style.overflow = '';
      this.DOM.scrollable.style.transform = '';
    }
    
    document.body.style.height = '';
  }
}

export default {
  smoothScrollTo,
  useSmoothScroll,
  SmoothScroller
}; 