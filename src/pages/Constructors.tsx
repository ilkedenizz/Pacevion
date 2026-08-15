import React from 'react';
import { useConstructorStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
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

      <div className="constructors-board-wrapper">
        <div className="cb-table-header">
          <div className="cb-col-pos">POS</div>
          <div className="cb-col-team">CONSTRUCTOR</div>
          <div className="cb-col-nat">NATIONALITY</div>
          <div className="cb-col-wins text-right">WINS</div>
          <div className="cb-col-pts text-right">PTS</div>
        </div>

        <div className="cb-table-body">
          {standings.map((standing) => {
            const team = standing.Constructor;
            const isLeader = standing.position === '1';

            return (
              <div 
                key={team.constructorId} 
                className={`cb-row ${isLeader ? 'leader-row' : ''}`}
              >
                <div className="cb-col-pos">
                  <span className="cb-pos-badge">{standing.position}</span>
                </div>
                <div className="cb-col-team">
                  <span className="cb-team-name">{team.name}</span>
                </div>
                <div className="cb-col-nat">
                  <span className="cb-nat-text">{team.nationality}</span>
                </div>
                <div className="cb-col-wins text-right">
                  <span className="cb-stat">{standing.wins}</span>
                </div>
                <div className="cb-col-pts text-right">
                  <span className="cb-pts-val">{standing.points}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Constructors;
