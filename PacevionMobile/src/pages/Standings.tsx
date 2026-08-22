import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverStandingsWithPrevious, useConstructorStandingsWithPrevious } from '../hooks/useF1Data';
import type { DriverStanding, ConstructorStanding } from '../api/types';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { AlertCircle } from 'lucide-react';
import './Standings.css';

export const Standings: React.FC = () => {
  const [tab, setTab] = useState<'drivers' | 'constructors'>('drivers');
  const navigate = useNavigate();
  
  const { data: driverData, isLoading: dLoading, isError: dError, refetch: dRefetch } = useDriverStandingsWithPrevious('2026');
  const { data: constructorData, isLoading: cLoading, isError: cError, refetch: cRefetch } = useConstructorStandingsWithPrevious('2026');

  const drivers = useMemo(() => driverData?.current || [], [driverData]);
  const prevDrivers = useMemo(() => driverData?.previous || [], [driverData]);
  const topDriver = drivers[0];
  const runnerUpDriver = drivers[1];
  const driverLeadGap = (topDriver && runnerUpDriver)
    ? Math.max(0, parseFloat(topDriver.points) - parseFloat(runnerUpDriver.points))
    : 0;

  const constructors = useMemo(() => constructorData?.current || [], [constructorData]);
  const prevConstructors = useMemo(() => constructorData?.previous || [], [constructorData]);
  const topConstructor = constructors[0];
  const runnerUpConstructor = constructors[1];
  const constructorLeadGap = (topConstructor && runnerUpConstructor)
    ? Math.max(0, parseFloat(topConstructor.points) - parseFloat(runnerUpConstructor.points))
    : 0;

  const getDriverTrend = (driverId: string, currentPosition: string) => {
    if (!prevDrivers || prevDrivers.length === 0) return { text: '—', class: 'trend-same' };
    const prevPos = prevDrivers.find(d => d.Driver.driverId === driverId)?.position;
    if (!prevPos) return { text: '—', class: 'trend-same' };
    
    const diff = parseInt(prevPos) - parseInt(currentPosition);
    if (diff > 0) return { text: `▲${diff}`, class: 'trend-up' };
    if (diff < 0) return { text: `▼${Math.abs(diff)}`, class: 'trend-down' };
    return { text: '—', class: 'trend-same' };
  };

  const getConstructorTrend = (constructorId: string, currentPosition: string) => {
    if (!prevConstructors || prevConstructors.length === 0) return { text: '—', class: 'trend-same' };
    const prevPos = prevConstructors.find(c => c.Constructor.constructorId === constructorId)?.position;
    if (!prevPos) return { text: '—', class: 'trend-same' };
    
    const diff = parseInt(prevPos) - parseInt(currentPosition);
    if (diff > 0) return { text: `▲${diff}`, class: 'trend-up' };
    if (diff < 0) return { text: `▼${Math.abs(diff)}`, class: 'trend-down' };
    return { text: '—', class: 'trend-same' };
  };

  const handleDriverClick = (driverId: string) => {
    navigate('/drivers', { state: { selectedDriverId: driverId } });
  };

  const handleConstructorClick = (_constructorId: string) => {
    navigate('/cars');
  };

  if ((tab === 'drivers' && dError) || (tab === 'constructors' && cError)) {
    return (
      <div className="page standings-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="st-error-box">
          <AlertCircle size={32} color="var(--color-primary)" />
          <h2 className="font-heading editorial-headline" style={{ color: 'var(--color-primary)' }}>STANDINGS OFFLINE</h2>
          <p className="editorial-label">UNABLE TO RETRIEVE CHAMPIONSHIP DATA</p>
          <button onClick={() => { dRefetch(); cRefetch(); }} className="retry-btn font-mono">RECONNECT</button>
        </div>
      </div>
    );
  }

  const isLoading = tab === 'drivers' ? dLoading : cLoading;

  return (
    <div className="page standings-page fade-in">
      {/* 1. Header */}
      <header className="st-header">
        <div className="st-header-left">
          <h1 className="st-title font-heading editorial-headline">2026 CHAMPIONSHIP</h1>
          <span className="st-subtitle font-mono">FIA FORMULA 1 WORLD CHAMPIONSHIP</span>
        </div>
      </header>

      {/* 2. Switcher */}
      <div className="st-segment-bar font-mono">
        <button 
          className={`st-segment-btn ${tab === 'drivers' ? 'active' : ''}`}
          onClick={() => setTab('drivers')}
        >
          DRIVERS STANDINGS ({drivers.length})
        </button>
        <button 
          className={`st-segment-btn ${tab === 'constructors' ? 'active' : ''}`}
          onClick={() => setTab('constructors')}
        >
          CONSTRUCTORS ({constructors.length})
        </button>
      </div>

      {isLoading ? (
        <div className="st-skeleton-wrap">
          <div className="skeleton-hero skeleton" style={{ height: 130, borderRadius: 8, marginBottom: 12 }} />
          <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
          <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
          <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6, marginBottom: 6 }} />
          <div className="skeleton-row skeleton" style={{ height: 48, borderRadius: 6 }} />
        </div>
      ) : tab === 'drivers' ? (
        <div className="st-content">
          {/* Top Driver Leader Card */}
          {topDriver && (
            <div 
              className="st-leader-hero" 
              onClick={() => handleDriverClick(topDriver.Driver.driverId)}
              role="button"
              tabIndex={0}
            >
              <div 
                className="st-leader-accent-stripe" 
                style={{ backgroundColor: getTeamDetails(topDriver.Constructors[0]?.constructorId).color }} 
              />
              <div className="st-leader-badge-col font-mono">
                <span className="st-rank-num">01</span>
                <span className="st-leader-tag">LEADER</span>
              </div>
              <div className="st-leader-avatar-wrap">
                <img 
                  src={getDriverVisual(topDriver.Driver.driverId, 'portrait') || ''} 
                  alt={topDriver.Driver.familyName}
                  className="st-leader-avatar" 
                />
              </div>
              <div className="st-leader-meta">
                <span className="editorial-label">CHAMPIONSHIP LEADER</span>
                <h2 className="st-leader-name font-heading">
                  {topDriver.Driver.givenName} {topDriver.Driver.familyName}
                </h2>
                <div 
                  className="st-leader-team font-mono"
                  style={{ color: getTeamDetails(topDriver.Constructors[0]?.constructorId).color }}
                >
                  {topDriver.Constructors[0]?.name?.toUpperCase()}
                </div>
                <div className="st-leader-stats font-mono">
                  <span className="st-leader-pts">{topDriver.points} PTS</span>
                  {driverLeadGap > 0 && runnerUpDriver && (
                    <span className="st-leader-gap">
                      +{driverLeadGap} PTS VS {runnerUpDriver.Driver.familyName.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Drivers Table */}
          <section className="st-table-section">
            <div className="st-table-header font-mono">
              <span className="st-col-pos">POS</span>
              <span className="st-col-driver">DRIVER</span>
              <span className="st-col-pts">PTS</span>
              <span className="st-col-trend">TREND</span>
            </div>

            <div className="st-table-body">
              {drivers.map((standing: DriverStanding) => {
                const posNum = parseInt(standing.position);
                const isP1 = posNum === 1;
                const isP2 = posNum === 2;
                const isP3 = posNum === 3;
                const teamDetails = getTeamDetails(standing.Constructors[0]?.constructorId);
                const teamColor = teamDetails.color || '#555';
                const trend = getDriverTrend(standing.Driver.driverId, standing.position);

                return (
                  <div 
                    key={standing.Driver.driverId} 
                    className={`st-row ${isP1 ? 'row-p1' : isP2 ? 'row-p2' : isP3 ? 'row-p3' : ''}`}
                    onClick={() => handleDriverClick(standing.Driver.driverId)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="st-col-pos font-mono">
                      <span className={`st-pos-text ${isP1 ? 'pos-p1' : isP2 ? 'pos-p2' : isP3 ? 'pos-p3' : ''}`}>
                        {String(standing.position).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="st-col-driver">
                      <div className="st-team-indicator" style={{ backgroundColor: teamColor }} />
                      <div className="st-avatar-mini">
                        <img 
                          src={getDriverVisual(standing.Driver.driverId, 'portrait') || ''} 
                          alt={standing.Driver.familyName}
                          loading="lazy" 
                        />
                      </div>
                      <div className="st-driver-names">
                        <span className="st-driver-family font-heading">
                          {standing.Driver.givenName?.[0]}. {standing.Driver.familyName.toUpperCase()}
                        </span>
                        <span className="st-team-label font-mono">{standing.Constructors[0]?.name}</span>
                      </div>
                    </div>

                    <div className="st-col-pts font-mono">
                      <span className="st-pts-val">{standing.points}</span>
                    </div>

                    <div className={`st-col-trend font-mono ${trend.class}`}>
                      {trend.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        <div className="st-content">
          {/* Top Constructor Leader Card */}
          {topConstructor && (
            <div 
              className="st-leader-hero constructor-hero" 
              onClick={() => handleConstructorClick(topConstructor.Constructor.constructorId)}
              role="button"
              tabIndex={0}
            >
              <div 
                className="st-leader-accent-stripe" 
                style={{ backgroundColor: getTeamDetails(topConstructor.Constructor.constructorId).color }} 
              />
              <div className="st-leader-badge-col font-mono">
                <span className="st-rank-num">01</span>
                <span className="st-leader-tag">P1</span>
              </div>
              <div className="st-leader-meta">
                <span className="editorial-label">CONSTRUCTORS CHAMPIONSHIP LEADER</span>
                <h2 className="st-leader-name font-heading">
                  {topConstructor.Constructor.name}
                </h2>
                <div 
                  className="st-leader-team font-mono"
                  style={{ color: getTeamDetails(topConstructor.Constructor.constructorId).color }}
                >
                  {getTeamDetails(topConstructor.Constructor.constructorId).powerUnit.toUpperCase()} POWER • {topConstructor.Constructor.nationality?.toUpperCase()}
                </div>
                <div className="st-leader-stats font-mono">
                  <span className="st-leader-pts">{topConstructor.points} PTS</span>
                  {constructorLeadGap > 0 && runnerUpConstructor && (
                    <span className="st-leader-gap">
                      +{constructorLeadGap} PTS VS {runnerUpConstructor.Constructor.name.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Constructors Table */}
          <section className="st-table-section">
            <div className="st-table-header font-mono">
              <span className="st-col-pos">POS</span>
              <span className="st-col-driver">CONSTRUCTOR</span>
              <span className="st-col-pts">PTS</span>
              <span className="st-col-trend">TREND</span>
            </div>

            <div className="st-table-body">
              {constructors.map((standing: ConstructorStanding) => {
                const posNum = parseInt(standing.position);
                const isP1 = posNum === 1;
                const isP2 = posNum === 2;
                const isP3 = posNum === 3;
                const teamDetails = getTeamDetails(standing.Constructor.constructorId);
                const teamColor = teamDetails.color || '#555';
                const trend = getConstructorTrend(standing.Constructor.constructorId, standing.position);

                return (
                  <div 
                    key={standing.Constructor.constructorId} 
                    className={`st-row ${isP1 ? 'row-p1' : isP2 ? 'row-p2' : isP3 ? 'row-p3' : ''}`}
                    onClick={() => handleConstructorClick(standing.Constructor.constructorId)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="st-col-pos font-mono">
                      <span className={`st-pos-text ${isP1 ? 'pos-p1' : isP2 ? 'pos-p2' : isP3 ? 'pos-p3' : ''}`}>
                        {String(standing.position).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="st-col-driver">
                      <div className="st-team-indicator" style={{ backgroundColor: teamColor }} />
                      <div className="st-driver-names" style={{ paddingLeft: '4px' }}>
                        <span className="st-driver-family font-heading">
                          {standing.Constructor.name.toUpperCase()}
                        </span>
                        <span className="st-team-label font-mono">
                          {teamDetails.powerUnit || standing.Constructor.nationality}
                        </span>
                      </div>
                    </div>

                    <div className="st-col-pts font-mono">
                      <span className="st-pts-val">{standing.points}</span>
                    </div>

                    <div className={`st-col-trend font-mono ${trend.class}`}>
                      {trend.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Standings;

