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
  const formattedDate = `${raceDate.getDate() - 2}—${String(raceDate.getDate()).padStart(2, '0')} ${raceDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}`;

  return (
    <div className="home-page fade-in">
      
      <header className="home-brand-header">
        <div className="hbh-left">
          <h1 className="hbh-title font-heading editorial-headline">PACEVION</h1>
          <span className="hbh-season font-mono">F1 2026</span>
        </div>
        <div className="hbh-status">
          <div className="hbh-pulse-dot" />
          <span className="font-mono">SYSTEM ONLINE</span>
        </div>
      </header>

      {/* EDITORIAL BROADCAST HERO */}
      <div className="home-broadcast-hero">
        <div className="hbh-grid-bg" />
        <div className="hbh-accent-top" />
        
        <div className="hbh-circuit-wrapper">
          <CircuitTrack 
            circuitId={nextRace.Circuit.circuitId}
            circuitName={nextRace.Circuit.circuitName}
            country={nextRace.Circuit.Location.country}
            raceName={nextRace.raceName}
            variant="hero"
          />
        </div>

        <div className="hbh-content">
          <div className="hbh-top">
            <div className="hbh-badge font-mono">NEXT RACE</div>
            <h2 className="hbh-race-name font-heading editorial-headline">{nextRace.raceName}</h2>
            <div className="hbh-race-loc font-mono">{nextRace.Circuit.Location.locality} // ROUND {nextRace.round.padStart(2, '0')}</div>
          </div>

          <div className="hbh-middle">
            <div className="hbh-cd-group">
              <div className="hbh-cd-item">
                <span className="hbh-cd-num font-mono editorial-num">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="hbh-cd-lbl editorial-label">DAYS</span>
              </div>
              <div className="hbh-cd-item">
                <span className="hbh-cd-num font-mono editorial-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="hbh-cd-lbl editorial-label">HOURS</span>
              </div>
              <div className="hbh-cd-item">
                <span className="hbh-cd-num font-mono editorial-num">{String(timeLeft.mins).padStart(2, '0')}</span>
                <span className="hbh-cd-lbl editorial-label">MIN</span>
              </div>
            </div>
          </div>

          <div className="hbh-bottom">
            <div className="hbh-meta-box">
              <span className="editorial-label">DATE</span>
              <span className="font-mono hbh-meta-val">{formattedDate}</span>
            </div>
            <div className="hbh-meta-box">
              <span className="editorial-label">LAPS</span>
              <span className="font-mono hbh-meta-val">53</span>
            </div>
            <div className="hbh-meta-box">
              <span className="editorial-label">LENGTH</span>
              <span className="font-mono hbh-meta-val">306.7 KM</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC VISUAL MODULES */}
      <div className="home-modules-grid">
        <div className="hm-card hm-championship">
          <div className="hm-header">
            <span className="editorial-label">CHAMPIONSHIP</span>
            <span className="editorial-label hm-trend">↑ P1</span>
          </div>
          <div className="hm-body">
            <img src={getDriverVisual(standings?.[0]?.Driver?.driverId || 'norris') || ''} className="hm-avatar" alt="Leader" />
            <div className="hm-info">
              <span className="font-heading editorial-headline hm-name">
                {standings?.[0] ? `${standings[0].Driver.givenName[0]}. ${standings[0].Driver.familyName}` : 'L. NORRIS'}
              </span>
              <span className="font-mono editorial-num hm-pts">{standings?.[0]?.points || 285} PTS</span>
            </div>
          </div>
        </div>

        <div className="hm-card hm-session">
          <div className="hm-header">
            <span className="editorial-label">NEXT SESSION</span>
          </div>
          <div className="hm-body hm-col">
            <span className="font-heading editorial-headline hm-title">QUALIFYING</span>
            <span className="font-mono hm-time">FRI 14:00</span>
          </div>
        </div>

        <div className="hm-card hm-track">
          <div className="hm-header">
            <span className="editorial-label">TRACK STATUS</span>
            <div className="hm-status-dot green" />
          </div>
          <div className="hm-body hm-col">
            <span className="font-heading editorial-headline hm-title" style={{ color: '#00FF66' }}>CLEAR</span>
            <div className="hm-sectors">
              <div className="hm-sector s-green" />
              <div className="hm-sector s-green" />
              <div className="hm-sector s-green" />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT RACE PODIUM */}
      <div className="home-section">
        <h3 className="hs-title font-heading editorial-headline">LAST RACE PODIUM</h3>
        <div className="home-podium-v2">
          <div className="hp2-step hp2-p2">
            <div className="hp2-img-wrap"><img src={getDriverVisual('piastri') || ''} alt="P2" /></div>
            <div className="hp2-num font-mono editorial-num">2</div>
            <div className="hp2-team-line" style={{ background: '#FF8000' }} />
          </div>
          <div className="hp2-step hp2-p1">
            <div className="hp2-img-wrap"><img src={getDriverVisual('leclerc') || ''} alt="P1" /></div>
            <div className="hp2-num font-mono editorial-num">1</div>
            <div className="hp2-team-line" style={{ background: '#E80020' }} />
          </div>
          <div className="hp2-step hp2-p3">
            <div className="hp2-img-wrap"><img src={getDriverVisual('norris') || ''} alt="P3" /></div>
            <div className="hp2-num font-mono editorial-num">3</div>
            <div className="hp2-team-line" style={{ background: '#FF8000' }} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
