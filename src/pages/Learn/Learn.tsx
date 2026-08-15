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
    <div className="learn-knowledge-center">
      <div className="lkc-hero">
        <div className="lkc-hero-content">
          <span className="lkc-hero-tag">PACEVION EDITORIAL</span>
          <h1 className="lkc-hero-title">F1 KNOWLEDGE CENTER</h1>
          <p className="lkc-hero-subtitle">{t.heroHeadline}</p>
          <div className="lkc-hero-manifesto">
            <p>{t.heroSub1} {t.heroSub2} {t.heroSub3}</p>
          </div>
        </div>
      </div>

      <div className="lkc-main-layout">
        <aside className="lkc-sidebar">
          <div className="lkc-sidebar-sticky">
            <h3 className="lkc-sidebar-title">{t.startHere}</h3>
            <nav className="lkc-nav">
              <button onClick={() => scrollToSection('basics')} className="lkc-nav-link"><span className="lkc-nav-num">01</span> <span className="lkc-nav-text">{t.pathBasics}</span></button>
              <button onClick={() => scrollToSection('weekend')} className="lkc-nav-link"><span className="lkc-nav-num">02</span> <span className="lkc-nav-text">{t.pathWeekend}</span></button>
              <button onClick={() => scrollToSection('rules')} className="lkc-nav-link"><span className="lkc-nav-num">03</span> <span className="lkc-nav-text">{t.pathRules}</span></button>
              <button onClick={() => scrollToSection('tyres')} className="lkc-nav-link"><span className="lkc-nav-num">04</span> <span className="lkc-nav-text">{t.pathTyres}</span></button>
              <button onClick={() => scrollToSection('strategy')} className="lkc-nav-link"><span className="lkc-nav-num">05</span> <span className="lkc-nav-text">{t.pathStrategy}</span></button>
              <button onClick={() => scrollToSection('car')} className="lkc-nav-link"><span className="lkc-nav-num">06</span> <span className="lkc-nav-text">{t.pathCar}</span></button>
            </nav>
          </div>
        </aside>

        <div className="lkc-content-area">
          <F1Basics t={t} id="basics" />
          <RaceWeekend t={t} id="weekend" />
          <PointsSystem t={t} />
          <DriverConstructor t={t} />
          <FlagsRules t={t} id="rules" />
          <Tyres t={t} id="tyres" />
          <DRSOvertaking t={t} />
          <PitStops t={t} />
          <RaceStrategy t={t} id="strategy" />
          
          <div className="lkc-car-diagram-wrapper">
            <F1Car t={t} id="car" />
          </div>
          
          <PowerUnit t={t} />
          <RaceData t={t} />
          <Glossary t={t} />
        </div>
      </div>
    </div>
  );
};

export default Learn;