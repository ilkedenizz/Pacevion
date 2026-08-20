import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDriverStandings, useAllSeasonResults, useAllSeasonQualifying } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import { getDriverForm, getDriverStatsAggr, getTeammateComparison } from '../utils/driverStats';
import './Drivers.css';

export const Drivers: React.FC = () => {
  const { state } = useLocation();
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError } = useDriverStandings('2026');
  const { data: allResults, isError: isResultsError } = useAllSeasonResults('2026');
  const { data: allQualifying, isError: isQualifyingError } = useAllSeasonQualifying('2026');

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (state?.selectedDriverId) {
      setSelectedId(state.selectedDriverId);
    } else if (standings && standings.length > 0 && !selectedId) {
      setSelectedId(standings[0].Driver.driverId);
    }
  }, [state, standings, selectedId]);

  const driverStats = useMemo(() => {
    if (!selectedId) return { wins: '—', podiums: '—', poles: '—', form: [] as string[] };
    if (isResultsError || isQualifyingError) return { wins: '—', podiums: '—', poles: '—', form: [] as string[] };
    if (!allResults || !allQualifying) return null;

    const driverResults = allResults
      .map(race => race.Results?.find(r => r.Driver.driverId === selectedId))
      .filter((r): r is NonNullable<typeof r> => !!r);

    const wins = driverResults.filter(r => parseInt(r.position) === 1).length;
    const podiums = driverResults.filter(r => parseInt(r.position) <= 3).length;
    
    const form = driverResults.slice(-5).map(r => r.positionText === 'R' || r.positionText === 'W' || r.positionText === 'D' || r.positionText === 'E' || !r.Time ? 'DNF' : `P${r.position}`);

    const driverQualifying = allQualifying
      .map(race => race.QualifyingResults?.find(r => r.Driver.driverId === selectedId))
      .filter((q): q is NonNullable<typeof q> => !!q);
    
    const poles = driverQualifying.filter(q => parseInt(q.position) === 1).length;

    return { wins: wins.toString(), podiums: podiums.toString(), poles: poles.toString(), form };
  }, [selectedId, allResults, allQualifying, isResultsError, isQualifyingError]);

  const dStatsAggr = useMemo(() => selectedId && allResults ? getDriverStatsAggr(selectedId, allResults) : { bestFinish: null, avgFinish: null }, [selectedId, allResults]);
  const dForm = useMemo(() => selectedId && allResults ? getDriverForm(selectedId, allResults, 8) : [], [selectedId, allResults]);
  const teammateComp = useMemo(() => {
    const driver = standings?.find(s => s.Driver.driverId === selectedId);
    if (!selectedId || !driver || !allResults) return null;
    return getTeammateComparison(selectedId, driver.Constructors[0]?.constructorId, standings, allResults, allQualifying);
  }, [selectedId, standings, allResults, allQualifying]);

  if (isStandingsLoading || !standings) return <div className="skeleton" style={{ height: '100vh' }} />;
  if (isStandingsError) return <div className="page drivers-page fade-in" style={{ padding: '24px', textAlign: 'center', marginTop: '100px' }}>Unable to load drivers.</div>;

  const driver = standings.find(s => s.Driver.driverId === selectedId) || standings[0];
  const teamColor = getTeamDetails(driver.Constructors[0]?.constructorId).color || '#333';

  return (
    <div className="page drivers-page fade-in">
      
      <div className="d-nav-scroll">
        {standings.map((std) => (
          <button 
            key={std.Driver.driverId} 
            className={`d-nav-btn ${selectedId === std.Driver.driverId ? 'active' : ''}`}
            onClick={() => setSelectedId(std.Driver.driverId)}
            style={{ 
              borderColor: selectedId === std.Driver.driverId ? getTeamDetails(std.Constructors[0]?.constructorId).color : 'transparent',
              color: selectedId === std.Driver.driverId ? '#fff' : 'var(--color-text-secondary)'
            }}
          >
            {std.Driver.code || std.Driver.familyName.substring(0,3).toUpperCase()}
          </button>
        ))}
      </div>

      <div className="d-hero">
        <div className="d-hero-bg" style={{ background: `linear-gradient(to top, var(--color-bg), ${teamColor}33)` }} />
        <div className="d-num-large font-mono">{driver.Driver.permanentNumber || '??'}</div>
        <img src={getDriverVisual(driver.Driver.driverId, 'full')} alt={driver.Driver.familyName} className="d-image fade-in" />
        <div className="d-hero-names">
          <span className="editorial-label" style={{ color: teamColor }}>{driver.Constructors[0]?.name}</span>
          <h1 className="font-heading editorial-headline">{driver.Driver.givenName} <br/>{driver.Driver.familyName}</h1>
        </div>
      </div>

      <div className="d-content">
        <div className="d-main-stats">
          <div className="d-stat-box">
            <span className="editorial-label">POS</span>
            <span className="font-mono d-stat-val">P{driver.position}</span>
          </div>
          <div className="d-stat-box">
            <span className="editorial-label">PTS</span>
            <span className="font-mono d-stat-val">{driver.points}</span>
          </div>
          <div className="d-stat-box">
            <span className="editorial-label">WINS</span>
            <span className="font-mono d-stat-val">{driverStats?.wins || '—'}</span>
          </div>
          <div className="d-stat-box">
            <span className="editorial-label">PODIUMS</span>
            <span className="font-mono d-stat-val">{driverStats?.podiums || '—'}</span>
          </div>
          <div className="d-stat-box" style={{ gridColumn: 'span 2' }}>
            <span className="editorial-label">POLES</span>
            <span className="font-mono d-stat-val">{driverStats?.poles || '—'}</span>
          </div>
        </div>

        {/* Mini Performance Chart */}
        {dForm.length > 0 && (
          <div className="d-section fade-in">
            <h3 className="editorial-label">PERFORMANCE (LAST {dForm.length} RACES)</h3>
            <div className="d-chart-container">
              <div className="d-chart">
                {dForm.map((f, i) => {
                  const h = f.position === 'DNF' ? 10 : Math.max(10, 100 - (f.position * 4.5));
                  const bg = f.position === 1 ? '#FFB800' : f.position === 'DNF' ? 'var(--color-accent)' : teamColor;
                  return (
                    <div key={i} className="d-chart-bar-wrap">
                      <div className="d-chart-bar" style={{ height: `${h}%`, background: bg }}>
                        <span className="d-chart-pos font-mono">{f.position === 'DNF' ? 'DNF' : `P${f.position}`}</span>
                      </div>
                      <span className="d-chart-lbl font-mono">{f.round}</span>
                    </div>
                  );
                })}
              </div>
              <div className="d-chart-summary">
                <span className="editorial-label">BEST: <strong style={{color:'#fff'}}>{dStatsAggr.bestFinish}</strong></span>
                <span className="editorial-label">AVG: <strong style={{color:'#fff'}}>{dStatsAggr.avgFinish}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Teammate Comparison */}
        {teammateComp && teammateComp.teammate && (
          <div className="d-section fade-in">
            <h3 className="editorial-label">TEAMMATE BATTLE</h3>
            <div className="h2h-card" style={{ borderColor: teamColor }}>
              <div className="h2h-row h2h-head editorial-headline">
                <span className="h2h-left">{driver.Driver.familyName}</span>
                <span className="h2h-center editorial-label" style={{ opacity: 0.5 }}>VS</span>
                <span className="h2h-right">{teammateComp.teammate.Driver.familyName}</span>
              </div>
              <div className="h2h-row">
                <span className={`h2h-left font-mono ${teammateComp.driverPoints > teammateComp.teammatePoints ? 'h2h-win' : ''}`}>{teammateComp.driverPoints}</span>
                <span className="h2h-center editorial-label">PTS</span>
                <span className={`h2h-right font-mono ${teammateComp.teammatePoints > teammateComp.driverPoints ? 'h2h-win' : ''}`}>{teammateComp.teammatePoints}</span>
              </div>
              <div className="h2h-row">
                <span className={`h2h-left font-mono ${teammateComp.driverWins > teammateComp.teammateWins ? 'h2h-win' : ''}`}>{teammateComp.driverWins}</span>
                <span className="h2h-center editorial-label">WINS</span>
                <span className={`h2h-right font-mono ${teammateComp.teammateWins > teammateComp.driverWins ? 'h2h-win' : ''}`}>{teammateComp.teammateWins}</span>
              </div>
              <div className="h2h-row">
                <span className={`h2h-left font-mono ${teammateComp.driverPodiums > teammateComp.teammatePodiums ? 'h2h-win' : ''}`}>{teammateComp.driverPodiums}</span>
                <span className="h2h-center editorial-label">PODIUMS</span>
                <span className={`h2h-right font-mono ${teammateComp.teammatePodiums > teammateComp.driverPodiums ? 'h2h-win' : ''}`}>{teammateComp.teammatePodiums}</span>
              </div>
              <div className="h2h-row">
                <span className={`h2h-left font-mono ${teammateComp.driverQualyWins > teammateComp.teammateQualyWins ? 'h2h-win' : ''}`}>{teammateComp.driverQualyWins}</span>
                <span className="h2h-center editorial-label">QUALY H2H</span>
                <span className={`h2h-right font-mono ${teammateComp.teammateQualyWins > teammateComp.driverQualyWins ? 'h2h-win' : ''}`}>{teammateComp.teammateQualyWins}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Drivers;
