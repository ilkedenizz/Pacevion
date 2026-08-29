import type { Race } from '../api/types';

export interface NextSessionInfo {
  race: Race;
  sessionName: string;
  sessionDate: Date;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function parseSessionDate(dateStr: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const time = timeStr ? timeStr.replace('Z', '') : '00:00:00';
  return new Date(`${dateStr}T${time}Z`);
}

export function formatRaceDateRange(race: Race): string {
  let startDate = parseSessionDate(race.date);
  const raceDate = parseSessionDate(race.date, race.time);

  if (race.FirstPractice?.date) {
    startDate = parseSessionDate(race.FirstPractice.date);
  }

  if (!startDate || !raceDate) return race.date;

  const startDay = startDate.getDate().toString().padStart(2, '0');
  const startMonth = MONTHS[startDate.getMonth()];
  
  const endDay = raceDate.getDate().toString().padStart(2, '0');
  const endMonth = MONTHS[raceDate.getMonth()];
  const year = raceDate.getFullYear();

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${endMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }
}

export function getNextSession(races: Race[], now: Date = new Date()): NextSessionInfo | null {
  if (!races || races.length === 0) return null;

  const upcomingRaces = races.filter(r => {
    const rDate = parseSessionDate(r.date, r.time);
    return rDate && rDate >= now;
  });

  if (upcomingRaces.length === 0) return null;

  const race = upcomingRaces[0];
  const isSprint = !!race.Sprint?.date;

  const sessions: { name: string; date: Date }[] = [];

  if (race.FirstPractice?.date) {
    const d = parseSessionDate(race.FirstPractice.date, race.FirstPractice.time);
    if (d) sessions.push({ name: 'Practice 1', date: d });
  }

  if (isSprint) {
    if (race.SprintQualifying?.date) {
      const d = parseSessionDate(race.SprintQualifying.date, race.SprintQualifying.time);
      if (d) sessions.push({ name: 'Sprint Qualifying', date: d });
    }
    if (race.Sprint?.date) {
      const d = parseSessionDate(race.Sprint.date, race.Sprint.time);
      if (d) sessions.push({ name: 'Sprint', date: d });
    }
    if (race.Qualifying?.date) {
      const d = parseSessionDate(race.Qualifying.date, race.Qualifying.time);
      if (d) sessions.push({ name: 'Qualifying', date: d });
    }
  } else {
    if (race.SecondPractice?.date) {
      const d = parseSessionDate(race.SecondPractice.date, race.SecondPractice.time);
      if (d) sessions.push({ name: 'Practice 2', date: d });
    }
    if (race.ThirdPractice?.date) {
      const d = parseSessionDate(race.ThirdPractice.date, race.ThirdPractice.time);
      if (d) sessions.push({ name: 'Practice 3', date: d });
    }
    if (race.Qualifying?.date) {
      const d = parseSessionDate(race.Qualifying.date, race.Qualifying.time);
      if (d) sessions.push({ name: 'Qualifying', date: d });
    }
  }

  const rDate = parseSessionDate(race.date, race.time);
  if (rDate) sessions.push({ name: 'Race', date: rDate });

  sessions.sort((a, b) => a.date.getTime() - b.date.getTime());

  const nextSession = sessions.find(s => s.date > now);

  if (nextSession) {
    return {
      race,
      sessionName: nextSession.name,
      sessionDate: nextSession.date
    };
  }

  return {
    race,
    sessionName: 'Race',
    sessionDate: rDate!
  };
}

export function getCountryFlag(country?: string, locality?: string): string {
  const c = (country || '').toLowerCase().trim();
  const l = (locality || '').toLowerCase().trim();
  const text = `${c} ${l}`;

  // Match specific countries/localities accurately without substring collisions
  if (c === 'uk' || c === 'united kingdom' || c === 'great britain' || l === 'silverstone' || text.includes('great britain') || text.includes('silverstone')) return '🇬🇧';
  if (c === 'japan' || l === 'suzuka' || text.includes('japan') || text.includes('suzuka')) return '🇯🇵';
  if (c === 'italy' || l === 'monza' || l === 'imola' || text.includes('monza') || text.includes('imola') || text.includes('italy')) return '🇮🇹';
  if (c === 'monaco' || l === 'monte-carlo' || text.includes('monaco')) return '🇲🇨';
  if (c === 'spain' || l === 'barcelona' || l === 'madrid' || l === 'montmeló' || text.includes('catalunya') || text.includes('spain')) return '🇪🇸';
  if (c === 'belgium' || l === 'spa' || text.includes('spa-francorchamps') || text.includes('belgium')) return '🇧🇪';
  if (c === 'netherlands' || l === 'zandvoort' || text.includes('netherlands') || text.includes('zandvoort')) return '🇳🇱';
  if (c === 'austria' || l === 'spielberg' || text.includes('red bull ring') || text.includes('austria')) return '🇦🇹';
  if (c === 'hungary' || l === 'budapest' || text.includes('hungaroring') || text.includes('hungary')) return '🇭🇺';
  if (c === 'australia' || l === 'melbourne' || text.includes('albert park') || text.includes('australia')) return '🇦🇺';
  if (c === 'china' || l === 'shanghai' || text.includes('china') || text.includes('shanghai')) return '🇨🇳';
  if (c === 'bahrain' || l === 'sakhir' || text.includes('bahrain') || text.includes('sakhir')) return '🇧🇭';
  if (c === 'saudi arabia' || l === 'jeddah' || text.includes('saudi') || text.includes('jeddah')) return '🇸🇦';
  if (c === 'usa' || c === 'united states' || l === 'miami' || l === 'austin' || l === 'las vegas' || text.includes('vegas') || text.includes('miami') || text.includes('americas') || text.includes('united states')) return '🇺🇸';
  if (c === 'canada' || l === 'montreal' || text.includes('montreal') || text.includes('canada')) return '🇨🇦';
  if (c === 'azerbaijan' || l === 'baku' || text.includes('baku') || text.includes('azerbaijan')) return '🇦🇿';
  if (c === 'singapore' || l === 'marina bay' || text.includes('singapore') || text.includes('marina bay')) return '🇸🇬';
  if (c === 'mexico' || l === 'mexico city' || text.includes('mexico')) return '🇲🇽';
  if (c === 'brazil' || l === 'são paulo' || text.includes('interlagos') || text.includes('brazil') || text.includes('são paulo')) return '🇧🇷';
  if (c === 'qatar' || l === 'losail' || text.includes('qatar') || text.includes('losail')) return '🇶🇦';
  if (c === 'uae' || c === 'united arab emirates' || l === 'abu dhabi' || text.includes('yas marina') || text.includes('abu dhabi')) return '🇦🇪';
  return '🏁';
}


export interface WeekendSessionItem {
  name: string;
  displayDate: string;
  displayTime: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function getWeekendSessions(race: Race, now: Date = new Date()): WeekendSessionItem[] {
  const isSprint = !!race.Sprint?.date;
  const sessions: { name: string; date: Date; timeStr: string }[] = [];

  const addSess = (name: string, dateStr?: string, timeStr?: string) => {
    if (!dateStr) return;
    const d = parseSessionDate(dateStr, timeStr);
    if (d) {
      sessions.push({
        name,
        date: d,
        timeStr: timeStr ? timeStr.replace('Z', ' UTC') : 'TBD'
      });
    }
  };

  addSess('Practice 1', race.FirstPractice?.date, race.FirstPractice?.time);

  if (isSprint) {
    addSess('Sprint Shootout', race.SprintQualifying?.date, race.SprintQualifying?.time);
    addSess('Sprint', race.Sprint?.date, race.Sprint?.time);
    addSess('Qualifying', race.Qualifying?.date, race.Qualifying?.time);
  } else {
    addSess('Practice 2', race.SecondPractice?.date, race.SecondPractice?.time);
    addSess('Practice 3', race.ThirdPractice?.date, race.ThirdPractice?.time);
    addSess('Qualifying', race.Qualifying?.date, race.Qualifying?.time);
  }

  addSess('Grand Prix', race.date, race.time);

  sessions.sort((a, b) => a.date.getTime() - b.date.getTime());

  return sessions.map((sess) => {
    const sessionEnd = new Date(sess.date.getTime() + 2 * 60 * 60 * 1000);
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';

    if (now >= sess.date && now <= sessionEnd) {
      status = 'current';
    } else if (now > sessionEnd) {
      status = 'completed';
    }

    const day = sess.date.getDate().toString().padStart(2, '0');
    const month = MONTHS[sess.date.getMonth()];

    return {
      name: sess.name,
      displayDate: `${day} ${month}`,
      displayTime: sess.timeStr,
      status
    };
  });
}

// ==========================================
// RACE STATE ENGINE
// ==========================================

export type SessionType = 'PRACTICE' | 'QUALIFYING' | 'SPRINT' | 'RACE';

export interface SessionInfo {
  name: string;
  shortName: string;
  type: SessionType;
  date: Date;
  endDate: Date;
}

export type RaceStateStatus = 
  | 'NO_RACE_WEEKEND'
  | 'UPCOMING_WEEKEND'
  | 'ACTIVE_SESSION'
  | 'WAITING_FOR_SESSION'
  | 'POST_RACE';

export interface CurrentRaceState {
  status: RaceStateStatus;
  race: Race | null;
  nextRace: Race | null;
  activeSession: SessionInfo | null;
  nextSession: SessionInfo | null;
  lastCompletedSession: SessionInfo | null;
  allSessions: SessionInfo[];
}

export function parseSessionDateSecure(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const time = timeStr ? timeStr.replace('Z', '') : '00:00:00';
  const d = new Date(`${dateStr}T${time}Z`);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function buildSessionsForRace(race: Race): SessionInfo[] {
  const sessions: SessionInfo[] = [];
  const isSprint = !!race.Sprint?.date;

  const add = (name: string, short: string, type: SessionType, d?: string, t?: string, durationMins: number = 60) => {
    const date = parseSessionDateSecure(d, t);
    if (date) {
      sessions.push({
        name,
        shortName: short,
        type,
        date,
        endDate: new Date(date.getTime() + durationMins * 60000)
      });
    }
  };

  add('Practice 1', 'FP1', 'PRACTICE', race.FirstPractice?.date, race.FirstPractice?.time, 60);

  if (isSprint) {
    add('Sprint Shootout', 'SQ', 'QUALIFYING', race.SprintQualifying?.date, race.SprintQualifying?.time, 45);
    add('Sprint', 'SPRINT', 'SPRINT', race.Sprint?.date, race.Sprint?.time, 60);
    add('Qualifying', 'QUALIFYING', 'QUALIFYING', race.Qualifying?.date, race.Qualifying?.time, 60);
  } else {
    add('Practice 2', 'FP2', 'PRACTICE', race.SecondPractice?.date, race.SecondPractice?.time, 60);
    add('Practice 3', 'FP3', 'PRACTICE', race.ThirdPractice?.date, race.ThirdPractice?.time, 60);
    add('Qualifying', 'QUALIFYING', 'QUALIFYING', race.Qualifying?.date, race.Qualifying?.time, 60);
  }

  add('Race', 'RACE', 'RACE', race.date, race.time, 120);

  // Sort chronologically
  sessions.sort((a, b) => a.date.getTime() - b.date.getTime());
  return sessions;
}

export function isWeekendCompleted(race: Race, now: Date = new Date()): boolean {
  const sessions = buildSessionsForRace(race);
  if (sessions.length === 0) return false;
  return sessions.every(s => now > s.endDate);
}

export function getCurrentRaceState(calendar: Race[], now: Date = new Date()): CurrentRaceState {
  if (!calendar || calendar.length === 0) {
    return { status: 'NO_RACE_WEEKEND', race: null, activeSession: null, nextSession: null, lastCompletedSession: null, allSessions: [], nextRace: null };
  }

  let targetRace: Race | null = null;
  
  for (const race of calendar) {
    const sessions = buildSessionsForRace(race);
    if (sessions.length === 0) continue;

    const firstSession = sessions[0];
    const lastSession = sessions[sessions.length - 1];

    const weekendStart = new Date(firstSession.date.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days before FP1
    const weekendEnd = new Date(lastSession.endDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after Race

    if (now >= weekendStart && now <= weekendEnd) {
      targetRace = race;
      break;
    }
  }

  if (!targetRace) {
    targetRace = calendar.find(r => {
      const sessions = buildSessionsForRace(r);
      if (sessions.length === 0) return false;
      return sessions[sessions.length - 1].endDate > now;
    }) || calendar[calendar.length - 1];
  }

  const allSessions = buildSessionsForRace(targetRace);
  if (allSessions.length === 0) {
    return { status: 'NO_RACE_WEEKEND', race: targetRace, activeSession: null, nextSession: null, lastCompletedSession: null, allSessions: [], nextRace: null };
  }

  const first = allSessions[0];
  const last = allSessions[allSessions.length - 1];

  let activeSession: SessionInfo | null = null;
  let nextSession: SessionInfo | null = null;
  let lastCompleted: SessionInfo | null = null;

  for (let i = 0; i < allSessions.length; i++) {
    const s = allSessions[i];
    if (now >= s.date && now <= s.endDate) {
      activeSession = s;
    } else if (now > s.endDate) {
      lastCompleted = s;
    } else if (now < s.date && !nextSession) {
      nextSession = s;
    }
  }

  let status: RaceStateStatus = 'NO_RACE_WEEKEND';

  if (now > last.endDate) {
    status = 'POST_RACE';
  } else if (now < first.date) {
    const hoursToFirst = (first.date.getTime() - now.getTime()) / 3600000;
    if (hoursToFirst < 72) {
      status = 'UPCOMING_WEEKEND';
    } else {
      status = 'NO_RACE_WEEKEND';
    }
  } else if (activeSession) {
    status = 'ACTIVE_SESSION';
  } else if (nextSession) {
    status = 'WAITING_FOR_SESSION';
  }

  const nextRace = calendar.find(r => {
    const sessions = buildSessionsForRace(r);
    if (sessions.length === 0) return false;
    return sessions[sessions.length - 1].endDate > now;
  }) || null;

  return {
    status,
    race: targetRace,
    nextRace,
    activeSession,
    nextSession,
    lastCompletedSession: lastCompleted,
    allSessions
  };
}


