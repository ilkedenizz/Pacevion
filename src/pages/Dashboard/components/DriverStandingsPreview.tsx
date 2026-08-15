import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { useDriverStandings } from '../../../hooks/useF1Data';

import ErrorState from '../../../components/ui/ErrorState';
import './DriverStandingsPreview.css';

const DriverStandingsPreview: React.FC = () => {
  const { data: standings, isLoading, isError, refetch } = useDriverStandings();

  if (isLoading) {
    return (
      <div className="timing-board-container">
        <div className="timing-board-header">
          <h3 className="timing-board-title">DRIVER STANDINGS</h3>
        </div>
        <div className="standings-table">
          <div className="table-header">
            <span className="col-pos">Pos</span>
            <span className="col-driver">Driver</span>
            <span className="col-team">Team</span>
            <span className="col-pts text-right">Pts</span>
          </div>
          <div className="table-body">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="table-row" style={{ padding: 'var(--space-3) var(--space-3)' }}>
                <span className="col-pos"><div className="skeleton" style={{ width: '16px', height: '16px' }} /></span>
                <span className="col-driver"><div className="skeleton" style={{ width: '120px', height: '16px' }} /></span>
                <span className="col-team"><div className="skeleton" style={{ width: '80px', height: '16px' }} /></span>
                <span className="col-pts text-right"><div className="skeleton" style={{ width: '32px', height: '16px', marginLeft: 'auto' }} /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="timing-board-container">
        <div className="timing-board-header">
          <h3 className="timing-board-title">DRIVER STANDINGS</h3>
        </div>
        <ErrorState message="Could not load standings." onRetry={refetch} />
      </div>
    );
  }

  const topFive = standings ? standings.slice(0, 5) : [];

  return (
    <div className="timing-board-container">
      <div className="timing-board-header">
        <h3 className="timing-board-title">DRIVER STANDINGS</h3>
        <Link to="/standings" className="view-all-link">
          <span>FULL STANDINGS</span>
          <ArrowRight size={14} />
        </Link>
      </div>
      
      {topFive.length === 0 ? (
        <div className="empty-standings">No standings data available.</div>
      ) : (
        <div className="standings-table">
          <div className="table-header">
            <span className="col-pos">Pos</span>
            <span className="col-driver">Driver</span>
            <span className="col-team">Team</span>
            <span className="col-pts text-right">Pts</span>
          </div>
          <div className="table-body">
            {topFive.map((row) => {
              const constructorName = row.Constructors[0]?.name || 'N/A';
              const driverName = `${row.Driver.givenName} ${row.Driver.familyName}`;
              const driverCode = row.Driver.code || row.Driver.familyName.slice(0, 3).toUpperCase();
              
              return (
                <div key={row.Driver.driverId} className="table-row">
                  <span className="col-pos font-heading">
                    {row.position === '1' ? (
                      <Trophy size={14} className="gold-trophy" />
                    ) : (
                      row.position
                    )}
                  </span>
                  <span className="col-driver">
                    <span className="driver-full-name">{driverName}</span>
                    <span className="driver-short-name">{driverCode}</span>
                  </span>
                  <span className="col-team text-secondary">{constructorName}</span>
                  <span className="col-pts font-heading text-right font-bold">{row.points}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Link to="/standings" className="view-full-standings-link">
        <span>VIEW FULL STANDINGS</span>
        <ArrowRight size={12} />
      </Link>
    </div>
  );
};

export default DriverStandingsPreview;
