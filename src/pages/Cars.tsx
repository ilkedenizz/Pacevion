import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConstructorStandings, useDriverStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import { getTeamVisual } from '../data/assets';
import { getTeamDetails } from '../data/teamDetails';
import ErrorState from '../components/ui/ErrorState';
import { Settings, Zap, Users } from 'lucide-react';
import './Cars.css';

const Cars: React.FC = () => {
  const navigate = useNavigate();
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
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '500px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !constructors || constructors.length === 0) {
    return (
      <div className="cars-gallery-page error">
        <ErrorState message="Unable to load F1 Cars." onRetry={cRefetch} />
      </div>
    );
  }

  const handleDriverClick = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    navigate(`/drivers/${id}`);
  };

  return (
    <div className="cars-gallery-page">
      <header className="cg-header">
        <div className="cg-header-top">
          <span className="cg-tag">TECHNICAL CENTER</span>
        </div>
        <h1 className="cg-title">THE 2026 F1 CARS</h1>
        <p className="cg-desc">A deep dive into the engineering marvels of the current season.</p>
      </header>

      <div className="cars-gallery-grid">
        {constructors.map((standing, index) => {
          const team = standing.Constructor;
          const details = getTeamDetails(team.constructorId);
          const tDrivers = teamDriversMap[team.constructorId] || [];
          const visual = getTeamVisual(team.constructorId);
          const isEager = index < 2;

          return (
            <div key={team.constructorId} className="car-gallery-card">
              <div className="cgc-top-stripe" style={{ backgroundColor: details.color }}></div>
              
              <div className="cgc-image-container">
                <div className="cgc-bg-pattern"></div>
                {visual ? (
                  <img 
                    src={visual} 
                    alt={`${team.name} ${details.chassis}`} 
                    className="cgc-car-img"
                    loading={isEager ? 'eager' : 'lazy'}
                    fetchPriority={isEager ? 'high' : 'auto'}
                    decoding={isEager ? 'auto' : 'async'}
                  />
                ) : (
                  <div className="cgc-car-unavailable">
                    <span className="unavailable-text">CAR VISUAL UNAVAILABLE</span>
                    <span className="unavailable-team">{team.name.toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="cgc-content">
                <div className="cgc-title-block">
                  <span className="cgc-team">{team.name}</span>
                  <h2 className="cgc-chassis">{details.chassis}</h2>
                </div>

                <div className="cgc-specs-grid">
                  <div className="cgc-spec-item">
                    <Settings size={16} className="spec-icon" style={{ color: details.color }} />
                    <div className="spec-text">
                      <span className="spec-lbl">CHASSIS</span>
                      <span className="spec-val">{details.chassis}</span>
                    </div>
                  </div>
                  <div className="cgc-spec-item">
                    <Zap size={16} className="spec-icon" style={{ color: details.color }} />
                    <div className="spec-text">
                      <span className="spec-lbl">POWER UNIT</span>
                      <span className="spec-val">{details.powerUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="cgc-drivers-block">
                  <div className="cgc-d-header">
                    <Users size={16} /> <span>DRIVER PAIRING</span>
                  </div>
                  <div className="cgc-d-list">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {tDrivers.map((d: any) => (
                      <button
                        key={d.driverId}
                        className="cgc-driver-pill"
                        onClick={(e) => handleDriverClick(e, d.driverId)}
                      >
                        <span className="cgc-d-num" style={{ color: details.color }}>
                          {d.permanentNumber || '—'}
                        </span>
                        <span className="cgc-d-name">{d.givenName} {d.familyName}</span>
                      </button>
                    ))}
                  </div>
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
