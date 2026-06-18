import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'motion/react';
import { MapPin, X, Play, Volume2, BookOpen, Share2, Info, Navigation2, Calendar, Target, Shield, Users, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

interface SacredLocation {
  id: string;
  name: string;
  title: string;
  summary: string;
  x: number;
  y: number;
  videoUrl?: string;
  audioUrl?: string;
  historyText: string;
  hijriYear: number; // -13 BH to 11 AH
  type: 'city' | 'battle' | 'mount' | 'milestone';
  articleId?: string;
}

const sacredLocations: SacredLocation[] = [
  {
    id: 'hira',
    name: 'Cave of Hira',
    title: 'The First Revelation',
    summary: 'Where the light of Prophethood first descended.',
    x: 530,
    y: 570,
    hijriYear: -13,
    type: 'mount',
    articleId: 'roadmap-day-1',
    historyText: 'On the peak of Jabal al-Nour, the Angel Jibril (AS) appeared to Muhammad ﷺ, commanding him to "Read!" in the name of your Lord.'
  },
  {
    id: 'makkah',
    name: 'Makkah',
    title: 'The Heartland of Islam',
    summary: 'The birthplace of Muhammad ﷺ and the site of the Holy Kaaba.',
    x: 520,
    y: 580,
    hijriYear: -13,
    type: 'city',
    historyText: 'The sacred city of Makkah is the spiritual center of the Islamic world. It was here that Ibrahim (AS) and Ismail (AS) rebuilt the Kaaba, and where the first rays of divine revelation descended upon the Prophet ﷺ in the Cave of Hira.'
  },
  {
    id: 'thawr',
    name: 'Cave of Thawr',
    title: 'The Great Hijrah Hideout',
    summary: 'Where the Prophet ﷺ hid from Meccan assassins.',
    x: 515,
    y: 585,
    hijriYear: 0,
    type: 'milestone',
    articleId: 'roadmap-day-4',
    historyText: 'During the migration to Medina, the Prophet ﷺ and Abu Bakr (RA) spent three nights in this cave, protected by a simple spider web and a nesting bird.'
  },
  {
    id: 'madinah',
    name: 'Madinah',
    title: 'The City of the Prophet',
    summary: 'The sanctuary which welcomed the Hijra and established the first Ummah.',
    x: 480,
    y: 480,
    hijriYear: 0,
    type: 'city',
    historyText: 'Al-Madinah al-Munawwarah (The Enlightened City) became the home of the Prophet ﷺ after the Hijra. It is home to the Prophet\'s Mosque and serves as the model for Islamic governance and community.'
  },
  {
    id: 'badr',
    name: 'Badr Wells',
    title: 'The Day of Distinguishing',
    summary: 'The first major battle of Islam where 313 stood against 1000.',
    x: 460,
    y: 530,
    hijriYear: 2,
    type: 'battle',
    articleId: 'roadmap-day-5',
    historyText: 'The Battle of Badr was a turning point in Islamic history, where divine assistance aided the small Muslim army against the overwhelming Quraysh forces.'
  },
  {
    id: 'uhud',
    name: 'Mount Uhud',
    title: 'The Test of Obedience',
    summary: 'Site of the second major battle and the martyrs of Islam.',
    x: 485,
    y: 470,
    hijriYear: 3,
    type: 'battle',
    articleId: 'roadmap-day-6',
    historyText: 'The Battle of Uhud taught the early Muslims the critical importance of discipline and obedience to the Prophet ﷺ\'s tactical commands.'
  },
  {
    id: 'khandaq',
    name: 'The Trench',
    title: 'The War of Attrition',
    summary: 'Where a clever trench strategy saved Medina from a massive siege.',
    x: 475,
    y: 475,
    hijriYear: 5,
    type: 'battle',
    historyText: 'Guided by Salman al-Farsi (RA), the Muslims dug a massive trench that neutralized the superior Meccan cavalry and changed warfare in Arabia.'
  },
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    title: 'Al-Quds: The Sacred Gateway',
    summary: 'The site of Al-Aqsa and the miraculous Night Journey (Isra).',
    x: 440,
    y: 280,
    hijriYear: -1,
    type: 'city',
    articleId: 'roadmap-day-3',
    historyText: 'Jerusalem holds profound significance as the first Qibla and the site of the Prophet ﷺ\'s Miraculous Night Journey (Isra) and Ascension (Mi\'raj).'
  },
  {
    id: 'conquest',
    name: 'Conquest of Makkah',
    title: 'The Triumph of Mercy',
    summary: '10,000 fires lighting up the hills surrounding the city.',
    x: 520,
    y: 580,
    hijriYear: 8,
    type: 'milestone',
    articleId: 'roadmap-day-7',
    historyText: 'Entering the city with bowed head, the Prophet ﷺ granted a general amnesty to his enemies, proving that the greatest victory is one of mercy.'
  }
];

const TacticalGridView = ({ location, onBack }: { location: SacredLocation, onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_70%)]" />
        <div className="grid grid-cols-12 h-fit w-full h-full border border-gold/10">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="border-r border-b border-gold/5 aspect-square" />
          ))}
        </div>
      </div>

      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 text-gold hover:bg-gold/10 transition-all z-10"
      >
        <ArrowRight className="rotate-180" />
      </button>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-8">
          <div>
            <span className="px-4 py-1 bg-gold/20 text-gold rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-gold/20 mb-4 inline-block">
              Tactical Scout View
            </span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-cream leading-tight">
              {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border-emerald-500/20">
              <div className="flex items-center space-x-3 text-emerald-400 mb-4">
                <Users size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Muslim Forces</span>
              </div>
              <p className="text-2xl font-serif text-cream">
                {location.id === 'badr' ? '313' : location.id === 'uhud' ? '700' : '10,000'} <span className="text-sm opacity-50">Warriors</span>
              </p>
            </div>
            <div className="glass-card p-6 border-red-500/20">
              <div className="flex items-center space-x-3 text-red-400 mb-4">
                <Shield size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400/60">Quraysh Opponents</span>
              </div>
              <p className="text-2xl font-serif text-cream">
                {location.id === 'badr' ? '1000+' : location.id === 'uhud' ? '3000' : 'Unknown'} <span className="text-sm opacity-50">Infantry</span>
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-400 font-serif leading-relaxed italic border-l-2 border-gold/30 pl-6">
            {location.historyText}
          </p>
        </div>

        <div className="relative w-full md:w-[500px] aspect-square">
          {/* Animated Tactical Grid Layout */}
          <div className="absolute inset-0 bg-gold/5 rounded-full blur-[100px] animate-pulse" />
          
          <div className="relative h-full w-full border-2 border-gold/20 rounded-[3rem] overflow-hidden bg-slate-900/50 flex items-center justify-center">
             {/* 3D-ish representation */}
             <div className="relative w-full h-full flex items-center justify-center">
                {location.id === 'uhud' && (
                  <>
                    {/* The Mountain */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-32 bg-slate-700/50 rounded-[2rem] border-t-4 border-slate-500"
                    />
                    {/* Archer Ridge */}
                    <motion.div 
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="absolute bottom-1/3 left-1/4 w-32 h-12 bg-emerald-500/20 rounded-full border border-emerald-500 flex items-center justify-center"
                    >
                      <span className="text-[8px] font-black uppercase text-emerald-400">50 Archers</span>
                    </motion.div>
                    {/* Khalid Flank Arrow */}
                    <motion.svg 
                      viewBox="0 0 200 200" 
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                       <motion.path 
                         d="M 180 50 Q 180 150 50 150" 
                         fill="none" 
                         stroke="#ef4444" 
                         strokeWidth="4" 
                         strokeDasharray="10,5"
                         initial={{ pathLength: 0, opacity: 0 }}
                         animate={{ pathLength: 1, opacity: 1 }}
                         transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                       />
                       <text x="120" y="140" fill="#ef4444" className="text-[10px] font-black uppercase" transform="rotate(-10)">Cavalry Flank</text>
                    </motion.svg>
                  </>
                )}

                {location.id === 'badr' && (
                  <>
                    {/* The Wells */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                        className="absolute w-12 h-12 rounded-full border-2 border-blue-400/30 bg-blue-400/10"
                        style={{ left: 150 + i * 50, top: 200 }}
                      />
                    ))}
                    {/* Muslim Line */}
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-1/4 left-1/4 right-1/4 h-2 bg-emerald-500 rounded-full noor-glow"
                    />
                    {/* Meccan Line */}
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute top-1/4 left-1/4 right-1/4 h-2 bg-red-500 rounded-full opacity-50"
                    />
                  </>
                )}

                {location.id !== 'uhud' && location.id !== 'badr' && (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Target className="text-gold animate-spin-slow" size={64} />
                    <p className="text-gold/40 font-black uppercase tracking-widest text-[10px]">Scanning Terrain History</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const IslamicMap = ({ onReadHistory }: { onReadHistory?: (articleId: string) => void }) => {
  const { profile } = useAuth();
  const [selected, setSelected] = useState<SacredLocation | null>(null);
  const [activeYear, setActiveYear] = useState(1); // 1 = 1 AH, -13 = 13 BH
  const [viewMode, setViewMode] = useState<'macro' | 'tactical'>('macro');
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Pan and Zoom Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragParticles, setDragParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (profile?.uid) {
        const progress = await dbService.getProgress(profile.uid);
        if (progress) setCompletedModules(progress.completedModules || []);
      }
    };
    fetchProgress();
  }, [profile]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newParticle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setDragParticles(prev => [...prev.slice(-15), newParticle]);
    }
  };

  const handleShare = (loc: SacredLocation) => {
    toast.success(`Sharing the story of ${loc.name}...`);
  };

  const filteredLocations = useMemo(() => {
    return sacredLocations.filter(loc => loc.hijriYear <= activeYear);
  }, [activeYear]);

  // Year mapping for slider (0-24 index for -13 to 11)
  const years = Array.from({ length: 25 }, (_, i) => i - 13);
  const currentYearLabel = activeYear < 0 ? `${Math.abs(activeYear)} BH` : activeYear === 0 ? 'Hijrah' : `${activeYear} AH`;

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-[70vh] md:h-[80vh] bg-[#1a2b2b] rounded-[3rem] border border-gold/40 overflow-hidden cursor-grab active:cursor-grabbing group shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      {/* Ancient Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2b2b] via-[#0a1a1a] to-[#2d4a4a] opacity-90" />
      <div className="absolute inset-0 islamic-pattern opacity-10 bg-[length:150px_150px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]" />
      
      {/* Panable Container */}
      <motion.div 
        drag
        dragElastic={0.1}
        dragConstraints={mapRef}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{ x: springX, y: springY }}
        className="relative w-[1200px] h-[1000px] flex items-center justify-center"
      >
        {/* Ancient SVG Map Map (Middle East Focus) */}
        <svg 
          viewBox="0 0 1000 800" 
          className="w-full h-full drop-shadow-[0_0_30px_rgba(212,175,55,0.1)]"
          style={{ filter: 'sepia(0.3) saturate(0.8)' }}
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 0.2 }} />
              <stop offset="50%" style={{ stopColor: '#D4AF37', stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: '#D4AF37', stopOpacity: 0.2 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Abstract Continent Silhouettes */}
          <path 
            d="M 200 200 Q 300 150 450 180 T 600 250 T 700 400 T 650 600 T 450 750 T 250 650 T 150 400 Z" 
            fill="url(#goldGradient)"
            stroke="#D4AF37"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          
          {/* Compass Rose */}
          <g transform="translate(850, 150) rotate(15) scale(0.8)">
            <circle cx="0" cy="0" r="40" fill="none" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.4" />
            <path d="M 0 -50 L 10 0 L 0 50 L -10 0 Z" fill="#D4AF37" fillOpacity="0.5" />
            <path d="M -50 0 L 0 -10 L 50 0 L 0 10 Z" fill="#D4AF37" fillOpacity="0.5" />
            <text x="0" y="-60" textAnchor="middle" fill="#D4AF37" className="text-[10px] uppercase font-black tracking-widest">North</text>
          </g>

          {/* Fog of War Overlay */}
          <defs>
            <mask id="fogMask">
              <rect x="0" y="0" width="1000" height="800" fill="white" />
              {sacredLocations.map((loc) => {
                const isUnlocked = loc.articleId ? completedModules.includes(loc.articleId) : true;
                return (
                  <circle 
                    key={`fog-${loc.id}`}
                    cx={loc.x} 
                    cy={loc.y} 
                    r={isUnlocked ? 150 : 0} 
                    fill="black"
                    className="transition-all duration-1000"
                  />
                );
              })}
            </mask>
          </defs>
          <rect 
            x="0" 
            y="0" 
            width="1000" 
            height="800" 
            fill="#0a1a1a" 
            mask="url(#fogMask)" 
            className="opacity-60 transition-opacity duration-1000"
          />

          {/* Interactive Trails (Connectors) */}
          <motion.path 
            d="M 520 580 Q 500 530 480 480" 
            fill="none" 
            stroke="#D4AF37" 
            strokeWidth="2" 
            strokeDasharray="5,5" 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: activeYear >= 0 ? 1 : 0,
              opacity: activeYear >= 0 ? 0.4 : 0
            }}
            filter="url(#glow)"
          />

          {/* Location Markers */}
          {filteredLocations.map((loc) => (
            <g 
              key={loc.id} 
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(loc);
              }}
            >
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                {loc.id === 'conquest' && (
                  <g>
                    {[...Array(12)].map((_, i) => (
                      <motion.circle
                        key={i}
                        cx={loc.x + (Math.random() - 0.5) * 40}
                        cy={loc.y + (Math.random() - 0.5) * 40}
                        r="2"
                        fill="#D4AF37"
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                        className="blur-[1px]"
                      />
                    ))}
                  </g>
                )}
                
                <circle 
                  cx={loc.x} 
                  cy={loc.y} 
                  r="12" 
                  fill={loc.type === 'battle' ? "#ef4444" : "#D4AF37"} 
                  fillOpacity="0.2" 
                  className={loc.type === 'battle' ? "animate-ping" : "animate-pulse"}
                />
                <circle 
                  cx={loc.x} 
                  cy={loc.y} 
                  r={loc.type === 'city' ? "6" : "4"} 
                  fill={loc.type === 'battle' ? "#ef4444" : "#D4AF37"} 
                  filter="url(#glow)"
                />
              </motion.g>
              {/* Tooltip Label */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                <rect 
                  x={loc.x - 40} 
                  y={loc.y - 45} 
                  width="80" 
                  height="25" 
                  rx="12" 
                  fill="#0c2e2e" 
                  stroke="#D4AF37" 
                  strokeWidth="0.5" 
                />
                <text 
                  x={loc.x} 
                  y={loc.y - 28} 
                  textAnchor="middle" 
                  fill="#D4AF37" 
                  className="text-[10px] font-black uppercase tracking-widest"
                >
                  {loc.name}
                </text>
              </g>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Touch/Drag Particles (Noor Effect) */}
      <AnimatePresence>
        {dragParticles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed w-2 h-2 bg-gold/50 rounded-full blur-[2px] pointer-events-none z-50 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{ left: p.x, top: p.y }}
          />
        ))}
      </AnimatePresence>

      <div className="absolute top-8 left-8 flex flex-col space-y-4">
        <div className="glass-card px-6 py-4 flex items-center space-x-4 border-gold/30">
          <Navigation2 className="text-gold animate-bounce" size={20} />
          <div>
            <h3 className="text-lg font-serif font-bold text-cream">Sacred Expedition</h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-gold/60">Charting Divine History</p>
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-8 flex flex-col items-end space-y-4">
        <div className="glass-card px-6 py-3 border-gold/30 flex items-center space-x-3">
          <Calendar className="text-gold" size={16} />
          <span className="text-xl font-serif font-bold text-cream">{currentYearLabel}</span>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="absolute bottom-24 inset-x-8 md:inset-x-24 z-30">
         <div className="glass-card p-6 md:p-8 border-gold/30 relative overflow-hidden group/timeline text-center">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">01 BH (Prophethood)</span>
              <div className="flex items-center space-x-2 text-gold">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-xs font-serif italic text-cream">Chronological Expedition Slider</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">11 AH (Finality)</span>
            </div>

            <div className="relative h-1 text-gold/20 flex items-center">
              <input 
                type="range"
                min="-13"
                max="11"
                step="1"
                value={activeYear}
                onChange={(e) => setActiveYear(parseInt(e.target.value))}
                className="w-full appearance-none bg-gold/10 h-1.5 rounded-full outline-none cursor-pointer accent-gold relative z-10"
              />
              <div className="absolute inset-y-0 left-0 bg-gold/40 rounded-full h-1.5 pointer-events-none" style={{ width: `${((activeYear + 13) / 24) * 100}%` }} />
              
              {/* Year markers */}
              <div className="absolute inset-x-0 top-6 flex justify-between pointer-events-none px-1">
                {years.map(y => (
                  <div key={y} className={cn(
                    "flex flex-col items-center space-y-2",
                    y % 5 === 0 || y === activeYear ? "opacity-100" : "opacity-0"
                  )}>
                    <div className={cn("w-1 h-3 rounded-full", y === activeYear ? "bg-gold scale-y-150" : "bg-gold/30")} />
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-tighter",
                      y === activeYear ? "text-gold" : "text-gold/40"
                    )}>
                      {y < 0 ? `${Math.abs(y)}BH` : y === 0 ? 'H' : `${y}AH`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
         </div>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center space-x-3 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 group-hover:border-gold/30 transition-all z-20">
        <Info size={16} className="text-gold" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Drag to Scroll &bull; Slider to Time Travel &bull; Tap Markers</p>
      </div>

      {/* Pop-up Drawer */}
      <AnimatePresence>
        {selected && viewMode === 'macro' && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-starry-teal-dark/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 inset-x-0 glass-card mx-4 mb-4 rounded-[2.5rem] z-50 border-gold/30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                <button 
                  onClick={() => setSelected(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <X size={20} />
                </button>

                {/* Media Preview (Mock) */}
                <div className="w-full md:w-80 aspect-video rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden group/media">
                   <div className="absolute inset-0 bg-gold/5 group-hover/media:bg-gold/10 transition-all" />
                   <div className="relative z-10 flex flex-col items-center space-y-4">
                     <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold noor-glow group-hover/media:scale-110 transition-transform">
                       <Play fill="currentColor" size={24} />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gold/80">Play 360° Journey</p>
                   </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-4xl font-serif font-bold text-cream mb-2">{selected.name}</h3>
                    <p className="text-gold font-bold italic text-lg">{selected.title}</p>
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar text-slate-400 text-base leading-relaxed">
                    {selected.historyText}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    {selected.type === 'battle' && (
                      <button 
                        onClick={() => setViewMode('tactical')}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center space-x-3"
                      >
                         <Target size={16} />
                         <span>Tactical Scout View</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (selected.articleId) {
                          onReadHistory?.(selected.articleId);
                        } else {
                          toast("Detailed chronicle for " + selected.name + " is being transcribed...", { icon: '📜' });
                        }
                      }}
                      className="bg-gold text-starry-teal-dark px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] noor-glow hover:scale-105 transition-all flex items-center space-x-3"
                    >
                      <BookOpen size={16} />
                      <span>Read Full History</span>
                    </button>
                    <button className="bg-white/5 border border-white/10 text-cream px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-gold/10 hover:border-gold/30 transition-all flex items-center space-x-3">
                      <Volume2 size={16} className="text-gold" />
                      <span>Audio Narration</span>
                    </button>
                    <button 
                      onClick={() => handleShare(selected)}
                      className="w-12 h-12 bg-white/5 border border-white/10 text-slate-400 rounded-full flex items-center justify-center hover:bg-gold hover:text-starry-teal-dark transition-all"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewMode === 'tactical' && selected && (
          <TacticalGridView location={selected} onBack={() => setViewMode('macro')} />
        )}
      </AnimatePresence>
    </div>
  );
};
