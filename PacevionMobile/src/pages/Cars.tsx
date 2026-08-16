import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { TEAM_DETAILS } from '../data/teamDetails';
import { getTeamVisual } from '../data/assets';
import './Cars.css';

export const Cars: React.FC = () => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const teamsList = useMemo(() => {
    return Object.entries(TEAM_DETAILS).map(([id, details]) => ({
      id,
      ...details,
      visualUrl: getTeamVisual(id),
    }));
  }, []);

  const totalTeams = teamsList.length;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="cars-dashboard">
      {/* Header */}
      <header className="cars-header">
        <div className="cars-header-top">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft size={22} />
          </button>
          <div className="cars-header-titles">
            <h1 className="brand-badge font-mono">2026 CARS</h1>
            <p className="championship-sub font-mono">2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</p>
          </div>
        </div>
        <div className="cars-stats-pill font-mono">
          {totalTeams} TEAMS · {totalTeams} CARS
        </div>
      </header>

      {/* Cars Gallery */}
      <div className="cars-list">
        {teamsList.map((team) => {
          const hasImageError = imageErrors[team.id];
          const hasVisual = team.visualUrl && !hasImageError;

          return (
            <div
              key={team.id}
              className="car-card"
              style={{ borderTopColor: team.color || 'var(--color-accent)' }}
            >
              {/* Header inside card */}
              <div className="car-card-header">
                <div className="team-identity">
                  <h2 className="team-full-name font-heading">{team.fullName}</h2>
                  <span className="team-color-indicator font-mono" style={{ color: team.color }}>
                    ● 2026 SPECIFICATION
                  </span>
                </div>
              </div>

              {/* CAR IMAGE VISUAL CONTAINER */}
              <div className="car-image-wrapper">
                {hasVisual ? (
                  <img
                    src={team.visualUrl!}
                    alt={`${team.fullName} 2026 F1 Car`}
                    className="car-img"
                    loading="lazy"
                    onError={() => handleImageError(team.id)}
                  />
                ) : (
                  <div className="car-unavailable-box font-mono">
                    <AlertCircle size={18} className="unavail-icon" />
                    <span className="unavail-title">CAR VISUAL UNAVAILABLE</span>
                    <span className="unavail-sub">{team.fullName}</span>
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="car-specs-grid font-mono">
                <div className="spec-item">
                  <span className="spec-lbl">CHASSIS</span>
                  <span className="spec-val font-heading">{team.chassis}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">POWER UNIT</span>
                  <span className="spec-val font-heading">{team.powerUnit}</span>
                </div>
              </div>

              {/* Description */}
              <p className="team-description">{team.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cars;
