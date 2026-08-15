import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConstructorStandings, useDriverStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import { getTeamVisual } from '../data/assets';
import ErrorState from '../components/ui/ErrorState';
import './Cars.css';

const Cars: React.FC = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: constructors, isLoading: cLoading, isError: cError, refetch: cRefetch } = useConstructorStandings() as { data: any[], isLoading: boolean, isError: boolean, refetch: () => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: drivers, isLoading: dLoading } = useDriverStandings() as { data: any[], isLoading: boolean };

  useSEO({
    title: 'F1 Cars & Constructor Grid | Pacevion',
    description: 'Explore the machines defining the 2026 Formula 1 season. Team technical details and real F1 car photography.',
    canonicalPath: '/cars'
  });

  const isLoading = cLoading || dLoading;
  const isError = cError;

  // Map drivers by constructorId
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
      <div className="cars-page loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '400px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !constructors || constructors.length === 0) {
    return (
      <div className="cars-page error">
        <ErrorState message="Unable to load F1 Cars and Teams." onRetry={cRefetch} />
      </div>
    );
  }

  const handleDriverClick = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    navigate(`/drivers/${id}`);
  };

  return (
    <div className="cars-page">
      {/* ── PAGE HEADER ── */}
      <header className="cars-header">
        <div className="cars-header-left">
          <span className="cars-header-tag">2026 F1 MACHINES</span>
          <h1 className="cars-header-title">
            <span className="cars-title-thin">THE GRID</span>
            <span className="cars-title-bold">CONSTRUCTORS</span>
          </h1>
          <p className="cars-header-desc">Explore the machines defining the 2026 Formula 1 season.</p>
        </div>
        <div className="cars-header-right">
          <div className="cars-header-stat">
            <span className="cars-stat-val">{constructors.length}</span>
            <span className="cars-stat-lbl">TEAMS</span>
          </div>
          <div className="cars-header-stat">
            <span className="cars-stat-val">{drivers?.length || 20}</span>
            <span className="cars-stat-lbl">DRIVERS</span>
          </div>
          <div className="cars-header-stat">
            <span className="cars-stat-val">2026</span>
            <span className="cars-stat-lbl">SEASON</span>
          </div>
        </div>
        <div className="cars-header-line" />
      </header>

      {/* ── CARS GRID ── */}
      <div className="cars-grid">
        {constructors.map((standing, index) => {
          const team = standing.Constructor;
          const pos = standing.position;
          const pts = standing.points;
          const teamDrivers = teamDriversMap[team.constructorId] || [];
          const visual = getTeamVisual(team.constructorId);
          
          // Eager load first 2
          const isEager = index < 2;

          return (
            <div key={team.constructorId} className="car-card">
              <div className="car-card-top">
                <span className="car-card-pos">{pos.padStart(2, '0')}</span>
              </div>
              
              <div className="car-card-visual-wrapper">
                <div className="car-card-bg-gradient" />
                <div className="car-card-spotlight" />
                <img 
                  src={visual} 
                  alt={`${team.name} F1 Car`} 
                  className="car-card-img"
                  loading={isEager ? 'eager' : 'lazy'}
                  fetchPriority={isEager ? 'high' : 'auto'}
                  decoding={isEager ? 'auto' : 'async'}
                />
              </div>

              <div className="car-card-content">
                <div className="car-card-header">
                  <h2 className="car-team-name">{team.name}</h2>
                  <span className="car-team-nat">{team.nationality}</span>
                </div>

                <div className="car-card-drivers">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {teamDrivers.map((d: any) => (
                    <button
                      key={d.driverId}
                      className="car-driver-btn"
                      onClick={(e) => handleDriverClick(e, d.driverId)}
                    >
                      {d.givenName} {d.familyName}
                    </button>
                  ))}
                </div>
                
                <div className="car-card-stats">
                  <div className="car-stat">
                    <span className="car-stat-val">{pts}</span>
                    <span className="car-stat-lbl">PTS</span>
                  </div>
                  <div className="car-stat">
                    <span className="car-stat-val">{standing.wins}</span>
                    <span className="car-stat-lbl">WINS</span>
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
