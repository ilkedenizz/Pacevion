import React from 'react';
import { getDriverVisual } from '../data/assets';
import './LiveFeed.css';

export const LiveFeed: React.FC = () => {
  const mockTiming = [
    { pos: '1', id: 'norris', name: 'NORRIS', teamColor: '#FF8000', time: '1:19.234', gap: '—' },
    { pos: '2', id: 'verstappen', name: 'VERSTAPPEN', teamColor: '#3671C6', time: '1:19.401', gap: '+0.167' },
    { pos: '3', id: 'leclerc', name: 'LECLERC', teamColor: '#E80020', time: '1:19.522', gap: '+0.288' },
    { pos: '4', id: 'sainz', name: 'SAINZ', teamColor: '#E80020', time: '1:19.680', gap: '+0.446' },
    { pos: '5', id: 'hamilton', name: 'HAMILTON', teamColor: '#E10600', time: '1:19.811', gap: '+0.577' },
    { pos: '6', id: 'piastri', name: 'PIASTRI', teamColor: '#FF8000', time: '1:19.882', gap: '+0.648' },
  ];

  return (
    <div className="live-page fade-in">
      
      <div className="live-header-box">
        <div className="lhb-status">
          <div className="lhb-dot" />
          <span className="font-mono editorial-label" style={{ color: 'var(--color-accent)' }}>LIVE</span>
        </div>
        <h1 className="lhb-title font-heading editorial-headline">
          QUALIFYING <br/><span style={{ fontSize: '20px', color: 'var(--color-text-secondary)' }}>Q3</span>
        </h1>
      </div>

      <div className="live-tech-grid">
        <div className="lt-cell">
          <span className="editorial-label">CURRENT LAP</span>
          <span className="lt-cell-val font-mono">18 / 20</span>
        </div>
        <div className="lt-cell">
          <span className="editorial-label">TRACK STATUS</span>
          <span className="lt-cell-val font-mono" style={{ color: '#00FF66' }}>GREEN</span>
        </div>
      </div>

      <div className="live-timing-board">
        <div className="ltb-header editorial-label">
          <span className="ltbh-pos">P</span>
          <span className="ltbh-driver">DRIVER</span>
          <span className="ltbh-time">TIME</span>
          <span className="ltbh-gap">GAP</span>
          <span className="ltbh-sec">S1</span>
          <span className="ltbh-sec">S2</span>
          <span className="ltbh-sec">S3</span>
        </div>

        <div className="ltb-body">
          {mockTiming.map((t, idx) => {
            const visual = getDriverVisual(t.id);
            const isLeader = idx === 0;
            return (
              <div key={t.pos} className={`ltb-row ${isLeader ? 'ltb-leader' : ''}`}>
                <span className="ltr-pos font-mono">{t.pos.padStart(2, '0')}</span>
                
                <div className="ltr-driver">
                  <div className="ltr-accent" style={{ background: t.teamColor }} />
                  <div className="ltr-avatar">
                    {visual && <img src={visual} alt={t.name} className="ltr-img" />}
                  </div>
                  <span className="ltr-name font-heading editorial-headline">{t.name}</span>
                </div>

                <span className="ltr-time font-mono" style={{ color: isLeader ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  {t.time}
                </span>
                <span className="ltr-gap font-mono">{t.gap}</span>
                
                <div className="ltr-sectors">
                  <div className="ltr-sec s-purple" />
                  <div className="ltr-sec s-green" />
                  <div className="ltr-sec s-yellow" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="live-weather">
        <div className="lw-box">
          <span className="editorial-label">TRACK TEMP</span>
          <span className="lw-val font-mono editorial-num">38°C</span>
        </div>
        <div className="lw-box">
          <span className="editorial-label">AIR</span>
          <span className="lw-val font-mono editorial-num">24°C</span>
        </div>
        <div className="lw-box">
          <span className="editorial-label">WIND</span>
          <span className="lw-val font-mono editorial-num">12 <span style={{ fontSize: '10px' }}>KM/H</span></span>
        </div>
        <div className="lw-box">
          <span className="editorial-label">HUMIDITY</span>
          <span className="lw-val font-mono editorial-num">61%</span>
        </div>
      </div>

    </div>
  );
};

export default LiveFeed;
