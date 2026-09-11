
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music, Waves, Wind, Settings2, Play, Pause, ChevronRight } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { cn } from '../lib/utils';

const RECITATIONS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', description: 'Deep & Serene' },
  { id: 'shuraim', name: 'Saud Al-Shuraim', description: 'Powerful & Emotional' },
  { id: 'sudais', name: 'Abdur-Rahman As-Sudais', description: 'Majestic & Classical' }
];

export const AudioAtmosphere = () => {
  const { 
    isPlaying, volume, isMuted, activeReciter, 
    togglePlay, setVolume, toggleMute, setActiveReciter,
    audioVisualData, activePreset, applyPreset, playbackSpeed, setPlaybackSpeed 
  } = useAudio();

  const [isOpen, setIsOpen] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      toggleMute();
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <>
      {/* Top Right Floating Controls */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col items-center gap-3">
        {/* Main Play/Pause Button */}
        <motion.button
          onClick={togglePlay}
          className={cn(
            "p-4 rounded-full bg-midnight/60 backdrop-blur-2xl border border-gold/20 transition-all noor-glow shadow-[0_0_20px_rgba(212,175,55,0.15)]",
            isPlaying ? "text-gold scale-110" : "text-slate-500"
          )}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? "Pause Quran" : "Play Quran"}
        >
          {isPlaying ? (
            <div className="flex items-center gap-1 h-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: [4, 16, 6, 20, 4],
                    backgroundColor: ["#D4AF37", "#F8F4E1", "#D4AF37"]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.6 + i * 0.1, 
                    ease: "easeInOut" 
                  }}
                  className="w-1 rounded-full"
                />
              ))}
            </div>
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" />
          )}
        </motion.button>

        {/* Settings/Atmosphere Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-2.5 rounded-full bg-midnight/40 backdrop-blur-xl border border-gold/10 text-gold/60 hover:text-gold hover:border-gold/30 transition-all shadow-lg",
            isOpen && "bg-gold/20 text-gold border-gold/40"
          )}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          title="Audio Settings"
        >
          <Settings2 size={18} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute top-0 right-16 w-80 bg-midnight/95 backdrop-blur-3xl border border-gold/20 rounded-[2.5rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[110]"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gold font-black text-[10px] uppercase tracking-[0.3em]">Atmosphere</h3>
                  <button onClick={togglePlay} className="text-cream p-1 hover:text-gold transition-colors">
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <span>Soul Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-gold cursor-pointer"
                  />
                </div>

                {/* Speed Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <span>Recitation Speed</span>
                    <span>{playbackSpeed.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-gold cursor-pointer"
                  />
                </div>

                {/* Atmospheric Presets */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <span>Atmospheric Presets</span>
                    {activePreset && (
                      <button 
                        onClick={() => applyPreset(null)}
                        className="text-gold hover:text-white transition-colors text-[9px] font-bold tracking-normal normal-case cursor-pointer"
                      >
                        Reset Custom
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => applyPreset('tahajjud')}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer",
                        activePreset === 'tahajjud'
                          ? "bg-gold/15 border-gold/40 text-gold"
                          : "bg-white/[0.02] border-white/5 text-cream hover:bg-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">🌙 Tahajjud Mode</span>
                        <span className="text-[8px] font-mono opacity-60 font-medium">0.85x Speed</span>
                      </div>
                      <span className="text-[9px] text-white/40 leading-snug">
                        Slow, meditative resonance with highly immersive night-prayer atmosphere.
                      </span>
                    </button>

                    <button
                      onClick={() => applyPreset('focus')}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer",
                        activePreset === 'focus'
                          ? "bg-gold/15 border-[#D4AF37]/45 text-gold"
                          : "bg-white/[0.02] border-white/5 text-cream hover:bg-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs font-serif">⚡ Focus Mode</span>
                        <span className="text-[8px] font-mono opacity-60 font-medium">1.05x Speed</span>
                      </div>
                      <span className="text-[9px] text-white/40 leading-snug">
                        Crisp tempo with minimum atmosphere factors to guarantee high clarity.
                      </span>
                    </button>

                    <button
                      onClick={() => applyPreset('dhikr')}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer",
                        activePreset === 'dhikr'
                          ? "bg-gold/15 border-[#D4AF37]/45 text-gold"
                          : "bg-white/[0.02] border-white/5 text-cream hover:bg-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs font-serif">📿 Dhikr Mode</span>
                        <span className="text-[8px] font-mono opacity-60 font-medium">Loop 1.0x</span>
                      </div>
                      <span className="text-[9px] text-white/40 leading-snug">
                        Immediate loop focusing on short, powerful declarations of Oneness (S. 112).
                      </span>
                    </button>
                  </div>
                </div>

                {/* Surah/Reciter Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Soulful Reciter</span>
                  </div>
                  
                  <div className="relative group/select">
                    <select
                      value={activeReciter}
                      onChange={(e) => setActiveReciter(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-cream text-xs font-serif appearance-none cursor-pointer hover:bg-white/10 hover:border-gold/30 transition-all outline-none"
                    >
                      {RECITATIONS.map((r) => (
                        <option key={r.id} value={r.id} className="bg-midnight py-2">
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold/60 group-hover/select:text-gold transition-colors">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10">
                    <p className="text-[10px] text-gold font-black uppercase tracking-tighter mb-1">
                      {RECITATIONS.find(r => r.id === activeReciter)?.name}
                    </p>
                    <p className="text-[9px] text-white/40 italic">
                      {RECITATIONS.find(r => r.id === activeReciter)?.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Noor Visualizer Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] z-[100] flex items-end justify-center pointer-events-none px-4">
        {audioVisualData.map((v, i) => (
          <motion.div
            key={i}
            animate={{ height: isPlaying && !isMuted ? `${v * 40}px` : '1px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex-1 max-w-[8px] bg-gradient-to-t from-gold/40 via-gold/10 to-transparent mx-[0.5px]"
          />
        ))}
      </div>
    </>
  );
};
