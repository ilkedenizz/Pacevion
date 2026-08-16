import React from 'react';
import { useCalendar } from '../hooks/useF1Data';
import CircuitTrack from '../components/common/CircuitTrack';
import './Calendar.css';

export const Calendar: React.FC = () => {
  const { data: calendarData, isLoading, error } = useCalendar();

  const now = new Date().getTime();

  return (
    <div className="calendar-page page-content">
      <header className="calendar-header">
        <h1 className="page-title font-heading">2026 RACE CALENDAR</h1>
        <p className="rounds-count font-mono">{calendarData ? `${calendarData.length} ROUNDS` : '...'}</p>
      </header>

      {isLoading ? (
        <div className="calendar-list skeleton-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton calendar-card-skeleton" />
          ))}
        </div>
      ) : error ? (
        <div className="error-state font-mono">
          <p>Failed to load calendar data</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      ) : calendarData ? (
        <div className="calendar-list">
          {calendarData.map((race) => {
            const raceTime = new Date(race.date).getTime();
            const isCompleted = raceTime < now;
            const isNext =
              !isCompleted &&
              calendarData.find((r) => new Date(r.date).getTime() >= now)?.round === race.round;

            let status = 'UPCOMING';
            if (isCompleted) status = 'COMPLETED';
            if (isNext) status = 'NEXT';

            return (
              <div key={race.round} className={`race-card ${status.toLowerCase()}`}>
                <div className="race-card-header font-mono">
                  <span className="round-badge">R{String(race.round).padStart(2, '0')}</span>
                  <span className="status-badge">{status}</span>
                </div>

                <div className="race-card-body">
                  <div className="race-card-content">
                    <h2 className="race-name font-heading">{race.raceName}</h2>
                    <p className="circuit-name font-mono">{race.Circuit.circuitName}</p>

                    <div className="race-meta font-mono">
                      <span className="race-date">
                        {new Date(race.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="race-country">📍 {race.Circuit.Location.country}</span>
                    </div>
                  </div>

                  <div className="circuit-map-container">
                    <CircuitTrack
                      circuitId={race.Circuit.circuitId}
                      circuitName={race.Circuit.circuitName}
                      country={race.Circuit.Location.country}
                      raceName={race.raceName}
                      variant="card"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Calendar;
