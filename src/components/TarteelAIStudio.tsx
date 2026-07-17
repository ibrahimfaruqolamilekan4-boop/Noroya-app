/**
 * TarteelAIStudio.tsx
 * Admin-only Quran memorization studio with live word-by-word highlighting,
 * speech recognition, and post-session review.
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic, Square, Play, Pause, X, RotateCcw, ChevronLeft,
  ChevronRight, Globe, Volume2, Sparkles, ArrowLeft,
  CheckCircle2, AlertCircle, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type WordState = 'neutral' | 'active' | 'correct' | 'incorrect';
type Phase     = 'idle' | 'listening' | 'review';

interface AyahData {
  number: number;
  arabic: string;
  words: string[];
  transliteration: string;
  translation: string;
}

interface SurahData {
  surahNumber: number;
  name: string;
  englishName: string;
  ayahs: AyahData[];
}

// ─── Embedded Quran Data (6 most-memorized surahs) ───────────────────────────

const SURAHS: SurahData[] = [
  {
    surahNumber: 1, name: 'الفاتحة', englishName: 'Al-Fatiha',
    ayahs: [
      { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        words: ['بِسْمِ','اللَّهِ','الرَّحْمَٰنِ','الرَّحِيمِ'],
        transliteration: 'Bismillāhir raḥmānir raḥīm',
        translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
      { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        words: ['الْحَمْدُ','لِلَّهِ','رَبِّ','الْعَالَمِينَ'],
        transliteration: 'Alḥamdu lillāhi rabbil ʿālamīn',
        translation: 'All praise is due to Allah, Lord of the worlds.' },
      { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        words: ['الرَّحْمَٰنِ','الرَّحِيمِ'],
        transliteration: 'Ar-Raḥmānir Raḥīm',
        translation: 'The Entirely Merciful, the Especially Merciful.' },
      { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        words: ['مَالِكِ','يَوْمِ','الدِّينِ'],
        transliteration: 'Māliki yawmid dīn',
        translation: 'Sovereign of the Day of Recompense.' },
      { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        words: ['إِيَّاكَ','نَعْبُدُ','وَإِيَّاكَ','نَسْتَعِينُ'],
        transliteration: 'Iyyāka naʿbudu wa iyyāka nastaʿīn',
        translation: 'It is You we worship and You we ask for help.' },
      { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        words: ['اهْدِنَا','الصِّرَاطَ','الْمُسْتَقِيمَ'],
        transliteration: 'Ihdinaṣ ṣirāṭal mustaqīm',
        translation: 'Guide us to the straight path —' },
      { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        words: ['صِرَاطَ','الَّذِينَ','أَنْعَمْتَ','عَلَيْهِمْ','غَيْرِ','الْمَغْضُوبِ','عَلَيْهِمْ','وَلَا','الضَّالِّينَ'],
        transliteration: 'Ṣirāṭal ladhīna anʿamta ʿalayhim ghayril maghḍūbi ʿalayhim wa laḍ ḍāllīn',
        translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked Your anger or gone astray.' },
    ],
  },
  {
    surahNumber: 103, name: 'العصر', englishName: 'Al-Asr',
    ayahs: [
      { number: 1, arabic: 'وَالْعَصْرِ', words: ['وَالْعَصْرِ'],
        transliteration: 'Wal-ʿaṣr', translation: 'By time,' },
      { number: 2, arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
        words: ['إِنَّ','الْإِنسَانَ','لَفِي','خُسْرٍ'],
        transliteration: 'Innal insāna lafī khusr',
        translation: 'Indeed, mankind is in loss,' },
      { number: 3, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        words: ['إِلَّا','الَّذِينَ','آمَنُوا','وَعَمِلُوا','الصَّالِحَاتِ','وَتَوَاصَوْا','بِالْحَقِّ','وَتَوَاصَوْا','بِالصَّبْرِ'],
        transliteration: 'Illal ladhīna āmanū wa ʿamiluṣ ṣāliḥāti wa tawāṣaw bil ḥaqqi wa tawāṣaw biṣ ṣabr',
        translation: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.' },
    ],
  },
  {
    surahNumber: 108, name: 'الكوثر', englishName: 'Al-Kawthar',
    ayahs: [
      { number: 1, arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        words: ['إِنَّا','أَعْطَيْنَاكَ','الْكَوْثَرَ'],
        transliteration: 'Innā aʿṭaynākal kawṯar',
        translation: 'Indeed, We have granted you al-Kawthar.' },
      { number: 2, arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        words: ['فَصَلِّ','لِرَبِّكَ','وَانْحَرْ'],
        transliteration: 'Faṣalli lirabbika wanḥar',
        translation: 'So pray to your Lord and sacrifice to Him alone.' },
      { number: 3, arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        words: ['إِنَّ','شَانِئَكَ','هُوَ','الْأَبْتَرُ'],
        transliteration: 'Inna shāniaka huwal abtar',
        translation: 'Indeed, your enemy is the one cut off.' },
    ],
  },
  {
    surahNumber: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas',
    ayahs: [
      { number: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        words: ['قُلْ','هُوَ','اللَّهُ','أَحَدٌ'],
        transliteration: 'Qul huwa Allāhu aḥad',
        translation: "Say, 'He is Allah, [who is] One,'" },
      { number: 2, arabic: 'اللَّهُ الصَّمَدُ',
        words: ['اللَّهُ','الصَّمَدُ'],
        transliteration: 'Allāhuṣ ṣamad',
        translation: 'Allah, the Eternal Refuge.' },
      { number: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        words: ['لَمْ','يَلِدْ','وَلَمْ','يُولَدْ'],
        transliteration: 'Lam yalid wa lam yūlad',
        translation: 'He neither begets nor is born,' },
      { number: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        words: ['وَلَمْ','يَكُن','لَّهُ','كُفُوًا','أَحَدٌ'],
        transliteration: 'Wa lam yakun lahū kufuwan aḥad',
        translation: 'Nor is there to Him any equivalent.' },
    ],
  },
  {
    surahNumber: 113, name: 'الفلق', englishName: 'Al-Falaq',
    ayahs: [
      { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        words: ['قُلْ','أَعُوذُ','بِرَبِّ','الْفَلَقِ'],
        transliteration: 'Qul aʿūdhu bi rabbil falaq',
        translation: "Say, 'I seek refuge in the Lord of daybreak'" },
      { number: 2, arabic: 'مِن شَرِّ مَا خَلَقَ',
        words: ['مِن','شَرِّ','مَا','خَلَقَ'],
        transliteration: 'Min sharri mā khalaq',
        translation: 'From the evil of that which He created' },
      { number: 3, arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        words: ['وَمِن','شَرِّ','غَاسِقٍ','إِذَا','وَقَبَ'],
        transliteration: 'Wa min sharri ghāsiqin idhā waqab',
        translation: 'And from the evil of darkness when it settles' },
      { number: 4, arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        words: ['وَمِن','شَرِّ','النَّفَّاثَاتِ','فِي','الْعُقَدِ'],
        transliteration: 'Wa min sharrin naffāthāti fil ʿuqad',
        translation: 'And from the evil of the blowers in knots' },
      { number: 5, arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        words: ['وَمِن','شَرِّ','حَاسِدٍ','إِذَا','حَسَدَ'],
        transliteration: 'Wa min sharri ḥāsidin idhā ḥasad',
        translation: 'And from the evil of an envier when he envies.' },
    ],
  },
  {
    surahNumber: 114, name: 'الناس', englishName: 'An-Nas',
    ayahs: [
      { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        words: ['قُلْ','أَعُوذُ','بِرَبِّ','النَّاسِ'],
        transliteration: 'Qul aʿūdhu bi rabbin nās',
        translation: "Say, 'I seek refuge in the Lord of mankind,'" },
      { number: 2, arabic: 'مَلِكِ النَّاسِ',
        words: ['مَلِكِ','النَّاسِ'],
        transliteration: 'Malikin nās',
        translation: 'The Sovereign of mankind.' },
      { number: 3, arabic: 'إِلَٰهِ النَّاسِ',
        words: ['إِلَٰهِ','النَّاسِ'],
        transliteration: 'Ilāhin nās',
        translation: 'The God of mankind,' },
      { number: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        words: ['مِن','شَرِّ','الْوَسْوَاسِ','الْخَنَّاسِ'],
        transliteration: 'Min sharril waswāsil khannās',
        translation: 'From the evil of the retreating whisperer' },
      { number: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        words: ['الَّذِي','يُوَسْوِسُ','فِي','صُدُورِ','النَّاسِ'],
        transliteration: 'Al-ladhī yuwaswisu fī ṣudūrin nās',
        translation: 'Who whispers into the breasts of mankind' },
      { number: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        words: ['مِنَ','الْجِنَّةِ','وَالنَّاسِ'],
        transliteration: 'Minal jinnati wan nās',
        translation: 'From among the jinn and mankind.' },
    ],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Strip all Arabic diacritics and normalise alef/ya/ta-marbuta variants. */
const normaliseArabic = (s: string) =>
  s
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();

/** Given the running transcript, return the state of each expected word. */
function computeWordStates(transcript: string, words: string[]): WordState[] {
  const normT = normaliseArabic(transcript);
  const normWords = words.map(normaliseArabic);

  // Sequential matching: walk through expected words in order
  let cursor = 0;
  const states: WordState[] = words.map(() => 'neutral' as WordState);

  normWords.forEach((nw, i) => {
    const idx = normT.indexOf(nw, cursor);
    if (idx !== -1) {
      states[i] = 'correct';
      cursor = idx + nw.length;
    }
  });

  // Mark first unmatched word as "active" (next to recite)
  const firstNeutral = states.indexOf('neutral');
  if (firstNeutral !== -1) states[firstNeutral] = 'active';

  return states;
}

function accuracy(states: WordState[]): number {
  if (!states.length) return 0;
  const correct = states.filter(s => s === 'correct').length;
  return Math.round((correct / states.length) * 100);
}

/** EveryAyah CDN URL for Alafasy recitation. */
const masterUrl = (surah: number, ayah: number) =>
  `https://everyayah.com/data/Alafasy_128kbps/${String(surah).padStart(3,'0')}${String(ayah).padStart(3,'0')}.mp3`;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated circular accuracy indicator */
const AccuracyRing = ({ pct }: { pct: number }) => {
  const r = 52, circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  const color = pct >= 80 ? '#34d399' : pct >= 50 ? '#E5C158' : '#f87171';
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center z-10">
        <motion.p
          className="text-3xl font-black font-serif"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          {pct}%
        </motion.p>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-0.5">accuracy</p>
      </div>
    </div>
  );
};

/** Minimal audio player with play/pause and time display */
const AudioPlayer = ({ src, label, icon }: { src: string; label: string; icon: React.ReactNode }) => {
  const ref  = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else         { ref.current.play();  setPlaying(true);  }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2,'0')}`;

  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-5 py-4 border border-white/10">
      <audio
        ref={ref} src={src} preload="metadata"
        onLoadedMetadata={e => setDuration((e.target as HTMLAudioElement).duration)}
        onTimeUpdate={e  => setCurrent( (e.target as HTMLAudioElement).currentTime)}
        onEnded={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        className="w-11 h-11 rounded-xl flex items-center justify-center bg-gold/20 text-gold hover:bg-gold hover:text-midnight transition-all flex-shrink-0"
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
            {icon} {label}
          </span>
          <span className="text-[11px] text-white/30 font-mono">{fmt(current)} / {fmt(duration || 0)}</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            style={{ width: duration ? `${(current / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};

/** Word token with state-driven colour and animation */
const WordToken = ({ word, state }: { word: string; state: WordState }) => (
  <motion.span
    layout
    className={cn(
      'inline-block px-2 py-1 rounded-xl font-arabic text-right leading-loose cursor-default select-none transition-all',
      state === 'neutral'   && 'text-white/50',
      state === 'active'    && 'text-gold border border-gold/50 bg-gold/5 shadow-[0_0_18px_rgba(229,193,88,0.25)]',
      state === 'correct'   && 'text-emerald-400 bg-emerald-500/10',
      state === 'incorrect' && 'text-red-400 bg-red-500/10',
    )}
    animate={state === 'active' ? { scale: [1, 1.06, 1] } : { scale: 1 }}
    transition={state === 'active' ? { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } : {}}
  >
    {word}
  </motion.span>
);

/** Pulsing microphone button */
const MicButton = ({
  phase, onStart, onStop,
}: { phase: Phase; onStart: () => void; onStop: () => void }) => {
  const isListening = phase === 'listening';
  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          {[1, 2, 3].map(i => (
            <motion.span
              key={i}
              className="absolute rounded-full border border-emerald-400/40"
              initial={{ width: 80, height: 80, opacity: 0.6 }}
              animate={{ width: 80 + i * 36, height: 80 + i * 36, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={isListening ? onStop : onStart}
        className={cn(
          'relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
          isListening
            ? 'bg-emerald-500 text-white shadow-emerald-500/40'
            : 'bg-gold text-midnight shadow-gold/30 hover:shadow-gold/60',
        )}
        style={isListening ? { boxShadow: '0 0 40px rgba(52,211,153,0.45)' } : {}}
      >
        {isListening ? <Square size={28} fill="white" /> : <Mic size={28} />}
      </motion.button>
    </div>
  );
};

// ─── Review Modal ─────────────────────────────────────────────────────────────

interface ReviewModalProps {
  ayah: AyahData;
  surahNumber: number;
  wordStates: WordState[];
  userAudioUrl: string | null;
  onRetry: () => void;
  onNext: () => void;
  hasNext: boolean;
}

const ReviewModal = ({
  ayah, surahNumber, wordStates, userAudioUrl, onRetry, onNext, hasNext,
}: ReviewModalProps) => {
  const pct  = accuracy(wordStates);
  const [showTranslation, setShowTranslation] = useState(false);

  const badge = pct >= 80
    ? { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
    : pct >= 50
    ? { label: 'Good', color: 'text-gold', bg: 'bg-gold/10 border-gold/20' }
    : { label: 'Keep Practicing', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-lg glass-card rounded-[2.5rem] overflow-hidden"
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Session Review</p>
            <h2 className="text-xl font-serif font-bold text-cream mt-1">Ayah {ayah.number}</h2>
          </div>
          <span className={cn('text-xs font-black uppercase tracking-widest border px-4 py-1.5 rounded-full', badge.color, badge.bg)}>
            {badge.label}
          </span>
        </div>

        <div className="px-8 py-7 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Accuracy ring */}
          <div className="flex justify-center">
            <AccuracyRing pct={pct} />
          </div>

          {/* Audio players */}
          {userAudioUrl && (
            <AudioPlayer src={userAudioUrl} label="Your Recitation" icon={<Mic size={11} />} />
          )}
          <AudioPlayer
            src={masterUrl(surahNumber, ayah.number)}
            label="Master Reciter (Alafasy)"
            icon={<Volume2 size={11} />}
          />

          {/* Word-by-word review */}
          <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Word Review</p>
            <div className="flex flex-wrap-reverse gap-2 justify-center text-3xl leading-loose" dir="rtl">
              {ayah.words.map((w, i) => (
                <WordToken key={i} word={w} state={wordStates[i] ?? 'neutral'} />
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 justify-center flex-wrap">
              {([
                ['correct',   'text-emerald-400', 'Correct'],
                ['incorrect', 'text-red-400',     'Missed'],
                ['neutral',   'text-white/30',    'Not reached'],
              ] as const).map(([, cls, lbl]) => (
                <span key={lbl} className={cn('text-[10px] font-black uppercase tracking-widest', cls)}>
                  ● {lbl}
                </span>
              ))}
            </div>
          </div>

          {/* Translation toggle */}
          <div className="bg-white/[0.03] rounded-2xl border border-white/5 overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setShowTranslation(v => !v)}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                <Globe size={12} /> English Meaning
              </span>
              <ChevronRight
                size={14}
                className={cn('text-white/30 transition-transform', showTranslation && 'rotate-90')}
              />
            </button>
            <AnimatePresence>
              {showTranslation && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <p className="text-sm text-slate-300 italic leading-relaxed font-serif">
                      "{ayah.translation}"
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">{ayah.transliteration}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 pt-2 flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} /> Try Again
          </button>
          {hasNext && (
            <button
              onClick={onNext}
              className="flex-1 py-4 rounded-2xl bg-gold text-midnight font-black uppercase tracking-widest text-[11px] hover:shadow-xl hover:shadow-gold/30 transition-all flex items-center justify-center gap-2"
            >
              Next Ayah <ChevronRight size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const TarteelAIStudio: React.FC = () => {
  const [surahIdx,   setSurahIdx]   = useState(0);
  const [ayahIdx,    setAyahIdx]    = useState(0);
  const [phase,      setPhase]      = useState<Phase>('idle');
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [transcript, setTranscript] = useState('');
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [srSupported, setSrSupported] = useState(true);

  const surah = SURAHS[surahIdx];
  const ayah  = surah.ayahs[ayahIdx];

  const recognitionRef  = useRef<any>(null);
  const mediaRecRef     = useRef<MediaRecorder | null>(null);
  const audioChunksRef  = useRef<Blob[]>([]);
  const streamRef       = useRef<MediaStream | null>(null);

  // Reset word states when ayah changes
  useEffect(() => {
    setWordStates(ayah.words.map(() => 'neutral'));
    setTranscript('');
    setPhase('idle');
    setUserAudioUrl(null);
  }, [surahIdx, ayahIdx]);

  // Check SpeechRecognition support
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSrSupported(!!SR);
  }, []);

  const startSession = useCallback(async () => {
    if (phase === 'listening') return;

    // ── Set up MediaRecorder for user audio ──
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setUserAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(200);
      mediaRecRef.current = mr;
    } catch {
      // mic not available — continue without recording
    }

    // ── Set up SpeechRecognition ──
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = 'ar-SA';
      r.continuous = true;
      r.interimResults = true;
      r.maxAlternatives = 3;

      r.onresult = (e: any) => {
        let full = '';
        for (let i = 0; i < e.results.length; i++) {
          full += e.results[i][0].transcript + ' ';
          // also check alternatives
          for (let j = 1; j < e.results[i].length; j++) {
            full += e.results[i][j].transcript + ' ';
          }
        }
        setTranscript(full.trim());
        setWordStates(computeWordStates(full.trim(), ayah.words));
      };

      r.onerror = () => {};
      r.start();
      recognitionRef.current = r;
    }

    setPhase('listening');
    setWordStates(prev => {
      const s = [...prev];
      if (s[0] === 'neutral') s[0] = 'active';
      return s;
    });
  }, [phase, ayah.words]);

  const stopSession = useCallback(() => {
    recognitionRef.current?.stop();
    mediaRecRef.current?.stop();
    setPhase('review');
  }, []);

  const retry = useCallback(() => {
    setWordStates(ayah.words.map(() => 'neutral'));
    setTranscript('');
    setUserAudioUrl(null);
    setPhase('idle');
  }, [ayah.words]);

  const nextAyah = useCallback(() => {
    if (ayahIdx < surah.ayahs.length - 1) {
      setAyahIdx(i => i + 1);
    }
  }, [ayahIdx, surah.ayahs.length]);

  const isListening = phase === 'listening';
  const correctCount = wordStates.filter(s => s === 'correct').length;

  return (
    <div className="min-h-screen bg-midnight relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/4 blur-[120px]" />
        {isListening && (
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/6 blur-[100px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Admin
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center">
            <Sparkles size={15} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-black text-cream tracking-tight leading-none">Tarteel AI Studio</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/60 mt-0.5">Quran Memorization</p>
          </div>
        </div>

        <div className="w-16" /> {/* spacer */}
      </div>

      {/* ── Selectors ────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex items-center justify-center gap-4 px-6 py-4">
        {/* Surah dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSurahDropdown(v => !v)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 text-sm font-bold text-cream hover:border-gold/40 transition-all"
          >
            <BookOpen size={14} className="text-gold" />
            {surah.name}
            <span className="text-white/30 text-xs">({surah.englishName})</span>
            <ChevronRight size={13} className={cn('text-white/40 transition-transform', showSurahDropdown && 'rotate-90')} />
          </button>

          <AnimatePresence>
            {showSurahDropdown && (
              <motion.div
                className="absolute top-full mt-2 left-0 bg-[#16161A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 min-w-[220px]"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              >
                {SURAHS.map((s, i) => (
                  <button
                    key={s.surahNumber}
                    onClick={() => { setSurahIdx(i); setAyahIdx(0); setShowSurahDropdown(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gold/10 transition-colors',
                      i === surahIdx && 'bg-gold/10 text-gold',
                    )}
                  >
                    <span className="text-[10px] font-black text-white/20 w-6">{s.surahNumber}</span>
                    <span className="font-arabic text-lg text-cream">{s.name}</span>
                    <span className="text-xs text-white/40 ml-auto">{s.englishName}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ayah pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          {surah.ayahs.map((a, i) => (
            <button
              key={a.number}
              onClick={() => setAyahIdx(i)}
              className={cn(
                'w-9 h-9 rounded-xl text-sm font-black transition-all',
                i === ayahIdx
                  ? 'bg-gold text-midnight shadow-lg shadow-gold/30'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5',
              )}
            >
              {a.number}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Arabic Display ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-8 min-h-[42vh]">

        {/* Ayah number badge */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-16 bg-gold/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">
            {surah.englishName} · Ayah {ayah.number}
          </span>
          <div className="h-px w-16 bg-gold/20" />
        </div>

        {/* Arabic words */}
        <div
          className="flex flex-wrap-reverse gap-x-4 gap-y-3 justify-center max-w-3xl text-5xl sm:text-6xl md:text-7xl leading-[1.6] text-center"
          dir="rtl"
        >
          {ayah.words.map((w, i) => (
            <WordToken key={i} word={w} state={wordStates[i] ?? 'neutral'} />
          ))}
        </div>

        {/* Transliteration */}
        <p className="mt-8 text-base text-white/30 italic font-light tracking-wide text-center max-w-lg">
          {ayah.transliteration}
        </p>

        {/* Translation toggle */}
        <AnimatePresence>
          {showTranslation && (
            <motion.p
              className="mt-3 text-sm text-gold/70 font-serif italic text-center max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            >
              "{ayah.translation}"
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowTranslation(v => !v)}
          className="mt-4 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/25 hover:text-gold/60 transition-colors"
        >
          <Globe size={11} />
          {showTranslation ? 'Hide' : 'Show'} Translation
        </button>
      </div>

      {/* ── Status / Live Transcript ──────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-8 min-h-[60px]">
        {phase === 'idle' && (
          <p className="text-[11px] font-black uppercase tracking-widest text-white/20">
            Tap the microphone to begin
          </p>
        )}

        {isListening && (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {/* Waveform bars */}
            <div className="flex items-end gap-[3px] h-5">
              {[0.4,0.8,0.5,1,0.6,0.9,0.4,0.7,0.5,0.8].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] bg-emerald-400 rounded-full"
                  animate={{ scaleY: [h, h * 0.4, h] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08, ease: 'easeInOut' }}
                  style={{ height: `${h * 20}px`, transformOrigin: 'bottom' }}
                />
              ))}
            </div>
            <span className="text-emerald-400 text-[11px] font-black uppercase tracking-widest animate-pulse">
              Listening…
            </span>
          </motion.div>
        )}

        {isListening && transcript && (
          <p className="text-white/30 text-sm text-center max-w-sm truncate font-arabic" dir="rtl">
            {transcript.slice(-80)}
          </p>
        )}

        {isListening && wordStates.length > 0 && (
          <p className="text-[11px] text-white/20 font-black uppercase tracking-widest">
            {correctCount}/{ayah.words.length} words matched
          </p>
        )}

        {!srSupported && (
          <div className="flex items-center gap-2 text-amber-400 text-xs">
            <AlertCircle size={14} />
            Speech recognition not supported in this browser. Chrome recommended.
          </div>
        )}
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-6 py-10 px-8">
        <MicButton phase={phase} onStart={startSession} onStop={stopSession} />

        {/* Ayah navigation */}
        <div className="flex items-center gap-6 text-white/30">
          <button
            onClick={() => setAyahIdx(i => Math.max(0, i - 1))}
            disabled={ayahIdx === 0}
            className="p-2 rounded-xl hover:bg-white/5 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[11px] font-black uppercase tracking-widest">
            Ayah {ayahIdx + 1} / {surah.ayahs.length}
          </span>
          <button
            onClick={() => setAyahIdx(i => Math.min(surah.ayahs.length - 1, i + 1))}
            disabled={ayahIdx === surah.ayahs.length - 1}
            className="p-2 rounded-xl hover:bg-white/5 disabled:opacity-20 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Review Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'review' && (
          <ReviewModal
            ayah={ayah}
            surahNumber={surah.surahNumber}
            wordStates={wordStates}
            userAudioUrl={userAudioUrl}
            onRetry={retry}
            onNext={nextAyah}
            hasNext={ayahIdx < surah.ayahs.length - 1}
          />
        )}
      </AnimatePresence>

      {/* Close surah dropdown on outside click */}
      {showSurahDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSurahDropdown(false)} />
      )}
    </div>
  );
};

export default TarteelAIStudio;
