import React from 'react';
import { Info, Database, Shield, Settings, ChevronRight } from 'lucide-react';
import './More.css';

export const More: React.FC = () => {
  return (
    <div className="more-page fade-in">
      <header className="brand-header">
        <h1 className="editorial-headline" style={{ fontSize: '24px' }}>PACEVION</h1>
        <span className="editorial-label font-mono">F1 2026</span>
      </header>

      <div className="more-section">
        <h4 className="ms-title editorial-label">APP</h4>
        <div className="more-group">
          <div className="more-item">
            <div className="mi-icon"><Info size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>ABOUT PACEVION</span>
              <span className="mi-desc editorial-label">Version 2.0.0</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="more-item">
            <div className="mi-icon"><Database size={18} strokeWidth={2} /></div>
            <div className="mi-content">
              <span className="mi-title font-heading editorial-headline" style={{ fontSize: '14px' }}>DATA SOURCES</span>
              <span className="mi-desc editorial-label">API Connection</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="more-item">
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
          <div className="more-item">
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
