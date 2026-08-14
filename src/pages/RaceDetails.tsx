import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Trophy, HelpCircle, ChevronLeft, ChevronRight, Award, Timer } from 'lucide-react';
import { useSeasonCalendar, useRaceResults, useQualifyingResults } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import ErrorState from '../components/ui/ErrorState';
import './RaceDetails.css';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

const RaceDetails: React.FC = () => {
  const { season = '', round = '' } = useParams<{ season: string; round: string }>();
  const navigate = useNavigate();

  // Queries
  const {
    data: calendar,
    isLoading: calendarLoading,
    isError: calendarError,
    refetch: refetchCalendar
  } = useSeasonCalendar(season);

  const {
    data: raceResults,
    isLoading: resultsLoading,
    isError: resultsError,
    refetch: refetchResults
  } = useRaceResults(season, round);

  const {
    data: qualifyingResults,
    isLoading: qualifyingLoading,
    isError: qualifyingError,
    refetch: refetchQualifying
  } = useQualifyingResults(season, round);

  // Find this race info from calendar
  const raceInfo = useMemo(() => {
    if (!calendar || calendar.length === 0) return null;
    return calendar.find((r) => r.round === round) || null;
  }, [calendar, round]);

  const seoTitle = useMemo(() => {
    return raceInfo 
      ? `${raceInfo.raceName} ${season} Results & Qualifying | Pacevion`
      : `Formula 1 Season ${season} Round ${round} | Pacevion`;
  }, [raceInfo, season, round]);

  const seoDescription = useMemo(() => {
    return raceInfo 
      ? `Formula 1 ${season} ${raceInfo.raceName} (Round ${round}) detaylı yarış sonuçları, klasman sıralaması, pol pozisyonu dereceleri ve sıralama turları zamanları.`
      : `Formula 1 ${season} Round ${round} yarış hafta sonu detayları ve sonuçları.`;
  }, [raceInfo, season, round]);

  useSEO({
    title: seoTitle,
    description: seoDescription,
    canonicalPath: `/races/${season}/${round}`
  });


  // Is race completed?
  const isCompleted = useMemo(() => {
    if (raceResults) return true;
    if (!raceInfo) return false;
    const now = new Date();
    const raceTimeStr = raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : `${raceInfo.time}Z`) : '00:00:00Z';
    const raceDate = new Date(`${raceInfo.date}T${raceTimeStr}`);
    return raceDate <= now;
  }, [raceResults, raceInfo]);

  // Geri sayım sayacı
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    if (isCompleted || !raceInfo) return;

    const raceTimeStr = raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : `${raceInfo.time}Z`) : '00:00:00Z';
    const targetDate = new Date(`${raceInfo.date}T${raceTimeStr}`);

    const calculateTime = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [raceInfo, isCompleted]);

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

  // Calculations for Completed Race Summary
  const summaryMetrics = useMemo(() => {
    if (!raceResults) return null;

    const winnerResult = raceResults.Results?.find(r => r.position === '1');
    const winner = winnerResult 
      ? `${winnerResult.Driver.givenName} ${winnerResult.Driver.familyName}` 
      : '—';

    // Pole Position: Check qualifying first, fallback to grid = 1 in results
    let pole = '—';
    if (qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0) {
      const p1 = qualifyingResults.QualifyingResults[0];
      pole = `${p1.Driver.givenName} ${p1.Driver.familyName}`;
    } else if (raceResults.Results) {
      const p1Result = raceResults.Results.find(r => r.grid === '1');
      if (p1Result) {
        pole = `${p1Result.Driver.givenName} ${p1Result.Driver.familyName}`;
      }
    }

    // Fastest Lap
    const fastestResult = raceResults.Results?.find(r => r.FastestLap?.rank === '1');
    const fastestLap = fastestResult 
      ? `${fastestResult.Driver.givenName} ${fastestResult.Driver.familyName}` 
      : '—';
    const fastestLapTime = fastestResult?.FastestLap?.Time?.time || '';

    // Finishers (Finished or +Laps status)
    const finishers = raceResults.Results 
      ? raceResults.Results.filter(r => r.status === 'Finished' || r.status.startsWith('+')).length
      : 0;

    return {
      winner,
      pole,
      fastestLap,
      fastestLapTime,
      finishers
    };
  }, [raceResults, qualifyingResults]);

  // Navigation Logic
  const navigation = useMemo(() => {
    if (!calendar || calendar.length === 0) return { prev: null, next: null };
    const currentRoundIdx = calendar.findIndex(r => r.round === round);
    if (currentRoundIdx === -1) return { prev: null, next: null };

    const prev = currentRoundIdx > 0 ? calendar[currentRoundIdx - 1] : null;
    const next = currentRoundIdx < calendar.length - 1 ? calendar[currentRoundIdx + 1] : null;

    return { prev, next };
  }, [calendar, round]);

  const isLoading = calendarLoading || resultsLoading;
  const isError = calendarError || resultsError;

  const handleRetry = () => {
    refetchCalendar();
    refetchResults();
    refetchQualifying();
  };

  if (isLoading) {
    return (
      <div className="race-details-container">
        <div className="details-header-skeleton">
          <div className="skeleton" style={{ width: '100px', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '320px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '240px', height: '14px' }} />
        </div>
        <div className="details-stats-skeleton">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '70px' }} />
          ))}
        </div>
        <div className="skeleton-table-block">
          <div className="skeleton" style={{ width: '150px', height: '24px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ width: '100%', height: '300px' }} />
        </div>
      </div>
    );
  }

  if (isError || !raceInfo) {
    return (
      <div className="race-details-container">
        <div className="details-error-wrapper">
          <ErrorState message="Unable to load race weekend." onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="race-details-container">
      {/* Header Navigation */}
      <div className="race-round-navigator">
        <button
          className={`nav-btn prev-btn ${!navigation.prev ? 'disabled' : ''}`}
          onClick={() => navigation.prev && navigate(`/races/${season}/${navigation.prev.round}`)}
          disabled={!navigation.prev}
          aria-label="Previous round details"
          type="button"
        >
          <ChevronLeft size={16} />
          <span>PREVIOUS ROUND</span>
        </button>
        
        <button
          className={`nav-btn next-btn ${!navigation.next ? 'disabled' : ''}`}
          onClick={() => navigation.next && navigate(`/races/${season}/${navigation.next.round}`)}
          disabled={!navigation.next}
          aria-label="Next round details"
          type="button"
        >
          <span>NEXT ROUND</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Main Header */}
      <div className="race-details-header">
        <div className="header-meta-block">
          <span className="category-tag">F1 {season} · ROUND {round}</span>
          <span className={`status-pill ${isCompleted ? 'completed' : 'upcoming'}`}>
            {isCompleted ? 'COMPLETED' : 'UPCOMING'}
          </span>
        </div>
        <h1 className="grand-prix-title font-heading">{raceInfo.raceName}</h1>
        
        <div className="header-circuit-meta text-secondary">
          <div className="meta-row-item">
            <MapPin size={13} className="meta-icon accent" />
            <span>{raceInfo.Circuit.circuitName} · {raceInfo.Circuit.Location.locality}, {raceInfo.Circuit.Location.country}</span>
          </div>
          <div className="meta-row-item">
            <Calendar size={13} className="meta-icon" />
            <span style={{ marginRight: '12px' }}>{formatDate(raceInfo.date)}</span>
            {raceInfo.time && (
              <>
                <Clock size={13} className="meta-icon" />
                <span>{formatTime(raceInfo.time)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Race Weekend Grid */}
      <div className="race-weekend-grid">
        
        {/* Completed Race Summary Dashboard */}
        {isCompleted && summaryMetrics && (
          <div className="stats-summary-grid">
            <div className="summary-stat-card">
              <span className="summary-lbl">Winner</span>
              <span className="summary-val font-heading"><Trophy size={14} className="accent gold-trophy" /> {summaryMetrics.winner}</span>
            </div>
            <div className="summary-stat-card">
              <span className="summary-lbl">Pole Position</span>
              <span className="summary-val font-heading"><Award size={14} className="accent" /> {summaryMetrics.pole}</span>
            </div>
            <div className="summary-stat-card">
              <span className="summary-lbl">Fastest Lap</span>
              <span className="summary-val font-heading">
                <Timer size={14} className="accent" /> {summaryMetrics.fastestLap}
                {summaryMetrics.fastestLapTime && <span className="time-sub"> ({summaryMetrics.fastestLapTime})</span>}
              </span>
            </div>
            <div className="summary-stat-card">
              <span className="summary-lbl">Finishers</span>
              <span className="summary-val font-heading">{summaryMetrics.finishers} / {raceResults?.Results?.length || 0}</span>
            </div>
          </div>
        )}

        {/* Live Countdown for Upcoming Races */}
        {!isCompleted && (
          <div className="upcoming-race-landing-card">
            <div className="upcoming-card-content">
              <span className="badge-tag">RACE WEEKEND UPCOMING</span>
              <h2 className="title font-heading">This race has not started yet</h2>
              <p className="description text-secondary">
                The session weekend details, live classification standings, and qualifying grids will be available here as they occur.
              </p>
              
              {countdown && !countdown.isPassed && (
                <div className="details-countdown-container">
                  <div className="countdown-cell">
                    <span className="val font-mono">{String(countdown.days).padStart(2, '0')}</span>
                    <span className="lbl">DAYS</span>
                  </div>
                  <div className="countdown-divider">:</div>
                  <div className="countdown-cell">
                    <span className="val font-mono">{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="lbl">HRS</span>
                  </div>
                  <div className="countdown-divider">:</div>
                  <div className="countdown-cell">
                    <span className="val font-mono">{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="lbl">MINS</span>
                  </div>
                  <div className="countdown-divider">:</div>
                  <div className="countdown-cell">
                    <span className="val font-mono">{String(countdown.seconds).padStart(2, '0')}</span>
                    <span className="lbl">SECS</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Classification Tables */}
        {isCompleted && (
          <div className="classification-tables-section">
            
            {/* Race Results Table */}
            <div className="table-block">
              <h2 className="section-block-title font-heading">Race Classification</h2>
              {!raceResults?.Results || raceResults.Results.length === 0 ? (
                <div className="block-empty-state">No race results available yet.</div>
              ) : (
                <div className="table-overflow-wrapper">
                  <table className="classification-table">
                    <thead>
                      <tr>
                        <th scope="col" className="col-rank">POS</th>
                        <th scope="col" className="col-driver">DRIVER</th>
                        <th scope="col" className="col-team">TEAM</th>
                        <th scope="col" className="col-grid text-right">GRID</th>
                        <th scope="col" className="col-time">TIME / STATUS</th>
                        <th scope="col" className="col-pts text-right">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {raceResults.Results.map((result) => {
                        const isWinner = result.position === '1';
                        const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
                        const teamName = result.Constructor.name;
                        const hasFastestLap = result.FastestLap?.rank === '1';
                        const displayTime = result.Time?.time || result.status;

                        return (
                          <tr
                            key={result.Driver.driverId}
                            className={`table-row-item ${isWinner ? 'rank-leader' : ''}`}
                            onClick={() => navigate(`/drivers/${result.Driver.driverId}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                navigate(`/drivers/${result.Driver.driverId}`);
                              }
                            }}
                            aria-label={`View driver ${driverName}, classified ${result.position}`}
                          >
                            <td className="col-rank font-heading">
                              {isWinner ? (
                                <span className="trophy-badge"><Trophy size={11} className="gold-trophy" /></span>
                              ) : (
                                result.position
                              )}
                            </td>
                            <td className="col-driver font-bold">
                              <div className="driver-cell-inner">
                                <span>{driverName}</span>
                                {hasFastestLap && <span className="fastest-lap-badge">FL</span>}
                              </div>
                            </td>
                            <td className="col-team text-secondary">
                              {teamName}
                            </td>
                            <td className="col-grid text-right text-secondary font-heading">
                              {result.grid}
                            </td>
                            <td className="col-time text-secondary font-mono">
                              {displayTime}
                            </td>
                            <td className="col-pts text-right font-heading font-bold">
                              {result.points}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Qualifying Classification Table */}
            <div className="table-block" style={{ marginTop: 'var(--space-6)' }}>
              <h2 className="section-block-title font-heading">Qualifying Classification</h2>
              
              {qualifyingLoading ? (
                <div className="skeleton" style={{ width: '100%', height: '180px' }} />
              ) : qualifyingError ? (
                <div className="inner-error-box">
                  <ErrorState message="Could not load qualifying results." onRetry={refetchQualifying} />
                </div>
              ) : !qualifyingResults?.QualifyingResults || qualifyingResults.QualifyingResults.length === 0 ? (
                <div className="block-empty-state">
                  <HelpCircle size={16} className="empty-icon" />
                  <span>No qualifying data available.</span>
                </div>
              ) : (
                <div className="table-overflow-wrapper">
                  <table className="classification-table">
                    <thead>
                      <tr>
                        <th scope="col" className="col-rank">POS</th>
                        <th scope="col" className="col-driver">DRIVER</th>
                        <th scope="col" className="col-team">TEAM</th>
                        <th scope="col" className="col-q text-right">Q1</th>
                        <th scope="col" className="col-q text-right">Q2</th>
                        <th scope="col" className="col-q text-right">Q3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualifyingResults.QualifyingResults.map((result) => {
                        const isWinner = result.position === '1';
                        const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
                        const teamName = result.Constructor.name;

                        return (
                          <tr
                            key={result.Driver.driverId}
                            className={`table-row-item ${isWinner ? 'rank-leader' : ''}`}
                            onClick={() => navigate(`/drivers/${result.Driver.driverId}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                navigate(`/drivers/${result.Driver.driverId}`);
                              }
                            }}
                            aria-label={`View driver ${driverName}, qualified ${result.position}`}
                          >
                            <td className="col-rank font-heading">
                              {isWinner ? (
                                <span className="trophy-badge"><Trophy size={11} className="gold-trophy" /></span>
                              ) : (
                                result.position
                              )}
                            </td>
                            <td className="col-driver font-bold">
                              {driverName}
                            </td>
                            <td className="col-team text-secondary">
                              {teamName}
                            </td>
                            <td className="col-q text-right font-mono text-secondary">
                              {result.Q1}
                            </td>
                            <td className="col-q text-right font-mono text-secondary">
                              {result.Q2 || '—'}
                            </td>
                            <td className="col-q text-right font-mono text-secondary">
                              {result.Q3 || '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default RaceDetails;
