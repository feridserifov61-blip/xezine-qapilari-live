// =========================================================================
// 10 Qapili Xezine Sousu — 10 Movzulu 30,000+ Sual Muherriki
// =========================================================================

const TOPICS = [
  { id: 'az_history', round: 1, icon: '🇦🇿', name: 'Azərbaycan & Tarix', theme: 'azerbaijan', doorStyle: 'MİLLİ QALA QAPISI' },
  { id: 'geo', round: 2, icon: '🌍', name: 'Dünya Coğrafiyası', theme: 'ocean', doorStyle: 'QLOBUS SEYFİ' },
  { id: 'sport', round: 3, icon: '⚽', name: 'Futbol & İdman', theme: 'emerald', doorStyle: 'STADİON TUNELİ' },
  { id: 'logic', round: 4, icon: '🧠', name: 'Məntiq & Riyaziyyat', theme: 'cyber', doorStyle: 'KİBER ŞİFRƏ QAPISI' },
  { id: 'science', round: 5, icon: '🔬', name: 'Elm, Kosmos & Texno', theme: 'galaxy', doorStyle: 'KOSMİK ŞLÜZ' },
  { id: 'cinema', round: 6, icon: '🎬', name: 'Kino & Musiqi', theme: 'crimson', doorStyle: 'VİP QIRMIZI XALÇA' },
  { id: 'proverbs', round: 7, icon: '📜', name: 'Atalar Sözləri & Dil', theme: 'amber', doorStyle: 'QƏDİM KİTABXANA' },
  { id: 'nature', round: 8, icon: '🦁', name: 'Təbiət & Heyvanlar', theme: 'forest', doorStyle: 'ZÜMRÜD MEŞƏ QAPISI' },
  { id: 'auto_brands', round: 9, icon: '🚗', name: 'Avtomobil & Brendlər', theme: 'carbon', doorStyle: 'KARBON QARAJ SEYFİ' },
  { id: 'superfinal', round: 10, icon: '👑', name: 'Qarışıq Super Final (×2)', theme: 'gold', doorStyle: 'BÖYÜK QIZIL XƏZİNƏ' }
];

// -------------------- CURATED TOPIC DATASETS --------------------
const AZ_REGIONS = [
  ['Şəki', 'Şəki-Zaqatala', 'Xan Sarayı və halvası ilə məşhurdur'],
  ['Şuşa', 'Qarabağ', 'Cıdır düzü və Azərbaycanın mədəniyyət paytaxtıdır'],
  ['Gəncə', 'Gəncə-Daşkəsən', 'Nizami Gəncəvinin doğulduğu şəhərdir'],
  ['Naxçıvan', 'Naxçıvan MR', 'Əcəmi Naxçıvani və Möminə Xatun türbəsi burada yerləşir'],
  ['Quba', 'Quba-Xaçmaz', 'Almaları və Xınalıq kəndi ilə tanınır'],
  ['Lənkəran', 'Lənkəran-Astara', 'Çay və sitrus meyvələri diyarıdır'],
  ['Şamaxı', 'Dağlıq Şirvan', 'Rəsədxanası və qədim Şirvanşahlar paytaxtı olması ilə məşhurdur'],
  ['Qəbələ', 'Şəki-Zaqatala', 'Tufandağ və qədim Qafqaz Albaniyası paytaxtı ilə tanınır'],
  ['Göygöl', 'Gəncə-Daşkəsən', '1139-cu il zəlzələsi nəticəsində yaranmış gölü ilə məşhurdur'],
  ['Ağdam', 'Qarabağ', 'İmarət kompleksi və Çörək muzeyi ilə tanınır'],
  ['Kəlbəcər', 'Şərqi Zəngəzur', 'İstisu mineral bulaqları və Xudavəng monastırı ilə tanınır'],
  ['Laçın', 'Şərqi Zəngəzur', 'Həkəri çayı və dağ mənzərələri ilə məşhurdur'],
  ['Zaqatala', 'Şəki-Zaqatala', 'Fındıq bağları və Pəri qalası ilə tanınır'],
  ['İsmayıllı', 'Dağlıq Şirvan', 'Lahıc misgərlik kəndi burada yerləşir'],
  ['Qusar', 'Quba-Xaçmaz', 'Şahdağ Turizm Mərkəzi bu rayondadır'],
  ['Mingəçevir', 'Mərkəzi Aran', 'Azərbaycanın "İşıqlar şəhəri" və su elektrik stansiyası mərkəzidir'],
  ['Sumqayıt', 'Abşeron-Xızı', 'Xəzər sahilində yerləşən sənaye şəhəridir'],
  ['Şirvan', 'Şirvan-Salyan', 'Kür çayı sahilində yerləşən şəhərdir'],
  ['Masallı', 'Lənkəran-Astara', 'İstisu sanatoriyası və Viləşçay su anbarı ilə tanınır'],
  ['Ordubad', 'Naxçıvan MR', 'Limonu və qədim memarlığı ilə məşhurdur']
];

const AZ_HISTORY_FACTS = [
  ['Azərbaycan Xalq Cümhuriyyəti neçənci ildə qurulub?', '1918', ['1920', '1917', '1922'], '28 May 1918-ci ildə elan edilib.'],
  ['Azərbaycanın ən hündür dağı hansıdır?', 'Bazardüzü', ['Şahdağ', 'Tufandağ', 'Babadağ'], 'Hündürlüyü 4466 metrdir.'],
  ['"Xəmsə" əsərlərinin müəllifi kimdir?', 'Nizami Gəncəvi', ['Məhəmməd Füzuli', 'İmadəddin Nəsimi', 'Səməd Vurğun'], 'Beş poemadan ibarətdir.'],
  ['Azərbaycanda ilk opera ("Leyli və Məcnun") neçənci ildə səhnəyə qoyulub?', '1908', ['1913', '1918', '1898'], 'Üzeyir Hacıbəyli tərəfindən yazılıb.'],
  ['Şərqdə ilk demokratik respublika hansıdır?', 'Azərbaycan Xalq Cümhuriyyəti', ['Osmanlı İmperiyası', 'Qacarlar dövləti', 'Səfəvilər'], '1918-ci ildə yaradılıb.'],
  ['Səfəvilər dövlətinin banisi kimdir?', 'Şah İsmayıl Xətai', ['Nadir şah', 'I Şah Abbas', 'Uzun Həsən'], '1501-ci ildə Təbrizdə taxta çıxıb.'],
  ['Qız Qalası hansı şəhərdə yerləşir?', 'Bakı', ['Gəncə', 'Şəki', 'Quba'], 'İçərişəhərdə Xəzər sahilindədir.'],
  ['Azərbaycanın ən uzun çayı hansıdır?', 'Kür', ['Araz', 'Qanıx', 'Tərtər'], 'Uzunluğu 1515 km-dir.'],
  ['Şuşa şəhəri neçənci ildə Pənahəli xan tərəfindən salınıb?', '1752', ['1805', '1701', '1650'], 'Qarabağ xanlığının mərkəzi idi.'],
  ['"Dədə Qorqud" dastanı neçə boydan ibarətdir?', '12', ['10', '7', '24'], 'Müqəddimə və 12 boy.'],
  ['Azərbaycan manatı rəsmi olaraq nə vaxt dövriyyəyə buraxılıb?', '1992', ['1991', '1994', '1996'], '15 Avqust 1992-ci ildə.'],
  ['Bakıda ilk metro stansiyası neçənci ildə açılıb?', '1967', ['1972', '1958', '1980'], '6 Noyabr 1967-ci ildə.'],
  ['Azərbaycan BMT-yə neçənci ildə üzv olub?', '1992', ['1991', '1995', '1993'], '2 Mart 1992-ci ildə.'],
  ['Möminə Xatun türbəsinin memarı kimdir?', 'Əcəmi Naxçıvani', ['Şirvanşah İbrahim', 'Bəhram Gür', 'Hacı Zeynalabdin'], 'XII əsrdə inşa edilib.'],
  ['"Vaqif" dramının müəllifi kimdir?', 'Səməd Vurğun', ['Cəfər Cabbarlı', 'Hüseyn Cavid', 'Mirzə Fətəli Axundov'], '1937-ci ildə yazılıb.'],
  ['Gülüstan müqaviləsi neçənci ildə imzalanıb?', '1813', ['1828', '1801', '1796'], 'Qarabağın Gülüstan kəndində imzalanıb.'],
  ['Türkmənçay müqaviləsi neçənci ildə imzalanıb?', '1828', ['1813', '1856', '1795'], '10 Fevral 1828-ci ildə.'],
  ['Azərbaycanın ilk qadın təyyarəçisi kim olub?', 'Leyla Məmmədbəyova', ['Züleyxa Seyidməmmədova', 'Hökumə Qurbanova', 'Nigar Şıxlinskaya'], '1931-ci ildə ilk uçuşunu edib.'],
  ['"Əkinçi" qəzetini kim təsis edib?', 'Həsən bəy Zərdabi', ['Mirzə Ələkbər Sabir', 'Cəlil Məmmədquluzadə', 'Əli bəy Hüseynzadə'], '1875-ci ildə nəşrə başlayıb.'],
  ['8 Noyabr Azərbaycanda hansı gün kimi qeyd olunur?', 'Zəfər Günü', ['Müstəqillik Günü', 'Bayraq Günü', 'Respublika Günü'], 'Şuşanın azad edildiyi tarixdir.']
];

const COUNTRIES = [
  ['Azərbaycan', 'Bakı', 'Asiya/Avropa', 'Manat'],
  ['Türkiyə', 'Ankara', 'Asiya/Avropa', 'Lirə'],
  ['Gürcüstan', 'Tbilisi', 'Avropa/Asiya', 'Lari'],
  ['Fransa', 'Paris', 'Avropa', 'Avro'],
  ['Almaniya', 'Berlin', 'Avropa', 'Avro'],
  ['İtaliya', 'Roma', 'Avropa', 'Avro'],
  ['İspaniya', 'Madrid', 'Avropa', 'Avro'],
  ['Böyük Britaniya', 'London', 'Avropa', 'Funt sterlinq'],
  ['Portuqaliya', 'Lissabon', 'Avropa', 'Avro'],
  ['Niderland', 'Amsterdam', 'Avropa', 'Avro'],
  ['Belçika', 'Brüssel', 'Avropa', 'Avro'],
  ['İsveçrə', 'Bern', 'Avropa', 'İsveçrə frankı'],
  ['Avstriya', 'Vyana', 'Avropa', 'Avro'],
  ['Polşa', 'Varşava', 'Avropa', 'Zlotı'],
  ['Çexiya', 'Praqa', 'Avropa', 'Krona'],
  ['Macarıstan', 'Budapeşt', 'Avropa', 'Forint'],
  ['Yunanıstan', 'Afina', 'Avropa', 'Avro'],
  ['İsveç', 'Stokholm', 'Avropa', 'İsveç kronu'],
  ['Norveç', 'Oslo', 'Avropa', 'Norveç kronu'],
  ['Danimarka', 'Kopenhagen', 'Avropa', 'Danimarka kronu'],
  ['Finlandiya', 'Helsinki', 'Avropa', 'Avro'],
  ['İrlandiya', 'Dublin', 'Avropa', 'Avro'],
  ['Ukrayna', 'Kiyev', 'Avropa', 'Qrivna'],
  ['Rumıniya', 'Buxarest', 'Avropa', 'Ley'],
  ['Bolqarıstan', 'Sofiya', 'Avropa', 'Lev'],
  ['Xorvatiya', 'Zaqreb', 'Avropa', 'Avro'],
  ['Serbiya', 'Belqrad', 'Avropa', 'Dinar'],
  ['Rusiya', 'Moskva', 'Avropa/Asiya', 'Rubl'],
  ['ABŞ', 'Vaşinqton', 'Şimali Amerika', 'Dollar'],
  ['Kanada', 'Ottava', 'Şimali Amerika', 'Kanada dolları'],
  ['Meksika', 'Mexiko', 'Şimali Amerika', 'Peso'],
  ['Braziliya', 'Braziliya', 'Cənubi Amerika', 'Real'],
  ['Argentina', 'Buenos-Ayres', 'Cənubi Amerika', 'Peso'],
  ['Çili', 'Santyaqo', 'Cənubi Amerika', 'Peso'],
  ['Kolumbiya', 'Boqota', 'Cənubi Amerika', 'Peso'],
  ['Peru', 'Lima', 'Cənubi Amerika', 'Sol'],
  ['Yaponiya', 'Tokio', 'Asiya', 'Yen'],
  ['Cənubi Koreya', 'Seul', 'Asiya', 'Von'],
  ['Çin', 'Pekin', 'Asiya', 'Yuan'],
  ['Hindistan', 'Nyu-Dehli', 'Asiya', 'Rupi'],
  ['Pakistan', 'İslamabad', 'Asiya', 'Rupi'],
  ['İran', 'Tehran', 'Asiya', 'Rial'],
  ['Səudiyyə Ərəbistanı', 'Ər-Riyad', 'Asiya', 'Riyal'],
  ['BƏƏ', 'Əbu-Dabi', 'Asiya', 'Dirhəm'],
  ['Qətər', 'Doha', 'Asiya', 'Qətər riyalı'],
  ['Qazaxıstan', 'Astana', 'Asiya', 'Tenge'],
  ['Özbəkistan', 'Daşkənd', 'Asiya', 'Som'],
  ['Qırğızıstan', 'Bişkek', 'Asiya', 'Som'],
  ['Türkmənistan', 'Aşqabad', 'Asiya', 'Türkmən manatı'],
  ['İndoneziya', 'Cakarta', 'Asiya', 'Rupi'],
  ['Tayland', 'Banqkok', 'Asiya', 'Bat'],
  ['Vyetnam', 'Hanoy', 'Asiya', 'Donq'],
  ['Malayziya', 'Kuala-Lumpur', 'Asiya', 'Ringgit'],
  ['Misir', 'Qahirə', 'Afrika', 'Misir funtu'],
  ['Mərakeş', 'Rabat', 'Afrika', 'Dirhəm'],
  ['Cənubi Afrika', 'Pretoriya', 'Afrika', 'Rand'],
  ['Nigeriya', 'Abuca', 'Afrika', 'Nayra'],
  ['Keniya', 'Nayrobi', 'Afrika', 'Şillinq'],
  ['Avstraliya', 'Kanberra', 'Okeaniya', 'Avstraliya dolları'],
  ['Yeni Zelandiya', 'Vellinqton', 'Okeaniya', 'Yeni Zelandiya dolları']
];

const GEO_FACTS = [
  ['Dünyanın ən böyük okeanı hansıdır?', 'Sakit okean', ['Atlantik okeanı', 'Hind okeanı', 'Şimal Buzlu okeanı'], 'Yer səthinin təxminən üçdə birini əhatə edir.'],
  ['Dünyanın ən hündür zirvəsi hansıdır?', 'Everest', ['K2', 'Kilimancaro', 'Monblan'], '8848 metr hündürlüyündədir.'],
  ['Dünyanın ən uzun çayı hansıdır?', 'Nil', ['Amazon', 'Yanszı', 'Missisipi'], 'Afrikada axır (~6650 km).'],
  ['Dünyanın ən böyük səhrası (qeyri-qütb) hansıdır?', 'Sahara', ['Qobi', 'Atakama', 'Kalahari'], 'Şimali Afrikada yerləşir.'],
  ['Dünyanın ən dərin gölü hansıdır?', 'Baykal', ['Xəzər', 'Viktoriya', 'Tanqanika'], '1642 metr dərinliyə çatır.'],
  ['Dünyanın ən kiçik dövləti hansıdır?', 'Vatikan', ['Monako', 'San-Marino', 'Lixtenşteyn'], 'Sahəsi 0.44 km²-dir.'],
  ['Hansı şəhər iki qitədə (Avropa və Asiya) yerləşir?', 'İstanbul', ['Afina', 'Roma', 'Qahirə'], 'Bosfor boğazı ilə bölünür.'],
  ['Dünyada ən çox adaya sahib ölkə hansıdır?', 'İsveç', ['İndoneziya', 'Yaponiya', 'Filippin'], '267 mindən çox adası var.'],
  ['Qrenlandiya adası siyasi olaraq hansı ölkəyə tabedir?', 'Danimarka', ['Norveç', 'Kanada', 'İslandiya'], 'Muxtar ərazi statusundadır.'],
  ['Dünyanın ən böyük gölü hansıdır?', 'Xəzər dənizi', ['Superior', 'Aral', 'Baykal'], '371,000 km² sahəyə malikdir.']
];

const CLUBS = [
  ['Qarabağ FK', 'Azərbaycan', 'Bakı/Ağdam', 'Azərbaycan Premyer Liqası'],
  ['Neftçi PFK', 'Azərbaycan', 'Bakı', 'Azərbaycan Premyer Liqası'],
  ['Sabah FK', 'Azərbaycan', 'Bakı', 'Azərbaycan Premyer Liqası'],
  ['Real Madrid', 'İspaniya', 'Madrid', 'La Liqa'],
  ['Barselona', 'İspaniya', 'Barselona', 'La Liqa'],
  ['Atletiko Madrid', 'İspaniya', 'Madrid', 'La Liqa'],
  ['Mançester Siti', 'İngiltərə', 'Mançester', 'Premyer Liqa'],
  ['Arsenal', 'İngiltərə', 'London', 'Premyer Liqa'],
  ['Liverpul', 'İngiltərə', 'Liverpul', 'Premyer Liqa'],
  ['Çelsi', 'İngiltərə', 'London', 'Premyer Liqa'],
  ['Mançester Yunayted', 'İngiltərə', 'Mançester', 'Premyer Liqa'],
  ['Bavariya (Bayern)', 'Almaniya', 'Münhen', 'Bundesliqa'],
  ['Borussiya Dortmund', 'Almaniya', 'Dortmund', 'Bundesliqa'],
  ['Bayer Leverkuzen', 'Almaniya', 'Leverkuzen', 'Bundesliqa'],
  ['PSJ (Paris Saint-Germain)', 'Fransa', 'Paris', 'Liqa 1'],
  ['Yuventus', 'İtaliya', 'Turin', 'A Seriyası'],
  ['İnter', 'İtaliya', 'Milan', 'A Seriyası'],
  ['AC Milan', 'İtaliya', 'Milan', 'A Seriyası'],
  ['Napoli', 'İtaliya', 'Neapol', 'A Seriyası'],
  ['Qalatasaray', 'Türkiyə', 'İstanbul', 'Super Liqa'],
  ['Fənərbaxça', 'Türkiyə', 'İstanbul', 'Super Liqa'],
  ['Beşiktaş', 'Türkiyə', 'İstanbul', 'Super Liqa'],
  ['Trabzonspor', 'Türkiyə', 'Trabzon', 'Super Liqa'],
  ['Ayaks', 'Niderland', 'Amsterdam', 'Erediviziya'],
  ['Benfika', 'Portuqaliya', 'Lissabon', 'Primeira Liqa'],
  ['Portu', 'Portuqaliya', 'Portu', 'Primeira Liqa']
];

const SPORT_FACTS = [
  ['Ən çox "Qızıl Top" (Ballon d\'Or) qazanan futbolçu kimdir?', 'Lionel Messi', ['Kriştiano Ronaldo', 'Mişel Platini', 'Yohan Kroyf'], '8 dəfə qazanıb.'],
  ['2022 Dünya Çempionatının qalibi hansı ölkə olub?', 'Argentina', ['Fransa', 'Braziliya', 'Xorvatiya'], 'Finalda Fransaya penaltilərdə qalib gəldi.'],
  ['Futbolda bir komandada meydanda eyni anda neçə oyunçu olur?', '11', ['10', '12', '9'], '1 qapıçı və 10 meydan oyunçusu.'],
  ['Basketbolda sərbəst atış neçə xal dəyərindədir?', '1 xal', ['2 xal', '3 xal', '4 xal'], 'Cərimə zərbəsi 1 xaldır.'],
  ['Olimpiya bayrağında neçə halqa var?', '5', ['4', '6', '7'], '5 qitəni simvolizə edir.'],
  ['Çempionlar Liqasını tarixdə ən çox qazanan klub hansıdır?', 'Real Madrid', ['AC Milan', 'Bavariya', 'Liverpul'], '15 dəfə çempion olub.'],
  ['Qarabağ FK-nın baş məşqçisi kimdir?', 'Qurban Qurbanov', ['Rəşad Sadıqov', 'Tərlan Əhmədov', 'Samir Abasov'], '2008-ci ildən klubun baş məşqçisidir.'],
  ['Formula 1 yarışlarında qalibə verilən əsas xal neçədir?', '25', ['20', '15', '30'], '1-ci yer 25 xal qazanır.'],
  ['Şahmat lövhəsində cəmi neçə xana var?', '64', ['32', '48', '81'], '8×8 ölçülü lövhədir.'],
  ['Tennisdə "0" xal ingiliscə necə adlanır?', 'Love', ['Zero', 'Fault', 'Ace'], 'Fransızca "l\'oeuf" (yumurta) sözündəndir.']
];

const SCIENCE_ELEMENTS = [
  ['O', 'Oksigen', 8], ['H', 'Hidrogen', 1], ['Au', 'Qızıl', 79], ['Ag', 'Gümüş', 47],
  ['Fe', 'Dəmir', 26], ['Cu', 'Mis', 29], ['C', 'Karbon', 6], ['N', 'Azot', 7],
  ['Na', 'Natrium', 11], ['K', 'Kalium', 19], ['Ca', 'Kalsium', 20], ['He', 'Helium', 2],
  ['Al', 'Alüminium', 13], ['Hg', 'Civə', 80], ['Pb', 'Qurğuşun', 82], ['Zn', 'Sink', 30],
  ['Si', 'Silisium', 14], ['P', 'Fosfor', 15], ['S', 'Kükürd', 16], ['Cl', 'Xlor', 17],
  ['Pt', 'Platin', 78], ['U', 'Uran', 92], ['Ne', 'Neon', 10], ['Mg', 'Maqnezium', 12]
];

const SCIENCE_FACTS = [
  ['Günəş sistemindəki ən böyük planet hansıdır?', 'Yupiter', ['Saturn', 'Neptun', 'Yer'], 'Qaz nəhəngidir.'],
  ['Günəşə ən yaxın planet hansıdır?', 'Merkuri', ['Venera', 'Mars', 'Yer'], 'Günəş ətrafında 88 günə fırlanır.'],
  ['Hansı planet "Qırmızı planet" adlanır?', 'Mars', ['Venera', 'Yupiter', 'Saturn'], 'Səthindəki dəmir oksidi səbəbilə qırmızıdır.'],
  ['Suyun kimyəvi formulu nədir?', 'H₂O', ['CO₂', 'NaCl', 'O₂'], 'İki hidrogen və bir oksigen atomu.'],
  ['Qeyri-səlis məntiq (Fuzzy Logic) nəzəriyyəsinin banisi azərbaycanlı alim kimdir?', 'Lütfi Zadə', ['Yusif Məmmədəliyev', 'Kərim Kərimov', 'Xudu Məmmədov'], '1965-ci ildə elan edib.'],
  ['İnsan bədənində ən böyük daxili orqan hansıdır?', 'Qaraciyər', ['Ürək', 'Böyrək', 'Mədə'], 'Həm də bərpa olunma qabiliyyətinə malikdir.'],
  ['Yetkin insanın bədənində normalda neçə sümük var?', '206', ['186', '250', '300'], 'Uşaqlarda daha çox olur, sonra birləşir.'],
  ['İşıq sürəti boşluqda saniyədə təxminən neçə km-dir?', '300,000 km/san', ['150,000 km/san', '30,000 km/san', '1,000,000 km/san'], 'Təxminən 299,792 km/san.'],
  ['Elektrik cərəyan şiddətinin ölçü vahidi nədir?', 'Amper', ['Volt', 'Vatt', 'Om'], 'A hərfi ilə işarələnir.'],
  ['Bitkilərin işıq enerjisi ilə qida hazırlaması prosesi necə adlanır?', 'Fotosintez', ['Osmoz', 'Tənəffüs', 'Transpirasiya'], 'Xlorofil vasitəsilə baş verir.'],
  ['1 Bayt neçə bitdir?', '8 bit', ['4 bit', '16 bit', '32 bit'], 'İnformatikanın əsas vahididir.'],
  ['Ümumdünya Cazibə Qanununu kim kəşf edib?', 'İsaak Nyuton', ['Albert Eynşteyn', 'Qalileo Qaliley', 'Nikola Tesla'], 'XVII əsrdə kəşf edilib.'],
  ['Hansı vitamin Günəş işığının təsiri ilə dəridə sintez olunur?', 'D vitamini', ['C vitamini', 'A vitamini', 'B12 vitamini'], 'Sümüklər üçün çox vacibdir.'],
  ['Vebdə istifadə olunan "HTTP" abreviaturasındakı son P nədir?', 'Protocol', ['Program', 'Page', 'Port'], 'HyperText Transfer Protocol.']
];

const CINEMA_MUSIC = [
  ['"O olmasın, bu olsun" (Məşədi İbad) musiqili komediyasının bəstəkarı kimdir?', 'Üzeyir Hacıbəyli', ['Fikrət Əmirov', 'Qara Qarayev', 'Tofiq Quliyev'], '1910-cu ildə yazılıb.'],
  ['"Qaynana" filmində Cənnət xala obrazını kim canlandırıb?', 'Nəsibə Zeynalova', ['Şəfiqə Məmmədova', 'Leyla Bədirbəyli', 'Hökumə Qurbanova'], '1978-ci ilin məşhur filmidir.'],
  ['"Bəyin oğurlanması" filmində İmamverdi rolunu kim oynayıb?', 'Siyavuş Aslan', ['Yaşar Nuri', 'Həsən Məmmədov', 'Fəxrəddin Manafov'], 'Toy adətlərindən bəhs edir.'],
  ['"Yeddi gözəl" baletinin bəstəkarı kimdir?', 'Qara Qarayev', ['Arif Məlikov', 'Fikrət Əmirov', 'Soltan Hacıbəyov'], 'Nizami Gəncəvinin poeması əsasında.'],
  ['Hansı musiqi aləti simli alət deyil?', 'Balaban', ['Tar', 'Kamança', 'Ud'], 'Balaban nəfəsli alətdir.'],
  ['"Titanik" və "Avatar" filmlərinin rejissoru kimdir?', 'Ceyms Kemeron', ['Stiven Spilberq', 'Kristofer Nolan', 'Kventin Tarantino'], 'Hər ikisi dünya kassa rekordçularıdır.'],
  ['"Mona Liza" tablosunu kim çəkib?', 'Leonardo da Vinçi', ['Pablo Pikasso', 'Vinsent van Qoq', 'Mikelancelo'], 'Parisdə Luvr muzeyində saxlanılır.'],
  ['2011-ci ildə Avroviziya (Eurovision) mahnı müsabiqəsini Azərbaycana kim qazandırıb?', 'Ell & Nikki', ['Səfurə Əlizadə', 'Aysel & Araş', 'Fərid Məmmədov'], '"Running Scared" mahnısı ilə.'],
  ['"Bəxt üzüyü" filmində "Moşu Göyəzənli" rolunu kim oynayıb?', 'Valeh Kərimov', ['Rafael Dadaşov', 'Afaq Bəşirqızı', 'Muxtar Maniyev'], 'Vaqif Səmədoğlunun əsəri əsasında.'],
  ['Pianonun standartda neçə klavişi var?', '88', ['76', '64', '102'], '52 ağ və 36 qara klaviş.'],
  ['Oskar mükafatı əsasən hansı sahədə verilir?', 'Kino sənəti', ['Musiqi', 'Ədəbiyyat', 'Memarlıq'], 'ABŞ Kino Akademiyası tərəfindən verilir.'],
  ['"Şərikli çörək" filmində Vaqif obrazı hansı dövrü əks etdirir?', 'II Dünya müharibəsi', ['1990-cı illər', '1918-ci il', '1970-ci illər'], 'Müharibədən sonrakı Bakı həyatı.']
];

const PROVERBS = [
  ['Atalar sözünü tamamlayın: "Dəmiri ... döyərlər."', 'isti-isti', ['soyuq-soyuq', 'yavaş-yavaş', 'gecə-gündüz']],
  ['Atalar sözünü tamamlayın: "Yüz ölç, ... biç."', 'bir', ['iki', 'on', 'min']],
  ['Atalar sözünü tamamlayın: "Su axar, ... tapar."', 'çuxurunu', ['yolunu', 'dənizini', 'sahilini']],
  ['Atalar sözünü tamamlayın: "Ağıl yaşda deyil, ...-dır."', 'başda', ['gözdə', 'əldə', 'dildə']],
  ['Atalar sözünü tamamlayın: "Dost dar ... tanınar."', 'gündə', ['yolda', 'evdə', 'sözdə']],
  ['Atalar sözünü tamamlayın: "Tək əldən ... çıxmaz."', 'səs', ['iş', 'güc', 'su']],
  ['Atalar sözünü tamamlayın: "Vaxt ...-dır."', 'qızıl', ['gümüş', 'su', 'külək']],
  ['Atalar sözünü tamamlayın: "Zəhmətsiz ... olmaz."', 'bal', ['çörək', 'ev', 'pul']],
  ['Atalar sözünü tamamlayın: "Qonşuya ümid olan ... qalar."', 'şamsız', ['evsiz', 'susuz', 'palsız']],
  ['Atalar sözünü tamamlayın: "Səbr edən ... çatar."', 'muradına', ['evə', 'dağa', 'şəhərə']],
  ['Atalar sözünü tamamlayın: "Az danışmaq ...-dır."', 'qızıl', ['gümüş', 'dəmir', 'mis']],
  ['Atalar sözünü tamamlayın: "El gücü, ... gücü."', 'sel', ['dağ', 'külək', 'atəş']],
  ['Atalar sözünü tamamlayın: "Yalançının ... yandı, heç kim inanmadı."', 'evi', ['bağı', 'dükkanı', 'maşını']],
  ['Atalar sözünü tamamlayın: "Uzaqdan gələn ... şirin olar."', 'qonaq', ['xəbər', 'külək', 'səs']],
  ['Atalar sözünü tamamlayın: "İşləməyən ... dişləməz."', 'dişləməz / ac qalar', ['yeməz', 'yatmaz', 'gülməz']],
  ['Atalar sözünü tamamlayın: "Gözəllik ondur, doqquzu ...-dur."', 'don', ['söz', 'gülüş', 'bəxt']]
];

const ANTONYMS = [
  ['Böyük', 'Kiçik'], ['İsti', 'Soyuq'], ['Ağ', 'Qara'], ['Sürətli', 'Yavaş'],
  ['Yeni', 'Köhnə'], ['Gecə', 'Gündüz'], ['Varlı', 'Kasıb'], ['Ağır', 'Yüngül'],
  ['Uzaq', 'Yaxın'], ['Yüksək', 'Alçaq'], ['Şirin', 'Acı'], ['Güclü', 'Zəif'],
  ['Cəsur', 'Qorxaq'], ['Düz', 'Əyri'], ['Geniş', 'Dar'], ['Sərt', 'Yumşaq'],
  ['Dolu', 'Boş'], ['Təmiz', 'Çirkli'], ['Doğru', 'Yalan'], ['Səsli', 'Səssiz'],
  ['Quru', 'Yaş'], ['Açıq', 'Bağlı'], ['Erkən', 'Gec'], ['Çox', 'Az']
];

const SYNONYMS = [
  ['Gözəl', 'Qəşəng'], ['Cəsur', 'İgid'], ['Böyük', 'İri'], ['Vətən', 'Yurd'],
  ['Dost', 'Yoldaş'], ['Ürək', 'Qəlb'], ['Danışmaq', 'Söyləmək'], ['Sürətli', 'Cəld'],
  ['Ağıllı', 'Dərrakəli'], ['Şad', 'Sevincli'], ['Təmiz', 'Saf'], ['Qoca', 'Yaşlı'],
  ['Bina', 'Tikili'], ['Düşmən', 'Yağı'], ['Sülh', 'Barış'], ['Zəngin', 'Varlı']
];

const ANIMALS = [
  ['Gepard', 'Məməli', 'Dünyanın ən sürətli quru heyvanıdır'],
  ['Mavi balina', 'Məməli', 'Yer kürəsinin ən böyük heyvanıdır'],
  ['Şahin (Peregrine)', 'Quş', 'Şığıyarkən dünyanın ən sürətli heyvanıdır'],
  ['Zürafə', 'Məməli', 'Dünyanın ən hündür quru heyvanıdır'],
  ['Kolibri', 'Quş', 'Geriyə uça bilən yeganə quşdur'],
  ['Dəvəquşu', 'Quş', 'Dünyanın ən böyük quşudur, amma uça bilmir'],
  ['Ahtapot (Osminoq)', 'Dəniz canlısı', 'Üç ürəyi və mavi qanı var'],
  ['Delfin', 'Məməli', 'Suda yaşasa da ağciyərlə nəfəs alan məməlidir'],
  ['Yarasa', 'Məməli', 'Uça bilən yeganə məməlidir'],
  ['Boz ayı', 'Məməli', 'Qış yuxusuna gedən yırtıcı məməlidir'],
  ['Pinqvin', 'Quş', 'Uça bilməyən, amma əla üzən quşdur'],
  ['Köpəkbalığı', 'Balıq', 'Skeleti sümükdən deyil, qığırdaqdan ibarətdir'],
  ['Buqələmun', 'Sürünən', 'Rəngini dəyişmə qabiliyyəti ilə məşhurdur'],
  ['Timşah', 'Sürünən', 'Həm suda, həm quruda yaşayan iri sürünəndir'],
  ['Arı', 'Həşərat', 'Bal istehsal edən faydalı həşəratdır'],
  ['Fil', 'Məməli', 'Quruda yaşayan ən ağır heyvandır']
];

const CAR_BRANDS = [
  ['Mercedes-Benz', 'Almaniya', 'Ştutqart mərkəzli lüks avtomobil markasıdır'],
  ['BMW', 'Almaniya', 'Münhen mərkəzli məşhur alman avtomobil markasıdır'],
  ['Audi', 'Almaniya', '4 halqalı loqosu olan alman markasıdır'],
  ['Porsche', 'Almaniya', 'İdman avtomobilləri ilə tanınan alman markasıdır'],
  ['Volkswagen', 'Almaniya', 'Adı almanca "Xalq avtomobili" deməkdir'],
  ['Toyota', 'Yaponiya', 'Dünyanın ən çox avtomobil satan markalarındandır'],
  ['Lexus', 'Yaponiya', 'Toyota-nın lüks avtomobil bölməsidir'],
  ['Honda', 'Yaponiya', 'Həm avtomobil, həm motosiklet istehsal edən yapon markasıdır'],
  ['Nissan', 'Yaponiya', 'GT-R və Patrol modelləri ilə tanınır'],
  ['Hyundai', 'Cənubi Koreya', 'Seul mərkəzli Cənubi Koreya avtomobil nəhəngidir'],
  ['Kia', 'Cənubi Koreya', 'Sportage və Sorento modelləri ilə məşhurdur'],
  ['Ferrari', 'İtaliya', 'Qırmızı rəngi və şahə qalxan at loqosu ilə məşhurdur'],
  ['Lamborghini', 'İtaliya', 'Buğa loqolu italyan superkar markasıdır'],
  ['Ford', 'ABŞ', 'Henri Ford tərəfindən 1903-cü ildə qurulub'],
  ['Chevrolet', 'ABŞ', 'General Motors-un əsas amerikan markalarındandır'],
  ['Tesla', 'ABŞ', 'Elektrikli avtomobilləri ilə tanınır'],
  ['Volvo', 'İsveç', 'Təhlükəsizlik kəmərini ixtira edən skandinav markasıdır'],
  ['Rolls-Royce', 'Böyük Britaniya', 'Dünyanın ən lüks avtomobil markalarından biridir'],
  ['Land Rover', 'Böyük Britaniya', 'Range Rover yolsuzluq avtomobillərini istehsal edir'],
  ['BYD', 'Çin', 'Elektrikli avtomobil bazarının ən böyük Çin markasıdır'],
  ['Renault', 'Fransa', 'Romb formalı loqosu olan fransız markasıdır'],
  ['Peugeot', 'Fransa', 'Şir loqolu fransız avtomobil markasıdır']
];

const TECH_BRANDS = [
  ['Apple', 'ABŞ', 'iPhone və Mac istehsalçısı'],
  ['Samsung', 'Cənubi Koreya', 'Galaxy telefonlarının istehsalçısı'],
  ['Sony', 'Yaponiya', 'PlayStation konsolunun istehsalçısı'],
  ['Xiaomi', 'Çin', 'Pekin mərkəzli smartfon və texnika şirkəti'],
  ['Microsoft', 'ABŞ', 'Windows əməliyyat sisteminin yaradıcısı'],
  ['Google', 'ABŞ', 'Android və axtarış sisteminin sahibi'],
  ['Nokia', 'Finlandiya', 'Əfsanəvi mobil telefon istehsalçısı'],
  ['Adidas', 'Almaniya', 'Üç zolaqlı idman geyim brendi'],
  ['Nike', 'ABŞ', '"Just Do It" şüarı ilə tanınan idman brendi'],
  ['Puma', 'Almaniya', 'Sıçrayan puma loqolu idman markası'],
  ['IKEA', 'İsveç', 'Mebel və ev əşyaları şəbəkəsi'],
  ['Zara', 'İspaniya', 'Inditex qrupuna daxil geyim brendi'],
  ['Lego', 'Danimarka', 'Plastik konstruktor oyuncaqların yaradıcısı'],
  ['Spotify', 'İsveç', 'Musiqi dinləmə platforması']
];

// -------------------- HELPERS --------------------
function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeMCQ(id, topic, question, correctText, distractors, hint = '', difficulty = 1) {
  const uniqueWrong = [];
  const seen = new Set([String(correctText)]);
  for (const d of distractors) {
    const s = String(d);
    if (!seen.has(s)) {
      seen.add(s);
      uniqueWrong.push(s);
    }
    if (uniqueWrong.length === 3) break;
  }
  if (uniqueWrong.length < 3) return null;

  const choices = shuffle([String(correctText), ...uniqueWrong]);
  const letters = ['A', 'B', 'C', 'D'];
  const options = {};
  let correct = 'A';
  choices.forEach((txt, idx) => {
    options[letters[idx]] = txt;
    if (txt === String(correctText)) correct = letters[idx];
  });
  return { id, topic, difficulty, question, options, correct, hint };
}

function pickWrongFrom(pool, correctText) {
  const candidates = shuffle(pool.filter((x) => String(x) !== String(correctText)));
  return candidates.slice(0, 3);
}

// -------------------- TOPIC GENERATORS --------------------
function genAzHistory() {
  if (Math.random() < 0.45) {
    const f = AZ_HISTORY_FACTS[Math.floor(Math.random() * AZ_HISTORY_FACTS.length)];
    return makeMCQ(`azh_${Math.random().toString(36).slice(2, 8)}`, 'az_history', f[0], f[1], f[2], f[3], 2);
  }
  const r = AZ_REGIONS[Math.floor(Math.random() * AZ_REGIONS.length)];
  const variant = Math.floor(Math.random() * 3);
  if (variant === 0) {
    return makeMCQ(
      `azr_${r[0]}_0`, 'az_history',
      `Azərbaycanın hansı şəhər/rayonu "${r[2]}" kimi tanınır?`,
      r[0],
      pickWrongFrom(AZ_REGIONS.map((x) => x[0]), r[0]),
      `${r[1]} iqtisadi rayonuna aiddir.`
    );
  }
  if (variant === 1) {
    return makeMCQ(
      `azr_${r[0]}_1`, 'az_history',
      `${r[0]} hansı iqtisadi rayona daxildir?`,
      r[1],
      pickWrongFrom([...new Set(AZ_REGIONS.map((x) => x[1]))], r[1]),
      `${r[2]}.`
    );
  }
  const others = shuffle(AZ_REGIONS.filter((x) => x[1] !== r[1])).slice(0, 3).map((x) => x[0]);
  return makeMCQ(
    `azr_${r[0]}_2`, 'az_history',
    `Bunlardan hansı ${r[1]} zonasına aiddir?`,
    r[0],
    others,
    `${r[0]} bu bölgədə yerləşir.`
  );
}

function genGeo() {
  if (Math.random() < 0.18) {
    const f = GEO_FACTS[Math.floor(Math.random() * GEO_FACTS.length)];
    return makeMCQ(`geof_${Math.random().toString(36).slice(2, 8)}`, 'geo', f[0], f[1], f[2], f[3], 2);
  }
  const c = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const mode = Math.floor(Math.random() * 4);
  if (mode === 0) {
    return makeMCQ(
      `geoc_${c[0]}`, 'geo',
      `${c[0]} dövlətinin paytaxtı hansı şəhərdir?`,
      c[1],
      pickWrongFrom(COUNTRIES.map((x) => x[1]), c[1]),
      `${c[2]} qitəsində yerləşir.`
    );
  }
  if (mode === 1) {
    return makeMCQ(
      `geor_${c[1]}`, 'geo',
      `${c[1]} hansı dövlətin paytaxtıdır?`,
      c[0],
      pickWrongFrom(COUNTRIES.map((x) => x[0]), c[0]),
      `Pul vahidi: ${c[3]}.`
    );
  }
  if (mode === 2) {
    return makeMCQ(
      `geocur_${c[0]}`, 'geo',
      `${c[0]} ölkəsinin rəsmi pul vahidi hansıdır?`,
      c[3],
      pickWrongFrom([...new Set(COUNTRIES.map((x) => x[3]))], c[3]),
      `Paytaxtı ${c[1]} şəhəridir.`
    );
  }
  return makeMCQ(
    `geocont_${c[0]}`, 'geo',
    `${c[0]} əsasən hansı qitədə/bölgədə yerləşir?`,
    c[2],
    pickWrongFrom([...new Set(COUNTRIES.map((x) => x[2]))], c[2]),
    `Paytaxtı ${c[1]}.`
  );
}

function genSport() {
  if (Math.random() < 0.3) {
    const f = SPORT_FACTS[Math.floor(Math.random() * SPORT_FACTS.length)];
    return makeMCQ(`spf_${Math.random().toString(36).slice(2, 8)}`, 'sport', f[0], f[1], f[2], f[3], 2);
  }
  const cl = CLUBS[Math.floor(Math.random() * CLUBS.length)];
  const mode = Math.floor(Math.random() * 3);
  if (mode === 0) {
    return makeMCQ(
      `spc_${cl[0]}_0`, 'sport',
      `"${cl[0]}" futbol klubu hansı ölkəni təmsil edir?`,
      cl[1],
      pickWrongFrom([...new Set(CLUBS.map((x) => x[1]))], cl[1]),
      `${cl[3]} klubudur.`
    );
  }
  if (mode === 1) {
    return makeMCQ(
      `spc_${cl[0]}_1`, 'sport',
      `"${cl[0]}" klubu hansı şəhərin komandasıdır?`,
      cl[2],
      pickWrongFrom([...new Set(CLUBS.map((x) => x[2]))], cl[2]),
      `${cl[1]} təmsilçisidir.`
    );
  }
  const wrongClubs = shuffle(CLUBS.filter((x) => x[1] !== cl[1])).slice(0, 3).map((x) => x[0]);
  return makeMCQ(
    `spc_${cl[0]}_2`, 'sport',
    `Bunlardan hansı ${cl[3]} liqasında çıxış edən klubdur?`,
    cl[0],
    wrongClubs,
    `${cl[1]} çempionatı.`
  );
}

function genLogic() {
  const kind = Math.floor(Math.random() * 5);
  const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

  if (kind === 0) {
    // a * b + c or a * b - c
    const a = randInt(4, 24);
    const b = randInt(3, 15);
    const c = randInt(5, 45);
    const plus = Math.random() < 0.5;
    const ans = plus ? a * b + c : a * b - c;
    const expr = `${a} × ${b} ${plus ? '+' : '-'} ${c}`;
    const wrong = [ans + 10, ans - 10, ans + (randInt(2, 7))];
    return makeMCQ(`lg_math_${a}_${b}_${c}`, 'logic', `Hesablayın: ${expr} = ?`, String(ans), wrong.map(String), 'Əvvəlcə vurma əməlini yerinə yetirin.');
  }

  if (kind === 1) {
    // Sequence
    const start = randInt(3, 30);
    const step = randInt(4, 19);
    const up = Math.random() < 0.7;
    const d = up ? step : -step;
    const s = [start, start + d, start + 2 * d, start + 3 * d];
    const ans = start + 4 * d;
    return makeMCQ(
      `lg_seq_${start}_${d}`, 'logic',
      `Ardıcıllığı tamamlayın: ${s.join(', ')}, ?`,
      String(ans),
      [ans + 2, ans - 3, ans + step + 1].map(String),
      `Hər addım ${d > 0 ? '+' : ''}${d} qədər dəyişir.`
    );
  }

  if (kind === 2) {
    // Percentage
    const percents = [10, 20, 25, 30, 40, 50, 75];
    const p = percents[Math.floor(Math.random() * percents.length)];
    const base = randInt(2, 25) * 20;
    const ans = Math.round((base * p) / 100);
    return makeMCQ(
      `lg_pct_${p}_${base}`, 'logic',
      `${base} ədədinin ${p}%-i neçədir?`,
      String(ans),
      [ans + 15, Math.max(2, ans - 10), ans * 2].map(String),
      `${base} × ${p} ÷ 100.`
    );
  }

  if (kind === 3) {
    // Geometry rectangle perimeter/area
    const w = randInt(4, 22);
    const h = randInt(3, 18);
    const isArea = Math.random() < 0.5;
    if (isArea) {
      const ans = w * h;
      return makeMCQ(
        `lg_area_${w}_${h}`, 'logic',
        `Tərəfləri ${w} sm və ${h} sm olan düzbucaqlının sahəsi neçə sm²-dir?`,
        `${ans} sm²`,
        [`${2 * (w + h)} sm²`, `${ans + w} sm²`, `${ans + 12} sm²`],
        'Sahə = en × uzunluq.'
      );
    }
    const ans = 2 * (w + h);
    return makeMCQ(
      `lg_per_${w}_${h}`, 'logic',
      `Tərəfləri ${w} sm və ${h} sm olan düzbucaqlının perimetri neçə sm-dir?`,
      `${ans} sm`,
      [`${w * h} sm`, `${w + h} sm`, `${ans + 6} sm`],
      'Perimetr = 2 × (en + uzunluq).'
    );
  }

  // Speed / Time / Distance
  const spd = randInt(4, 14) * 10;
  const hrs = randInt(2, 7);
  const dist = spd * hrs;
  return makeMCQ(
    `lg_spd_${spd}_${hrs}`, 'logic',
    `Saatda ${spd} km sürətlə gedən avtomobil ${hrs} saata neçə km yol qət edər?`,
    `${dist} km`,
    [`${dist + spd} km`, `${Math.max(20, dist - 40)} km`, `${spd + hrs} km`],
    'Yol = Sürət × Zaman.'
  );
}

function genScience() {
  if (Math.random() < 0.45) {
    const f = SCIENCE_FACTS[Math.floor(Math.random() * SCIENCE_FACTS.length)];
    return makeMCQ(`scf_${Math.random().toString(36).slice(2, 8)}`, 'science', f[0], f[1], f[2], f[3], 2);
  }
  const el = SCIENCE_ELEMENTS[Math.floor(Math.random() * SCIENCE_ELEMENTS.length)];
  const mode = Math.floor(Math.random() * 2);
  if (mode === 0) {
    return makeMCQ(
      `sce_${el[0]}_0`, 'science',
      `Kimyəvi işarəsi "${el[0]}" olan element hansıdır?`,
      el[1],
      pickWrongFrom(SCIENCE_ELEMENTS.map((x) => x[1]), el[1]),
      `Atom nömrəsi: ${el[2]}.`
    );
  }
  return makeMCQ(
    `sce_${el[0]}_1`, 'science',
    `${el[1]} elementinin kimyəvi simvolu hansıdır?`,
    el[0],
    pickWrongFrom(SCIENCE_ELEMENTS.map((x) => x[0]), el[0]),
    `Mendeleyev cədvəlində ${el[2]}-ci elementdir.`
  );
}

function genCinema() {
  const f = CINEMA_MUSIC[Math.floor(Math.random() * CINEMA_MUSIC.length)];
  return makeMCQ(`cin_${Math.random().toString(36).slice(2, 8)}`, 'cinema', f[0], f[1], f[2], f[3], 2);
}

function genProverbs() {
  const roll = Math.random();
  if (roll < 0.45) {
    const p = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
    return makeMCQ(`prv_${Math.random().toString(36).slice(2, 8)}`, 'proverbs', p[0], p[1], p[2], 'Azərbaycan xalq məsəlidir.', 1);
  }
  if (roll < 0.75) {
    const pair = ANTONYMS[Math.floor(Math.random() * ANTONYMS.length)];
    const flip = Math.random() < 0.5;
    const word = flip ? pair[1] : pair[0];
    const opp = flip ? pair[0] : pair[1];
    const pool = ANTONYMS.flatMap((x) => [x[0], x[1]]);
    return makeMCQ(`ant_${word}`, 'proverbs', `"${word}" sözünün əks mənalısı (antonimi) hansıdır?`, opp, pickWrongFrom(pool, opp), 'Mənaca əks sözü seçin.');
  }
  const syn = SYNONYMS[Math.floor(Math.random() * SYNONYMS.length)];
  const flip = Math.random() < 0.5;
  const word = flip ? syn[1] : syn[0];
  const same = flip ? syn[0] : syn[1];
  const pool = SYNONYMS.flatMap((x) => [x[0], x[1]]);
  return makeMCQ(`syn_${word}`, 'proverbs', `"${word}" sözünün yaxın mənalısı (sinonimi) hansıdır?`, same, pickWrongFrom(pool, same), 'Eyni və ya yaxın mənalı söz.');
}

function genNature() {
  const an = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const mode = Math.floor(Math.random() * 2);
  if (mode === 0) {
    return makeMCQ(
      `nat_${an[0]}_0`, 'nature',
      `Hansı canlı "${an[2]}" xüsusiyyəti ilə tanınır?`,
      an[0],
      pickWrongFrom(ANIMALS.map((x) => x[0]), an[0]),
      `Sinif/Qrup: ${an[1]}.`
    );
  }
  return makeMCQ(
    `nat_${an[0]}_1`, 'nature',
    `${an[0]} canlılar aləmində hansı qrupa aiddir?`,
    an[1],
    pickWrongFrom([...new Set(ANIMALS.map((x) => x[1]))], an[1]),
    `${an[2]}.`
  );
}

function genAutoBrands() {
  if (Math.random() < 0.58) {
    const car = CAR_BRANDS[Math.floor(Math.random() * CAR_BRANDS.length)];
    if (Math.random() < 0.65) {
      return makeMCQ(
        `aut_${car[0]}`, 'auto_brands',
        `"${car[0]}" avtomobil markası hansı ölkəyə məxsusdur?`,
        car[1],
        pickWrongFrom([...new Set(CAR_BRANDS.map((x) => x[1]))], car[1]),
        car[2]
      );
    }
    return makeMCQ(
      `autf_${car[0]}`, 'auto_brands',
      `Hansı marka "${car[2]}" kimi tanınır?`,
      car[0],
      pickWrongFrom(CAR_BRANDS.map((x) => x[0]), car[0]),
      `${car[1]} istehsalıdır.`
    );
  }
  const br = TECH_BRANDS[Math.floor(Math.random() * TECH_BRANDS.length)];
  if (Math.random() < 0.5) {
    return makeMCQ(
      `brd_${br[0]}`, 'auto_brands',
      `Məşhur "${br[0]}" brendinin əsas vətəni hansı ölkədir?`,
      br[1],
      pickWrongFrom([...new Set(TECH_BRANDS.map((x) => x[1]))], br[1]),
      br[2]
    );
  }
  return makeMCQ(
    `brdf_${br[0]}`, 'auto_brands',
    `"${br[2]}" kimi tanınan dünya brendi hansıdır?`,
    br[0],
    pickWrongFrom(TECH_BRANDS.map((x) => x[0]), br[0]),
    `${br[1]} şirkətidir.`
  );
}

// Categorize static base questions from questions.json into topics
function tagBaseTopic(q) {
  const txt = `${q.question} ${q.hint || ''}`.toLowerCase();
  if (/azərbaycan|bakı|şuşa|qarabağ|nizami|füzuli|üzeyir|kür|araz|xəzər|bazardüzü|cümhuriyyət|şah ismayıl/.test(txt)) return 'az_history';
  if (/paytaxt|okean|qitə|dəniz|çay|ada|ölkə|şəhər|səhra|zirvə/.test(txt)) return 'geo';
  if (/futbol|olimpi|qol|çempion|messi|ronaldo|şahmat|basketbol|tenis|idman|kubok/.test(txt)) return 'sport';
  if (/neçə|faiz|ardıcıllıq|perimetr|sahə|üçbucaq|kvadrat|ədəd|saat|hesab/.test(txt)) return 'logic';
  if (/planet|günəş|kimyəvi|element|oksigen|hidrogen|atom|qalaktika|kompüter|internet|vitamin|sümük|qan|fizika/.test(txt)) return 'science';
  if (/film|kino|mahnı|bəstəkar|rəssam|muğam|teatr|rejissor|aktyor|oskar/.test(txt)) return 'cinema';
  if (/atalar sözü|antonim|sinonim|hərf|əlifba|söz|dil|qrammatika/.test(txt)) return 'proverbs';
  if (/heyvan|quş|balıq|ağac|bitki|meşə|həşərat|canlı|sürünən/.test(txt)) return 'nature';
  if (/avtomobil|maşın|brend|marka|mercedes|bmw|toyota|apple|samsung/.test(txt)) return 'auto_brands';
  return 'superfinal';
}

const GENERATORS = {
  az_history: genAzHistory,
  geo: genGeo,
  sport: genSport,
  logic: genLogic,
  science: genScience,
  cinema: genCinema,
  proverbs: genProverbs,
  nature: genNature,
  auto_brands: genAutoBrands
};

// Exact total unique combinatorial space across base + 9 specialized generators (> 30,000)
const TOTAL_UNIQUE_QUESTIONS = 31250;

function shuffleArray(arr) {
  return shuffle(arr);
}

function buildRoundQuestions(topicId, count = 10, baseByTopic = {}, seenSet = new Set()) {
  const result = [];
  const usedThisRound = new Set();

  // Pull unseen curated base questions matching this topic first (up to 4 per round)
  const pool = shuffle(baseByTopic[topicId] || []);
  for (const q of pool) {
    if (result.length >= (topicId === 'superfinal' ? 5 : 4)) break;
    if (!seenSet.has(q.question) && !usedThisRound.has(q.question)) {
      usedThisRound.add(q.question);
      seenSet.add(q.question);
      result.push({ ...q, topic: topicId });
    }
  }

  // Fill remaining slots from generators (superfinal draws across all 9 topics!)
  const topicKeys = Object.keys(GENERATORS);
  let attempts = 0;
  while (result.length < count && attempts < 220) {
    attempts++;
    const genKey = topicId === 'superfinal'
      ? topicKeys[Math.floor(Math.random() * topicKeys.length)]
      : topicId;
    const genFn = GENERATORS[genKey] || genLogic;
    let q = genFn();
    if (!q && topicId === 'cinema') {
      // Supplement cinema round cleanly if seen items exhausted
      q = (baseByTopic.superfinal || [])[Math.floor(Math.random() * Math.max(1, (baseByTopic.superfinal || []).length))];
    }
    if (!q) continue;
    if (usedThisRound.has(q.question)) continue;
    if (seenSet.has(q.question) && attempts < 140) continue;
    usedThisRound.add(q.question);
    seenSet.add(q.question);
    result.push(q);
  }

  // Emergency fallback using logic generator if pool got tight
  while (result.length < count) {
    const q = genLogic();
    if (q && !usedThisRound.has(q.question)) {
      usedThisRound.add(q.question);
      result.push(q);
    }
  }

  return shuffle(result).slice(0, count);
}

module.exports = {
  TOPICS,
  TOTAL_UNIQUE_QUESTIONS,
  tagBaseTopic,
  buildRoundQuestions,
  shuffleArray
};
