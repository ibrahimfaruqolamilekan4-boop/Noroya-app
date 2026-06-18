import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Play, BookOpen, Heart, MessageCircle, Star, 
  Activity, Flame, CheckCircle2, Footprints, Mic, Shield, Atom, Map as MapIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SpiritualPharmacy } from './SpiritualPharmacy';
import { DailyDeed } from './DailyDeed';
import { PrayerTimes } from './PrayerTimes';
import { VirtueTracker } from './VirtueTracker';
import { AdminFAQ } from './AdminFAQ';
import { DailyWisdom } from './DailyWisdom';
import { DailyDhikr } from './DailyDhikr';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { cn } from '../lib/utils';

const PORTALS = [
  {
    id: 'map',
    title: 'History Map',
    subtitle: 'THE SACRED MAP OF LIGHT',
    description: 'An immersive interactive registry of historic battles, divine revelations, and epic geographic lineages across the prophetic eras.',
    icon: MapIcon,
    route: '/explore?tab=map',
    tag: 'Interactive Cartography',
    glowColor: 'from-[#E5C158]/20 to-[#E5C158]/5'
  },
  {
    id: 'names',
    title: 'Allah Names',
    subtitle: 'AL-ASMAA AL-HUSNA',
    description: 'Ponder on the 99 Majestic Names of Him to establish a core connection with Divine qualities, backed by soothing ambient vibrations.',
    icon: Heart,
    route: '/explore?tab=names',
    tag: 'Sacred Meditation',
    glowColor: 'from-rose-500/20 to-rose-500/5'
  },
  {
    id: 'tarteel',
    title: 'Tarteel AI',
    subtitle: 'TAJWEED RECOGNITION CORE',
    description: 'Utilize next-generation voice analysis to practice your recitation, correct your pronunciation, and gain real-time fluency feedback.',
    icon: Mic,
    route: '/explore?tab=tarteel',
    tag: 'Artificial Intelligence',
    glowColor: 'from-blue-500/20 to-blue-500/5'
  },
  {
    id: 'chronicles',
    title: 'Sahaba Chronicles',
    subtitle: 'HEROES OF EARLY ISLAM',
    description: 'Walk alongside Salman al-Farsi, Bilal, and the courageous early companions through interactive Meccan and Medinan narrative paths.',
    icon: Shield,
    route: '/explore?tab=chronicles',
    tag: 'Heroic Biographies',
    glowColor: 'from-emerald-500/20 to-emerald-500/5'
  },
  {
    id: 'science',
    title: 'Soul Science',
    subtitle: 'SPIRITUAL PSYCHOTHERAPY',
    description: 'Map temporary worldly feelings (anxiety, loneliness, heartbreak) against permanent divine remedies from the Quran and Prophetic Sunnah.',
    icon: Atom,
    route: '/explore?tab=science',
    tag: 'Islamic Psychology',
    glowColor: 'from-purple-500/20 to-purple-500/5'
  }
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { profile } = useAuth();
  const { setActiveSurah } = useAudio();
  const [expandingId, setExpandingId] = useState<string | null>(null);

  React.useEffect(() => {
    // Pick a meditative Surah for the Home experience
    const dashboardAtmospheres = [1, 10, 12, 14, 18, 19, 20, 27, 28, 31, 33, 43, 71];
    const randomSurah = dashboardAtmospheres[Math.floor(Math.random() * dashboardAtmospheres.length)];
    setActiveSurah(randomSurah);

    if (profile?.lastLogin) {
      const lastLogin = profile.lastLogin.toDate ? profile.lastLogin.toDate() : new Date(profile.lastLogin);
      const diff = Date.now() - lastLogin.getTime();
      const hours = diff / (1000 * 60 * 60);

      if (hours > 48) {
        toast("The path is long, but Allah is with the patient. Come back to your sanctuary today.", {
          icon: '🌿',
          duration: 6000,
          style: { borderRadius: '1rem', background: '#0F0F11', color: '#E5C158', border: '1px solid rgba(229,193,88,0.2)' }
        });
      }
    }

    // New Day Notification check
    if (profile?.revertPathDay && profile?.lastRevertDayCompletedAt) {
      const lastCompleted = profile.lastRevertDayCompletedAt.toDate ? profile.lastRevertDayCompletedAt.toDate() : new Date(profile.lastRevertDayCompletedAt);
      const diff = Date.now() - lastCompleted.getTime();
      const isNewDayReady = diff >= 1000 * 60 * 60 * 24;

      if (isNewDayReady) {
        toast(`Day ${profile.revertPathDay} is waiting for you in Nooraya. Take your next step toward the Light.`, {
          icon: '✨',
          duration: 8000,
          style: { borderRadius: '1rem', background: '#0F0F11', color: '#E5C158', border: '1px solid rgba(229,193,88,0.2)' }
        });
      }
    }
  }, [profile]);

  const handlePortalClick = (portal: typeof PORTALS[0]) => {
    setExpandingId(portal.id);
    setTimeout(() => {
      navigate(portal.route);
    }, 750);
  };

  return (
    <div className="min-h-screen pb-32 bg-[#0F0F11] relative overflow-hidden selection:bg-[#E5C158]/20 selection:text-[#E5C158]">
      {/* Luxury Slow Golden Ambient Pulsing Background Glow nodes */}
      <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] luxury-glow-pulse rounded-full" />
      <div className="absolute top-[60%] right-[10%] w-[500px] h-[500px] luxury-glow-pulse rounded-full" />

      {/* Cinematic Hero Segment */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" 
            alt="Islamic Architecture" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F11]/40 via-[#0F0F11]/80 to-[#0F0F11]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="h-px w-10 bg-[#E5C158]/50" />
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.6em] text-[#E5C158]">Celestial Serenity</span>
              <div className="h-px w-10 bg-[#E5C158]/50" />
            </div>

            {/* Daily Streak Widget */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="inline-flex items-center space-x-5 px-10 py-5 bg-[#161619]/60 backdrop-blur-2xl border border-[#E5C158]/15 rounded-[2.5rem] mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group hover:scale-105 transition-all duration-500 cursor-pointer"
              onClick={() => navigate('/revert')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-20 group-hover:opacity-60 transition-opacity" />
                <Flame size={28} className="text-orange-500 animate-pulse relative z-10 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-[#E5C158]/60 leading-none mb-1.5">Divine Momentum</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-serif font-bold text-[#FDFCF0] leading-none tracking-tight">{profile?.streakCount || 0}</p>
                  <p className="text-xs font-serif italic text-slate-400 opacity-60">Day Streak</p>
                </div>
              </div>
              <div className="ml-4 pl-4 border-l border-white/5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-[#FDFCF0] mb-8 leading-[1.05] tracking-tight">
              {t('dashboard.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-serif mb-12 max-w-2xl mx-auto opacity-70 leading-relaxed italic">
              {t('dashboard.hero.subtitle')}
              <span className="block text-xs mt-4 font-mono font-black uppercase tracking-widest text-[#E5C158]/60">— An-Nur 24:35</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/feed')}
                className="w-full sm:w-auto bg-[#E5C158] hover:bg-[#E5C158]/90 text-[#0F0F11] px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Play size={16} fill="currentColor" />
                <span>{t('dashboard.hero.cta_feed')}</span>
              </button>
              <button 
                onClick={() => navigate('/explore')}
                className="w-full sm:w-auto bg-white/5 backdrop-blur-xl text-[#FDFCF0] border border-white/10 hover:border-[#E5C158]/30 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <BookOpen size={16} />
                <span>{t('dashboard.hero.cta_explore')}</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-1 h-12 bg-gradient-to-b from-[#E5C158] to-transparent rounded-full" />
        </div>
      </section>

      {/* Core Modules Container */}
      <div className="container mx-auto px-4 py-16 space-y-36 relative z-10">
        
        {/* SACRED PORTALS GRID (Luxury Upgraded Grid Section) */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#E5C158] uppercase">The Sanctuary Portal</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FDFCF0] tracking-tight">The Gateways of <span className="text-[#E5C158] italic font-medium">Sacred Science</span></h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#E5C158]/40 to-transparent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <motion.div
                  key={portal.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePortalClick(portal)}
                  className="glass-card p-8 relative overflow-hidden group cursor-pointer border-[#E5C158]/15 bg-[#161619]/40 flex flex-col justify-between min-h-[300px]"
                >
                  {/* Subtle Glowing Radial Spot inside card on hover */}
                  <div className={`absolute -right-20 -top-20 w-48 h-48 bg-gradient-to-br ${portal.glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/10 flex items-center justify-center text-[#E5C158] group-hover:bg-[#E5C158] group-hover:text-[#0F0F11] transition-all duration-500 shadow-xl">
                        <Icon size={22} />
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">{portal.tag}</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-mono tracking-[0.2em] text-[#E5C158]/70 block">{portal.subtitle}</span>
                      <h3 className="text-2xl font-serif font-bold text-[#FDFCF0] tracking-wide group-hover:text-[#E5C158] transition-colors">{portal.title}</h3>
                    </div>

                    <p className="text-xs text-slate-400 font-serif italic leading-relaxed line-clamp-3">
                      {portal.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[#E5C158]/80 group-hover:text-[#E5C158] transition-colors">
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Unveil Reality</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Existing Content Blocks preserved and aligned with luxury layouts */}
        <SpiritualPharmacy />
        
        <DailyWisdom />
        
        <DailyDhikr />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
           <div className="space-y-12">
              <div 
                onClick={() => navigate('/revert')}
                className="glass-card p-10 border-[#E5C158]/15 relative overflow-hidden group cursor-pointer bg-[#161619]/40 hover:bg-[#161619]/60 transition-all duration-500"
              >
                 <div className="absolute top-0 right-0 p-8 text-[#E5C158]/5 group-hover:text-[#E5C158]/10 transition-all duration-700 rotate-12">
                    <Footprints size={120} />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                       <span className="px-3 py-1 bg-[#E5C158] text-[#0F0F11] font-mono font-black text-[9px] rounded-full uppercase tracking-widest">30 Days of Light</span>
                       <Flame className="text-orange-500 animate-pulse" size={16} fill="currentColor" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-[#FDFCF0] mb-4">The Revert Path</h3>
                    <p className="text-slate-400 font-serif italic mb-8 leading-relaxed max-w-sm">
                      A curated 30-day journey for new Muslims. Deepen your faith, learn the basics, and unlock milestones.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-[#E5C158] font-mono font-black uppercase tracking-widest text-[9px]">
                        <span>Begin Journey</span>
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                      <div className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-500">
                        Current Day: {profile?.revertPathDay || 1}/30
                      </div>
                    </div>
                 </div>
              </div>
              <DailyDeed />
           </div>
           
           <div className="space-y-12">
              <div 
                onClick={() => navigate('/shahada')}
                className="glass-card p-10 border-[#E5C158]/15 relative overflow-hidden group cursor-pointer bg-[#161619]/40 hover:bg-[#161619]/60 transition-all duration-500"
              >
                 <div className="absolute top-0 right-0 p-8 text-[#E5C158]/5 group-hover:text-[#E5C158]/10 transition-all duration-700 rotate-12">
                    <Star size={120} fill="currentColor" />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                       <span className="px-3 py-1 bg-[#E5C158] text-[#0F0F11] font-mono font-black text-[9px] rounded-full uppercase tracking-widest">New Journey</span>
                       <Star className="text-[#E5C158] animate-pulse" size={16} fill="currentColor" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-[#FDFCF0] mb-4">Declare Your Shahada</h3>
                    <p className="text-slate-400 font-serif italic mb-8 leading-relaxed max-w-sm">
                      Ready to embrace the light of Islam? Our guided sanctuary is here to welcome you home.
                    </p>
                    <div className="flex items-center space-x-3 text-[#E5C158] font-mono font-black uppercase tracking-widest text-[9px]">
                       <span>Enter Reality</span>
                       <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                 </div>
              </div>
              
              <div className="glass-card p-10 border-[#E5C158]/15 relative overflow-hidden bg-[#161619]/40 group">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                       <MessageCircle className="text-[#E5C158]" size={24} />
                       <h3 className="text-2xl font-serif font-bold text-[#FDFCF0]">{t('dashboard.noor_ai.title')}</h3>
                    </div>
                    <button 
                      onClick={() => navigate('/noor')}
                      className="p-3 bg-[#E5C158]/10 text-[#E5C158] rounded-full hover:bg-[#E5C158] hover:text-[#0F0F11] transition-all"
                    >
                      <ArrowRight size={20} />
                    </button>
                 </div>
                 <p className="text-slate-400 font-serif italic mb-8 leading-relaxed">
                   Need immediate spiritual guidance or have a question about the Deen? Ask Noor AI.
                 </p>
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0F0F11] bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" className="opacity-60" />
                      </div>
                    ))}
                    <div className="px-6 h-12 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center text-xs font-black text-[#E5C158] ml-8">
                       2.4k+ Souls Online
                    </div>
                 </div>
              </div>
              <VirtueTracker />
           </div>
        </div>

        <PrayerTimes />
        
        <AdminFAQ />

        <section className="text-center py-24 glass-card border-[#E5C158]/15 space-y-12 max-w-5xl mx-auto">
            <div className="w-24 h-24 bg-[#E5C158]/10 rounded-[3rem] flex items-center justify-center text-[#E5C158] mx-auto shadow-2xl">
                <Sparkles size={48} />
            </div>
            <div className="max-w-2xl mx-auto space-y-6 px-6">
                <h2 className="text-4xl font-serif font-bold text-[#FDFCF0] tracking-tight">Become a Guardian of Wisdom</h2>
                <p className="text-slate-400 font-serif italic text-lg leading-relaxed">
                    Share your reflections, teach others, and help grow the Nooraya community. Our light grows stronger when shared.
                </p>
            </div>
            <button className="bg-[#E5C158] text-[#0F0F11] hover:bg-[#E5C158]/90 px-16 py-6 rounded-[2.5rem] font-mono font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all duration-300">
                Apply as a Contributor
            </button>
        </section>
      </div>

      {/* Kinetic Scaled Expansion Screen overlay */}
      <AnimatePresence>
        {expandingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#0F0F11] flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8 max-w-lg px-6"
            >
              <div className="w-20 h-20 bg-[#E5C158]/10 rounded-full flex items-center justify-center text-[#E5C158] mx-auto animate-pulse">
                <Sparkles size={36} />
              </div>
              <p className="text-[10px] font-mono tracking-[0.4em] text-[#E5C158] uppercase">Ascending Thread</p>
              <h2 className="text-3xl font-serif text-[#FDFCF0]">Opening Sanctuary...</h2>
              <div className="h-1 w-32 bg-[#E5C158]/20 rounded-full overflow-hidden mx-auto relative">
                <motion.div 
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="absolute h-full w-1/2 bg-[#E5C158] rounded-full" 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
