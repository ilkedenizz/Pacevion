import React from 'react';
import F1CarDiagram from './F1CarDiagram';

const LearnHero: React.FC = () => {
  return (
    <section className="lkc-hero" id="the-car">
      <div className="lkc-hero-inner">
        <div className="lkc-hero-header lkc-reveal">
          <span className="lkc-hero-eyebrow">THE NIMBLE CAR CONCEPT</span>
          <h1 className="lkc-hero-title">2026 F1 CAR</h1>
          <p className="lkc-hero-desc">Technical specification & engineering overview</p>
        </div>
        <div className="lkc-hero-diagram lkc-reveal" style={{ transitionDelay: '0.2s' }}>
          <F1CarDiagram />
        </div>
      </div>
    </section>
  );
};

export default LearnHero;
