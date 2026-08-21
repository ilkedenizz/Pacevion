import { useMemo } from 'react';
import { useCalendar, useDriverStandings } from '../hooks/useF1Data';
import { getDriverVisual } from '../data/assets';
import { getCircuitDetails } from '../data/circuitData';
import { HomeCountdown } from '../components/common/HomeCountdown';
import { getNextSession, formatRaceDateRange } from '../utils/raceWeekend';
import CircuitTrack from '../components/common/CircuitTrack';
import './Home.css';



export const Home = () => {
  const { data: calendar, isLoading: isCalendarLoading, isError: isCalendarError, refetch: refetchCalendar } = useCalendar('2026');
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError, refetch: refetchStandings } = useDriverStandings('2026');

  const now = useMemo(() => new Date(), []);

  const nextRace = useMemo(() => {
    if (!calendar || !Array.isArray(calendar) || calendar.length === 0) return null;
    const upcoming = calendar.find(r => new Date(r.date + 'T' + (r.time ? r.time.replace('Z','') : '15:00:00') + 'Z') > now);
    return upcoming || calendar[calendar.length - 1];
  }, [calendar, now]);

  const nextSessionInfo = useMemo(() => {
    return calendar ? getNextSession(calendar) : null;
  }, [calendar, now]);

  

  if (isCalendarError || isStandingsError) {
    return (
      <div className="page home-page fade-in" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', display: 'flex' }}>
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

  if (isCalendarLoading || isStandingsLoading) {
    return (
      <div className="page home-page fade-in" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', display: 'flex' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px', borderRadius: '4px' }} />
      </div>
    );
  }

  if (!nextRace) return null;

  const formattedDate = formatRaceDateRange(nextRace);
  const circuitId = nextRace.Circuit?.circuitId || 'default';
  const cInfo = getCircuitDetails(circuitId);

  const leader = standings && standings.length > 0 ? standings[0] : null;
  const leaderImg = leader ? getDriverVisual(leader.Driver.driverId, 'portrait') : getDriverVisual('norris', 'portrait');

  // Track status mock logic
  // Typically this would come from a live websocket, for now we can just show GREEN
  const trackStatus = "GREEN";

  return (
    <div className="page home-page fade-in">
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
          <div className="editorial-label" style={{ color: 'var(--color-accent)' }}>{nextSessionInfo?.sessionName.toUpperCase()}</div>
          <h2 className="hero-race-name font-heading editorial-headline">{nextRace.raceName}</h2>
          <div className="hero-race-loc font-mono">{nextRace.Circuit?.Location?.locality?.toUpperCase()}</div>
        </div>

        {nextSessionInfo && <HomeCountdown targetDate={nextSessionInfo.sessionDate.toISOString()} />}
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
          <div className="hs-item" style={{ gridColumn: 'span 2' }}>
            <span className="editorial-label">DATE</span>
            <span className="font-mono hs-val" style={{ fontSize: '11px' }}>{formattedDate}</span>
          </div>
          <div className="hs-item">
            <span className="editorial-label">CIRCUIT</span>
            <span className="font-mono hs-val" style={{ fontSize: '10px' }}>{nextRace.Circuit?.circuitName?.toUpperCase()}</span>
          </div>
          <div className="hs-item">
            <span className="editorial-label">LAPS</span>
            <span className="font-mono hs-val">{cInfo.laps}</span>
          </div>
          <div className="hs-item">
            <span className="editorial-label">DISTANCE</span>
            <span className="font-mono hs-val">{cInfo.distance}</span>
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
                <span className="trend-up" style={{ marginLeft: 'auto', fontWeight: 'bold' }}>â†‘</span>
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
              <span className="font-heading editorial-headline m-title" style={{ fontSize: '14px' }}>
                {nextSessionInfo?.sessionName.toUpperCase()}
              </span>
              <span className="font-mono m-val" style={{ fontSize: '12px' }}>
                {nextSessionInfo?.sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', weekday: 'short' }).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="module m-track">
            <div className="m-head">
              <span className="editorial-label">TRACK STATUS</span>
            </div>
            <div className="m-body track-status" data-status={trackStatus}>
              <span className="font-heading editorial-headline m-title status-text">{trackStatus}</span>
              <div className="sector-bars status-bars">
                <div className="s-bar" />
                <div className="s-bar" />
                <div className="s-bar" />
              </div>
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
