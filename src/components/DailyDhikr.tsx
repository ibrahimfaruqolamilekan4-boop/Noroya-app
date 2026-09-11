import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Sun, Moon, RotateCcw, Plus, Sparkles, 
  ChevronRight, ArrowLeft, Award, HelpCircle, BookOpen, Volume2, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  virtue: string;
  category: 'morning' | 'evening';
}

const DHIKR_ITEMS: DhikrItem[] = [
  {
    id: 'm_kursi',
    arabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِي ٱلسَّمَـٰوَٰتِ وَمَا فِي ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِي يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱل🇸َّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِيُّ ٱلْعَظِيمُ',
    transliteration: 'Allāhu lā ilāha illā huwal-Ḥayyul-Qayyūm, lā ta’khudhuhu sanatun walā nawm...',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence...',
    target: 1,
    virtue: 'Protected from devils and harm by an angel appointed by Allah until evening.',
    category: 'morning'
  },
  {
    id: 'm_sayyidul',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allāhumma anta Rabbī lā ilāha illā anta, khalaqtanī wa ana ‘abduka...',
    translation: 'O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant...',
    target: 1,
    virtue: 'If recited during the day with firm belief and death occurs before evening, you enter Paradise.',
    category: 'morning'
  },
  {
    id: 'm_subhanallah',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    transliteration: 'Subḥān-Allāhi wa bi-ḥamdih',
    translation: 'Glory is to Allah and praise is to Him.',
    target: 100,
    virtue: 'All minor sins are forgiven, even if they are as abundant as the foam of the sea.',
    category: 'morning'
  },
  {
    id: 'm_bismillah',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillāhil-ladhī lā yaḍurru ma‘as-mihī shay’un fil-arḍi wa lā fis-samā’i...',
    translation: 'In the name of Allah with Whose name nothing can harm on earth or in heaven...',
    target: 3,
    virtue: 'Protected from any sudden affliction or severe harm until nightfall.',
    category: 'morning'
  },
  {
    id: 'm_raditu',
    arabic: 'رَضِيتُ بِاللَّهِ رَبَّاً وَبِالْإِسْلَامِ دِيناً وَبِمُحَمَّدٍ نَّبِيّاً',
    transliteration: 'Raḍītu billāhi Rabban, wa bil-Islāmi dīnan, wa bi-Muḥammadin nabiyya',
    translation: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet.',
    target: 3,
    virtue: 'Allah promises to make the reciter completely content and pleased on the Day of Resurrection.',
    category: 'morning'
  },
  {
    id: 'e_kursi',
    arabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِي ٱلسَّمَـٰوَٰتِ وَمَا فِي ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِي يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱل🇸َّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِيُّ ٱلْعَظِيمُ',
    transliteration: 'Allāhu lā ilāha illā huwal-Ḥayyul-Qayyūm, lāk ta’khudhuhu sanatun walā nawm...',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence...',
    target: 1,
    virtue: 'Protected from devils and dark forces until the morning.',
    category: 'evening'
  },
  {
    id: 'e_sayyidul',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allāhumma anta Rabbī lā ilāha illā anta, khalaqtanī wa ana ‘abduka...',
    translation: 'O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant...',
    target: 1,
    virtue: 'If recited during the evening with firm belief and death occurs, you enter Paradise.',
    category: 'evening'
  },
  {
    id: 'e_audhu',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A‘ūdhu bi-kalimātil-lāhit-tāmmāti min sharri mā khalaq',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    target: 3,
    virtue: 'No venomous creature or unexpected disease will harm you during that night.',
    category: 'evening'
  },
  {
    id: 'e_subhanallah',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    transliteration: 'Subḥān-Allāhi wa bi-ḥamdih',
    translation: 'Glory is to Allah and praise is to Him.',
    target: 100,
    virtue: 'Wipes away all minor sins and shields the soul from hellfire.',
    category: 'evening'
  },
  {
    id: 'e_bismillah',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillāhil-ladhī lā yaḍurru ma‘as-mihī shay’un fil-arḍi wa lā fis-samā’i...',
    translation: 'In the name of Allah with Whose name nothing can harm on earth or in heaven...',
    target: 3,
    virtue: 'No sudden calamity or poison shall harm the reciter until morning.',
    category: 'evening'
  }
];

export const DailyDhikr = () => {
  const [activeCategory, setActiveCategory] = useState<'morning' | 'evening'>('morning');
  const [counters, setCounters] = useState<{ [key: string]: number }>({});
  const [selectedItem, setSelectedItem] = useState<DhikrItem | null>(null);
  
  // Custom spiritual level state to integrate with local points engine
  const [lpPoints, setLpPoints] = useState(0);

  // Load state on mount
  useEffect(() => {
    const savedCounters = localStorage.getItem('daily_dhikr_counters');
    const savedDate = localStorage.getItem('daily_dhikr_last_date');
    const today = new Date().toDateString();

    const localPoints = localStorage.getItem('spiritualPoints');
    if (localPoints) {
      setLpPoints(parseInt(localPoints));
    }

    if (savedDate !== today) {
      // It is a new day! Reset counters
      localStorage.setItem('daily_dhikr_last_date', today);
      const initialCounters: { [key: string]: number } = {};
      DHIKR_ITEMS.forEach(item => {
        initialCounters[item.id] = 0;
      });
      setCounters(initialCounters);
      localStorage.setItem('daily_dhikr_counters', JSON.stringify(initialCounters));
    } else if (savedCounters) {
      setCounters(JSON.parse(savedCounters));
    } else {
      const initialCounters: { [key: string]: number } = {};
      DHIKR_ITEMS.forEach(item => {
        initialCounters[item.id] = 0;
      });
      setCounters(initialCounters);
      localStorage.setItem('daily_dhikr_counters', JSON.stringify(initialCounters));
    }
  }, []);

  const saveCountersState = (updatedCounters: { [key: string]: number }) => {
    setCounters(updatedCounters);
    localStorage.setItem('daily_dhikr_counters', JSON.stringify(updatedCounters));
  };

  const handleIncrement = (id: string, target: number) => {
    const current = counters[id] || 0;
    if (current >= target) {
      toast.success("This Dhikr is already completed for today!", {
        icon: '✨',
        id: `comp-${id}`
      });
      return;
    }

    const updated = { ...counters, [id]: current + 1 };
    
    // Play light vibration/tap sound effect if possible (synthesize simple tone via Web Audio API)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(current + 1 === target ? 660 : 440, audioCtx.currentTime); // higher note on completion
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch {}

    if (current + 1 === target) {
      // Award divine points
      const currentPoints = parseInt(localStorage.getItem('spiritualPoints') || '0');
      const earned = target * 2 + 5; // scaled points
      const nextPoints = currentPoints + earned;
      setLpPoints(nextPoints);
      localStorage.setItem('spiritualPoints', nextPoints.toString());
      
      toast.success(`Complete! +${earned} Divine Momentum points`, {
        icon: '🕋',
        style: { borderRadius: '1rem', background: '#161619', color: '#E5C158', border: '1px solid rgba(229,193,88,0.2)' }
      });

      // Simple confetti or glow triggering side-effects
    }

    saveCountersState(updated);
  };

  const handleResetItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = { ...counters, [id]: 0 };
    saveCountersState(updated);
    toast.success("Counter reset successfully", { id: 'reset' });
  };

  const handleResetAll = () => {
    const updated = { ...counters };
    filteredItems.forEach(item => {
      updated[item.id] = 0;
    });
    saveCountersState(updated);
    toast.success(`Reset all ${activeCategory} supplications!`, {
      icon: '🔄',
      style: { borderRadius: '0.75rem', background: '#0F0F11', color: '#E5C158' }
    });
  };

  const filteredItems = DHIKR_ITEMS.filter(item => item.category === activeCategory);
  
  // Progress calculations
  const totalTargetCount = filteredItems.reduce((acc, current) => acc + current.target, 0);
  const totalCompletedCount = filteredItems.reduce((acc, current) => acc + Math.min(counters[current.id] || 0, current.target), 0);
  const categoryProgressPercentage = totalTargetCount > 0 ? Math.round((totalCompletedCount / totalTargetCount) * 100) : 0;

  return (
    <div id="daily-dhikr-module" className="w-full max-w-5xl mx-auto px-4 lg:px-0">
      <div className="glass-card p-8 border-[#E5C158]/15 overflow-hidden relative group bg-[#161619]/40 rounded-3xl">
        {/* Intricate decorative line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5C158]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#E5C158]/3 via-transparent to-purple-500/5 opacity-50 pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Module Heading */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-[1.25rem] bg-[#E5C158]/10 flex items-center justify-center text-[#E5C158] border border-[#E5C158]/20 shadow-lg">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-black tracking-[0.40em] text-[#E5C158] uppercase">Sacred Daily Remembrance</span>
                <h3 className="text-2xl font-serif font-bold text-[#FDFCF0]">Daily Dhikr & Supplications</h3>
              </div>
            </div>

            {/* Time Category Selector Toggle */}
            <div className="flex items-center space-x-2 bg-black/40 border border-white/5 p-1.5 rounded-2xl w-full sm:w-auto self-stretch sm:self-auto justify-center">
              <button
                onClick={() => {
                  setActiveCategory('morning');
                  setSelectedItem(null);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer",
                  activeCategory === 'morning' 
                    ? "bg-[#E5C158] text-[#0F0F11] shadow-xl" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Sun size={13} fill={activeCategory === 'morning' ? "currentColor" : "none"} />
                <span>Morning 🌅</span>
              </button>
              <button
                onClick={() => {
                  setActiveCategory('evening');
                  setSelectedItem(null);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer",
                  activeCategory === 'evening' 
                    ? "bg-[#E5C158] text-[#0F0F11] shadow-xl" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Moon size={13} fill={activeCategory === 'evening' ? "currentColor" : "none"} />
                <span>Evening 🌃</span>
              </button>
            </div>
          </div>

          {/* Module Stats Bar / Counter progress */}
          <div className="bg-[#121214]/80 rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider font-bold"> Remembrances Complete</span>
                <span className="text-[#E5C158] font-black">{totalCompletedCount} / {totalTargetCount} ({categoryProgressPercentage}%)</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute h-full left-0 top-0 bg-gradient-to-r from-amber-500 to-[#E5C158] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${categoryProgressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 shrink-0">
              <div className="text-left md:text-right">
                <p className="text-[9px] font-mono text-slate-500 uppercase leading-none mb-1">Spiritual LP Engine</p>
                <p className="text-sm font-serif font-black text-slate-200">{lpPoints} Points</p>
              </div>
              <button
                onClick={handleResetAll}
                className="p-3 bg-white/5 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all hover:bg-red-500/5 cursor-pointer active:scale-95"
                title="Reset active category"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Supplications List */}
            <div className={cn("space-y-4", selectedItem ? "md:col-span-5" : "md:col-span-12")}>
              {filteredItems.map((item) => {
                const count = counters[item.id] || 0;
                const isDone = count >= item.target;
                const isCurrentlySelected = selectedItem?.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`dhikr-card-${item.id}`}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      "group p-5 bg-black/20 border rounded-2xl text-left cursor-pointer transition-all flex items-start justify-between gap-4 select-none",
                      isCurrentlySelected 
                        ? "border-[#E5C158] bg-[#E5C158]/5 shadow-lg shadow-[#E5C158]/5" 
                        : "border-white/5 hover:border-[#E5C158]/20 hover:bg-white/5"
                    )}
                  >
                    <div className="space-y-3.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                            <CheckCircle2 size={12} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/15 flex items-center justify-center text-slate-500 text-[9px] font-mono font-bold shrink-0">
                            {item.target}x
                          </div>
                        )}
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 truncate group-hover:text-white transition-colors">
                          {item.id.replace('m_', 'Morning - ').replace('e_', 'Evening - ').replace('sayyidul', 'Master Supplication').replace('bismillah', 'Protection Shield').replace('kursi', 'Ayat Al-Kursi').replace('raditu', 'Pleasure Covenant').replace('subhanallah', 'Ocean Forgiveness').replace('audhu', 'Perfect Words Refuge')}
                        </h4>
                      </div>

                      <p className="text-slate-400 font-serif text-xs italic leading-relaxed line-clamp-1">
                        {item.translation}
                      </p>

                      <p className="text-[10px] font-sans text-neutral-500 line-clamp-1 flex items-center gap-1">
                        <Info size={10} className="text-[#E5C158]/60 shrink-0" />
                        <span>{item.virtue}</span>
                      </p>
                    </div>

                    {/* Compact Tap Zone */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrement(item.id, item.target);
                        }}
                        className={cn(
                          "w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-mono transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shrink-0",
                          isDone 
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                            : "bg-white/5 border-white/10 hover:border-[#E5C158] text-[#E5C158] hover:bg-[#E5C158]/10"
                        )}
                      >
                        <span className="text-sm font-black leading-none">{count}</span>
                        <span className="text-[8px] opacity-40 leading-none mt-1">/{item.target}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Immersive Focus Remembrancer Window when an item is chosen */}
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="md:col-span-7 bg-[#121214]/50 border border-[#E5C158]/15 rounded-3xl p-6 relative overflow-hidden text-center shadow-2xl space-y-6"
                >
                  {/* Subtle particle graphics behind focus screen */}
                  <div className="absolute inset-0 bg-radial-glow opacity-10 pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft size={13} />
                      <span className="font-mono text-[9px] uppercase">Back List</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleResetItem(selectedItem.id, e)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                        title="Reset Active Item Counter"
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Supplication Focus Material */}
                  <div className="space-y-5">
                    {/* Arabic Calligraphy (large and readable) */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center shadow-inner relative group select-all">
                      <p className="text-3xl font-serif text-[#FDFCF0] leading-[1.8] text-right tracking-wide select-all" dir="rtl">
                        {selectedItem.arabic}
                      </p>
                    </div>

                    {/* Transliteration */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Transliteration</p>
                      <p className="text-xs font-serif italic text-[#E5C158] leading-relaxed select-text px-4">
                        {selectedItem.transliteration}
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Translation</p>
                      <p className="text-xs font-serif text-slate-300 leading-relaxed max-w-lg mx-auto select-text px-4">
                        {selectedItem.translation}
                      </p>
                    </div>

                    {/* Divine virtue / Hadith source */}
                    <div className="bg-[#E5C158]/5 border border-[#E5C158]/10 rounded-2xl p-4 text-left flex gap-3">
                      <Award size={18} className="text-[#E5C158] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-[9px] font-mono font-black uppercase tracking-wider text-[#E5C158]">Divine Virtue & Covenant</h5>
                        <p className="text-[11px] font-serif italic text-slate-300 mt-1 leading-relaxed">
                          {selectedItem.virtue}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SATISFYING INTERACTIVE COUNTER BUTTON TAP ZONE */}
                  <div className="pt-4 flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <span className="text-3xl font-serif font-black text-white">
                        {counters[selectedItem.id] || 0}
                      </span>
                      <span className="text-slate-500 font-mono text-sm">/ {selectedItem.target}</span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleIncrement(selectedItem.id, selectedItem.target)}
                      className={cn(
                        "w-full max-w-sm py-5 px-6 rounded-2xl text-[#0F0F11] font-mono font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#E5C158]/5 hover:shadow-[#E5C158]/15 flex items-center justify-center gap-2 cursor-pointer border",
                        (counters[selectedItem.id] || 0) >= selectedItem.target
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15"
                          : "bg-[#E5C158] border-[#E5C158] hover:bg-[#E5C158]/95"
                      )}
                    >
                      {(counters[selectedItem.id] || 0) >= selectedItem.target ? (
                        <>
                          <CheckCircle2 size={15} />
                          <span>Dhikr Complete</span>
                        </>
                      ) : (
                        <>
                          <Plus size={15} />
                          <span>Ponder & Tap (Count)</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </div>
  );
};
