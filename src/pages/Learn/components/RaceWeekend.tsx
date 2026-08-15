/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const RaceWeekend: React.FC<{ t: any; id?: string }> = ({ t, id }) => {
  return (
    <section id={id} className="learn-section">
      <div className="learn-section-header">
        <span className="section-num">02</span>
        <h2 className="section-title">{t.weekendTitle}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        {/* Normal Weekend */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>FRIDAY</div>
          <div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-accent)', display: 'block' }}>{t.practice} 1 & 2</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{t.practiceDesc}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>SATURDAY</div>
          <div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-accent)', display: 'block' }}>{t.practice} 3</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{t.practiceDesc}</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--color-accent)', display: 'block' }}>{t.qualifying}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{t.qualifyingDesc}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>SUNDAY</div>
          <div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--color-accent)', display: 'block' }}>{t.race}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{t.raceDesc}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', border: '1px dashed var(--color-border)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {t.sprintNote}
        </div>
      </div>
    </section>
  );
};

export default RaceWeekend;