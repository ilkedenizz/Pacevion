import React, { useState } from 'react';
import { useConstructorStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getCarVisual } from '../data/assets';
import './Cars.css';

export const Cars: React.FC = () => {
  const { data: standings, isLoading } = useConstructorStandings('2026');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading || !standings) return <div className="skeleton" style={{ height: '100vh' }} />;

  const selectedTeamId = selectedId || standings[0]?.Constructor.constructorId;
  const team = standings.find(s => s.Constructor.constructorId === selectedTeamId) || standings[0];
  const details = getTeamDetails(team.Constructor.constructorId);
  
  return (
    <div className="cars-page fade-in">
      <div className="cp-showroom">
        <div className="cp-bg" style={{ background: `radial-gradient(circle, ${details.color}33 0%, rgba(0,0,0,0) 70%)` }} />
        <header className="cp-header">
          <span className="editorial-label">2026 FORMULA 1</span>
          <h1 className="font-heading editorial-headline">{details.chassis}</h1>
        </header>

        <div className="cp-render-box">
          <img src={getCarVisual(team.Constructor.constructorId)} alt="Car" />
        </div>
      </div>

      <div className="cp-specs">
        <div className="spec-item">
          <span className="editorial-label">POWER UNIT</span>
          <span className="font-mono spec-val">{details.powerUnit}</span>
        </div>
        <div className="spec-item">
          <span className="editorial-label">TOP SPEED</span>
          <span className="font-mono spec-val">350+ KM/H</span>
        </div>
        <div className="spec-item">
          <span className="editorial-label">TEAM</span>
          <span className="font-mono spec-val">{team.Constructor.name}</span>
        </div>
        <div className="spec-item">
          <span className="editorial-label">POINTS</span>
          <span className="font-mono spec-val">{team.points}</span>
        </div>
      </div>

      <div className="cp-selector">
        <span className="editorial-label" style={{ marginBottom: '16px', display: 'block' }}>SELECT CONSTRUCTOR</span>
        <div className="cp-list">
          {standings.map((s) => (
            <div 
              key={s.Constructor.constructorId} 
              className={`cp-list-item ${selectedTeamId === s.Constructor.constructorId ? 'active' : ''}`}
              onClick={() => setSelectedId(s.Constructor.constructorId)}
            >
              <div className="cli-color" style={{ background: getTeamDetails(s.Constructor.constructorId).color }} />
              <div className="cli-name font-heading editorial-headline">{s.Constructor.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
