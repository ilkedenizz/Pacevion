/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { pointsData } from '../../../data/learn/pointsData';

const PointsSystem: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className="learn-section">
      <div className="learn-section-header">
        <h2 className="section-title">{t.pointsTitle}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Normal Race Points */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', marginBottom: 'var(--space-3)', color: 'var(--color-accent)' }}>{t.normalRace}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: 'var(--color-border)', padding: '1px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-surface)', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>
              <span>{t.pos}</span>
              <span>{t.pts}</span>
            </div>
            {pointsData.race.map((p) => (
              <div key={p.pos} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-surface-elevated)', fontSize: '13px', fontWeight: 700 }}>
                <span>P{p.pos}</span>
                <span style={{ color: p.pos === 1 ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{p.pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sprint Points */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', marginBottom: 'var(--space-3)', color: 'var(--color-accent)' }}>{t.sprint}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: 'var(--color-border)', padding: '1px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-surface)', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>
              <span>{t.pos}</span>
              <span>{t.pts}</span>
            </div>
            {pointsData.sprint.map((p) => (
              <div key={p.pos} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-surface-elevated)', fontSize: '13px', fontWeight: 700 }}>
                <span>P{p.pos}</span>
                <span style={{ color: p.pos === 1 ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{p.pts}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PointsSystem;