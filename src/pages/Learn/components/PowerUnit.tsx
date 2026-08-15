/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const PowerUnit: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className="learn-section">
      <div className="learn-section-header">
        <h2 className="section-title">{t.puTitle}</h2>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
        {t.puDesc}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        {t.puParts.map((part: string, idx: number) => (
          <div key={idx} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderLeft: '2px solid var(--color-accent)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{part}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PowerUnit;