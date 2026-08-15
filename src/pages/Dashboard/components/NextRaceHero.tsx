import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useCalendar } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
import { circuitLayouts } from '../../../data/circuits';
import './NextRaceHero.css';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

const NextRaceHero: React.FC = () => {
  const { data: races, isLoading, isError, refetch } = useCalendar();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  // Find the next upcoming race
  const nextRace = useMemo(() => {
    if (!races || races.length === 0) return null;
    const now = new Date();
    return races.find((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      return raceDate > now;
    }) || races[races.length - 1];
  }, [races]);

  // Countdown timer effect
  useEffect(() => {
    if (!nextRace) return;

    const raceTimeStr = nextRace.time ? (nextRace.time.endsWith('Z') ? nextRace.time : `${nextRace.time}Z`) : '00:00:00Z';
    const targetDate = new Date(`${nextRace.date}T${raceTimeStr}`);

    const calculateTime = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
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
  }, [nextRace]);

  if (isLoading) {
    return (
      <div className="next-race-skeleton">
        <div className="skeleton-hero-left">
          <div className="skeleton" style={{ width: '120px', height: '16px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ width: '70%', height: '32px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ width: '40%', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '50%', height: '14px', marginBottom: '24px' }} />
          <div className="skeleton" style={{ width: '80%', height: '60px', marginBottom: '24px' }} />
          <div className="skeleton" style={{ width: '140px', height: '36px' }} />
        </div>
        <div className="skeleton-hero-right">
          <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Could not load next race information." onRetry={refetch} />;
  }

  if (!nextRace) {
    return (
      <div className="next-race-empty">
        <p>No upcoming races scheduled.</p>
      </div>
    );
  }

  const handleViewRace = () => {
    navigate(`/races/${nextRace.season}/${nextRace.round}`);
  };

  return (
    <div className="next-race-hero">
      <div className="hero-content">
        <div className="badge-container">
          <span className="live-badge">UPCOMING // ROUND {nextRace.round}</span>
        </div>
        <h2 className="grand-prix-name font-heading-condensed">{nextRace.raceName}</h2>
        
        <div className="meta-details">
          <div className="meta-item">
            <MapPin size={14} className="accent" />
            <span>{nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} />
            <span>{nextRace.date}</span>
          </div>
          {nextRace.time && (
            <div className="meta-item">
              <Clock size={14} />
              <span>{nextRace.time.replace('Z', ' UTC')}</span>
            </div>
          )}
        </div>
        
        <p className="circuit-name-hero text-secondary">{nextRace.Circuit.circuitName}</p>
        
        {countdown && !countdown.isPassed && (
          <div className="countdown-container">
            <div className="countdown-box">
              <span className="number font-mono">{String(countdown.days).padStart(2, '0')}</span>
              <span className="label">DAYS</span>
            </div>
            <div className="countdown-divider">:</div>
            <div className="countdown-box">
              <span className="number font-mono">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="label">HRS</span>
            </div>
            <div className="countdown-divider">:</div>
            <div className="countdown-box">
              <span className="number font-mono">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="label">MINS</span>
            </div>
            <div className="countdown-divider">:</div>
            <div className="countdown-box">
              <span className="number font-mono">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="label">SECS</span>
            </div>
          </div>
        )}

        {countdown?.isPassed && (
          <div className="race-live-banner">
            <span className="blink">●</span> SESSION COMPLETED / WEEKEND IN PROGRESS
          </div>
        )}

        <button className="view-race-btn" onClick={handleViewRace} type="button">
          <span>VIEW RACE DETAILS</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="hero-circuit-pane">
        {nextRace && circuitLayouts[nextRace.Circuit.circuitId] ? (
          <svg className="circuit-svg" viewBox={circuitLayouts[nextRace.Circuit.circuitId].viewBox} preserveAspectRatio="xMidYMid meet">
            <path
              d={circuitLayouts[nextRace.Circuit.circuitId].trackPath}
              fill="none"
              stroke="rgba(225, 6, 0, 0.05)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={circuitLayouts[nextRace.Circuit.circuitId].trackPath}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className="circuit-fallback">
            <p>CIRCUIT LAYOUT UNAVAILABLE</p>
          </div>
        )}
        <span className="circuit-caption">SECTOR MAP & TELEMETRY</span>
      </div>
    </div>
  );
};

export default NextRaceHero;
