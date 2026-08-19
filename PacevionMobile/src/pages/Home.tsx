import { useState, useMemo, useEffect } from 'react';
import { useCalendar, useDriverStandings } from '../hooks/useF1Data';
import { getDriverVisual } from '../data/assets';
import CircuitTrack from '../components/common/CircuitTrack';
import './Home.css';

export const Home = () => {
  const { data: calendar, isLoading: isCalendarLoading, isError: isCalendarError, refetch: refetchCalendar } = useCalendar('2026');
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError, refetch: refetchStandings } = useDriverStandings('2026');

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const nextRace = useMemo(() => {
    if (!calendar || !Array.isArray(calendar) || calendar.length === 0) return null;
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

  if (isCalendarError || isStandingsError) {
    return (
      <div className="home-page fade-in" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', display: 'flex' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <h2 className="font-heading editorial-headline" style={{ color: 'var(--color-accent)' }}>TELEMETRY LOST</h2>
          <p className="editorial-label">UNABLE TO CONNECT TO RACE CONTROL</p>
          <button 
            onClick={() => { refetchCalendar(); refetchStandings(); }}
            className="retry-btn font-mono"
          >
            RECONNECT
          </button>
        </div>
      </div>
    );
  }

  if (isCalendarLoading || isStandingsLoading || !nextRace) {
    return (
      <div className="home-page fade-in">
        <header className="home-header">
          <h1 className="h-title font-heading editorial-headline">PACEVION</h1>
          <span className="h-season font-mono">2026 SEASON</span>
        </header>
        <div className="skeleton" style={{ height: '500px', borderRadius: '0' }} />
      </div>
    );
  }

  const raceDateObj = new Date(nextRace.date);
  const formattedDate = `${String(raceDateObj.getDate()).padStart(2, '0')} ${raceDateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()} ${raceDateObj.getFullYear()}`;

  const leader = standings && standings.length > 0 ? standings[0] : null;
  const leaderImg = leader ? getDriverVisual(leader.Driver.driverId, 'portrait') : getDriverVisual('norris', 'portrait');

  return (
    <div className="home-page fade-in">
      <header className="home-header">
        <div className="hh-left">
          <h1 className="h-title font-heading editorial-headline">PACEVION</h1>
          <span className="h-season font-mono">2026 SEASON</span>
        </div>
        <div className="hh-right">
          <div className="status-dot pulse" />
          <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>ONLINE</span>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-top-info">
          <div className="editorial-label" style={{ color: 'var(--color-accent)' }}>NEXT RACE</div>
          <h2 className="hero-race-name font-heading editorial-headline">{nextRace.raceName}</h2>
          <div className="hero-race-loc font-mono">{nextRace.Circuit?.Location?.locality?.toUpperCase()}</div>
        </div>

        <div className="hero-countdown">
          <div className="cd-box">
            <span className="cd-num font-mono editorial-num">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="cd-lbl editorial-label">DAYS</span>
          </div>
          <div className="cd-sep">:</div>
          <div className="cd-box">
            <span className="cd-num font-mono editorial-num">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="cd-lbl editorial-label">HOURS</span>
          </div>
          <div className="cd-sep">:</div>
          <div className="cd-box">
            <span className="cd-num font-mono editorial-num">{String(timeLeft.mins).padStart(2, '0')}</span>
            <span className="cd-lbl editorial-label">MIN</span>
          </div>
        </div>

        <div className="hero-circuit-container">
          <div className="circuit-bg-glow" />
          {nextRace.Circuit && (
            <CircuitTrack 
              circuitId={nextRace.Circuit.circuitId}
              circuitName={nextRace.Circuit.circuitName}
              country={nextRace.Circuit.Location?.country || 'Unknown'}
              raceName={nextRace.raceName}
              variant="hero"
            />
          )}
        </div>

        <div className="hero-stats-grid">
          <div className="hs-item">
            <span className="editorial-label">ROUND</span>
            <span className="font-mono hs-val">{String(nextRace.round || '1').padStart(2, '0')}</span>
          </div>
          <div className="hs-item">
            <span className="editorial-label">DATE</span>
            <span className="font-mono hs-val">{formattedDate}</span>
          </div>
          <div className="hs-item">
            <span className="editorial-label">CIRCUIT</span>
            <span className="font-mono hs-val" style={{ fontSize: '10px' }}>{nextRace.Circuit?.circuitName?.toUpperCase()}</span>
          </div>
          <div className="hs-item">
            <span className="editorial-label">LAPS</span>
            <span className="font-mono hs-val">53</span>
          </div>
          <div className="hs-item">
            <span className="editorial-label">DISTANCE</span>
            <span className="font-mono hs-val">306.7 KM</span>
          </div>
        </div>
      </section>

      <section className="modules-grid">
        <div className="module m-leader">
          <div className="m-head">
            <span className="editorial-label">CHAMPIONSHIP LEADER</span>
          </div>
          <div className="m-body leader-body">
            <div className="leader-info">
              <span className="font-heading editorial-headline leader-name">
                {leader ? `${leader.Driver.givenName} ${leader.Driver.familyName}` : 'LANDO NORRIS'}
              </span>
              <div className="leader-pts-row">
                <span className="font-mono editorial-num leader-pts">{leader?.points || 285}</span>
                <span className="editorial-label">PTS</span>
                <span className="trend-up" style={{ marginLeft: 'auto', fontWeight: 'bold' }}>↑</span>
              </div>
            </div>
            <div className="leader-img-box">
              <img src={leaderImg || ''} className="leader-portrait" alt="Leader" />
            </div>
          </div>
        </div>

        <div className="module-row">
          <div className="module m-session">
            <div className="m-head">
              <span className="editorial-label">NEXT SESSION</span>
            </div>
            <div className="m-body">
              <span className="font-heading editorial-headline m-title">QUALIFYING</span>
              <span className="font-mono m-val">FRI 14:00</span>
            </div>
          </div>
          <div className="module m-track">
            <div className="m-head">
              <span className="editorial-label">TRACK STATUS</span>
            </div>
            <div className="m-body">
              <span className="font-heading editorial-headline m-title" style={{ color: '#00FF66' }}>GREEN</span>
              <div className="sector-bars">
                <div className="s-bar green" />
                <div className="s-bar green" />
                <div className="s-bar green" />
              </div>
            </div>
          </div>
        </div>

        <div className="module m-timeline">
          <div className="m-head">
            <span className="editorial-label">WEEKEND TIMELINE</span>
          </div>
          <div className="timeline-list">
            <div className="tl-item done">
              <span className="tl-dot" />
              <span className="font-mono tl-name">PRACTICE 1</span>
              <span className="font-mono tl-time">FRI 12:30</span>
            </div>
            <div className="tl-item active">
              <span className="tl-dot pulse" />
              <span className="font-mono tl-name" style={{ color: '#fff' }}>QUALIFYING</span>
              <span className="font-mono tl-time" style={{ color: '#fff' }}>FRI 16:00</span>
            </div>
            <div className="tl-item">
              <span className="tl-dot" />
              <span className="font-mono tl-name">PRACTICE 2</span>
              <span className="font-mono tl-time">SAT 12:30</span>
            </div>
            <div className="tl-item">
              <span className="tl-dot" />
              <span className="font-mono tl-name">RACE</span>
              <span className="font-mono tl-time">SUN 15:00</span>
            </div>
          </div>
        </div>

        <div className="module m-podium">
          <div className="m-head">
            <span className="editorial-label">LAST RACE PODIUM</span>
          </div>
          <div className="podium-grid">
            <div className="pod-step p2">
              <img src={getDriverVisual('piastri', 'portrait')} alt="P2" />
              <div className="pod-bar" style={{ background: '#FF8000' }}>
                <span className="font-mono">2</span>
              </div>
            </div>
            <div className="pod-step p1">
              <img src={getDriverVisual('leclerc', 'portrait')} alt="P1" />
              <div className="pod-bar" style={{ background: '#E80020' }}>
                <span className="font-mono">1</span>
              </div>
            </div>
            <div className="pod-step p3">
              <img src={getDriverVisual('norris', 'portrait')} alt="P3" />
              <div className="pod-bar" style={{ background: '#FF8000' }}>
                <span className="font-mono">3</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
