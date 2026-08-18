import React from 'react';
import { Menu, Settings, ChevronRight, Zap, CircleDashed, Wind, Timer, FileText } from 'lucide-react';
import './LearnF1.css';

export const LearnF1: React.FC = () => {

  const learnTopics = [
    { id: 'engine', label: 'Engine & Power Unit', icon: Zap },
    { id: 'tyres', label: 'Tyres', icon: CircleDashed },
    { id: 'drs', label: 'DRS Explained', icon: Wind },
    { id: 'pit', label: 'Pit Stops', icon: Timer },
    { id: 'rules', label: 'F1 Regulations', icon: FileText },
  ];

  return (
    <div className="learn-page">
      <header className="page-header-row">
        <Menu size={24} color="#FFFFFF" className="icon-btn" />
        <h1 className="page-title font-heading">LEARN F1</h1>
        <Settings size={20} color="#FFFFFF" className="icon-btn" />
      </header>

      <div className="featured-learn-card">
        <div className="flc-content">
          <span className="flc-category font-mono">AERODYNAMICS</span>
          <h2 className="flc-title font-heading">How Downforce<br/>Works</h2>
          <button className="flc-btn font-mono">Learn More</button>
        </div>
        
        {/* We keep the car image since it is explicitly in the reference design for this card */}
        <div className="flc-visual">
          <img src="/assets/img/cars/ferrari-2026.png" alt="Aerodynamics Diagram" className="flc-img" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
      </div>

      <div className="learn-menu-list">
        {learnTopics.map((topic) => (
          <button key={topic.id} className="learn-menu-item">
            <div className="lmi-left">
              <topic.icon size={18} className="lmi-icon" />
              <span className="lmi-label font-sans">{topic.label}</span>
            </div>
            <ChevronRight size={16} className="lmi-chevron" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LearnF1;
