// src/data/assets.ts

const base = import.meta.env.BASE_URL;

// ─── DRIVER HEADSHOT MAPPING ─────────────────────────────────────────────────
// Official F1 2026 driver portraits from media.formula1.com
// Keys match the Ergast API driverId values
const DRIVER_HEADSHOTS: Record<string, string> = {
  // Mercedes
  russell: `${base}assets/img/drivers/russell.webp`,
  antonelli: `${base}assets/img/drivers/antonelli.webp`,
  // Ferrari
  leclerc: `${base}assets/img/drivers/leclerc.webp`,
  hamilton: `${base}assets/img/drivers/hamilton.webp`,
  // McLaren
  norris: `${base}assets/img/drivers/norris.webp`,
  piastri: `${base}assets/img/drivers/piastri.webp`,
  // Red Bull Racing
  max_verstappen: `${base}assets/img/drivers/max_verstappen.webp`,
  hadjar: `${base}assets/img/drivers/hadjar.webp`,
  // Racing Bulls
  lawson: `${base}assets/img/drivers/lawson.webp`,
  lindblad: `${base}assets/img/drivers/lindblad.webp`,
  // Alpine
  gasly: `${base}assets/img/drivers/gasly.webp`,
  colapinto: `${base}assets/img/drivers/colapinto.webp`,
  // Haas
  ocon: `${base}assets/img/drivers/ocon.webp`,
  bearman: `${base}assets/img/drivers/bearman.webp`,
  // Audi (Sauber)
  hulkenberg: `${base}assets/img/drivers/hulkenberg.webp`,
  bortoleto: `${base}assets/img/drivers/bortoleto.webp`,
  // Williams
  sainz: `${base}assets/img/drivers/sainz.webp`,
  albon: `${base}assets/img/drivers/albon.webp`,
  // Aston Martin
  alonso: `${base}assets/img/drivers/alonso.webp`,
  stroll: `${base}assets/img/drivers/stroll.webp`,
  // Cadillac
  perez: `${base}assets/img/drivers/perez.webp`,
  bottas: `${base}assets/img/drivers/bottas.webp`,
};

// ─── TEAM CAR MAPPING ────────────────────────────────────────────────────────
// Official F1 2024/2026 team cars from media.formula1.com
// Keys match the Ergast API constructorId values or variations
const TEAM_CARS: Record<string, string> = {
  ferrari: `${base}assets/img/cars/ferrari.png`,
  mercedes: `${base}assets/img/cars/mercedes.png`,
  mclaren: `${base}assets/img/cars/mclaren.png`,
  red_bull: `${base}assets/img/cars/red-bull-racing.png`,
  redbull: `${base}assets/img/cars/red-bull-racing.png`,
  rb: `${base}assets/img/cars/rb.png`,
  alphatauri: `${base}assets/img/cars/rb.png`,
  alpine: `${base}assets/img/cars/alpine.png`,
  haas: `${base}assets/img/cars/haas.png`,
  haas_f1_team: `${base}assets/img/cars/haas.png`,
  sauber: `${base}assets/img/cars/kick-sauber.png`,
  kick_sauber: `${base}assets/img/cars/kick-sauber.png`,
  alfa: `${base}assets/img/cars/kick-sauber.png`,
  williams: `${base}assets/img/cars/williams.png`,
  aston_martin: `${base}assets/img/cars/aston-martin.png`,
};

// ─── STATIC ASSETS ───────────────────────────────────────────────────────────
export const ASSETS = {
  cars: {
    ferrari: `${base}assets/img/f1_car_red.jpg`,
    red_bull: `${base}assets/img/f1_car_blue.jpg`,
    default_red: `${base}assets/img/f1_car_red.jpg`,
    default_blue: `${base}assets/img/f1_car_blue.jpg`
  },
  drivers: {
    ...DRIVER_HEADSHOTS,
    default_red: `${base}assets/img/f1_driver_red.jpg`,
    default_blue: `${base}assets/img/f1_driver_blue.jpg`
  },
  circuits: {
    // hero: `${base}assets/img/f1_track_hero.jpg` - removed in favor of CircuitTrack SVG rendering
  },
  learn: {
    aerodynamics: `${base}assets/img/learn_aero.jpg`,
    powerUnit: `${base}assets/img/learn_pu.jpg`,
    tyres: `${base}assets/img/learn_tyre.jpg`
  }
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Returns the best available visual for a driver.
 * Priority: real headshot → team-color generic fallback.
 */
export const getDriverVisual = (driverId?: string, _constructorId?: string): string => {
  if (!driverId) return ASSETS.drivers.default_blue;

  // Direct headshot lookup
  if (DRIVER_HEADSHOTS[driverId]) {
    return DRIVER_HEADSHOTS[driverId];
  }

  // Fallback: team-color generic
  const redTeams = ['ferrari', 'alfa', 'haas', 'haas_f1_team'];
  if (_constructorId && redTeams.includes(_constructorId)) {
    return ASSETS.drivers.default_red;
  }
  return ASSETS.drivers.default_blue;
};

/**
 * Returns the best available team car visual.
 * Priority: real car png -> team-color generic fallback.
 */
export const getTeamVisual = (constructorId?: string): string => {
  if (!constructorId) return ASSETS.cars.default_blue;
  
  // Direct real car lookup
  if (TEAM_CARS[constructorId]) {
    return TEAM_CARS[constructorId];
  }

  // Fallback to ASSETS.cars if it exists
  if (ASSETS.cars[constructorId as keyof typeof ASSETS.cars]) {
    return ASSETS.cars[constructorId as keyof typeof ASSETS.cars];
  }

  // Fallback generic
  const redTeams = ['ferrari', 'alfa', 'haas', 'haas_f1_team'];
  if (redTeams.includes(constructorId)) {
    return ASSETS.cars.default_red;
  }
  
  return ASSETS.cars.default_blue;
};
