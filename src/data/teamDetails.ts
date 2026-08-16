// src/data/teamDetails.ts

export interface TeamDetail {
  chassis: string;
  powerUnit: string;
  color: string;
  fullName: string;
  description: string;
}

export const TEAM_DETAILS: Record<string, TeamDetail> = {
  ferrari: {
    fullName: 'Scuderia Ferrari HP',
    chassis: 'SF-26',
    powerUnit: 'Ferrari',
    color: '#ff2800',
    description: 'The oldest and most successful Formula 1 team, looking to reclaim their championship glory in the new era.'
  },
  mercedes: {
    fullName: 'Mercedes-AMG Petronas F1 Team',
    chassis: 'W17',
    powerUnit: 'Mercedes',
    color: '#27f4d2',
    description: 'The Silver Arrows continue their pursuit of excellence with a revamped technical structure.'
  },
  red_bull: {
    fullName: 'Oracle Red Bull Racing',
    chassis: 'RB22',
    powerUnit: 'Honda RBPT',
    color: '#3671C6',
    description: 'Defending champions pushing the boundaries of aerodynamic design and race strategy.'
  },
  mclaren: {
    fullName: 'McLaren Formula 1 Team',
    chassis: 'MCL40',
    powerUnit: 'Mercedes',
    color: '#ff8000',
    description: 'A historic team experiencing a massive resurgence, challenging for top honors.'
  },
  aston_martin: {
    fullName: 'Aston Martin Aramco F1 Team',
    chassis: 'AMR26',
    powerUnit: 'Honda',
    color: '#006f62',
    description: 'Combining state-of-the-art facilities with legendary ambition.'
  },
  alpine: {
    fullName: 'BWT Alpine F1 Team',
    chassis: 'A526',
    powerUnit: 'Renault',
    color: '#ff87bc',
    description: 'The French works team building momentum with their unique technical approach.'
  },
  williams: {
    fullName: 'Williams Racing',
    chassis: 'FW48',
    powerUnit: 'Mercedes',
    color: '#005aff',
    description: 'A legendary independent constructor on a steady path of rebuilding and modernizing.'
  },
  rb: {
    fullName: 'Visa Cash App RB F1 Team',
    chassis: 'VCARB 03',
    powerUnit: 'Honda RBPT',
    color: '#6692FF',
    description: 'Red Bull\'s sister team, bringing aggressive development and fresh talent to the grid.'
  },
  sauber: {
    fullName: 'Stake F1 Team Kick Sauber',
    chassis: 'C46',
    powerUnit: 'Ferrari',
    color: '#00e701',
    description: 'Transitioning towards their future works status, laying the groundwork for a new era.'
  },
  haas: {
    fullName: 'MoneyGram Haas F1 Team',
    chassis: 'VF-26',
    powerUnit: 'Ferrari',
    color: '#ffffff',
    description: 'The American outfit maximizing efficiency and targeting consistent points finishes.'
  },
  audi: {
    fullName: 'Audi F1 Team',
    chassis: 'Audi F1-26',
    powerUnit: 'Audi',
    color: '#f50537',
    description: 'The highly anticipated German manufacturer entering Formula 1 as a full works team.'
  },
  cadillac: {
    fullName: 'Cadillac F1 Team',
    chassis: 'Cadillac V-Series.R F1',
    powerUnit: 'Cadillac',
    color: '#ffb800',
    description: 'The newest addition to the grid, bringing American automotive might to the pinnacle of motorsport.'
  }
};

export const getTeamDetails = (constructorId: string): TeamDetail => {
  // Try direct match
  if (TEAM_DETAILS[constructorId]) {
    return TEAM_DETAILS[constructorId];
  }
  
  // Handle aliases from API
  if (constructorId === 'haas_f1_team') return TEAM_DETAILS.haas;
  if (constructorId === 'kick_sauber' || constructorId === 'alfa') return TEAM_DETAILS.sauber;
  if (constructorId === 'redbull') return TEAM_DETAILS.red_bull;
  if (constructorId === 'alphatauri') return TEAM_DETAILS.rb;

  // Fallback
  return {
    fullName: constructorId.toUpperCase(),
    chassis: 'Unknown Chassis',
    powerUnit: 'Unknown PU',
    color: '#555555',
    description: 'Team information is currently unavailable.'
  };
};
