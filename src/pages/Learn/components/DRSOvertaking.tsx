/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const DRSOvertaking: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className="learn-section">
      <div className="learn-section-header">
        <h2 className="section-title">{t.drsTitle}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>{t.drsWhat}</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>{t.drsDesc}</p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>{t.drsWhen}</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>{t.drsWhenDesc}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)', padding: 'var(--space-5)', borderLeft: '2px solid var(--color-border)' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{t.slipstream}</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>{t.slipstreamDesc}</p>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{t.dirtyAir}</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>{t.dirtyAirDesc}</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DRSOvertaking;