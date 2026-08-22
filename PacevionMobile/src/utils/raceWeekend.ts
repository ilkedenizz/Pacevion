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
  const isSprint = !!race.Sprint;

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
  const text = `${country || ''} ${locality || ''}`.toLowerCase();
  if (text.includes('italy') || text.includes('monza') || text.includes('imola')) return '🇮🇹';
  if (text.includes('monaco')) return '🇲🇨';
  if (text.includes('spain') || text.includes('barcelona') || text.includes('catalunya') || text.includes('madrid')) return '🇪🇸';
  if (text.includes('united kingdom') || text.includes('great britain') || text.includes('silverstone') || text.includes('uk')) return '🇬🇧';
  if (text.includes('belgium') || text.includes('spa')) return '🇧🇪';
  if (text.includes('netherlands') || text.includes('zandvoort')) return '🇳🇱';
  if (text.includes('austria') || text.includes('spielberg') || text.includes('red bull ring')) return '🇦🇹';
  if (text.includes('hungary') || text.includes('budapest') || text.includes('hungaroring')) return '🇭🇺';
  if (text.includes('australia') || text.includes('melbourne')) return '🇦🇺';
  if (text.includes('japan') || text.includes('suzuka')) return '🇯🇵';
  if (text.includes('china') || text.includes('shanghai')) return '🇨🇳';
  if (text.includes('bahrain') || text.includes('sakhir')) return '🇧🇭';
  if (text.includes('saudi') || text.includes('jeddah')) return '🇸🇦';
  if (text.includes('miami') || text.includes('vegas') || text.includes('austin') || text.includes('united states') || text.includes('usa')) return '🇺🇸';
  if (text.includes('canada') || text.includes('montreal')) return '🇨🇦';
  if (text.includes('azerbaijan') || text.includes('baku')) return '🇦🇿';
  if (text.includes('singapore')) return '🇸🇬';
  if (text.includes('mexico')) return '🇲🇽';
  if (text.includes('brazil') || text.includes('são paulo') || text.includes('interlagos')) return '🇧🇷';
  if (text.includes('qatar') || text.includes('losail')) return '🇶🇦';
  if (text.includes('uae') || text.includes('abu dhabi') || text.includes('yas marina')) return '🇦🇪';
  return '🏁';
}

export interface WeekendSessionItem {
  name: string;
  displayDate: string;
  displayTime: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function getWeekendSessions(race: Race, now: Date = new Date()): WeekendSessionItem[] {
  const isSprint = !!race.Sprint;
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


