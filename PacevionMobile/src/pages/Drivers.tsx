import React, { useState } from 'react';
import { useDriverStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './Drivers.css';

export const Drivers: React.FC = () => {
  const { data: driverData, isLoading } = useDriverStandings('2026');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const drivers = driverData || [];
  
  if (!selectedDriverId && drivers.length > 0) {
    setSelectedDriverId(drivers[0].Driver.driverId);
  }

  const selectedDriver = drivers.find(d => d.Driver.driverId === selectedDriverId) || drivers[0];

  return (
    <div className="drivers-page fade-in">
      <header className="brand-header">
        <h1 className="editorial-headline" style={{ fontSize: '24px' }}>DRIVERS</h1>
      </header>

      {isLoading || !selectedDriver ? (
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
      ) : (
        <div className="driver-feature">
          <div className="df-bg" style={{ background: `linear-gradient(180deg, ${getTeamDetails(selectedDriver.Constructors[0]?.constructorId).color}33 0%, rgba(0,0,0,0) 100%)` }} />
          
          <div className="df-top">
            <div className="df-number editorial-num">{selectedDriver.Driver.permanentNumber || '1'}</div>
            <img 
              src={getDriverVisual(selectedDriver.Driver.driverId)!} 
              alt={selectedDriver.Driver.familyName} 
              className="df-portrait"
            />
          </div>
          
          <div className="df-info">
            <h2 className="df-name font-heading editorial-headline">
              <span className="df-fn">{selectedDriver.Driver.givenName}</span>
              <span className="df-ln">{selectedDriver.Driver.familyName}</span>
            </h2>
            <div className="df-team editorial-label">{selectedDriver.Constructors[0]?.name}</div>
          </div>
          
          <div className="df-stats">
            <div className="df-stat">
              <span className="dfs-val editorial-num">{selectedDriver.points}</span>
              <span className="dfs-lbl editorial-label">PTS</span>
            </div>
            <div className="df-stat">
              <span className="dfs-val editorial-num">{selectedDriver.wins}</span>
              <span className="dfs-lbl editorial-label">WINS</span>
            </div>
            <div className="df-stat">
              <span className="dfs-val editorial-num">0</span>
              <span className="dfs-lbl editorial-label">PODIUMS</span>
            </div>
          </div>
        </div>
      )}

      <div className="driver-grid-section">
        <h3 className="dgs-title editorial-label">DRIVER GRID</h3>
        <div className="dgs-scroll">
          {drivers.map(d => {
            const isActive = d.Driver.driverId === selectedDriverId;
            const teamColor = getTeamDetails(d.Constructors[0]?.constructorId).color || '#444';
            return (
              <button 
                key={d.Driver.driverId} 
                className={`dg-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedDriverId(d.Driver.driverId)}
              >
                <div className="dg-btn-accent" style={{ background: isActive ? teamColor : 'transparent' }} />
                <span className="dg-btn-ln font-heading editorial-headline">{d.Driver.familyName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
