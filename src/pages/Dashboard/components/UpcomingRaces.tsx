import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCalendar } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
import { formatLocalTime } from '../../../utils/dateUtils';
import CircuitTrack from '../../../components/ui/CircuitTrack';
import './UpcomingRaces.css';

const UpcomingRaces: React.FC = () => {
  const navigate = useNavigate();
  const { data: races, isLoading, isError, refetch } = useCalendar();

  const nextThreeRaces = useMemo(() => {
    if (!races || races.length === 0) return [];
    const now = new Date();
    
    // Find all future races
    const futureRaces = races.filter((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      return raceDate > now;
    });

    // Return the next 4
    return futureRaces.slice(0, 4);
  }, [races]);

  if (isLoading) {
    return (
      <div className="upcoming-schedule-container loading">
        <div className="upcoming-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="upcoming-row-item">
              <div className="skeleton" style={{ width: '40px', height: '16px' }} />
              <div className="race-details-block" style={{ gap: '6px' }}>
                <div className="skeleton" style={{ width: '140px', height: '16px' }} />
                <div className="skeleton" style={{ width: '100px', height: '12px' }} />
              </div>
              <div className="skeleton" style={{ width: '80px', height: '24px', marginLeft: 'auto' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="upcoming-schedule-container error">
        <ErrorState message="Could not load schedule." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="upcoming-schedule-container">
      {nextThreeRaces.length === 0 ? (
        <div className="empty-schedule">No upcoming races found.</div>
      ) : (
        <div className="upcoming-list">
          {nextThreeRaces.map((race, index) => (
            <div
              key={`${race.season}-${race.round}`}
              className={`upcoming-row-item${index === 0 ? ' next-race' : ''}`}
            >
              <div className="ur-thumb-col">
                <CircuitTrack 
                  circuitId={race.Circuit.circuitId}
                  circuitName={race.Circuit.circuitName}
                  country={race.Circuit.Location.country}
                  variant="compact"
                />
                <div className="ur-round-badge">R{race.round}</div>
              </div>
              
              <div className="race-details-block">
                <div className="title-row">
                  <span className="race-title">{race.raceName}</span>
                  {index === 0 && <span className="next-badge">NEXT</span>}
                </div>
                
                <div className="meta-row">
                  <span className="meta-loc">{race.Circuit.Location.country}</span>
                  <span className="meta-sep">•</span>
                  <span className="circuit-name-sub text-secondary">{race.Circuit.circuitName}</span>
                </div>
              </div>
              
              <div className="race-action-block">
                <div className="date-badge">
                  <span>{formatLocalTime(race.date, race.time).split(',')[0]}</span>
                </div>
                <button 
                  className="row-action-btn"
                  onClick={() => navigate(`/races/${race.season}/${race.round}`)}
                  title="View Race Details"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Link to="/calendar" className="view-full-calendar-btn">
        <span>VIEW FULL CALENDAR</span>
        <ArrowRight size={12} />
      </Link>
    </div>
  );
};

export default UpcomingRaces;
