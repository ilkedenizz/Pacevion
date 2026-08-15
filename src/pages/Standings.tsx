import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverStandings, useConstructorStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import ErrorState from '../components/ui/ErrorState';
import { getDriverVisual } from '../data/assets';
import './Standings.css';

const Standings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers');

  useSEO({
    title: 'F1 Driver & Constructor Standings | Pacevion',
    description: 'Formula 1 2026 sezonu puan durumu ve şampiyona sıralaması.',
    canonicalPath: '/standings'
  });

  const { data: driverStandings, isLoading: driversLoading, isError: driversError, refetch: refetchDrivers } = useDriverStandings();
  const { data: constructorStandings, isLoading: constructorsLoading, isError: constructorsError, refetch: refetchConstructors } = useConstructorStandings();

  const isLoading = driversLoading || constructorsLoading;
  const isError = driversError || constructorsError;

  const handleRetry = () => {
    refetchDrivers();
    refetchConstructors();
  };

  const constructorDriversMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (driverStandings) {
      driverStandings.forEach((ds) => {
        const cId = ds.Constructors[0]?.constructorId;
        if (cId) {
          if (!map[cId]) map[cId] = [];
          map[cId].push(ds.Driver.familyName);
        }
      });
    }
    return map;
  }, [driverStandings]);

  if (isLoading) {
    return (
      <div className="standings-board-container loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="standings-board-container error">
        <ErrorState message="Unable to load championship standings." onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="standings-board-container">
      <div className="standings-board-header">
        <div className="sbh-titles">
          <h1 className="sbh-main">{activeTab === 'drivers' ? 'DRIVER CHAMPIONSHIP' : 'CONSTRUCTOR CHAMPIONSHIP'}</h1>
          <span className="sbh-sub">2026 SEASON</span>
        </div>
        <div className="sbh-tabs">
          <button 
            className={`sbh-tab-btn ${activeTab === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('drivers')}
          >
            DRIVERS
          </button>
          <button 
            className={`sbh-tab-btn ${activeTab === 'constructors' ? 'active' : ''}`}
            onClick={() => setActiveTab('constructors')}
          >
            TEAMS
          </button>
        </div>
      </div>

      <div className="standings-board-content">
        {activeTab === 'drivers' ? (
          <div className="timing-board-wrapper">
            <div className="tb-header-row">
              <div className="tb-col-pos">POS</div>
              <div className="tb-col-driver">DRIVER</div>
              <div className="tb-col-wins">WINS</div>
              <div className="tb-col-pts">PTS</div>
            </div>
            
            <div className="tb-body">
              {driverStandings?.map((row, index) => {
                const isLeader = row.position === '1';
                const isTop3 = ['1', '2', '3'].includes(row.position);
                const driverName = `${row.Driver.givenName} ${row.Driver.familyName}`;
                const teamName = row.Constructors[0]?.name || 'N/A';
                
                const leaderPoints = parseInt(driverStandings[0].points, 10);
                const currentPoints = parseInt(row.points, 10);
                const barWidth = leaderPoints > 0 ? (currentPoints / leaderPoints) * 100 : 0;
                
                return (
                  <div 
                    key={row.Driver.driverId}
                    className={`tb-row ${isLeader ? 'leader-row' : ''} ${isTop3 ? 'top-3-row' : ''}`}
                    onClick={() => navigate(`/drivers/${row.Driver.driverId}`)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="tb-row-bg-bar" style={{ width: `${barWidth}%` }} />
                    <div className="tb-col-pos">
                      <span className="tb-pos-badge">{row.position}</span>
                    </div>
                    <div className="tb-col-driver">
                      <img 
                        src={getDriverVisual(row.Driver.driverId, row.Constructors[0]?.constructorId)} 
                        alt={driverName}
                        className="tb-driver-thumb" 
                        loading="lazy"
                      />
                      <div className="tb-driver-info">
                        <span className="tb-driver-name">{driverName}</span>
                        <span className="tb-team-name">{teamName}</span>
                      </div>
                    </div>
                    <div className="tb-col-wins">
                      <span className="tb-stat">{row.wins}</span>
                    </div>
                    <div className="tb-col-pts">
                      <span className="tb-pts-val">{row.points}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="timing-board-wrapper">
            <div className="tb-header-row">
              <div className="tb-col-pos">POS</div>
              <div className="tb-col-team-primary">CONSTRUCTOR</div>
              <div className="tb-col-lineup">DRIVERS</div>
              <div className="tb-col-wins">WINS</div>
              <div className="tb-col-pts">PTS</div>
            </div>
            
            <div className="tb-body">
              {constructorStandings?.map((row, index) => {
                const isLeader = row.position === '1';
                const isTop3 = ['1', '2', '3'].includes(row.position);
                const teamName = row.Constructor.name;
                const lineup = constructorDriversMap[row.Constructor.constructorId]
                  ? constructorDriversMap[row.Constructor.constructorId].join(' / ')
                  : '—';
                  
                const leaderPoints = parseInt(constructorStandings[0].points, 10);
                const currentPoints = parseInt(row.points, 10);
                const barWidth = leaderPoints > 0 ? (currentPoints / leaderPoints) * 100 : 0;
                  
                return (
                  <div 
                    key={row.Constructor.constructorId}
                    className={`tb-row ${isLeader ? 'leader-row' : ''} ${isTop3 ? 'top-3-row' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="tb-row-bg-bar" style={{ width: `${barWidth}%` }} />
                    <div className="tb-col-pos">
                      <span className="tb-pos-badge">{row.position}</span>
                    </div>
                    <div className="tb-col-team-primary">
                      <span className="tb-driver-name">{teamName}</span>
                    </div>
                    <div className="tb-col-lineup">
                      <span className="tb-team-name">{lineup}</span>
                    </div>
                    <div className="tb-col-wins">
                      <span className="tb-stat">{row.wins}</span>
                    </div>
                    <div className="tb-col-pts">
                      <span className="tb-pts-val">{row.points}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Standings;
