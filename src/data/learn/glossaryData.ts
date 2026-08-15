export interface GlossaryTerm {
  term: string;
  en: string;
  tr: string;
}

export const glossaryData: GlossaryTerm[] = [
  { term: 'Apex', en: 'The innermost point of the driving line through a corner.', tr: 'Bir virajda ideal sürüş çizgisinin en içteki noktası.' },
  { term: 'Box', en: 'A radio instruction telling the driver to enter the pit lane.', tr: 'Sürücüye pit yoluna girmesini söyleyen telsiz komutu.' },
  { term: 'DNF', en: 'Did Not Finish. When a driver fails to complete the race.', tr: 'Did Not Finish. Sürücünün yarışı tamamlayamaması.' },
  { term: 'DNS', en: 'Did Not Start. When a driver fails to start the race.', tr: 'Did Not Start. Sürücünün yarışa başlayamaması.' },
  { term: 'DSQ', en: 'Disqualified. Removed from the race results due to a rule infringement.', tr: 'Diskalifiye. Kural ihlali nedeniyle yarıştan ihraç edilme.' },
  { term: 'DRS', en: 'Drag Reduction System. An adjustable flap on the rear wing that reduces drag and increases top speed to aid overtaking.', tr: 'Drag Reduction System. Geçişleri kolaylaştırmak için arka kanatta açılan ve düzlük hızını artıran hareketli kapakçık.' },
  { term: 'Gap', en: 'The time difference between two cars on track.', tr: 'Pistteki iki araç arasındaki zaman farkı.' },
  { term: 'Graining', en: 'When small pieces of rubber tear off the tyre and stick back to the surface, reducing grip.', tr: 'Lastik yüzeyinden kopan küçük kauçuk parçalarının tekrar lastiğe yapışarak yol tutuşunu azaltması.' },
  { term: 'Marbles', en: 'Small pieces of rubber that accumulate off the racing line.', tr: 'İdeal yarış çizgisinin dışına biriken küçük lastik parçaları.' },
  { term: 'Parc Fermé', en: 'A secure area where cars are kept before the race. Teams cannot make major changes to the car here.', tr: 'Yarış öncesi araçların tutulduğu güvenli alan. Takımlar araçlarda büyük değişiklik yapamaz.' },
  { term: 'Pit Window', en: 'The estimated range of laps when a driver should make their planned pit stop.', tr: 'Planlanan pit stopun yapılması gereken tahmini tur aralığı.' },
  { term: 'Pole Position', en: 'The first starting place on the grid, awarded to the fastest driver in qualifying.', tr: 'Sıralama turlarında en hızlı olan pilotun kazandığı yarışa ilk sıradan başlama hakkı.' },
  { term: 'Sector', en: 'The track is divided into three sections for timing purposes.', tr: 'Zaman ölçümü için pistin bölündüğü üç ayrı kısımdan her biri.' },
  { term: 'Slipstream', en: 'The area of lower air pressure behind a fast-moving car, which a following car can use to gain speed.', tr: 'Hızlı giden bir aracın arkasında oluşan ve takip eden aracın hızlanmak için kullanabileceği düşük hava basıncı alanı.' },
  { term: 'Stint', en: 'A period of consecutive laps driven on one set of tyres.', tr: 'Tek bir lastik setiyle arka arkaya atılan turların tamamı.' },
  { term: 'Track Limits', en: 'The white lines defining the edge of the circuit. Drivers must keep at least one part of a tyre on or within these lines.', tr: 'Pistin sınırlarını belirleyen beyaz çizgiler. Araçların en az bir tekerleği bu çizgiler içinde kalmalıdır.' },
  { term: 'Undercut', en: 'Pitting earlier than a rival to use fresh tyres and set faster lap times, emerging ahead when the rival pits.', tr: 'Rakipten daha erken pit yaparak taze lastiklerle hızlanmak ve rakip pite girdiğinde onun önüne geçme stratejisi.' },
  { term: 'Overcut', en: 'Staying out longer on old tyres when a rival pits, trying to build a gap before making a stop to stay ahead.', tr: 'Rakip pit yaptığında eski lastiklerle pistte kalarak farkı açıp, pit sonrası rakibin önünde kalma stratejisi.' },
  { term: 'VSC', en: 'Virtual Safety Car. Imposes a speed limit around the track rather than deploying a physical car.', tr: 'Sanal Güvenlik Aracı. Gerçek güvenlik aracı yerine tüm pistte bir hız limiti uygular.' },
];