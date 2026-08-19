import { useState, useMemo, useEffect } from 'react';
import { useCalendar, useDriverStandings } from '../hooks/useF1Data';
import { getDriverVisual } from '../data/assets';
import CircuitTrack from '../components/common/CircuitTrack';
import './Home.css';

export const Home = () => {
  const { data: calendar, isLoading: isCalendarLoading, isError: isCalendarError, refetch: refetchCalendar } = useCalendar('2026');
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError, refetch: refetchStandings } = useDriverStandings('2026');

  const [now, setNow] = useState(new Date());

  // Proper timer lifecycle
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const nextRace = useMemo(() => {
    if (!calendar || !Array.isArray(calendar) || calendar.length === 0) return null;
    // Find the next race in the future, or default to the last race if season is over
    const upcoming = calendar.find(r => new Date(r.date + 'T' + (r.time || '15:00:00Z')) > now);
    return upcoming || calendar[calendar.length - 1];
  }, [calendar, now]);

  const timeLeft = useMemo(() => {
    if (!nextRace) return { days: 0, hours: 0, mins: 0 };
    const raceTime = new Date(nextRace.date + 'T' + (nextRace.time || '15:00:00Z')).getTime();
    const diff = raceTime - now.getTime();
    
    if (diff <= 0) return { days: 0, hours: 0, mins: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, mins };
  }, [nextRace, now]);

  // Error Boundary Fallback
  if (isCalendarError || isStandingsError) {
    return (
      <div className="home-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="font-heading editorial-headline" style={{ color: 'var(--color-accent)' }}>RACE DATA UNAVAILABLE</h2>
          <p className="editorial-label">UNABLE TO CONNECT TO TELEMETRY</p>
          <button 
            onClick={() => { refetchCalendar(); refetchStandings(); }}
            style={{ 
              background: 'var(--color-surface-elevated)', 
              color: '#fff', 
              border: '1px solid var(--color-border)', 
              padding: '12px 24px', 
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 'bold',
              marginTop: '16px'
            }}
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  // Loading State
  if (isCalendarLoading || isStandingsLoading || !nextRace) {
    return (
      <div className="home-page fade-in">
        <header className="home-brand-header">
          <div className="hbh-left">
            <h1 className="hbh-title font-heading editorial-headline">PACEVION</h1>
            <span className="hbh-season font-mono">LOADING...</span>
          </div>
        </header>
        <div className="skeleton" style={{ height: '420px', borderRadius: '12px' }} />
        <div className="home-modules-grid">
          <div className="skeleton" style={{ height: '100px', gridColumn: 'span 2', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '100px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '100px', borderRadius: '8px' }} />
        </div>
      </div>
    );
  }

  const raceDateObj = new Date(nextRace.date);
  const formattedDate = `${String(raceDateObj.getDate()).padStart(2, '0')} ${raceDateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}`;

  const leader = standings && standings.length > 0 ? standings[0] : null;
  const leaderImg = leader ? getDriverVisual(leader.Driver.driverId) : getDriverVisual('norris');

  return (
    <div className="home-page fade-in">
      
      <header className="home-brand-header">
        <div className="hbh-left">
          <h1 className="hbh-title font-heading editorial-headline">PACEVION</h1>
          <span className="hbh-season font-mono">F1 {nextRace.season || '2026'}</span>
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
        
        {nextRace.Circuit && (
          <div className="hbh-circuit-wrapper">
            <CircuitTrack 
              circuitId={nextRace.Circuit.circuitId}
              circuitName={nextRace.Circuit.circuitName}
              country={nextRace.Circuit.Location?.country || 'Unknown'}
              raceName={nextRace.raceName}
              variant="hero"
            />
          </div>
        )}

        <div className="hbh-content">
          <div className="hbh-top">
            <div className="hbh-badge font-mono">NEXT RACE</div>
            <h2 className="hbh-race-name font-heading editorial-headline">{nextRace.raceName || 'TBC'}</h2>
            <div className="hbh-race-loc font-mono">{nextRace.Circuit?.Location?.locality || 'Unknown'} // ROUND {String(nextRace.round || '1').padStart(2, '0')}</div>
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
            <img src={leaderImg || ''} className="hm-avatar" alt="Leader" />
            <div className="hm-info">
              <span className="font-heading editorial-headline hm-name">
                {leader ? `${leader.Driver.givenName[0]}. ${leader.Driver.familyName}` : 'L. NORRIS'}
              </span>
              <span className="font-mono editorial-num hm-pts">{leader?.points || 285} PTS</span>
            </div>
          </div>
        </div>

        <div className="hm-card hm-session">
          <div className="hm-header">
            <span className="editorial-label">NEXT SESSION</span>
          </div>
          <div className="hm-body hm-col">
            <span className="font-heading editorial-headline hm-title">RACE</span>
            <span className="font-mono hm-time">SUN 15:00</span>
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
