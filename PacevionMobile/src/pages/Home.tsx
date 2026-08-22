import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useCalendar, 
  useDriverStandings, 
  useConstructorStandings, 
  useLatestRaceResults 
} from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getCircuitDetails } from '../data/circuitData';
import { HomeCountdown } from '../components/common/HomeCountdown';
import { getNextSession, formatRaceDateRange, getCountryFlag } from '../utils/raceWeekend';
import CircuitTrack from '../components/common/CircuitTrack';
import { ChevronRight, Calendar, Radio, Trophy, CheckCircle2, Clock } from 'lucide-react';
import './Home.css';


interface WeekendSession {
  name: string;
  shortName: string;
  date: Date;
  status: 'completed' | 'current' | 'upcoming';
}

const parseSessionDate = (d?: string, t?: string): Date | null => {
  if (!d) return null;
  const time = t ? t.replace('Z', '') : '00:00:00';
  return new Date(`${d}T${time}Z`);
};

export const Home: React.FC = () => {
  const { data: calendar, isLoading: isCalendarLoading, isError: isCalendarError, refetch: refetchCalendar } = useCalendar('2026');
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError, refetch: refetchStandings } = useDriverStandings('2026');
  const { data: constructors } = useConstructorStandings('2026');
  const { data: latestRace } = useLatestRaceResults();
  const navigate = useNavigate();

  const now = useMemo(() => new Date(), []);

  const nextRace = useMemo(() => {
    if (!calendar || !Array.isArray(calendar) || calendar.length === 0) return null;
    const upcoming = calendar.find(r => {
      const raceDate = parseSessionDate(r.date, r.time);
      return raceDate && raceDate > now;
    });
    return upcoming || calendar[calendar.length - 1];
  }, [calendar, now]);

  const nextSessionInfo = useMemo(() => {
    return calendar ? getNextSession(calendar, now) : null;
  }, [calendar, now]);

  const weekendSessions = useMemo((): WeekendSession[] => {
    if (!nextRace) return [];
    const list: { name: string; shortName: string; date: Date }[] = [];

    const fp1 = parseSessionDate(nextRace.FirstPractice?.date, nextRace.FirstPractice?.time);
    if (fp1) list.push({ name: 'Practice 1', shortName: 'FP1', date: fp1 });

    if (nextRace.Sprint) {
      const sq = parseSessionDate(nextRace.SprintQualifying?.date, nextRace.SprintQualifying?.time);
      if (sq) list.push({ name: 'Sprint Qualifying', shortName: 'SQ', date: sq });
      const sprint = parseSessionDate(nextRace.Sprint?.date, nextRace.Sprint?.time);
      if (sprint) list.push({ name: 'Sprint Race', shortName: 'SPRINT', date: sprint });
      const qual = parseSessionDate(nextRace.Qualifying?.date, nextRace.Qualifying?.time);
      if (qual) list.push({ name: 'Qualifying', shortName: 'QUALIFYING', date: qual });
    } else {
      const fp2 = parseSessionDate(nextRace.SecondPractice?.date, nextRace.SecondPractice?.time);
      if (fp2) list.push({ name: 'Practice 2', shortName: 'FP2', date: fp2 });
      const fp3 = parseSessionDate(nextRace.ThirdPractice?.date, nextRace.ThirdPractice?.time);
      if (fp3) list.push({ name: 'Practice 3', shortName: 'FP3', date: fp3 });
      const qual = parseSessionDate(nextRace.Qualifying?.date, nextRace.Qualifying?.time);
      if (qual) list.push({ name: 'Qualifying', shortName: 'QUALIFYING', date: qual });
    }

    const mainRaceDate = parseSessionDate(nextRace.date, nextRace.time);
    if (mainRaceDate) list.push({ name: 'Grand Prix', shortName: 'GRAND PRIX', date: mainRaceDate });

    list.sort((a, b) => a.date.getTime() - b.date.getTime());

    let foundActive = false;
    return list.map(s => {
      if (s.date < now) {
        return { ...s, status: 'completed' as const };
      }
      if (!foundActive) {
        foundActive = true;
        return { ...s, status: 'current' as const };
      }
      return { ...s, status: 'upcoming' as const };
    });
  }, [nextRace, now]);

  const upcomingRaces = useMemo(() => {
    if (!calendar || calendar.length === 0) return [];
    return calendar.filter(r => {
      const rDate = parseSessionDate(r.date, r.time);
      return rDate && rDate > now && nextRace && r.round !== nextRace.round;
    }).slice(0, 3);
  }, [calendar, now, nextRace]);

  const totalRaces = calendar?.length || 24;
  const completedRaces = useMemo(() => {
    if (!calendar) return 0;
    return calendar.filter(r => {
      const rDate = parseSessionDate(r.date, r.time);
      return rDate && rDate <= now;
    }).length;
  }, [calendar, now]);

  const remainingRaces = Math.max(0, totalRaces - completedRaces);

  const leaderDriver = standings && standings.length > 0 ? standings[0] : null;
  const runnerUpDriver = standings && standings.length > 1 ? standings[1] : null;
  const driverLeadPts = (leaderDriver && runnerUpDriver)
    ? (parseFloat(leaderDriver.points) - parseFloat(runnerUpDriver.points))
    : 0;

  const leaderConstructor = constructors && constructors.length > 0 ? constructors[0] : null;
  const topTeamDetail = leaderConstructor ? getTeamDetails(leaderConstructor.Constructor.constructorId) : null;

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

  const p1 = latestRace?.Results?.[0];
  const p2 = latestRace?.Results?.[1];
  const p3 = latestRace?.Results?.[2];

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
            {nextRace.Sprint && (
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
              COUNTDOWN TO {nextSessionInfo.sessionName.toUpperCase()}
            </div>
            <HomeCountdown targetDate={nextSessionInfo.sessionDate.toISOString()} />
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

      {latestRace && (p1 || p2 || p3) && (
        <section className="dashboard-module podium-module">
          <div className="module-header">
            <Trophy size={14} color="var(--color-primary)" />
            <span className="editorial-label">
              LAST RACE PODIUM • {latestRace.raceName?.toUpperCase() || 'GRAND PRIX'}
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
