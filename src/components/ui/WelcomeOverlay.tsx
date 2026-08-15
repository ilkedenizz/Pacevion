import React, { useState, useEffect } from 'react';
import './WelcomeOverlay.css';

const WelcomeOverlay: React.FC = () => {
  const [show, setShow] = useState(() => {
    try {
      const dismissed = localStorage.getItem('pacevion_welcome_dismissed');
      return dismissed !== 'true';
    } catch {
      return true;
    }
  });
  
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [show]);

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      try {
        localStorage.setItem('pacevion_welcome_dismissed', 'true');
      } catch {
        // Ignore localStorage block silently
      }
    }, 200); // Matches CSS transition duration
  };

  if (!show) return null;

  return (
    <div 
      className={`welcome-overlay-backdrop ${closing ? 'closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-desc"
    >
      <div className="welcome-overlay-container">
        <div className="welcome-logo-section">
          <h2 className="welcome-logo">PACEVION</h2>
          <span className="welcome-badge">UNOFFICIAL F1 FAN PROJECT</span>
        </div>
        
        <div className="welcome-divider" />
        
        <div className="welcome-body-section">
          <h3 id="welcome-title" className="welcome-title">Disclaimer & Notice</h3>
          <div id="welcome-desc" className="welcome-text-container">
            <p className="welcome-para highlight-text">
              Pacevion is an independent, non-commercial fan-made F1 platform built for informational and analysis purposes.
            </p>
            <p className="welcome-para disclaimer-sub">
              This platform is completely unofficial and not affiliated in any way with the FIA, Formula 1 teams, or any F1 companies. All trademarks, names, and logos belong to their respective owners.
            </p>
          </div>
        </div>

        <button 
          className="welcome-cta-btn" 
          onClick={handleDismiss}
          type="button"
          autoFocus
        >
          I Understand & Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
