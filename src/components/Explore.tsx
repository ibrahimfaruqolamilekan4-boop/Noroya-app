import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, Sparkles, Heart, ArrowLeft, Bookmark, Moon, Sun, 
  Play, Pause, CheckCircle2, ChevronRight, Star, Quote,
  Clock, Share2, TrendingUp, HandHeart, Award, Lock, MessageSquare, Shield, Sword,
  Map as MapIcon, Atom, Flame, Wind, Search, ArrowRight, Mic, Footprints
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { YouTubeLibrary } from './YouTubeLibrary';
import { SeriesShowcase } from './SeriesShowcase';
import { TikTokShowcase } from './TikTokShowcase';
import { IslamicMap } from './IslamicMap';
import { NamesOfAllah } from './NamesOfAllah';
import { GratitudeJournal } from './GratitudeJournal';
import { CommonGround } from './CommonGround';
import { CommunitySadaqahTracker } from './CommunitySadaqahTracker';
import { cn } from '../lib/utils';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { dbService } from '../services/dbService';
import { toast } from 'react-hot-toast';
import { QuranPractice } from './QuranPractice';
import { ErrorBoundary } from './ErrorBoundary';
import { RevertPath } from './RevertPath';
import { ArticleViewer } from './ArticleViewer';
import { ChroniclesEngine } from './ChroniclesEngine';
import { SoulScience } from './SoulScience';
import { Article, Ayah } from '../types';
import { ARTICLES as INITIAL_ARTICLES } from '../data/articles';

const PROPHETS_LIST = [
  "Adam", "Idris", "Nuh", "Hud", "Salih", "Ibrahim", "Lut", "Ismail", "Ishaq", "Yaqub", 
  "Yusuf", "Ayub", "Shuayb", "Musa", "Harun", "Dawud", "Sulayman", "Ilyas", "Alyasa", 
  "Yunus", "Dhul-Kifl", "Zakariya", "Yahya", "Isa", "Muhammad"
];


import { useAudio } from '../context/AudioContext';

const CinematicStoryCard = ({ article, completedArticles, setSelectedArticle }: { 
  article: Article, 
  completedArticles: string[], 
  setSelectedArticle: (a: Article) => void,
}) => {
  const { setActiveSurah, togglePlay, isPlaying } = useAudio();
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ scale, opacity }}
      onClick={() => {
        setActiveSurah(article.id);
        setSelectedArticle(article);
      }}
      className="relative aspect-[3/4] rounded-[3rem] overflow-hidden cursor-pointer group mb-12 shadow-2xl border border-white/5 hover:border-gold/30 transition-colors"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, scale: 1.2 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={article.storylineBackgrounds?.[0] || article.wisdomImage} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          alt={article.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end p-10 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
             <span className="px-4 py-1 bg-gold/20 text-gold rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-gold/20">
               {article.theme}
             </span>
             {completedArticles.includes(article.id) && (
               <CheckCircle2 size={16} className="text-emerald-400" />
             )}
          </div>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream leading-tight group-hover:text-gold transition-colors">
            {article.prophet}
          </h3>
          <p className="text-slate-400 text-lg font-serif italic line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 text-white/80">
            {article.summary}
          </p>
        </motion.div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center space-x-4 text-gold/60 text-[10px] font-black uppercase tracking-widest">
            <Clock size={14} />
            <span>{article.readTime}</span>
          </div>
          <motion.div 
            whileHover={{ x: 10 }}
            className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-slate-950 transition-all"
          >
            <ArrowRight size={20} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ShahadaPortal = () => {
  const steps = [
    {
      title: "The Testimony of Faith",
      arabic: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ",
      transliteration: "Ash-hadu an la ilaha illa-Allah",
      translation: "I bear witness that there is no god but Allah",
      description: "The declaration that the Creator is One, Unique, and without partner. It is the anchor of the soul."
    },
    {
      title: "The Prophetic Witness",
      arabic: "وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ",
      transliteration: "wa ash-hadu anna Muhammadan rasulu-Allah",
      translation: "and I bear witness that Muhammad is the Messenger of Allah",
      description: "The acceptance of the final messenger as the guide and model for humanity's journey back to the Divine."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-8">
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 noor-glow border border-gold/20"
        >
          <Sparkles size={14} />
          <span>The Gate to Islam</span>
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-cream mb-8">The Shahada</h2>
        <p className="text-xl text-slate-400 font-serif italic max-w-2xl mx-auto">
          The most powerful words a human can utter, changing the destiny of the soul forever.
        </p>
      </div>

      <div className="grid gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass-card p-12 relative overflow-hidden group border-white/10"
          >
            <div className="absolute top-0 right-0 p-12 text-gold/5 group-hover:text-gold/10 transition-all font-serif text-9xl">
              {i + 1}
            </div>
            <h3 className="text-gold text-xs font-black uppercase tracking-[0.4em] mb-10">{s.title}</h3>
            <p className="text-5xl md:text-7xl text-cream font-serif text-right mb-12 leading-relaxed" dir="rtl">{s.arabic}</p>
            <div className="space-y-6">
              <p className="text-2xl font-serif italic text-gold">{s.transliteration}</p>
              <p className="text-3xl font-serif text-cream/90 font-light">{s.translation}</p>
              <div className="h-px w-20 bg-gold/20 my-8" />
              <p className="text-lg text-slate-400 font-serif leading-relaxed italic">{s.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-12 rounded-[3rem] bg-emerald-500/10 border border-emerald-500/20 text-center">
        <Heart className="text-emerald-400 mx-auto mb-8 animate-pulse" size={48} />
        <h3 className="text-3xl font-serif font-bold text-cream mb-6">Welcome to the Family of Faith</h3>
        <p className="text-xl text-slate-400 font-serif italic leading-relaxed">
          If you have uttered these words with sincerity, your slate is clean, and your journey of light has begun.
        </p>
      </div>
    </div>
  );
};

interface YouTubeVideo {
  id: string;
  title: string;
  category: "Dawah" | "Prophet Stories" | "Islamic Education" | "Biographies";
  channelName: string;
  channelAvatar: string;
  description: string;
  duration: string;
  views: string;
}

const VERIFIED_VIDEOS: YouTubeVideo[] = [
  {
    id: "gPluN_2pDxs",
    title: "Angels in Your Presence: The Divine Protection",
    category: "Dawah",
    channelName: "Yaqeen Institute",
    channelAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    description: "Discover the unseen crowd that surrounds you, guarding and recording your steps by divine decree.",
    duration: "12:45",
    views: "324K"
  },
  {
    id: "rKshsc1ZfT8",
    title: "How to Keep Your Faith Strong in Times of Trial",
    category: "Dawah",
    channelName: "Yaqeen Institute",
    channelAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    description: "Practical Islamic guidance on dealing with modern doubts, anxieties, and maintaining strong conviction.",
    duration: "15:20",
    views: "189K"
  },
  {
    id: "qRE8q5XW36E",
    title: "The Father of Prophets: Ibrahim's Test of Fire",
    category: "Prophet Stories",
    channelName: "FreeQuranEducation",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    description: "An incredibly detailed and beautifully animated narrative of Prophet Ibrahim (AS) confronting Nimrod and the idols.",
    duration: "18:10",
    views: "1.2M"
  },
  {
    id: "7-bO4pX_9O8",
    title: "Al-Yusuf: From the Dark Well to the Egyptian Throne",
    category: "Prophet Stories",
    channelName: "FreeQuranEducation",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    description: "Step into the most magnificent story narrated in the Quran—filled with betrayal, resilience, and ultimate triumph.",
    duration: "24:35",
    views: "2.5M"
  },
  {
    id: "p2LgL3_6FpI",
    title: "Symmetry & Design: Ustadh Nouman Ali Khan on Quranic Miracles",
    category: "Islamic Education",
    channelName: "Bayyinah TV",
    channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    description: "Unlock the ring-composition structure that runs through the core of Islamic scriptures with Nouman Ali Khan.",
    duration: "32:15",
    views: "890K"
  },
  {
    id: "hG0n26_7Ssc",
    title: "Finding Light in Darkness: Reflections on Surah Ad-Duha",
    category: "Islamic Education",
    channelName: "Bayyinah TV",
    channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    description: "A profound breakdown of hope, consolation, and the emotional support Allah provided to the Prophet (PBUH).",
    duration: "14:10",
    views: "420K"
  },
  {
    id: "bT8Cg6E_9u8",
    title: "Bilal of Abyssinia: Voice of the Call to Prayer",
    category: "Biographies",
    channelName: "OnePath Network",
    channelAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
    description: "A cinematic history of Bilal Ibn Rabah—reminding us of equality, extreme steadfastness, and his heavenly calling.",
    duration: "21:05",
    views: "540K"
  },
  {
    id: "p3NMrM_O9fM",
    title: "Silk Road Missionaries: How Islam Entered the Far East",
    category: "Biographies",
    channelName: "OnePath Network",
    channelAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
    description: "How early Sahabas and merchants took the noble path over mountains and seas, carrying the message of Tawhid.",
    duration: "16:40",
    views: "210K"
  },
  {
    id: "9Y91I04XFm0",
    title: "The Problem of Suffering: Islamic Philosophical Perspective",
    category: "Islamic Education",
    channelName: "Yaqeen Institute",
    channelAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    description: "Why does an All-Merciful God allow hardships? Dr. Suleiman Hani breaks down the theology of tribulations.",
    duration: "19:50",
    views: "290K"
  },
  {
    id: "b4p7X-u8E6Y",
    title: "The Legacy of Salahuddin Al-Ayyubi",
    category: "Biographies",
    channelName: "OnePath Network",
    channelAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
    description: "Exploring the legendary character, chivalry, and historical impact of Salahuddin during the Crusades.",
    duration: "28:50",
    views: "850K"
  }
];

export const Explore = () => {
  const { language, t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'wisdom' | 'righteous' | 'map' | 'names' | 'journal' | 'dawah' | 'sadaqah' | 'videos' | 'roadmap' | 'science' | 'charity' | 'shadow' | 'shadow' | 'shahada' | 'tarteel' | 'chronicles'>('roadmap');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [roadmapStep, setRoadmapStep] = useState(1);
  const [showMiracle, setShowMiracle] = useState(false);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [chroniclesCount, setChroniclesCount] = useState(3);

  // Video feed states of premium dynamic view
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<"All" | "Dawah" | "Prophet Stories" | "Islamic Education" | "Biographies">("All");
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(() => {
    try {
      const persisted = localStorage.getItem('nooraya_saved_videos');
      return persisted ? JSON.parse(persisted) : [];
    } catch {
      return [];
    }
  });

  const toggleSaveVideo = (videoId: string) => {
    setSavedVideoIds(prev => {
      const updated = prev.includes(videoId) 
        ? prev.filter(id => id !== videoId) 
        : [...prev, videoId];
      try {
        localStorage.setItem('nooraya_saved_videos', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      if (updated.includes(videoId)) {
        toast.success("Saved to your Spiritual Library");
      } else {
        toast.success("Removed from Spiritual Library");
      }
      return updated;
    });
  };

  const handleShareVideo = (videoId: string, title: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success(`Copied share link for: "${title}"`);
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const filteredVideos = useMemo(() => {
    if (selectedVideoCategory === "All") return VERIFIED_VIDEOS;
    return VERIFIED_VIDEOS.filter(video => video.category === selectedVideoCategory);
  }, [selectedVideoCategory]);

  const { isPlaying, togglePlay, duck, unduck, isMuted, setActiveSurah } = useAudio();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  useEffect(() => {
    const articleId = searchParams.get('article');
    if (articleId) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        setActiveSurah(articleId);
        setSelectedArticle(article);
      }
    }
  }, [searchParams, articles, setActiveSurah]);

  useEffect(() => {
    // When returning to home page from an article, play a random beautiful surah
    if (selectedArticle === null) {
      const homeSurahs = [1, 18, 19, 20, 55, 67]; // Beautiful surahs for home atmosphere
      const randomSurah = homeSurahs[Math.floor(Math.random() * homeSurahs.length)];
      setActiveSurah(randomSurah);
    }
  }, [selectedArticle, setActiveSurah]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetched = await dbService.getArticles();
        // Merge fetched articles with INITIAL_ARTICLES, prioritizing local ones for updates
        const mergedMap = new Map();
        INITIAL_ARTICLES.forEach(a => mergedMap.set(a.id, a));
        if (fetched && fetched.length > 0) {
          fetched.forEach(a => {
            if (!mergedMap.has(a.id)) {
              mergedMap.set(a.id, a);
            }
          });
          setArticles(Array.from(mergedMap.values()));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleSyncContent = async () => {
    try {
      await dbService.seedArticles(INITIAL_ARTICLES);
      const fetched = await dbService.getArticles();
      if (fetched) setArticles(fetched);
      toast.success("Divine Content Synchronized");
    } catch (err) {
      toast.error("Sync failed");
    }
  };

  const roadmapSteps = [
    { day: 1, title: 'The First Light', description: 'The weight of the Heavens descending upon a mortal heart in the Cave of Hira.', articleId: 'roadmap-day-1', icon: Sun },
    { day: 2, title: 'Iron Under Fire', description: 'The unwavering iman of Bilal under the scorching sun of Mecca.', articleId: 'roadmap-day-2', icon: Shield },
    { day: 3, title: 'The Night Journey', description: 'A journey beyond space and time, from Jerusalem to the Divine Presence.', articleId: 'roadmap-day-3', icon: Moon },
    { day: 4, title: 'The Great Escape', description: 'The migration through the Cave of Thawr and the blinding of the assassins.', articleId: 'roadmap-day-4', icon: Footprints },
    { day: 5, title: 'Unbroken Ranks', description: 'The miraculous victory at the wells of Badr against overwhelming odds.', articleId: 'roadmap-day-5', icon: Sword },
    { day: 6, title: 'The Ultimate Stand', description: 'The testing of obedience and the human shields of Uhud.', articleId: 'roadmap-day-6', icon: Sparkles },
    { day: 7, title: 'The Triumph of Mercy', description: 'The return to Mecca and the victory of forgiveness over revenge.', articleId: 'roadmap-day-7', icon: Heart },
  ];

  const handleRoadmapClick = (step: any) => {
    const article = articles.find(a => a.id === step.articleId);
    if (article) {
      setActiveSurah(article.id);
      setSelectedArticle(article);
      setRoadmapStep(step.day);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'prophet' | 'companion' | 'science'>('all');
  const [isNightMode, setIsNightMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);
  const { profile } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('nooraya_explore_welcome');
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setShowWelcome(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('nooraya_explore_welcome', 'true');
    // Automagically start the sanctuary atmosphere
    if (!isPlaying) {
      setActiveSurah(1); // Default to Fatihah
      togglePlay();
    }
  };

  const emotionsMap: Record<string, string[]> = {
    'Anxiety': ['prophet-ayub-patience', 'prophet-zakariyah-hope', 'mother-of-musa'],
    'Loneliness': ['maryam-devotion', 'prophet-ayub-patience'],
    'Fear': ['asiya-unwavering-faith', 'prophet-zakariyah-hope', 'mother-of-musa', 'people-of-the-ditch', 'umar-ibn-al-khattab'],
    'Injustice': ['asiya-unwavering-faith', 'prophet-musa-liberation', 'dhul-qarnayn', 'umar-ibn-al-khattab'],
    'Debt': ['prophet-zakariyah-hope', 'abu-dahdah'],
    'Hope': ['prophet-zakariyah-hope', 'maryam-devotion', 'prophet-isa-mercy', 'prophet-muhammad-final', 'queen-of-sheba', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan'],
    'Guidance': ['prophet-muhammad-final', 'prophet-musa-liberation', 'people-of-cave', 'queen-of-sheba', 'aisha-bint-abu-bakr', 'umar-ibn-al-khattab', 'uthman-ibn-affan'],
    'Motivation': ['people-of-the-ditch', 'man-of-yasin', 'dhul-qarnayn', 'abu-bakr-al-siddiq', 'salman-al-farsi', 'umar-ibn-al-khattab', 'uthman-ibn-affan'],
    'Sadness': ['mother-of-musa', 'prophet-ayub-patience', 'aisha-bint-abu-bakr'],
    'Money': ['man-of-two-gardens', 'abu-dahdah', 'khadija-bint-khuwaylid'],
    'Family': ['mother-of-musa', 'luqman-wisdom', 'khadija-bint-khuwaylid']
  };

  const filteredArticles = articles.filter((article, index, self) => {
    // Ensure uniqueness by ID in case of data duplication
    if (self.findIndex(a => a.id === article.id) !== index) return false;

    // Apply category filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'companion') {
        if (article.type !== 'companion' && article.type !== 'righteous') return false;
      } else if (article.type !== activeFilter) {
        return false;
      }
    }

    const searchLower = searchQuery.toLowerCase();
    if (!searchLower) return true;

    const matchesSearch = article.title.toLowerCase().includes(searchLower) || 
                         article.summary.toLowerCase().includes(searchLower) ||
                         article.theme.toLowerCase().includes(searchLower) ||
                         article.prophet.toLowerCase().includes(searchLower) ||
                         article.type.toLowerCase().includes(searchLower) ||
                         (article.id.toLowerCase().includes(searchLower)) ||
                         (article.keywords?.some(k => k.toLowerCase().includes(searchLower))) ||
                         (article.trial && article.trial.toLowerCase().includes(searchLower)) ||
                         (article.characterTrait && article.characterTrait.toLowerCase().includes(searchLower)) ||
                         (article.modernLesson && article.modernLesson.toLowerCase().includes(searchLower));
    
    const matchedEmotions = Object.entries(emotionsMap)
      .filter(([emotion]) => emotion.toLowerCase().includes(searchLower))
      .map(([_, ids]) => ids)
      .flat();

    return matchesSearch || matchedEmotions.includes(article.id);
  });

  const storyOfTheDay = useMemo(() => {
    const righteous = articles.filter(a => a.type === 'righteous' || a.type === 'companion');
    if (righteous.length === 0) return null;
    const seed = new Date().toDateString(); // Same seed for the same day
    const index = Math.abs(seed.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)) % righteous.length;
    return righteous[index];
  }, [articles]);

  const prophets = filteredArticles.filter(a => a.type === 'prophet');
  const righteousArticles = filteredArticles.filter(a => a.type === 'companion' || a.type === 'righteous');
  const scienceArticles = filteredArticles.filter(a => a.type === 'science');

  const topics = ['Seerah', 'Tafsir', 'Fiqh', 'History', 'Motivation', 'Dua', 'Prophets'];

  useEffect(() => {
    if (selectedArticle) {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
      }
      setReadingProgress(0);
    }
  }, [selectedArticle]);

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const total = scrollHeight - clientHeight;
        const progress = (scrollTop / total) * 100;
        setReadingProgress(progress);

        // Auto-load chronicles when reaching near bottom
        if (activeTab === 'righteous' && scrollTop + clientHeight > scrollHeight - 300) {
          if (chroniclesCount < righteousArticles.length) {
            setChroniclesCount(prev => prev + 3);
          }
        }

        // Focus Mode logic
        if (scrollTop > 200) {
          setIsFocusMode(true);
        } else {
          setIsFocusMode(false);
        }

        // Scroll direction for UI reveal
        if (scrollTop > lastScrollY.current && scrollTop > 100) {
          setIsScrollingDown(true);
        } else {
          setIsScrollingDown(false);
        }
        lastScrollY.current = scrollTop;

        if (progress > 95 && selectedArticle && !completedArticles.includes(selectedArticle.id)) {
          handleArticleComplete(selectedArticle.id);
        }

        // Dynamic loading for chronicles (if not in article view)
        if (!selectedArticle && activeTab === 'righteous' && progress > 80) {
           setChroniclesCount(prev => Math.min(prev + 1, righteousArticles.length));
        }
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [selectedArticle, completedArticles, activeTab, chroniclesCount, righteousArticles.length]);

  const handleArticleComplete = async (articleIdOrArticle: string | Article) => {
    const isId = typeof articleIdOrArticle === 'string';
    const articleId = isId ? articleIdOrArticle : articleIdOrArticle.id;

    if (profile?.uid) {
      try {
        await dbService.updateProgress(profile.uid, articleId);
        
        // Handle Badge Unlock
        const article = INITIAL_ARTICLES.find(a => a.id === articleId);
        if (article?.badgeUnlock && !completedArticles.includes(articleId)) {
          toast.success(`Badge Unlocked: ${article.badgeUnlock}!`, {
            duration: 5000,
            icon: '🛡️',
            style: {
              borderRadius: '2rem',
              background: '#0a1a1a',
              color: '#d4af37',
              border: '1px solid rgba(212, 175, 55, 0.5)'
            }
          });
          
          if (article.id === 'people-of-cave') {
            setTimeout(() => {
              toast("10% Noor Point bonus activated for Night Hours!", { 
                icon: '🌙',
                duration: 4000,
                style: { borderRadius: '1rem', background: '#0a1a1a', color: '#60a5fa' }
              });
            }, 1000);
          }
        }

        if (!completedArticles.includes(articleId)) {
          setCompletedArticles(prev => [...prev, articleId]);
          toast.success("Lesson Complete! +10 Noor Points", {
            icon: '✨',
            style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
          });
        }
      } catch (err) {
        console.error("Failed to sync progress:", err);
      }
    } else {
      if (!completedArticles.includes(articleId)) {
        setCompletedArticles(prev => [...prev, articleId]);
      }
    }

    if (!isId) {
      setIsLoadingNext(true);
      setTimeout(() => {
        setSelectedArticle(articleIdOrArticle);
        setIsLoadingNext(false);
      }, 1500);
    }
  };

  if (selectedArticle) {
    return (
      <>
        <AnimatePresence>
          {isLoadingNext && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center text-center p-8"
            >
              <div className="relative w-24 h-24 mb-8">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-gold rounded-full"
                />
                <div className="absolute inset-4 bg-gold/10 rounded-full flex items-center justify-center">
                  <Star className="text-gold animate-pulse" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-cream mb-4">Infinite Explore</h3>
              <p className="text-gold/60 font-serif italic max-w-sm">The library is updating with new stories of the Righteous...</p>
            </motion.div>
          )}
        </AnimatePresence>
        <ArticleViewer 
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
          onComplete={handleArticleComplete}
          isNightMode={isNightMode}
          setIsNightMode={setIsNightMode}
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
          isScrollingDown={isScrollingDown}
          readingProgress={readingProgress}
          setReadingProgress={setReadingProgress}
        />
      </>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-16 h-16 border-t-2 border-gold rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 islamic-pattern min-h-screen">
      <header className="mb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            boxShadow: isPlaying && !isMuted 
              ? ["0 0 20px rgba(212,175,55,0.2)", "0 0 40px rgba(212,175,55,0.4)", "0 0 20px rgba(212,175,55,0.2)"] 
              : "0 0 20px rgba(212,175,55,0.2)"
          }}
          transition={{ duration: 2, repeat: isPlaying && !isMuted ? Infinity : 0 }}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 noor-glow border border-gold/20"
        >
          <BookOpen size={14} />
          <span>Noor Encyclopedia</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-8xl font-serif font-bold text-cream mb-8 tracking-tighter leading-none">
          Explore <span className="text-gold italic">Wisdom</span>
        </h1>
        <p className="text-xl text-slate-400 font-serif italic max-w-2xl mx-auto mb-16 opacity-80">
          "We relate to you the best of stories in what We have revealed to you of this Quran."
        </p>

        <div className="relative max-w-2xl mx-auto group">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors",
            isRTL ? "right-6" : "left-6"
          )} size={20} />
          <input 
            type="text" 
            placeholder="Search Prophets, Companions, Science, or Emotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full bg-white/5 border border-white/10 rounded-2xl py-6 pr-6 text-cream placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all font-serif",
              isRTL ? "pl-6 pr-16" : "pl-16 pr-6"
            )}
          />
        </div>

        {profile?.role === 'admin' && (
          <div className="mt-8">
            <button 
              onClick={handleSyncContent}
              className="px-6 py-2 bg-gold/10 text-gold border border-gold/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-slate-950 transition-all flex items-center space-x-2 mx-auto"
            >
              <TrendingUp size={12} />
              <span>Sync Content API</span>
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            { id: 'all', label: 'All Knowledge' },
            { id: 'prophet', label: 'The Prophets' },
            { id: 'companion', label: 'The Companions' },
            { id: 'science', label: 'Soul Science' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border",
                activeFilter === filter.id 
                  ? "bg-gold text-slate-950 border-gold shadow-lg" 
                  : "bg-white/5 text-slate-500 border-white/10 hover:border-gold/30 hover:text-gold"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          { [
            { id: 'roadmap', label: '7-Day Roadmap', icon: TrendingUp },
            { id: 'wisdom', label: 'Prophetic Scroll', icon: BookOpen },
            { id: 'righteous', label: 'Righteous Figures', icon: Heart },
            { id: 'science', label: 'Soul Science', icon: Atom },
            { id: 'charity', label: 'Global Impact', icon: HandHeart },
            { id: 'videos', label: 'Community Feed', icon: Play },
            { id: 'map', label: 'History Map', icon: MapIcon },
            { id: 'names', label: 'Allah\'s Names', icon: Heart },
            { id: 'shahada', label: 'Shahada', icon: Sparkles },
            { id: 'tarteel', label: 'Tarteel AI', icon: Mic },
            { id: 'chronicles', label: 'Chronicles', icon: Shield },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              animate={activeTab === tab.id && isPlaying && !isMuted ? { 
                scale: [1, 1.05, 1],
                boxShadow: ["0 10px 20px rgba(212,175,55,0.1)", "0 10px 30px rgba(212,175,55,0.3)", "0 10px 20px rgba(212,175,55,0.1)"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3 border shadow-lg",
                activeTab === tab.id 
                  ? "bg-gold text-starry-teal-dark border-gold noor-glow" 
                  : "bg-white/5 text-slate-400 border-white/10 hover:border-gold/30 hover:text-gold"
              )}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </header>

      {activeTab === 'wisdom' && (
        <section className="mb-32">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Scrollable List of 25 Prophets */}
            <div className="lg:w-80 lg:sticky lg:top-32 h-fit">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gold/10">
                  <h3 className="text-gold font-black text-[10px] uppercase tracking-[0.3em]">Prophetic Lineage</h3>
                  <span className="text-gold/40 font-serif text-xs italic">25 Lights</span>
                </div>
                <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    {PROPHETS_LIST.map((name, idx) => {
                      const article = articles.find(a => a.prophet.includes(name));
                      return (
                        <button
                          key={name}
                          onClick={() => {
                            if (article) {
                              setActiveSurah(article.id);
                              setSelectedArticle(article);
                            } else {
                              toast("Wisdom for " + name + " (AS) is currently being scribed in the celestial library. Stay tuned!", {
                                icon: '🖋️',
                                style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
                              });
                            }
                          }}
                          className="w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group/p hover:bg-gold/10"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] font-black font-serif text-gold/20 group-hover/p:text-gold transition-colors">{idx + 1}.</span>
                            <span className="text-xs font-bold transition-colors text-slate-400 group-hover/p:text-cream">
                              {name} (AS)
                            </span>
                          </div>
                          <ArrowRight size={12} className={cn("text-gold transition-all -translate-x-2", article ? "opacity-100 translate-x-0" : "opacity-0 group-hover/p:opacity-50")} />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12">
              {prophets.map((article) => (
                <CinematicStoryCard 
                  key={article.id} 
                  article={article} 
                  completedArticles={completedArticles} 
                  setSelectedArticle={setSelectedArticle}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'righteous' && (
        <section className="mb-32">
          {storyOfTheDay && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-24 max-w-6xl mx-auto"
            >
              <div className="relative group cursor-pointer overflow-hidden rounded-[4rem] border border-gold/30 bg-slate-900/50 aspect-[21/9]"
                  onClick={() => {
                    setActiveSurah(storyOfTheDay.id);
                    setSelectedArticle(storyOfTheDay);
                  }}>
                <div className="absolute inset-0 z-0 scale-110 group-hover:scale-100 transition-transform duration-[3s]">
                  <img 
                    src={storyOfTheDay.storylineBackgrounds?.[0] || 'https://images.unsplash.com/photo-1544413647-ad34c9c05877'} 
                    className="w-full h-full object-cover grayscale-[0.2] brightness-[0.4]"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>
                
                <div className="relative z-10 p-12 md:p-24 flex flex-col justify-end h-full">
                  <div className="mb-8 flex items-center space-x-4">
                    <div className="h-[2px] w-12 bg-gold/40" />
                    <span className="text-gold font-black text-[12px] uppercase tracking-[0.6em]">Epic of the Day</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-8xl font-serif font-bold text-cream mb-10 leading-none max-w-5xl tracking-tighter drop-shadow-2xl">
                    {storyOfTheDay.title}
                  </h2>
                  
                  <div className="flex items-center space-x-12">
                    <p className="text-xl md:text-3xl font-serif italic text-slate-300 max-w-2xl leading-relaxed opacity-80">
                      "{storyOfTheDay.summary}"
                    </p>
                    <button className="shrink-0 w-24 h-24 rounded-full bg-gold text-slate-950 flex items-center justify-center noor-glow hover:scale-110 transition-all border-8 border-slate-950/20">
                      <Play size={32} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {righteousArticles.slice(0, chroniclesCount).map((article) => (
              <CinematicStoryCard 
                key={article.id} 
                article={article} 
                completedArticles={completedArticles} 
                setSelectedArticle={setSelectedArticle}
              />
            ))}
          </div>
          {chroniclesCount < righteousArticles.length && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => setChroniclesCount(prev => prev + 3)}
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-gold font-black uppercase tracking-widest text-[10px] hover:bg-gold/10 transition-all"
              >
                Unveil More Chronicles
              </button>
            </div>
          )}
        </section>
      )}

      {activeTab === 'science' && (
        <section className="py-12">
          <SoulScience />
        </section>
      )}

      {activeTab === 'charity' && (
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold text-cream mb-4 tracking-tight">The <span className="text-gold italic">Global Ummah</span> Impact</h2>
            <p className="text-slate-400 font-serif italic text-lg">Live feed of Zakat and Sadaqah bringing light to the world.</p>
          </div>
          <CommunitySadaqahTracker />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="glass-card p-10 border-emerald-500/20">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <HandHeart size={24} />
                </div>
                <h4 className="text-xl font-serif font-bold text-cream mb-2">Water Wells Digging</h4>
                <p className="text-slate-400 text-sm italic font-serif">4 fresh wells opened today in Mali under the Ummah initiative.</p>
             </div>
             <div className="glass-card p-10 border-gold/20">
                <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center mb-6">
                  <Award size={24} />
                </div>
                <h4 className="text-xl font-serif font-bold text-cream mb-2">Orphan Sponsorship</h4>
                <p className="text-slate-400 text-sm italic font-serif">120 orphans recieved education kits in Gaza this morning.</p>
             </div>
             <div className="glass-card p-10 border-indigo-500/20">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                  <Flame size={24} />
                </div>
                <h4 className="text-xl font-serif font-bold text-cream mb-2">Emergency Relief</h4>
                <p className="text-slate-400 text-sm italic font-serif">Rapid response teams deployed to flood zones in Indonesia.</p>
             </div>
          </div>
        </section>
      )}

      {activeTab === 'roadmap' && (
        <section className="mb-32">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmapSteps.map((step) => {
              const article = articles.find(a => a.id === step.articleId);
              return (
                <div 
                  key={step.day}
                  onClick={() => handleRoadmapClick(step)}
                  className={cn(
                    "glass-card p-10 group cursor-pointer transition-all hover:scale-105",
                    roadmapStep === step.day ? "border-gold/30 bg-gold/5" : ""
                  )}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-slate-950 transition-all duration-500">
                      <step.icon size={32} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Day 0{step.day}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-cream mb-4">{step.title}</h3>
                  <p className="text-slate-500 italic font-serif text-sm mb-8 leading-relaxed">{step.description}</p>
                  
                  <div className="flex items-center space-x-3 text-gold">
                    <span className="text-[10px] font-black uppercase tracking-widest">Continue Path</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'videos' && (
        <section className="mb-32">
          {/* Header section with description */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase font-bold">
                Spiritual Knowledge Base
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-cream tracking-tight max-w-2xl mx-auto">
              Verified Islamic Media Feed
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto font-serif italic">
              A carefully curated aggregation of high-fidelity, verified spiritual insights, historical narratives, and Quranic teachings from trusted sources.
            </p>

            {/* Category Pill Selectors */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 max-w-4xl mx-auto">
              {(["All", "Dawah", "Prophet Stories", "Islamic Education", "Biographies"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedVideoCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full border text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-md",
                    selectedVideoCategory === cat
                      ? "bg-[#D4AF37] border-[#D4AF37] text-slate-950 font-black shadow-[0_4px_20px_rgba(212,175,55,0.25)] scale-105"
                      : "bg-[#121214]/55 backdrop-blur-md border-white/5 text-slate-400 hover:text-white hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
                  )}
                >
                  {cat === "All" ? "📖 All Content" : cat === "Dawah" ? "🕊️ Dawah" : cat === "Prophet Stories" ? "✨ Prophet Stories" : cat === "Islamic Education" ? "🎓 Islamic Education" : "📜 Biographies"}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => {
              const isSaved = savedVideoIds.includes(video.id);
              return (
                <div 
                  key={video.id} 
                  className="bg-[#121214]/85 backdrop-blur-3xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-2xl flex flex-col justify-between group min-h-[460px]"
                >
                  {/* Native YouTube Video Iframe Container Block */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-white/5 select-none">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0"
                      src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Body details & Meta-Info Footer */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3 shrink-0">
                      {/* Category Label badge & Meta tags */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15 rounded-md text-[8px] font-mono tracking-widest uppercase font-extrabold">
                          {video.category}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[9px]">
                          <span>{video.duration} mins</span>
                          <span>•</span>
                          <span>{video.views} views</span>
                        </div>
                      </div>

                      {/* Video Title */}
                      <h4 className="text-base sm:text-lg font-serif font-black text-cream leading-snug group-hover:text-[#F4EFCB] transition-colors line-clamp-2">
                        {video.title}
                      </h4>

                      {/* Video Short Description */}
                      <p className="text-slate-400 text-xs font-serif italic line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    {/* Verified Channel Info & Interaction micro-buttons */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                      {/* Avatar + Channel Title */}
                      <div className="flex items-center gap-3">
                        <img 
                          src={video.channelAvatar} 
                          alt={video.channelName} 
                          className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/25 shrink-0"
                        />
                        <div className="text-left leading-none">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-serif font-extrabold text-[#F4EFCB]">
                              {video.channelName}
                            </span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gold/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]" title="Verified Channel">
                              <CheckCircle2 size={9} className="stroke-[3]" />
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-1 block">
                            OFFICIAL ACADEMY
                          </span>
                        </div>
                      </div>

                      {/* Micro interaction buttons: Share and Save to Library */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => handleShareVideo(video.id, video.title)}
                          className="p-2.5 bg-white/5 hover:bg-[#D4AF37]/15 border border-white/10 hover:border-[#D4AF37]/35 rounded-xl text-slate-400 hover:text-[#D4AF37] transition-all cursor-pointer flex items-center justify-center"
                          title="Share Link"
                        >
                          <Share2 size={13} className="stroke-[2.5]" />
                        </button>
                        <button
                          onClick={() => toggleSaveVideo(video.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-xl border font-mono text-[10px] font-black tracking-wider transition-all cursor-pointer",
                            isSaved
                              ? "bg-[#D4AF37] border-[#D4AF37] text-slate-950 font-bold active:scale-95"
                              : "bg-white/5 hover:bg-[#D4AF37]/10 border-white/10 hover:border-[#D4AF37]/30 text-slate-300 hover:text-white"
                          )}
                          title={isSaved ? "Saved to Library" : "Save to Library"}
                        >
                          <Bookmark size={12} className={cn(isSaved ? "fill-current stroke-[2.5]" : "stroke-[2.5]")} />
                          <span>{isSaved ? "Saved" : "Save"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'map' && (
        <section className="py-12">
          <IslamicMap onReadHistory={(articleId) => {
            const article = articles.find(a => a.id === articleId);
            if (article) {
              setActiveSurah(articleId);
              setSelectedArticle(article);
            }
          }} />
        </section>
      )}

      {activeTab === 'names' && (
        <section className="py-12">
          <NamesOfAllah />
        </section>
      )}

      {activeTab === 'shahada' && (
        <section className="py-12">
          <ShahadaPortal />
        </section>
      )}

      {activeTab === 'tarteel' && (
        <section className="py-12">
          <ErrorBoundary
            title="Tarteel AI hit a snag"
            message="Your Explore page is fine - just this recitation session needs a restart."
          >
            <QuranPractice />
          </ErrorBoundary>
        </section>
      )}

      {activeTab === 'chronicles' && (
        <section className="py-12">
          <ChroniclesEngine 
            articles={articles} 
            onSelectArticle={(article) => {
              setActiveSurah(article.id);
              setSelectedArticle(article);
            }} 
          />
        </section>
      )}

      {/* Support Section */}
      <section className="mb-20">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-card p-16 md:p-24 bg-gradient-to-br from-emerald-500/10 via-starry-teal-dark to-starry-teal-dark border-emerald-500/20 text-center relative overflow-hidden rounded-[4rem]"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/5 rounded-full blur-[120px]" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center text-emerald-400 mx-auto mb-10 shadow-2xl border border-emerald-500/20 noor-glow-sm">
              <Heart size={40} />
            </div>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-cream mb-8 tracking-tight">Weathering Your Own Storm?</h3>
            <p className="text-slate-400 text-xl md:text-2xl font-serif italic mb-14 leading-relaxed opacity-80">
              "The trials of the Prophets were meant to be beacons for your darkest nights. If you are struggling, let Noor AI reflect on your path with you."
            </p>
            <button 
              onClick={() => navigate('/noor')}
              className="bg-emerald-500 text-starry-teal-dark px-16 py-7 rounded-full font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_50px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center space-x-4 mx-auto noor-glow"
            >
              <MessageSquare size={18} />
              <span>Talk to Noor AI</span>
            </button>
          </div>
        </motion.div>
      </section>
      
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl"
          >
            {/* Animated Portal Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[800px] h-[800px] bg-gradient-to-r from-gold/20 via-transparent to-emerald-500/20 rounded-full blur-[100px]"
            />

            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="max-w-xl w-full glass-card p-10 md:p-16 text-center relative overflow-hidden border-gold/30 shadow-[0_0_100px_rgba(212,175,55,0.1)] rounded-[3rem]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              
              <div className="relative z-10">
                <motion.div 
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="w-20 h-20 bg-gold/10 rounded-[2rem] flex items-center justify-center text-gold mx-auto mb-10 border border-gold/20 shadow-2xl"
                >
                  <Sparkles size={40} className="animate-pulse" />
                </motion.div>
                
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-cream mb-8 leading-tight tracking-tight">
                  Your Sanctuary <br/><span className="text-gold italic font-medium">Awaits</span>.
                </h2>
                
                <div className="space-y-8 text-slate-400 font-serif text-xl leading-relaxed italic mb-14">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    "Welcome to Nooraya. As you step into the 'Explore' section, let the rhythm of the Quran guide your heart."
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-gold font-medium tracking-widest text-sm uppercase not-italic"
                  >
                    Listen • Read • Reflect
                  </motion.p>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeWelcome}
                  className="group relative w-full bg-gold text-slate-950 py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] noor-glow overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">Enter the Light</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};