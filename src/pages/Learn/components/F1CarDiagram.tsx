import React, { useState, useEffect } from 'react';
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
  side: 'left' | 'right';
  pulse?: boolean;
}

const componentsInfo: CarComponent[] = ([
  // LEFT SIDE
  { id: 'front-wing', num: '01', name: 'FRONT WING', desc: 'Generates front downforce and optimizes airflow', role: 'AERODYNAMICS', group: 'AERO', cx: 250, cy: 90, tx: 20, ty: 150, side: 'left', pulse: true },
  { id: 'front-tyres', num: '02', name: 'FRONT TYRES', desc: 'High performance slicks for maximum grip', role: 'MECHANICAL GRIP', group: 'CHASSIS', cx: 135, cy: 200, tx: 20, ty: 270, side: 'left' },
  { id: 'monocoque', num: '06', name: 'MONOCOQUE', desc: 'Survival cell made of carbon fiber composite', role: 'SURVIVAL CELL', group: 'CHASSIS', cx: 230, cy: 380, tx: 20, ty: 390, side: 'left' },
  { id: 'sidepods', num: '07', name: 'SIDE PODS', desc: 'Cooling and aerodynamic airflow management', role: 'COOLING / AERO', group: 'AERO', cx: 170, cy: 480, tx: 20, ty: 510, side: 'left', pulse: true },
  { id: 'floor', num: '08', name: 'FLOOR', desc: 'Generates downforce using ground effect', role: 'GROUND EFFECT', group: 'AERO', cx: 150, cy: 620, tx: 20, ty: 630, side: 'left' },
  { id: 'rear-tyres', num: '09', name: 'REAR TYRES', desc: 'Wider rear tyres for maximum traction', role: 'TRACTION', group: 'POWER', cx: 130, cy: 760, tx: 20, ty: 750, side: 'left' },
  { id: 'diffuser', num: '12', name: 'DIFFUSER', desc: 'Works with the floor to extract airflow', role: 'GROUND EFFECT', group: 'AERO', cx: 190, cy: 910, tx: 20, ty: 870, side: 'left' },
  
  // RIGHT SIDE
  { id: 'nose', num: '03', name: 'NOSE', desc: 'Directs airflow over the car efficiently', role: 'STRUCTURE / AERO', group: 'CHASSIS', cx: 250, cy: 160, tx: 480, ty: 200, side: 'right' },
  { id: 'suspension', num: '04', name: 'FRONT SUSPENSION', desc: 'Push-rod suspension for precise control', role: 'DYNAMICS', group: 'CHASSIS', cx: 290, cy: 210, tx: 480, ty: 350, side: 'right' },
  { id: 'halo', num: '05', name: 'HALO', desc: 'Driver head protection structure', role: 'SAFETY', group: 'CHASSIS', cx: 250, cy: 330, tx: 480, ty: 500, side: 'right', pulse: true },
  { id: 'power-unit', num: '10', name: 'POWER UNIT', desc: 'V6 Turbo Hybrid power unit and systems', role: 'PROPULSION', group: 'POWER', cx: 250, cy: 600, tx: 480, ty: 650, side: 'right', pulse: true },
  { id: 'rear-wing', num: '11', name: 'REAR WING', desc: 'Generates rear downforce and balances the car', role: 'AERODYNAMICS', group: 'AERO', cx: 250, cy: 860, tx: 480, ty: 800, side: 'right', pulse: true },
] as CarComponent[]).sort((a, b) => parseInt(a.num) - parseInt(b.num));

type ViewMode = 'OVERVIEW' | 'AERO' | 'POWER';

const F1CarDiagram: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('OVERVIEW');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getPathClass = (comp: CarComponent) => {
    let cls = 'f1-svg-path';
    if (activeId === comp.id) cls += ' active';
    if (viewMode !== 'OVERVIEW' && comp.group !== viewMode && !activeId) cls += ' dimmed';
    return cls;
  };

  const getLineClass = (comp: CarComponent) => {
    let cls = 'f1-callout-line';
    if (activeId === comp.id) cls += ' active';
    if (viewMode !== 'OVERVIEW' && comp.group !== viewMode && !activeId) cls += ' dimmed';
    return cls;
  };

  return (
    <div className="f1-car-section-wrapper">
      <div className={`f1-car-diagram-container ${isLoaded ? 'is-loaded' : ''}`}>
        
        {/* BACKGROUND GRID & GLOW */}
        <div className="f1-diagram-bg" />
        <div className="f1-diagram-glow" />

        {/* INNER HEADER SECTION */}
        <div className="f1-diagram-header">
          <div className="f1-diagram-title-group">
            <span className="f1-panel-label">TECHNICAL OVERVIEW</span>
          </div>
          
          <div className="f1-view-switcher">
            <button className={`f1-view-btn ${viewMode === 'OVERVIEW' ? 'active' : ''}`} onClick={() => setViewMode('OVERVIEW')}>OVERVIEW</button>
            <button className={`f1-view-btn ${viewMode === 'AERO' ? 'active' : ''}`} onClick={() => setViewMode('AERO')}>AERO</button>
            <button className={`f1-view-btn ${viewMode === 'POWER' ? 'active' : ''}`} onClick={() => setViewMode('POWER')}>POWER</button>
          </div>
        </div>

        {/* MAIN DIAGRAM & HUD */}
        <div className="f1-diagram-body">
          
          {/* SVG DIAGRAM */}
          <div className="f1-diagram-wrapper">
            <svg viewBox="-50 0 600 1000" className="f1-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4b5563" />
                  <stop offset="50%" stopColor="#374151" />
                  <stop offset="100%" stopColor="#1f2937" />
                </linearGradient>
                <linearGradient id="carbonGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#27272a" />
                  <stop offset="100%" stopColor="#18181b" />
                </linearGradient>
                <linearGradient id="tyreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#111" />
                  <stop offset="20%" stopColor="#222" />
                  <stop offset="50%" stopColor="#0a0a0a" />
                  <stop offset="80%" stopColor="#222" />
                  <stop offset="100%" stopColor="#111" />
                </linearGradient>
                <linearGradient id="wingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#18181b" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* CAR SHADOW */}
              <path d="M 180 150 L 320 150 L 370 400 L 370 700 L 320 900 L 180 900 L 130 700 L 130 400 Z" fill="rgba(0,0,0,0.6)" filter="blur(20px)" />
              
              {/* CAR COMPONENTS (Must be before callouts so callouts are on top) */}
              <g>
                {/* FLOOR */}
                <g onMouseEnter={() => setActiveId('floor')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 160 400 L 340 400 L 380 600 L 360 780 L 250 820 L 140 780 L 120 600 Z" className="f1-svg-hit-area" />
                  <path id="floor" d="M 160 400 L 340 400 L 380 600 L 360 780 L 250 820 L 140 780 L 120 600 Z" fill="url(#carbonGrad)" stroke="#3f3f46" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'floor')!)} />
                </g>
                
                {/* DIFFUSER */}
                <g onMouseEnter={() => setActiveId('diffuser')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 190 820 L 310 820 L 330 920 L 170 920 Z" className="f1-svg-hit-area" />
                  <path id="diffuser" d="M 190 820 L 310 820 L 330 920 L 170 920 Z" fill="url(#carbonGrad)" stroke="#52525b" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'diffuser')!)} />
                </g>

                {/* REAR WING */}
                <g onMouseEnter={() => setActiveId('rear-wing')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 150 840 L 350 840 L 350 890 L 150 890 Z" className="f1-svg-hit-area" />
                  <path id="rear-wing" d="M 150 840 L 350 840 L 350 890 L 150 890 Z" fill="url(#wingGrad)" stroke="#52525b" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'rear-wing')!)} />
                  <path d="M 220 800 L 280 800 L 280 850 L 220 850 Z" className="f1-svg-path" style={{fill: '#27272a', stroke: '#52525b', strokeWidth: 2}} />
                </g>
                
                {/* POWER UNIT (Engine Cover) */}
                <g onMouseEnter={() => setActiveId('power-unit')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 230 450 L 270 450 L 280 750 L 220 750 Z" className="f1-svg-hit-area" />
                  <path id="power-unit" d="M 230 450 L 270 450 L 280 750 L 220 750 Z" fill="url(#bodyGrad)" stroke="#6b7280" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'power-unit')!)} />
                </g>
                
                {/* SIDEPODS */}
                <g onMouseEnter={() => setActiveId('sidepods')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 170 420 L 230 400 L 230 650 L 190 650 Z M 330 420 L 270 400 L 270 650 L 310 650 Z" className="f1-svg-hit-area" />
                  <path id="sidepods" d="M 170 420 L 230 400 L 230 650 L 190 650 Z M 330 420 L 270 400 L 270 650 L 310 650 Z" fill="url(#bodyGrad)" stroke="#6b7280" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'sidepods')!)} />
                </g>
                
                {/* MONOCOQUE (Cockpit Area) */}
                <g onMouseEnter={() => setActiveId('monocoque')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 220 250 L 280 250 L 280 400 L 220 400 Z" className="f1-svg-hit-area" />
                  <path id="monocoque" d="M 220 250 L 280 250 L 280 400 L 220 400 Z" fill="url(#bodyGrad)" stroke="#9ca3af" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'monocoque')!)} />
                </g>
                
                {/* HALO */}
                <g onMouseEnter={() => setActiveId('halo')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 250 310 L 220 360 L 225 365 L 250 320 L 275 365 L 280 360 Z" className="f1-svg-hit-area" />
                  <path id="halo" d="M 250 310 L 220 360 L 225 365 L 250 320 L 275 365 L 280 360 Z" className={getPathClass(componentsInfo.find(c => c.id === 'halo')!)} style={{fill: '#e5e7eb', stroke: '#fff', strokeWidth: 2}} />
                </g>

                {/* NOSE */}
                <g onMouseEnter={() => setActiveId('nose')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 240 100 L 260 100 L 270 250 L 230 250 Z" className="f1-svg-hit-area" />
                  <path id="nose" d="M 240 100 L 260 100 L 270 250 L 230 250 Z" fill="url(#bodyGrad)" stroke="#9ca3af" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'nose')!)} />
                </g>
                
                {/* FRONT SUSPENSION */}
                <g onMouseEnter={() => setActiveId('suspension')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 230 200 L 140 210 L 140 220 L 230 220 Z M 270 200 L 360 210 L 360 220 L 270 220 Z M 230 180 L 140 190 L 140 195 L 230 195 Z M 270 180 L 360 190 L 360 195 L 270 195 Z" className="f1-svg-hit-area" />
                  <path id="suspension" d="M 230 200 L 140 210 L 140 220 L 230 220 Z M 270 200 L 360 210 L 360 220 L 270 220 Z M 230 180 L 140 190 L 140 195 L 230 195 Z M 270 180 L 360 190 L 360 195 L 270 195 Z" fill="#111" stroke="#52525b" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'suspension')!)} />
                </g>
                
                {/* FRONT WING */}
                <g onMouseEnter={() => setActiveId('front-wing')} onMouseLeave={() => setActiveId(null)}>
                  <path d="M 120 60 L 380 60 L 390 120 L 350 130 L 250 100 L 150 130 L 110 120 Z" className="f1-svg-hit-area" />
                  <path id="front-wing" d="M 120 60 L 380 60 L 390 120 L 350 130 L 250 100 L 150 130 L 110 120 Z" fill="url(#wingGrad)" stroke="#52525b" strokeWidth="2" className={getPathClass(componentsInfo.find(c => c.id === 'front-wing')!)} />
                </g>
                
                {/* FRONT TYRES */}
                <g id="front-tyres" className={getPathClass(componentsInfo.find(c => c.id === 'front-tyres')!)} onMouseEnter={() => setActiveId('front-tyres')} onMouseLeave={() => setActiveId(null)}>
                  <rect x="90" y="150" width="50" height="110" className="f1-svg-hit-area" style={{strokeWidth: '20px'}} />
                  <rect x="90" y="150" width="50" height="110" rx="10" fill="url(#tyreGrad)" stroke="#27272a" strokeWidth="2" style={{pointerEvents: 'none'}} />
                  
                  <rect x="360" y="150" width="50" height="110" className="f1-svg-hit-area" style={{strokeWidth: '20px'}} />
                  <rect x="360" y="150" width="50" height="110" rx="10" fill="url(#tyreGrad)" stroke="#27272a" strokeWidth="2" style={{pointerEvents: 'none'}} />
                </g>
                
                {/* REAR TYRES */}
                <g id="rear-tyres" className={getPathClass(componentsInfo.find(c => c.id === 'rear-tyres')!)} onMouseEnter={() => setActiveId('rear-tyres')} onMouseLeave={() => setActiveId(null)}>
                  <rect x="80" y="700" width="60" height="120" className="f1-svg-hit-area" style={{strokeWidth: '20px'}} />
                  <rect x="80" y="700" width="60" height="120" rx="10" fill="url(#tyreGrad)" stroke="#27272a" strokeWidth="2" style={{pointerEvents: 'none'}} />
                  
                  <rect x="360" y="700" width="60" height="120" className="f1-svg-hit-area" style={{strokeWidth: '20px'}} />
                  <rect x="360" y="700" width="60" height="120" rx="10" fill="url(#tyreGrad)" stroke="#27272a" strokeWidth="2" style={{pointerEvents: 'none'}} />
                </g>
              </g>

              {/* PULSE INDICATORS */}
              {componentsInfo.filter(c => c.pulse).map((comp) => (
                <circle key={`pulse-${comp.id}`} cx={comp.cx} cy={comp.cy} r="4" className="f1-pulse-dot" />
              ))}

              {/* CALLOUT LINES AND TEXT (MUST BE RENDERED LAST TO STAY ON TOP) */}
              {componentsInfo.map((comp) => (
                <g key={comp.id}>
                  {/* Line */}
                  <polyline 
                    points={`${comp.cx},${comp.cy} ${comp.side === 'left' ? comp.tx + 40 : comp.tx - 40},${comp.ty} ${comp.tx},${comp.ty}`} 
                    className={getLineClass(comp)} 
                  />
                  
                  {/* ForeignObject Text Group */}
                  <foreignObject 
                    x={comp.side === 'left' ? comp.tx - 180 : comp.tx + 10} 
                    y={comp.ty - 16} 
                    width="170" 
                    height="100"
                  >
                    <div 
                      className={`f1-callout-html ${activeId === comp.id ? 'active' : ''} ${viewMode !== 'OVERVIEW' && comp.group !== viewMode && !activeId ? 'dimmed' : ''}`}
                      onMouseEnter={() => setActiveId(comp.id)}
                      onMouseLeave={() => setActiveId(null)}
                      style={{ textAlign: comp.side === 'left' ? 'right' : 'left' }}
                    >
                      <div className="f1-callout-html-header">
                        {comp.side === 'left' && <span className="f1-callout-html-name">{comp.name}</span>}
                        <span className="f1-callout-html-num">{comp.num}</span>
                        {comp.side === 'right' && <span className="f1-callout-html-name">{comp.name}</span>}
                      </div>
                      <div className="f1-callout-html-desc">
                        {comp.desc}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              ))}
            </svg>
          </div>

          {/* RIGHT HUD */}
          <div className="f1-hud-panel">
            <div className="f1-hud-item">
              <span className="f1-hud-label">AERO PROFILE</span>
              <span className="f1-hud-val">2026 SPEC</span>
            </div>
            <div className="f1-hud-item">
              <span className="f1-hud-label">POWER UNIT</span>
              <span className="f1-hud-val">V6 TURBO HYBRID</span>
            </div>
            <div className="f1-hud-item f1-hud-status-box">
              <span className="f1-hud-label">SYSTEM STATUS</span>
              <span className="f1-hud-val f1-hud-status">ANALYSIS READY</span>
            </div>
          </div>

        </div>

        {/* BOTTOM STRIP */}
        <div className="f1-diagram-footer">
          <span>2026 SPEC</span>
          <span className="f1-separator">/</span>
          <span>ACTIVE AERO</span>
          <span className="f1-separator">/</span>
          <span>V6 TURBO HYBRID</span>
          <span className="f1-separator">/</span>
          <span>100% SUSTAINABLE FUEL</span>
          <span className="f1-separator">/</span>
          <span>NIMBLE CAR</span>
        </div>

        {/* MOBILE LIST */}
        <div className="f1-mobile-list">
          {componentsInfo.map((comp) => (
            <div 
              key={comp.id} 
              className={`f1-mobile-item ${activeId === comp.id ? 'active' : ''}`}
              onClick={() => setActiveId(activeId === comp.id ? null : comp.id)}
            >
              <div className="f1-mobile-item-header">
                <span className="f1-info-num">{comp.num}</span>
                <span className="f1-info-name">{comp.name}</span>
              </div>
              <div className="f1-mobile-item-desc">
                <p>{comp.desc}</p>
                <div className="f1-mobile-item-meta">
                  <span>[{comp.group}]</span>
                  <span>[{comp.role}]</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default F1CarDiagram;