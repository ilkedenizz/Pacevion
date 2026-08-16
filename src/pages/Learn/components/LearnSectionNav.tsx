import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'the-car', num: '01', title: 'THE CAR' },
  { id: 'aero', num: '02', title: 'AERODYNAMICS' },
  { id: 'power', num: '03', title: 'POWER UNIT' },
  { id: 'tyres', num: '04', title: 'TYRES' },
  { id: 'strategy', num: '05', title: 'STRATEGY' },
  { id: 'circuits', num: '06', title: 'CIRCUITS' },
];

const LearnSectionNav: React.FC = () => {
  const [activeId, setActiveId] = useState('the-car');

  useEffect(() => {
    const handleScroll = () => {
      let currentId = 'the-car';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            currentId = section.id;
          }
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="lkc-section-nav">
      <div className="lkc-section-nav-inner">
        {sections.map(s => (
          <button 
            key={s.id} 
            className={`lkc-nav-item ${activeId === s.id ? 'active' : ''}`}
            onClick={() => scrollTo(s.id)}
          >
            <span className="lkc-nav-num">{s.num}</span>
            <span className="lkc-nav-title">{s.title}</span>
            <div className="lkc-nav-indicator" />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default LearnSectionNav;
