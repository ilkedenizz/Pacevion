import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronRight, MapPin, Calendar as CalendarIcon, Flag } from 'lucide-react';
import { useCalendar, useDriverStandings, useConstructorStandings, useRaceResults } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import CircuitTrack from '../components/common/CircuitTrack';
import './Home.css';

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="hero-countdown-grid">
      <div className="cd-box">
        <span className="cd-num">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="cd-unit">DAYS</span>
      </div>
      <div className="cd-box">
        <span className="cd-num">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="cd-unit">HRS</span>
      </div>
      <div className="cd-box">
        <span className="cd-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="cd-unit">MIN</span>
      </div>
    </div>
  );
};

// Sub-component for Last Race Podium card
const LastRaceWidget: React.FC<{ season: string; round: string; raceName: string; circuitName: string }> = ({
  season,
  round,
  raceName,
  circuitName,
}) => {
  const { data: raceResult, isLoading } = useRaceResults(season, round);
  const results = raceResult?.Results;

  if (isLoading) {
    return (
      <div className="last-race-card skeleton-card">
        <div className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />
      </div>
    );
  }

  const p1 = results?.[0];
  const p2 = results?.[1];
  const p3 = results?.[2];

  return (
    <div className="last-race-card">
      <div className="lr-card-header">
        <span className="lr-badge">LAST RACE</span>
        <span className="lr-round font-mono">RD {round}</span>
      </div>
      <h3 className="lr-title">{raceName}</h3>
      <p className="lr-circuit font-mono">{circuitName}</p>

      {results && results.length > 0 ? (
        <div className="podium-rows">
          {p1 && (
            <div className="podium-row p1-row">
              <span className="podium-pos p1-pos font-mono">P1</span>
              <span className="podium-driver font-heading">
                {p1.Driver.givenName} <strong>{p1.Driver.familyName}</strong>
              </span>
              <span className="podium-team font-mono">{p1.Constructor.name}</span>
            </div>
          )}
          {p2 && (
            <div className="podium-row">
              <span className="podium-pos font-mono">P2</span>
              <span className="podium-driver font-heading">
                {p2.Driver.givenName} <strong>{p2.Driver.familyName}</strong>
              </span>
              <span className="podium-team font-mono">{p2.Constructor.name}</span>
            </div>
          )}
          {p3 && (
            <div className="podium-row">
              <span className="podium-pos font-mono">P3</span>
              <span className="podium-driver font-heading">
                {p3.Driver.givenName} <strong>{p3.Driver.familyName}</strong>
              </span>
              <span className="podium-team font-mono">{p3.Constructor.name}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="no-results-msg font-mono">Awaiting Race Results</div>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: calendar, isLoading: isCalLoading, isError: isCalError } = useCalendar();
  const { data: driverStandings, isLoading: isDrvLoading } = useDriverStandings();
  const { data: constructorStandings, isLoading: isConLoading } = useConstructorStandings();

  const now = useMemo(() => new Date(), []);

  // Compute next race and upcoming races
  const { nextRace, upcomingRaces, lastRace } = useMemo(() => {
    if (!calendar || calendar.length === 0) {
      return { nextRace: null, upcomingRaces: [], lastRace: null };
    }

    const pastRaces = calendar.filter((r) => {
      const timeStr = r.time ? (r.time.endsWith('Z') ? r.time : `${r.time}Z`) : '00:00:00Z';
      return new Date(`${r.date}T${timeStr}`) <= now;
    });

    const futureRaces = calendar.filter((r) => {
      const timeStr = r.time ? (r.time.endsWith('Z') ? r.time : `${r.time}Z`) : '00:00:00Z';
      return new Date(`${r.date}T${timeStr}`) > now;
    });

    const next = futureRaces[0] || null;
    const upcoming = futureRaces.slice(1, 4);
    const last = pastRaces[pastRaces.length - 1] || null;

    return { nextRace: next, upcomingRaces: upcoming, lastRace: last };
  }, [calendar, now]);

  const topDriver = driverStandings?.[0];
  const topDriverTeam = topDriver?.Constructors[0];
  const topDriverTeamDetails = topDriverTeam ? getTeamDetails(topDriverTeam.constructorId) : null;

  const topConstructor = constructorStandings?.[0];
  const topConstructorDetails = topConstructor ? getTeamDetails(topConstructor.Constructor.constructorId) : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase();
  };

  return (
    <div className="home-dashboard">
      {/* Header Branding */}
      <header className="home-header">
        <div className="brand-badge font-mono">PACEVION</div>
        <h1 className="championship-sub font-mono">2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</h1>
      </header>

      {/* NEXT RACE HERO CARD */}
      <section className="hero-section">
        {isCalLoading ? (
          <div className="skeleton-hero skeleton" />
        ) : isCalError || !nextRace ? (
          <div className="hero-card-fallback">
            <span className="hero-badge">NEXT RACE</span>
            <h2 className="hero-gp-title font-heading">2026 SEASON PREPARATION</h2>
            <p className="font-mono text-muted">Awaiting official session dates</p>
          </div>
        ) : (
          <div className="hero-card">
            <div className="hero-top-bar">
              <span className="hero-badge">NEXT RACE</span>
              <span className="hero-round font-mono">ROUND {String(nextRace.round).padStart(2, '0')}</span>
            </div>

            <div className="hero-main-body">
              <div className="hero-text-content">
                <h2 className="hero-gp-title font-heading">{nextRace.raceName}</h2>
                <div className="hero-meta-row font-mono">
                  <span className="hero-meta-item">
                    <MapPin size={12} className="meta-icon" />
                    {nextRace.Circuit.Location.country}
                  </span>
                  <span className="hero-meta-item text-muted">
                    {nextRace.Circuit.circuitName}
                  </span>
                </div>

                <div className="hero-countdown-wrapper">
                  <span className="cd-header-lbl font-mono">RACE START IN</span>
                  <Countdown targetDate={`${nextRace.date}T${nextRace.time || '00:00:00Z'}`} />
                </div>
              </div>

              {/* Circuit SVG Graphic */}
              <div className="hero-track-container">
                <CircuitTrack
                  circuitId={nextRace.Circuit.circuitId}
                  circuitName={nextRace.Circuit.circuitName}
                  country={nextRace.Circuit.Location.country}
                  raceName={nextRace.raceName}
                  variant="hero"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* QUICK STATS (CHAMPIONSHIP LEADERS) */}
      <section className="quick-stats-section">
        <div className="quick-stats-grid">
          {/* Driver Leader */}
          <div
            className="stat-leader-card"
            onClick={() => navigate('/standings')}
            style={{ borderLeftColor: topDriverTeamDetails?.color || 'var(--color-accent)' }}
          >
            <div className="stat-card-header">
              <span className="stat-card-lbl font-mono">DRIVER CHAMPIONSHIP</span>
              <Trophy size={14} className="stat-icon" />
            </div>

            {isDrvLoading ? (
              <div className="skeleton" style={{ height: '40px', marginTop: '8px' }} />
            ) : topDriver ? (
              <div className="stat-card-body">
                <div className="leader-info">
                  <span className="leader-rank font-mono">P1</span>
                  <span className="leader-name font-heading">
                    {topDriver.Driver.givenName} <strong>{topDriver.Driver.familyName}</strong>
                  </span>
                </div>
                <div className="leader-pts font-heading">
                  {topDriver.points} <span className="pts-unit font-mono">PTS</span>
                </div>
              </div>
            ) : (
              <div className="stat-card-empty font-mono">No standings data</div>
            )}
          </div>

          {/* Constructor Leader */}
          <div
            className="stat-leader-card"
            onClick={() => navigate('/standings')}
            style={{ borderLeftColor: topConstructorDetails?.color || 'var(--color-accent)' }}
          >
            <div className="stat-card-header">
              <span className="stat-card-lbl font-mono">CONSTRUCTOR CHAMPIONSHIP</span>
              <Trophy size={14} className="stat-icon" />
            </div>

            {isConLoading ? (
              <div className="skeleton" style={{ height: '40px', marginTop: '8px' }} />
            ) : topConstructor ? (
              <div className="stat-card-body">
                <div className="leader-info">
                  <span className="leader-rank font-mono">P1</span>
                  <span className="leader-name font-heading">
                    <strong>{topConstructor.Constructor.name}</strong>
                  </span>
                </div>
                <div className="leader-pts font-heading">
                  {topConstructor.points} <span className="pts-unit font-mono">PTS</span>
                </div>
              </div>
            ) : (
              <div className="stat-card-empty font-mono">No standings data</div>
            )}
          </div>
        </div>
      </section>

      {/* LAST RACE PODIUM */}
      {lastRace && (
        <section className="last-race-section">
          <LastRaceWidget
            season={lastRace.season}
            round={lastRace.round}
            raceName={lastRace.raceName}
            circuitName={lastRace.Circuit.circuitName}
          />
        </section>
      )}

      {/* UPCOMING RACES CAROUSEL */}
      {upcomingRaces.length > 0 && (
        <section className="upcoming-section">
          <div className="section-header-row">
            <h3 className="section-title font-mono">UPCOMING EVENTS</h3>
            <button className="view-all-link font-mono" onClick={() => navigate('/calendar')}>
              ALL RACES <ChevronRight size={14} />
            </button>
          </div>

          <div className="upcoming-carousel">
            {upcomingRaces.map((race) => (
              <div
                key={`${race.season}-${race.round}`}
                className="upcoming-card"
                onClick={() => navigate('/calendar')}
              >
                <div className="up-card-top font-mono">
                  <span className="up-round">RD {String(race.round).padStart(2, '0')}</span>
                  <span className="up-date">
                    <CalendarIcon size={10} style={{ marginRight: '3px' }} />
                    {formatDate(race.date)}
                  </span>
                </div>
                <h4 className="up-title font-heading">{race.raceName}</h4>
                <p className="up-circuit font-mono">
                  <Flag size={10} style={{ marginRight: '4px' }} />
                  {race.Circuit.Location.country}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
