/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const DriverConstructor: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className="learn-section">
      <div className="learn-section-header">
        <h2 className="section-title">{t.dvcTitle}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
        
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: 0, color: 'var(--color-text-primary)' }}>{t.dvcDriver}</h4>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
            {t.dvcDriverDesc}
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: 0, color: 'var(--color-accent)' }}>{t.dvcConstructor}</h4>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
            {t.dvcConstructorDesc}
          </p>
        </div>

      </div>
    </section>
  );
};

export default DriverConstructor;