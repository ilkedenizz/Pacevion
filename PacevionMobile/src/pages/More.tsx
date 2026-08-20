import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Database, Shield, Settings, ChevronRight, Users, Car, BookOpen } from 'lucide-react';
import './More.css';

export const More: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="page more-page fade-in">
      <header className="brand-header">
        <h1 className="editorial-headline" style={{ fontSize: '24px' }}>MORE</h1>
        <span className="editorial-label font-mono">PACEVION F1 2026</span>
      </header>

      <div className="more-section">
        <h4 className="ms-title editorial-label">MOTORSPORT</h4>
        <div className="more-group">
          <div className="more-item" onClick={() => navigate('/drivers')}>
            <div className="mi-icon"><Users size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>DRIVERS</span>
              <span className="mi-desc editorial-label">2026 Grid</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="more-item" onClick={() => navigate('/cars')}>
            <div className="mi-icon"><Car size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>TEAMS & CARS</span>
              <span className="mi-desc editorial-label">Constructors</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="more-item" onClick={() => navigate('/more/learn')}>
            <div className="mi-icon"><BookOpen size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>LEARN F1</span>
              <span className="mi-desc editorial-label">Rules & Regulations</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
        </div>
      </div>

      <div className="more-section">
        <h4 className="ms-title editorial-label">APP</h4>
        <div className="more-group">
          <div className="more-item" onClick={() => navigate('/more/about')}>
            <div className="mi-icon"><Info size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>ABOUT PACEVION</span>
              <span className="mi-desc editorial-label">Version 2.0.0</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="more-item" onClick={() => navigate('/more/data-sources')}>
            <div className="mi-icon"><Database size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>DATA SOURCES</span>
              <span className="mi-desc editorial-label">API Connection</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="more-item" onClick={() => navigate('/more/privacy')}>
            <div className="mi-icon"><Shield size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>PRIVACY POLICY</span>
              <span className="mi-desc editorial-label">Terms & Conditions</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
        </div>
      </div>

      <div className="more-section">
        <h4 className="ms-title editorial-label">GENERAL</h4>
        <div className="more-group">
          <div className="more-item" onClick={() => {}}>
            <div className="mi-icon"><Settings size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>SETTINGS</span>
              <span className="mi-desc editorial-label">App Preferences</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default More;
