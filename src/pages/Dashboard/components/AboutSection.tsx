import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="about-section" aria-labelledby="about-title">
      <div className="about-header">
        <h2 id="about-title" className="about-main-title">{t('aboutTitle')}</h2>
        <p className="about-subtitle">{t('aboutSubtitle')}</p>
      </div>

      <div className="about-layout-grid">
        <div className="about-main-column">
          <p className="about-lead">
            {t('aboutP1')}
          </p>
          <div className="about-columns">
            <p className="about-paragraph">
              {t('aboutP2')}
            </p>
            <p className="about-paragraph">
              {t('aboutP3')}
            </p>
          </div>
        </div>
        
        <div className="about-side-column">
          <div className="about-highlight-box">
            {t('aboutHighlight')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

