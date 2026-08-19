import React from 'react';
import { useDriverStandings } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './LiveFeed.css';

export const LiveFeed: React.FC = () => {
  const { data: standings, isLoading } = useDriverStandings('2026');

  if (isLoading || !standings) return <div className="skeleton" style={{ height: '100vh' }} />;

  const generateGap = (idx: number) => {
    if (idx === 0) return '—';
    return `+${(idx * 0.142 + 0.05).toFixed(3)}`;
  };
  
  const generateTime = (idx: number) => {
    const base = 78.241;
    const time = base + (idx * 0.142 + 0.05);
    const m = Math.floor(time / 60);
    const s = (time % 60).toFixed(3);
    return `${m}:${s.padStart(6, '0')}`;
  };

  return (
    <div className="live-page fade-in">
      <header className="live-header">
        <div className="lh-top">
          <div className="lh-badge">
            <div className="status-dot pulse" style={{ background: '#E10600' }} />
            <span className="font-mono">LIVE</span>
          </div>
          <span className="font-mono editorial-num" style={{ fontSize: '24px' }}>Q3</span>
        </div>
        <h1 className="font-heading editorial-headline">QUALIFYING</h1>
      </header>

      <div className="live-telemetry">
        <div className="lt-box">
          <span className="editorial-label">TRACK STATUS</span>
          <span className="font-heading editorial-headline" style={{ color: '#00FF66' }}>CLEAR</span>
        </div>
        <div className="lt-box">
          <span className="editorial-label">TRACK TEMP</span>
          <span className="font-mono lt-val">42.5°C</span>
        </div>
        <div className="lt-box">
          <span className="editorial-label">AIR TEMP</span>
          <span className="font-mono lt-val">28.1°C</span>
        </div>
      </div>

      <div className="live-timing-board">
        <div className="ltb-header editorial-label">
          <span className="ltb-pos">P</span>
          <span className="ltb-driver">DRIVER</span>
          <span className="ltb-time">TIME</span>
          <span className="ltb-gap">GAP</span>
        </div>

        {standings.slice(0, 10).map((s, i) => (
          <div key={s.Driver.driverId} className="ltb-row">
            <span className="ltb-pos font-mono">{i + 1}</span>
            <div className="ltb-driver-col">
              <div className="ltb-color" style={{ background: getTeamDetails(s.Constructors[0]?.constructorId).color }} />
              <img src={getDriverVisual(s.Driver.driverId, 'portrait')} className="ltb-avatar" alt="driver" />
              <span className="font-heading editorial-headline">{s.Driver.familyName}</span>
            </div>
            <span className="ltb-time font-mono" style={{ color: i === 0 ? '#C98EE8' : '#fff' }}>{generateTime(i)}</span>
            <span className="ltb-gap font-mono">{generateGap(i)}</span>
          </div>
        ))}
      </div>

      <div className="live-weather">
        <div className="lw-item">
          <span className="editorial-label">WIND</span>
          <span className="font-mono">12 KM/H NE</span>
        </div>
        <div className="lw-item">
          <span className="editorial-label">HUMIDITY</span>
          <span className="font-mono">45%</span>
        </div>
        <div className="lw-item">
          <span className="editorial-label">RAIN</span>
          <span className="font-mono">0%</span>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
