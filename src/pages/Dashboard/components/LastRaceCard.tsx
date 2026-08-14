import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import { useCalendar, useRaceResults } from '../../../hooks/useF1Data';
import Card from '../../../components/ui/Card';
import ErrorState from '../../../components/ui/ErrorState';
import './LastRaceCard.css';

const LastRaceCard: React.FC = () => {
  const navigate = useNavigate();
  const { data: races, isLoading: calendarLoading, isError: calendarError, refetch: refetchCalendar } = useCalendar();

  // Find the last completed race
  const lastCompletedRaceInfo = useMemo(() => {
    if (!races || races.length === 0) return null;
    const now = new Date();
    
    // Find all races in the past
    const pastRaces = races.filter((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      return raceDate <= now;
    });

    if (pastRaces.length === 0) return null;
    // The last one is the most recently completed
    return pastRaces[pastRaces.length - 1];
  }, [races]);

  const season = lastCompletedRaceInfo?.season || '';
  const round = lastCompletedRaceInfo?.round || '';

  // Fetch results for that race
  const {
    data: raceResults,
    isLoading: resultsLoading,
    isError: resultsError,
    refetch: refetchResults,
  } = useRaceResults(season, round);

  const isLoading = calendarLoading || (lastCompletedRaceInfo && resultsLoading);
  const isError = calendarError || resultsError;

  const handleRetry = () => {
    if (calendarError) {
      refetchCalendar();
    } else {
      refetchResults();
    }
  };

  if (isLoading) {
    return (
      <Card title="Last Race Result" className="last-race-card">
        <div className="last-race-header">
          <div className="skeleton" style={{ width: '120px', height: '16px' }} />
          <div className="skeleton" style={{ width: '80px', height: '12px' }} />
        </div>
        <div className="podium-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="podium-row" style={{ minHeight: '52px' }}>
              <div className="skeleton" style={{ width: '54px', height: '22px' }} />
              <div className="podium-info" style={{ gap: '4px' }}>
                <div className="skeleton" style={{ width: '100px', height: '14px' }} />
                <div className="skeleton" style={{ width: '70px', height: '11px' }} />
              </div>
              <div className="skeleton" style={{ width: '36px', height: '22px', marginLeft: 'auto' }} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="Last Race Result">
        <ErrorState message="Could not load last race results." onRetry={handleRetry} />
      </Card>
    );
  }

  if (!lastCompletedRaceInfo || !raceResults) {
    return (
      <Card title="Last Race Result">
        <div className="empty-results">No completed races found for the current season.</div>
      </Card>
    );
  }

  const topThree = raceResults.Results ? raceResults.Results.slice(0, 3) : [];

  const handleCardClick = () => {
    navigate(`/races/${season}/${round}`);
  };

  return (
    <Card
      title="Last Race Result"
      className="last-race-card"
      onClick={handleCardClick}
      headerAction={
        <Link to={`/races/${season}/${round}`} className="view-details-link" onClick={(e) => e.stopPropagation()}>
          <span>Details</span>
          <ArrowRight size={14} />
        </Link>
      }
    >
      <div className="last-race-header">
        <h4 className="race-name">{raceResults.raceName}</h4>
        <span className="race-date text-secondary">{raceResults.date}</span>
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
                <Award size={14} />
                <span>P{position}</span>
              </div>
              <div className="podium-info">
                <span className="podium-driver-name">{driverName}</span>
                <span className="podium-team-name text-secondary">{teamName}</span>
              </div>
              <div className="podium-points font-heading">
                <span className="pts-val">{points}</span>
                <span className="pts-lbl">PTS</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default LastRaceCard;
