import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './More.css';

const More: React.FC = () => {
  return (
    <div className="more-page">
      <header className="more-header">
        <h1>MORE</h1>
        <hr className="header-separator" />
      </header>

      <div className="more-menu">
        <Link to="/more/cars" className="more-menu-item">
          <div className="menu-item-content">
            <span className="menu-icon">🏎️</span>
            <div className="menu-text">
              <span className="menu-title">Cars</span>
              <span className="menu-subtitle">Explore 2026 F1 machinery</span>
            </div>
          </div>
          <ChevronRight className="menu-chevron" size={20} />
        </Link>

        <Link to="/more/learn" className="more-menu-item">
          <div className="menu-item-content">
            <span className="menu-icon">📚</span>
            <div className="menu-text">
              <span className="menu-title">Learn F1</span>
              <span className="menu-subtitle">Technical insights and terminology</span>
            </div>
          </div>
          <ChevronRight className="menu-chevron" size={20} />
        </Link>

        <Link to="/more/live-feed" className="more-menu-item">
          <div className="menu-item-content">
            <span className="menu-icon">📡</span>
            <div className="menu-text">
              <span className="menu-title">Live Feed</span>
              <span className="menu-subtitle">Real-time session updates</span>
            </div>
          </div>
          <ChevronRight className="menu-chevron" size={20} />
        </Link>

        <div className="more-menu-item disabled">
          <div className="menu-item-content">
            <span className="menu-icon">⚙️</span>
            <div className="menu-text">
              <span className="menu-title">Settings</span>
              <span className="menu-subtitle">App preferences</span>
            </div>
          </div>
          <div className="coming-soon-badge">Coming Soon</div>
        </div>
      </div>
    </div>
  );
};

export default More;
