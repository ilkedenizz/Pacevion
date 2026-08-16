import React from 'react';
import { circuitLayouts } from '../../../data/circuits';

const circuitsToShow = ['monaco', 'spa', 'suzuka', 'silverstone', 'monza', 'bahrain', 'zandvoort', 'yas_marina'];

const circuitStats: Record<string, { length: string; turns: string; type: string }> = {
  'monaco': { length: '3.337 KM', turns: '19', type: 'STREET' },
  'spa': { length: '7.004 KM', turns: '19', type: 'PERMANENT' },
  'suzuka': { length: '5.807 KM', turns: '18', type: 'PERMANENT' },
  'silverstone': { length: '5.891 KM', turns: '18', type: 'PERMANENT' },
  'monza': { length: '5.793 KM', turns: '11', type: 'PERMANENT' },
  'bahrain': { length: '5.412 KM', turns: '15', type: 'PERMANENT' },
  'zandvoort': { length: '4.259 KM', turns: '14', type: 'PERMANENT' },
  'yas_marina': { length: '5.281 KM', turns: '16', type: 'PERMANENT' },
};

const CircuitCharacteristics: React.FC = () => {
  return (
    <section className="lkc-section lkc-circuits" id="circuits">
      <div className="lkc-circuits-header lkc-reveal">
        <h2 className="lkc-section-title">CIRCUIT CHARACTERISTICS</h2>
        <p className="lkc-section-subtitle">THE BATTLEGROUNDS</p>
      </div>

      <div className="lkc-circuits-grid lkc-reveal" style={{ transitionDelay: '0.1s' }}>
        {circuitsToShow.map(trackId => {
          const layout = circuitLayouts[trackId];
          const stats = circuitStats[trackId] || { length: '5.000 KM', turns: '15', type: 'PERMANENT' };
          if (!layout) return null;
          
          return (
            <div key={trackId} className="lkc-circuit-card">
              <div className="lkc-circuit-card-header">
                <h3>{trackId.replace('_', ' ').toUpperCase()}</h3>
                <span className="circuit-subtitle">Grand Prix Circuit</span>
              </div>
              
              <div className="lkc-circuit-svg-container">
                <svg viewBox={layout.viewBox} preserveAspectRatio="xMidYMid meet">
                  <path d={layout.trackPath} />
                </svg>
              </div>
              
              <div className="lkc-circuit-stats">
                <div className="circuit-stat">
                  <span>LENGTH</span>
                  <strong>{stats.length}</strong>
                </div>
                <div className="circuit-stat">
                  <span>TURNS</span>
                  <strong>{stats.turns}</strong>
                </div>
                <div className="circuit-stat">
                  <span>TYPE</span>
                  <strong>{stats.type}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CircuitCharacteristics;
