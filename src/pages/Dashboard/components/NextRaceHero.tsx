import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useCalendar } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
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
    // Races are already ordered by round/date.
    // Find the first race where the race date/time is in the future.
    return races.find((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      return raceDate > now;
    }) || races[races.length - 1]; // fallback to last race of season if all completed
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
      <div className="next-race-skeleton skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-details" />
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
          <span className="live-badge">UPCOMING ROUND {nextRace.round}</span>
        </div>
        <h2 className="grand-prix-name">{nextRace.raceName}</h2>
        <div className="meta-details">
          <div className="meta-item">
            <MapPin size={16} />
            <span>{nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>{nextRace.date}</span>
          </div>
          {nextRace.time && (
            <div className="meta-item">
              <Clock size={16} />
              <span>{nextRace.time.replace('Z', ' UTC')}</span>
            </div>
          )}
        </div>
        <p className="circuit-name">{nextRace.Circuit.circuitName}</p>
        
        {countdown && !countdown.isPassed && (
          <div className="countdown-container">
            <div className="countdown-box">
              <span className="number">{String(countdown.days).padStart(2, '0')}</span>
              <span className="label">DAYS</span>
            </div>
            <div className="countdown-divider">:</div>
            <div className="countdown-box">
              <span className="number">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="label">HRS</span>
            </div>
            <div className="countdown-divider">:</div>
            <div className="countdown-box">
              <span className="number">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="label">MINS</span>
            </div>
            <div className="countdown-divider">:</div>
            <div className="countdown-box">
              <span className="number">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="label">SECS</span>
            </div>
          </div>
        )}

        {countdown?.isPassed && (
          <div className="race-live-banner">
            <span className="blink">●</span> RACE WEEKEND UNDERWAY / COMPLETED
          </div>
        )}

        <button className="view-race-btn" onClick={handleViewRace} type="button">
          <span>View Race Weekend Details</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default NextRaceHero;
