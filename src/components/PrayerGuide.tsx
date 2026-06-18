import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, Waves, Heart, Sparkles, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

const WUDU_STEPS = [
  { title: "Niyyah & Bismillah", description: "Start with intention and say Bismillah.", icon: Waves },
  { title: "Hands", description: "Wash hands up to the wrists three times.", icon: Waves },
  { title: "Mouth", description: "Rinse the mouth three times.", icon: Waves },
  { title: "Nose", description: "Clean the nose by sniffing water and blowing it out three times.", icon: Waves },
  { title: "Face", description: "Wash the entire face three times, from forehead to chin.", icon: Waves },
  { title: "Arms", description: "Wash the right arm then the left arm up to the elbow three times.", icon: Waves },
  { title: "Head & Ears", description: "Perform 'Masah' - wipe the head with wet hands once and clean the ears.", icon: Waves },
  { title: "Feet", description: "Wash the right foot then the left foot up to the ankles three times.", icon: Waves }
];

const SALAH_STEPS = [
  { 
    title: "Takbir", 
    description: "Raise hands and say Allahu Akbar.", 
    arabic: "الله أكبر",
    audioLabel: "Takbiratul Ihram"
  },
  { 
    title: "Qiyam", 
    description: "Stand upright and recite Surah Al-Fatiha.", 
    arabic: "الْحَمْدُ للَّهِ رَبِّ الْعَالَمِينَ...",
    audioLabel: "Al-Fatiha"
  },
  { 
    title: "Ruku", 
    description: "Bow down with hands on knees.", 
    arabic: "سبحان ربي العظيم",
    audioLabel: "Subhana Rabbiyal Azeem"
  },
  { 
    title: "Sujud", 
    description: "Prostrate with head on the ground.", 
    arabic: "سبحان ربي الأعلى",
    audioLabel: "Subhana Rabbiyal A'la"
  },
  { 
    title: "Tashahhud", 
    description: "Sit for the final declaration of faith.", 
    arabic: "التحيات لله والصلوات...",
    audioLabel: "Attahiyat"
  }
];

export const PrayerGuide = () => {
  const [activeTab, setActiveTab] = useState<'wudu' | 'salah'>('wudu');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = activeTab === 'wudu' ? WUDU_STEPS : SALAH_STEPS;

  const handlePlayAudio = (label: string) => {
    toast.success(`Playing ${label} narration...`, {
      icon: '🎧',
      style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 islamic-pattern min-h-screen">
      <header className="mb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3 mb-6"
        >
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-starry-teal-dark shadow-lg">
            <Sparkles size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/60">Pillars of Practice</span>
        </motion.div>
        <h1 className="text-5xl font-serif font-bold text-cream mb-6 tracking-tight">The Prayer Sanctuary</h1>
        
        <div className="flex items-center justify-center space-x-4 mt-12">
          <button 
            onClick={() => { setActiveTab('wudu'); setCurrentStep(0); }}
            className={cn(
              "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'wudu' ? "bg-gold text-starry-teal-dark shadow-xl" : "bg-white/5 text-slate-500"
            )}
          >
            Ablution (Wudu)
          </button>
          <button 
            onClick={() => { setActiveTab('salah'); setCurrentStep(0); }}
            className={cn(
              "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'salah' ? "bg-gold text-starry-teal-dark shadow-xl" : "bg-white/5 text-slate-500"
            )}
          >
            Prayer (Salah)
          </button>
        </div>
      </header>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-10 sm:p-20 border-gold/20 relative"
          >
            <div className="absolute top-8 left-10 text-[10px] font-black uppercase tracking-[0.4em] text-gold/30">
              Step {currentStep + 1} of {steps.length}
            </div>

            <div className="flex flex-col items-center text-center space-y-12">
              <div className="w-32 h-32 bg-gold/10 rounded-[3rem] flex items-center justify-center text-gold border border-gold/20 shadow-inner">
                {activeTab === 'wudu' ? (
                   <Waves size={48} />
                ) : (
                   <div className="text-4xl font-serif font-bold text-gold">
                      {currentStep + 1}
                   </div>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-serif font-bold text-cream">
                  {steps[currentStep].title}
                </h2>
                <p className="text-xl text-slate-400 font-serif italic max-w-xl mx-auto leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </div>

              {activeTab === 'salah' && (
                <div className="space-y-8 w-full">
                   <h3 className="text-5xl font-serif text-gold" dir="rtl">
                      {(steps[currentStep] as any).arabic}
                   </h3>
                   <button 
                     onClick={() => handlePlayAudio((steps[currentStep] as any).audioLabel)}
                     className="mx-auto flex items-center space-x-3 px-8 py-4 bg-white/5 hover:bg-gold hover:text-starry-teal-dark border border-white/10 rounded-full transition-all group noor-glow-sm"
                   >
                     <Volume2 size={20} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Listen to Recitation</span>
                   </button>
                </div>
              )}

              <div className="flex items-center justify-between w-full pt-12 border-t border-white/5">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={cn(
                    "p-4 rounded-2xl border border-white/10 transition-all",
                    currentStep === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5 hover:text-gold"
                  )}
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex space-x-2">
                  {steps.map((_, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "h-1.5 transition-all duration-500 rounded-full",
                        idx === currentStep ? "w-8 bg-gold" : "w-1.5 bg-white/10"
                      )}
                    />
                  ))}
                </div>

                <button 
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className={cn(
                    "p-4 rounded-2xl border border-white/10 transition-all",
                    currentStep === steps.length - 1 ? "opacity-30 cursor-not-allowed text-emerald-400" : "hover:bg-white/5 hover:text-gold"
                  )}
                >
                  {currentStep === steps.length - 1 ? <CheckCircle2 size={24} /> : <ChevronRight size={24} />}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
