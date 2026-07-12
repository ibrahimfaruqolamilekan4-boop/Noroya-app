import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Info, 
  MessageCircle, 
  Tag, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  TrendingUp,
  Filter,
  Brain,
  History,
  Users,
  Sparkles,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Save,
  PenSquare,
  HelpCircle,
  ChevronDown,
  Volume2,
  VolumeX,
  Globe,
  Compass,
  ArrowLeft,
  BookMarked,
  RotateCcw,
  SkipForward,
  SkipBack,
  Download,
  Flame,
  LineChart,
  Calendar,
  Layers,
  Sparkle,
  Dribbble,
  Send,
  Eye,
  EyeOff,
  Activity,
  Award,
  BookOpenCheck,
  Star,
  Moon,
  Tv,
  ListOrdered,
  Copy,
  Share2
} from 'lucide-react';
import { ALL_SURAHS, SEEDED_AYAS, fetchAyahContext, HADITHS_DB, Surah, DetailedAyah } from '../data/quranExplorer';
import { DAILY_HADITH_STREAM, DailyHadith } from '../data/dailyHadiths';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

// Famous premium Reciters database mapping
interface Reciter {
  id: string;
  name: string;
  path: string;
  image: string;
  bio: string;
}

const RECITERS_DB: Reciter[] = [
  { 
    id: 'turki', 
    name: "Badr Al-Turki", 
    path: "Badr_Al-Turki_128kbps", 
    image: "https://pub-c5e31b5cdafb419a866161d8d5f354d3.r2.dev/badr-al-turki.jpg",
    bio: "Celebrated for his slow, meditative resonance and beautiful tonal stability."
  },
  { 
    id: 'alafasy', 
    name: "Mishary Alafasy", 
    path: "Alafasy_128kbps", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    bio: "World-renowned for emotional sensitivity, melodic flow, and deep focus loops."
  },
  { 
    id: 'sudais', 
    name: "Abdul Rahman Al-Sudais", 
    path: "Abdurrahmaan_As-Sudais_192kbps", 
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    bio: "The historic Imam of Masjid al-Haram, known for his powerful, teary, and fast-paced recitation."
  },
  { 
    id: 'muaiqly', 
    name: "Maher Al-Muaiqly", 
    path: "Maher_AlMuaiqly_64kbps", 
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    bio: "Beloved for his serene, clear articulation, making it perfect for memorizers."
  },
  { 
    id: 'ghamdi', 
    name: "Saad Al-Ghamdi", 
    path: "Ghamadi_40kbps", 
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    bio: "Famous for his nostalgic, peaceful pacing and deeply moving vocal transitions."
  }
];

// Seeded Mood Recommendations Map
interface MoodRecommendation {
  ayahs: { reference: string; surahNum: number; ayahNum: number; benefit: string }[];
  duas: { title: string; arabic: string; meaning: string }[];
  motivation: string;
}

const MOODS_ENGINE: Record<string, MoodRecommendation> = {
  sad: {
    ayahs: [
      { reference: "94:5-6", surahNum: 94, ayahNum: 5, benefit: "Verily, with hardship comes ease. Restores instant hope." },
      { reference: "93:3", surahNum: 93, ayahNum: 3, benefit: "Your Lord has not forsaken you. Absolute companion solace." }
    ],
    duas: [
      { title: "Relief of Sadness", arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", meaning: "O Ever-Living, O Sustainer, in Your mercy I seek relief." }
    ],
    motivation: "Sadness is a rain that cleanses the soul's garden. Allah is acknowledging your grief and preparing immediate comfort."
  },
  anxious: {
    ayahs: [
      { reference: "13:28", surahNum: 13, ayahNum: 28, benefit: "In the remembrance of Allah do hearts find rest. Calms nervous energies." },
      { reference: "2:186", surahNum: 2, ayahNum: 186, benefit: "Indeed, I am near. Restores divine safety feelings." }
    ],
    duas: [
      { title: "Curing Overthinking & Fear", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", meaning: "O Allah, I seek refuge in You from anxiety and grief." }
    ],
    motivation: "Anxiety tries to write a future that only belongs to Allah. Release the pen. He has already taken beautiful care of you."
  },
  happy: {
    ayahs: [
      { reference: "14:7", surahNum: 14, ayahNum: 7, benefit: "If you are grateful, I will surely increase you. Multiplies blessings." },
      { reference: "55:60", surahNum: 55, ayahNum: 60, benefit: "Is the reward for goodness anything but goodness? Prompts action." }
    ],
    duas: [
      { title: "Praise for Happiness", arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ", meaning: "Praise be to Allah, by Whose grace beautiful things are completed." }
    ],
    motivation: "Grateful happiness is high worship. Direct your radiant energy into immediate acts of small kindness for others today!"
  },
  forgiveness: {
    ayahs: [
      { reference: "39:53", surahNum: 39, ayahNum: 53, benefit: "Do not despair of the mercy of Allah. Erases guilt weight." },
      { reference: "3:135", surahNum: 3, ayahNum: 135, benefit: "And who can forgive sins except Allah? Invites clean slate." }
    ],
    duas: [
      { title: "Master Dual of Istighfar", arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي", meaning: "O Allah, You are my Lord, there is no deity besides You. You created me..." }
    ],
    motivation: "The moment you turn back with sincere sorrow, the sin is already faded. Allah loves the returning soul more than a flawless one."
  },
  motivation: {
    ayahs: [
      { reference: "53:39", surahNum: 53, ayahNum: 39, benefit: "And that there is not for man except what he strives for." },
      { reference: "2:286", surahNum: 2, ayahNum: 286, benefit: "Allah does not burden a soul beyond that it can bear." }
    ],
    duas: [
      { title: "Du'a for Rizq & Energy", arabic: "اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً", meaning: "O Allah, there is nothing easy except what You make easy." }
    ],
    motivation: "Get up. The heavy mountain in front of you is only there to be climbed. Allah has pre-packed your spirit with the stamina required."
  }
};

const NoorayaLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-6">
    <motion.div
      animate={{ 
        rotate: [0, 360],
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.1, 0.8]
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-24 h-24"
    >
      <div className="absolute inset-0 border-2 border-[#D4AF37]/20 rounded-full animate-ping" />
      <div className="absolute inset-x-0 border-t-2 border-[#D4AF37] rounded-full" />
      <Sparkles className="absolute inset-0 m-auto text-[#D4AF37] animate-pulse" size={32} />
    </motion.div>
    <div className="text-center space-y-2">
      <h3 className="text-xl font-serif text-[#E5C158] tracking-widest">Illuminating Sacred Path...</h3>
      <p className="text-cream/50 text-[10px] uppercase tracking-[0.4em]">Aligning premium recitation, tafsir, and AI companion</p>
    </div>
  </div>
);

export const AlBayan: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Al Bayan Section Section Tab: Quran Translation vs Daily Hadith Stream
  const [bayanSubTab, setBayanSubTab] = useState<'quran' | 'hadith'>('quran');

  // Hadith Stream active state engines
  const [hadithSearch, setHadithSearch] = useState('');
  const [selectedHadithCategory, setSelectedHadithCategory] = useState<'All' | 'Character & Manners' | 'Faith (Iman)' | 'Supplication (Dua)' | 'Stories of wisdom'>('All');
  const [bookmarkedHadithIds, setBookmarkedHadithIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nooraya_hadith_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [sharingHadith, setSharingHadith] = useState<DailyHadith | null>(null);

  const copyHadithText = (hadith: DailyHadith) => {
    const textStr = `Narrated by ${hadith.narrator} (${hadith.source}):\n\nArabic: ${hadith.arabic}\n\nEnglish: "${hadith.translation}"\n\nVerified Grade: ${hadith.grade} - Shared from Nooraya Al Bayan Studio`;
    navigator.clipboard.writeText(textStr);
    toast.success("Hadith text copied successfully!");
  };

  const toggleHadithBookmark = (id: string) => {
    let updated;
    if (bookmarkedHadithIds.includes(id)) {
      updated = bookmarkedHadithIds.filter(hId => hId !== id);
      toast.success("✓ Removed from Al Bayan Favorites");
    } else {
      updated = [...bookmarkedHadithIds, id];
      toast.success("✓ Added to Al Bayan Favorites Sanctuary!");
    }
    setBookmarkedHadithIds(updated);
    localStorage.setItem('nooraya_hadith_bookmarks', JSON.stringify(updated));
  };

  const filteredHadiths = DAILY_HADITH_STREAM.filter(hadith => {
    const matchesCategory = selectedHadithCategory === 'All' || hadith.category === selectedHadithCategory;
    const matchesSearch = hadithSearch === '' ||
      hadith.arabic.toLowerCase().includes(hadithSearch.toLowerCase()) ||
      hadith.translation.toLowerCase().includes(hadithSearch.toLowerCase()) ||
      hadith.narrator.toLowerCase().includes(hadithSearch.toLowerCase()) ||
      hadith.source.toLowerCase().includes(hadithSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Navigation Studio states:
  // 'explore' includes Surah catalog, reading panels and classical tafsirs
  // 'recite' is the premium Islamic Now Playing player
  // 'companion' is the interactive smart AI chatbot
  // 'memorize' is the Word Hider interactive gamified simulator
  // 'moods' is the emotional counseling portal
  // 'ramadan' is the seasonal Khatm goals andcountdown
  // 'community' is the user interaction reflection board
  const [activeMainTab, setActiveMainTab] = useState<'explore' | 'companion' | 'memorize' | 'moods' | 'ramadan' | 'community'>(() => {
    if (tabParam && ['explore', 'companion', 'memorize', 'moods', 'ramadan', 'community'].includes(tabParam)) {
      return tabParam as any;
    }
    return 'explore';
  });

  useEffect(() => {
    if (tabParam && ['explore', 'companion', 'memorize', 'moods', 'ramadan', 'community'].includes(tabParam)) {
      setActiveMainTab(tabParam as any);
    }
  }, [tabParam]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quran Explorer States
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState<number | null>(null);
  const [activeAyah, setActiveAyah] = useState<DetailedAyah>(() => fetchAyahContext(1, 1));
  
  // View modifiers
  const [activeTranslation, setActiveTranslation] = useState<'sahih' | 'yusufAli' | 'pickthall' | 'hausa'>('sahih');
  const [activeTafsir, setActiveTafsir] = useState<'ibnKathir' | 'asSadi' | 'alTabari'>('ibnKathir');
  const [explanationMode, setExplanationMode] = useState<'simple' | 'deep' | 'children' | 'historical'>('simple');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl'>('base');

  // Interactive UI helpers
  const [isBrowsingAllSurahs, setIsBrowsingAllSurahs] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Audio Studio integration states
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeReciterId, setActiveReciterId] = useState<string>('turki'); // Default to Sheikh Badr Al-Turki
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioDuration, setAudioDuration] = useState<number>(10);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState<boolean>(false);
  const [isQueueVisible, setIsQueueVisible] = useState<boolean>(false);
  const [isCastVisible, setIsCastVisible] = useState<boolean>(false);
  const [isOverlayTextVisible, setIsOverlayTextVisible] = useState<boolean>(true); // true by default to show text over mountains
  const [isSleepTimerMenuOpen, setIsSleepTimerMenuOpen] = useState<boolean>(false);
  const [repeatCount, setRepeatCount] = useState<number>(0); // 0 = continuous, 1 = single, 3 = repeat 3x, 5 = 5x
  const [currentRepeatCycle, setCurrentRepeatCycle] = useState<number>(0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0); // 0 = off
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number>(0);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [downloadedReciters, setDownloadedReciters] = useState<string[]>(['alafasy']); // predownload Mishary
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  
  // Ambient Sound Ambient Mixer
  const [ambientSoundType, setAmbientSoundType] = useState<'none' | 'rain' | 'makkah' | 'wind'>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.25);
  const reciterAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // Memorization Mode Word Hider elements
  const [isHideWordsMode, setIsHideWordsMode] = useState(false);
  const [revealedWordIndices, setRevealedWordIndices] = useState<Record<number, boolean>>({});
  const [memorizedVerses, setMemorizedVerses] = useState<string[]>([]); // stores reference: "SurahNum:AyahNum"
  const [isReciteSimulatorActive, setIsReciteSimulatorActive] = useState(false);
  const [simulatedVoiceMatches, setSimulatedVoiceMatches] = useState<number>(0);

  // AI Assistant Chat Panel states
  const [aiChatMessages, setAiChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([]);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Ramadan states
  const [ramadanKhatmGoal, setRamadanKhatmGoal] = useState<number>(604); // Default verses total or target
  const [ramadanKhatmProgress, setRamadanKhatmProgress] = useState<number>(12); // completed ayahs
  const [ramadanCountdownDays, setRamadanCountdownDays] = useState<number>(0);

  // Community States (Local simulated live reflections feed)
  const [communityReflections, setCommunityReflections] = useState<{ id: string; user: string; avatar: string; reference: string; text: string; mood: string; likes: number; timestamp: string }[]>([
    {
      id: "cf1",
      user: "Tariq S.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      reference: "Ash-Sharh 94:5",
      text: "Every single time I face massive business stress, I recite Surah Sharh. Knowing that ease is not somewhere far in the future, but woven alongside the pain, relieves 90% of my anxiety immediately.",
      mood: "Anxious",
      likes: 24,
      timestamp: "2 hours ago"
    },
    {
      id: "cf2",
      user: "Zainab M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      reference: "Al-Fatihah 1:2",
      text: "Woke up feeling deeply grateful today for health and life. Sincere 'Alhamdulillah' changes your neural baseline into pure light.",
      mood: "Happy",
      likes: 18,
      timestamp: "5 hours ago"
    }
  ]);
  const [currentUserReflectionText, setCurrentUserReflectionText] = useState('');
  const [currentUserReflectionMood, setCurrentUserReflectionMood] = useState('Happy');
  const [selectedMood, setSelectedMood] = useState<'sad' | 'anxious' | 'happy' | 'forgiveness' | 'motivation' | null>(null);

  // Persistent States
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [journals, setJournals] = useState<Record<string, string>>({});
  const [reflectionInput, setReflectionInput] = useState('');
  const [listeningHistory, setListeningHistory] = useState<string[]>([]);
  const [listeningMinutes, setListeningMinutes] = useState<number>(42);

  // Initialize data on mount
  useEffect(() => {
    // Bookmarks
    const storedBookmarks = localStorage.getItem('nooraya_bayan_bookmarks');
    if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
    
    // Journal Reflections
    const storedJournals = localStorage.getItem('nooraya_bayan_journals');
    if (storedJournals) setJournals(JSON.parse(storedJournals));

    // Memorized list
    const storedMemo = localStorage.getItem('nooraya_memorized_list');
    if (storedMemo) setMemorizedVerses(JSON.parse(storedMemo));

    // History
    const storedHistory = localStorage.getItem('nooraya_listening_history');
    if (storedHistory) setListeningHistory(JSON.parse(storedHistory));

    // Set Al-Fatihah 1 as default (or read from deep-linked search parameters)
    const paramSurahNum = searchParams.get('surah') ? Number(searchParams.get('surah')) : null;
    const paramAyahNum = searchParams.get('ayah') ? Number(searchParams.get('ayah')) : null;
    if (paramSurahNum && paramAyahNum) {
      const matchS = ALL_SURAHS.find(s => s.number === paramSurahNum);
      if (matchS) {
        setSelectedSurah(matchS);
        setSelectedAyahNumber(paramAyahNum);
        setActiveAyah(fetchAyahContext(paramSurahNum, paramAyahNum));
      } else {
        const defaultSurah = ALL_SURAHS[0];
        setSelectedSurah(defaultSurah);
        setSelectedAyahNumber(1);
        setActiveAyah(fetchAyahContext(1, 1));
      }
    } else {
      const defaultSurah = ALL_SURAHS[0];
      setSelectedSurah(defaultSurah);
      setSelectedAyahNumber(1);
      setActiveAyah(fetchAyahContext(1, 1));
    }

    // Prepopulate AI Chat welcome
    setAiChatMessages([
      {
        sender: 'ai',
        text: "Assalamu Alaikum! I am your AI Tafsir Assistant and Quran Companion. Direct any question to me regarding meaning, historical context, linguistical roots, or daily life applications for our active verse. Try clicking one of the rapid queries below!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Ramadan Countdown (clamped beautifully to Islamic lunar estimate)
    const today = new Date();
    const ramadanEstimate = new Date(today.getFullYear(), 10, 15); // Simulated high holiday countdown
    if (ramadanEstimate < today) {
      ramadanEstimate.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = Math.abs(ramadanEstimate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setRamadanCountdownDays(diffDays);
  }, []);

  // Sleep Timer Countdown Loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && sleepTimerMinutes > 0 && sleepSecondsLeft > 0) {
      interval = setInterval(() => {
        setSleepSecondsLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setSleepTimerMinutes(0);
            toast("🌙 Sleep timer complete. Audio paused safely.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sleepTimerMinutes, sleepSecondsLeft]);

  // Sync active journal on Ayah change
  useEffect(() => {
    if (activeAyah) {
      const key = `${activeAyah.surahNumber}:${activeAyah.ayahNumber}`;
      setReflectionInput(journals[key] || '');
      setRevealedWordIndices({}); // reset word hider state
      
      // Stop recitation if moving across verses
      if (isPlaying) {
        setIsPlaying(false);
        if (reciterAudioRef.current) reciterAudioRef.current.pause();
      }
    }
  }, [activeAyah, journals]);

  // Main Quran Audio Recitation Engine Control
  useEffect(() => {
    if (isPlaying && activeAyah) {
      // Pad indices to three digits
      const fileIndex = `${String(activeAyah.surahNumber).padStart(3, '0')}${String(activeAyah.ayahNumber).padStart(3, '0')}`;
      const reciter = RECITERS_DB.find(r => r.id === activeReciterId) || RECITERS_DB[0];
      
      const audioUrl = `https://everyayah.com/data/${reciter.path}/${fileIndex}.mp3`;
      
      if (reciterAudioRef.current) {
        reciterAudioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeed;
      audio.volume = volume;
      
      // Real-time timeline synchronization event binders
      const onTimeUpdate = () => {
        setAudioCurrentTime(audio.currentTime);
      };
      const onLoadedMetadata = () => {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) {
          setAudioDuration(audio.duration);
        }
      };
      
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('durationchange', onLoadedMetadata);

      audio.play().catch(err => {
        toast.error("Audio stream offline or unsupported. Falling back gracefully.");
        setIsPlaying(false);
      });
      
      const handleEnded = () => {
        try {
          // Handle repeat mode
          if (repeatCount > 0 && currentRepeatCycle < repeatCount - 1) {
            setCurrentRepeatCycle(prev => prev + 1);
            audio.currentTime = 0;
            audio.play().catch(() => setIsPlaying(false));
          } else {
            // Finished cycles. Move to next verse in Surah if possible
            setCurrentRepeatCycle(0);
            if (selectedSurah && activeAyah && activeAyah.ayahNumber < selectedSurah.numberOfAyahs) {
              loadAyah(activeAyah.surahNumber, activeAyah.ayahNumber + 1);
              setTimeout(() => {
                setIsPlaying(true);
              }, 100);
            } else {
              // Option A (Reset View): Automatically reset progress seeker timeline bar back to 0:00,
              // toggle the center icon from a 'Pause' icon back to a clickable 'Play' icon, and keep the user on the exact same player screen.
              setIsPlaying(false);
              setAudioCurrentTime(0);
              audio.currentTime = 0;
            }
          }
        } catch (error) {
          console.error("Critical error inside Al-Bayan player ended lifecycle:", error);
          // Safely force the UI state back to the active 'Paused' screen layout rather than letting the screen go white or blank
          setIsPlaying(false);
          setAudioCurrentTime(0);
        }
      };

      audio.onended = handleEnded;
      audio.addEventListener('ended', handleEnded);
      
      reciterAudioRef.current = audio;

      // Log to listening minutes
      const listenerTimeout = setTimeout(() => {
        setListeningMinutes(p => p + 1);
      }, 12000);

      // Save history helper
      const histKey = `${activeAyah.surahNumber}:${activeAyah.ayahNumber}`;
      if (!listeningHistory.includes(histKey)) {
        const updatedH = [histKey, ...listeningHistory.slice(0, 19)];
        setListeningHistory(updatedH);
        localStorage.setItem('nooraya_listening_history', JSON.stringify(updatedH));
      }

      return () => {
        clearTimeout(listenerTimeout);
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('durationchange', onLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        if (reciterAudioRef.current) reciterAudioRef.current.pause();
      };
    } else {
      if (reciterAudioRef.current) {
        reciterAudioRef.current.pause();
      }
    }
  }, [isPlaying, activeAyah, activeReciterId, playbackSpeed, repeatCount]);

  // Ambient Nature Sounds Mixer Control
  useEffect(() => {
    if (isPlaying && ambientSoundType !== 'none') {
      let ambientUrl = '';
      if (ambientSoundType === 'rain') ambientUrl = 'https://assets.mixkit.co/active_storage/sfx/2448/2448-84.wav'; // Soft loop rainfall
      if (ambientSoundType === 'makkah') ambientUrl = 'https://assets.mixkit.co/active_storage/sfx/1487/1487-84.wav'; // Birds ambient loop
      if (ambientSoundType === 'wind') ambientUrl = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav';  // Soft rustling breeze

      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }

      const amb = new Audio(ambientUrl);
      amb.volume = ambientVolume;
      amb.loop = true;
      amb.play().catch(err => console.log("Ambient stream error:", err));
      ambientAudioRef.current = amb;
    } else {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    }
    return () => {
      if (ambientAudioRef.current) ambientAudioRef.current.pause();
    };
  }, [isPlaying, ambientSoundType, ambientVolume]);

  // Adjust current volume directly if playing
  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = ambientVolume;
    }
  }, [ambientVolume]);

  // Adjust current recitation speed dynamically
  useEffect(() => {
    if (reciterAudioRef.current) {
      reciterAudioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (reciterAudioRef.current) {
      reciterAudioRef.current.volume = volume;
    }
  }, [volume]);

  // Interactive direct Ayah loading helper
  const loadAyah = (surahNum: number, ayahNum: number) => {
    const sMeta = ALL_SURAHS.find(s => s.number === surahNum);
    if (sMeta) {
      setSelectedSurah(sMeta);
      setSelectedAyahNumber(ayahNum);
      setActiveAyah(fetchAyahContext(surahNum, ayahNum));
      setIsBrowsingAllSurahs(false);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleScrub = (val: number) => {
    if (reciterAudioRef.current) {
      reciterAudioRef.current.currentTime = val;
      setAudioCurrentTime(val);
    }
  };

  // Toggle bookmarked verse
  const toggleBookmark = () => {
    if (!activeAyah) return;
    const key = `${activeAyah.surahNumber}:${activeAyah.ayahNumber}`;
    let updated: string[];
    if (bookmarks.includes(key)) {
      updated = bookmarks.filter(b => b !== key);
      toast.success("Bookmark removed from Al-Bayan Sanctuary");
    } else {
      updated = [...bookmarks, key];
      toast.success("Ayah bookmarked in Al-Bayan Sanctuary");
    }
    setBookmarks(updated);
    localStorage.setItem('nooraya_bayan_bookmarks', JSON.stringify(updated));
  };

  // Commit personal reflection journal
  const saveJournal = () => {
    if (!activeAyah) return;
    const key = `${activeAyah.surahNumber}:${activeAyah.ayahNumber}`;
    const updated = { ...journals, [key]: reflectionInput };
    setJournals(updated);
    localStorage.setItem('nooraya_bayan_journals', JSON.stringify(updated));
    toast.success("Spiritual reflection journal logged.");
  };

  // Toggle memorization status for current verse
  const toggleMemorized = () => {
    if (!activeAyah) return;
    const key = `${activeAyah.surahNumber}:${activeAyah.ayahNumber}`;
    let updated: string[];
    if (memorizedVerses.includes(key)) {
      updated = memorizedVerses.filter(m => m !== key);
      toast.success("Removed from memorized sanctuary.");
    } else {
      updated = [...memorizedVerses, key];
      toast.success("✓ Mapped into your memorized Quran checklist!");
    }
    setMemorizedVerses(updated);
    localStorage.setItem('nooraya_memorized_list', JSON.stringify(updated));
  };

  // Triggers offline reciter download simulator
  const downloadRecitationsOffline = (reciterId: string) => {
    if (downloadProgress[reciterId] !== undefined) return;
    setDownloadProgress(prev => ({ ...prev, [reciterId]: 1 }));
    
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 15) + 5;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        setDownloadedReciters(prev => [...prev, reciterId]);
        toast.success(`Offline recitation files for ${RECITERS_DB.find(r => r.id === reciterId)?.name} saved successfully!`);
      }
      setDownloadProgress(prev => ({ ...prev, [reciterId]: currentPercent }));
    }, 400);
  };

  // Chat request sender for the AI Quran Companion / Tafsir Assistant
  const handleAiChatSubmit = async (e?: React.FormEvent, customPromptText?: string) => {
    if (e) e.preventDefault();
    const chatText = customPromptText || aiInputText;
    if (!chatText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: chatText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatMessages(prev => [...prev, userMsg]);
    if (!customPromptText) setAiInputText('');
    setIsAiThinking(true);

    try {
      const activeVerseText = activeAyah ? `Surah ${selectedSurah?.englishName} [${activeAyah.surahNumber}:${activeAyah.ayahNumber}] stating: "${activeAyah.translations.sahih}"` : "General inquiry";
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Regarding the Quranic Verse: ${activeVerseText}. Let's address the following user inquiry with immense sensitivity, scholarship, and wisdom: "${chatText}"` }] }],
          systemInstruction: "You are the Nooraya AI Quran Mastery Assistant. Provide a beautifully composed, professional, and compassionate analysis. Address the translations, meaning, spiritual context, related authentic hadiths, historical wisdom, and daily life actionable steps."
        })
      });

      const data = await response.json();
      setIsAiThinking(false);

      if (data && data.text) {
        setAiChatMessages(prev => [...prev, {
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      setIsAiThinking(false);
      // Fail proof sandboxed custom prompt analysis if server falls out
      setTimeout(() => {
        let simulatedAnswer = `Assalamu Alaikum. [Core Quran Guardian Offline Sandbox Support Active]
        
Regarding your study of the active verse, here is our composite spiritual analysis:
        
- **Deep Core Meaning**: This verse addresses the alignment of faith (Iman) with intentional excellence (Ihsan). It teaches that your life's actions are tested at a cellular level for sincerity.
- **Related Hadith Wisdom**: The Prophet ﷺ stated: "Verily, Allah loves that when any of you performs a task, you do it with absolute mastery (Itqan)." (Sahih Al-Jami).
- **Daily Life Actionable Steps**:
  1. Set a microscopic goal today of performing one task of service with high focus and no multi-tasking.
  2. Guard your heart from seeking worldly validation or applause. Sincerity yields immediate physical relief.`;
        
        setAiChatMessages(prev => [...prev, {
          sender: 'ai',
          text: simulatedAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  // Simple copy to clipboard share ayah utility
  const copyShareTextToClipboard = (type: 'arabic' | 'all' | 'hausa') => {
    if (!activeAyah) return;
    let textToCopy = '';
    
    if (type === 'arabic') {
      textToCopy = `${activeAyah.arabic} [Quran ${activeAyah.surahNumber}:${activeAyah.ayahNumber}]`;
    } else if (type === 'hausa') {
      textToCopy = `"${activeAyah.translations.hausa}" - Surah ${selectedSurah?.englishName} ${activeAyah.surahNumber}:${activeAyah.ayahNumber}`;
    } else {
      textToCopy = `Quran ${selectedSurah?.englishName} (${activeAyah.surahNumber}:${activeAyah.ayahNumber})\n\nArabic:\n${activeAyah.arabic}\n\nTranslation:\n"${activeAyah.translations.sahih}"\n\nHausa:\n"${activeAyah.translations.hausa}"`;
    }

    navigator.clipboard.writeText(textToCopy);
    toast.success("✓ Spiritual card copied details to safety!");
    setShowShareModal(false);
  };

  // Triggers direct search or direct coordinate jumping (e.g., "9:5" or "At-Tawbah")
  const handleUniversalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return;

    // Direct verse coordinates match: e.g. "9:5" or "9.5"
    const colonMatch = cleanQuery.match(/^(\d+)[:.](\d+)$/);
    if (colonMatch) {
      const sNum = parseInt(colonMatch[1]);
      const aNum = parseInt(colonMatch[2]);
      if (sNum >= 1 && sNum <= 114) {
        const surahObj = ALL_SURAHS.find(s => s.number === sNum);
        if (surahObj && aNum >= 1 && aNum <= surahObj.numberOfAyahs) {
          loadAyah(sNum, aNum);
          toast.success(`Sailing directly to Surah ${surahObj.englishName} ${sNum}:${aNum}`);
          return;
        }
      }
    }

    // Surah title match
    const matchedSurah = ALL_SURAHS.find(s => 
      s.englishName.toLowerCase().includes(cleanQuery) || 
      s.englishNameTranslation.toLowerCase().includes(cleanQuery)
    );

    if (matchedSurah) {
      loadAyah(matchedSurah.number, 1);
      toast.success(`Loading Surah ${matchedSurah.englishName}`);
      return;
    }

    // Try topics match
    const topics = ["peace", "jihad", "marriage", "wealth", "character", "mental health", "forgiveness", "parents", "knowledge"];
    const foundTopic = topics.find(t => cleanQuery.includes(t));
    if (foundTopic) {
      const formattedTopic = foundTopic.charAt(0).toUpperCase() + foundTopic.slice(1);
      setActiveMainTab('moods');
      setSearchParams({ tab: 'moods' });
      setSelectedMood(foundTopic as any);
      toast.success(`Redirected to our Mood & Counsel Sanctuary for: ${formattedTopic}`);
      return;
    }

    toast.error("Could not find direct matches. Try entering '9:5' or searching for a specific surah name.");
  };

  // Active recitation tracker soundwave elements mock
  const soundWaveMockLines = Array.from({ length: 18 });

  // Word Hider card render helpers
  const arabicWordsArray = activeAyah ? activeAyah.arabic.split(' ') : [];

  // Submit community reflection helper
  const handlePostReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserReflectionText.trim()) return;

    const newPost = {
      id: `comm-ref-${Date.now()}`,
      user: "My Soul Journey",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      reference: activeAyah ? `Surah ${selectedSurah?.englishName} ${activeAyah.surahNumber}:${activeAyah.ayahNumber}` : "General Reflection",
      text: currentUserReflectionText,
      mood: currentUserReflectionMood,
      likes: 0,
      timestamp: "Just now"
    };

    setCommunityReflections([newPost, ...communityReflections]);
    setCurrentUserReflectionText('');
    toast.success("✓ Reflection shared to the community boards!");
  };

  // Progress of active Surah memorization calculates
  const getSurahMemorizeProgress = () => {
    if (!selectedSurah) return 0;
    const totalAyahs = selectedSurah.numberOfAyahs;
    const memoListInSurah = memorizedVerses.filter(key => key.startsWith(`${selectedSurah.number}:`));
    return Math.round((memoListInSurah.length / totalAyahs) * 100);
  };

  return (
    <div className="min-h-screen bg-[#121214] text-[#F9F7E9] pb-32 font-sans relative overflow-x-hidden selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
      {/* Luxury Forest Emerald Aura Overlays */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-[#121214] via-[#1B1B1E]/3 to-transparent pointer-events-none" />
      <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/3 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[#1B1B1E]/5 rounded-full blur-[180px] pointer-events-none" />
      
      {/* Arabic Script background glow watermark */}
      <div className="absolute inset-x-0 top-36 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <span className="text-[14rem] font-serif font-black tracking-widest text-[#D4AF37] text-center">القرآن الكربم</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 pt-8">
        
        {/* UPPER HEADER PORTAL */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#D4AF37]/10 pb-6 mb-8 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1B1B1E] border border-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <Sparkles size={20} className="animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="text-left font-serif">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-[#D4AF37]/60 block">Assalamu Alaikum, Servant of Light</span>
              <h2 className="text-xl font-bold tracking-tight text-cream">Tarteel Quran Mastery Studio</h2>
            </div>
          </div>

          {/* Quick Stats Panel Header */}
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-[#1B1B1E]/60 backdrop-blur-md rounded-2xl border border-[#D4AF37]/10 flex items-center space-x-2">
              <Flame size={14} className="text-[#D4AF37] animate-bounce" />
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 block uppercase font-bold leading-none">Holy Streak</span>
                <span className="text-xs font-black text-[#D4AF37]">5 days</span>
              </div>
            </div>

            <div className="px-4 py-2 bg-[#1B1B1E]/60 backdrop-blur-md rounded-2xl border border-[#D4AF37]/10 flex items-center space-x-2">
              <Clock size={14} className="text-[#D4AF37]" />
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 block uppercase font-bold leading-none">Mastery Time</span>
                <span className="text-xs font-black text-cream">{listeningMinutes} mins</span>
              </div>
            </div>

            <div className="px-4 py-2 bg-[#1B1B1E]/60 backdrop-blur-md rounded-2xl border border-[#D4AF37]/10 flex items-center space-x-2">
              <Award size={14} className="text-[#D4AF37]" />
              <div className="text-left font-mono">
                <span className="text-[8px] text-slate-500 block uppercase font-bold leading-none">Memorized</span>
                <span className="text-xs font-black text-[#D4AF37]">{memorizedVerses.length} verses</span>
              </div>
            </div>
          </div>
        </div>

        {/* PREMIUM AL BAYAN SEGMENTED TAB NAVIGATION */}
        <div className="flex bg-[#1B1B1E]/60 backdrop-blur-md p-1.5 rounded-2xl border border-[#D4AF37]/15 mb-8 max-w-md mx-auto shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
          <button
            onClick={() => setBayanSubTab('quran')}
            className={cn(
              "flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center space-x-2",
              bayanSubTab === 'quran'
                ? "bg-[#D4AF37] text-[#121214] shadow-md font-extrabold"
                : "text-slate-400 hover:text-cream hover:bg-[#D4AF37]/5"
            )}
          >
            <BookOpen size={14} />
            <span>Quran Translation</span>
          </button>
          <button
            onClick={() => setBayanSubTab('hadith')}
            className={cn(
              "flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center space-x-2",
              bayanSubTab === 'hadith'
                ? "bg-[#D4AF37] text-[#121214] shadow-md font-extrabold"
                : "text-slate-400 hover:text-cream hover:bg-[#D4AF37]/5"
            )}
          >
            <Sparkles size={14} />
            <span>Daily Hadith Stream</span>
          </button>
        </div>

        {bayanSubTab === 'quran' ? (
          <>

        {/* SEARCH BAR PORTAL WITH FLOATING MOTIVATIONS */}
        <div className="bg-[#0E2018]/45 backdrop-blur-xl rounded-[2.2rem] border border-[#D4AF37]/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10">
          <form onSubmit={handleUniversalSearchSubmit} className="relative group mb-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 group-focus-within:text-[#E5C158] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Ayah Reference (e.g., '1:5', '9:5'), Surah title, or Topic..."
              className="w-full bg-[#050D09]/80 border border-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 focus:border-[#E5C158]/40 rounded-2xl py-4.5 pl-14 pr-32 text-cream placeholder:text-slate-600 focus:outline-none transition-all font-serif text-sm shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-[#0F2D1F] border border-[#D4AF37]/30 text-[10px] font-mono font-black uppercase tracking-widest text-[#E5C158] hover:bg-[#E5C158] hover:text-[#050D09] transition-all"
            >
              Seek
            </button>
          </form>

          {/* Quick Continue Reading Indicator Card */}
          {listeningHistory.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs px-2.5 pt-1 text-slate-400 gap-2">
              <div className="flex items-center gap-1.5 italic font-serif">
                <History size={11} className="text-[#D4AF37]" />
                <span>Last reviewed:</span>
                <span className="text-gold font-bold">{ALL_SURAHS.find(s => s.number === Number(listeningHistory[0].split(':')[0]))?.englishName} Ayah {listeningHistory[0].split(':')[1]}</span>
              </div>
              <button 
                onClick={() => {
                  const [sNum, aNum] = listeningHistory[0].split(':').map(Number);
                  loadAyah(sNum, aNum);
                }}
                className="text-[#E5C158] font-mono text-[9px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Continue reading ➔
              </button>
            </div>
          )}
        </div>

        {/* MASTER PORTAL STUDIO TAB SWITCHERS */}
        <div className="flex flex-wrap bg-[#050B07] p-1.5 rounded-[1.8rem] border border-[#D4AF37]/10 gap-1.5 mb-10 shadow-inner">
          {[
            { id: 'explore', label: 'Explore & Read', icon: BookOpen },
            { id: 'companion', label: 'AI Tafsir Advisor', icon: Brain },
            { id: 'memorize', label: 'Memorization Lock', icon: BookOpenCheck },
            { id: 'moods', label: 'Mood Sanctuary', icon: Compass },
            { id: 'ramadan', label: 'Ramadan Target', icon: Calendar },
            { id: 'community', label: 'Soul Board', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id as any);
                  setSearchParams({ tab: tab.id });
                  if (tab.id === 'companion' && activeAyah) {
                    // pre-load welcome notes or analysis for active verse
                  }
                }}
                className={cn(
                  "flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-3.5 text-[9px] font-mono font-black uppercase tracking-widest rounded-2xl transition-all duration-300 relative",
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

        {/* MAIN BODY SWITCH CONTENT */}
        <div className="space-y-12">

          {/* TAB 1: EXPLORE & READ QURAN */}
          {activeMainTab === 'explore' && (
            <div className="space-y-10 animate-fade-in">
              
              {/* Surah Drawer Selector */}
              <div className="bg-[#0E2018]/45 backdrop-blur-md rounded-[2rem] border border-[#D4AF37]/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#0F2D1F] border border-[#D4AF37]/15 flex items-center justify-center text-[#E5C158]">
                    <Layers size={22} className="animate-pulse" />
                  </div>
                  <div className="text-left font-serif">
                    <h4 className="text-lg font-bold">Sacred 114 Surah Catalog</h4>
                    <p className="text-xs text-slate-400">Jump cleanly to any Surah to inspect Arabic text & translations</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBrowsingAllSurahs(!isBrowsingAllSurahs)}
                  className="w-full sm:w-auto bg-[#D4AF37] text-[#050C08] font-mono font-black text-[9px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-md shadow-[#D4AF37]/10 flex items-center justify-center space-x-2 hover:scale-[1.01] transition-transform"
                >
                  <span>{isBrowsingAllSurahs ? 'Fold Catalog' : 'Unfold 114 Surahs'}</span>
                  <ChevronDown size={14} className={cn("transition-transform duration-300", isBrowsingAllSurahs && "rotate-180")} />
                </button>
              </div>

              {/* Alphabetical list / Grid */}
              <AnimatePresence>
                {isBrowsingAllSurahs && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 rounded-[2rem] bg-[#050B07] border border-[#D4AF37]/10 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D4AF37]/20 scrollbar-track-transparent">
                      {ALL_SURAHS.map(surah => (
                        <button
                          key={surah.number}
                          onClick={() => {
                            setSelectedSurah(surah);
                            setSelectedAyahNumber(1);
                            setActiveAyah(fetchAyahContext(surah.number, 1));
                            toast.success(`Loaded chapter ${surah.englishName}! Choose your target verse below.`);
                          }}
                          className={cn(
                            "p-4 rounded-2xl border text-left transition-all relative group",
                            selectedSurah?.number === surah.number ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-[#D4AF37]/10 bg-[#0E2018]/25 hover:bg-[#0E2018]/50"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono text-slate-500 font-bold">#{surah.number}</span>
                            <span className="text-xs text-[#E5C158] font-serif font-bold leading-none" dir="rtl">{surah.name}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-cream mt-1 group-hover:text-[#E3C25D] transition-colors">{surah.englishName}</h4>
                          <p className="text-[8px] text-[#D4AF37]/60 uppercase tracking-wider">{surah.numberOfAyahs} ayahs • {surah.revelationType}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verses Grid Selector of Active Surah */}
              {selectedSurah && (
                <div className="p-6 md:p-8 rounded-[2.2rem] bg-[#0E2018]/20 border border-[#D4AF37]/10 space-y-4 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/10 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#E5C158] flex items-center gap-2">
                        <span className="text-[#D4AF37]" dir="rtl">{selectedSurah.name}</span>
                        <span>Surah {selectedSurah.englishName}</span>
                      </h3>
                      <p className="text-xs text-slate-400 tracking-wider">
                        {selectedSurah.englishNameTranslation} • {selectedSurah.revelationType} Revelation • {selectedSurah.numberOfAyahs} verses
                      </p>
                    </div>
                    {memorizedVerses.length > 0 && (
                      <div className="px-4 py-2 bg-[#0E2018]/60 rounded-xl border border-[#D4AF37]/10 flex items-center space-x-2">
                        <span className="text-[9px] font-mono font-black uppercase text-slate-400">Chapter Memorized:</span>
                        <span className="text-[10px] font-bold text-[#E5C158] bg-[#0F2D1F] px-2 py-0.5 rounded border border-[#D4AF37]/20">{getSurahMemorizeProgress()}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-3 bg-[#050B07]/40 rounded-xl border border-[#D4AF37]/5 scrollbar-thin">
                    {Array.from({ length: selectedSurah.numberOfAyahs }).map((_, idx) => {
                      const vNum = idx + 1;
                      const isTarget = selectedAyahNumber === vNum;
                      const isMem = memorizedVerses.includes(`${selectedSurah.number}:${vNum}`);
                      return (
                        <button
                          key={vNum}
                          onClick={() => loadAyah(selectedSurah.number, vNum)}
                          className={cn(
                            "w-11 h-11 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-all relative",
                            isTarget 
                              ? "bg-[#D4AF37] text-[#050C08] border-transparent shadow shadow-[#D4AF37]/10 scale-105" 
                              : "bg-[#0E2018]/45 border-[#D4AF37]/10 text-slate-400 hover:border-[#E5C158]/50 hover:text-cream"
                          )}
                        >
                          {vNum}
                          {isMem && (
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PRIMARY READ DISPLAY CARD */}
              {activeAyah && (
                <div className="bg-[#0E2018]/45 backdrop-blur-xl rounded-[2.8rem] border border-[#D4AF37]/15 p-6 md:p-10 shadow-2xl relative">
                  
                  {/* Top Control Header Toolbar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D4AF37]/10 pb-6 mb-8 gap-4">
                    <div className="flex items-center space-x-3 text-left">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      <h3 className="text-2xl font-serif font-black text-[#E3C25D]">
                        Surah {ALL_SURAHS.find(s => s.number === activeAyah.surahNumber)?.englishName}
                      </h3>
                      <span className="text-slate-400 font-mono text-sm">Verse {activeAyah.ayahNumber}</span>
                    </div>

                    {/* Left/Right quick jumpers */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button 
                        onClick={() => {
                          if (activeAyah.ayahNumber > 1) {
                            loadAyah(activeAyah.surahNumber, activeAyah.ayahNumber - 1);
                          } else if (activeAyah.surahNumber > 1) {
                            const prevS = ALL_SURAHS.find(s => s.number === activeAyah.surahNumber - 1);
                            if (prevS) loadAyah(prevS.number, prevS.numberOfAyahs);
                          }
                        }}
                        className="flex-1 sm:flex-none p-3 rounded-xl bg-[#050C08] border border-[#D4AF37]/10 hover:border-[#E5C158] hover:text-gold transition-colors text-xs font-bold font-mono"
                      >
                        ◀ Previous
                      </button>

                      <button 
                        onClick={() => {
                          if (selectedSurah && activeAyah.ayahNumber < selectedSurah.numberOfAyahs) {
                            loadAyah(activeAyah.surahNumber, activeAyah.ayahNumber + 1);
                          } else if (activeAyah.surahNumber < 114) {
                            loadAyah(activeAyah.surahNumber + 1, 1);
                          }
                        }}
                        className="flex-1 sm:flex-none p-3 rounded-xl bg-[#050C08] border border-[#D4AF37]/10 hover:border-[#E5C158] hover:text-gold transition-colors text-xs font-bold font-mono"
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>

                  {/* Active calligraphy block with Font Scaling controls */}
                  <div className="space-y-6 mb-8 relative">
                    <div className="flex justify-between items-center px-1 mb-2">
                      <span className="text-[9px] font-mono font-black uppercase text-slate-500">Sacred Arabic Calligraphy</span>
                      <div className="flex bg-[#050A07] rounded-lg p-1 border border-[#D4AF37]/10">
                        {['sm', 'base', 'lg', 'xl', '2xl'].map(sz => (
                          <button
                            key={sz}
                            onClick={() => setFontSize(sz as any)}
                            className={cn(
                              "px-2 py-1 text-[8px] font-mono font-bold uppercase rounded",
                              fontSize === sz ? "bg-[#D4AF37] text-[#050C08]" : "text-slate-500 hover:text-slate-200"
                            )}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 md:p-12 rounded-[2rem] bg-[#050B07] border border-[#D4AF37]/10 text-center space-y-6 shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-radial-gradient from-white/1 to-transparent opacity-5" />
                      
                      <p 
                        className={cn(
                          "leading-[2.4] text-[#E5C158] font-serif font-black text-center transition-all select-all",
                          fontSize === 'sm' && "text-2xl",
                          fontSize === 'base' && "text-3xl",
                          fontSize === 'lg' && "text-4xl",
                          fontSize === 'xl' && "text-5xl",
                          fontSize === '2xl' && "text-6xl"
                        )}
                        dir="rtl"
                      >
                        {activeAyah.arabic}
                      </p>

                      <div className="h-px w-20 bg-[#D4AF37]/25 mx-auto" />
                      
                      <p className="text-slate-400 text-xs italic font-serif leading-relaxed max-w-3xl mx-auto px-4">
                        {activeAyah.transliteration}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic translations tabs */}
                  <div className="space-y-4 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D4AF37]/5 pb-3">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#D4AF37]/75 flex items-center gap-1.5">
                        <Globe size={11} /> Comparative Translation:
                      </span>
                      <div className="flex bg-[#050A07] p-1 rounded-xl border border-[#D4AF37]/10 w-full sm:w-auto">
                        {['sahih', 'yusufAli', 'pickthall', 'hausa'].map(t => (
                          <button
                            key={t}
                            onClick={() => setActiveTranslation(t as any)}
                            className={cn(
                              "flex-1 sm:flex-none px-4.5 py-2 text-[9px] font-mono font-black uppercase tracking-wider rounded-lg transition-all",
                              activeTranslation === t ? "bg-[#D4AF37]/10 text-[#D4AF37] font-bold" : "text-slate-500 hover:text-slate-200"
                            )}
                          >
                            {t === 'sahih' ? 'Sahih' : t === 'yusufAli' ? 'Yusuf Ali' : t === 'pickthall' ? 'Pickthall' : 'Hausa 🇳🇬'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#091510] border border-[#D4AF37]/10 text-left">
                      <p className="text-cream font-serif text-lg leading-relaxed italic">
                        "{activeAyah.translations[activeTranslation]}"
                      </p>
                    </div>
                  </div>

                  {/* Classical Scholar Tafsir Panel Selection */}
                  <div className="space-y-4 mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#D4AF37]/5 pb-3">
                      <span className="text-[10px] font-mono font-black uppercase text-slate-400 flex items-center gap-1">
                        <Info size={11} /> Tafsir Selection (Classical Scholars)
                      </span>
                      <div className="flex bg-[#050A07] p-1 rounded-xl border border-[#D4AF37]/10 w-full sm:w-auto">
                        {['ibnKathir', 'asSadi', 'alTabari'].map(scholar => (
                          <button
                            key={scholar}
                            onClick={() => setActiveTafsir(scholar as any)}
                            className={cn(
                              "flex-1 sm:flex-none px-4 py-2 text-[8px] font-mono font-black uppercase tracking-wider rounded-lg transition-all",
                              activeTafsir === scholar ? "bg-[#D4AF37]/10 text-[#D4AF37] font-bold" : "text-slate-500 hover:text-slate-200"
                            )}
                          >
                            {scholar === 'ibnKathir' ? 'Ibn Kathir' : scholar === 'asSadi' ? 'As-Sa’di' : 'Al-Tabari'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#050B07] border border-[#D4AF37]/10 text-left">
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed font-serif">
                        {activeAyah.tafsir[activeTafsir]}
                      </p>
                    </div>
                  </div>

                  {/* VERSE REFLECTION & LIFE LESSONS CARD */}
                  <div className="mb-8 border border-[#D4AF37]/10 p-6 rounded-[2rem] bg-[#0E2018]/25 text-left relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Award size={64} className="text-[#D4AF37]" />
                    </div>
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#E5C158] mb-4 flex items-center gap-1.5">
                      <Sparkle size={12} /> Verse Reflections, Scholar Consensus & Life Action
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#05110B] p-5 rounded-2xl border border-white/5">
                        <span className="text-[#D4AF37] font-mono text-[9px] font-black uppercase block mb-1">Personal Lesson</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-serif">Apply integrity, remember limits, and ask for help in small tasks with zero anxiety.</p>
                      </div>

                      <div className="bg-[#05110B] p-5 rounded-2xl border border-white/5">
                        <span className="text-[#D4AF37] font-mono text-[9px] font-black uppercase block mb-1">What Scholars Said</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-serif">Faith remains empty without active execution. The true measurement is continuous consistency.</p>
                      </div>

                      <div className="bg-[#05110B] p-5 rounded-2xl border border-white/5">
                        <span className="text-[#D4AF37] font-mono text-[9px] font-black uppercase block mb-1">Daily Action</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-serif">Check on one elder relative, give basic water charity, or feed a stray animal today.</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom functional actions (bookmarks, share cards) */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={toggleBookmark}
                      className={cn(
                        "flex-1 min-w-[130px] p-4.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider transition-all",
                        bookmarks.includes(`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`)
                          ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]"
                          : "bg-[#050B07] border-[#D4AF37]/10 text-slate-400 hover:text-cream hover:border-[#D4AF37]/30"
                      )}
                    >
                      {bookmarks.includes(`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`) ? (
                        <>
                          <BookmarkCheck size={14} />
                          <span>Bookmarked ✓</span>
                        </>
                      ) : (
                        <>
                          <Bookmark size={14} />
                          <span>Bookmark Verse</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleMemorized()}
                      className={cn(
                        "flex-1 min-w-[130px] p-4.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider transition-all",
                        memorizedVerses.includes(`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`)
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                          : "bg-[#050B07] border-[#D4AF37]/10 text-slate-400 hover:text-cream hover:border-[#D4AF37]/30"
                      )}
                    >
                      <span>{memorizedVerses.includes(`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`) ? 'Already Memorized ✓' : 'Mark Memorized'}</span>
                    </button>

                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex-1 min-w-[130px] p-4.5 rounded-xl bg-[#091510] border border-[#D4AF37]/20 text-[#E5C158] flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#050C08] transition-all"
                    >
                      <Send size={14} />
                      <span>Share Noble Verse</span>
                    </button>
                  </div>

                  {/* PRIVATE JOURNAL ENCLOSURE */}
                  <div className="border-t border-[#D4AF37]/10 pt-8 mt-10 text-left space-y-4">
                    <div className="flex items-center space-x-2">
                      <PenSquare size={15} className="text-[#D4AF37]" />
                      <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#E5C158]">Spiritual Journal Entries Persistence</h4>
                    </div>
                    <textarea 
                      rows={3}
                      placeholder="Capture notes about what lessons this verse provides to your heart..."
                      className="w-full bg-[#050C08] border border-[#D4AF37]/10 focus:border-[#E5C158]/50 rounded-2xl p-4 text-xs text-cream placeholder:text-slate-650 focus:outline-none focus:ring-1 focus:ring-[#E5C158]/25 transition-all leading-relaxed"
                      value={reflectionInput}
                      onChange={(e) => setReflectionInput(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={saveJournal}
                        className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#050C08] text-[9px] font-mono font-black uppercase tracking-widest hover:bg-[#E5C158] transition-all flex items-center gap-1.5"
                      >
                        <Save size={12} /> Save Private Journal
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Bookmarks directory carousel */}
              {bookmarks.length > 0 && (
                <div className="p-6 md:p-8 rounded-[2rem] bg-[#0E2018]/10 border border-[#D4AF37]/10 space-y-4 text-left">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <BookMarked size={12} className="text-[#D4AF37]" /> My Bookmarked Verses Sanctuary ({bookmarks.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {bookmarks.map(key => {
                      const [sId, aId] = key.split(':').map(Number);
                      return (
                        <button
                          key={key}
                          onClick={() => loadAyah(sId, aId)}
                          className="px-4 py-2 bg-[#050C08] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-color text-xs rounded-xl text-gold font-serif text-sky-200"
                        >
                          {ALL_SURAHS.find(s => s.number === sId)?.englishName || "Surah"} {key}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: NOW PLAYING CINEMATIC AUDIO PLAYER */}
          {false && (
            <div className="w-full mx-auto animate-fade-in relative z-10 px-0">
              
              {/* IMMERSIVE VISUAL CANVAS CONTAINER */}
              <div 
                className="relative w-full aspect-[4/3] md:aspect-[16/10] min-h-[580px] sm:min-h-[660px] md:min-h-[740px] rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85)] border border-[#D4AF37]/15 bg-slate-900 transition-all duration-700"
                style={{
                  backgroundImage: `url(${
                    ambientSoundType === 'rain' 
                      ? 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600&auto=format&fit=crop&q=80'
                      : ambientSoundType === 'makkah'
                      ? 'https://images.unsplash.com/photo-1591604128552-baccbaa023a1?w=1600&auto=format&fit=crop&q=80'
                      : ambientSoundType === 'wind'
                      ? 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1600&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=80' // default misty green mountains
                  })`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* DARK OVERLAY VIGNETTE */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

                {/* VISUAL LAYOUT GRID INSIDE CANVAS */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-12 z-10 selection:bg-[#D4AF37]/30 select-none">
                  
                  {/* TOP HEADER: BACK TO BROWSE & AMBIENT MIXER BADGE */}
                  <div className="flex items-center justify-between w-full relative">
                    <button
                      onClick={() => { setActiveMainTab('explore'); setSearchParams({ tab: 'explore' }); }}
                      className="px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-gold text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <ArrowLeft size={12} /> Search & Browse
                    </button>

                    {/* AMBIENT MIXER BADGE WITH POPUP SELECTOR */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          const types: Array<'none' | 'rain' | 'makkah' | 'wind'> = ['none', 'rain', 'makkah', 'wind'];
                          const nextIdx = (types.indexOf(ambientSoundType) + 1) % types.length;
                          setAmbientSoundType(types[nextIdx]);
                          toast(`Ambient: ${types[nextIdx] === 'none' ? 'Silence' : types[nextIdx].toUpperCase()}`);
                        }}
                        className="px-4 py-2 bg-black/40 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md capitalize"
                      >
                        {ambientSoundType === 'none' && "🔇 Silence"}
                        {ambientSoundType === 'rain' && "🌧️ Ambient Rain"}
                        {ambientSoundType === 'makkah' && "🐦 Makkah morning"}
                        {ambientSoundType === 'wind' && "💨 Soft Wind"}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      </button>
                    </div>
                  </div>

                  {/* CENTER CANVAS: GLOWING TEXT OVERLAY OR VISUAL SOUNDWAVE */}
                  <div className="flex-1 flex flex-col items-center justify-center py-6">
                    {isOverlayTextVisible && activeAyah ? (
                      <motion.div 
                        key={`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl text-center space-y-6 px-4 md:px-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                      >
                        {/* ARABIC TEXT */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif text-[#F4EFCB] leading-[1.6] sm:leading-[1.7] text-center tracking-wide arabic-font drop-shadow-[0_6px_15px_rgba(0,0,0,0.95)]" dir="rtl">
                          {activeAyah.arabic}
                        </h2>
                        {/* TRANSLITERATION */}
                        {activeAyah.transliteration && (
                          <p className="text-xs sm:text-sm text-slate-300 italic font-serif leading-relaxed px-4 max-w-2xl mx-auto opacity-90">
                            {activeAyah.transliteration}
                          </p>
                        )}
                        {/* TRANSLATION */}
                        <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed max-w-2xl mx-auto">
                          "{activeAyah.translations[activeTranslation] || activeAyah.translations.sahih}"
                        </p>
                        {/* REFERENCE BADGE */}
                        <span className="inline-block mt-2 px-3 py-1 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full text-[9px] font-mono tracking-widest text-gold uppercase">
                          Surah {selectedSurah?.englishName} • Ayah {activeAyah.ayahNumber} of {selectedSurah?.numberOfAyahs}
                        </span>
                      </motion.div>
                    ) : (
                      // SOUNDWAVE VISUALIZATION CANVAS (WHEN TEXT OVERLAY DISABLED)
                      <div className="space-y-4 text-center">
                        <div className="flex justify-center items-end gap-1.5 h-16 px-10">
                          {soundWaveMockLines.map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                height: isPlaying ? [16, Math.random() * 64 + 16, 16] : 8,
                                opacity: isPlaying ? [0.6, 1, 0.6] : 0.4
                              }}
                              transition={{ duration: Math.random() * 0.8 + 0.4, repeat: Infinity }}
                              className="w-1.5 bg-gradient-to-t from-[#D4AF37]/50 to-[#E5C158] rounded-full"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-white/60 font-mono tracking-widest uppercase">
                          {isPlaying ? "Reciting Meditative Resonances" : "Recitation Paused"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LOWER THIRD CONTROL HUD */}
                  <div className="space-y-6 w-full mt-auto">
                    
                    {/* RECITER & SURAH PROFILE BAR */}
                    <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-lg max-w-3xl mx-auto w-full">
                      {/* Left: Avatar & Metadata */}
                      <div className="flex items-center gap-4 text-left">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-inner flex-shrink-0">
                          <img 
                            src={RECITERS_DB.find(r => r.id === activeReciterId)?.image} 
                            alt="Reciter Avatar" 
                            className="w-full h-full object-cover select-none scale-105"
                            referrerPolicy="no-referrer"
                          />
                          {isPlaying && (
                            <span className="absolute bottom-1 right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight leading-snug">
                            {selectedSurah?.englishName || "Al-Mu'minun"}
                          </h3>
                          <p className="text-xs text-slate-350 font-medium tracking-wide">
                            {RECITERS_DB.find(r => r.id === activeReciterId)?.name || "Sheikh Badr Al-Turki"}
                          </p>
                        </div>
                      </div>

                      {/* Right: Favorites Bookmark Star Icon */}
                      <button 
                        onClick={toggleBookmark}
                        className={cn(
                          "p-3 rounded-full hover:bg-white/10 transition-all border shadow-sm cursor-pointer",
                          activeAyah && bookmarks.includes(`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`)
                            ? "border-[#D4AF37]/45 text-[#D4AF37] bg-[#D4AF37]/10" 
                            : "border-white/10 text-white/60 hover:text-white"
                        )}
                      >
                        <Star 
                          size={18} 
                          className={cn(
                            activeAyah && bookmarks.includes(`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`) 
                              ? "text-[#D4AF37]" 
                              : "text-white/60"
                          )}
                          fill={activeAyah && bookmarks.includes(`${activeAyah.surahNumber}:${activeAyah.ayahNumber}`) ? "#D4AF37" : "none"} 
                        />
                      </button>
                    </div>

                    {/* TIMELINE / CHROMATIC SCRUBBER BAR */}
                    <div className="max-w-3xl mx-auto w-full space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-white/50 w-10 text-left">
                          {formatTime(audioCurrentTime)}
                        </span>
                        
                        <div className="flex-1 relative group py-1.5 cursor-pointer">
                          <input 
                            type="range"
                            min="0"
                            max={audioDuration || 10}
                            step="0.05"
                            value={audioCurrentTime}
                            onChange={(e) => handleScrub(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] hover:bg-white/20 transition-all focus:outline-none"
                            style={{
                              background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${(audioDuration ? (audioCurrentTime / audioDuration) * 100 : 0)}%, rgba(255,255,255,0.1) ${(audioDuration ? (audioCurrentTime / audioDuration) * 100 : 0)}%, rgba(255,255,255,0.1) 100%)`
                            }}
                          />
                        </div>

                        <span className="text-[10px] font-mono font-bold text-white/50 w-10 text-right">
                          -{formatTime(Math.max(0, audioDuration - audioCurrentTime))}
                        </span>
                      </div>
                    </div>

                    {/* SLEEK MEDIA CONTROLS ROW */}
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                      {/* Playback Speed controller toggle */}
                      <button 
                        onClick={() => {
                          const speeds = [0.5, 1, 1.25, 1.5, 2];
                          const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                          setPlaybackSpeed(speeds[nextIdx]);
                          toast(`Playback Speed: ${speeds[nextIdx]}x`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-white/70 hover:text-gold text-[10px] font-mono tracking-widest font-black transition-all"
                      >
                        {playbackSpeed}x SPEED
                      </button>

                      <div className="flex items-center gap-6 sm:gap-8 justify-center">
                        {/* Skip prev */}
                        <button 
                          onClick={() => {
                            if (activeAyah && activeAyah.ayahNumber > 1) {
                              loadAyah(activeAyah.surahNumber, activeAyah.ayahNumber - 1);
                            } else if (activeAyah && activeAyah.surahNumber > 1) {
                              const prevS = ALL_SURAHS.find(s => s.number === activeAyah.surahNumber - 1);
                              if (prevS) loadAyah(prevS.number, prevS.numberOfAyahs);
                            }
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 hover:text-gold text-white/70 border border-white/10 rounded-full transition-all active:scale-90"
                        >
                          <SkipBack size={18} />
                        </button>

                        {/* Large Floating translucent Play/Pause Toggle button */}
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-16 h-16 rounded-full bg-[#D4AF37] hover:scale-105 active:scale-95 transition-all text-midnight flex items-center justify-center font-bold shadow-[0_4px_25px_rgba(212,175,55,0.4)] border border-[#E5C158]/50 z-10"
                        >
                          {isPlaying ? (
                            <Pause size={24} className="text-midnight fill-midnight" />
                          ) : (
                            <Play size={24} className="text-midnight ml-1 fill-midnight" />
                          )}
                        </button>

                        {/* Skip next */}
                        <button 
                          onClick={() => {
                            if (selectedSurah && activeAyah && activeAyah.ayahNumber < selectedSurah.numberOfAyahs) {
                              loadAyah(activeAyah.surahNumber, activeAyah.ayahNumber + 1);
                            } else if (activeAyah && activeAyah.surahNumber < 114) {
                              loadAyah(activeAyah.surahNumber + 1, 1);
                            }
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 hover:text-gold text-white/70 border border-white/10 rounded-full transition-all active:scale-90"
                        >
                          <SkipForward size={18} />
                        </button>
                      </div>

                      {/* Sleep Timer icon toggle */}
                      <button 
                        onClick={() => {
                          const steps = [0, 15, 30, 60];
                          const idx = steps.indexOf(sleepTimerMinutes);
                          const nextMins = steps[(idx + 1) % steps.length];
                          setSleepTimerMinutes(nextMins);
                          setSleepSecondsLeft(nextMins * 60);
                          if (nextMins > 0) {
                            toast(`Sleep timer set to ${nextMins} minutes.`);
                          } else {
                            toast("Sleep timer turned off.");
                          }
                        }}
                        className={cn(
                          "p-2.5 rounded-lg border flex items-center gap-1.5 transition-all active:scale-95 text-[10px] font-mono tracking-widest uppercase font-bold",
                          sleepTimerMinutes > 0 
                            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-gold animate-pulse" 
                            : "bg-white/5 border-white/5 text-white/70 hover:text-gold hover:bg-white/10"
                        )}
                      >
                        <Moon size={13} />
                        {sleepSecondsLeft > 0 ? `${Math.floor(sleepSecondsLeft / 60)}m` : "Sleep"}
                      </button>
                    </div>

                    {/* SEAMLESS GLASSMORPHIC BOTTOM NAVIGATION UTILITY BAR */}
                    <div className="border-t border-white/5 pt-5 max-w-4xl mx-auto w-full flex items-center justify-around gap-2 relative">
                      
                      {/* UTILITY 1: VOLUME POPUP */}
                      <div className="relative">
                        <button
                          onClick={() => setIsVolumeSliderVisible(!isVolumeSliderVisible)}
                          className={cn(
                            "flex flex-col items-center gap-1 text-xs transition-colors py-1 px-3 rounded-xl",
                            isVolumeSliderVisible ? "text-gold bg-white/5" : "text-white/60 hover:text-white"
                          )}
                        >
                          <Volume2 size={16} />
                          <span className="text-[9px] font-mono tracking-wider font-bold uppercase">Volume</span>
                        </button>

                        {isVolumeSliderVisible && (
                          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-md rounded-2xl border border-white/15 p-4 shadow-2xl z-30 w-44 space-y-2 animate-fade-in">
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                              <span>VOLUME LEVEL</span>
                              <span className="text-gold">{Math.round(volume * 100)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.05"
                              value={volume}
                              onChange={(e) => setVolume(parseFloat(e.target.value))}
                              className="w-full accent-[#D4AF37] h-1.5 bg-white/10 rounded-lg cursor-pointer transition-colors"
                            />
                          </div>
                        )}
                      </div>

                      {/* UTILITY 2: QIRA'AT / TEXT OVERLAY TOGGLE */}
                      <button
                        onClick={() => setIsOverlayTextVisible(!isOverlayTextVisible)}
                        className={cn(
                          "flex flex-col items-center gap-1 text-xs transition-colors py-1 px-3 rounded-xl",
                          isOverlayTextVisible ? "text-gold" : "text-white/60 hover:text-white"
                        )}
                      >
                        <BookOpen size={16} />
                        <span className="text-[9px] font-mono tracking-wider font-bold uppercase">Qira'at Text</span>
                      </button>

                      {/* UTILITY 3: CASTING / AIRPLAY SIMULATOR */}
                      <div className="relative">
                        <button
                          onClick={() => setIsCastVisible(!isCastVisible)}
                          className={cn(
                            "flex flex-col items-center gap-1 text-xs transition-colors py-1 px-3 rounded-xl",
                            isCastVisible ? "text-gold bg-white/5" : "text-white/60 hover:text-white"
                          )}
                        >
                          <Tv size={16} />
                          <span className="text-[9px] font-mono tracking-wider font-bold uppercase">AirPlay</span>
                        </button>

                        {isCastVisible && (
                          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-2xl z-30 w-52 space-y-3 animate-fade-in text-left">
                            <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span className="text-[9px] font-mono tracking-widest text-[#E5C158] font-black uppercase">Cast Output Device</span>
                            </div>
                            <div className="space-y-1">
                              {[
                                { name: "Living Room Apple TV", icon: "📺" },
                                { name: "HomePod Mini Nest", icon: "🔊" },
                                { name: "Nooraya Smart Display", icon: "💻" }
                              ].map((target, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    toast.success(`Cast routing audio output successfully to ${target.name}`);
                                    setIsCastVisible(false);
                                  }}
                                  className="w-full text-left py-2 px-2.5 hover:bg-[#D4AF37]/10 hover:text-gold rounded-lg text-xs text-white/80 transition-all font-serif flex items-center justify-between"
                                >
                                  <span>{target.icon} {target.name}</span>
                                  <span className="text-[8px] font-mono text-slate-500 uppercase font-extrabold">Connect</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* UTILITY 4: SURAH PLAYLISTS / QUEUE DRAWER */}
                      <div className="relative">
                        <button
                          onClick={() => setIsQueueVisible(!isQueueVisible)}
                          className={cn(
                            "flex flex-col items-center gap-1 text-xs transition-colors py-1 px-3 rounded-xl",
                            isQueueVisible ? "text-gold bg-white/5" : "text-white/60 hover:text-white"
                          )}
                        >
                          <ListOrdered size={16} />
                          <span className="text-[9px] font-mono tracking-wider font-bold uppercase">Chapters</span>
                        </button>

                        {isQueueVisible && (
                          <div className="absolute bottom-16 right-0 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-2xl z-40 w-64 h-72 space-y-3 flex flex-col animate-fade-in text-left">
                            <div className="pb-2 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                              <span className="text-[9px] font-mono tracking-widest text-[#E5C158] font-black uppercase">Browse 114 Surahs</span>
                              <span className="text-[8px] font-mono text-slate-500">{ALL_SURAHS.length} items</span>
                            </div>
                            {/* Surah List overflow container */}
                            <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                              {ALL_SURAHS.map(surah => {
                                const isCurrent = selectedSurah?.number === surah.number;
                                return (
                                  <button
                                    key={surah.number}
                                    onClick={() => {
                                      loadAyah(surah.number, 1);
                                      setIsQueueVisible(false);
                                    }}
                                    className={cn(
                                      "w-full text-left py-1.5 px-2 hover:bg-[#D4AF37]/10 hover:text-gold rounded-lg text-xs transition-all flex items-center justify-between",
                                      isCurrent ? "bg-[#D4AF37]/15 text-[#E5C158]" : "text-white/80"
                                    )}
                                  >
                                    <div className="flex items-center space-x-1.5 font-medium">
                                      <span className="text-[9px] font-mono text-slate-500 w-5">{surah.number}.</span>
                                      <span className="font-serif">{surah.englishName}</span>
                                    </div>
                                    <span className="text-[#D4AF37] font-serif text-[10px]">{surah.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* DOWNLOADS & RECITERS DIRECTORY COMPONENT BELOW CANVAS */}
              <div className="bg-[#0E2018]/25 border border-[#D4AF37]/10 rounded-[2.5rem] p-6 text-left space-y-6 mt-8">
                <h4 className="text-xs font-mono font-black uppercase text-slate-400 flex items-center gap-1.5 pb-2 border-b border-[#D4AF37]/10">
                  <Users size={14} className="text-[#D4AF37]" /> Core Reciters Academy & Simulated Offline Downloads
                </h4>

                <div className="grid gap-4">
                  {RECITERS_DB.map(reciter => {
                    const isSelected = activeReciterId === reciter.id;
                    const isDownloaded = downloadedReciters.includes(reciter.id);
                    const dlPct = downloadProgress[reciter.id];
                    return (
                      <div 
                        key={reciter.id}
                        onClick={() => {
                          setActiveReciterId(reciter.id);
                          setIsPlaying(false);
                        }}
                        className={cn(
                          "p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all",
                          isSelected ? "bg-[#D4AF37]/10 border-[#D4AF37]" : "bg-[#050C08] border-white/5 hover:border-[#D4AF37]/15"
                        )}
                      >
                        <div className="flex items-center space-x-3.5">
                          <img 
                            src={reciter.image} 
                            alt={reciter.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/10"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h5 className="font-serif font-bold text-sm text-cream leading-tight">{reciter.name}</h5>
                            <p className="text-[10px] text-slate-500">{reciter.bio}</p>
                          </div>
                        </div>

                        {/* Download progress trigger */}
                        <div onClick={e => e.stopPropagation()}>
                          {isDownloaded ? (
                            <span className="text-[8px] font-mono font-bold text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2.5 py-1.5 rounded-lg border border-[#D4AF37]/20 flex items-center gap-1">
                              Downloaded Offline ✓
                            </span>
                          ) : dlPct !== undefined ? (
                            <div className="text-right space-y-1">
                              <span className="text-[8px] font-mono text-slate-500 font-bold block">{dlPct}% downloading...</span>
                              <div className="w-24 h-1 bg-[#050C08] rounded-full overflow-hidden">
                                <div className="h-full bg-gold transition-all" style={{ width: `${dlPct}%` }} />
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => downloadRecitationsOffline(reciter.id)}
                              className="px-3.5 py-1.5 bg-[#050C08] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-lg text-[9px] font-mono text-gold flex items-center gap-1 transition-colors"
                            >
                              <Download size={10} /> Download Offline
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AI EXPLORATION CHAT COMPANION */}
          {activeMainTab === 'companion' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left animate-fade-in">
              
              {/* Left Column active context tracker */}
              <div className="md:col-span-1 space-y-6">
                <div className="border border-[#D4AF37]/10 p-6 rounded-[2rem] bg-[#0E2018]/25 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Info size={14} className="text-[#D4AF37]" />
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#E5C158]">Active counseling verse</span>
                  </div>

                  <div className="bg-[#050C08] p-5 rounded-2xl border border-white/5 space-y-3">
                    <h5 className="font-serif font-bold text-[#E5C158] leading-tight text-sm">Surah {selectedSurah?.englishName} [{activeAyah?.surahNumber}:{activeAyah?.ayahNumber}]</h5>
                    <p className="text-xl text-[#D4AF37] font-serif leading-relaxed text-right arabic-font" dir="rtl">{activeAyah?.arabic}</p>
                    <p className="text-[11px] text-slate-400 font-serif leading-relaxed">"{activeAyah?.translations.sahih}"</p>
                  </div>

                  {/* Suggest queries */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black tracking-widest block">Instant counseling triggers:</span>
                    {[
                      "How can I practice this verse in my lifestyle today?",
                      "Are there other verses linked logically to this verse?",
                      "Provide a child-friendly summary with beautiful metaphors",
                      "Analyze the historical context of Asbab al-Nuzul here"
                    ].map(qi => (
                      <button
                        key={qi}
                        onClick={() => handleAiChatSubmit(undefined, qi)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#050C08] border border-white/5 hover:border-[#D4AF37]/40 text-[10px] text-slate-350 leading-relaxed font-serif hover:text-gold transition-colors block"
                      >
                        {qi} ➔
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Core Discussion Thread */}
              <div className="md:col-span-2 flex flex-col h-[580px] bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                
                {/* Lobby welcome banner */}
                <div className="bg-[#05110B] p-4.5 border-b border-[#D4AF37]/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-8.5 h-8.5 rounded-xl bg-[#0E2218]/40 border border-[#D4AF37]/20 flex items-center justify-center text-gold">
                      <Brain size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-cream leading-tight">Sheikh Noor AI Counselor</h4>
                      <span className="text-[8px] font-mono tracking-widest uppercase text-emerald-400">Online Sandbox Companion</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAiChatMessages([aiChatMessages[0]])}
                    className="p-2 border border-[#D4AF37]/15 hover:border-red-500/20 text-neutral-400 hover:text-red-400 rounded-lg text-[9px] font-mono font-bold uppercase transition-colors"
                  >
                    Clear Track
                  </button>
                </div>

                {/* Message display */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                  {aiChatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex flex-col max-w-[85%] space-y-1 py-1 px-4 border rounded-2xl text-xs leading-relaxed",
                        msg.sender === 'user' 
                          ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#F9F7E9] ml-auto rounded-tr-none text-left" 
                          : "bg-[#050C08] border-white/5 text-slate-300 mr-auto rounded-tl-none text-left"
                      )}
                    >
                      <p className="font-serif leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <span className="text-[7.5px] font-mono text-slate-500 text-right block pt-1.5">{msg.timestamp}</span>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="p-4 bg-[#050C08] border border-white/5 rounded-2xl text-xs text-slate-400 mr-auto flex items-center gap-2 animate-pulse text-left">
                      <Sparkles size={11} className="text-[#D4AF37] animate-spin" />
                      <span> Sheikh Noor is generating counseling explanations...</span>
                    </div>
                  )}
                </div>

                {/* Submit query input */}
                <form onSubmit={handleAiChatSubmit} className="bg-[#050C08] p-4 border-t border-[#D4AF37]/10 flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask any spiritual lesson or thematic query about the verse..."
                    className="flex-1 bg-[#10241A] border border-white/5 focus:border-[#D4AF37]/45 rounded-xl py-3 px-4 text-xs text-cream placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold/15"
                    value={aiInputText}
                    onChange={(e) => setAiInputText(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="p-3 bg-gold hover:bg-[#E5C158] text-midnight rounded-xl transition-transform active:scale-95 flex items-center justify-center"
                  >
                    <Send size={14} className="text-[#050C08]" />
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* TAB 4: MEMORIZATION MODE */}
          {activeMainTab === 'memorize' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left">
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 relative">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D4AF37]/10 pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gold flex items-center gap-2">
                      <BookOpenCheck size={18} />
                      <span>Hafiz Word-Hider Memorization Locke</span>
                    </h3>
                    <p className="text-xs text-slate-400">Hide Arabic words to test memory. Click target card to reveal!</p>
                  </div>

                  <div className="flex bg-[#050C08] p-1.5 rounded-xl border border-white/5">
                    <button 
                      onClick={() => {
                        setIsHideWordsMode(!isHideWordsMode);
                        setRevealedWordIndices({});
                      }}
                      className={cn(
                        "px-4 py-2 text-[9px] font-mono font-black uppercase rounded-lg transition-all",
                        isHideWordsMode ? "bg-[#D4AF37] text-midnight" : "text-slate-500"
                      )}
                    >
                      {isHideWordsMode ? 'Active Word-Hider' : 'Interactive Study'}
                    </button>
                  </div>
                </div>

                {/* Main Interactive Arabic Study Box */}
                <div className="p-8 md:p-12 rounded-[2rem] bg-[#050C08] border border-[#D4AF37]/10 text-center relative shadow-inner">
                  <div className="flex flex-wrap flex-row-reverse justify-center gap-3 md:gap-4 leading-[2.8]">
                    {arabicWordsArray.map((word, wordIdx) => {
                      const isHidden = isHideWordsMode && !revealedWordIndices[wordIdx];
                      return (
                        <div 
                          key={wordIdx}
                          onClick={() => {
                            if (isHideWordsMode) {
                              setRevealedWordIndices(prev => ({ ...prev, [wordIdx]: !prev[wordIdx] }));
                            }
                          }}
                          className={cn(
                            "px-4 py-2.5 rounded-xl border font-serif text-3xl select-none transition-all cursor-pointer relative",
                            isHidden 
                              ? "bg-gradient-to-tr from-[#05110B] to-[#123121] border-[#D4AF37]/10 text-transparent shadow shadow-inner" 
                              : "bg-[#0E2018]/40 border-[#D4AF37]/35 text-[#E5C158] hover:scale-105"
                          )}
                        >
                          {word}
                          {isHidden && (
                            <div className="absolute inset-x-3 inset-y-4 rounded-md bg-[#D4AF37]/75 flex items-center justify-center animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {isHideWordsMode && (
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-6">
                      💡 Click on any masked black-and-gold card to reveal or hide the word text!
                    </p>
                  )}
                </div>

                {/* Recite Simulator with voice following mock feedback */}
                <div className="border-[#D4AF37]/10 border p-6 rounded-[2rem] bg-[#05100B] text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-[#D4AF37]" />
                      <h4 className="text-[10px] font-mono font-black uppercase text-[#E5C158]">Tarteel Voice Recognition Simulator</h4>
                    </div>
                    {isReciteSimulatorActive && (
                      <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/35 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Listening to your microphone...
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-serif">
                    Click trigger button and recite the verse loud into your system microphone. Nooraya's neural models will compare your vocals syllable-by-syllable with Mishary Al-Afasy's parameters.
                  </p>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      onClick={() => {
                        setIsReciteSimulatorActive(!isReciteSimulatorActive);
                        if (!isReciteSimulatorActive) {
                          setSimulatedVoiceMatches(0);
                          setTimeout(() => {
                            setSimulatedVoiceMatches(94);
                            toast.success("✓ Syllables aligned with Mishary Alafasy perfectly! Quran mastered!");
                          }, 3200);
                        }
                      }}
                      className={cn(
                        "px-6 py-3.5 rounded-xl font-mono font-black text-[9px] uppercase tracking-widest transition-transform flex items-center gap-2",
                        isReciteSimulatorActive 
                          ? "bg-red-500/20 border border-red-500 text-red-400" 
                          : "bg-[#D4AF37] text-midnight font-bold hover:scale-[1.01]"
                      )}
                    >
                      {isReciteSimulatorActive ? 'Disengage Mic' : 'Engage Recitation Mic'}
                    </button>

                    {simulatedVoiceMatches > 0 && (
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-black tracking-widest block leading-none">Correction Feedback Matches:</span>
                        <span className="text-xl font-black text-[#D4AF37] font-mono">{simulatedVoiceMatches}% Excellent Tag</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: EMOTIONAL MOOD SANCTUARY */}
          {activeMainTab === 'moods' && (
            <div className="space-y-10 text-left animate-fade-in">
              
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#0E2018]/45 border border-[#D4AF37]/15 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-gold">Emotional Quran Recommendation Engine</h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  The holy text was revealed as a clinical medicine for human anxieties, despair, and moments of unguided confusion. Select your neural baseline state to seek immediate celestial directions.
                </p>

                <div className="flex flex-wrap gap-2.5 pt-4">
                  {[
                    { id: 'sad', label: 'Clinical Sadness', emoji: '😢' },
                    { id: 'anxious', label: 'Stress & Overthinking', emoji: '😰' },
                    { id: 'happy', label: 'Sincere Joy', emoji: '☀️' },
                    { id: 'forgiveness', label: 'Seeking Forgiveness', emoji: '📿' },
                    { id: 'motivation', label: 'Loss of Motivation', emoji: '⛰️' }
                  ].map(md => (
                    <button
                      key={md.id}
                      onClick={() => setSelectedMood(md.id as any)}
                      className={cn(
                        "px-5 py-3.5 rounded-xl border text-xs font-mono font-black uppercase tracking-widest transition-all",
                        selectedMood === md.id 
                          ? "bg-[#D4AF37] text-midnight border-transparent font-bold" 
                          : "bg-[#050C08] border-[#D4AF37]/15 text-slate-400 hover:border-[#D4AF37]/40"
                      )}
                    >
                      <span className="mr-1.5">{md.emoji}</span>
                      <span>{md.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedMood && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Motivations card */}
                  <div className="md:col-span-1 border border-[#D4AF37]/10 p-6 rounded-[2rem] bg-[#0E2018]/25 h-fit text-left space-y-4">
                    <span className="text-[8px] font-mono font-black uppercase text-[#E5C158]">Islamic Counsel Guidance:</span>
                    <p className="font-serif leading-relaxed text-slate-300 whitespace-pre-line text-sm leading-relaxed">{MOODS_ENGINE[selectedMood].motivation}</p>
                    <div className="h-px bg-gold/10 w-full" />
                    
                    <div>
                      <span className="text-[8px] font-mono font-black uppercase text-slate-500 block mb-1.5">Recommended Supplication (Dua):</span>
                      {MOODS_ENGINE[selectedMood].duas.map((dua, di) => (
                        <div key={di} className="bg-[#050C08] p-4 rounded-xl space-y-2 border border-white/5">
                          <span className="text-[10px] font-bold text-[#E5C158] font-mono block">{dua.title}</span>
                          <p className="text-right text-lg text-gold font-serif arabic-font" dir="rtl">{dua.arabic}</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-serif">"{dua.meaning}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* List of Recommended Verses clickable */}
                  <div className="md:col-span-2 space-y-4 text-left">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 block">Recommended Quran Verses Click to Load instantly:</span>
                    
                    {MOODS_ENGINE[selectedMood].ayahs.map((ayaRec, ai) => (
                      <div 
                        key={ai}
                        onClick={() => loadAyah(ayaRec.surahNum, ayaRec.ayahNum)}
                        className="p-6 rounded-[2rem] bg-[#050C08] border border-white/5 hover:border-[#D4AF37]/35 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 cursor-pointer text-left group"
                      >
                        <div className="space-y-1.5 text-left">
                          <span className="text-gold font-serif text-sm font-bold flex items-center gap-1.5">
                            <Compass size={12} /> {ALL_SURAHS.find(s => s.number === ayaRec.surahNum)?.englishName} {ayaRec.reference}
                          </span>
                          <p className="text-xs text-slate-400 font-serif leading-relaxed italic pr-4">"{ayaRec.benefit}"</p>
                        </div>
                        <span className="p-3 bg-gold/5 border border-[#D4AF37]/20 text-gold rounded-xl text-[9px] font-mono font-black uppercase whitespace-nowrap group-hover:bg-gold group-hover:text-midnight transition-all">
                          Read Verse ➔
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 6: RAMADAN countdown & weekly Khatm tracker */}
          {activeMainTab === 'ramadan' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left">
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 relative">
                
                <div className="flex items-center space-x-3 pb-4 border-b border-[#D4AF37]/10">
                  <Calendar size={18} className="text-[#D4AF37]" />
                  <h3 className="text-xl font-serif font-bold text-gold">Ramadan Target & Khatm Tracker</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Countdown Card */}
                  <div className="bg-[#050C08] p-6 rounded-[2rem] border border-[#D4AF37]/10 text-center flex flex-col items-center justify-center space-y-3">
                    <span className="text-[9px] font-mono font-black uppercase text-slate-500">Golden Lunar Estimate Countdown</span>
                    <span className="text-5xl font-black text-gold font-mono tracking-tight">{ramadanCountdownDays} days</span>
                    <span className="text-[10px] text-cream/60 leading-normal max-w-xs font-serif italic text-center">Remaining until the next Holy Month of Ramadan. Begin pre-packing spiritual stamina today.</span>
                  </div>

                  {/* Khatm completed tracker */}
                  <div className="bg-[#050C08] p-6 rounded-[2rem] border border-[#D4AF37]/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-black uppercase text-slate-500">Quran Khatm Progress</span>
                      <span className="text-xs font-bold text-[#D4AF37] font-mono">{ramadanKhatmProgress} / {ramadanKhatmGoal} Verses</span>
                    </div>

                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-gold to-[#E5C158] transition-all duration-500 rounded-full"
                        style={{ width: `${(ramadanKhatmProgress / ramadanKhatmGoal) * 100}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 font-serif leading-relaxed italic leading-relaxed">
                      "Verify, reading 1 Juz a day completes the entire text once in 30 days." Target checklist configured dynamically.
                    </p>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => {
                          setRamadanKhatmProgress(p => Math.min(6236, p + 10));
                          toast.success("+10 Verses added to Khatm directory!");
                        }}
                        className="px-4 py-2 bg-gold/10 text-gold border border-gold/20 hover:border-gold rounded-lg text-[9px] font-mono uppercase"
                      >
                        ✓ Log 10 Verses
                      </button>

                      <button
                        onClick={() => {
                          setRamadanKhatmProgress(0);
                        }}
                        className="px-4 py-1 bg-transparent text-slate-600 hover:text-slate-400 rounded-lg text-[8px] font-mono uppercase"
                      >
                        Reset Track
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 7: COMMUNITY REFLECTION BOARD */}
          {activeMainTab === 'community' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left">
              
              <div className="bg-[#0E2018]/45 border border-[#D4AF37]/15 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-6 relative">
                
                <div className="flex items-center space-x-3 pb-2">
                  <Users size={18} className="text-[#D4AF37]" />
                  <h3 className="text-2xl font-serif font-bold text-gold">Soul Board: Community Reflections</h3>
                </div>
                
                <p className="text-xs text-slate-400 pb-2 leading-relaxed">
                  Post and read brief spiritual reflections from other Quran study participants globally. All posts are secured via moderation protocols.
                </p>

                {/* Reflection submit card */}
                {activeAyah && (
                  <form onSubmit={handlePostReflection} className="bg-[#050C08] p-6 rounded-[2rem] border border-[#D4AF37]/10 text-left space-y-4">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase text-slate-500">
                      <span>Expressing thoughts for: <strong className="text-gold font-serif text-[11px] italic pr-1">{selectedSurah?.englishName} Ayah {activeAyah.ayahNumber}</strong></span>
                      <div className="flex items-center space-x-2">
                        <span>Tag Mood-State:</span>
                        <select 
                          className="bg-[#0E2117] border border-white/5 text-[9px] px-2 py-0.5 rounded text-gold focus:outline-none"
                          value={currentUserReflectionMood}
                          onChange={(e) => setCurrentUserReflectionMood(e.target.value)}
                        >
                          <option value="Happy">Joy</option>
                          <option value="Anxious">Anxiety</option>
                          <option value="Sad">Sadness</option>
                          <option value="Motivation">Stamina</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Share a short spiritual lesson, feeling, or application with the community..."
                      className="w-full bg-[#10241A] border border-white/5 rounded-xl p-4 text-xs text-cream focus:outline-none placeholder-slate-600 leading-relaxed font-serif"
                      value={currentUserReflectionText}
                      onChange={(e) => setCurrentUserReflectionText(e.target.value)}
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gold hover:bg-[#E5C158] text-[#050C08] font-mono font-black text-[9px] uppercase tracking-widest rounded-xl transition-all"
                      >
                        Publish Post to Board
                      </button>
                    </div>
                  </form>
                )}

                {/* List community reviews */}
                <div className="space-y-4 pt-4">
                  {communityReflections.map(post => (
                    <div 
                      key={post.id}
                      className="p-6 rounded-[2rem] bg-[#050B07] border border-white/5 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2.5">
                          <img 
                            src={post.avatar} 
                            alt={post.user} 
                            className="w-8.5 h-8.5 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left">
                            <h6 className="font-serif font-bold text-xs text-cream inline-block">{post.user}</h6>
                            <span className="text-[8px] font-mono font-bold text-gold uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 ml-2">Tag: {post.mood}</span>
                            <p className="text-[8px] text-slate-500 font-mono italic">{post.timestamp}</p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-[#E5C158] bg-[#0E2018] border border-[#D4AF37]/15 px-3 py-1 rounded-xl font-serif">
                          {post.reference}
                        </span>
                      </div>

                      <p className="text-xs text-slate-350 leading-relaxed font-serif italic text-left">
                        "{post.text}"
                      </p>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            toast("✓ Liked Reflection!");
                            // simulate increment
                            setCommunityReflections(communityReflections.map(cr => cr.id === post.id ? { ...cr, likes: cr.likes + 1 } : cr));
                          }}
                          className="flex items-center space-x-1.5 text-[9px] font-mono font-black uppercase text-[#D4AF37] hover:underline"
                        >
                          <span>Helpful?</span>
                          <span className="bg-gold/15 px-2 py-0.5 rounded-lg border border-[#D4AF37]/30 text-gold">{post.likes} likes</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>
      </>
    ) : (
          /* HADITH TAB VIEW */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-12"
          >
            {/* LIVE DAILY STREAM BANNER */}
            <div className="bg-[#1B1B1E]/80 border border-[#D4AF37]/20 backdrop-blur-xl rounded-[2.2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] animate-pulse">
                  <Sparkles size={24} />
                </div>
                <div className="text-left font-serif">
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-[#D4AF37] flex items-center gap-1.5">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                    </span>
                    Continuous Daily Stream Active
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-cream mt-1">Prophetic Hadith Chronicle Stream</h3>
                  <p className="text-xs text-slate-400 mt-0.5">24 beautifully simulated daily verified posts of divine wisdom and characters.</p>
                </div>
              </div>

              {/* Stat Indicators */}
              <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-start md:justify-end">
                <div className="px-4 py-2 bg-[#121214] rounded-xl border border-[#D4AF37]/10 text-center font-mono min-w-[100px]">
                  <span className="text-[8px] text-slate-500 uppercase block">Daily Posts</span>
                  <span className="text-sm font-black text-[#D4AF37]">24/24 Synced</span>
                </div>
                <div className="px-4 py-2 bg-[#121214] rounded-xl border border-[#D4AF37]/10 text-center font-mono min-w-[100px]">
                  <span className="text-[8px] text-[#D4AF37] uppercase block">My Favorites</span>
                  <span className="text-sm font-black text-[#D4AF37]">{bookmarkedHadithIds.length} Saved</span>
                </div>
              </div>
            </div>

            {/* SEARCH AND CATEGORY FILTERS ROW */}
            <div className="bg-[#1B1B1E]/60 backdrop-blur-xl rounded-[2rem] border border-[#D4AF37]/10 p-5 shadow-lg space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search daily Hadith stream by narrator, citation source, Arabic calligraphy, or translation keywords..."
                  className="w-full bg-[#121214]/90 border border-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 focus:border-[#D4AF37]/40 rounded-xl py-3.5 pl-12 pr-4 text-cream placeholder:text-slate-600 focus:outline-none transition-all font-sans text-xs"
                  value={hadithSearch}
                  onChange={(e) => setHadithSearch(e.target.value)}
                />
                {hadithSearch && (
                  <button 
                    onClick={() => setHadithSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-cream font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* HORIZONTAL CATEGORY SCROLL PILLS */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(['All', 'Character & Manners', 'Faith (Iman)', 'Supplication (Dua)', 'Stories of wisdom'] as const).map(category => {
                  const isActive = selectedHadithCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedHadithCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 border",
                        isActive 
                          ? "bg-[#D4AF37] text-[#121214] border-transparent shadow-md shadow-[#D4AF37]/10 font-bold" 
                          : "bg-[#121214]/60 text-slate-400 border-[#D4AF37]/10 hover:border-[#D4AF37]/30 hover:text-cream"
                      )}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAIN STREAM LINES LIST */}
            {filteredHadiths.length > 0 ? (
              <div className="relative border-l border-[#D4AF37]/20 pl-6 sm:pl-8 ml-4 sm:ml-6 space-y-12">
                {filteredHadiths.map((hadith, index) => {
                  const isSaved = bookmarkedHadithIds.includes(hadith.id);
                  return (
                    <motion.div 
                      key={hadith.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                      className="relative"
                    >
                      {/* Timeline Node Icon connector */}
                      <div className="absolute -left-[35px] sm:-left-[43px] top-6 w-5 h-5 rounded-full bg-[#121214] border border-[#D4AF37] flex items-center justify-center z-10 shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                      </div>

                      {/* Frosted Glass Hadith Card container with subtle gold frame */}
                      <div className="bg-[#1B1B1E]/65 backdrop-blur-md border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 transition-all duration-300 relative overflow-hidden shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] group/card">
                        
                        {/* Background calligraphy glow accent watermark */}
                        <div className="absolute right-4 bottom-4 opacity-[0.015] pointer-events-none select-none text-9xl font-serif text-[#D4AF37]">
                          حديث
                        </div>

                        {/* Top Metadata Row */}
                        <div className="flex flex-wrap items-center justify-between border-b border-[#D4AF37]/10 pb-4 mb-5 gap-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-[#D4AF37]">📜</span>
                            <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                              {hadith.source}
                            </span>
                            <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                              Verified {hadith.grade}
                            </span>
                          </div>
                          <div className="text-[9px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">
                            Narrated by <span className="text-cream/90 font-bold">{hadith.narrator}</span>
                          </div>
                        </div>

                        {/* Middle Arabic text and Translation content */}
                        <div className="space-y-4">
                          {/* Arabic calligraphy in a clear font */}
                          <p 
                            className="text-right text-[#FAF3D1] font-serif leading-[1.8] text-xl sm:text-2xl font-black select-all hover:text-[#D4AF37] transition-colors"
                            dir="rtl"
                          >
                            {hadith.arabic}
                          </p>
                          
                          {/* Decorative border separator line */}
                          <div className="h-px w-16 bg-[#D4AF37]/20" />
                          
                          {/* English Translation below it in a clean serif typeface */}
                          <p className="text-cream/85 text-xs sm:text-sm font-serif leading-relaxed font-normal italic pr-2">
                            "{hadith.translation}"
                          </p>
                        </div>

                        {/* Category tag badges row */}
                        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#D4AF37]/5">
                          <span className="text-[8px] font-mono font-black uppercase text-[#D4AF37]/60 tracking-wider">
                            Topic: <span className="bg-[#121214] px-2 py-1 rounded text-cream border border-[#D4AF37]/10">{hadith.category}</span>
                          </span>
                        </div>

                        {/* Thin golden interaction buttons row */}
                        <div className="grid grid-cols-3 gap-2.5 mt-6 border-t border-[#D4AF37]/10 pt-4">
                          <button
                            onClick={() => copyHadithText(hadith)}
                            className="flex items-center justify-center space-x-1.5 py-2 px-1 bg-[#121214]/60 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider font-bold hover:bg-[#D4AF37] hover:text-[#121214] transition-all"
                          >
                            <Copy size={11} />
                            <span className="hidden sm:inline">Copy Text</span>
                            <span className="inline sm:hidden">Copy</span>
                          </button>

                          <button
                            onClick={() => toggleHadithBookmark(hadith.id)}
                            className={cn(
                              "flex items-center justify-center space-x-1.5 py-2 px-1 rounded-xl border text-[9px] font-mono uppercase tracking-wider font-bold transition-all",
                              isSaved
                                ? "bg-[#D4AF37] text-[#121214] border-transparent shadow-inner"
                                : "bg-[#121214]/60 border-[#D4AF37]/20 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30"
                            )}
                          >
                            {isSaved ? <BookmarkCheck size={11} /> : <Bookmark size={11} />}
                            <span className="hidden sm:inline">
                              {isSaved ? "Saved" : "Save Favorites"}
                            </span>
                            <span className="inline sm:hidden">
                              {isSaved ? "Saved" : "Save"}
                            </span>
                          </button>

                          <button
                            onClick={() => setSharingHadith(hadith)}
                            className="flex items-center justify-center space-x-1.5 py-2 px-1 bg-[#121214]/60 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider font-bold hover:bg-[#D4AF37] hover:text-[#121214] transition-all"
                          >
                            <Share2 size={11} />
                            <span className="hidden sm:inline">Share Card</span>
                            <span className="inline sm:hidden">Share</span>
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center border border-[#D4AF37]/10 bg-[#1B1B1E]/40 rounded-[2rem] space-y-4">
                <div className="w-12 h-12 bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Search size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-cream font-bold">No Synced Hadiths Found</h4>
                  <p className="text-slate-500 text-xs">Try refining your search terms or select another category filter.</p>
                </div>
                <button 
                  onClick={() => {
                    setHadithSearch('');
                    setSelectedHadithCategory('All');
                  }}
                  className="px-5 py-2 bg-[#D4AF37] text-[#121214] font-mono text-[9px] font-bold uppercase tracking-widest rounded-lg"
                >
                  Reset Stream Filter
                </button>
              </div>
            )}
          </motion.div>
        )}

        </div>

      {/* SHARE MODAL BOX OVERLAY */}
      {showShareModal && activeAyah && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-[#0E2018] rounded-[3rem] border border-[#D4AF37]/35 p-8 relative space-y-6 text-left"
          >
            <h4 className="text-lg font-serif font-black text-[#E5C158] flex items-center gap-2">
              <GiftCardIcon size={16} /> Share Premium Verse Card
            </h4>
            
            <p className="text-xs text-slate-400 leading-normal leading-relaxed">
              Export and copy formatted noble verses directly to share with friends, family, or social timelines in English, Arabic, and Hausa.
            </p>

            <div className="p-6 bg-[#050C08] rounded-2xl border border-white/5 space-y-3 font-serif">
              <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#D4AF37]/40 block">Visual Card Export Preview:</span>
              <p className="text-right text-gold text-2xl" dir="rtl">{activeAyah.arabic}</p>
              <p className="text-cream text-xs italic leading-relaxed">"{activeAyah.translations.sahih}"</p>
              <p className="text-[#D4AF37] text-[10px] font-mono tracking-widest block font-bold leading-none">— Surah {selectedSurah?.englishName} {activeAyah.surahNumber}:{activeAyah.ayahNumber}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => copyShareTextToClipboard('arabic')}
                className="p-3 bg-neutral-900 border border-white/5 hover:border-gold rounded-xl text-[9px] font-mono text-slate-400 font-bold uppercase"
              >
                Copy Arabic Calligraphy
              </button>

              <button
                onClick={() => copyShareTextToClipboard('hausa')}
                className="p-3 bg-neutral-900 border border-white/5 hover:border-gold rounded-xl text-[9px] font-mono text-slate-400 font-bold uppercase"
              >
                Copy Hausa Translation
              </button>

              <button
                onClick={() => copyShareTextToClipboard('all')}
                className="p-3 bg-[#D4AF37] text-[#050C08] font-bold rounded-xl text-[9.5px] font-mono uppercase tracking-wider hover:scale-[1.01]"
              >
                Copy All Info
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2 bg-transparent text-slate-500 font-mono text-[9px] font-bold uppercase hover:text-slate-200"
              >
                Close Portal ×
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* SHARABLE HADITH IMAGE CARD GENERATOR DIALOG */}
      <AnimatePresence>
        {sharingHadith && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121214] border-2 border-[#D4AF37] max-w-lg w-full rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
            >
              <div className="p-6 border-b border-[#D4AF37]/15 flex justify-between items-center bg-[#1B1B1E]">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <Sparkles size={16} className="animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest">Hadith Card Generator</span>
                </div>
                <button 
                  onClick={() => setSharingHadith(null)}
                  className="text-slate-400 hover:text-cream text-sm font-mono"
                >
                  Close ×
                </button>
              </div>

              {/* CARD PREVIEW DESIGN */}
              <div className="p-8">
                <div className="bg-gradient-to-br from-[#1B1B1E] to-[#121214] border border-[#D4AF37]/35 rounded-3xl p-8 relative overflow-hidden text-center shadow-inner min-h-[300px] flex flex-col justify-between">
                  {/* Subtle watermarks */}
                  <div className="absolute right-4 top-4 text-[#D4AF37]/5 text-7xl font-serif select-none pointer-events-none">
                    بركة
                  </div>
                  <div className="absolute left-4 bottom-4 text-[#D4AF37]/5 text-7xl font-serif select-none pointer-events-none">
                    حديث
                  </div>

                  {/* Header */}
                  <div className="border-b border-[#D4AF37]/10 pb-3 mb-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">
                    <span>📜 {sharingHadith.source}</span>
                    <span>Narrated by {sharingHadith.narrator}</span>
                  </div>

                  {/* Arabic text with beautiful color */}
                  <div className="my-auto space-y-4 py-4">
                    <p className="text-center text-[#FAF3D1] font-serif text-xl sm:text-2xl font-black leading-relaxed" dir="rtl">
                      {sharingHadith.arabic}
                    </p>
                    <div className="h-px w-10 bg-[#D4AF37]/30 mx-auto" />
                    <p className="text-cream/90 text-xs sm:text-sm italic font-serif leading-relaxed">
                      "{sharingHadith.translation}"
                    </p>
                  </div>

                  {/* Watermark brand signature */}
                  <div className="mt-5 pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase">
                    <span>Verified {sharingHadith.grade}</span>
                    <span className="text-[#D4AF37]">Nooraya Al-Bayan Sanctuary</span>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    toast.success("✓ Hadith image card saved to your gallery catalog!");
                    setSharingHadith(null);
                  }}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#121214] font-mono font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md shadow-[#D4AF37]/10 flex items-center justify-center space-x-2 hover:scale-[1.01] transition-all"
                >
                  <Download size={12} />
                  <span>Download Image Card</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://nooraya.co/hadith-cards/${sharingHadith.id}`);
                    toast.success("✓ Shareable link copied to clipboard!");
                  }}
                  className="px-6 py-3 bg-[#1B1B1E] border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[10px] font-extrabold uppercase tracking-widest rounded-xl hover:bg-[#D4AF37]/10 transition-all"
                >
                  Copy Share Link
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Simple visual decoration item holder
const GiftCardIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="lucide lucide-gift"
  >
    <rect x="3" y="8" width="18" height="4" rx="1"/>
    <path d="M12 8v13"/>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8c0-3.3 3.2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>
  </svg>
);
