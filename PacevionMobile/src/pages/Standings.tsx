import React, { useState } from 'react';
import { useDriverStandings, useConstructorStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './Standings.css';

export const Standings: React.FC = () => {
  const [tab, setTab] = useState<'drivers' | 'constructors'>('drivers');
  
  const { data: driverData, isLoading: dLoading } = useDriverStandings('2026');
  const { data: constructorData, isLoading: cLoading } = useConstructorStandings('2026');

  const drivers = driverData || [];
  const topDriver = drivers[0];
  const otherDrivers = drivers.slice(1);

  const constructors = constructorData || [];
  const topConstructor = constructors[0];
  const otherConstructors = constructors.slice(1);

  return (
    <div className="standings-page fade-in">
      <header className="brand-header">
        <h1 className="brand-title font-heading">CHAMPIONSHIP</h1>
      </header>

      <div className="st-tabs font-heading">
        <button 
          className={`st-tab ${tab === 'drivers' ? 'active' : ''}`}
          onClick={() => setTab('drivers')}
        >
          DRIVERS
        </button>
        <button 
          className={`st-tab ${tab === 'constructors' ? 'active' : ''}`}
          onClick={() => setTab('constructors')}
        >
          CONSTRUCTORS
        </button>
      </div>

      {tab === 'drivers' ? (
        dLoading ? <div className="skeleton" style={{ height: 400, borderRadius: 16 }} /> : (
          <div className="st-content">
            {/* LEADER */}
            {topDriver && (
              <div className="st-leader-card">
                <div className="st-leader-accent" style={{ background: getTeamDetails(topDriver.Constructors[0]?.constructorId).color || '#E10600' }} />
                <div className="st-leader-content">
                  <div className="st-leader-pos font-heading">01</div>
                  
                  <div className="st-leader-portrait-wrap">
                    <img 
                      src={getDriverVisual(topDriver.Driver.driverId)!} 
                      alt={topDriver.Driver.familyName} 
                      className="st-leader-portrait" 
                    />
                  </div>

                  <div className="st-leader-info">
                    <div className="st-leader-num font-heading">#{topDriver.Driver.permanentNumber || '1'}</div>
                    <div className="st-leader-name font-heading">
                      {topDriver.Driver.givenName} <br />
                      <strong>{topDriver.Driver.familyName}</strong>
                    </div>
                    <div className="st-leader-team font-mono">{topDriver.Constructors[0]?.name}</div>
                  </div>
                  
                  <div className="st-leader-pts">
                    <span className="sl-val font-heading">{topDriver.points}</span>
                    <span className="sl-lbl font-mono">PTS</span>
                  </div>
                </div>
              </div>
            )}

            {/* OTHERS TIMING BOARD */}
            <div className="st-timing-board">
              <div className="st-tb-header font-mono">
                <span className="tbh-pos">POS</span>
                <span className="tbh-driver">DRIVER</span>
                <span className="tbh-pts">PTS</span>
              </div>
              
              {otherDrivers.map((standing: any) => {
                const imgUrl = getDriverVisual(standing.Driver.driverId);
                const teamColor = getTeamDetails(standing.Constructors[0]?.constructorId).color || '#333';
                return (
                  <div key={standing.Driver.driverId} className="st-tb-row">
                    <div className="st-pos font-mono">{standing.position.padStart(2, '0')}</div>
                    
                    <div className="st-driver-col">
                      <div className="st-team-line" style={{ background: teamColor }} />
                      <div className="st-avatar">
                        {imgUrl ? <img src={imgUrl} className="st-avatar-img" alt={standing.Driver.familyName} /> : null}
                      </div>
                      <div className="st-driver-names">
                        <span className="st-fn font-heading">{standing.Driver.givenName}</span>
                        <span className="st-ln font-heading">{standing.Driver.familyName}</span>
                        <span className="st-team font-mono">{standing.Constructors[0]?.name}</span>
                      </div>
                    </div>
                    
                    <div className="st-pts font-heading">{standing.points}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        cLoading ? <div className="skeleton" style={{ height: 400, borderRadius: 16 }} /> : (
          <div className="st-content">
            {/* CONSTRUCTOR LEADER */}
            {topConstructor && (
              <div className="st-leader-card">
                <div className="st-leader-accent" style={{ background: getTeamDetails(topConstructor.Constructor.constructorId).color || '#E10600' }} />
                <div className="st-leader-content">
                  <div className="st-leader-pos font-heading">01</div>
                  
                  <div className="st-leader-info constr-leader-info">
                    <div className="st-leader-name font-heading">
                      <strong>{topConstructor.Constructor.name}</strong>
                    </div>
                    <div className="st-leader-team font-mono">{topConstructor.Constructor.nationality}</div>
                  </div>
                  
                  <div className="st-leader-pts">
                    <span className="sl-val font-heading">{topConstructor.points}</span>
                    <span className="sl-lbl font-mono">PTS</span>
                  </div>
                </div>
              </div>
            )}

            {/* OTHERS CONSTRUCTORS BOARD */}
            <div className="st-timing-board">
              <div className="st-tb-header font-mono">
                <span className="tbh-pos">POS</span>
                <span className="tbh-driver">TEAM</span>
                <span className="tbh-pts">PTS</span>
              </div>
              
              {otherConstructors.map((standing: any) => {
                const teamColor = getTeamDetails(standing.Constructor.constructorId).color || '#333';
                return (
                  <div key={standing.Constructor.constructorId} className="st-tb-row">
                    <div className="st-pos font-mono">{standing.position.padStart(2, '0')}</div>
                    
                    <div className="st-driver-col">
                      <div className="st-team-line" style={{ background: teamColor }} />
                      <div className="st-driver-names constr-names">
                        <span className="st-ln font-heading">{standing.Constructor.name}</span>
                        <span className="st-team font-mono">{standing.Constructor.nationality}</span>
                      </div>
                    </div>
                    
                    <div className="st-pts font-heading">{standing.points}</div>
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
