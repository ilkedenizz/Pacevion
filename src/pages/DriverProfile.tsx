import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy } from 'lucide-react';
import { useDriverStandings } from '../hooks/useF1Data';
import { useSEO } from '../hooks/useSEO';
import { getDriverVisual } from '../data/assets';
import ErrorState from '../components/ui/ErrorState';
import './Drivers.css';

const DriverProfile: React.FC = () => {
  const { driverId = '' } = useParams<{ driverId: string }>();
  const navigate = useNavigate();

  const { data: standings, isLoading, isError, refetch } = useDriverStandings();

  const driverData = useMemo(() => {
    if (!standings || standings.length === 0) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return standings.find((s: any) => s.Driver.driverId === driverId) || null;
  }, [standings, driverId]);

  const formattedDriverName = useMemo(() => {
    return driverId
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }, [driverId]);

  useSEO({
    title: `${formattedDriverName} — F1 Driver Profile | Pacevion`,
    description: `Formula 1 pilotu ${formattedDriverName} hakkında detaylar, kariyer istatistikleri ve güncel sezon puan durumları.`,
    canonicalPath: `/drivers/${driverId}`
  });

  if (isLoading) {
    return (
      <div className="driver-grid-container loading">
        <div className="skeleton" style={{ width: '100%', height: '300px' }} />
      </div>
    );
  }

  if (isError || !driverData) {
    return (
      <div className="driver-grid-container error">
        <ErrorState message="Driver could not be loaded." onRetry={refetch} />
        <button className="nav-btn" onClick={() => navigate('/drivers')} style={{ marginTop: 'var(--space-4)' }}>
          <ChevronLeft size={14} /> Back to Drivers
        </button>
      </div>
    );
  }

  const driver = driverData.Driver;
  const constructor = driverData.Constructors[0];
  const driverVisual = getDriverVisual(driver.driverId, constructor.constructorId);

  return (
    <div className="driver-grid-container">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <button className="rc-nav-btn" onClick={() => navigate('/drivers')}>
          <ChevronLeft size={14} /> <span>BACK TO DRIVER GRID</span>
        </button>
      </div>

      <div className="driver-profile-hero">
        <div className="dp-hero-image">
          <img src={driverVisual} alt={`${driver.givenName} ${driver.familyName}`} />
        </div>
        <div className="dp-hero-bg">
          <span className="dp-hero-bg-number">{driver.permanentNumber || ''}</span>
        </div>
        
        <div className="dp-hero-content">
          <div className="dp-meta">
            <span className="dp-team-badge">{constructor?.name || 'Unknown'}</span>
            <span className="dp-nat">{driver.nationality}</span>
          </div>
          <h1 className="dp-name">
            <span className="dp-firstname">{driver.givenName}</span>
            <span className="dp-lastname">{driver.familyName}</span>
          </h1>
        </div>
        
        <div className="dp-stats-box">
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">POSITION</span>
            <span className="dp-stat-val text-accent">P{driverData.position}</span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">POINTS</span>
            <span className="dp-stat-val">{driverData.points}</span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">WINS</span>
            <span className="dp-stat-val"><Trophy size={16} className="gold-trophy" style={{ marginRight: '4px' }}/> {driverData.wins}</span>
          </div>
          <div className="dp-stat-item">
            <span className="dp-stat-lbl">CAR NUMBER</span>
            <span className="dp-stat-val">{driver.permanentNumber || '--'}</span>
          </div>
        </div>
      </div>
      
      <div className="driver-profile-details">
        <h2 className="section-block-title font-heading" style={{ marginBottom: 'var(--space-4)' }}>DRIVER BIO</h2>
        <div className="table-overflow-wrapper" style={{ maxWidth: '600px' }}>
          <table className="classification-table">
            <tbody>
              <tr>
                <td className="font-heading" style={{ width: '150px', color: 'var(--color-text-secondary)' }}>FULL NAME</td>
                <td className="font-bold">{driver.givenName} {driver.familyName}</td>
              </tr>
              <tr>
                <td className="font-heading" style={{ color: 'var(--color-text-secondary)' }}>DOB</td>
                <td className="font-mono">{driver.dateOfBirth}</td>
              </tr>
              <tr>
                <td className="font-heading" style={{ color: 'var(--color-text-secondary)' }}>NATIONALITY</td>
                <td>{driver.nationality}</td>
              </tr>
              <tr>
                <td className="font-heading" style={{ color: 'var(--color-text-secondary)' }}>TEAM</td>
                <td>{constructor?.name || 'Unknown'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
