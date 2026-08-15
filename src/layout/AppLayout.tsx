import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import WelcomeOverlay from '../components/ui/WelcomeOverlay';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Scroll lock when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open-scroll-lock');
    } else {
      document.body.classList.remove('sidebar-open-scroll-lock');
    }
    return () => {
      document.body.classList.remove('sidebar-open-scroll-lock');
    };
  }, [isSidebarOpen]);

  return (
    <div className="app-layout bg-texture">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Navigation isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="page-container">
          <div className="page-content-wrapper">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
      <WelcomeOverlay />
    </div>
  );
};

export default AppLayout;
