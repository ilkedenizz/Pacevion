import React, { useEffect, useMemo, useState, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCalendar, useRaceResults, useQualifyingResults, useSprintResults } from '../hooks/useF1Data';
import { getCircuitDetails } from '../data/circuitData';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getCountryFlag, getWeekendSessions } from '../utils/raceWeekend';
import { CircuitTrack } from '../components/common/CircuitTrack';
import { HomeCountdown } from '../components/common/HomeCountdown';
import { ArrowLeft, ChevronLeft, ChevronRight, Award, Timer, Flag, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import type { RaceResult, QualifyingResult, SprintResult } from '../api/types';
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

  const isSprint = !!raceInfo?.Sprint?.date;

  const { data: sprintResults, isLoading: sprintLoading } = useSprintResults(season, round, isSprint);

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

  type SessionTab = 'FP1' | 'FP2' | 'FP3' | 'SPRINT_QUALI' | 'SPRINT' | 'QUALIFYING' | 'RACE';

  const sessionTabs = useMemo((): SessionTab[] => {
    if (!raceInfo) return ['RACE'];
    if (isSprint) {
      return ['FP1', 'SPRINT_QUALI', 'SPRINT', 'QUALIFYING', 'RACE'];
    }
    return ['FP1', 'FP2', 'FP3', 'QUALIFYING', 'RACE'];
  }, [raceInfo, isSprint]);

  const getTabSessionName = (tab: SessionTab): string => {
    switch (tab) {
      case 'FP1': return 'PRACTICE 1';
      case 'FP2': return 'PRACTICE 2';
      case 'FP3': return 'PRACTICE 3';
      case 'SPRINT_QUALI': return 'SPRINT SHOOTOUT';
      case 'SPRINT': return 'SPRINT';
      case 'QUALIFYING': return 'QUALIFYING';
      case 'RACE': return 'GRAND PRIX';
    }
  };

  const getTabStatus = (tab: SessionTab): 'completed' | 'current' | 'upcoming' => {
    const sessionName = getTabSessionName(tab);
    const sess = sessions.find(s => s.name.toUpperCase() === sessionName);
    if (sess) return sess.status;
    return isCompleted ? 'completed' : 'upcoming';
  };

  const getTabStatusLabel = (tab: SessionTab): string => {
    const status = getTabStatus(tab);
    if (status === 'current') return 'LIVE';
    if (status === 'upcoming') return 'UPCOMING';
    
    // For completed sessions, check if we have results
    if (tab === 'RACE') {
      return raceResults?.Results && raceResults.Results.length > 0 ? 'RESULTS' : 'NO DATA';
    }
    if (tab === 'QUALIFYING') {
      return qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0 ? 'RESULTS' : 'NO DATA';
    }
    if (tab === 'SPRINT') {
      return sprintResults?.SprintResults && sprintResults.SprintResults.length > 0 ? 'RESULTS' : 'NO DATA';
    }
    return 'NO DATA';
  };

  const defaultTab = useMemo((): SessionTab => {
    if (isCompleted) return 'RACE';
    if (!sessions || sessions.length === 0) return 'RACE';

    const nameToTabMap: Record<string, SessionTab> = {
      'PRACTICE 1': 'FP1',
      'PRACTICE 2': 'FP2',
      'PRACTICE 3': 'FP3',
      'SPRINT SHOOTOUT': 'SPRINT_QUALI',
      'SPRINT': 'SPRINT',
      'QUALIFYING': 'QUALIFYING',
      'GRAND PRIX': 'RACE'
    };

    const activeOrUpcomingSess = sessions.find(s => s.status === 'current') || sessions.find(s => s.status === 'upcoming');
    if (activeOrUpcomingSess) {
      return nameToTabMap[activeOrUpcomingSess.name.toUpperCase()] || 'RACE';
    }

    return 'RACE';
  }, [sessions, isCompleted]);

  const [activeTab, setActiveTab] = useState<SessionTab>('RACE');

  const scrollRef = useRef<{ beforeScrollTop: number; beforeSelectorTop: number } | null>(null);

  const handleTabClick = (tab: SessionTab) => {
    if (tab === activeTab) return;
    const page = document.querySelector('.race-details-page');
    const selector = document.querySelector('.rd-session-selector');
    if (page && selector) {
      scrollRef.current = {
        beforeScrollTop: page.scrollTop,
        beforeSelectorTop: selector.getBoundingClientRect().top
      };
    }
    setActiveTab(tab);
  };

  useLayoutEffect(() => {
    if (scrollRef.current) {
      const { beforeSelectorTop } = scrollRef.current;
      scrollRef.current = null;
      
      const page = document.querySelector('.race-details-page');
      const selector = document.querySelector('.rd-session-selector');
      
      if (page && selector) {
        const afterSelectorTop = selector.getBoundingClientRect().top;
        const currentScrollTop = page.scrollTop;
        
        // Sadece görünür bir kayma olduysa (tarayıcı native olarak clamp yaptıysa) müdahale et
        if (Math.abs(afterSelectorTop - beforeSelectorTop) > 1) {
          const desiredScrollTop = currentScrollTop + (afterSelectorTop - beforeSelectorTop);
          // Tarayıcı bu değeri yeni scrollHeight sınırlarına otomatik olarak clamp edecektir (güvenli)
          page.scrollTop = desiredScrollTop;
        }
      }
    }
  }, [activeTab]);

  // Reset tab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const sessionTabLabels: Record<SessionTab, string> = {
    FP1: 'FP1',
    FP2: 'FP2',
    FP3: 'FP3',
    SPRINT_QUALI: 'SPRINT QUALI',
    SPRINT: 'SPRINT',
    QUALIFYING: 'QUALIFYING',
    RACE: 'RACE',
  };

  const isPageLoading = calendarLoading || !raceInfo;

  if (isPageLoading) {
    return (
      <div className="page race-details-page fade-in">
        <div className="skeleton" style={{ height: 40, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 160, borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
      </div>
    );
  }

  if (calendarError || !raceInfo) {
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
      <div className="rd-nav font-mono">
        <button 
          className="rd-nav-btn" 
          onClick={() => navigate('/calendar')}
          title="Back to Calendar"
        >
          <ArrowLeft size={14} style={{ marginRight: 6 }} />
          <span>CALENDAR</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="rd-nav-btn"
            disabled={!navigation.prev}
            onClick={() => navigation.prev && navigate(`/races/${season}/${navigation.prev.round}`)}
            title="Previous Round"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="rd-curr-round">ROUND {String(round).padStart(2, '0')}</span>
          <button 
            className="rd-nav-btn"
            disabled={!navigation.next}
            onClick={() => navigation.next && navigate(`/races/${season}/${navigation.next.round}`)}
            title="Next Round"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Race Hero Header Card */}
      <header className="rd-race-hero">
        <div className="rd-hero-badges font-mono">
          <span className={`rd-status-tag ${isCompleted ? 'completed' : 'upcoming'}`}>
            {isCompleted ? 'COMPLETED' : 'UPCOMING'}
          </span>
          {raceInfo.Sprint?.date && (
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

      {/* 4. SESSION SELECTOR TAB BAR */}
      <div className="rd-session-selector">
        <div className="rd-session-tabs font-mono">
          {sessionTabs.map((tab) => {
            const status = getTabStatus(tab);
            const statusLabel = getTabStatusLabel(tab);
            return (
              <div
                key={tab}
                role="button"
                className={`rd-session-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                <span className="rd-tab-name">{sessionTabLabels[tab]}</span>
                <span className={`rd-tab-status-dot ${status}`} title={statusLabel} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SESSION CONTENT */}
      
      {/* 5.1 PRACTICE & SPRINT SHOOTOUT SESSIONS (FP1, FP2, FP3, SPRINT_QUALI) */}
      {(activeTab === 'FP1' || activeTab === 'FP2' || activeTab === 'FP3' || activeTab === 'SPRINT_QUALI') && (
        <section className="rd-classification-section">
          {(() => {
            const status = getTabStatus(activeTab);
            const statusLabel = getTabStatusLabel(activeTab);
            const sessionName = getTabSessionName(activeTab);
            const sess = sessions.find(s => s.name.toUpperCase() === sessionName);
            const dateStr = sess ? `${sess.displayDate} • ${sess.displayTime}` : '';
            return (
              <>
                <div className="rd-section-header font-mono">
                  <CalendarIcon size={13} color="var(--color-primary)" />
                  <span>{sessionName} INFORMATION</span>
                </div>
                <div className="rd-session-info-strip font-mono">
                  <div className="rd-sis-item">
                    <span className="editorial-label">STATUS</span>
                    <span className={`rd-sis-status ${status}`}>{statusLabel}</span>
                  </div>
                  {dateStr && (
                    <div className="rd-sis-item">
                      <span className="editorial-label">SCHEDULE</span>
                      <span className="rd-sis-val">{dateStr}</span>
                    </div>
                  )}
                </div>
                <div className="rd-no-data font-mono">
                  <AlertCircle size={20} color="var(--color-text-muted)" />
                  <span>{sessionTabLabels[activeTab]} DATA NOT AVAILABLE</span>
                  <span className="rd-no-data-sub">Practice and Sprint Qualifying results are not provided by the current data source.</span>
                </div>
              </>
            );
          })()}
        </section>
      )}

      {/* 5.2 QUALIFYING SESSION */}
      {activeTab === 'QUALIFYING' && (
        <section className="rd-classification-section">
          {(() => {
            const status = getTabStatus('QUALIFYING');
            const statusLabel = getTabStatusLabel('QUALIFYING');
            const sessionName = getTabSessionName('QUALIFYING');
            const sess = sessions.find(s => s.name.toUpperCase() === sessionName);
            const dateStr = sess ? `${sess.displayDate} • ${sess.displayTime}` : '';
            const hasData = qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0;
            return (
              <>
                <div className="rd-section-header font-mono">
                  <Timer size={13} color="var(--color-primary)" />
                  <span>QUALIFYING RESULTS</span>
                </div>
                <div className="rd-session-info-strip font-mono">
                  <div className="rd-sis-item">
                    <span className="editorial-label">STATUS</span>
                    <span className={`rd-sis-status ${status}`}>{statusLabel}</span>
                  </div>
                  {dateStr && (
                    <div className="rd-sis-item">
                      <span className="editorial-label">SCHEDULE</span>
                      <span className="rd-sis-val">{dateStr}</span>
                    </div>
                  )}
                </div>
                {qualyLoading ? (
                  <div className="rd-no-data font-mono">
                    <span className="rd-pulse-text">RETRIEVING QUALIFYING TIMING...</span>
                  </div>
                ) : hasData ? (
                  <div className="rd-table-wrapper">
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
                  </div>
                ) : (
                  <div className="rd-no-data font-mono">
                    <AlertCircle size={20} color="var(--color-text-muted)" />
                    {status === 'upcoming' ? (
                      <span>QUALIFYING HAS NOT STARTED YET</span>
                    ) : status === 'current' ? (
                      <span>QUALIFYING SESSION IS LIVE / IN PROGRESS</span>
                    ) : (
                      <span>QUALIFYING DATA NOT AVAILABLE</span>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </section>
      )}

      {/* 5.3 SPRINT SESSION */}
      {activeTab === 'SPRINT' && (
        <section className="rd-classification-section">
          {(() => {
            const status = getTabStatus('SPRINT');
            const statusLabel = getTabStatusLabel('SPRINT');
            const sessionName = getTabSessionName('SPRINT');
            const sess = sessions.find(s => s.name.toUpperCase() === sessionName);
            const dateStr = sess ? `${sess.displayDate} • ${sess.displayTime}` : '';
            const hasData = sprintResults?.SprintResults && sprintResults.SprintResults.length > 0;
            return (
              <>
                <div className="rd-section-header font-mono">
                  <Flag size={13} color="#FF8000" />
                  <span>SPRINT CLASSIFICATION</span>
                </div>
                <div className="rd-session-info-strip font-mono">
                  <div className="rd-sis-item">
                    <span className="editorial-label">STATUS</span>
                    <span className={`rd-sis-status ${status}`}>{statusLabel}</span>
                  </div>
                  {dateStr && (
                    <div className="rd-sis-item">
                      <span className="editorial-label">SCHEDULE</span>
                      <span className="rd-sis-val">{dateStr}</span>
                    </div>
                  )}
                </div>
                {sprintLoading ? (
                  <div className="rd-no-data font-mono">
                    <span className="rd-pulse-text">RETRIEVING SPRINT TIMING...</span>
                  </div>
                ) : hasData ? (
                  <div className="rd-table-wrapper">
                    <div className="rd-table-header font-mono">
                      <span className="rd-col-pos">POS</span>
                      <span className="rd-col-driver">DRIVER</span>
                      <span className="rd-col-time">TIME / GAP</span>
                      <span className="rd-col-gain">GRID</span>
                      <span className="rd-col-pts">PTS</span>
                    </div>
                    <div className="rd-table-body">
                      {sprintResults.SprintResults.map((result: SprintResult) => {
                        const posNum = parseInt(result.position);
                        const isP1 = posNum === 1;
                        const isP2 = posNum === 2;
                        const isP3 = posNum === 3;
                        const teamColor = getTeamDetails(result.Constructor.constructorId).color || '#555';
                        const gridPos = parseInt(result.grid);
                        const posGain = gridPos > 0 ? gridPos - posNum : 0;

                        let displayTime: React.ReactNode = '—';
                        const statusVal = result.status || '';
                        const timeStr = result.Time?.time;

                        if (isP1) {
                          displayTime = timeStr || 'WINNER';
                        } else if (timeStr) {
                          displayTime = timeStr;
                        } else if (/lap/i.test(statusVal) || /^\+/.test(statusVal)) {
                          displayTime = statusVal;
                        } else if (statusVal === 'Finished') {
                          displayTime = 'FINISHED';
                        } else {
                          if (result.laps && parseInt(result.laps, 10) > 0) {
                            displayTime = (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                                <span style={{ color: 'var(--color-primary)' }}>RET</span>
                                <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>Lap {result.laps} — {statusVal}</span>
                              </div>
                            );
                          } else {
                            displayTime = <span style={{ color: 'var(--color-primary)' }}>RET — {statusVal || 'DNF'}</span>;
                          }
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
                  </div>
                ) : (
                  <div className="rd-no-data font-mono">
                    <AlertCircle size={20} color="var(--color-text-muted)" />
                    {status === 'upcoming' ? (
                      <span>SPRINT HAS NOT STARTED YET</span>
                    ) : status === 'current' ? (
                      <span>SPRINT IS CURRENTLY LIVE / IN PROGRESS</span>
                    ) : (
                      <span>SPRINT DATA NOT AVAILABLE</span>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </section>
      )}

      {/* 5.4 GRAND PRIX (RACE) SESSION */}
      {activeTab === 'RACE' && (
        <>
          {resultsLoading ? (
            <section className="rd-classification-section">
              <div className="rd-section-header font-mono">
                <Flag size={13} color="var(--color-primary)" />
                <span>RACE CLASSIFICATION</span>
              </div>
              <div className="rd-no-data font-mono">
                <span className="rd-pulse-text">RETRIEVING OFFICIAL CLASSIFICATION...</span>
              </div>
            </section>
          ) : resultsError ? (
            <section className="rd-classification-section">
              <div className="rd-section-header font-mono">
                <Flag size={13} color="var(--color-primary)" />
                <span>RACE CLASSIFICATION</span>
              </div>
              <div className="rd-no-data font-mono">
                <AlertCircle size={20} color="var(--color-text-muted)" />
                <span>CLASSIFICATION DATA OFFLINE</span>
                <span className="rd-no-data-sub">Could not retrieve results from data source.</span>
              </div>
            </section>
          ) : raceResults?.Results && raceResults.Results.length > 0 ? (
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

                <div className="rd-table-wrapper">
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

                      let displayTime: React.ReactNode = '—';
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
                        if (result.laps && parseInt(result.laps, 10) > 0) {
                          displayTime = (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                              <span style={{ color: 'var(--color-primary)' }}>RET</span>
                              <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>Lap {result.laps} — {status}</span>
                            </div>
                          );
                        } else {
                          displayTime = <span style={{ color: 'var(--color-primary)' }}>RET — {status || 'DNF'}</span>;
                        }
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
                </div>
              </section>
            </>
          ) : (
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
        </>
      )}
    </div>
  );
};

export default RaceDetails;

