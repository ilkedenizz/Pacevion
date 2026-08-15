/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const PitStops: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className="learn-section">
      <div className="learn-section-header">
        <h2 className="section-title">{t.pitTitle}</h2>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
        {t.pitDesc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: 'var(--space-4) 0' }}>
        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', backgroundColor: 'var(--color-border)', zIndex: 0 }} />
        
        {t.pitTimeline.map((step: string, idx: number) => (
          <div key={idx} style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--color-surface)', padding: 'var(--space-2) var(--space-3)', border: '2px solid var(--color-accent)', borderRadius: '4px', fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {step}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PitStops;