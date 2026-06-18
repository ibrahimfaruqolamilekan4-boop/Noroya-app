import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Atom, Droplets, Globe, ChevronRight, X, Info, Quote, LucideIcon, Share2, MessageSquare, Microscope, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

interface Miracle {
  id: string;
  title: string;
  category: string;
  ayah: string;
  science: string;
  citation: string;
  scientificFact: string;
  reflection?: string;
  icon: LucideIcon;
  color: string;
  image: string;
}

const miracles: Miracle[] = [
  {
    id: 'musa-sea',
    title: 'The Parting of the Red Sea',
    category: 'Prophetic Miracle',
    ayah: 'Then We inspired to Moses, "Strike with your staff the sea," and it parted, and each portion was like a great towering mountain.',
    science: 'Fluid Dynamics & Divine Authority',
    citation: 'Surah Ash-Shu’ara [26:63]',
    scientificFact: 'While fluid dynamics usually dictate equilibrium, the Divine command suspended natural laws to create a temporary bridge of dry land for the oppressed.',
    reflection: 'The sea is often a symbol of an inescapable obstacle. Musa (AS) didn\'t have a boat; he had faith. When you feel trapped by the "seas" of life, remember that the One who created the water can make it a wall for your protection.',
    icon: Droplets,
    color: 'from-blue-500/20 to-blue-900/40',
    image: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'isa-miracles',
    title: 'Healer of the Soul',
    category: 'Prophetic Miracle',
    ayah: '...I heal the blind and the leper, and I give life to the dead - by permission of Allah.',
    science: 'Biological Restoration',
    citation: 'Surah Al-Imran [3:49]',
    scientificFact: 'Regeneration of dead tissue and restoration of optic nerves are miracles of cellular reanimation that transcend modern medical capabilities.',
    reflection: 'Isa (AS) was given the power to heal physical blindness, but the greater lesson was the healing of spiritual blindness. A heart that sees the Truth is more alive than a body that simply breathes.',
    icon: Sparkles,
    color: 'from-emerald-500/20 to-emerald-900/40',
    image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'splitting-moon',
    title: 'The Splitting of the Moon',
    category: 'Prophetic Miracle',
    ayah: 'The Hour has come near, and the moon has split [in two].',
    science: 'Lunar Geomorphology',
    citation: 'Surah Al-Qamar [54:1]',
    scientificFact: 'Early records from distant civilizations (like India) documented a strange lunar event during the time of the Prophet (ﷺ), aligning with the Quranic account.',
    reflection: 'This miracle showed that the signs of Allah are written in the heavens. It was a call to the Quraish that the Creator of the celestial bodies is the one speaking through Muhammad (ﷺ).',
    icon: Globe,
    color: 'from-slate-300/20 to-slate-600/40',
    image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'ibrahim-fire',
    title: 'Peace in the Flames',
    category: 'Prophetic Miracle',
    ayah: 'We said, "O fire, be coolness and safety upon Abraham."',
    science: 'Thermal Thermodynamics',
    citation: 'Surah Al-Anbiya [21:69]',
    scientificFact: 'The subversion of the exothermic process of combustion, turning a destructive force into a restorative one by Divine command.',
    reflection: 'Ibrahim (AS) was thrown into a fire by his people, but Allah made the fire "cool" (Bardan). Sometimes, the "fires" we are thrown into (hardships) are exactly where we find our deepest peace, because Allah is with us.',
    icon: Sparkles,
    color: 'from-orange-500/20 to-orange-900/40',
    image: 'https://images.unsplash.com/photo-1544158931-599144498305?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'oceans',
    title: 'The Meeting of the Two Seas',
    category: 'Scientific Sign',
    ayah: 'He released the two seas, meeting [side by side]; Between them is a barrier [so] neither of them transgresses.',
    science: 'Haloclines and density barriers allow different bodies of water to meet without mixing core properties.',
    citation: 'Surah Ar-Rahman [55:19-20]',
    scientificFact: 'Oceanographers confirmed that surface tension prevents the mixing of the Mediterranean and Atlantic at the Strait of Gibraltar—preserving salinity, temperature, and biology.',
    reflection: 'Even in the chaos of the ocean, there is order. This reflects the boundaries Allah has set for all things in existence.',
    icon: Droplets,
    color: 'from-cyan-500/20 to-cyan-900/40',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'cosmology',
    title: 'The Expanding Universe',
    category: 'Scientific Sign',
    ayah: 'And the heaven We constructed with strength, and indeed, We are [its] expander.',
    science: 'The universe is not static but expanding continuously in all directions.',
    citation: 'Surah Adh-Dhariyat [51:47]',
    scientificFact: 'Edwin Hubble\'s 1929 discovery of the red-shift proved that galaxies are moving away from us. Modern physics confirms the "Big Bang" model where space itself is expanding.',
    reflection: 'The vastness of space is a testament to the infinite power of the Expander (Al-Wasi\').',
    icon: Atom,
    color: 'from-indigo-500/20 to-indigo-900/40',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200'
  }
];

export const MiraclesOfQuran = () => {
  const [selectedMiracle, setSelectedMiracle] = useState<Miracle | null>(null);
  const [viewMode, setViewMode] = useState<Record<string, 'ayah' | 'science' | 'reflection'>>({});
  const navigate = useNavigate();

  const toggleMode = (id: string, mode: 'ayah' | 'science' | 'reflection') => {
    setViewMode(prev => ({ ...prev, [id]: mode }));
  };

  const handleShare = (miracle: Miracle) => {
    toast.success('Generated shareable miracle card with Nooraya watermark!');
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest noor-glow">
            <Microscope size={14} />
            <span>Sacred Knowledge</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-cream tracking-tight">Signs of Reflection</h1>
          <p className="text-slate-400 font-serif italic text-lg md:text-xl">"We will show them Our signs in the horizons and within themselves..." [41:53]</p>
        </div>
        <div className="flex space-x-4">
           <button 
             onClick={() => navigate('/qa')}
             className="bg-gold/10 border border-gold/30 text-gold px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-gold hover:text-starry-teal-dark transition-all flex items-center space-x-3"
           >
             <MessageSquare size={16} />
             <span>Ask the Noor AI</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {miracles.map((miracle) => (
          <motion.div
            key={miracle.id}
            layout
            className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-700 shadow-2xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={miracle.image} 
                alt={miracle.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent transition-opacity",
                "opacity-80 group-hover:opacity-90"
              )} />
            </div>

            {/* Artistic Background Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${miracle.color} opacity-20 group-hover:opacity-40 transition-opacity duration-1000 z-0`} />
            
            {/* Fixed Header */}
            <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold/60">{miracle.category}</span>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleShare(miracle)}
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="absolute inset-0 p-12 flex flex-col justify-center">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gold/10 flex items-center justify-center text-gold mb-8 group-hover:scale-110 group-hover:noor-glow transition-all duration-500">
                <miracle.icon size={32} />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-cream mb-6 leading-tight">
                {miracle.title}
              </h3>

              <div className="relative min-h-[160px]">
                <AnimatePresence mode="wait">
                  {(!viewMode[miracle.id] || viewMode[miracle.id] === 'ayah') && (
                    <motion.div
                      key="ayah"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 text-gold/80">
                        <BookOpen size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Quranic Verses</span>
                      </div>
                      <p className="text-xl font-serif italic text-cream leading-relaxed">
                        "{miracle.ayah}"
                      </p>
                      <p className="text-gold/60 text-[10px] font-bold">{miracle.citation}</p>
                    </motion.div>
                  )}
                  {viewMode[miracle.id] === 'science' && (
                    <motion.div
                      key="science"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 text-cyan-400/80">
                        <Microscope size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Scientific Fact</span>
                      </div>
                      <p className="text-lg text-slate-300 leading-relaxed font-medium">
                        {miracle.scientificFact}
                      </p>
                      <p className="text-cyan-400/60 text-[10px] font-bold uppercase tracking-widest">{miracle.science}</p>
                    </motion.div>
                  )}
                  {viewMode[miracle.id] === 'reflection' && (
                    <motion.div
                      key="reflection"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 text-amber-400/80">
                        <Quote size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Wisdom & Reflection</span>
                      </div>
                      <p className="text-lg text-cream/90 leading-relaxed font-serif italic pl-4 border-l-2 border-gold/30">
                        {miracle.reflection || "Reflect on how this sign strengthens your connection to the Divine."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Toggle Control */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-center">
              <div className="bg-black/60 backdrop-blur-2xl p-1.5 rounded-full flex border border-white/10 shadow-2xl scale-90 md:scale-100">
                <button
                  onClick={() => toggleMode(miracle.id, 'ayah')}
                  className={cn(
                    "px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                    (!viewMode[miracle.id] || viewMode[miracle.id] === 'ayah') ? "bg-gold text-starry-teal-dark shadow-lg" : "text-slate-400 hover:text-cream"
                  )}
                >
                  Ayah
                </button>
                <button
                  onClick={() => toggleMode(miracle.id, 'science')}
                  className={cn(
                    "px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                    viewMode[miracle.id] === 'science' ? "bg-cyan-500 text-white shadow-lg" : "text-slate-400 hover:text-cream"
                  )}
                >
                  Science
                </button>
                <button
                  onClick={() => toggleMode(miracle.id, 'reflection')}
                  className={cn(
                    "px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                    viewMode[miracle.id] === 'reflection' ? "bg-amber-500 text-white shadow-lg" : "text-slate-400 hover:text-cream"
                  )}
                >
                  Reflection
                </button>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 w-0 group-hover:w-full bg-gold transition-all duration-1000" />
          </motion.div>
        ))}

        {/* Dawah Trigger Final Card */}
        <div className="h-[500px] rounded-[3rem] border-2 border-dashed border-gold/20 flex flex-col items-center justify-center p-12 text-center group hover:border-gold/50 transition-all">
          <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center text-gold mb-8 group-hover:scale-110 group-hover:bg-gold group-hover:text-starry-teal-dark transition-all duration-500 shadow-2xl">
            <MessageSquare size={32} />
          </div>
          <h4 className="text-3xl font-serif font-bold text-cream mb-4">Have a Question?</h4>
          <p className="text-slate-400 text-sm mb-10 max-w-xs leading-relaxed">
            Curious about these signs or want to know more about the Quranic wisdom? Ask Nooraya AI anything.
          </p>
          <button 
           onClick={() => navigate('/qa')}
           className="bg-gold text-starry-teal-dark px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] noor-glow hover:scale-105 transition-all"
          >
            Start Conversation
          </button>
        </div>
      </div>

      <div className="text-center py-10 opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/40">Verified by Quranic Scholars & Modern Research</p>
      </div>
    </div>
  );
};
