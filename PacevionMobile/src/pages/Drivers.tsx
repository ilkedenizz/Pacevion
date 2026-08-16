import React, { useMemo } from 'react';
import { RefreshCw, User } from 'lucide-react';
import { useDriverStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import './Drivers.css';

export const Drivers: React.FC = () => {
  const { data: drivers, isLoading, error, refetch } = useDriverStandings();

  // Dynamic driver and team counts
  const { totalDrivers, totalTeams } = useMemo(() => {
    if (!drivers || drivers.length === 0) {
      return { totalDrivers: 0, totalTeams: 0 };
    }
    const teamSet = new Set(drivers.map((d) => d.Constructors[0]?.constructorId).filter(Boolean));
    return {
      totalDrivers: drivers.length,
      totalTeams: teamSet.size,
    };
  }, [drivers]);

  return (
    <div className="drivers-dashboard">
      {/* Header */}
      <header className="drivers-header">
        <h1 className="brand-badge font-mono">DRIVERS</h1>
        <p className="championship-sub font-mono">2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</p>
        <div className="drivers-stats-pill font-mono">
          {isLoading ? (
            'LOADING DRIVERS...'
          ) : (
            `${totalDrivers} DRIVERS · ${totalTeams} TEAMS`
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="drivers-body">
        {isLoading ? (
          <div className="skeleton-container">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton driver-card-skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="error-card font-mono">
            <p>DRIVER DATA UNAVAILABLE</p>
            <button className="retry-btn font-mono" onClick={() => refetch()}>
              <RefreshCw size={12} /> RETRY
            </button>
          </div>
        ) : drivers && drivers.length > 0 ? (
          <div className="drivers-list">
            {drivers.map((standing) => {
              const driver = standing.Driver;
              const constructor = standing.Constructors[0];
              const team = getTeamDetails(constructor?.constructorId || '');
              const initials = `${driver.givenName.charAt(0)}${driver.familyName.charAt(0)}`.toUpperCase();

              return (
                <div
                  key={driver.driverId}
                  className="driver-card"
                  style={{ borderLeftColor: team.color || 'var(--color-border)' }}
                >
                  {/* Left Avatar / Number Badge */}
                  <div className="driver-avatar-box" style={{ borderColor: team.color || 'rgba(255,255,255,0.1)' }}>
                    {driver.permanentNumber ? (
                      <span className="driver-num-val font-heading">#{driver.permanentNumber}</span>
                    ) : (
                      <span className="driver-initials-val font-mono">{initials}</span>
                    )}
                    <User size={12} className="avatar-icon" />
                  </div>

                  {/* Center Details */}
                  <div className="driver-details">
                    <span className="driver-given-name">{driver.givenName}</span>
                    <h3 className="driver-family-name font-heading">{driver.familyName}</h3>
                    <span className="driver-team-name font-mono" style={{ color: team.color }}>
                      {constructor?.name || 'F1 Team'}
                    </span>
                    <span className="driver-nat font-mono">{driver.nationality}</span>
                  </div>

                  {/* Right Stats & Rank */}
                  <div className="driver-stats-box">
                    <span className="driver-rank font-mono">P{standing.position}</span>
                    <div className="driver-pts-row font-heading">
                      {standing.points} <span className="pts-unit font-mono">PTS</span>
                    </div>
                    {parseInt(standing.wins) > 0 && (
                      <span className="driver-wins font-mono">{standing.wins} WINS</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-card font-mono">No drivers available</div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
