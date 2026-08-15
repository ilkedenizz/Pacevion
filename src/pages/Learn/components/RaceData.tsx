/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const RaceData: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className="learn-section">
      <div className="learn-section-header">
        <h2 className="section-title">{t.dataTitle}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--color-accent)' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)' }}>{t.dataGap}</span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{t.dataGapDesc}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--color-accent)' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)' }}>{t.dataInterval}</span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{t.dataIntervalDesc}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--color-accent)' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)' }}>{t.dataSector}</span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{t.dataSectorDesc}</span>
        </div>

      </div>
    </section>
  );
};

export default RaceData;