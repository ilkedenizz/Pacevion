import React from 'react';
import { useConstructorStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import { getTeamVisual } from '../data/assets';
import ErrorState from '../components/ui/ErrorState';
import './Constructors.css';

const Constructors: React.FC = () => {
  const { data: standings, isLoading, isError, refetch } = useConstructorStandings();

  useSEO({
    title: 'F1 Constructors & Teams Directory | Pacevion',
    description: 'Formula 1 2026 sezonu aktif yarışan markalar, takım merkezleri ve detaylı bilgiler.',
    canonicalPath: '/constructors'
  });

  if (isLoading) {
    return (
      <div className="constructors-board-container loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
      </div>
    );
  }

  if (isError || !standings || standings.length === 0) {
    return (
      <div className="constructors-board-container error">
        <ErrorState message="Unable to load constructors list." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="constructors-board-container">
      <div className="cb-header">
        <div className="cbh-titles">
          <h1 className="cbh-main">CONSTRUCTOR CHAMPIONSHIP</h1>
          <span className="cbh-sub">SEASON 2026</span>
        </div>
      </div>

      <div className="constructors-showcase-grid">
        {standings.map((standing) => {
          const team = standing.Constructor;
          const isLeader = standing.position === '1';
          const teamVisual = getTeamVisual(team.constructorId);

          return (
            <div 
              key={team.constructorId} 
              className={`constructor-showcase-card ${isLeader ? 'leader-card' : ''}`}
            >
              <div className="csc-car-visual">
                <img src={teamVisual} alt={`${team.name} F1 Car`} loading="lazy" />
              </div>
              
              <div className="csc-content">
                <div className="csc-header">
                  <span className="csc-pos">P{standing.position}</span>
                  <span className="csc-pts">{standing.points} PTS</span>
                </div>
                
                <h2 className="csc-team-name">{team.name}</h2>
                
                <div className="csc-meta">
                  <span className="csc-nat">{team.nationality}</span>
                  <span className="csc-wins">{standing.wins} WINS</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Constructors;
