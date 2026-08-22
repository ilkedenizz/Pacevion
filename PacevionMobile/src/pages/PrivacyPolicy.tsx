import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, EyeOff, ShieldCheck, HardDrive } from 'lucide-react';
import './PrivacyPolicy.css';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page privacy-page font-mono fade-in">
      <header className="privacy-header">
        <button 
          className="lh-back-btn" 
          onClick={() => navigate('/more')} 
          aria-label="Back to Hub"
        >
          <ArrowLeft size={13} />
          <span>MORE / HUB</span>
        </button>
        <div className="privacy-header-titles">
          <h1 className="brand-badge font-heading">PRIVACY & DATA</h1>
          <p className="championship-sub font-mono">2026 FIA FORMULA 1 COMPANION</p>
        </div>
      </header>

      <main className="privacy-content">
        <section className="privacy-hero">
          <Lock size={28} color="var(--color-primary)" />
          <h2 className="font-heading">PRIVACY BY DESIGN</h2>
          <p className="font-mono">Pacevion respects your privacy. The mobile application operates transparently without collecting personal data.</p>
        </section>

        <div className="privacy-checklist">
          <div className="check-item">
            <EyeOff size={16} className="check-icon" />
            <div className="check-text">
              <h3>NO PERSONAL DATA COLLECTION</h3>
              <p>We do not collect names, email addresses, phone numbers, or require user accounts.</p>
            </div>
          </div>

          <div className="check-item">
            <EyeOff size={16} className="check-icon" />
            <div className="check-text">
              <h3>NO TRACKING OR ADVERTISING</h3>
              <p>No third-party tracking scripts, advertising identifiers, or telemetry trackers are embedded.</p>
            </div>
          </div>

          <div className="check-item">
            <ShieldCheck size={16} className="check-icon" />
            <div className="check-text">
              <h3>NO SENSITIVE PERMISSIONS</h3>
              <p>The app does not request or access device GPS, camera, contacts, or location hardware.</p>
            </div>
          </div>

          <div className="check-item">
            <HardDrive size={16} className="check-icon" />
            <div className="check-text">
              <h3>LOCAL DEVICE STORAGE ONLY</h3>
              <p>Temporary local cache is used solely to store F1 race data and render screens instantaneously.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;

