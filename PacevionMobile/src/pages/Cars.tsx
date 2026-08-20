import React, { useState, useEffect, useMemo } from 'react';
import { useConstructorStandings, useDriverStandings, useAllSeasonResults } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual, getCarVisual } from '../data/assets';
import { getTeamSeasonPerformance, getTeamDrivers } from '../utils/teamStats';
import './Cars.css';

export const Cars: React.FC = () => {
  const { data: standings, isLoading, isError } = useConstructorStandings('2026');
  const { data: driverStandings } = useDriverStandings('2026');
  const { data: allResults } = useAllSeasonResults('2026');

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (standings && standings.length > 0 && !selectedId) {
      setSelectedId(standings[0].Constructor.constructorId);
    }
  }, [standings, selectedId]);

  const teamPerf = useMemo(() => {
    if (!selectedId || !allResults) return [];
    return getTeamSeasonPerformance(selectedId, allResults);
  }, [selectedId, allResults]);

  const teamDrivers = useMemo(() => {
    if (!selectedId || !driverStandings) return [];
    return getTeamDrivers(selectedId, driverStandings);
  }, [selectedId, driverStandings]);

  if (isLoading || !standings) return <div className="skeleton" style={{ height: '100vh' }} />;
  if (isError) return <div className="page cars-page fade-in" style={{ padding: '24px', textAlign: 'center', marginTop: '100px' }}>Unable to load teams.</div>;

  const team = standings.find(s => s.Constructor.constructorId === selectedId) || standings[0];
  const details = getTeamDetails(team.Constructor.constructorId);

  // max points to scale chart
  const maxPts = teamPerf.length > 0 ? teamPerf[teamPerf.length - 1].totalPoints : 100;

  return (
    <div className="page cars-page fade-in">
      
      <div className="c-nav-scroll">
        {standings.map((std) => (
          <button 
            key={std.Constructor.constructorId} 
            className={`c-nav-btn ${selectedId === std.Constructor.constructorId ? 'active' : ''}`}
            onClick={() => setSelectedId(std.Constructor.constructorId)}
            style={{ 
              borderColor: selectedId === std.Constructor.constructorId ? getTeamDetails(std.Constructor.constructorId).color : 'transparent',
              color: selectedId === std.Constructor.constructorId ? '#fff' : 'var(--color-text-secondary)'
            }}
          >
            {std.Constructor.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="c-hero" style={{ background: `linear-gradient(to bottom, ${details.color}33, var(--color-bg))` }}>
        <img src={getCarVisual(team.Constructor.constructorId)} alt={team.Constructor.name} className="c-image fade-in" />
        <div className="c-hero-info">
          <span className="editorial-label" style={{ color: details.color }}>{details.fullName}</span>
          <h1 className="font-heading editorial-headline">{team.Constructor.name}</h1>
        </div>
      </div>

      <div className="c-content">
        <div className="c-main-stats">
          <div className="c-stat-box">
            <span className="editorial-label">POS</span>
            <span className="font-mono c-stat-val">P{team.position}</span>
          </div>
          <div className="c-stat-box">
            <span className="editorial-label">PTS</span>
            <span className="font-mono c-stat-val">{team.points}</span>
          </div>
          <div className="c-stat-box">
            <span className="editorial-label">WINS</span>
            <span className="font-mono c-stat-val">{team.wins}</span>
          </div>
        </div>

        {/* Season Performance Chart */}
        {teamPerf.length > 0 && (
          <div className="c-section fade-in">
            <h3 className="editorial-label">SEASON PERFORMANCE (POINTS PROGRESSION)</h3>
            <div className="c-chart-container">
              <div className="c-chart">
                {teamPerf.map((p, i) => {
                  const h = Math.max(5, (p.totalPoints / (maxPts || 1)) * 100);
                  return (
                    <div key={i} className="c-chart-bar-wrap">
                      <div className="c-chart-bar" style={{ height: `${h}%`, background: details.color }}>
                        <span className="c-chart-pos font-mono">{p.totalPoints}</span>
                      </div>
                      <span className="c-chart-lbl font-mono">{p.round}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Driver Line-up Comparison */}
        {teamDrivers.length === 2 && (
          <div className="c-section fade-in">
            <h3 className="editorial-label">DRIVER LINE-UP</h3>
            <div className="c-lineup-card">
              <div className="cl-driver" style={{ borderLeft: `4px solid ${details.color}` }}>
                <img src={getDriverVisual(teamDrivers[0].Driver.driverId, 'portrait')} alt={teamDrivers[0].Driver.familyName} />
                <div className="cl-info">
                  <span className="font-heading editorial-headline">{teamDrivers[0].Driver.familyName}</span>
                  <span className="font-mono editorial-label">{teamDrivers[0].points} PTS</span>
                </div>
              </div>
              <div className="cl-vs editorial-label">VS</div>
              <div className="cl-driver right" style={{ borderRight: `4px solid ${details.color}` }}>
                <div className="cl-info right">
                  <span className="font-heading editorial-headline">{teamDrivers[1].Driver.familyName}</span>
                  <span className="font-mono editorial-label">{teamDrivers[1].points} PTS</span>
                </div>
                <img src={getDriverVisual(teamDrivers[1].Driver.driverId, 'portrait')} alt={teamDrivers[1].Driver.familyName} />
              </div>
            </div>
          </div>
        )}

        <div className="c-section fade-in">
          <h3 className="editorial-label">TEAM DETAILS</h3>
          <div className="c-details-card">
            <div className="c-detail-row">
              <span className="editorial-label">FULL NAME</span>
              <span className="font-mono" style={{ color: '#fff' }}>{details.fullName}</span>
            </div>
            <div className="c-detail-row">
              <span className="editorial-label">BASE</span>
              <span className="font-mono" style={{ color: '#fff' }}>{team.Constructor.nationality.toUpperCase()}</span>
            </div>
            <div className="c-detail-row">
              <span className="editorial-label">CHASSIS</span>
              <span className="font-mono" style={{ color: '#fff' }}>{details.chassis}</span>
            </div>
            <div className="c-detail-row">
              <span className="editorial-label">POWER UNIT</span>
              <span className="font-mono" style={{ color: '#fff' }}>{details.powerUnit}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cars;
