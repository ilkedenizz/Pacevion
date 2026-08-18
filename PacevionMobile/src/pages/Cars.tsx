import React, { useState } from 'react';
import { useConstructorStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getTeamVisual } from '../data/assets';
import './Cars.css';

export const Cars: React.FC = () => {
  const { data: constructorsData, isLoading } = useConstructorStandings('2026');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const constructors = constructorsData || [];
  
  if (!selectedId && constructors.length > 0) {
    setSelectedId(constructors[0].Constructor.constructorId);
  }

  const selectedConst = constructors.find(c => c.Constructor.constructorId === selectedId) || constructors[0];

  return (
    <div className="cars-page fade-in">

      {isLoading || !selectedConst ? (
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
      ) : (
        <>
          <div className="car-showroom">
            <div className="csr-bg" style={{ background: `radial-gradient(ellipse at center, ${getTeamDetails(selectedConst.Constructor.constructorId).color}33 0%, transparent 60%)` }} />
            
            <div className="csr-header">
              <span className="font-mono editorial-label">2026 CHALLENGER</span>
              <h2 className="csr-team font-heading editorial-headline">{selectedConst.Constructor.name}</h2>
              <div className="csr-chassis font-mono">{getTeamDetails(selectedConst.Constructor.constructorId).chassis}</div>
            </div>

            <div className="csr-render-box">
              {getTeamVisual(selectedConst.Constructor.constructorId) ? (
                <img src={getTeamVisual(selectedConst.Constructor.constructorId)!} alt="Car" className="csr-img" />
              ) : (
                <div className="csr-placeholder font-mono">RENDER NOT AVAILABLE</div>
              )}
            </div>
            
            <div className="csr-gradient-floor" />
          </div>

          <div className="car-tech-specs">
            <div className="cts-row">
              <div className="cts-box">
                <span className="cts-lbl editorial-label">POWER UNIT</span>
                <span className="cts-val font-heading editorial-headline">{getTeamDetails(selectedConst.Constructor.constructorId).powerUnit}</span>
              </div>
              <div className="cts-box">
                <span className="cts-lbl editorial-label">ENGINE</span>
                <span className="cts-val font-heading editorial-headline">1.6L V6 TURBO</span>
              </div>
            </div>
            <div className="cts-row">
              <div className="cts-box">
                <span className="cts-lbl editorial-label">TOP SPEED</span>
                <span className="cts-val font-heading editorial-num">350+ <span style={{fontSize: '12px'}}>KM/H</span></span>
              </div>
              <div className="cts-box">
                <span className="cts-lbl editorial-label">TEAM BASE</span>
                <span className="cts-val font-heading editorial-headline">{selectedConst.Constructor.nationality}</span>
              </div>
            </div>
          </div>

          <div className="car-selector-grid">
            {constructors.map(c => {
              const isActive = c.Constructor.constructorId === selectedId;
              const tColor = getTeamDetails(c.Constructor.constructorId).color || '#444';
              return (
                <button 
                  key={c.Constructor.constructorId}
                  className={`csg-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedId(c.Constructor.constructorId)}
                >
                  <div className="csg-accent" style={{ background: isActive ? tColor : 'transparent' }} />
                  <span className="csg-name font-heading editorial-headline">{c.Constructor.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Cars;
