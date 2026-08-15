/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import F1CarDiagram from './F1CarDiagram';

const F1Car: React.FC<{ t: any; id?: string }> = ({ t, id }) => {
  return (
    <section id={id} className="learn-section">
      <div className="learn-section-header">
        <span className="section-num">06</span>
        <h2 className="section-title">{t.carTitle}</h2>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
        Understand the major components of a modern Formula 1 car.
      </p>
      
      <F1CarDiagram />
      
      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', textAlign: 'center' }}>
        * ILLUSTRATIVE TECHNICAL SCHEMATIC
      </p>
    </section>
  );
};

export default F1Car;