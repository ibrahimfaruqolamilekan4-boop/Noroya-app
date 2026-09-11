import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Orbit, 
  User, 
  LayoutGrid, 
  Maximize2,
  X,
  Search,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { allahNames, AllahName } from '../data/allahNames';

export const NamesOfAllah = () => {
  const [index, setIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'details' | 'grid'>('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const currentName = allahNames[index];

  const next = () => setIndex((i) => (i + 1) % allahNames.length);
  const prev = () => setIndex((i) => (i - 1 + allahNames.length) % allahNames.length);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(next, 8000);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  const filteredNames = allahNames.filter(name => 
    name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.arabic.includes(searchTerm)
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto min-h-[700px] flex flex-col gap-6">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-4 rounded-3xl border-white/5">
        <div className="flex items-center space-x-4 px-2">
          <div className="p-2 bg-gold/10 rounded-xl">
            <BookOpen className="text-gold" size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-cream">The 99 Attributes</h2>
            <p className="text-[10px] text-slate-400">Divine Archetypes of the Infinite</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search Names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-cream focus:outline-none focus:ring-1 focus:ring-gold/50 w-48 transition-all"
            />
          </div>
          
          <button 
            onClick={() => setViewMode(viewMode === 'details' ? 'grid' : 'details')}
            className={cn(
              "p-2 rounded-full transition-all",
              viewMode === 'grid' ? "bg-gold text-starry-teal-dark shadow-gold/20 shadow-lg" : "bg-white/5 text-slate-400 hover:text-gold"
            )}
          >
            {viewMode === 'details' ? <LayoutGrid size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]"
            >
              {/* Primary Visual Card */}
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group border-white/5">
                <div className="absolute inset-0 bg-radial-gold opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" />
                
                <motion.div
                  key={`name-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 w-full"
                >
                  <div className="mb-8 flex items-center justify-center space-x-3">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">
                      Attribute {currentName.number} of 99
                    </span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/30" />
                  </div>

                  <h1 className="text-8xl md:text-9xl font-serif text-cream mb-6 drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                    {currentName.arabic}
                  </h1>
                  <h2 className="text-4xl font-serif font-bold text-gold mb-2 tracking-wide">
                    {currentName.transliteration}
                  </h2>
                  <div className="inline-block px-4 py-1 bg-gold/10 border border-gold/20 rounded-full mb-8">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gold/80">
                      {currentName.meaning}
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <button 
                      onClick={prev}
                      className="p-4 bg-white/5 text-slate-400 rounded-full hover:bg-gold hover:text-starry-teal-dark transition-all noor-glow"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <button className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center hover:bg-gold hover:text-starry-teal-dark transition-all shadow-xl noor-glow ring-1 ring-gold/20 group">
                      <Volume2 size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <button 
                      onClick={next}
                      className="p-4 bg-white/5 text-slate-400 rounded-full hover:bg-gold hover:text-starry-teal-dark transition-all noor-glow"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gold shadow-[0_0_10px_#D4AF37]"
                    animate={{ width: `${(currentName.number / 99) * 100}%` }}
                  />
                </div>
              </div>

              {/* Description Bento Grid */}
              <div className="flex flex-col gap-6">
                {/* Cosmic Perspective */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-8 flex-1 border-white/5 relative overflow-hidden group"
                >
                  <div className="absolute -top-4 -right-4 p-8 bg-blue-500/5 rounded-full blur-3xl" />
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Orbit className="text-blue-400" size={18} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Cosmic Manifestation</h3>
                  </div>
                  <p className="text-lg text-slate-100 font-serif leading-relaxed line-clamp-6">
                    {currentName.cosmicMeaning}
                  </p>
                  <div className="absolute bottom-4 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Orbit size={100} className="text-blue-400" />
                  </div>
                </motion.div>

                {/* Human Application */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-8 flex-1 border-white/5 relative overflow-hidden group"
                >
                  <div className="absolute -top-4 -right-4 p-8 bg-emerald-500/5 rounded-full blur-3xl" />
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <User className="text-emerald-400" size={18} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Human Application</h3>
                  </div>
                  <p className="text-lg text-slate-100 font-serif leading-relaxed line-clamp-6">
                    {currentName.humanApplication}
                  </p>
                  <div className="absolute bottom-4 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User size={100} className="text-emerald-400" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card p-8 border-white/5 max-h-[700px] overflow-y-auto custom-scrollbar"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredNames.map((name) => (
                  <motion.button
                    key={name.number}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIndex(name.number - 1);
                      setViewMode('details');
                    }}
                    className={cn(
                      "p-4 rounded-2xl flex flex-col items-center justify-center transition-all border group",
                      index === name.number - 1 
                        ? "bg-gold border-gold text-starry-teal-dark shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                        : "bg-white/5 border-white/10 hover:border-gold/50"
                    )}
                  >
                    <span className={cn(
                      "text-2xl font-serif mb-1 group-hover:scale-110 transition-transform",
                      index === name.number - 1 ? "text-starry-teal-dark" : "text-cream"
                    )}>
                      {name.arabic}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold tracking-tighter uppercase",
                      index === name.number - 1 ? "text-starry-teal-dark/80" : "text-gold"
                    )}>
                      {name.transliteration}
                    </span>
                  </motion.button>
                ))}
              </div>
              
              {filteredNames.length === 0 && (
                <div className="py-20 text-center">
                  <Sparkles className="mx-auto text-slate-700 mb-4" size={40} />
                  <p className="text-slate-500">No divine attribute matches your search.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auto-Play Toggle */}
      <div className="flex justify-center mt-2">
        <button 
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={cn(
            "flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all",
            isAutoPlaying ? "bg-gold text-starry-teal-dark" : "bg-white/5 text-slate-500 hover:text-gold"
          )}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full", isAutoPlaying ? "bg-starry-teal-dark animate-pulse" : "bg-slate-700")} />
          <span>{isAutoPlaying ? 'Contemplation Cycle Active' : 'Begin Contemplation Cycle'}</span>
        </button>
      </div>
    </div>
  );
};

