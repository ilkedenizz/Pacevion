// src/data/assets.ts

const base = import.meta.env.BASE_URL || '/';

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

/**
 * Returns the exact team car visual or null if genuinely missing.
 * NO GENERIC FALLBACKS ALLOWED.
 */
export const getTeamVisual = (constructorId?: string): string | null => {
  if (!constructorId) return null;
  const id = constructorId.toLowerCase();
  if (TEAM_CARS[id]) {
    return TEAM_CARS[id];
  }
  return null;
};
