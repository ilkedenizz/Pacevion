/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const F1Basics: React.FC<{ t: any; id?: string }> = ({ t, id }) => {
  return (
    <section id={id} className="learn-section">
      <div className="learn-section-header">
        <span className="section-num">01</span>
        <h2 className="section-title">{t.basicsTitle}</h2>
      </div>
      <div className="basics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
        {t.basicsItems.map((item: any, idx: number) => (
          <div key={idx} style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--color-accent)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: '0 0 var(--space-2) 0', color: 'var(--color-text-primary)' }}>{item.q}</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-3) 0', lineHeight: 1.6 }}>{item.a}</p>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '1px' }}>
              // {item.takeaway}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default F1Basics;