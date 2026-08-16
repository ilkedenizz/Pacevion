import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trophy, Timer, Award } from 'lucide-react';
import { useSeasonCalendar, useRaceResults, useQualifyingResults } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import ErrorState from '../components/ui/ErrorState';
import CircuitTrack from '../components/ui/CircuitTrack';
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

  const { data: calendar, isLoading: calendarLoading, isError: calendarError, refetch: refetchCalendar } = useSeasonCalendar(season);
  const { data: raceResults, isLoading: resultsLoading, isError: resultsError, refetch: refetchResults } = useRaceResults(season, round);
  const { data: qualifyingResults, refetch: refetchQualifying } = useQualifyingResults(season, round);

  const raceInfo = useMemo(() => {
    if (!calendar || calendar.length === 0) return null;
    return calendar.find((r) => r.round === round) || null;
  }, [calendar, round]);

  useSEO({
    title: raceInfo ? `${raceInfo.raceName} ${season} Results & Qualifying | Pacevion` : `Formula 1 Season ${season} Round ${round} | Pacevion`,
    description: `Formula 1 ${season} Round ${round} yarış hafta sonu detayları ve sonuçları.`,
    canonicalPath: `/races/${season}/${round}`
  });

  const isCompleted = useMemo(() => {
    if (raceResults) return true;
    if (!raceInfo) return false;
    const now = new Date();
    const raceTimeStr = raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : `${raceInfo.time}Z`) : '00:00:00Z';
    const raceDate = new Date(`${raceInfo.date}T${raceTimeStr}`);
    return raceDate <= now;
  }, [raceResults, raceInfo]);

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
      setCountdown({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPassed: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [raceInfo, isCompleted]);

  const summaryMetrics = useMemo(() => {
    if (!raceResults) return null;
    const winnerResult = raceResults.Results?.find(r => r.position === '1');
    const winner = winnerResult ? `${winnerResult.Driver.givenName} ${winnerResult.Driver.familyName}` : '—';
    let pole = '—';
    if (qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0) {
      pole = `${qualifyingResults.QualifyingResults[0].Driver.givenName} ${qualifyingResults.QualifyingResults[0].Driver.familyName}`;
    } else if (raceResults.Results) {
      const p1Result = raceResults.Results.find(r => r.grid === '1');
      if (p1Result) pole = `${p1Result.Driver.givenName} ${p1Result.Driver.familyName}`;
    }
    const fastestResult = raceResults.Results?.find(r => r.FastestLap?.rank === '1');
    const fastestLap = fastestResult ? `${fastestResult.Driver.givenName} ${fastestResult.Driver.familyName}` : '—';
    return { winner, pole, fastestLap };
  }, [raceResults, qualifyingResults]);

  const navigation = useMemo(() => {
    if (!calendar || calendar.length === 0) return { prev: null, next: null };
    const currentRoundIdx = calendar.findIndex(r => r.round === round);
    if (currentRoundIdx === -1) return { prev: null, next: null };
    return {
      prev: currentRoundIdx > 0 ? calendar[currentRoundIdx - 1] : null,
      next: currentRoundIdx < calendar.length - 1 ? calendar[currentRoundIdx + 1] : null
    };
  }, [calendar, round]);

  const isLoading = calendarLoading || resultsLoading;
  const isError = calendarError || resultsError;
  const handleRetry = () => { refetchCalendar(); refetchResults(); refetchQualifying(); };

  if (isLoading) {
    return (
      <div className="race-control-container loading">
        <div className="skeleton" style={{ width: '100%', height: '300px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
      </div>
    );
  }

  if (isError || !raceInfo) {
    return (
      <div className="race-control-container error">
        <ErrorState message="Unable to load race weekend." onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="race-control-container">
      <div className="rc-navigator">
        <button className={`rc-nav-btn ${!navigation.prev ? 'disabled' : ''}`} onClick={() => navigation.prev && navigate(`/races/${season}/${navigation.prev.round}`)}>
          <ChevronLeft size={14} /> <span>PREV ROUND</span>
        </button>
        <button className={`rc-nav-btn ${!navigation.next ? 'disabled' : ''}`} onClick={() => navigation.next && navigate(`/races/${season}/${navigation.next.round}`)}>
          <span>NEXT ROUND</span> <ChevronRight size={14} />
        </button>
      </div>

      <div className="rc-hero">
        <div className="rc-hero-content">
          <div className="rc-hero-top">
            <span className="rc-hero-round">ROUND {round}</span>
            <span className={`rc-hero-status ${isCompleted ? 'status-completed' : 'status-live'}`}>
              {isCompleted ? 'COMPLETED' : 'UPCOMING'}
            </span>
          </div>
          <h1 className="rc-hero-title">{raceInfo.raceName}</h1>
          <div className="rc-hero-meta">
            <span className="rc-hero-circuit">{raceInfo.Circuit.circuitName}</span>
            <span className="rc-hero-loc">{raceInfo.Circuit.Location.locality}, {raceInfo.Circuit.Location.country}</span>
          </div>
        </div>

        <div className="rc-hero-circuit-bg">
          <CircuitTrack 
            circuitId={raceInfo.Circuit.circuitId}
            circuitName={raceInfo.Circuit.circuitName}
            country={raceInfo.Circuit.Location.country}
            raceName={raceInfo.raceName}
            round={raceInfo.round}
            variant="hero"
          />
        </div>
      </div>

      <div className="rc-content">
        {!isCompleted && countdown && !countdown.isPassed && (
          <div className="rc-countdown-panel">
            <span className="rc-countdown-label">RACE STARTS IN</span>
            <div className="rc-countdown-clock">
              <div className="rc-cd-segment"><span className="rc-cd-val">{String(countdown.days).padStart(2, '0')}</span><span className="rc-cd-unit">DAYS</span></div>
              <div className="rc-cd-segment"><span className="rc-cd-val">{String(countdown.hours).padStart(2, '0')}</span><span className="rc-cd-unit">HRS</span></div>
              <div className="rc-cd-segment"><span className="rc-cd-val">{String(countdown.minutes).padStart(2, '0')}</span><span className="rc-cd-unit">MINS</span></div>
              <div className="rc-cd-segment"><span className="rc-cd-val">{String(countdown.seconds).padStart(2, '0')}</span><span className="rc-cd-unit">SECS</span></div>
            </div>
          </div>
        )}

        {isCompleted && summaryMetrics && (
          <div className="rc-summary-strip">
            <div className="rc-summary-item">
              <span className="rc-summary-lbl">WINNER</span>
              <span className="rc-summary-val text-accent"><Trophy size={14} /> {summaryMetrics.winner}</span>
            </div>
            <div className="rc-summary-item">
              <span className="rc-summary-lbl">POLE</span>
              <span className="rc-summary-val"><Award size={14} /> {summaryMetrics.pole}</span>
            </div>
            <div className="rc-summary-item">
              <span className="rc-summary-lbl">FASTEST LAP</span>
              <span className="rc-summary-val"><Timer size={14} /> {summaryMetrics.fastestLap}</span>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="rc-tables">
            <div className="rc-table-section">
              <h2 className="rc-table-title">RACE CLASSIFICATION</h2>
              {raceResults?.Results && raceResults.Results.length > 0 ? (
                <div className="tb-wrapper">
                  <div className="tb-header-row">
                    <div className="tb-col-pos">POS</div>
                    <div className="tb-col-driver">DRIVER</div>
                    <div className="tb-col-team">TEAM</div>
                    <div className="tb-col-grid">GRID</div>
                    <div className="tb-col-time">TIME/STATUS</div>
                    <div className="tb-col-pts">PTS</div>
                  </div>
                  <div className="tb-body">
                    {raceResults.Results.map(result => {
                      const isWinner = result.position === '1';
                      return (
                        <div key={result.Driver.driverId} className={`tb-row ${isWinner ? 'leader-row' : ''}`} onClick={() => navigate(`/drivers/${result.Driver.driverId}`)}>
                          <div className="tb-col-pos"><span className="tb-pos-badge">{result.position}</span></div>
                          <div className="tb-col-driver"><span className="tb-driver-name">{result.Driver.givenName} {result.Driver.familyName}</span></div>
                          <div className="tb-col-team"><span className="tb-team-name">{result.Constructor.name}</span></div>
                          <div className="tb-col-grid"><span className="tb-stat">{result.grid}</span></div>
                          <div className="tb-col-time"><span className="tb-stat">{result.Time?.time || result.status}</span></div>
                          <div className="tb-col-pts"><span className="tb-pts-val">{result.points}</span></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="rc-empty">No race results available.</div>
              )}
            </div>

            <div className="rc-table-section">
              <h2 className="rc-table-title">QUALIFYING CLASSIFICATION</h2>
              {qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0 ? (
                <div className="tb-wrapper">
                  <div className="tb-header-row">
                    <div className="tb-col-pos">POS</div>
                    <div className="tb-col-driver">DRIVER</div>
                    <div className="tb-col-team">TEAM</div>
                    <div className="tb-col-q">Q1</div>
                    <div className="tb-col-q">Q2</div>
                    <div className="tb-col-q">Q3</div>
                  </div>
                  <div className="tb-body">
                    {qualifyingResults.QualifyingResults.map(result => {
                      const isWinner = result.position === '1';
                      return (
                        <div key={result.Driver.driverId} className={`tb-row ${isWinner ? 'leader-row' : ''}`} onClick={() => navigate(`/drivers/${result.Driver.driverId}`)}>
                          <div className="tb-col-pos"><span className="tb-pos-badge">{result.position}</span></div>
                          <div className="tb-col-driver"><span className="tb-driver-name">{result.Driver.givenName} {result.Driver.familyName}</span></div>
                          <div className="tb-col-team"><span className="tb-team-name">{result.Constructor.name}</span></div>
                          <div className="tb-col-q"><span className="tb-stat">{result.Q1 || '—'}</span></div>
                          <div className="tb-col-q"><span className="tb-stat">{result.Q2 || '—'}</span></div>
                          <div className="tb-col-q"><span className="tb-stat">{result.Q3 || '—'}</span></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="rc-empty">No qualifying results available.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceDetails;
