import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCalendar, useRaceResults, useQualifyingResults } from '../hooks/useF1Data';
import { getCircuitDetails } from '../data/circuitData';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getCountryFlag, getWeekendSessions } from '../utils/raceWeekend';
import { CircuitTrack } from '../components/common/CircuitTrack';
import { HomeCountdown } from '../components/common/HomeCountdown';
import { ArrowLeft, ChevronLeft, ChevronRight, Award, Timer, Flag, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import type { RaceResult, QualifyingResult } from '../api/types';
import './RaceDetails.css';

export const RaceDetails: React.FC = () => {
  const { season = '2026', round = '1' } = useParams<{ season: string; round: string }>();
  const navigate = useNavigate();

  const { data: calendar, isLoading: calendarLoading, isError: calendarError } = useCalendar(season);
  const { data: raceResults, isLoading: resultsLoading, isError: resultsError } = useRaceResults(season, round);
  const { data: qualifyingResults, isLoading: qualyLoading } = useQualifyingResults(season, round);

  const raceInfo = useMemo(() => {
    if (!calendar || calendar.length === 0) return null;
    return calendar.find((r) => r.round === round) || null;
  }, [calendar, round]);

  const isCompleted = useMemo(() => {
    if (raceResults?.Results && raceResults.Results.length > 0) return true;
    if (!raceInfo) return false;
    const now = new Date();
    const raceTimeStr = raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : `${raceInfo.time}Z`) : '00:00:00Z';
    const raceDate = new Date(`${raceInfo.date}T${raceTimeStr}`);
    return raceDate <= now;
  }, [raceResults, raceInfo]);

  const navigation = useMemo(() => {
    if (!calendar || calendar.length === 0) return { prev: null, next: null };
    const currentRoundIdx = calendar.findIndex(r => r.round === round);
    if (currentRoundIdx === -1) return { prev: null, next: null };
    return {
      prev: currentRoundIdx > 0 ? calendar[currentRoundIdx - 1] : null,
      next: currentRoundIdx < calendar.length - 1 ? calendar[currentRoundIdx + 1] : null
    };
  }, [calendar, round]);

  const circuitDetails = useMemo(() => {
    return raceInfo?.Circuit?.circuitId ? getCircuitDetails(raceInfo.Circuit.circuitId) : null;
  }, [raceInfo]);

  const sessions = useMemo(() => {
    if (!raceInfo) return [];
    return getWeekendSessions(raceInfo, new Date());
  }, [raceInfo]);

  const isLoading = calendarLoading || resultsLoading || qualyLoading;

  if (isLoading) {
    return (
      <div className="page race-details-page fade-in">
        <div className="skeleton" style={{ height: 40, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 160, borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
      </div>
    );
  }

  if (calendarError || resultsError || !raceInfo) {
    return (
      <div className="page race-details-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="rd-error-box font-mono">
          <AlertCircle size={32} color="var(--color-primary)" />
          <h2 className="font-heading" style={{ color: 'var(--color-primary)' }}>RACE DETAILS UNAVAILABLE</h2>
          <p className="editorial-label">UNABLE TO LOAD DATA FOR ROUND {round}</p>
          <button onClick={() => navigate('/calendar')} className="retry-btn font-mono">BACK TO CALENDAR</button>
        </div>
      </div>
    );
  }

  const flagEmoji = getCountryFlag(raceInfo.Circuit?.Location?.country, raceInfo.Circuit?.Location?.locality);
  const p1Result = raceResults?.Results?.find(r => r.position === '1');
  const p2Result = raceResults?.Results?.find(r => r.position === '2');
  const p3Result = raceResults?.Results?.find(r => r.position === '3');
  const fastestLapEntry = raceResults?.Results?.find(r => r.FastestLap?.rank === '1');

  return (
    <div className="page race-details-page fade-in">
      {/* 1. Header Navigation Bar */}
      <div className="rd-top-bar font-mono">
        <button 
          className="rd-back-btn" 
          onClick={() => navigate('/calendar')}
          title="Back to Calendar"
        >
          <ArrowLeft size={13} />
          <span>CALENDAR</span>
        </button>

        <div className="rd-nav-arrows">
          <button 
            className="rd-nav-arrow-btn"
            disabled={!navigation.prev}
            onClick={() => navigation.prev && navigate(`/races/${season}/${navigation.prev.round}`)}
            title="Previous Round"
          >
            <ChevronLeft size={14} />
            <span>R{navigation.prev?.round || '—'}</span>
          </button>
          <span className="rd-curr-round">ROUND {String(round).padStart(2, '0')}</span>
          <button 
            className="rd-nav-arrow-btn"
            disabled={!navigation.next}
            onClick={() => navigation.next && navigate(`/races/${season}/${navigation.next.round}`)}
            title="Next Round"
          >
            <span>R{navigation.next?.round || '—'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. Race Hero Header Card */}
      <header className="rd-race-hero">
        <div className="rd-hero-badges font-mono">
          <span className={`rd-status-tag ${isCompleted ? 'completed' : 'upcoming'}`}>
            {isCompleted ? 'COMPLETED' : 'UPCOMING'}
          </span>
          {raceInfo.Sprint && (
            <span className="rd-sprint-tag">SPRINT WEEKEND</span>
          )}
        </div>

        <h1 className="rd-race-name font-heading">
          <span className="rd-flag">{flagEmoji}</span>
          {raceInfo.raceName}
        </h1>

        <div className="rd-circuit-loc font-mono">
          {raceInfo.Circuit.circuitName.toUpperCase()} • {raceInfo.Circuit.Location.locality.toUpperCase()}, {raceInfo.Circuit.Location.country.toUpperCase()}
        </div>

        <div className="rd-hero-dates font-mono">
          <CalendarIcon size={12} color="var(--color-primary)" />
          <span>{raceInfo.date} {raceInfo.time ? `• ${raceInfo.time.replace('Z', ' UTC')}` : ''}</span>
        </div>
      </header>

      {/* 3. Circuit Visual & Telemetry */}
      <section className="rd-circuit-section">
        <div className="rd-circuit-vis-wrap">
          <CircuitTrack 
            circuitId={raceInfo.Circuit.circuitId} 
            circuitName={raceInfo.Circuit.circuitName}
            country={raceInfo.Circuit.Location.country}
            raceName={raceInfo.raceName}
            round={raceInfo.round}
            variant="hero"
          />
        </div>

        {circuitDetails && (
          <div className="rd-circuit-telemetry font-mono">
            <div className="ct-stat">
              <span className="editorial-label">TOTAL LAPS</span>
              <span className="ct-val">{circuitDetails.laps} LAPS</span>
            </div>
            <div className="ct-stat">
              <span className="editorial-label">RACE DISTANCE</span>
              <span className="ct-val">{circuitDetails.distance}</span>
            </div>
            <div className="ct-stat">
              <span className="editorial-label">LOCATION</span>
              <span className="ct-val">{raceInfo.Circuit.Location.locality?.toUpperCase()}</span>
            </div>
          </div>
        )}

      </section>

      {/* 4. COMPLETED RACE SECTIONS */}
      {isCompleted && raceResults?.Results && (
        <>
          {/* Podium Showcase */}
          {(p1Result || p2Result || p3Result) && (
            <section className="rd-podium-section">
              <div className="rd-section-header font-mono">
                <Award size={13} color="var(--color-warning)" />
                <span>OFFICIAL PODIUM</span>
              </div>
              <div className="rd-podium-grid">
                {/* P2 */}
                {p2Result && (
                  <div className="podium-card p2">
                    <div className="podium-rank font-mono pos-p2">P02</div>
                    <div className="podium-avatar">
                      <img 
                        src={getDriverVisual(p2Result.Driver.driverId, 'portrait') || ''} 
                        alt={p2Result.Driver.familyName} 
                      />
                    </div>
                    <span className="podium-name font-heading">{p2Result.Driver.familyName.toUpperCase()}</span>
                    <span className="podium-team font-mono" style={{ color: getTeamDetails(p2Result.Constructor.constructorId).color }}>
                      {p2Result.Constructor.name}
                    </span>
                    <span className="podium-pts font-mono">+{p2Result.points} PTS</span>
                  </div>
                )}

                {/* P1 Winner */}
                {p1Result && (
                  <div className="podium-card p1">
                    <div className="podium-rank font-mono pos-p1">P01</div>
                    <div className="podium-avatar">
                      <img 
                        src={getDriverVisual(p1Result.Driver.driverId, 'portrait') || ''} 
                        alt={p1Result.Driver.familyName} 
                      />
                    </div>
                    <span className="podium-name font-heading">{p1Result.Driver.familyName.toUpperCase()}</span>
                    <span className="podium-team font-mono" style={{ color: getTeamDetails(p1Result.Constructor.constructorId).color }}>
                      {p1Result.Constructor.name}
                    </span>
                    <span className="podium-pts font-mono">+{p1Result.points} PTS</span>
                  </div>
                )}

                {/* P3 */}
                {p3Result && (
                  <div className="podium-card p3">
                    <div className="podium-rank font-mono pos-p3">P03</div>
                    <div className="podium-avatar">
                      <img 
                        src={getDriverVisual(p3Result.Driver.driverId, 'portrait') || ''} 
                        alt={p3Result.Driver.familyName} 
                      />
                    </div>
                    <span className="podium-name font-heading">{p3Result.Driver.familyName.toUpperCase()}</span>
                    <span className="podium-team font-mono" style={{ color: getTeamDetails(p3Result.Constructor.constructorId).color }}>
                      {p3Result.Constructor.name}
                    </span>
                    <span className="podium-pts font-mono">+{p3Result.points} PTS</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Fastest Lap Banner */}
          {fastestLapEntry && (
            <div className="rd-fastest-lap-banner font-mono">
              <div className="fl-left">
                <Timer size={14} color="#C98EE8" />
                <span className="fl-label">FASTEST LAP</span>
              </div>
              <div className="fl-driver font-heading">
                {fastestLapEntry.Driver.givenName} {fastestLapEntry.Driver.familyName.toUpperCase()}
              </div>
              <div className="fl-time">
                {fastestLapEntry.FastestLap?.Time.time} (LAP {fastestLapEntry.FastestLap?.lap})
              </div>
            </div>
          )}

          {/* Final Classification Board */}
          <section className="rd-classification-section">
            <div className="rd-section-header font-mono">
              <Flag size={13} color="var(--color-primary)" />
              <span>RACE CLASSIFICATION ({raceResults.Results.length} DRIVERS)</span>
            </div>

            <div className="rd-table-header font-mono">
              <span className="rd-col-pos">POS</span>
              <span className="rd-col-driver">DRIVER</span>
              <span className="rd-col-time">TIME / GAP</span>
              <span className="rd-col-gain">GRID</span>
              <span className="rd-col-pts">PTS</span>
            </div>

            <div className="rd-table-body">
              {raceResults.Results.map((result: RaceResult) => {
                const posNum = parseInt(result.position);
                const isP1 = posNum === 1;
                const isP2 = posNum === 2;
                const isP3 = posNum === 3;
                const teamColor = getTeamDetails(result.Constructor.constructorId).color || '#555';
                const gridPos = parseInt(result.grid);
                const posGain = gridPos > 0 ? gridPos - posNum : 0;

                let displayTime = '—';
                const status = result.status || '';
                const timeStr = result.Time?.time;

                if (isP1) {
                  displayTime = timeStr || 'WINNER';
                } else if (timeStr) {
                  displayTime = timeStr;
                } else if (/lap/i.test(status) || /^\+/.test(status)) {
                  displayTime = status;
                } else if (status === 'Finished') {
                  displayTime = 'FINISHED';
                } else {
                  displayTime = status || 'DNF';
                }

                return (
                  <div key={result.Driver.driverId} className={`rd-table-row ${isP1 ? 'is-p1' : ''}`}>
                    <div className="rd-col-pos font-mono">
                      <span className={`pos-badge ${isP1 ? 'pos-p1' : isP2 ? 'pos-p2' : isP3 ? 'pos-p3' : ''}`}>
                        {String(result.positionText || result.position).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="rd-col-driver">
                      <div className="rd-driver-stripe" style={{ backgroundColor: teamColor }} />
                      <div className="rd-driver-meta">
                        <span className="rd-driver-name font-heading">
                          {result.Driver.givenName?.[0]}. {result.Driver.familyName.toUpperCase()}
                        </span>
                        <span className="rd-team-name font-mono">{result.Constructor.name}</span>
                      </div>
                    </div>

                    <div className="rd-col-time font-mono">
                      <span className="time-val">{displayTime}</span>
                    </div>

                    <div className="rd-col-gain font-mono">
                      <span className="grid-start">{result.grid === '0' ? 'PIT' : `P${result.grid}`}</span>
                      {posGain !== 0 && gridPos > 0 && (
                        <span className={`gain-indicator ${posGain > 0 ? 'gain-up' : 'gain-down'}`}>
                          {posGain > 0 ? `▲${posGain}` : `▼${Math.abs(posGain)}`}
                        </span>
                      )}
                    </div>

                    <div className="rd-col-pts font-mono">
                      {result.points && parseFloat(result.points) > 0 ? (
                        <span className="pts-active">+{result.points}</span>
                      ) : (
                        <span className="pts-zero">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Qualifying Results Table (if available) */}
          {qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0 && (
            <section className="rd-classification-section">
              <div className="rd-section-header font-mono">
                <span>QUALIFYING RESULTS</span>
              </div>
              <div className="rd-qualy-header font-mono">
                <span className="qualy-pos">POS</span>
                <span className="qualy-driver">DRIVER</span>
                <span className="qualy-q">Q1</span>
                <span className="qualy-q">Q2</span>
                <span className="qualy-q">Q3</span>
              </div>
              <div className="rd-qualy-body font-mono">
                {qualifyingResults.QualifyingResults.map((qRes: QualifyingResult) => (
                  <div key={qRes.Driver.driverId} className="rd-qualy-row">
                    <span className="qualy-pos">P{qRes.position}</span>
                    <span className="qualy-driver">{qRes.Driver.givenName?.[0]}. {qRes.Driver.familyName.toUpperCase()}</span>
                    <span className="qualy-q">{qRes.Q1 || '—'}</span>
                    <span className="qualy-q">{qRes.Q2 || '—'}</span>
                    <span className="qualy-q">{qRes.Q3 || '—'}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* 5. UPCOMING RACE SCHEDULE & COUNTDOWN */}
      {!isCompleted && (
        <section className="rd-upcoming-section">
          <div className="rd-countdown-card">
            <span className="editorial-label">GRAND PRIX COUNTDOWN</span>
            <HomeCountdown 
              targetDate={`${raceInfo.date}T${raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : raceInfo.time + 'Z') : '00:00:00Z'}`} 
            />
          </div>

          <div className="rd-sessions-schedule">
            <div className="rd-section-header font-mono">
              <CalendarIcon size={13} color="var(--color-primary)" />
              <span>WEEKEND SESSION SCHEDULE</span>
            </div>
            <div className="sessions-list font-mono">
              {sessions.map((sess, idx) => (
                <div key={idx} className={`session-row ${sess.status}`}>
                  <div className="sess-left">
                    <span className="sess-name">{sess.name.toUpperCase()}</span>
                    <span className="sess-date">{sess.displayDate} • {sess.displayTime}</span>
                  </div>
                  <span className={`sess-status-badge ${sess.status}`}>
                    {sess.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RaceDetails;

