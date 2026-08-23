import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useDriverStandings, 
  useConstructorStandings, 
  useRaceResults
} from '../hooks/useF1Data';
import { useRaceState } from '../hooks/useRaceState';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getCircuitDetails } from '../data/circuitData';
import { HomeCountdown } from '../components/common/HomeCountdown';
import { formatRaceDateRange, getCountryFlag, parseSessionDateSecure, isWeekendCompleted } from '../utils/raceWeekend';
import CircuitTrack from '../components/common/CircuitTrack';
import { ChevronRight, Calendar, Radio, Trophy, CheckCircle2, Clock } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const { calendar, isLoading: isCalendarLoading, isError: isCalendarError, now, raceState, refetchCalendar } = useRaceState();
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError, refetch: refetchStandings } = useDriverStandings('2026');
  const { data: constructors } = useConstructorStandings('2026');
  const navigate = useNavigate();

  // If the current weekend is POST_RACE (all sessions done but within 24h), the "next" race for Home is the nextRace
  const isPostRace = raceState?.status === 'POST_RACE';
  const nextRace = isPostRace ? raceState?.nextRace : raceState?.race;
  const nextSessionInfo = isPostRace 
    ? (raceState?.nextRace ? { name: 'Practice 1', date: parseSessionDateSecure(raceState.nextRace.FirstPractice?.date, raceState.nextRace.FirstPractice?.time) || new Date() } : null) 
    : (raceState?.activeSession || raceState?.nextSession);

  const weekendSessions = useMemo(() => {
    if (!raceState) return [];
    
    // If we shifted focus to nextRace, don't show the old race's weekend sessions
    if (isPostRace) return [];

    let foundActive = false;
    return raceState.allSessions.map(s => {
      let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
      if (now > s.endDate) {
        status = 'completed';
      } else if (now >= s.date && now <= s.endDate) {
        foundActive = true;
        status = 'current';
      } else if (!foundActive && now > s.date) {
         status = 'completed';
      }
      return { ...s, status };
    });
  }, [raceState, now, isPostRace]);

  const upcomingRaces = useMemo(() => {
    if (!calendar || calendar.length === 0) return [];
    return calendar.filter(r => {
      const rDate = parseSessionDateSecure(r.date, r.time);
      return rDate && rDate > now && nextRace && r.round !== nextRace.round;
    }).slice(0, 3);
  }, [calendar, now, nextRace]);

  const totalRaces = calendar?.length || 24;
  const completedRacesList = useMemo(() => {
    if (!calendar) return [];
    return calendar.filter(r => isWeekendCompleted(r, now));
  }, [calendar, now]);
  const completedRaces = completedRacesList.length;
  const lastCompletedRace = completedRacesList.length > 0 ? completedRacesList[completedRacesList.length - 1] : null;

  const remainingRaces = Math.max(0, totalRaces - completedRaces);
  const leaderDriver = standings && standings.length > 0 ? standings[0] : null;
  const runnerUpDriver = standings && standings.length > 1 ? standings[1] : null;
  const driverLeadPts = (leaderDriver && runnerUpDriver)
    ? (parseFloat(leaderDriver.points) - parseFloat(runnerUpDriver.points))
    : 0;

  const leaderConstructor = constructors && constructors.length > 0 ? constructors[0] : null;
  const topTeamDetail = leaderConstructor ? getTeamDetails(leaderConstructor.Constructor.constructorId) : null;

  const targetSeason = raceState?.race?.season || '2026';
  const targetRound = raceState?.race?.round || '1';
  const isWeekendActive = raceState?.status && raceState.status !== 'NO_RACE_WEEKEND' && raceState.status !== 'UPCOMING_WEEKEND';
  
  const { data: currentRaceAPI } = useRaceResults(targetSeason, targetRound, isWeekendActive);
  const { data: previousRaceAPI } = useRaceResults(lastCompletedRace?.season || '2026', lastCompletedRace?.round || '0', !isWeekendActive && !!lastCompletedRace);

  let podiumData = null;
  if (!isWeekendActive) {
    if (previousRaceAPI && previousRaceAPI.Results && previousRaceAPI.Results.length > 0) {
      podiumData = previousRaceAPI;
    }
  } else if (currentRaceAPI && currentRaceAPI.Results && currentRaceAPI.Results.length > 0) {
    podiumData = currentRaceAPI;
  }

  if (isCalendarError || isStandingsError) {
    return (
      <div className="page home-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="telemetry-error-box">
          <Radio size={32} color="var(--color-primary)" />
          <h2 className="font-heading editorial-headline" style={{ color: 'var(--color-primary)' }}>TELEMETRY DISCONNECTED</h2>
          <p className="editorial-label">UNABLE TO SYNC WITH RACE CONTROL</p>
          <button 
            onClick={() => { refetchCalendar(); refetchStandings(); }}
            className="retry-btn font-mono"
          >
            RECONNECT TELEMETRY
          </button>
        </div>
      </div>
    );
  }

  if (isCalendarLoading || isStandingsLoading || !nextRace) {
    return (
      <div className="page home-page fade-in">
        <div className="skeleton-header skeleton" style={{ height: 44, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton-hero skeleton" style={{ height: 260, borderRadius: 8, marginBottom: 16 }} />
        <div className="skeleton-card skeleton" style={{ height: 140, borderRadius: 8, marginBottom: 16 }} />
        <div className="skeleton-card skeleton" style={{ height: 160, borderRadius: 8 }} />
      </div>
    );
  }

  const formattedDate = formatRaceDateRange(nextRace);
  const circuitId = nextRace.Circuit?.circuitId || 'default';
  const cInfo = getCircuitDetails(circuitId);
  const flagEmoji = getCountryFlag(nextRace.Circuit?.Location?.country, nextRace.Circuit?.Location?.locality);

  const p1 = podiumData?.Results?.[0];
  const p2 = podiumData?.Results?.[1];
  const p3 = podiumData?.Results?.[2];

  return (
    <div className="page home-page fade-in">
      <header className="home-header">
        <div className="hh-left">
          <h1 className="h-title font-heading editorial-headline">PACEVION</h1>
          <span className="h-season font-mono">2026 SEASON • FIA FORMULA 1</span>
        </div>
        <div className="hh-right">
          <div className="status-dot pulse" />
          <span className="status-badge-text font-mono">LIVE TIMING</span>
        </div>
      </header>

      <section 
        className="hero-section"
        onClick={() => navigate(`/races/2026/${nextRace.round}`)}
        role="button"
        tabIndex={0}
      >
        <div className="hero-top-info">
          <div className="hero-tag-row">
            <span className="hero-session-tag font-mono">
              NEXT GRAND PRIX • ROUND {String(nextRace.round || '1').padStart(2, '0')}
            </span>
            {nextRace.Sprint?.date && (
              <span className="hero-sprint-badge font-mono">SPRINT</span>
            )}
          </div>
          <h2 className="hero-race-name font-heading editorial-headline">{nextRace.raceName}</h2>
          <div className="hero-race-loc">
            <span className="hero-flag">{flagEmoji}</span>
            <span className="hero-loc-text font-mono">
              {nextRace.Circuit?.circuitName?.toUpperCase()}, {nextRace.Circuit?.Location?.locality?.toUpperCase()}
            </span>
          </div>
        </div>

        {nextSessionInfo && (
          <div className="hero-countdown-wrapper">
            <div className="hc-target-label font-mono">
              COUNTDOWN TO {nextSessionInfo.name.toUpperCase()}
            </div>
            <HomeCountdown targetDate={nextSessionInfo.date.toISOString()} />
          </div>
        )}

        <div className="hero-visual-row">
          <div className="hero-circuit-container">
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
          <div className="hero-stats-column">
            <div className="hs-mini-item">
              <span className="editorial-label">DATE</span>
              <span className="font-mono hs-mini-val">{formattedDate}</span>
            </div>
            <div className="hs-mini-item">
              <span className="editorial-label">LAPS</span>
              <span className="font-mono hs-mini-val">{cInfo.laps} LAPS ({cInfo.distance})</span>
            </div>
          </div>
        </div>
      </section>

      {weekendSessions.length > 0 && (
        <section className="dashboard-module weekend-module">
          <div className="module-header">
            <Clock size={14} color="var(--color-primary)" />
            <span className="editorial-label">RACE WEEKEND SCHEDULE</span>
          </div>
          <div className="weekend-session-list">
            {weekendSessions.map((session, idx) => {
              const isCurrent = session.status === 'current';
              const isCompleted = session.status === 'completed';
              return (
                <div 
                  key={idx} 
                  className={`session-row ${isCurrent ? 'session-current' : ''} ${isCompleted ? 'session-completed' : ''}`}
                >
                  <div className="session-name font-heading">{session.name}</div>
                  <div className="session-time font-mono">
                    {isCompleted ? (
                      <span className="session-tag-done">DONE</span>
                    ) : (
                      session.date.toLocaleDateString([], { weekday: 'short' }).toUpperCase() + ' ' +
                      session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    )}
                  </div>
                  <div className="session-status-indicator">
                    {isCompleted ? (
                      <CheckCircle2 size={13} color="var(--color-text-muted)" />
                    ) : isCurrent ? (
                      <div className="status-dot pulse" style={{ background: 'var(--color-success)' }} />
                    ) : (
                      <div className="session-dot-upcoming" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {podiumData && (p1 || p2 || p3) && (
        <section className="dashboard-module podium-module">
          <div className="module-header">
            <Trophy size={14} color="var(--color-primary)" />
            <span className="editorial-label">
              LAST RACE PODIUM • {podiumData.raceName?.toUpperCase() || 'GRAND PRIX'}
            </span>
          </div>
          <div className="podium-grid">
            {p2 && (
              <div className="pod-step p2">
                <div className="pod-avatar-wrap">
                  <img 
                    src={getDriverVisual(p2.Driver.driverId, 'portrait') || ''} 
                    alt={p2.Driver.familyName}
                    className="pod-avatar"
                  />
                  <span className="pod-rank-badge p2-badge font-mono">2</span>
                </div>
                <div className="pod-driver-name font-heading">{p2.Driver.familyName}</div>
                <div 
                  className="pod-team-name font-mono"
                  style={{ color: getTeamDetails(p2.Constructor.constructorId).color }}
                >
                  {p2.Constructor.name}
                </div>
                <div className="pod-pts-tag font-mono">+{p2.points || '18'} PTS</div>
              </div>
            )}
            {p1 && (
              <div className="pod-step p1">
                <div className="pod-avatar-wrap">
                  <img 
                    src={getDriverVisual(p1.Driver.driverId, 'portrait') || ''} 
                    alt={p1.Driver.familyName}
                    className="pod-avatar p1-avatar"
                  />
                  <span className="pod-rank-badge p1-badge font-mono">1</span>
                </div>
                <div className="pod-driver-name p1-name font-heading">{p1.Driver.familyName}</div>
                <div 
                  className="pod-team-name font-mono"
                  style={{ color: getTeamDetails(p1.Constructor.constructorId).color }}
                >
                  {p1.Constructor.name}
                </div>
                <div className="pod-pts-tag p1-pts font-mono">+{p1.points || '25'} PTS</div>
              </div>
            )}
            {p3 && (
              <div className="pod-step p3">
                <div className="pod-avatar-wrap">
                  <img 
                    src={getDriverVisual(p3.Driver.driverId, 'portrait') || ''} 
                    alt={p3.Driver.familyName}
                    className="pod-avatar"
                  />
                  <span className="pod-rank-badge p3-badge font-mono">3</span>
                </div>
                <div className="pod-driver-name font-heading">{p3.Driver.familyName}</div>
                <div 
                  className="pod-team-name font-mono"
                  style={{ color: getTeamDetails(p3.Constructor.constructorId).color }}
                >
                  {p3.Constructor.name}
                </div>
                <div className="pod-pts-tag font-mono">+{p3.points || '15'} PTS</div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="dashboard-module snapshot-module">
        <div className="module-header">
          <span className="editorial-label">2026 SEASON SNAPSHOT</span>
          <span className="font-mono snapshot-progress-tag">
            {completedRaces}/{totalRaces} ROUNDS
          </span>
        </div>
        <div className="snapshot-grid">
          <div 
            className="snapshot-card" 
            onClick={() => navigate('/standings')}
            role="button"
            tabIndex={0}
          >
            <div className="sc-header">
              <span className="editorial-label">DRIVERS LEADER</span>
              <span className="trend-up font-mono">P01</span>
            </div>
            <div className="sc-body">
              <div className="sc-driver-avatar-box">
                <img 
                  src={leaderDriver ? getDriverVisual(leaderDriver.Driver.driverId, 'portrait') : ''} 
                  alt="Leader" 
                  className="sc-driver-avatar"
                />
              </div>
              <div className="sc-info">
                <div className="sc-name font-heading">
                  {leaderDriver ? `${leaderDriver.Driver.givenName} ${leaderDriver.Driver.familyName}` : 'LANDO NORRIS'}
                </div>
                <div className="sc-sub font-mono">
                  {leaderDriver?.Constructors?.[0]?.name?.toUpperCase() || 'MCLAREN'}
                </div>
                <div className="sc-metric-row font-mono">
                  <span className="sc-pts">{leaderDriver?.points || '0'} PTS</span>
                  {driverLeadPts > 0 && (
                    <span className="sc-gap font-mono">+{driverLeadPts} GAP</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div 
            className="snapshot-card" 
            onClick={() => navigate('/standings')}
            role="button"
            tabIndex={0}
          >
            <div className="sc-header">
              <span className="editorial-label">CONSTRUCTORS LEADER</span>
              <span className="trend-up font-mono">P01</span>
            </div>
            <div className="sc-body">
              <div 
                className="sc-team-stripe" 
                style={{ backgroundColor: topTeamDetail?.color || 'var(--color-primary)' }} 
              />
              <div className="sc-info">
                <div className="sc-name font-heading">
                  {leaderConstructor?.Constructor?.name || 'MCLAREN'}
                </div>
                <div className="sc-sub font-mono">
                  {topTeamDetail?.powerUnit || 'MERCEDES'} POWER
                </div>
                <div className="sc-metric-row font-mono">
                  <span className="sc-pts">{leaderConstructor?.points || '0'} PTS</span>
                  <span className="sc-gap font-mono">{remainingRaces} RACES LEFT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {upcomingRaces.length > 0 && (
        <section className="dashboard-module upcoming-module">
          <div className="module-header">
            <Calendar size={14} color="var(--color-primary)" />
            <span className="editorial-label">UPCOMING RACES</span>
            <button 
              onClick={() => navigate('/calendar')} 
              className="view-all-btn font-mono"
            >
              FULL CALENDAR →
            </button>
          </div>
          <div className="upcoming-list">
            {upcomingRaces.map(race => {
              const flag = getCountryFlag(race.Circuit?.Location?.country, race.Circuit?.Location?.locality);
              return (
                <div 
                  key={race.round} 
                  className="upcoming-item" 
                  onClick={() => navigate(`/races/${race.season || '2026'}/${race.round}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="uc-round-box font-mono">
                    <span className="uc-round-lbl">R{String(race.round).padStart(2, '0')}</span>
                    <span className="uc-flag">{flag}</span>
                  </div>
                  <div className="uc-info">
                    <span className="uc-name font-heading">{race.raceName}</span>
                    <span className="uc-loc font-mono">
                      {race.Circuit?.Location?.locality?.toUpperCase()}, {race.Circuit?.Location?.country?.toUpperCase()}
                    </span>
                  </div>
                  <div className="uc-date-tag font-mono">
                    {formatRaceDateRange(race)}
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" className="uc-arrow" />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
