import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import { useCalendar } from '../hooks/useF1Data';
import ErrorState from '../components/ui/ErrorState';
import './RaceCalendar.css';

const RaceCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { data: races, isLoading, isError, refetch } = useCalendar();
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const now = useMemo(() => new Date(), []);

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  // Format time helper
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const cleaned = timeStr.replace('Z', '');
    const parts = cleaned.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]} UTC`;
    }
    return timeStr;
  };

  // Categorize and filter races
  const processedRaces = useMemo(() => {
    if (!races) return { list: [], stats: { total: 0, completed: 0, upcoming: 0, nextRound: '' } };

    const listWithStatus = races.map((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      const isCompleted = raceDate <= now;

      return {
        ...race,
        isCompleted,
        raceDateTime: raceDate
      };
    });

    // Find the next upcoming race
    const nextUpcoming = listWithStatus.find(r => !r.isCompleted);
    const nextRoundNumber = nextUpcoming ? nextUpcoming.round : '';

    const completedCount = listWithStatus.filter(r => r.isCompleted).length;
    const upcomingCount = listWithStatus.length - completedCount;

    const filteredList = listWithStatus.filter((race) => {
      if (filter === 'completed') return race.isCompleted;
      if (filter === 'upcoming') return !race.isCompleted;
      return true;
    });

    return {
      list: filteredList,
      nextRound: nextRoundNumber,
      stats: {
        total: races.length,
        completed: completedCount,
        upcoming: upcomingCount,
        nextRound: nextRoundNumber
      }
    };
  }, [races, filter, now]);

  if (isLoading) {
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="skeleton" style={{ width: '80px', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '240px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '180px', height: '14px' }} />
        </div>
        <div className="calendar-stats-row">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width: '60px', height: '10px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '40px', height: '24px' }} />
            </div>
          ))}
        </div>
        <div className="timeline-loading">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-timeline-item">
              <div className="skeleton" style={{ width: '50px', height: '16px' }} />
              <div className="skeleton-card-body">
                <div className="skeleton" style={{ width: '60%', height: '18px', marginBottom: '12px' }} />
                <div className="skeleton" style={{ width: '40%', height: '12px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '30%', height: '12px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="calendar-container">
        <div className="calendar-error-wrapper">
          <ErrorState message="Unable to load the race calendar." onRetry={refetch} />
        </div>
      </div>
    );
  }

  const handleRowClick = (season: string, round: string) => {
    navigate(`/races/${season}/${round}`);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="header-title-section">
          <span className="calendar-category">F1 2026</span>
          <h1 className="calendar-title">Race Calendar</h1>
          <p className="calendar-subtitle">Every round. Every circuit. One season.</p>
        </div>
        <div className="header-badge-section">
          <span className="rounds-badge">{processedRaces.stats.total} ROUNDS</span>
        </div>
      </div>

      <div className="calendar-stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Rounds</span>
          <span className="stat-value">{processedRaces.stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value text-success">{processedRaces.stats.completed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Upcoming</span>
          <span className="stat-value text-accent">{processedRaces.stats.upcoming}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Next Round</span>
          <span className="stat-value">{processedRaces.nextRound ? `RD ${processedRaces.nextRound}` : '—'}</span>
        </div>
      </div>

      <div className="filter-row">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          type="button"
        >
          ALL
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
          type="button"
        >
          COMPLETED
        </button>
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
          type="button"
        >
          UPCOMING
        </button>
      </div>

      {processedRaces.list.length === 0 ? (
        <div className="calendar-empty-state">
          <RefreshCw size={24} className="empty-icon" />
          <p>No races match the selected filter.</p>
        </div>
      ) : (
        <div className="timeline-container">
          <div className="timeline-line" />
          <div className="timeline-list">
            {processedRaces.list.map((race) => {
              const isNext = race.round === processedRaces.nextRound;
              const statusClass = race.isCompleted ? 'status-completed' : (isNext ? 'status-next' : 'status-upcoming');
              const statusLabel = race.isCompleted ? 'COMPLETED' : (isNext ? 'NEXT RACE' : 'UPCOMING');

              return (
                <div
                  key={`${race.season}-${race.round}`}
                  className={`timeline-item ${isNext ? 'highlight-next' : ''}`}
                >
                  <div className="timeline-marker-wrapper">
                    <div className={`timeline-dot ${statusClass}`} />
                    <span className="timeline-round-label font-heading">RD {race.round}</span>
                  </div>

                  <div
                    className="timeline-card"
                    onClick={() => handleRowClick(race.season, race.round)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRowClick(race.season, race.round);
                      }
                    }}
                  >
                    <div className="card-top-header">
                      <span className={`status-pill ${statusClass}`}>{statusLabel}</span>
                    </div>

                    <div className="card-race-info">
                      <h3 className="card-race-title font-heading">{race.raceName}</h3>
                      <p className="card-circuit-details">
                        <MapPin size={12} className="card-icon" />
                        <span>{race.Circuit.circuitName} · {race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
                      </p>
                      <div className="card-time-details text-secondary">
                        <Calendar size={12} className="card-icon" />
                        <span style={{ marginRight: '12px' }}>{formatDate(race.date)}</span>
                        {race.time && (
                          <>
                            <Clock size={12} className="card-icon" />
                            <span>{formatTime(race.time)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      className="card-details-cta font-heading" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(race.season, race.round);
                      }}
                      type="button"
                    >
                      <span>VIEW RACE WEEKEND</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceCalendar;
