import React from 'react';
import { Info, Database, Shield, Settings, ChevronRight } from 'lucide-react';
import './More.css';

export const More: React.FC = () => {
  return (
    <div className="more-page fade-in">
      <header className="brand-header">
        <h1 className="brand-title font-heading">PACEVION</h1>
        <span className="brand-season font-mono">2026 SEASON</span>
      </header>

      <div className="more-list">
        <div className="more-row">
          <div className="more-icon"><Info size={20} /></div>
          <div className="more-text">
            <span className="mt-title font-heading">ABOUT PACEVION</span>
            <span className="mt-desc font-mono">Version 2.0.0</span>
          </div>
          <ChevronRight size={16} color="var(--color-text-secondary)" />
        </div>

        <div className="more-row">
          <div className="more-icon"><Database size={20} /></div>
          <div className="more-text">
            <span className="mt-title font-heading">DATA SOURCES</span>
            <span className="mt-desc font-mono">API Connection</span>
          </div>
          <ChevronRight size={16} color="var(--color-text-secondary)" />
        </div>

        <div className="more-row">
          <div className="more-icon"><Shield size={20} /></div>
          <div className="more-text">
            <span className="mt-title font-heading">PRIVACY POLICY</span>
            <span className="mt-desc font-mono">Terms & Conditions</span>
          </div>
          <ChevronRight size={16} color="var(--color-text-secondary)" />
        </div>

        <div className="more-row">
          <div className="more-icon"><Settings size={20} /></div>
          <div className="more-text">
            <span className="mt-title font-heading">SETTINGS</span>
            <span className="mt-desc font-mono">App Preferences</span>
          </div>
          <ChevronRight size={16} color="var(--color-text-secondary)" />
        </div>
      </div>
    </div>
  );
};

export default More;
