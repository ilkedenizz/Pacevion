import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, EyeOff, ShieldCheck, HardDrive } from 'lucide-react';
import './PrivacyPolicy.css';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-page font-mono">
      <header className="privacy-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={22} />
        </button>
        <div className="privacy-header-titles">
          <h1 className="brand-badge font-mono">PRIVACY & DATA</h1>
          <p className="championship-sub">2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</p>
        </div>
      </header>

      <main className="privacy-content">
        <section className="privacy-hero">
          <Lock size={32} className="hero-icon" />
          <h2>PRIVACY BY DESIGN</h2>
          <p>Pacevion respects your privacy. The mobile application operates transparently without collecting personal data.</p>
        </section>

        <div className="privacy-checklist">
          <div className="check-item">
            <EyeOff size={16} className="check-icon" />
            <div className="check-text">
              <h3>NO PERSONAL DATA COLLECTION</h3>
              <p>We do not collect names, email addresses, phone numbers, or user accounts.</p>
            </div>
          </div>

          <div className="check-item">
            <EyeOff size={16} className="check-icon" />
            <div className="check-text">
              <h3>NO TRACKING OR ANALYTICS</h3>
              <p>No third-party tracking scripts, advertising identifiers, or telemetry trackers are embedded.</p>
            </div>
          </div>

          <div className="check-item">
            <ShieldCheck size={16} className="check-icon" />
            <div className="check-text">
              <h3>NO LOCATION PERMISSIONS</h3>
              <p>The app does not request or access device GPS or location hardware.</p>
            </div>
          </div>

          <div className="check-item">
            <HardDrive size={16} className="check-icon" />
            <div className="check-text">
              <h3>LOCAL DEVICE STORAGE</h3>
              <p>Temporary local cache is used solely to store F1 race data and render screens quickly.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
