import React from 'react';
import { getDriverVisual } from '../data/assets';
import './LiveFeed.css';

export const LiveFeed: React.FC = () => {
  const mockTiming = [
    { pos: '1', id: 'norris', name: 'NORRIS', teamColor: '#FF8000', time: '1:19.234', gap: 'LEADER' },
    { pos: '2', id: 'verstappen', name: 'VERSTAPPEN', teamColor: '#3671C6', time: '1:19.401', gap: '+0.167' },
    { pos: '3', id: 'leclerc', name: 'LECLERC', teamColor: '#E80020', time: '1:19.522', gap: '+0.288' },
    { pos: '4', id: 'sainz', name: 'SAINZ', teamColor: '#E80020', time: '1:19.680', gap: '+0.446' },
    { pos: '5', id: 'hamilton', name: 'HAMILTON', teamColor: '#E10600', time: '1:19.811', gap: '+0.577' },
    { pos: '6', id: 'piastri', name: 'PIASTRI', teamColor: '#FF8000', time: '1:19.882', gap: '+0.648' },
  ];

  return (
    <div className="live-page fade-in">
      
      <div className="live-header">
        <div className="lh-status">
          <div className="lh-dot" />
          <span className="lh-text font-heading">LIVE</span>
        </div>
        <div className="lh-session font-heading">QUALIFYING</div>
      </div>

      <div className="live-tech-grid font-mono">
        <div className="lt-box">
          <span className="lt-lbl">CURRENT LAP</span>
          <span className="lt-val font-heading">Q3</span>
        </div>
        <div className="lt-box">
          <span className="lt-lbl">TRACK STATUS</span>
          <span className="lt-val font-heading text-green">GREEN</span>
        </div>
        <div className="lt-box">
          <span className="lt-lbl">AIR TEMP</span>
          <span className="lt-val font-heading">24°C</span>
        </div>
        <div className="lt-box">
          <span className="lt-lbl">TRACK TEMP</span>
          <span className="lt-val font-heading">38°C</span>
        </div>
      </div>

      <div className="timing-board-container">
        <div className="tb-col-header font-mono">
          <span className="tc-p">P</span>
          <span className="tc-driver">DRIVER</span>
          <span className="tc-time">TIME</span>
          <span className="tc-gap">GAP</span>
        </div>

        <div className="tb-rows">
          {mockTiming.map((t) => {
            const visual = getDriverVisual(t.id);
            return (
              <div key={t.pos} className="tb-row">
                <span className="tr-pos font-mono">{t.pos.padStart(2, '0')}</span>
                
                <div className="tr-driver">
                  <div className="tr-team-accent" style={{ background: t.teamColor }} />
                  <div className="tr-avatar">
                    {visual ? <img src={visual} alt={t.name} className="tr-avatar-img" /> : null}
                  </div>
                  <span className="tr-name font-heading">{t.name}</span>
                </div>

                <span className="tr-time font-mono">{t.time}</span>
                <span className="tr-gap font-mono">{t.gap}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default LiveFeed;
