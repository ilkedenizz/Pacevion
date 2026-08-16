import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageContainer = document.querySelector('.page-container');
    if (pageContainer) {
      pageContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
