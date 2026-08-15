import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { useCalendar, useRaceResults } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
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
      <div className="last-race-panel">
        <div className="panel-header">
          <h3 className="panel-title">LAST RACE RESULT</h3>
        </div>
        <div className="podium-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="podium-row">
              <div className="skeleton" style={{ width: '44px', height: '20px' }} />
              <div className="podium-info">
                <div className="skeleton" style={{ width: '100px', height: '13px' }} />
                <div className="skeleton" style={{ width: '70px', height: '11px', marginTop: '4px' }} />
              </div>
              <div className="skeleton" style={{ width: '36px', height: '20px', marginLeft: 'auto' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="last-race-panel">
        <div className="panel-header">
          <h3 className="panel-title">LAST RACE RESULT</h3>
        </div>
        <ErrorState message="Could not load last race results." onRetry={handleRetry} />
      </div>
    );
  }

  if (!lastCompletedRaceInfo || !raceResults) {
    return (
      <div className="last-race-panel">
        <div className="panel-header">
          <h3 className="panel-title">LAST RACE RESULT</h3>
        </div>
        <div className="empty-results">No completed races found.</div>
      </div>
    );
  }

  const topThree = raceResults.Results ? raceResults.Results.slice(0, 3) : [];

  return (
    <div className="last-race-panel" onClick={() => navigate(`/races/${season}/${round}`)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/races/${season}/${round}`); }}>
      <div className="panel-header">
        <h3 className="panel-title">LAST RACE RESULT</h3>
        <Link to={`/races/${season}/${round}`} className="panel-link" onClick={(e) => e.stopPropagation()}>
          <span>DETAILS</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="last-race-subtitle">
        <span className="last-race-name">{raceResults.raceName}</span>
        <span className="last-race-date text-secondary">{raceResults.date}</span>
      </div>

      <div className="podium-list">
        {topThree.map((result) => {
          const position = result.position;
          const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
          const teamName = result.Constructor.name;
          const points = result.points;

          return (
            <div key={result.Driver.driverId} className="podium-row">
              <div className={`podium-badge pos-${position}`}>
                <span>P{position}</span>
              </div>
              <div className="podium-info">
                <span className="podium-driver-name">{driverName}</span>
                <span className="podium-team-name">{teamName}</span>
              </div>
              <div className="podium-points">
                <span className="pts-val">{points}</span>
                <span className="pts-lbl">PTS</span>
              </div>
            </div>
          );
        })}
      </div>

      {fastestLap && (
        <div className="fastest-lap-strip">
          <Zap size={12} className="fastest-lap-icon" />
          <span className="fastest-lap-label">FASTEST LAP</span>
          <span className="fastest-lap-driver">
            {fastestLap.Driver.givenName} {fastestLap.Driver.familyName}
          </span>
          <span className="fastest-lap-time">{fastestLap.FastestLap?.Time?.time}</span>
          {fastestLap.FastestLap?.lap && (
            <span className="fastest-lap-meta">LAP {fastestLap.FastestLap.lap}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default LastRaceCard;
