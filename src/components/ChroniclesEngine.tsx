import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Sword, Shield, Map as MapIcon, Star, User, 
  ChevronRight, ArrowRight, Clock, Target, Quote,
  TrendingUp, Compass, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Article } from '../types';
import { useAudio } from '../context/AudioContext';

interface ChroniclesEngineProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const TIMELINE_EVENTS = [
  { year: '570 AD', title: 'The Dawn', description: 'Birth in the Year of the Elephant', id: 'prophet-muhammad-chronicles' },
  { year: '610 AD', title: 'The First Light', description: 'Ghar Hira & The Message', id: 'prophet-muhammad-chronicles' },
  { year: '613 AD', title: 'The Crucible', description: 'The Hardship in Mecca', id: 'islam-dual-path' },
  { year: '622 AD', title: 'The Hijrah', description: 'Migration to Medina', id: 'prophet-muhammad-chronicles' },
  { year: '624 AD', title: 'Badr', description: 'The Day of Criterion', id: 'battle-of-badr' },
  { year: '625 AD', title: 'Uhud', description: 'The Martyrdom of Hamza', id: 'lion-hamza' },
  { year: '627 AD', title: 'The Trench', description: 'The Coalition Defeated', id: 'battle-of-trench' },
  { year: '628 AD', title: 'Khaybar', description: 'The Lion Rips the Gates', id: 'ali-ibn-abi-talib' },
  { year: '629 AD', title: 'Mu\'tah', description: 'The Wings of Ja\'far', id: 'winged-jafar' },
  { year: '629 AD', title: 'Mu\'tah', description: 'The Unbeaten Sword emerges', id: 'commander-khalid' },
  { year: '630 AD', title: 'The Conquest', description: 'Mecca returns to Light', id: 'prophet-muhammad-chronicles' },
  { year: '632 AD', title: 'The Farewell', description: 'Completion of the Message', id: 'prophet-muhammad-chronicles' },
];

export const ChroniclesEngine = ({ articles, onSelectArticle }: ChroniclesEngineProps) => {
  const [activeSection, setActiveSection] = useState<'timeline' | 'war' | 'commanders' | 'miracles'>('timeline');
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setActiveSurah } = useAudio();

  const historyArticles = articles.filter(a => a.type === 'history');
  const commanders = articles.filter(a => a.type === 'commander');

  const miracles = [
    { title: "The Moon Splitting", desc: "A sign given to the Quraish, where the moon was split into two distinct halves.", icon: "🌙" },
    { title: "Water from Fingers", desc: "During a journey when water was scarce, springs flowed from the Prophet's (ﷺ) fingertips.", icon: "💧" },
    { title: "The Ripped Gate", desc: "Ali (RA) ripped the iron gate of Khaybar from its hinges with his bare hands.", icon: "🛡️" },
    { title: "The Emerald Wings", desc: "Ja'far (RA) was gifted emerald wings in Jannah after losing his arms at Mu'tah.", icon: "🕊️" },
    { title: "The Lion's Bow", desc: "Hamza (RA) whose conversion and bow struck fear into the hearts of oppressors.", icon: "🏹" },
    { title: "Dhul-Fiqar", desc: "The legendary two-pointed sword that broke enemy lines in every battle.", icon: "⚔️" },
    { title: "The Talking Tree", desc: "The trunk of a palm tree that used to be a pulpit wept when a new one was built.", icon: "🌳" },
    { title: "The Isra & Mi'raj", desc: "The miraculous night journey from Mecca to Jerusalem and then to the Heavens.", icon: "✨" }
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Engine Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-gold/20">
          <Zap size={14} className="animate-pulse" />
          <span>The Chronicles of Islam Engine</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-cream">The Saga of <span className="text-gold italic">Valour</span></h2>
        
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          {[
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'war', label: 'Art of War', icon: Sword },
            { id: 'commanders', label: 'Commanders', icon: Shield },
            { id: 'miracles', label: 'Miracles', icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all",
                activeSection === tab.id 
                  ? "bg-gold text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                  : "bg-white/5 text-slate-500 hover:text-gold border border-white/10"
              )}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'timeline' && (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Horizontal Timeline Navigation */}
            <div className="relative group">
              <div 
                ref={scrollContainerRef}
                className="flex items-center space-x-12 overflow-x-auto pb-12 pt-8 px-12 custom-scrollbar snap-x no-scrollbar"
              >
                {TIMELINE_EVENTS.map((event, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedEventIndex(idx)}
                    className={cn(
                      "relative flex-shrink-0 w-64 snap-center transition-all duration-500 text-left",
                      selectedEventIndex === idx ? "scale-110" : "opacity-40 grayscale blur-[1px] hover:opacity-100 hover:grayscale-0 hover:blur-0"
                    )}
                  >
                    <div className="mb-4">
                      <span className={cn(
                        "text-2xl font-serif font-bold tracking-tighter",
                        selectedEventIndex === idx ? "text-gold" : "text-white/40"
                      )}>
                        {event.year}
                      </span>
                      <div className={cn(
                        "h-1 w-full mt-2 transition-all duration-700",
                        selectedEventIndex === idx ? "bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" : "bg-white/10"
                      )} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-cream mb-2">{event.title}</h3>
                    <p className="text-xs text-slate-500 italic font-serif">{event.description}</p>
                    
                    {selectedEventIndex === idx && (
                      <motion.div 
                        layoutId="timeline-glow"
                        className="absolute -inset-4 bg-gold/5 rounded-2xl -z-10 blur-xl"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Event Detail View */}
            <div className="max-w-4xl mx-auto">
              <motion.div 
                key={selectedEventIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-12 md:p-20 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                   <Clock size={300} />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                    <span className="text-gold font-black text-[10px] uppercase tracking-[0.4em]">{TIMELINE_EVENTS[selectedEventIndex].year}</span>
                    <h2 className="text-5xl font-serif font-bold text-cream">{TIMELINE_EVENTS[selectedEventIndex].title}</h2>
                    <p className="text-2xl text-slate-400 font-serif italic">{TIMELINE_EVENTS[selectedEventIndex].description}</p>
                  </div>
                  
                  <div className="h-px w-20 bg-gold/30" />
                  
                  <p className="text-lg text-slate-300 leading-relaxed font-serif">
                    The history of Islam is not just dates and names; it is the rhythm of the heart seeking its Creator amidst the chaos of the world.
                  </p>
                  
                  <button 
                    onClick={() => {
                      const article = articles.find(a => a.id === TIMELINE_EVENTS[selectedEventIndex].id);
                      if (article) onSelectArticle(article);
                    }}
                    className="flex items-center space-x-4 bg-gold text-slate-950 px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] noor-glow group-hover:scale-105 transition-all"
                  >
                    <span>Witness the Era</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeSection === 'war' && (
          <motion.div 
            key="war"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {historyArticles.map((article) => (
              <motion.div 
                key={article.id}
                whileHover={{ y: -10 }}
                onClick={() => onSelectArticle(article)}
                className="glass-card p-0 overflow-hidden cursor-pointer group border-gold/10"
              >
                <div className="relative aspect-video">
                  <img 
                    src={article.storylineBackgrounds?.[0]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Tactical Map Icon Overlay */}
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 backdrop-blur-md flex items-center justify-center text-gold border border-gold/30">
                      <MapIcon size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="p-10 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em]">{article.theme}</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-cream group-hover:text-gold transition-colors">{article.title}</h3>
                  <p className="text-slate-500 font-serif italic text-sm line-clamp-2">{article.summary}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       <Clock size={14} />
                       <span>{article.readTime}</span>
                    </div>
                    <div className="text-gold group-hover:translate-x-2 transition-transform">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeSection === 'commanders' && (
          <motion.div 
            key="commanders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {commanders.map((commander) => (
              <motion.div 
                key={commander.id}
                onClick={() => onSelectArticle(commander)}
                className="glass-card p-10 group cursor-pointer border-white/5 hover:border-gold/30 transition-all"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-slate-950 transition-all duration-500">
                    <User size={32} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/40">Commander Profile</span>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-gold text-gold" />)}
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl font-serif font-bold text-cream mb-4">{commander.prophet}</h3>
                <p className="text-slate-500 font-serif italic text-sm mb-10 leading-relaxed">{commander.summary}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Greatest Feat</span>
                      <p className="text-xs text-gold font-bold">{commander.stats?.greatestBattle || commander.stats?.greatestFeat}</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Signature</span>
                      <p className="text-xs text-gold font-bold">{commander.stats?.signatureWeapon}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between text-gold">
                   <div className="flex items-center space-x-2">
                     <Quote size={14} className="opacity-40" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Legendary Quote</span>
                   </div>
                   <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {activeSection === 'miracles' && (
          <motion.div 
            key="miracles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {miracles.map((miracle, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="glass-card p-10 group border-white/5 hover:border-gold/30 transition-all bg-gradient-to-br from-gold/5 to-transparent"
              >
                <div className="text-5xl mb-6">{miracle.icon}</div>
                <h3 className="text-2xl font-serif font-bold text-cream mb-4 group-hover:text-gold transition-colors">{miracle.title}</h3>
                <p className="text-slate-400 font-serif italic text-sm leading-relaxed">{miracle.desc}</p>
                <div className="mt-8 h-1 w-12 bg-gold/20 group-hover:w-24 transition-all duration-700" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric Element */}
      <div className="relative py-24 text-center overflow-hidden rounded-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />
        <p className="text-slate-500 font-serif italic max-w-2xl mx-auto relative z-10">
          "History is a mirror. When you look into it, you see not only where you came from, but where you are going."
        </p>
      </div>
    </div>
  );
};
