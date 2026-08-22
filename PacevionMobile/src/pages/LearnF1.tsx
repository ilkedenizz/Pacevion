import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Zap, CircleDashed, Wind, Timer, FileText, Sparkles } from 'lucide-react';
import './LearnF1.css';

export const LearnF1: React.FC = () => {
  const navigate = useNavigate();

  const learnTopics = [
    { id: 'engine', label: '2026 Power Unit & Turbo Hybrid', desc: '1.6L V6 Turbo + 350kW MGU-K', icon: Zap },
    { id: 'aero', label: 'Active Aerodynamics & Downforce', desc: 'Active wings & straight-line drag reduction', icon: Wind },
    { id: 'tyres', label: 'Pirelli Tyre Compounds', desc: 'C1 to C5 compounds & degradation strategies', icon: CircleDashed },
    { id: 'pit', label: 'Pit Stop Strategy & Execution', desc: 'Sub-2-second stops & tyre windows', icon: Timer },
    { id: 'rules', label: 'FIA Sporting & Technical Rules', desc: 'Safety car, flags & penalty regulations', icon: FileText },
  ];

  return (
    <div className="page learn-page fade-in">
      {/* Header */}
      <header className="learn-header">
        <div className="lh-top font-mono">
          <button 
            className="lh-back-btn"
            onClick={() => navigate('/more')}
            title="Back to Hub"
          >
            <ArrowLeft size={13} />
            <span>MORE / HUB</span>
          </button>
        </div>
        <h1 className="lh-title font-heading editorial-headline">LEARN F1</h1>
        <span className="lh-subtitle font-mono">TECHNICAL REGULATIONS & MOTORSPORT GUIDES</span>
      </header>

      {/* Featured Feature Card */}
      <div className="featured-learn-card">
        <div className="flc-content">
          <div className="flc-badge font-mono">
            <Sparkles size={10} color="var(--color-warning)" />
            <span>FEATURED TOPIC</span>
          </div>
          <h2 className="flc-title font-heading">HOW DOWNFORCE & ACTIVE AERO WORK</h2>
          <p className="flc-desc font-mono">
            Discover how front and rear wings create negative lift to maximize cornering speeds in the 2026 generation cars.
          </p>
        </div>
      </div>

      {/* Learn Topics List */}
      <div className="learn-topics-section">
        <h3 className="sec-title font-mono">TECHNICAL GUIDES</h3>
        <div className="learn-menu-list">
          {learnTopics.map((topic) => (
            <div key={topic.id} className="learn-menu-item">
              <div className="lmi-icon-wrap">
                <topic.icon size={16} color="var(--color-primary)" />
              </div>
              <div className="lmi-meta">
                <span className="lmi-label font-heading">{topic.label.toUpperCase()}</span>
                <span className="lmi-desc font-mono">{topic.desc}</span>
              </div>
              <ChevronRight size={14} className="lmi-chevron" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnF1;

