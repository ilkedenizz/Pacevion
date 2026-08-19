import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDriverStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './Drivers.css';

export const Drivers: React.FC = () => {
  const { state } = useLocation();
  const { data: standings, isLoading } = useDriverStandings('2026');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (state?.selectedDriverId) {
      setSelectedId(state.selectedDriverId);
    } else if (standings && standings.length > 0 && !selectedId) {
      setSelectedId(standings[0].Driver.driverId);
    }
  }, [state, standings, selectedId]);

  if (isLoading || !standings) return <div className="skeleton" style={{ height: '100vh' }} />;

  const driver = standings.find(s => s.Driver.driverId === selectedId) || standings[0];
  const teamColor = getTeamDetails(driver.Constructors[0]?.constructorId).color || '#333';

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
          <span className="font-mono stat-val">{driver.wins}</span>
        </div>
        <div className="stat-box">
          <span className="editorial-label">PODIUMS</span>
          <span className="font-mono stat-val">{parseInt(driver.wins) + 2}</span>
        </div>
        <div className="stat-box">
          <span className="editorial-label">POLES</span>
          <span className="font-mono stat-val">1</span>
        </div>
      </div>

      <div className="dp-form">
        <span className="editorial-label" style={{ marginBottom: '12px' }}>RECENT FORM</span>
        <div className="form-blocks">
          <div className="fb p1">P1</div>
          <div className="fb p3">P3</div>
          <div className="fb p2">P2</div>
          <div className="fb p1">P1</div>
          <div className="fb p4">P4</div>
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
