import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDriverStandings, useAllSeasonResults, useAllSeasonQualifying } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getDriverForm, getDriverStatsAggr, getTeammateComparison } from '../utils/driverStats';
import { Users, User, ArrowLeft, Trophy, Flag, AlertCircle } from 'lucide-react';
import type { DriverStanding } from '../api/types';
import './Drivers.css';

export const Drivers: React.FC = () => {
  const { state } = useLocation();
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError, refetch: refetchStandings } = useDriverStandings('2026');
  const { data: allResults } = useAllSeasonResults('2026');
  const { data: allQualifying, isError: isQualifyingError } = useAllSeasonQualifying('2026');

  const [viewMode, setViewMode] = useState<'lineup' | 'profile'>('lineup');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (state?.selectedDriverId) {
      setSelectedId(state.selectedDriverId);
      setViewMode('profile');
    }
  }, [state]);

  useEffect(() => {
    if (viewMode === 'profile') {
      const handleHardwareBack = (e: Event) => {
        e.preventDefault();
        setViewMode('lineup');
      };
      
      window.addEventListener('pacevion:hardwareBack', handleHardwareBack);
      return () => {
        window.removeEventListener('pacevion:hardwareBack', handleHardwareBack);
      };
    }
  }, [viewMode]);

  const selectDriver = (driverId: string) => {
    setSelectedId(driverId);
    setViewMode('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeDriverId = selectedId || (standings && standings.length > 0 ? standings[0].Driver.driverId : null);
  const activeDriver = standings?.find(s => s.Driver.driverId === activeDriverId) || (standings ? standings[0] : null);

  const driverStats = useMemo(() => {
    if (!activeDriverId || !allResults) {
      return { wins: '0', podiums: '0', poles: '0', racesCount: 0, raceEntries: [] };
    }

    const driverRaceEntries: { round: string; raceName: string; grid: string; position: string; points: string; status: string }[] = [];
    let wins = 0;
    let podiums = 0;

    allResults.forEach(race => {
      const res = race.Results?.find(r => r.Driver.driverId === activeDriverId);
      if (res) {
        const pos = parseInt(res.position);
        if (pos === 1) wins++;
        if (pos <= 3) podiums++;
        driverRaceEntries.push({
          round: race.round,
          raceName: race.raceName,
          grid: res.grid,
          position: res.positionText || res.position,
          points: res.points,
          status: res.status
        });
      }
    });

    let poles = 0;
    if (allQualifying && !isQualifyingError) {
      allQualifying.forEach(qRace => {
        const qRes = qRace.QualifyingResults?.find(r => r.Driver.driverId === activeDriverId);
        if (qRes && parseInt(qRes.position) === 1) poles++;
      });
    }

    return {
      wins: wins.toString(),
      podiums: podiums.toString(),
      poles: poles.toString(),
      racesCount: driverRaceEntries.length,
      raceEntries: driverRaceEntries
    };
  }, [activeDriverId, allResults, allQualifying, isQualifyingError]);

  const dStatsAggr = useMemo(() => activeDriverId && allResults ? getDriverStatsAggr(activeDriverId, allResults) : { bestFinish: null, avgFinish: null }, [activeDriverId, allResults]);
  const dForm = useMemo(() => activeDriverId && allResults ? getDriverForm(activeDriverId, allResults) : [], [activeDriverId, allResults]);
  const teammateComp = useMemo(() => {
    if (!activeDriverId || !activeDriver || !allResults) return null;
    return getTeammateComparison(activeDriverId, activeDriver.Constructors[0]?.constructorId, standings, allResults, allQualifying);
  }, [activeDriverId, activeDriver, standings, allResults, allQualifying]);

  if (isStandingsLoading) {
    return (
      <div className="page drivers-page fade-in">
        <div className="skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 160, borderRadius: 8, marginBottom: 14 }} />
        <div className="drivers-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  if (isStandingsError || !standings || standings.length === 0) {
    return (
      <div className="page drivers-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="drivers-error-box font-mono">
          <AlertCircle size={32} color="var(--color-primary)" />
          <h2 className="font-heading" style={{ color: 'var(--color-primary)' }}>DRIVERS DATA OFFLINE</h2>
          <p className="editorial-label">UNABLE TO RETRIEVE 2026 LINEUP</p>
          <button onClick={() => refetchStandings()} className="retry-btn font-mono">RECONNECT</button>
        </div>
      </div>
    );
  }

  const leaderDriver = standings[0];
  const uniqueTeamsCount = new Set(standings.map(s => s.Constructors[0]?.constructorId)).size;

  return (
    <div className="page drivers-page fade-in">
      <header className="drivers-header">
        <div className="dh-left">
          <h1 className="dh-title font-heading editorial-headline">2026 DRIVERS</h1>
          <span className="dh-subtitle font-mono">
            {standings.length} DRIVERS • {uniqueTeamsCount} CONSTRUCTORS
          </span>
        </div>

        <div className="dh-mode-toggle font-mono">
          <button 
            className={`dh-mode-btn ${viewMode === 'lineup' ? 'active' : ''}`}
            onClick={() => setViewMode('lineup')}
          >
            <Users size={12} />
            LINEUP
          </button>
          <button 
            className={`dh-mode-btn ${viewMode === 'profile' ? 'active' : ''}`}
            onClick={() => setViewMode('profile')}
          >
            <User size={12} />
            PROFILE
          </button>
        </div>
      </header>

      {viewMode === 'lineup' && (
        <div className="lineup-content fade-in">
          {leaderDriver && (
            <div 
              className="lineup-leader-card" 
              onClick={() => selectDriver(leaderDriver.Driver.driverId)}
              role="button"
              tabIndex={0}
            >
              <div 
                className="leader-accent-stripe" 
                style={{ backgroundColor: getTeamDetails(leaderDriver.Constructors[0]?.constructorId).color }} 
              />
              <div className="leader-left">
                <div className="leader-pos-badge font-mono">
                  <span className="pos-gold">P01</span>
                  <span className="pos-lbl">LEADER</span>
                </div>
                <div className="leader-text">
                  <span className="editorial-label">CHAMPIONSHIP LEADER</span>
                  <h2 className="leader-name font-heading">
                    {leaderDriver.Driver.givenName} {leaderDriver.Driver.familyName}
                  </h2>
                  <span 
                    className="leader-team font-mono"
                    style={{ color: getTeamDetails(leaderDriver.Constructors[0]?.constructorId).color }}
                  >
                    {leaderDriver.Constructors[0]?.name?.toUpperCase()}
                  </span>
                  <span className="leader-pts font-mono">{leaderDriver.points} PTS</span>
                </div>
              </div>
              <div className="leader-img-wrap">
                <img 
                  src={getDriverVisual(leaderDriver.Driver.driverId, 'portrait') || ''} 
                  alt={leaderDriver.Driver.familyName}
                  className="leader-img" 
                />
              </div>
            </div>
          )}

          <div className="drivers-grid">
            {standings.map((standing: DriverStanding) => {
              const posNum = parseInt(standing.position);
              const isP1 = posNum === 1;
              const isP2 = posNum === 2;
              const isP3 = posNum === 3;
              const teamDetails = getTeamDetails(standing.Constructors[0]?.constructorId);
              const teamColor = teamDetails.color || '#555';
              const driverCode = standing.Driver.code || standing.Driver.familyName.substring(0, 3).toUpperCase();
              const driverNum = standing.Driver.permanentNumber || standing.position;

              return (
                <div 
                  key={standing.Driver.driverId} 
                  className={`driver-card ${isP1 ? 'is-p1' : ''}`}
                  onClick={() => selectDriver(standing.Driver.driverId)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="dc-team-stripe" style={{ backgroundColor: teamColor }} />
                  <div className="dc-header font-mono">
                    <span className={`dc-pos ${isP1 ? 'pos-p1' : isP2 ? 'pos-p2' : isP3 ? 'pos-p3' : ''}`}>
                      P{standing.position}
                    </span>
                    <span className="dc-pts">{standing.points} PTS</span>
                  </div>

                  <div className="dc-body">
                    <div className="dc-avatar-wrap">
                      <img 
                        src={getDriverVisual(standing.Driver.driverId, 'portrait') || ''} 
                        alt={standing.Driver.familyName}
                        loading="lazy" 
                      />
                    </div>
                    <div className="dc-info">
                      <div className="dc-code-num font-mono">
                        <span className="dc-code">{driverCode}</span>
                        <span className="dc-num">#{driverNum}</span>
                      </div>
                      <h3 className="dc-name font-heading">
                        {standing.Driver.givenName?.[0]}. {standing.Driver.familyName.toUpperCase()}
                      </h3>
                      <span className="dc-team font-mono">{standing.Constructors[0]?.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'profile' && activeDriver && (
        <div className="profile-content fade-in">
          <div className="profile-pills-bar font-mono">
            <button 
              className="pills-back-btn"
              onClick={() => setViewMode('lineup')}
              title="Back to Lineup"
            >
              <ArrowLeft size={13} />
            </button>
            <div className="pills-scroll">
              {standings.map((s) => {
                const isCurrent = s.Driver.driverId === activeDriver.Driver.driverId;
                const teamCol = getTeamDetails(s.Constructors[0]?.constructorId).color || '#555';
                return (
                  <button
                    key={s.Driver.driverId}
                    className={`pill-btn ${isCurrent ? 'active' : ''}`}
                    onClick={() => selectDriver(s.Driver.driverId)}
                    style={{
                      borderColor: isCurrent ? teamCol : 'transparent',
                      color: isCurrent ? '#fff' : 'var(--color-text-muted)'
                    }}
                  >
                    {s.Driver.code || s.Driver.familyName.substring(0, 3).toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="profile-hero">
            <div 
              className="profile-hero-bg" 
              style={{ background: `linear-gradient(135deg, ${getTeamDetails(activeDriver.Constructors[0]?.constructorId).color}33 0%, rgba(18,21,29,0.95) 70%)` }} 
            />
            <div className="profile-bg-num font-mono">
              {activeDriver.Driver.permanentNumber || activeDriver.position}
            </div>
            
            <div className="profile-hero-inner">
              <div className="profile-hero-meta">
                <div className="ph-badge-row font-mono">
                  <span className="ph-pos-badge">P{activeDriver.position} IN CHAMPIONSHIP</span>
                  <span className="ph-code-badge">{activeDriver.Driver.code || ''} #{activeDriver.Driver.permanentNumber || '—'}</span>
                </div>
                <h1 className="ph-driver-name font-heading">
                  {activeDriver.Driver.givenName} <br />
                  <span>{activeDriver.Driver.familyName.toUpperCase()}</span>
                </h1>
                <div 
                  className="ph-team-name font-mono"
                  style={{ color: getTeamDetails(activeDriver.Constructors[0]?.constructorId).color }}
                >
                  {activeDriver.Constructors[0]?.name?.toUpperCase()}
                </div>
              </div>

              <div className="profile-hero-img-wrap">
                <img 
                  src={getDriverVisual(activeDriver.Driver.driverId, 'full') || getDriverVisual(activeDriver.Driver.driverId, 'portrait') || ''} 
                  alt={activeDriver.Driver.familyName}
                  className="ph-img" 
                />
              </div>
            </div>
          </div>

          <div className="profile-stats-grid font-mono">
            <div className="ps-card">
              <span className="editorial-label">STANDINGS POS</span>
              <span className="ps-val pos-gold">P{activeDriver.position}</span>
            </div>
            <div className="ps-card">
              <span className="editorial-label">TOTAL POINTS</span>
              <span className="ps-val">{activeDriver.points}</span>
            </div>
            <div className="ps-card">
              <span className="editorial-label">WINS</span>
              <span className="ps-val">{driverStats.wins}</span>
            </div>
            <div className="ps-card">
              <span className="editorial-label">PODIUMS</span>
              <span className="ps-val">{driverStats.podiums}</span>
            </div>
            <div className="ps-card">
              <span className="editorial-label">POLE POSITIONS</span>
              <span className="ps-val">{driverStats.poles}</span>
            </div>
            <div className="ps-card">
              <span className="editorial-label">RACES SCORED</span>
              <span className="ps-val">{driverStats.racesCount}</span>
            </div>
          </div>

          {dForm.length > 0 && (
            <section className="profile-section">
              <div className="sec-header font-mono">
                <Flag size={13} color="var(--color-primary)" />
                <span>RECENT RACE FORM (LAST {dForm.length} ROUNDS)</span>
              </div>
              <div className="form-chart-container">
                <div className="form-chart-bars">
                  {dForm.map((f, i) => {
                    const isDNF = f.position === 'DNF';
                    const isP1 = f.position === 1;
                    const isPodium = typeof f.position === 'number' && f.position <= 3;
                    const teamCol = getTeamDetails(activeDriver.Constructors[0]?.constructorId).color || 'var(--color-primary)';
                    const barHeight = isDNF ? 14 : Math.max(14, 100 - (Number(f.position) * 4.5));

                    return (
                      <div key={i} className="form-bar-col">
                        <div 
                          className="form-bar"
                          style={{
                            height: `${barHeight}%`,
                            backgroundColor: isP1 ? 'var(--color-warning)' : isDNF ? 'var(--color-primary)' : isPodium ? '#00C864' : teamCol
                          }}
                        >
                          <span className="form-bar-text font-mono">
                            {isDNF ? 'DNF' : `P${f.position}`}
                          </span>
                        </div>
                        <span className="form-round-label font-mono">R{f.round}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="form-summary font-mono">
                  <span>BEST: <strong style={{ color: '#fff' }}>{dStatsAggr.bestFinish}</strong></span>
                  <span>AVG: <strong style={{ color: '#fff' }}>{dStatsAggr.avgFinish}</strong></span>
                </div>
              </div>
            </section>
          )}

          {teammateComp && teammateComp.teammate && (
            <section className="profile-section">
              <div className="sec-header font-mono">
                <Trophy size={13} color="var(--color-warning)" />
                <span>TEAMMATE HEAD-TO-HEAD</span>
              </div>
              <div className="h2h-box font-mono">
                <div className="h2h-header font-heading">
                  <span className="h2h-d1">{activeDriver.Driver.familyName.toUpperCase()}</span>
                  <span className="h2h-vs">VS</span>
                  <span className="h2h-d2">{teammateComp.teammate.Driver.familyName.toUpperCase()}</span>
                </div>
                <div className="h2h-metric-row">
                  <span className="h2h-val left">{teammateComp.driverPoints}</span>
                  <span className="h2h-lbl">POINTS</span>
                  <span className="h2h-val right">{teammateComp.teammatePoints}</span>
                </div>
                <div className="h2h-metric-row">
                  <span className="h2h-val left">{teammateComp.driverWins}</span>
                  <span className="h2h-lbl">RACE WINS</span>
                  <span className="h2h-val right">{teammateComp.teammateWins}</span>
                </div>
                <div className="h2h-metric-row">
                  <span className="h2h-val left">{teammateComp.driverPodiums}</span>
                  <span className="h2h-lbl">PODIUMS</span>
                  <span className="h2h-val right">{teammateComp.teammatePodiums}</span>
                </div>
                <div className="h2h-metric-row">
                  <span className="h2h-val left">{teammateComp.driverQualyWins}</span>
                  <span className="h2h-lbl">QUALI BATTLE</span>
                  <span className="h2h-val right">{teammateComp.teammateQualyWins}</span>
                </div>
              </div>
            </section>
          )}

          {driverStats.raceEntries.length > 0 && (
            <section className="profile-section">
              <div className="sec-header font-mono">
                <span>2026 SEASON RACE RESULTS</span>
              </div>
              <div className="race-results-table">
                <div className="rr-table-header font-mono">
                  <span className="rr-col-rnd">RND</span>
                  <span className="rr-col-gp">GRAND PRIX</span>
                  <span className="rr-col-grid">GRID</span>
                  <span className="rr-col-pos">FINISH</span>
                  <span className="rr-col-pts">PTS</span>
                </div>
                <div className="rr-table-body font-mono">
                  {driverStats.raceEntries.map((re, idx) => (
                    <div key={idx} className="rr-row">
                      <span className="rr-col-rnd">R{re.round}</span>
                      <span className="rr-col-gp">{re.raceName}</span>
                      <span className="rr-col-grid">{re.grid === '0' ? 'PIT' : `P${re.grid}`}</span>
                      <span className={`rr-col-pos ${re.position === '1' ? 'pos-p1' : ''}`}>
                        {re.position === 'R' || !re.position ? 'DNF' : `P${re.position}`}
                      </span>
                      <span className="rr-col-pts">+{re.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="profile-section">
            <div className="sec-header font-mono">
              <span>DRIVER BIO & DETAILS</span>
            </div>
            <div className="bio-grid font-mono">
              <div className="bio-item">
                <span className="editorial-label">NATIONALITY</span>
                <span className="bio-val">{activeDriver.Driver.nationality || '—'}</span>
              </div>
              <div className="bio-item">
                <span className="editorial-label">DATE OF BIRTH</span>
                <span className="bio-val">{activeDriver.Driver.dateOfBirth || '—'}</span>
              </div>
              <div className="bio-item">
                <span className="editorial-label">PERMANENT NUMBER</span>
                <span className="bio-val">#{activeDriver.Driver.permanentNumber || '—'}</span>
              </div>
              <div className="bio-item">
                <span className="editorial-label">POWER UNIT</span>
                <span className="bio-val">{getTeamDetails(activeDriver.Constructors[0]?.constructorId).powerUnit || '—'}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Drivers;
