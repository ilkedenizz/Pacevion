import React from 'react';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
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
  </div>
);

export default AppLayout;
