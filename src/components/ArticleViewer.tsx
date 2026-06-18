import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, Clock, Sun, Moon, Play, Pause, Star, Sparkles, MessageSquare, CheckCircle2, Share2, Compass,
  Volume2, User, Heart, ArrowRight, Quote, Flame, RotateCw, MapPin, ShieldAlert, Flag,
  Droplets, Waves, Handshake, Network, Music, CloudRain, Activity, Globe,
  Shirt, History, Lock, Eye, Bug, Bird, Shield, BookOpenCheck, Sword,
  Wind, Scale, Coins, Zap, Timer, MousePointer2, Gift,
  Users, Hourglass, Scroll, HandHeart, Mic
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, MotionValue, useMotionValue } from 'motion/react';
import { cn } from '../lib/utils';
import { Article, Ayah } from '../types';
import { toast } from 'react-hot-toast';
import { ARTICLES } from '../data/articles';
import { RECITATIONS, useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';

interface ArticleViewerProps {
  article: Article;
  onBack: () => void;
  onComplete: (id: string | Article) => void;
  isNightMode: boolean;
  setIsNightMode: (val: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
  isScrollingDown: boolean;
  readingProgress: number;
  setReadingProgress: (val: number) => void;
}

export const AyahCard = ({ ayah, onSpotlight }: { ayah: Ayah, onSpotlight?: (inView: boolean) => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.6 });
  const [isPlaying, setIsPlaying] = useState(false);
  const { duck, unduck } = useAudio();

  useEffect(() => {
    if (onSpotlight) onSpotlight(isInView);
  }, [isInView, onSpotlight]);

  const hasAudio = ayah.reference.includes('9:40') || ayah.reference.includes('24:11');

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    if (newPlaying) {
      duck();
      toast(`Playing soulful recitation of ${ayah.reference}...`, {
        icon: '🎧',
        duration: 5000,
        style: { background: '#0f172a', color: '#fbbf24', border: '1px solid #fbbf24' }
      });
      // Simulate audio end
      setTimeout(() => {
        setIsPlaying(false);
        unduck();
      }, 8000);
    } else {
      unduck();
    }
  };

  const handleShare = async () => {
    const shareText = `${ayah.arabic}\n\n"${ayah.translation}"\n\n— ${ayah.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quranic Wisdom',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Verse copied to clipboard!", {
        icon: '📋',
        style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
      });
    }
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: isInView ? 1.05 : 1,
        boxShadow: isInView ? "0 0 80px rgba(212, 175, 55, 0.4)" : "none",
        borderColor: isInView ? "rgba(212, 175, 55, 1)" : "rgba(212, 175, 55, 0.2)"
      }}
      onClick={handleShare}
      className={cn(
        "relative w-full rounded-[4rem] overflow-hidden my-6 min-h-[500px] flex flex-col items-center justify-center p-16 text-center cursor-pointer group transition-all duration-1000 border-4",
        isInView ? "z-20 bg-slate-950" : "z-10 bg-black/40"
      )}
    >
      {/* Audio Button for Specific Ayahs */}
      {hasAudio && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAudio}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-full bg-gold text-slate-950 font-black uppercase tracking-widest text-[10px] flex items-center space-x-2 shadow-2xl"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? 'Pause Recitation' : 'Listen to Revelation'}</span>
        </motion.button>
      )}
      
      {/* Golden Frame Ornament */}
      <div className="absolute top-8 left-8 size-24 border-t-2 border-l-2 border-gold/40 rounded-tl-[3rem]" />
      <div className="absolute top-8 right-8 size-24 border-t-2 border-r-2 border-gold/40 rounded-tr-[3rem]" />
      <div className="absolute bottom-8 left-8 size-24 border-b-2 border-l-2 border-gold/40 rounded-bl-[3rem]" />
      <div className="absolute bottom-8 right-8 size-24 border-b-2 border-r-2 border-gold/40 rounded-br-[3rem]" />
      
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none islamic-pattern" />
      
      <div className="relative z-10 max-w-4xl space-y-16">
        <div className="flex justify-center mb-4">
          <motion.div 
            animate={{ rotate: isInView ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-[2.5rem] bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold hover:text-slate-950 transition-all border border-gold/20 shadow-2xl"
          >
            <Quote size={32} />
          </motion.div>
        </div>
        
        <motion.p 
          animate={{ scale: isInView ? 1.1 : 1, y: isInView ? 0 : 20 }}
          className="text-6xl md:text-8xl font-serif font-black text-gold/90 leading-[1.8] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]" 
          dir="rtl"
        >
          {ayah.arabic}
        </motion.p>
        
        <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto" />
        
        <div className="space-y-8">
          <p className="text-3xl md:text-5xl font-serif font-bold text-gold leading-[1.6] max-w-3xl mx-auto italic">
            "{ayah.translation}"
          </p>
          <div className="flex items-center justify-center space-x-3 text-gold/70 font-black uppercase tracking-[0.4em] text-xs">
             <div className="w-8 h-px bg-gold/30" />
             <span>{ayah.reference}</span>
             <div className="w-8 h-px bg-gold/30" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const WisdomCard = ({ card, onSelect, isSelected }: { 
  card: { title: string; content: string; icon?: string }; 
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const Icon = ({ name }: { name: string }) => {
    switch(name) {
      case 'Volume2': return <Volume2 size={24} />;
      case 'User': return <User size={24} />;
      case 'Heart': return <Heart size={24} />;
      case 'Clock': return <Clock size={24} />;
      case 'ArrowRight': return <ArrowRight size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative flex-shrink-0 w-72 h-96 p-8 rounded-[3rem] cursor-pointer transition-all duration-500 overflow-hidden group border-2",
        isSelected 
          ? "bg-gold text-slate-950 border-gold shadow-[0_0_40px_rgba(212,175,55,0.4)]" 
          : "bg-white/5 text-cream border-white/10 hover:border-gold/30"
      )}
    >
      <div className={cn(
        "mb-8 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
        isSelected ? "bg-slate-950/10" : "bg-gold/10 text-gold"
      )}>
        {card.icon && <Icon name={card.icon} />}
      </div>
      
      <h4 className="text-2xl font-serif font-bold mb-4">{card.title}</h4>
      <p className={cn(
        "text-lg leading-relaxed font-serif opacity-80",
        isSelected ? "text-slate-950" : "text-slate-300"
      )}>
        "{card.content}"
      </p>

      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-6 right-6 w-10 h-10 bg-slate-950/10 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 size={20} />
        </motion.div>
      )}
    </motion.div>
  );
};

const IdolSmash = ({ shatteredIds, onSmash }: { shatteredIds: number[], onSmash: (id: number) => void }) => {
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8 p-8 md:p-12 bg-white/5 rounded-[3rem] border border-white/10 my-20">
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <motion.button
          key={id}
          whileTap={!shatteredIds.includes(id) ? { scale: 0.8 } : {}}
          onClick={() => !shatteredIds.includes(id) && onSmash(id)}
          className={cn(
            "relative aspect-square rounded-[2rem] flex items-center justify-center transition-all duration-500 overflow-hidden",
            shatteredIds.includes(id) 
              ? "bg-red-500/5 border-gold/10" 
              : "bg-slate-900 border-white/10 border shadow-2xl hover:border-gold/40"
          )}
        >
          {shatteredIds.includes(id) ? (
             <motion.div 
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-[8px] md:text-[10px] font-black text-gold/60 text-center px-4 leading-tight uppercase tracking-widest"
             >
                {id === 1 && "One God Alone"}
                {id === 2 && "Truth Prevails"}
                {id === 3 && "Mercy First"}
                {id === 4 && "Light of Faith"}
                {id === 5 && "No God But Allah"}
                {id === 6 && "Pure Monotheism"}
             </motion.div>
          ) : (
            <motion.div className="w-8 h-12 md:w-12 md:h-16 bg-slate-400/20 rounded-lg relative">
               <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 md:w-4 md:h-4 rounded-full bg-slate-500/20" />
            </motion.div>
          )}
          {shatteredIds.includes(id) && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 0, x: (Math.random() - 0.5) * 150, y: (Math.random() - 0.5) * 150 }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-slate-400 rounded-sm"
                />
              ))}
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

const BlastModule = () => {
  const [isPressing, setIsPressing] = useState(false);
  
  return (
    <div className="flex flex-col items-center space-y-8 my-20">
       <div className="text-center space-y-3">
          <h4 className="text-gold/60 font-black uppercase tracking-widest text-[10px]">The Sound of the Blast</h4>
          <p className="text-cream/40 font-serif italic text-sm">Long press to experience the Sayhah</p>
       </div>
       <motion.button
         onMouseDown={() => setIsPressing(true)}
         onMouseUp={() => setIsPressing(false)}
         onMouseLeave={() => setIsPressing(false)}
         onTouchStart={() => setIsPressing(true)}
         onTouchEnd={() => setIsPressing(false)}
         animate={{ 
           scale: isPressing ? 0.9 : 1,
           boxShadow: isPressing ? "0 0 120px rgba(239, 68, 68, 0.4)" : "0 0 30px rgba(212, 175, 55, 0.2)",
           borderColor: isPressing ? "rgba(239, 68, 68, 0.6)" : "rgba(212, 175, 55, 0.4)"
         }}
         className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-950 border-4 flex items-center justify-center text-gold transition-colors duration-300"
       >
         <Flame className={cn("transition-all duration-300", isPressing ? "text-red-500 scale-150 rotate-180" : "text-gold")} size={64} />
       </motion.button>
       
       <AnimatePresence>
         {isPressing && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[500] pointer-events-none bg-white flex items-center justify-center overflow-hidden"
           >
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  filter: ["blur(0px)", "blur(20px)", "blur(0px)"]
                }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="absolute inset-0 bg-slate-900/10"
              />
              <motion.h1 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 2, 0.8], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl md:text-[15rem] font-black italic text-black tracking-tighter"
              >
                AL-SAYHAH
              </motion.h1>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const KaabaSpin = () => {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-12 my-24 py-12 bg-gold/5 rounded-[4rem] border border-gold/10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_70%)]" />
      <div className="text-center space-y-4 relative z-10">
        <h4 className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Foundations of the Holy House</h4>
        <p className="text-cream/60 font-serif italic text-sm">Drag to rotate the foundations</p>
      </div>

      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={(_, info) => {
          setRotation(prev => prev + info.delta.x * 0.5);
          setIsRotating(true);
        }}
        onDragEnd={() => setIsRotating(false)}
        animate={{ rotateY: rotation }}
        className="w-48 h-48 md:w-64 md:h-64 relative cursor-grab active:cursor-grabbing preserve-3d"
      >
        <div className="absolute inset-0 bg-slate-900 border-4 border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] rounded-sm flex items-center justify-center">
            <div className="text-[10px] font-black text-gold/40 text-center uppercase tracking-widest p-4">
               Abraham & Ishmael<br/>Foundations
            </div>
        </div>
        <div className="absolute inset-x-[-10%] inset-y-[-10%] border border-gold/10 rounded-lg pointer-events-none" />
      </motion.div>

      <AnimatePresence>
        {isRotating && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-gold/90 font-serif italic text-xl md:text-2xl max-w-lg text-center px-8"
          >
            "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing."
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SaiInteraction = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'safa' | 'marwa'>('safa');
  
  const stories = [
    "Hajar (AS) stood alone in the valley of becca...",
    "She ran toward the hill of Safa, searching for a sign of life.",
    "Finding nothing, she hurried toward Marwa, her faith unwavering.",
    "Seven times she crossed the burning sands, a mother's total surrender.",
    "The angel Jibril (AS) struck the ground with his wing...",
    "And the Zamzam water gushed forth, eternal and pure."
  ];

  const handleTap = (target: 'safa' | 'marwa') => {
    if (target !== direction) {
      setStep(prev => Math.min(prev + 1, stories.length - 1));
      setDirection(target);
      if (step === stories.length - 2) {
        toast.success("Zamzam flows!", { icon: '💧' });
      }
    }
  };

  return (
    <div className="my-20 space-y-12 p-10 bg-slate-950/50 rounded-[3rem] border border-white/5 relative overflow-hidden">
       {step === stories.length - 1 && (
         <motion.div 
           initial={{ opacity: 0, scale: 0 }}
           animate={{ opacity: 0.2, scale: 2 }}
           className="absolute inset-0 bg-blue-500 blur-[100px] pointer-events-none"
         />
       )}

       <div className="flex justify-between items-center relative z-10 px-4 md:px-20">
          <motion.button
            onClick={() => handleTap('safa')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "flex flex-col items-center space-y-3 transition-colors",
              direction === 'safa' ? "text-gold" : "text-slate-600"
            )}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 border-2 border-current flex items-center justify-center relative">
               <MapPin size={24} />
               {direction === 'safa' && <motion.div layoutId="sai-glow" className="absolute inset-0 rounded-full bg-gold/20 animate-pulse" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Safa</span>
          </motion.button>

          <div className="flex-1 h-1 bg-white/5 mx-8 relative">
             <motion.div 
               animate={{ left: direction === 'safa' ? '0%' : '100%' }}
               className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full blur-[4px]"
             />
          </div>

          <motion.button
            onClick={() => handleTap('marwa')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "flex flex-col items-center space-y-3 transition-colors",
              direction === 'marwa' ? "text-gold" : "text-slate-600"
            )}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 border-2 border-current flex items-center justify-center relative">
               <MapPin size={24} />
               {direction === 'marwa' && <motion.div layoutId="sai-glow" className="absolute inset-0 rounded-full bg-gold/20 animate-pulse" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Marwa</span>
          </motion.button>
       </div>

       <div className="text-center min-h-[80px] flex items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.p 
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-lg md:text-xl font-serif italic text-cream/80 max-w-md"
            >
              {stories[step]}
            </motion.p>
          </AnimatePresence>
       </div>
    </div>
  );
};

const SteadfastnessTracker = () => {
  const [value, setValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="my-20 p-8 md:p-16 bg-slate-950 border border-gold/20 rounded-[3rem] space-y-10 text-center relative overflow-hidden group">
       <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
       
       <div className="space-y-4 relative z-10">
          <ShieldAlert className="text-gold mx-auto" size={40} />
          <h3 className="text-2xl font-serif font-bold text-gold">Stand for Your Values</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Lut (AS) stood alone. What is one value you want to protect this week in your home and life?</p>
       </div>

       {!isSaved ? (
         <div className="space-y-6 relative z-10">
           <textarea
             value={value}
             onChange={(e) => setValue(e.target.value)}
             placeholder="I will protect the value of..."
             className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-cream font-serif text-lg focus:outline-none focus:border-gold/50 transition-all min-h-[120px]"
           />
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => {
               if (value.trim()) {
                 setIsSaved(true);
                 toast.success("Your spiritual commitment is recorded.", { icon: '📜' });
               }
             }}
             className="px-10 py-4 rounded-xl bg-gold text-slate-950 font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(212,175,55,0.3)]"
           >
             Scribe to Diary
           </motion.button>
         </div>
       ) : (
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="p-8 rounded-2xl bg-gold/10 border border-gold/40 text-gold relative z-10"
         >
            <p className="font-serif italic text-xl">"{value}"</p>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.5em] text-gold/60">Steadfastness Recorded</p>
         </motion.div>
       )}
    </div>
  );
};
  
const ZamzamScroll = () => {
  return (
    <div className="my-20 relative py-20 overflow-hidden rounded-[4rem] bg-blue-900/10 border border-blue-500/20 group">
      <div className="absolute inset-0 z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 2, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full bg-blue-400/20 blur-[100px]"
            style={{ 
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center space-y-8 px-8">
        <div className="flex justify-center">
           <Waves className="text-blue-400 animate-pulse" size={48} />
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-serif font-black text-blue-400">Zamzam: The Eternal Pulse</h3>
          <p className="text-blue-200/60 font-serif italic max-w-md mx-auto">
            As you scroll, feel the heartbeat of the desert. The water that saved a nation still flows with the promise of Allah.
          </p>
        </div>
        <div className="flex justify-center space-x-2">
           {[...Array(3)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
               className="w-1.5 h-1.5 bg-blue-400 rounded-full"
             />
           ))}
        </div>
      </div>
    </div>
  );
};

const PromiseTracker = () => {
  const [promise, setPromise] = useState("");
  const [reminded, setReminded] = useState(false);

  return (
    <div className="my-20 p-8 md:p-16 bg-slate-950 border border-blue-500/20 rounded-[3rem] space-y-10 text-center relative group overflow-hidden">
       <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
       
       <div className="space-y-4 relative z-10">
          <Handshake className="text-blue-400 mx-auto" size={40} />
          <h3 className="text-2xl font-serif font-bold text-blue-400">My Word is my Bond</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Inspired by Isma’il’s legendary faithfulness, what is one 'Micro-Promise' you will fulfill today?</p>
       </div>

       {!reminded ? (
         <div className="space-y-6 relative z-10">
           <input
             type="text"
             value={promise}
             onChange={(e) => setPromise(e.target.value)}
             placeholder="e.g. I will call my mother at 5 PM"
             className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-cream font-serif text-lg focus:outline-none focus:border-blue-500/50 transition-all text-center"
           />
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => {
               if (promise.trim()) {
                 setReminded(true);
                 toast.success("Promise recorded. Be true to your word like Isma'il.", { icon: '🤝' });
               }
             }}
             className="px-10 py-4 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(37,99,235,0.3)]"
           >
             Commit to Heart
           </motion.button>
         </div>
       ) : (
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="p-8 rounded-2xl bg-blue-500/10 border border-blue-500/40 text-blue-400 relative z-10"
         >
            <p className="font-serif italic text-xl">"{promise}"</p>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.5em] text-blue-400/60">A Messenger's Character</p>
         </motion.div>
       )}
    </div>
  );
};

const CalmHeartAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { duck, unduck } = useAudio();
  
  return (
    <div className="my-20 flex flex-col items-center space-y-8 p-12 bg-purple-950/20 border border-purple-500/20 rounded-[4rem]">
       <div className="text-center space-y-3">
          <Music className="text-purple-400 mx-auto" size={32} />
          <h4 className="text-purple-400 font-black uppercase tracking-widest text-[10px]">Calm the Heart</h4>
          <p className="text-cream/40 font-serif italic text-sm">Experience the "Beautiful Patience" of Ya'qub</p>
       </div>
       
       <motion.button
         onClick={() => {
           const nextState = !isPlaying;
           setIsPlaying(nextState);
           if (nextState) duck();
           else unduck();
         }}
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         className={cn(
           "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500",
           isPlaying ? "bg-purple-600 shadow-[0_0_50px_rgba(147,51,234,0.5)]" : "bg-slate-900 border border-purple-500/40"
         )}
       >
         {isPlaying ? <CloudRain className="text-white animate-bounce" size={40} /> : <Play className="text-purple-400 ml-1" size={40} />}
       </motion.button>

       <AnimatePresence>
         {isPlaying && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             className="text-center"
           >
             <p className="text-purple-300 font-serif italic">Soft rain falling... Heart finding peace.</p>
             <div className="mt-6 flex justify-center space-x-1">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 30, 10] }}
                    transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                    className="w-1 bg-purple-500/40 rounded-full"
                  />
                ))}
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const LineageMap = () => {
  return (
    <div className="my-24 p-12 bg-white/5 rounded-[4rem] border border-white/10 space-y-16">
       <div className="text-center">
          <Network className="text-gold/40 mx-auto mb-4" size={32} />
          <h3 className="text-2xl font-serif font-black text-cream">The Lineage of Light</h3>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent hidden md:block" />
          
          <div className="flex flex-col items-center space-y-6 relative">
             <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Mecca Branch</span>
                <h4 className="text-xl font-serif font-bold text-cream">Isma'il (AS)</h4>
                <p className="text-xs text-slate-500 mt-1">Father of the Arabs</p>
             </div>
             <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Droplets size={24} />
             </div>
             <p className="text-center text-slate-400 text-xs italic">Lineage leading to Muhammad (ﷺ)</p>
          </div>

          <div className="flex flex-col items-center space-y-6 relative">
             <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Palestine Branch</span>
                <h4 className="text-xl font-serif font-bold text-cream">Ishaq (AS)</h4>
                <p className="text-xs text-slate-500 mt-1">Founding the Tribes</p>
             </div>
             <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Heart size={24} />
             </div>
             <p className="text-center text-slate-400 text-xs italic">Lineage leading to Ya'qub, Yusuf, and 'Isa (AS)</p>
          </div>

          <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <Compass size={32} />
             </div>
             <span className="mt-3 text-xs font-black uppercase tracking-widest text-gold/60">Ibrahim (AS)</span>
          </div>
       </div>
    </div>
  );
};

const ShirtProgressBar = ({ progress }: { progress: any }) => {
  const shirtState = useTransform(progress, [0, 0.4, 0.7, 1], [0, 1, 2, 3]);
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    return shirtState.on('change', (latest) => {
      setCurrentState(Math.floor(latest));
    });
  }, [shirtState]);

  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-4">
      <div className="relative group">
         <motion.div 
           className={cn(
             "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500",
             currentState === 1 ? "bg-red-500/20 border-red-500/40" :
             currentState === 2 ? "bg-slate-700/40 border-slate-500/40" :
             "bg-gold/20 border-gold/40"
           )}
         >
            <Shirt className={cn(
              "transition-colors duration-500",
              currentState === 1 ? "text-red-500" :
              currentState === 2 ? "text-slate-400" :
              "text-gold"
            )} size={20} />
         </motion.div>
         <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-slate-950 px-3 py-1 rounded-full border border-gold/20 shadow-2xl">
               {currentState === 1 && "The Stained Shirt"}
               {currentState === 2 && "The Torn Shirt"}
               {currentState === 3 && "The Healed Shirt"}
               {currentState === 0 && "The Dreamer's Shirt"}
            </span>
         </div>
      </div>
      <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
    </div>
  );
};

const DreamInterpreter = () => {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  
  const strategy = [
    { 
      trigger: "7 Fat Cows", 
      icon: "🐄", 
      meaning: "Seven years of abundance and record-breaking harvests.",
      plan: "Store every extra grain in its ear to preserve it from decay."
    },
    { 
      trigger: "7 Lean Cows", 
      icon: "🐂", 
      meaning: "Seven years of devastating famine that will consume all reserves.",
      plan: "Distribute the stored grain wisely to save the people of Egypt and beyond."
    }
  ];

  return (
    <div className="my-24 p-12 bg-slate-950 border border-gold/20 rounded-[4rem] space-y-12 relative overflow-hidden group">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.1),transparent_70%)]" />
       
       <div className="text-center space-y-4 relative z-10">
          <Eye className="text-gold mx-auto" size={32} />
          <h3 className="text-2xl font-serif font-black text-gold">The Dream Interpreter</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Tap the symbols of the King's dream to reveal Yusuf's divine strategy.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {strategy.map((item, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveStage(idx)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "p-8 rounded-[3rem] border transition-all duration-500 text-left space-y-6",
                activeStage === idx ? "bg-gold/10 border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.1)]" : "bg-white/5 border-white/10 hover:border-gold/30"
              )}
            >
               <div className="flex items-center justify-between">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold/40">{item.trigger}</span>
               </div>
               <div className="space-y-3">
                  <h4 className="text-cream font-bold">{item.meaning}</h4>
                  <AnimatePresence>
                    {activeStage === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                         <p className="text-gold/80 italic text-sm border-l-2 border-gold/20 pl-4 py-1">
                            "Yusuf's Plan: {item.plan}"
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </motion.button>
          ))}
       </div>
    </div>
  );
};

const RefugeButton = () => {
  const [isSeeking, setIsSeeking] = useState(false);

  return (
    <div className="my-20 flex flex-col items-center space-y-8">
       <motion.button
         onClick={() => {
           setIsSeeking(true);
           setTimeout(() => setIsSeeking(false), 3000);
           toast("Ma'adh-Allah! I seek refuge in Allah!", {
             icon: '🛡️',
             style: { background: '#0a1a1a', color: '#D4AF37', border: '1px solid #D4AF37' }
           });
         }}
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className={cn(
           "relative px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs transition-all duration-700",
           isSeeking ? "bg-gold text-slate-950 shadow-[0_0_100px_rgba(212,175,55,0.6)]" : "bg-transparent border-2 border-gold text-gold hover:bg-gold/10"
         )}
       >
          <div className="flex items-center space-x-3">
             <Lock size={16} />
             <span>Seek Refuge</span>
          </div>
          {isSeeking && (
            <motion.div 
              layoutId="refuge-active"
              className="absolute inset-x-0 bottom-[-40px] text-center"
            >
               <span className="text-gold/60 font-serif italic text-[10px]">Protection Guaranteed</span>
            </motion.div>
          )}
       </motion.button>

       <AnimatePresence>
         {isSeeking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="fixed inset-0 z-[600] pointer-events-none flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl"
            >
               <div className="max-w-2xl text-center space-y-12">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-40 h-40 rounded-full border-2 border-dashed border-gold/40 flex items-center justify-center mx-auto"
                  >
                     <Star className="text-gold animate-pulse" size={60} />
                  </motion.div>
                  <div className="space-y-6">
                     <h2 className="text-4xl md:text-6xl font-serif font-black text-gold">Ma'adh-Allah</h2>
                     <p className="text-xl md:text-2xl text-cream/60 font-serif italic">"I seek refuge in Allah from the darkness of sin."</p>
                  </div>
                  <div className="w-full h-[1px] bg-gold/20 relative">
                     <motion.div 
                       initial={{ width: '0%' }}
                       animate={{ width: '100%' }}
                       transition={{ duration: 3 }}
                       className="absolute inset-y-0 left-0 bg-gold"
                     />
                  </div>
               </div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const RestorationSpring = () => {
  const [isHealing, setIsHealing] = useState(false);
  const [isHealed, setIsHealed] = useState(false);

  return (
    <div className="my-24 relative h-[600px] overflow-hidden rounded-[4rem] bg-slate-950 border border-emerald-500/20 group">
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 bg-cover bg-center",
          isHealed ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549416550-71649f87455d?auto=format&fit=crop&q=80&w=1200)' }}
      />
      <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

      <AnimatePresence>
        {isHealing && !isHealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [-200, 400], 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.1, 
                    repeat: Infinity,
                    ease: "easeIn"
                  }}
                  className="absolute w-1 h-32 bg-blue-400 blur-sm rounded-full"
                  style={{ left: `${(i - 10) * 20}px` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: isHealed ? 1 : 0 }}
        className="absolute inset-0 z-20 bg-emerald-950/20 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-8"
        >
          <Droplets size={40} />
        </motion.div>
        <h3 className="text-3xl font-serif font-black text-emerald-400 mb-4">The Restoration of Ayyub</h3>
        <p className="text-xl text-cream/80 font-serif italic max-w-md">
          "So We responded to him and removed what afflicted him of adversity."
        </p>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/60">Surah Al-Anbiya 21:83-84</p>
      </motion.div>

      {!isHealed && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="text-center space-y-4">
            <Zap className="text-amber-500 mx-auto" size={40} />
            <h3 className="text-2xl font-serif font-black text-cream">Touch to Invoke the Spring</h3>
            <p className="text-cream/40 text-sm italic max-w-xs">Strike the ground with your faith. Hold to heal.</p>
          </div>

          <motion.button
            onMouseDown={() => setIsHealing(true)}
            onMouseUp={() => {
              setIsHealing(false);
              setIsHealed(true);
              toast.success("Healing Restoration Invoked", { icon: '💧' });
            }}
            onTouchStart={() => setIsHealing(true)}
            onTouchEnd={() => {
              setIsHealing(false);
              setIsHealed(true);
              toast.success("Healing Restoration Invoked", { icon: '💧' });
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "w-24 h-24 rounded-full border-4 transition-all duration-700 flex items-center justify-center",
              isHealing ? "bg-blue-500/40 border-blue-400 scale-125 shadow-[0_0_100px_rgba(59,130,246,0.5)]" : "bg-white/5 border-white/20"
            )}
          >
            <motion.div animate={isHealing ? { scale: [1, 1.2, 1], rotate: 360 } : {}}>
              <Waves className={cn("transition-colors", isHealing ? "text-blue-200" : "text-white/40")} size={32} />
            </motion.div>
          </motion.button>
        </div>
      )}
    </div>
  );
};

const PatienceTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast("Calm achieved. Patience is beautiful.", { icon: '✨' });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <div className="my-24 p-12 md:p-20 bg-emerald-950/20 border border-emerald-500/20 rounded-[4rem] text-center space-y-12 relative overflow-hidden">
       <div className="absolute top-0 left-0 p-8">
          <Timer className="text-emerald-500/40" size={24} />
       </div>

       <div className="space-y-4">
          <h3 className="text-2xl font-serif font-black text-emerald-400">Ayyub’s Breath</h3>
          <p className="text-emerald-200/60 text-sm max-w-md mx-auto">
             A 1-minute guided breathing exercise for when the trial feels heavy.
          </p>
       </div>

       <div className="relative flex justify-center">
          <motion.div 
            animate={{ 
              scale: isActive ? [1, 1.3, 1] : 1,
              opacity: isActive ? [0.2, 0.4, 0.2] : 0.1
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-emerald-500 rounded-full blur-[100px] pointer-events-none"
          />
          
          <div className="w-48 h-48 rounded-full border-2 border-emerald-500/40 flex items-center justify-center relative z-10">
             <span className="text-6xl font-serif font-black text-emerald-400">{timeLeft}</span>
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                  cx="96"
                  cy="96"
                  r="94"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="590"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 590 - (timeLeft / 60) * 590 }}
                  className="opacity-40"
                />
             </svg>
          </div>
       </div>

       <div className="space-y-8">
          <motion.button
            onClick={() => {
              if (timeLeft === 0) setTimeLeft(60);
              setIsActive(!isActive);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500",
              isActive ? "bg-red-500/20 border border-red-500/40 text-red-400" : "bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            )}
          >
            {isActive ? "Pause Stillness" : timeLeft === 0 ? "Restart Cycle" : "Begin Stillness"}
          </motion.button>
          
          <AnimatePresence>
            {isActive && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-emerald-300/80 font-serif italic text-lg"
              >
                {timeLeft % 8 < 4 ? "Inhale the mercy of Allah..." : "Exhale all that troubles you..."}
              </motion.p>
            )}
          </AnimatePresence>
       </div>

       <div className="pt-8 border-t border-emerald-500/10">
          <p className="text-emerald-500/40 text-[10px] font-black uppercase tracking-widest">
             "Indeed, adversity has touched me, and You are the Most Merciful of the merciful."
          </p>
       </div>
    </div>
  );
};

const FairTradeScales = () => {
  const [balance, setBalance] = useState(50);
  const isBalanced = Math.abs(balance - 50) < 5;

  return (
    <div className="my-24 p-12 md:p-24 bg-amber-950/20 border border-amber-500/20 rounded-[4rem] flex flex-col items-center space-y-16 relative overflow-hidden">
       <div className="text-center space-y-4 relative z-10">
          <Scale className="text-amber-500 mx-auto" size={40} />
          <h3 className="text-2xl font-serif font-black text-amber-500">The Balance of Barakah</h3>
          <p className="text-amber-200/60 text-sm max-w-sm mx-auto">
             Shu’ayb (AS) called for justice in every transaction. Adjust the scales to find the blessing.
          </p>
       </div>

       <div className="w-full max-w-md relative pb-12">
          <div className="flex justify-between items-end h-64 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-amber-500/20" />
             
             <motion.div 
               animate={{ y: (balance - 50) * 1.5 }}
               className="flex flex-col items-center space-y-4"
             >
                <div className="w-2 h-32 bg-amber-500/40" />
                <div className="w-32 h-8 rounded-full bg-amber-900/40 border border-amber-500/40 flex items-center justify-center">
                   <Coins className="text-amber-500/40" size={16} />
                </div>
                <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Client's Due</span>
             </motion.div>

             <div className="w-4 h-48 bg-amber-500 rounded-t-full border-t border-amber-400/40" />

             <motion.div 
               animate={{ y: (50 - balance) * 1.5 }}
               className="flex flex-col items-center space-y-4"
             >
                <div className="w-2 h-32 bg-amber-500/40" />
                <div className="w-32 h-8 rounded-full bg-amber-900/40 border border-amber-500/40 flex items-center justify-center">
                   <Coins className="text-amber-500/40" size={16} />
                </div>
                <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Your Profit</span>
             </motion.div>
          </div>

          <div className="mt-12 space-y-6">
             <input 
               type="range"
               min="0"
               max="100"
               value={balance}
               onChange={(e) => setBalance(parseInt(e.target.value))}
               className="w-full h-1 bg-amber-500/20 appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
             />
             <div className="flex justify-between text-[8px] font-black text-amber-500/40 uppercase tracking-[0.3em]">
                <span>Deception</span>
                <span>Justice (halal)</span>
                <span>Cheating</span>
             </div>
          </div>
       </div>

       <AnimatePresence>
         {isBalanced && (
           <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 1.1 }}
             className="p-8 rounded-[2rem] bg-amber-500/10 border border-amber-500/40 text-center space-y-4 relative z-20"
           >
              <Sparkles className="text-amber-500 mx-auto" size={24} />
              <p className="text-lg font-serif font-bold text-cream">The Gates of Barakah are Open</p>
              <p className="text-amber-200/60 text-xs italic max-w-xs mx-auto">
                 "A small amount of Halal profit is better for the soul and the future than mountains of Haram wealth."
              </p>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const MusaActs = () => {
  const [activeAct, setActiveAct] = useState(0);
  const acts = [
    { title: "The Nile & Palace", desc: "Delivered to his enemy's doorstep.", color: "bg-blue-600" },
    { title: "The Desert of Madyan", desc: "The transformation from prince to shepherd.", color: "bg-amber-600" },
    { title: "The Burning Bush", desc: "The direct call from the Creator.", color: "bg-red-600" },
    { title: "The Sea & Staff", desc: "The ultimate liberation of a nation.", color: "bg-cyan-600" }
  ];

  return (
    <div className="my-20 space-y-12">
      <div className="flex justify-between items-center px-4">
        {acts.map((act, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveAct(idx)}
            className={cn(
              "flex flex-col items-center space-y-2 transition-all duration-300",
              activeAct === idx ? "scale-110" : "opacity-40 grayscale"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-black", act.color)}>
              {idx + 1}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{act.title}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeAct}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-12 rounded-[4rem] bg-white/5 border border-white/10 text-center space-y-6"
        >
          <div className={cn("w-20 h-1 bg-gradient-to-r from-transparent via-current to-transparent mx-auto", acts[activeAct].color.replace('bg-', 'text-'))} />
          <h3 className="text-3xl font-serif font-black text-cream">{acts[activeAct].title}</h3>
          <p className="text-xl font-serif italic text-cream/60">{acts[activeAct].desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const BrotherhoodSplit = () => {
  const [focus, setFocus] = useState<'musa' | 'harun' | null>(null);

  return (
    <div className="my-24 h-[600px] rounded-[4rem] overflow-hidden flex flex-col md:flex-row border border-gold/20">
      <motion.div 
        animate={{ width: focus === 'musa' ? '70%' : focus === 'harun' ? '30%' : '50%' }}
        onHoverStart={() => setFocus('musa')}
        onHoverEnd={() => setFocus(null)}
        className="h-1/2 md:h-full bg-slate-900 flex flex-col items-center justify-center p-12 text-center relative cursor-pointer"
      >
        <div className="absolute inset-0 bg-blue-500/5 opacity-50" />
        <div className="relative z-10 space-y-4">
          <Zap className="text-blue-400 mx-auto" size={40} />
          <h3 className="text-2xl font-serif font-black text-blue-400">Musa (AS)</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">The Power of Action</p>
          <AnimatePresence>
            {focus === 'musa' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-cream/60 italic font-serif max-w-xs">
                The speaker, the leader, and the one who confronts the tyrant head-on.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <div className="md:w-px md:h-full h-px w-full bg-gold/20" />

      <motion.div 
        animate={{ width: focus === 'harun' ? '70%' : focus === 'musa' ? '30%' : '50%' }}
        onHoverStart={() => setFocus('harun')}
        onHoverEnd={() => setFocus(null)}
        className="h-1/2 md:h-full bg-slate-950 flex flex-col items-center justify-center p-12 text-center relative cursor-pointer"
      >
        <div className="absolute inset-0 bg-gold/5 opacity-50" />
        <div className="relative z-10 space-y-4">
          <MessageSquare className="text-gold mx-auto" size={40} />
          <h3 className="text-2xl font-serif font-black text-gold">Harun (AS)</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/40">The Power of Speech</p>
          <AnimatePresence>
            {focus === 'harun' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-cream/60 italic font-serif max-w-xs">
                The support, the orator, and the steady hand during the prophet's absence.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const MagicianDuel = () => {
  const [magicians, setMagicians] = useState([
    { id: 1, active: true },
    { id: 2, active: true },
    { id: 3, active: true }
  ]);

  const handleDefeat = (id: number) => {
    setMagicians(prev => prev.map(m => m.id === id ? { ...m, active: false } : m));
    toast("They fell down in prostration!", { icon: '🙌' });
  };

  return (
    <div className="my-20 p-12 bg-white/5 rounded-[4rem] border border-white/10 text-center space-y-12">
      <div className="space-y-4">
        <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">The Throne Room Duel</h4>
        <h3 className="text-2xl font-serif font-black text-cream">Defeat the Illusions</h3>
      </div>
      <div className="flex justify-center space-x-8">
        {magicians.map((m) => (
          <motion.button
            key={m.id}
            whileHover={m.active ? { scale: 1.1, rotate: 5 } : {}}
            whileTap={m.active ? { scale: 0.9 } : {}}
            onClick={() => m.active && handleDefeat(m.id)}
            className={cn(
              "w-24 h-40 rounded-[2rem] border-2 transition-all duration-700 flex flex-col items-center justify-center space-y-4",
              m.active ? "bg-slate-900 border-gold/20" : "bg-gold/10 border-gold opacity-50 grayscale"
            )}
          >
            {m.active ? (
              <>
                <Zap className="text-gold/40" size={32} />
                <span className="text-[8px] font-black uppercase tracking-widest text-gold/60">Illusionist</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="text-gold" size={32} />
                <span className="text-[8px] font-black uppercase tracking-widest text-gold">Prostrated</span>
              </>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const GratitudeKingdom = () => {
  const [blessings, setBlessings] = useState(['', '', '']);
  const [showResult, setShowResult] = useState(false);

  const isComplete = blessings.every(b => b.trim().length > 0);

  return (
    <div className="my-24 p-12 md:p-24 bg-amber-950/20 border border-amber-500/20 rounded-[4rem] space-y-12 relative overflow-hidden">
      <div className="text-center space-y-4">
        <Heart className="text-amber-500 mx-auto" size={40} />
        <h3 className="text-3xl font-serif font-black text-amber-500">What is Your Kingdom?</h3>
        <p className="text-amber-200/60 text-sm max-w-sm mx-auto">
          Sulaiman (AS) listed his blessings with gratitude. List three things Allah has placed you in charge of today.
        </p>
      </div>

      {!showResult ? (
        <div className="space-y-4 max-w-md mx-auto">
          {blessings.map((b, i) => (
            <input 
              key={i}
              value={b}
              onChange={(e) => {
                const next = [...blessings];
                next[i] = e.target.value;
                setBlessings(next);
              }}
              placeholder={`Blessing ${i + 1}...`}
              className="w-full bg-slate-950/50 border border-amber-500/20 rounded-2xl px-8 py-5 text-cream placeholder:text-amber-500/20 focus:border-amber-500 focus:outline-none transition-colors"
            />
          ))}
          <motion.button
            disabled={!isComplete}
            onClick={() => setShowResult(true)}
            whileHover={isComplete ? { scale: 1.02 } : {}}
            className={cn(
              "w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500",
              isComplete ? "bg-amber-600 text-white shadow-xl" : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            Invoke Gratitude
          </motion.button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 bg-slate-950/40 p-12 rounded-[3rem] border border-amber-500/40"
        >
          <div className="space-y-4 pb-8 border-b border-amber-500/10">
            <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-[0.3em]">The Royal Prayer of {blessings[0].split(' ')[0]}</p>
            <p className="text-xl font-serif text-cream italic leading-relaxed">
              "O Allah, enable me to be truly grateful for my {blessings[0]}, my {blessings[1]}, and my {blessings[2]}. Make them a means of righteousness that You approve."
            </p>
          </div>
          <p className="text-cream/40 text-xs italic">Inspired by Surah An-Naml 27:19</p>
          <button 
            onClick={() => {
              setShowResult(false);
              setBlessings(['', '', '']);
            }}
            className="text-amber-500/40 hover:text-amber-500 text-[8px] font-black uppercase tracking-widest transition-colors"
          >
            Edit My Kingdom
          </button>
        </motion.div>
      )}
    </div>
  );
};

const BlinkOfAnEye = () => {
  const [showThrone, setShowThrone] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const handleBlink = () => {
    setIsBlinking(true);
    setTimeout(() => {
      setShowThrone(true);
      setIsBlinking(false);
      toast.success("Miracle Manifested: The Throne has arrived.", { icon: '✨' });
    }, 100);
  };

  return (
    <div className="my-24 p-12 md:p-20 bg-slate-900 border border-gold/20 rounded-[4rem] text-center space-y-10 relative overflow-hidden">
      <AnimatePresence>
        {isBlinking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50"
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <Sparkles className="text-gold mx-auto" size={40} />
        <h3 className="text-2xl font-serif font-black text-cream">The Journey of a Glance</h3>
        <p className="text-cream/40 text-sm max-w-xs mx-auto">"I will bring it to you before your glance returns to you."</p>
      </div>

      <div className="h-64 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {!showThrone ? (
            <motion.div 
              key="pre"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="text-gold/20 italic font-serif text-xl"
            >
              The distance of 1,500 miles...
            </motion.div>
          ) : (
            <motion.div 
              key="post"
              initial={{ scale: 1.5, filter: 'blur(20px)', opacity: 0 }}
              animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className="w-40 h-40 rounded-3xl bg-gold/10 border-4 border-gold shadow-[0_0_100px_rgba(212,175,55,0.3)] flex items-center justify-center">
                <Gift className="text-gold" size={64} />
              </div>
              <p className="text-gold font-serif font-bold text-xl uppercase tracking-widest">The Throne of Bilqis</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showThrone && (
        <motion.button
          onClick={handleBlink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-5 bg-gold text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
        >
          Blink Your Eye
        </motion.button>
      )}

      {showThrone && (
        <button 
          onClick={() => setShowThrone(false)}
          className="text-gold/40 text-[8px] font-black uppercase tracking-widest hover:text-gold transition-colors"
        >
          Reset Miracle
        </button>
      )}
    </div>
  );
};

const GlassFloor = () => {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

  const addRipple = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);
  };

  return (
    <div 
      onMouseDown={addRipple}
      className="my-24 h-[500px] rounded-[4rem] bg-gradient-to-b from-cyan-900/40 to-blue-900/60 border border-cyan-400/30 overflow-hidden relative group cursor-crosshair backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30 mix-blend-overlay" />
      
      <div className="absolute inset-x-0 bottom-0 p-12 text-center space-y-4">
        <h3 className="text-3xl font-serif font-black text-cyan-200">The Palace of Crystal</h3>
        <p className="text-cyan-100/60 italic font-serif">"Indeed, it is a palace paved with smooth glass."</p>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400/40">Touch the surface to see the clarity</p>
      </div>

      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute w-20 h-20 border border-cyan-300 rounded-full pointer-events-none"
            style={{ left: ripple.x - 40, top: ripple.y - 40 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const AnimalSpeech = () => {
  return (
    <div className="my-20 p-12 bg-emerald-950/20 border border-emerald-500/20 rounded-[4rem] text-center space-y-10 group overflow-hidden relative">
      <motion.div 
        animate={{ x: [0, 10, 0, -10, 0], y: [0, -5, 0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        <Bird className="absolute top-10 left-10 text-emerald-400" size={100} />
        <Bug className="absolute bottom-10 right-10 text-emerald-400" size={80} />
      </motion.div>

      <div className="space-y-4 relative z-10">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Spatial Audio Active</h4>
        <h3 className="text-2xl font-serif font-black text-emerald-400">The Valley of Conversation</h3>
        <p className="text-emerald-200/60 text-sm max-w-sm mx-auto">
          Scroll through the story to hear the whispers of the ants and the call of the Hoopoe.
        </p>
      </div>

      <div className="flex justify-center space-x-12 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          onClick={() => toast("Chirp... 'O ants, enter your dwellings!'", { icon: '🐜' })}
          className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-colors"
        >
          <Bug className="text-emerald-400" size={32} />
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          onClick={() => toast("Flap flap... 'I have come to you from Sheba with certain news.'", { icon: '🐦' })}
          className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-colors"
        >
          <Bird className="text-emerald-400" size={32} />
        </motion.div>
      </div>
    </div>
  );
};

const ThreeDarknesses = () => {
  const { scrollYProgress } = useScroll();
  const bgColor = useTransform(
    scrollYProgress,
    [0.4, 0.6, 0.8],
    ['#1e293b', '#0f172a', '#020617']
  );

  return (
    <motion.div 
      style={{ backgroundColor: bgColor }}
      className="my-24 p-12 md:p-24 rounded-[4rem] border border-white/5 space-y-12 text-center transition-colors duration-1000"
    >
      <div className="space-y-4">
        <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">The Living Tomb</h4>
        <h3 className="text-3xl font-serif font-black text-cream">The Three Darknesses</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Night", icon: Moon, desc: "The darkness above the waves." },
          { title: "Deep Sea", icon: Waves, desc: "The darkness beneath the ocean." },
          { title: "The Belly", icon: ShieldAlert, desc: "The darkness within the fish." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4"
          >
            <item.icon className="text-blue-400 mx-auto" size={32} />
            <h5 className="text-xl font-serif font-bold text-cream">{item.title}</h5>
            <p className="text-cream/40 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const GlowInTheDarkVerse = ({ arabic, translation, reference }: { arabic: string, translation: string, reference: string }) => {
  return (
    <div className="my-32 py-24 px-8 bg-black rounded-[4rem] border border-gold/10 text-center relative group">
      <div className="absolute inset-0 bg-gold/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="relative z-10 space-y-10"
      >
        <p className="text-4xl md:text-6xl font-serif text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] leading-loose">
          {arabic}
        </p>
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-xl text-gold/80 font-serif italic leading-relaxed">
            "{translation}"
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/40">
            {reference}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const PrayerReductionInteraction = () => {
  const [clickCount, setClickCount] = useState(0);
  const [currentPrayers, setCurrentPrayers] = useState(50);
  const totalSteps = 9;

  const handleClick = () => {
    if (clickCount < totalSteps) {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      setCurrentPrayers(50 - (nextCount * 5));
      
      // Haptic feedback simulation
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      toast.success(`Prayers reduced by mercy: ${50 - (nextCount * 5)}`, {
        icon: '🙏',
        style: { background: '#0f172a', color: '#fbbf24', border: '1px solid #fbbf24' }
      });
    }
  };

  return (
    <div className="my-24 flex flex-col items-center justify-center space-y-12">
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gold/20 rounded-full blur-3xl"
        />
        <div className="relative z-10 w-64 h-64 rounded-full border-4 border-gold/30 flex items-center justify-center bg-black/40 backdrop-blur-xl">
          <motion.span 
            key={currentPrayers}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl font-serif text-gold font-black"
          >
            {currentPrayers}
          </motion.span>
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-serif text-cream italic">"O Muhammad, your people cannot handle fifty..."</h3>
        <p className="text-gold/60 uppercase tracking-widest text-xs font-black">Tap to plead for mercy</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={clickCount >= totalSteps}
        onClick={handleClick}
        className={cn(
          "px-10 py-5 rounded-full font-black uppercase tracking-[0.3em] transition-all duration-500",
          clickCount < totalSteps 
            ? "bg-gold text-slate-950 shadow-[0_0_30px_rgba(212,175,55,0.4)]" 
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        )}
      >
        {clickCount < totalSteps ? "Plead for Reduction" : "Commandment Finalized: 5 Prayers"}
      </motion.button>
    </div>
  );
};

const DustSwipeInteraction = ({ onComplete }: { onComplete: () => void }) => {
  const [swiped, setSwiped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [0, 200], [0, 45]);
  const opacity = useTransform(x, [0, 200], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100 || info.offset.y < -100) {
      setSwiped(true);
      onComplete();
      toast.success("Shahat al-Wujooh! The victory of Allah has come.", {
        icon: '✨',
        style: { background: '#0f172a', color: '#fbbf24', border: '1px solid #fbbf24' }
      });
    }
  };

  return (
    <div className="my-16 flex flex-col items-center justify-center space-y-8 bg-gold/5 p-12 rounded-[3rem] border border-gold/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gold/10 pointer-events-none" />
      
      <div className="text-center relative z-10">
        <h3 className="text-2xl font-serif text-gold font-bold mb-2">Throw the Dust of Defeat</h3>
        <p className="text-xs text-cream/60 uppercase tracking-widest font-black">Swipe Up-Right to release the divine gale</p>
      </div>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        className="w-32 h-32 bg-gold rounded-full shadow-[0_0_50px_rgba(212,175,55,0.4)] flex items-center justify-center cursor-grab active:cursor-grabbing relative z-10"
      >
        <div className="flex flex-col items-center text-slate-950">
          <Wind size={40} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase mt-2">Dust</span>
        </div>
      </motion.div>

      {swiped && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 20 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-white pointer-events-none z-50 rounded-full"
        />
      )}
    </div>
  );
};

const MiracleCongregation = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
      {['Adam', 'Ibrahim', 'Musa', 'Isa', 'Nuh', 'Yusuf', 'Idris', 'Yahya'].map((p, i) => (
        <motion.div
          key={p}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center group hover:bg-gold/10 hover:border-gold/30 transition-all cursor-default"
        >
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
            <Sparkles size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-tighter text-cream/60 group-hover:text-gold transition-colors">{p} (AS)</span>
        </motion.div>
      ))}
    </div>
  );
};

const ProphetBadge = ({ name, miracle }: { name: string, miracle: string }) => {
  const [showMiracle, setShowMiracle] = useState(false);
  
  return (
    <div className="md:fixed md:left-4 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-auto my-4 md:my-0">
      <div className="flex flex-col items-start space-y-4">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ x: 10 }}
          onClick={() => setShowMiracle(!showMiracle)}
          className="px-6 py-3 bg-gold text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-r-full shadow-2xl flex items-center gap-3 border-l-4 border-white"
        >
          <Sparkles size={14} />
          {name}
        </motion.button>
        
        <AnimatePresence>
          {showMiracle && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="p-6 bg-slate-900 border border-gold/30 rounded-2xl w-64 shadow-2xl glass-card backdrop-blur-2xl z-50"
            >
              <h4 className="text-gold font-bold mb-2 flex items-center gap-2">
                <Globe size={16} /> Miracle Chronicle
              </h4>
              <p className="text-cream/80 text-xs italic leading-relaxed">{miracle}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CosmicBackground = ({ progress }: { progress: MotionValue<number> }) => {
  const bgColor = useTransform(
    progress,
    [0, 0.3, 0.6, 0.9, 1],
    ['#020617', '#0f172a', '#1e1b4b', '#312e81', '#fbbf24']
  );
  
  const starOpacity = useTransform(progress, [0, 0.8, 1], [0.6, 1, 0]);
  const cosmicNebulaOpacity = useTransform(progress, [0.4, 0.8, 1], [0, 0.3, 0]);
  
  return (
    <motion.div 
      style={{ backgroundColor: bgColor }}
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
    >
      {/* Stars Layer */}
      <motion.div 
        style={{ opacity: starOpacity }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat opacity-20"
      />
      
      {/* Nebula Layer */}
      <motion.div 
        style={{ opacity: cosmicNebulaOpacity }}
        className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl animate-pulse"
      />

      {/* Radiant Glow at end */}
      <motion.div 
        style={{ 
          opacity: useTransform(progress, [0.85, 1], [0, 1]),
          scale: useTransform(progress, [0.85, 1], [1, 2.5])
        }}
        className="absolute inset-0 bg-gradient-radial from-gold/30 to-transparent blur-3xl flex items-center justify-center"
      >
         <div className="w-[100vw] h-[100vw] bg-white rounded-full blur-[120px] opacity-20" />
      </motion.div>
    </motion.div>
  );
};

const HealingPlant = () => {
  const [swiped, setSwiped] = useState(false);
  const [width, setWidth] = useState(0);

  return (
    <div className="my-24 p-12 bg-emerald-950/20 border border-emerald-500/20 rounded-[4rem] text-center space-y-12 overflow-hidden relative">
      <div className="space-y-4">
        <Droplets className="text-emerald-400 mx-auto" size={40} />
        <h3 className="text-3xl font-serif font-black text-emerald-400">The Healing Gourd</h3>
        <p className="text-emerald-200/60 text-sm max-w-sm mx-auto">
          Swipe to grow the leaves of the Yaqteen plant over the weary traveler.
        </p>
      </div>

      <div className="relative h-64 flex items-center justify-center">
        <User className={cn("text-emerald-100/20 transition-opacity duration-1000", swiped ? "opacity-100" : "opacity-40")} size={120} />
        
        <AnimatePresence>
          {swiped && (
            <>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
              </motion.div>
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="absolute inset-x-0 top-0 flex justify-center space-x-2"
              >
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-16 h-24 bg-emerald-600/40 rounded-full border border-emerald-400/30"
                  />
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="relative h-16 bg-white/5 rounded-2xl border border-white/10 overflow-hidden max-w-md mx-auto">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-emerald-500/40"
          style={{ width: `${width}%` }}
        />
        <input 
          type="range"
          min="0"
          max="100"
          value={width}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setWidth(val);
            if (val > 90) {
              setSwiped(true);
              toast.success("Healing complete. Self-care and recovery recognized.", { icon: '🌿' });
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] font-black uppercase tracking-widest text-emerald-400">
          {swiped ? "Restored" : "Swipe to heal"}
        </div>
      </div>
    </div>
  );
};

const InAppMihrab = () => {
  const [whisper, setWhisper] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <div className="my-24 p-12 md:p-20 bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/20 rounded-[4rem] text-center space-y-10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" />
      
      <div className="relative z-10 space-y-4">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="text-amber-500" size={32} />
        </div>
        <h3 className="text-3xl font-serif font-black text-amber-500">The In-App Mihrab</h3>
        <p className="text-amber-200/60 text-sm max-w-sm mx-auto">
          "He stood in his Mihrab and whispered..." Save weights of your heart here. Only Allah knows the unseen.
        </p>
      </div>

      {!saved ? (
        <div className="relative z-10 space-y-6 max-w-md mx-auto">
          <textarea 
            value={whisper}
            onChange={(e) => setWhisper(e.target.value)}
            placeholder="Type your hidden call..."
            className="w-full bg-slate-950/60 border border-amber-500/20 rounded-3xl p-8 text-cream placeholder:text-amber-500/20 focus:border-amber-500 focus:outline-none transition-all resize-none h-40"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (whisper.trim()) {
                setSaved(true);
                toast.success("Whisper saved in the Mihrab of your heart.", { icon: '✨' });
              }
            }}
            className="w-full py-6 bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
          >
            Save Whisper
          </motion.button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 p-12 bg-slate-950/40 rounded-[3rem] border border-amber-500/40 space-y-6"
        >
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-amber-500" size={24} />
          </div>
          <p className="text-cream/60 italic font-serif text-lg">
            "Never have I been in my supplication to You, my Lord, disappointed."
          </p>
          <button 
            onClick={() => {
              setSaved(false);
              setWhisper('');
            }}
            className="text-amber-500/40 hover:text-amber-500 text-[8px] font-black uppercase tracking-widest transition-colors"
          >
            Whisper Again
          </button>
        </motion.div>
      )}
    </div>
  );
};

const ZakariyaSilenceEffect = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for 3 days sign

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast.success("Silence broken. May your Dhikr be accepted.", { icon: '✨' });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  return (
    <div className="my-24 p-12 bg-slate-950 border border-amber-500/20 rounded-[4rem] text-center space-y-10 relative overflow-hidden">
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-amber-950/90 z-20 backdrop-blur-xl flex flex-col items-center justify-center p-12 space-y-8"
          >
            <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
            <div className="space-y-4">
              <h3 className="text-3xl font-serif font-black text-amber-500">Sacred Silence</h3>
              <p className="text-amber-200/60 text-sm">Focus Mode Active. No distractions. Only Remembrance.</p>
              <p className="text-6xl font-mono text-white pt-4">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <button 
              onClick={() => setIsActive(false)}
              className="text-amber-500/40 hover:text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
            >
              Break Silence early
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <Volume2 className="text-amber-500/40 mx-auto" size={40} />
        <h3 className="text-2xl font-serif font-black text-cream">The Three Days of Silence</h3>
        <p className="text-cream/40 text-sm max-w-sm mx-auto">
          "Your sign is that you will not speak to people for three days except by gesture."
        </p>
      </div>

      <button
        onClick={() => {
          setIsActive(true);
          setTimeLeft(180);
          toast("Focus Mode: Silence of Zakariya activated.", { icon: '🤫' });
        }}
        className="px-12 py-6 bg-white/5 border border-amber-500/20 text-amber-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-500/10 transition-all"
      >
        Enter Focus Mode
      </button>
    </div>
  );
};

const BrotherhoodPair = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [partner, setPartner] = useState<{ name: string, location: string } | null>(null);

  const partners = [
    { name: "Ahmed", location: "Cairo, Egypt" },
    { name: "Zainab", location: "London, UK" },
    { name: "Yusuf", location: "Jakarta, Indonesia" },
    { name: "Fatima", location: "Istanbul, Turkey" },
    { name: "Omar", location: "Toronto, Canada" }
  ];

  const handleJoin = () => {
    const randomPartner = partners[Math.floor(Math.random() * partners.length)];
    setPartner(randomPartner);
    setIsJoined(true);
    toast.success("Brotherhood (Mu'akhah) established. Challenge your partner!", { icon: '🤝' });
  };

  return (
    <div className="my-24 p-12 md:p-20 bg-emerald-950/20 border border-emerald-500/20 rounded-[4rem] text-center space-y-10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
      
      <div className="relative z-10 space-y-4">
        <Users className="text-emerald-500 mx-auto" size={40} />
        <h3 className="text-3xl font-serif font-black text-emerald-500">The Brotherhood (Mu'akhah)</h3>
        <p className="text-emerald-200/60 text-sm max-w-sm mx-auto">
          The Ansar shared half of everything with the Muhajirun. Pair up for a 7-day 'Good Deed Challenge'.
        </p>
      </div>

      {!isJoined ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoin}
          className="relative z-10 px-12 py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_rgba(5,150,105,0.3)] transition-all"
        >
          Pair Up Globally
        </motion.button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 p-12 bg-slate-950/40 rounded-[3rem] border border-emerald-500/40 space-y-8"
        >
          <div className="flex items-center justify-center -space-x-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <User className="text-emerald-500" size={24} />
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald-500/80 border-2 border-emerald-500 flex items-center justify-center">
              <span className="text-white font-black">{partner?.name[0]}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs">New Brotherhood Linked</p>
            <p className="text-2xl font-serif text-cream">You & {partner?.name}</p>
            <p className="text-emerald-200/40 text-sm">{partner?.location}</p>
          </div>
          <div className="pt-6 border-t border-emerald-500/20 grid grid-cols-2 gap-4">
            <div className="text-left space-y-1">
              <p className="text-emerald-500/60 text-[8px] font-black uppercase tracking-widest">Day 1 Challenge</p>
              <p className="text-cream text-xs italic">Feed a neighbor or a cat.</p>
            </div>
            <div className="text-right flex items-center justify-end text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const HiraTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast.success("Revelation context absorbed. Return to the Light.", { icon: '✨' });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  return (
    <div className="my-24 p-12 bg-slate-950 border border-emerald-500/20 rounded-[4rem] text-center space-y-10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510521212584-99bc2f216260?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" />
      
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-12 space-y-10"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-emerald-500/20 animate-ping absolute inset-0" />
              <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
                <Sparkles className="text-emerald-500" size={48} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif font-black text-emerald-500">Cave Meditation</h3>
              <p className="text-emerald-200/60 text-sm max-w-xs mx-auto italic">"Read in the name of your Lord who created..."</p>
              <p className="text-6xl font-mono text-white pt-6 tracking-tighter">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <button 
              onClick={() => setIsActive(false)}
              className="text-emerald-500/40 hover:text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] transition-colors"
            >
              Exit the Cave early
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 relative z-10">
        <Hourglass className="text-emerald-500 mx-auto" size={40} />
        <h3 className="text-2xl font-serif font-black text-cream">The Whisper of Hira</h3>
        <p className="text-cream/40 text-sm max-w-sm mx-auto">
          Take 5 minutes of total silence to reflect on your purpose, just as the Prophet (ﷺ) did.
        </p>
      </div>

      <button
        onClick={() => {
          setIsActive(true);
          setTimeLeft(300);
          toast("Cave Meditation: Audio filter shifted to 432Hz.", { icon: '🤫' });
        }}
        className="relative z-10 px-12 py-6 bg-white/5 border border-emerald-500/20 text-emerald-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500/10 transition-colors"
      >
        Enter Reflection Mode
      </button>
    </div>
  );
};

const FinalSermonScroll = () => {
  const sermonPoints = [
    { title: "Universal Equality", text: "No Arab has superiority over a non-Arab, nor a non-Arab over an Arab." },
    { title: "Rights of Women", text: "Treat women with kindness, for they are your partners and committed helpers." },
    { title: "Sanctity of Life", text: "Your blood and property are sacred and inviolable until you meet your Lord." },
    { title: "Abolition of Racism", text: "A white person is not superior to a black person, nor is a black person superior to a white person, except by piety." }
  ];

  return (
    <div className="my-24 p-1 md:p-24 bg-[#f8f5f0] border border-stone-200 rounded-[4rem] text-stone-900 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Scroll className="text-stone-900" size={300} />
      </div>

      <div className="text-center space-y-6 mb-20 relative z-10">
        <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.5em]">The Final Seal</p>
        <h3 className="text-5xl font-serif font-black text-stone-800">The Farewell Sermon</h3>
        <div className="w-24 h-1 bg-stone-200 mx-auto" />
      </div>

      <div className="space-y-12 max-w-2xl mx-auto relative z-10">
        {sermonPoints.map((point, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
            onClick={() => toast(`Applied Legacy: ${point.title}`, { icon: '⚖️' })}
          >
            <div className="flex items-start space-x-6">
              <div className="mt-1 w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-all">
                <span className="text-xs font-black italic">{i + 1}</span>
              </div>
              <div className="space-y-2 pt-1 border-t border-stone-100 w-full">
                <h4 className="text-sm font-black uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">{point.title}</h4>
                <p className="font-serif text-lg leading-relaxed text-stone-700 italic">"{point.text}"</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 pt-12 border-t border-stone-200 text-center space-y-4 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Mount Arafat, 10AH</p>
        <div className="flex justify-center space-x-6">
          <Share2 className="text-stone-300 hover:text-stone-900 cursor-pointer" size={20} />
          <HandHeart className="text-stone-300 hover:text-stone-900 cursor-pointer" size={20} />
        </div>
      </div>
    </div>
  );
};

const SpiderWebOverlay = ({ progress }: { progress: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 33 && progress < 66 ? 0.6 : 0 }}
      className="fixed inset-0 z-[101] pointer-events-none spider-web-overlay"
    />
  );
};

const TearDropTrigger = ({ onUnlock }: { onUnlock: () => void }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isHolding && !complete) {
      timer = setTimeout(() => {
        setComplete(true);
        onUnlock();
        toast.success("Patience rewarded. The trial passes.", { icon: '💧' });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isHolding, complete, onUnlock]);

  return (
    <div className="flex flex-col items-center space-y-8 my-20">
      <div className="text-center space-y-4">
        <Hourglass className="text-gold mx-auto animate-spin-slow" size={40} />
        <h4 className="text-gold font-black uppercase tracking-widest text-[10px]">The Trial of the Snake-Bite</h4>
        <p className="text-cream/60 font-serif italic text-sm">Hold down to endure the pain with patience</p>
      </div>

      <motion.button
        onMouseDown={() => setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
        onMouseLeave={() => setIsHolding(false)}
        onTouchStart={() => setIsHolding(true)}
        onTouchEnd={() => setIsHolding(false)}
        animate={{ 
          scale: isHolding ? 0.9 : 1,
          boxShadow: isHolding ? "0 0-100px rgba(212, 175, 55, 0.4)" : "0 0-20px rgba(212, 175, 55, 0.1)",
        }}
        className={cn(
          "w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative overflow-hidden",
          complete ? "bg-gold border-gold" : "bg-slate-950 border-gold/40"
        )}
      >
        <div className={cn("relative z-10 transition-colors", complete ? "text-slate-950" : "text-gold")}>
          {complete ? <CheckCircle2 size={40} /> : <Droplets size={40} />}
        </div>
        {isHolding && !complete && (
          <div className="ripple-tear shadow-[0_0_100px_rgba(212,175,55,0.6)]" />
        )}
      </motion.button>
    </div>
  );
};

const ClayBirdAnimation = () => {
  const { scrollYProgress } = useScroll();
  const flyX = useTransform(scrollYProgress, [0.6, 0.9], [-100, 500]);
  const flyY = useTransform(scrollYProgress, [0.6, 0.9], [50, -200]);
  const rotation = useTransform(scrollYProgress, [0.6, 0.9], [0, -45]);
  const opacity = useTransform(scrollYProgress, [0.6, 0.65, 0.85, 0.9], [0, 1, 1, 0]);

  return (
    <div className="my-24 h-96 p-12 bg-sky-950/20 border border-sky-400/20 rounded-[4rem] text-center relative overflow-hidden group">
      <div className="space-y-4 relative z-10">
        <Sparkles className="text-sky-400 mx-auto" size={40} />
        <h3 className="text-3xl font-serif font-black text-sky-400">The Breath of Life</h3>
        <p className="text-sky-200/60 italic font-serif">"I create for you out of clay the form of a bird, then I breathe into it..."</p>
      </div>

      <motion.div 
        style={{ x: flyX, y: flyY, rotate: rotation, opacity }}
        className="absolute left-1/4 top-1/2"
      >
        <Bird className="text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" size={64} />
      </motion.div>

      <div className="absolute inset-x-0 bottom-12 flex justify-center space-x-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-12 h-16 bg-slate-800 rounded-full opacity-40 blur-sm" />
        ))}
      </div>
      
      <p className="absolute bottom-6 inset-x-0 text-[8px] font-black uppercase tracking-[0.6em] text-sky-400/20">
        Scroll to breathe life
      </p>
    </div>
  );
};

const SOSWidget = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { duck, unduck } = useAudio();

  return (
    <div className="my-24 p-12 bg-slate-950 border border-blue-500/20 rounded-[4rem] text-center space-y-8 shadow-[0_20px_50px_rgba(30,58,138,0.2)]">
      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(37,99,235,0.4)] animate-pulse">
        <ShieldAlert className="text-white" size={32} />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-serif font-black text-white">The Prayer of Yunus</h3>
        <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.4em]">Prophetic S.O.S. Widget</p>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">A spiritual lifeline for moments of anxiety, debt, or deep distress.</p>
      </div>

      <button
        onClick={() => {
          const nextState = !isPlaying;
          setIsPlaying(nextState);
          if (nextState) {
             duck();
             toast("Soothing recitation activated. Allah hears from the abyss.", { icon: '🌊' });
          } else {
             unduck();
          }
        }}
        className={cn(
          "px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 flex items-center justify-center space-x-4 mx-auto",
          isPlaying ? "bg-blue-600 text-white" : "bg-white/5 text-blue-400 border border-blue-500/20 hover:bg-blue-500/10"
        )}
      >
        {isPlaying ? (
          <>
            <Pause size={16} />
            <span>Pause Recitation</span>
          </>
        ) : (
          <>
            <Play size={16} />
            <span>Activate S.O.S</span>
          </>
        )}
      </button>
    </div>
  );
};

const SpeakSoftlyTracker = () => {
  const [level, setLevel] = useState(50);
  const isGentle = level < 30;

  return (
    <div className="my-24 p-12 bg-slate-950 border border-gold/20 rounded-[4rem] space-y-10 text-center">
      <div className="space-y-4">
        <MessageSquare className="text-gold mx-auto" size={32} />
        <h3 className="text-2xl font-serif font-black text-gold">"Speak to him a Gentle Word"</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">Lower your tone to simulate the 'Qaulan Layyina' commanded of Musa and Harun.</p>
      </div>
      
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
          <motion.div 
            animate={{ width: `${level}%`, backgroundColor: level < 30 ? '#d4af37' : '#ef4444' }}
            className="h-full rounded-full transition-colors"
          />
        </div>
        <input 
          type="range"
          min="0"
          max="100"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
          className="w-full h-1 bg-white/5 appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:appearance-none"
        />
        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
          <span>Gentle (Layyina)</span>
          <span>Harsh (Ghaliz)</span>
        </div>
      </div>

      <AnimatePresence>
        {isGentle && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-serif italic text-lg"
          >
            "So that perhaps he may be reminded or fear [Allah]."
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const BlindnessToSight = ({ progress }: { progress: any }) => {
  const blur = useTransform(progress, [0, 0.7, 0.85, 1], ["8px", "4px", "0px", "0px"]);
  const saturate = useTransform(progress, [0, 0.7, 0.85, 1], [0.3, 0.6, 1.2, 1]);
  const contrast = useTransform(progress, [0, 0.7, 0.85, 1], [0.8, 0.9, 1.1, 1]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        backdropFilter: `blur(${blur}) saturate(${saturate}) contrast(${contrast})`,
        WebkitBackdropFilter: `blur(${blur}) saturate(${saturate}) contrast(${contrast})`,
      }}
    />
  );
};

const GriefMeter = ({ progress }: { progress: any }) => {
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);
  
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 h-64 w-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 hidden lg:block">
      <motion.div 
        style={{ height }}
        className="w-full bg-gradient-to-t from-gold via-amber-500 to-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
      />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-gold uppercase tracking-widest whitespace-nowrap">
        Years of Separation
      </div>
    </div>
  );
};

const FragrancePrompt = ({ readingProgress }: { readingProgress: number }) => {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (readingProgress > 80 && readingProgress < 85 && !triggered) {
      setTriggered(true);
    }
  }, [readingProgress, triggered]);

  if (!triggered) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-8 bg-slate-950 border border-gold/40 rounded-[3rem] shadow-2xl max-w-lg w-[90vw] text-center space-y-6"
    >
      <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
        <Wind className="text-gold" size={32} />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-serif font-black text-gold">The Fragrance of Yusuf</h3>
        <p className="text-cream/80 italic font-serif text-lg">
          "Close your eyes and breathe. What is the one hope you refuse to give up on?"
        </p>
      </div>
      <button 
        onClick={() => {
          setTriggered(false);
          toast.success("Hope recorded in the Book of Patience.", { icon: '📜' });
        }}
        className="px-10 py-4 bg-gold text-slate-950 rounded-xl font-black uppercase tracking-widest text-xs"
      >
        I refuse to give up
      </button>
    </motion.div>
  );
};

const LongingAudio = ({ progress }: { progress: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { duck, unduck } = useAudio();

  useEffect(() => {
    const neyVol = 1 - Math.min(1, Math.max(0, (progress.get() - 0.7) / 0.2));
    const orchVol = Math.min(1, Math.max(0, (progress.get() - 0.7) / 0.2));
    // Simulated volume change
  }, [progress]);

  return (
    <div className="fixed bottom-10 right-10 z-50">
       <motion.button
         onClick={() => {
           const nextState = !isPlaying;
           setIsPlaying(nextState);
           if (nextState) duck();
           else unduck();
         }}
         whileHover={{ scale: 1.1 }}
         className={cn(
           "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500",
           isPlaying ? "bg-amber-600 border-amber-400" : "bg-slate-900 border-white/10"
         )}
       >
         {isPlaying ? <Music className="text-white animate-pulse" size={24} /> : <Play className="text-gold" size={24} />}
       </motion.button>
       <AnimatePresence>
         {isPlaying && (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-950 px-4 py-2 rounded-full border border-gold/20 whitespace-nowrap"
           >
             <span className="text-[10px] font-black uppercase tracking-widest text-gold">
               {progress.get() < 0.7 ? "Mournful Ney Flute (432Hz)" : "Grand Orchestral Palace Theme"}
             </span>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const ZakariyaMihrab = ({ readingProgress }: { readingProgress: number }) => {
  if (readingProgress < 15 || readingProgress > 60) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-10">
      <div className="w-[80vw] h-[80vh] border-[40px] border-gold/20 rounded-t-[100vw] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />
      </div>
    </div>
  );
};

const ZakariyaSilence = ({ readingProgress }: { readingProgress: number }) => {
  const [isSilent, setIsSilent] = useState(false);

  useEffect(() => {
    if (readingProgress > 50 && readingProgress < 75) {
      setIsSilent(true);
      toast("The Sign of Silence: Words are tethered to the soul.", { icon: '🤫' });
    } else {
      setIsSilent(false);
    }
  }, [readingProgress]);

  if (!isSilent) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] pointer-events-none bg-slate-950/20 backdrop-blur-[2px] flex items-center justify-center"
    >
      <div className="text-center p-12 bg-slate-950 border border-gold/20 rounded-[3rem] shadow-2xl">
        <p className="text-gold font-serif italic text-2xl animate-pulse tracking-[0.2em]">Sacred Silence</p>
      </div>
    </motion.div>
  );
};

const PromiseWidget = () => {
  const [goal, setGoal] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  if (isLocked) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="my-12 p-12 bg-slate-950 border-4 border-gold rounded-[4rem] text-center space-y-8 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
      >
        <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Lock className="text-slate-950" size={40} />
        </div>
        <div className="space-y-4">
          <h4 className="text-3xl font-serif font-black text-gold uppercase tracking-tighter">The Covenant of Dhul-Kifl</h4>
          <p className="text-gold/60 text-sm tracking-widest uppercase font-black">Your Pledge is Sealed</p>
          <div className="py-6 px-8 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-2xl text-cream font-serif italic italic font-medium">"{goal}"</p>
          </div>
        </div>
        <p className="text-xs text-white/40 uppercase tracking-widest">The Nooraya library honors your integrity today.</p>
      </motion.div>
    );
  }

  return (
    <div className="my-12 p-12 bg-white/5 border border-white/10 rounded-[4rem] text-center space-y-10 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
      <div className="space-y-4 relative z-10">
        <h4 className="text-4xl font-serif font-black text-white">Lock in a Covenant</h4>
        <p className="text-white/60 max-w-md mx-auto">Dhul-Kifl (AS) never broke a promise. What is one truth you will hold onto today?</p>
      </div>
      <div className="max-w-md mx-auto space-y-6 relative z-10">
        <input 
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., I will not lie today..."
          className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white focus:border-gold outline-none transition-all text-center text-lg font-serif"
        />
        <button 
          onClick={() => goal && setIsLocked(true)}
          className={cn(
            "w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
            goal ? "bg-gold text-slate-950 shadow-xl scale-105" : "bg-white/10 text-white/30 cursor-not-allowed"
          )}
        >
          <Shield size={20} />
          Seal the Pledge
        </button>
      </div>
    </div>
  );
};

const ProphetEcho = ({ readingProgress }: { readingProgress: number }) => {
  const names = ["Musa", "Ibrahim", "Yusuf", "Nuh", "Isa"];
  const [activeName, setActiveName] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setActiveName(names[Math.floor(Math.random() * names.length)]);
        setTimeout(() => setActiveName(null), 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {activeName && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: Math.random() * 500 }}
            animate={{ opacity: 0.15, x: 1000 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 15, ease: "linear" }}
            className="text-[12rem] font-black text-gold/40 whitespace-nowrap italic pointer-events-none select-none"
          >
            {activeName}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LibraryCompletion = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[1000] bg-slate-950 flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute w-[150vw] h-[150vw] bg-gradient-radial from-gold/40 via-gold/5 to-transparent blur-[120px]" 
      />
      
      <div className="relative z-10 text-center space-y-12 px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(212,175,55,0.6)] mb-8">
            <BookOpenCheck className="text-slate-950" size={48} />
          </div>
          <h2 className="text-6xl md:text-8xl font-serif font-black text-gold uppercase tracking-tighter leading-none">
            Guardian of the <br /> Stories
          </h2>
          <p className="text-cream/60 max-w-2xl mx-auto text-xl font-serif italic">
            "You have journeyed from the first breath of Adam to the final message of Muhammad (ﷺ). The light of the Prophets is now a part of your chronicle."
          </p>
        </motion.div>
        
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-12 py-6 bg-gold text-slate-950 rounded-full font-black uppercase tracking-[0.3em] text-sm shadow-2xl"
        >
          Return to the Light
        </motion.button>
      </div>
    </motion.div>
  );
};

const GlowText = ({ children }: { children: string }) => {
  const parts = children.split(/(<glow>.*?<\/glow>)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('<glow>') && part.endsWith('</glow>')) {
          const content = part.slice(6, -7);
          return (
            <span key={i} className="glow-text miracle-aura">
              {content}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

const BrokenSwordsCounter = ({ progress }: { progress: any }) => {
  const count = useTransform(progress, [0.15, 0.35], [0, 9]);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    return count.on('change', (v) => {
      const rounded = Math.floor(v);
      if (rounded !== displayCount) {
        setDisplayCount(rounded);
        if (rounded > 0 && rounded <= 9) {
          if ('vibrate' in navigator) navigator.vibrate(50);
          // Play clashing metal sound (simulated with toast for now)
          toast(`Sword Broken! ${rounded}/9`, { icon: '⚔️', duration: 1000 });
        }
      }
    });
  }, [count, displayCount]);

  return (
    <div className="my-24 p-12 bg-slate-950 border border-gold/20 rounded-[4rem] text-center space-y-10 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gold/10 overflow-hidden">
        <motion.div className="h-full bg-gold" style={{ width: `${(displayCount / 9) * 100}%` }} />
      </div>

      <div className="space-y-4">
        <h3 className="text-3xl font-serif font-black text-gold">The Miracle of Mu'tah</h3>
        <p className="text-slate-500 font-serif italic">Scroll to experience the intensity of the duel</p>
      </div>

      <div className="flex justify-center items-center space-x-12">
        <div className="text-8xl font-serif font-black text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          {displayCount}
        </div>
        <div className="flex flex-col items-start space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">Broken Swords</span>
          <span className="text-cream/80 font-serif italic text-xl">In a single day</span>
        </div>
      </div>

      <div className="grid grid-cols-9 gap-4 pt-8">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{ 
              opacity: i < displayCount ? 1 : 0.1, 
              scale: i < displayCount ? 1 : 0.8,
              rotate: i < displayCount ? -45 : 0
            }}
            className="flex flex-col items-center"
          >
            <Sword className={cn(i < displayCount ? "text-red-500" : "text-slate-700")} size={24} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ScarMapVisual = () => {
  const points = [
    { name: "Sword Cut", x: "45%", y: "20%", type: "Yarmouk" },
    { name: "Arrow Wound", x: "55%", y: "45%", type: "Mu'tah" },
    { name: "Spear scar", x: "40%", y: "60%", type: "Al-Walaja" },
    { name: "Shattered Bone", x: "52%", y: "80%", type: "Fahil" },
  ];

  return (
    <div className="my-24 p-12 bg-slate-900/50 border border-white/5 rounded-[4rem] group relative">
      <div className="absolute inset-0 bg-red-950/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[3/4] bg-slate-950/50 rounded-[3rem] border border-white/10 p-8 flex items-center justify-center overflow-hidden">
          <User className="text-slate-800 w-full h-full" strokeWidth={0.5} />
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              style={{ left: p.x, top: p.y }}
              className="absolute group/scar cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-red-500/40 animate-pulse border border-red-500" />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-950 border border-red-500/40 px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover/scar:opacity-100 transition-opacity">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{p.name} - {p.type}</span>
              </div>
            </motion.div>
          ))}
          <div className="absolute inset-0 border-[20px] border-slate-950 pointer-events-none rounded-[3rem]" />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.5em]">The Unscathed Soul</span>
            <h3 className="text-4xl font-serif font-black text-cream leading-tight">The Map of <br />Sacrifice</h3>
            <p className="text-slate-400 font-serif italic text-lg opacity-80">
              "There is not a space on my body the size of a hand that does not have a scar."
            </p>
          </div>
          
          <div className="space-y-6">
            {points.map((p, i) => (
              <div key={i} className="flex items-center space-x-6 group/item cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                  <Activity size={18} />
                </div>
                <div>
                   <p className="text-cream font-bold text-sm tracking-tight">{p.name}</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{p.type} Campaign</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TacticalMap = ({ article }: { article: Article }) => {
  return (
    <div className="my-24 p-12 bg-slate-950 border border-gold/20 rounded-[4rem] relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent)]" />
      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Theater of War</h4>
          <h3 className="text-4xl font-serif font-black text-cream">Strategic Overview</h3>
        </div>
        <div className="aspect-video bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
           <MapPin className="text-gold animate-bounce" size={48} />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
           <p className="absolute bottom-8 text-cream font-serif italic text-lg">{article.prophet}'s Campaigns</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
            <span className="text-[10px] font-black text-gold uppercase tracking-widest block mb-1">Key Battle</span>
            <p className="text-cream font-bold">{article.stats?.greatestBattle || 'Legendary Conquest'}</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
            <span className="text-[10px] font-black text-gold uppercase tracking-widest block mb-1">Elite Feat</span>
            <p className="text-cream font-bold">{article.stats?.feat || 'Supreme Mastery'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TacticalBattleMap = () => {
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  
  const locations = [
    { id: 'mutah', name: 'Mu\'tah', x: '45%', y: '40%', desc: '3,000 vs 200,000. Khalid broke 9 swords.' },
    { id: 'yarmouk', name: 'Yarmouk', x: '52%', y: '30%', desc: '6 days of grueling combat. Cracked the Byzantine Empire.' },
    { id: 'walaja', name: 'Al-Walaja', x: '60%', y: '55%', desc: 'The perfect Double Envelopment maneuver.' },
    { id: 'qinnasrin', name: 'Qinnasrin', x: '55%', y: '20%', desc: 'The surrender of Northern Syria.' }
  ];

  return (
    <div className="my-24 p-12 bg-slate-950 border border-gold/20 rounded-[4rem] space-y-12 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent)] pointer-events-none" />
      
      <div className="text-center space-y-4 relative z-10">
        <h3 className="text-4xl font-serif font-black text-gold">Tactical World Map</h3>
        <p className="text-slate-400 font-serif italic">Select a location to view troop movements</p>
      </div>

      <div className="relative aspect-video bg-[#0c4a6e]/10 rounded-[3rem] border border-white/10 overflow-hidden group">
         <Globe className="absolute inset-0 m-auto text-gold/5 w-3/4 h-3/4 animate-pulse" />
         
         {/* Map Lines */}
         <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gold/50" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-gold/50" />
         </div>

         {locations.map(loc => (
           <motion.button
             key={loc.id}
             whileHover={{ scale: 1.1 }}
             onClick={() => {
               setSelectedLoc(loc.id);
               toast(`Moving troops to ${loc.name}...`, { icon: '🐎' });
             }}
             style={{ left: loc.x, top: loc.y }}
             className="absolute z-10 group/loc"
           >
             <div className={cn(
               "p-3 rounded-full border-2 transition-all duration-300",
               selectedLoc === loc.id ? "bg-gold border-slate-950 shadow-[0_0_20px_#d4af37]" : "bg-slate-950 border-gold/40 hover:border-gold"
             )}>
                <MapPin size={16} className={selectedLoc === loc.id ? "text-slate-950" : "text-gold"} />
             </div>
             
             <AnimatePresence>
               {selectedLoc === loc.id && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 10 }}
                   className="absolute top-12 left-1/2 -translate-x-1/2 w-56 p-4 bg-slate-900 border border-gold/20 rounded-2xl shadow-2xl text-center z-20"
                 >
                    <p className="text-gold font-black text-[10px] uppercase tracking-widest mb-1">{loc.name}</p>
                    <p className="text-cream/80 text-xs font-serif leading-relaxed">{loc.desc}</p>
                    
                    {/* Troop animation simulation */}
                    <div className="mt-4 flex justify-center space-x-2">
                       {[1, 2, 3].map(i => (
                         <motion.div
                           key={i}
                           animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                           transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                           className="w-1.5 h-1.5 bg-gold rounded-full"
                         />
                       ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.button>
         ))}

         {/* General Tactical Grid Overlay */}
         <div className="absolute inset-0 tactical-grid opacity-10 pointer-events-none" />
      </div>
    </div>
  );
};


const GateLiftInteraction = () => {
  const [liftStatus, setLiftStatus] = useState<number>(0); // 0 to 100
  const [isLifting, setIsLifting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleLift = () => {
    if (isSuccess) return;
    setIsLifting(true);
    setLiftStatus(prev => {
      const next = Math.min(prev + 5, 100);
      if (next < 100) {
         if ('vibrate' in navigator) navigator.vibrate(50);
      } else {
         setIsSuccess(true);
         if ('vibrate' in navigator) navigator.vibrate([100, 50, 200, 50, 400]);
         toast("GATE RIPPED FROM HINGES!", { icon: '🛡️', duration: 4000 });
      }
      return next;
    });
  };

  return (
    <div className="my-24 p-12 bg-slate-950 border-4 border-gold/40 rounded-[4rem] relative overflow-hidden flex flex-col items-center justify-center space-y-12">
      <div className="absolute inset-0 bg-red-950/20 mix-blend-overlay opacity-30" />
      
      <div className="text-center space-y-4 relative z-10">
        <h3 className="text-4xl font-serif font-black text-gold uppercase tracking-tighter">The Khaybar Trial</h3>
        <p className="text-slate-400 font-serif italic text-lg">Tap repeatedly to channel the strength of the Lion</p>
      </div>

      <div className="relative w-64 h-96 flex flex-col items-center justify-end">
         <motion.div 
           animate={{ 
             y: isSuccess ? -200 : -liftStatus,
             rotate: isSuccess ? 15 : 0,
             opacity: isSuccess ? 0.5 : 1
           }}
           className="w-48 h-80 bg-slate-800 border-4 border-slate-600 rounded-xl relative overflow-hidden flex items-center justify-center shadow-2xl"
         >
            <div className="absolute inset-0 bg-black/40 grid grid-cols-2 grid-rows-4 gap-4 p-4">
               {[...Array(8)].map((_, i) => <div key={i} className="border border-slate-700/50" />)}
            </div>
            <Lock className="text-slate-500" size={48} />
         </motion.div>
         
         <div className="absolute bottom-0 w-full h-8 bg-slate-900 border-t-2 border-slate-700" />
      </div>

      <button
        onClick={handleLift}
        className={cn(
          "relative z-10 w-full max-w-sm py-8 rounded-2xl font-black uppercase tracking-[0.4em] transition-all duration-300",
          isSuccess ? "bg-red-600 text-white shadow-[0_0_50px_#dc2626]" : "bg-gold text-slate-950 shadow-[0_0_30px_#d4af37]"
        )}
      >
        {isSuccess ? "CONQUERED" : "LIFT THE GATE"}
      </button>

      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-20 bg-gold flex items-center justify-center text-slate-950 font-black text-4xl p-8 text-center"
        >
          SEVEN MEN COULD NOT LIFT WHAT THE LION RIPPED WITH ONE HAND
        </motion.div>
      )}
    </div>
  );
};

const HijrahBedInteraction = ({ progress }: { progress: any }) => {
  const light = useTransform(progress, [0.15, 0.25], [1, 0]);
  return (
    <div className="my-24 p-12 bg-slate-950 border border-gold/20 rounded-[4rem] relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
      <motion.div 
        style={{ opacity: light }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1),transparent)] flicker-candle" 
      />
      
      <div className="relative z-10 text-center space-y-8">
        <div className="w-1 h-20 bg-gold/20 mx-auto rounded-full relative">
           <motion.div 
             animate={{ height: ["10%", "30%", "10%"], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute bottom-0 w-full bg-gold noor-glow rounded-full"
           />
        </div>
        <h3 className="text-3xl font-serif font-black text-gold">The Silent Sacrifice</h3>
        <p className="text-slate-500 font-serif italic max-w-md mx-auto">Ali (RA) lies in the bed of the Prophet (ﷺ), shielding the Messenger with his own life as the morning light approaches.</p>
      </div>

      <motion.div 
        style={{ opacity: useTransform(progress, [0.22, 0.3], [0, 1]) }}
        className="absolute inset-0 bg-white z-20 flex items-center justify-center text-slate-950 font-black text-4xl"
      >
        THE MORNING OF SAFETY
      </motion.div>
    </div>
  );
};

const EgoSpiritMeter = () => {
  const [spiritValue, setSpiritValue] = useState(50); // 0 (ego) to 100 (spirit)
  const [isStable, setIsStable] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isStable) {
        setSpiritValue(prev => {
          const drift = (Math.random() - 0.5) * 15;
          const next = Math.max(0, Math.min(100, prev + drift));
          return next;
        });
      }
    }, 150);
    return () => clearInterval(timer);
  }, [isStable]);

  const handleFocus = () => {
    setIsStable(true);
    setSpiritValue(98);
    if ('vibrate' in navigator) navigator.vibrate([100, 200, 400]);
    setTimeout(() => setShowVictory(true), 1500);
  };

  return (
    <div className="my-24 p-12 bg-black border border-white/10 rounded-[4rem] flex flex-col items-center space-y-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent)]" />
      
      <div className="text-center space-y-4 relative z-10">
        <h3 className="text-3xl font-serif font-black text-cream">Sincerity Over Ego</h3>
        <p className="text-slate-500 text-sm font-serif italic uppercase tracking-widest">Wait for the heart to cool...</p>
      </div>

      <div className="relative w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          animate={{ 
            width: `${spiritValue}%`,
            backgroundColor: spiritValue < 80 ? '#dc2626' : '#d4af37'
          }}
          className="h-full shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        />
      </div>

      <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
        <span className={spiritValue < 80 ? "text-red-500" : "text-slate-700"}>Personal Anger</span>
        <span className={spiritValue >= 80 ? "text-gold" : "text-slate-700"}>Divine Sincerity</span>
      </div>

      <button
        onClick={handleFocus}
        disabled={spiritValue < 85}
        className={cn(
          "relative z-10 px-12 py-5 rounded-xl font-black uppercase tracking-[0.4em] transition-all duration-500",
          spiritValue < 85 ? "bg-slate-900 text-slate-700 border border-white/5 cursor-not-allowed" : "bg-gold text-slate-950 shadow-[0_0_40px_#d4af37] scale-110"
        )}
      >
        Deliver Blow
      </button>

      {showVictory && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gold z-20 flex flex-col items-center justify-center p-8 text-center text-slate-950"
        >
          <Quote className="mb-4" size={32} />
          <p className="text-3xl font-serif font-black leading-tight">
            "I did not want to kill you out of my own ego."
          </p>
          <div className="mt-8 px-4 py-1 border border-slate-950 rounded-full text-[10px] font-black uppercase">Victory Through Sincerity</div>
        </motion.div>
      )}
    </div>
  );
};

const DoubleSwordAnimation = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-20">
      <motion.div 
        animate={{ 
          rotate: [45, 135, 45],
          x: [-100, 100, -100],
          y: [-50, 50, -50]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4"
      >
         <Sword className="text-slate-400" size={300} strokeWidth={0.5} />
      </motion.div>
      <motion.div 
        animate={{ 
          rotate: [-45, -135, -45],
          x: [100, -100, 100],
          y: [50, -50, 50]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4"
      >
         <Sword className="text-slate-500" size={300} strokeWidth={0.5} />
      </motion.div>
    </div>
  );
};

const ProtectorShield = () => {
  const [isActive, setIsActive] = useState(false);
  const [arrows, setArrows] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setArrows(prev => [
          ...prev.slice(-10),
          { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100 }
        ]);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div className="my-24 p-12 bg-slate-950 border-4 border-gold/40 rounded-[4rem] relative overflow-hidden flex flex-col items-center justify-center space-y-12">
      <div className="absolute inset-0 bg-red-950/20 mix-blend-overlay opacity-30" />
      
      {/* Flying Arrows */}
      <AnimatePresence>
        {isActive && arrows.map(arrow => (
          <motion.div
            key={arrow.id}
            initial={{ x: -200, y: arrow.y + "%", opacity: 0 }}
            animate={{ x: 1000, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "linear" }}
            className="absolute z-10 w-8 h-1 bg-slate-600 rounded-full"
          />
        ))}
      </AnimatePresence>

      {isActive && (
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-[20px] border-gold/40 rounded-[4rem] z-20 pointer-events-none"
        />
      )}

      <div className="text-center space-y-4 relative z-30">
        <h3 className="text-4xl font-serif font-black text-gold uppercase tracking-tighter">The Protector's Vow</h3>
        <p className="text-slate-400 font-serif italic text-lg">"Will you insult him when I follow his religion?"</p>
      </div>

      <button
        onClick={() => {
          setIsActive(!isActive);
          if (!isActive && 'vibrate' in navigator) navigator.vibrate([10, 50, 10]);
        }}
        className={cn(
          "relative z-30 w-full max-w-sm py-8 rounded-2xl font-black uppercase tracking-[0.4em] transition-all duration-300",
          isActive ? "bg-red-600 text-white shadow-[0_0_50px_#dc2626]" : "bg-gold text-slate-950 shadow-[0_0_30px_#d4af37]"
        )}
      >
        {isActive ? "SHIELD ACTIVE" : "STAND FOR THE TRUTH"}
      </button>

      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 right-8 z-30 bg-gold text-slate-950 px-4 py-1 rounded-full text-[10px] font-black uppercase animate-pulse"
        >
          FORCEFIELD ONLINE
        </motion.div>
      )}
    </div>
  );
};

const EmeraldWingsVisual = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {/* Radiant Green Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2),transparent)]" />
          
          {/* Translucent Wing Shapes */}
          <div className="relative w-full h-full">
            <motion.div 
              animate={{ 
                rotate: [-10, 10, -10],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-0 w-1/2 h-1/2 opacity-10"
            >
               <div className="w-full h-full border-l-[100px] border-emerald-500 rounded-full blur-3xl" />
            </motion.div>
            <motion.div 
              animate={{ 
                rotate: [10, -10, 10],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-0 w-1/2 h-1/2 opacity-10"
            >
               <div className="w-full h-full border-r-[100px] border-emerald-500 rounded-full blur-3xl" />
            </motion.div>
          </div>

          {/* Falling Gold-Emerald Feathers */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 0 }}
              animate={{ y: window.innerHeight + 100, rotate: 360, opacity: [0, 1, 0] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: i * 0.5 }}
              className="absolute w-2 h-8 bg-emerald-400/30 rounded-full blur-sm"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BadrOddsTracker = ({ progress, article }: { progress: any, article: Article }) => {
  const odds = useTransform(progress, [0, 1], [1000, 700]); // Meccan leaders falling
  const [currentOdds, setCurrentOdds] = useState(1000);

  useEffect(() => {
    return odds.on('change', (v) => setCurrentOdds(Math.floor(v)));
  }, [odds]);

  if (article.id !== 'battle-of-badr') return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 w-full z-[150] bg-slate-950/80 backdrop-blur-xl border-t border-gold/20 p-6 flex items-center justify-between px-12"
    >
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <p className="text-[9px] font-black text-gold/60 uppercase tracking-[0.3em] mb-1">Muslim Believers</p>
          <p className="text-2xl font-serif font-black text-gold">313</p>
        </div>
        <div className="h-10 w-px bg-gold/10" />
        <div className="text-center">
          <p className="text-[9px] font-black text-red-500/60 uppercase tracking-[0.3em] mb-1">Meccan Forces</p>
          <motion.p className="text-2xl font-serif font-black text-red-500">
            {currentOdds}
          </motion.p>
        </div>
      </div>
      <div className="hidden md:flex flex-col items-end">
        <span className="text-[10px] font-black text-gold uppercase tracking-[0.5em] mb-1 animate-pulse">The Day of Criterion</span>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gold"
            style={{ width: `${(313 / currentOdds) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const BadrBattlefield = () => {
  const [activePin, setActivePin] = useState<string | null>(null);

  const pins = [
    { id: 'prophet', x: 50, y: 30, title: 'Prophet (ﷺ)', desc: 'The Command Center (Arish) where intense Du\'a was made.' },
    { id: 'hamza', x: 45, y: 60, title: 'Hamza (RA)', desc: 'The Lion of Allah, who fought with two swords and exceptional bravery.' },
    { id: 'ali', x: 55, y: 60, title: 'Ali (RA)', desc: 'The heroic youth who overcame the Meccan champions in single combat.' },
    { id: 'wells', x: 50, y: 50, title: 'Badr Wells', desc: 'The strategic position secured by the Muslims to control the water supply.' }
  ];

  return (
    <div className="my-24 space-y-12">
      <div className="space-y-4 text-center">
        <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Tactical Overview</h4>
        <h2 className="text-4xl font-serif font-bold text-cream">The Sand Map of Badr</h2>
      </div>
      <div className="relative aspect-video bg-[#c2a37d] rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
        
        {/* Terrain details */}
        <div className="absolute top-[45%] left-[40%] w-[20%] h-[10%] bg-[#8b7355]/40 blur-xl rounded-full rotate-12" />
        <div className="absolute top-[55%] left-[50%] w-[15%] h-[5%] bg-[#8b7355]/30 blur-lg rounded-full -rotate-12" />

        {pins.map(pin => (
          <motion.button
            key={pin.id}
            whileHover={{ scale: 1.2 }}
            onClick={() => setActivePin(pin.id)}
            className="absolute z-10"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <div className={cn(
              "p-2 rounded-full border-2 transition-all duration-300",
              activePin === pin.id ? "bg-gold border-slate-900 scale-125" : "bg-slate-900 border-gold/40 hover:border-gold"
            )}>
              <MapPin size={16} className={activePin === pin.id ? "text-slate-950" : "text-gold"} />
            </div>
            {activePin === pin.id && (
              <motion.div 
                layoutId="badr-pin-info"
                className="absolute top-12 left-1/2 -translate-x-1/2 w-48 p-4 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-gold/20 z-20 text-center"
              >
                <p className="text-gold font-black text-[9px] uppercase tracking-widest mb-1">{pin.title}</p>
                <p className="text-cream/80 text-[10px] font-serif leading-relaxed px-1">{pin.desc}</p>
              </motion.div>
            )}
          </motion.button>
        ))}

        {/* Ambient Rain Glow (Night Before) */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-blue-900 mix-blend-overlay" />
      </div>
    </div>
  );
};

const AngelicStrike = ({ progress }: { progress: any }) => {
  const angelShow = useTransform(progress, [0.7, 0.75, 0.8, 0.85], [0, 1, 1, 0]);
  const angelY = useTransform(progress, [0.7, 0.85], [-200, 600]);

  return (
    <motion.div 
      style={{ opacity: angelShow, y: angelY }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
    >
      <div className="relative">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
              rotate: [0, 45, 0]
            }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            className="absolute w-2 h-40 bg-gradient-to-b from-transparent via-white/40 to-transparent blur-md"
            style={{ 
              left: `${(i - 6) * 40}px`,
              rotate: `${(i - 6) * 5}deg`
            }}
          />
        ))}
        <div className="w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
      </div>
    </motion.div>
  );
};

const TypewriterText = ({ text, delay = 0.05, className }: { text: string, delay?: number, className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, delay * 1000);
      return () => clearInterval(interval);
    }
  }, [isInView, text, delay]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {displayText.length < text.length && (
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-1 h-6 bg-gold ml-1 translate-y-1" />
      )}
    </span>
  );
};

const BrokenSwordDisplay = () => {
  return (
    <div className="relative w-48 h-48 mx-auto my-12 group perspective-1000">
      <motion.div 
        animate={{ 
          rotateY: [0, 360],
          rotateX: [0, 10, -10, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-full h-full relative preserve-3d"
      >
        {/* The Sword Base */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-32 bg-slate-400 noor-glow" />
        {/* The Break Point */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-slate-950 skew-x-12" />
        {/* Glow Element */}
        <div className="absolute inset-x-[-200%] inset-y-[-50%] bg-amber-500/10 blur-[80px] pointer-events-none group-hover:bg-amber-500/30 transition-colors" />
        <Sword className="absolute inset-0 text-gold m-auto drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]" size={80} />
      </motion.div>
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[9px] font-black text-gold uppercase tracking-[0.5em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Broken in Mu'tah
      </div>
    </div>
  );
};

const DhulFiqarDisplay = () => {
  return (
    <div className="relative w-80 h-80 mx-auto my-24 group perspective-1000">
      <motion.div 
        animate={{ 
          rotateY: [0, 360],
          rotateZ: [-5, 5, -5]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-full h-full relative preserve-3d"
      >
        {/* High-Quality Blade Render simulation */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-72 bg-gradient-to-b from-slate-100 via-white to-slate-400 noor-glow shadow-[0_0_60px_rgba(16,185,129,0.3)] border-x border-slate-300/50" 
          style={{ clipPath: 'polygon(0 0, 45% 15%, 55% 15%, 100% 0, 100% 100%, 0 100%)' }} 
        />
        
        {/* Light catching effect */}
        <motion.div 
          animate={{ x: [-100, 200] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 blur-xl"
        />

        {/* Engraved Verses (revealed on rotation/hover) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-48 flex flex-col items-center justify-between py-8 opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
           {[...Array(6)].map((_, i) => (
             <span key={i} className="text-[7px] text-slate-900 font-serif font-black select-none tracking-tighter" style={{ writingMode: 'vertical-rl' }}>
               لَا فَتَىٰ إِلَّا عَلِيٌّ وَلَا سَيْفَ إِلَّا ذُو الْفَقَارِ
             </span>
           ))}
        </div>

        <Sword className="absolute inset-0 text-emerald-500/20 m-auto" size={140} strokeWidth={0.5} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full text-center space-y-4"
      >
        <div className="inline-flex items-center space-x-3 px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
           <Zap className="text-emerald-500" size={12} />
           <span className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.4em]">The Heavens' Gift</span>
        </div>
        <p className="text-cream font-serif italic text-2xl leading-tight">&quot;There is no hero like Ali, and no sword like Dhul-Fiqar.&quot;</p>
      </motion.div>
    </div>
  );
};

const HeartbeatHaptic = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <motion.div 
      animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      className="fixed inset-0 pointer-events-none bg-red-950/10 z-[5] mix-blend-multiply"
    />
  );
};

const FlagBearerInteraction = ({ active }: { active: boolean }) => {
  const [holdingLeft, setHoldingLeft] = useState(false);
  const [holdingRight, setHoldingRight] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isMartyred, setIsMartyred] = useState(false);

  useEffect(() => {
    let interval: any;
    if (active && !isMartyred) {
      interval = setInterval(() => {
        if (!holdingLeft && !holdingRight) {
          setOpacity(prev => Math.max(0, prev - 0.05));
        } else {
          setOpacity(prev => Math.min(1, prev + 0.1));
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [active, holdingLeft, holdingRight, isMartyred]);

  return (
    <div className="my-24 relative min-h-[600px] bg-slate-950 rounded-[4rem] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-12">
      <div className="absolute inset-0 bg-red-950/10 pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-6 max-w-md">
        <h3 className="text-3xl font-serif font-black text-white uppercase tracking-tighter">The Banner of Uhud</h3>
        <p className="text-slate-400 font-serif italic">The flag must not fall. Hold it with everything you have.</p>
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center py-12">
        <motion.div 
          style={{ opacity }}
          className="relative"
        >
          <div className="w-2 h-64 bg-slate-700 mx-auto rounded-full relative">
            <motion.div 
               animate={{ rotate: [-2, 2, -2] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-0 right-0 w-48 h-32 bg-emerald-700/80 border-2 border-emerald-500 rounded-lg origin-left flex items-center justify-center"
            >
               <Flag className="text-emerald-400" size={40} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="flex w-full space-x-4">
        <button
          onMouseDown={() => setHoldingLeft(true)}
          onMouseUp={() => setHoldingLeft(false)}
          onTouchStart={() => setHoldingLeft(true)}
          onTouchEnd={() => setHoldingLeft(false)}
          className={cn(
            "flex-1 py-8 rounded-2xl font-black uppercase tracking-widest transition-all duration-300",
            holdingLeft ? "bg-emerald-600 shadow-[0_0_30px_#10b981]" : "bg-white/5 text-slate-500 border border-white/10"
          )}
        >
          RIGHT HAND
        </button>
        <button
          onMouseDown={() => setHoldingRight(true)}
          onMouseUp={() => setHoldingRight(false)}
          onTouchStart={() => setHoldingRight(true)}
          onTouchEnd={() => setHoldingRight(false)}
          className={cn(
            "flex-1 py-8 rounded-2xl font-black uppercase tracking-widest transition-all duration-300",
            holdingRight ? "bg-emerald-600 shadow-[0_0_30px_#10b981]" : "bg-white/5 text-slate-500 border border-white/10"
          )}
        >
          LEFT HAND
        </button>
      </div>

      <AnimatePresence>
        {opacity < 0.1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-slate-950/90 flex flex-center items-center justify-center p-8 text-center"
          >
             <p className="text-red-500 font-black text-2xl uppercase tracking-[0.2em]">The flag is fading... hold on!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FragranceIntro = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-white pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 silk-texture animate-pulse opacity-30" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="text-gold flex flex-col items-center"
      >
        <Sparkles size={80} className="mb-8" />
        <h2 className="text-6xl font-serif font-black tracking-tighter uppercase italic">The Scent of Mecca</h2>
      </motion.div>
    </motion.div>
  );
};

const HalfShroudOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[160] flex flex-col">
       <div className="h-2/3 bg-white/10 backdrop-blur-sm border-b border-white/20" />
       <div className="flex-1 bg-[linear-gradient(to_bottom,transparent,#064e3b)] relative">
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4">
             {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [40, 60, 40], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 bg-emerald-400 rounded-full"
                />
             ))}
          </div>
       </div>
    </div>
  );
};

const TrenchInteraction = () => {
  const [digProgress, setDigProgress] = useState(0);
  const [isStriking, setIsStriking] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);
  const [showProphecy, setShowProphecy] = useState<string | null>(null);

  const prophecies = [
    "I see the keys of Syria (Ash-Sham)!",
    "I see the keys of Persia (Faris)!",
    "I see the keys of Yemen!"
  ];

  const handleStrike = () => {
    if (strikeCount >= 3) return;
    
    setIsStriking(true);
    setStrikeCount(prev => prev + 1);
    setShowProphecy(prophecies[strikeCount]);
    
    if ('vibrate' in navigator) navigator.vibrate([30, 100, 30]);
    
    setTimeout(() => {
      setIsStriking(false);
      if (strikeCount < 2) setTimeout(() => setShowProphecy(null), 2000);
    }, 500);
  };

  return (
    <div className="my-24 p-12 bg-slate-950 border border-white/10 rounded-[4rem] relative overflow-hidden flex flex-col items-center space-y-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent)]" />
      
      {/* Lightning Strike VFX */}
      <AnimatePresence>
        {isStriking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      <div className="text-center space-y-4 relative z-10">
        <h3 className="text-3xl font-serif font-black text-cream">The Unbreakable Boulder</h3>
        <p className="text-slate-500 text-sm font-serif italic uppercase tracking-widest">Strike with the Prophet's (ﷺ) Strength</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
         <motion.div 
           animate={isStriking ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
           className="relative z-10"
         >
           <div className={cn(
             "w-48 h-48 bg-slate-400 rounded-2xl rotate-45 shadow-2xl transition-all duration-500",
             strikeCount > 0 && "opacity-80 scale-95",
             strikeCount > 1 && "opacity-60 scale-90",
             strikeCount > 2 && "opacity-30 blur-sm scale-75"
           )} />
         </motion.div>
         
         <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {showProphecy && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="bg-gold text-slate-950 px-8 py-3 rounded-full font-black text-sm uppercase tracking-tighter whitespace-nowrap z-20 shadow-[0_0_50px_rgba(212,175,55,0.6)]"
                >
                  {showProphecy}
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      <button
        onClick={handleStrike}
        disabled={strikeCount >= 3}
        className={cn(
          "relative z-10 px-12 py-5 rounded-xl font-black uppercase tracking-[0.4em] transition-all duration-500",
          strikeCount >= 3 ? "bg-slate-900 text-slate-700 cursor-not-allowed" : "bg-white text-slate-950 shadow-[0_0_40px_white] hover:scale-110 active:scale-95"
        )}
      >
        {strikeCount >= 3 ? "BOULDER SHATTERED" : "STRIKE ROCK"}
      </button>

      <div className="flex space-x-2 relative z-10">
        {[1, 2, 3].map(i => (
          <div key={i} className={cn(
            "w-3 h-3 rounded-full border border-white/20",
            strikeCount >= i ? "bg-gold border-gold" : "bg-transparent"
          )} />
        ))}
      </div>
    </div>
  );
};

const TacticalOverlayMap = () => {
  return (
    <div className="my-24 space-y-12">
      <div className="space-y-4 text-center">
        <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Engineered Defense</h4>
        <h2 className="text-4xl font-serif font-bold text-cream">The Blueprint of Salman (RA)</h2>
      </div>

      <div className="relative aspect-square md:aspect-video bg-slate-950 rounded-[3rem] overflow-hidden border-4 border-slate-900 shadow-2xl p-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* The Medina Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-dashed border-slate-800 rounded-full animate-[spin_20s_linear_infinite]" />
        
        {/* The Trench Lines */}
        <svg className="absolute inset-0 w-full h-full p-12 pointer-events-none">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 50,20 Q 300,50 550,20" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="8" 
            strokeDasharray="20 10" 
            className="drop-shadow-[0_0_10px_#d4af37]"
          />
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            d="M 50,20 L 50,300" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="4" 
            opacity="0.3"
          />
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.7 }}
            d="M 550,20 L 550,300" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="4" 
            opacity="0.3"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
           <div className="flex flex-col justify-between">
              <div className="p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 space-y-2">
                 <Shield className="text-gold mb-2" size={20} />
                 <p className="text-[10px] font-black uppercase text-gold">The Barrier</p>
                 <p className="text-xs text-slate-400">3.5km long trench preventing the 10,000-strong cavalry from crossing.</p>
              </div>
              <div className="p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 space-y-2">
                 <Users className="text-blue-400 mb-2" size={20} />
                 <p className="text-[10px] font-black uppercase text-blue-400">The Archers</p>
                 <p className="text-xs text-slate-400">Strategic points manned to pick off anyone attempting to swim or jump the gap.</p>
              </div>
           </div>
           
           <div className="flex items-center justify-center">
              <div className="text-center">
                 <motion.div 
                   animate={{ scale: [1, 1.1, 1] }} 
                   transition={{ duration: 3, repeat: Infinity }}
                   className="text-gold font-serif text-3xl font-black mb-2"
                 >
                   Medina
                 </motion.div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Safe Haven</p>
              </div>
           </div>

           <div className="flex flex-col justify-center">
              <div className="p-6 bg-red-950/20 backdrop-blur-md rounded-2xl border border-red-500/20 space-y-2">
                 <Sword className="text-red-500 mb-2" size={20} />
                 <p className="text-[10px] font-black uppercase text-red-500">The Ahzab</p>
                 <p className="text-xs text-slate-400">10,000 warriors trapped in the cold, unable to breach the 'Persian Blueprint'.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const CommanderStatCard = ({ article }: { article: Article }) => {
  if (!article.stats) return null;
  
  return (
    <div className="my-24 max-w-4xl mx-auto">
      <div className="glass-card p-12 md:p-16 border-2 border-gold/30 bg-midnight/60 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
           <Shield size={300} />
        </div>

        <div className="relative z-10 space-y-12">
          <div className="flex items-center justify-between pb-8 border-b border-gold/20">
             <div className="space-y-2">
                <span className="text-gold font-black text-[10px] uppercase tracking-[0.4em]">Legendary Profile</span>
                <h2 className="text-5xl font-serif font-bold text-cream">{article.prophet}</h2>
             </div>
             <motion.div 
               whileHover={{ rotate: 360 }}
               transition={{ duration: 1 }}
               className="w-20 h-20 rounded-[2rem] bg-gold flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(212,175,55,0.4)]"
             >
               <User size={32} />
             </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {Object.entries(article.stats).map(([key, value]) => (
               <div key={key} className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <p className="text-sm text-gold font-bold">{value as string}</p>
               </div>
             ))}
          </div>

          {article.hasBrokenSwordEffect && <BrokenSwordDisplay />}
          {article.hasDhulFiqarEffect && <DhulFiqarDisplay />}

          <div className="p-8 rounded-3xl bg-gold/5 border border-gold/10 italic font-serif text-slate-300">
             <Quote size={20} className="text-gold/40 mb-4" />
             <p className="text-lg leading-relaxed">
                {article.stats.quote || "A life without faith is a dry desert, and a warrior without wisdom is but a stone."}
             </p>
          </div>

          <div className="flex flex-wrap gap-3">
             {['Veteran', 'Legendary', 'Strategist', 'Brave'].map(tag => (
               <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScentTrailOverlay = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[160] overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: progress < 20 ? [0, 0.4, 0] : 0,
            scale: [1, 2, 1],
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-32 h-32 bg-gold/5 rounded-full blur-[60px]"
        />
      ))}
    </div>
  );
};

const PurpleFadeOverlay = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[155] bg-purple-900/30 mix-blend-overlay"
        />
      )}
    </AnimatePresence>
  );
};

const SilkToRoughTransition = ({ progress }: { progress: MotionValue<number> }) => {
  const silkOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  const roughOpacity = useTransform(progress, [0.4, 0.6], [0, 1]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div style={{ opacity: silkOpacity }} className="absolute inset-0 bg-[#fef3c7] silk-texture" />
      <motion.div style={{ opacity: roughOpacity }} className="absolute inset-0 bg-[#020617] opacity-60" />
    </div>
  );
};

const TrenchParticles = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[161] overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 0 }}
              animate={{ y: "-10%", opacity: [0, 0.5, 0] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              className="absolute w-1 h-1 bg-slate-500 rounded-full blur-[1px]"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

const ArchersSplitView = ({ progress }: { progress: number }) => {
  return (
    <div className="my-16 space-y-4">
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden border border-gold/20 flex flex-col">
        {/* Top: The Niners */}
        <div className="flex-1 bg-slate-900 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gold/5" />
          <div className="z-10 text-center">
            <div className="text-gold font-black text-2xl">9 ARCHERS</div>
            <p className="text-[10px] text-gold/60 uppercase tracking-widest font-bold">Holding the Ridge</p>
          </div>
        </div>
        {/* Bottom: The Departure */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: progress > 0.4 ? 100 : 0, opacity: progress > 0.4 ? 0.3 : 1 }}
          className="flex-1 bg-slate-950 flex items-center justify-center relative border-t border-white/5"
        >
          <div className="z-10 text-center">
            <div className="text-cream/40 font-black text-2xl">40 ARCHERS</div>
            <p className="text-[10px] text-cream/20 uppercase tracking-widest font-bold">Descending for Spoils</p>
          </div>
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-cream/40 uppercase tracking-[0.3em]">The Vulnerability Gap Widens</p>
      </div>
    </div>
  );
};

const ChaosRedFlash = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2, 0.5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="fixed inset-0 pointer-events-none z-[155] border-[20px] md:border-[40px] border-[#8B0000] blur-2xl"
        />
      )}
    </AnimatePresence>
  );
};

const LivingMartyrHold = ({ onHoldComplete }: { onHoldComplete: () => void }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPressing && holdProgress < 100) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            onHoldComplete();
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPressing, holdProgress, onHoldComplete]);

  return (
    <div className="my-16 flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-serif text-gold font-bold italic">"Whoever wants to look at a living martyr..."</h3>
        <p className="text-[10px] text-cream/60 uppercase tracking-widest">Hold to endure the sacrifice</p>
      </div>

      <div className="relative">
        <motion.div 
          animate={{ scale: isPressing ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute inset-0 bg-gold/20 rounded-full blur-2xl pointer-events-none"
        />
        <motion.button
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          whileTap={{ scale: 0.9 }}
          className="w-32 h-32 rounded-full bg-transparent border-2 border-gold/30 flex items-center justify-center relative overflow-hidden"
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gold transition-all duration-300" 
            style={{ height: `${holdProgress}%` }}
          />
          <Shield 
            size={40} 
            className={cn(
              "relative z-10 transition-colors duration-300",
              isPressing ? "text-slate-900" : "text-gold"
            )} 
          />
        </motion.button>
      </div>

      <p className="text-xs text-cream/40 italic">Shielding the Messenger (ﷺ) with every breath.</p>
    </div>
  );
};

const FiresBackground = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[151] overflow-hidden">
          {[...Array(150)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: Math.random() * 0.3,
                scale: Math.random() * 0.5 + 0.5,
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`
              }}
              animate={{ 
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
              className="absolute w-1 h-1 bg-gold rounded-full blur-[1px]"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

const IdolShatterInteraction = ({ onComplete }: { onComplete: () => void }) => {
  const [shattered, setShattered] = useState<number[]>([]);
  const idols = [1, 2, 3];

  const handleShatter = (id: number) => {
    if (!shattered.includes(id)) {
      const newShattered = [...shattered, id];
      setShattered(newShattered);
      toast("Truth has come, and falsehood has vanished!", { icon: '🔨' });
      if ('vibrate' in navigator) navigator.vibrate(50);
      if (newShattered.length === 3) {
        onComplete();
      }
    }
  };

  return (
    <div className="my-16 grid grid-cols-3 gap-4 md:gap-8 items-center justify-center p-8 md:p-12 bg-white/5 rounded-[3rem] border border-white/10">
      {idols.map(id => (
        <motion.div
          key={id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShatter(id)}
          className="relative cursor-pointer group"
        >
          <AnimatePresence mode="wait">
            {!shattered.includes(id) ? (
              <motion.div
                key="idol"
                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                className="w-full aspect-[3/4] bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-white/20 group-hover:border-gold/50 shadow-xl"
              >
                <div className="text-white/20 font-black text-2xl md:text-4xl">?</div>
              </motion.div>
            ) : (
              <motion.div
                key="shards"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full aspect-[3/4] flex items-center justify-center"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0 }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 60, 
                      y: (Math.random() - 0.5) * 60, 
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 1 }}
                    className="absolute w-2 h-2 bg-slate-600 rounded-sm"
                  />
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-gold"
                >
                  <Sparkles size={32} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const BlindnessBlur = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[153] backdrop-blur-[20px] bg-black/10"
          style={{ maskImage: 'radial-gradient(circle, transparent 20%, black 80%)' }}
        />
      )}
    </AnimatePresence>
  );
};

const SuraqahFrictionOverlay = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[154] bg-[#5e4b2e] mix-blend-multiply transition-all duration-1000"
        />
      )}
    </AnimatePresence>
  );
};

const CaveSilhouette = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[152] flex items-center justify-center"
        >
          <div className="w-full h-full border-[100px] border-black/80 rounded-t-[50%] blur-3xl scale-125" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  article,
  onBack,
  onComplete,
  isNightMode,
  setIsNightMode,
  isFocusMode,
  setIsFocusMode,
  isScrollingDown,
  readingProgress,
  setReadingProgress,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientBufferRef = useRef<AudioBuffer | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isAyahSpotlight, setIsAyahSpotlight] = useState(false);
  const [shownMilestones, setShownMilestones] = useState<Set<string>>(new Set());
  const [selectedWisdom, setSelectedWisdom] = useState<string | null>(null);
  const [isCaveActive, setIsCaveActive] = useState(false);
  const [isGardenRuined, setIsGardenRuined] = useState(false);
  const [hasPracticedGratitude, setHasPracticedGratitude] = useState(false);
  const [trustValue, setTrustValue] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showNomination, setShowNomination] = useState(false);
  const [justiceChoice, setJusticeChoice] = useState<string | null>(null);
  const [waqfGoal, setWaqfGoal] = useState<string | null>(null);
  const [isSuraqahStuck, setIsSuraqahStuck] = useState(false);
  const [isFirmSand, setIsFirmSand] = useState(false);
  const [isBattleShaking, setIsBattleShaking] = useState(false);
  const [dustThrown, setDustThrown] = useState(false);
  const [isChaosActive, setIsChaosActive] = useState(false);
  const [martyrHoldFinished, setMartyrHoldFinished] = useState(false);
  const [isMartyrHolding, setIsMartyrHolding] = useState(false);
  const [isFiresActive, setIsFiresActive] = useState(false);
  const [idolShatterFinished, setIdolShatterFinished] = useState(false);
  const [isIdolLock, setIsIdolLock] = useState(false);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const [showGoldDust, setShowGoldDust] = useState(false);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [isTearDropLocked, setIsTearDropLocked] = useState(false);
  const [hasUnlockedTearDrop, setHasUnlockedTearDrop] = useState(false);
  const [shatteredIdols, setShatteredIdols] = useState<number[]>([]);
  const [hasResumed, setHasResumed] = useState(false);
  const [isBlasting, setIsBlasting] = useState(false);
  const [isEyeBlessed, setIsEyeBlessed] = useState(false);
  const [completedArticles, setCompletedArticles] = useState<Set<string>>(new Set());
  const [showAchievement, setShowAchievement] = useState(false);
  const { duck, unduck, setActiveSurah, isNarrating, toggleNarration, isPlaying, togglePlay, activeReciter, setActiveReciter, setAmbientVolumeFactor } = useAudio();

  useEffect(() => {
    if (readingProgress > 98 && !completedArticles.has(article.id)) {
      const updated = new Set(completedArticles).add(article.id);
      setCompletedArticles(updated);
      
      const required = ['commander-khalid', 'ali-ibn-abi-talib', 'lion-hamza', 'winged-jafar', 'battle-of-trench-chronicle', 'musab-ibn-umayr'];
      const hasAll = required.every(id => updated.has(id));
      
      if (hasAll && !showAchievement) {
        setShowAchievement(true);
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 500]);
        toast.success("ACHIEVEMENT UNLOCKED: Lionheart of Islam", {
          duration: 6000,
          icon: '🦁',
          style: {
            background: '#d4af37',
            color: '#000',
            fontWeight: 'bold',
            border: '2px solid #000'
          }
        });
      }
    }
  }, [readingProgress, article.id, completedArticles]);

  const { isRTL } = useLanguage();

  const [isDustLocked, setIsDustLocked] = useState(false);

  useEffect(() => {
    if (article.hasSuraqahFriction) {
      // Suraqah chase is roughly 60-75% progress
      const isStuck = readingProgress > 60 && readingProgress < 75;
      setIsSuraqahStuck(isStuck);
    }
    if (article.hasFirmSandScroll) {
      // Rain and sand packing roughly 30-50% progress
      setIsFirmSand(readingProgress > 30 && readingProgress < 50);
    }
    if (article.hasBattleShudder) {
      // Angelic arrival roughly 75-90% progress
      setIsBattleShaking(readingProgress > 75 && readingProgress < 90);
    }
    if (article.hasChaosRedFlash) {
      // Chaos sequence roughly 55-80% progress
      setIsChaosActive(readingProgress > 55 && readingProgress < 80);
    }
    if (article.hasLivingMartyrHold && !martyrHoldFinished) {
      // Martyr hold roughly at 80% progress
      const shouldHold = readingProgress > 80 && readingProgress < 85;
      setIsMartyrHolding(shouldHold);
    } else {
      setIsMartyrHolding(false);
    }
    if (article.hasDustSwipe && !dustThrown) {
      // Dust swipe happens roughly at 70% progress
      const shouldLock = readingProgress > 70 && readingProgress < 75;
      setIsDustLocked(shouldLock);
    } else {
      setIsDustLocked(false);
    }
    if (article.hasFiresBackground) {
      // Campfires sequence roughly 5-30% progress
      setIsFiresActive(readingProgress > 5 && readingProgress < 30);
    }
    if (article.hasIdolShatter && !idolShatterFinished) {
      // Idol shattering sequence roughly 55-65% progress
      const shouldLock = readingProgress > 55 && readingProgress < 65;
      setIsIdolLock(shouldLock);
    } else {
      setIsIdolLock(false);
    }
  }, [readingProgress, article, dustThrown, martyrHoldFinished, idolShatterFinished]);

  // Audio Transition Logic for Day 04, 05 & 06
  useEffect(() => {
    if (article.id === 'roadmap-day-4') {
      if (readingProgress < 30) {
        setAmbientVolumeFactor(0.4);
      } else if (readingProgress >= 30 && readingProgress < 60) {
        setAmbientVolumeFactor(0.1);
      } else if (readingProgress >= 60 && readingProgress < 85) {
        setAmbientVolumeFactor(0.6);
      } else {
        setAmbientVolumeFactor(0.8);
      }
    }

    if (article.id === 'roadmap-day-5') {
      if (readingProgress < 30) {
        setAmbientVolumeFactor(0.5);
      } else if (readingProgress >= 30 && readingProgress < 60) {
        setAmbientVolumeFactor(0.2);
      } else if (readingProgress >= 60 && readingProgress < 85) {
        setAmbientVolumeFactor(0.7);
      } else {
        setAmbientVolumeFactor(1.0);
      }
    }

    if (article.id === 'roadmap-day-6') {
      if (readingProgress < 30) {
        // Chaotic percussion
        setAmbientVolumeFactor(0.6);
      } else if (readingProgress >= 30 && readingProgress < 55) {
        // Tension
        setAmbientVolumeFactor(0.1);
      } else if (readingProgress >= 55 && readingProgress < 85) {
        // Muffled heartbeat bassline
        setAmbientVolumeFactor(0.4);
      } else {
        // Recitation/Ambient wind
        setAmbientVolumeFactor(0.8);
      }
    }

    if (article.id === 'roadmap-day-7') {
      if (readingProgress < 30) {
        // Campfires/Atmospheric
        setAmbientVolumeFactor(0.4);
      } else if (readingProgress >= 30 && readingProgress < 65) {
        // Cleansing/Shattering
        setAmbientVolumeFactor(0.6);
      } else {
        // Athan/Mercy
        setAmbientVolumeFactor(0.9);
      }
    }
  }, [readingProgress, article.id, setAmbientVolumeFactor]);

  const starvationFilter = useTransform(scrollYProgress, [0.7, 0.9], ["grayscale(0%)", "grayscale(100%)"]);
  const taifShake = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 10, 0]);
  const battleShudder = useTransform(
    scrollYProgress,
    [0.75, 0.76, 0.77, 0.78, 0.79, 0.8],
    [0, -10, 10, -10, 10, 0]
  );

  // Meccan Crucible (The Trials & Miracles)
  const meccanGritOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 1, 0, 0]);
  const meccanNoorOpacity = useTransform(scrollYProgress, [0.55, 0.7, 1], [0, 1, 1]);
  const meccanBloodToWater = useTransform(scrollYProgress, [0.35, 0.5, 0.6], [0, 0.5, 0]);
  const meccanFontWeight = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], ["700", "700", "400", "400"]);
  const meccanSaturation = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], ["grayscale(100%)", "grayscale(100%)", "grayscale(0%)", "grayscale(0%)"]);

  const [showMiracleExplosion, setShowMiracleExplosion] = useState(false);
  const [hasExploded, setHasExploded] = useState(false);

  // Dual Path UX Logic
  useEffect(() => {
    if (article.id === 'islam-dual-path' && readingProgress > 60 && !hasExploded) {
      setShowMiracleExplosion(true);
      setHasExploded(true);
      if ('vibrate' in navigator) navigator.vibrate([50, 30, 50, 30, 100]);
      setTimeout(() => setShowMiracleExplosion(false), 3000);
    }
  }, [readingProgress, article.id, hasExploded]);

  const handleToggleNarration = () => {
    if (isNarrating) {
      toggleNarration();
      toast("Prophet Echo paused.", { icon: '🔇' });
    } else {
      const textToRead = `${article.title}. ${article.heroText}. ${article.summary}. ${article.sections.map(s => `${s.title}. ${s.content}`).join('. ')}`;
      toggleNarration(textToRead);
      toast("Voice of Nooraya active...", { icon: '🎙️' });
    }
  };

  useEffect(() => {
    if (article.id) setActiveSurah(article.id);
    
    // Resume scroll position for high density narrative
    if (article.isHighDensityNarrative && !hasResumed && scrollRef.current) {
      const savedPos = localStorage.getItem(`scroll_${article.id}`);
      if (savedPos) {
        const pos = parseFloat(savedPos);
        if (pos > 5) {
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ 
                top: (pos / 100) * (scrollRef.current.scrollHeight - scrollRef.current.clientHeight),
                behavior: 'smooth' 
              });
              toast.success('Resuming your chronicle journey...', { 
                icon: '📖',
                style: { background: '#0f172a', color: '#fbbf24', border: '1px solid #fbbf24' }
              });
            }
          }, 1000);
        }
      }
      setHasResumed(true);
    }

    // Abu Bakr Cave Scroll Lock logic
    if (article.hasTearDropTrigger && readingProgress > 53 && readingProgress < 55 && !hasUnlockedTearDrop) {
      setIsTearDropLocked(true);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollTop });
    }
    
    return () => {
      // Don't reset activeSurah on unmount to keep audio alive
      window.speechSynthesis.cancel();
      unduck();
    };
  }, [article.id, setActiveSurah]);

  useEffect(() => {
    if (readingProgress > 98 && !showGoldDust) {
      setShowGoldDust(true);
      toast("Wisdom Sealed! Gold Dust of Noor active.", { icon: '✨' });
    }
    
    // Save scroll position for high density narrative periodically
    if (article.isHighDensityNarrative && readingProgress > 1 && readingProgress < 99) {
      const timeout = setTimeout(() => {
        localStorage.setItem(`scroll_${article.id}`, readingProgress.toString());
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [readingProgress, article.id, article.isHighDensityNarrative]);
  
  // Background Parallax Layers
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.8, 0]);
  const bg2Opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0, 1, 0.8]);
  
  // Umar Transformation Logic
  const umarRageOpacity = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6], [1, 0.8, 0.2, 0]);
  const umarTealOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.7], [0, 0.8, 1]);
  const umarBgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.1]);
  
  // Dhun-Nurayn (Uthman) Two Lights Effect
  const light1X = useTransform(scrollYProgress, [0, 1], ['10%', '80%']);
  const light2X = useTransform(scrollYProgress, [0, 1], ['90%', '20%']);
  const lightY = useTransform(scrollYProgress, [0, 1], ['20%', '80%']);
  const lightOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  const bg3Opacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  
  const bg1Scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const bg2Scale = useTransform(scrollYProgress, [0.3, 0.8], [1.1, 1]);

  // Special Cave Transitions
  const caveBgOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const timeLapseX = useTransform(scrollYProgress, [0.3, 0.8], ["-100%", "100%"]);

  // Special Garden Transitions (Vibrant to Withered)
  const gardenGreenOpacity = useTransform(scrollYProgress, [0.1, 0.6], [1, 0]);
  const gardenGreyOpacity = useTransform(scrollYProgress, [0.4, 0.9], [0, 1]);
  
  // Ibrahim Fire Transition
  const fireBgOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35], [0, 0.8, 0]);
  const coolMintBgOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.6], [0, 0.6, 0]);
  
  // Lut Night-to-Dawn Transition
  const lutNightOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);
  const lutDawnOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

  // Yusuf Aesthetic Transitions
  const yusufWellOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.35], [0, 1, 0]);
  const yusufPrisonOpacity = useTransform(scrollYProgress, [0.4, 0.55, 0.65], [0, 1, 0]);
  const yusufPalaceOpacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 0.5, 1]);
  
  // Salih Mountain Parallax
  const mountainOffset = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Muhammad (ﷺ) Transitions
  const meccaOpacity = useTransform(scrollYProgress, [0, 0.4, 0.5], [1, 1, 0]);
  const medinaOpacity = useTransform(scrollYProgress, [0.4, 0.6, 1], [0, 1, 1]);
  const meccaFilter = useTransform(scrollYProgress, [0, 0.4], ["sepia(0.5) contrast(1.2)", "sepia(1) contrast(1.5)"]);
  const medinaFilter = useTransform(scrollYProgress, [0.5, 0.7], ["blur(10px) brightness(0.5)", "blur(0px) brightness(1)"]);

  // Trench / Salman al-Farsi Transitions
  const trenchEngineOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);
  const prophecyFlashOpacity = useTransform(scrollYProgress, [0.6, 0.7, 0.8], [0, 1, 0]);
  const empireGlowOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 0.4]);

  const defaultBackgrounds = [
    article.storylineBackgrounds?.[0] || 'https://images.unsplash.com/photo-1544413647-ad34c9c05877?auto=format&fit=crop&q=80&w=1920',
    article.storylineBackgrounds?.[1] || 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=1920'
  ];

  const nextArticle = useMemo(() => {
    const currentIndex = ARTICLES.findIndex(a => a.id === article.id);
    return ARTICLES[(currentIndex + 1) % ARTICLES.length];
  }, [article.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    setReadingProgress(0);
    setShownMilestones(new Set());
  }, [article.id]);

  useEffect(() => {
    // Dynamic Theming injection
    const root = document.documentElement;
    const themeColors: Record<string, string> = {
      'emerald': '#064e3b', // Deep Emerald
      'amber': '#451a03',   // Egyptian Sand
      'gold': '#451a03',    // Gold/Sand
      'blue': '#0c4a6e',    // Deep Blue
      'slate': '#0f172a',   // Deep Slate
      'rose': '#4c0519',    // Deep Rose
    };
    
    const color = article.color || 'slate';
    const primary = themeColors[color] || '#0f172a';
    
    root.style.setProperty('--article-theme-primary', primary);
    root.style.setProperty('--article-theme-accent', '#d4af37'); // Gold remains accent
    
    return () => {
      root.style.removeProperty('--article-theme-primary');
      root.style.removeProperty('--article-theme-accent');
    };
  }, [article.color]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const total = scrollHeight - clientHeight;
        const progress = (scrollTop / total) * 100;
        setReadingProgress(progress);

        if (article.isCaveExperience && progress > 25) {
          setIsCaveActive(true);
        } else {
          setIsCaveActive(false);
        }

        if (article.isGardenStory && progress > 50) {
          setIsGardenRuined(true);
        } else {
          setIsGardenRuined(false);
        }

        if (scrollTop > 200) {
          setIsFocusMode(true);
        } else {
          setIsFocusMode(false);
        }
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [article.id]);

  // Haptic & Pulse Feedback for Umar Story
  useEffect(() => {
    if (article.hasHeartbeatHaptic && isPlaying) {
      const interval = setInterval(() => {
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [article.hasHeartbeatHaptic, isPlaying]);

  useEffect(() => {
    if (article.id === 'roadmap-day-2') {
      // Increase wind volume as they read deeper into the desert torture
      const factor = 0.2 + (readingProgress / 100) * 0.4; // Grows from 0.2 to 0.6
      setAmbientVolumeFactor(factor);
    }
    return () => {
      if (article.id === 'roadmap-day-2') {
        setAmbientVolumeFactor(0.2); // Reset on unmount
      }
    };
  }, [readingProgress, article.id]);

  useEffect(() => {
    const triggerMilestone = (milestoneId: string, message: string, options?: any) => {
      if (!shownMilestones.has(milestoneId)) {
        toast(message, options);
        setShownMilestones(prev => new Set(prev).add(milestoneId));
      }
    };

    if (article.id === 'umar-ibn-al-khattab') {
      // Sword moment (approx 20% progress)
      if (readingProgress > 20 && readingProgress < 22) {
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
      // Verse moment (approx 50% progress)
      if (readingProgress > 45 && readingProgress < 47) {
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        triggerMilestone("umar-verse", "Heart Cooling: Surah Ta-Ha effect active.", { icon: '✨' });
      }
    }

    if (article.id === 'prophet-musa-chronicles') {
      // Strike the Sea moment (Act IV, approx 75% progress)
      if (readingProgress > 74 && readingProgress < 76) {
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        triggerMilestone("musa-sea", "The Sea Parts! Believe in the Miracle.", { icon: '🌊' });
      }
    }

    if (article.id === 'prophet-sulaiman-chronicles') {
      // Ant section (approx 40%)
      if (readingProgress > 39 && readingProgress < 41) {
        triggerMilestone("sulaiman-ants", "Tiny chirping detected: The Ants are speaking...", { icon: '🐜' });
      }
      // Hoopoe/Queen section (approx 65%)
      if (readingProgress > 64 && readingProgress < 66) {
        triggerMilestone("sulaiman-hoopoe", "Wings flapping: The Hoopoe has returned...", { icon: '🐦' });
      }
    }

    if (article.id === 'prophet-yunus-chronicles') {
      // Three Darknesses (approx 55%)
      if (readingProgress > 54 && readingProgress < 56) {
        triggerMilestone("yunus-darkness", "The Three Darknesses encompass you. Recognized GLORY in the abyss.", { 
          icon: '🐋',
          style: { background: '#020617', color: '#60a5fa' }
        });
      }
      // Gourd Plant (approx 80%)
      if (readingProgress > 79 && readingProgress < 81) {
        triggerMilestone("yunus-gourd", "The Yaqteen plant grows. Healing begins.", { icon: '🌿' });
      }
    }

    if (article.id === 'prophet-zakariya-yahya-chronicles') {
      // Mihrab/Silence (approx 45%)
      if (readingProgress > 44 && readingProgress < 46) {
        triggerMilestone("zakariya-mihrab", "Entering the Mihrab. Silence of Zakariya unlocked.", { icon: '🤫' });
      }
    }

    if (article.id === 'prophet-isa-chronicles') {
      // Cradle (approx 35%)
      if (readingProgress > 34 && readingProgress < 36) {
        triggerMilestone("isa-cradle", "The Infant Speaks: 'Indeed, I am the servant of Allah.'", { icon: '👶' });
      }
      // Table Spread (approx 65%)
      if (readingProgress > 64 && readingProgress < 66) {
        triggerMilestone("isa-table", "The Table Spread (Al-Ma'idah) descends from Heaven.", { icon: '🍱' });
      }
    }

    if (article.id === 'islam-dual-path') {
      // Trial section (approx 20%)
      if (readingProgress > 19 && readingProgress < 21) {
        triggerMilestone("revelation-weight", "The Weight of Revelation: 'Cover me! Cover me!'", { icon: '🛐' });
        if ('vibrate' in navigator) navigator.vibrate([300, 100, 300]); // Slow heavy heartbeat
      }
      // Ta'if (approx 35%)
      if (readingProgress > 34 && readingProgress < 36) {
        triggerMilestone("taif", "Ta'if: Blood to Water transition in progress...", { icon: '🌊' });
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      }
      // Moon Splitting (approx 65%)
      if (readingProgress > 64 && readingProgress < 66) {
        triggerMilestone("moon-split", "Noor: The Moon splits in two!", { icon: '✨' });
        if ('vibrate' in navigator) navigator.vibrate([50, 50, 50, 50, 100]); // Fast sparkling
      }
      // Isra (approx 85%)
      if (readingProgress > 84 && readingProgress < 86) {
        triggerMilestone("isra", "Miracle: Isra' wal-Mi'raj Journey...", { icon: '🌌' });
        if ('vibrate' in navigator) navigator.vibrate([50, 30, 50, 30, 50]);
      }
    }

    if (article.id === 'prophet-muhammad-chronicles') {
      // Revelation (approx 25%)
      if (readingProgress > 24 && readingProgress < 26) {
        triggerMilestone("hira", "The Cave of Hira: Angel Jibril commands 'READ!'", { icon: '🛐' });
      }
      // Migration/Spider (approx 55%)
      if (readingProgress > 54 && readingProgress < 56) {
        triggerMilestone("thawr", "The Cave of Thawr: A spider's web and nesting bird protected the Truth.", { icon: '🕸️' });
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
      }
      // Return to Mecca (approx 85%)
      if (readingProgress > 84 && readingProgress < 86) {
        triggerMilestone("mecca-return", "The Return: Mercy for the Meccans. 'Go, you are free.'", { icon: '🕋' });
      }
    }

    if (article.id === 'roadmap-day-5') {
      // Council (approx 15%)
      if (readingProgress > 14 && readingProgress < 16) {
        triggerMilestone("badr-council", "The Council of Honor: Unified Ranks.", { icon: '🛡️' });
      }
      // Night/Rain (approx 40%)
      if (readingProgress > 39 && readingProgress < 41) {
        triggerMilestone("badr-rain", "Sakinah descending with the rain... The sand packs firm.", { icon: '🌧️' });
        if ('vibrate' in navigator) navigator.vibrate([10, 50, 10]);
      }
      // Battle start (approx 65%)
      if (readingProgress > 64 && readingProgress < 66) {
        triggerMilestone("badr-battle", "The Clashing of Iron: The lines hold firm.", { icon: '⚔️' });
      }
    }

    if (article.id === 'roadmap-day-4') {
      // Assassins circle (approx 15%)
      if (readingProgress > 14 && readingProgress < 16) {
        triggerMilestone("hijrah-assassins", "The Assassins circle... Divine blindness descending.", { icon: '👁️' });
        if ('vibrate' in navigator) navigator.vibrate([20, 10, 20, 10]);
      }
      // Cave entry (approx 40%)
      if (readingProgress > 39 && readingProgress < 41) {
        triggerMilestone("hijrah-cave", "Into the Cave. The silence of trust and venom.", { icon: '🏔️' });
        if ('vibrate' in navigator) navigator.vibrate([100]);
      }
      // Suraqah chase (approx 65%)
      if (readingProgress > 64 && readingProgress < 66) {
        triggerMilestone("hijrah-suraqah", "Suraqah approaches! The earth begins to pull...", { icon: '🐎' });
        if ('vibrate' in navigator) navigator.vibrate([50, 50, 200]);
      }
    }

    if (article.id === 'roadmap-day-3') {
      // Buraq Gallop (approx 15%)
      if (readingProgress > 14 && readingProgress < 16) {
        triggerMilestone("isra-buraq", "The Buraq leaps: Night wind & galloping synced...", { icon: '🐎' });
        if ('vibrate' in navigator) navigator.vibrate([30, 20, 30, 20]);
      }
      // Al-Aqsa Prayer (approx 45%)
      if (readingProgress > 44 && readingProgress < 46) {
        triggerMilestone("isra-aqsa", "Echoing Sanctuary: Majestic vocal acoustics rising...", { icon: '🕌' });
        setAmbientVolumeFactor(0.8);
      }
      // Beyond the Boundary (approx 85%)
      if (readingProgress > 84 && readingProgress < 86) {
        triggerMilestone("isra-boundary", "Beyond the Boundary: Crystal-clear deep-space pad active.", { icon: '🌌' });
        setAmbientVolumeFactor(0.3);
      }
    }
  }, [readingProgress, article.id, shownMilestones]);

  // Ambient Sounds Logic
  useEffect(() => {
    const triggerAmbient = (id: string, message: string, options?: any) => {
      if (!shownMilestones.has(id)) {
        toast(message, options);
        setShownMilestones(prev => new Set(prev).add(id));
      }
    };

    if (isPlaying) {
      if (article.isCaveExperience || article.ambientType === 'cave') {
        triggerAmbient(`ambient-cave-${article.id}`, "Cave ambiance: wind and water drips synced...", { 
          icon: '💧', 
          duration: 3000,
          style: { background: '#050b1a', color: '#60a5fa', borderRadius: '1rem', border: '1px solid #1e40af' }
        });
      } else if (article.ambientType === 'desert') {
        triggerAmbient(`ambient-desert-${article.id}`, "Desert soundscape: soft wind and rustling palms synced...", { 
          icon: '🏜️', 
          duration: 3000,
          style: { background: '#1c1917', color: '#fbbf24', borderRadius: '1rem', border: '1px solid #fbbf24' }
        });
      } else if (article.ambientType === 'home') {
        triggerAmbient(`ambient-home-${article.id}`, "Warm home soundscape: faint Oud nursery synced...", { 
          icon: '🏠', 
          duration: 3000,
          style: { background: '#2d1b0d', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #92400e' }
        });
      } else if (article.id === 'prophet-musa-harun-partnership') {
        const isPalace = readingProgress < 50;
        const icon = isPalace ? '🏛️' : '🏜️';
        const msg = isPalace ? "Palace Ambiance: Distant echoes & royal Oud synced..." : "Desert Winds: The silence of the wilderness synced...";
        triggerAmbient(`ambient-musa-${isPalace ? 'palace' : 'desert'}`, msg, { 
          icon, 
          duration: 3000,
          style: { background: isPalace ? '#1e293b' : '#451a03', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else if (article.id === 'prophet-yunus-chronicles') {
        const stage = readingProgress < 30 ? 'ship' : readingProgress < 75 ? 'whale' : 'shore';
        const icon = stage === 'ship' ? '🚢' : stage === 'whale' ? '🐋' : '🌿';
        const msg = stage === 'ship' ? "Sea Storm: Roaring waves and distant thunder synced..." : 
                   stage === 'whale' ? "The Abyss: Muffled whale heartbeats and deep ocean currents..." :
                   "The Shore: Gentle breeze and the rustling of gourd leaves...";
        triggerAmbient(`ambient-yunus-${stage}`, msg, { 
          icon, 
          duration: 3000,
          style: { background: '#020617', color: '#60a5fa', borderRadius: '1rem', border: '1px solid #1d4ed8' }
        });
      } else if (article.id === 'prophet-zakariya-yahya-chronicles') {
        const isMihrab = readingProgress < 50;
        const icon = isMihrab ? '🕯️' : '🌲';
        const msg = isMihrab ? "Mihrab: Candle-lit whispers and sacred silence synced..." : "Wilderness: Soft desert winds and ascetic peace synced...";
        triggerAmbient(`ambient-zakariya-${isMihrab ? 'mihrab' : 'wild'}`, msg, { 
          icon, 
          duration: 3000,
          style: { background: '#2d1b0d', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #92400e' }
        });
      } else if (article.id === 'prophet-isa-chronicles') {
        const isCradle = readingProgress < 50;
        const icon = isCradle ? '✨' : '☁️';
        const msg = isCradle ? "Miracle: Ethereal glow and cradle echoes synced..." : "Ascension: Radiant light and heavenly spirit synced...";
        triggerAmbient(`ambient-isa-${isCradle ? 'miracle' : 'ascension'}`, msg, { 
          icon, 
          duration: 3000,
          style: { background: '#0f172a', color: '#38bdf8', borderRadius: '1rem', border: '1px solid #38bdf8' }
        });
      } else if (article.id === 'prophet-muhammad-chronicles') {
        const stage = readingProgress < 30 ? 'mecca' : readingProgress < 60 ? 'migration' : 'medina';
        const icon = stage === 'mecca' ? '🏔️' : stage === 'migration' ? '🌵' : '🌴';
        const msg = stage === 'mecca' ? "Mecca: Gritty silence of the desert night synced..." : 
                   stage === 'migration' ? "Migration: Whispering sands and echoing caves synced..." :
                   "Medina: Radiant gardens and busy palms synced...";
        triggerAmbient(`ambient-muhammad-${stage}`, msg, { 
          icon, 
          duration: 3500,
          style: { background: readingProgress < 60 ? '#1c1917' : '#064e3b', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else if (article.id === 'islam-dual-path') {
        const isGrit = readingProgress < 50;
        const icon = isGrit ? '🌬️' : '✨';
        const msg = isGrit ? "Grit: Harsh desert sandstorm & heavy winds synced..." : 
                   "Noor: Ethereal ringing & heavenly crystal tones synced...";
        triggerAmbient(`ambient-dual-${isGrit ? 'grit' : 'noor'}`, msg, { 
           icon, 
           duration: 4000,
           style: { 
             background: isGrit ? '#1c1917' : '#451a03', 
             color: '#fcd34d', 
             borderRadius: '1rem', 
             border: '1px solid #fcd34d' 
           }
         });
      } else if (article.id === 'umar-ibn-al-khattab') {
        const isHeat = readingProgress < 50;
        const icon = isHeat ? '🥁' : '📜';
        const msg = isHeat ? "Tense rhythmic drums: The Heat of Mecca" : "Serene Ta-Ha recitation: The Cooling of the Heart";
        triggerAmbient(`ambient-umar-${isHeat ? 'heat' : 'cool'}`, msg, { 
          icon, 
          duration: 3000,
          style: { background: isHeat ? '#450a0a' : '#134e4a', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else if (article.id === 'commander-khalid') {
        triggerAmbient(`ambient-khalid`, "War Drums (Duff) & Galloping Horses synced...", { 
          icon: '🥁', 
          duration: 3000,
          style: { background: '#1a0f0f', color: '#d1d5db', borderRadius: '1rem', border: '1px solid #7f1d1d' }
        });
      } else if (article.id === 'ali-ibn-abi-talib') {
        triggerAmbient(`ambient-ali`, "Deep Cello & Lion's Growl chants synced...", { 
          icon: '🦁', 
          duration: 3000,
          style: { background: '#064e3b', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else if (article.id === 'lion-hamza') {
        triggerAmbient(`ambient-hamza`, "Deep Rhythmic Tribal Drums synced...", { 
          icon: '🥁', 
          duration: 3000,
          style: { background: '#451a03', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else if (article.id === 'musab-ibn-umayr') {
        const stage = readingProgress < 33 ? 'rich' : readingProgress < 66 ? 'poor' : 'martyr';
        const icon = stage === 'rich' ? '🎻' : stage === 'poor' ? '🔇' : '📖';
        const msg = stage === 'rich' ? "Luxurious String (Oud) ambiance active..." : 
                    stage === 'poor' ? "Silent poverty ambiance active..." : 
                    "Sorrowful Recitation of Al-Imran active...";
        triggerAmbient(`ambient-musab-${stage}`, msg, { 
          icon, 
          duration: 4000,
          style: { background: stage === 'rich' ? '#fef3c7' : '#020617', color: '#b45309', borderRadius: '1rem' }
        });
      } else if (article.id === 'winged-jafar') {
        const isCourt = readingProgress < 60;
        const icon = isCourt ? '🗣️' : '🕊️';
        const msg = isCourt ? "Roaring Crowd & Royal Court ambiance synced..." : "Peaceful Ethereal Wind & Emerald Flight synced...";
        triggerAmbient(`ambient-jafar-${isCourt ? 'court' : 'flight'}`, msg, { 
          icon, 
          duration: 4000,
          style: { background: isCourt ? '#1e1b4b' : '#064e3b', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else if (article.id === 'abu-bakr-al-siddiq' || article.hasAbuBakrStyle) {
        triggerAmbient(`ambient-abubakr`, "Cave Echoes & Surah At-Tawbah (v40) active...", { 
          icon: '🕸️', 
          duration: 4000,
          style: { background: '#050b1a', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #1e40af' }
        });
      } else if (article.id === 'uthman-ibn-affan') {
        triggerAmbient(`ambient-uthman`, "Serene flowing water & melodic recitation active...", { 
          icon: '💧', 
          duration: 3000,
          style: { background: '#0c4a6e', color: '#fcd34d', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else if (article.id === 'prophet-yaqub-yusuf-chronicles') {
        const isMourn = readingProgress < 75;
        const icon = isMourn ? '🎻' : '👑';
        const msg = isMourn ? "Mournful Ney: The Loneliness of Ya'qub synced..." : "Royal Orchestral: The Palace of Egypt synced...";
        triggerAmbient(`ambient-yusuf-${isMourn ? 'mourn' : 'royal'}`, msg, { 
          icon, 
          duration: 3500,
          style: { background: isMourn ? '#451a03' : '#d4af37', color: '#fff', borderRadius: '1rem', border: '1px solid #fcd34d' }
        });
      } else {
        triggerAmbient(`ambient-default-${article.id}`, "Ambient cinematic soundscapes synced...", { 
          icon: '🌊', 
          duration: 2000,
          style: { background: '#0a1a1a', color: '#D4AF37', borderRadius: '1rem' }
        });
      }
    }
  }, [isPlaying, readingProgress, article, shownMilestones]);

  return (
    <motion.div 
      className={cn(
        "fixed inset-0 z-[150] overflow-hidden flex flex-col transition-all duration-1000",
        article.id === 'prophet-muhammad-chronicles' && readingProgress > 55 ? "radiant-mode" : 
        article.hasMeccanCrucibleStyle ? (readingProgress > 50 ? "meccan-noor" : "meccan-gritty") :
        article.hasMusabStyle && readingProgress < 33 ? "silk-texture bg-cream text-gold" :
        article.hasMusabStyle && readingProgress >= 33 && readingProgress < 66 ? "bg-slate-900 text-slate-400" :
        article.hasMusabStyle && readingProgress >= 66 ? "bg-red-950/20 text-white" :
        article.hasSaifullahStyle ? "bg-[#1a0f0f] text-slate-200" :
        article.hasLionStyle ? "bg-[#064e3b] text-slate-200" :
        article.hasHamzaStyle ? "bg-[#1a0f0f] text-slate-200" :
        article.hasJafarStyle && readingProgress < 60 ? "bg-[#1e1b4b] text-indigo-100" :
        article.hasJafarStyle && readingProgress >= 60 ? "bg-[#064e3b] text-emerald-100" :
        article.hasAbuBakrStyle && readingProgress > 33 && readingProgress < 66 ? "bg-slate-950 text-gold cavern-texture manuscript-serif" :
        article.hasDesertHermitStyle ? "bg-[#f4ead5] text-slate-900" : (isNightMode ? "bg-[var(--article-theme-primary)] text-slate-300" : "bg-cream text-midnight"),
        isAyahSpotlight ? "brightness-50" : "brightness-100",
        isCaveActive ? "bg-[#050b1a]" : "",
        isGardenRuined ? "grayscale-[100] brightness-50" : "",
        article.hasLionStyle && readingProgress < 15 ? "brightness-50" : ""
      )}
      style={{ 
        filter: article.hasStarvationFilter && readingProgress < 50 ? starvationFilter : 
                (article.hasEyeBlessing && !isEyeBlessed && readingProgress > 30 && readingProgress < 52 ? 'blur(15px) grayscale(0.2)' : 'none'),
        x: article.hasTaifShake ? taifShake : 0
      }}
    >
      {article.hasHeartbeatHaptic && <HeartbeatHaptic active={true} />}
      {article.hasSpiderWebOverlay && <SpiderWebOverlay progress={readingProgress} />}
      {article.hasFragranceIntro && readingProgress < 10 && <ScentTrailOverlay progress={readingProgress} />}
      {article.hasPurpleFade && <PurpleFadeOverlay active={readingProgress > 70} />}
      {article.hasSilkToRoughTransition && <SilkToRoughTransition progress={scrollYProgress} />}
      {article.hasTrenchStyle && <TrenchParticles active={readingProgress > 20 && readingProgress < 80} />}
      {article.hasCaveSilhouette && <CaveSilhouette active={readingProgress > 33 && readingProgress < 66} />}
      
      {/* Tear Drop Lock Overlay */}
      {isTearDropLocked && (
        <div className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 text-center animate-in fade-in duration-1000">
          <div className="space-y-12 max-w-md">
            <TearDropTrigger onUnlock={() => {
              setIsTearDropLocked(false);
              setHasUnlockedTearDrop(true);
            }} />
            <div className="space-y-4">
              <h4 className="text-2xl font-serif text-cream">Forbidden to Flinch</h4>
              <p className="text-slate-400 text-sm font-serif italic italic font-medium leading-relaxed">
                "Do not grieve, for Allah is with us."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Eye Blessing Overlay */}
      {article.hasEyeBlessing && !isEyeBlessed && readingProgress > 30 && readingProgress < 52 && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-auto">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-12 glass-card text-center space-y-8 max-w-md mx-6 border-gold/40"
          >
            <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto noor-glow">
               <Eye className="text-gold" size={48} />
            </div>
            <div className="space-y-4">
              <h4 className="text-3xl font-serif font-black text-gold uppercase tracking-tight">The Eye of Khaybar</h4>
              <p className="text-cream/90 text-lg italic font-serif leading-tight">"Ali, come forward. Tomorrow I will give the banner to one who loves Allah and His Messenger."</p>
              <p className="text-slate-400 text-[10px] font-sans uppercase tracking-[0.2em] font-black">The infection obscures your vision. Seek the touch of the Beloved (ﷺ).</p>
            </div>
            <button
              onClick={() => {
                setIsEyeBlessed(true);
                toast("Eyes Healed by the Prophet's (ﷺ) Touch!", { icon: '✨' });
                if ('vibrate' in navigator) navigator.vibrate([50, 100, 200]);
              }}
              className="w-full py-5 bg-gold text-slate-950 font-black uppercase tracking-[0.4em] rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              Seek Blessing
            </button>
          </motion.div>
        </div>
      )}

      {/* Miracle Particle Explosion */}
      <AnimatePresence>
        {showMiracleExplosion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[300] flex items-center justify-center overflow-hidden"
          >
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ 
                  x: (Math.random() - 0.5) * window.innerWidth * 1.5,
                  y: (Math.random() - 0.5) * window.innerHeight * 1.5,
                  scale: [0, 2, 0],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-3 h-3 bg-gold rounded-full shadow-[0_0_20px_#d4af37]"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meccan Crucible Overlays */}
      {article.hasMeccanBloodToWater && (
        <>
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 0.6, 0]) }}
            className="fixed inset-0 bg-red-900/40 pointer-events-none z-[165]"
          />
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0.45, 0.55, 0.65], [0, 0.6, 0]) }}
            className="fixed inset-0 bg-cyan-900/40 pointer-events-none z-[165]"
          />
        </>
      )}

      {/* Steel Reflection Effect */}
      {article.hasSteelReflection && (
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.1]),
            background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
            backgroundSize: "200% 200%",
            backgroundPosition: useTransform(scrollYProgress, [0, 1], ["0% 0%", "100% 100%"])
          }}
          className="fixed inset-0 pointer-events-none z-[1]"
        />
      )}

      {/* Noor Mode Particle Overlay */}
      {article.hasNoorMode && (
        <motion.div 
          style={{ opacity: meccanNoorOpacity }}
          className="fixed inset-0 pointer-events-none z-[201] overflow-hidden"
        >
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
                y: ["100vh", "-10vh"],
                x: [`${Math.random() * 100}vw`, `${(Math.random() - 0.5) * 20 + 50}vw`]
              }}
              transition={{ 
                duration: 4 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-2 h-2 bg-gold/60 rounded-full blur-[2px] shadow-[0_0_10px_#d4af37]"
            />
          ))}
        </motion.div>
      )}

      {/* Grit Mode Filter */}
      {article.hasGritMode && (
        <motion.div 
          style={{ backdropFilter: meccanSaturation }}
          className="fixed inset-0 pointer-events-none z-[190]"
        />
      )}

      {/* Fragrance Intro */}
      {article.hasFragranceIntro && readingProgress < 5 && <FragranceIntro />}

      {/* Half Shroud Overlay */}
      {article.hasHalfShroudOverlay && readingProgress > 95 && <HalfShroudOverlay />}

      {/* Emerald Wings Visual */}
      {article.hasEmeraldWings && <EmeraldWingsVisual active={readingProgress > 60} />}

      {/* Double Swords Animation */}
      {article.hasDoubleSwords && <DoubleSwordAnimation />}

      {/* Bow Snap Effect */}
      {article.hasBowSnap && readingProgress > 25 && readingProgress < 30 && (
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: [0, 1, 0] }}
           onAnimationStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(200);
              toast("BOW STRING SNAP!", { icon: '🏹' });
           }}
           className="fixed inset-0 z-[300] bg-white pointer-events-none"
         />
      )}

      {/* Golden String Progress Bar */}
      <div className={cn(
        "fixed top-1/2 -translate-y-1/2 h-[60vh] w-[1px] bg-gold/10 z-[160] hidden md:block",
        isRTL ? "right-10" : "left-10"
      )}>
        <motion.div 
          className="absolute top-0 left-0 w-full bg-gold noor-glow shadow-[0_0_15px_rgba(212,175,55,0.8)]"
          style={{ height: `${readingProgress}%` }}
        />
        {/* The Traveling Light */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-gold rounded-full noor-glow shadow-[0_0_20px_#d4af37]"
          style={{ top: `${readingProgress}%` }}
        >
          <div className="absolute inset-0 animate-ping bg-gold/40 rounded-full" />
        </motion.div>
      </div>
      
      {article.hasBlindnessToSight && <BlindnessToSight progress={scrollYProgress} />}
      {article.hasGriefMeter && <GriefMeter progress={scrollYProgress} />}
      {article.hasFragrancePrompt && <FragrancePrompt readingProgress={readingProgress} />}
      {article.hasBlindnessToSight && <LongingAudio progress={scrollYProgress} />}
      {article.hasInAppMihrab && <ZakariyaMihrab readingProgress={readingProgress} />}
      {article.hasZakariyaSilence && <ZakariyaSilence readingProgress={readingProgress} />}
      {article.hasProphetEcho && <ProphetEcho readingProgress={readingProgress} />}
      
      {article.hasBadrEngine && (
        <>
          <BadrOddsTracker progress={scrollYProgress} article={article} />
          <AngelicStrike progress={scrollYProgress} />
        </>
      )}

      {/* Gold Dust Particles */}
      <AnimatePresence>
        {showGoldDust && (
          <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: '100%', x: `${Math.random() * 100}%` }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: '-10%', 
                  x: `${Math.random() * 100}%`,
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 4, 
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-1 h-1 bg-gold rounded-full blur-[1px]"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
      {/* Background Parallax Layers */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Trench Layer */}
        {article.hasTrenchStyle && (
          <motion.div 
            style={{ opacity: trenchEngineOpacity }}
            className="fixed inset-0 z-0 bg-[#0f172a]"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
             <motion.div 
               style={{ opacity: prophecyFlashOpacity }}
               className="absolute inset-0 bg-blue-400/10 mix-blend-screen"
             />
             <motion.div 
               style={{ opacity: empireGlowOpacity }}
               className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent)]"
             />
          </motion.div>
        )}
        {/* Light Rays Layer */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]), opacity: 0.2 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute top-[20%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.05),transparent_40%)]" />
        </motion.div>

        {article.isCaveExperience && (
          <>
            <motion.div 
              style={{ opacity: caveBgOpacity }}
              className="absolute inset-0 bg-gradient-to-b from-[#050b1a] via-[#0a1a3a] to-[#050b1a] z-0"
            />
            {/* Time-Lapse Elements */}
            <motion.div 
              style={{ x: timeLapseX, opacity: caveBgOpacity }}
              className="absolute top-20 left-0 w-full flex justify-around pointer-events-none z-10"
            >
              <Sun className="text-gold/20" size={120} />
              <Moon className="text-blue-200/20" size={100} />
            </motion.div>
          </>
        )}

        {article.isGardenStory && (
          <>
            <motion.div 
              style={{ opacity: gardenGreenOpacity }}
              className="absolute inset-0 z-0"
            >
              <img src={defaultBackgrounds[0]} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-emerald-950/20" />
            </motion.div>
            <motion.div 
              style={{ opacity: gardenGreyOpacity }}
              className="absolute inset-0 z-0 grayscale brightness-50"
            >
              <img src={defaultBackgrounds[1]} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-slate-950/40" />
            </motion.div>
          </>
        )}

        {(article.id === 'prophet-ibrahim-search' || article.hasFireCoolingEffect) && (
          <>
            <motion.div 
              style={{ opacity: fireBgOpacity }}
              className="absolute inset-0 bg-red-900/40 mix-blend-overlay pointer-events-none"
            />
            <motion.div 
              style={{ opacity: coolMintBgOpacity }}
              className="absolute inset-0 bg-emerald-400/20 mix-blend-screen pointer-events-none"
            />
          </>
        )}

        {article.hasLutTransition && (
          <>
            <motion.div 
              style={{ opacity: lutNightOpacity }}
              className="absolute inset-0 bg-slate-950 pointer-events-none"
            />
            <motion.div 
              style={{ opacity: lutDawnOpacity }}
              className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 via-orange-500/10 to-transparent pointer-events-none"
            />
          </>
        )}

        {article.hasYusufTransitions && (
          <>
            <motion.div 
              style={{ opacity: yusufWellOpacity }}
              className="absolute inset-0 bg-[#020617] pointer-events-none"
            />
            <motion.div 
              style={{ opacity: yusufPrisonOpacity }}
              className="absolute inset-0 bg-[#1e293b]/60 mix-blend-multiply pointer-events-none"
            />
            <motion.div 
              style={{ opacity: yusufPalaceOpacity }}
              className="absolute inset-0 bg-gradient-to-b from-gold/10 via-white/5 to-transparent pointer-events-none"
            />
          </>
        )}

        {article.hasMeccaToMedinaTransition && (
          <>
            <motion.div 
              style={{ opacity: meccaOpacity, filter: meccaFilter }}
              className="absolute inset-0 z-0 bg-[#451a03]"
            >
              <img src={defaultBackgrounds[0]} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
            </motion.div>
            <motion.div 
              style={{ opacity: medinaOpacity, filter: medinaFilter }}
              className="absolute inset-0 z-0 bg-[#064e3b]"
            >
              <img src={defaultBackgrounds[1]} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-emerald-950/40 mix-blend-overlay" />
            </motion.div>
          </>
        )}

        {!article.isGardenStory && !article.isCaveExperience && article.id !== 'umar-ibn-al-khattab' && !article.hasMeccaToMedinaTransition && !article.hasCosmicAscent && (
          <>
            <motion.div 
              style={{ opacity: bg1Opacity, scale: bg1Scale }}
              className="absolute inset-0 grayscale-[0.3] brightness-[0.2]"
            >
              <img src={defaultBackgrounds[0]} className="w-full h-full object-cover" alt="" />
            </motion.div>
            <motion.div 
              style={{ opacity: bg2Opacity, scale: bg2Scale }}
              className="absolute inset-0 grayscale-[0.2] brightness-[0.1]"
            >
              <img src={defaultBackgrounds[1]} className="w-full h-full object-cover" alt="" />
            </motion.div>
          </>
        )}

        {article.hasCosmicAscent && <CosmicBackground progress={scrollYProgress} />}
        {article.hasBlindnessBlur && <BlindnessBlur active={readingProgress < 25} />}
        {article.hasCaveSilhouette && <CaveSilhouette active={readingProgress >= 30 && readingProgress < 55} />}
        {article.hasSuraqahFriction && <SuraqahFrictionOverlay active={isSuraqahStuck} />}
        {article.hasChaosRedFlash && <ChaosRedFlash active={isChaosActive} />}
        {article.hasFiresBackground && <FiresBackground active={isFiresActive} />}

        {article.id === 'umar-ibn-al-khattab' && (
          <>
            <motion.div 
              style={{ opacity: umarRageOpacity, scale: umarBgScale }}
              className="absolute inset-0 z-0"
            >
               <div className="absolute inset-0 bg-red-900/40 mix-blend-overlay" />
               <img src={defaultBackgrounds[0]} className="w-full h-full object-cover grayscale-[0.3]" alt="" />
            </motion.div>
            <motion.div 
              style={{ opacity: umarTealOpacity, scale: umarBgScale }}
              className="absolute inset-0 z-0 bg-teal-950/20"
            >
               <div className="absolute inset-0 bg-teal-950/40 mix-blend-overlay" />
               <img src={defaultBackgrounds[1]} className="w-full h-full object-cover" alt="" />
            </motion.div>
          </>
        )}
        {article.id === 'uthman-ibn-affan' && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div 
               style={{ x: light1X, y: lightY, opacity: lightOpacity }}
               className="absolute w-96 h-96 bg-gold/20 rounded-full blur-[120px]"
            />
            <motion.div 
               style={{ x: light2X, y: lightY, opacity: lightOpacity }}
               className="absolute w-96 h-96 bg-cream/20 rounded-full blur-[120px]"
            />
          </div>
        )}
        
        <motion.div 
          style={{ opacity: bg3Opacity }}
          className="absolute inset-0 brightness-[0.05]"
        >
          <img src={defaultBackgrounds[2]} className="w-full h-full object-cover" alt="" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />
      </div>

      <AnimatePresence>
        {(!isScrollingDown || !isFocusMode) && (
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className={cn(
              "h-20 flex items-center justify-between px-8 border-b z-[105] shrink-0 fixed top-0 w-full",
              isNightMode ? "bg-midnight/80 border-white/5" : "bg-white/80 border-midnight/5 backdrop-blur-xl"
            )}
          >
            <button 
              onClick={onBack}
              className="flex items-center space-x-3 text-gold font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Collection</span>
            </button>
            
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-2 mr-4">
                  <Clock size={16} className="text-gold" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{article.readTime}</span>
               </div>
               <button 
                onClick={() => setIsNightMode(!isNightMode)}
                className="p-3 bg-gold/10 text-gold rounded-xl border border-gold/10 hover:bg-gold hover:text-slate-950 transition-all"
              >
                {isNightMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={handleToggleNarration}
                className={cn(
                  "px-5 py-3 rounded-xl transition-all flex items-center space-x-3 border shadow-sm",
                  isNarrating ? "bg-white text-midnight border-white noor-glow" : "bg-white/5 text-gold border-gold/10"
                )}
                title="AI Narration"
              >
                {isNarrating ? <Pause size={18} className="animate-pulse" /> : <Play size={18} />}
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Prophet Echo</span>
              </button>

              <button 
                onClick={togglePlay}
                className={cn(
                  "px-5 py-3 rounded-xl transition-all flex items-center space-x-3 border shadow-sm",
                  isPlaying ? "bg-gold text-slate-950 border-gold noor-glow" : "bg-gold/10 text-gold border-gold/10"
                )}
                title={isPlaying ? "Pause Quran" : "Play Quran"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Atmosphere</span>
              </button>

              {/* Reciter Selector Dropdown */}
              <div className="relative group/reciter">
                  <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gold flex items-center space-x-2 hover:bg-gold/10 transition-all">
                    <Mic size={14} />
                    <span className="hidden xl:inline">
                      {RECITATIONS.find(r => r.id === activeReciter)?.name.split(' ').pop()}
                    </span>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-gold/20 rounded-2xl shadow-2xl opacity-0 group-hover/reciter:opacity-100 pointer-events-none group-hover/reciter:pointer-events-auto transition-all p-2 z-[200]">
                    {RECITATIONS.map(reciter => (
                      <button
                        key={reciter.id}
                        onClick={() => setActiveReciter(reciter.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mb-1 last:mb-0 flex items-center justify-between",
                          activeReciter === reciter.id ? "bg-gold text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-gold"
                        )}
                      >
                        <span>{reciter.name}</span>
                        {activeReciter === reciter.id && <CheckCircle2 size={12} />}
                      </button>
                    ))}
                  </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-1 bg-gold/10 z-[110] shrink-0 overflow-hidden">
        <motion.div 
          className="h-full bg-gold noor-glow shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {article.hasShirtProgress && <ShirtProgressBar progress={scrollYProgress} />}

      <motion.div className={cn(
        "flex-1 overflow-y-auto pt-20 transition-colors duration-1000",
        article.hasMercyTransition && readingProgress > 75 ? "bg-gradient-to-br from-[#FFFDF0] to-[#FFF]" : (article.hasRoyalParchment ? "parchment-texture" : ""),
        (isSuraqahStuck || isFirmSand || isDustLocked || isMartyrHolding || isIdolLock) ? "scrollbar-none" : "scroll-smooth"
      )} 
      style={{
        scrollBehavior: (isSuraqahStuck || isFirmSand || isDustLocked || isMartyrHolding || isIdolLock) ? 'auto' : 'smooth',
        touchAction: (isSuraqahStuck || isFirmSand || isDustLocked || isMartyrHolding || isIdolLock) ? 'none' : 'auto',
        y: isBattleShaking ? battleShudder : 0
      }}
      onWheel={(e) => {
        if (isSuraqahStuck || isFirmSand || isDustLocked || isMartyrHolding || isIdolLock) {
          const container = scrollRef.current;
          if (container) {
            if (isDustLocked || isMartyrHolding || isIdolLock) {
              e.preventDefault();
              return;
            }
            const factor = isFirmSand ? 0.4 : 0.1;
            container.scrollTop += e.deltaY * factor;
            e.preventDefault();
          }
        }
      }}
      ref={scrollRef}>
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center max-w-4xl px-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-2 bg-gold text-slate-950 font-black text-[10px] uppercase tracking-[0.4em] mb-10 inline-block noor-glow"
            >
              {article.theme}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "text-6xl md:text-9xl font-serif font-black mb-12 leading-tight tracking-tighter drop-shadow-2xl mix-blend-difference",
                article.hasDesertHermitStyle ? "text-slate-950 font-medium" : "text-cream"
              )}
            >
              {article.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "inline-flex items-center space-x-6 backdrop-blur-md p-8 rounded-[3rem] border",
                article.hasDesertHermitStyle ? "bg-white/20 border-slate-950/10" : "bg-black/20 border-white/10"
              )}
            >
              {article.hasStatCard && article.stats && (
                <div className="flex flex-col border-r border-white/20 pr-8">
                  <span className="text-[9px] font-black text-gold uppercase tracking-[0.4em] mb-1">Status</span>
                  <span className="text-cream font-serif text-xl italic">{article.stats.title || 'Prophetic'}</span>
                </div>
              )}
              <div className="text-left">
                <span className="text-[9px] font-black text-gold/60 uppercase tracking-[0.4em] mb-1 block">Hero Chronicle</span>
                <p className={cn(
                  "text-xl md:text-2xl font-serif italic leading-relaxed",
                  article.hasDesertHermitStyle ? "text-slate-800" : "text-cream/90"
                )}>
                  "{article.heroText}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <div className="max-w-4xl mx-auto px-8 py-32 space-y-56">
          {article.summary && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-3 gap-16 items-start"
            >
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-4">
                  <span className="text-gold font-black text-[10px] uppercase tracking-[0.5em]">The Core Oracle</span>
                  <h3 className={cn(
                    "text-4xl md:text-6xl font-serif font-bold tracking-tight",
                    article.hasDesertHermitStyle ? "text-slate-950" : "text-cream"
                  )}>The Summary</h3>
                </div>
                <p className={cn(
                  "text-2xl md:text-3xl font-serif italic leading-relaxed",
                  article.id === 'prophet-muhammad-chronicles' && readingProgress < 50 ? "text-slate-400" : 
                  article.hasDesertHermitStyle ? "text-slate-800" : "text-slate-300"
                )}>
                  {article.summary}
                </p>
              </div>
              
              <div className="glass-card p-10 space-y-8 border-gold/20 noor-glow-sm">
                <div className="flex items-center space-x-4">
                  <History className="text-gold" size={24} />
                  <span className="font-black text-[10px] uppercase tracking-widest text-gold/60">Legacy Archetype</span>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-serif font-black text-cream">{article.characterTrait || article.theme}</h4>
                  <p className="text-slate-400 font-serif italic text-lg leading-relaxed">
                    {article.trial}
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* Tactical Map (Art of War) */}
          {article.hasTacticalMap && !article.hasBattleMap && <TacticalMap article={article} />}
          {article.hasBattleMap && <TacticalBattleMap />}

          {/* Commander Stats (Legendary Profile) */}
          {article.hasStatCard && <CommanderStatCard article={article} />}

          {article.trial && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group space-y-12"
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-1 bg-gold/20 group-hover:w-24 transition-all duration-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">The Trial</h2>
              </div>
              <p className={cn(
                "text-3xl md:text-5xl font-serif font-bold leading-tight italic opacity-90 first-letter:text-7xl first-letter:text-gold first-letter:float-left first-letter:mr-4 first-letter:mt-2",
                article.hasDesertHermitStyle ? "text-slate-900" : "text-cream"
              )}>
                {article.trial}
              </p>
            </motion.section>
          )}

          {article.sections.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="flex items-baseline space-x-6">
                 <span className="text-9xl font-serif font-black text-gold/5 leading-none absolute -left-12 -translate-x-full">0{idx + 1}</span>
                 <div className="space-y-4">
                    <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">{section.subtitle}</h4>
                    <h2 className={cn(
                      "text-4xl md:text-7xl font-serif font-bold leading-tight drop-shadow-lg",
                      article.hasDesertHermitStyle ? "text-slate-950 font-medium" : "text-cream"
                    )}>{section.title}</h2>
                 </div>
              </div>
              <div className={cn(
                "text-xl md:text-2xl leading-[1.6] font-serif space-y-10",
                article.isHighDensityNarrative ? "md:text-[1.65rem] leading-[1.9] tracking-normal px-4 md:px-12 text-slate-200" : "",
                article.hasCaveSilhouette && readingProgress >= 30 && readingProgress < 55 ? "brightness-[0.7] text-gold/90 transition-all duration-1000" : "",
                article.hasMercyTransition && readingProgress > 75 ? "text-slate-900" :
                article.id === 'prophet-muhammad-chronicles' && readingProgress < 50 ? "text-slate-400" :
                article.hasRoyalParchment ? "text-slate-900" :
                article.hasDesertHermitStyle ? "text-slate-800" : (isNightMode ? "text-slate-200" : "text-starry-teal-dark")
              )}>
                 {section.content.split('\n\n').map((para, pIdx) => (
                    <p 
                      key={pIdx} 
                      className={cn(
                        "opacity-90 leading-relaxed transition-all duration-700",
                        article.hasMeccanCrucibleStyle && readingProgress < 55 ? "font-black" : "font-normal",
                        article.hasMiracleGlow || (article.hasMeccanCrucibleStyle && readingProgress > 55) ? "glow-miracle-text text-gold" : ""
                      )}
                    >
                      {article.hasMiracleGlow || (article.hasMeccanCrucibleStyle && readingProgress > 55) ? <GlowText>{para}</GlowText> : para}
                    </p>
                 ))}
              </div>

              {/* Special Interactions based on section titles or article flags */}
              {article.hasBadrEngine && section.title === "The Strategic Prelude" && (
                 <BadrBattlefield />
               )}

               {article.hasBadrEngine && section.title === "The Du'a in the Arish" && (
                 <div className="my-16 p-12 bg-gold/5 border border-gold/20 rounded-[4rem] text-center italic font-serif leading-[1.8] text-2xl text-cream">
                    <Quote className="text-gold opacity-40 mx-auto mb-8" size={40} />
                    <TypewriterText 
                      text="O Allah, if this small band of Muslims is destroyed, You will not be worshipped on this earth." 
                      className="text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                    />
                 </div>
               )}

              {article.hasPromiseWidget && section.title.includes("Pledge") && (
                <PromiseWidget />
              )}

              {article.hasBlastSound && section.title === "The Final Scream" && (
                <BlastModule />
              )}

              {article.hasKaabaSpin && section.title === "The Rising Walls" && (
                 <KaabaSpin />
              )}

              {article.hasSaiInteraction && section.title === "The Desert Sanctuary" && (
                 <SaiInteraction />
              )}

              {article.hasSteadfastnessTracker && section.title === "The Advice: Standing Alone for Morality" && (
                 <SteadfastnessTracker />
              )}

              {/* Also check for Lut's advice section if name differs */}
              {article.hasSteadfastnessTracker && (section.title.includes("Standing Alone") || section.title.includes("Advice")) && !article.hasBlastSound && (
                 <SteadfastnessTracker />
              )}

              {article.hasZamzamScroll && section.title === "The Fountain of Youth" && (
                <ZamzamScroll />
              )}

              {article.hasBrokenSwordCounter && section.title === "The Miracle of Mu'tah" && (
                <BrokenSwordsCounter progress={scrollYProgress} />
              )}

              {article.hasScarMap && section.title === "The Deathbed Sorrow" && (
                <ScarMapVisual />
              )}

              {article.hasPromiseTracker && section.title === "The Advice: The Strength of Softness" && (
                <PromiseTracker />
              )}

              {article.hasCalmHeartAudio && section.title === "The Beautiful Patience" && (
                <CalmHeartAudio />
              )}

              {article.hasLineageMap && (section.title === "The News of the Angels" || section.title === "The Builder and the Prophet") && (
                <LineageMap />
              )}

              {article.hasRefugeButton && section.title === "The Trial of the Palace" && (
                <RefugeButton />
              )}

              {article.hasDreamInterpreter && section.title === "The Dream Interpreter and the King" && (
                <DreamInterpreter />
              )}

              {article.hasRestorationSpring && section.title.includes("Spring of Restoration") && (
                <RestorationSpring />
              )}

              {article.hasPatienceTimer && section.title.includes("The Advice") && (
                <PatienceTimer />
              )}

              {article.hasFairTradeScales && (section.title.includes("Market of Greed") || section.title.includes("Advice")) && (
                <FairTradeScales />
              )}

              {article.hasMusaActs && section.title.includes("The Sea and the Staff") && (
                <MusaActs />
              )}

              {article.hasBrotherhoodSplit && section.title.includes("Selection of a Partner") && (
                <BrotherhoodSplit />
              )}

              {article.hasMagicianDuel && section.title.includes("Confrontation in the Palace") && (
                <MagicianDuel />
              )}

              {article.hasSpeakSoftlyTracker && section.title.includes("Confrontation in the Palace") && (
                <SpeakSoftlyTracker />
              )}

              {article.hasAnimalSpeech && section.title.includes("The Smallest Voice") && (
                <AnimalSpeech />
              )}

              {article.hasGlassFloor && section.title.includes("Queen of Sheba") && (
                <GlassFloor />
              )}

              {article.hasBlinkOfAnEye && section.title.includes("Queen of Sheba") && (
                <BlinkOfAnEye />
              )}

              {article.hasGratitudeKingdom && section.title.includes("Advice") && (
                <GratitudeKingdom />
              )}

              {article.hasThreeDarknesses && section.title.includes("Three Darknesses") && (
                <ThreeDarknesses />
              )}

              {article.hasGlowInTheDarkVerse && section.title.includes("Three Darknesses") && (
                <GlowInTheDarkVerse 
                  arabic={article.ayahs[0].arabic}
                  translation={article.ayahs[0].translation}
                  reference={article.ayahs[0].reference}
                />
              )}

              {article.hasHealingPlant && section.title.includes("Restoration") && (
                <HealingPlant />
              )}

              {article.hasSOSWidget && section.title.includes("Advice") && (
                <SOSWidget />
              )}

              {article.hasDiggingInteraction && (section.title === "The Miracle of the White Boulder" || section.title === "The Miracle of the Trench") && (
                <TrenchInteraction />
              )}

              {article.hasTacticalOverlay && section.title === "The Persian Blueprint" && (
                <TacticalOverlayMap />
              )}

              {article.hasGateLift && section.title === "The Miracle of the Khaybar Gate" && (
                <GateLiftInteraction />
              )}

              {article.hasGateLift && section.title === "The Young Lion & The Ultimate Risk" && (
                <HijrahBedInteraction progress={scrollYProgress} />
              )}
              
              {article.hasProtectorShield && section.title === "The Incident of the Bow" && (
                <ProtectorShield />
              )}

              {article.hasTearDropTrigger && section.title.includes("Night in the Cave") && readingProgress > 50 && !article.hasHasbunallahBadge && (
                <TearDropTrigger onUnlock={() => setIsTearDropLocked(false)} />
              )}

              {article.hasFlagBearerLock && section.title === "The Standard-Bearer of Uhud" && (
                <FlagBearerInteraction active={readingProgress > 66} />
              )}

              {article.hasEgoMeter && section.title === "The Duel of Khandaq" && (
                <EgoSpiritMeter />
              )}

              {article.hasZakariyaSilence && section.title.includes("Answer in the Mihrab") && (
                <ZakariyaSilenceEffect />
              )}

              {article.hasInAppMihrab && section.title.includes("Answer in the Mihrab") && (
                <InAppMihrab />
              )}

              {article.hasClayBirdAnimation && section.title.includes("Table and the Spirit") && (
                <ClayBirdAnimation />
              )}

              {article.hasCosmicAscent && section.title === "The Ascent Through the Seven Heavens" && (
                <div className="space-y-8 py-12">
                  <ProphetBadge name="Adam (AS)" miracle="The Father of Humanity and the First to be Taught all names." />
                  <ProphetBadge name="Isa & Yahya (AS)" miracle="The Miraculous Birth and the Wisdom given in childhood." />
                  <ProphetBadge name="Yusuf (AS)" miracle="Blessed with half of all human beauty and the interpretation of dreams." />
                  <ProphetBadge name="Idris (AS)" miracle="The one raised to a high station and the first to write with a pen." />
                  <ProphetBadge name="Harun (AS)" miracle="The support of Musa and the eloquent speaker for the Truth." />
                  <ProphetBadge name="Musa (AS)" miracle="The one who spoke directly to Allah and parted the Red Sea." />
                  <ProphetBadge name="Ibrahim (AS)" miracle="The Friend of Allah, builder of the Kaaba, found leaning against the Bayt al-Ma'mur." />
                </div>
              )}

              {article.hasPrayerReduction && section.title === "The Ultimate Gift" && (
                <PrayerReductionInteraction />
              )}

              {article.hasArchersSplit && section.title === "The Fatal Mistake" && (
                <ArchersSplitView progress={readingProgress} />
              )}

              {article.hasLivingMartyrHold && section.title === "The Chaos and the Ultimate Shield" && (
                <div className="py-12">
                   {!martyrHoldFinished ? (
                    <LivingMartyrHold onHoldComplete={() => setMartyrHoldFinished(true)} />
                   ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 rounded-3xl bg-gold/10 border border-gold/30 text-center"
                    >
                      <h4 className="text-2xl font-serif text-gold font-bold mb-4">A Living Martyr</h4>
                      <p className="text-cream/80 italic leading-relaxed">Talhah and Abu Dujanah survived the rain of arrows, their bodies becoming a shield that even death could not penetrate. The protection of the Prophet (ﷺ) was complete.</p>
                    </motion.div>
                   )}
                </div>
              )}

              {article.hasIdolShatter && section.title === "The Cleansing of the Sanctuary" && (
                <div className="py-12">
                   {!idolShatterFinished ? (
                    <IdolShatterInteraction onComplete={() => setIdolShatterFinished(true)} />
                   ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-3xl bg-gold/10 border border-gold/30 text-center"
                    >
                      <h4 className="text-2xl font-serif text-gold font-bold mb-4">Cleansed of Falsehood</h4>
                      <p className="text-cream/80 italic">The courtyard of Abraham (AS) stands raw and pure under the sun. Truth has come, and falsehood has vanished.</p>
                    </motion.div>
                   )}
                </div>
              )}

              {article.hasDustSwipe && section.title === "The Clash of the Descents" && (
                <div className="py-12">
                   {!dustThrown ? (
                    <DustSwipeInteraction onComplete={() => setDustThrown(true)} />
                   ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-3xl bg-gold/10 border border-gold/30 text-center"
                    >
                      <h4 className="text-2xl font-serif text-gold font-bold mb-4">The Heavenly Hosts Descend</h4>
                      <p className="text-cream/80 italic">The physical world merged with the spiritual. A thousand angels on horseback, lead by Jibril (AS), ride through the clouds of Badr.</p>
                      <MiracleCongregation />
                    </motion.div>
                   )}
                </div>
              )}

              {article.hasHiraTimer && section.title.includes("Act I") && (
                <HiraTimer />
              )}

              {article.hasBrotherhoodPair && section.title.includes("Act III") && (
                <BrotherhoodPair />
              )}

              {article.hasFinalSermonScroll && section.title.includes("Act IV") && (
                <FinalSermonScroll />
              )}
            </motion.section>
          ))}

          {article.hasHasbunallahBadge && (
             <motion.section 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="text-center space-y-10 py-20"
             >
                <div className="w-48 h-48 rounded-full bg-gold/10 border-4 border-gold/40 flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(212,175,55,0.4)] relative group">
                   <div className="absolute inset-0 rounded-full animate-ping bg-gold/20" />
                   <Star className="text-gold" size={80} />
                </div>
                <div className="space-y-4">
                   <h2 className="text-3xl font-serif font-black text-gold">The Friend of Allah</h2>
                   <p className="text-gold/60 font-black uppercase tracking-[0.4em] text-[10px]">Title Unlocked: Al-Khalil</p>
                </div>
             </motion.section>
          )}

          {article.ayahs.map((ayah, idx) => (
            <AyahCard 
              key={idx} 
              ayah={ayah} 
              onSpotlight={(inView) => setIsAyahSpotlight(inView)}
            />
          ))}

          {article.characterTrait && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 md:p-24 bg-gold/5 border border-gold/10 rounded-[5rem] relative overflow-hidden group hover:bg-gold/10 transition-colors"
            >
              <Star className="absolute -top-10 -right-10 size-64 text-gold/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">The Character</h2>
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-cream leading-tight">{article.characterTrait}</h3>
              </div>
            </motion.section>
          )}

          {/* Wisdom Cards Section (Special for Luqman style) */}
          {article.wisdomCards && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">The Wisdom Loop</h2>
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-cream">Which wisdom do you need today?</h3>
                <p className="text-slate-400 font-serif italic text-xl">Select a card to seal your intention</p>
              </div>

              <div className="flex space-x-8 overflow-x-auto pb-12 px-4 no-scrollbar -mx-8 sm:mx-0 snap-x">
                {article.wisdomCards.map((card, idx) => (
                  <WisdomCard 
                    key={idx}
                    card={card}
                    isSelected={selectedWisdom === card.title}
                    onSelect={() => {
                      setSelectedWisdom(card.title);
                      toast.success(`Intent Sealed: Reminding you of "${card.title}" soon.`, {
                        style: {
                          background: '#1e293b',
                          color: '#d4af37',
                          border: '1px solid rgba(212, 175, 55, 0.2)'
                        },
                        icon: '🕊️'
                      });
                    }}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {article.modernLesson && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12 pt-20"
            >
              <div className="flex items-center space-x-4">
                <Sparkles className="text-gold" size={24} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">Modern Lesson</h2>
              </div>
              <p className="text-2xl md:text-4xl font-serif italic text-cream/80 leading-[1.6] border-l-4 border-gold/30 pl-10">
                {article.modernLesson}
              </p>
            </motion.section>
          )}

          {article.noorayaWisdom && (
            <motion.section 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden group shadow-2xl p-1 w-full"
            >
               <div className="absolute inset-0 z-0">
                  <img src={article.wisdomImage} className="w-full h-full object-cover blur-sm brightness-[0.3] scale-110 group-hover:scale-100 transition-transform duration-[2s]" alt="" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
               </div>
               <div className="relative z-10 p-12 md:p-20 space-y-10 text-center border border-white/10 rounded-[2.8rem]">
                  <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-gold text-slate-950 font-black uppercase tracking-widest text-[9px] noor-glow">
                     <Sparkles size={14} />
                     <span>Nooraya Wisdom</span>
                  </div>
                  <p className="text-3xl md:text-5xl font-serif font-black text-gold/90 leading-[1.4] italic">
                    "{article.noorayaWisdom}"
                  </p>
                  <div className="w-24 h-px bg-gold/30 mx-auto" />
                  <p className="text-gold/60 font-black uppercase tracking-[0.4em] text-[10px]">A gift for your spiritual elevation</p>
               </div>
            </motion.section>
          )}

          {article.hasStarReflector && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center space-y-12"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">Celestial Connection</h2>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  toast.success("Opening the Celestial Window...", { icon: '✨' });
                  setShowStarAnimation(true);
                }}
                className="px-12 py-6 rounded-2xl bg-slate-950 border-2 border-gold/40 text-gold font-black uppercase tracking-widest text-xs flex items-center space-x-4 mx-auto hover:bg-gold hover:text-slate-950 transition-all noor-glow-sm"
              >
                <Star size={24} />
                <span>Reflect on the Stars</span>
              </motion.button>
            </motion.section>
          )}

          {/* Gratitude Interaction (Special for Garden story) */}
          {article.interactionType === 'gratitude' && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12 text-center"
            >
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">The Soul Test</h2>
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-cream">Practice Gratitude</h3>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setHasPracticedGratitude(true);
                  toast("Ma sha' Allah! Blessing preserved.", {
                    icon: '✨',
                    duration: 3000,
                    style: { background: '#064e3b', color: '#D4AF37', border: '1px solid #10b981' }
                  });
                }}
                className={cn(
                  "relative group px-16 py-10 rounded-full font-black uppercase tracking-[0.4em] text-sm transition-all duration-700",
                  hasPracticedGratitude 
                    ? "bg-emerald-600 text-white shadow-[0_0_50px_rgba(16,185,129,0.4)]" 
                    : "bg-gold text-slate-950 noor-glow"
                )}
              >
                <AnimatePresence mode="wait">
                  {hasPracticedGratitude ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center space-x-3">
                      <CheckCircle2 size={24} />
                      <span>Gratitude Practiced</span>
                    </motion.div>
                  ) : (
                    <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-3">
                      <Sparkles size={24} />
                      <span>Say Ma sha' Allah</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!hasPracticedGratitude && (
                  <motion.div className="absolute inset-0 rounded-full pointer-events-none border-2 border-gold opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                )}
              </motion.button>
              
              {hasPracticedGratitude && (
                 <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-400 font-serif italic text-xl">
                   +10 Noor Points for your humble heart
                 </motion.p>
              )}
            </motion.section>
          )}

          {/* Trust Meter Interaction (Special for Mother of Musa story) */}
          {article.interactionType === 'trust' && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-16 text-center"
            >
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">The Trust Meter</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream">How much are you trusting Allah with your biggest worry today?</h3>
                <p className="text-slate-400 font-serif italic text-xl">Select a level from 1 to 10</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setTrustValue(num);
                      if (num < 5) {
                        toast("Seeking serenity... Listen to this soothing recitation.", {
                          icon: '🌙',
                          duration: 4000,
                          style: { background: '#0f172a', color: '#60a5fa', border: '1px solid #1e40af' }
                        });
                        // Simulated audio trigger
                      } else {
                        toast("Ma sha' Allah! Your heart is firm like the Mother of Musa.", {
                          icon: '✨',
                          duration: 4000,
                          style: { background: '#064e3b', color: '#D4AF37', border: '1px solid #10b981' }
                        });
                      }
                    }}
                    className={cn(
                      "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-300 border-2",
                      trustValue === num 
                        ? "bg-gold text-slate-950 border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                        : "bg-white/5 text-gold border-gold/20 hover:border-gold/50"
                    )}
                  >
                    {num}
                  </motion.button>
                ))}
              </div>

              {trustValue !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto p-8 rounded-[2rem] bg-gold/10 border border-gold/20"
                >
                  <p className="text-cream font-serif italic text-lg leading-relaxed">
                    {trustValue < 5 
                      ? "It's okay to feel the weight of the waves. Remember, Allah promised: 'We shall return him to you.' Breathe in His promise."
                      : "A firm heart is a sanctuary. Just as Musa was returned to his mother, your peace will be returned to you in the most beautiful way."}
                  </p>
                </motion.div>
              )}
            </motion.section>
          )}

          {/* Nomination Interaction for Abu Bakr story */}
          {article.interactionType === 'nomination' && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12 text-center"
            >
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">The Friendship Pulse</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream">Nominate your own 'Siddiq'</h3>
                <p className="text-slate-400 font-serif italic text-xl max-w-xl mx-auto">
                  Who is the person in your life that confirms your truth and stands by you in your 'cave'?
                </p>
              </div>
              
              <button 
                onClick={() => {
                  const text = `I'm reading the story of Abu Bakr Al-Siddiq (RA) and thought of you. Thank you for being the 'Siddiq' in my life—someone who confirms the truth and stands by me. May Allah bless our friendship! ✨`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  setShowNomination(true);
                  toast("Nomination message prepared! May Allah bless your friendship.", { icon: '🤝' });
                }}
                className="px-12 py-6 bg-gold text-slate-950 rounded-full font-black uppercase tracking-widest text-[11px] noor-glow hover:scale-105 transition-all flex items-center space-x-3 mx-auto"
              >
                <Heart size={18} />
                <span>Nominate via WhatsApp</span>
              </button>

              {showNomination && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-[2rem] bg-gold/5 border border-gold/20 max-w-lg mx-auto">
                   <p className="text-gold font-black text-xs uppercase tracking-widest mb-2">Loyalty Reward</p>
                   <p className="text-cream font-serif italic">+15 Faith Multiplier for honoring a sibling in Islam.</p>
                </motion.div>
              )}
            </motion.section>
          )}

          {/* Quiz Interaction for Aisha story */}
          {article.interactionType === 'quiz' && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12 text-center"
            >
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">Knowledge Quest</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream">Test Your Heart's Learning</h3>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-8">
                {quizStep < 3 ? (
                  <motion.div 
                    key={quizStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-10 rounded-[3rem] bg-slate-900 border border-gold/20 space-y-8"
                  >
                    <div className="space-y-2">
                      <span className="text-gold font-black text-[10px] uppercase tracking-widest">Question {quizStep + 1} of 3</span>
                      <h4 className="text-2xl font-serif text-cream">
                        {quizStep === 0 && "How many Hadiths did Aisha (RA) narrate for the Ummah?"}
                        {quizStep === 1 && "What was one of the fields Aisha (RA) was an authority in?"}
                        {quizStep === 2 && "Through which father's example did Aisha (RA) seek patience?"}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         quizStep === 0 ? ['1,000', '2,210', '500'] :
                         quizStep === 1 ? ['Medicine', 'Navigation', 'Shipbuilding'] :
                         ['Ibrahim (AS)', 'Yusuf (AS)', 'Musa (AS)']
                       ][0].map((option, idx) => (
                         <button 
                           key={idx}
                           onClick={() => {
                             const isCorrect = (quizStep === 0 && option === '2,210') || 
                                             (quizStep === 1 && option === 'Medicine') || 
                                             (quizStep === 2 && option === 'Yusuf (AS)');
                             if (isCorrect) {
                               setQuizScore(s => s + 1);
                               toast("Ahsant! Correct.", { icon: '📜' });
                             } else {
                               toast("Keep seeking knowledge...", { icon: '🌙' });
                             }
                             setQuizStep(s => s + 1);
                           }}
                           className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-cream hover:bg-gold/10 hover:border-gold/50 transition-all font-serif italic text-lg"
                         >
                           {option}
                         </button>
                       ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 rounded-[4rem] bg-gold/10 border-2 border-gold/40 text-center space-y-6">
                    <Star className="mx-auto text-gold" size={48} />
                    <h4 className="text-3xl font-serif font-bold text-cream">Knowledge Harvested</h4>
                    <p className="text-gold font-black text-sm uppercase tracking-widest">
                      {quizScore === 3 ? "Scholar's Ink Unlocked! 🖋️" : "Seeker of Truth Path"}
                    </p>
                    <p className="text-slate-400 italic font-serif">
                      You scored {quizScore}/3. Like Aisha (RA), continue to ask 'Why?' and preserve the beauty of our faith.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}

          {/* Justice Interaction for Umar story */}
          {article.interactionType === 'justice' && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-16 text-center"
            >
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">The Night Walk</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream">A Modern Dilemma</h3>
                <p className="text-slate-400 font-serif italic text-xl max-w-xl mx-auto">
                  You see someone struggling at work with a burden you could help carry, but you are already tired. What do you do?
                </p>
              </div>
              
              {!justiceChoice ? (
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button 
                    onClick={() => {
                      setJusticeChoice('help');
                      toast("Account for yourselves before you are held to account.", { icon: '⚖️' });
                    }}
                    className="px-10 py-5 bg-gold text-slate-950 rounded-full font-black uppercase tracking-widest text-[10px] noor-glow hover:scale-105 transition-all"
                  >
                    Step in and Help
                  </button>
                  <button 
                    onClick={() => {
                      setJusticeChoice('ignore');
                      toast("Reflection is the path to growth.", { icon: '🌙' });
                    }}
                    className="px-10 py-5 bg-white/5 text-gold border border-gold/20 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-gold/10 transition-all"
                  >
                    Ignore for Now
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto p-8 rounded-[2rem] bg-gold/10 border border-gold/20">
                  <p className="text-cream font-serif italic text-lg leading-relaxed">
                    {justiceChoice === 'help' 
                      ? "Umar (RA) carried the sack himself. By helping, you emulate the justice of Al-Faruq. 'Account for yourselves before you are held to account.'"
                      : "The burden remains. True strength is found in the courage to be just even when your own ego seeks rest. Perhaps tonight is a night for a walk of reflection."}
                  </p>
                </motion.div>
              )}
            </motion.section>
          )}

          {/* Waqf Interaction for Uthman story */}
          {article.interactionType === 'waqf' && (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-16 text-center"
            >
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">Your Digital Well</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream">The Legacy of Bir Ruma</h3>
                <p className="text-slate-400 font-serif italic text-xl max-w-xl mx-auto">
                  Uthman (RA) dedicated a well for the Ummah. What small automated 'good deed' will you commit to this week?
                </p>
              </div>
              
              {!waqfGoal ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {[
                    "Share one piece of knowledge daily",
                    "Offer one sincere Du'a for the Ummah",
                    "Smile at every person I meet",
                    "Read 5 verses of Quran daily"
                  ].map((goal, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setWaqfGoal(goal);
                        toast(`Waqf Goal set: ${goal}. May Allah accept it!`, { icon: '💧' });
                      }}
                      className="p-6 rounded-3xl bg-white/5 border border-white/10 text-cream hover:bg-gold/10 hover:border-gold/50 transition-all font-serif italic"
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto p-10 rounded-[3rem] bg-gold/10 border-2 border-gold/40">
                  <Compass className="mx-auto text-gold mb-6" size={40} />
                  <p className="text-gold font-black text-xs uppercase tracking-widest mb-2">Active Endowment</p>
                  <p className="text-cream font-serif italic text-xl">"{waqfGoal}"</p>
                  <div className="mt-8 pt-8 border-t border-gold/20">
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Placeholder to stay in app, but implies navigation
                      className="text-gold text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 mx-auto"
                    >
                      <span>Visit Quranic Archive</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}

          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-32 pb-16 text-center space-y-12"
          >
            <MessageSquare className="text-gold mx-auto" size={40} />
            <div className="space-y-6">
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-cream">Soul's Reflection</h3>
              <p className="text-xl md:text-2xl text-slate-400 font-serif italic">
                {article.reflectionPrompt || `How will you embody ${article.prophet}'s virtues in your own life today?`}
              </p>
            </div>
            <textarea 
              placeholder="Pen your heart's silent whispers..."
              className="w-full bg-white/5 border border-white/10 rounded-[3rem] p-10 text-cream font-serif text-xl focus:outline-none focus:ring-2 focus:ring-gold/30 h-64 transition-all resize-none shadow-2xl"
            />
          </motion.section>
          
          <div className="space-y-6">
            <button 
              onClick={() => {
                onComplete(article.id);
                onBack();
              }}
              className="w-full bg-gold text-slate-950 py-10 rounded-full font-black uppercase tracking-[0.4em] text-xs noor-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 shadow-[0_0_50px_rgba(212,175,55,0.4)]"
            >
              <CheckCircle2 size={24} />
              <span>Seal This Wisdom</span>
            </button>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="p-12 bg-white/5 border border-white/10 rounded-[4rem] flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 text-left"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gold opacity-60">Next Journey</span>
                <h4 className="text-2xl font-serif font-bold text-cream">Continue to {nextArticle.title}</h4>
              </div>
              <button 
                onClick={() => {
                  onComplete(nextArticle); // Pass the next article to onComplete to trigger the transition in Explore
                }}
                className="px-8 py-4 bg-white/10 text-cream rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-slate-950 transition-all flex items-center space-x-3 border border-white/10"
              >
                <span>Embark</span>
                <Compass size={16} />
              </button>
            </motion.div>
          </div>

          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: readingProgress > 10 ? 1 : 0 }}
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-12 right-12 p-6 bg-gold text-slate-950 rounded-3xl shadow-2xl noor-glow z-[200] hover:scale-110 active:scale-95 transition-all border-4 border-slate-950"
          >
            <ArrowLeft size={24} className="rotate-90" />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showStarAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden"
          >
             {/* Dynamic Night Sky Background */}
             <div className="absolute inset-0 pointer-events-none">
                {[...Array(100)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: Math.random() }}
                    animate={{ opacity: [Math.random(), 1, Math.random()] }}
                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%` 
                    }}
                  />
                ))}
                <motion.div 
                  initial={{ x: -100, y: -100, opacity: 0 }}
                  animate={{ x: '110%', y: '110%', opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
                  className="absolute w-1 h-32 bg-gradient-to-b from-transparent via-gold/40 to-transparent rotate-45 blur-[2px]"
                />
             </div>

             <div className="relative z-10 text-center max-w-4xl space-y-16">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-32 h-32 rounded-[3rem] bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold mx-auto shadow-[0_0_80px_rgba(212,175,55,0.4)]"
                >
                  <Star size={48} />
                </motion.div>

                <div className="space-y-8">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-serif font-black text-gold/90 leading-tight"
                    dir="rtl"
                  >
                    إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-4xl font-serif italic text-cream/80 max-w-3xl mx-auto"
                  >
                    "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding."
                  </motion.p>
                  <p className="text-gold/40 font-black uppercase tracking-[0.4em] text-xs">— Surah Ali 'Imran 3:190</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStarAnimation(false)}
                  className="px-12 py-5 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-gold transition-colors"
                >
                  Return to Earth
                </motion.button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {article.id === 'prophet-muhammad-chronicles' && readingProgress === 100 && <LibraryCompletion />}
    </motion.div>
  );
};
