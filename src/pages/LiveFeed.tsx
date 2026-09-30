import React, { useState } from 'react';
import { 
  useRaceResults, 
  useQualifyingResults, 
  useSprintResults, 
  useLatestRaceResults,
  usePitStops
} from '../hooks/useF1Data';
import { useRaceState } from '../hooks/useRaceState';
import { useLanguage } from '../context/LanguageContext';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getCountryFlag } from '../utils/raceWeekend';
import { liveRaceTracker } from '../services/liveRaceTracker';
import { Radio, Activity, Timer, Flag, Award, AlertCircle, RefreshCw } from 'lucide-react';
import './LiveFeed.css';

export const LiveFeed: React.FC = () => {
  const { raceState, isLoading: isStateLoading, isError: isStateError, pollingInterval, now } = useRaceState();
  const { t } = useLanguage();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const activeOrLastSession = raceState?.activeSession || raceState?.lastCompletedSession;
  
  const isQualifying = activeOrLastSession?.type === 'QUALIFYING';
  const isSprint = activeOrLastSession?.type === 'SPRINT';
  const isRace = activeOrLastSession?.type === 'RACE' || (!isQualifying && !isSprint);

  const season = raceState?.race?.season || '2026';
  const round = raceState?.race?.round || '1';

  const isFallbackToLatest = raceState?.status === 'NO_RACE_WEEKEND' || raceState?.status === 'UPCOMING_WEEKEND';

  const { data: latestData, isLoading: isLatestLoading, isError: isLatestError, refetch: refetchLatest } = useLatestRaceResults();
  const { data: sprintData, isLoading: isSprintLoading, isError: isSprintError, refetch: refetchSprint } = useSprintResults(String(season), String(round));
  const { data: raceData, isLoading: isRaceLoading, isError: isRaceError, refetch: refetchRace } = useRaceResults(String(season), String(round));
  const { data: qualyData, isLoading: isQualyLoading, isError: isQualyError, refetch: refetchQualy } = useQualifyingResults(String(season), String(round));
  const { data: pitData } = usePitStops(String(season), String(round), isRace ? pollingInterval : null);

  // Determine active data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeData: any = isFallbackToLatest 
    ? (latestData || raceData) 
    : (isQualifying ? qualyData : isSprint ? (sprintData || raceData) : raceData);

  const resultsArray = activeData?.Results || activeData?.QualifyingResults || activeData?.SprintResults || [];

  // Manual refresh handler
  const triggerRefetch = async () => {
    setIsManualRefreshing(true);
    try {
      if (isFallbackToLatest) {
        await refetchLatest();
      } else if (isQualifying) {
        await refetchQualy();
      } else if (isSprint) {
        await refetchSprint();
      } else {
        const [res, pits] = await Promise.all([refetchRace(), pitData]);
        if (res.data) {
          liveRaceTracker.processRaceResults(res.data, pits);
        }
      }
    } finally {
      setLastRefreshed(new Date());
      setIsManualRefreshing(false);
    }
  };
  
  const isAnyLoading = isStateLoading || (isFallbackToLatest ? isLatestLoading : (isQualifying ? isQualyLoading : isSprint ? isSprintLoading : isRaceLoading));
  const isAnyError = isStateError || (isFallbackToLatest ? isLatestError : (isQualifying ? isQualyError : isSprint ? isSprintError : isRaceError));

  // Display title & badge computation
  let displayTitle = t('liveFeed');
  let displayBadge = t('pending');
  let badgeClass = "badge-standby";
  let displaySubtitle = "";

  if (isFallbackToLatest) {
    displayTitle = t('lastRaceResult');
    displayBadge = t('official');
    displaySubtitle = activeData ? `${t('round')} ${String(activeData.round).padStart(2, '0')} • ${activeData.season}` : '';
  } else if (raceState?.status === 'ACTIVE_SESSION') {
    displayTitle = activeOrLastSession?.name.toUpperCase() || t('liveFeed');
    displayBadge = t('liveStatus');
    badgeClass = "badge-live pulse-border";
    displaySubtitle = raceState?.race ? `${t('round')} ${String(raceState.race.round).padStart(2, '0')} • ${raceState.race.season}` : '';
  } else if (raceState?.status === 'WAITING_FOR_SESSION') {
    displayTitle = t('sessionPending');
    displayBadge = t('pending');
    displaySubtitle = raceState.nextSession ? raceState.nextSession.name.toUpperCase() : 'UNKNOWN';
  } else if (raceState?.status === 'POST_RACE') {
    if (resultsArray.length > 0) {
      displayTitle = t('raceClassification');
      displayBadge = t('official');
    } else {
      displayTitle = t('pending');
      displayBadge = t('pending');
    }
    displaySubtitle = raceState?.race ? `${t('round')} ${String(raceState.race.round).padStart(2, '0')} • ${raceState.race.season}` : '';
  }

  const raceDetails = isFallbackToLatest ? activeData : raceState?.race;

  if (isAnyLoading && !activeData && !isManualRefreshing) {
    return (
      <div className="page live-page fade-in">
        <div className="skeleton-header skeleton" style={{ height: 50, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton-banner skeleton" style={{ height: 40, borderRadius: 6, marginBottom: 14 }} />
        <div className="skeleton-telemetry skeleton" style={{ height: 60, borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
        <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
      </div>
    );
  }

  if (isAnyError && !activeData) {
    return (
      <div className="page live-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="live-error-box">
          <AlertCircle size={32} color="var(--color-primary)" />
          <h2 className="font-heading editorial-headline" style={{ color: 'var(--color-primary)' }}>TIMING FEED OFFLINE</h2>
          <p className="editorial-label">UNABLE TO CONNECT TO FIA RACE CONTROL</p>
          <button onClick={triggerRefetch} className="retry-btn font-mono">{t('retry').toUpperCase()}</button>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const winner = resultsArray.length > 0 ? resultsArray.find((r: any) => r.position === '1') : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fastestLapEntry = resultsArray.length > 0 ? resultsArray.find((r: any) => r.FastestLap?.rank === '1') : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalFinishers = resultsArray.length > 0 ? resultsArray.filter((r: any) => r.status === 'Finished' || /^\+/.test(r.status || '') || /lap/i.test(r.status || '')).length : 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dnfs = resultsArray.length > 0 ? resultsArray.filter((r: any) => !/finished/i.test(r.status || '') && !/^\+/.test(r.status || '') && !/lap/i.test(r.status || '')).length : 0;
  const flagEmoji = getCountryFlag(raceDetails?.Circuit?.Location?.country, raceDetails?.Circuit?.Location?.locality);
  
  const minutesSinceUpdate = Math.floor((now.getTime() - lastRefreshed.getTime()) / 60000);
  let updateText: string;
  if (isManualRefreshing) {
    updateText = 'CHECKING...';
  } else if (resultsArray.length === 0) {
    if (raceState?.status === 'POST_RACE') {
      updateText = t('retrievingTiming');
    } else if (pollingInterval) {
      updateText = t('activeSession');
    } else {
      updateText = t('dataNotAvailable');
    }
  } else {
    updateText = minutesSinceUpdate === 0 ? 'UPDATED: JUST NOW' : `UPDATED: ${minutesSinceUpdate}M AGO`;
  }

  return (
    <div className="page live-page fade-in">
      <header className="live-header">
        <div className="lh-top">
          <div className="lh-left">
            <h1 className="live-title font-heading editorial-headline">{displayTitle}</h1>
            <span className="live-subtitle font-mono">{displaySubtitle}</span>
          </div>
          <div className="lh-actions">
            <button onClick={triggerRefetch} className={`refresh-btn ${isManualRefreshing ? 'spinning' : ''}`} aria-label="Refresh Data">
              <RefreshCw size={14} color="var(--color-text-muted)" />
            </button>
            <div className={`lh-badge-live font-mono ${badgeClass}`}>
              {badgeClass === 'badge-live pulse-border' && <Radio size={12} color="var(--color-primary)" className="live-antenna-icon" />}
              <span>{displayBadge}</span>
            </div>
          </div>
        </div>

        {raceDetails && (
          <div className="lh-race-card">
            <div className="lh-gp-name font-heading">
              <span className="lh-flag">{flagEmoji}</span>
              {raceDetails.raceName || raceDetails.Circuit?.circuitName}
            </div>
            <div className="lh-circuit font-mono">
              {raceDetails.Circuit?.circuitName?.toUpperCase()} • {raceDetails.Circuit?.Location?.locality?.toUpperCase()}
            </div>
          </div>
        )}
      </header>

      <div className="session-status-panel font-mono">
        <div className="ssp-left">
          <span className={`ssp-dot ${raceState?.status === 'ACTIVE_SESSION' ? 'pulse' : ''}`} style={{ background: raceState?.status === 'ACTIVE_SESSION' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
          <span className="ssp-status-text">
            {raceState?.status === 'ACTIVE_SESSION' ? t('trackIsLive') : t('offTrack')}
          </span>
        </div>
        <div className="ssp-right" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
          {updateText}
        </div>
      </div>

      {!isQualifying && resultsArray.length > 0 && (
        <div className="live-telemetry-strip">
          <div className="lt-chip">
            <Award size={13} color="var(--color-warning)" />
            <div className="lt-chip-data">
              <span className="editorial-label">{t('winner')}</span>
              <span className="font-heading lt-chip-val" style={{ color: winner ? getTeamDetails(winner.Constructor.constructorId).color : '#fff' }}>
                {winner ? winner.Driver.familyName : '—'}
              </span>
            </div>
          </div>
          <div className="lt-chip">
            <Timer size={13} color="#C98EE8" />
            <div className="lt-chip-data">
              <span className="editorial-label">{t('fastestLap')}</span>
              <span className="font-heading lt-chip-val" style={{ color: '#C98EE8' }}>
                {fastestLapEntry ? `${fastestLapEntry.Driver.familyName}` : '—'}
              </span>
            </div>
          </div>
          <div className="lt-chip">
            <Flag size={13} color="var(--color-success)" />
            <div className="lt-chip-data">
              <span className="editorial-label">{t('finished')}</span>
              <span className="font-mono lt-chip-val">{totalFinishers} / {resultsArray.length}</span>
            </div>
          </div>
        </div>
      )}

      <section className="live-classification-section">
        <div className="ltb-header font-mono">
          <span className="col-pos">{t('pos')}</span>
          <span className="col-driver">{t('driver')}</span>
          <span className="col-time">{isQualifying ? 'Q3 / BEST' : `${t('timeStatus')}`}</span>
          <span className="col-pts">{t('pts')}</span>
        </div>

        {resultsArray.length === 0 ? (
          <div className="live-status-banner offline font-mono" style={{ marginTop: '1rem', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 1rem' }}>
            {raceState?.status === 'ACTIVE_SESSION' ? (
              <>
                <Activity size={32} color="var(--color-primary)" style={{ marginBottom: 16 }} />
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{t('sessionLive')}</span>
                <span style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('retrievingTiming')}</span>
              </>
            ) : raceState?.status === 'POST_RACE' ? (
              <>
                <Flag size={32} color="var(--color-text-primary)" style={{ marginBottom: 16 }} />
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{t('finalClassification')}</span>
                <span style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('retrievingTiming')}</span>
              </>
            ) : raceState?.status === 'WAITING_FOR_SESSION' ? (
              <>
                <Timer size={32} color="var(--color-text-muted)" style={{ marginBottom: 16 }} />
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{t('sessionNotStarted')}</span>
                <span style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Waiting for {activeOrLastSession?.name || 'session'} to start...</span>
              </>
            ) : (
              <>
                <AlertCircle size={32} color="var(--color-text-muted)" style={{ marginBottom: 16 }} />
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{t('noData')}</span>
                <span style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('dataNotAvailable')}</span>
              </>
            )}
          </div>
        ) : (
          <div className="ltb-body">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {resultsArray.map((result: any) => {
              const posNum = parseInt(result.position, 10);
              const isP1 = posNum === 1;
              const isP2 = posNum === 2;
              const isP3 = posNum === 3;
              const isPodium = isP1 || isP2 || isP3;
              const isFastestLap = result.FastestLap?.rank === '1';
              const teamDetails = getTeamDetails(result.Constructor.constructorId);
              const teamColor = teamDetails.color || '#555';

              let displayGap: React.ReactNode;
              if (isQualifying) {
                displayGap = result.Q3 || result.Q2 || result.Q1 || 'NO TIME';
              } else {
                const status = result.status || '';
                const timeStr = result.Time?.time;
                if (isP1) {
                  displayGap = 'LEADER';
                } else if (timeStr) {
                  displayGap = timeStr.startsWith('+') ? timeStr : (timeStr.includes(':') ? timeStr : `+${timeStr}`);
                } else if (/lap/i.test(status) || /^\+/.test(status)) {
                  displayGap = status;
                } else if (status === 'Finished') {
                  displayGap = 'FINISHED';
                } else {
                  if (result.laps && parseInt(result.laps, 10) > 0) {
                    displayGap = (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                        <span style={{ color: 'var(--color-primary)' }}>RET</span>
                        <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>Lap {result.laps} — {status}</span>
                      </div>
                    );
                  } else {
                    displayGap = <span style={{ color: 'var(--color-primary)' }}>RET — {status || 'DNF'}</span>;
                  }
                }
              }

              const gridPos = parseInt(result.grid, 10);
              let posGainText = '—';
              let posGainClass = 'gain-same';

              if (!isQualifying && !isNaN(gridPos) && gridPos > 0 && !isNaN(posNum) && posNum > 0) {
                const diff = gridPos - posNum;
                if (diff > 0) {
                  posGainText = `▲${diff}`;
                  posGainClass = 'gain-up';
                } else if (diff < 0) {
                  posGainText = `▼${Math.abs(diff)}`;
                  posGainClass = 'gain-down';
                } else {
                  posGainText = '—';
                  posGainClass = 'gain-same';
                }
              }

              return (
                <div 
                  key={result.Driver.driverId} 
                  className={`ltb-row ${isPodium ? 'is-podium' : ''} ${isP1 ? 'is-p1' : ''}`}
                >
                  <div className="col-pos font-mono">
                    <span className={`pos-badge ${isP1 ? 'pos-p1' : isP2 ? 'pos-p2' : isP3 ? 'pos-p3' : ''}`}>
                      {String(result.positionText || result.position).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="col-driver">
                    <div className="driver-team-stripe" style={{ backgroundColor: teamColor }} />
                    <div className="driver-avatar-mini">
                      <img 
                        src={getDriverVisual(result.Driver.driverId, result.Constructor?.constructorId) || ''} 
                        alt={result.Driver.familyName}
                        loading="lazy" 
                      />
                    </div>
                    <div className="driver-meta">
                      <div className="driver-name-line">
                        <span className="driver-code font-mono">{result.Driver.code || result.number || ''}</span>
                        <span className="driver-family font-heading" style={{ color: isFastestLap ? '#C98EE8' : 'var(--color-text-primary)' }}>
                          {result.Driver.familyName.toUpperCase()}
                        </span>
                      </div>
                      <span className="driver-team-name font-mono">{result.Constructor.name}</span>
                    </div>
                  </div>

                  <div className="col-time font-mono">
                    <span className={`time-text ${isP1 ? 'leader-time' : ''}`}>
                      {displayGap}
                    </span>
                    {!isQualifying && posGainText !== '—' && (
                      <span className={`grid-gain ${posGainClass}`}>
                        GR: {posGainText}
                      </span>
                    )}
                  </div>

                  <div className="col-pts font-mono">
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
        )}
      </section>

      {resultsArray.length > 0 && !isQualifying && (
        <section className="race-control-section">
          <div className="rc-header font-mono">
            <Activity size={13} color="var(--color-primary)" />
            <span>RACE CONTROL LOG</span>
          </div>
          <div className="rc-list font-mono">
            {raceState?.status === 'POST_RACE' || isFallbackToLatest ? (
              <div className="rc-event">
                <span className="rc-event-tag flag">CHEQUERED FLAG</span>
                <span className="rc-event-msg">
                  Session completed • Winner: {winner?.Driver.givenName} {winner?.Driver.familyName}
                </span>
              </div>
            ) : (
               <div className="rc-event">
                <span className="rc-event-tag info">TRACK GREEN</span>
                <span className="rc-event-msg">Session is ongoing.</span>
              </div>
            )}
            
            {fastestLapEntry && (
              <div className="rc-event">
                <span className="rc-event-tag purple">{t('fastestLap')}</span>
                <span className="rc-event-msg">
                  Lap {fastestLapEntry.FastestLap?.lap || '—'} set by {fastestLapEntry.Driver.familyName} ({fastestLapEntry.FastestLap?.Time.time})
                </span>
              </div>
            )}
            <div className="rc-event">
              <span className="rc-event-tag info">{t('standings').toUpperCase()}</span>
              <span className="rc-event-msg">
                {totalFinishers} classified, {dnfs} retirements
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LiveFeed;
