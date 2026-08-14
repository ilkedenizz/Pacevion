import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Shield, User, RefreshCw } from 'lucide-react';
import { useDriverStandings, useConstructorStandings, useCalendar } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import ErrorState from '../components/ui/ErrorState';
import './Standings.css';

const Standings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers');

  useSEO({
    title: 'F1 Driver & Constructor Standings | Pacevion',
    description: 'Formula 1 2026 sezonu pilotlar şampiyonası ve markalar şampiyonası güncel puan durumu tablolarını ve liderlik mücadelesini inceleyin.',
    canonicalPath: '/standings'
  });

  // Fetch queries
  const {
    data: driverStandings,
    isLoading: driversLoading,
    isError: driversError,
    refetch: refetchDrivers
  } = useDriverStandings();

  const {
    data: constructorStandings,
    isLoading: constructorsLoading,
    isError: constructorsError,
    refetch: refetchConstructors
  } = useConstructorStandings();

  const {
    data: calendar,
    isLoading: calendarLoading,
    isError: calendarError,
    refetch: refetchCalendar
  } = useCalendar();

  const now = useMemo(() => new Date(), []);

  // Compute calculated metrics
  const calculatedMetrics = useMemo(() => {
    const driverLeader = driverStandings && driverStandings.length > 0
      ? `${driverStandings[0].Driver.givenName} ${driverStandings[0].Driver.familyName}`
      : '—';
      
    const driverLeaderPoints = driverStandings && driverStandings.length > 0
      ? driverStandings[0].points
      : '0';

    const constructorLeader = constructorStandings && constructorStandings.length > 0
      ? constructorStandings[0].Constructor.name
      : '—';

    const completedRounds = calendar
      ? calendar.filter((race) => {
          const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
          const raceDate = new Date(`${race.date}T${raceTimeStr}`);
          return raceDate <= now;
        }).length
      : 0;

    return {
      driverLeader,
      driverLeaderPoints,
      constructorLeader,
      completedRounds
    };
  }, [driverStandings, constructorStandings, calendar, now]);

  // Extract constructor driver lineups from driver standings
  const constructorDriversMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (driverStandings) {
      driverStandings.forEach((ds) => {
        const cId = ds.Constructors[0]?.constructorId;
        if (cId) {
          if (!map[cId]) map[cId] = [];
          // Keep only driver family names for conciseness
          map[cId].push(ds.Driver.familyName);
        }
      });
    }
    return map;
  }, [driverStandings]);

  const isLoading = driversLoading || constructorsLoading || calendarLoading;
  const isError = driversError || constructorsError || calendarError;

  const handleRetry = () => {
    refetchDrivers();
    refetchConstructors();
    refetchCalendar();
  };

  // Keyboard navigation for Tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, tab: 'drivers' | 'constructors') => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveTab(activeTab === 'drivers' ? 'constructors' : 'drivers');
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tab);
    }
  };

  if (isLoading) {
    return (
      <div className="standings-page-container">
        <div className="standings-page-header">
          <div className="skeleton" style={{ width: '80px', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '320px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '220px', height: '14px' }} />
        </div>

        <div className="standings-stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width: '60px', height: '10px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '80px', height: '24px' }} />
            </div>
          ))}
        </div>

        <div className="tab-loading-block">
          <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '24px' }} />
          <div className="skeleton-table">
            <div className="skeleton" style={{ width: '100%', height: '36px', marginBottom: '12px' }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ width: '100%', height: '48px', marginBottom: '8px' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="standings-page-container">
        <div className="standings-error-wrapper">
          <ErrorState message="Unable to load championship standings." onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  const maxDriverPoints = driverStandings && driverStandings.length > 0
    ? parseInt(driverStandings[0].points, 10)
    : 1;

  const maxConstructorPoints = constructorStandings && constructorStandings.length > 0
    ? parseInt(constructorStandings[0].points, 10)
    : 1;

  return (
    <div className="standings-page-container">
      <div className="standings-page-header">
        <span className="standings-category">F1 2026</span>
        <h1 className="standings-title">Championship Standings</h1>
        <p className="standings-subtitle">Track the fight for the 2026 championship.</p>
      </div>

      <div className="standings-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Driver Leader</span>
          <span className="stat-value">{calculatedMetrics.driverLeader}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Driver Leader Pts</span>
          <span className="stat-value text-accent">{calculatedMetrics.driverLeaderPoints}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Constructor Leader</span>
          <span className="stat-value">{calculatedMetrics.constructorLeader}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rounds Completed</span>
          <span className="stat-value">{calculatedMetrics.completedRounds}</span>
        </div>
      </div>

      <div className="tab-navigation-bar" role="tablist" aria-label="Championship Standings Selection">
        <button
          id="tab-drivers"
          className={`tab-toggle-btn ${activeTab === 'drivers' ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'drivers'}
          aria-controls="panel-drivers"
          tabIndex={activeTab === 'drivers' ? 0 : -1}
          onClick={() => setActiveTab('drivers')}
          onKeyDown={(e) => handleTabKeyDown(e, 'drivers')}
          type="button"
        >
          <User size={14} className="tab-icon" />
          <span>DRIVERS</span>
        </button>
        <button
          id="tab-constructors"
          className={`tab-toggle-btn ${activeTab === 'constructors' ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'constructors'}
          aria-controls="panel-constructors"
          tabIndex={activeTab === 'constructors' ? 0 : -1}
          onClick={() => setActiveTab('constructors')}
          onKeyDown={(e) => handleTabKeyDown(e, 'constructors')}
          type="button"
        >
          <Shield size={14} className="tab-icon" />
          <span>CONSTRUCTORS</span>
        </button>
      </div>

      <div
        id="panel-drivers"
        role="tabpanel"
        aria-labelledby="tab-drivers"
        hidden={activeTab !== 'drivers'}
      >
        {!driverStandings || driverStandings.length === 0 ? (
          <div className="standings-empty-state">
            <RefreshCw className="empty-icon" size={24} />
            <p>No championship standings data available.</p>
          </div>
        ) : (
          <div className="standings-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th scope="col" className="col-rank">POS</th>
                  <th scope="col" className="col-name">DRIVER</th>
                  <th scope="col" className="col-team">TEAM</th>
                  <th scope="col" className="col-wins text-right">WINS</th>
                  <th scope="col" className="col-pts text-right">PTS</th>
                  <th scope="col" className="col-progress">PROGRESS</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((row) => {
                  const isLeader = row.position === '1';
                  const driverName = `${row.Driver.givenName} ${row.Driver.familyName}`;
                  const teamName = row.Constructors[0]?.name || 'N/A';
                  const ptsPct = (parseInt(row.points, 10) / maxDriverPoints) * 100;

                  return (
                    <tr
                      key={row.Driver.driverId}
                      className={`table-row-item ${isLeader ? 'rank-leader' : ''}`}
                      onClick={() => navigate(`/drivers/${row.Driver.driverId}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/drivers/${row.Driver.driverId}`);
                        }
                      }}
                      aria-label={`View profile of driver ${driverName}, positioned ${row.position}`}
                    >
                      <td className="col-rank font-heading">
                        {isLeader ? (
                          <span className="trophy-badge"><Trophy size={12} className="gold-trophy" /></span>
                        ) : (
                          row.position
                        )}
                      </td>
                      <td className="col-name font-bold">
                        {driverName}
                      </td>
                      <td className="col-team text-secondary">
                        {teamName}
                      </td>
                      <td className="col-wins text-right font-heading text-secondary">
                        {row.wins !== '0' ? row.wins : '—'}
                      </td>
                      <td className="col-pts text-right font-heading font-bold">
                        {row.points}
                      </td>
                      <td className="col-progress">
                        <div className="progress-bar-track">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${ptsPct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        id="panel-constructors"
        role="tabpanel"
        aria-labelledby="tab-constructors"
        hidden={activeTab !== 'constructors'}
      >
        {!constructorStandings || constructorStandings.length === 0 ? (
          <div className="standings-empty-state">
            <RefreshCw className="empty-icon" size={24} />
            <p>No championship standings data available.</p>
          </div>
        ) : (
          <div className="standings-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th scope="col" className="col-rank">POS</th>
                  <th scope="col" className="col-name">CONSTRUCTOR</th>
                  <th scope="col" className="col-lineup">DRIVERS</th>
                  <th scope="col" className="col-wins text-right">WINS</th>
                  <th scope="col" className="col-pts text-right">PTS</th>
                  <th scope="col" className="col-progress">PROGRESS</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((row) => {
                  const isLeader = row.position === '1';
                  const teamName = row.Constructor.name;
                  const lineup = constructorDriversMap[row.Constructor.constructorId]
                    ? constructorDriversMap[row.Constructor.constructorId].join(' / ')
                    : '—';
                  const ptsPct = (parseInt(row.points, 10) / maxConstructorPoints) * 100;

                  return (
                    <tr
                      key={row.Constructor.constructorId}
                      className={`table-row-item non-clickable ${isLeader ? 'rank-leader' : ''}`}
                    >
                      <td className="col-rank font-heading">
                        {isLeader ? (
                          <span className="trophy-badge"><Trophy size={12} className="gold-trophy" /></span>
                        ) : (
                          row.position
                        )}
                      </td>
                      <td className="col-name font-bold">
                        {teamName}
                      </td>
                      <td className="col-lineup text-secondary font-mono">
                        {lineup}
                      </td>
                      <td className="col-wins text-right font-heading text-secondary">
                        {row.wins !== '0' ? row.wins : '—'}
                      </td>
                      <td className="col-pts text-right font-heading font-bold">
                        {row.points}
                      </td>
                      <td className="col-progress">
                        <div className="progress-bar-track">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${ptsPct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Standings;
