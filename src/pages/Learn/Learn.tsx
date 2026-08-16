import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { learnTranslations } from '../../data/learn/learnData';
import { useSEO } from '../../hooks/useSEO';
import { ASSETS } from '../../data/assets';
import { circuitLayouts } from '../../data/circuits';
import './Learn.css';

import F1CarDiagram from './components/F1CarDiagram';

const Learn: React.FC = () => {
  const { language } = useLanguage();
  const t = learnTranslations[language];

  useSEO({
    title: t.heroTitle || 'Learn F1 - Knowledge Center',
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

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const circuitsToShow = ['monaco', 'spa', 'suzuka', 'silverstone', 'monza'];

  return (
    <div className="learn-knowledge-center">
      
      {/* 1. HERO */}
      <section className="lkc-hero">
        <div className="lkc-hero-content">
          <div className="lkc-hero-text reveal-on-scroll">
            <span className="ds-section-label">01 / F1 KNOWLEDGE CENTER</span>
            <h1 className="lkc-hero-title">THE SCIENCE<br/>BEHIND<br/>THE SPEED</h1>
            <p className="lkc-hero-manifesto">
              Don't just watch Formula 1. Discover how the car, aerodynamics, tyres, and strategy dictate the outcome of the race.
            </p>
          </div>
          <div className="lkc-hero-visual reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
            <F1CarDiagram />
          </div>
        </div>
      </section>

      {/* 2. LEARNING PATH */}
      <section className="lkc-path-section reveal-on-scroll">
        <div className="ds-section-label">SELECT PATH</div>
        <div className="lkc-path-grid">
          {[
            { id: 'aerodynamics', num: '01', title: 'AERODYNAMICS' },
            { id: 'power-unit', num: '02', title: 'POWER UNIT' },
            { id: 'tyres', num: '03', title: 'TYRES' },
            { id: 'strategy', num: '04', title: 'RACE STRATEGY' },
            { id: 'systems', num: '05', title: 'DRS & ERS' }
          ].map(path => (
            <div key={path.id} className="ds-card lkc-path-card" onClick={() => scrollToSection(path.id)}>
              <div className="path-num">{path.num}</div>
              <h3 className="path-title">{path.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE CAR SECTION */}
      <section id="interactive-car" className="lkc-interactive-car reveal-on-scroll">
        <div className="ds-section-label" style={{ justifyContent: 'center' }}>UNDERSTANDING THE F1 CAR</div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900 }}>THE MODERN MACHINE</h2>
        <div className="lkc-car-diagram-wrapper">
          <F1CarDiagram />
        </div>
      </section>

      {/* 4. AERODYNAMICS */}
      <section id="aerodynamics" className="lkc-split-section reveal-on-scroll">
        <div className="lkc-split-visual">
          <img src={ASSETS.learn.aerodynamics} alt="Aerodynamics" loading="lazy" />
        </div>
        <div className="lkc-split-content">
          <div className="ds-section-label">01 / PHYSICS</div>
          <h2>AERODYNAMICS</h2>
          <p className="subtitle">Why does an F1 car generate so much downforce?</p>
          
          <div className="aero-stats">
            <div className="aero-stat">
              <strong>DOWNFORCE</strong>
              <span>Pushes the car into the track, increasing cornering speed.</span>
            </div>
            <div className="aero-stat">
              <strong>DRAG</strong>
              <span>The air resistance penalty. More downforce usually means more drag.</span>
            </div>
            <div className="aero-stat">
              <strong>GROUND EFFECT</strong>
              <span>Venturi tunnels under the floor generate massive suction with minimal drag penalty.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TYRES */}
      <section id="tyres" className="lkc-tyres-section reveal-on-scroll">
        <div className="ds-section-label">03 / CONTACT PATCH</div>
        <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: 'var(--ds-space-lg)' }}>TYRE COMPOUNDS</h2>
        
        <div className="lkc-tyres-grid">
          {[
            { id: 'soft', name: 'SOFT', color: 'tyre-soft', desc: 'Maximum grip, shortest lifespan. Used for qualifying and late-race sprints.' },
            { id: 'medium', name: 'MEDIUM', color: 'tyre-medium', desc: 'The balanced choice. Good durability with respectable pace.' },
            { id: 'hard', name: 'HARD', color: 'tyre-hard', desc: 'Lowest grip but lasts the longest. Ideal for 1-stop strategies.' },
            { id: 'intermediate', name: 'INTERMEDIATE', color: 'tyre-intermediate', desc: 'For damp tracks or light rain. Displaces 30 liters of water per second.' },
            { id: 'wet', name: 'WET', color: 'tyre-wet', desc: 'For heavy rain. Displaces 85 liters of water per second to prevent aquaplaning.' }
          ].map(tyre => (
            <div key={tyre.id} className="ds-card lkc-tyre-card">
              <div className={`tyre-indicator ${tyre.color}`}></div>
              <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{tyre.name}</h3>
              <p className="text-secondary" style={{ fontSize: '14px', marginTop: 'var(--ds-space-sm)' }}>{tyre.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. POWER UNIT */}
      <section id="power-unit" className="lkc-pu-section reveal-on-scroll">
        <div className="ds-section-label" style={{ justifyContent: 'center' }}>02 / PROPULSION</div>
        <h2 style={{ fontSize: '48px', fontWeight: 900, textTransform: 'uppercase' }}>V6 TURBO HYBRID</h2>
        <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Producing over 1000 horsepower, the modern F1 Power Unit is the most efficient internal combustion engine on earth, operating at over 50% thermal efficiency.
        </p>

        <div className="lkc-pu-grid">
          {[
            { tag: 'ICE', name: 'Internal Combustion Engine' },
            { tag: 'TC', name: 'Turbocharger' },
            { tag: 'MGU-K', name: 'Motor Generator Unit - Kinetic' },
            { tag: 'MGU-H', name: 'Motor Generator Unit - Heat' },
            { tag: 'ES', name: 'Energy Store (Battery)' },
            { tag: 'CE', name: 'Control Electronics' }
          ].map(part => (
            <div key={part.tag} className="ds-card lkc-pu-card">
              <strong>{part.tag}</strong>
              <span className="text-secondary" style={{ fontSize: '13px' }}>{part.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. RACE STRATEGY */}
      <section id="strategy" className="lkc-strategy-section reveal-on-scroll">
        <div className="ds-section-label">04 / THE PITWALL</div>
        <h2 style={{ fontSize: '48px', fontWeight: 900 }}>RACE STRATEGY</h2>
        
        <div className="lkc-timeline">
          <div className="timeline-event">LAP 01 <br/><span className="text-accent">START ON SOFT</span></div>
          <div className="timeline-event">LAP 18 <br/><span className="text-secondary">TYRE DEGRADATION</span></div>
          <div className="timeline-event">LAP 20 <br/><span style={{ color: '#EAB308' }}>PIT FOR MEDIUM</span></div>
          <div className="timeline-event">LAP 45 <br/><span className="text-warning">SAFETY CAR</span></div>
          <div className="timeline-event">LAP 46 <br/><span className="text-accent">FREE PIT FOR SOFT</span></div>
          <div className="timeline-event">LAP 52 <br/><span className="text-success">RACE WIN</span></div>
        </div>
      </section>

      {/* 8. DRS & ERS */}
      <section id="systems" className="lkc-systems-section reveal-on-scroll">
        <div className="ds-card lkc-system-card">
          <span>DRAG REDUCTION SYSTEM</span>
          <h3>DRS</h3>
          <p className="text-secondary" style={{ marginTop: 'var(--ds-space-md)' }}>
            Opens a flap in the rear wing when within 1 second of the car ahead, shedding drag and providing a speed boost of up to 15km/h to aid overtaking.
          </p>
        </div>
        <div className="ds-card lkc-system-card">
          <span>ENERGY RECOVERY SYSTEM</span>
          <h3>ERS</h3>
          <p className="text-secondary" style={{ marginTop: 'var(--ds-space-md)' }}>
            Harvests kinetic energy from braking and heat energy from the exhaust, deploying it as an extra 160hp electrical boost for ~33 seconds per lap.
          </p>
        </div>
      </section>

      {/* 9. DID YOU KNOW? */}
      <section className="lkc-editorial-section reveal-on-scroll">
        <div className="ds-section-label" style={{ justifyContent: 'center' }}>DID YOU KNOW?</div>
        <p className="lkc-editorial-text">
          AN F1 CAR GENERATES ENOUGH AERODYNAMIC DOWNFORCE THAT IT COULD THEORETICALLY DRIVE UPSIDE DOWN IN A TUNNEL AT 130 MPH.
        </p>
      </section>

      {/* 10. CIRCUIT KNOWLEDGE */}
      <section className="lkc-circuit-section reveal-on-scroll">
        <div className="ds-section-label">06 / TRACK TYPES</div>
        <h2 style={{ fontSize: '36px', fontWeight: 900 }}>CIRCUIT CHARACTERISTICS</h2>
        
        <div className="lkc-circuit-grid">
          {circuitsToShow.map(trackId => {
            const layout = circuitLayouts[trackId];
            if (!layout) return null;
            return (
              <div key={trackId} className="ds-card lkc-circuit-card">
                <svg viewBox={layout.viewBox} className="ds-circuit-path">
                  <path d={layout.trackPath} />
                </svg>
                <strong style={{ fontSize: '18px', textTransform: 'uppercase' }}>{trackId.replace('_', ' ')}</strong>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Learn;