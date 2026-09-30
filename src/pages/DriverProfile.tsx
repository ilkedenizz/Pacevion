import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Users, Activity, CheckCircle2 } from 'lucide-react';
import { useDriverStandings, useAllSeasonResults, useAllSeasonQualifying } from '../hooks/useF1Data';
import { useSeason } from '../context/SeasonContext';
import { useSEO } from '../hooks/useSEO';
import { getDriverVisual } from '../data/assets';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverForm, getDriverStatsAggr, getTeammateComparison } from '../utils/driverStats';
import ErrorState from '../components/ui/ErrorState';
import './Drivers.css';

const DriverProfile: React.FC = () => {
  const { driverId = '' } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const { season } = useSeason();

  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError, refetch: refetchStandings } = useDriverStandings();
  const { data: allResults, isLoading: isResultsLoading } = useAllSeasonResults(season || '2026');
  const { data: allQualifying } = useAllSeasonQualifying(season || '2026');

  const driverData = useMemo(() => {
    if (!standings || standings.length === 0) return null;
    return standings.find((s) => s.Driver.driverId === driverId) || null;
  }, [standings, driverId]);

  const formattedDriverName = useMemo(() => {
    if (driverData) {
      return `${driverData.Driver.givenName} ${driverData.Driver.familyName}`;
    }
    return driverId
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }, [driverData, driverId]);

  useSEO({
    title: `${formattedDriverName} — F1 Driver Profile | Pacevion`,
    description: `Formula 1 pilotu ${formattedDriverName} hakkında detaylar, yarış formu, grid-finiş istatistikleri ve güncel sezon puan durumları.`,
    canonicalPath: `/drivers/${driverId}`
  });

  // Aggregated Stats, Form, and Teammate Comparison
  const dStatsAggr = useMemo(() => {
    return getDriverStatsAggr(driverId, allResults);
  }, [driverId, allResults]);

  const dForm = useMemo(() => {
    return getDriverForm(driverId, allResults);
  }, [driverId, allResults]);

  const constructorId = driverData?.Constructors[0]?.constructorId;
  const teamDetails = useMemo(() => {
    return constructorId ? getTeamDetails(constructorId) : null;
  }, [constructorId]);

  const teammateComp = useMemo(() => {
    if (!driverId || !constructorId || !standings || !allResults) return null;
    return getTeammateComparison(driverId, constructorId, standings, allResults, allQualifying);
  }, [driverId, constructorId, standings, allResults, allQualifying]);

  if (isStandingsLoading) {
    return (
      <div className="driver-grid-container loading">
        <div className="skeleton" style={{ width: '100%', height: '320px', marginBottom: 'var(--space-6)' }} />
        <div className="skeleton" style={{ width: '100%', height: '200px', marginBottom: 'var(--space-6)' }} />
        <div className="skeleton" style={{ width: '100%', height: '240px' }} />
      </div>
    );
  }

  if (isStandingsError || !driverData) {
    return (
      <div className="driver-grid-container error">
        <ErrorState message="Driver could not be loaded." onRetry={refetchStandings} />
        <button className="rc-nav-btn" onClick={() => navigate('/drivers')} style={{ marginTop: 'var(--space-4)' }}>
          <ChevronLeft size={14} /> Back to Drivers
        </button>
      </div>
    );
  }

  const driver = driverData.Driver;
  const constructor = driverData.Constructors[0];
  const driverVisual = getDriverVisual(driver.driverId, constructor?.constructorId);
  const teamColor = teamDetails?.color || 'var(--color-accent)';

  return (
    <div className="driver-grid-container">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <button className="rc-nav-btn" onClick={() => navigate('/drivers')}>
          <ChevronLeft size={14} /> <span>BACK TO DRIVER GRID</span>
        </button>
      </div>

      {/* ── DRIVER PROFILE HERO ── */}
      <div className="driver-profile-hero" style={{ borderLeftColor: teamColor }}>
        <div className="dp-hero-image">
          <img src={driverVisual || undefined} alt={driver.familyName} className="dp-hero-driver" />
        </div>
        <div className="dp-hero-bg">
          <span className="dp-hero-bg-number">{driver.permanentNumber || driverData.position}</span>
        </div>

        <div className="dp-hero-content">
          <div className="dp-meta">
            <span className="dp-team-badge" style={{ backgroundColor: teamColor }}>
              {constructor?.name || 'Unknown'}
            </span>
            <span className="dp-nat">{driver.nationality}</span>
            {driver.permanentNumber && (
              <span className="dp-nat font-mono">#{driver.permanentNumber}</span>
            )}
          </div>
          <h1 className="dp-name">
            <span className="dp-firstname">{driver.givenName}</span>
            <span className="dp-lastname">{driver.familyName}</span>
          </h1>
        </div>

        <div className="dp-stats-box">
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">POSITION</span>
            <span className="dp-stat-val text-accent">P{driverData.position}</span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">POINTS</span>
            <span className="dp-stat-val">{driverData.points}</span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">WINS</span>
            <span className="dp-stat-val">
              <Trophy size={16} className="gold-trophy" style={{ marginRight: '4px' }} />
              {dStatsAggr.winsCount || driverData.wins || 0}
            </span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">PODIUMS</span>
            <span className="dp-stat-val">{dStatsAggr.podiumsCount || 0}</span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">BEST FINISH</span>
            <span className="dp-stat-val">{dStatsAggr.bestFinish}</span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">AVG FINISH</span>
            <span className="dp-stat-val">{dStatsAggr.avgFinish}</span>
          </div>
        </div>
      </div>

      {/* ── DRIVER PROFILE SECTIONS ── */}
      <div className="dp-content-grid">

        {/* 1. RECENT FORM & GRID VS FINISH */}
        <section className="dp-section">
          <div className="dp-section-header">
            <div className="dp-section-title-wrap">
              <Activity size={15} color="var(--color-accent)" />
              <h2 className="dp-section-title">SEASON RACE FORM & GRID VS FINISH</h2>
            </div>
            {dForm.length > 0 && (
              <span className="dp-section-badge font-mono">
                {dStatsAggr.classifiedCount} / {dStatsAggr.totalEntries} CLASSIFIED
              </span>
            )}
          </div>

          {isResultsLoading ? (
            <div className="skeleton" style={{ width: '100%', height: '140px' }} />
          ) : dForm.length === 0 ? (
            <div className="empty-results" style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
              No completed race results available yet for the current season.
            </div>
          ) : (
            <div className="dp-form-container">
              {/* Form Bar Chart Strip */}
              <div className="dp-form-chart-wrapper">
                <div className="dp-form-bars">
                  {dForm.map((f, i) => {
                    const isDNF = typeof f.position !== 'number';
                    const isP1 = f.position === 1;
                    const isPodium = typeof f.position === 'number' && f.position <= 3;
                    const barHeight = isDNF ? 18 : Math.max(18, 100 - (Number(f.position) * 4.2));

                    let barColor = teamColor;
                    if (isP1) barColor = 'var(--color-warning, #ffb800)';
                    else if (isPodium) barColor = '#00c864';
                    else if (isDNF) barColor = 'var(--color-accent, #e10600)';

                    return (
                      <div key={i} className="dp-form-bar-col">
                        <div
                          className="dp-form-bar"
                          style={{
                            height: `${barHeight}%`,
                            backgroundColor: barColor
                          }}
                          title={`Round ${f.round}: ${f.raceName} — ${isDNF ? f.position : `P${f.position}`}`}
                        >
                          <span className="dp-form-bar-text">
                            {isDNF ? f.position : `P${f.position}`}
                          </span>
                        </div>
                        <span className="dp-form-round-label font-mono">R{f.round}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="dp-form-summary-row">
                  <span>BEST: <strong>{dStatsAggr.bestFinish}</strong></span>
                  <span>AVG: <strong>{dStatsAggr.avgFinish}</strong></span>
                  <span>POINTS FINISHES: <strong>{dStatsAggr.pointsFinishes}</strong></span>
                  <span>DNFs: <strong>{dStatsAggr.dnfCount}</strong></span>
                </div>
              </div>

              {/* Detailed Grid vs Finish Table */}
              <div className="dp-table-wrapper">
                <table className="dp-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>RND</th>
                      <th>GRAND PRIX</th>
                      <th>GRID</th>
                      <th>FINISH</th>
                      <th>GAIN / LOSS</th>
                      <th>PTS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dForm.map((f, idx) => {
                      const isP1 = f.position === 1;
                      const isPodium = typeof f.position === 'number' && f.position <= 3;
                      const isDNF = typeof f.position !== 'number';

                      return (
                        <tr key={idx}>
                          <td className="font-bold">R{f.round}</td>
                          <td>{f.raceName}</td>
                          <td>
                            {f.grid === 'PIT' ? (
                              <span style={{ color: 'var(--color-text-muted)' }}>PIT</span>
                            ) : f.grid !== null ? (
                              `P${f.grid}`
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`dp-pos-badge ${
                                isP1 ? 'p1' : isPodium ? 'podium' : isDNF ? 'dnf' : ''
                              }`}
                            >
                              {isDNF ? f.position : `P${f.position}`}
                            </span>
                          </td>
                          <td>
                            {f.delta === null ? (
                              <span className="delta-na">—</span>
                            ) : f.delta > 0 ? (
                              <span className="delta-gain">▲ +{f.delta}</span>
                            ) : f.delta < 0 ? (
                              <span className="delta-loss">▼ {f.delta}</span>
                            ) : (
                              <span className="delta-equal">= 0</span>
                            )}
                          </td>
                          <td className="font-bold">{f.points !== '0' ? `+${f.points}` : '0'}</td>
                          <td style={{ color: 'var(--color-text-muted)' }}>{f.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* 2. TEAMMATE HEAD-TO-HEAD */}
        {teammateComp && teammateComp.teammate && (
          <section className="dp-section">
            <div className="dp-section-header">
              <div className="dp-section-title-wrap">
                <Users size={15} color="#ffb800" />
                <h2 className="dp-section-title">
                  TEAMMATE HEAD-TO-HEAD • {constructor?.name?.toUpperCase()}
                </h2>
              </div>
            </div>

            <div className="h2h-card">
              <div className="h2h-drivers-header">
                <div className="h2h-driver-col left">
                  <span className="h2h-dname">{driver.familyName.toUpperCase()}</span>
                  <span className="h2h-dcode">#{driver.permanentNumber || driverData.position}</span>
                </div>
                <div className="h2h-vs-badge">VS</div>
                <div className="h2h-driver-col right">
                  <span className="h2h-dname">
                    {teammateComp.teammate.Driver.familyName.toUpperCase()}
                  </span>
                  <span className="h2h-dcode">
                    #{teammateComp.teammate.Driver.permanentNumber || teammateComp.teammate.position}
                  </span>
                </div>
              </div>

              <div className="h2h-metrics-list">
                {/* Points */}
                <div className="h2h-metric-item">
                  <div className="h2h-metric-row">
                    <span className={`h2h-val left ${teammateComp.driverPoints > teammateComp.teammatePoints ? 'leader' : ''}`}>
                      {teammateComp.driverPoints}
                    </span>
                    <span className="h2h-lbl">CHAMPIONSHIP POINTS</span>
                    <span className={`h2h-val right ${teammateComp.teammatePoints > teammateComp.driverPoints ? 'leader' : ''}`}>
                      {teammateComp.teammatePoints}
                    </span>
                  </div>
                  <div className="h2h-bar-container">
                    <div
                      className="h2h-bar-left"
                      style={{
                        backgroundColor: teamColor,
                        width: `${
                          teammateComp.driverPoints + teammateComp.teammatePoints > 0
                            ? (teammateComp.driverPoints / (teammateComp.driverPoints + teammateComp.teammatePoints)) * 100
                            : 50
                        }%`
                      }}
                    />
                    <div
                      className="h2h-bar-right"
                      style={{
                        width: `${
                          teammateComp.driverPoints + teammateComp.teammatePoints > 0
                            ? (teammateComp.teammatePoints / (teammateComp.driverPoints + teammateComp.teammatePoints)) * 100
                            : 50
                        }%`
                      }}
                    />
                  </div>
                </div>

                {/* Race Wins */}
                <div className="h2h-metric-item">
                  <div className="h2h-metric-row">
                    <span className={`h2h-val left ${teammateComp.driverWins > teammateComp.teammateWins ? 'leader' : ''}`}>
                      {teammateComp.driverWins}
                    </span>
                    <span className="h2h-lbl">RACE WINS</span>
                    <span className={`h2h-val right ${teammateComp.teammateWins > teammateComp.driverWins ? 'leader' : ''}`}>
                      {teammateComp.teammateWins}
                    </span>
                  </div>
                  <div className="h2h-bar-container">
                    <div
                      className="h2h-bar-left"
                      style={{
                        backgroundColor: teamColor,
                        width: `${
                          teammateComp.driverWins + teammateComp.teammateWins > 0
                            ? (teammateComp.driverWins / (teammateComp.driverWins + teammateComp.teammateWins)) * 100
                            : 50
                        }%`
                      }}
                    />
                    <div
                      className="h2h-bar-right"
                      style={{
                        width: `${
                          teammateComp.driverWins + teammateComp.teammateWins > 0
                            ? (teammateComp.teammateWins / (teammateComp.driverWins + teammateComp.teammateWins)) * 100
                            : 50
                        }%`
                      }}
                    />
                  </div>
                </div>

                {/* Podiums */}
                <div className="h2h-metric-item">
                  <div className="h2h-metric-row">
                    <span className={`h2h-val left ${teammateComp.driverPodiums > teammateComp.teammatePodiums ? 'leader' : ''}`}>
                      {teammateComp.driverPodiums}
                    </span>
                    <span className="h2h-lbl">PODIUM FINISHES</span>
                    <span className={`h2h-val right ${teammateComp.teammatePodiums > teammateComp.driverPodiums ? 'leader' : ''}`}>
                      {teammateComp.teammatePodiums}
                    </span>
                  </div>
                  <div className="h2h-bar-container">
                    <div
                      className="h2h-bar-left"
                      style={{
                        backgroundColor: teamColor,
                        width: `${
                          teammateComp.driverPodiums + teammateComp.teammatePodiums > 0
                            ? (teammateComp.driverPodiums / (teammateComp.driverPodiums + teammateComp.teammatePodiums)) * 100
                            : 50
                        }%`
                      }}
                    />
                    <div
                      className="h2h-bar-right"
                      style={{
                        width: `${
                          teammateComp.driverPodiums + teammateComp.teammatePodiums > 0
                            ? (teammateComp.teammatePodiums / (teammateComp.driverPodiums + teammateComp.teammatePodiums)) * 100
                            : 50
                        }%`
                      }}
                    />
                  </div>
                </div>

                {/* Races Finished Ahead */}
                <div className="h2h-metric-item">
                  <div className="h2h-metric-row">
                    <span className={`h2h-val left ${teammateComp.driverRacesAhead > teammateComp.teammateRacesAhead ? 'leader' : ''}`}>
                      {teammateComp.driverRacesAhead}
                    </span>
                    <span className="h2h-lbl">RACES FINISHED AHEAD</span>
                    <span className={`h2h-val right ${teammateComp.teammateRacesAhead > teammateComp.driverRacesAhead ? 'leader' : ''}`}>
                      {teammateComp.teammateRacesAhead}
                    </span>
                  </div>
                  <div className="h2h-bar-container">
                    <div
                      className="h2h-bar-left"
                      style={{
                        backgroundColor: teamColor,
                        width: `${
                          teammateComp.driverRacesAhead + teammateComp.teammateRacesAhead > 0
                            ? (teammateComp.driverRacesAhead / (teammateComp.driverRacesAhead + teammateComp.teammateRacesAhead)) * 100
                            : 50
                        }%`
                      }}
                    />
                    <div
                      className="h2h-bar-right"
                      style={{
                        width: `${
                          teammateComp.driverRacesAhead + teammateComp.teammateRacesAhead > 0
                            ? (teammateComp.teammateRacesAhead / (teammateComp.driverRacesAhead + teammateComp.teammateRacesAhead)) * 100
                            : 50
                        }%`
                      }}
                    />
                  </div>
                </div>

                {/* Qualifying Battle */}
                <div className="h2h-metric-item">
                  <div className="h2h-metric-row">
                    <span className={`h2h-val left ${teammateComp.driverQualyWins > teammateComp.teammateQualyWins ? 'leader' : ''}`}>
                      {teammateComp.driverQualyWins}
                    </span>
                    <span className="h2h-lbl">QUALIFYING DUEL</span>
                    <span className={`h2h-val right ${teammateComp.teammateQualyWins > teammateComp.driverQualyWins ? 'leader' : ''}`}>
                      {teammateComp.teammateQualyWins}
                    </span>
                  </div>
                  <div className="h2h-bar-container">
                    <div
                      className="h2h-bar-left"
                      style={{
                        backgroundColor: teamColor,
                        width: `${
                          teammateComp.driverQualyWins + teammateComp.teammateQualyWins > 0
                            ? (teammateComp.driverQualyWins / (teammateComp.driverQualyWins + teammateComp.teammateQualyWins)) * 100
                            : 50
                        }%`
                      }}
                    />
                    <div
                      className="h2h-bar-right"
                      style={{
                        width: `${
                          teammateComp.driverQualyWins + teammateComp.teammateQualyWins > 0
                            ? (teammateComp.teammateQualyWins / (teammateComp.driverQualyWins + teammateComp.teammateQualyWins)) * 100
                            : 50
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. DRIVER BIO & TECHNICAL DETAILS */}
        <section className="dp-section">
          <div className="dp-section-header">
            <div className="dp-section-title-wrap">
              <CheckCircle2 size={15} color="var(--color-accent)" />
              <h2 className="dp-section-title">DRIVER BIO & TECHNICAL DETAILS</h2>
            </div>
          </div>

          <div className="dp-bio-grid">
            <div className="dp-bio-item">
              <span className="dp-bio-lbl">FULL NAME</span>
              <span className="dp-bio-val">{driver.givenName} {driver.familyName}</span>
            </div>
            <div className="dp-bio-item">
              <span className="dp-bio-lbl">DATE OF BIRTH</span>
              <span className="dp-bio-val">{driver.dateOfBirth || '—'}</span>
            </div>
            <div className="dp-bio-item">
              <span className="dp-bio-lbl">NATIONALITY</span>
              <span className="dp-bio-val">{driver.nationality || '—'}</span>
            </div>
            <div className="dp-bio-item">
              <span className="dp-bio-lbl">TEAM</span>
              <span className="dp-bio-val" style={{ color: teamColor }}>
                {constructor?.name || 'Unknown'}
              </span>
            </div>
            <div className="dp-bio-item">
              <span className="dp-bio-lbl">CAR NUMBER</span>
              <span className="dp-bio-val">#{driver.permanentNumber || driverData.position}</span>
            </div>
            <div className="dp-bio-item">
              <span className="dp-bio-lbl">CHASSIS</span>
              <span className="dp-bio-val">{teamDetails?.chassis || '—'}</span>
            </div>
            <div className="dp-bio-item">
              <span className="dp-bio-lbl">POWER UNIT</span>
              <span className="dp-bio-val">{teamDetails?.powerUnit || '—'}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DriverProfile;
