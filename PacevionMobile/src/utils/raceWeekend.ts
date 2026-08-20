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
