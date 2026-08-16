import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { ASSETS } from '../../../data/assets';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="manifesto-section" aria-labelledby="about-title">
      <div className="manifesto-bg">
        <img src={ASSETS.learn.aerodynamics} alt="F1 Editorial" />
        <div className="manifesto-overlay" />
      </div>
      
      <div className="manifesto-content">
        <div className="manifesto-grid">
          <div className="manifesto-left">
            <h2 id="about-title" className="manifesto-headline">
              {t('aboutTitle')}
            </h2>
            <div className="manifesto-divider"></div>
            <p className="manifesto-subtitle">
              {t('aboutSubtitle')}
            </p>
          </div>
          
          <div className="manifesto-right">
            <div className="manifesto-text-block lead">
              {t('aboutP1')}
            </div>
            <div className="manifesto-columns">
              <div className="manifesto-text-block">
                {t('aboutP2')}
              </div>
              <div className="manifesto-text-block">
                {t('aboutP3')}
              </div>
            </div>
          </div>
        </div>
        
        <div className="manifesto-highlight-banner">
          <span className="mh-label">PLATFORM MISSION</span>
          <span className="mh-text">{t('aboutHighlight')}</span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

