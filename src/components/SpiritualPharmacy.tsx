import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CloudRain, Sun, Compass, Sparkles, X, BookOpen, Quote, Search, CheckCircle2, Zap, CloudLightning, ShieldAlert, Coffee, HelpCircle, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

const MOODS = [
  { 
    id: 'anxious', 
    label: 'Anxious', 
    synonyms: ['stressed', 'worried', 'nervous', 'scared'],
    icon: CloudRain, 
    color: 'blue',
    verse: "Verily, in the remembrance of Allah do hearts find rest.",
    citation: "Surah Ar-Ra'd 13:28",
    dua: "O Allah, I seek refuge in You from anxiety and grief.",
    task: "Perform 2 units of Salatul Hajah and slow your breathing for 5 minutes.",
    storyId: 'prophet-ayub-patience'
  },
  { 
    id: 'lonely', 
    label: 'Lonely', 
    synonyms: ['isolated', 'forgotten', 'alone'],
    icon: Heart, 
    color: 'emerald',
    verse: "And He is with you wherever you are.",
    citation: "Surah Al-Hadid 57:4",
    dua: "O Allah, grant me the comfort of Your presence in my solitude.",
    task: "Visit a local masjid or call a fellow seeker you haven't spoken to in a while.",
    storyId: 'prophet-yunus-whale'
  },
  { 
    id: 'heartbroken', 
    label: 'Heartbroken', 
    synonyms: ['sad', 'grief', 'pain'],
    icon: Heart, 
    color: 'rose',
    verse: "Indeed, what is to come will be better for you than what has gone by.",
    citation: "Surah Ad-Duha 93:4",
    dua: "O Turner of Hearts, keep my heart firm upon Your path.",
    task: "Write down 3 things you are grateful for despite your pain.",
    storyId: 'prophet-yusuf-dreamer'
  },
  { 
    id: 'stressed', 
    label: 'Stressed', 
    synonyms: ['burdened', 'overwhelmed', 'tired'],
    icon: Zap, 
    color: 'blue',
    verse: "Allah does not burden a soul beyond that it can bear.",
    citation: "Surah Al-Baqarah 2:286",
    dua: "O Allah, make for me a way out from every difficulty.",
    task: "Recite Surah Ash-Sharh (Chapter 94) out loud three times.",
    storyId: 'prophet-musa-liberation'
  },
  { 
    id: 'waiting', 
    label: 'Waiting', 
    synonyms: ['impatient', 'expecting', 'hoping'],
    icon: Compass, 
    color: 'amber',
    verse: "And your Lord is going to give you, and you will be satisfied.",
    citation: "Surah Ad-Duha 93:5",
    dua: "O Allah, grant me patience and settle my affairs in the best way.",
    task: "Give a small secret charity to unlock the doors of your Dua.",
    storyId: 'prophet-zakariyah-hope'
  },
  { 
    id: 'grateful', 
    label: 'Grateful', 
    synonyms: ['happy', 'blessed', 'content'],
    icon: Sun, 
    color: 'amber',
    verse: "If you are grateful, I will surely increase you.",
    citation: "Surah Ibrahim 14:7",
    dua: "All praise is to Allah, who has guided us to this.",
    task: "List 5 blessings you often take for granted and say Alhamdulillah for each.",
    storyId: 'prophet-muhammad-final'
  },
  { 
    id: 'guilty', 
    label: 'Guilty', 
    synonyms: ['remorseful', 'regret', 'sinful'],
    icon: ShieldAlert, 
    color: 'rose',
    verse: "Say, 'O My servants who have transgressed against themselves... despair not of the mercy of Allah.'",
    citation: "Surah Az-Zumar 39:53",
    dua: "O Allah, You are the Forgiver, You love to forgive, so forgive me.",
    task: "Perform 2 units of Salatul Tawbah and resolve to start fresh from this moment.",
    storyId: 'prophet-adam-beginning'
  },
  { 
    id: 'angry', 
    label: 'Angry', 
    synonyms: ['frustrated', 'furious', 'annoyed'],
    icon: CloudLightning, 
    color: 'rose',
    verse: "Who restrain anger and who pardon the people - and Allah loves the doers of good.",
    citation: "Surah Ali 'Imran 3:134",
    dua: "O Allah, remove the anger from my heart.",
    task: "Perform Wudu with cold water and sit down if you are standing.",
    storyId: 'prophet-musa-liberation'
  },
  { 
    id: 'exhausted', 
    label: 'Exhausted', 
    synonyms: ['weak', 'burned out', 'powerless'],
    icon: Coffee, 
    color: 'blue',
    verse: "Allah intends for you ease and does not intend for you hardship.",
    citation: "Surah Al-Baqarah 2:185",
    dua: "O Allah, I seek Your strength in my weakness.",
    task: "Rest your mind from screens for 20 minutes and listen to Surah Maryam.",
    storyId: 'prophet-ayub-patience'
  },
  { 
    id: 'curious', 
    label: 'Curious', 
    synonyms: ['doubting', 'seeking', 'questioning'],
    icon: HelpCircle, 
    color: 'emerald',
    verse: "And he said, 'My Lord, show me how You give life to the dead.'",
    citation: "Surah Al-Baqarah 2:260",
    dua: "O Allah, increase me in knowledge and certainty.",
    task: "Observe the creation—the sky, the rain, or a leaf—and ponder the Designer.",
    storyId: 'prophet-ibrahim-conviction'
  }
];

export const SpiritualPharmacy = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMoods = useMemo(() => {
    if (!searchQuery.trim()) return MOODS;
    const query = searchQuery.toLowerCase();
    return MOODS.filter(m => 
      m.label.toLowerCase().includes(query) || 
      m.synonyms.some(s => s.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleImBetter = async () => {
    if (!user) {
      toast.error('Please sign in to earn Noor Points');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        noorPoints: increment(5),
        updatedAt: serverTimestamp()
      });
      toast.success('+5 Noor Points! Alhamdulillah.', {
        icon: '✨',
        style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
      });
      setSelectedMood(null);
    } catch (error) {
      console.error('Error updating points:', error);
      toast.error('Failed to update points');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="text-gold" size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">Spiritual Pharmacy</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-cream mb-6">How is your heart today?</h2>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search emotion (e.g. stressed, lonely, guilt...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-cream placeholder:text-slate-500 focus:outline-none focus:border-gold/50 transition-all font-serif"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <AnimatePresence>
          {filteredMoods.map((mood) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood)}
              className={cn(
                "glass-card p-6 flex flex-col items-center justify-center space-y-4 border-white/5 transition-all text-center",
                mood.color === 'blue' && "hover:border-blue-500/30 group",
                mood.color === 'rose' && "hover:border-rose-500/30 group",
                mood.color === 'amber' && "hover:border-amber-500/30 group",
                mood.color === 'emerald' && "hover:border-emerald-500/30 group"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                mood.color === 'blue' && "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white",
                mood.color === 'rose' && "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white",
                mood.color === 'amber' && "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
                mood.color === 'emerald' && "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
              )}>
                <mood.icon size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-cream">
                {mood.label}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filteredMoods.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-500 font-serif italic">Your journey is unique, but the healing is Universal. Try a different word.</p>
        </div>
      )}

      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 relative z-[60]"
          >
            <div className="glass-card p-8 border-gold/20 overflow-hidden relative sm:p-12 shadow-2xl">
               <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-br", 
                 selectedMood.color === 'blue' ? "from-blue-500" : 
                 selectedMood.color === 'rose' ? "from-rose-500" :
                 selectedMood.color === 'amber' ? "from-amber-500" : "from-emerald-500"
               )} />
               
               <button 
                 onClick={() => setSelectedMood(null)}
                 className="absolute top-4 right-4 p-2 text-slate-500 hover:text-gold transition-colors z-10"
               >
                 <X size={18} />
               </button>

                <div className="relative z-10 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gold/60">
                      <Sparkles size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Divine Remedy</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-cream leading-tight italic">
                      "{selectedMood.verse}"
                    </p>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-gold/60">
                      {selectedMood.citation}
                    </span>
                  </div>

                  <div className="h-px w-full bg-white/5" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gold/60">
                            <Heart size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Healing Dua</span>
                          </div>
                          <button className="p-2 rounded-full bg-gold/10 text-gold hover:bg-gold hover:text-starry-teal-dark transition-all noor-glow-sm">
                            <Play size={12} fill="currentColor" />
                          </button>
                        </div>
                        <p className="text-xl font-serif text-cream/90 leading-relaxed italic">
                          "{selectedMood.dua}"
                        </p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-gold/60">
                          <Compass size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Spiritual Task</span>
                        </div>
                        <p className="text-lg font-serif text-slate-400 leading-relaxed italic">
                          {selectedMood.task}
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 pt-12">
                    <button 
                     onClick={() => navigate(`/explore?article=${selectedMood.storyId}`)}
                     className="flex items-center justify-center space-x-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-cream border border-white/10 rounded-full transition-all group"
                    >
                      <BookOpen size={18} className="text-gold" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gold/80">Read Full Trial of the Prophet</span>
                    </button>
                    
                    <button 
                      onClick={handleImBetter}
                      className="flex items-center justify-center space-x-3 px-10 py-5 bg-gold text-starry-teal-dark rounded-full transition-all hover:scale-105 active:scale-95 noor-glow"
                    >
                      <CheckCircle2 size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">I feel better, Alhamdulillah</span>
                    </button>

                    <button 
                      onClick={() => setSelectedMood(null)}
                      className="px-8 py-4 text-slate-500 hover:text-rose-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
