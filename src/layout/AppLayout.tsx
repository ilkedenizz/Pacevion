import React from 'react';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import WelcomeOverlay from '../components/ui/WelcomeOverlay';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => (
  <div className="app-layout bg-texture">
    <Header />
    <div className="main-content">
      <Navigation />
      <main className="page-container">
        <Outlet />
      </main>
    </div>
    <WelcomeOverlay />
  </div>
);

export default AppLayout;
