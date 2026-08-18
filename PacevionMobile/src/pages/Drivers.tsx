import React from 'react';
import { useDriverStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './Drivers.css';

export const Drivers: React.FC = () => {
  const { data: driverData, isLoading } = useDriverStandings('2026');

  const drivers = driverData || [];
  const topDriver = drivers[0];
  const otherDrivers = drivers.slice(1);

  return (
    <div className="drivers-page fade-in">
      <header className="brand-header">
        <h1 className="brand-title font-heading">DRIVERS</h1>
      </header>

      {isLoading ? (
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
      ) : topDriver ? (
        <div className="driver-hero-card">
          <div className="dh-accent" style={{ background: getTeamDetails(topDriver.Constructors[0]?.constructorId).color || '#E10600' }} />
          
          <div className="dh-content">
            <div className="dh-number font-heading">#{topDriver.Driver.permanentNumber || '1'}</div>
            
            <div className="dh-portrait-wrapper">
              <img 
                src={getDriverVisual(topDriver.Driver.driverId)!} 
                alt={topDriver.Driver.familyName} 
                className="dh-portrait"
              />
            </div>
            
            <div className="dh-info">
              <h2 className="dh-name font-heading">
                <span className="dh-first">{topDriver.Driver.givenName}</span>
                <span className="dh-last">{topDriver.Driver.familyName}</span>
              </h2>
              <div className="dh-team font-mono">{topDriver.Constructors[0]?.name}</div>
            </div>
          </div>
          
          <div className="dh-stats">
            <div className="dh-stat">
              <div className="dh-stat-val font-heading">{topDriver.points}</div>
              <div className="dh-stat-lbl font-mono">POINTS</div>
            </div>
            <div className="dh-stat">
              <div className="dh-stat-val font-heading">{topDriver.wins}</div>
              <div className="dh-stat-lbl font-mono">WINS</div>
            </div>
            <div className="dh-stat">
              <div className="dh-stat-val font-heading">0</div>
              <div className="dh-stat-lbl font-mono">PODIUMS</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="other-drivers-list">
        {otherDrivers.map((standing: any) => {
          const imgUrl = getDriverVisual(standing.Driver.driverId);
          const teamColor = getTeamDetails(standing.Constructors[0]?.constructorId).color || '#333';
          
          return (
            <div key={standing.Driver.driverId} className="od-row">
              <div className="od-pos font-mono">{standing.position}</div>
              
              <div className="od-avatar-container">
                <div className="od-avatar-border" style={{ borderColor: teamColor }} />
                <div className="od-avatar">
                  {imgUrl ? <img src={imgUrl} alt="Avatar" className="od-img" /> : null}
                </div>
              </div>
              
              <div className="od-details">
                <div className="od-name font-heading">
                  <span className="od-fn">{standing.Driver.givenName}</span>
                  <span className="od-ln">{standing.Driver.familyName}</span>
                </div>
                <div className="od-team font-mono">{standing.Constructors[0]?.name}</div>
              </div>
              
              <div className="od-points">
                <span className="od-pts font-heading">{standing.points}</span>
                <span className="od-pts-lbl font-mono">PTS</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Drivers;
