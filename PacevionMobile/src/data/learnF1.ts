// src/data/learnF1.ts - Centralized Educational Content for Learn F1

export interface TechnicalHotspot {
  id: string;
  name: string;
  badge: string;
  summary: string;
  details: string;
}

export interface BasicTopic {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface RegulationRule {
  id: string;
  title: string;
  tag: string;
  summary: string;
  details: string;
}

export const TECHNICAL_HOTSPOTS: TechnicalHotspot[] = [
  {
    id: 'aero',
    name: 'AERO',
    badge: 'AERODYNAMICS',
    summary: 'Controls airflow around and under the car to maximize cornering grip.',
    details: 'Front and rear wings create downward air pressure (downforce), pushing tyres onto the track surface so drivers can corner at speeds up to 300 km/h without sliding.',
  },
  {
    id: 'power_unit',
    name: 'POWER UNIT',
    badge: '1.6L V6 TURBO HYBRID',
    summary: 'High-efficiency 1000+ HP hybrid powertrain combining ICE & MGU-K electric drive.',
    details: 'The modern F1 engine pairs a 1.6-litre turbocharged internal combustion engine with powerful energy recovery systems that capture kinetic heat and braking power into a battery.',
  },
  {
    id: 'tyres',
    name: 'TYRES',
    badge: 'PIRELLI COMPOUNDS',
    summary: 'Bespoke slick compounds engineered for maximum friction and controlled degradation.',
    details: 'Pirelli supplies five dry slick compounds (C1 to C5 from hardest to softest) plus Intermediate and Wet tyres. Managing thermal degradation is key to race strategy.',
  },
  {
    id: 'brakes',
    name: 'BRAKES',
    badge: 'CARBON-CARBON',
    summary: 'Carbon rotors operating over 1,000Â°C delivering up to 5G deceleration.',
    details: 'Constructed from carbon-composite materials, F1 brakes can slow a car from 330 km/h to 100 km/h in under 2.5 seconds, generating immense thermal energy.',
  },
  {
    id: 'floor',
    name: 'FLOOR',
    badge: 'GROUND EFFECT',
    summary: 'Venturi tunnels under the chassis pull the car toward the track.',
    details: 'Air passing through shaped tunnels under the floor accelerates, creating a low-pressure area (Bernoulli principle) that sucks the car down to the track for cornering stability.',
  },
  {
    id: 'suspension',
    name: 'SUSPENSION',
    badge: 'PUSH-ROD / PULL-ROD',
    summary: 'Precision geometry maintaining ride height and aerodynamic stability.',
    details: 'F1 suspension systems maintain a stable aerodynamic platform, preventing excessive pitch and roll while ensuring optimal tyre contact with the road.',
  },
  {
    id: 'drs_active',
    name: 'DRS / ACTIVE AERO',
    badge: 'DRAG REDUCTION',
    summary: 'Adjustable wing flaps that reduce aerodynamic drag to aid overtaking.',
    details: 'When within 1 second of a car ahead in designated zones, the driver opens a rear wing flap, shedding drag and gaining 10-12 km/h top speed for overtaking.',
  },
];

export const F1_BASICS: BasicTopic[] = [
  {
    id: 'drs',
    title: 'WHAT IS DRS?',
    category: 'OVERTAKING',
    description: 'Drag Reduction System opens a flap on the rear wing to reduce drag and increase top speed on straights when trailing within 1 second.',
  },
  {
    id: 'downforce',
    title: 'WHAT IS DOWNFORCE?',
    category: 'PHYSICAL GRIP',
    description: 'Aerodynamic force pushing the car downward into the track surface, allowing high-speed cornering far beyond mechanical tyre grip.',
  },
  {
    id: 'porpoising',
    title: 'WHAT IS PORPOISING?',
    category: 'AERO OSCILLATION',
    description: 'A rapid bouncing motion caused by ground-effect airflow stalling under the floor at high speeds and repeatedly resetting.',
  },
  {
    id: 'apex',
    title: 'WHAT IS APEX?',
    category: 'CORNERING',
    description: 'The innermost point of a turn on the ideal racing line where the car is closest to the inside curb before accelerating out.',
  },
  {
    id: 'racing_line',
    title: 'WHAT IS A RACING LINE?',
    category: 'NAVIGATION',
    description: 'The fastest path around a track, balancing entry angle, corner apex, and exit speed to minimize lap time.',
  },
  {
    id: 'safety_car',
    title: 'WHAT IS A SAFETY CAR?',
    category: 'RACE CONTROL',
    description: 'A pace vehicle deployed by race control to group the field and neutralize speeds during track hazards or inclement weather.',
  },
  {
    id: 'undercut',
    title: 'WHAT IS UNDERCUT?',
    category: 'STRATEGY',
    description: 'Pitting earlier than a rival to use fresh tyres on out-laps and leapfrog ahead when the rival makes their later pit stop.',
  },
  {
    id: 'overcut',
    title: 'WHAT IS OVERCUT?',
    category: 'STRATEGY',
    description: 'Staying out longer on old tyres when they remain faster than cold fresh tyres, gaining track position before pitting.',
  },
];

export const REGULATIONS_2026: RegulationRule[] = [
  {
    id: 'active_aero',
    title: 'ACTIVE AERODYNAMICS',
    tag: 'AERO SHIFT',
    summary: 'Moveable front & rear wings switching between High-Downforce and Low-Drag modes.',
    details: '2026 cars feature dual active aero modes: Z-Mode for maximum cornering downforce and X-Mode for low-drag straightline speed on all straights.',
  },
  {
    id: 'new_pu',
    title: 'NEW POWER UNIT',
    tag: '50% ELECTRIC',
    summary: 'Removal of MGU-H with a 350kW electric motor producing almost half total power.',
    details: 'The 2026 engine eliminates the complex MGU-H turbo-generator while expanding the MGU-K electric kinetic output nearly threefold to 350kW (470 HP).',
  },
  {
    id: 'sustainable_fuel',
    title: '100% SUSTAINABLE FUEL',
    tag: 'NET ZERO',
    summary: 'Drop-in advanced bio-fuels and synthetic e-fuels with zero net carbon emissions.',
    details: 'F1 transitions entirely to 100% sustainable fuels derived from non-food biomass or carbon capture technology, creating no net fossil carbon.',
  },
  {
    id: 'nimble_car',
    title: 'NIMBLE CAR CONCEPT',
    tag: 'CHASSIS REDUCTION',
    summary: 'Shorter wheelbase, narrower track, and lighter minimum weight limit.',
    details: '2026 rules reduce car width by 10cm (to 1900mm), wheelbase by 20cm (to 3400mm), and target a 30kg reduction in overall minimum weight.',
  },
];
