/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { glossaryData } from '../../../data/learn/glossaryData';
import { useLanguage } from '../../../context/LanguageContext';

const Glossary: React.FC<{ t: any }> = ({ t }) => {
  const { language } = useLanguage();
  const sortedGlossary = [...glossaryData].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <section className="learn-section" style={{ border: 'none', backgroundColor: 'transparent', padding: 'var(--space-6) 0' }}>
      <div className="learn-section-header" style={{ paddingLeft: 'var(--space-4)' }}>
        <h2 className="section-title">{t.glossaryTitle}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {sortedGlossary.map((item, idx) => (
          <div key={idx} style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>{item.term}</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{language === 'TR' ? item.tr : item.en}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-8)', textAlign: 'center', fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
        {t.sources}
      </div>
    </section>
  );
};

export default Glossary;