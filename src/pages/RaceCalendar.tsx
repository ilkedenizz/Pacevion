import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import ErrorState from '../components/ui/ErrorState';
import './RaceCalendar.css';

const RaceCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { data: races, isLoading, isError, refetch } = useCalendar();
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  useSEO({
    title: '2026 F1 Race Calendar & Schedule | Pacevion',
    description: 'Formula 1 2026 sezonundaki tüm yarışların takvimi.',
    canonicalPath: '/calendar'
  });

  const now = useMemo(() => new Date(), []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short'
    }).toUpperCase();
  };

  const processedRaces = useMemo(() => {
    if (!races) return { list: [], stats: { total: 0, nextRound: '' } };

    const listWithStatus = races.map((race) => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      const isCompleted = raceDate <= now;
      return { ...race, isCompleted, raceDateTime: raceDate };
    });

    const nextUpcoming = listWithStatus.find(r => !r.isCompleted);
    const nextRoundNumber = nextUpcoming ? nextUpcoming.round : '';

    const filteredList = listWithStatus.filter((race) => {
      if (filter === 'completed') return race.isCompleted;
      if (filter === 'upcoming') return !race.isCompleted;
      return true;
    });

    return {
      list: filteredList,
      nextRound: nextRoundNumber,
      stats: { total: races.length, nextRound: nextRoundNumber }
    };
  }, [races, filter, now]);

  if (isLoading) {
    return (
      <div className="calendar-board-container loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="calendar-board-container error">
        <ErrorState message="Unable to load the race calendar." onRetry={refetch} />
      </div>
    );
  }

  const handleRowClick = (season: string, round: string) => {
    navigate(`/races/${season}/${round}`);
  };

  return (
    <div className="calendar-board-container">
      <div className="calendar-board-header">
        <div className="cbh-titles">
          <h1 className="cbh-main">2026 RACE CALENDAR</h1>
          <span className="cbh-sub">SEASON 2026</span>
        </div>
        
        <div className="cbh-stats">
          <div className="cbh-stat-item">
            <span className="cbh-stat-label">TOTAL ROUNDS</span>
            <span className="cbh-stat-val">{processedRaces.stats.total}</span>
          </div>
          <div className="cbh-stat-item">
            <span className="cbh-stat-label">NEXT EVENT</span>
            <span className="cbh-stat-val text-accent">
              {processedRaces.stats.nextRound ? `RD ${processedRaces.stats.nextRound}` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="cb-filter-row">
        <button className={`cb-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>ALL RACES</button>
        <button className={`cb-filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>COMPLETED</button>
        <button className={`cb-filter-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>UPCOMING</button>
      </div>

      <div className="calendar-board-wrapper">
        <div className="cb-header-row">
          <div className="cb-col-round">ROUND</div>
          <div className="cb-col-date">DATE</div>
          <div className="cb-col-gp">GRAND PRIX</div>
          <div className="cb-col-circuit">CIRCUIT</div>
          <div className="cb-col-status">STATUS</div>
        </div>

        <div className="cb-body">
          {processedRaces.list.length === 0 ? (
            <div className="cb-empty">No races match the selected filter.</div>
          ) : (
            processedRaces.list.map((race) => {
              const isNext = race.round === processedRaces.nextRound;
              let rowClass = 'cb-row';
              let statusLabel = '';
              let statusClass = '';

              if (race.isCompleted) {
                rowClass += ' row-completed';
                statusLabel = 'COMPLETED';
                statusClass = 'status-completed';
              } else if (isNext) {
                rowClass += ' row-next';
                statusLabel = 'NEXT RACE';
                statusClass = 'status-next';
              } else {
                rowClass += ' row-upcoming';
                statusLabel = 'UPCOMING';
                statusClass = 'status-upcoming';
              }

              return (
                <div 
                  key={`${race.season}-${race.round}`}
                  className={rowClass}
                  onClick={() => handleRowClick(race.season, race.round)}
                >
                  <div className="cb-col-round">
                    <span className="cb-round-val">{String(race.round).padStart(2, '0')}</span>
                  </div>
                  <div className="cb-col-date">
                    <span className="cb-date-val">{formatDate(race.date)}</span>
                  </div>
                  <div className="cb-col-gp">
                    <span className="cb-gp-country">{race.Circuit.Location.country}</span>
                    <span className="cb-gp-name">{race.raceName}</span>
                  </div>
                  <div className="cb-col-circuit">
                    <span className="cb-circuit-name">{race.Circuit.circuitName}</span>
                  </div>
                  <div className="cb-col-status">
                    <span className={`cb-status-badge ${statusClass}`}>{statusLabel}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RaceCalendar;
