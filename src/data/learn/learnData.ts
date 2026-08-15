export const learnTranslations = {
  EN: {
    heroTitle: 'F1 KNOWLEDGE CENTER',
    heroHeadline: 'LEARN FORMULA 1',
    heroSub1: 'Understand the sport.',
    heroSub2: 'Read the data.',
    heroSub3: 'Follow every race.',
    startHere: 'START HERE',
    
    // Path steps
    pathBasics: 'F1 BASICS',
    pathWeekend: 'RACE WEEKEND',
    pathRules: 'FLAGS & RULES',
    pathTyres: 'TYRES',
    pathStrategy: 'RACE STRATEGY',
    pathCar: 'THE F1 CAR',
    
    // F1 Basics
    basicsTitle: 'F1 Basics',
    basicsItems: [
      { q: 'What is Formula 1?', a: 'The highest class of international racing for open-wheel single-seater formula racing cars.', takeaway: 'It\'s the pinnacle of motorsport.' },
      { q: 'What is a Grand Prix?', a: 'A race event held over a weekend, culminating in the main race on Sunday.', takeaway: 'A Grand Prix is the entire event, not just the race.' },
      { q: 'How does the season work?', a: 'A series of races (Grands Prix) held worldwide over a calendar year. Drivers and teams accumulate points.', takeaway: 'Points mean prizes at the end of the year.' },
      { q: 'Driver vs Constructor?', a: 'Drivers compete for the World Drivers\' Championship. Teams (Constructors) compete for the World Constructors\' Championship based on the combined points of their two drivers.', takeaway: 'Two championships are fought simultaneously.' }
    ],

    // Race Weekend
    weekendTitle: 'Race Weekend Structure',
    practice: 'Practice',
    practiceDesc: 'Three sessions (FP1, FP2, FP3) for teams to set up the car and test tyres.',
    qualifying: 'Qualifying',
    qualifyingDesc: 'Determines the starting grid for the race through three knockout phases (Q1, Q2, Q3).',
    sprintQuali: 'Sprint Qualifying',
    sprintQualiDesc: 'A shorter qualifying session determining the grid for the Sprint.',
    sprint: 'Sprint',
    sprintDesc: 'A short, fast-paced race covering 100km, offering championship points to the top 8.',
    race: 'Grand Prix',
    raceDesc: 'The main event on Sunday where full points are awarded.',
    sprintNote: '* Sprint events only happen at selected weekends. Normal weekends have 3 Practice sessions instead.',

    // Points
    pointsTitle: 'Points System',
    pos: 'POSITION',
    pts: 'POINTS',
    normalRace: 'GRAND PRIX',

    // Driver vs Constructor
    dvcTitle: 'Driver vs Constructor',
    dvcDriver: 'DRIVER CHAMPIONSHIP',
    dvcDriverDesc: 'Awarded to the individual driver who scores the most points throughout the season.',
    dvcConstructor: 'CONSTRUCTORS\' CHAMPIONSHIP',
    dvcConstructorDesc: 'Awarded to the team whose drivers score the most combined points. This determines the team\'s prize money.',

    // Flags
    flagsTitle: 'Flags & Rules',
    flags: [
      { color: 'GREEN', meaning: 'Track is clear.', when: 'Start of a session or after a hazard is cleared.', hex: '#10b981' },
      { color: 'YELLOW', meaning: 'Danger ahead. Reduce speed, no overtaking.', when: 'A car is stopped or debris is on track.', hex: '#f59e0b' },
      { color: 'RED', meaning: 'Session stopped.', when: 'Conditions are too dangerous to continue (crash or extreme weather).', hex: '#ef4444' },
      { color: 'BLUE', meaning: 'Let faster car pass.', when: 'A lapped driver must let the race leaders through.', hex: '#3b82f6' },
      { color: 'BLACK & WHITE', meaning: 'Warning for unsportsmanlike behavior.', when: 'Exceeding track limits repeatedly or dangerous driving.', hex: '#a8a29e' },
      { color: 'CHEQUERED', meaning: 'End of the session.', when: 'The leader completes the final lap.', pattern: true }
    ],

    // Tyres
    tyresTitle: 'Tyres & Grip',
    tyreDegradation: 'Tyre Degradation',
    tyreDegradationDesc: 'As tyres wear out, they lose grip and lap times get slower. This forces drivers to pit for fresh tyres.',
    dryTyres: 'DRY TYRES',
    wetTyres: 'WET TYRES',
    soft: 'SOFT',
    medium: 'MEDIUM',
    hard: 'HARD',
    inter: 'INTERMEDIATE',
    wet: 'WET',

    // DRS
    drsTitle: 'DRS & Overtaking',
    drsWhat: 'What is DRS?',
    drsDesc: 'Drag Reduction System. A flap on the rear wing opens to reduce drag, giving the car a speed boost of up to 15-20 km/h.',
    drsWhen: 'When can it be used?',
    drsWhenDesc: 'Only in designated DRS zones, and only if the driver is less than 1 second behind the car ahead at the detection point.',
    slipstream: 'Slipstream',
    slipstreamDesc: 'Driving closely behind another car to benefit from their aerodynamic wake, reducing air resistance.',
    dirtyAir: 'Dirty Air',
    dirtyAirDesc: 'Turbulent air left behind a fast-moving car, making it harder for the following car to corner effectively.',

    // Pit Stops
    pitTitle: 'Pit Stops',
    pitDesc: 'During a race, cars enter the pit lane to change tyres or repair damage.',
    pitTimeline: ['BOX', 'BRAKE', 'TYRE CHANGE', 'RELEASE'],

    // Strategy
    strategyTitle: 'Race Strategy',
    strategyDesc: 'Deciding when to pit and which tyres to use is critical to winning.',
    undercut: 'UNDERCUT',
    undercutDesc: 'Pitting earlier than a rival to use fresh tyres and set faster lap times, emerging ahead when the rival pits later.',
    overcut: 'OVERCUT',
    overcutDesc: 'Staying out longer on old tyres when a rival pits, trying to build a gap or taking advantage of a safety car before stopping.',
    pitWindow: 'Pit Window',
    safetyCarStrat: 'Safety Car Strategy',

    // Car & PU
    carTitle: 'The F1 Car (2026 Era)',
    puTitle: 'Power Unit',
    puDesc: 'Modern F1 cars use highly efficient hybrid power units.',
    puParts: ['ICE (Internal Combustion Engine)', 'MGU-K (Kinetic Motor Generator)', 'Energy Store (Battery)'],

    // Race Data
    dataTitle: 'How to Read F1 Data',
    dataGap: 'GAP',
    dataGapDesc: 'The time difference to the race leader.',
    dataInterval: 'INTERVAL',
    dataIntervalDesc: 'The time difference to the car immediately ahead.',
    dataSector: 'SECTOR TIME',
    dataSectorDesc: 'The track is split into 3 sectors. Purple means overall fastest, green means personal best.',

    // Glossary
    glossaryTitle: 'F1 Glossary',
    sources: 'SOURCES & REFERENCES: FIA 2026 Sporting & Technical Regulations, Formula 1 Official Data.'
  },
  TR: {
    heroTitle: 'F1 BİLGİ MERKEZİ',
    heroHeadline: 'FORMULA 1\'İ ÖĞREN',
    heroSub1: 'Sporu anla.',
    heroSub2: 'Verileri oku.',
    heroSub3: 'Her yarışı takip et.',
    startHere: 'BURADAN BAŞLA',
    
    // Path steps
    pathBasics: 'F1 TEMELLERİ',
    pathWeekend: 'YARIŞ HAFTA SONU',
    pathRules: 'BAYRAKLAR VE KURALLAR',
    pathTyres: 'LASTİKLER',
    pathStrategy: 'YARIŞ STRATEJİSİ',
    pathCar: 'F1 ARACI',
    
    // F1 Basics
    basicsTitle: 'F1 Temelleri',
    basicsItems: [
      { q: 'Formula 1 nedir?', a: 'Açık tekerlekli, tek koltuklu yarış araçlarının mücadele ettiği en üst düzey uluslararası motor sporu sınıfı.', takeaway: 'Motor sporlarının zirvesidir.' },
      { q: 'Grand Prix nedir?', a: 'Pazar günkü ana yarışla zirveye ulaşan ve tüm hafta sonunu kapsayan yarış etkinliği.', takeaway: 'Sadece yarışı değil, tüm hafta sonunu ifade eder.' },
      { q: 'Sezon nasıl işler?', a: 'Bir yıl boyunca dünyanın dört bir yanında düzenlenen yarışlar dizisi. Pilotlar ve takımlar puan toplar.', takeaway: 'Yıl sonunda en çok puanı toplayan şampiyon olur.' },
      { q: 'Sürücü ve Takım farkı?', a: 'Sürücüler bireysel şampiyonluk için yarışırken, takımlar (Constructors) iki sürücüsünün topladığı toplam puanla Markalar Şampiyonluğu için yarışır.', takeaway: 'Aynı anda iki ayrı şampiyona mücadelesi verilir.' }
    ],

    // Race Weekend
    weekendTitle: 'Yarış Hafta Sonu Düzeni',
    practice: 'Antrenman (Practice)',
    practiceDesc: 'Takımların araç ayarlarını yaptığı ve lastikleri test ettiği üç seans (FP1, FP2, FP3).',
    qualifying: 'Sıralama (Qualifying)',
    qualifyingDesc: 'Üç aşamalı (Q1, Q2, Q3) eleme sistemiyle pazar günkü yarışın başlangıç gridini belirler.',
    sprintQuali: 'Sprint Sıralama',
    sprintQualiDesc: 'Sprint yarışının başlangıç dizilişini belirleyen daha kısa sıralama turları.',
    sprint: 'Sprint',
    sprintDesc: 'İlk 8\'e şampiyona puanı veren, yaklaşık 100km uzunluğunda kısa ve tempolu yarış.',
    race: 'Grand Prix',
    raceDesc: 'Pazar günü koşulan ve tam puan dağıtılan ana yarış.',
    sprintNote: '* Sprint etkinlikleri sadece seçili hafta sonlarında yapılır. Normal hafta sonlarında bunun yerine 3 antrenman seansı bulunur.',

    // Points
    pointsTitle: 'Puan Sistemi',
    pos: 'SIRA',
    pts: 'PUAN',
    normalRace: 'GRAND PRIX',

    // Driver vs Constructor
    dvcTitle: 'Sürücü vs Marka',
    dvcDriver: 'SÜRÜCÜLER ŞAMPİYONASI',
    dvcDriverDesc: 'Sezon boyunca bireysel olarak en çok puanı toplayan pilota verilir.',
    dvcConstructor: 'MARKALAR ŞAMPİYONASI',
    dvcConstructorDesc: 'İki pilotunun toplamıyla en çok puanı alan takıma verilir. Takımın sezon sonu para ödülünü belirler.',

    // Flags
    flagsTitle: 'Bayraklar ve Kurallar',
    flags: [
      { color: 'YEŞİL', meaning: 'Pist temiz.', when: 'Bir seans başladığında veya tehlike geçtiğinde.', hex: '#10b981' },
      { color: 'SARI', meaning: 'İleride tehlike var. Hızlanma, geçiş yasak.', when: 'Pistte duran araç veya parça olduğunda.', hex: '#f59e0b' },
      { color: 'KIRMIZI', meaning: 'Seans durduruldu.', when: 'Yarışa devam edilemeyecek kadar tehlikeli durumlar (kazalar veya aşırı yağmur).', hex: '#ef4444' },
      { color: 'MAVİ', meaning: 'Hızlı araca yol ver.', when: 'Tur yiyen pilotun, liderlere yol vermesi gerektiğinde.', hex: '#3b82f6' },
      { color: 'SİYAH BEYAZ', meaning: 'Sportmenlik dışı davranış uyarısı.', when: 'Pist sınırlarının sürekli ihlali veya tehlikeli sürüş.', hex: '#a8a29e' },
      { color: 'DAMALI', meaning: 'Seansın sonu.', when: 'Lider son turu tamamladığında.', pattern: true }
    ],

    // Tyres
    tyresTitle: 'Lastikler ve Yol Tutuş',
    tyreDegradation: 'Lastik Aşınması (Degradation)',
    tyreDegradationDesc: 'Lastikler kullanıldıkça aşınır, yol tutuşu azalır ve tur zamanları yavaşlar. Bu nedenle pilotlar yeni lastik için pit yapmak zorundadır.',
    dryTyres: 'KURU ZEMİN',
    wetTyres: 'ISLAK ZEMİN',
    soft: 'YUMUŞAK',
    medium: 'ORTA',
    hard: 'SERT',
    inter: 'GEÇİŞ',
    wet: 'YOĞUN YAĞMUR',

    // DRS
    drsTitle: 'DRS ve Geçişler',
    drsWhat: 'DRS nedir?',
    drsDesc: 'Drag Reduction System. Arka kanattaki kapağın açılarak hava direncini azaltması ve araca düzlükte hız avantajı sağlamasıdır.',
    drsWhen: 'Ne zaman kullanılabilir?',
    drsWhenDesc: 'Sadece belirlenmiş DRS alanlarında ve öndeki araçla aradaki fark 1 saniyenin altındaysa.',
    slipstream: 'Hava Koridoru (Slipstream)',
    slipstreamDesc: 'Öndeki aracın yardığı havanın arkasında oluşan düşük basınçlı alana girerek hava direncini azaltmak ve hızlanmak.',
    dirtyAir: 'Kirli Hava (Dirty Air)',
    dirtyAirDesc: 'Öndeki aracın arkasında bıraktığı türbülanslı hava. Arkadaki aracın virajlarda yol tutuşunu olumsuz etkiler.',

    // Pit Stops
    pitTitle: 'Pit Stoplar',
    pitDesc: 'Yarış sırasında araçların lastik değiştirmek veya hasar onarmak için pit yoluna girmesi.',
    pitTimeline: ['BOX', 'FREN', 'LASTİK DEĞİŞİMİ', 'ÇIKIŞ'],

    // Strategy
    strategyTitle: 'Yarış Stratejisi',
    strategyDesc: 'Ne zaman pit yapılacağı ve hangi lastiğin kullanılacağı yarışı kazanmak için kritik öneme sahiptir.',
    undercut: 'UNDERCUT (Erken Pit)',
    undercutDesc: 'Rakibinden daha erken pit yaparak taze lastiklerin hız avantajını kullanmak ve rakip pitten çıktığında önüne geçmek.',
    overcut: 'OVERCUT (Geç Pit)',
    overcutDesc: 'Rakip pit yaptığında eski lastiklerle pistte kalarak temiz havada hızlı turlar atmak ve pitten rakibin önünde çıkmak.',
    pitWindow: 'Pit Aralığı',
    safetyCarStrat: 'Güvenlik Aracı Stratejisi',

    // Car & PU
    carTitle: 'F1 Aracı (2026 Kuralları)',
    puTitle: 'Güç Ünitesi (Power Unit)',
    puDesc: 'Modern F1 araçları yüksek verimliliğe sahip hibrit güç üniteleri kullanır.',
    puParts: ['ICE (İçten Yanmalı Motor)', 'MGU-K (Kinetik Enerji Geri Kazanım)', 'Batarya'],

    // Race Data
    dataTitle: 'F1 Verileri Nasıl Okunur?',
    dataGap: 'GAP',
    dataGapDesc: 'Yarış lideriyle olan zaman farkı.',
    dataInterval: 'INTERVAL',
    dataIntervalDesc: 'Hemen öndeki araçla olan zaman farkı.',
    dataSector: 'SEKTÖR ZAMANI',
    dataSectorDesc: 'Pist 3 sektöre ayrılır. Mor renk o seanstaki en hızlı zamanı, yeşil renk pilotun kendi en iyisini gösterir.',

    // Glossary
    glossaryTitle: 'F1 Sözlüğü',
    sources: 'KAYNAKLAR: FIA 2026 Sportif & Teknik Kuralları, Resmi Formula 1 Verileri.'
  }
};
