import React, { useMemo } from 'react';
import { useLatestRaceResults, useCalendar } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getCountryFlag, getNextSession } from '../utils/raceWeekend';
import { Radio, Activity, Timer, Flag, Award, AlertCircle } from 'lucide-react';
import type { RaceResult } from '../api/types';
import './LiveFeed.css';

export const LiveFeed: React.FC = () => {
  const { data: latestRace, isLoading: isLatestLoading, isError: isLatestError, refetch: refetchLatest } = useLatestRaceResults();
  const { data: calendar } = useCalendar('2026');

  const now = useMemo(() => new Date(), []);
  const nextSessionInfo = useMemo(() => calendar ? getNextSession(calendar, now) : null, [calendar, now]);

  if (isLatestLoading) {
    return (
      <div className="page live-page fade-in">
        <div className="skeleton-header skeleton" style={{ height: 50, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton-banner skeleton" style={{ height: 40, borderRadius: 6, marginBottom: 14 }} />
        <div className="skeleton-telemetry skeleton" style={{ height: 60, borderRadius: 8, marginBottom: 14 }} />
        <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
        <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
        <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
        <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6 }} />
      </div>
    );
  }

  if (isLatestError) {
    return (
      <div className="page live-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="live-error-box">
          <AlertCircle size={32} color="var(--color-primary)" />
          <h2 className="font-heading editorial-headline" style={{ color: 'var(--color-primary)' }}>TIMING FEED OFFLINE</h2>
          <p className="editorial-label">UNABLE TO CONNECT TO FIA RACE CONTROL</p>
          <button onClick={() => refetchLatest()} className="retry-btn font-mono">RECONNECT</button>
        </div>
      </div>
    );
  }

  if (!latestRace || !latestRace.Results || latestRace.Results.length === 0) {
    return (
      <div className="page live-page fade-in">
        <div className="live-status-banner offline font-mono">
          <div className="status-dot" style={{ background: 'var(--color-text-muted)' }} />
          <span>NO COMPLETED SESSION AVAILABLE</span>
        </div>
      </div>
    );
  }

  const winner = latestRace.Results.find(r => r.position === '1');
  const fastestLapEntry = latestRace.Results.find(r => r.FastestLap?.rank === '1');
  const totalFinishers = latestRace.Results.filter(r => r.status === 'Finished' || /^\+/.test(r.status || '') || /lap/i.test(r.status || '')).length;
  const dnfs = latestRace.Results.filter(r => !/finished/i.test(r.status || '') && !/^\+/.test(r.status || '') && !/lap/i.test(r.status || '')).length;
  const flagEmoji = getCountryFlag(latestRace.Circuit?.Location?.country, latestRace.Circuit?.Location?.locality);

  return (
    <div className="page live-page fade-in">
      {/* 1. Live Header */}
      <header className="live-header">
        <div className="lh-top">
          <div className="lh-left">
            <h1 className="live-title font-heading editorial-headline">LIVE TIMING</h1>
            <span className="live-subtitle font-mono">
              ROUND {String(latestRace.round).padStart(2, '0')} • {latestRace.season} FIA FORMULA 1
            </span>
          </div>
          <div className="lh-badge-live font-mono">
            <Radio size={12} color="var(--color-primary)" className="live-antenna-icon" />
            <span>STANDBY</span>
          </div>
        </div>

        <div className="lh-race-card">
          <div className="lh-gp-name font-heading">
            <span className="lh-flag">{flagEmoji}</span>
            {latestRace.raceName}
          </div>
          <div className="lh-circuit font-mono">
            {latestRace.Circuit?.circuitName?.toUpperCase()} • {latestRace.Circuit?.Location?.locality?.toUpperCase()}
          </div>
        </div>
      </header>

      {/* 2. Session Status Banner */}
      <div className="session-status-panel font-mono">
        <div className="ssp-left">
          <span className="ssp-dot" />
          <span className="ssp-status-text">OFF-TRACK (FINISHED)</span>
        </div>
        {nextSessionInfo ? (
          <div className="ssp-right">
            NEXT: <span className="ssp-next-val">{nextSessionInfo.sessionName.toUpperCase()}</span>
          </div>
        ) : (
          <div className="ssp-right">CLASSIFICATION OFFICIAL</div>
        )}
      </div>

      {/* 3. Fast Telemetry Quick Stats */}
      <div className="live-telemetry-strip">
        <div className="lt-chip">
          <Award size={13} color="var(--color-warning)" />
          <div className="lt-chip-data">
            <span className="editorial-label">WINNER</span>
            <span className="font-heading lt-chip-val" style={{ color: winner ? getTeamDetails(winner.Constructor.constructorId).color : '#fff' }}>
              {winner ? winner.Driver.familyName : '—'}
            </span>
          </div>
        </div>
        <div className="lt-chip">
          <Timer size={13} color="#C98EE8" />
          <div className="lt-chip-data">
            <span className="editorial-label">FASTEST LAP</span>
            <span className="font-heading lt-chip-val" style={{ color: '#C98EE8' }}>
              {fastestLapEntry ? `${fastestLapEntry.Driver.familyName} (${fastestLapEntry.FastestLap?.Time.time})` : '—'}
            </span>
          </div>
        </div>
        <div className="lt-chip">
          <Flag size={13} color="var(--color-success)" />
          <div className="lt-chip-data">
            <span className="editorial-label">FINISHERS</span>
            <span className="font-mono lt-chip-val">{totalFinishers} / {latestRace.Results.length}</span>
          </div>
        </div>
      </div>

      {/* 4. Live Classification Board */}
      <section className="live-classification-section">
        <div className="ltb-header font-mono">
          <span className="col-pos">POS</span>
          <span className="col-driver">DRIVER</span>
          <span className="col-time">GAP / STATUS</span>
          <span className="col-pts">PTS</span>
        </div>

        <div className="ltb-body">
          {latestRace.Results.map((result: RaceResult) => {
            const posNum = parseInt(result.position);
            const isP1 = posNum === 1;
            const isP2 = posNum === 2;
            const isP3 = posNum === 3;
            const isPodium = isP1 || isP2 || isP3;
            const isFastestLap = result.FastestLap?.rank === '1';
            const teamDetails = getTeamDetails(result.Constructor.constructorId);
            const teamColor = teamDetails.color || '#555';

            let displayGap = '—';
            const status = result.status || '';
            const timeStr = result.Time?.time;

            if (isP1) {
              displayGap = 'LEADER';
            } else if (timeStr) {
              displayGap = timeStr;
            } else if (/lap/i.test(status) || /^\+/.test(status)) {
              displayGap = status;
            } else if (status === 'Finished') {
              displayGap = 'FINISHED';
            } else {
              displayGap = status || 'DNF';
            }

            const gridPos = parseInt(result.grid);
            const posGain = gridPos > 0 ? gridPos - posNum : 0;

            return (
              <div 
                key={result.Driver.driverId} 
                className={`ltb-row ${isPodium ? 'is-podium' : ''} ${isP1 ? 'is-p1' : ''}`}
              >
                {/* Pos */}
                <div className="col-pos font-mono">
                  <span className={`pos-badge ${isP1 ? 'pos-p1' : isP2 ? 'pos-p2' : isP3 ? 'pos-p3' : ''}`}>
                    {String(result.positionText || result.position).padStart(2, '0')}
                  </span>
                </div>

                {/* Driver */}
                <div className="col-driver">
                  <div className="driver-team-stripe" style={{ backgroundColor: teamColor }} />
                  <div className="driver-avatar-mini">
                    <img 
                      src={getDriverVisual(result.Driver.driverId, 'portrait') || ''} 
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

                {/* Time / Gap */}
                <div className="col-time font-mono">
                  <span className={`time-text ${isP1 ? 'leader-time' : ''}`}>
                    {displayGap}
                  </span>
                  {posGain !== 0 && gridPos > 0 && (
                    <span className={`grid-gain ${posGain > 0 ? 'gain-up' : 'gain-down'}`}>
                      {posGain > 0 ? `▲${posGain}` : `▼${Math.abs(posGain)}`}
                    </span>
                  )}
                </div>

                {/* Points */}
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
      </section>

      {/* 5. Race Control / Session Event Log */}
      <section className="race-control-section">
        <div className="rc-header font-mono">
          <Activity size={13} color="var(--color-primary)" />
          <span>RACE CONTROL LOG</span>
        </div>
        <div className="rc-list font-mono">
          <div className="rc-event">
            <span className="rc-event-tag flag">CHEQUERED FLAG</span>
            <span className="rc-event-msg">
              Session completed • Winner: {winner?.Driver.givenName} {winner?.Driver.familyName} ({winner?.Constructor.name})
            </span>
          </div>
          {fastestLapEntry && (
            <div className="rc-event">
              <span className="rc-event-tag purple">FASTEST LAP</span>
              <span className="rc-event-msg">
                Lap {fastestLapEntry.FastestLap?.lap || '—'} set by {fastestLapEntry.Driver.familyName} ({fastestLapEntry.FastestLap?.Time.time})
              </span>
            </div>
          )}
          <div className="rc-event">
            <span className="rc-event-tag info">STANDINGS CONFIRMED</span>
            <span className="rc-event-msg">
              {totalFinishers} drivers classified, {dnfs} retirements recorded
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveFeed;

