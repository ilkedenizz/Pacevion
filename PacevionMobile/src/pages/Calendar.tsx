import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../hooks/useF1Data';
import { formatRaceDateRange, getCountryFlag, isWeekendCompleted } from '../utils/raceWeekend';
import CircuitTrack from '../components/common/CircuitTrack';
import { ChevronRight, Flag } from 'lucide-react';

import type { Race } from '../api/types';
import './Calendar.css';

type FilterType = 'all' | 'upcoming' | 'completed' | 'sprint';

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { data: calendar, isLoading, isError, refetch } = useCalendar('2026');
  const [filter, setFilter] = useState<FilterType>('all');

  const now = useMemo(() => new Date(), []);

  const races = useMemo(() => calendar || [], [calendar]);

  const nextRace = useMemo(() => {
    if (races.length === 0) return null;
    return races.find(r => !isWeekendCompleted(r, now)) || null;
  }, [races, now]);

  const filteredRaces = useMemo(() => {
    return races.filter(race => {
      const isSprint = !!race.Sprint?.date;
      const isPast = isWeekendCompleted(race, now);
      const isFuture = !isPast;

      if (filter === 'upcoming') return isFuture;
      if (filter === 'completed') return isPast;
      if (filter === 'sprint') return isSprint;
      return true;
    });
  }, [races, filter, now]);

  if (isError) {
    return (
      <div className="page calendar-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="cal-error-box">
          <Flag size={32} color="var(--color-primary)" />
          <h2 className="font-heading editorial-headline" style={{ color: 'var(--color-primary)' }}>CALENDAR OFFLINE</h2>
          <p className="editorial-label">UNABLE TO LOAD 2026 SCHEDULE</p>
          <button onClick={() => refetch()} className="retry-btn font-mono">RETRY</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page calendar-page fade-in">
        <div className="skeleton-header skeleton" style={{ height: 44, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton-segments skeleton" style={{ height: 36, borderRadius: 6, marginBottom: 14 }} />
        <div className="skeleton-hero skeleton" style={{ height: 180, borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton-card skeleton" style={{ height: 72, borderRadius: 8, marginBottom: 8 }} />
        <div className="skeleton-card skeleton" style={{ height: 72, borderRadius: 8, marginBottom: 8 }} />
        <div className="skeleton-card skeleton" style={{ height: 72, borderRadius: 8 }} />
      </div>
    );
  }

  return (
    <div className="page calendar-page fade-in">
      {/* Header */}
      <header className="cal-header">
        <div className="cal-header-left">
          <h1 className="cal-title font-heading editorial-headline">CALENDAR</h1>
          <span className="cal-subtitle font-mono">2026 FIA FORMULA 1 • {races.length} ROUNDS</span>
        </div>
      </header>

      {/* Segment Controls */}
      <div className="cal-segments-bar font-mono">
        <button 
          className={`cal-segment-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          ALL ({races.length})
        </button>
        <button 
          className={`cal-segment-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          UPCOMING
        </button>
        <button 
          className={`cal-segment-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          COMPLETED
        </button>
        <button 
          className={`cal-segment-btn ${filter === 'sprint' ? 'active' : ''}`}
          onClick={() => setFilter('sprint')}
        >
          SPRINT
        </button>
      </div>

      {/* Next Race Featured Card (shown in 'all' and 'upcoming' views if nextRace exists) */}
      {(filter === 'all' || filter === 'upcoming') && nextRace && (
        <section className="cal-next-highlight-section">
          <div className="cal-section-label font-mono">
            <span className="live-dot pulse" />
            NEXT UP ON TRACK
          </div>
          <div 
            className="cal-hero-card"
            onClick={() => navigate(`/races/2026/${nextRace.round}`)}
            role="button"
            tabIndex={0}
          >
            <div className="ch-top">
              <div className="ch-round-badge font-mono">ROUND {String(nextRace.round).padStart(2, '0')}</div>
              {nextRace.Sprint?.date && <div className="ch-sprint-badge font-mono">SPRINT WEEKEND</div>}
              <div className="ch-status-tag font-mono">NEXT RACE</div>
            </div>
            <div className="ch-body">
              <div className="ch-info">
                <div className="ch-name-row">
                  <span className="ch-flag">{getCountryFlag(nextRace.Circuit?.Location?.country, nextRace.Circuit?.Location?.locality)}</span>
                  <h3 className="ch-race-name font-heading">{nextRace.raceName}</h3>
                </div>
                <div className="ch-circuit font-mono">
                  {nextRace.Circuit?.circuitName?.toUpperCase()}
                </div>
                <div className="ch-date font-mono">
                  {formatRaceDateRange(nextRace)}
                </div>
              </div>
              <div className="ch-track-preview">
                <CircuitTrack 
                  circuitId={nextRace.Circuit?.circuitId || ''}
                  circuitName={nextRace.Circuit?.circuitName || ''}
                  country={nextRace.Circuit?.Location?.country || ''}
                  raceName={nextRace.raceName}
                  variant="compact"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Calendar List */}
      <section className="cal-races-section">
        <div className="cal-section-label font-mono">
          {filter === 'all' ? '2026 CHAMPIONSHIP ROUNDS' : `${filter.toUpperCase()} RACES`} ({filteredRaces.length})
        </div>

        {filteredRaces.length === 0 ? (
          <div className="cal-empty-filter-box font-mono">
            <span className="cal-empty-msg">
              {filter === 'completed' 
                ? 'NO COMPLETED RACES YET THIS SEASON' 
                : filter === 'sprint' 
                ? 'NO SPRINT SESSIONS FOUND' 
                : 'NO RACES MATCH THIS FILTER'}
            </span>
            <button className="cal-reset-filter-btn" onClick={() => setFilter('all')}>
              VIEW ALL ROUNDS
            </button>
          </div>
        ) : (
          <div className="cal-list">
            {filteredRaces.map((race: Race) => {
              const isNext = nextRace && nextRace.round === race.round;
              const isPast = isWeekendCompleted(race, now);
              const isSprint = !!race.Sprint?.date;
              const flag = getCountryFlag(race.Circuit?.Location?.country, race.Circuit?.Location?.locality);
              const dateRange = formatRaceDateRange(race);

              return (
                <div 
                  key={race.round} 
                  className={`cal-card ${isNext ? 'is-next' : ''} ${isPast ? 'is-past' : ''}`}
                  onClick={() => navigate(`/races/2026/${race.round}`)}
                  role="button"
                  tabIndex={0}
                >
                  {/* Left: Round & Date */}
                  <div className="cal-left-block font-mono">
                    <span className="cal-round-num">R{String(race.round).padStart(2, '0')}</span>
                    <span className="cal-flag-emoji">{flag}</span>
                  </div>

                  {/* Center: Info */}
                  <div className="cal-center-block">
                    <div className="cal-gp-title font-heading">
                      {race.raceName}
                    </div>
                    <div className="cal-circuit-line font-mono">
                      {race.Circuit?.Location?.locality?.toUpperCase()}, {race.Circuit?.Location?.country?.toUpperCase()}
                    </div>
                    <div className="cal-date-row font-mono">
                      <span className="cal-date-text">{dateRange}</span>
                      {isSprint && <span className="cal-sprint-pill font-mono">SPRINT</span>}
                    </div>
                  </div>

                  <div className="cal-track-preview" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.8 }}>
                    <CircuitTrack 
                      circuitId={race.Circuit?.circuitId || ''} 
                      circuitName={race.Circuit?.circuitName || ''}
                      country={race.Circuit?.Location?.country || ''}
                      raceName={race.raceName}
                      variant="compact" 
                    />
                  </div>

                  {/* Right: Status / Arrow */}
                  <div className="cal-right-block">
                    {isNext ? (
                      <span className="cal-badge-next font-mono">NEXT</span>
                    ) : isPast ? (
                      <span className="cal-badge-past font-mono">DONE</span>
                    ) : (
                      <span className="cal-badge-upcoming font-mono">UPCOMING</span>
                    )}
                    <ChevronRight size={16} color="var(--color-text-muted)" className="cal-chevron" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};


export default Calendar;

