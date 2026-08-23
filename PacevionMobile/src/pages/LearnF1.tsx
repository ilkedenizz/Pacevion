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

  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);

  if (selectedTopic) {
    const topic = learnTopics.find(t => t.id === selectedTopic);
    return (
      <div className="page learn-page fade-in">
        <header className="learn-header">
          <div className="lh-top font-mono">
            <button 
              className="lh-back-btn"
              onClick={() => setSelectedTopic(null)}
              title="Back to Topics"
            >
              <ArrowLeft size={13} />
              <span>LEARN F1</span>
            </button>
          </div>
          <h1 className="lh-title font-heading editorial-headline">{topic?.label.toUpperCase()}</h1>
          <span className="lh-subtitle font-mono">{topic?.desc.toUpperCase()}</span>
        </header>
        
        <div className="detail-content" style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--color-text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.5', color: 'var(--color-text-primary)' }}>
            This technical guide covers the intricacies of the {topic?.label}. In modern Formula 1, mastering these components is critical to gaining competitive advantage on the track.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            The regulations surrounding this area are highly strict and enforced by the FIA. Teams invest millions of dollars in research and development to optimize performance while adhering to the rulebook.
          </p>
          <div style={{ padding: '20px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <h3 className="font-heading" style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>KEY TAKEAWAYS</h3>
            <ul className="font-mono" style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li>Maximum efficiency is required to comply with the 2026 technical regulations.</li>
              <li>Data-driven telemetry provides real-time insights to the pit wall.</li>
              <li>Driver feedback remains essential for fine-tuning the setup.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

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
      <div 
        className="featured-learn-card" 
        onClick={() => setSelectedTopic('aero')}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
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
            <div 
              key={topic.id} 
              className="learn-menu-item"
              onClick={() => setSelectedTopic(topic.id)}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
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

