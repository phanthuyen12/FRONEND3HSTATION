import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that automatically scrolls to top whenever the route changes.
 * This ensures users always start at the top of the page when navigating.
 */
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly without smooth animation to ensure immediate reset
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTopOnNavigate;