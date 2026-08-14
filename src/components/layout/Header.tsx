import React from 'react';
import './Header.css';

const Header: React.FC = () => (
  <header className="header">
    <div className="header-logo-section">
      <span className="title">Pacevion</span>
    </div>
    <div className="header-status-section">
      <div className="status-item">
        <span className="status-label">SEASON</span>
        <span className="status-value font-mono">2026</span>
      </div>
      <div className="status-divider" />
      <div className="status-item">
        <span className="status-indicator live" />
        <span className="status-value font-mono">LIVE FEED</span>
      </div>
    </div>
  </header>
);

export default Header;
