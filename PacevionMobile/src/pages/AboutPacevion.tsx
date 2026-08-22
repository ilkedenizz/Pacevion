import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, ShieldCheck, Cpu } from 'lucide-react';
import './AboutPacevion.css';

export const AboutPacevion: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page about-page fade-in">
      <header className="about-header font-mono">
        <button 
          className="lh-back-btn" 
          onClick={() => navigate('/more')} 
          aria-label="Back to Hub"
        >
          <ArrowLeft size={13} />
          <span>MORE / HUB</span>
        </button>
        <div className="about-header-titles">
          <h1 className="brand-badge font-heading">ABOUT PACEVION</h1>
          <p className="championship-sub font-mono">2026 FIA FORMULA 1 COMPANION</p>
        </div>
      </header>

      <main className="about-content">
        <section className="about-hero-card">
          <div className="brand-logo-large font-heading">PACEVION</div>
          <p className="about-lead font-mono">
            F1 live telemetry, championship standings, interactive 2026 calendar, technical grids and motorsport analytics.
          </p>
          <div className="version-pill font-mono">VERSION 2.0.0 PRODUCTION</div>
        </section>

        <section className="about-details-card font-mono">
          <div className="detail-item">
            <Cpu size={16} className="item-icon" />
            <div className="item-text">
              <h3>2026 SEASON SPECIFICATION</h3>
              <p>Tailored for the next generation of Formula 1 regulations, power units and active aerodynamics.</p>
            </div>
          </div>

          <div className="detail-item">
            <Info size={16} className="item-icon" />
            <div className="item-text">
              <h3>MOTORSPORT BROADCAST INTERFACE</h3>
              <p>High-density telemetry design optimized for 320px–430px mobile viewports.</p>
            </div>
          </div>

          <div className="detail-item">
            <ShieldCheck size={16} className="item-icon" />
            <div className="item-text">
              <h3>INDEPENDENT & OPEN COMPANION</h3>
              <p>Independent mobile client connected to open motorsport data sources.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPacevion;

