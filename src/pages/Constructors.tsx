import React, { useMemo } from 'react';
import { useConstructorStandings, useDriverStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import { getTeamVisual } from '../data/assets';
import { getTeamDetails } from '../data/teamDetails';
import ErrorState from '../components/ui/ErrorState';
import './Constructors.css';

// Simple SVG generator for Team Logo placeholder
const TeamLogoPlaceholder = ({ color, initials }: { color: string, initials: string }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" className="team-logo-placeholder">
    <rect width="48" height="48" rx="8" fill="var(--color-surface)" />
    <path d="M 0 24 Q 24 24 24 0 L 24 48 Q 24 24 48 24 L 48 48 L 0 48 Z" fill={color} opacity="0.1" />
    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize="18" fontWeight="800" letterSpacing="1">
      {initials}
    </text>
    <rect width="48" height="48" rx="8" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
  </svg>
);

const Constructors: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: standings, isLoading: cLoading, isError: cError, refetch: cRefetch } = useConstructorStandings() as { data: any[], isLoading: boolean, isError: boolean, refetch: () => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: drivers, isLoading: dLoading } = useDriverStandings() as { data: any[], isLoading: boolean };

  useSEO({
    title: 'F1 Constructors & Teams Directory | Pacevion',
    description: 'Formula 1 2026 sezonu aktif yarışan markalar, takım merkezleri ve detaylı bilgiler.',
    canonicalPath: '/constructors'
  });

  const isLoading = cLoading || dLoading;

  const teamDriversMap = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map: Record<string, any[]> = {};
    if (drivers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      drivers.forEach((standing: any) => {
        const cId = standing.Constructors[0]?.constructorId;
        if (cId) {
          if (!map[cId]) map[cId] = [];
          map[cId].push(standing.Driver);
        }
      });
    }
    return map;
  }, [drivers]);

  if (isLoading) {
    return (
      <div className="constructors-board-container loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
      </div>
    );
  }

  if (cError || !standings || standings.length === 0) {
    return (
      <div className="constructors-board-container error">
        <ErrorState message="Unable to load constructors list." onRetry={cRefetch} />
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
          const details = getTeamDetails(team.constructorId);
          const tDrivers = teamDriversMap[team.constructorId] || [];
          
          const getInitials = (name: string) => {
            const parts = name.split(' ');
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
          };

          return (
            <div 
              key={team.constructorId} 
              className={`constructor-showcase-card ${isLeader ? 'leader-card' : ''}`}
              style={{ '--team-accent': details.color } as React.CSSProperties}
            >
              <div className="csc-content-left">
                <div className="csc-brand-header">
                  <TeamLogoPlaceholder color={details.color} initials={getInitials(team.name)} />
                  <div className="csc-brand-names">
                    <h2 className="csc-team-name">{team.name}</h2>
                    <span className="csc-full-name">{details.fullName}</span>
                  </div>
                </div>

                <div className="csc-performance-row">
                  <div className="csc-perf-stat">
                    <span className="perf-val">P{standing.position}</span>
                    <span className="perf-lbl">CHAMPIONSHIP</span>
                  </div>
                  <div className="csc-perf-stat">
                    <span className="perf-val">{standing.points}</span>
                    <span className="perf-lbl">POINTS</span>
                  </div>
                  <div className="csc-perf-stat">
                    <span className="perf-val">{standing.wins}</span>
                    <span className="perf-lbl">WINS</span>
                  </div>
                </div>

                <div className="csc-drivers-list">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {tDrivers.map((d: any) => (
                    <div key={d.driverId} className="csc-driver-item">
                      <span className="csc-d-num" style={{ color: details.color }}>{d.permanentNumber || '—'}</span>
                      <span className="csc-d-name">{d.givenName} {d.familyName}</span>
                    </div>
                  ))}
                </div>

                <p className="csc-team-info">{details.description}</p>
              </div>

              <div className="csc-visual-right">
                <div className="csc-bg-glow" style={{ backgroundColor: details.color }}></div>
                {teamVisual ? (
                  <img src={teamVisual} alt={`${team.name} F1 Car preview`} className="csc-car-preview" loading="lazy" />
                ) : (
                  <div className="csc-car-unavailable">
                    <span className="unavailable-text">CAR VISUAL UNAVAILABLE</span>
                    <span className="unavailable-team">{team.name.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Constructors;
