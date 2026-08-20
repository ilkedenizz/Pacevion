import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../hooks/useF1Data';
import CircuitTrack from '../components/common/CircuitTrack';
import './Calendar.css';

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { data: calendar, isLoading } = useCalendar('2026');

  if (isLoading) {
    return <div className="calendar-page"><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>;
  }

  const races = calendar || [];
  const nextRaceIndex = races.findIndex(r => new Date(r.date) > new Date('2026-08-15'));
  const nextRaceObj = nextRaceIndex !== -1 ? races[nextRaceIndex] : null;

  return (
    <div className="calendar-page fade-in">
      <header className="brand-header">
        <h1 className="editorial-headline" style={{ fontSize: '24px' }}>CALENDAR</h1>
      </header>

      <div className="cal-list">
        {races.map((race) => {
          const isNext = nextRaceObj && nextRaceObj.round === race.round;
          const isPast = nextRaceObj && nextRaceIndex !== -1 && parseInt(race.round) < parseInt(nextRaceObj.round);
          
          const raceDate = new Date(race.date);
          const formattedDate = `${raceDate.getDate() - 2}—${String(raceDate.getDate()).padStart(2, '0')} ${raceDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}`;
          
          return (
            <div 
              key={race.round} 
              className={`cal-card ${isNext ? 'cal-next' : ''} ${isPast ? 'cal-past' : ''}`}
              onClick={() => navigate(`/races/2026/${race.round}`)}
              style={{ cursor: 'pointer' }}
            >
              {isNext && <div className="cal-badge font-mono editorial-label" style={{ color: '#fff', background: 'var(--color-accent)' }}>NEXT RACE</div>}
              
              <div className="cal-inner">
                <div className="cal-data">
                  <div className="cal-round editorial-label">ROUND {race.round.padStart(2, '0')}</div>
                  <h3 className="cal-title font-heading editorial-headline">{race.raceName}</h3>
                  <div className="cal-loc editorial-label">{race.Circuit.Location.locality}</div>
                  
                  <div className="cal-date-box font-mono">{formattedDate}</div>
                </div>
                
                <div className="cal-circuit">
                  <CircuitTrack 
                    circuitId={race.Circuit.circuitId}
                    circuitName={race.Circuit.circuitName}
                    country={race.Circuit.Location.country}
                    raceName={race.raceName}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
