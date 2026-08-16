import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt to scroll the page container if it exists
    const pageContainer = document.querySelector('.page-container');
    if (pageContainer) {
      pageContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
    
    // Always scroll the main window as a fallback and to ensure body scroll is reset
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
