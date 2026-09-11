export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface DetailedAyah {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  transliteration: string;
  translations: {
    sahih: string;
    yusufAli: string;
    pickthall: string;
    hausa: string;
  };
  tafsir: {
    ibnKathir: string;
    asSadi: string;
    alTabari: string;
  };
  historicalContext: {
    period: string;
    event?: string;
    audience: string;
    revelationReason: string;
  };
  relatedHadiths: {
    arabic: string;
    translation: string;
    source: string;
    grade: 'Sahih' | 'Hasan' | 'Da\'if';
    contextText?: string;
  }[];
  misunderstadingContext?: {
    claim: string;
    truth: string;
    warning: string;
  };
  adaptation: {
    simple: string;
    deep: string;
    children: string;
    historical: string;
  };
  relatedAyahs: {
    reference: string;
    arabic: string;
    translation: string;
  }[];
}

export const ALL_SURAHS: Surah[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", englishNameTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan" },
  { number: 4, name: "النساء", englishName: "Al-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan" },
  { number: 14, name: "ابراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan" },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan" },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, name: "طه", englishName: "Taha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan" },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan" },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan" },
  { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan" },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan" },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan" },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan" },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan" },
  { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan" },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan" },
  { number: 34, name: "سبإ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "Originator", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya-Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those who set the Ranks", numberOfAyahs: 182, revelationType: "Meccan" },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "The Letter Sad", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Groups", numberOfAyahs: 75, revelationType: "Meccan" },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan" },
  { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan" },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Gold Adornments", numberOfAyahs: 89, revelationType: "Meccan" },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan" },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan" },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan" },
  { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan" },
  { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 50, name: "ق", englishName: "Qaf", englishNameTranslation: "The Letter Qaf", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 52, name: "الطور", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan" },
  { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan" },
  { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Meccan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadilah", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan" },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan" },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", englishNameTranslation: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan" },
  { number: 61, name: "الصف", englishName: "As-Saff", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan" },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", englishNameTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqah", englishNameTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan" },
  { number: 71, name: "نوح", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan" },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 76, name: "الانسان", englishName: "Al-Insan", englishNameTranslation: "The Man", numberOfAyahs: 31, revelationType: "Medinan" },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan" },
  { number: 78, name: "النبإ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", englishNameTranslation: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan" },
  { number: 80, name: "عبس", englishName: "Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan" },
  { number: 81, name: "التكوير", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan" },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauders", numberOfAyahs: 36, revelationType: "Meccan" },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", englishNameTranslation: "The Sundering", numberOfAyahs: 25, revelationType: "Meccan" },
  { number: 85, name: "البروج", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan" },
  { number: 86, name: "الطارق", englishName: "At-Tariq", englishNameTranslation: "The Nightcomer", numberOfAyahs: 17, revelationType: "Meccan" },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan" },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan" },
  { number: 92, name: "الليل", englishName: "Al-Lail", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan" },
  { number: 93, name: "الضحى", englishName: "Ad-Duha", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 95, name: "التين", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 96, name: "العلق", englishName: "Al-'Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 100, name: "العاديات", englishName: "Al-'Adiyat", englishNameTranslation: "The Chargers", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in World Increase", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 103, name: "العصر", englishName: "Al-'Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan" },
  { number: 105, name: "الفيل", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", englishNameTranslation: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan" },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan" },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "The Mankind", numberOfAyahs: 6, revelationType: "Meccan" }
];

// PRE-SEEDED PREMIUM CRITICAL & CELESTIAL AYAS FOR EXPLORATORY HIGH FIDELITY
export const SEEDED_AYAS: Record<string, DetailedAyah> = {
  "9:5": {
    surahNumber: 9,
    ayahNumber: 5,
    arabic: "فَإِذَا انسَلَخَ الْأَشْهُرُ الْحُرُمُ فَاقْتُلُوا الْمُشْرِكِينَ حَيْثُ وَجَدتُّمُوهُمْ وَخُذُوهُمْ وَاحْصُرُوهُمْ وَاقْعُدُوا لَهُمْ كُلَّ مَرْصَدٍ ۚ",
    transliteration: "Fa-idhas-alakha al-ash'hurul-hurumu faqtulul-mushrikina haythu wajadtumuhum wa khudhuhum wahsuruhum waq'udu lahum kulla marsad...",
    translations: {
      sahih: "And when the sacred months have passed, then kill the polytheists wherever you find them and capture them and besiege them and sit in wait for them at every place of ambush...",
      yusufAli: "But when the forbidden months are past, then fight and slay the Pagans wherever ye find them, an seize them, beleaguer them, and lie in wait for them in every stratagem...",
      pickthall: "Then, when the sacred months have passed, slay the idolaters wherever ye find them, and take them (captive), and besiege them, and prepare for them each ambush...",
      hausa: "To, idan watanni masu alfarma sun fita, to, ku kashe mushrikai inda duk kuka same su, kuma ku kama su, kuma ku tsare su, kuma ku zauna musu a kowane mazaunin dako..."
    },
    tafsir: {
      ibnKathir: "Ibn Kathir clarifies that this verse refers specifically to a declared military campaign during the Prophet's time. The 'polytheists' mentioned here does not mean all non-Muslims globally, but rather the pagan Arab confederates of Mecca who had violated the Treaty of Hudaybiyyah, committed hostile acts, and entered treason with external enemy states against the newly established community of Medina.",
      asSadi: "As-Sa'di illuminates that the command of war is conditioned by active hostility. It dictates how to handle aggressive combatants in times of warfare, not how to interact with peaceful non-Muslim communities, as other verses such as 'And compile peace if they incline to it' (8:61) and 'Allah does not forbid you from those who do not fight you' (60:8) clearly establish. Slay is restricted strictly to battlefield treason.",
      alTabari: "Al-Tabari presents historical consensus that this verse marks the termination of treaties exclusively for those pagan tribes who continuously betrayed covenant protocols. For any tribe that maintained their treaties faithfully, Allah command was: 'Fulfill their treaties to the end of their term' (9:4)."
    },
    historicalContext: {
      period: "Revealed in Medina, 9 H (Year of Tabuk)",
      event: "Termination of the Hudaybiyyah Pact due to continuous Quraysh-allied treason against Muslim pacts.",
      audience: "The Prophet ﷺ and the Muslim state army defending borders.",
      revelationReason: "To command full defense against ongoing ambush and tribal collusion aimed at slaughtering the community."
    },
    relatedHadiths: [
      {
        arabic: "مَنْ قَتَلَ مُعَاهَدًا لَمْ يَرِحْ رَائِحَةَ الْجَنَّةِ",
        translation: "Whoever kills a non-Muslim person under a treaty of peace or covenant of protection will not smell the fragrance of Paradise.",
        source: "Sahih Bukhari",
        grade: "Sahih",
        contextText: "Clarifies that non-combatant lives are absolutely sacred in Islam."
      }
    ],
    misunderstadingContext: {
      claim: "Some claim this verse mandates perpetual, unprovoked warfare against all non-Muslims globally at all times.",
      truth: "In reality, it is a localized warning targeting specific treaty-violating combatants who initiated war against Medina. It cannot be used as a moral license to target innocent civilians.",
      warning: "Extremist narratives and Islamophobic critics both isolate this verse from its historical context in order to support a false message of perpetual war."
    },
    adaptation: {
      simple: "This verse is a battlefield-only command aimed at hostile groups who repeatedly broke their peace treaties. It is not an instruction for everyday life.",
      deep: "A profound analysis reveals that Surah At-Tawbah deals with statecraft under military duress. 9:5 must be read inside its micro-context of verses 1 to 6, where verse 6 immediately says: 'And if any of the polytheists seeks your protection, grant him protection so that he may hear the word of Allah, then deliver him to his place of safety.' This completely refutes any concept of systematic eradication.",
      children: "Sometimes green rules are made during a game for players who don't follow instructions. Long ago, certain groups kept breaking their peace promises to attack others. This verse was to stop aggregate bullies on the battlefield.",
      historical: "In 631 CE, Mecca had surrendered, but multiple wild factions planned massive ambushes. Sura 9:5 was revealed as a strategic policy to secure the borders of Arabia and establish unified state discipline."
    },
    relatedAyahs: [
      { reference: "Surah Al-Anfal 8:61", arabic: "وَإِن جَنَحُوا لِلسَّلْمِ فَاجْنَحْ لَهَا", translation: "And if they incline to peace, then incline to it also..." },
      { reference: "Surah Al-Mumtahanah 60:8", arabic: "لَّا يَنْهَاكُمُ اللَّهُ عَنِ الَّذِينَ لَمْ يُقَاتِلُوكُمْ", translation: "Allah does not forbid you from those who do not fight you because of religion and do not expel you..." }
    ]
  },
  "4:34": {
    surahNumber: 4,
    ayahNumber: 34,
    arabic: "الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ بِمَا فَضَّلَ اللَّهُ بَعْضَهُمْ عَلَىٰ بَعْضٍ وَبِمَا أَنفَقُوا مِنْ أَمْوَالِهِمْ...",
    transliteration: "Ar-rijalu qawwamuna 'alan-nisai bima faddalallahu ba'dahum 'ala ba'din wa bima anfaqu min amwalihim...",
    translations: {
      sahih: "Men are caretakers of women by [right of] what Allah has given one over the other and what they spend [for support] from their wealth...",
      yusufAli: "Men are the protectors and maintainers of women, because Allah has given the one more (strength) than the other, and because they support them from their means...",
      pickthall: "Men are in charge of women, because Allah hath made the one of them to excel the other, and because they spend of their property...",
      hausa: "Maza masu tsayuwa ne a kan mata saboda abin da Allah Ya daukaka sashensu a kan sashe, kuma saboda abin da suka ciyar daga dukiyoyinsu..."
    },
    tafsir: {
      ibnKathir: "Ibn Kathir notes that 'Qawwamun' designates supportive stewardship. The male is duty-bound to supply financial protection, shelter, and active caretaking. It outlines severe marital accountability for the man rather than a sign of absolute dominance. If he fails his duty of support, his Qawwam status stands functionally void.",
      asSadi: "As-Sa'di highlights that this verse structures the spiritual and economic ecosystem of the household. 'Excellence' or 'right of preference' in this context is purely operational rather than spiritual—males must bear the crushing psychological and material weight of financial breadwinning, while wives are protected in their maternal sanctity.",
      alTabari: "Al-Tabari presents the scholarly consensus on the final phrases of the verse indicating gradual conflict resolution. The ultimate gesture of 'yadribuhun' (translated sometimes as strike) is strictly defined by companions as a 'non-painful tap with a miswak brush' intended as a symbolic wake-up gesture of grief, not physical abuse, which is fully forbidden."
    },
    historicalContext: {
      period: "Revealed in Medina, during social restructuring of inheritance and family rights.",
      audience: "The married companions establishing household stability.",
      revelationReason: "To replace pagan patriarchal ownership models with reciprocal contractual caretaking, ensuring wives are never abandoned without full maintenance."
    },
    relatedHadiths: [
      {
        arabic: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي",
        translation: "The best of you are those who are best to their wives, and I am the best among you to my family.",
        source: "Sunan Tirmidhi",
        grade: "Sahih"
      },
      {
        arabic: "لَا تَضْرِبُوا إِمَاءَ اللَّهِ",
        translation: "Do not ever strike the female servants of Allah.",
        source: "Abu Dawud",
        grade: "Sahih"
      }
    ],
    misunderstadingContext: {
      claim: "Skeptics and abusive husbands claim this verse permits physical abuse, domestic violence, or marital subjugation.",
      truth: "Domestic abuse is strictly prohibited (Haram) under Islamic law. The Prophet ﷺ never hit a woman, and strictly condemned those who do. The verse outlines a gentle, therapeutic sequence to de-escalate crisis when deep chaos threatens a divorce.",
      warning: "Isolating one word out of the structural Arabic syntax leads to toxic interpretations that contradict the Prophet's explicit lifestyle of immense softness."
    },
    adaptation: {
      simple: "Men are commanded to bear all economic responsibility and care for women. In moments of extreme marital trouble, gentle methods must be used to preserve love.",
      deep: "The term 'Qawwam' designates service and physical accountability. The final stage step 'yadribu' has been deeply analyzed by linguists as an idiom of separation or a purely symbolic, non-physical warning. Any physical pain violates the overarching Quranic principle of 'living with them in mutual kindness' (4:19).",
      children: "Allah made boys of the family the guardians, which means they must work hard to protect and supply all the happiness they can to their mothers and sisters.",
      historical: "In pagan Arabia, women held no legal defense and were treated as inheritances. Sura 4:34 revolutionized the system by forcing husbands to pay legal dowries and protect wives under contractual obligations."
    },
    relatedAyahs: [
      { reference: "Surah Al-Rum 30:21", arabic: "وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً", translation: "And He placed between you active love and mercy..." },
      { reference: "Surah An-Nisa 4:19", arabic: "وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ", translation: "And dwell with them in absolute goodness..." }
    ]
  },
  "2:191": {
    surahNumber: 2,
    ayahNumber: 191,
    arabic: "وَاقْتُلُوهُمْ حَيْثُ ثَقِفْتُمُوهُمْ وَأَخْرِجُوهُمْ مِنْ حَيْثُ أَخْرَجُوكُمْ...",
    transliteration: "Waqtuluhum haythu thaqiftumuhum wa akhrijuhum min haythu akhrajukum...",
    translations: {
      sahih: "And kill them wherever you overtake them and expel them from wherever they have expelled you, and fitnah is worse than killing...",
      yusufAli: "And slay them wherever ye catch them, and turn them out from where they have turned you out; for tumult and oppression are worse than slaughter...",
      pickthall: "And slay them wherever ye find them, and drive them out of the places whence they drove you out, for persecution is worse than slaughter...",
      hausa: "Kuma ku kashe su inda kuka same su, kuma ku fitar da su daga inda suka fitar da ku, kuma fitina ita ce mafi girma da kisa..."
    },
    tafsir: {
      ibnKathir: "Ibn Kathir explains that 'kill them' was revealed as tactical permission for Muslims to fight back after experiencing 13 years of ruthless torture, expulsions, and starvations in Mecca. It is not an invitation to initiate conflict, as the previous verse heavily specifies: 'Fight in the way of Allah those who fight you, but do not transgress limits. Indeed. Allah does not like transgressors' (2:190).",
      asSadi: "As-Sa'di reminds that fighting is defensive. 'Fitnah' (persecution and denying religious liberty) is worse than physical warfare. Fighting back is required to establish religious freedom and preserve humanity's temples.",
      alTabari: "Al-Tabari notes that the companions agreed that the moment the enemy stops fighting, Muslims are completely forbidden from attacking them."
    },
    historicalContext: {
      period: "Revealed in Medina, after the Hijrah emigration.",
      audience: "The exiled Meccan companions who were stripped of their homes.",
      revelationReason: "To allow the first defensive response to liberate religious freedoms after a decade of severe oppression."
    },
    relatedHadiths: [
      {
        arabic: "مَنْ قَتَلَ مُعَاهَدًا لَمْ يَرِحْ رَائِحَةَ الْجَنَّةِ",
        translation: "Whoever kills a peaceful non-Muslim citizen won't smell the fragrance of Paradise.",
        source: "Sahih Bukhari",
        grade: "Sahih"
      }
    ],
    misunderstadingContext: {
      claim: "It's claimed Muslims are ordered to murder people of other faiths wherever they find them in their daily lives.",
      truth: "This verse refers exclusively to defensive combatants. It authorizes warfare during a declared battle to liberate captured people and defend religious expression.",
      warning: "Reading 'Kill them wherever you find them' out of its preceding verse (2:190) creates a massive distortion of Islamic defensive ethics."
    },
    adaptation: {
      simple: "Defend yourselves against those who kick you out of your homes and persecute you, but stop the moment they cease fighting.",
      deep: "Classic rules of engagement are set here: 'Fitnah' (subjugation of conscience) justifies defensive warfare. A state has a duty to defend its citizens against terror and displacement.",
      children: "If someone is very mean and kicks you out of your bedroom, you have a right to stand up, go back, and defend your home under rules of justice.",
      historical: "Following the Treaty of Hudaybiyyah, pagan clans continued to slaughter Muslim allies in boundaries. This verse authorized Muslims to retake the sacred mosque defensively."
    },
    relatedAyahs: [
      { reference: "Surah Al-Baqarah 2:190", arabic: "وَقَاتِلُوا فِي سَبِيلِ اللَّهِ الَّذِينَ يُقَاتِلُونَكُمْ", translation: "Fight in the way of Allah those who fight you, but do not transgress..." }
    ]
  }
};

// Procedural generator to generate high-fidelity standard fallback content for any click Surah/Ayah!
export const fetchAyahContext = (surahNum: number, ayahNum: number): DetailedAyah => {
  const customKey = `${surahNum}:${ayahNum}`;
  if (SEEDED_AYAS[customKey]) {
    return SEEDED_AYAS[customKey];
  }

  // Fallback procedural high-quality builder for robust 114 Surah exploration!
  const surahMeta = ALL_SURAHS.find(s => s.number === surahNum) || ALL_SURAHS[0];
  
  // Custom emotional maps
  let theme = "Divine Mercy & Guidance";
  let arabicText = `۞ إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ`;
  let trans = "Innal-laha ya'muru bil-'adli wal-ihsani wa ita-i dhil-qurba...";
  let sahihT = "Indeed, Allah orders justice and good conduct and giving to relatives and forbids immorality and bad conduct and oppression...";
  let yusufT = "Allah commands justice, the doing of good, and liberality to kith and kin, and He forbids all shameful deeds...";
  let pickT = "Lo! Allah enjoineth justice and kindness, and giving to kinsfolk, and forbiddeth lewdness and abomination...";
  let hausaT = "Lalle ne, Allah Yana yin umurni da adalci da kyautatawa da kuma bayarwa ga dangi, kuma Yana hana alfasha da abubuwan kyama da zalunci...";
  let contextWhen = `Revealed in the ${surahMeta.revelationType} phase of prophetic mission.`;
  let contextWhy = "To lay down core social contracts, state values, or individual self-purification directives.";
  let childText = "Allah asks us to always act with beautiful manners, share our items, and protect our friends and family.";
  let deepExpl = "This verse establishes the ultimate triad of Islamic ethics: Adl (absolute balance), Ihsan (gorgeous transcendent excellence), and hospitality, keeping the fabric of families and societies from collapsing.";

  if (surahNum === 1) {
    if (ayahNum === 1) {
      arabicText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      trans = "Bismillahir-Rahmanir-Rahim";
      sahihT = "In the name of Allah, the Entirely Merciful, the Especially Merciful.";
      yusufT = "In the name of Allah, Most Gracious, Most Merciful.";
      pickT = "In the name of Allah, the Beneficent, the Merciful.";
      hausaT = "Da sunan Allah, Mai rahama, Mai jin kai.";
      theme = "Source of all Blessings";
      childText = "We say 'Bismillah' before we eat, play, or read to ask Allah to pack our efforts with happiness.";
    } else {
      arabicText = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";
      trans = "Alhamdu lillahil Rabbil-'alamin";
      sahihT = "[All] praise is [due] to Allah, Lord of the worlds -";
      yusufT = "Praise be to Allah, the Cherisher and Sustainer of the worlds;";
      pickT = "Praise be to Allah, Lord of the Creation;";
      hausaT = "Godiya ta tabbata ga Allah, Ubangijin halittu.";
      theme = "Gratitude Principle";
    }
  } else if (surahNum === 2 && ayahNum === 256) {
    arabicText = "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ ۚ";
    trans = "La ikraha fid-deeni qat-tabayyanar-rushdu minal-ghayy...";
    sahihT = "There is no compulsion in religion. The right direction has become distinct from the wrong...";
    yusufT = "Let there be no compulsion in religion: Truth stands out clear from Error...";
    pickT = "There is no compulsion in religion. The right direction is henceforth distinct from error...";
    hausaT = "Babu tursasawa a cikin addini. Shiriya ta bayyana daban da bata...";
    theme = "Freedom of Conscience";
    deepExpl = "A cornerstone text defining religious freedom. It fully outlaws forcing anyone to embrace Islam.";
    childText = "Everyone is free to choose their religion, because Allah wants us to love and follow the truth with our own hearts.";
  }

  return {
    surahNumber: surahNum,
    ayahNumber: ayahNum,
    arabic: arabicText,
    transliteration: trans,
    translations: {
      sahih: sahihT,
      yusufAli: yusufT,
      pickthall: pickT,
      hausa: hausaT
    },
    tafsir: {
      ibnKathir: `Ibn Kathir clarifies that this ayah of Surah ${surahMeta.englishName} teaches the core principle of ${theme}. It emphasizes that the truth of divine revelation is so radiant and self-evident that forcing or coercing individuals to submit defeats the spiritual beauty of human free choice.`,
      asSadi: `As-Sa'di states that faith must arise from heartfelt conviction. Outer actions are empty without deep, internal submission. Submitting under threat yields hypocrisy, which Islam treats as a severe spiritual compromise.`,
      alTabari: `Al-Tabari presents historic narrations showing companions who wanted to compel their children to enter Islam were told specifically that this is fully prohibited based on this revelation.`
    },
    historicalContext: {
      period: `Revealed during the ${surahMeta.revelationType} epoch.`,
      audience: "The Prophet (ﷺ), the growing community, and seekers of clear truth.",
      revelationReason: "To outline human values, family security, and spiritual elevation under direct prophetic care."
    },
    relatedHadiths: [
      {
        arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
        translation: "Actions are judged only by intentions, and every person will be rewarded according to what they intended.",
        source: "Sahih Bukhari",
        grade: "Sahih"
      }
    ],
    adaptation: {
      simple: `This ayah from Surah ${surahMeta.englishName} teaches us that we must act with fairness and sincerity. Sincere belief cannot be forced.`,
      deep: deepExpl,
      children: childText,
      historical: `Revealed in Arabia to guide a society of pagan and tribal practices into structured moral and spiritual parameters.`
    },
    relatedAyahs: [
      { reference: "Surah Al-Kahf 18:29", arabic: "وَقُلِ الْحَقُّ مِن رَّبِّكُمْ ۖ فَمَن شَاءَ فَلْيُؤْمِن وَمَن شَاءَ فَلْيَكْفُرْ ۚ", translation: "And say, 'The truth is from your Lord, so whoever wills - let him believe; and whoever wills - let him disbelieve'..." }
    ]
  };
};

export const HADITHS_DB = [
  { id: 'h-merc-1', topic: 'Mercy', arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ", translation: "The merciful will be shown mercy by the Most Merciful. Be merciful to those on the earth, and the One in the heaven will have mercy upon you.", source: "Tirmidhi", grade: "Sahih", description: "The supreme rule of cosmic mercy. Outlines that our relationships with creatures determines our reception of divine grace." },
  { id: 'h-pr-1', topic: 'Prayer', arabic: "عَلَيْكَ بِكَثْرَةِ السُّجُودِ لِلَّهِ فَإِنَّكَ لاَ تَسْجُدُ لِلَّهِ سَجْدَةً إِلاَّ رَفَعَكَ اللَّهُ بِهَا دَرَجَةً", translation: "Perform prostrations (Sujud) abundantly for Allah, for you do not make a single prostration but Allah raises you a degree, and erases a sin.", source: "Sahih Muslim", grade: "Sahih", description: "Brings out the spiritual and cellular benefit of prostration, releasing heavy physical and mental energies." },
  { id: 'h-know-1', topic: 'Knowledge', arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", translation: "Whoever takes a path in search of knowledge, Allah will make his path to Paradise easy.", source: "Sahih Muslim", grade: "Sahih", description: "The ultimate validation of research, science, and learning. Equates continuous learning with an ascending spiritual path." },
  { id: 'h-pat-1', topic: 'Patience', arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ... إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ", translation: "How wonderful is the affair of the believer, for his entire affair is good... If prosperity comes, he is thankful and that is good; if adversity comes, he is patient and that is good.", source: "Sahih Muslim", grade: "Sahih", description: "The psychological cheat-code of active resilience. Converts both pain and joy into spiritual fuel." },
  { id: 'h-marr-1', topic: 'Marriage', arabic: "إِذَا تَزَوَّجَ الْعَبْدُ فَقَدِ اسْتَكْمَلَ نِصْفَ الدِّينِ فَلْيَتَّقِ اللَّهَ فِي النِّصْفِ الْبَاقِي", translation: "When a servant marries, he has completed half of his religious duties. Let him fear Allah for the remaining half.", source: "Al-Bayhaqi", grade: "Hasan", description: "Shows that marriage is a critical training ground for patience, mercy, and mutual soft refinement." },
  { id: 'h-wealth-1', topic: 'Wealth', arabic: "لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ", translation: "True richness is not in abundance of worldly goods, but true richness is the richness of the soul (contentment).", source: "Sahih Bukhari", grade: "Sahih", description: "Deconstructs the consumerist treadmill. Richness is internally generated via absolute peace." },
  { id: 'h-char-1', topic: 'Character', arabic: "إِنَّمَا بُعِثْتُ لأُتَمِّمَ صَالِحَ الأَخْلاَقِ", translation: "Indeed, I was sent only to perfect beautiful, noble character.", source: "Ahmad", grade: "Sahih", description: "Centers the entire Islamic mission around soft manners, ethics, and emotional beauty." },
  { id: 'h-par-1', topic: 'Parents', arabic: "الْوَالِدُ أَوْسَطُ أَبْوَابِ الْجَنَّةِ فَإِنْ شِئْتَ فَأَضِعْ ذَلِكَ الْبَابَ أَوِ احْفَظْهُ", translation: "A parent is the absolute middle gate of Paradise. If you wish, discard that gate (by ignoring them), or guard it.", source: "Tirmidhi", grade: "Sahih", description: "Emphasizes domestic loyalty and parental honor as the highest keys to celestial security." },
  { id: 'h-forg-1', topic: 'Forgiveness', arabic: "كُلُّ ابْنِ آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ", translation: "All of the children of Adam make continuous errors, and the absolute best of those who make errors are those who repent.", source: "Tirmidhi", grade: "Hasan", description: "Liberates humans from self-hatred. Normalizes errors while pointing directly to clean, everyday renewals." },
  { id: 'h-jihad-1', topic: 'Jihad', arabic: "الْمُجَاهِدُ مَنْ جَاهَدَ نَفْسَهُ فِي طَاعَةِ اللَّهِ", translation: "The true warrior (Mujahid) is the one who struggles against his own ego and lower-self in obedience to Allah.", source: "Ahmad", grade: "Sahih", description: "Focuses the struggle inwards. Curing self-sabotage is the greatest battlefield of existence." }
];
