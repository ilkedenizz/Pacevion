import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import { useCalendar } from '../../../hooks/useF1Data';
import Card from '../../../components/ui/Card';
import ErrorState from '../../../components/ui/ErrorState';
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
      <Card title="Upcoming Schedule" className="upcoming-races-card">
        <div className="upcoming-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="upcoming-row-item" style={{ minHeight: '76px', cursor: 'default' }}>
              <div className="skeleton" style={{ width: '50px', height: '22px' }} />
              <div className="race-details-block" style={{ gap: '6px' }}>
                <div className="skeleton" style={{ width: '120px', height: '14px' }} />
                <div className="skeleton" style={{ width: '160px', height: '11px' }} />
                <div className="meta-sub-row">
                  <div className="skeleton" style={{ width: '80px', height: '10px' }} />
                  <div className="skeleton" style={{ width: '60px', height: '10px' }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: '16px', height: '16px' }} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="Upcoming Schedule">
        <ErrorState message="Could not load schedule." onRetry={refetch} />
      </Card>
    );
  }

  return (
    <Card
      title="Upcoming Schedule"
      className="upcoming-races-card"
      headerAction={
        <Link to="/calendar" className="view-calendar-link">
          <span>Full Calendar</span>
          <ArrowRight size={14} />
        </Link>
      }
    >
      {nextThreeRaces.length === 0 ? (
        <div className="empty-schedule">No upcoming races found.</div>
      ) : (
        <div className="upcoming-list">
          {nextThreeRaces.map((race, index) => (
            <div
              key={`${race.season}-${race.round}`}
              className={`upcoming-row-item${index === 0 ? ' next-race' : ''}`}
              onClick={() => navigate(`/races/${race.season}/${race.round}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/races/${race.season}/${race.round}`);
                }
              }}
            >
              <div className="round-badge font-heading">RD {race.round}</div>
              <div className="race-details-block">
                <span className="race-title">{race.raceName}</span>
                <span className="circuit-name-sub text-secondary">{race.Circuit.circuitName}</span>
                <div className="meta-sub-row text-secondary">
                  <span className="meta-sub-item">
                    <MapPin size={12} />
                    <span>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
                  </span>
                  <span className="meta-sub-item">
                    <Calendar size={12} />
                    <span>{race.date}</span>
                  </span>
                </div>
              </div>
              <ChevronRight className="arrow-icon text-secondary" size={16} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default UpcomingRaces;
