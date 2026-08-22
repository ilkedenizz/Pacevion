import React, { useState, useEffect, useMemo } from 'react';
import { useConstructorStandings, useDriverStandings, useAllSeasonResults } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual, getCarVisual } from '../data/assets';
import { getTeamSeasonPerformance, getTeamDrivers } from '../utils/teamStats';
import { Users, Car as CarIcon, ArrowLeft, Trophy, AlertCircle, Wrench } from 'lucide-react';
import type { ConstructorStanding } from '../api/types';
import './Cars.css';

export const Cars: React.FC = () => {
  const { data: standings, isLoading, isError, refetch: refetchTeams } = useConstructorStandings('2026');
  const { data: driverStandings } = useDriverStandings('2026');
  const { data: allResults } = useAllSeasonResults('2026');

  const [viewMode, setViewMode] = useState<'lineup' | 'detail'>('lineup');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (standings && standings.length > 0 && !selectedId) {
      setSelectedId(standings[0].Constructor.constructorId);
    }
  }, [standings, selectedId]);

  const selectTeam = (constructorId: string) => {
    setSelectedId(constructorId);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTeamId = selectedId || (standings && standings.length > 0 ? standings[0].Constructor.constructorId : null);
  const activeTeam = standings?.find(s => s.Constructor.constructorId === activeTeamId) || (standings ? standings[0] : null);
  const details = activeTeam ? getTeamDetails(activeTeam.Constructor.constructorId) : null;

  const teamPerf = useMemo(() => {
    if (!activeTeamId || !allResults) return [];
    return getTeamSeasonPerformance(activeTeamId, allResults);
  }, [activeTeamId, allResults]);

  const teamDrivers = useMemo(() => {
    if (!activeTeamId || !driverStandings) return [];
    return getTeamDrivers(activeTeamId, driverStandings);
  }, [activeTeamId, driverStandings]);

  if (isLoading) {
    return (
      <div className="page cars-page fade-in">
        <div className="skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 160, borderRadius: 8, marginBottom: 14 }} />
        <div className="cars-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !standings || standings.length === 0) {
    return (
      <div className="page cars-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="cars-error-box font-mono">
          <AlertCircle size={32} color="var(--color-primary)" />
          <h2 className="font-heading" style={{ color: 'var(--color-primary)' }}>CONSTRUCTORS OFFLINE</h2>
          <p className="editorial-label">UNABLE TO RETRIEVE TEAM DATA</p>
          <button onClick={() => refetchTeams()} className="retry-btn font-mono">RECONNECT</button>
        </div>
      </div>
    );
  }

  const leaderTeam = standings[0];
  const maxPts = teamPerf.length > 0 ? teamPerf[teamPerf.length - 1].totalPoints : 100;

  return (
    <div className="page cars-page fade-in">
      {/* 1. Header & View Mode Switcher */}
      <header className="cars-header">
        <div className="ch-left">
          <h1 className="ch-title font-heading editorial-headline">2026 CONSTRUCTORS</h1>
          <span className="ch-subtitle font-mono">
            {standings.length} TEAMS • 20 DRIVERS • 10 POWER UNITS
          </span>
        </div>

        <div className="ch-mode-toggle font-mono">
          <button 
            className={`ch-mode-btn ${viewMode === 'lineup' ? 'active' : ''}`}
            onClick={() => setViewMode('lineup')}
          >
            <Users size={12} />
            GRID
          </button>
          <button 
            className={`ch-mode-btn ${viewMode === 'detail' ? 'active' : ''}`}
            onClick={() => setViewMode('detail')}
          >
            <CarIcon size={12} />
            TEAM
          </button>
        </div>
      </header>

      {/* LINEUP VIEW */}
      {viewMode === 'lineup' && (
        <div className="lineup-content fade-in">
          {/* Championship Leader Team Hero */}
          {leaderTeam && (
            <div 
              className="lineup-leader-card" 
              onClick={() => selectTeam(leaderTeam.Constructor.constructorId)}
              role="button"
              tabIndex={0}
            >
              <div 
                className="leader-accent-stripe" 
                style={{ backgroundColor: getTeamDetails(leaderTeam.Constructor.constructorId).color }} 
              />
              <div className="leader-left">
                <div className="leader-pos-badge font-mono">
                  <span className="pos-gold">P01</span>
                  <span className="pos-lbl">LEADER</span>
                </div>
                <div className="leader-text">
                  <span className="editorial-label">CONSTRUCTORS CHAMPIONSHIP LEADER</span>
                  <h2 className="leader-name font-heading">
                    {leaderTeam.Constructor.name}
                  </h2>
                  <span 
                    className="leader-team font-mono"
                    style={{ color: getTeamDetails(leaderTeam.Constructor.constructorId).color }}
                  >
                    {getTeamDetails(leaderTeam.Constructor.constructorId).powerUnit.toUpperCase()} POWER • {leaderTeam.Constructor.nationality?.toUpperCase()}
                  </span>
                  <span className="leader-pts font-mono">{leaderTeam.points} PTS</span>
                </div>
              </div>
              <div className="leader-car-img-wrap">
                <img 
                  src={getCarVisual(leaderTeam.Constructor.constructorId)} 
                  alt={leaderTeam.Constructor.name}
                  className="leader-car-img" 
                />
              </div>
            </div>
          )}

          {/* All 10 Teams Grid */}
          <div className="cars-grid">
            {standings.map((standing: ConstructorStanding) => {
              const posNum = parseInt(standing.position);
              const isP1 = posNum === 1;
              const isP2 = posNum === 2;
              const isP3 = posNum === 3;
              const teamInfo = getTeamDetails(standing.Constructor.constructorId);
              const teamColor = teamInfo.color || '#555';
              const teamDriversList = driverStandings ? getTeamDrivers(standing.Constructor.constructorId, driverStandings) : [];

              return (
                <div 
                  key={standing.Constructor.constructorId} 
                  className={`team-card ${isP1 ? 'is-p1' : ''}`}
                  onClick={() => selectTeam(standing.Constructor.constructorId)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="tc-team-stripe" style={{ backgroundColor: teamColor }} />
                  <div className="tc-header font-mono">
                    <span className={`tc-pos ${isP1 ? 'pos-p1' : isP2 ? 'pos-p2' : isP3 ? 'pos-p3' : ''}`}>
                      P{standing.position}
                    </span>
                    <span className="tc-pts">{standing.points} PTS</span>
                  </div>

                  <div className="tc-body">
                    <div className="tc-meta">
                      <h3 className="tc-name font-heading">
                        {standing.Constructor.name.toUpperCase()}
                      </h3>
                      <span className="tc-engine font-mono">
                        {teamInfo.powerUnit || standing.Constructor.nationality}
                      </span>
                    </div>

                    <div className="tc-drivers font-mono">
                      {teamDriversList.map(td => (
                        <span key={td.Driver.driverId} className="tc-driver-pill">
                          {td.Driver.familyName.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED TEAM VIEW */}
      {viewMode === 'detail' && activeTeam && details && (
        <div className="detail-content fade-in">
          {/* Team Switcher Pills Bar */}
          <div className="profile-pills-bar font-mono">
            <button 
              className="pills-back-btn"
              onClick={() => setViewMode('lineup')}
              title="Back to Grid"
            >
              <ArrowLeft size={13} />
            </button>
            <div className="pills-scroll">
              {standings.map((s) => {
                const isCurrent = s.Constructor.constructorId === activeTeam.Constructor.constructorId;
                const teamCol = getTeamDetails(s.Constructor.constructorId).color || '#555';
                return (
                  <button
                    key={s.Constructor.constructorId}
                    className={`pill-btn ${isCurrent ? 'active' : ''}`}
                    onClick={() => selectTeam(s.Constructor.constructorId)}
                    style={{
                      borderColor: isCurrent ? teamCol : 'transparent',
                      color: isCurrent ? '#fff' : 'var(--color-text-muted)'
                    }}
                  >
                    {s.Constructor.name.substring(0, 4).toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Hero Card */}
          <div className="team-hero">
            <div 
              className="team-hero-bg" 
              style={{ background: `linear-gradient(135deg, ${details.color}33 0%, rgba(18,21,29,0.95) 70%)` }} 
            />
            <div className="team-bg-pos font-mono">
              P{activeTeam.position}
            </div>

            <div className="team-hero-inner">
              <div className="team-hero-meta">
                <div className="th-badge-row font-mono">
                  <span className="th-pos-badge">P{activeTeam.position} IN CHAMPIONSHIP</span>
                  <span className="th-base-badge">{activeTeam.Constructor.nationality?.toUpperCase()}</span>
                </div>
                <h1 className="th-team-name font-heading">
                  {activeTeam.Constructor.name}
                </h1>
                <div 
                  className="th-engine-name font-mono"
                  style={{ color: details.color }}
                >
                  {details.fullName}
                </div>
              </div>

              <div className="team-hero-img-wrap">
                <img 
                  src={getCarVisual(activeTeam.Constructor.constructorId)} 
                  alt={activeTeam.Constructor.name} 
                  className="th-car-img" 
                />
              </div>
            </div>
          </div>

          {/* Team Stats Grid */}
          <div className="profile-stats-grid font-mono">
            <div className="ps-card">
              <span className="editorial-label">STANDINGS POS</span>
              <span className="ps-val pos-gold">P{activeTeam.position}</span>
            </div>
            <div className="ps-card">
              <span className="editorial-label">CHAMPIONSHIP PTS</span>
              <span className="ps-val">{activeTeam.points}</span>
            </div>
            <div className="ps-card">
              <span className="editorial-label">RACE WINS</span>
              <span className="ps-val">{activeTeam.wins || '0'}</span>
            </div>
          </div>

          {/* Driver Lineup Comparison */}
          {teamDrivers.length === 2 && (
            <section className="profile-section">
              <div className="sec-header font-mono">
                <Trophy size={13} color="var(--color-warning)" />
                <span>OFFICIAL DRIVER LINEUP</span>
              </div>
              <div className="drivers-comparison-grid">
                {/* Driver 1 */}
                <div className="dcomp-card" style={{ borderLeft: `3px solid ${details.color}` }}>
                  <div className="dcomp-avatar">
                    <img 
                      src={getDriverVisual(teamDrivers[0].Driver.driverId, 'portrait') || ''} 
                      alt={teamDrivers[0].Driver.familyName} 
                    />
                  </div>
                  <div className="dcomp-meta font-mono">
                    <span className="dcomp-code">{teamDrivers[0].Driver.code || ''} #{teamDrivers[0].Driver.permanentNumber || ''}</span>
                    <span className="dcomp-name font-heading">{teamDrivers[0].Driver.givenName} {teamDrivers[0].Driver.familyName.toUpperCase()}</span>
                    <span className="dcomp-pts">{teamDrivers[0].points} PTS (P{teamDrivers[0].position})</span>
                  </div>
                </div>

                {/* Driver 2 */}
                <div className="dcomp-card" style={{ borderRight: `3px solid ${details.color}` }}>
                  <div className="dcomp-avatar">
                    <img 
                      src={getDriverVisual(teamDrivers[1].Driver.driverId, 'portrait') || ''} 
                      alt={teamDrivers[1].Driver.familyName} 
                    />
                  </div>
                  <div className="dcomp-meta font-mono">
                    <span className="dcomp-code">{teamDrivers[1].Driver.code || ''} #{teamDrivers[1].Driver.permanentNumber || ''}</span>
                    <span className="dcomp-name font-heading">{teamDrivers[1].Driver.givenName} {teamDrivers[1].Driver.familyName.toUpperCase()}</span>
                    <span className="dcomp-pts">{teamDrivers[1].points} PTS (P{teamDrivers[1].position})</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Season Performance Chart */}
          {teamPerf.length > 0 && (
            <section className="profile-section">
              <div className="sec-header font-mono">
                <span>POINTS PROGRESSION ACROSS SEASON</span>
              </div>
              <div className="form-chart-container">
                <div className="form-chart-bars">
                  {teamPerf.map((p, i) => {
                    const h = Math.max(10, (p.totalPoints / (maxPts || 1)) * 100);
                    return (
                      <div key={i} className="form-bar-col">
                        <div 
                          className="form-bar"
                          style={{
                            height: `${h}%`,
                            backgroundColor: details.color || 'var(--color-primary)'
                          }}
                        >
                          <span className="form-bar-text font-mono">
                            {p.totalPoints}
                          </span>
                        </div>
                        <span className="form-round-label font-mono">R{p.round}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Technical Team Specifications */}
          <section className="profile-section">
            <div className="sec-header font-mono">
              <Wrench size={13} color="var(--color-text-secondary)" />
              <span>TECHNICAL SPECIFICATIONS</span>
            </div>
            <div className="bio-grid font-mono">
              <div className="bio-item">
                <span className="editorial-label">FULL NAME</span>
                <span className="bio-val">{details.fullName}</span>
              </div>
              <div className="bio-item">
                <span className="editorial-label">OPERATIONS BASE</span>
                <span className="bio-val">{activeTeam.Constructor.nationality?.toUpperCase()}</span>
              </div>
              <div className="bio-item">
                <span className="editorial-label">2026 CHASSIS</span>
                <span className="bio-val">{details.chassis}</span>
              </div>
              <div className="bio-item">
                <span className="editorial-label">POWER UNIT</span>
                <span className="bio-val">{details.powerUnit}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Cars;

