import React from 'react';
import { useDriverStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import './Drivers.css';

const Drivers: React.FC = () => {
  const { data: drivers, isLoading, error } = useDriverStandings();

  return (
    <div className="drivers-page page-content">
      <div className="drivers-header">
        <h1 className="page-title">DRIVERS</h1>
        <p className="page-subtitle">2026 SEASON LINEUP</p>
      </div>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>LOADING DRIVERS...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>ERROR LOADING DRIVERS</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!isLoading && !error && drivers && (
        <div className="drivers-list">
          {drivers.map((driverStanding) => {
            const driver = driverStanding.Driver;
            const constructor = driverStanding.Constructors[0];
            const teamDetails = getTeamDetails(constructor?.constructorId || '');

            return (
              <div 
                key={driver.driverId} 
                className="driver-card"
                style={{ borderLeftColor: teamDetails?.color || 'var(--color-border)' }}
              >
                <div className="driver-number">
                  {driver.permanentNumber || '-'}
                </div>
                
                <div className="driver-details">
                  <span className="driver-given-name">{driver.givenName}</span>
                  <span className="driver-family-name">{driver.familyName}</span>
                  <span className="driver-team" style={{ color: teamDetails?.color }}>
                    {constructor?.name || 'Unknown Team'}
                  </span>
                  <span className="driver-nationality">
                    {driver.nationality}
                  </span>
                </div>
                
                <div className="driver-stats">
                  <div className="driver-points">
                    {driverStanding.points} <span className="pts">PTS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Drivers;
