import React, { useState } from 'react';
import { useConstructorStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getTeamVisual } from '../data/assets';
import './Cars.css';

export const Cars: React.FC = () => {
  const { data: constructorsData, isLoading } = useConstructorStandings('2026');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const constructors = constructorsData || [];
  
  // Ensure we have a selected ID
  if (!selectedId && constructors.length > 0) {
    setSelectedId(constructors[0].Constructor.constructorId);
  }

  const selectedConst = constructors.find(c => c.Constructor.constructorId === selectedId) || constructors[0];

  if (isLoading || !selectedConst) {
    return <div className="cars-page"><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>;
  }

  const tDetails = getTeamDetails(selectedConst.Constructor.constructorId);
  const carVisual = getTeamVisual(selectedConst.Constructor.constructorId);

  return (
    <div className="cars-page fade-in">
      <header className="brand-header">
        <h1 className="brand-title font-heading">CARS</h1>
      </header>

      <div className="car-hero-area">
        <div className="car-hero-bg" style={{ background: `linear-gradient(135deg, ${tDetails.color}33 0%, rgba(0,0,0,0) 100%)` }} />
        
        <div className="car-hero-text">
          <h2 className="car-team-name font-heading">{selectedConst.Constructor.name}</h2>
          <h3 className="car-chassis-name font-mono">2026 CHALLENGER</h3>
        </div>

        <div className="car-render-container">
          {carVisual ? (
            <img src={carVisual} alt={selectedConst.Constructor.name} className="car-render-img" />
          ) : (
            <div className="car-render-placeholder font-mono">CAR RENDER UNAVAILABLE</div>
          )}
        </div>
      </div>

      <div className="car-tech-panel">
        <div className="ct-row">
          <div className="ct-box">
            <span className="ct-lbl font-mono">POWER UNIT</span>
            <span className="ct-val font-heading">{tDetails.powerUnit}</span>
          </div>
          <div className="ct-box">
            <span className="ct-lbl font-mono">BASE</span>
            <span className="ct-val font-heading">{selectedConst.Constructor.nationality}</span>
          </div>
        </div>
        <div className="ct-row">
          <div className="ct-box">
            <span className="ct-lbl font-mono">POINTS</span>
            <span className="ct-val font-heading">{selectedConst.points}</span>
          </div>
          <div className="ct-box">
            <span className="ct-lbl font-mono">WINS</span>
            <span className="ct-val font-heading">{selectedConst.wins}</span>
          </div>
        </div>
      </div>

      <div className="car-selector-section">
        <h4 className="cs-title font-heading">SELECT TEAM</h4>
        <div className="cs-scroll">
          {constructors.map(c => {
            const tColor = getTeamDetails(c.Constructor.constructorId).color || '#444';
            const isActive = c.Constructor.constructorId === selectedId;
            return (
              <button 
                key={c.Constructor.constructorId}
                className={`cs-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedId(c.Constructor.constructorId)}
                style={{ borderBottomColor: isActive ? tColor : 'transparent' }}
              >
                <span className="cs-btn-text font-heading">{c.Constructor.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cars;
