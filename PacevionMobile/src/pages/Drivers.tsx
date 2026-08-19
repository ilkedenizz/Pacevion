import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDriverStandings, useAllSeasonResults, useAllSeasonQualifying } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './Drivers.css';

export const Drivers: React.FC = () => {
  const { state } = useLocation();
  const { data: standings, isLoading: isStandingsLoading, isError: isStandingsError } = useDriverStandings('2026');
  const { data: allResults, isError: isResultsError } = useAllSeasonResults('2026');
  const { data: allQualifying, isError: isQualifyingError } = useAllSeasonQualifying('2026');

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (state?.selectedDriverId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedId(state.selectedDriverId);
    } else if (standings && standings.length > 0 && !selectedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedId(standings[0].Driver.driverId);
    }
  }, [state, standings, selectedId]);

  const driverStats = useMemo(() => {
    if (!selectedId) return { wins: '—', podiums: '—', poles: '—', form: [] as string[] };
    if (isResultsError || isQualifyingError) return { wins: '—', podiums: '—', poles: '—', form: [] as string[] };
    if (!allResults || !allQualifying) return null;

    const driverResults = allResults
      .map(race => race.Results.find(r => r.Driver.driverId === selectedId))
      .filter((r): r is NonNullable<typeof r> => !!r);

    const wins = driverResults.filter(r => parseInt(r.position) === 1).length;
    const podiums = driverResults.filter(r => parseInt(r.position) <= 3).length;
    
    // Recent form from last 5 finished races
    const form = driverResults.slice(-5).map(r => r.positionText === 'R' || r.positionText === 'W' || r.positionText === 'D' || r.positionText === 'E' ? 'DNF' : `P${r.position}`);

    const driverQualifying = allQualifying
      .map(race => race.QualifyingResults.find(r => r.Driver.driverId === selectedId))
      .filter((q): q is NonNullable<typeof q> => !!q);
    
    const poles = driverQualifying.filter(q => parseInt(q.position) === 1).length;

    return { wins: wins.toString(), podiums: podiums.toString(), poles: poles.toString(), form };
  }, [selectedId, allResults, allQualifying, isResultsError, isQualifyingError]);

  if (isStandingsLoading || !standings) return <div className="skeleton" style={{ height: '100vh' }} />;
  if (isStandingsError) return <div className="driver-page fade-in" style={{ padding: '24px', textAlign: 'center', marginTop: '100px' }}>Unable to load drivers.</div>;

  const driver = standings.find(s => s.Driver.driverId === selectedId) || standings[0];
  const teamColor = getTeamDetails(driver.Constructors[0]?.constructorId).color || '#333';

  const renderFormBlock = (f: string, idx: number) => {
    let cls = 'fb';
    if (f === 'P1') cls += ' p1';
    else if (f === 'P2') cls += ' p2';
    else if (f === 'P3') cls += ' p3';
    else if (f === 'DNF') cls += ' dnf';
    return <div key={idx} className={cls}>{f}</div>;
  };

  return (
    <div className="driver-page fade-in">
      <div className="dp-hero">
        <div className="dp-bg-glow" style={{ background: `radial-gradient(circle at 70% 50%, ${teamColor}33 0%, rgba(0,0,0,0) 60%)` }} />
        
        <header className="dp-header">
          <span className="editorial-label">DRIVER</span>
          <span className="font-mono dp-pos">{driver.position.padStart(2, '0')}</span>
        </header>

        <div className="dp-main-info">
          <h1 className="font-heading editorial-headline dp-name">
            {driver.Driver.givenName}<br/>
            <span>{driver.Driver.familyName}</span>
          </h1>
          <span className="editorial-label dp-team" style={{ color: teamColor }}>
            {driver.Constructors[0]?.name}
          </span>
        </div>

        <div className="dp-portrait">
          <img src={getDriverVisual(driver.Driver.driverId, 'portrait')} alt={driver.Driver.familyName} />
        </div>
      </div>

      <div className="dp-stats">
        <div className="stat-box">
          <span className="editorial-label">PTS</span>
          <span className="font-mono stat-val">{driver.points}</span>
        </div>
        <div className="stat-box">
          <span className="editorial-label">WINS</span>
          <span className="font-mono stat-val">{driverStats ? driverStats.wins : '...'}</span>
        </div>
        <div className="stat-box">
          <span className="editorial-label">PODIUMS</span>
          <span className="font-mono stat-val">{driverStats ? driverStats.podiums : '...'}</span>
        </div>
        <div className="stat-box">
          <span className="editorial-label">POLES</span>
          <span className="font-mono stat-val">{driverStats ? driverStats.poles : '...'}</span>
        </div>
      </div>

      <div className="dp-form">
        <span className="editorial-label" style={{ marginBottom: '12px' }}>RECENT FORM</span>
        <div className="form-blocks">
          {!driverStats && <div className="editorial-label" style={{ opacity: 0.5 }}>LOADING...</div>}
          {driverStats && driverStats.form.length === 0 && <div className="editorial-label" style={{ opacity: 0.5 }}>NO RESULTS YET</div>}
          {driverStats && driverStats.form.map((f, i) => renderFormBlock(f, i))}
        </div>
      </div>

      <div className="dp-selector">
        <span className="editorial-label" style={{ marginBottom: '16px' }}>SELECT DRIVER</span>
        <div className="dp-list">
          {standings.map((s) => (
            <div 
              key={s.Driver.driverId} 
              className={`dp-list-item ${selectedId === s.Driver.driverId ? 'active' : ''}`}
              onClick={() => setSelectedId(s.Driver.driverId)}
            >
              <div className="dli-num font-mono">{s.position.padStart(2, '0')}</div>
              <div className="dli-name font-heading editorial-headline">{s.Driver.givenName[0]}. {s.Driver.familyName}</div>
              <div className="dli-team editorial-label">{s.Constructors[0]?.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
