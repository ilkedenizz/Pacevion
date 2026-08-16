import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { useCalendar, useRaceResults } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
import { formatLocalTime } from '../../../utils/dateUtils';
import { getTeamVisual, getDriverVisual } from '../../../data/assets';
import './LastRaceCard.css';

const LastRaceCard: React.FC = () => {
  const navigate = useNavigate();
  const { data: races, isLoading: calendarLoading, isError: calendarError, refetch: refetchCalendar } = useCalendar();

  const lastCompletedRaceInfo = useMemo(() => {
    if (!races || races.length === 0) return null;
    const now = new Date();
    const pastRaces = races.filter((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      return raceDate <= now;
    });
    if (pastRaces.length === 0) return null;
    return pastRaces[pastRaces.length - 1];
  }, [races]);

  const season = lastCompletedRaceInfo?.season || '';
  const round = lastCompletedRaceInfo?.round || '';

  const { data: raceResults, isLoading: resultsLoading, isError: resultsError, refetch: refetchResults } = useRaceResults(season, round);

  const isLoading = calendarLoading || (!!lastCompletedRaceInfo && resultsLoading);
  const isError = calendarError || resultsError;

  const handleRetry = () => calendarError ? refetchCalendar() : refetchResults();

  const fastestLap = useMemo(() => {
    if (!raceResults?.Results) return null;
    return raceResults.Results.find((r) => r.FastestLap?.rank === '1') || null;
  }, [raceResults]);

  if (isLoading) {
    return (
      <div className="last-race-panel loading">
        <div className="podium-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="podium-row">
              <div className="skeleton" style={{ width: '44px', height: '32px' }} />
              <div className="podium-info">
                <div className="skeleton" style={{ width: '120px', height: '16px' }} />
                <div className="skeleton" style={{ width: '80px', height: '12px', marginTop: '4px' }} />
              </div>
              <div className="skeleton" style={{ width: '40px', height: '24px', marginLeft: 'auto' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="last-race-panel error">
        <ErrorState message="Could not load last race results." onRetry={handleRetry} />
      </div>
    );
  }

  if (!lastCompletedRaceInfo || !raceResults) {
    return (
      <div className="last-race-panel">
        <div className="empty-results">No completed races found.</div>
      </div>
    );
  }

  const topThree = raceResults.Results ? raceResults.Results.slice(0, 3) : [];

  return (
    <div className="last-race-panel">
      <div className="last-race-subtitle">
        <span className="last-race-name">{raceResults.raceName}</span>
        <span className="last-race-date text-secondary">{formatLocalTime(raceResults.date, raceResults.time)}</span>
      </div>

      {topThree.length > 0 && (
        <div className="last-race-winner-visual">
          <img src={getTeamVisual(topThree[0].Constructor?.constructorId) || undefined} alt="Winner Team" className="lr-team-img" />
          <img src={getDriverVisual(topThree[0].Driver?.driverId, topThree[0].Constructor?.constructorId) || undefined} alt="Winner Driver" className="lr-driver-img" />
          <div className="lr-winner-overlay">
            <span className="lr-winner-label">RACE WINNER</span>
            <span className="lr-winner-name">{topThree[0].Driver.familyName}</span>
          </div>
        </div>
      )}

      <div className="podium-list">
        {topThree.map((result) => {
          const position = result.position;
          const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
          const teamName = result.Constructor.name;
          const points = result.points;

          return (
            <div key={result.Driver.driverId} className={`podium-row row-pos-${position}`}>
              <div className={`podium-badge pos-${position}`}>
                <span>P{position}</span>
              </div>
              <div className="podium-info">
                <span className="podium-driver-name">{driverName}</span>
                <span className="podium-team-name">{teamName}</span>
              </div>
              <div className="podium-points">
                <span className="pts-plus">+</span>
                <span className="pts-val">{points}</span>
              </div>
            </div>
          );
        })}
      </div>

      {fastestLap && (
        <div className="fastest-lap-strip">
          <div className="fl-left">
            <Zap size={14} className="fastest-lap-icon" />
            <span className="fastest-lap-label">FASTEST LAP</span>
          </div>
          <div className="fl-right">
            <span className="fastest-lap-driver">
              {fastestLap.Driver.code || fastestLap.Driver.familyName.slice(0,3).toUpperCase()}
            </span>
            <span className="fastest-lap-time">{fastestLap.FastestLap?.Time?.time}</span>
          </div>
        </div>
      )}

      <button className="view-full-race-btn" onClick={() => navigate(`/races/${season}/${round}`)}>
        VIEW FULL CLASSIFICATION <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default LastRaceCard;
