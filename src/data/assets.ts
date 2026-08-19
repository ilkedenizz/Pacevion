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
  arvid_lindblad: `${base}assets/img/drivers/lindblad.webp`,
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
// Official F1 2026 team cars
// Keys match the Ergast API constructorId values or variations
const TEAM_CARS: Record<string, string> = {
  ferrari: `${base}assets/img/cars/ferrari-2026.png`,
  mercedes: `${base}assets/img/cars/mercedes-2026.png`,
  mclaren: `${base}assets/img/cars/mclaren-2026.png`,
  red_bull: `${base}assets/img/cars/red-bull-racing-2026.png`,
  redbull: `${base}assets/img/cars/red-bull-racing-2026.png`,
  rb: `${base}assets/img/cars/rb-2026.png`,
  alphatauri: `${base}assets/img/cars/rb-2026.png`,
  alpine: `${base}assets/img/cars/alpine-2026.png`,
  haas: `${base}assets/img/cars/haas-2026.png`,
  haas_f1_team: `${base}assets/img/cars/haas-2026.png`,
  sauber: `${base}assets/img/cars/kick-sauber-2026.png`,
  kick_sauber: `${base}assets/img/cars/kick-sauber-2026.png`,
  alfa: `${base}assets/img/cars/kick-sauber-2026.png`,
  williams: `${base}assets/img/cars/williams-2026.png`,
  aston_martin: `${base}assets/img/cars/aston-martin-2026.png`,
  
  // Audi mappings
  audi: `${base}assets/img/cars/audi-r26.webp`,
  audi_f1: `${base}assets/img/cars/audi-r26.webp`,
  "audi-f1": `${base}assets/img/cars/audi-r26.webp`,
  "audi-f1-team": `${base}assets/img/cars/audi-r26.webp`,

  // Cadillac mappings
  cadillac: `${base}assets/img/cars/cadillac-2026.webp`,
  cadillac_f1: `${base}assets/img/cars/cadillac-2026.webp`,
  "cadillac-f1": `${base}assets/img/cars/cadillac-2026.webp`,
  "cadillac-f1-team": `${base}assets/img/cars/cadillac-2026.webp`,
};

// ─── STATIC ASSETS ───────────────────────────────────────────────────────────
export const ASSETS = {
  cars: {
    // defaults removed entirely as per strict requirement
  },
  drivers: {
    ...DRIVER_HEADSHOTS
  },
  circuits: {},
  learn: {
    aerodynamics: `${base}assets/img/learn_aero.jpg`,
    powerUnit: `${base}assets/img/learn_pu.jpg`,
    tyres: `${base}assets/img/learn_tyre.jpg`
  }
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getDriverVisual = (driverId?: string, _constructorId?: string): string | null => {
  if (!driverId) return null;
  if (DRIVER_HEADSHOTS[driverId]) {
    return DRIVER_HEADSHOTS[driverId];
  }
  return null;
};

/**
 * Returns the exact team car visual or null if genuinely missing.
 * NO GENERIC FALLBACKS ALLOWED.
 */
export const getTeamVisual = (constructorId?: string): string | null => {
  if (!constructorId) return null;
  if (TEAM_CARS[constructorId]) {
    return TEAM_CARS[constructorId];
  }
  return null;
};

export const validateTeamAssets = () => {
  console.log("Validating Team Assets mapping...");
  
  const expectedTeams = ['audi', 'cadillac', 'ferrari', 'mercedes', 'mclaren', 'red_bull', 'aston_martin', 'alpine', 'williams', 'haas', 'rb'];
  const reverseMap = new Map<string, string[]>();

  expectedTeams.forEach(teamId => {
    const visual = getTeamVisual(teamId);
    if (!visual) {
      console.error(`VALIDATION ERROR: Missing asset for team: ${teamId}`);
    } else {
      if (!reverseMap.has(visual)) reverseMap.set(visual, []);
      reverseMap.get(visual)!.push(teamId);
    }
  });

  // Check for duplicated assignments
  reverseMap.forEach((teams, visual) => {
    // Only warn if distinct teams share the same visual. (E.g. red_bull and redbull sharing is fine, but they aren't distinct in expectedTeams).
    if (teams.length > 1) {
      console.error(`VALIDATION ERROR: Multiple teams sharing the same visual (${visual}): ${teams.join(', ')}`);
    }
  });
};
