import React, { useMemo } from 'react';
import { useConstructorStandings, useDriverStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import { getTeamVisual } from '../data/assets';
import { getTeamDetails } from '../data/teamDetails';
import ErrorState from '../components/ui/ErrorState';
import './Cars.css';

const Cars: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: constructors, isLoading: cLoading, isError: cError, refetch: cRefetch } = useConstructorStandings() as { data: any[], isLoading: boolean, isError: boolean, refetch: () => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: drivers, isLoading: dLoading } = useDriverStandings() as { data: any[], isLoading: boolean };

  useSEO({
    title: 'F1 Cars & Technical Gallery | Pacevion',
    description: 'Explore the machines defining the 2026 Formula 1 season. Technical details and real F1 car photography.',
    canonicalPath: '/cars'
  });

  const isLoading = cLoading || dLoading;
  const isError = cError;

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
      <div className="cars-gallery-page loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px', margin: '0 auto' }} />
        <div className="skeleton-grid" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton" style={{ height: '450px', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !constructors || constructors.length === 0) {
    return (
      <div className="cars-gallery-page error">
        <ErrorState message="Unable to load 2026 F1 Cars Gallery." onRetry={cRefetch} />
      </div>
    );
  }

  return (
    <div className="cars-gallery-page">
      <header className="cg-header">
        <div className="cg-header-top">
          <span className="cg-tag">2026 SEASON // CAR GALLERY</span>
        </div>
        <h1 className="cg-title">THE MACHINES OF FORMULA 1</h1>
        <p className="cg-desc">
          2026 sezonundaki tüm takımları, araçlarını, sürücülerini ve constructor performanslarını tek yerde incele.
        </p>
      </header>

      <div className="cars-gallery-grid">
        {constructors.map((standing, index) => {
          const team = standing.Constructor;
          const details = getTeamDetails(team.constructorId);
          const tDrivers = teamDriversMap[team.constructorId] || [];
          const visual = getTeamVisual(team.constructorId);
          const isEager = index < 4;
          
          return (
            <div 
              key={team.constructorId} 
              className="cg-card"
              style={{ '--team-color': details.color } as React.CSSProperties}
            >
              <div className="cg-card-header">
                <div className="cg-team-info">
                  <h2 className="cg-team-name">{team.name}</h2>
                  <span className="cg-chassis">{details.chassis}</span>
                </div>
                <div className="cg-perf-badge">
                  <span className="cg-points">{standing.points}</span>
                  <span className="cg-points-lbl">PTS</span>
                </div>
              </div>
              
              <div className="cg-car-visual">
                {visual ? (
                  <img 
                    src={visual} 
                    alt={`${team.name} ${details.chassis} F1 Car`} 
                    className="cg-car-img"
                    loading={isEager ? 'eager' : 'lazy'}
                    fetchPriority={isEager ? 'high' : 'auto'}
                    decoding={isEager ? 'auto' : 'async'}
                  />
                ) : (
                  <div className="cg-car-unavailable">
                    <span className="unavailable-text">CAR VISUAL UNAVAILABLE</span>
                  </div>
                )}
              </div>

              <div className="cg-card-footer">
                <div className="cg-drivers">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {tDrivers.map((d: any) => (
                    <div key={d.driverId} className="cg-driver-row">
                      <span className="cg-driver-name">{d.givenName} {d.familyName}</span>
                      <span className="cg-driver-num">#{d.permanentNumber || '—'}</span>
                    </div>
                  ))}
                </div>
                <div className="cg-status-bar">
                  <span className="cg-status-lbl">CONSTRUCTOR CHAMPIONSHIP</span>
                  <span className="cg-status-val">P{standing.position}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cars;
