import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverStandings, useConstructorStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './Standings.css';

export const Standings: React.FC = () => {
  const [tab, setTab] = useState<'drivers' | 'constructors'>('drivers');
  const navigate = useNavigate();
  
  const { data: driverData, isLoading: dLoading } = useDriverStandings('2026');
  const { data: constructorData, isLoading: cLoading } = useConstructorStandings('2026');

  const drivers = driverData || [];
  const topDriver = drivers[0];
  const otherDrivers = drivers.slice(1);

  const constructors = constructorData || [];
  const topConstructor = constructors[0];
  const otherConstructors = constructors.slice(1);

  const getTrend = (idx: number) => {
    if (idx % 3 === 0) return { icon: '↑', class: 'trend-up' };
    if (idx % 4 === 0) return { icon: '↓', class: 'trend-down' };
    return { icon: '—', class: 'trend-same' };
  };

  const handleDriverClick = (driverId: string) => {
    // Navigate to drivers tab, we can pass state if we had a router set up for it, 
    // for now just navigate to drivers page.
    navigate('/drivers', { state: { selectedDriverId: driverId } });
  };

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1 className="editorial-headline">CHAMPIONSHIP</h1>
        
        <div className="tab-switch font-heading">
          <button 
            className={`tab-btn ${tab === 'drivers' ? 'active' : ''}`}
            onClick={() => setTab('drivers')}
          >
            DRIVERS
          </button>
          <button 
            className={`tab-btn ${tab === 'constructors' ? 'active' : ''}`}
            onClick={() => setTab('constructors')}
          >
            CONSTRUCTORS
          </button>
        </div>
      </header>

      {tab === 'drivers' ? (
        dLoading ? <div className="skeleton" style={{ height: 400 }} /> : (
          <div className="standings-content">
            {topDriver && (
              <div className="st-leader-card" onClick={() => handleDriverClick(topDriver.Driver.driverId)}>
                <div className="st-leader-bg" style={{ background: `linear-gradient(135deg, ${getTeamDetails(topDriver.Constructors[0]?.constructorId).color}44 0%, rgba(0,0,0,0) 70%)` }} />
                
                <div className="st-leader-pos editorial-num">01</div>
                
                <div className="st-leader-content">
                  <div className="st-leader-info">
                    <span className="font-heading editorial-headline name">
                      {topDriver.Driver.givenName[0]}. {topDriver.Driver.familyName}
                    </span>
                    <span className="editorial-label team-name">{topDriver.Constructors[0]?.name}</span>
                    <div className="pts-block">
                      <span className="font-mono editorial-num pts-val">{topDriver.points}</span>
                      <span className="editorial-label">PTS</span>
                    </div>
                  </div>
                  
                  <div className="st-leader-img">
                    <img 
                      src={getDriverVisual(topDriver.Driver.driverId, 'portrait')} 
                      alt={topDriver.Driver.familyName} 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="st-list timing-board">
              <div className="tb-header editorial-label">
                <span className="tb-pos">POS</span>
                <span className="tb-driver">DRIVER</span>
                <span className="tb-pts">PTS</span>
                <span className="tb-trend"></span>
              </div>
              
              {otherDrivers.map((standing: any, idx: number) => {
                const teamColor = getTeamDetails(standing.Constructors[0]?.constructorId).color || '#333';
                const trend = getTrend(idx + 1);
                return (
                  <div key={standing.Driver.driverId} className="tb-row" onClick={() => handleDriverClick(standing.Driver.driverId)}>
                    <div className="tb-pos font-mono">{standing.position.padStart(2, '0')}</div>
                    
                    <div className="tb-driver-col">
                      <div className="tb-team-line" style={{ background: teamColor }} />
                      <div className="tb-avatar">
                        <img src={getDriverVisual(standing.Driver.driverId, 'portrait')} alt="avatar" />
                      </div>
                      <div className="tb-names">
                        <span className="tb-lastname font-heading editorial-headline">{standing.Driver.familyName}</span>
                        <span className="tb-teamname editorial-label">{standing.Constructors[0]?.name}</span>
                      </div>
                    </div>
                    
                    <div className="tb-pts font-mono">{standing.points}</div>
                    <div className={`tb-trend ${trend.class}`}>{trend.icon}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        cLoading ? <div className="skeleton" style={{ height: 400 }} /> : (
          <div className="standings-content">
            {topConstructor && (
              <div className="st-leader-card">
                <div className="st-leader-bg" style={{ background: `linear-gradient(135deg, ${getTeamDetails(topConstructor.Constructor.constructorId).color}44 0%, rgba(0,0,0,0) 70%)` }} />
                
                <div className="st-leader-pos editorial-num">01</div>
                
                <div className="st-leader-content" style={{ paddingBottom: '32px' }}>
                  <div className="st-leader-info">
                    <span className="font-heading editorial-headline name">
                      {topConstructor.Constructor.name}
                    </span>
                    <span className="editorial-label team-name">{topConstructor.Constructor.nationality}</span>
                    <div className="pts-block">
                      <span className="font-mono editorial-num pts-val">{topConstructor.points}</span>
                      <span className="editorial-label">PTS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="st-list timing-board">
              <div className="tb-header editorial-label">
                <span className="tb-pos">POS</span>
                <span className="tb-driver">TEAM</span>
                <span className="tb-pts">PTS</span>
                <span className="tb-trend"></span>
              </div>
              
              {otherConstructors.map((standing: any, idx: number) => {
                const teamColor = getTeamDetails(standing.Constructor.constructorId).color || '#333';
                const trend = getTrend(idx + 1);
                return (
                  <div key={standing.Constructor.constructorId} className="tb-row">
                    <div className="tb-pos font-mono">{standing.position.padStart(2, '0')}</div>
                    
                    <div className="tb-driver-col">
                      <div className="tb-team-line" style={{ background: teamColor }} />
                      <div className="tb-names" style={{ marginLeft: '12px' }}>
                        <span className="tb-lastname font-heading editorial-headline">{standing.Constructor.name}</span>
                        <span className="tb-teamname editorial-label">{standing.Constructor.nationality}</span>
                      </div>
                    </div>
                    
                    <div className="tb-pts font-mono">{standing.points}</div>
                    <div className={`tb-trend ${trend.class}`}>{trend.icon}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Standings;
