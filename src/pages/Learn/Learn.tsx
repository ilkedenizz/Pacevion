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

import { ASSETS } from '../../data/assets';

const LEARN_SECTIONS = [
  {
    id: 'aerodynamics',
    title: 'AERODYNAMICS',
    content: 'The most critical performance differentiator in modern F1. Complex front wings, underfloor venturi tunnels, and rear wings generate immense downforce, pushing the car into the track. This allows cornering speeds that defy logic, though it comes at the cost of drag on the straights.',
    visual: ASSETS.learn.aerodynamics
  },
  {
    id: 'power-unit',
    title: 'POWER UNIT',
    content: 'A masterpiece of engineering. The 1.6-liter V6 turbocharged hybrid power unit consists of the Internal Combustion Engine (ICE), Motor Generator Unit-Kinetic (MGU-K), Motor Generator Unit-Heat (MGU-H), Energy Store (ES), and Control Electronics (CE). It produces over 1000 horsepower.',
    visual: ASSETS.learn.powerUnit
  },
  {
    id: 'tyres',
    title: 'TYRES & BRAKES',
    content: 'Pirelli supplies F1 with complex tyre compounds ranging from C1 (hardest) to C5 (softest), plus intermediate and wet tyres. Managing tyre temperatures and degradation is crucial. Brakes can reach 1000°C and provide 5G of deceleration.',
    visual: ASSETS.learn.tyres
  },
  {
    id: 'drs-ers',
    title: 'DRS & ERS',
    content: 'The Drag Reduction System (DRS) opens a flap in the rear wing to reduce drag and aid overtaking. The Energy Recovery System (ERS) deploys 160hp of electrical energy per lap, harvested from braking and exhaust gases.',
    visual: null
  }
];

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
          
          <div className="learn-sections">
            {LEARN_SECTIONS.map((section) => (
              <div 
                key={section.id}
                id={section.id}
                className="learn-section-card"
              >
                {section.visual ? (
                  <div className="ls-visual">
                    <img src={section.visual} alt={section.title} className="ls-img" loading="lazy" />
                  </div>
                ) : (
                  <div className="ls-visual">
                    <img src={ASSETS.circuits.hero} alt={section.title} className="ls-img" loading="lazy" />
                  </div>
                )}
                <div className="ls-content">
                  <h3 className="ls-title">{section.title}</h3>
                  <p className="ls-desc">{section.content}</p>
                </div>
              </div>
            ))}
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