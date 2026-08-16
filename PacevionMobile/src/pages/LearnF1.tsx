import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Cpu, Wind, Disc, Shield, Zap, Sparkles, BookOpen, Layers } from 'lucide-react';
import { TECHNICAL_HOTSPOTS, F1_BASICS, REGULATIONS_2026 } from '../data/learnF1';
import './LearnF1.css';

export const LearnF1: React.FC = () => {
  const navigate = useNavigate();

  // Expanded states
  const [expandedHotspot, setExpandedHotspot] = useState<string | null>('aero');
  const [expandedReg, setExpandedReg] = useState<string | null>('active_aero');

  const toggleHotspot = (id: string) => {
    setExpandedHotspot((prev) => (prev === id ? null : id));
  };

  const toggleReg = (id: string) => {
    setExpandedReg((prev) => (prev === id ? null : id));
  };

  // Icon selector helper
  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'drs':
        return <Wind size={16} className="topic-icon" />;
      case 'downforce':
        return <Layers size={16} className="topic-icon" />;
      case 'porpoising':
        return <Sparkles size={16} className="topic-icon" />;
      case 'apex':
      case 'racing_line':
        return <Zap size={16} className="topic-icon" />;
      case 'safety_car':
        return <Shield size={16} className="topic-icon" />;
      case 'undercut':
      case 'overcut':
        return <Disc size={16} className="topic-icon" />;
      default:
        return <BookOpen size={16} className="topic-icon" />;
    }
  };

  return (
    <div className="learn-dashboard">
      {/* Header */}
      <header className="learn-header">
        <div className="learn-header-top">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft size={22} />
          </button>
          <div className="learn-header-titles">
            <h1 className="brand-badge font-mono">LEARN F1</h1>
            <p className="championship-sub font-mono">FORMULA 1 KNOWLEDGE CENTER</p>
          </div>
        </div>
        <p className="learn-tagline font-mono">"Understand the machine. Understand the race."</p>
      </header>

      {/* FEATURED TECHNICAL OVERVIEW CARD */}
      <section className="featured-card">
        <div className="featured-header">
          <span className="featured-badge font-mono">2026 F1 CAR</span>
          <span className="featured-sub font-mono">TECHNICAL OVERVIEW</span>
        </div>

        <div className="featured-visual-container">
          <img
            src="/assets/img/cars/ferrari-2026.png"
            alt="2026 Formula 1 Car Technical Model"
            className="featured-car-img"
          />
          <div className="spec-floating-badges font-mono">
            <span className="float-badge">1000+ HP</span>
            <span className="float-badge">350 KM/H</span>
            <span className="float-badge">3.5G AERO</span>
          </div>
        </div>

        <p className="featured-desc font-mono">
          Tap any technical hotspot below to discover how modern Formula 1 aerodynamic, power, and mechanical systems operate.
        </p>
      </section>

      {/* TECHNICAL HOTSPOTS (ACCORDION GRID) */}
      <section className="learn-section">
        <h2 className="section-title font-mono">TECHNICAL HOTSPOTS</h2>

        <div className="hotspot-grid">
          {TECHNICAL_HOTSPOTS.map((hotspot) => {
            const isExpanded = expandedHotspot === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className={`hotspot-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleHotspot(hotspot.id)}
              >
                <div className="hotspot-card-header font-mono">
                  <div className="hotspot-title-group">
                    <Cpu size={14} className="hotspot-icon" />
                    <span className="hotspot-name font-heading">{hotspot.name}</span>
                    <span className="hotspot-tag">{hotspot.badge}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`chevron-icon ${isExpanded ? 'rotated' : ''}`}
                  />
                </div>

                {isExpanded && (
                  <div className="hotspot-content fade-in">
                    <p className="hotspot-summary font-mono">{hotspot.summary}</p>
                    <p className="hotspot-detail">{hotspot.details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* F1 BASICS TOPICS */}
      <section className="learn-section">
        <h2 className="section-title font-mono">F1 BASICS</h2>

        <div className="basics-grid">
          {F1_BASICS.map((topic) => (
            <div key={topic.id} className="basic-topic-card">
              <div className="basic-card-top font-mono">
                {getTopicIcon(topic.id)}
                <span className="basic-cat-badge">{topic.category}</span>
              </div>
              <h3 className="basic-topic-title font-heading">{topic.title}</h3>
              <p className="basic-topic-desc">{topic.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2026 REGULATIONS */}
      <section className="learn-section">
        <h2 className="section-title font-mono">2026 REGULATIONS</h2>

        <div className="regulations-list">
          {REGULATIONS_2026.map((reg) => {
            const isExpanded = expandedReg === reg.id;

            return (
              <div
                key={reg.id}
                className={`reg-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleReg(reg.id)}
              >
                <div className="reg-card-header font-mono">
                  <div className="reg-title-group">
                    <span className="reg-tag">{reg.tag}</span>
                    <h3 className="reg-title font-heading">{reg.title}</h3>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`chevron-icon ${isExpanded ? 'rotated' : ''}`}
                  />
                </div>

                <p className="reg-summary font-mono">{reg.summary}</p>

                {isExpanded && (
                  <div className="reg-content fade-in">
                    <p className="reg-detail">{reg.details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LearnF1;
