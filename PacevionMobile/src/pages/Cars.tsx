import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { TEAM_DETAILS } from '../data/teamDetails';
import './Cars.css';

const Cars: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="cars-page">
      <header className="cars-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={24} />
        </button>
        <h1>2026 CARS</h1>
      </header>

      <div className="cars-list">
        {Object.entries(TEAM_DETAILS).map(([id, team]) => (
          <div key={id} className="car-card">
            <div className="car-card-top-border" style={{ backgroundColor: team.color || '#e10600' }} />
            <div className="car-card-content">
              <h2 className="team-name">{team.fullName}</h2>
              
              <div className="car-specs">
                <span className="spec-label">CHASSIS:</span>
                <span className="spec-value">{team.chassis}</span>
              </div>
              
              <div className="car-specs">
                <span className="spec-label">POWER UNIT:</span>
                <span className="spec-value">{team.powerUnit}</span>
              </div>
              
              <p className="team-desc">{team.description}</p>
              
              <div className="team-accent-dot" style={{ backgroundColor: team.color || '#e10600' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cars;
