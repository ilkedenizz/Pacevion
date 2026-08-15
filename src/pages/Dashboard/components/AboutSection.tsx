import React from 'react';
import { Flag, Trophy, Calendar } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="about-section" aria-labelledby="about-title">
      <div className="about-header">
        <h2 id="about-title" className="about-main-title font-heading">{t('aboutTitle')}</h2>
        <p className="about-subtitle">{t('aboutSubtitle')}</p>
      </div>

      <div className="about-content-body">
        <p className="about-paragraph text-secondary">
          {t('aboutP1')}
        </p>
        <p className="about-paragraph text-secondary">
          {t('aboutP2')}
        </p>
        <p className="about-paragraph text-secondary">
          {t('aboutP3')}
        </p>
      </div>

      <div className="about-highlight-box font-heading">
        {t('aboutHighlight')}
      </div>

      <div className="about-features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Flag size={20} className="feature-icon text-accent" />
          </div>
          <div className="feature-info">
            <h3 className="feature-title font-heading">{t('raceData')}</h3>
            <p className="feature-description text-secondary">{t('raceDataDesc')}</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Trophy size={20} className="feature-icon text-accent" />
          </div>
          <div className="feature-info">
            <h3 className="feature-title font-heading">{t('championship')}</h3>
            <p className="feature-description text-secondary">{t('championshipDesc')}</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Calendar size={20} className="feature-icon text-accent" />
          </div>
          <div className="feature-info">
            <h3 className="feature-title font-heading">{t('calendar')}</h3>
            <p className="feature-description text-secondary">{t('fullCalendarDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
