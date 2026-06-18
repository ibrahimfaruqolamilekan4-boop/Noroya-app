import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CheckCircle2, PlayCircle, BookOpen, Sparkles, ChevronRight, Wind, Heart, Star, Play, Mic, Info, ArrowRight, Clock, Square, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const REVERT_DAYS = [
  { 
    day: 1, 
    title: "The First Witness", 
    type: "Theory & Practice", 
    duration: "10 min", 
    description: "Welcome home. Understanding the depth of the Shahada and your first word.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    article: "Islam is not a destination you reach overnight, but a journey of 1,000 steps. Today, you didn't just walk; you transformed. You stood at the threshold of the Divine and said 'Yes'. This path is paved with mercy, even when it feels heavy. Remember, the Creator does not look at your speed, but at your sincerity.",
    practiceWord: {
      arabic: "ٱلْحَمْدُ لِلَّٰهِ",
      transliteration: "Alhamdulillah",
      translation: "All praise is due to Allah",
      audio: "https://www.islamicfinder.org/quran/audio/1/1.mp3"
    }
  },
  { 
    day: 2, 
    title: "Who is Allah?", 
    type: "Knowledge", 
    duration: "15 min", 
    description: "Introduction to Ar-Rahman (The Most Merciful) and Al-Wadud (The Most Loving).",
    article: "Now that you feel welcome, let us introduce you to the One who welcomed you. Allah is not a distant, cold force. He is closer to you than your jugular vein. He describes Himself through Names—each a window into His infinite perfection. Today, we focus on the embrace: Ar-Rahman (The Originator of Mercy) and Al-Wadud (The Affectionate).",
    namesOfAllah: [
      { name: "Ar-Rahman", meaning: "The Most Merciful", description: "The One whose mercy encompasses all of existence.", audio: "https://www.islamicfinder.org/quran/audio/names/1.mp3" },
      { name: "Ar-Raheem", meaning: "The Especially Merciful", description: "The One who is specifically merciful to those who believe.", audio: "https://www.islamicfinder.org/quran/audio/names/2.mp3" },
      { name: "Al-Wadud", meaning: "The Most Loving", description: "The One whose love is unconditional and affectionate.", audio: "https://www.islamicfinder.org/quran/audio/names/47.mp3" },
      { name: "Al-Ghaffar", meaning: "The All-Forgiving", description: "The One who repeatedly forgives the faults of His servants.", audio: "https://www.islamicfinder.org/quran/audio/names/14.mp3" },
      { name: "Al-Lateef", meaning: "The Subtle One", description: "The One who is gentle and knows the finest details.", audio: "https://www.islamicfinder.org/quran/audio/names/30.mp3" }
    ],
    task: "Find one thing in nature today (a flower, the sky, a bird) and say SubhanAllah (Glory be to Allah)."
  },
  { day: 3, title: "The Prophets", type: "Knowledge", duration: "18 min", description: "Why did Allah send them? A guide to the carriers of Light.", articleId: 'prophets-guide', task: "Read the story of Prophet Ibrahim (AS) in the Encyclopedia." },
  { day: 4, title: "Angels & The Unseen", type: "Spirituality", duration: "12 min", description: "Understanding that you are never truly alone.", task: "Recite the protection dua before sleeping." },
  { day: 5, title: "The Divine Speech", type: "Knowledge", duration: "20 min", description: "Introduction to the Quran: The direct words of your Creator.", task: "Listen to Surah Ar-Rahman recitation for 5 minutes." },
  { day: 6, title: "Destiny (Qadr)", type: "Reflection", duration: "15 min", description: "Trusting the beautiful plan written for your life.", task: "Write down one hardship that brought you closer to Allah." },
  { day: 7, title: "Weekly Reflection", type: "Milestone", duration: "25 min", description: "Earning your first Milestone Badge and reviewing the journey.", isMilestone: true },
  
  // Week 2
  { day: 8, title: "Sacred Washing", type: "Practice", duration: "15 min", description: "Wudu: The spiritual secret of purification.", task: "Perform Wudu slowly, focusing on each drop of water." },
  { day: 9, title: "The Five Pillars", type: "Knowledge", duration: "20 min", description: "Organizing your day around the source of Light.", task: "Set reminders for the 5 prayer times today." },
  { day: 10, title: "Movement of the Soul", type: "Practice", duration: "25 min", description: "Understanding the meanings behind bowing and prostrating.", task: "Practice the physical movements of Salah." },
  { day: 11, title: "The Opening Seven", type: "Memorization", duration: "30 min", description: "Surah Al-Fatihah: The verses you'll use every single day.", task: "Memorize the first 3 verses of Surah Al-Fatihah." },
  { day: 12, title: "Healing the World", type: "Practice", duration: "15 min", description: "Zakat & Charity: How your wealth cleansing works.", task: "Give a small amount of charity or help someone in need." },
  { day: 13, title: "Discipline of Soul", type: "Knowledge", duration: "12 min", description: "Fasting: The silent conversation with Allah.", task: "Try to fast for part of the day or avoid one bad habit." },
  { day: 14, title: "First Connection", type: "Milestone", duration: "30 min", description: "Practice your first full prayer and earn your badge.", isMilestone: true },

  // Week 3
  { day: 15, title: "Pure Living", type: "Lifestyle", duration: "15 min", description: "Halal Food: Eating for a healthy and radiant soul.", task: "Check the ingredients of one thing you eat today for Halal status." },
  { day: 16, title: "Dignity in Modesty", type: "Lifestyle", duration: "15 min", description: "Islamic modesty in dress and beautiful behavior.", task: "Practice 'modesty of the tongue'—avoid complaining today." },
  { day: 17, title: "Sacred Bonds", type: "Knowledge", duration: "18 min", description: "The excellence of treating parents and relatives.", task: "Call or message a family member with a kind word." },
  { day: 18, title: "Guard Your Speech", type: "Reflection", duration: "10 min", description: "The power of truth and avoiding the darkness of gossip.", task: "Speak only truth and kindness for the next 4 hours." },
  { day: 19, title: "Integrity at Work", type: "Lifestyle", duration: "15 min", description: "Bringing Islam into your professional and school life.", task: "Perform your tasks today with 'Ihsan' (excellence)." },
  { day: 20, title: "Social Justice", type: "Perspective", duration: "20 min", description: "Islam's stand on equality and uplifting the poor.", task: "Read about the Sahaba who was a former slave, Bilal (RA)." },
  { day: 21, title: "Guardian Unlock", type: "Milestone", duration: "25 min", description: "Earning the Guardian level and unlocking a scholar video.", isMilestone: true },

  // Week 4
  { day: 22, title: "The Best of Models", type: "Knowledge", duration: "25 min", description: "Prophet Muhammad (ﷺ): His character as a mirror.", task: "Learn one Sunnah (tradition) of the Prophet (ﷺ) to implement." },
  { day: 23, title: "The First Heroes", type: "History", duration: "20 min", description: "Stories of the Sahaba: The first generation of light.", task: "Share one story of a Sahabi with a friend." },
  { day: 24, title: "The Global Gathering", type: "Knowledge", duration: "15 min", description: "Hajj: The ultimate journey of unity and submission.", task: "Watch a short video of the Kaaba during Hajj." },
  { day: 25, title: "The Final Meeting", type: "Reflection", duration: "20 min", description: "Preparing for the beautiful meeting with your Lord.", task: "Write a letter to your future self about your faith." },
  { day: 26, title: "The Utmost Reward", type: "Spirituality", duration: "20 min", description: "Jannah: The eternal sanctuary for the patient.", task: "Describe your version of Jannah in your journal." },
  { day: 27, title: "Remaining Firm", type: "Guidance", duration: "18 min", description: "Handling doubts and staying firm upon the Light.", task: "Memorize the dua: 'O Turner of Hearts, keep my heart firm on Your path'." },
  { day: 28, title: "Finding Your Tribe", type: "Guidance", duration: "15 min", description: "Choosing a local mosque and finding righteous friends.", task: "Search for the nearest local Islamic center or mosque." },
  { day: 29, title: "Month in Review", type: "Reflection", duration: "30 min", description: "Looking back at your first 29 steps toward Allah.", task: "Review your reflection journal from the past 4 weeks." },
  { day: 30, title: "Graduation Day", type: "Milestone", duration: "45 min", description: "Becoming a Noor-Bearer and receiving your certificate.", isMilestone: true, isGraduation: true },
];

export const RevertPath = () => {
  const { user, profile } = useAuth();
  const currentDay = profile?.revertPathDay || 1;
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceWords, setPracticeWords] = useState<{ word: string, status: 'none' | 'correct' | 'incorrect' }[]>([]);
  const [practiceScore, setPracticeScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pointsClaimed, setPointsClaimed] = useState(false);
  const [reflectionInput, setReflectionInput] = useState(["", "", ""]);
  const [showReflection, setShowReflection] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const normalizeArabic = (text: string) => {
    return text.replace(/[\u064B-\u065F]/g, "") // Remove harakat
               .replace(/[إأآا]/g, "ا")
               .replace(/ة/g, "ه")
               .replace(/ى/g, "ي")
               .replace(/\s+/g, " ") // Keep space but normalize
               .trim();
  };

  useEffect(() => {
    // Initialize practice words
    if (REVERT_DAYS[0].practiceWord?.arabic) {
      setPracticeWords(REVERT_DAYS[0].practiceWord.arabic.split(" ").map(w => ({ word: w, status: 'none' })));
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ar-SA';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        
        const normalizedTranscript = normalizeArabic(transcript);
        
        setPracticeWords(prev => prev.map(p => {
          const isMatch = normalizedTranscript.includes(normalizeArabic(p.word));
          return { ...p, status: p.status === 'correct' ? 'correct' : (isMatch ? 'correct' : 'none') as "none" | "correct" | "incorrect" };
        }));
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please enable it in browser settings.", { icon: '🚫' });
        } else if (event.error === 'no-speech') {
          toast.error("No speech detected. Please recite clearly.", { icon: '🔇' });
        }
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          setIsRecording(false);
          setIsProcessing(true);
          setTimeout(() => {
            setPracticeWords(prev => {
              const finalWords: { word: string, status: 'none' | 'correct' | 'incorrect' }[] = prev.map(p => ({
                ...p,
                status: (p.status === 'correct' ? 'correct' : 'incorrect') as 'none' | 'correct' | 'incorrect'
              }));
              const correctCount = finalWords.filter(p => p.status === 'correct').length;
              const score = Math.floor((correctCount / finalWords.length) * 100);
              setPracticeScore(score);
              if (score >= 70) toast.success("MashaAllah! Beautifully recited.", { icon: '✨' });
              return finalWords;
            });
            setIsProcessing(false);
          }, 1000);
        }
      };
    }
  }, []); // Only once

  const handleStartPractice = () => {
    if (!recognitionRef.current) return toast.error("Speech Recognition is not supported in this browser.");
    setIsRecording(true);
    setPracticeScore(null);
    setPointsClaimed(false);
    setPracticeWords(REVERT_DAYS[0].practiceWord!.arabic.split(" ").map(w => ({ word: w, status: 'none' })));
    recognitionRef.current.start();
  };

  const handleStopPractice = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const claimPracticePoints = async () => {
    if (!user || pointsClaimed || !practiceScore || practiceScore < 70) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        noorPoints: increment(10),
        updatedAt: serverTimestamp()
      });
      setPointsClaimed(true);
      toast.success("+10 Noor Points Awarded!", { icon: '🏆' });
    } catch (e) {
      toast.error("Failed to update points.");
    }
  };

  const handleCompleteDay = async (day: number) => {
    if (!user) return;

    const dayData = REVERT_DAYS[day - 1];
    
    // Milestone check (Reflection Journal)
    if (dayData.isMilestone && !showReflection) {
      setShowReflection(true);
      return;
    }
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#008080', '#ffffff', '#F5F5DC']
    });

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        revertPathDay: day + 1,
        noorPoints: increment(dayData.isMilestone ? 100 : 50),
        lastRevertDayCompletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const successMsg = dayData.isGraduation 
        ? "MashaAllah! You have completed the 30-Day journey! You are a Noor-Bearer."
        : `SubhanAllah! You’ve taken another step toward the Light. +${dayData.isMilestone ? '100' : '50'} Noor Points added.`;

      toast.success(successMsg, {
        icon: '✨',
        duration: 5000,
        style: { borderRadius: '1.5rem', background: '#0a1a1a', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }
      });
      setShowReflection(false);
      setReflectionInput(["", "", ""]);
      setSelectedDay(null);
    } catch (e) {
      toast.error("Failed to sync progress.");
    }
  };

  const isDayLocked = (day: number) => {
    if (day <= currentDay) return false;
    if (day > currentDay + 1) return true;
    
    // Check 24 hour rule for the next day
    if (profile?.lastRevertDayCompletedAt) {
      const lastCompleted = profile.lastRevertDayCompletedAt.toDate ? profile.lastRevertDayCompletedAt.toDate() : new Date(profile.lastRevertDayCompletedAt);
      const diff = Date.now() - lastCompleted.getTime();
      return diff < 1000 * 60 * 60 * 24;
    }
    
    return false;
  };

  const ReflectionJournal = ({ day }: { day: number }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 text-center"
    >
      <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8">
        <BookOpen size={40} />
      </div>
      <h2 className="text-4xl font-serif font-bold text-cream mb-4">Reflection Journal</h2>
      <p className="text-slate-400 mb-12">To earn your Day {day} Milestone Reward, please share 3 things you've learned this week.</p>
      
      <div className="space-y-6 mb-12">
        {[0, 1, 2].map(i => (
          <div key={i} className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-gold/60 mb-2">Lesson {i + 1}</p>
            <input 
              type="text" 
              value={reflectionInput[i]}
              onChange={(e) => {
                const newRef = [...reflectionInput];
                newRef[i] = e.target.value;
                setReflectionInput(newRef);
              }}
              placeholder="What touched your heart this week?"
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-5 text-cream focus:border-gold/30 outline-none transition-all"
            />
          </div>
        ))}
      </div>

      <button 
        disabled={reflectionInput.some(r => r.length < 5)}
        onClick={() => handleCompleteDay(day)}
        className="w-full bg-gold text-starry-teal-dark font-black px-12 py-6 rounded-[2.5rem] uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all noor-glow disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
      >
        Complete Milestone & Claim +100 Noor Points
      </button>
    </motion.div>
  );

  const Day2Feature = ({ names }: { names: any[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-3 text-gold/60">
          <Heart size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Interactive Carousel: The Most Beautiful Names</span>
        </div>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-12 text-center border-gold/10"
            >
              <h3 className="text-6xl md:text-8xl font-serif font-bold text-gold mb-6">{names[currentIndex].name}</h3>
              <p className="text-2xl font-serif text-cream mb-4">{names[currentIndex].meaning}</p>
              <p className="text-slate-400 italic font-serif leading-relaxed mb-8 max-w-lg mx-auto">"{names[currentIndex].description}"</p>
              
              <button 
                onClick={() => {
                  const audio = new Audio(names[currentIndex].audio);
                  audio.play();
                  toast.success(`Listening to ${names[currentIndex].name}...`, { icon: '🎧' });
                }}
                className="p-5 bg-gold/10 text-gold rounded-full hover:bg-gold hover:text-starry-teal-dark transition-all noor-glow"
              >
                <Play size={24} fill="currentColor" />
              </button>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={() => setCurrentIndex(prev => (prev === 0 ? names.length - 1 : prev - 1))}
              className="p-3 rounded-xl bg-white/5 text-gold border border-gold/10 hover:bg-gold/20"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <div className="flex items-center space-x-2">
              {names.map((_, i) => (
                <div key={i} className={cn("w-2 h-2 rounded-full transition-all", i === currentIndex ? "bg-gold w-6" : "bg-white/10")} />
              ))}
            </div>
            <button 
              onClick={() => setCurrentIndex(prev => (prev === names.length - 1 ? 0 : prev + 1))}
              className="p-3 rounded-xl bg-white/5 text-gold border border-gold/10 hover:bg-gold/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 text-center">
           <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Today's Sacred Task</p>
           <p className="text-cream font-serif italic text-lg leading-relaxed">"{REVERT_DAYS[1].task}"</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* 30-Day Timeline Progress Bar */}
      <div className="mb-20 space-y-6">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gold">Path Progress</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{Math.round(((currentDay - 1) / 30) * 100)}% Complete</span>
        </div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-4 scrollbar-hide py-2 px-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const isCompleted = day < currentDay;
            const isActive = day === currentDay;
            const lockedByTimer = isDayLocked(day);
            return (
              <div key={day} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                  isActive ? (lockedByTimer ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-gold border-gold text-starry-teal-dark noor-glow scale-125 animate-pulse") :
                  "bg-white/5 border-white/10 text-slate-600"
                )}>
                  {isCompleted ? <CheckCircle2 size={14} /> : (isActive && !lockedByTimer) ? <Star size={14} fill="currentColor" /> : <Lock size={12} />}
                </div>
                <span className={cn("text-[8px] font-bold", isActive ? "text-gold" : "text-slate-500")}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <header className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 noor-glow border border-gold/20"
        >
          <Sparkles size={14} />
          <span>Automated Mentorship</span>
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-cream mb-6 tracking-tight">The 30-Day Revert Path</h2>
        <p className="text-xl text-slate-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
          A curated journey of light designed to help you ground your faith with knowledge, practice, and peace.
        </p>
      </header>

      <div className="grid gap-6">
        {REVERT_DAYS.map((d, i) => {
          const isCompleted = d.day < currentDay;
          const isCurrent = d.day === currentDay;
          const lockedByTimer = isDayLocked(d.day);
          const isLocked = d.day > currentDay || lockedByTimer;

          return (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "glass-card p-8 flex items-center justify-between group transition-all relative overflow-hidden",
                isLocked ? "opacity-40 grayscale-[0.8] overflow-hidden" : "hover:border-gold/30 cursor-pointer",
                isCurrent && !lockedByTimer && "border-gold/50 bg-gold/5 shadow-2xl noor-glow-sm"
              )}
              onClick={() => !isLocked && setSelectedDay(d.day)}
            >
              {isLocked && lockedByTimer && isCurrent && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                   <div className="flex items-center space-x-3 px-6 py-2 bg-slate-900 border border-gold/20 rounded-full">
                      <Clock size={14} className="text-gold" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gold">Unlocks tomorrow</span>
                   </div>
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 left-0 h-full w-1 bg-gold animate-pulse" />
              )}
              
              <div className="flex items-center space-x-8">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-serif font-bold transition-all",
                  isCompleted ? "bg-emerald-500/10 text-emerald-400" :
                  isCurrent ? "bg-gold text-starry-teal-dark shadow-xl" : "bg-white/5 text-slate-500"
                )}>
                  {isCompleted ? <CheckCircle2 size={24} /> : d.day}
                </div>

                <div className="text-left space-y-1">
                  <div className="flex items-center space-x-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">Day {d.day}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-700" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{d.type} • {d.duration}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-cream group-hover:text-gold transition-colors">{d.title}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                 {isLocked ? (
                   <Lock size={20} className="text-slate-600" />
                 ) : (
                   <div className="flex items-center space-x-2 text-gold group-hover:translate-x-1 transition-transform">
                     <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Enter Lesson</span>
                     <ChevronRight size={20} />
                   </div>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-starry-teal-dark/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12 relative border-gold/20"
            >
              <button 
                onClick={() => !showReflection && setSelectedDay(null)}
                className={cn(
                  "absolute top-8 right-8 text-slate-500 hover:text-gold transition-colors",
                  showReflection && "hidden"
                )}
              >
                Close Lesson
              </button>

              {showReflection ? (
                <ReflectionJournal day={selectedDay} />
              ) : selectedDay === 1 ? (
                <div className="space-y-12">
                  <div className="text-center space-y-4">
                    <span className="px-4 py-1.5 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest">Beginning the Journey</span>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-cream">Day 1: You are Home.</h2>
                  </div>

                  <div className="aspect-video bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:bg-gold/5 transition-all overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <PlayCircle size={80} className="text-gold group-hover:scale-110 transition-transform relative z-10" />
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-gold relative z-10">Welcome Message</p>
                  </div>

                  <div className="prose prose-invert max-w-none space-y-12">
                    <div className="p-8 bg-gold/5 rounded-3xl border border-gold/10 italic font-serif text-slate-400 text-lg md:text-xl leading-relaxed text-center">
                      "{REVERT_DAYS[0].article}"
                    </div>

                    <div className="space-y-8">
                       <div className="flex items-center space-x-3 text-gold/60">
                         <Info size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Interactive Practice: Your First Word</span>
                       </div>
                       <div className="glass-card p-12 border-white/5 text-center space-y-12">
                          <div className="flex flex-col items-center space-y-8">
                            <div className="relative flex items-center justify-center group">
                              <div className="flex flex-wrap justify-center gap-4 py-4 px-12" dir="rtl">
                                {practiceWords.map((p, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                      "text-7xl md:text-9xl font-serif font-bold transition-all duration-700",
                                      p.status === 'correct' ? "text-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]" :
                                      p.status === 'incorrect' ? "text-rose-500" : "text-cream/40"
                                    )}
                                  >
                                    {p.word}
                                  </motion.span>
                                ))}
                              </div>
                              
                              <button 
                                onClick={() => {
                                  const audio = new Audio(REVERT_DAYS[0].practiceWord?.audio);
                                  audio.play();
                                  toast.success("Correct Pronunciation Playing...", { icon: '🎧' });
                                }}
                                className="absolute -right-12 p-5 bg-gold/10 text-gold rounded-full hover:bg-gold hover:text-starry-teal-dark transition-all noor-glow shadow-2xl border border-gold/20 group/btn"
                                title="Play Correct Pronunciation"
                              >
                                <PlayCircle size={32} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                             <p className="text-3xl font-serif font-bold text-cream uppercase tracking-widest">{REVERT_DAYS[0].practiceWord?.transliteration}</p>
                             <p className="text-slate-500 italic font-serif">"{REVERT_DAYS[0].practiceWord?.translation}"</p>
                          </div>

                          {practiceScore !== null && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="py-4 border-y border-white/5"
                            >
                              <div className="flex items-center justify-center space-x-6">
                                <div className="text-left">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-gold/60">Tajweed Score</p>
                                  <p className="text-4xl font-serif font-bold text-cream">{practiceScore}%</p>
                                </div>
                                {practiceScore >= 70 && !pointsClaimed && (
                                  <button 
                                    onClick={claimPracticePoints}
                                    className="bg-gold text-starry-teal-dark px-6 py-3 rounded-2xl flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest noor-glow animate-bounce"
                                  >
                                    <Award size={14} />
                                    <span>Claim 10 Noor Points</span>
                                  </button>
                                )}
                                {pointsClaimed && (
                                   <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl flex items-center space-x-2 border border-emerald-500/20">
                                      <CheckCircle2 size={14} />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Points Claimed</span>
                                   </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                             <button 
                               onClick={() => {
                                 const audio = new Audio(REVERT_DAYS[0].practiceWord?.audio);
                                 audio.play();
                                 toast.success("Listen to the Light...", { icon: '🎧' });
                               }}
                               className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-white/5 hover:bg-gold/10 text-gold border border-gold/20 rounded-full transition-all text-[10px] font-black uppercase tracking-widest group"
                             >
                                <Play size={14} fill="currentColor" />
                                <span>Listen Correctly</span>
                             </button>
                             <button 
                               onClick={isRecording ? handleStopPractice : handleStartPractice}
                               disabled={isProcessing}
                               className={cn(
                                 "w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-4 rounded-full transition-all text-[10px] font-black uppercase tracking-widest noor-glow",
                                 isRecording ? "bg-rose-500 text-white animate-pulse" : 
                                 isProcessing ? "bg-white/5 text-slate-500 cursor-wait" :
                                 "bg-gold text-starry-teal-dark"
                               )}
                             >
                                {isProcessing ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                                    <span>Syncing...</span>
                                  </div>
                                ) : isRecording ? (
                                  <><Square size={14} /><span>Stop Recording</span></>
                                ) : (
                                  <><Mic size={18} /><span>Record & Compare</span></>
                                )}
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-8 pt-12">
                    <button 
                      className="bg-gold text-starry-teal-dark px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all noor-glow flex items-center space-x-3"
                      onClick={() => handleCompleteDay(1)}
                    >
                      <span>I have completed Day 1</span>
                      <ArrowRight size={18} />
                    </button>
                    <div className="flex items-center space-x-2 text-slate-500">
                       <Clock size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Day 2 unlocks in 24 hours</span>
                    </div>
                  </div>
                </div>
              ) : selectedDay === 2 ? (
                <div className="space-y-12">
                  <div className="text-center space-y-4">
                    <span className="px-4 py-1.5 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest">Day 2: Who is Allah?</span>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-cream">The Lord of Mercy</h2>
                  </div>

                  <div className="p-8 bg-gold/5 rounded-3xl border border-gold/10 italic font-serif text-slate-400 text-lg md:text-xl leading-relaxed text-center">
                    "{REVERT_DAYS[1].article}"
                  </div>

                  <Day2Feature names={(REVERT_DAYS[1] as any).namesOfAllah} />

                  <div className="flex flex-col items-center space-y-8 pt-12">
                    <button 
                      className="bg-gold text-starry-teal-dark px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all noor-glow flex items-center space-x-3"
                      onClick={() => handleCompleteDay(2)}
                    >
                      <span>I have completed Day 2</span>
                      <ArrowRight size={18} />
                    </button>
                    <div className="flex items-center space-x-2 text-slate-500">
                       <Clock size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Day 3 unlocks in 24 hours</span>
                    </div>
                  </div>
                </div>
              ) : selectedDay === 30 ? (
                <div className="text-center space-y-12 py-12">
                   <motion.div
                     initial={{ scale: 0.5, rotate: -20 }}
                     animate={{ scale: 1, rotate: 0 }}
                     className="w-32 h-32 bg-gold text-starry-teal-dark rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(212,175,55,0.4)]"
                   >
                      <Award size={64} />
                   </motion.div>
                   
                   <div className="space-y-4">
                     <h2 className="text-6xl md:text-8xl font-serif font-bold text-cream">Graduation Day!</h2>
                     <p className="text-2xl text-gold font-serif italic">"You are now a Noor-Bearer"</p>
                   </div>

                   <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10 max-w-2xl mx-auto space-y-8">
                      <p className="text-slate-400 font-serif leading-relaxed text-xl">
                        Today is the culmination of your first 30 days. You have walked with the Prophets, cleaned your soul with Wudu, and connected with your Lord through Salah. 
                      </p>
                      <div className="h-px w-full bg-white/5" />
                      <p className="text-cream italic font-serif">"This is not the end, but the absolute beginning of your radiant life in Islam."</p>
                   </div>

                   <button 
                      className="bg-gold text-starry-teal-dark px-20 py-8 rounded-[3rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all noor-glow"
                      onClick={() => handleCompleteDay(30)}
                    >
                      Complete Graduation & Receive Certificate
                    </button>
                </div>
              ) : (
                <div className="text-center py-20 space-y-12">
                  <div className="space-y-4 text-center">
                    <span className="px-4 py-1.5 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest">Day {selectedDay}: {REVERT_DAYS[selectedDay - 1].type}</span>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream">{REVERT_DAYS[selectedDay - 1].title}</h3>
                  </div>
                  
                  <div className="p-10 bg-white/5 rounded-3xl border border-white/10 max-w-2xl mx-auto">
                    <p className="text-xl text-slate-400 font-serif italic mb-8 leading-relaxed">
                      "{REVERT_DAYS[selectedDay - 1].description}"
                    </p>
                    <div className="space-y-6">
                       <div className="p-6 bg-gold/5 border border-gold/10 rounded-2xl text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-2">Today's Sacred Task</p>
                          <p className="text-cream text-lg italic font-serif">"{REVERT_DAYS[selectedDay - 1].task || "Reflect on today's lesson."}"</p>
                       </div>
                       
                       <button 
                          className="w-full bg-white/5 text-gold border border-gold/20 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gold/10 transition-all flex items-center justify-center space-x-3"
                          onClick={() => toast.success("Feature coming soon! Explore the Encyclopedia for more.", { icon: '📖' })}
                        >
                          <BookOpen size={16} />
                          <span>Enter Deep-Dive Study</span>
                       </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-8 pt-8">
                    <button 
                      className="bg-gold text-starry-teal-dark px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all noor-glow flex items-center space-x-3"
                      onClick={() => handleCompleteDay(selectedDay)}
                    >
                      <span>I have completed Day {selectedDay}</span>
                      <ArrowRight size={18} />
                    </button>
                    <div className="flex items-center space-x-2 text-slate-500">
                       <Clock size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Day {selectedDay + 1} unlocks in 24 hours</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

