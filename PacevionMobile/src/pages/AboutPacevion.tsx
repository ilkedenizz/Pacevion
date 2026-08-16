import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, ShieldCheck, Cpu } from 'lucide-react';
import './AboutPacevion.css';

export const AboutPacevion: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page font-mono">
      <header className="about-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={22} />
        </button>
        <div className="about-header-titles">
          <h1 className="brand-badge font-mono">ABOUT PACEVION</h1>
          <p className="championship-sub">2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</p>
        </div>
      </header>

      <main className="about-content">
        <section className="about-hero-card">
          <div className="brand-logo-large font-heading">PACEVION</div>
          <p className="about-lead">
            F1 data, race calendar, standings, cars and learning tools in one place.
          </p>
          <div className="version-pill">VERSION 1.0.0</div>
        </section>

        <section className="about-details-card">
          <div className="detail-item">
            <Cpu size={16} className="item-icon" />
            <div className="item-text">
              <h3>2026 SEASON SPECIFICATION</h3>
              <p>Designed for the next generation of Formula 1 regulations and racing calendar.</p>
            </div>
          </div>

          <div className="detail-item">
            <Info size={16} className="item-icon" />
            <div className="item-text">
              <h3>MOBILE BROADCAST EXPERIENCE</h3>
              <p>Lightweight, high-performance companion app tailored for mobile screens.</p>
            </div>
          </div>

          <div className="detail-item">
            <ShieldCheck size={16} className="item-icon" />
            <div className="item-text">
              <h3>INDEPENDENT COMPANION</h3>
              <p>An independent mobile companion application for motorsport fans worldwide.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPacevion;
