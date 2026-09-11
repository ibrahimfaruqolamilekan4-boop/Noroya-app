
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ARTICLES } from '../data/articles';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  activeReciter: string;
  activeSurah: number | null;
  activeStoryId: string | null;
  isNarrating: boolean;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  duck: () => void;
  unduck: () => void;
  toggleNarration: (text?: string) => void;
  setActiveSurah: (id: number | string | null) => void;
  setActiveReciter: (id: string) => void;
  setAmbientVolumeFactor: (factor: number) => void;
  audioVisualData: number[];
  activePreset: string | null;
  applyPreset: (presetId: string | null) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const RECITATIONS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', server: 'server8.mp3quran.net/afs' },
  { id: 'shuraim', name: 'Saud Al-Shuraim', server: 'server7.mp3quran.net/shur' },
  { id: 'sudais', name: 'Abdur-Rahman As-Sudais', server: 'server7.mp3quran.net/sds' }
];

const STORY_SURAH_MAP: Record<string, number> = {
  'prophet-muhammad-chronicles': 33,
  'prophet-yaqub-yusuf-chronicles': 12,
  'prophet-adam-beginning': 1,
  'prophet-nuh-ark': 71,
  'prophet-ibrahim-search': 14,
  'prophet-yusuf-beauty': 12,
  'prophet-musa-liberation': 20,
  'prophet-yunus-whale': 10,
  'maryam-devotion': 19,
  'prophet-isa-mercy': 19,
  'prophet-muhammad-final': 33,
  'asiya-resistance': 66,
  'prophet-ayub-patience': 21,
  'mother-of-musa': 28,
  'people-of-cave': 18,
  'queen-of-sheba': 27,
  'luqman-wisdom': 31,
  'prophet-idris': 19,
  'isra-wal-miraj': 17,
  'prophet-ayub-healing': 21,
  'people-of-the-ditch': 85,
  'man-of-two-gardens': 18,
  'man-of-yasin': 36,
  'dhul-qarnayn': 18,
  'prophet-musa-chronicles': 20,
  'prophet-musa-harun-partnership': 20,
  'prophet-sulaiman-chronicles': 27,
  'prophet-yunus-chronicles': 10,
  'prophet-zakariya-yahya-chronicles': 19,
  'prophet-isa-chronicles': 19,
  'abu-bakr-al-siddiq': 9,
  'umar-ibn-al-khattab': 20,
  'uthman-ibn-affan': 9,
  'khadija-bint-khuwaylid': 33,
  'aisha-bint-abu-bakr': 24,
  'salman-al-farsi': 33,
  'abu-dahdah': 2,
  'roadmap-day-4': 9,
  'roadmap-day-5': 8,
  'roadmap-day-6': 3,
  'roadmap-day-7': 48,
};

const SURAH_MOODS: Record<number, { name: string, ambient: string }> = {
  14: { name: 'Ibrahim', ambient: 'https://www.soundjay.com/nature/river-1.mp3' },
  12: { name: 'Yusuf', ambient: 'https://www.soundjay.com/nature/river-1.mp3' },
  20: { name: 'Taha', ambient: 'https://www.soundjay.com/nature/wind-1.mp3' },
  19: { name: 'Maryam', ambient: 'https://www.soundjay.com/nature/rain-07.mp3' },
  21: { name: 'Al-Anbiya', ambient: 'https://www.soundjay.com/nature/ocean-waves-1.mp3' },
  27: { name: 'An-Naml', ambient: 'https://www.soundjay.com/nature/forest-1.mp3' },
  33: { name: 'Al-Ahzab', ambient: 'https://www.soundjay.com/nature/nature-sounds-1.mp3' },
  43: { name: 'Az-Zukhruf', ambient: 'https://www.soundjay.com/nature/wind-1.mp3' },
  1: { name: 'Al-Fatihah', ambient: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_1e967a96a3.mp3?filename=ambient-piano-amp-nature-sounds-8621.mp3' },
  18: { name: 'Al-Kahf', ambient: 'https://www.soundjay.com/nature/wind-1.mp3' },
  71: { name: 'Nuh', ambient: 'https://www.soundjay.com/nature/rain-07.mp3' },
  10: { name: 'Yunus', ambient: 'https://www.soundjay.com/nature/ocean-waves-1.mp3' },
  28: { name: 'Al-Qasas', ambient: 'https://www.soundjay.com/nature/river-1.mp3' },
  31: { name: 'Luqman', ambient: 'https://www.soundjay.com/nature/nature-sounds-1.mp3' },
  48: { name: 'Al-Fath', ambient: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_3d9804fb5b.mp3?filename=dawn-fajr-adhan-11440.mp3' }, // Fajr Adhan from Pixabay
  3: { name: 'Ali Imran', ambient: 'https://www.soundjay.com/nature/wind-1.mp3' },
  8: { name: 'Al-Anfal', ambient: 'https://www.soundjay.com/nature/wind-1.mp3' },
  9: { name: 'At-Tawbah', ambient: 'https://www.soundjay.com/nature/desert-wind-1.mp3' }
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [ambientVolumeFactor, setAmbientVolumeFactor] = useState(0.2);
  const [activeReciter, setActiveReciter] = useState('alafasy');
  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [audioVisualData, setAudioVisualData] = useState<number[]>(new Array(40).fill(0));
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Custom Preset States
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const nextAmbientRef = useRef<HTMLAudioElement | null>(null);
  
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioUrl = (surahId: number | null, reciterId: string) => {
    const reciter = RECITATIONS.find(r => r.id === reciterId) || RECITATIONS[0];
    const surahStr = surahId ? surahId.toString().padStart(3, '0') : '001';
    // Use https if available, but fallback to http if there are cert issues
    return `https://${reciter.server}/${surahStr}.mp3`;
  };

  const getAmbientUrl = (surahId: number | null) => {
    if (surahId && SURAH_MOODS[surahId]) return SURAH_MOODS[surahId].ambient;
    return 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_1e967a96a3.mp3?filename=ambient-piano-amp-nature-sounds-8621.mp3';
  };

  const isNightMode = () => {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 5;
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(getAudioUrl(activeSurah, activeReciter));
      audioRef.current.loop = true;
      audioRef.current.crossOrigin = "anonymous";
      
      ambientRef.current = new Audio(getAmbientUrl(activeSurah));
      ambientRef.current.loop = true;
      ambientRef.current.crossOrigin = "anonymous";
    }

    const handleError = () => {
      console.warn("Audio element error, attempting recovery...");
      if (isPlaying) setIsPlaying(false);
    };

    if (audioRef.current) audioRef.current.addEventListener('error', handleError);
    if (ambientRef.current) ambientRef.current.addEventListener('error', handleError);

    return () => {
      stopVisualizer();
      if (audioRef.current) audioRef.current.removeEventListener('error', handleError);
      if (ambientRef.current) ambientRef.current.removeEventListener('error', handleError);
      audioRef.current?.pause();
      ambientRef.current?.pause();
      nextAudioRef.current?.pause();
      nextAmbientRef.current?.pause();
    };
  }, []);

  const crossFade = async (newSurah: number | null, newReciter?: string) => {
    if (!audioRef.current || !ambientRef.current || isTransitioning) return;
    
    setIsTransitioning(true);
    const targetReciter = newReciter || activeReciter;
    const nextUrl = getAudioUrl(newSurah, targetReciter);
    const nextAmbientUrl = getAmbientUrl(newSurah);

    if (audioRef.current.src === nextUrl) {
      setIsTransitioning(false);
      return;
    }

    try {
      nextAudioRef.current = new Audio(nextUrl);
      nextAudioRef.current.loop = true;
      nextAudioRef.current.crossOrigin = "anonymous";
      nextAudioRef.current.volume = 0;

      nextAmbientRef.current = new Audio(nextAmbientUrl);
      nextAmbientRef.current.loop = true;
      nextAmbientRef.current.crossOrigin = "anonymous";
      if (isPlaying) nextAmbientRef.current.volume = isMuted ? 0 : volume * ambientVolumeFactor;
      else nextAmbientRef.current.volume = 0;

      if (isPlaying) {
        await Promise.all([
          nextAudioRef.current.play().catch(e => console.warn("Failed to pre-play next audio:", e)),
          nextAmbientRef.current.play().catch(e => console.warn("Failed to pre-play next ambient:", e))
        ]);
        nextAudioRef.current.playbackRate = playbackSpeed;
      }

      const steps = 20;
      const interval = 50; // Faster transition (1 second)
      const volStep = volume / steps;

      for (let i = 0; i <= steps; i++) {
          const currentVol = Math.max(0, volume - (volStep * i));
          const nextVol = Math.min(volume, volStep * i);
          
          if (audioRef.current) audioRef.current.volume = isMuted ? 0 : currentVol;
          if (ambientRef.current) ambientRef.current.volume = isMuted ? 0 : currentVol * ambientVolumeFactor;
          
          if (nextAudioRef.current) nextAudioRef.current.volume = isMuted ? 0 : nextVol;
          if (nextAmbientRef.current) nextAmbientRef.current.volume = isMuted ? 0 : nextVol * ambientVolumeFactor;
          
          await new Promise(r => setTimeout(r, interval));
      }

      if (audioRef.current) audioRef.current.pause();
      if (ambientRef.current) ambientRef.current.pause();
      
      sourceRef.current = null;
      
      audioRef.current = nextAudioRef.current;
      ambientRef.current = nextAmbientRef.current;
      
      nextAudioRef.current = null;
      nextAmbientRef.current = null;
      
      if (isPlaying) {
          initAudioCtx();
          startVisualizer();
      }
    } catch (error) {
      console.error("Crossfade failed:", error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const initAudioCtx = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = (window.AudioContext || (window as any).webkitAudioContext);
        audioCtxRef.current = new AudioCtxClass();
      }
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (audioRef.current && !sourceRef.current) {
        const analyzer = audioCtxRef.current.createAnalyser();
        analyzer.fftSize = 256;
        analyzerRef.current = analyzer;

        const source = audioCtxRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyzer);
        analyzer.connect(audioCtxRef.current.destination);
        sourceRef.current = source;
      }
    } catch (e) {
      console.error("Audio Context initialization failed:", e);
    }
  };

  const startVisualizer = () => {
    if (!analyzerRef.current) {
      initAudioCtx();
    }
    if (!analyzerRef.current) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      if (!analyzerRef.current) return;
      analyzerRef.current.getByteFrequencyData(dataArray);
      const mappedData = Array.from(dataArray.slice(0, 40)).map(v => v / 255);
      setAudioVisualData(mappedData);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopVisualizer = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setAudioVisualData(new Array(40).fill(0));
  };

  useEffect(() => {
    if (audioRef.current && ambientRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      ambientRef.current.volume = isMuted ? 0 : volume * ambientVolumeFactor;
    }
  }, [volume, isMuted, ambientVolumeFactor]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, isPlaying]);

  // Wrapping setters to break preset on manual adjustment
  const handleSetVolume = (val: number) => {
    setVolume(val);
    if (activePreset) setActivePreset(null);
  };

  const handleSetAmbientVolumeFactor = (factor: number) => {
    setAmbientVolumeFactor(factor);
    if (activePreset) setActivePreset(null);
  };

  const handleSetPlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (activePreset) setActivePreset(null);
  };

  const applyPreset = (presetId: string | null) => {
    if (!presetId) {
      setActivePreset(null);
      setVolume(0.3);
      setPlaybackSpeed(1.0);
      setAmbientVolumeFactor(0.2);
      return;
    }

    setActivePreset(presetId);
    if (presetId === 'tahajjud') {
      setVolume(0.12);
      setPlaybackSpeed(0.85); // calm and slower meditative pace
      setAmbientVolumeFactor(0.35); // highly immersive night prayers atmosphere
      handleSetActiveSurah(67); // Surah Al-Mulk (recommended night surah)
    } else if (presetId === 'focus') {
      setVolume(0.35);
      setPlaybackSpeed(1.05); // high crisp clear pace
      setAmbientVolumeFactor(0.02); // minimal distraction atmospheric level
      handleSetActiveSurah(36); // Surah Ya-Sin (Heart of the Quran)
    } else if (presetId === 'dhikr') {
      setVolume(0.22);
      setPlaybackSpeed(1.0); // natural standard pace
      setAmbientVolumeFactor(0.2); // ambient flow
      handleSetActiveSurah(112); // Surah Al-Ikhlas (looping short chapter)
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !ambientRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      ambientRef.current.pause();
      setIsPlaying(false);
      stopVisualizer();
    } else {
      initAudioCtx();
      
      const playPromise = audioRef.current.play();
      const ambientPromise = ambientRef.current.play();
      
      console.log("Attempting to play audio from:", audioRef.current.src);
      
      Promise.all([playPromise, ambientPromise])
        .then(() => {
          setIsPlaying(true);
          startVisualizer();
          if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
          }
        })
        .catch(err => {
          console.warn("Audio play blocked by browser. User interaction required:", err);
          // If the URL itself is the problem, let's try a direct backup if it's the first surah
          if (!activeSurah || activeSurah === 1) {
            audioRef.current!.src = 'https://server8.mp3quran.net/afs/001.mp3';
            if (audioRef.current) {
              audioRef.current.playbackRate = playbackSpeed;
            }
            audioRef.current!.play().then(() => {
              setIsPlaying(true);
              startVisualizer();
            }).catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        });
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const duck = () => {
    if (audioRef.current) audioRef.current.volume = volume * 0.1;
    if (ambientRef.current) ambientRef.current.volume = volume * 0.05;
  };

  const unduck = () => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (ambientRef.current) ambientRef.current.volume = volume * ambientVolumeFactor;
  };

  const [isNarrating, setIsNarrating] = useState(false);

  const toggleNarration = (text?: string) => {
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      unduck();
    } else if (text) {
      setIsNarrating(true);
      duck();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('Natural'))) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setIsNarrating(false);
        unduck();
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSetActiveSurah = (id: number | string | null) => {
    let resolvedId: number | null = null;
    
    if (typeof id === 'string') {
      const article = ARTICLES.find(a => a.id === id);
      if (article && article.surahId) {
        resolvedId = article.surahId;
      } else if (STORY_SURAH_MAP[id]) {
        resolvedId = STORY_SURAH_MAP[id];
      }
      setActiveStoryId(id);
    } else if (typeof id === 'number' || id === null) {
      resolvedId = id;
      setActiveStoryId(null);
    }

    if (resolvedId === activeSurah && activeSurah !== null) return;
    
    // Start pre-loading immediately
    const nextUrl = getAudioUrl(resolvedId, activeReciter);
    const nextAmbientUrl = getAmbientUrl(resolvedId);
    
    const preLoadAudio = new Audio(nextUrl);
    preLoadAudio.preload = "auto";
    const preLoadAmbient = new Audio(nextAmbientUrl);
    preLoadAmbient.preload = "auto";

    setActiveSurah(resolvedId);
    
    // Use a small timeout to simulate the "1 second before transition" pre-fetch request
    // if the user is about to navigate.
    if (isPlaying) {
       setTimeout(() => {
         crossFade(resolvedId, activeReciter);
       }, 1000); // 1-second pre-fetch requirement
    } else {
      if (audioRef.current) audioRef.current.src = nextUrl;
      if (ambientRef.current) ambientRef.current.src = nextAmbientUrl;
    }
  };

  const handleSetActiveReciter = (id: string) => {
    if (id === activeReciter) return;
    setActiveReciter(id);
    crossFade(activeSurah, id);
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, volume, isMuted, 
      activeReciter, activeSurah, activeStoryId,
      isNarrating,
      togglePlay, setVolume: handleSetVolume, toggleMute, duck, unduck, 
      toggleNarration,
      setActiveSurah: handleSetActiveSurah,
      setActiveReciter: handleSetActiveReciter,
      setAmbientVolumeFactor: handleSetAmbientVolumeFactor,
      audioVisualData,
      activePreset,
      applyPreset,
      playbackSpeed,
      setPlaybackSpeed: handleSetPlaybackSpeed
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
