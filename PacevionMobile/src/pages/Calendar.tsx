import React from 'react';
import { useCalendar } from '../hooks/useF1Data';
import CircuitTrack from '../components/common/CircuitTrack';
import './Calendar.css';

export const Calendar: React.FC = () => {
  const { data: calendar, isLoading } = useCalendar('2026');

  if (isLoading) {
    return <div className="calendar-page"><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>;
  }

  const races = calendar || [];
  
  // Find next race based on date (mock logic)
  const nextRaceIndex = races.findIndex(r => new Date(r.date) > new Date('2026-08-15'));
  const nextRaceObj = nextRaceIndex !== -1 ? races[nextRaceIndex] : null;

  return (
    <div className="calendar-page fade-in">
      <header className="brand-header">
        <h1 className="brand-title font-heading">CALENDAR</h1>
      </header>

      <div className="cal-list">
        {races.map((race) => {
          const isNext = nextRaceObj && nextRaceObj.round === race.round;
          return (
            <div key={race.round} className={`cal-card ${isNext ? 'cal-next' : ''}`}>
              {isNext && <div className="cal-next-badge font-mono">NEXT RACE</div>}
              
              <div className="cal-content">
                <div className="cal-info">
                  <div className="cal-round font-mono">ROUND {race.round.padStart(2, '0')}</div>
                  <h3 className="cal-title font-heading">{race.raceName}</h3>
                  <div className="cal-loc font-mono">{race.Circuit.Location.locality}</div>
                  <div className="cal-date font-heading">{new Date(race.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</div>
                </div>
                
                <div className="cal-circuit-graphic">
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
