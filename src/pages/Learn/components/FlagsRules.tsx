/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const FlagsRules: React.FC<{ t: any; id?: string }> = ({ t, id }) => {
  return (
    <section id={id} className="learn-section">
      <div className="learn-section-header">
        <span className="section-num">03</span>
        <h2 className="section-title">{t.flagsTitle}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {t.flags.map((flag: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', gap: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
            <div style={{
              width: '40px', height: '30px', flexShrink: 0,
              backgroundColor: flag.pattern ? 'transparent' : flag.hex,
              backgroundImage: flag.pattern ? 'conic-gradient(#fff 90deg, #000 90deg 180deg, #fff 180deg 270deg, #000 270deg)' : 'none',
              backgroundSize: flag.pattern ? '10px 10px' : 'auto',
              border: flag.pattern ? '1px solid #444' : 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{flag.color}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: 600 }}>{flag.meaning}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{flag.when}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlagsRules;