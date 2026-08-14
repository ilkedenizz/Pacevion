import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { useDriverStandings } from '../../../hooks/useF1Data';
import Card from '../../../components/ui/Card';
import Loader from '../../../components/ui/Loader';
import ErrorState from '../../../components/ui/ErrorState';
import './DriverStandingsPreview.css';

const DriverStandingsPreview: React.FC = () => {
  const { data: standings, isLoading, isError, refetch } = useDriverStandings();

  if (isLoading) {
    return (
      <Card title="Driver Standings" className="standings-card-loading">
        <Loader size={24} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="Driver Standings">
        <ErrorState message="Could not load standings." onRetry={refetch} />
      </Card>
    );
  }

  const topFive = standings ? standings.slice(0, 5) : [];

  return (
    <Card
      title="Driver Standings"
      className="driver-standings-preview"
      headerAction={
        <Link to="/standings" className="view-all-link">
          <span>Full Standings</span>
          <ArrowRight size={14} />
        </Link>
      }
    >
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
    </Card>
  );
};

export default DriverStandingsPreview;
