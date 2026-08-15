import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { learnTranslations } from '../../data/learn/learnData';
import { useSEO } from '../../hooks/useSEO';
import './Learn.css';

import F1Basics from './components/F1Basics';
import RaceWeekend from './components/RaceWeekend';
import PointsSystem from './components/PointsSystem';
import DriverConstructor from './components/DriverConstructor';
import FlagsRules from './components/FlagsRules';
import Tyres from './components/Tyres';
import DRSOvertaking from './components/DRSOvertaking';
import PitStops from './components/PitStops';
import RaceStrategy from './components/RaceStrategy';
import F1Car from './components/F1Car';
import PowerUnit from './components/PowerUnit';
import RaceData from './components/RaceData';
import Glossary from './components/Glossary';

const Learn: React.FC = () => {
  const { language } = useLanguage();
  const t = learnTranslations[language];

  useSEO({
    title: t.heroTitle,
    description: t.heroSub1,
    canonicalPath: '/learn'
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="learn-page fade-in">
      <section className="learn-hero">
        <span className="learn-hero-title">{t.heroTitle}</span>
        <h1 className="learn-hero-headline">{t.heroHeadline}</h1>
        <div className="learn-hero-subs">
          <span>{t.heroSub1}</span>
          <span>{t.heroSub2}</span>
          <span>{t.heroSub3}</span>
        </div>
      </section>

      <div className="learn-content-grid">
        <aside className="learning-path-sidebar">
          <h3 className="path-title">{t.startHere}</h3>
          <div className="path-list">
            <a onClick={() => scrollToSection('basics')} className="path-step">
              <span className="path-step-num">01</span> {t.pathBasics}
            </a>
            <a onClick={() => scrollToSection('weekend')} className="path-step">
              <span className="path-step-num">02</span> {t.pathWeekend}
            </a>
            <a onClick={() => scrollToSection('rules')} className="path-step">
              <span className="path-step-num">03</span> {t.pathRules}
            </a>
            <a onClick={() => scrollToSection('tyres')} className="path-step">
              <span className="path-step-num">04</span> {t.pathTyres}
            </a>
            <a onClick={() => scrollToSection('strategy')} className="path-step">
              <span className="path-step-num">05</span> {t.pathStrategy}
            </a>
            <a onClick={() => scrollToSection('car')} className="path-step">
              <span className="path-step-num">06</span> {t.pathCar}
            </a>
          </div>
        </aside>

        <div className="learn-sections">
          <F1Basics t={t} id="basics" />
          <RaceWeekend t={t} id="weekend" />
          <PointsSystem t={t} />
          <DriverConstructor t={t} />
          <FlagsRules t={t} id="rules" />
          <Tyres t={t} id="tyres" />
          <DRSOvertaking t={t} />
          <PitStops t={t} />
          <RaceStrategy t={t} id="strategy" />
          <F1Car t={t} id="car" />
          <PowerUnit t={t} />
          <RaceData t={t} />
          <Glossary t={t} />
        </div>
      </div>
    </div>
  );
};

export default Learn;