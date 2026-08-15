/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const Tyres: React.FC<{ t: any; id?: string }> = ({ t, id }) => {
  return (
    <section id={id} className="learn-section">
      <div className="learn-section-header">
        <span className="section-num">04</span>
        <h2 className="section-title">{t.tyresTitle}</h2>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--color-text-primary)' }}>{t.tyreDegradation}</h4>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{t.tyreDegradationDesc}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{t.dryTyres}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid #ef4444', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <span style={{ display: 'block', fontWeight: 800, color: '#ef4444', marginBottom: 'var(--space-2)' }}>{t.soft}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Fastest lap times, highest grip, but degrades very quickly.</span>
            </div>
            <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid #eab308', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <span style={{ display: 'block', fontWeight: 800, color: '#eab308', marginBottom: 'var(--space-2)' }}>{t.medium}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Balanced grip and durability. Good for main race stints.</span>
            </div>
            <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid #ffffff', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <span style={{ display: 'block', fontWeight: 800, color: '#ffffff', marginBottom: 'var(--space-2)' }}>{t.hard}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Slowest lap times, lowest grip, but lasts the longest.</span>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{t.wetTyres}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid #22c55e', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <span style={{ display: 'block', fontWeight: 800, color: '#22c55e', marginBottom: 'var(--space-2)' }}>{t.inter}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Used for a damp or drying track with no standing water.</span>
            </div>
            <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid #3b82f6', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <span style={{ display: 'block', fontWeight: 800, color: '#3b82f6', marginBottom: 'var(--space-2)' }}>{t.wet}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Used for heavy rain and standing water.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tyres;