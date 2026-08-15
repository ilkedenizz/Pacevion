import React, { useState } from 'react';
import './F1CarDiagram.css';

type TechGroup = 'AERO' | 'POWER' | 'CHASSIS';

interface CarComponent {
  id: string;
  num: string;
  name: string;
  desc: string;
  role: string;
  group: TechGroup;
  cx: number;
  cy: number;
  tx: number;
  ty: number;
  pulse?: boolean;
}

const componentsInfo: CarComponent[] = [
  { id: 'front-wing', num: '01', name: 'FRONT WING', desc: 'Generates downforce and directs airflow around the front tyres and under the floor.', role: 'AERODYNAMICS', group: 'AERO', cx: 250, cy: 90, tx: 100, ty: 70, pulse: true },
  { id: 'front-tyres', num: '02', name: 'FRONT TYRES', desc: '18-inch Pirelli tyres providing mechanical grip and steering input.', role: 'MECHANICAL GRIP', group: 'CHASSIS', cx: 160, cy: 200, tx: 70, ty: 180 },
  { id: 'nose', num: '03', name: 'NOSE', desc: 'Structural crash structure that channels air to the floor and sidepods.', role: 'STRUCTURE / AERO', group: 'CHASSIS', cx: 250, cy: 160, tx: 380, ty: 140 },
  { id: 'suspension', num: '04', name: 'FRONT SUSPENSION', desc: 'Connects wheels to chassis and manages weight transfer during cornering and braking.', role: 'DYNAMICS', group: 'CHASSIS', cx: 210, cy: 210, tx: 400, ty: 220 },
  { id: 'monocoque', num: '05', name: 'MONOCOQUE', desc: 'The survival cell protecting the driver, housing the cockpit and fuel cell.', role: 'SURVIVAL CELL', group: 'CHASSIS', cx: 250, cy: 380, tx: 100, ty: 350 },
  { id: 'halo', num: '06', name: 'HALO', desc: 'Titanium structure protecting the driver\'s head from flying debris.', role: 'SAFETY', group: 'CHASSIS', cx: 250, cy: 330, tx: 380, ty: 310, pulse: true },
  { id: 'sidepods', num: '07', name: 'SIDE PODS', desc: 'Housings for the radiators to cool the power unit, shaped to manage airflow.', role: 'COOLING / AERO', group: 'AERO', cx: 170, cy: 450, tx: 70, ty: 470, pulse: true },
  { id: 'floor', num: '08', name: 'FLOOR', desc: 'Creates the majority of the car\'s downforce through ground effect venturi tunnels.', role: 'GROUND EFFECT', group: 'AERO', cx: 150, cy: 580, tx: 70, ty: 600 },
  { id: 'rear-tyres', num: '09', name: 'REAR TYRES', desc: 'Wider than front tyres, responsible for putting the hybrid power unit\'s torque to the ground.', role: 'TRACTION', group: 'POWER', cx: 160, cy: 750, tx: 70, ty: 730 },
  { id: 'power-unit', num: '10', name: 'POWER UNIT', desc: 'Complex 1.6L V6 hybrid engine combining internal combustion and electrical energy.', role: 'PROPULSION', group: 'POWER', cx: 250, cy: 600, tx: 380, ty: 580, pulse: true },
  { id: 'rear-wing', num: '11', name: 'REAR WING', desc: 'Produces rear downforce and houses the Drag Reduction System (DRS) flap.', role: 'AERODYNAMICS', group: 'AERO', cx: 250, cy: 860, tx: 380, ty: 840, pulse: true },
  { id: 'diffuser', num: '12', name: 'DIFFUSER', desc: 'Expands air exiting from under the floor to increase ground effect downforce.', role: 'GROUND EFFECT', group: 'AERO', cx: 250, cy: 910, tx: 100, ty: 930 },
];

type ViewMode = 'OVERVIEW' | 'AERO' | 'POWER';

const F1CarDiagram: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('OVERVIEW');

  const activeComp = componentsInfo.find(c => c.id === activeId);

  const getPathClass = (comp: CarComponent) => {
    let cls = 'f1-svg-path';
    if (activeId === comp.id) cls += ' active';
    if (viewMode !== 'OVERVIEW' && comp.group !== viewMode && !activeId) cls += ' dimmed';
    return cls;
  };

  const getCalloutClass = (comp: CarComponent) => {
    let cls = 'f1-callout-group';
    if (activeId === comp.id) cls += ' active';
    if (viewMode !== 'OVERVIEW' && comp.group !== viewMode && !activeId) cls += ' dimmed';
    return cls;
  };

  return (
    <div className="f1-car-diagram-container">
      <div className="f1-bg-metadata">
        TECHNICAL SCHEMATIC<br/>
        AERO / 2026<br/>
        PACEVION ENGINEERING
      </div>
      
      <div className="f1-scan-line" />

      <div className="f1-live-hud">
        <div className="f1-hud-item">
          <span className="f1-hud-label">AERO PROFILE</span>
          <span className="f1-hud-val">2026 SPEC</span>
        </div>
        <div className="f1-hud-item">
          <span className="f1-hud-label">POWER UNIT</span>
          <span className="f1-hud-val">V6 HYBRID</span>
        </div>
        <div className="f1-hud-item" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <span className="f1-hud-label">SYSTEM STATUS</span>
          <span className="f1-hud-val f1-hud-status">ANALYSIS READY</span>
        </div>
      </div>

      <div className="f1-car-metadata">
        <div className="f1-tech-view-controls">
          <span className="f1-tech-view-label">TECHNICAL VIEW</span>
          <button className={`f1-tech-btn ${viewMode === 'OVERVIEW' ? 'active' : ''}`} onClick={() => setViewMode('OVERVIEW')}>OVERVIEW</button>
          <button className={`f1-tech-btn ${viewMode === 'AERO' ? 'active' : ''}`} onClick={() => setViewMode('AERO')}>AERO</button>
          <button className={`f1-tech-btn ${viewMode === 'POWER' ? 'active' : ''}`} onClick={() => setViewMode('POWER')}>POWER</button>
        </div>
      </div>

      <div className="f1-diagram-wrapper">
        <svg viewBox="0 0 500 1000" className="f1-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="50%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="tyreGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#050505" />
              <stop offset="50%" stopColor="#151515" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="wingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#222" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
          </defs>

          {/* BACKGROUND MICRO DETAILS */}
          <text x="50" y="150" fill="rgba(255,255,255,0.1)" fontSize="8" fontFamily="var(--font-mono)">01 / FRONT AXLE</text>
          <text x="50" y="700" fill="rgba(255,255,255,0.1)" fontSize="8" fontFamily="var(--font-mono)">02 / REAR AXLE</text>
          <line x1="50" y1="160" x2="450" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4" />
          <line x1="50" y1="710" x2="450" y2="710" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4" />

          {/* CAR SHADOW */}
          <path d="M 180 150 L 320 150 L 370 400 L 370 700 L 320 900 L 180 900 L 130 700 L 130 400 Z" fill="rgba(0,0,0,0.5)" filter="blur(15px)" />
          
          {/* CAR COMPONENTS */}
          <g>
            {/* FLOOR */}
            <path id="floor" d="M 160 400 L 340 400 L 380 600 L 360 780 L 250 820 L 140 780 L 120 600 Z" fill="url(#bodyGrad)" className={getPathClass(componentsInfo[7])} onMouseEnter={() => setActiveId('floor')} onMouseLeave={() => setActiveId(null)} />
            
            {/* DIFFUSER */}
            <path id="diffuser" d="M 190 820 L 310 820 L 330 920 L 170 920 Z" fill="url(#wingGrad)" className={getPathClass(componentsInfo[11])} onMouseEnter={() => setActiveId('diffuser')} onMouseLeave={() => setActiveId(null)} />
            
            {/* REAR WING */}
            <path id="rear-wing" d="M 170 840 L 330 840 L 330 890 L 170 890 Z" fill="url(#wingGrad)" className={getPathClass(componentsInfo[10])} onMouseEnter={() => setActiveId('rear-wing')} onMouseLeave={() => setActiveId(null)} />
            <path d="M 230 800 L 270 800 L 270 850 L 230 850 Z" className="f1-svg-path" style={{fill: '#1a1a1a', stroke: '#333'}} />
            
            {/* POWER UNIT (Engine Cover) */}
            <path id="power-unit" d="M 230 450 L 270 450 L 280 750 L 220 750 Z" fill="url(#bodyGrad)" className={getPathClass(componentsInfo[9])} onMouseEnter={() => setActiveId('power-unit')} onMouseLeave={() => setActiveId(null)} />
            
            {/* SIDEPODS */}
            <path id="sidepods" d="M 160 420 L 230 400 L 230 650 L 180 650 Z M 340 420 L 270 400 L 270 650 L 320 650 Z" fill="url(#bodyGrad)" className={getPathClass(componentsInfo[6])} onMouseEnter={() => setActiveId('sidepods')} onMouseLeave={() => setActiveId(null)} />
            
            {/* MONOCOQUE (Cockpit Area) */}
            <path id="monocoque" d="M 220 250 L 280 250 L 280 400 L 220 400 Z" fill="url(#bodyGrad)" className={getPathClass(componentsInfo[4])} onMouseEnter={() => setActiveId('monocoque')} onMouseLeave={() => setActiveId(null)} />
            
            {/* HALO */}
            <path id="halo" d="M 250 310 L 220 360 L 225 365 L 250 320 L 275 365 L 280 360 Z" className={getPathClass(componentsInfo[5])} style={{fill: '#333', stroke: '#555'}} onMouseEnter={() => setActiveId('halo')} onMouseLeave={() => setActiveId(null)} />
            
            {/* NOSE */}
            <path id="nose" d="M 240 100 L 260 100 L 270 250 L 230 250 Z" fill="url(#bodyGrad)" className={getPathClass(componentsInfo[2])} onMouseEnter={() => setActiveId('nose')} onMouseLeave={() => setActiveId(null)} />
            
            {/* FRONT SUSPENSION */}
            <path id="suspension" d="M 230 200 L 160 210 L 160 220 L 230 220 Z M 270 200 L 340 210 L 340 220 L 270 220 Z M 230 180 L 160 190 L 160 195 L 230 195 Z M 270 180 L 340 190 L 340 195 L 270 195 Z" fill="#111" stroke="#333" className={getPathClass(componentsInfo[3])} onMouseEnter={() => setActiveId('suspension')} onMouseLeave={() => setActiveId(null)} />
            
            {/* FRONT WING */}
            <path id="front-wing" d="M 140 60 L 360 60 L 370 120 L 330 130 L 250 100 L 170 130 L 130 120 Z" fill="url(#wingGrad)" className={getPathClass(componentsInfo[0])} onMouseEnter={() => setActiveId('front-wing')} onMouseLeave={() => setActiveId(null)} />
            
            {/* FRONT TYRES */}
            <g id="front-tyres" className={getPathClass(componentsInfo[1])} onMouseEnter={() => setActiveId('front-tyres')} onMouseLeave={() => setActiveId(null)}>
              <rect x="110" y="150" width="50" height="110" rx="10" fill="url(#tyreGrad)" />
              <rect x="340" y="150" width="50" height="110" rx="10" fill="url(#tyreGrad)" />
            </g>
            
            {/* REAR TYRES */}
            <g id="rear-tyres" className={getPathClass(componentsInfo[8])} onMouseEnter={() => setActiveId('rear-tyres')} onMouseLeave={() => setActiveId(null)}>
              <rect x="100" y="700" width="60" height="120" rx="10" fill="url(#tyreGrad)" />
              <rect x="340" y="700" width="60" height="120" rx="10" fill="url(#tyreGrad)" />
            </g>
          </g>

          {/* PULSE INDICATORS */}
          {componentsInfo.filter(c => c.pulse).map((comp) => (
             <circle key={`pulse-${comp.id}`} cx={comp.cx} cy={comp.cy} r="3" className="f1-pulse-dot" />
          ))}

          {/* CALLOUTS */}
          {componentsInfo.map((comp) => (
            <g key={comp.id}>
              {/* Line */}
              <polyline 
                points={`${comp.cx},${comp.cy} ${comp.tx < 250 ? comp.tx + 40 : comp.tx - 40},${comp.ty} ${comp.tx < 250 ? comp.tx : comp.tx},${comp.ty}`} 
                className={`f1-callout-line ${activeId === comp.id ? 'active' : ''}`} 
              />
              
              {/* Text Group */}
              <g 
                className={getCalloutClass(comp)}
                onMouseEnter={() => setActiveId(comp.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                <text x={comp.tx} y={comp.ty - 10} className="f1-callout-num" textAnchor={comp.tx < 250 ? 'end' : 'start'}>{comp.num}</text>
                <text x={comp.tx} y={comp.ty + 5} className="f1-callout-text" textAnchor={comp.tx < 250 ? 'end' : 'start'}>{comp.name}</text>
                {/* Hitbox */}
                <rect x={comp.tx < 250 ? comp.tx - 100 : comp.tx} y={comp.ty - 25} width="100" height="40" fill="transparent" />
              </g>
            </g>
          ))}
        </svg>

        <div className={`f1-info-panel ${activeComp ? 'visible' : ''}`}>
          {activeComp && (
            <>
              <h4 className="f1-info-title">
                <span className="f1-info-num">{activeComp.num}</span> {activeComp.name}
              </h4>
              <p className="f1-info-desc">{activeComp.desc}</p>
              
              <div className="f1-info-meta">
                <div className="f1-info-meta-row">
                  <span className="f1-info-meta-label">ROLE</span>
                  <span className="f1-info-meta-val">{activeComp.role}</span>
                </div>
                <div className="f1-info-meta-row">
                  <span className="f1-info-meta-label">GROUP</span>
                  <span className="f1-info-meta-val">{activeComp.group}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="f1-mobile-list">
        {componentsInfo.map((comp) => (
          <div 
            key={comp.id} 
            className={`f1-mobile-item ${activeId === comp.id ? 'active' : ''}`}
            onClick={() => setActiveId(activeId === comp.id ? null : comp.id)}
          >
            <div className="f1-mobile-item-header">
              <span className="f1-info-num">{comp.num}</span>
              <span style={{fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)'}}>{comp.name}</span>
            </div>
            <div className="f1-mobile-item-desc">
              <p style={{margin: '0 0 var(--space-2) 0'}}>{comp.desc}</p>
              <div style={{display: 'flex', gap: 'var(--space-3)', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)'}}>
                <span>[{comp.group}]</span>
                <span>[{comp.role}]</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default F1CarDiagram;