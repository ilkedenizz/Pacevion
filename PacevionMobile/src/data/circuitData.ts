export interface CircuitDetails {
  circuitId: string;
  laps: number;
  distance: string;
}

export const CIRCUIT_DETAILS: Record<string, CircuitDetails> = {
  bahrain: { circuitId: 'bahrain', laps: 57, distance: '308.2 KM' },
  jeddah: { circuitId: 'jeddah', laps: 50, distance: '308.4 KM' },
  albert_park: { circuitId: 'albert_park', laps: 58, distance: '306.1 KM' },
  suzuka: { circuitId: 'suzuka', laps: 53, distance: '307.4 KM' },
  shanghai: { circuitId: 'shanghai', laps: 56, distance: '305.0 KM' },
  miami: { circuitId: 'miami', laps: 57, distance: '308.3 KM' },
  imola: { circuitId: 'imola', laps: 63, distance: '309.0 KM' },
  monaco: { circuitId: 'monaco', laps: 78, distance: '260.2 KM' },
  villeneuve: { circuitId: 'villeneuve', laps: 70, distance: '305.2 KM' },
  catalunya: { circuitId: 'catalunya', laps: 66, distance: '307.2 KM' },
  red_bull_ring: { circuitId: 'red_bull_ring', laps: 71, distance: '306.4 KM' },
  silverstone: { circuitId: 'silverstone', laps: 52, distance: '306.1 KM' },
  hungaroring: { circuitId: 'hungaroring', laps: 70, distance: '306.6 KM' },
  spa: { circuitId: 'spa', laps: 44, distance: '308.0 KM' },
  zandvoort: { circuitId: 'zandvoort', laps: 72, distance: '306.1 KM' },
  monza: { circuitId: 'monza', laps: 53, distance: '306.7 KM' },
  baku: { circuitId: 'baku', laps: 51, distance: '306.0 KM' },
  marina_bay: { circuitId: 'marina_bay', laps: 62, distance: '306.1 KM' },
  americas: { circuitId: 'americas', laps: 56, distance: '308.4 KM' },
  rodriguez: { circuitId: 'rodriguez', laps: 71, distance: '305.3 KM' },
  interlagos: { circuitId: 'interlagos', laps: 71, distance: '305.8 KM' },
  vegas: { circuitId: 'vegas', laps: 50, distance: '309.9 KM' },
  losail: { circuitId: 'losail', laps: 57, distance: '308.0 KM' },
  yas_marina: { circuitId: 'yas_marina', laps: 58, distance: '306.1 KM' },
  default: { circuitId: 'default', laps: 53, distance: '305.0 KM' }
};

export const getCircuitDetails = (circuitId: string): CircuitDetails => {
  return CIRCUIT_DETAILS[circuitId?.toLowerCase()] || CIRCUIT_DETAILS.default;
};
