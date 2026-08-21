export interface TeamDetail {
  chassis: string;
  powerUnit: string;
  color: string;
  fullName: string;
  description: string;
}

export const TEAM_DETAILS: Record<string, TeamDetail> = {
  ferrari: { fullName: 'Scuderia Ferrari HP', chassis: 'SF-26', powerUnit: 'Ferrari', color: '#ff2800', description: 'The oldest and most successful Formula 1 team.' },
  mercedes: { fullName: 'Mercedes-AMG Petronas F1 Team', chassis: 'W17', powerUnit: 'Mercedes', color: '#27f4d2', description: 'The Silver Arrows continue their pursuit of excellence.' },
  red_bull: { fullName: 'Oracle Red Bull Racing', chassis: 'RB22', powerUnit: 'Honda RBPT', color: '#3671C6', description: 'Defending champions pushing aerodynamic boundaries.' },
  mclaren: { fullName: 'McLaren Formula 1 Team', chassis: 'MCL40', powerUnit: 'Mercedes', color: '#ff8000', description: 'A historic team experiencing a massive resurgence.' },
  aston_martin: { fullName: 'Aston Martin Aramco F1 Team', chassis: 'AMR26', powerUnit: 'Honda', color: '#006f62', description: 'Combining state-of-the-art facilities with legendary ambition.' },
  alpine: { fullName: 'BWT Alpine F1 Team', chassis: 'A526', powerUnit: 'Renault', color: '#ff87bc', description: 'The French works team building momentum.' },
  williams: { fullName: 'Williams Racing', chassis: 'FW48', powerUnit: 'Mercedes', color: '#005aff', description: 'A legendary independent constructor rebuilding.' },
  rb: { fullName: 'Visa Cash App RB F1 Team', chassis: 'VCARB 03', powerUnit: 'Honda RBPT', color: '#6692FF', description: 'Red Bull sister team bringing fresh talent.' },
  sauber: { fullName: 'Stake F1 Team Kick Sauber', chassis: 'C46', powerUnit: 'Ferrari', color: '#00e701', description: 'Transitioning towards works status.' },
  haas: { fullName: 'MoneyGram Haas F1 Team', chassis: 'VF-26', powerUnit: 'Ferrari', color: '#ffffff', description: 'The American outfit targeting consistent points.' },
  audi: { fullName: 'Audi F1 Team', chassis: 'Audi F1-26', powerUnit: 'Audi', color: '#f50537', description: 'German manufacturer entering F1 as a works team.' },
  cadillac: { fullName: 'Cadillac F1 Team', chassis: 'Cadillac V-Series.R F1', powerUnit: 'Cadillac', color: '#ffb800', description: 'The newest addition bringing American automotive might.' }
};

export const getTeamDetails = (constructorId: string): TeamDetail => {
  if (TEAM_DETAILS[constructorId]) return TEAM_DETAILS[constructorId];
  if (constructorId === 'haas_f1_team') return TEAM_DETAILS.haas;
  if (constructorId === 'kick_sauber' || constructorId === 'alfa') return TEAM_DETAILS.sauber;
  if (constructorId === 'redbull') return TEAM_DETAILS.red_bull;
  if (constructorId === 'alphatauri') return TEAM_DETAILS.rb;
  return { fullName: constructorId.toUpperCase(), chassis: 'Unknown', powerUnit: 'Unknown', color: '#555555', description: 'Team information unavailable.' };
};
