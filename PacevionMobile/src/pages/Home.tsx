import { useState, useMemo } from 'react';
import { useCalendar, useDriverStandings } from '../hooks/useF1Data';
import { getDriverVisual } from '../data/assets';
import CircuitTrack from '../components/common/CircuitTrack';
import './Home.css';

export const Home = () => {
  const { data: calendar, isLoading: isCalendarLoading } = useCalendar('2026');
  const { data: standings } = useDriverStandings('2026');

  const [timeLeft] = useState({ days: 3, hours: 14, mins: 32 });

  const nextRace = useMemo(() => {
    if (!calendar || calendar.length === 0) return null;
    return calendar.find(r => new Date(r.date) > new Date('2026-08-15')) || calendar[14];
  }, [calendar]);

  if (isCalendarLoading) {
    return <div className="home-page"><div className="skeleton" style={{ height: 320 }} /></div>;
  }

  if (!nextRace) return null;

  return (
    <div className="home-page fade-in">
      
      <header className="brand-header">
        <h1 className="brand-title font-heading">PACEVION</h1>
        <span className="brand-season font-mono">2026 SEASON</span>
      </header>

      {/* HERO */}
      <div className="hero-card">
        <div className="hero-accent-line" />
        <div className="hero-bg-graphic">
          <CircuitTrack 
            circuitId={nextRace.Circuit.circuitId}
            circuitName={nextRace.Circuit.circuitName}
            country={nextRace.Circuit.Location.country}
            raceName={nextRace.raceName}
            variant="hero"
          />
        </div>
        <div className="hero-content">
          <span className="hero-badge font-mono">ROUND {nextRace.round}</span>
          <h2 className="hero-title font-heading">{nextRace.raceName}</h2>
          <h3 className="hero-subtitle font-heading">{nextRace.Circuit.Location.locality}</h3>
          
          <div className="countdown-container font-mono">
            <div className="cd-block">
              <span className="cd-val">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="cd-lbl">DAYS</span>
            </div>
            <div className="cd-block">
              <span className="cd-val">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="cd-lbl">HRS</span>
            </div>
            <div className="cd-block">
              <span className="cd-val">{String(timeLeft.mins).padStart(2, '0')}</span>
              <span className="cd-lbl">MINS</span>
            </div>
          </div>
        </div>
      </div>

      {/* METADATA */}
      <div className="race-metadata-grid">
        <div className="rm-card">
          <span className="rm-lbl font-mono">DATE</span>
          <span className="rm-val font-heading">05-07 SEP</span>
        </div>
        <div className="rm-card">
          <span className="rm-lbl font-mono">CIRCUIT</span>
          <span className="rm-val font-heading">MONZA</span>
        </div>
        <div className="rm-card">
          <span className="rm-lbl font-mono">LAPS</span>
          <span className="rm-val font-heading">53</span>
        </div>
        <div className="rm-card">
          <span className="rm-lbl font-mono">DIST</span>
          <span className="rm-val font-heading">306KM</span>
        </div>
      </div>

      {/* QUICK STATS */}
      <h3 className="section-title font-heading">AT A GLANCE</h3>
      <div className="qs-container">
        <div className="qs-card">
          <span className="qs-title font-mono">CHAMPIONSHIP LEADER</span>
          <span className="qs-value font-heading">
            {standings?.[0] ? `${standings[0].Driver.givenName[0]}. ${standings[0].Driver.familyName}` : 'L. NORRIS'}
          </span>
        </div>
        <div className="qs-card">
          <span className="qs-title font-mono">PREVIOUS WINNER</span>
          <span className="qs-value font-heading">C. LECLERC</span>
        </div>
      </div>

      {/* RECENT RACE PODIUM */}
      <h3 className="section-title font-heading">LAST RACE PODIUM</h3>
      <div className="podium-container">
        {/* P2 */}
        <div className="podium-step p2">
          <span className="podium-name font-heading">PIASTRI</span>
          <img src={getDriverVisual('piastri') || ''} alt="Piastri" className="podium-driver-img" />
          <div className="podium-bar font-mono" style={{ backgroundColor: '#FF8000' }}>2</div>
        </div>
        {/* P1 */}
        <div className="podium-step p1">
          <span className="podium-name font-heading">LECLERC</span>
          <img src={getDriverVisual('leclerc') || ''} alt="Leclerc" className="podium-driver-img" />
          <div className="podium-bar font-mono" style={{ backgroundColor: '#E80020' }}>1</div>
        </div>
        {/* P3 */}
        <div className="podium-step p3">
          <span className="podium-name font-heading">NORRIS</span>
          <img src={getDriverVisual('norris') || ''} alt="Norris" className="podium-driver-img" />
          <div className="podium-bar font-mono" style={{ backgroundColor: '#FF8000' }}>3</div>
        </div>
      </div>

      {/* TIMELINE */}
      <h3 className="section-title font-heading">SESSIONS</h3>
      <div className="timeline-container">
        <div className="timeline-row">
          <span className="tl-time font-mono">14:30</span>
          <div className="tl-dot" />
          <div className="tl-content">
            <span className="tl-title font-heading">PRACTICE 1</span>
            <span className="tl-date font-mono">FRI, 05 SEP</span>
          </div>
        </div>
        <div className="timeline-row">
          <span className="tl-time font-mono">18:00</span>
          <div className="tl-dot" />
          <div className="tl-content">
            <span className="tl-title font-heading">PRACTICE 2</span>
            <span className="tl-date font-mono">FRI, 05 SEP</span>
          </div>
        </div>
        <div className="timeline-row tl-row-active">
          <span className="tl-time font-mono">17:00</span>
          <div className="tl-dot" />
          <div className="tl-content">
            <span className="tl-title font-heading">QUALIFYING</span>
            <span className="tl-date font-mono">SAT, 06 SEP</span>
          </div>
        </div>
        <div className="timeline-row">
          <span className="tl-time font-mono">16:00</span>
          <div className="tl-dot" />
          <div className="tl-content">
            <span className="tl-title font-heading">RACE</span>
            <span className="tl-date font-mono">SUN, 07 SEP</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
