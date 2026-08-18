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
        <h1 className="editorial-headline" style={{ fontSize: '24px' }}>CHAMPIONSHIP</h1>
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
            {topDriver && (
              <div className="st-leader-feature">
                <div className="slf-accent" style={{ background: getTeamDetails(topDriver.Constructors[0]?.constructorId).color || '#E10600' }} />
                
                <div className="slf-inner">
                  <div className="slf-pos editorial-num">01</div>
                  
                  <div className="slf-portrait-box">
                    <img 
                      src={getDriverVisual(topDriver.Driver.driverId)!} 
                      alt={topDriver.Driver.familyName} 
                      className="slf-portrait" 
                    />
                  </div>
                  
                  <div className="slf-info">
                    <div className="slf-num font-mono">#{topDriver.Driver.permanentNumber || '1'}</div>
                    <div className="slf-name font-heading editorial-headline">
                      {topDriver.Driver.givenName} <br/>
                      {topDriver.Driver.familyName}
                    </div>
                    <div className="slf-team editorial-label">{topDriver.Constructors[0]?.name}</div>
                  </div>
                  
                  <div className="slf-pts">
                    <span className="slf-pts-val editorial-num">{topDriver.points}</span>
                    <span className="slf-pts-lbl editorial-label">PTS</span>
                  </div>
                </div>
              </div>
            )}

            <div className="st-board">
              <div className="st-board-header editorial-label">
                <span className="sbh-pos">POS</span>
                <span className="sbh-driver">DRIVER</span>
                <span className="sbh-pts">PTS</span>
              </div>
              
              {otherDrivers.map((standing: any) => {
                const imgUrl = getDriverVisual(standing.Driver.driverId);
                const teamColor = getTeamDetails(standing.Constructors[0]?.constructorId).color || '#333';
                return (
                  <div key={standing.Driver.driverId} className="st-row">
                    <div className="st-row-pos font-mono">{standing.position.padStart(2, '0')}</div>
                    
                    <div className="st-row-driver">
                      <div className="st-row-teamline" style={{ background: teamColor }} />
                      <div className="st-row-avatar">
                        {imgUrl && <img src={imgUrl} className="st-row-img" alt={standing.Driver.familyName} />}
                      </div>
                      <div className="st-row-names">
                        <span className="st-row-ln font-heading editorial-headline" style={{ fontSize: '14px' }}>{standing.Driver.familyName}</span>
                        <span className="st-row-team editorial-label" style={{ fontSize: '8px' }}>{standing.Constructors[0]?.name}</span>
                      </div>
                    </div>
                    
                    <div className="st-row-pts font-mono">{standing.points}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        cLoading ? <div className="skeleton" style={{ height: 400, borderRadius: 16 }} /> : (
          <div className="st-content">
            {topConstructor && (
              <div className="st-leader-feature">
                <div className="slf-accent" style={{ background: getTeamDetails(topConstructor.Constructor.constructorId).color || '#E10600' }} />
                <div className="slf-inner">
                  <div className="slf-pos editorial-num">01</div>
                  
                  <div className="slf-info" style={{ marginLeft: '16px' }}>
                    <div className="slf-name font-heading editorial-headline">
                      {topConstructor.Constructor.name}
                    </div>
                    <div className="slf-team editorial-label">{topConstructor.Constructor.nationality}</div>
                  </div>
                  
                  <div className="slf-pts">
                    <span className="slf-pts-val editorial-num">{topConstructor.points}</span>
                    <span className="slf-pts-lbl editorial-label">PTS</span>
                  </div>
                </div>
              </div>
            )}

            <div className="st-board">
              <div className="st-board-header editorial-label">
                <span className="sbh-pos">POS</span>
                <span className="sbh-driver">TEAM</span>
                <span className="sbh-pts">PTS</span>
              </div>
              
              {otherConstructors.map((standing: any) => {
                const teamColor = getTeamDetails(standing.Constructor.constructorId).color || '#333';
                return (
                  <div key={standing.Constructor.constructorId} className="st-row">
                    <div className="st-row-pos font-mono">{standing.position.padStart(2, '0')}</div>
                    
                    <div className="st-row-driver">
                      <div className="st-row-teamline" style={{ background: teamColor }} />
                      <div className="st-row-names" style={{ marginLeft: 0 }}>
                        <span className="st-row-ln font-heading editorial-headline" style={{ fontSize: '14px' }}>{standing.Constructor.name}</span>
                        <span className="st-row-team editorial-label" style={{ fontSize: '8px' }}>{standing.Constructor.nationality}</span>
                      </div>
                    </div>
                    
                    <div className="st-row-pts font-mono">{standing.points}</div>
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
