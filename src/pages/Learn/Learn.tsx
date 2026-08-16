import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { learnTranslations } from '../../data/learn/learnData';
import { useSEO } from '../../hooks/useSEO';
import './Learn.css';

import LearnHero from './components/LearnHero';
import LearnSectionNav from './components/LearnSectionNav';
import AeroSection from './components/AeroSection';
import PowerUnitSection from './components/PowerUnitSection';
import TyreCompounds from './components/TyreCompounds';
import RaceStrategySection from './components/RaceStrategySection';
import EngineeringFact from './components/EngineeringFact';
import CircuitCharacteristics from './components/CircuitCharacteristics';

const Learn: React.FC = () => {
  const { language } = useLanguage();
  const t = learnTranslations[language];

  useSEO({
    title: t.heroTitle || 'F1 Technical Knowledge Center',
    description: t.heroSub1 || 'The Science Behind The Speed',
    canonicalPath: '/learn'
  });

  // Reveal on scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.lkc-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lkc-page-container">
      <LearnHero />
      <LearnSectionNav />
      <div className="lkc-content-container">
        <AeroSection />
        <PowerUnitSection />
        <TyreCompounds />
        <RaceStrategySection />
        <EngineeringFact />
        <CircuitCharacteristics />
      </div>
    </div>
  );
};

export default Learn;