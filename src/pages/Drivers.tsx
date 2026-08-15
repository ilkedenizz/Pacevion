import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import ErrorState from '../components/ui/ErrorState';
import { getDriverVisual } from '../data/assets';
import './Drivers.css';

const Drivers: React.FC = () => {
  const navigate = useNavigate();
  const { data: standings, isLoading, isError, refetch } = useDriverStandings();

  useSEO({
    title: 'F1 Drivers Directory | Pacevion',
    description: 'Formula 1 2026 sezonu resmi sürücü kadrosu, pilot numaraları ve pilot bilgileri.',
    canonicalPath: '/drivers'
  });

  if (isLoading) {
    return (
      <div className="drv-page loading">
        <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '20px' }} />
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton" style={{ height: '250px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !standings || standings.length === 0) {
    return (
      <div className="drv-page error">
        <ErrorState message="Unable to load drivers list." onRetry={refetch} />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const top3 = standings.slice(0, 3) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rest = standings.slice(3) as any[];

  const goToDriver = (id: string) => navigate(`/drivers/${id}`);
  const handleKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDriver(id); }
  };

  return (
    <div className="drv-page">
      {/* ── PAGE HEADER ── */}
      <header className="drv-header">
        <div className="drv-header-left">
          <span className="drv-header-tag">PACEVION // F1 2026</span>
          <h1 className="drv-header-title">
            <span className="drv-title-thin">DRIVER</span>
            <span className="drv-title-bold">GRID</span>
          </h1>
        </div>
        <div className="drv-header-right">
          <div className="drv-header-stat">
            <span className="drv-stat-val">{standings.length}</span>
            <span className="drv-stat-lbl">DRIVERS</span>
          </div>
          <div className="drv-header-stat">
            <span className="drv-stat-val">10</span>
            <span className="drv-stat-lbl">TEAMS</span>
          </div>
        </div>
        <div className="drv-header-line" />
      </header>

      {/* ── TOP 3 PODIUM ── */}
      <section className="drv-podium">
        {top3.map((standing, index) => {
          const d = standing.Driver;
          const c = standing.Constructors[0];
          const vis = getDriverVisual(d.driverId, c?.constructorId);
          const podiumClass = index === 0 ? 'drv-podium-p1' : index === 1 ? 'drv-podium-p2' : 'drv-podium-p3';

          return (
            <div
              key={d.driverId}
              className={`drv-card drv-card--featured ${podiumClass}`}
              onClick={() => goToDriver(d.driverId)}
              role="button" tabIndex={0}
              onKeyDown={(e) => handleKey(e, d.driverId)}
            >
              {/* Background number */}
              <span className="drv-card__bg-num">{d.permanentNumber || ''}</span>

              {/* Photo */}
              <div className="drv-card__photo">
                <img src={vis} alt={`${d.givenName} ${d.familyName}`} loading="eager" fetchpriority="high" />
                <div className="drv-card__photo-gradient" />
              </div>

              {/* Content */}
              <div className="drv-card__body">
                <div className="drv-card__pos-row">
                  <span className="drv-card__pos">P{standing.position}</span>
                  <span className="drv-card__featured-tag">FEATURED</span>
                </div>
                <div className="drv-card__name">
                  <span className="drv-card__given">{d.givenName}</span>
                  <span className="drv-card__family">{d.familyName}</span>
                </div>
                <div className="drv-card__stats">
                  <div className="drv-card__stat-main">
                    <span className="drv-card__stat-num">{standing.points}</span>
                    <span className="drv-card__stat-unit">PTS</span>
                  </div>
                  <span className="drv-card__wins">{standing.wins} WINS</span>
                </div>
                <div className="drv-card__team-strip">
                  <span className="drv-card__team-name">{c?.name || 'Unknown'}</span>
                  <span className="drv-card__driver-num">#{d.permanentNumber || '--'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── REST OF GRID ── */}
      <section className="drv-grid">
        {rest.map((standing) => {
          const d = standing.Driver;
          const c = standing.Constructors[0];
          const vis = getDriverVisual(d.driverId, c?.constructorId);

          return (
            <div
              key={d.driverId}
              className="drv-card drv-card--compact"
              onClick={() => goToDriver(d.driverId)}
              role="button" tabIndex={0}
              onKeyDown={(e) => handleKey(e, d.driverId)}
            >
              <span className="drv-card__bg-num drv-card__bg-num--sm">{d.permanentNumber || ''}</span>

              <div className="drv-card__photo drv-card__photo--sm">
                <img src={vis} alt={`${d.givenName} ${d.familyName}`} loading="lazy" decoding="async" />
                <div className="drv-card__photo-gradient" />
              </div>

              <div className="drv-card__body">
                <div className="drv-card__pos-row">
                  <span className="drv-card__pos">P{standing.position}</span>
                  <span className="drv-card__pts-compact">{standing.points} PTS</span>
                </div>
                <div className="drv-card__name">
                  <span className="drv-card__given">{d.givenName}</span>
                  <span className="drv-card__family">{d.familyName}</span>
                </div>
                <div className="drv-card__team-strip">
                  <span className="drv-card__team-name">{c?.name || 'Unknown'}</span>
                  <span className="drv-card__driver-num">#{d.permanentNumber || '--'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Drivers;
