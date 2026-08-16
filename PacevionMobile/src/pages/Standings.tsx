import React, { useState } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { useDriverStandings, useConstructorStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import './Standings.css';

export const Standings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');

  const {
    data: driverStandings,
    isLoading: isLoadingDrivers,
    error: driversError,
    refetch: refetchDrivers,
  } = useDriverStandings();

  const {
    data: constructorStandings,
    isLoading: isLoadingConstructors,
    error: constructorsError,
    refetch: refetchConstructors,
  } = useConstructorStandings();

  // P1 Leader Driver & Rest
  const leaderDriver = driverStandings?.[0];
  const restDrivers = driverStandings?.slice(1);

  // P1 Leader Constructor & Rest
  const leaderConstructor = constructorStandings?.[0];
  const restConstructors = constructorStandings?.slice(1);

  return (
    <div className="standings-dashboard">
      {/* Header */}
      <header className="standings-header">
        <h1 className="brand-badge font-mono">CHAMPIONSHIP</h1>
        <p className="championship-sub font-mono">2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</p>
      </header>

      {/* Segmented Tab Bar */}
      <div className="tab-container">
        <button
          className={`tab-item font-mono ${activeTab === 'DRIVERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('DRIVERS')}
        >
          DRIVERS
        </button>
        <button
          className={`tab-item font-mono ${activeTab === 'CONSTRUCTORS' ? 'active' : ''}`}
          onClick={() => setActiveTab('CONSTRUCTORS')}
        >
          CONSTRUCTORS
        </button>
      </div>

      {/* Tab Content */}
      <div className="standings-body">
        {/* DRIVERS TAB */}
        {activeTab === 'DRIVERS' && (
          <div className="tab-pane fade-in">
            {isLoadingDrivers ? (
              <div className="skeleton-container">
                <div className="skeleton leader-skeleton" />
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton row-skeleton" />
                ))}
              </div>
            ) : driversError ? (
              <div className="error-card font-mono">
                <p>FAILED TO LOAD DRIVER STANDINGS</p>
                <button className="retry-btn font-mono" onClick={() => refetchDrivers()}>
                  <RefreshCw size={12} /> RETRY
                </button>
              </div>
            ) : driverStandings && driverStandings.length > 0 ? (
              <>
                {/* P1 DRIVER LEADER SPOTLIGHT */}
                {leaderDriver && (
                  <div
                    className="leader-spotlight-card"
                    style={{
                      borderLeftColor:
                        getTeamDetails(leaderDriver.Constructors[0]?.constructorId || '').color ||
                        'var(--color-accent)',
                    }}
                  >
                    <div className="spotlight-top font-mono">
                      <div className="p1-badge">
                        <Trophy size={11} className="trophy-icon" /> LEADER P1
                      </div>
                      {leaderDriver.Driver.permanentNumber && (
                        <span className="driver-num">#{leaderDriver.Driver.permanentNumber}</span>
                      )}
                    </div>

                    <div className="spotlight-main">
                      <div className="driver-names">
                        <span className="given-name">{leaderDriver.Driver.givenName}</span>
                        <span className="family-name font-heading">
                          {leaderDriver.Driver.familyName}
                        </span>
                        <span
                          className="team-name font-mono"
                          style={{
                            color:
                              getTeamDetails(leaderDriver.Constructors[0]?.constructorId || '')
                                .color || '#ffffff',
                          }}
                        >
                          {leaderDriver.Constructors[0]?.name || 'F1 Team'}
                        </span>
                      </div>

                      <div className="points-box">
                        <span className="pts-val font-heading">{leaderDriver.points}</span>
                        <span className="pts-lbl font-mono">PTS</span>
                        {parseInt(leaderDriver.wins) > 0 && (
                          <span className="wins-count font-mono">{leaderDriver.wins} WINS</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* DRIVER RANKING LIST (P2+) */}
                <div className="standings-list">
                  {restDrivers?.map((standing) => {
                    const constructor = standing.Constructors[0];
                    const team = getTeamDetails(constructor?.constructorId || '');

                    return (
                      <div
                        key={standing.Driver.driverId}
                        className="driver-row"
                        style={{ borderLeftColor: team.color || 'var(--color-border)' }}
                      >
                        <div className="row-left">
                          <span className="row-pos font-mono">{standing.position}</span>
                          {standing.Driver.permanentNumber && (
                            <span className="row-num font-mono">
                              #{standing.Driver.permanentNumber}
                            </span>
                          )}
                          <div className="row-driver-details">
                            <span className="row-driver-name">
                              {standing.Driver.givenName.charAt(0)}. <strong>{standing.Driver.familyName}</strong>
                            </span>
                            <span className="row-team-name font-mono" style={{ color: team.color }}>
                              {constructor?.name || 'F1 Team'}
                            </span>
                          </div>
                        </div>

                        <div className="row-right">
                          <span className="row-pts font-heading">{standing.points}</span>
                          <span className="row-pts-lbl font-mono">PTS</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="empty-card font-mono">No driver standings available</div>
            )}
          </div>
        )}

        {/* CONSTRUCTORS TAB */}
        {activeTab === 'CONSTRUCTORS' && (
          <div className="tab-pane fade-in">
            {isLoadingConstructors ? (
              <div className="skeleton-container">
                <div className="skeleton leader-skeleton" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton row-skeleton" />
                ))}
              </div>
            ) : constructorsError ? (
              <div className="error-card font-mono">
                <p>FAILED TO LOAD CONSTRUCTOR STANDINGS</p>
                <button className="retry-btn font-mono" onClick={() => refetchConstructors()}>
                  <RefreshCw size={12} /> RETRY
                </button>
              </div>
            ) : constructorStandings && constructorStandings.length > 0 ? (
              <>
                {/* P1 CONSTRUCTOR LEADER SPOTLIGHT */}
                {leaderConstructor && (
                  <div
                    className="leader-spotlight-card"
                    style={{
                      borderLeftColor:
                        getTeamDetails(leaderConstructor.Constructor.constructorId).color ||
                        'var(--color-accent)',
                    }}
                  >
                    <div className="spotlight-top font-mono">
                      <div className="p1-badge">
                        <Trophy size={11} className="trophy-icon" /> LEADER P1
                      </div>
                      <span className="chassis-badge font-mono">
                        {getTeamDetails(leaderConstructor.Constructor.constructorId).chassis}
                      </span>
                    </div>

                    <div className="spotlight-main">
                      <div className="driver-names">
                        <span className="given-name font-mono">
                          {getTeamDetails(leaderConstructor.Constructor.constructorId).fullName}
                        </span>
                        <span className="family-name font-heading">
                          {leaderConstructor.Constructor.name}
                        </span>
                      </div>

                      <div className="points-box">
                        <span className="pts-val font-heading">{leaderConstructor.points}</span>
                        <span className="pts-lbl font-mono">PTS</span>
                        {parseInt(leaderConstructor.wins) > 0 && (
                          <span className="wins-count font-mono">{leaderConstructor.wins} WINS</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* CONSTRUCTOR RANKING LIST (P2+) */}
                <div className="standings-list">
                  {restConstructors?.map((standing) => {
                    const team = getTeamDetails(standing.Constructor.constructorId);

                    return (
                      <div
                        key={standing.Constructor.constructorId}
                        className="constructor-row"
                        style={{ borderLeftColor: team.color || 'var(--color-border)' }}
                      >
                        <div className="row-left">
                          <span className="row-pos font-mono">{standing.position}</span>
                          <div className="row-driver-details">
                            <span className="row-driver-name font-heading">
                              {standing.Constructor.name}
                            </span>
                            <span className="row-team-name font-mono" style={{ color: team.color }}>
                              {team.fullName}
                            </span>
                          </div>
                        </div>

                        <div className="row-right">
                          <span className="row-pts font-heading">{standing.points}</span>
                          <span className="row-pts-lbl font-mono">PTS</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="empty-card font-mono">No constructor standings available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Standings;
