import React, { useState, useEffect } from 'react';
import { Play, Youtube, Search, Loader2, ChevronRight, Filter, Video as VideoIcon, RefreshCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchIslamicVideos } from '../services/youtubeService';
import toast from 'react-hot-toast';

interface MediaContent {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  category: string;
  platform: 'youtube' | 'tiktok';
  url: string;
}

const CATEGORIES = ['All', 'Quran Recitation', 'Tafsir', 'Daily Reminders', 'Islamic History', 'Youth', 'Inspiration'];

const MOCK_WISDOM_CONTENT: MediaContent[] = [
  {
    id: 'TFS7i_Y8W_s',
    title: 'Emotional Quran Recitation - Surah Ar-Rahman',
    thumbnail: 'https://img.youtube.com/vi/TFS7i_Y8W_s/hqdefault.jpg',
    channelTitle: 'Mufti Menk',
    category: 'Quran Recitation',
    platform: 'youtube',
    url: 'https://www.youtube.com/embed/TFS7i_Y8W_s'
  },
  {
    id: 'fX7Wp5u5u_g',
    title: 'The Purpose of Life | Powerful Reminder',
    thumbnail: 'https://img.youtube.com/vi/fX7Wp5u5u_g/hqdefault.jpg',
    channelTitle: 'Omar Suleiman',
    category: 'Daily Reminders',
    platform: 'youtube',
    url: 'https://www.youtube.com/embed/fX7Wp5u5u_g'
  },
  {
    id: '9lT6p6W8m_E',
    title: 'History of Muslim Spain - Al Andalus',
    thumbnail: 'https://img.youtube.com/vi/9lT6p6W8m_E/hqdefault.jpg',
    channelTitle: 'Yasir Qadhi',
    category: 'Islamic History',
    platform: 'youtube',
    url: 'https://www.youtube.com/embed/9lT6p6W8m_E'
  },
  {
    id: 'K6577D5fDms',
    title: 'Prophet Yusuf (AS) Story - Full Series',
    thumbnail: 'https://img.youtube.com/vi/K6577D5fDms/hqdefault.jpg',
    channelTitle: 'MercifulServant',
    category: 'Islamic History',
    platform: 'youtube',
    url: 'https://www.youtube.com/embed/K6577D5fDms'
  },
  {
    id: 'v4S76pM8_rM',
    title: 'The Life of Bilal Ibn Rabah',
    thumbnail: 'https://img.youtube.com/vi/v4S76pM8_rM/hqdefault.jpg',
    channelTitle: 'One Message Foundation',
    category: 'Islamic History',
    platform: 'youtube',
    url: 'https://www.youtube.com/embed/v4S76pM8_rM'
  },
  {
    id: '7255146524108885254',
    title: 'How to maintain Consistency in Salah',
    thumbnail: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d97e?q=80&w=640&h=360&auto=format&fit=crop',
    channelTitle: 'Believer Path (Verified)',
    category: 'Youth',
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@scholar/video/7255146524108885254'
  }
];

export const YouTubeLibrary = ({ initialCategory = 'All' }: { initialCategory?: string }) => {
  // Pre-load voices for TTS
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingItem, setPlayingItem] = useState<MediaContent | null>(null);
  const [videos, setVideos] = useState<MediaContent[]>(MOCK_WISDOM_CONTENT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const fetchVideos = async (query: string = 'Islamic reminders shorts') => {
    setLoading(true);
    try {
      const results = await searchIslamicVideos(query, 15);
      if (results.length > 0) {
        const formatted: MediaContent[] = results.map(v => ({
          id: v.id,
          title: v.title,
          thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
          channelTitle: v.channelTitle,
          category: selectedCategory === 'All' ? 'Lecture' : selectedCategory,
          platform: 'youtube',
          url: `https://www.youtube.com/embed/${v.id}`
        }));
        
        // Merge with mock or replace? Let's prepended real ones
        setVideos(prev => {
          const ids = new Set(formatted.map(v => v.id));
          return [...formatted, ...prev.filter(p => !ids.has(p.id))];
        });
      }
    } catch (error: any) {
      console.error('YouTube search error:', error?.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory !== 'All') {
      fetchVideos(`Islamic ${selectedCategory}`);
    } else {
      fetchVideos();
    }
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchVideos(searchQuery);
    }
  };

  const filteredContent = videos.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.channelTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-32">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
            <VideoIcon className="text-islamic-green" size={32} />
            Wisdom Library
          </h2>
          <p className="text-slate-500">Curated lectures and recitations from verified platforms</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-islamic-green transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search global wisdom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-islamic-green outline-none transition-all shadow-sm"
          />
        </form>
      </div>

      {/* Categories Scroller */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 scroll-smooth">
        <button 
          onClick={() => fetchVideos(selectedCategory === 'All' ? 'Islamic' : selectedCategory)}
          disabled={loading}
          className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-islamic-green hover:bg-islamic-green/10 transition-all shrink-0"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
        <Filter className="text-slate-400 shrink-0" size={20} />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat 
                ? 'bg-islamic-green text-white shadow-lg shadow-islamic-green/20' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 group"
            >
              <div className="relative aspect-video">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button 
                    onClick={() => setPlayingItem(item)}
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-islamic-green shadow-2xl scale-90 group-hover:scale-100 transition-all hover:bg-white"
                  >
                    <Play size={32} fill="currentColor" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-islamic-green/90 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                  <span className={`px-3 py-1 text-white text-[10px] font-bold rounded-full backdrop-blur-sm flex items-center gap-1 ${item.platform === 'youtube' ? 'bg-red-600' : 'bg-black'}`}>
                    {item.platform === 'youtube' ? <Youtube size={10} /> : <VideoIcon size={10} />}
                    {item.platform === 'youtube' ? 'YouTube' : 'TikTok'}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-islamic-green transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{item.channelTitle}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Player */}
      <AnimatePresence>
        {playingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setPlayingItem(null)}
          >
            <div 
              className="w-full max-w-5xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setPlayingItem(null)}
                className="absolute top-4 right-4 z-40 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all"
              >
                <X size={24} />
              </button>
              
              {playingItem.platform === 'youtube' ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${playingItem.id}?autoplay=1&mute=0&rel=0&modestbranding=1&origin=${window.location.origin}`}
                  title={playingItem.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.tiktok.com/embed/v2/${playingItem.id}`}
                  title={playingItem.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

