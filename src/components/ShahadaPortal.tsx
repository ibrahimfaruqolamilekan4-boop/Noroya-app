import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Volume2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  BookOpen, 
  MessageCircle, 
  ShieldCheck,
  Globe,
  Star,
  Sun,
  Backpack,
  Compass,
  Map,
  Compass as CompassIcon,
  HelpCircle,
  FileText,
  Calendar,
  Layers,
  Award,
  BookOpenCheck,
  Activity,
  User,
  TrendingUp,
  ListTodo,
  Smile,
  Info,
  ChevronDown,
  VolumeX,
  Play,
  RotateCcw,
  BookMarked,
  HeartCrack,
  Flame,
  Clock,
  Briefcase,
  Layers3,
  Lightbulb,
  CornerDownRight,
  BookCheck,
  MapPin,
  Sparkle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Datasets for Reverts/New Muslim Interactive Roadmap

interface ProphetTimeline {
  id: string;
  name: string;
  arabicName: string;
  order: number;
  period: string;
  story: string;
  lessons: string[];
  miracles: string[];
  quranRefs: string[];
  application: string;
}

const PROPHETS_DB: ProphetTimeline[] = [
  {
    id: 'p-adam',
    name: 'Adam',
    arabicName: 'آدم',
    order: 1,
    period: 'Beginning of Humanity',
    story: 'The first of creation, sculpted from clay by divine hands. Blessed with knowledge of the names of all things, tested in Paradise, and taught the beauty of immediate, heartfelt repentance.',
    lessons: [
      'Repentance removes all distance between you and Allah.',
      'Sincerity is your ultimate armor against doubt.'
    ],
    miracles: ['Formed without parents', 'Taught the names of all creation'],
    quranRefs: ['Surah Al-Baqarah 2:30-37', 'Surah Al-A\'raf 7:19-25'],
    application: 'When you make a mistake, do not let despair set in. Run back to Allah immediately, recognizing that turning back is the core of human beauty.'
  },
  {
    id: 'p-nuh',
    name: 'Noah (Nuh)',
    arabicName: 'نوح',
    order: 2,
    period: 'Pre-Deluge Era',
    story: 'Preached the pure message of monotheism with infinite patience and steadfast resilience for 950 years. He was commanded to construct the sacred Ark, preserving life during the global cleansing.',
    lessons: [
      'Patience in inviting people to truth is never wasted.',
      'Trust Allah\'s commands even when those around you mock them.'
    ],
    miracles: ['The Sacred Ark withstands the Great Deluge', 'Command over animal pairs'],
    quranRefs: ['Surah Nuh 71:1-28', 'Surah Hud 11:36-49'],
    application: 'If your friends or family do not accept your new faith initially, exhibit beautiful patience, hold your boundaries, and trust Allah to guide them.'
  },
  {
    id: 'p-ibrahim',
    name: 'Abraham (Ibrahim)',
    arabicName: 'إبراهيم',
    order: 3,
    period: 'Mesopotamia & Arabia',
    story: 'Known as the Friend of Allah (Khalilullah). Tested with direct fire, the calling of his progeny, and leaving details of survival in the desert of Mecca. He built the Kaaba with his son Isma\'il.',
    lessons: [
      'Tawheed (Oneness) is logical, sound, and natural.',
      'Complete submission to Allah yields cosmic peace.'
    ],
    miracles: ['Surviving the blazing pyre of Nimrod', 'Water springing from Zamzam for his family'],
    quranRefs: ['Surah Al-Anbiya 21:51-69', 'Surah Al-Baqarah 2:124-129'],
    application: 'Always apply high intellect and logic to find truth. When you submit to the One Creator fully, no fire of worldly distress can burn you.'
  },
  {
    id: 'p-musa',
    name: 'Moses (Musa)',
    arabicName: 'موسى',
    order: 4,
    period: 'Exodus of Egypt',
    story: 'The prophet who spoke directly to Allah (Kalimullah). Sent to stand up against the ultimate tyrant, Pharaoh, and lead theChildren of Israel to physical and spiritual salvation.',
    lessons: [
      'Courage is built when you recognize that Allah is with you.',
      'The law of Allah is meant to liberate minds, not cage them.'
    ],
    miracles: ['The parting of the Red Sea', 'The glowing hand', 'The staff turning into a serpent'],
    quranRefs: ['Surah Taha 20:9-98', 'Surah Al-Qasas 28:3-43'],
    application: 'When facing immense social pressure or corporate oppression, remind your heart of Musa\'s words: "No, indeed! My Lord is with me; He will guide me."'
  },
  {
    id: 'p-isa',
    name: 'Jesus (Isa)',
    arabicName: 'عيسى',
    order: 5,
    period: 'Levant Ministry',
    story: 'The Messiah and Spirit from Allah, born of the virgin Maryam (Mary). He preached high mercy, ultimate simplicity, spiritual sincerity, and the true inner dimensions of divine scripture.',
    lessons: [
      'Islam is a religion of absolute love, peace, and deep mystical devotion.',
      'The heart must be cleansed of worldly arrogance and vanity.'
    ],
    miracles: ['Speaking from the cradle', 'Healing the blind and leper', 'Raising the dead by divine leave'],
    quranRefs: ['Surah Maryam 19:16-36', 'Surah Al-Ma\'idah 5:110-118'],
    application: 'Cherish the stories of Jesus as an integral, core part of your Islamic faith. Seek high spiritual purification and avoid judging others based on external performance.'
  },
  {
    id: 'p-muhammad',
    name: 'Muhammad',
    arabicName: 'محمد ﷺ',
    order: 6,
    period: 'Seerah Era (Medina & Mecca)',
    story: 'The Seal of all Prophets and Mercy to the Worlds. Received the final revelation of the Qur\'an over 23 years. Balanced deep spiritual ascendancy with perfect social justice, kindness, and character.',
    lessons: [
      'Noble character (Akhlaq) is the heaviest item in the scale of deeds.',
      'A true believer is simple, gentle, and useful to others.'
    ],
    miracles: ['The Holy Qur\'an', 'The night journey (Isra\' and Mi\'raj)', 'Splitting of the moon'],
    quranRefs: ['Surah Al-Ahzab 33:21', 'Surah Al-Fath 48:1-29', 'Surah Al-Qalam 68:4'],
    application: 'Study the life of the Prophet ﷺ daily. Adopt his methodology of gentleness, truthfulness, and standing firm for justice without hatred.'
  }
];

interface Companion {
  id: string;
  name: string;
  arabicTitle: string;
  role: string;
  trait: string;
  bio: string;
  lessons: string[];
}

const COMPANIONS_DB: Companion[] = [
  {
    id: 'c-abubakr',
    name: 'Abu Bakr Al-Siddiq',
    arabicTitle: 'الصِّدِّيق',
    role: 'The First Caliph & Closest Friend',
    trait: 'Absolute Sincerity & Trust',
    bio: 'The closest companion of the Prophet ﷺ who donated his entire wealth for the sake of Allah. He was known for his gentle warmth, unshakable trust in truth, and immediate protection of the weak.',
    lessons: ['Unconditional trust in Allah resolves all worldly calculations.', 'Your strength is measured by how you support the vulnerable.']
  },
  {
    id: 'c-umar',
    name: 'Umar Ibn Al-Khattab',
    arabicTitle: 'الفاروق',
    role: 'The Second Caliph & Bridge Builder',
    trait: 'Perfect Justice & Courage',
    bio: 'A man of immense strength and courage who separated truth from falsehood. He revolutionized the welfare system, established structured local councils, and walked the streets at night to find hungry children.',
    lessons: ['Justice must be blind to power or status.', 'True leadership is being an active servant to those under your charge.']
  },
  {
    id: 'c-uthman',
    name: 'Uthman Ibn Affan',
    arabicTitle: 'ذو النورين',
    role: 'The Third Caliph & Patron of Literacy',
    trait: 'Modesty & Silent Generosity',
    bio: 'Renowned for his high modesty, gentleness, and unmatched philanthropy. He financed entire military defenses, purchased public wells to guarantee clean water access, and compiled the standard Qur\'anic manuscript.',
    lessons: ['Modesty protects the soul from worldly corruption.', 'Wealth is a tool to build permanent public benefits (Sadaqah Jariyah).']
  },
  {
    id: 'c-ali',
    name: 'Ali Ibn Abi Talib',
    arabicTitle: 'باب العلم',
    role: 'The Fourth Caliph & Master of Wisdom',
    trait: 'Deep Knowledge & Valiancy',
    bio: 'The cousin and son-in-law of the Prophet ﷺ who slept in his bed as a decoy when the persecutors surrounded his house. He was the gate of spiritual knowledge, logic, unmatched poetry, and raw courage.',
    lessons: ['True strength is conquering your own ego.', 'Knowledge must lead to deep humility, never arrogance.']
  },
  {
    id: 'c-aisha',
    name: 'Aisha Bint Abi Bakr',
    arabicTitle: 'عائشة رضي الله عنها',
    role: 'The Leading Female Scholar & Mother of Believers',
    trait: 'Intellectual Brilliance & Memory',
    bio: 'A master jurist, direct community educator, and narrator of thousands of authentic traditions about the private, delicate, and beautiful aspects of the Prophet\'s character. She defined Islamic women\'s scholarly leadership.',
    lessons: ['Study, research, and teach with high intellectual rigor.', 'The home is a beautiful sanctuary of mutual appreciation and play.']
  }
];

interface FivePillar {
  id: string;
  name: string;
  arabicName: string;
  importance: string;
  howToPractice: string[];
  verseRef: string;
  hadithText: string;
}

const PILLARS_DB: FivePillar[] = [
  {
    id: 'p-shahada',
    name: 'Shahada',
    arabicName: 'الشهادة',
    importance: 'The foundational declaration of pure monotheism and alignment with the prophetic path.',
    howToPractice: [
      'Believe with absolute conviction inside the heart.',
      'Pronounce the testimony of faith with clarity.',
      'Live your daily actions conforming to divine love.'
    ],
    verseRef: '"Allah witnesses that there is no deity except Him, and so do the angels and those of knowledge..." (3:18)',
    hadithText: '"Islam is built upon five: testifying that there is no god but Allah and Muhammad is His messenger..." (Bukhari)'
  },
  {
    id: 'p-salah',
    name: 'Salah (Prayer)',
    arabicName: 'الصلاة',
    importance: 'The direct cellular conversation with your Creator, performed five times daily to reset the spirit.',
    howToPractice: [
      'Perform clean ritual wash (Wudu) before praying.',
      'Face the Qibla (direction of Mecca) and surrender.',
      'Move mindfully through standing, bowing, and prostration.'
    ],
    verseRef: '"Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater..." (29:45)',
    hadithText: '"The nearest a servant comes to their Lord is when they are in prostration (Sujud), so increase supplication..." (Muslim)'
  },
  {
    id: 'p-zakat',
    name: 'Zakat (Almsgiving)',
    arabicName: 'الزكاة',
    importance: 'The annual extraction of 2.5% of excess savings to purify wealth and keep society balanced.',
    howToPractice: [
      'Assess hold assets after an entire lunar year.',
      'Calculate exactly 2.5% from non-essential savings.',
      'Distribute directly to the poor, orphans, and standard welfare causes.'
    ],
    verseRef: '"Take, [O Muhammad], from their wealth a charity by which you purify them and cause them increase..." (9:103)',
    hadithText: '"Allah has made Zakat obligatory as a mercy to purify your remaining wealth..." (Abu Dawud)'
  },
  {
    id: 'p-sawm',
    name: 'Sawm (Fasting)',
    arabicName: 'الصوم',
    importance: 'Fast during the month of Ramadan from dawn to sunset to reset biology and nurture God-consciousness (Taqwa).',
    howToPractice: [
      'Set intention of absolute fast every night.',
      'Refrain from food, drink, and intimate relations from Fajr to Maghrib.',
      'Guard eyes, ears, and tongue from gossip and bad words.'
    ],
    verseRef: '"O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous..." (2:183)',
    hadithText: '"Whoever fasts Ramadan out of sincere faith and hoping for reward, their past sins will be forgiven..." (Bukhari)'
  },
  {
    id: 'p-hajj',
    name: 'Hajj (Pilgrimage)',
    arabicName: 'الحج',
    importance: 'The epic spiritual journey of a lifetime to the valley of Mecca to walk together with millions of equals.',
    howToPractice: [
      'Perform once in a lifetime if physically and financially capable.',
      'Enter state of high peace (Ihram) wearing simple white sheets.',
      'Tread the steps of Abraham, Hajar, and Prophet Muhammad ﷺ.'
    ],
    verseRef: '"And proclamation to the people of the Hajj; they will come to you on foot and on every lean camel..." (22:27)',
    hadithText: '"An accepted Hajj brings no less reward than paradise..." (Bukhari)'
  }
];

interface DuaItem {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  benefit: string;
}

const DUAS_DB: DuaItem[] = [
  {
    id: 'd-morning',
    category: 'morning',
    title: 'Waking Up in Gratitude',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
    translation: 'Praise be to Allah Who gave us life after He had caused us to die, and to Him is the ultimate resurrection.',
    benefit: 'Waking up with gratitude aligns your biological focus on hope rather than survival fear.'
  },
  {
    id: 'd-sleep',
    category: 'sleep',
    title: 'Safe Sleep Protection',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live.',
    benefit: 'Releases the anxious hold over control, sleeping in peaceful surrender to the Divine.'
  },
  {
    id: 'd-anxiety',
    category: 'anxiety',
    title: 'Ease of Heavy Burden',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    benefit: 'The prayer of Jonah in the whale belly. Dissolves suffocating stress, anxiety, or depression.'
  },
  {
    id: 'd-eating',
    category: 'eating',
    title: 'Blessing Over Food',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    transliteration: 'Bismillahi wa \'ala barakatillah',
    translation: 'In the name of Allah and upon the blessing of Allah.',
    benefit: 'Engages conscious portion sizes, structural appreciation, and spiritual presence.'
  },
  {
    id: 'd-travel',
    category: 'travel',
    title: 'Protection in Transit',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
    transliteration: 'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinina',
    translation: 'Exalted is He who has subjected this to us, and we could not have otherwise subdued it.',
    benefit: 'Packs your commuting journey with ultimate safety awareness and divine protection.'
  }
];

const SURVIVAL_GUIDE_DB = [
  {
    title: 'What if my family disagrees?',
    advice: 'Guidance and affection. Maintain standard kindness, do not isolate your family or start arguments about theology. Cook for them, serve them, show them that Islam has made you more respectful and loving towards them. Their hearts will soften when they notice your beautiful character.',
    icon: Heart
  },
  {
    title: 'I don’t know any Arabic yet',
    advice: 'Allah built your motherboard and understands every dialect, sigh, and language. Recite translations in your personal supplications. For ritual prayers (Salah), start simply by saying "Subhanallah", "Alhamdulillah", or "Allahu Akbar". Take your time learning and remember that every struggling reciter is rewarded twice!',
    icon: Sparkles
  },
  {
    title: 'I miss prayers or feel overwhelmed',
    advice: 'Gradual growth is a divine principle. If you fail to meet all five, start with two. Dedicate your heart to consistent progress. Do not allow guilt to prevent you from showing up next time. A slow, steady staircase is infinitely safer than an emotional sprint that leads to burnout.',
    icon: Award
  },
  {
    title: 'How to transition to wearing Hijab',
    advice: 'Hijab is an internal and external journey of liberation. Step forward quietly when your heart matches. You can start by wearing modest garments, loose shapes, and learning under gentle, supportive Muslim sisters. It is not an overnight exam, but an ongoing elevation.',
    icon: ShieldCheck
  },
  {
    title: 'Finding authentic Muslim friends',
    advice: 'Seek active volunteer circles, community spaces, study groups, or clean mosques rather than social media forums. True friends are those whose absolute presence prompts you to remember the light. If you feel alone, call our local Noroya sisterhood networks or mentorship forums.',
    icon: Globe
  }
];

const HISTORY_LANDMARKS_DB = [
  {
    name: "Makkah (Mecca)",
    coords: { x: "25%", y: "65%" },
    event: "The Sanctuary of Peace & Birth of Prophethood",
    details: "The geographical epicenter of monotheism. Houses the ancient Kaaba built by Abraham. Reverts learn that turning towards Mecca isn't about worshipping stone, but about joining the alignment of the human family looking toward the light."
  },
  {
    name: "Madinah (Medina)",
    coords: { x: "28%", y: "42%" },
    event: "The City of Loving Brotherhood",
    details: "The shelter where the early Muslims of Mecca fled persecution and were met with the ultimate love by the citizens of Medina (Ansar). This city laid the framework of a peaceful, multi-cultural, and harmonious society under prophetic leadership."
  },
  {
    name: "Battle of Badr Valley",
    coords: { x: "18%", y: "55%" },
    event: "The Triumph of Quality over Quantity",
    details: "A legendary turning point where 313 ill-equipped companions stood firmly against a massive oppressive force. It teaches new Muslims that absolute numerical size is secondary to genuine, pure conviction inside local systems."
  },
  {
    name: "Mount or Field of Uhud",
    coords: { x: "32%", y: "30%" },
    event: "The Vital Lesson of Spiritual Discipline",
    details: "A classic defensive campaign that became difficult when archers abandoned their tactical assignments for material gain. Serves as a great reminder to reverts that internal growth, patient discipline, and following wisdom always supersede rush."
  },
  {
    name: "Jerusalem (Al-Quds)",
    coords: { x: "42%", y: "15%" },
    event: "The Sacred Bridge of All Messengers",
    details: "The site of Al-Aqsa, the first Qibla redirect and the sacred sanctuary where the Prophet ﷺ led all prior emissaries (Adam, Moses, Jesus) in prayer during his Ascension. Exemplifies Islam as the final unified completion of divine wisdom."
  }
];

const ALL_SURAHS_SHORT = [
  { number: 1, name: "Al-Fatihah", englishName: "The Opening", ayahs: 7, arabic: "الفاتحة", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds..." },
  { number: 112, name: "Al-Ikhlas", englishName: "The Sincerity", ayahs: 4, arabic: "الإخلاص", translation: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.'" },
  { number: 113, name: "Al-Falaq", englishName: "The Daybreak", ayahs: 5, arabic: "الفلق", translation: "Say, 'I seek refuge in the Lord of the daybreak, From the evil of that which He created, And from the evil of darkness when it settles...'" },
  { number: 114, name: "An-Nas", englishName: "Mankind", ayahs: 6, arabic: "الناس", translation: "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer...'" }
];

export const ShahadaPortal = () => {
  const [showOpening, setShowOpening] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<'welcome' | 'steps' | 'salah' | 'pillars' | 'prophets' | 'companions' | 'duas' | 'daily' | 'ai' | 'journey' | 'map'>('welcome');
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Audio simulation control State
  const [isPlayingDuaId, setIsPlayingDuaId] = useState<string | null>(null);
  const [activeDuaCategory, setActiveDuaCategory] = useState<string>('morning');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isAtmosphereOn, setIsAtmosphereOn] = useState<boolean>(false);
  
  // Salah Portal Step States
  const [currentSalahStepIdx, setCurrentSalahStepIdx] = useState<number>(0);
  const [salahProgress, setSalahProgress] = useState<number>(0); // completed salah lessons state
  const [isReviewCorrectPosture, setIsReviewCorrectPosture] = useState<boolean>(false);
  
  // "Pray with me" Mode Simulator States
  const [isPrayerSimulatorActive, setIsPrayerSimulatorActive] = useState<boolean>(false);
  const [prayerRakaatCycle, setPrayerRakaatCycle] = useState<number>(1);
  const [prayerActiveStepText, setPrayerActiveStepText] = useState<string>("Stand in pure focus (Qiyam) and raise your wrists. Whisper 'Allahu Akbar' to begin.");
  const [prayerTimeRemaining, setPrayerTimeRemaining] = useState<number>(8); // countdown timer

  // Progress of New Muslim Roadmap Levels
  const [completedRoadmapLessons, setCompletedRoadmapLessons] = useState<string[]>(['lesson-1']);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [selectedProphetId, setSelectedProphetId] = useState<string>('p-adam');
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('c-abubakr');
  const [selectedPillarId, setSelectedPillarId] = useState<string>('p-shahada');
  const [selectedMapLandmark, setSelectedMapLandmark] = useState<any>(HISTORY_LANDMARKS_DB[0]);

  // AI Chat states
  const [aiInquiry, setAiInquiry] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: "Assalamu Alaikum! I am the Guided New Muslim Companion. Ask any question about beginning prayer, understanding Tawheed, halal eating, social relations, or general Islamic rules simply. I am here for you.",
      time: "2:00 PM"
    }
  ]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Reflection/Emotional support panel state
  const [userJournalEntries, setUserJournalEntries] = useState<{ date: string; note: string }[]>([
    { date: "May 20, 2026", note: "Felt so much emotional and biological calmness after reciting the Shahada proclamation." }
  ]);
  const [currentJournalNote, setCurrentJournalNote] = useState<string>('');

  const welcomeSteps = [
    {
      id: 'niyyah',
      title: 'The Divine Intention',
      subtitle: 'Al-Niyyah',
      description: 'Islam is built of internal sincerity. Pause, calm your chest, focus strictly on the Creator of all stars, and establish your willingness to seek absolute light.',
    },
    {
      id: 'shahada-declaration',
      title: 'The Declaration of Light',
      subtitle: 'The Shahada',
      description: 'The key that washes away your past errors and unlocks permanent sanctuary. Recite these sacred vowels with true conviction.',
    },
    {
      id: 'pure-refresh',
      title: 'A Beautiful New Dawn',
      subtitle: 'Your Slate is Perfect',
      description: 'The moment your heart commits to these syllables, every single error of your past is instantly converted into beautiful light. You are born again today.',
    }
  ];

  // Salah portal steps
  const salahSteps = [
    {
      title: 'Step 1: The Intention & Takbeer',
      arabic: 'الله أكبر',
      translit: 'Allahu Akbar',
      meaning: 'Allah is the Greatest',
      posture: 'Stand straight, facing the Qibla direction, raise your hands to your ears, and proclaim.',
      tip: 'Quietly define in your mind which prayer you are performing before lifting your wrists.'
    },
    {
      title: 'Step 2: Recitation of Al-Fatihah',
      arabic: 'الحمد لله رب العالمين...',
      translit: 'Alhamdu lillahi Rabbil \'Alamin...',
      meaning: 'All praise is due to Allah, Lord of the Worlds...',
      posture: 'Cross your hands over your chest (right hand over left) and speak softly.',
      tip: 'If you have not memorized Al-Fatihah, you can read it from a screen or repeat "Subhanallah" (Glory be to Allah).'
    },
    {
      title: 'Step 3: The Bow (Ruku)',
      arabic: 'سبحان ربي العظيم',
      translit: 'Subhana Rabbiyal \'Adheem',
      meaning: 'Glory be to my Lord the Supreme',
      posture: 'Bend at your waist, placing your palms flat on your knees, keeping your back straight.',
      tip: 'Do this three times with steady, deep breaths.'
    },
    {
      title: 'Step 4: The Standing Rise',
      arabic: 'سمع الله لمن حمده',
      translit: 'Sami\' Allahu liman hamidah',
      meaning: 'Allah hears the one who praises Him',
      posture: 'Stand upright again, releasing your arms naturally to your sides.',
      tip: 'Quietly follow by saying "Rabbana walakal-hamd" (Our Lord, and to You is all gratitude).'
    },
    {
      title: 'Step 5: The Prostration (Sujud)',
      arabic: 'سبحان ربي الأعلى',
      translit: 'Subhana Rabbiyal A\'la',
      meaning: 'Glory be to my Lord the Most High',
      posture: 'Kneel down fully, placing your forehead, nose, palms, knees, and toes flat onto the prayer mat.',
      tip: 'The closest you will ever be to Allah physically. Speak all your personal dreams in your own language here!'
    },
    {
      title: 'Step 6: Sitting & Tashahhud',
      arabic: 'التجيات لله والصلوات...',
      translit: 'At-tahiyyatu lillahi was-salawatu...',
      meaning: 'All compliments, prayers, and pure deeds are for Allah...',
      posture: 'Rise to a sitting position, resting your palms flat on your thighs and lifting your index finger.',
      tip: 'This step forms the concluding salutations and sends peace upon all beautiful servants of divine guidance.'
    }
  ];

  // Handle Complete Shahada Flow
  const handleCompleteShahada = async () => {
    setCompleted(true);
    setIsPlaying(false);
    
    if (profile?.uid) {
      try {
        const { dbService } = await import('../services/dbService');
        await dbService.updateRevertStatus(profile.uid, true);
      } catch (err) {
        console.error("Failed to update status in DB:", err);
      }
    }
    toast.success('Assalamu Alaikum! Your beautiful Islamic journey has initiated.');
    setActivePortalTab('welcome');
  };

  const handleNextStep = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCompleteShahada();
    }
  };

  // Dua Audio simulation toggle
  const simulatedPlayDua = (id: string, text: string) => {
    if (isPlayingDuaId === id) {
      setIsPlayingDuaId(null);
      toast("Dua player paused.");
    } else {
      setIsPlayingDuaId(id);
      
      // Simulate speech synthesis with rich Arabic translation pacing
      const speechUtterance = new SpeechSynthesisUtterance(text);
      speechUtterance.lang = "ar-SA";
      speechUtterance.rate = playbackSpeed;
      speechUtterance.onend = () => setIsPlayingDuaId(null);
      window.speechSynthesis.speak(speechUtterance);

      toast.success(`Playing vocal guide for: ${DUAS_DB.find(d => d.id === id)?.title}`);
    }
  };

  // Guided Prayer simulation ticker
  useEffect(() => {
    let interval: any = null;
    if (isPrayerSimulatorActive) {
      interval = setInterval(() => {
        setPrayerTimeRemaining(prev => {
          if (prev <= 1) {
            // Move across prayer simulated stages
            if (prayerActiveStepText.includes("Stand in pure focus")) {
              setPrayerActiveStepText("Standing Recitation (Qiyam): Listen to Reciter reciting Surah Al-Fatihah. Focus deeply on your alignment.");
              return 10;
            } else if (prayerActiveStepText.includes("Standing Recitation")) {
              setPrayerActiveStepText("Bowing (Ruku): Place hands on knees. Quietly recite 'Subhana Rabbiyal \'Adheem' 3 times with reverence.");
              return 6;
            } else if (prayerActiveStepText.includes("Bowing (Ruku)")) {
              setPrayerActiveStepText("Prostration (Sujud): Place nose and head on the ground. Tell Allah your internal feelings now.");
              return 12;
            } else if (prayerActiveStepText.includes("Prostration")) {
              if (prayerRakaatCycle < 2) {
                setPrayerRakaatCycle(2);
                setPrayerActiveStepText("Rise to Second Raka'at: Repeat Qiyam stand posture with peaceful, deep cellular calm.");
                return 8;
              } else {
                setPrayerActiveStepText("Concluding Session: Sitting in Tashahhud. Exchanging salutations of peace.");
                setIsPrayerSimulatorActive(false);
                toast.success("✓ Mapped first guided prayer practice session!");
                setSalahProgress(prev => Math.min(prev + 20, 100));
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPrayerSimulatorActive, prayerActiveStepText, prayerRakaatCycle]);

  // AI Chat Handler
  const handleAiInquirySubmit = async (e: React.FormEvent, customQ?: string) => {
    e.preventDefault();
    const query = customQ || aiInquiry;
    if (!query.trim()) return;

    const userMessage = { sender: 'user' as const, text: query, time: 'Just now' };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInquiry('');
    setIsThinking(true);

    try {
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Answer this beginner Muslim / revert question carefully, with absolute gentleness and authentic Quran and Hadith references to make them feel supported: "${query}"` }] }],
          systemInstruction: "You are the Nooraya AI Guided New Muslim Companion. Provide loving, clear, beginner-friendly wisdom."
        })
      });
      const data = await resp.json();
      setIsThinking(false);
      if (data && data.text) {
        setAiMessages(prev => [...prev, { sender: 'ai', text: data.text, time: 'Just now' }]);
      } else {
        throw new Error("No text response");
      }
    } catch (err) {
      setTimeout(() => {
        setIsThinking(false);
        let standardAnswer = "Assalamu Alaikum, beloved seeker. Remember that Allah loves gradual growth. Prophet Muhammad ﷺ spent thirteen years in Mecca building love and character before legal parameters were established. Savor each step slowly, and perform one small act of beautiful devotion today.";
        
        if (query.toLowerCase().includes('pray')) {
          standardAnswer = "Beloved seeker, praying is your direct biological connection to quiet. If you do not know the Arabic verses yet, you can whisper 'Subhanallah' (Glory be to Allah) and 'Alhamdulillah' (Praise be to Allah) inside prostration. Allah prioritizes your heart\'s direction above flawless phonetics!";
        } else if (query.toLowerCase().includes('tawheed')) {
          standardAnswer = "Tawheed is the magnificent core of Islam: the absolute oneness of the Divine. It means that no intermediary exists between you and your Creator. You do not need to pray to a human, an image, or a concept—you speak directly to the Lord of all stardust.";
        }

        setAiMessages(prev => [...prev, { sender: 'ai', text: standardAnswer, time: 'Just now' }]);
      }, 1000);
    }
  };

  // Save personal journal note
  const submitJournalReflection = () => {
    if (!currentJournalNote.trim()) return;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setUserJournalEntries([{ date: dateStr, note: currentJournalNote }, ...userJournalEntries]);
    setCurrentJournalNote('');
    toast.success("✓ Spiritual journal logged inside your secure dashboard.");
  };

  // Render opening portal screen if active
  if (showOpening) {
    return (
      <div className="min-h-screen bg-[#070E0A] text-[#F9F7E9] relative overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-[#D4AF37]/20 selection:text-[#E5C158]">
        {/* Divine Emerald Aura backdrop */}
        <div className="absolute top-0 inset-x-0 h-[450px] bg-gradient-to-b from-[#0B2519]/20 via-[#061A11]/3 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_60%)] pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-[#D4AF37]/3 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        {/* Outer margin graphic framing */}
        <div className="absolute inset-4 sm:inset-6 border border-[#D4AF37]/10 rounded-[2.2rem] pointer-events-none select-none z-0" />

        <div className="relative z-10 text-center max-w-2xl px-4 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="w-24 h-24 bg-[#0E2018] rounded-full flex items-center justify-center border border-[#D4AF37]/20 shadow-[0_0_25px_rgba(212,175,55,0.15)] mb-8"
          >
            <span className="text-4xl text-[#E5C158] font-serif">نور</span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.4em] text-[#D4AF37]/60 mb-2"
          >
            Welcome to the sanctuary of guidance
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl sm:text-6xl font-serif font-black mb-6 tracking-tight leading-none text-cream"
          >
            The Sacred <span className="text-[#E3C25D] serif-italic font-normal">Shahada Portal</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-base sm:text-lg text-slate-400 font-serif leading-relaxed italic mb-10 text-center max-w-xl"
          >
            "Islam is not about perfection. It is about returning to Allah every day."
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button 
              onClick={() => setShowOpening(false)}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#E5C158] text-[#050D0A] px-10 py-4.5 rounded-2xl font-mono font-black text-xs uppercase tracking-widest shadow-xl shadow-[#D4AF37]/10 transition-all hover:scale-[1.03]"
            >
              Enter Revert Portal
            </button>
            <button 
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto px-10 py-4.5 border border-[#D4AF37]/20 text-[#D4AF37] rounded-2xl font-mono font-black text-xs uppercase tracking-widest hover:bg-[#D4AF37]/5 transition-all"
            >
              I'm Just Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06110B] text-[#F9F7E9] pb-32 font-sans relative overflow-x-hidden selection:bg-[#D4AF37]/20 selection:text-[#E3C25D]">
      {/* Visual background atmospheric overlays */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#092215]/20 via-[#05140D]/3 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] bg-[#D4AF37]/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] left-[-10%] w-[500px] h-[500px] bg-[#0A2617]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ATMOSPHERE BACKGROUND NASHEED MIXER */}
      <div className="fixed top-24 right-4 z-40 bg-[#0E2018]/90 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-[#D4AF37]/15 flex items-center space-x-3 shadow-lg">
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Ambient Rain</span>
        <button
          onClick={() => {
            setIsAtmosphereOn(!isAtmosphereOn);
            toast.success(isAtmosphereOn ? "Ambient sounds off." : "Serene climate rain loop active.");
          }}
          className={cn(
            "p-1.5 rounded-lg border flex items-center justify-center transition-all",
            isAtmosphereOn 
              ? "bg-[#D4AF37] text-[#050C08] border-transparent" 
              : "border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          )}
        >
          {isAtmosphereOn ? <Volume2 size={12} className="animate-pulse" /> : <VolumeX size={12} />}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 pt-8">
        
        {/* UPPER ROADMAP DASHBOARD GRID */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#D4AF37]/10 pb-6 mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/explore')}
              className="p-3 bg-[#0F2D1F] rounded-2xl border border-[#D4AF37]/15 text-[#E5C158] hover:scale-105 transition-transform"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-left font-serif">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-[#D4AF37]/60 block">We welcome you home</span>
              <h1 className="text-xl sm:text-2xl font-black text-cream flex items-center gap-2">
                Revert Sacred Sanctuary
                <Sparkle size={13} className="text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-[#0E2018]/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#D4AF37]/10 flex items-center space-x-2">
              <Flame size={14} className="text-[#E5C158]" />
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 block uppercase font-bold leading-none">Holy Loop</span>
                <span className="text-xs font-black text-[#E5C158]">{streakDays} Days</span>
              </div>
            </div>
            <div className="bg-[#0E2018]/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#D4AF37]/10 flex items-center space-x-2">
              <Award size={14} className="text-[#E5C158]" />
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 block uppercase font-bold leading-none">Roadmap Level</span>
                <span className="text-xs font-black text-[#D4AF37]">Student of Islam</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY ROADMAP NAVIGATION PORTAL TAB MENU */}
        <div className="flex flex-wrap bg-[#050D09] p-1.5 rounded-[1.8rem] border border-[#D4AF37]/10 gap-1.5 mb-10 shadow-inner">
          {[
            { id: 'welcome', label: 'Welcome', icon: Smile },
            { id: 'steps', label: 'First Steps', icon: ListTodo },
            { id: 'salah', label: 'Learn Salah', icon: CompassIcon },
            { id: 'pillars', label: 'Five Pillars', icon: Layers },
            { id: 'prophets', label: 'Prophets', icon: Star },
            { id: 'companions', label: 'Companions', icon: User },
            { id: 'duas', label: 'Daily Duas', icon: Volume2 },
            { id: 'daily', label: 'Daily Islam', icon: BookOpen },
            { id: 'ai', label: 'Ask AI Companion', icon: MessageCircle },
            { id: 'map', label: 'History Map', icon: Map },
            { id: 'journey', label: 'My Journey', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activePortalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id as any)}
                className={cn(
                  "flex-grow min-w-[125px] flex items-center justify-center space-x-2 py-3.5 text-[9px] font-mono font-black uppercase tracking-widest rounded-2xl transition-all duration-300 relative",
                  isActive 
                    ? "bg-[#D4AF37] text-[#050C08] shadow-lg shadow-[#D4AF37]/10 font-bold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0E2018]/30"
                )}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN MODULE SCREEN RENDER */}
        <div className="space-y-12">
          
          {/* TAB 1: WELCOME & FOUNDATIONAL MINDSETS */}
          {activePortalTab === 'welcome' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {!completed ? (
                <div className="bg-[#0E2018]/45 backdrop-blur-xl rounded-[2.5rem] border border-[#D4AF37]/15 p-8 md:p-14 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full -mr-40 -mt-40 blur-[80px]" />
                  
                  <div className="space-y-8">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-4">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">Section {currentStep + 1} of 3</span>
                      <div className="flex items-center space-x-1">
                        {[0, 1, 2].map(idx => (
                          <div 
                            key={idx} 
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-300",
                              currentStep === idx ? "w-8 bg-[#D4AF37]" : "w-2 bg-[#0E2018] border border-[#D4AF37]/20"
                            )} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] block">
                        {welcomeSteps[currentStep].subtitle}
                      </span>
                      <h2 className="text-3xl md:text-5xl font-serif font-black text-cream">
                        {welcomeSteps[currentStep].title}
                      </h2>
                    </div>

                    <p className="text-lg text-slate-300 font-serif leading-relaxed italic border-l-2 border-[#D4AF37]/30 pl-6 py-1">
                      "{welcomeSteps[currentStep].description}"
                    </p>

                    {/* Step specific content */}
                    {currentStep === 1 && (
                      <div className="p-8 bg-[#050D09] rounded-[2rem] border border-[#D4AF37]/10 space-y-6 text-center">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Proclaim this aloud:</span>
                        <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#E5C158] leading-relaxed" dir="rtl">
                          أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله
                        </h3>
                        <p className="text-base text-slate-300 italic font-mono font-bold text-[#E3C25D]">
                          "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulu Allah"
                        </p>
                        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                          Meaning: "I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is the final messenger of Allah."
                        </p>
                        <button 
                          onClick={() => {
                            setIsPlaying(true);
                            const utterance = new SpeechSynthesisUtterance("Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulu Allah");
                            utterance.lang = "ar-SA";
                            utterance.rate = 0.85;
                            utterance.onend = () => setIsPlaying(false);
                            window.speechSynthesis.speak(utterance);
                          }}
                          className={cn(
                            "px-6 py-3 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest border transition-all inline-flex items-center space-x-2",
                            isPlaying ? "bg-[#D4AF37] text-[#050C08] border-transparent" : "border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/5"
                          )}
                        >
                          <Volume2 size={12} className={cn(isPlaying && "animate-pulse")} />
                          <span>{isPlaying ? "Pronouncing Slowly..." : "Listen Practice Guide"}</span>
                        </button>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {[
                          { title: 'Islam wipes previous sins', desc: 'Every error of your past is permanently washed. Your slate is pure and radiant.' },
                          { title: 'Gradual slow progress', desc: 'Allah built your system and values slow growth. Avoid intense pressure.' },
                          { title: 'Direct hotline to Creator', desc: 'No priests, no agents, no intermediates. You stand straight facing Him.' }
                        ].map((card, i) => (
                          <div key={i} className="p-5 bg-[#050D09]/40 rounded-2xl border border-[#D4AF37]/5 space-y-2">
                            <h4 className="font-serif font-black text-sm text-[#E5C158]">{card.title}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{card.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-[#D4AF37]/10">
                      <button
                        onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest select-none font-black",
                          currentStep > 0 ? "text-slate-400 hover:text-white" : "text-transparent pointer-events-none"
                        )}
                      >
                        ◀ Go Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="bg-[#D4AF37] text-[#050D0A] px-8 py-3.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest hover:bg-[#E5C158] transition-transform"
                      >
                        {currentStep === 2 ? 'Complete Reversion ➔' : 'Continue Path ➔'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* BEAUTIFUL COMPLETED CELEBRATION CARD */}
                  <div className="bg-gradient-to-r from-[#0E2018] to-[#04120B] rounded-[3rem] p-8 md:p-14 border border-[#D4AF37]/20 relative overflow-hidden text-center space-y-6">
                    <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/20 mx-auto mb-2 animate-bounce">
                      <CheckCircle2 size={36} className="text-[#E3C25D]" />
                    </div>
                    
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#D4AF37] block">Assalamu Alaikum</span>
                    <h2 className="text-4xl sm:text-5xl font-serif font-black text-cream font-bold leading-none">Welcome to Islam</h2>
                    <p className="text-slate-400 italic font-serif text-lg max-w-xl mx-auto">
                      "Your journey begins today. Islam is not about perfection. It is about returning to Allah every day."
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-3">
                      <button 
                        onClick={() => setActivePortalTab('steps')}
                        className="px-8 py-3.5 rounded-xl bg-[#D4AF37] text-[#050D0A] font-mono text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-transform"
                      >
                        Learn First Steps Roadmap
                      </button>
                      <button 
                        onClick={() => setCompleted(false)}
                        className="px-8 py-3.5 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37] font-mono text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37]/5"
                      >
                        Re-read Shahada Intentions
                      </button>
                    </div>
                  </div>

                  {/* UNDERSTANDING SLATE CONVERSION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0E2018]/45 border border-[#D4AF37]/10 rounded-[2.2rem] p-8 space-y-4">
                      <div className="flex items-center space-x-3 text-[#E3C25D]">
                        <ShieldCheck size={20} />
                        <h3 className="font-serif font-black text-lg">What Happens After Shahada?</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        The Prophet Muhammad ﷺ clarified that taking your Shahada is an absolute blank slate. Every sin of your past, small, large, deliberate or accidental, is instantly erased and safely converted into positive merits on your record.
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed italic border-l border-[#D4AF37]/20 pl-4">
                        "Allah loves those who take the staircase of progress step by step, never rushing."
                      </p>
                    </div>

                    <div className="bg-[#0E2018]/45 border border-[#D4AF37]/10 rounded-[2.2rem] p-8 space-y-4">
                      <div className="flex items-center space-x-3 text-[#E3C25D]">
                        <Heart size={20} />
                        <h3 className="font-serif font-black text-lg">Allah Loves Gradual Growth</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Do not try to force yourself to adopt all community regulations overnight. It took decades of revelation to structure the absolute Islamic framework. Master Salah, learn the beauty of monotheism (Tawheed), and let your heart grow its connection organically.
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed italic border-l border-[#D4AF37]/20 pl-4">
                        "Your struggle in learning yields double reward from the Most Generous."
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: BEGINNER ROADMAP STEP CARDS */}
          {activePortalTab === 'steps' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="bg-[#0E2018]/45 rounded-[2.2rem] border border-[#D4AF37]/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-black text-cream">Beginner Islamic Learning Path</h3>
                  <p className="text-xs text-slate-400">Track your structural progress as your build baseline familiarity</p>
                </div>
                {/* Level Tag Tracker */}
                <div className="px-5 py-2.5 bg-[#05110B] rounded-2xl border border-[#D4AF37]/15 text-xs text-center">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block leading-none">Your Progress Marker</span>
                  <span className="text-[#E5C158] font-mono font-black uppercase text-[10px]">Learning (Level 2)</span>
                </div>
              </div>

              {/* Dynamic Step Cards Container */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'lesson-1', title: '1. Learn Wudu (Purification)', desc: 'The simple ritual of washing hands, face, mouth, and feet prior to prayer.', level: 'Beginner', isDone: true, linkTab: 'salah' },
                  { id: 'lesson-2', title: '2. Understand Salah (Prayer)', desc: 'The daily physical and spiritual interface of standing right in front of Allah.', level: 'Learning', isDone: false, linkTab: 'salah' },
                  { id: 'lesson-3', title: '3. Read Short Surahs', desc: 'Starting with Al-Fatihah and Al-Ikhlas to recite in prayers smoothly.', level: 'Learning', isDone: false, linkTab: 'daily' },
                  { id: 'lesson-4', title: '4. Absolute Monotheism', desc: 'Deepening your appreciation of Tawheed—the core of Islamic theology.', level: 'Growing', isDone: false, linkTab: 'pillars' },
                  { id: 'lesson-5', title: '5. Daily Islamic Manners', desc: 'Applying humility, clean speech, respecting elders, and keeping clean.', level: 'Growing', isDone: false, linkTab: 'daily' },
                  { id: 'lesson-6', title: '6. Master Common Duas', desc: 'Saying Bismillah before actions, Alhamdhulillah after food, etc.', level: 'Consistent', isDone: false, linkTab: 'duas' }
                ].map((lesson, idx) => {
                  const isUnlocked = completedRoadmapLessons.includes(lesson.id) || idx === completedRoadmapLessons.length;
                  const isDone = completedRoadmapLessons.includes(lesson.id);
                  return (
                    <div 
                      key={lesson.id}
                      className={cn(
                        "p-6 rounded-[2rem] border transition-all flex flex-col justify-between relative overflow-hidden",
                        isDone 
                          ? "bg-[#0E2018]/60 border-emerald-500/20" 
                          : isUnlocked 
                          ? "bg-[#0E2018]/45 border-[#D4AF37]/15 shadow-md hover:border-[#D4AF37]/30" 
                          : "bg-[#05110B]/30 border-slate-900 opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[8px] font-mono uppercase font-black",
                            lesson.level === 'Beginner' ? "bg-emerald-500/10 text-emerald-400" :
                            lesson.level === 'Learning' ? "bg-blue-500/10 text-blue-400" : "bg-[#D4AF37]/10 text-[#E5C158]"
                          )}>
                            {lesson.level}
                          </span>
                          {isDone ? (
                            <span className="text-[9px] font-mono text-emerald-400 font-bold">✓ Complete</span>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-500">Lesson {idx + 1}</span>
                          )}
                        </div>

                        <h4 className="font-serif font-black text-sm text-cream group-hover:text-[#E3C25D]">{lesson.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{lesson.desc}</p>
                      </div>

                      <div className="pt-6 border-t border-[#D4AF37]/5 mt-4 flex items-center justify-between">
                        {isUnlocked && !isDone ? (
                          <button
                            onClick={() => {
                              setCompletedRoadmapLessons([...completedRoadmapLessons, lesson.id]);
                              setActivePortalTab(lesson.linkTab as any);
                              toast.success(`Lesson "${lesson.title}" initiated! Complete steps inside portal.`);
                            }}
                            className="text-[#E3C25D] font-mono text-[9px] font-bold uppercase tracking-wider hover:underline"
                          >
                            Explore Lesson ➔
                          </button>
                        ) : isDone ? (
                          <span className="text-[9px] font-mono text-slate-500">Purified Mastered Concept</span>
                        ) : (
                          <span className="text-[9px] font-mono text-slate-700">🔒 Unlock Prior Lesson</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: LEARN SALAH PORTAL & IMMERSIVE PRAYS WITH ME SESSIONS */}
          {activePortalTab === 'salah' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Selector Menu Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setIsPrayerSimulatorActive(false)}
                  className={cn(
                    "p-6 rounded-[2rem] border text-left space-y-2",
                    !isPrayerSimulatorActive ? "bg-[#0E2018]/60 border-[#D4AF37]/30" : "bg-[#0E2018]/20 border-[#D4AF37]/5 hover:bg-[#0E2018]/40"
                  )}
                >
                  <MapPin size={24} className="text-[#E5C158]" />
                  <h4 className="font-serif font-bold text-sm text-cream">Step-by-Step Prayer Manual</h4>
                  <p className="text-[10px] text-slate-400">Read postures, Arabic script, English translations for each cycle.</p>
                </button>

                <button
                  onClick={() => {
                    setIsPrayerSimulatorActive(true);
                    setPrayerTimeRemaining(8);
                    setPrayerActiveStepText("Stand in pure focus (Qiyam) and raise your wrists. Whisper 'Allahu Akbar' to begin.");
                    setPrayerRakaatCycle(1);
                  }}
                  className={cn(
                    "p-6 rounded-[2rem] border text-left space-y-2",
                    isPrayerSimulatorActive ? "bg-[#0E2018]/60 border-[#D4AF37]/30" : "bg-[#0E2018]/20 border-[#D4AF37]/5 hover:bg-[#0E2018]/40"
                  )}
                >
                  <Activity size={24} className="text-[#E5C158] animate-pulse" />
                  <h4 className="font-serif font-bold text-sm text-cream">"Pray With Me" Mode (Guided)</h4>
                  <p className="text-[10px] text-slate-400">An immersive auto-advancing simulator that directs you through Salah.</p>
                </button>

                <div className="p-6 rounded-[2rem] bg-[#0E2018]/25 border border-[#D4AF37]/10 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block leading-none">Salah Practice Progress</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-slate-400">Basics Mastered:</span>
                      <span className="text-[#E5C158]">{salahProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#05110B] rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4AF37]" style={{ width: `${salahProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION A: STEP BY STEP MANUAL MODE */}
              {!isPrayerSimulatorActive ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Side steps index list */}
                  <div className="lg:col-span-4 bg-[#0E2018]/40 rounded-[2rem] border border-[#D4AF37]/10 p-6 space-y-3">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#D4AF37]/10 pb-2 mb-3">Prayer Movements</span>
                    {salahSteps.map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSalahStepIdx(idx)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between",
                          currentSalahStepIdx === idx 
                            ? "bg-[#D4AF37] text-[#050C08] border-transparent font-bold" 
                            : "bg-[#05110B]/55 border-[#D4AF37]/5 text-slate-300 hover:bg-[#0E2018]/30"
                        )}
                      >
                        <span>{step.title}</span>
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>

                  {/* Right Side visual and translation breakout */}
                  <div className="lg:col-span-8 bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-12 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full" />
                    
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Detailed Guide Step {currentSalahStepIdx + 1}</span>
                      <h3 className="text-2xl font-serif font-black text-cream">{salahSteps[currentSalahStepIdx].title}</h3>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed italic border-l border-[#D4AF37]/25 pl-4 py-0.5">
                      "{salahSteps[currentSalahStepIdx].posture}"
                    </p>

                    <div className="p-6 bg-[#050D09] rounded-2xl border border-[#D4AF37]/10 text-center space-y-4">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Recited Arabic Formula:</span>
                      <h4 className="text-3xl font-serif font-bold text-[#E5C158] leading-normal" dir="rtl">{salahSteps[currentSalahStepIdx].arabic}</h4>
                      <p className="text-xs text-[#E3C25D] font-mono font-bold">"{salahSteps[currentSalahStepIdx].translit}"</p>
                      <p className="text-xs text-slate-400">Meaning: {salahSteps[currentSalahStepIdx].meaning}</p>
                    </div>

                    <div className="p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10 text-xs flex gap-3 text-slate-300">
                      <Info size={16} className="text-[#D4AF37] shrink-0" />
                      <div>
                        <span className="font-bold block text-cream">Pro Tip:</span>
                        {salahSteps[currentSalahStepIdx].tip}
                      </div>
                    </div>

                    {/* Simple Qibla Compass integration widget */}
                    <div className="pt-6 border-t border-[#D4AF37]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <span className="font-serif font-bold text-sm block">Integrate Qibla Compass Navigation</span>
                        <span className="text-[10px] text-slate-500 font-mono">Align to Mecca direction easily. Target estimated angle: 67° N.</span>
                      </div>
                      <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center relative animate-pulse">
                        <Compass className="text-[#D4AF37]" size={22} />
                        <span className="absolute text-[8px] top-1 text-slate-400 font-sans font-black">N</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* SECTION B: GUIDED PRAY WITH ME MODE SIMULATOR */
                <div className="bg-[#050E09] border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-12 space-y-8 relative overflow-hidden text-center">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-[#D4AF37]/20" />
                  
                  <div className="max-w-xl mx-auto space-y-6">
                    <div className="flex justify-between items-center px-4">
                      <span className="text-[10px] font-mono font-black uppercase text-slate-500">Practice Raka\'at Cycle: {prayerRakaatCycle} / 2</span>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">Active Simulator</span>
                      </div>
                    </div>

                    {/* Step illustration space */}
                    <div className="w-24 h-24 rounded-full bg-[#0E2018] border border-[#D4AF37]/20 flex items-center justify-center mx-auto text-[#E5C158] shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      <CompassIcon size={32} className="animate-spin" style={{ animationDuration: '8s' }} />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif text-cream italic">
                      "{prayerActiveStepText}"
                    </h3>

                    {/* Timer Circle helper */}
                    <div className="inline-flex flex-col items-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Next position in</span>
                      <span className="text-4xl font-mono text-[#D4AF37] font-black">{prayerTimeRemaining}s</span>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                      <button
                        onClick={() => {
                          setIsPrayerSimulatorActive(false);
                          toast("Guided practice aborted.");
                        }}
                        className="px-6 py-3 rounded-xl border border-red-500/20 text-red-400 font-mono text-[9px] font-black uppercase tracking-widest hover:bg-red-500/5"
                      >
                        Stop Simulator
                      </button>
                      <button
                        onClick={() => {
                          setPrayerTimeRemaining(prev => Math.max(prev - 2, 2));
                        }}
                        className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#050C08] font-mono text-[9px] font-black uppercase tracking-widest hover:bg-[#E5C158]"
                      >
                        Advance Step ➔
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: THE FIVE PILLARS OF ISLAM */}
          {activePortalTab === 'pillars' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {PILLARS_DB.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPillarId(p.id)}
                    className={cn(
                      "p-4 rounded-xl border text-center transition-all relative block",
                      selectedPillarId === p.id 
                        ? "bg-[#D4AF37] text-[#050C08] border-transparent font-bold" 
                        : "bg-[#0E2018]/30 border-[#D4AF37]/10 text-slate-300 hover:bg-[#0E2018]/50"
                    )}
                  >
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest block opacity-75">{p.name}</span>
                    <span className="text-xs font-serif mt-1 block" dir="rtl">{p.arabicName}</span>
                  </button>
                ))}
              </div>

              {/* Pillar detail card breakout */}
              {(() => {
                const pillar = PILLARS_DB.find(p => p.id === selectedPillarId) || PILLARS_DB[0];
                return (
                  <div className="bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-12 space-y-6 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full" />
                    
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">PILLAR HIGHLIGHT</span>
                      <h3 className="text-3xl font-serif font-black text-cream flex items-center gap-2">
                        {pillar.name}
                        <span className="text-sm font-serif text-[#D4AF37]" dir="rtl">{pillar.arabicName}</span>
                      </h3>
                      <p className="text-sm text-slate-300 mr-24">{pillar.importance}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="bg-[#05110B] p-6 rounded-2xl border border-[#D4AF37]/10 space-y-4">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">How to Practice in daily life</span>
                        <ul className="space-y-3 font-serif text-xs text-slate-300">
                          {pillar.howToPractice.map((step, idx) => (
                            <li key={idx} className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0 mt-1.5 animate-pulse" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[#05110B]/50 p-5 rounded-2xl border border-slate-900 text-[11px] text-slate-400 space-y-2">
                          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest block">Quran Revelation:</span>
                          <p className="italic">"{pillar.verseRef}"</p>
                        </div>

                        <div className="bg-[#05110B]/50 p-5 rounded-2xl border border-slate-900 text-[11px] text-slate-400 space-y-2">
                          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest block">Prophetic Hadith:</span>
                          <p className="italic">"{pillar.hadithText}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* SUB SECTION: INTRODUCTION TO ALLAH */}
              <div className="bg-[#0E2018]/30 border border-[#D4AF37]/10 rounded-[2.2rem] p-8 space-y-6">
                <div className="flex items-center space-x-3 text-[#E3C25D]">
                  <Sparkles size={22} className="animate-pulse" />
                  <h3 className="font-serif font-black text-xl">Introduction to Allah & Tawheed</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'The Oneness (Tawheed)', desc: 'Allah is absolute One, independent of creation. No gender, no children, no partners. Sincerity is communicating with Him without barriers.' },
                    { title: 'The Supreme Mercy', desc: 'Divine mercy is His baseline rules: "My Mercy supersedes my Wrath." (hadith qudsi). He created you because He wants to forgive you.' },
                    { title: 'His Sacred Names', desc: 'Use His names to supplicate: Ar-Rahman (The Giver of Mercy), Al-Wadud (The Perfect Loving), Al-Ghaffar (The All-Forgiving).' }
                  ].map((block, i) => (
                    <div key={i} className="bg-[#05110B]/50 p-5 rounded-2xl border border-slate-900 space-y-3">
                      <h4 className="font-serif font-black text-[#E5C158] text-sm">{block.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{block.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: MEET THE PROPHETS STORY TIMELINE */}
          {activePortalTab === 'prophets' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/10 rounded-[2rem] p-6">
                <h3 className="text-xl font-serif font-black text-cream">Prophets in Islam Timeline</h3>
                <p className="text-xs text-slate-400">Discover stories of resilience, miracles, down-to-earth lessons of our previous guides.</p>
              </div>

              {/* Horizontal Timeline Tracker */}
              <div className="flex border-b border-[#D4AF37]/10 pb-4 overflow-x-auto gap-2 p-1 max-w-[90vw] scrollbar-thin">
                {PROPHETS_DB.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProphetId(p.id)}
                    className={cn(
                      "px-5 py-3 rounded-xl text-xs font-mono font-bold shrink-0 transition-all flex items-center space-x-2 border",
                      selectedProphetId === p.id 
                        ? "bg-[#D4AF37] text-[#050C08] border-transparent" 
                        : "bg-[#0E2018]/20 border-[#D4AF37]/5 text-slate-300 hover:bg-[#0E2018]/40"
                    )}
                  >
                    <span className="text-[9px] font-sans font-black bg-[#D4AF37]/10 text-[#E5C158] px-1.5 py-0.5 rounded mr-1">#{p.order}</span>
                    <span>{p.name} {p.name === 'Muhammad' && 'ﷺ'}</span>
                    <span className="text-[10px] font-serif leading-none opacity-80" dir="rtl">({p.arabicName})</span>
                  </button>
                ))}
              </div>

              {/* Prophet narrative details box */}
              {(() => {
                const p = PROPHETS_DB.find(prof => prof.id === selectedProphetId) || PROPHETS_DB[0];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                    
                    <div className="lg:col-span-12 bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-12 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-[#D4AF37]/10 pb-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Era of Prophet: {p.period}</span>
                          <h3 className="text-3xl font-serif font-black text-cream">{p.name} <span dir="rtl" className="text-lg font-serif text-[#D4AF37] font-normal">({p.arabicName})</span></h3>
                        </div>
                        <div className="px-4 py-2 bg-[#05110B] rounded-xl border border-slate-900 font-mono text-[9px] text-[#E5C158]">
                          REVELATION KEY: {p.quranRefs[0]}
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed font-serif italic border-l pr-12 border-[#D4AF37]/20 pl-4">
                        "{p.story}"
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div className="bg-[#05110B]/60 p-6 rounded-2xl border border-slate-900 space-y-3">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Miracles Granted:</span>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {p.miracles.map((m, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-[#D4AF37] shrink-0 font-sans font-bold">•</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[#05110B]/60 p-6 rounded-2xl border border-slate-900 space-y-3">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Core Lessons Learned:</span>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {p.lessons.map((l, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-emerald-400 shrink-0 font-sans font-bold">✓</span>
                                <span>{l}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-yellow-500/5 p-6 rounded-2xl border border-yellow-500/10 space-y-3">
                          <span className="text-[9px] font-mono text-[#E5C158] uppercase tracking-widest block">Today\'s Life Application:</span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {p.application}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

            </div>
          )}

          {/* TAB 6: THE NOBLE COMPANIONS CHARACTER PROFILES */}
          {activePortalTab === 'companions' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/10 rounded-[2rem] p-6">
                <h3 className="text-xl font-serif font-black text-cream font-bold">The Companions (Sahabah)</h3>
                <p className="text-xs text-slate-400">Discover character traits, courage, sacrifices, leadership of the Prophet’s closest family.</p>
              </div>

              {/* Companions buttons menu switcher */}
              <div className="flex border-b border-[#D4AF37]/10 pb-4 overflow-x-auto gap-2 p-1 scrollbar-thin">
                {COMPANIONS_DB.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCompanionId(c.id)}
                    className={cn(
                      "px-5 py-3 rounded-xl text-xs font-mono font-bold shrink-0 transition-all flex items-center space-x-2 border",
                      selectedCompanionId === c.id 
                        ? "bg-[#D4AF37] text-[#050C08] border-transparent" 
                        : "bg-[#0E2018]/20 border-[#D4AF37]/5 text-slate-300 hover:bg-[#0E2018]/40"
                    )}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-75 leading-none" dir="rtl">({c.arabicTitle})</span>
                  </button>
                ))}
              </div>

              {/* Companions narrative details card selection */}
              {(() => {
                const c = COMPANIONS_DB.find(comp => comp.id === selectedCompanionId) || COMPANIONS_DB[0];
                return (
                  <div className="bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-12 space-y-6 relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/5 rounded-full" />
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">{c.role}</span>
                      <h3 className="text-2xl font-serif font-black text-cream flex items-center gap-2">
                        {c.name} 
                        <span className="text-xs font-serif text-[#D4AF37] block" dir="rtl">({c.arabicTitle})</span>
                      </h3>
                      <p className="text-xs font-mono uppercase tracking-wider text-[#E5C158]">Core Specialty trait: {c.trait}</p>
                    </div>

                    <p className="text-sm text-slate-200 mt-4 leading-relaxed font-serif">
                      {c.bio}
                    </p>

                    <div className="p-6 bg-[#05110B] rounded-2xl border border-slate-900 space-y-3">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Character traits for daily emotional integration</span>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {c.lessons.map((l, idx) => (
                          <li key={idx} className="flex gap-2.5">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0 mt-1.5 animate-pulse" />
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}

            </div>
          )}

          {/* TAB 7: DAILY DUAS CATEGORIES WITH AUDIO SYNTHESIS SIMULATION */}
          {activePortalTab === 'duas' && (
            <div className="space-y-8 animate-fade-in text-left">
              {/* Category Toggles bar */}
              <div className="flex bg-[#050D09] p-1.5 rounded-2xl border border-[#D4AF37]/10 gap-2 mb-6 max-w-lg">
                {['morning', 'sleep', 'anxiety', 'eating', 'travel'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveDuaCategory(cat)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider tracking-widest",
                      activeDuaCategory === cat ? "bg-[#D4AF37] text-[#050C08]" : "text-slate-400 hover:text-slate-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Duas catalog details list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DUAS_DB.filter(d => d.category === activeDuaCategory).map(dua => {
                  const isPlayingThis = isPlayingDuaId === dua.id;
                  return (
                    <div 
                      key={dua.id}
                      className="p-6 rounded-[2.2rem] bg-[#0E2018]/45 border border-[#D4AF37]/15 space-y-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center bg-[#05110B]/40 px-3 py-1.5 rounded-xl border border-[#D4AF37]/5">
                          <h4 className="font-serif font-black text-sm text-[#E5C158]">{dua.title}</h4>
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{dua.category} Supplication</span>
                        </div>

                        {/* Arabic calligraphic script */}
                        <p className="text-xl font-serif text-[#E5C158] leading-relaxed text-right font-black" dir="rtl">
                          {dua.arabic}
                        </p>

                        <p className="text-xs text-[#E3C25D] font-mono font-bold">"{dua.transliteration}"</p>
                        <p className="text-xs text-slate-300 leading-relaxed font-serif italic">"{dua.translation}"</p>
                      </div>

                      <div className="pt-4 border-t border-[#D4AF37]/5 flex justify-between items-center gap-4">
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed flex items-center gap-1">
                          <Sparkle size={10} className="text-[#D4AF37] animate-spin" />
                          <span>{dua.benefit}</span>
                        </p>
                        <button
                          onClick={() => simulatedPlayDua(dua.id, dua.translation)}
                          className={cn(
                            "w-10 h-10 rounded-full border flex items-center justify-center transition-all shrink-0 shadow",
                            isPlayingThis ? "bg-[#D4AF37] border-transparent text-[#050D0A]" : "border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                          )}
                        >
                          <Volume2 size={16} className={cn(isPlayingThis && "animate-pulse")} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 8: DAILY ISLAM BASICS & SURVIVAL GUIDE */}
          {activePortalTab === 'daily' && (
            <div className="space-y-10 animate-fade-in text-left">
              
              {/* SECTION A: SURVIVAL GUIDE */}
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-12 space-y-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">New Muslim Support Sanctuary</span>
                  <h3 className="text-2xl font-serif font-black text-cream">The New Muslim Survival Guide</h3>
                  <p className="text-xs text-slate-400">Compassionate, realistic support dealing with complex life changes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {SURVIVAL_GUIDE_DB.map((guide, idx) => {
                    const Icon = guide.icon;
                    return (
                      <div key={idx} className="p-6 bg-[#05110B]/50 rounded-2xl border border-[#D4AF37]/5 space-y-3">
                        <div className="flex items-center space-x-2.5 text-[#E5C158]">
                          <Icon size={16} />
                          <h4 className="font-serif font-black text-sm">{guide.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{guide.advice}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: HALAL LIFESTYLE SUMMARY */}
              <div className="bg-[#04120B] border border-emerald-500/10 rounded-[2.2rem] p-8">
                <div className="flex items-center space-x-3 text-[#E3C25D] mb-6">
                  <Layers3 size={22} />
                  <h3 className="font-serif font-black text-xl">The Halal Lifestyle Handbook</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { title: 'Halal Food & Drink', p: 'Avoid pork, alcohol, non-slaughtered meat. Look for halal certification marks on items, or prioritize seafood and vegetarian options when in doubt.' },
                    { title: 'Clean Dressing', p: 'Garments should represent modesty and clean character, protecting your energy from outward vanity or physical showing.' },
                    { title: 'Ethical Finance', p: 'Avoid usury, interest (Riba), extreme speculation, and financial activities that exploit the vulnerability of others.' },
                    { title: 'Noble Character', p: 'The Prophet said: "I was only sent to perfect beautiful character." Treat animals, parents, neighbors, and strangers with ultimate grace.' }
                  ].map((block, i) => (
                    <div key={i} className="bg-[#0E2018]/50 p-5 rounded-xl border border-[#D4AF37]/5 space-y-2">
                      <h4 className="font-serif font-bold text-xs text-[#E3C25D]">{block.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{block.p}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 9: ASK THE CHAT AI NEW MUSLIM COMPANION */}
          {activePortalTab === 'ai' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-12 space-y-6">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">PERSONAL ISLAMIC CHAT ADVISOR</span>
                    <h3 className="text-2xl font-serif font-black text-cream">Guided New Muslim Companion AI</h3>
                  </div>
                  <div className="bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-[9px] text-emerald-400 font-mono font-bold animate-pulse">
                    ONLINE SECURED
                  </div>
                </div>

                {/* Messages Panel stream wrapper */}
                <div className="h-[300px] overflow-y-auto space-y-4 p-4 bg-[#05110B] rounded-2xl border border-[#D4AF37]/10 scrollbar-thin">
                  {aiMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "flex flex-col max-w-[80%] space-y-1 text-xs",
                        msg.sender === 'user' ? "ml-auto text-right items-end" : "mr-auto text-left items-start"
                      )}
                    >
                      <div className={cn(
                        "p-3.5 rounded-xl leading-relaxed",
                        msg.sender === 'user' 
                          ? "bg-[#D4AF37] text-[#050D0A] font-bold" 
                          : "bg-[#0E2018] text-slate-100 border border-slate-900"
                      )}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-500 font-mono font-black">{msg.time} • Nooraya Guardian</span>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono animate-pulse">
                      <Sparkles size={11} className="animate-spin" />
                      <span>Gathering correct prophetic answers...</span>
                    </div>
                  )}
                </div>

                {/* Simple rapid query prompts helpers */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Frequently Asked Revert Inquiries:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Why do Muslims pray five times a day?",
                      "What is correct monotheism (Tawheed)?",
                      "Does Islam support gradual learning?",
                      "How do I practice faith around family?"
                    ].map((qText, i) => (
                      <button
                        key={i}
                        onClick={(e) => handleAiInquirySubmit(e, qText)}
                        className="p-2 border border-[#D4AF37]/10 bg-[#0E2018]/25 hover:bg-[#D4AF37]/5 text-[10px] text-slate-300 font-mono font-bold rounded-lg transition-transform"
                      >
                        {qText}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input form */}
                <form onSubmit={handleAiInquirySubmit} className="relative mt-4">
                  <input
                    type="text"
                    placeholder="Inquire about any topic, hadith explanation, or first-day struggles..."
                    value={aiInquiry}
                    onChange={(e) => setAiInquiry(e.target.value)}
                    className="w-full bg-[#050D09]/90 border border-[#D4AF37]/15 rounded-xl py-3.5 pl-4 pr-32 text-xs focus:outline-none focus:border-[#E5C158]"
                  />
                  <button
                    type="submit"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#050C08] font-mono text-[9px] font-black uppercase tracking-widest px-5 py-2 rounded-lg"
                  >
                    Transmit
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 10: INTERACTIVE HISTORY WORLD map TRAVEL */}
          {activePortalTab === 'map' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/10 rounded-[2rem] p-6 text-left">
                <h3 className="text-xl font-serif font-black text-cream">Interactive Islamic History Map</h3>
                <p className="text-xs text-slate-400">Discover early landmarks, battles, revelations, and regional wisdom visually.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual SVG schematic coordinates mock map panel */}
                <div className="lg:col-span-7 bg-[#05110B] border border-[#D4AF37]/15 rounded-[2.5rem] h-[400px] p-6 relative overflow-hidden flex items-center justify-center">
                  
                  {/* Styled geographical grid overlay line marks */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <span className="text-[12px] font-mono text-slate-700 font-black absolute top-4 left-6 uppercase tracking-widest">Peninsula Chart Index</span>

                  {/* Landmarks anchors pins placement */}
                  {HISTORY_LANDMARKS_DB.map((l, idx) => {
                    const isSelected = selectedMapLandmark?.name === l.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedMapLandmark(l)}
                        className="absolute p-2.5 rounded-full shrink-0 group transition-all"
                        style={{ left: l.coords.x, top: l.coords.y }}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center relative shadow-md transition-all",
                          isSelected ? "bg-[#D4AF37] border-white scale-125" : "bg-[#0E2018] border-[#D4AF37] hover:scale-110"
                        )}>
                          <MapPin size={10} className={cn(isSelected ? "text-[#050D0A]" : "text-[#D4AF37]")} />
                          <span className="absolute left-6 whitespace-nowrap bg-[#0E2018]/90 text-[9px] font-mono font-bold font-black px-2 py-0.5 border border-[#D4AF37]/15 rounded text-cream opacity-50 group-hover:opacity-100 transition-opacity">
                            {l.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Landmark explanation sidebar breakout */}
                <div className="lg:col-span-5 bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Geographical Landmark Profile</span>
                    <h3 className="text-2xl font-serif font-black text-cream">{selectedMapLandmark?.name}</h3>
                    <p className="text-xs text-[#E5C158] font-mono font-bold">{selectedMapLandmark?.event}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3 border-l-2 border-[#D4AF37]/20 pl-4 py-1">
                      {selectedMapLandmark?.details}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-4">Sourced from authentic early Seerah chronologies.</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 11: MY JOURNAL & PERSISTENCE HISTORY DASHBOARD */}
          {activePortalTab === 'journey' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual stats layout */}
                <div className="bg-[#0E2018]/45 border border-[#D4AF37]/10 rounded-[2.2rem] p-6 space-y-4">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Revert Statistics Monitor</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#05110B]/60 rounded-xl border border-slate-900 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Proclamations</span>
                      <span className="text-lg font-mono font-black text-cream">✓ Set</span>
                    </div>
                    <div className="p-4 bg-[#05110B]/60 rounded-xl border border-slate-900 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Daily Loop</span>
                      <span className="text-lg font-mono font-black text-cream">{streakDays} Days</span>
                    </div>
                  </div>
                </div>

                {/* Sincerity journal note creation */}
                <div className="bg-[#0E2018]/45 border border-[#D4AF37]/10 p-6 rounded-[2.2rem] space-y-3 md:col-span-2">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">Submit Sincerity Scribing Entry</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write your emotional reflections, dreams, or hurdles today..."
                      value={currentJournalNote}
                      onChange={(e) => setCurrentJournalNote(e.target.value)}
                      className="flex-grow bg-[#050D09] border border-[#D4AF37]/15 rounded-xl text-xs px-4 py-3 focus:outline-none focus:border-[#E5C158]"
                    />
                    <button
                      onClick={submitJournalReflection}
                      className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#050C08] font-mono text-[9px] font-black uppercase tracking-widest px-6 rounded-xl shrink-0"
                    >
                      Record note
                    </button>
                  </div>
                </div>
              </div>

              {/* Journal log timeline list layout */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Your Saved Sincerity Chronicles:</span>
                <div className="space-y-3">
                  {userJournalEntries.map((journal, i) => (
                    <div key={i} className="p-5 bg-[#0E2018]/30 rounded-xl border border-[#D4AF37]/5 flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-[#D4AF37] font-black">{journal.date}</span>
                        <p className="text-xs text-slate-300 font-serif italic">"{journal.note}"</p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Securely Stored</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* LUXURY MASTER FOOTER WATERMARK */}
      <footer className="mt-20 border-t border-[#D4AF37]/10 pt-10 text-center max-w-4xl mx-auto px-4">
        <div className="w-10 h-10 rounded-full border border-[#D4AF37]/15 flex items-center justify-center text-[#E5C158] mx-auto mb-4 bg-[#0E2018]">
          <Compass size={16} className="animate-pulse" />
        </div>
        <p className="text-xs text-slate-400 font-serif italic mb-2">
          "Truly, the final goal is the meeting with your Lord in beauty..." &bull; Surah An-Najm
        </p>
        <span className="text-[9px] text-[#D4AF37]/55 uppercase font-mono tracking-[0.4em] block">Nooraya Sacred Tarteel Companion Studio</span>
      </footer>
    </div>
  );
};
