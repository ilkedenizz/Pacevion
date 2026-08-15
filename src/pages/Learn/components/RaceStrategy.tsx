/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const RaceStrategy: React.FC<{ t: any; id?: string }> = ({ t, id }) => {
  return (
    <section id={id} className="learn-section">
      <div className="learn-section-header">
        <span className="section-num">05</span>
        <h2 className="section-title">{t.strategyTitle}</h2>
      </div>
      
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
        {t.strategyDesc}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Undercut */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', color: 'var(--color-accent)' }}>{t.undercut}</h4>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>{t.undercutDesc}</p>
          
          <div style={{ marginTop: 'var(--space-3)', backgroundColor: 'var(--color-surface-elevated)', padding: 'var(--space-4)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, width: '40px' }}>CAR A</span>
              <div style={{ flex: 1, height: '4px', backgroundColor: '#ef4444', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-4px', left: '30%', width: '12px', height: '12px', backgroundColor: 'var(--color-surface)', border: '2px solid #ef4444', borderRadius: '50%' }} title="Pit Stop" />
                <div style={{ position: 'absolute', top: '8px', left: '30%', fontSize: '10px', color: '#ef4444', transform: 'translateX(-50%)' }}>PIT</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, width: '40px' }}>CAR B</span>
              <div style={{ flex: 1, height: '4px', backgroundColor: '#3b82f6', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-4px', left: '70%', width: '12px', height: '12px', backgroundColor: 'var(--color-surface)', border: '2px solid #3b82f6', borderRadius: '50%' }} title="Pit Stop" />
                <div style={{ position: 'absolute', top: '8px', left: '70%', fontSize: '10px', color: '#3b82f6', transform: 'translateX(-50%)' }}>PIT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overcut */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', color: 'var(--color-accent)' }}>{t.overcut}</h4>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>{t.overcutDesc}</p>
        </div>

      </div>
    </section>
  );
};

export default RaceStrategy;