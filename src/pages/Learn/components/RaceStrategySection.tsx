import React from 'react';

const RaceStrategySection: React.FC = () => {
  return (
    <section className="lkc-section lkc-strategy" id="strategy">
      <div className="lkc-strategy-header lkc-reveal">
        <h2 className="lkc-section-title">RACE STRATEGY</h2>
        <p className="lkc-section-subtitle">THE PITWALL DECISIONS</p>
      </div>

      <div className="lkc-strategy-content lkc-reveal" style={{ transitionDelay: '0.1s' }}>
        <div className="lkc-strategy-timeline">
          <div className="timeline-track">
            <div className="timeline-segment soft" style={{ width: '25%' }}><span>LAP 1-15 (SOFT)</span></div>
            <div className="timeline-segment medium" style={{ width: '45%' }}><span>LAP 16-42 (MEDIUM)</span></div>
            <div className="timeline-segment hard" style={{ width: '30%' }}><span>LAP 43-60 (HARD)</span></div>
            
            <div className="pit-marker" style={{ left: '25%' }}><span>PIT</span></div>
            <div className="pit-marker" style={{ left: '70%' }}><span>PIT</span></div>
          </div>
        </div>

        <div className="lkc-strategy-grid">
          <div className="lkc-strategy-card">
            <h3>UNDERCUT</h3>
            <p>Pitting before the car ahead for fresh tyres, using the immediate pace advantage on the out-lap to jump them when they pit.</p>
          </div>
          <div className="lkc-strategy-card">
            <h3>OVERCUT</h3>
            <p>Staying out longer in clean air while the car behind pits and gets stuck in traffic or struggles to warm up their new tyres.</p>
          </div>
          <div className="lkc-strategy-card">
            <h3>PIT WINDOW</h3>
            <p>The lap bracket where a driver can pit and re-emerge into clean air without being stuck behind slower cars.</p>
          </div>
          <div className="lkc-strategy-card">
            <h3>SAFETY CAR</h3>
            <p>A Safety Car slows the pack, reducing the relative time lost in the pitlane. Pitting here is a massive advantage.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RaceStrategySection;
