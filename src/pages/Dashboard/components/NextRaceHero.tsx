import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Radio } from 'lucide-react';
import { useRaceState } from '../../../hooks/useRaceState';
import { parseSessionDateSecure } from '../../../utils/raceWeekend';
import ErrorState from '../../../components/ui/ErrorState';
import CircuitTrack from '../../../components/ui/CircuitTrack';
import './NextRaceHero.css';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

const NextRaceHero: React.FC = () => {
  const { calendar, raceState, isLoading, isError, refetchCalendar, now } = useRaceState();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  const isPostRace = raceState?.status === 'POST_RACE';
  const currentRace = raceState?.race;
  const nextRace = raceState?.nextRace;

  // Determine target displayed race
  const displayedRace = useMemo(() => {
    if (isPostRace && nextRace) return nextRace;
    if (currentRace) return currentRace;
    if (nextRace) return nextRace;
    if (calendar && calendar.length > 0) return calendar[0];
    return null;
  }, [isPostRace, nextRace, currentRace, calendar]);

  const isLive = raceState?.status === 'ACTIVE_SESSION' && raceState.race?.round === displayedRace?.round;

  // Determine target session to countdown to
  const targetSession = useMemo(() => {
    if (!raceState || !displayedRace) return null;

    if (isLive && raceState.activeSession) {
      return raceState.activeSession;
    }

    if (raceState.race?.round === displayedRace.round) {
      if (raceState.status === 'WAITING_FOR_SESSION' && raceState.nextSession) {
        return raceState.nextSession;
      }
      if (raceState.status === 'UPCOMING_WEEKEND') {
        return raceState.nextSession || raceState.allSessions[0] || null;
      }
      if (raceState.allSessions && raceState.allSessions.length > 0) {
        const nextInWeekend = raceState.allSessions.find(s => s.date.getTime() > now.getTime());
        if (nextInWeekend) return nextInWeekend;
      }
    }

    // Default for nextRace / future race
    if (displayedRace.FirstPractice?.date) {
      const d = parseSessionDateSecure(displayedRace.FirstPractice.date, displayedRace.FirstPractice.time);
      if (d) return { name: 'Practice 1', shortName: 'FP1', type: 'PRACTICE' as const, date: d, endDate: new Date(d.getTime() + 3600000) };
    }

    const raceDate = parseSessionDateSecure(displayedRace.date, displayedRace.time);
    if (raceDate) {
      return { name: 'Race', shortName: 'RACE', type: 'RACE' as const, date: raceDate, endDate: new Date(raceDate.getTime() + 7200000) };
    }

    return null;
  }, [raceState, displayedRace, isLive, now]);

  const targetDate = targetSession?.date || (displayedRace ? parseSessionDateSecure(displayedRace.date, displayedRace.time) : null);

  useEffect(() => {
    if (!targetDate || isLive) {
      return;
    }

    const calculateTime = () => {
      const difference = targetDate.getTime() - Date.now();

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, isLive]);

  const badgeText = useMemo(() => {
    if (!raceState) return 'NEXT RACE';
    if (isLive && raceState.activeSession) {
      return `${raceState.activeSession.name.toUpperCase()} • LIVE`;
    }
    if (raceState.race?.round === displayedRace?.round) {
      if (raceState.status === 'WAITING_FOR_SESSION' && raceState.nextSession) {
        return `NEXT: ${raceState.nextSession.name.toUpperCase()}`;
      }
      if (raceState.status === 'UPCOMING_WEEKEND') {
        return 'UPCOMING WEEKEND';
      }
    }
    if (isPostRace && !nextRace) {
      return 'SEASON COMPLETED';
    }
    return 'NEXT GRAND PRIX';
  }, [raceState, displayedRace, isLive, isPostRace, nextRace]);

  const countdownLabel = useMemo(() => {
    if (!targetSession) return 'COUNTDOWN TO GRAND PRIX';
    return `COUNTDOWN TO ${targetSession.name.toUpperCase()}`;
  }, [targetSession]);

  const handleActionClick = () => {
    if (isLive) {
      navigate('/live');
    } else if (displayedRace) {
      navigate(`/races/${displayedRace.season}/${displayedRace.round}`);
    }
  };

  const actionBtnText = useMemo(() => {
    if (isLive) return 'WATCH LIVE TIMING';
    if (isPostRace && !nextRace) return 'VIEW RACE RESULTS';
    return 'VIEW RACE DETAILS';
  }, [isLive, isPostRace, nextRace]);

  if (isLoading) {
    return (
      <div className="hero-broadcast-panel loading">
        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Could not load race weekend telemetry." onRetry={refetchCalendar} />;
  }

  if (!displayedRace) return null;

  return (
    <div className="nr-hero-container">
      <div className="nr-hero-bg">
        <CircuitTrack
          circuitId={displayedRace.Circuit.circuitId}
          circuitName={displayedRace.Circuit.circuitName}
          country={displayedRace.Circuit.Location.country}
          raceName={displayedRace.raceName}
          round={displayedRace.round}
          variant="hero"
        />
      </div>

      <div className="nr-hero-content">
        <div className="hero-left-col">
          <div className="hero-top-meta">
            <span className={`live-badge-red ${isLive ? 'is-live' : ''}`}>{badgeText}</span>
            <span className="round-info font-mono">ROUND {displayedRace.round}</span>
            {displayedRace.Sprint?.date && (
              <span className="hero-sprint-badge font-mono">SPRINT WEEKEND</span>
            )}
          </div>

          <h1 className="hero-race-title">{displayedRace.raceName}</h1>
          <h2 className="hero-location-subtitle">
            {displayedRace.Circuit.Location.locality} / {displayedRace.Circuit.Location.country}
          </h2>

          <button
            className={`hero-action-btn ${isLive ? 'hero-action-live' : ''}`}
            onClick={handleActionClick}
          >
            {isLive && <Radio size={16} className="btn-icon-live" />}
            {actionBtnText}
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="hero-right-col">
          {isLive ? (
            <div className="broadcast-live-state active">
              <span className="blink-dot"></span>
              <div className="live-state-info">
                <span className="live-state-title">
                  {raceState?.activeSession?.name.toUpperCase() || 'SESSION'} IN PROGRESS
                </span>
                <span className="live-state-sub">REAL-TIME TIMING & TRACK TELEMETRY</span>
              </div>
            </div>
          ) : countdown && !countdown.isPassed ? (
            <div className="hero-countdown-group">
              <div className="hc-session-label font-mono">{countdownLabel}</div>
              <div className="broadcast-countdown">
                <div className="cd-block">
                  <span className="cd-num">{String(countdown.days).padStart(2, '0')}</span>
                  <span className="cd-lbl">DAYS</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-block">
                  <span className="cd-num">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="cd-lbl">HRS</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-block">
                  <span className="cd-num">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="cd-lbl">MINS</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-block">
                  <span className="cd-num">{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="cd-lbl">SEC</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="broadcast-live-state">
              <span className="blink-dot"></span> SESSION COMPLETED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextRaceHero;
