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

  if (isCalendarLoading || !nextRace) {
    return <div className="home-page"><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>;
  }

  const raceDate = new Date(nextRace.date);
  const formattedDate = `${raceDate.getDate() - 2}–${raceDate.getDate()} ${raceDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}`;

  return (
    <div className="home-page fade-in">
      
      <header className="home-brand-header">
        <div className="hbh-left">
          <h1 className="hbh-title font-heading editorial-headline">PACEVION</h1>
          <span className="hbh-season font-mono">2026 SEASON</span>
        </div>
        <div className="hbh-status">
          <div className="hbh-dot" />
          <span className="font-mono">SYSTEM ONLINE</span>
        </div>
      </header>

      {/* EDITORIAL HERO */}
      <div className="editorial-hero">
        <div className="eh-bg-grid" />
        <div className="eh-accent-line" />
        
        <div className="eh-circuit-bg">
          <CircuitTrack 
            circuitId={nextRace.Circuit.circuitId}
            circuitName={nextRace.Circuit.circuitName}
            country={nextRace.Circuit.Location.country}
            raceName={nextRace.raceName}
            variant="hero"
          />
        </div>
        
        <div className="eh-content">
          <div className="eh-top">
            <span className="eh-badge font-mono">ROUND {nextRace.round}</span>
            <h2 className="eh-title font-heading editorial-headline">{nextRace.raceName}</h2>
            <h3 className="eh-subtitle font-heading">{nextRace.Circuit.Location.locality}</h3>
          </div>
          
          <div className="eh-bottom">
            <div className="eh-countdown">
              <div className="eh-cd-block">
                <span className="eh-cd-val font-mono editorial-num">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="eh-cd-lbl font-mono editorial-label">DAYS</span>
              </div>
              <div className="eh-cd-block">
                <span className="eh-cd-val font-mono editorial-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="eh-cd-lbl font-mono editorial-label">HOURS</span>
              </div>
              <div className="eh-cd-block">
                <span className="eh-cd-val font-mono editorial-num">{String(timeLeft.mins).padStart(2, '0')}</span>
                <span className="eh-cd-lbl font-mono editorial-label">MIN</span>
              </div>
            </div>
            
            <div className="eh-meta">
              <span className="eh-meta-item font-mono">{formattedDate}</span>
              <span className="eh-meta-item font-mono">{nextRace.Circuit.Location.locality}</span>
              <span className="eh-meta-item font-mono">53 LAPS</span>
              <span className="eh-meta-item font-mono">306.7 KM</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="qs-grid">
        <div className="qs-card">
          <span className="qs-lbl editorial-label">CHAMPIONSHIP LEADER</span>
          <span className="qs-val font-heading editorial-headline">
            {standings?.[0] ? `${standings[0].Driver.givenName[0]}. ${standings[0].Driver.familyName}` : 'L. NORRIS'}
          </span>
        </div>
        <div className="qs-card">
          <span className="qs-lbl editorial-label">CURRENT ROUND</span>
          <span className="qs-val font-heading editorial-headline editorial-num">{nextRace.round}</span>
        </div>
        <div className="qs-card">
          <span className="qs-lbl editorial-label">NEXT SESSION</span>
          <span className="qs-val font-heading editorial-headline">QUALIFYING</span>
        </div>
        <div className="qs-card qs-card-dark">
          <div className="qs-status-dot" />
          <span className="qs-lbl editorial-label">TRACK STATUS</span>
          <span className="qs-val font-heading editorial-headline" style={{ color: '#00FF66' }}>GREEN</span>
        </div>
      </div>

      {/* PODIUM */}
      <div className="home-section">
        <h3 className="hs-title font-heading editorial-headline">RECENT RACE</h3>
        <div className="home-podium">
          <div className="hp-step hp-p2">
            <img src={getDriverVisual('piastri') || ''} alt="Piastri" className="hp-img" />
            <span className="hp-pos editorial-num font-mono">2</span>
            <span className="hp-name font-heading editorial-label">PIASTRI</span>
          </div>
          <div className="hp-step hp-p1">
            <img src={getDriverVisual('leclerc') || ''} alt="Leclerc" className="hp-img" />
            <span className="hp-pos editorial-num font-mono">1</span>
            <span className="hp-name font-heading editorial-label">LECLERC</span>
          </div>
          <div className="hp-step hp-p3">
            <img src={getDriverVisual('norris') || ''} alt="Norris" className="hp-img" />
            <span className="hp-pos editorial-num font-mono">3</span>
            <span className="hp-name font-heading editorial-label">NORRIS</span>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="home-section">
        <h3 className="hs-title font-heading editorial-headline">UPCOMING SESSIONS</h3>
        <div className="home-timeline">
          <div className="htl-row">
            <div className="htl-time font-mono">14:30</div>
            <div className="htl-marker"><div className="htl-dot" /></div>
            <div className="htl-info">
              <span className="htl-name font-heading editorial-headline">PRACTICE 1</span>
              <span className="htl-date font-mono editorial-label">FRI, 05 SEP • FINISHED</span>
            </div>
          </div>
          <div className="htl-row">
            <div className="htl-time font-mono">18:00</div>
            <div className="htl-marker"><div className="htl-dot" /></div>
            <div className="htl-info">
              <span className="htl-name font-heading editorial-headline">PRACTICE 2</span>
              <span className="htl-date font-mono editorial-label">FRI, 05 SEP • FINISHED</span>
            </div>
          </div>
          <div className="htl-row htl-active">
            <div className="htl-time font-mono" style={{ color: 'var(--color-accent)' }}>17:00</div>
            <div className="htl-marker"><div className="htl-dot" /></div>
            <div className="htl-info">
              <span className="htl-name font-heading editorial-headline">QUALIFYING</span>
              <span className="htl-date font-mono editorial-label" style={{ color: 'var(--color-text-primary)' }}>SAT, 06 SEP • UPCOMING</span>
            </div>
          </div>
          <div className="htl-row">
            <div className="htl-time font-mono">16:00</div>
            <div className="htl-marker"><div className="htl-dot" /></div>
            <div className="htl-info">
              <span className="htl-name font-heading editorial-headline">RACE</span>
              <span className="htl-date font-mono editorial-label">SUN, 07 SEP</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
