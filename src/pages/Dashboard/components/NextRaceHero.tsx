import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCalendar } from '../../../hooks/useF1Data';
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
  const { data: races, isLoading, isError, refetch } = useCalendar();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  const nextRace = useMemo(() => {
    if (!races || races.length === 0) return null;
    const now = new Date();
    return races.find((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      return raceDate > now;
    }) || races[races.length - 1];
  }, [races]);

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
    return <div className="hero-broadcast-panel loading"><div className="skeleton" style={{ width: '100%', height: '100%' }}/></div>;
  }

  if (isError) {
    return <ErrorState message="Could not load next race information." onRetry={refetch} />;
  }

  if (!nextRace) return null;

  return (
    <div className="nr-hero-container">
      <div className="nr-hero-bg">
        <CircuitTrack 
          circuitId={nextRace.Circuit.circuitId}
          circuitName={nextRace.Circuit.circuitName}
          country={nextRace.Circuit.Location.country}
          variant="hero"
        />
      </div>

      <div className="nr-hero-content">
        <div className="hero-left-col">
          <div className="hero-top-meta">
            <span className="live-badge-red">NEXT RACE</span>
            <span className="round-info font-mono">ROUND {nextRace.round}</span>
          </div>
          
          <h1 className="hero-race-title">{nextRace.raceName}</h1>
          <h2 className="hero-location-subtitle">{nextRace.Circuit.Location.locality} / {nextRace.Circuit.Location.country}</h2>
          
          <button className="hero-action-btn" onClick={() => navigate(`/races/${nextRace.season}/${nextRace.round}`)}>
            VIEW RACE DETAILS <ArrowRight size={16} />
          </button>
        </div>

        <div className="hero-right-col">
          {countdown && !countdown.isPassed ? (
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
          ) : (
            <div className="broadcast-live-state">
              <span className="blink-dot"></span> SESSION LIVE OR COMPLETED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextRaceHero;
