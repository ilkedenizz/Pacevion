export type Language = 'EN' | 'TR';

export const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Navigation
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    drivers: 'Drivers',
    constructors: 'Constructors',
    standings: 'Standings',
    overview: 'Overview',
    championship: 'Championship',
    learn: 'LEARN F1',

    // Dashboard & Global
    seasonOverview: 'Season Overview',
    realTimeStats: 'Real-time statistics, calendars, and championship standings.',
    totalRounds: 'Total Rounds',
    completedGps: 'Completed GPs',
    leaderPoints: 'Leader Points',
    teamsEntered: 'Teams Entered',
    lastRaceResult: 'Last Race Result',
    upcomingSchedule: 'Upcoming Schedule',
    details: 'Details',
    fullCalendar: 'Full Calendar',
    upcoming: 'UPCOMING',
    completed: 'COMPLETED',
    liveFeed: 'LIVE FEED',
    season: 'SEASON',

    // About Section
    aboutTitle: 'About Pacevion',
    aboutSubtitle: 'Formula 1 data, made clearer.',
    aboutP1: 'Pacevion is a modern Formula 1 platform built for fans who want to explore the sport beyond the finish line.',
    aboutP2: 'Follow race results, qualifying sessions, driver standings, constructor standings and the full F1 calendar — all in one clean and focused experience.',
    aboutP3: 'From every lap to the championship battle, Pacevion turns Formula 1 data into an experience that\'s simple to explore and easy to understand.',
    aboutHighlight: '"Explore the season. Follow the standings. Experience every race."',
    raceData: 'Race Data',
    raceDataDesc: 'Race results, qualifying and fastest laps',
    championshipDesc: 'Driver & constructor standings',
    fullCalendarDesc: 'Explore every race weekend of the season',

    // Footer
    footerDisclaimer: 'Independent F1 fan platform. Not affiliated with the FIA or Formula 1 companies.',
    allRightsReserved: 'All rights reserved.',
  },
  TR: {
    // Navigation
    dashboard: 'Panel',
    calendar: 'Takvim',
    drivers: 'Pilotlar',
    constructors: 'Takımlar',
    standings: 'Puan Durumu',
    overview: 'Genel Bakış',
    championship: 'Şampiyona',
    learn: 'F1 REHBERİ',

    // Dashboard & Global
    seasonOverview: 'Sezon Özeti',
    realTimeStats: 'Gerçek zamanlı istatistikler, takvimler ve şampiyona puan durumları.',
    totalRounds: 'Toplam Yarış',
    completedGps: 'Tamamlanan GP',
    leaderPoints: 'Lider Puanı',
    teamsEntered: 'Katılan Takım',
    lastRaceResult: 'Son Yarış Sonucu',
    upcomingSchedule: 'Gelecek Yarışlar',
    details: 'Detaylar',
    fullCalendar: 'Tam Takvim',
    upcoming: 'YAKLAŞAN',
    completed: 'TAMAMLANDI',
    liveFeed: 'CANLI YAYIN',
    season: 'SEZON',

    // About Section
    aboutTitle: 'Pacevion Hakkında',
    aboutSubtitle: 'Formula 1 verileri, daha net.',
    aboutP1: 'Pacevion, sporu bitiş çizgisinin ötesinde keşfetmek isteyen hayranlar için tasarlanmış modern bir Formula 1 platformudur.',
    aboutP2: 'Yarış sonuçlarını, sıralama turlarını, sürücüler şampiyonasını, markalar şampiyonasını ve tüm F1 takvimini tek bir temiz ve odaklanmış deneyimde takip edin.',
    aboutP3: 'Her turdan şampiyonluk mücadelesine kadar Pacevion, Formula 1 verilerini keşfetmesi basit ve anlaşılması kolay bir deneyime dönüştürür.',
    aboutHighlight: '"Sezonu keşfedin. Puan durumunu takip edin. Her yarışı yaşayın."',
    raceData: 'Yarış Verileri',
    raceDataDesc: 'Yarış sonuçları, sıralama ve en hızlı turlar',
    championshipDesc: 'Sürücü ve takım puan durumları',
    fullCalendarDesc: 'Sezonun her yarış hafta sonunu keşfedin',

    // Footer
    footerDisclaimer: 'Bağımsız F1 hayran platformu. FIA veya Formula 1 şirketleriyle resmi bir bağı bulunmamaktadır.',
    allRightsReserved: 'Tüm hakları saklıdır.',
  }
};
