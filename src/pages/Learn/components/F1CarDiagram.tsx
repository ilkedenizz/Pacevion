/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './F1CarDiagram.css';

interface CarComponent {
  id: string;
  num: string;
  name: string;
  desc: string;
  cx: number;
  cy: number;
  tx: number;
  ty: number;
}

const componentsInfo: CarComponent[] = [
  { id: 'front-wing', num: '01', name: 'FRONT WING', desc: 'Generates downforce and directs airflow around the front tyres and under the floor.', cx: 250, cy: 90, tx: 100, ty: 70 },
  { id: 'front-tyres', num: '02', name: 'FRONT TYRES', desc: '18-inch Pirelli tyres providing mechanical grip and steering input.', cx: 160, cy: 200, tx: 70, ty: 180 },
  { id: 'nose', num: '03', name: 'NOSE', desc: 'Structural crash structure that channels air to the floor and sidepods.', cx: 250, cy: 160, tx: 380, ty: 140 },
  { id: 'suspension', num: '04', name: 'FRONT SUSPENSION', desc: 'Connects wheels to chassis and manages weight transfer during cornering and braking.', cx: 210, cy: 210, tx: 400, ty: 220 },
  { id: 'monocoque', num: '05', name: 'MONOCOQUE', desc: 'The survival cell protecting the driver, housing the cockpit and fuel cell.', cx: 250, cy: 380, tx: 100, ty: 350 },
  { id: 'halo', num: '06', name: 'HALO', desc: 'Titanium structure protecting the driver\'s head from flying debris.', cx: 250, cy: 330, tx: 380, ty: 310 },
  { id: 'sidepods', num: '07', name: 'SIDE PODS', desc: 'Housings for the radiators to cool the power unit, shaped to manage airflow.', cx: 170, cy: 450, tx: 70, ty: 470 },
  { id: 'floor', num: '08', name: 'FLOOR', desc: 'Creates the majority of the car\'s downforce through ground effect venturi tunnels.', cx: 150, cy: 580, tx: 70, ty: 600 },
  { id: 'rear-tyres', num: '09', name: 'REAR TYRES', desc: 'Wider than front tyres, responsible for putting the hybrid power unit\'s torque to the ground.', cx: 160, cy: 750, tx: 70, ty: 730 },
  { id: 'power-unit', num: '10', name: 'POWER UNIT', desc: 'Complex 1.6L V6 hybrid engine combining internal combustion and electrical energy.', cx: 250, cy: 600, tx: 380, ty: 580 },
  { id: 'rear-wing', num: '11', name: 'REAR WING', desc: 'Produces rear downforce and houses the Drag Reduction System (DRS) flap.', cx: 250, cy: 860, tx: 380, ty: 840 },
  { id: 'diffuser', num: '12', name: 'DIFFUSER', desc: 'Expands air exiting from under the floor to increase ground effect downforce.', cx: 250, cy: 910, tx: 100, ty: 930 },
];

const F1CarDiagram: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeComp = componentsInfo.find(c => c.id === activeId);

  return (
    <div className="f1-car-diagram-container">
      <div className="f1-car-metadata">
        <div className="f1-car-metadata-item">
          <span className="f1-car-metadata-label">TYPE</span>
          <span className="f1-car-metadata-value">SINGLE-SEATER</span>
        </div>
        <div className="f1-car-metadata-item">
          <span className="f1-car-metadata-label">ERA</span>
          <span className="f1-car-metadata-value">2026</span>
        </div>
        <div className="f1-car-metadata-item">
          <span className="f1-car-metadata-label">LAYOUT</span>
          <span className="f1-car-metadata-value">OPEN-WHEEL</span>
        </div>
        <div className="f1-car-metadata-item">
          <span className="f1-car-metadata-label">POWER UNIT</span>
          <span className="f1-car-metadata-value">HYBRID</span>
        </div>
      </div>

      <div className="f1-diagram-wrapper">
        <svg viewBox="0 0 500 1000" className="f1-svg" preserveAspectRatio="xMidYMid meet">
          {/* CAR SHADOW */}
          <path d="M 180 150 L 320 150 L 370 400 L 370 700 L 320 900 L 180 900 L 130 700 L 130 400 Z" fill="rgba(0,0,0,0.3)" filter="blur(15px)" />
          
          {/* CAR COMPONENTS */}
          <g>
            {/* FLOOR */}
            <path id="floor" d="M 160 400 L 340 400 L 380 600 L 360 780 L 250 820 L 140 780 L 120 600 Z" className={`f1-svg-path ${activeId === 'floor' ? 'active' : ''}`} onMouseEnter={() => setActiveId('floor')} onMouseLeave={() => setActiveId(null)} />
            
            {/* DIFFUSER */}
            <path id="diffuser" d="M 190 820 L 310 820 L 330 920 L 170 920 Z" className={`f1-svg-path ${activeId === 'diffuser' ? 'active' : ''}`} onMouseEnter={() => setActiveId('diffuser')} onMouseLeave={() => setActiveId(null)} />
            
            {/* REAR WING */}
            <path id="rear-wing" d="M 170 840 L 330 840 L 330 890 L 170 890 Z" className={`f1-svg-path ${activeId === 'rear-wing' ? 'active' : ''}`} onMouseEnter={() => setActiveId('rear-wing')} onMouseLeave={() => setActiveId(null)} />
            <path d="M 230 800 L 270 800 L 270 850 L 230 850 Z" className="f1-svg-path" style={{fill: '#222'}} />
            
            {/* POWER UNIT (Engine Cover) */}
            <path id="power-unit" d="M 230 450 L 270 450 L 280 750 L 220 750 Z" className={`f1-svg-path ${activeId === 'power-unit' ? 'active' : ''}`} onMouseEnter={() => setActiveId('power-unit')} onMouseLeave={() => setActiveId(null)} />
            
            {/* SIDEPODS */}
            <path id="sidepods" d="M 160 420 L 230 400 L 230 650 L 180 650 Z M 340 420 L 270 400 L 270 650 L 320 650 Z" className={`f1-svg-path ${activeId === 'sidepods' ? 'active' : ''}`} onMouseEnter={() => setActiveId('sidepods')} onMouseLeave={() => setActiveId(null)} />
            
            {/* MONOCOQUE (Cockpit Area) */}
            <path id="monocoque" d="M 220 250 L 280 250 L 280 400 L 220 400 Z" className={`f1-svg-path ${activeId === 'monocoque' ? 'active' : ''}`} onMouseEnter={() => setActiveId('monocoque')} onMouseLeave={() => setActiveId(null)} />
            
            {/* HALO */}
            <path id="halo" d="M 250 310 L 220 360 L 225 365 L 250 320 L 275 365 L 280 360 Z" className={`f1-svg-path ${activeId === 'halo' ? 'active' : ''}`} style={{fill: '#555'}} onMouseEnter={() => setActiveId('halo')} onMouseLeave={() => setActiveId(null)} />
            
            {/* NOSE */}
            <path id="nose" d="M 240 100 L 260 100 L 270 250 L 230 250 Z" className={`f1-svg-path ${activeId === 'nose' ? 'active' : ''}`} onMouseEnter={() => setActiveId('nose')} onMouseLeave={() => setActiveId(null)} />
            
            {/* FRONT SUSPENSION */}
            <path id="suspension" d="M 230 200 L 160 210 L 160 220 L 230 220 Z M 270 200 L 340 210 L 340 220 L 270 220 Z M 230 180 L 160 190 L 160 195 L 230 195 Z M 270 180 L 340 190 L 340 195 L 270 195 Z" className={`f1-svg-path ${activeId === 'suspension' ? 'active' : ''}`} onMouseEnter={() => setActiveId('suspension')} onMouseLeave={() => setActiveId(null)} />
            
            {/* FRONT WING */}
            <path id="front-wing" d="M 140 60 L 360 60 L 370 120 L 330 130 L 250 100 L 170 130 L 130 120 Z" className={`f1-svg-path ${activeId === 'front-wing' ? 'active' : ''}`} onMouseEnter={() => setActiveId('front-wing')} onMouseLeave={() => setActiveId(null)} />
            
            {/* FRONT TYRES */}
            <g id="front-tyres" className={`f1-svg-path ${activeId === 'front-tyres' ? 'active' : ''}`} onMouseEnter={() => setActiveId('front-tyres')} onMouseLeave={() => setActiveId(null)}>
              <rect x="110" y="150" width="50" height="110" rx="10" />
              <rect x="340" y="150" width="50" height="110" rx="10" />
            </g>
            
            {/* REAR TYRES */}
            <g id="rear-tyres" className={`f1-svg-path ${activeId === 'rear-tyres' ? 'active' : ''}`} onMouseEnter={() => setActiveId('rear-tyres')} onMouseLeave={() => setActiveId(null)}>
              <rect x="100" y="700" width="60" height="120" rx="10" />
              <rect x="340" y="700" width="60" height="120" rx="10" />
            </g>
          </g>

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
                className={`f1-callout-group ${activeId === comp.id ? 'active' : ''}`}
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
            <div className="f1-mobile-item-desc">{comp.desc}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default F1CarDiagram;