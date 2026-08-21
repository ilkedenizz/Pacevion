import React from 'react';
import { circuitLayouts } from '../../data/circuits';
import './CircuitTrack.css';

interface CircuitTrackProps {
  circuitId: string;
  circuitName: string;
  country: string;
  raceName?: string;
  round?: string;
  variant?: 'card' | 'hero' | 'compact' | 'detail';
  className?: string;
}

const ErgastToInternalMapping: Record<string, string> = {
  albert_park: 'albert_park',
  shanghai: 'shanghai',
  suzuka: 'suzuka',
  bahrain: 'bahrain',
  jeddah: 'jeddah',
  miami: 'miami',
  imola: 'imola',
  monaco: 'monaco',
  catalunya: 'catalunya',
  villeneuve: 'villeneuve',
  red_bull_ring: 'red_bull_ring',
  silverstone: 'silverstone',
  spa: 'spa',
  hungaroring: 'hungaroring',
  zandvoort: 'zandvoort',
  monza: 'monza',
  baku: 'baku',
  marina_bay: 'marina_bay',
  americas: 'americas',
  rodriguez: 'rodriguez',
  interlagos: 'interlagos',
  vegas: 'vegas',
  losail: 'losail',
  yas_marina: 'yas_marina',
};

function resolveCanonicalCircuitId(
  circuitId: string, 
  circuitName: string, 
  _country: string, 
  raceName?: string
): string | null {
  const cn = circuitName.toLowerCase();
  const rn = (raceName || '').toLowerCase();
  
  if (
    rn.includes('bahrain') || 
    cn.includes('bahrain') || 
    circuitId === 'bahrain'
  ) {
    return 'bahrain';
  }

  if (circuitId === 'madring' || cn.includes('madrid') || cn.includes('madring')) {
    return null;
  }
  if (circuitId === 'catalunya' || cn.includes('catalunya') || cn.includes('barcelona')) {
    return 'catalunya';
  }
  
  if (rn.includes('spanish grand prix') || rn.includes('spain')) {
    return null; 
  }

  return ErgastToInternalMapping[circuitId] || null;
}

export const CircuitTrack: React.FC<CircuitTrackProps> = ({ 
  circuitId, 
  circuitName,
  country,
  raceName,
  variant = 'card',
  className = '' 
}) => {
  const internalId = resolveCanonicalCircuitId(circuitId, circuitName, country, raceName);
  const layout = internalId ? circuitLayouts[internalId] : null;

  return (
    <div className={`circuit-track-container variant-${variant} ${className}`}>
      {layout ? (
        <div className="circuit-svg-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={layout.viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="circuit-svg"
            aria-label={`${circuitName} layout in ${country}`}
          >
            <path
              d={layout.trackPath}
              className="circuit-path-glow"
            />
            <path
              d={layout.trackPath}
              className="circuit-path"
            />
          </svg>
        </div>
      ) : (
        <div className="circuit-unavailable">
          <span className="cu-icon">ğŸ</span>
          <span className="cu-text">CIRCUIT DATA</span>
        </div>
      )}
    </div>
  );
};

export default CircuitTrack;
