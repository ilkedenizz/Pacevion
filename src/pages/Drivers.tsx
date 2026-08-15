import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import ErrorState from '../components/ui/ErrorState';
import './Drivers.css';

const Drivers: React.FC = () => {
  const navigate = useNavigate();
  const { data: standings, isLoading, isError, refetch } = useDriverStandings();

  useSEO({
    title: 'F1 Drivers Directory | Pacevion',
    description: 'Formula 1 2026 sezonu resmi sürücü kadrosu, pilot numaraları ve pilot bilgileri.',
    canonicalPath: '/drivers'
  });

  if (isLoading) {
    return (
      <div className="driver-grid-container loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton" style={{ height: '250px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !standings || standings.length === 0) {
    return (
      <div className="driver-grid-container error">
        <ErrorState message="Unable to load drivers list." onRetry={refetch} />
      </div>
    );
  }

  const driverStandings = standings;

  return (
    <div className="driver-grid-container">
      <div className="driver-grid-header">
        <div className="dgh-titles">
          <h1 className="dgh-main">DRIVER GRID</h1>
          <span className="dgh-sub">SEASON 2026</span>
        </div>
      </div>

      <div className="driver-cards-grid">
        {driverStandings.map((standing: any) => {
          const driver = standing.Driver;
          const constructor = standing.Constructors[0];
          
          return (
            <div 
              key={driver.driverId} 
              className="driver-grid-card"
              onClick={() => navigate(`/drivers/${driver.driverId}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/drivers/${driver.driverId}`);
                }
              }}
            >
              <div className="dgc-top">
                <span className="dgc-pos font-mono">P{standing.position}</span>
                <span className="dgc-pts font-heading">{standing.points} PTS</span>
              </div>
              
              <div className="dgc-middle">
                <div className="dgc-name-block">
                  <span className="dgc-firstname">{driver.givenName}</span>
                  <span className="dgc-lastname">{driver.familyName}</span>
                </div>
                <div className="dgc-number font-heading">{driver.permanentNumber || '--'}</div>
              </div>

              <div className="dgc-bottom">
                <span className="dgc-team text-secondary">{constructor?.name || 'Unknown'}</span>
                <span className="dgc-wins font-mono text-secondary">{standing.wins} WINS</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Drivers;
