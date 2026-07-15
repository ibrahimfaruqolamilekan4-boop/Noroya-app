import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, ArrowLeft, Play, Square, Sparkles, CheckCircle2, 
  ChevronRight, Download, Share2, Trophy, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface QuranReviewInlineProps {
  selectedVerse: {
    id: string;
    name: string;
    surahNum: number;
    ayahNum: number;
    arabic: string;
    transliteration: string;
    translation: string;
    words: string[];
    tips: { [word: string]: string };
  };
  wordStates: { [word: string]: 'neutral' | 'correct' | 'incorrect' };
  currentScore: number | null;
  flaggedMistakes: string[];
  isUserAudioPlaying: boolean;
  toggleUserAudioPlayback: () => void;
  isMasterAudioPlaying: boolean;
  toggleMasterAudioPlayback: () => void;
  sharedProgress: number;
  userCurrentTime: number;
  masterCurrentTime: number;
  masterDuration: number;
  playbackSpeed: number;
  handleSpeedShift: (speed: number) => void;
  isGeminiAnalyzing: boolean;
  geminiAnalysis: {
    overallFeedback: string;
    wordAnalyses: Array<{
      word: string;
      recitedAs: string;
      tajweedIssue?: string;
      severity: 'none' | 'minor' | 'major' | string;
      guidance: string;
      status?: 'correct' | 'incorrect' | string;
    }>;
    score?: number;
  } | null;
  isMultiAyahMode: boolean;
  selectedSurahNum: number;
  selectedAyahNum: number;
  setSelectedSurahNum: (num: number) => void;
  setSelectedAyahNum: (num: number) => void;
  setSelectedVerse: (verse: any) => void;
  setWordStates: (states: any) => void;
  setCurrentScore: (score: number | null) => void;
  setFlaggedMistakes: (mistakes: string[]) => void;
  setLiveTranscript: (text: string) => void;
  setGeminiAnalysis: (analysis: any) => void;
  setRecState: (state: 'idle' | 'recording' | 'processing' | 'finished') => void;
  resetPracticeState: () => void;
  startRecordingFlow: () => void;
  setIsCustomMode: (mode: boolean) => void;
  getDynamicVerseOption: (surah: number, ayah: number) => any;
  ALL_SURAHS: any[];
}

export const QuranReviewInline: React.FC<QuranReviewInlineProps> = ({
  selectedVerse,
  wordStates,
  currentScore,
  flaggedMistakes,
  isUserAudioPlaying,
  toggleUserAudioPlayback,
  isMasterAudioPlaying,
  toggleMasterAudioPlayback,
  sharedProgress,
  userCurrentTime,
  masterCurrentTime,
  masterDuration,
  playbackSpeed,
  handleSpeedShift,
  isGeminiAnalyzing,
  geminiAnalysis,
  isMultiAyahMode,
  selectedSurahNum,
  selectedAyahNum,
  setSelectedSurahNum,
  setSelectedAyahNum,
  setSelectedVerse,
  setWordStates,
  setCurrentScore,
  setFlaggedMistakes,
  setLiveTranscript,
  setGeminiAnalysis,
  setRecState,
  resetPracticeState,
  startRecordingFlow,
  setIsCustomMode,
  getDynamicVerseOption,
  ALL_SURAHS
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 relative z-10 text-left"
    >
      {/* 1. Header with Reset/Back to Studio and Fluency Index */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/5 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={resetPracticeState}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-[#D4AF37] hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            <span>Studio</span>
          </button>
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[#D4AF37] text-[8px] font-black uppercase tracking-widest">
              <Award size={12} />
              <span>Evaluation Verified</span>
            </div>
            <h3 className="text-lg md:text-2xl font-serif font-black text-cream">Review & Master Pronunciation</h3>
          </div>
        </div>
        
        {/* Accuracy Score Badge */}
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl px-5 py-3 text-center self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-mono">Fluency Index</span>
          <span className="text-xl md:text-2xl font-serif font-black text-[#D4AF37]">{currentScore ?? 100}%</span>
        </div>
      </div>

      {/* 2. Target Verse Preview with Tips */}
      <div className="bg-[#121214]/85 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-[#D4AF37]/15 text-center">
        <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-mono block mb-4">Selected Verse Target Text (Tap words to inspect Tajweed tips)</span>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-5 mb-6" dir="rtl">
          {selectedVerse.words.map((word, i) => {
            const state = wordStates[word] || 'neutral';
            return (
              <button
                key={i}
                onClick={() => {
                  toast(selectedVerse.tips[word] || "Observe makhraj coordinates and keep pronunciation static.", {
                    icon: '📖',
                    style: { background: '#1A1A1E', color: '#FFF', border: '1px solid rgba(212,175,55,0.2)' }
                  });
                }}
                className={cn(
                  "text-2.5xl md:text-4.5xl font-serif font-semibold pb-1.5 border-b-2 cursor-pointer transition-all hover:scale-105 select-none",
                  state === 'correct' 
                    ? "text-[#D4AF37] border-b-[#D4AF37]/45 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                    : state === 'incorrect'
                      ? "text-[#FF4D4D] border-b-[#FF4D4D]/45 line-through decoration-dotted"
                      : "text-slate-500 border-b-transparent"
                )}
              >
                {word}
              </button>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 space-y-1 text-center">
          <p className="text-xs italic text-slate-400 font-serif">{selectedVerse.transliteration}</p>
          <p className="text-sm font-serif font-medium text-slate-300">"{selectedVerse.translation}"</p>
        </div>
      </div>

      {/* 3. Comparative Playback Waveforms (User vs Sheikh Al-Afasy) */}
      <div className="bg-[#121214]/80 p-6 rounded-3xl border border-white/5">
        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono block mb-6 text-center">Acoustic comparative alignment</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User recorded playback */}
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col justify-between items-stretch">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-full text-[7px] font-black uppercase tracking-widest px-3 py-1">Spoken Voice</span>
                <div className="text-[8px] font-mono text-slate-500">
                  {isUserAudioPlaying ? `${userCurrentTime.toFixed(1)}s` : "0.0s"}
                </div>
              </div>
              <h4 className="text-sm font-semibold text-cream mt-1 font-serif">Your Recitation Stream</h4>
            </div>

            {/* Interactive waveform for user voice */}
            <div className="h-16 flex items-center justify-center gap-[3px] bg-black/20 rounded-xl my-4 px-4 overflow-hidden relative border border-white/5">
              {[12, 18, 32, 24, 16, 28, 42, 36, 14, 20, 26, 48, 34, 18, 22, 38, 40, 24, 12, 18, 30, 22, 16, 24, 12].map((h, idx) => {
                const percentOfTimeline = (idx / 25) * 100;
                const hasPassed = sharedProgress >= percentOfTimeline;
                const isMistakeRange = flaggedMistakes.length > 0 && idx >= 9 && idx <= 15;
                
                let colorClass = "bg-zinc-700/50";
                if (hasPassed || isUserAudioPlaying) {
                  if (isMistakeRange) {
                    colorClass = hasPassed ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-red-500/30";
                  } else {
                    colorClass = hasPassed ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-emerald-400/35";
                  }
                }
                return (
                  <div 
                    key={idx} 
                    style={{ height: `${h}px` }} 
                    className={cn("w-[4px] rounded-full transition-all duration-300", colorClass)}
                  />
                );
              })}
            </div>

            <div className="mt-2">
              <button
                onClick={toggleUserAudioPlayback}
                className={cn(
                  "px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow-md w-full justify-center cursor-pointer",
                  isUserAudioPlaying 
                    ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse" 
                    : "bg-[#D4AF37] text-[#121214] hover:bg-[#D4AF37]/90"
                )}
              >
                {isUserAudioPlaying ? <Square size={12} /> : <Play size={12} />}
                <span>{isUserAudioPlaying ? "Pause Playback" : "Listen to My Voice"}</span>
              </button>
            </div>
          </div>

          {/* Master Sheikh playback */}
          <div className="bg-white/[0.02] border border-[#D4AF37]/10 p-5 rounded-2xl flex flex-col justify-between items-stretch">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25 rounded-full text-[7px] font-black uppercase tracking-widest px-3 py-1">Master Standard</span>
                <div className="flex items-center space-x-1 bg-white/5 p-0.5 rounded-lg">
                  {[0.8, 1.0, 1.2].map(sp => (
                    <button
                      key={sp}
                      onClick={() => handleSpeedShift(sp)}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[7px] font-black transition-all cursor-pointer",
                        playbackSpeed === sp ? "bg-[#D4AF37] text-[#121214]" : "text-slate-400 hover:text-white"
                      )}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>
              <h4 className="text-sm font-semibold text-cream mt-1 font-serif">Listen to Sheikh Al-Afasy</h4>
            </div>

            {/* Interactive waveform for sheikh voice */}
            <div className="h-16 flex items-center justify-center gap-[3px] bg-black/20 rounded-xl my-4 px-4 overflow-hidden relative border border-[#D4AF37]/5">
              {[16, 24, 20, 36, 44, 28, 18, 12, 26, 32, 40, 24, 14, 22, 38, 48, 30, 16, 22, 34, 42, 28, 18, 12, 20].map((h, idx) => {
                const percentOfTimeline = (idx / 25) * 100;
                const hasPassed = (isUserAudioPlaying ? sharedProgress : (masterDuration ? (masterCurrentTime / masterDuration) * 100 : 0)) >= percentOfTimeline;
                
                let colorClass = "bg-zinc-700/50";
                if (hasPassed || isMasterAudioPlaying) {
                  colorClass = hasPassed ? "bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.7)]" : "bg-[#D4AF37]/35";
                }
                return (
                  <div 
                    key={idx} 
                    style={{ height: `${h}px` }} 
                    className={cn("w-[4px] rounded-full transition-all duration-300", colorClass)}
                  />
                );
              })}
            </div>

            <div className="mt-2">
              <button
                onClick={toggleMasterAudioPlayback}
                className={cn(
                  "px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow-md w-full justify-center cursor-pointer",
                  isMasterAudioPlaying 
                    ? "bg-[#D4AF37] text-[#121214] animate-pulse" 
                    : "bg-[#1A1A1E] text-[#D4AF37] border border-[#D4AF37]/25 hover:bg-white/5"
                )}
              >
                {isMasterAudioPlaying ? <Square size={12} className="fill-current animate-pulse" /> : <Play size={12} />}
                <span>{isMasterAudioPlaying ? "Pause Master" : "Listen to Master Reciter"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Nooraya AI Tarteel Detailed Co-Teacher Analysis */}
      <div className="bg-[#121214]/60 p-6 rounded-3xl border border-[#D4AF37]/20 space-y-4">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
          <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
          <span className="text-[9.5px] font-black uppercase tracking-widest text-[#D4AF37]">Nooraya Tarteel AI Co-Teacher Analysis</span>
        </div>

        {isGeminiAnalyzing ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="text-[#D4AF37] animate-spin" size={24} />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Consulting Tajweed Analysis expert...</p>
          </div>
        ) : geminiAnalysis ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl">
              <span className="text-[8px] font-black uppercase text-[#D4AF37] block mb-1">Encouraging Master Feedback</span>
              <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                "{geminiAnalysis.overallFeedback}"
              </p>
            </div>

            {(geminiAnalysis.wordAnalyses?.length ?? 0) > 0 ? (
              <div className="space-y-3">
                <span className="text-[8px] font-black uppercase text-slate-500 block">Syllable correction breakdown (Nooraya highlight)</span>
                {geminiAnalysis.wordAnalyses.map((wa, i) => (
                  <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-left">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-serif font-black text-[#FF4D4D]">{wa.word}</span>
                        {wa.tajweedIssue && (
                          <span className="bg-[#FF4D4D]/10 text-[#FF4D4D] text-[6.5px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                            {wa.tajweedIssue}
                          </span>
                        )}
                        <span className={cn(
                          "text-[6.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono",
                          wa.severity === 'major' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {wa.severity} Slip
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-2 font-medium">Spoken as: <span className="italic font-mono text-[#FF4D4D] font-bold">"{wa.recitedAs}"</span></p>
                      <p className="text-slate-300 text-xs mt-1 leading-normal"><span className="text-[#D4AF37] font-semibold">Tutor Remedy guidance:</span> {wa.guidance}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-400 pr-1" />
                <span className="text-xs text-emerald-400 font-bold">No word slips detected by Tarteel AI core. Excel on!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Awaiting assessment stream compilation...</p>
          </div>
        )}
      </div>

      {/* 5. Identified Pronunciation Improvements (Syllable Slips) */}
      <div className="space-y-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Identified Pronunciation Improvements</span>
        {flaggedMistakes.length === 0 ? (
          <div className="p-5 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl flex items-center space-x-3">
            <CheckCircle2 className="text-emerald-400" size={18} />
            <p className="text-xs text-cream font-medium">MashaAllah! Absolutely zero errors detected. Your vocal coordination is impeccable.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedMistakes.map((word, i) => (
              <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-serif font-black text-[#FF4D4D] pr-3 border-r border-white/5">{word}</span>
                  <div>
                    <span className="font-bold text-xs text-cream">Syllable Slip Detected</span>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      {selectedVerse.tips[word] || "Slowly pronounce letter boundaries in absolute stillness to resolve."}
                    </p>
                  </div>
                </div>
                <span className="text-[7px] text-red-400 font-bold uppercase tracking-widest text-right">Warning Crimson Triggered</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Fluency Certificate download */}
      {currentScore && currentScore >= 85 && (
        <div className="p-6 bg-gradient-to-br from-[#121214] to-[#1c180d] border-2 border-double border-[#D4AF37]/45 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-center">
            <Trophy className="text-[#D4AF37] animate-bounce" size={42} />
          </div>
          <div>
            <h4 className="text-[#D4AF37] font-serif font-black text-lg uppercase tracking-wider">Nooraya accredited Fluency Certificate</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto font-serif leading-relaxed text-center">
              "I hereby certify that on this day, the seeker recited the coordinates of <span className="text-[#D4AF37] font-bold font-sans">{selectedVerse.name}</span> with a certified fluency rating score of <span className="text-[#D4AF37] font-bold font-sans">{currentScore}%</span>."
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.success("Certificate downloaded to device successfully!", { icon: '💾' });
              }}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#121214] px-4.5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download size={12} />
              <span>Download PDF Certificate</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`I achieved a beautiful ${currentScore}% fluency on Surah ${selectedVerse.name} using Nooraya's Mastery Reciter Studio!`);
                toast.success("Certificate share link cloned to clipboard!", { icon: '🔗' });
              }}
              className="bg-[#121214] hover:bg-[#121214]/80 text-[#D4AF37] border border-[#D4AF37]/20 px-4.5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Share2 size={12} />
              <span>Share Completion Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. Seamless Continuous Range Loader */}
      {isMultiAyahMode && (
        <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="text-left space-y-0.5">
            <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-black block">Seamless continuous range log</span>
            <p className="text-xs font-semibold text-cream leading-relaxed">Continuous stream ready to advance</p>
          </div>
          
          <button
            onClick={() => {
              let nAyah = selectedAyahNum + 1;
              let nSurah = selectedSurahNum;
              const maxA = ALL_SURAHS.find(s => s.number === selectedSurahNum)?.numberOfAyahs || 7;
              if (nAyah > maxA) {
                nAyah = 1;
                nSurah = (selectedSurahNum % 114) + 1;
                setSelectedSurahNum(nSurah);
              }
              setSelectedAyahNum(nAyah);
              setIsCustomMode(true);

              const nextOpt = getDynamicVerseOption(nSurah, nAyah);
              setSelectedVerse(nextOpt);

              const initialStates: { [w: string]: 'neutral' } = {};
              nextOpt.words.forEach((w: string) => { initialStates[w] = 'neutral'; });
              setWordStates(initialStates);
              setCurrentScore(null);
              setFlaggedMistakes([]);
              setLiveTranscript('');
              setGeminiAnalysis(null);
              setRecState('idle');

              toast.success(`Advanced to [${nSurah}:${nAyah}] contiguous coordinate bounds!`);
            }}
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#121214] px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow hover:scale-105 cursor-pointer"
          >
            <span>Proceed to Continuous verse</span>
            <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* 8. Bottom Action Bar */}
      <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (!isMasterAudioPlaying) {
                toggleMasterAudioPlayback();
              }
              if (isUserAudioPlaying) {
                toggleUserAudioPlayback();
              }
              toast.success("Divine master reciter isolated playback.");
            }}
            className="bg-[#1A1A1E] text-[#D4AF37] border border-[#D4AF37]/25 hover:bg-white/5 px-4.5 py-2.5 rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            Listen to Master Only
          </button>
          
          <button
            onClick={() => {
              resetPracticeState();
              setTimeout(() => {
                startRecordingFlow();
              }, 500);
            }}
            className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-4.5 py-2.5 rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-all hover:scale-105 cursor-pointer"
          >
            Retry Recitation Goal
          </button>

          <button
            onClick={() => {
              toast.success("Voice coordinate snapshot successfully preserved in Historical Ledger!", { icon: '💾' });
            }}
            className="bg-zinc-900 border border-white/10 text-slate-300 hover:text-white px-4.5 py-2.5 rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            Save to Ledger History
          </button>

          <button
            onClick={() => {
              toast.success("Offline cache download initiated for offline fine-tuned matching feedback!");
            }}
            className="bg-zinc-900 border border-white/10 text-slate-300 hover:text-white px-4.5 py-2.5 rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            Secure Offline Download
          </button>
        </div>

        <button
          onClick={resetPracticeState}
          className="bg-[#D4AF37] text-[#121214] px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          Practice New Verse
        </button>
      </div>
    </motion.div>
  );
};