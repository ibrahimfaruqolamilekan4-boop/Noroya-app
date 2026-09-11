import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Atom, ShieldCheck, Heart, Sparkles, AlertCircle, 
  ChevronRight, Brain, Zap, Moon, Sun, Wind, Activity,
  CheckCircle2, RefreshCcw, Eye, HeartPulse, ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { SoulJournal } from './SoulJournal';

const Flame = (props: any) => <Atom {...props} />; // Placeholder as I used Atom but user might want something else, though Atom fits 'Soul Science'

interface SpiritualState {
  id: string;
  title: string;
  arabic: string;
  description: string;
  color: string;
  icon: any;
}

interface HeartDisease {
  id: string;
  title: string;
  arabic: string;
  symptoms: string[];
  description: string;
  cureRef: string;
}

interface SpiritualCure {
  id: string;
  title: string;
  arabic: string;
  description: string;
  actionItems: string[];
}

const SOUL_STATES: SpiritualState[] = [
  {
    id: 'ammarah',
    title: "The Soul that Dictates Evil",
    arabic: "النفس الأمّارة بالسوء",
    description: "The state where a person easily gives into desires, ego, and anger. It is the raw, impulsive self focused on immediate gratification.",
    color: "from-red-500/20 to-orange-500/20",
    icon: Flame
  },
  {
    id: 'lawwamah',
    title: "The Self-Accusing Soul",
    arabic: "النفس اللوّامة",
    description: "The beautiful, fighting state. When you commit a sin, you instantly feel guilt and regret, pulling yourself back to Allah. It is the conscience in action.",
    color: "from-blue-500/20 to-indigo-500/20",
    icon: Activity
  },
  {
    id: 'mutmainnah',
    title: "The Soul at Peace",
    arabic: "النفس المطمئنة",
    description: "The ultimate goal. A heart completely content with the decree of Allah, calm in the face of trials, and satisfied with the path of guidance.",
    color: "from-emerald-500/20 to-teal-500/20",
    icon: Moon
  }
];

const HEART_DISEASES: HeartDisease[] = [
  {
    id: 'kibr',
    title: "Al-Kibr (Pride)",
    arabic: "الكبر",
    description: "The ego's attempt to elevate itself above others and resist the Truth.",
    symptoms: ["Looking down on others", "Refusing advice", "Excessive self-focus"],
    cureRef: 'muraqabah'
  },
  {
    id: 'hasad',
    title: "Al-Hasad (Envy)",
    arabic: "الحسد",
    description: "The burning desire for another's blessing to be removed.",
    symptoms: ["Feeling pain at another's success", "Backbiting the blessed", "Ingratitude for one's own lot"],
    cureRef: 'shukr'
  },
  {
    id: 'riyaa',
    title: "Riyaa (Showing Off)",
    arabic: "الرياء",
    description: "The hidden shirk—doing good deeds for people's praise instead of Allah's pleasure.",
    symptoms: ["Working harder when watched", "Seeking public validation", "Vanity in worship"],
    cureRef: 'muraqabah'
  },
  {
    id: 'ghaflah',
    title: "Al-Ghaflah (Heedlessness)",
    arabic: "الغفلة",
    description: "Being so distracted by the dunya (money, scrolling, life) that the Akhirah is forgotten.",
    symptoms: ["Procrastinating prayer", "Ignoring spiritual signals", "Constant distraction"],
    cureRef: 'istighfar'
  }
];

const CURES: SpiritualCure[] = [
  {
    id: 'sabr-shukr',
    title: "Sabr & Shukr",
    arabic: "الصبر والشكر",
    description: "The two wings of the believer. Patience in trials and gratitude in ease.",
    actionItems: [
      "Wait 5 seconds before reacting in anger",
      "List 3 specific blessings before sleep",
      "Acknowledge the Source of every good"
    ]
  },
  {
    id: 'muraqabah',
    title: "Al-Muraqabah (Mindfulness)",
    arabic: "المراقبة",
    description: "Living with the constant awareness that Allah sees you and cares for you.",
    actionItems: [
      "Renew intention before every major action",
      "Practice 5 minutes of silent reflection",
      "Speak as if Allah is your witness"
    ]
  },
  {
    id: 'istighfar',
    title: "Al-Istighfar Engine",
    arabic: "الاستغفار",
    description: "The power of constant repentance to wipe the black spots off the spiritual heart.",
    actionItems: [
      "Recite 70x Istighfar daily",
      "Analyze one mistake and repent specifically",
      "Trust in Allah's infinite Mercy"
    ]
  }
];

const HeartMirror = ({ cloudiness }: { cloudiness: number }) => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      {/* Background Glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gold/10 rounded-full blur-3xl"
      />
      
      {/* The Heart Structure */}
      <div className="relative w-full h-full">
        {/* Mirror Frame */}
        <div className="absolute inset-0 border-[1px] border-gold/20 rounded-full animate-spin-slow" />
        
        {/* The Core Heart Light */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: 1 - (cloudiness / 100) * 0.8
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-gold"
          >
            <Heart size={120} fill="currentColor" className="drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
          </motion.div>
        </div>

        {/* The Clouds (Heedlessness) */}
        <AnimatePresence>
          {cloudiness > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: (cloudiness / 100) }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-full overflow-hidden"
            >
              {/* Particle dust */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [Math.random() * 200, Math.random() * -200],
                    y: [Math.random() * 200, Math.random() * -200],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
                  className="absolute w-2 h-2 bg-slate-400/20 rounded-full blur-sm"
                  style={{ top: '50%', left: '50%' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <Sparkles className="absolute top-4 right-4 text-gold/30 animate-pulse" size={24} />
      <Sparkles className="absolute bottom-8 left-4 text-gold/20 animate-pulse delay-700" size={16} />
    </div>
  );
};

const SpiritualCheckIn = () => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    { text: "How calm was your heart during prayer today?", icon: Moon },
    { text: "How much did your ego influence your interactions?", icon: Zap },
    { text: "Have you remembered the Final Destination today?", icon: Eye }
  ];

  const handleResponse = (val: number) => {
    const newResponses = [...responses, val];
    if (step < questions.length - 1) {
      setResponses(newResponses);
      setStep(step + 1);
    } else {
      // Calculate result
      const avg = newResponses.reduce((a, b) => a + b, 0) / questions.length;
      if (avg < 40) setResult("ammarah");
      else if (avg < 75) setResult("lawwamah");
      else setResult("mutmainnah");
    }
  };

  if (result) {
    const state = SOUL_STATES.find(s => s.id === result)!;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className={cn("p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br", state.color)}>
           <state.icon className="mx-auto mb-6 text-cream" size={48} />
           <h3 className="text-2xl font-serif font-bold text-cream mb-2">Internal Standing</h3>
           <p className="text-gold font-serif italic mb-4">{state.title}</p>
           <p className="text-slate-400 text-sm leading-relaxed mb-8">{state.description}</p>
           <button 
             onClick={() => { setStep(0); setResponses([]); setResult(null); }}
             className="text-xs uppercase font-black tracking-widest text-gold hover:text-cream transition-colors flex items-center gap-2 mx-auto"
           >
             <RefreshCcw size={12} /> Recalibrate Heart
           </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-serif font-bold text-cream">Spiritual Check-in</h3>
        <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Private Mirror Reflection</p>
      </div>

      <div className="space-y-10">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            {React.createElement(questions[step].icon, { className: "text-gold/40", size: 32 })}
            <p className="text-cream font-serif text-lg italic px-4 leading-relaxed">{questions[step].text}</p>
          </motion.div>

          <div className="w-full flex items-center justify-between gap-4">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-600">Not At All</span>
            <div className="flex-1 flex gap-2">
              {[20, 40, 60, 80, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => handleResponse(v)}
                  className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition-all text-gold flex items-center justify-center font-bold"
                >
                  {v}%
                </button>
              ))}
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-600">Completely</span>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 w-8 rounded-full transition-all",
                step === i ? "bg-gold" : "bg-white/10"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SoulScience = () => {
  const [selectedDisease, setSelectedDisease] = useState<HeartDisease | null>(null);
  const [cloudiness, setCloudiness] = useState(30);
  const [showJournal, setShowJournal] = useState(false);

  const handleCureAccess = (disease: HeartDisease) => {
    setSelectedDisease(disease);
    setCloudiness(prev => Math.min(100, prev + 20));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  if (showJournal) {
    return (
      <div className="space-y-12 max-w-6xl mx-auto py-12">
        <button 
          onClick={() => setShowJournal(false)}
          className="group flex items-center gap-3 text-gold/60 hover:text-gold transition-all font-black uppercase tracking-[0.3em] text-[10px]"
        >
          <div className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform bg-gold/5">
            <ArrowLeft size={14} />
          </div>
          Back to Soul Science
        </button>
        <SoulJournal />
      </div>
    );
  }

  return (
    <div className="space-y-32">
      {/* 1. The Mirror Section */}
      <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32 max-w-6xl mx-auto">
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-3 px-4 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-gold/20"
            >
              <Heart size={14} />
              <span>The Human Condition</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-cream tracking-tight">The <span className="text-gold italic">Heart Mirror</span></h2>
            <p className="text-xl text-slate-400 font-serif italic leading-relaxed">
              In Islam, your physical heart has a spiritual counterpart. Every deed either polishes this mirror or clouds it with heedlessness.
            </p>
          </div>

          <div className="glass-card p-10 border-gold/10">
            <SpiritualCheckIn />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <HeartMirror cloudiness={cloudiness} />
        </div>
      </section>

      {/* 2. The Journey Section (3 States) */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-cream">The Journey of the <span className="text-gold">Nafs</span></h2>
          <p className="text-slate-500 font-serif italic text-lg max-w-2xl mx-auto">Propelled by effort, pulled by desire, anchored in peace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOUL_STATES.map((state) => (
            <motion.div
              key={state.id}
              whileHover={{ y: -10 }}
              className={cn(
                "p-12 rounded-[3.5rem] border border-white/5 bg-gradient-to-br transition-all duration-700",
                state.color
              )}
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-cream mb-10">
                <state.icon size={32} />
              </div>
              <p className="text-gold font-serif italic text-sm mb-4 leading-relaxed" dir="rtl">{state.arabic}</p>
              <h3 className="text-2xl font-serif font-bold text-cream mb-6 leading-tight">{state.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-serif italic opacity-80">{state.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Diagnosis & Prescription */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Diseases */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-bold text-cream">Spiritual <span className="text-red-400">Diagnosis</span></h2>
            <p className="text-slate-500 font-serif italic">Recognizing the silent diseases of the heart.</p>
          </div>

          <div className="space-y-4">
            {HEART_DISEASES.map((disease) => (
              <motion.button
                key={disease.id}
                onClick={() => handleCureAccess(disease)}
                whileHover={{ x: 10 }}
                className={cn(
                  "w-full text-left p-8 rounded-3xl border transition-all group",
                  selectedDisease?.id === disease.id 
                    ? "bg-red-500/10 border-red-500/30" 
                    : "bg-white/5 border-white/5 hover:border-red-500/20"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-serif font-bold text-cream group-hover:text-red-400 transition-colors">{disease.title}</h4>
                  <span className="text-red-400/40 text-sm font-serif" dir="rtl">{disease.arabic}</span>
                </div>
                <p className="text-slate-400 text-sm italic font-serif mb-4 leading-relaxed">{disease.description}</p>
                <div className="flex flex-wrap gap-2">
                  {disease.symptoms.map(s => (
                    <span key={s} className="text-[10px] uppercase font-black tracking-widest text-red-400/60 bg-red-400/5 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertCircle size={8} /> {s}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cures */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-bold text-cream">Prophetic <span className="text-emerald-400">Cures</span></h2>
            <p className="text-slate-500 font-serif italic">Prescriptions from the Living Sunnah.</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDisease?.cureRef || 'default'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {(selectedDisease ? CURES.filter(c => c.id === selectedDisease.cureRef) : CURES).map((cure) => (
                <div key={cure.id} className="p-10 rounded-[3rem] border border-emerald-500/20 bg-emerald-500/5 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-xl border border-emerald-500/20">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-cream">{cure.title}</h3>
                      <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400/60">{cure.arabic}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 font-serif italic leading-relaxed text-lg pl-6 border-l-2 border-emerald-500/20">
                    {cure.description}
                  </p>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Action Protocol</h5>
                    <div className="space-y-3">
                      {cure.actionItems.map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group/item"
                          onClick={() => {
                            toast.success("Action logged to your Spiritual Journal", { icon: '📖' });
                            setCloudiness(prev => Math.max(0, prev - 10));
                          }}
                        >
                          <CheckCircle2 className="text-emerald-500/40 group-hover/item:text-emerald-500 transition-colors" size={18} />
                          <span className="text-cream/70 text-sm font-serif italic leading-relaxed">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {!selectedDisease && (
                <div className="text-center py-20 px-10 border border-dashed border-white/10 rounded-[3rem]">
                  <RefreshCcw className="mx-auto mb-6 text-slate-700 animate-spin-slow" size={48} />
                  <p className="text-slate-500 font-serif italic">Select a Diagnosis to unveil the specific Prophetic Cure</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Journal Call to Action */}
      <section className="text-center bg-gold/5 border-y border-gold/10 py-32 px-8 -mx-4 islamic-pattern">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-gold blur-3xl opacity-20" />
             <HeartPulse className="text-gold relative z-10 mx-auto" size={64} />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-cream tracking-tight">The <span className="text-gold italic font-medium">Spiritual Journal</span></h2>
          <p className="text-xl text-slate-400 font-serif italic leading-relaxed">
            Record your daily reflections, track the cleansing of your heart, and witness the growth of your soul month by month.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setShowJournal(true)}
              className="w-full sm:w-auto px-16 py-7 rounded-full bg-gold text-slate-950 font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:scale-105 transition-all"
            >
              Initialize My Journal
            </button>
            <button 
              onClick={() => setShowJournal(true)}
              className="w-full sm:w-auto px-16 py-7 rounded-full bg-white/5 border border-white/10 text-cream/60 font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white/10 transition-all"
            >
              View History
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
