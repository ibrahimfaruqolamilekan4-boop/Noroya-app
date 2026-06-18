import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Heart, Share2, BookOpen, Quote, Sparkles, ChevronRight, 
  Volume2, VolumeX, Copy, HelpCircle, ChevronDown, ChevronUp, CheckCircle, 
  Book, HeartHandshake, RefreshCw, Layers, Compass, Play, Pause, ListFilter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

// 1. ALL DUA CATEGORIES (19 Categories requested)
const DUA_CATEGORIES = [
  'All',
  'Morning Adhkar',
  'Evening Adhkar',
  'Sleep Duas',
  'Waking Up Duas',
  'Travel Duas',
  'Hardship & Sadness',
  'Anxiety & Stress',
  'Forgiveness (Istighfar)',
  'Rizq & Success',
  'Protection Duas',
  'Ramadan Duas',
  'Qunoot Dua',
  'Tahajjud Duas',
  'Parents Dua',
  'Sick Person Dua',
  'Marriage Dua',
  'Rain Dua',
  'Janazah Dua',
  'Hajj & Umrah Duas'
];

interface StandardDua {
  id: string;
  category: string;
  arabic: string;
  transliteration: string;
  translation: string;
  benefit: string;
  tafsir?: string;
  bestTime?: string;
  targetReplays?: number;
  source?: string;
}

// PREMIUM PRE-SEEDED AUTHENTIC DUAS
const INSTANT_DUAS: StandardDua[] = [
  {
    id: 'morning-1',
    category: 'Morning Adhkar',
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: "We have entered the morning and at this very time all sovereignty belongs to Allah. Praise be to Allah. There is no deity but Allah alone, Who has no partner.",
    benefit: "Starts the day with full recognition of Divine submission and warding off worldly arrogance.",
    bestTime: "At dawn (after Fajr prayer)",
    targetReplays: 3,
    tafsir: "This supplication establishes the foundational covenant of Tawhid immediately upon awakening, attuning the human mind to celestial focus.",
    source: "Sahih Muslim"
  },
  {
    id: 'evening-1',
    category: 'Evening Adhkar',
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah",
    translation: "We have entered the evening and at this very time all sovereignty belongs to Allah. Praise be to Allah.",
    benefit: "End the day's active hustle by surrendering control to the Sustainer.",
    bestTime: "After Asr or Maghrib prayer",
    targetReplays: 3,
    tafsir: "Entering evening with this affirmation washes away the daily anxiety of acquisition and centers the heart for nightly rest.",
    source: "Sahih Muslim"
  },
  {
    id: 'sleep-1',
    category: 'Sleep Duas',
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your Name, O Allah, I die and I live.",
    benefit: "Prepares the consciousness for soul transition during minor death (sleep).",
    bestTime: "Immediately before sleeping on the right side",
    targetReplays: 1,
    tafsir: "Sleep is referred to in Islamic psychology as the minor death. This declaration ensures one's last conscious thoughts are directed to Him.",
    source: "Sahih Bukhari"
  },
  {
    id: 'waking-1',
    category: 'Waking Up Duas',
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
    translation: "All praise is to Allah who gave us life after having taken it from us, and unto Him is the ultimate resurrection.",
    benefit: "Bridges biological awakening with immediate spiritual gratitude.",
    bestTime: "Upon opening your eyes",
    targetReplays: 1,
    source: "Sahih Bukhari"
  },
  {
    id: 'travel-1',
    category: 'Travel Duas',
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
    translation: "Glory be to Him Who has subjected this to us, though we were helpless to master it, and indeed to our Lord we shall return.",
    benefit: "Guards against the spiritual heedlessness that often accompanies speed and exploration.",
    bestTime: "When mounting your vehicle or starting a journey",
    targetReplays: 1,
    source: "Sahih Muslim"
  },
  {
    id: 'hardship-1',
    category: 'Hardship & Sadness',
    arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
    transliteration: "Inna lillahi wa inna ilayhi raji'un, Allahumma-jurni fi musibati wa-khlif li khayran minha",
    translation: "Truly we belong to Allah, and truly to Him we shall return. O Allah, reward me in my affliction and compensate me with something better than it.",
    benefit: "Installs deep psychological resilience and prevents chronic despair during trauma.",
    bestTime: "When experiencing loss, sadness, or bad news",
    targetReplays: 1,
    tafsir: "The ultimate weapon of emotional realignment teaches that nothing is truly lost, only transcended.",
    source: "Sahih Muslim"
  },
  {
    id: 'anxiety-2',
    category: 'Anxiety & Stress',
    arabic: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ وَأَصْلِحْ لِي شَأْنِي كُلَّهُ",
    transliteration: "Allahumma rahmataka arju fala takilni ila nafsi tarfata 'aynin wa aslih li sha'ni kullahu",
    translation: "O Allah, it is Your mercy that I hope for, so do not leave me to myself even for a blink of an eye, and rectify all of my affairs.",
    benefit: "Eradicates the crushing illusion of self-dependency.",
    bestTime: "Moments of panic or decision paralysis",
    targetReplays: 3,
    source: "Sunan Abi Dawud"
  },
  {
    id: 'forgiveness-2',
    category: 'Forgiveness (Istighfar)',
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika ma-stata'tu",
    translation: "O Allah, You are my Lord, there is no deity worthy of worship but You. You created me and I am Your servant, and I remain dedicated to Your covenant and promise as best as I am able.",
    benefit: "The Chief of Repentance (Sayyidul Istighfar). Absolute master key to spiritual rehabilitation.",
    bestTime: "Morning and evening with deep comprehension",
    targetReplays: 1,
    tafsir: "Whoever recites this during the day with conviction and dies before evening, or vice versa, is promised to be among the inhabitants of Paradise.",
    source: "Sahih Bukhari"
  },
  {
    id: 'rizq-1',
    category: 'Rizq & Success',
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration: "Allahumma-kfini bihalalika 'an haramika wa-ghnini bifadlika 'amman siwaka",
    translation: "O Allah, suffice me with what is lawful instead of what is unlawful, and make me independent of all besides You by Your grace.",
    benefit: "Alleviates heavy financial burdens and opens blessed gateways of career integrity.",
    bestTime: "After Friday prayers, or when facing debt",
    targetReplays: 7,
    source: "Jami' at-Tirmidhi"
  },
  {
    id: 'protection-3',
    category: 'Protection Duas',
    arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    benefit: "Wards off envy (Hasad), physical harm, and dark elements.",
    bestTime: "Evening, or when visiting a new town/space",
    targetReplays: 3,
    source: "Sahih Muslim"
  }
];

// 2. QURAN DUAS (Dedicated Tab list)
interface QuranDua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

const QURAN_DUAS: QuranDua[] = [
  {
    id: 'q-1',
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanah wa fil akhirati hasanah wa qina 'adhaban-nar",
    translation: "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    reference: "Surah Al-Baqarah 2:201"
  },
  {
    id: 'q-2',
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ",
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmatan, innaka Antal-Wahhab",
    translation: "Our Lord, let not our hearts deviate after You have guided us, and grant us from Yourself mercy. Indeed, You are the Bestower.",
    reference: "Surah Ali 'Imran 3:8"
  },
  {
    id: 'q-3',
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي • وَيَسِّرْ لِي أَمْرِي • وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي • يَفْقَهُوا قَوْلِي",
    transliteration: "Rabbish-rah li sadri, wa yassir li amri, wa-hlul 'uqdatan min lisani, yafqahu qawli",
    translation: "My Lord, expand for me my chest [with assurance], and ease for me my task, and untie the knot from my tongue, so they may understand my speech.",
    reference: "Surah Taha 20:25-28"
  },
  {
    id: 'q-4',
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta subhanaka inni kuntu minaz-zalimin",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    reference: "Surah Al-Anbiya 21:87"
  },
  {
    id: 'q-5',
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyatina qurrata a'yunin wa-j'alna lil-muttaqina imama",
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes, and make us an example for the righteous.",
    reference: "Surah Al-Furqan 25:74"
  }
];

// 3. HADITH DUAS
interface HadithDua {
  id: string;
  source: string;
  arabic: string;
  transliteration: string;
  translation: string;
  occasion: string;
}

const HADITH_DUAS: HadithDua[] = [
  {
    id: 'h-1',
    source: "Sahih Bukhari",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dala'id-dayni wa ghalabatir-rijal",
    translation: "O Allah, I seek refuge in You from sorrow and distress, helplessness and laziness, cowardice and miserliness, the pressure of debts, and being overpowered by men.",
    occasion: "Recite when waking up to ward off financial depression and mental blockages."
  },
  {
    id: 'h-2',
    source: "Riyad-us-Saliheen",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ",
    transliteration: "Ya Muqallibal-qulub thabbit qalbi 'ala dinika",
    translation: "O Overturner of hearts, make my heart steadfast upon Your religion.",
    occasion: "A highly consistent Prophetic custom to guard one's core faith from worldly distractions."
  },
  {
    id: 'h-3',
    source: "Sahih Muslim",
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Allahumma Antas-Salamu wa minkas-Salam, tabarakta dhal-Jalali wal-Ikram",
    translation: "O Allah, You are Peace, and from You comes Peace. Blessed are You, O Owner of Majesty and Honor.",
    occasion: "Uttered immediately after finishing every obligatory prayer to draw in absolute stillness."
  }
];

// 4. EMOTIONAL HEALING DUAS
interface HealingDua {
  id: string;
  feeling: 'When heartbroken' | 'When stressed' | 'When depressed' | 'Financial hardship' | 'Fear & anxiety' | 'Loneliness' | 'Seeking patience';
  source: string;
  transliteration: string;
  translation: string;
  arabic: string;
  benefit: string;
}

const HEALING_DUAS: HealingDua[] = [
  {
    id: 'heal-1',
    feeling: 'When heartbroken',
    source: "Sahih Muslim",
    arabic: "قَدَرُ اللهِ وَمَا شَاءَ فَعَلَ",
    transliteration: "Qadarullahi wa ma sha'a fa'al",
    translation: "It is the decree of Allah and He does whatever He wills.",
    benefit: "Cures regret, stops the looping 'if only I did...' questions, and grants supreme quietude.",
  },
  {
    id: 'heal-2',
    feeling: 'When stressed',
    source: "Abu Dawud",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    transliteration: "Ya Hayyu Ya Qayyumu bi-rahmatika astagheeth",
    translation: "O Ever-Living One, O Sustainer of all existence, by Your mercy I call out for rescue.",
    benefit: "Attracts instant celestial ease across overwhelming daily tasks.",
  },
  {
    id: 'heal-3',
    feeling: 'When depressed',
    source: "Sahih Bukhari (Dua of Distress)",
    arabic: "لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "La ilaha illallahul-Adhimul-Halim, la ilaha illallahu Rabbul-Arshil-Adhim",
    translation: "There is no deity worthy of worship except Allah, the Magnificent, the Forbearing. There is no deity worthy of worship except Allah, Lord of the Magnificent Throne.",
    benefit: "Breaks persistent cloud feelings and guides the mind back to eternal safety.",
  },
  {
    id: 'heal-4',
    feeling: 'Financial hardship',
    source: "At-Tirmidhi",
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي وَوَسِّعْ لِي فِي دَارِي وَبَارِكْ لِي فِي رِزْقِي",
    transliteration: "Allahumma-ghfir li dhanbi wa wassi' li fi dari wa barik li fi rizqi",
    translation: "O Allah, forgive my sins, expand my sanctuary, and inject divine barakah (increasing light) into my livelihood.",
    benefit: "Attracts unexpected blessings even when logical streams seem entirely dry.",
  },
  {
    id: 'heal-5',
    feeling: 'Fear & anxiety',
    source: "Sahih Bukhari",
    arabic: "حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal wakeel",
    translation: "Allah is sufficient for us, and He is the best disposer of affairs.",
    benefit: "The exact shield recited by Ibrahim (AS) when cast into the fire and companions when cornered.",
  },
  {
    id: 'heal-6',
    feeling: 'Loneliness',
    source: "Surah Al-Anbiya 21:89",
    arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ",
    transliteration: "Rabbi la tadharni fardan wa Anta khayrul-warithin",
    translation: "My Lord, do not leave me completely solitary, and You are the absolute best of inheritors.",
    benefit: "Recited by Zakareyya (AS); heals felt isolation and draws in loving companions.",
  },
  {
    id: 'heal-7',
    feeling: 'Seeking patience',
    source: "Surah Al-Baqarah 2:250",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wa-nsurna",
    translation: "Our Lord, pour down upon us immense patience, make our steps firm, and guide us to victory.",
    benefit: "Equips the soul with spiritual stamina to endure ongoing testing circumstances."
  }
];

export const DuaLibrary = () => {
  // Navigation Section State
  const [activeTab, setActiveTab] = useState<'all' | 'quran' | 'hadith' | 'qunoot' | 'healing'>('all');
  
  // Filtering & Search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom interactive states for cards
  const [selectedStandard, setSelectedStandard] = useState<StandardDua | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  
  // Audio Play Simulation
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal');
  const [repeatMode, setRepeatMode] = useState(false);
  const [tafsirOpenId, setTafsirOpenId] = useState<string | null>(null);

  // Daily Featured Dua State
  const [dailyDua, setDailyDua] = useState<StandardDua>(INSTANT_DUAS[0]);

  // Load persistence configurations
  useEffect(() => {
    const savedFavorites = localStorage.getItem('nooraya_dua_favorites');
    if (savedFavorites) {
      try { setFavorites(JSON.parse(savedFavorites)); } catch (e) { console.warn(e); }
    }
    const savedCompleted = localStorage.getItem('nooraya_completed_categories');
    if (savedCompleted) {
      try { setCompletedCategories(JSON.parse(savedCompleted)); } catch (e) { console.warn(e); }
    }

    // Pick dynamic pseudo-random Daily Dua based on days since epoch to change every day
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % INSTANT_DUAS.length;
    setDailyDua(INSTANT_DUAS[dayIndex]);
  }, []);

  // Sync favorites
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id);
      toast.success("Dua removed from favorites", { style: { background: '#0F0F11', color: '#E5C158', border: '1px solid rgba(229,193,88,0.1)' }});
    } else {
      updated = [...favorites, id];
      toast.success("Dua saved in your sacred heart favorites", { icon: '❤️', style: { background: '#0F0F11', color: '#E5C158', border: '1px solid rgba(229,193,88,0.1)' }});
    }
    setFavorites(updated);
    localStorage.setItem('nooraya_dua_favorites', JSON.stringify(updated));
  };

  // Sync / Complete progress tracker category
  const toggleCompleteCategory = (category: string) => {
    let updated: string[];
    if (completedCategories.includes(category)) {
      updated = completedCategories.filter(c => c !== category);
      toast.success(`Removed completion status for ${category}`);
    } else {
      updated = [...completedCategories, category];
      toast(`Keep up the light! You successfully completed ${category}`, {
        icon: '✨',
        style: { background: '#0F0F11', color: '#E5C158', border: '1px solid rgba(229,193,88,0.3)', borderRadius: '1.5rem' }
      });
    }
    setCompletedCategories(updated);
    localStorage.setItem('nooraya_completed_categories', JSON.stringify(updated));
  };

  // Repetition Counter Trigger
  const incrementCounter = (duaId: string, max: number = 3, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const curr = counters[duaId] || 0;
    if (curr >= max) {
      setCounters({ ...counters, [duaId]: 0 }); // reset
      toast.success("Adhkar sequence fully completed, mashallah!", { icon: '📿' });
    } else {
      const next = curr + 1;
      setCounters({ ...counters, [duaId]: next });
      if (next === max) {
        toast.success(`Complete! Done ${max} repetitions.`, { icon: '🌟' });
      }
    }
  };

  // Copy Dua Action
  const copyToClipboard = (arabic: string, trans: string, meaning: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const fullText = `🕌 Du\'a from Nooraya App:\n\nArabic:\n${arabic}\n\nTransliteration:\n${trans}\n\nTranslation:\n"${meaning}"\n\nDownload Nooraya to practice and unlock the light.`;
    navigator.clipboard.writeText(fullText);
    toast.success("Dua copied to clipboard successfully!", { style: { background: '#161619', color: '#E5C158', borderRadius: '1rem' } });
  };

  // Share via browser API if available
  const shareDua = (arabic: string, trans: string, meaning: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `"${meaning}" - Recite this beautiful prayer from Nooraya.`;
    if (navigator.share) {
      navigator.share({
        title: 'Nooraya Sacred Dua',
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      copyToClipboard(arabic, trans, meaning, e);
    }
  };

  // HIGH-FIDELITY SPEECH RECITATION SIMULATOR 
  const playAudioRecitation = (arabicText: string, EnglishText: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (playingId === id) {
      // Toggle off / stop speech
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel(); // kill active streams to prevent collision
    setPlayingId(id);

    // Prepare speech synthesis
    // Since proper Arabic voices aren't set on all environments, we deliver a premium, slow, meditative read-back of English translation and transliteration 
    const speechText = `Please recite the following supplication. ${EnglishText}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Check speed modification
    if (audioSpeed === 'slow') {
      utterance.rate = 0.65;
    } else {
      utterance.rate = 0.85;
    }
    
    utterance.onend = () => {
      // If repeat mode is on, trigger another call after a short comfortable pause
      if (repeatMode) {
        setTimeout(() => {
          if (playingId === id) {
            playAudioRecitation(arabicText, EnglishText, id);
          }
        }, 3000);
      } else {
        setPlayingId(null);
      }
    };

    utterance.onerror = () => {
      setPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
    toast("Soul Sanctuary Ambient Audio Guide Active", {
      icon: '🔊',
      style: { background: '#0F0F11', color: '#E5C158', border: '1px solid rgba(229,193,88,0.2)' }
    });
  };

  // SEARCH LOGIC supporting Feeling, Situation, and Source keywords
  const getFilteredDuas = () => {
    return INSTANT_DUAS.filter(dua => {
      const matchesCategory = activeCategory === 'All' || dua.category === activeCategory;
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = 
        dua.translation.toLowerCase().includes(lowerQuery) || 
        dua.transliteration.toLowerCase().includes(lowerQuery) ||
        dua.category.toLowerCase().includes(lowerQuery) || 
        (dua.source && dua.source.toLowerCase().includes(lowerQuery)) ||
        (dua.tafsir && dua.tafsir.toLowerCase().includes(lowerQuery)) ||
        // semantic mapping helper
        (lowerQuery === 'sad' && dua.category.includes('Hardship')) ||
        (lowerQuery === 'fear' && (dua.category.includes('Anxiety') || dua.category.includes('Protection'))) ||
        (lowerQuery === 'rizq' && dua.category.includes('Rizq')) ||
        (lowerQuery === 'before sleep' && dua.category.includes('Sleep')) ||
        (lowerQuery === 'hadith' && dua.source) ||
        (lowerQuery === 'anxiety' && dua.category.includes('Anxiety'));
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 islamic-pattern min-h-screen bg-[#0F0F11] relative overflow-hidden text-slate-100 selection:bg-[#E5C158]/20 selection:text-[#E5C158]">
      
      {/* Decorative Golden Ambient Pulse Nodes for Luxury Background depth */}
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] luxury-glow-pulse rounded-full pointer-events-none" />
      <div className="absolute top-[60%] left-[5%] w-[450px] h-[450px] luxury-glow-pulse rounded-full pointer-events-none" />

      {/* 9. PROGRESS TRACKER OVERVIEW COMPONENT */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 p-6 glass-card border-[#E5C158]/10 bg-[#161619]/30">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#E5C158] uppercase">Completed Devotions Ledger</span>
          <h2 className="text-xl font-serif text-[#FDFCF0]">Your Adhkar & Dua Progress</h2>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="px-6 py-3 rounded-full bg-slate-900/60 border border-white/5 flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-serif italic">Completed categories:</span>
            <span className="text-sm font-mono font-bold text-[#E5C158]">{completedCategories.length} / {DUA_CATEGORIES.length - 1}</span>
          </div>
          <div className="px-6 py-3 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/15 text-xs text-[#E5C158] font-mono leading-none">
            Saved Favorites: {favorites.length} ❤️
          </div>
        </div>
      </div>

      {/* HEADER SECTION WITH ADVANCED LUXURY TYPOGRAPHY */}
      <header className="mb-16 text-center max-w-3xl mx-auto relative z-10 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3"
        >
          <div className="w-10 h-10 bg-[#E5C158]/10 border border-[#E5C158]/30 rounded-3xl flex items-center justify-center text-[#E5C158] shadow-2xl">
            <Quote size={18} />
          </div>
          <span className="text-[10px] font-mono tracking-[0.5em] text-[#E5C158] font-black uppercase">THE DIVINE SANCTUARY</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-black text-[#FDFCF0] tracking-tight leading-none">
          Dua & Adhkar <span className="text-[#E5C158] italic font-medium">Core</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg font-serif italic leading-relaxed max-w-xl mx-auto opacity-85">
          "Call upon your Lord in humility and in secret; indeed, He does not like transgressors." — Surah Al-A'raf 7:55
        </p>
      </header>

      {/* 7. DAILY FEATURED DUA AT THE TOP (Interactive with speech and glowing play button) */}
      <section className="max-w-5xl mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 sm:p-12 relative overflow-hidden border-[#E5C158]/20 bg-gradient-to-br from-[#161619]/80 to-[#0F0F11]/90 shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
        >
          {/* Subtle golden background glow wrapper */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-radial from-[#E5C158]/5 to-transparent blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <Sparkles className="text-[#E5C158] animate-pulse" size={20} />
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono tracking-widest text-[#E5C158] uppercase font-bold">FEAST FOR THE SOUL</span>
                <h3 className="text-xs font-mono font-black text-[#FDFCF0] uppercase tracking-wider">Dynamic Featured Daily Devotion</h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-mono bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/25 px-4 py-1 rounded-full uppercase font-black tracking-widest">
                {dailyDua.category}
              </span>
              <button 
                onClick={(e) => toggleFavorite(dailyDua.id, e)}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-500 transition-colors"
                title="Save Favorite"
              >
                <Heart size={16} fill={favorites.includes(dailyDua.id) ? "currentColor" : "none"} className={favorites.includes(dailyDua.id) ? "text-rose-500" : ""} />
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-8 text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl font-arabic text-[#FDFCF0] leading-normal text-right sm:text-right font-medium" dir="rtl">
              {dailyDua.arabic}
            </h2>

            <div className="space-y-4 max-w-3xl">
              <p className="text-[#E5C158] font-serif italic text-base sm:text-lg">
                <strong>Transliteration:</strong> {dailyDua.transliteration}
              </p>
              <p className="text-slate-300 text-lg sm:text-xl font-serif font-semibold leading-relaxed">
                "{dailyDua.translation}"
              </p>
              {dailyDua.bestTime && (
                <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#E5C158]/60 mt-2">
                  <span>🌙 Optimum Hour:</span>
                  <span className="underline">{dailyDua.bestTime}</span>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                {/* Gold glowing pulsation on audioplayer button requested */}
                <button
                  onClick={(e) => playAudioRecitation(dailyDua.arabic, dailyDua.translation, dailyDua.id, e)}
                  className={cn(
                    "px-6 py-3.5 rounded-[1.5rem] font-mono text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center space-x-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.5)]",
                    playingId === dailyDua.id 
                    ? "bg-rose-500 text-white animate-pulse" 
                    : "bg-[#E5C158] text-[#0F0F11] hover:scale-105 active:scale-95 border-2 border-transparent hover:shadow-[0_0_20px_rgba(229,193,88,0.4)]"
                  )}
                >
                  {playingId === dailyDua.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{playingId === dailyDua.id ? "Silence Stream" : "Hear Divine Vibration"}</span>
                </button>

                <div className="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase px-2">Speed:</span>
                  <button 
                    onClick={() => setAudioSpeed(audioSpeed === 'normal' ? 'slow' : 'normal')}
                    className={cn("px-2.5 py-1 text-[8px] font-black font-mono rounded-lg transition-all", audioSpeed === 'slow' ? 'bg-[#E5C158] text-[#0F0F11]' : 'text-slate-400 hover:text-white')}
                  >
                    Slow Mode
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={(e) => copyToClipboard(dailyDua.arabic, dailyDua.transliteration, dailyDua.translation, e)}
                  className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-[#E5C158] rounded-xl border border-white/5 transition-all flex items-center space-x-2 text-xs"
                  title="Copy Dua"
                >
                  <Copy size={15} />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest hidden sm:inline">Copy</span>
                </button>
                <button 
                  onClick={(e) => shareDua(dailyDua.arabic, dailyDua.transliteration, dailyDua.translation, e)}
                  className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-[#E5C158] rounded-xl border border-white/5 transition-all flex items-center space-x-2 text-xs"
                  title="Share"
                >
                  <Share2 size={15} />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* DUAL LAYER INTEGRATED TAB SECTIONS */}
      <div className="max-w-6xl mx-auto mb-12 relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-3 border-b border-white/5 pb-6">
          <button
            onClick={() => { setActiveTab('all'); setActiveCategory('All'); }}
            className={cn(
              "px-6 py-3 rounded-[1.2rem] text-[10px] font-black tracking-widest uppercase transition-all flex items-center space-x-2 border",
              activeTab === 'all' 
                ? "bg-[#E5C158] text-[#0F0F11] border-[#E5C158] shadow-[0_10px_20px_rgba(229,193,88,0.2)]" 
                : "bg-[#161619]/40 text-slate-400 border-white/5 hover:border-[#E5C158]/20"
            )}
          >
            <Layers size={14} />
            <span>All Duas & Adhkar</span>
          </button>

          <button
            onClick={() => setActiveTab('quran')}
            className={cn(
              "px-6 py-3 rounded-[1.2rem] text-[10px] font-black tracking-widest uppercase transition-all flex items-center space-x-2 border",
              activeTab === 'quran' 
                ? "bg-[#E5C158] text-[#0F0F11] border-[#E5C158] shadow-[0_10px_20px_rgba(229,193,88,0.2)]" 
                : "bg-[#161619]/40 text-slate-400 border-white/5 hover:border-[#E5C158]/20"
            )}
          >
            <BookOpen size={14} />
            <span>Duas from Quran</span>
          </button>

          <button
            onClick={() => setActiveTab('hadith')}
            className={cn(
              "px-6 py-3 rounded-[1.2rem] text-[10px] font-black tracking-widest uppercase transition-all flex items-center space-x-2 border",
              activeTab === 'hadith' 
                ? "bg-[#E5C158] text-[#0F0F11] border-[#E5C158] shadow-[0_10px_20px_rgba(229,193,88,0.2)]" 
                : "bg-[#161619]/40 text-slate-400 border-white/5 hover:border-[#E5C158]/20"
            )}
          >
            <Book size={14} />
            <span>Prophet Muhammad ﷺ Duas</span>
          </button>

          <button
            onClick={() => setActiveTab('qunoot')}
            className={cn(
              "px-6 py-3 rounded-[1.2rem] text-[10px] font-black tracking-widest uppercase transition-all flex items-center space-x-2 border",
              activeTab === 'qunoot' 
                ? "bg-[#E5C158] text-[#0F0F11] border-[#E5C158] shadow-[0_10px_20px_rgba(229,193,88,0.2)]" 
                : "bg-[#161619]/40 text-slate-400 border-white/5 hover:border-[#E5C158]/20"
            )}
          >
            <Compass size={14} />
            <span>Dua Qunoot Special</span>
          </button>

          <button
            onClick={() => setActiveTab('healing')}
            className={cn(
              "px-6 py-3 rounded-[1.2rem] text-[10px] font-black tracking-widest uppercase transition-all flex items-center space-x-2 border",
              activeTab === 'healing' 
                ? "bg-[#E5C158] text-[#0F0F11] border-[#E5C158] shadow-[0_10px_20px_rgba(229,193,88,0.2)]" 
                : "bg-[#161619]/40 text-slate-400 border-white/5 hover:border-[#E5C158]/20"
            )}
          >
            <HeartHandshake size={14} />
            <span>Emotional Healing</span>
          </button>
        </div>
      </div>

      {/* SMART SEARCH BAR SYSTEM (Can search by feeling, situation, source keyword) */}
      {activeTab !== 'qunoot' && (
        <div className="max-w-2xl mx-auto mb-12 relative z-10 transition-all">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#E5C158]/50" size={18} />
          <input 
            type="text" 
            placeholder="Search by need or phrase (e.g. 'sad', 'before sleep', 'rizq', 'Bukhari')" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161619]/40 border border-white/10 rounded-[1.5rem] py-5 pl-16 pr-8 text-slate-200 outline-none focus:border-[#E5C158]/60 focus:bg-[#161619]/90 transition-all font-serif italic text-sm placeholder:text-slate-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-xs bg-[#E5C158]/10 text-[#E5C158] px-2.5 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* THE 19 SUITE CATEGORIES - SMOOTH HORIZONTAL CONTAINER */}
      {activeTab === 'all' && (
        <div className="max-w-6xl mx-auto mb-12 relative z-10">
          <div className="flex items-center space-x-2 mb-4 px-1">
            <ListFilter size={14} className="text-[#E5C158]" />
            <span className="text-[9px] font-mono font-bold text-slate-450 uppercase tracking-widest">Select Devotion Path</span>
          </div>
          
          <div className="flex overflow-x-auto scrollbar-hide space-x-3 pb-4 mask-right">
            {DUA_CATEGORIES.map(cat => {
              const hasCompleted = completedCategories.includes(cat);
              return (
                <div key={cat} className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-[9px] font-mono tracking-widest uppercase transition-all duration-300",
                      activeCategory === cat 
                        ? "bg-[#E5C158] text-[#0F0F11] shadow-[0_8px_16px_rgba(229,193,88,0.3)]" 
                        : "bg-[#161619]/50 text-slate-400 border border-white/5 hover:text-[#E5C158] hover:bg-[#161619]"
                    )}
                  >
                    {cat}
                  </button>
                  {cat !== 'All' && (
                    <button 
                      onClick={() => toggleCompleteCategory(cat)}
                      className={cn(
                        "w-7 h-7 rounded-full border flex items-center justify-center transition-all",
                        hasCompleted 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : "border-white/5 hover:border/20 text-slate-600 hover:text-[#E5C158]"
                      )}
                      title={hasCompleted ? "Mark category uncompleted" : "Complete development category!"}
                    >
                      <CheckCircle size={12} className={hasCompleted ? "animate-bounce" : ""} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT GRID SYSTEMS */}
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ALL DUAS & CATEGORIES */}
          {activeTab === 'all' && (
            <motion.div 
              key="all"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {getFilteredDuas().length === 0 ? (
                <div className="col-span-full py-20 text-center glass-card border-white/5">
                  <BookOpen className="mx-auto text-slate-600 mb-4" size={40} />
                  <p className="text-slate-400 font-serif italic text-lg">No authentic supplication matches your query.</p>
                  <p className="text-[#E5C158]/50 text-xs font-mono mt-2 uppercase tracking-widest">Try typing: "sad", "Travel", "fear", "protection"</p>
                </div>
              ) : (
                getFilteredDuas().map((dua) => {
                  const currRecits = counters[dua.id] || 0;
                  const target = dua.targetReplays || 3;
                  const isFavorited = favorites.includes(dua.id);
                  const isSecTafsirOpen = tafsirOpenId === dua.id;

                  return (
                    <motion.div
                      key={dua.id}
                      layoutId={dua.id}
                      className="glass-card p-6 flex flex-col justify-between border-[#E5C158]/10 bg-[#161619]/40 hover:bg-[#161619]/60 transition-all duration-300 min-h-[360px]"
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="px-3.5 py-1 bg-[#E5C158]/10 text-[#E5C158] text-[8px] font-mono tracking-widest rounded-full border border-[#E5C158]/15 uppercase">
                            {dua.category}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            {/* Counter button */}
                            <button 
                              onClick={(e) => incrementCounter(dua.id, target, e)}
                              className={cn(
                                "text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-lg flex items-center space-x-1 border",
                                currRecits === target 
                                  ? "bg-emerald-550/10 border-emerald-500/20 text-emerald-400" 
                                  : "bg-slate-900/60 border-white/5 text-slate-400 hover:text-white"
                              )}
                              title="Tap to update counter"
                            >
                              <RefreshCw size={10} className="animate-spin-slow" />
                              <span>{currRecits}/{target}</span>
                            </button>

                            <button 
                              onClick={(e) => toggleFavorite(dua.id, e)}
                              className="text-slate-600 hover:text-rose-500 p-1.5 transition-colors"
                            >
                              <Heart size={16} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-rose-500" : ""} />
                            </button>
                          </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-arabic text-[#FDFCF0] leading-loose text-right" dir="rtl">
                          {dua.arabic}
                        </h2>

                        <div className="space-y-3">
                          <p className="text-[#E5C158]/80 font-serif italic text-sm">
                            {dua.transliteration}
                          </p>
                          <p className="text-slate-300 font-serif line-clamp-3 text-sm leading-relaxed">
                            "{dua.translation}"
                          </p>
                          {dua.source && (
                            <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-500">Source: {dua.source}</span>
                          )}
                        </div>
                      </div>

                      {/* Dropdown tafsir section */}
                      {dua.tafsir && (
                        <div className="mt-4 border-t border-white/5 pt-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setTafsirOpenId(isSecTafsirOpen ? null : dua.id); }}
                            className="flex items-center justify-between w-full text-slate-500 hover:text-[#E5C158] transition-colors text-[9px] font-mono uppercase tracking-widest"
                          >
                            <span>{isSecTafsirOpen ? "Conception Hide" : "Unveil Tafsir Details"}</span>
                            {isSecTafsirOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                          {isSecTafsirOpen && (
                            <p className="mt-2 text-[11px] text-slate-400 font-serif leading-relaxed italic border-l-2 border-[#E5C158]/30 pl-3">
                              {dua.tafsir}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => playAudioRecitation(dua.arabic, dua.translation, dua.id, e)}
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                              playingId === dua.id 
                                ? "bg-rose-500 text-white animate-pulse" 
                                : "bg-[#E5C158]/10 text-[#E5C158] hover:bg-[#E5C158] hover:text-[#0F0F11]"
                            )}
                          >
                            {playingId === dua.id ? <VolumeX size={15} /> : <Volume2 size={15} />}
                          </button>
                          <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Recitation Stream</span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <button 
                            onClick={(e) => copyToClipboard(dua.arabic, dua.transliteration, dua.translation, e)}
                            className="p-2 text-slate-500 hover:text-[#E5C158] transition-colors"
                            title="Copy Dua"
                          >
                            <Copy size={14} />
                          </button>
                          <button 
                            onClick={(e) => shareDua(dua.arabic, dua.transliteration, dua.translation, e)}
                            className="p-2 text-slate-500 hover:text-[#E5C158] transition-colors"
                            title="Share"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* TAB 2: DUAS FROM THE QURAN */}
          {activeTab === 'quran' && (
            <motion.div 
              key="quran"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {QURAN_DUAS.filter(q => q.translation.toLowerCase().includes(searchQuery.toLowerCase()) || q.reference.toLowerCase().includes(searchQuery.toLowerCase())).map((qDua) => {
                const isFavorited = favorites.includes(qDua.id);
                return (
                  <div key={qDua.id} className="glass-card p-8 border-[#E5C158]/20 bg-[#161619]/40 flex flex-col justify-between min-h-[340px]">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <span className="text-[10px] font-mono tracking-widest text-[#E5C158] font-black uppercase">
                          {qDua.reference}
                        </span>
                        <div className="flex space-x-2">
                          <span className="text-[8px] font-mono bg-slate-900 border border-white/5 text-slate-400 px-3 py-1 rounded-sm uppercase">Quranic</span>
                          <button onClick={(e) => toggleFavorite(qDua.id, e)} className="text-slate-500 hover:text-rose-500 p-1">
                            <Heart size={16} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-rose-500" : ""} />
                          </button>
                        </div>
                      </div>

                      <h2 className="text-3xl font-arabic text-[#FDFCF0] leading-loose text-right" dir="rtl">
                        {qDua.arabic}
                      </h2>

                      <div className="space-y-3">
                        <p className="text-[#E5C158] font-serif italic text-sm">
                          <strong>Transliteration:</strong> {qDua.transliteration}
                        </p>
                        <p className="text-slate-300 font-serif leading-relaxed text-sm">
                          "{qDua.translation}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-8 flex justify-between items-center">
                      <button 
                        onClick={(e) => playAudioRecitation(qDua.arabic, qDua.translation, qDua.id, e)}
                        className={cn(
                          "px-4 py-2 border rounded-xl flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase transition-all",
                          playingId === qDua.id 
                            ? "bg-rose-500 text-white border-rose-500 animate-pulse" 
                            : "bg-white/5 text-slate-450 border-white/10 hover:border-[#E5C158] hover:text-[#E5C158]"
                        )}
                      >
                        {playingId === qDua.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        <span>{playingId === qDua.id ? "Pause" : "Play Recitation"}</span>
                      </button>

                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => copyToClipboard(qDua.arabic, qDua.transliteration, qDua.translation, e)}
                          className="p-1.5 bg-slate-900 rounded-lg text-slate-500 hover:text-[#E5C158] border border-white/5 transition-colors"
                        >
                          <Copy size={13} />
                        </button>
                        <button 
                          onClick={(e) => shareDua(qDua.arabic, qDua.transliteration, qDua.translation, e)}
                          className="p-1.5 bg-slate-900 rounded-lg text-slate-500 hover:text-[#E5C158] border border-white/5 transition-colors"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 3: PROPHET MUHAMMAD ﷺ DUAS (AUTHENTIC HADITH) */}
          {activeTab === 'hadith' && (
            <motion.div 
              key="hadith"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {HADITH_DUAS.filter(h => h.translation.toLowerCase().includes(searchQuery.toLowerCase()) || h.source.toLowerCase().includes(searchQuery.toLowerCase())).map((hDua) => {
                const isFavorited = favorites.includes(hDua.id);
                return (
                  <div key={hDua.id} className="glass-card p-8 border-[#E5C158]/20 bg-[#161619]/40 flex flex-col justify-between min-h-[350px]">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <span className="text-[10px] font-mono tracking-widest text-[#E5C158] font-black uppercase">
                          📜 {hDua.source}
                        </span>
                        <button onClick={(e) => toggleFavorite(hDua.id, e)} className="text-slate-500 hover:text-rose-500 p-1">
                          <Heart size={16} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-rose-500" : ""} />
                        </button>
                      </div>

                      <h2 className="text-3xl font-arabic text-[#FDFCF0] leading-loose text-right" dir="rtl">
                        {hDua.arabic}
                      </h2>

                      <div className="space-y-3">
                        <p className="text-[#E5C158] font-serif italic text-sm">
                          <strong>Transliteration:</strong> {hDua.transliteration}
                        </p>
                        <p className="text-slate-300 font-serif leading-relaxed text-sm">
                          "{hDua.translation}"
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#E5C158]/5 rounded-xl border border-[#E5C158]/10 text-xs text-slate-400 font-serif block mt-4">
                      <strong>Occasion:</strong> {hDua.occasion}
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                      <button 
                        onClick={(e) => playAudioRecitation(hDua.arabic, hDua.translation, hDua.id, e)}
                        className={cn(
                          "px-4 py-2 border rounded-xl flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase transition-all",
                          playingId === hDua.id 
                            ? "bg-rose-500 text-white border-rose-500 animate-pulse" 
                            : "bg-white/5 text-slate-450 border-white/10 hover:border-[#E5C158] hover:text-[#E5C158]"
                        )}
                      >
                        {playingId === hDua.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        <span>Hear Hadith Supplication</span>
                      </button>

                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => copyToClipboard(hDua.arabic, hDua.transliteration, hDua.translation, e)}
                          className="p-1.5 bg-slate-900 rounded-lg text-slate-500 hover:text-[#E5C158] border border-white/5 transition-colors"
                        >
                          <Copy size={13} />
                        </button>
                        <button 
                          onClick={(e) => shareDua(hDua.arabic, hDua.transliteration, hDua.translation, e)}
                          className="p-1.5 bg-slate-900 rounded-lg text-slate-500 hover:text-[#E5C158] border border-white/5 transition-colors"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 4: DEDICATED DUA QUNOOT SPECIAL TAB PAGE */}
          {activeTab === 'qunoot' && (
            <motion.div 
              key="qunoot"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto glass-card p-8 sm:p-16 border-[#E5C158]/30 bg-gradient-to-br from-[#161619] to-[#0F0F11]"
            >
              <div className="text-center space-y-4 pb-8 border-b border-white/5 mb-8">
                <Compass className="mx-auto text-[#E5C158] animate-spin-slow" size={32} />
                <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight">The Core Dua Qunoot Sanctuary</h2>
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[#E5C158] rounded-full text-xs font-mono">
                  <span>✨ Used in Witr prayer during Ramadan</span>
                </div>
              </div>

              {/* Layout details */}
              <div className="space-y-12 text-center">
                <div className="p-8 bg-[#E5C158]/5 rounded-[2rem] border border-[#E5C158]/15 space-y-6">
                  <h3 className="text-4xl font-arabic text-[#FDFCF0] leading-loose leading-normal" dir="rtl">
                    اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ
                  </h3>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto text-left">
                  <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase font-bold">TRANSLITERATION:</span>
                  <p className="text-slate-300 font-serif italic text-base">
                    "Allahumma-hdini feeman hadayta, wa 'afini feeman 'afayta, wa tawallani feeman tawallayta, wa barik li feema a'tayta, wa qini sharra ma qadayta, fa-innaka taqdi wa la yuqda 'alayk, wa-innahu la yadhillu man walayt, tabarakta Rabbana wa ta'alayt."
                  </p>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto text-left">
                  <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase font-bold">TRANSLATION:</span>
                  <p className="text-[#FDFCF0] font-serif leading-relaxed text-base">
                    "O Allah, guide me among those whom You have guided, and pardon me among those whom You have pardoned, and turn to me in friendship among those on whom You have turned in friendship, and bless me in what You have bestowed, and save me from the evil of what You have decreed. For indeed You decree and none can decree against You, and indeed he is not humiliated whom You have befriended. Blessed are You, our Lord, and Exalted."
                  </p>
                </div>

                {/* Special mode toggles */}
                <div className="pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-6">
                  <button 
                    onClick={(e) => playAudioRecitation(
                      "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ", 
                      "O Allah, guide me among those whom You have guided, and pardon me among those whom You have pardoned, and turn to me in friendship among those on whom You have turned in friendship, and bless me in what You have bestowed, and save me from the evil of what You have decreed.", 
                      "qunoot-main", 
                      e
                    )}
                    className={cn(
                      "px-8 py-4 rounded-[1.5rem] font-mono font-bold tracking-widest text-[11px] uppercase transition-all shadow-xl flex items-center space-x-2",
                      playingId === "qunoot-main" 
                        ? "bg-rose-500 text-white animate-pulse" 
                        : "bg-[#E5C158] text-[#0F0F11] hover:scale-105"
                    )}
                  >
                    {playingId === "qunoot-main" ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span>{playingId === "qunoot-main" ? "Silence Stream" : "Hear Qunoot Stream"}</span>
                  </button>

                  <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-2 items-center divide-x divide-white/5 gap-3">
                    <button 
                      onClick={() => setAudioSpeed(audioSpeed === 'slow' ? 'normal' : 'slow')}
                      className={cn("px-4 py-2 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all", audioSpeed === 'slow' ? 'bg-[#E5C158] text-[#0F0F11]' : 'text-slate-400 hover:text-[#E5C158]')}
                    >
                      🐢 Slow Recitation
                    </button>
                    <button 
                      onClick={() => setRepeatMode(!repeatMode)}
                      className={cn("px-4 py-2 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all", repeatMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white')}
                    >
                      🔁 Repeat Mode: {repeatMode ? "Active" : "Off"}
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/5 text-left text-xs text-slate-400 leading-relaxed max-w-xl mx-auto space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#E5C158] font-bold block">Sanctuary Instructs</span>
                  <p>In Witr (odd-numbered prayer following Isha or Tahajjud), invoke this supplication after returning from bowing (ruku) in the last unit. Stand in complete humble pleading, raise your palms to chest level, and feel the sacred connection.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: HARDSHIP & EMOTIONAL HEALING */}
          {activeTab === 'healing' && (
            <motion.div 
              key="healing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="text-[10px] font-mono tracking-[0.4em] text-[#E5C158] uppercase">Therapeutic Devotional Therapy</span>
                <h3 className="text-3xl font-serif font-black text-[#FDFCF0]">Sanctuary of Emotional Alignment</h3>
                <p className="text-slate-400 text-xs sm:text-sm font-serif italic">Select your current worldly feeling to receive instant, permanent divine remedies pre-seeded from our holy sources.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {HEALING_DUAS.filter(h => h.feeling.toLowerCase().includes(searchQuery.toLowerCase()) || h.translation.toLowerCase().includes(searchQuery.toLowerCase())).map((heal) => {
                  const isFavorited = favorites.includes(heal.id);
                  return (
                    <div key={heal.id} className="glass-card p-8 border-[#E5C158]/20 bg-[#161619]/40 flex flex-col justify-between min-h-[360px]">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="px-3.5 py-1.5 bg-rose-500/10 text-rose-400 text-[9px] font-mono tracking-widest rounded-full uppercase border border-rose-500/15">
                            💔 {heal.feeling}
                          </span>
                          <button onClick={(e) => toggleFavorite(heal.id, e)} className="text-slate-500 hover:text-rose-500 p-1">
                            <Heart size={16} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-rose-500" : ""} />
                          </button>
                        </div>

                        <h2 className="text-3xl font-arabic text-[#FDFCF0] leading-loose text-right" dir="rtl">
                          {heal.arabic}
                        </h2>

                        <div className="space-y-3">
                          <p className="text-[#E5C158] font-serif italic text-sm">
                            <strong>Transliteration:</strong> {heal.transliteration}
                          </p>
                          <p className="text-slate-300 font-serif text-sm leading-relaxed">
                            "{heal.translation}"
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-400 font-serif leading-relaxed italic space-y-1">
                        <strong className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">The Therapeutic Benefit:</strong>
                        <p>{heal.benefit}</p>
                        <span className="block text-[8px] font-mono text-slate-550 uppercase tracking-widest pt-1">Source: {heal.source}</span>
                      </div>

                      <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                        <button 
                          onClick={(e) => playAudioRecitation(heal.arabic, heal.translation, heal.id, e)}
                          className={cn(
                            "px-4 py-2 border rounded-xl flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase transition-all",
                            playingId === heal.id 
                              ? "bg-rose-500 text-white border-rose-500 animate-pulse" 
                              : "bg-white/5 text-slate-450 border-white/10 hover:border-[#E5C158] hover:text-[#E5C158]"
                          )}
                        >
                          {playingId === heal.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          <span>Hear Solution</span>
                        </button>

                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => copyToClipboard(heal.arabic, heal.transliteration, heal.translation, e)}
                            className="p-1.5 bg-slate-900 rounded-lg text-slate-500 hover:text-[#E5C158] border border-white/5 transition-colors"
                          >
                            <Copy size={13} />
                          </button>
                          <button 
                            onClick={(e) => shareDua(heal.arabic, heal.transliteration, heal.translation, e)}
                            className="p-1.5 bg-slate-900 rounded-lg text-slate-500 hover:text-[#E5C158] border border-white/5 transition-colors"
                          >
                            <Share2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
