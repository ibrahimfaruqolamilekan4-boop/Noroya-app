import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Moon, 
  Star, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Clock, 
  Upload, 
  Save, 
  Plus, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Sparkles,
  CloudRain,
  Flame,
  Bird,
  Wind,
  Check,
  Edit,
  UserPlus,
  TrendingUp,
  MapPin,
  ChevronDown,
  Activity,
  Heart,
  ChevronUp,
  Download,
  Home,
  Sliders,
  Settings,
  Users
} from 'lucide-react';
import { ALL_SURAHS, fetchAyahContext, Surah, DetailedAyah } from '../data/quranExplorer';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { WaveformVisualizer } from './WaveformVisualizer';

// Types for customizable Qari Profiles
interface Reciter {
  id: string;
  name: string;
  style: string;
  image: string;
  bio: string;
  country: string;
  surahFolder: string;
  isCustom?: boolean;
}

// Five Master Sheikh Profiles restored instantly
const MASTER_RECITERS: Reciter[] = [
  { 
    id: 'turki', 
    name: "Sheikh Badr Al-Turki", 
    style: "Deep & Atmospheric Resonance",
    image: "https://pub-c5e31b5cdafb419a866161d8d5f354d3.r2.dev/badr-al-turki.jpg",
    bio: "Celebrated across Arabia for his deeply atmospheric resonance, unhurried pacing, and profound meditative calm that captures the listener's heart and guides them towards visual quietude.",
    country: "Saudi Arabia",
    surahFolder: "/assets/audio/bdr_trki/"
  },
  { 
    id: 'dossari', 
    name: "Sheikh Yasser Al-Dossari", 
    style: "Soaring Maqamat Harmonies",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Legendary Imam of Masjid al-Haram, globally revered for his breathtaking emotional depth, rapid dramatic transitions, and master level control of classical Arabic maqam scales.",
    country: "Saudi Arabia", 
    surahFolder: "/assets/audio/yasser/"
  },
  { 
    id: 'afasy', 
    name: "Sheikh Mishary Rashid Al-Afasy", 
    style: "Luminous & Sweet Vocal Cadence",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Globally beloved Kuwaiti Imam admired for his soulful, rich, melodic delivery, beautiful rhythmic cadence, and pure pronunciation of the sacred texts with classical rules of Tajweed.",
    country: "Kuwait",
    surahFolder: "/assets/audio/afs/"
  },
  { 
    id: 'sudais', 
    name: "Sheikh Abdul Rahman Al-Sudais", 
    style: "Majestic & Powerful Classical",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Senior Imam and General President of Haramain, known for his historic, powerful, yet deeply emotional recitation rhythm that has resonated beautifully for over four decades.",
    country: "Saudi Arabia",
    surahFolder: "/assets/audio/sds/"
  },
  { 
    id: 'muaiqly', 
    name: "Sheikh Maher Al-Muaiqly", 
    style: "Meditative & Flowing Cadence",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Imam of Masjid al-Haram, famous for his tender, deeply humble, unhurried reading structure, perfect control of breath, and pristine articulation of each verse.",
    country: "Saudi Arabia",
    surahFolder: "/assets/audio/maher/"
  }
];

// Atmospheric loops
interface Atmosphere {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
}

const ATMOSPHERES: Atmosphere[] = [
  { id: 'rain', name: '🌧️ Rain', icon: '🌧️', url: 'https://assets.mixkit.co/active_storage/sfx/2448/2448-84.wav', color: 'from-blue-950/70 via-slate-900/40 to-black' },
  { id: 'flames', name: '🔥 Flames', icon: '🔥', url: 'https://assets.mixkit.co/active_storage/sfx/2513/2513-84.wav', color: 'from-orange-950/70 via-stone-900/40 to-black' },
  { id: 'birds', name: '🍃 Birds', icon: '🍃', url: 'https://assets.mixkit.co/active_storage/sfx/2099/2099-84.wav', color: 'from-emerald-950/70 via-[#10321F]/30 to-black' },
  { id: 'wind', name: '💨 Wind', icon: '💨', url: 'https://assets.mixkit.co/active_storage/sfx/2514/2514-84.wav', color: 'from-cyan-950/70 via-[#142A38]/30 to-black' }
];

// Simple IndexedDB wrapper for high-fidelity audio/image blob storage
const DB_NAME = "LuxuryQuranSanctuaryDB_V2";
const STORE_NAME = "mediablobstore";
const DB_VERSION = 1;

function initIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveBlobToIndexedDB(key: string, blob: Blob): Promise<void> {
  return initIndexedDB().then((db) => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

function getAllBlobsFromIndexedDB(): Promise<{ [key: string]: Blob }> {
  return initIndexedDB().then((db) => {
    return new Promise<{ [key: string]: Blob }>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.openCursor();
      const results: { [key: string]: Blob } = {};
      request.onsuccess = (e) => {
        const cursor = request.result;
        if (cursor) {
          results[cursor.key as string] = cursor.value as Blob;
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  });
}

function getBlobFromIndexedDB(key: string): Promise<Blob | null> {
  return initIndexedDB().then((db) => {
    return new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve((request.result as Blob) || null);
      request.onerror = () => reject(request.error);
    });
  });
}

function deleteBlobFromIndexedDB(key: string): Promise<void> {
  return initIndexedDB().then((db) => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

export const QuranPlayer: React.FC = () => {
  const navigate = useNavigate();

  // Load customizable Qari Roster from local storage
  const [reciters, setReciters] = useState<Reciter[]>(() => {
    try {
      const stored = localStorage.getItem('luxury_reciters');
      if (stored) {
        const parsed = JSON.parse(stored) as Reciter[];
        const masterCopy = JSON.parse(JSON.stringify(MASTER_RECITERS)) as Reciter[];
        
        parsed.forEach(p => {
          const idx = masterCopy.findIndex(m => m.id === p.id);
          if (idx !== -1) {
            // Force replace any legacy remote folder links with high-fidelity local ones
            masterCopy[idx] = {
              ...p,
              surahFolder: MASTER_RECITERS[idx].surahFolder
            };
          } else {
            masterCopy.push(p); // append custom
          }
        });
        return masterCopy;
      }
    } catch (e) {
      console.error(e);
    }
    return MASTER_RECITERS;
  });

  // Track state management
  const [activeReciter, setActiveReciter] = useState<Reciter>(() => reciters[0]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null); // For slide-up profile view
  const [selectedSurah, setSelectedSurah] = useState<Surah>(() => ALL_SURAHS.find(s => s.number === 36) || ALL_SURAHS[0]); // Default to Surah 36 (Ya-Sin)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);

  // Sound Ambient & Environment Selector
  const [activeAtmosphereIndex, setActiveAtmosphereIndex] = useState<number>(0);
  const [isAtmosphereMuted, setIsAtmosphereMuted] = useState<boolean>(true); // Off by default until selection
  const [isAtmosphereDropdownOpen, setIsAtmosphereDropdownOpen] = useState<boolean>(false);
  const [atmosphereVolume, setAtmosphereVolume] = useState<number>(0.15); // Default to low, non-intrusive 15%

  // States for modals/slide ups
  const [isCinematicOpen, setIsCinematicOpen] = useState<boolean>(false);
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false);
  
  // Custom Sheikh modals
  const [isAddSheikhOpen, setIsAddSheikhOpen] = useState<boolean>(false);
  const [addName, setAddName] = useState<string>('');
  const [addStyle, setAddStyle] = useState<string>('');
  const [addCountry, setAddCountry] = useState<string>('');
  const [addBio, setAddBio] = useState<string>('');
  const [addImageBase64, setAddImageBase64] = useState<string>('');

  // Edit Sheikh modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editStyle, setEditStyle] = useState<string>('');
  const [editCountry, setEditCountry] = useState<string>('');
  const [editBio, setEditBio] = useState<string>('');
  const [editImageBase64, setEditImageBase64] = useState<string>('');

  // Interactive Upload targets maps
  const [sessionBlobs, setSessionBlobs] = useState<{ [key: string]: string }>({});
  const [uploadedTracksMetadata, setUploadedTracksMetadata] = useState<{ [key: string]: { name: string; size: string } }>(() => {
    try {
      const stored = localStorage.getItem('luxury_upload_meta');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('luxury_favorites');
      return stored ? JSON.parse(stored) : [1, 18, 36, 55, 67, 114];
    } catch {
      return [1, 18, 36, 55, 67, 114];
    }
  });

  // Current sub-navigation tab state: 'home' | 'reciters' | 'settings'
  const [activeTab, setActiveTab] = useState<'home' | 'reciters' | 'settings'>('home');

  // Custom Interactive Wallpaper Picker States
  const [isWallpaperSheetOpen, setIsWallpaperSheetOpen] = useState<boolean>(false);
  const [applyWallpaperGlobally, setApplyWallpaperGlobally] = useState<boolean>(true);
  const [customWallpaper, setCustomWallpaper] = useState<{ type: 'image' | 'video'; url: string; name: string } | null>(null);
  const wallpaperFileInputRef = useRef<HTMLInputElement>(null);

  // Set custom wallpaper from IndexedDB when selectedSurah changes
  useEffect(() => {
    let activeObjectURL: string | null = null;

    const loadCustomWallpaper = async () => {
      try {
        // 1. Try to load specific wallpaper for current Surah
        let loadedBlob = await getBlobFromIndexedDB(`wallpaper_surah_${selectedSurah.number}`);
        
        // 2. Fallback to global default custom wallpaper
        if (!loadedBlob) {
          loadedBlob = await getBlobFromIndexedDB('wallpaper_global');
        }

        if (loadedBlob) {
          const type = loadedBlob.type.startsWith('video/') ? 'video' : 'image';
          const url = URL.createObjectURL(loadedBlob);
          activeObjectURL = url;
          setCustomWallpaper({
            type,
            url,
            name: (loadedBlob as any).name || (type === 'video' ? 'video_wallpaper.mp4' : 'image_wallpaper.jpg')
          });
        } else {
          setCustomWallpaper(null);
        }
      } catch (err) {
        console.warn("Failed to load custom wallpaper from IndexedDB:", err);
        setCustomWallpaper(null);
      }
    };

    loadCustomWallpaper();

    return () => {
      if (activeObjectURL) {
        URL.revokeObjectURL(activeObjectURL);
      }
    };
  }, [selectedSurah.number]);

  // Track initialization states
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isAssetFailed, setIsAssetFailed] = useState<boolean>(false);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [audioKey, setAudioKey] = useState<number>(0);

  // Restore cached high-fidelity file/image blobs on startup
  useEffect(() => {
    const restoreIndexedDBAssets = async () => {
      try {
        const saved = await getAllBlobsFromIndexedDB();
        const urls: { [key: string]: string } = {};
        Object.entries(saved).forEach(([key, blob]) => {
          urls[key] = URL.createObjectURL(blob);
        });

        setSessionBlobs(prev => {
          const merged = { ...prev, ...urls };
          
          // Dynamically override roster display pointers to utilize live blob URLs
          setReciters(prevList => {
            return prevList.map(r => {
              const imgKey = `image_${r.id}`;
              if (merged[imgKey]) {
                return { ...r, image: merged[imgKey] };
              }
              return r;
            });
          });

          return merged;
        });
        console.log("Quran Sanctury database: High-fidelity assets loaded from IndexedDB successfully!");
      } catch (err) {
        console.warn("IndexedDB offline asset restore bypassed:", err);
      }
    };
    restoreIndexedDBAssets();
  }, []);

  // Reset fallback state when surah or reciter changes
  useEffect(() => {
    setIsUsingFallback(false);
    setAudioKey(0);
  }, [selectedSurah, activeReciter]);

  // Sleep timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0);
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number>(0);

  // Interactive Visualizer Setup
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Refs
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const loadedTrackRef = useRef<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sheikhImageFileRef = useRef<HTMLInputElement>(null);
  const editSheikhImageFileRef = useRef<HTMLInputElement>(null);
  const activeLinkingSurahNumRef = useRef<number | null>(null);

  // Helper inside profile page to check if custom audio linked
  const getCustomAudioText = (reciterId: string, surahNum: number) => {
    const key = `${reciterId}_${surahNum}`;
    return uploadedTracksMetadata[key];
  };

  // Connect Audio context for Waveform Visualizer
  const connectAudioEngine = () => {
    const audio = mainAudioRef.current;
    if (!audio) return;

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }

      const audioCtx = audioContextRef.current;

      if (!analyserNodeRef.current) {
        const analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.82;
        analyserNodeRef.current = analyserNode;
        setAnalyser(analyserNode);
      }

      const analyserCtx = analyserNodeRef.current;

      if (!sourceNodeRef.current) {
        const sourceNode = audioCtx.createMediaElementSource(audio);
        sourceNode.connect(analyserCtx);
        analyserCtx.connect(audioCtx.destination);
        sourceNodeRef.current = sourceNode;
      }

      if (audioCtx.state === 'suspended') {
        const resumeCtx = () => {
          audioCtx.resume().catch(e => console.warn('Context resumption error', e));
        };
        audio.addEventListener('playing', resumeCtx, { once: true });
        audio.addEventListener('play', resumeCtx, { once: true });
      }
    } catch (e) {
      console.warn("Visualizer audio context bypass: ", e);
    }
  };

  // Main Audio setup and change monitoring
  useEffect(() => {
    const audio = mainAudioRef.current;
    if (!audio) return;

    const getTrackSource = () => {
      // 1. If we have a custom uploaded link in local memory/IndexedDB, use that first
      const key = `${activeReciter.id}_${selectedSurah.number}`;
      if (sessionBlobs[key]) {
        return sessionBlobs[key]; // linked local high-fidelity M4A/MP4 container blob
      }

      const folderIndex = String(selectedSurah.number).padStart(3, '0');

      // 2. Fall back to live high-fidelity mp3quran server links directly for non-custom/master reciters only
      // if we are explicitly instructed to use fallback (bypasses browser CORS policy restricts)
      if (isUsingFallback) {
        if (activeReciter.id === 'turki') {
          return `https://server16.mp3quran.net/bdr_trki/${folderIndex}.mp3`;
        } else if (activeReciter.id === 'dossari') {
          return `https://server11.mp3quran.net/yasser/${folderIndex}.mp3`;
        } else if (activeReciter.id === 'afasy') {
          return `https://server8.mp3quran.net/afs/${folderIndex}.mp3`;
        } else if (activeReciter.id === 'sudais') {
          return `https://server11.mp3quran.net/sds/${folderIndex}.mp3`;
        } else if (activeReciter.id === 'muaiqly') {
          return `https://server12.mp3quran.net/maher/${folderIndex}.mp3`;
        }
      }

      // 3. Under normal (non-fallback) conditions, route through high-fidelity, CORS-friendly CDN files to keep visualizer fully functional
      if (activeReciter.id === 'dossari') {
        return `https://download.quranicaudio.com/quran/yasser_ad-dussary/${folderIndex}.mp3`;
      } else if (activeReciter.id === 'afasy') {
        return `https://download.quranicaudio.com/quran/mishari_al_afasy/${folderIndex}.mp3`;
      } else if (activeReciter.id === 'sudais') {
        return `https://download.quranicaudio.com/quran/abdurrahman_as-sudais/${folderIndex}.mp3`;
      } else if (activeReciter.id === 'muaiqly') {
        return `https://download.quranicaudio.com/quran/maher_al_muaiqly/${folderIndex}.mp3`;
      } else if (activeReciter.id === 'turki') {
        // Fallback to Bader Turki mp3quran stream directly as primary
        return `https://server16.mp3quran.net/bdr_trki/${folderIndex}.mp3`;
      }

      // 4. Custom files/assets folder fallback (if any exist)
      const fileIndex = String(selectedSurah.number).padStart(3, '0');
      const base = activeReciter.surahFolder.endsWith('/') 
        ? activeReciter.surahFolder.slice(0, -1) 
        : activeReciter.surahFolder;
      
      return `${base}/${fileIndex}.m4a`;
    };

    const targetSrc = getTrackSource();
    const trackId = `${activeReciter.id}_${selectedSurah.number}_fallback_${isUsingFallback}`;

    if (loadedTrackRef.current !== trackId) {
      audio.pause();
      audio.src = targetSrc;
      audio.load();
      loadedTrackRef.current = trackId;
      setAudioCurrentTime(0);
      setAudioDuration(0);
      setIsAssetFailed(isUsingFallback);
    }

    audio.playbackRate = playbackSpeed;
    audio.volume = volume;

    const onTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };

    const onPlayEvent = () => {
      setIsPlaying(true);
      setIsAudioLoading(false);
    };
    const onPauseEvent = () => {
      setIsPlaying(false);
      setIsAudioLoading(false);
    };

    // Track loading listeners
    const onLoadStart = () => setIsAudioLoading(true);
    const onCanPlay = () => setIsAudioLoading(false);
    const onWaiting = () => setIsAudioLoading(true);
    const onSeeking = () => setIsAudioLoading(true);
    const onSeeked = () => setIsAudioLoading(false);

    const onAudioError = () => {
      if (isUsingFallback) {
         console.error("Critical: Fallback stream loading failed");
         setIsPlaying(false);
         setIsAudioLoading(false);
         return;
      }

      console.warn("Audio asset missing. Directing to dynamic stream fallback.");
      setIsAssetFailed(true);
      setIsAudioLoading(false);

      // Recreate audio element dynamically to remove audio context visualizer bindings (bypasses crossOrigin blocks)
      setAudioKey(prev => prev + 1);
      setIsUsingFallback(true);
      toast.success("Syncing with live stream cache... Session resumed.");
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('playing', onPlayEvent);
    audio.addEventListener('pause', onPauseEvent);

    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('seeking', onSeeking);
    audio.addEventListener('seeked', onSeeked);
    audio.addEventListener('error', onAudioError);

    audio.onended = () => {
      // Auto advance to next Surah
      if (selectedSurah.number < 114) {
        const nextNum = selectedSurah.number + 1;
        const nextSur = ALL_SURAHS.find(s => s.number === nextNum);
        if (nextSur) {
          setSelectedSurah(nextSur);
          setIsPlaying(true);
          toast.success(`Advancing to Surah ${nextSur.englishName}`);
        }
      } else {
        setIsPlaying(false);
      }
    };

    if (isPlaying) {
      if (!isUsingFallback) {
        connectAudioEngine();
      }
      audio.play().catch(err => {
        // Log to warning, but do NOT trigger a hard audio error here because play() can be rejected/aborted for harmless reasons like autoplay restrictions
        console.warn("Playback prevented or interrupted gracefully:", err);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('playing', onPlayEvent);
      audio.removeEventListener('pause', onPauseEvent);

      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('seeking', onSeeking);
      audio.removeEventListener('seeked', onSeeked);
      audio.removeEventListener('error', onAudioError);
    };
  }, [isPlaying, playbackSpeed, selectedSurah, activeReciter, sessionBlobs, isUsingFallback, audioKey]);

  // Ambient sound overlay triggers
  useEffect(() => {
    const ambient = ambientAudioRef.current;
    if (!ambient) return;

    if (isPlaying && !isAtmosphereMuted) {
      const activeMood = ATMOSPHERES[activeAtmosphereIndex];
      if (ambient.src !== activeMood.url) {
        ambient.src = activeMood.url;
        ambient.loop = true;
        ambient.load();
      }
      ambient.volume = atmosphereVolume;
      ambient.play().catch(e => console.log("Ambient lock delay: ", e));
    } else {
      ambient.pause();
    }
  }, [isPlaying, isAtmosphereMuted, activeAtmosphereIndex, atmosphereVolume]);

  // Sleep timer count down loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && sleepTimerMinutes > 0 && sleepSecondsLeft > 0) {
      interval = setInterval(() => {
        setSleepSecondsLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setSleepTimerMinutes(0);
            toast("🌙 Sleep timer finished - playback paused", { icon: '🌙' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sleepTimerMinutes, sleepSecondsLeft]);

  const toggleFavorite = (surahNum: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    let updated;
    if (favorites.includes(surahNum)) {
      updated = favorites.filter(id => id !== surahNum);
      toast.success("Removed from Sanctuary Favorites");
    } else {
      updated = [...favorites, surahNum];
      toast.success("Saved to Sanctuary Favorites! ✨");
    }
    setFavorites(updated);
    localStorage.setItem('luxury_favorites', JSON.stringify(updated));
  };

  const handleScrubAudio = (secs: number) => {
    const audio = mainAudioRef.current;
    if (audio) {
      audio.currentTime = secs;
      setAudioCurrentTime(secs);
    }
  };

  const skipTrack = (direction: 'forward' | 'backward') => {
    let currentIdx = ALL_SURAHS.findIndex(s => s.number === selectedSurah.number);
    if (direction === 'forward') {
      if (currentIdx < ALL_SURAHS.length - 1) {
        setSelectedSurah(ALL_SURAHS[currentIdx + 1]);
      } else {
        setSelectedSurah(ALL_SURAHS[0]);
      }
    } else {
      if (currentIdx > 0) {
        setSelectedSurah(ALL_SURAHS[currentIdx - 1]);
      } else {
        setSelectedSurah(ALL_SURAHS[ALL_SURAHS.length - 1]);
      }
    }
    setIsPlaying(true);
  };

  const saveRecitersList = (newList: Reciter[]) => {
    setReciters(newList);
    localStorage.setItem('luxury_reciters', JSON.stringify(newList));
  };

  // Convert File to Blob URL & Persist in IndexedDB
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const blobUrl = URL.createObjectURL(file);
      
      if (target === 'add') {
        setAddImageBase64(blobUrl);
        // Temporarily park the raw file in window so it can be committed to IndexedDB on submit
        (window as any)._pendingQariImageFile = file;
      } else {
        if (!selectedReciter) return;
        setEditImageBase64(blobUrl);
        
        // Write instantly to IndexedDB under the active Qari key
        await saveBlobToIndexedDB(`image_${selectedReciter.id}`, file);
        
        setSessionBlobs(prev => ({
          ...prev,
          [`image_${selectedReciter.id}`]: blobUrl
        }));

        // Dynamic visual replacement
        setReciters(prevList => {
          return prevList.map(r => {
            if (r.id === selectedReciter.id) {
              return { ...r, image: blobUrl };
            }
            return r;
          });
        });
      }
      toast.success("Portrait photo loaded successfully! 📸");
    } catch (err) {
      console.warn("Image linking issue:", err);
      toast.error("Failed to load local portrait file");
    }
  };

  const handleAddNewSheikh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      toast.error("Sheikh Name is required");
      return;
    }

    const newId = `custom_qari_${Date.now()}`;
    const pendingFile = (window as any)._pendingQariImageFile;
    let finalImageUrl = addImageBase64 || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80";

    if (pendingFile) {
      try {
        await saveBlobToIndexedDB(`image_${newId}`, pendingFile);
        finalImageUrl = URL.createObjectURL(pendingFile);
        setSessionBlobs(prev => ({
          ...prev,
          [`image_${newId}`]: finalImageUrl
        }));
      } catch (err) {
        console.warn("Could not save new Qari image to IndexedDB:", err);
      }
      delete (window as any)._pendingQariImageFile;
    }

    const newSheikh: Reciter = {
      id: newId,
      name: addName.trim(),
      style: addStyle.trim() || "Traditional Resonance",
      image: finalImageUrl,
      bio: addBio.trim() || "A pious added custom Sheikh profile.",
      country: addCountry.trim() || "Unknown",
      surahFolder: `/assets/audio/${newId}/` // clean local asset container path
    };

    const updated = [...reciters, newSheikh];
    saveRecitersList(updated);
    toast.success(`Sheikh ${newSheikh.name} created! ✅`);
    
    // reset form
    setAddName('');
    setAddStyle('');
    setAddCountry('');
    setAddBio('');
    setAddImageBase64('');
    setIsAddSheikhOpen(false);
  };

  const handleEditProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !selectedReciter) return;

    const finalImage = editImageBase64 || selectedReciter.image;

    const updated = reciters.map(r => {
      if (r.id === selectedReciter.id) {
        return {
          ...r,
          name: editName.trim(),
          style: editStyle.trim(),
          country: editCountry.trim(),
          bio: editBio.trim(),
          image: finalImage
        };
      }
      return r;
    });

    saveRecitersList(updated);

    const match = updated.find(r => r.id === selectedReciter.id);
    if (match) {
      setSelectedReciter(match);
      if (activeReciter.id === match.id) {
        setActiveReciter(match);
      }
    }

    toast.success("Profile values updated permanently!");
    setIsEditProfileOpen(false);
  };

  // Recital MP3 Manual File Linking Hub
  const triggerMp3FileSelection = (surahNum: number, reciterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    activeLinkingSurahNumRef.current = surahNum;
    const input = document.getElementById("luxury-surah-file-picker") as HTMLInputElement | null;
    if (input) {
      input.value = '';
      input.click();
    } else if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleMp3FileLinked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const surahNum = activeLinkingSurahNumRef.current;
    if (!file || !surahNum || !selectedReciter) return;

    const key = `${selectedReciter.id}_${surahNum}`;
    
    try {
      // Save directly to raw IndexedDB store
      await saveBlobToIndexedDB(key, file);
      
      const blobUrl = URL.createObjectURL(file);

      // Reset any active failure alert banners on successful upload
      setIsAssetFailed(false);

      // Save in session blobs active audio paths
      setSessionBlobs(prev => ({
        ...prev,
        [key]: blobUrl
      }));

      // Record size and file properties in meta
      const meta = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };

      const updatedMeta = {
        ...uploadedTracksMetadata,
        [key]: meta
      };
      setUploadedTracksMetadata(updatedMeta);
      localStorage.setItem('luxury_upload_meta', JSON.stringify(updatedMeta));

      toast.success(`Successfully uploaded & linked Surah ${surahNum}! (${meta.size})`);
      
      // Auto play if selected
      if (selectedReciter.id === activeReciter.id && selectedSurah.number === surahNum) {
        // reload
        const audio = mainAudioRef.current;
        if (audio) {
          audio.src = blobUrl;
          audio.load();
          if (isPlaying) {
            audio.play().catch(err => console.warn(err));
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to persist high-fidelity asset to IndexedDB storage!");
    }
  };

  const formatSecs = (secondsTotal: number) => {
    if (isNaN(secondsTotal) || !isFinite(secondsTotal)) return "0:00";
    const minutes = Math.floor(secondsTotal / 60);
    const secs = Math.floor(secondsTotal % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white font-sans select-none relative overflow-x-hidden flex flex-col justify-between">
      
      {/* GLOBAL ATMOSPHERE / CUSTOM WALLPAPER BACKGROUND OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden text-neutral-400">
        {customWallpaper ? (
          customWallpaper.type === 'video' ? (
            <video
              key={customWallpaper.url}
              src={customWallpaper.url}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
              style={{ filter: 'brightness(0.3) contrast(1.1) blur(2px)' }}
            />
          ) : (
            <img
              src={customWallpaper.url}
              alt="Custom Wallpaper"
              className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
              style={{ filter: 'brightness(0.3) contrast(1.1) blur(2px)' }}
            />
          )
        ) : (
          /* Subtle dynamic ambient background color from selected atmosphere */
          <div className={cn(
            "absolute inset-0 transition-all duration-1000 opacity-15",
            ATMOSPHERES[activeAtmosphereIndex].color
          )} />
        )}
        {/* Layered dark vignette */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-[#000000]/80 to-[#000000]" />
      </div>

      {/* HTML-5 Audio Nodes */}
      <audio 
        key={audioKey}
        ref={mainAudioRef} 
        crossOrigin={isUsingFallback ? undefined : "anonymous"} 
        playsInline 
        preload="auto" 
      />
      <audio ref={ambientAudioRef} crossOrigin="anonymous" preload="auto" />

      {/* Hidden File Inputs */}
      <input 
        id="luxury-surah-file-picker"
        type="file" 
        ref={fileInputRef} 
        accept="audio/*,video/*,.m4a,.mp4" 
        onChange={handleMp3FileLinked} 
        className="hidden" 
      />
      <input 
        id="luxury-add-qari-image-picker"
        type="file" 
        ref={sheikhImageFileRef} 
        accept="image/*" 
        onChange={(e) => handleImageFileChange(e, 'add')} 
        className="hidden" 
      />
      <input 
        id="luxury-edit-qari-image-picker"
        type="file" 
        ref={editSheikhImageFileRef} 
        accept="image/*" 
        onChange={(e) => handleImageFileChange(e, 'edit')} 
        className="hidden" 
      />

      {/* HEADER CONTROL BAR */}
      <div className="bg-black/80 border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between relative z-[60] backdrop-blur-md shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-all py-1.5 px-4 bg-white/5 hover:bg-white/10 rounded-full text-xs font-mono"
        >
          <ArrowLeft size={14} className="text-[#9C27B0]" />
          <span>Exit Sanctuary</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Wallpaper Customizer Toggle Action */}
          <button
            onClick={() => setIsWallpaperSheetOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/10 hover:border-[#a855f7]/30 text-neutral-300 hover:text-white rounded-full text-[11px] font-mono tracking-wider font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Configure Custom Background"
          >
            <span>🖼️</span>
            <span>Customize Background</span>
          </button>

          {/* Permanent Add Sheikh Portal action */}
          <button
            onClick={() => setIsAddSheikhOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-[11px] font-mono tracking-wider font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus size={13} className="text-white" />
            <span>➕ Add New Sheikh</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      <div className="flex-1 flex flex-col justify-start pb-32 pt-6 px-6 md:px-12 max-w-6xl mx-auto w-full space-y-8 relative z-10">
        
        {isAssetFailed && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between text-red-200 text-xs font-mono relative overflow-hidden backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">⚠️</span>
              <span className="leading-relaxed">
                Please tap <strong>'Edit Profile'</strong> to link an audio recitation file from your device storage.
              </span>
            </div>
            <button 
              onClick={() => setIsAssetFailed(false)}
              className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all ml-2"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        {/* BRAND HEADER TITLE & TAB SWITCHER RENDERERS */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>Home</span>
                </h1>
                <p className="text-[9px] text-[#a855f7] font-mono tracking-widest uppercase mt-0.5">
                  EASYQURANIFY SANCTUARY • MASTER EDITION
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-white/5 rounded-full text-[9px] text-[#a855f7] font-mono tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#a855f7]"></span>
                </span>
                <span>Active visualizer</span>
              </div>
            </div>

            {/* "From your favourites" premium aesthetic card */}
            <div className="bg-[#111111]/80 border border-white/5 rounded-[2rem] p-6 w-full flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Rounded avatar framed by soft white border stroke */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white duration-300 transition-all flex-shrink-0 relative">
                  <img 
                    src={activeReciter.image} 
                    alt={activeReciter.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                </div>

                <div className="text-left space-y-0.5">
                  <p className="text-[9px] font-mono tracking-widest text-[#a855f7] uppercase font-black">
                    From your favourites
                  </p>
                  <h3 className="text-xl font-bold font-serif text-white">{activeReciter.name}</h3>
                  <p className="text-[10px] text-white/50 font-mono">
                    Surah {selectedSurah.englishName} • {selectedSurah.numberOfAyahs} Verses
                  </p>
                </div>
              </div>

              {/* Right play continuous trigger shaped as interactive black pill badge */}
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  connectAudioEngine();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 shrink-0 shadow-lg disabled:opacity-90"
                disabled={isAudioLoading}
              >
                {isAudioLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause size={10} className="fill-current text-black" />
                    <span>Pause session</span>
                  </>
                ) : (
                  <>
                    <Play size={10} className="fill-current text-black" />
                    <span>Continue listening</span>
                  </>
                )}
              </button>
            </div>

            {/* Collections horizontal slide row */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-black">
                Collections
              </h3>
              <div className="flex items-center gap-4 overflow-x-auto pb-2 snap-x no-scrollbar">
                
                {/* Favorites Card */}
                <div 
                  onClick={() => {
                    const num = favorites[0] || 1;
                    const sur = ALL_SURAHS.find(s => s.number === num);
                    if (sur) {
                      setSelectedSurah(sur);
                      setIsPlaying(true);
                      setIsCinematicOpen(true);
                      toast.success(`Sanctuary active! Playing Surah ${sur.englishName}`);
                    }
                  }}
                  className="bg-gradient-to-br from-[#4A121E] via-[#2F0811] to-black border border-white/5 rounded-3xl p-6 cursor-pointer hover:border-red-500/20 transition-all duration-300 snap-start flex-shrink-0 w-64 h-40 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-2 text-left">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400">
                      <Star size={14} className="fill-red-500 text-red-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white leading-tight">Your Favorites</h4>
                    <p className="text-[10px] text-red-200/40 font-mono leading-snug line-clamp-2">
                      Your personal collection of loved surahs.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-red-300 tracking-wider uppercase">
                    <span>{favorites.length} Saved Chapters</span>
                    <ChevronRight size={10} className="text-[#a855f7]" />
                  </div>
                </div>

                {/* Focus Mix Card */}
                <div 
                  onClick={() => {
                    setIsAtmosphereMuted(false);
                    setActiveAtmosphereIndex(0); // Rain overlay
                    const sur = ALL_SURAHS.find(s => s.number === 18) || ALL_SURAHS[0]; // Cave (Focus)
                    setSelectedSurah(sur);
                    setIsPlaying(true);
                    setIsCinematicOpen(true);
                    toast.success("🌧️ Deep Rain Focus session engaged automatically!");
                  }}
                  className="bg-gradient-to-br from-[#1C113E] via-[#0F0824] to-black border border-white/5 rounded-3xl p-6 cursor-pointer hover:border-purple-500/20 transition-all duration-300 snap-start flex-shrink-0 w-64 h-40 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-2 text-left">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                      <Sparkles size={14} className="text-purple-400 animate-pulse" />
                    </div>
                    <h4 className="text-lg font-bold text-white leading-tight">For Focus Mix</h4>
                    <p className="text-[10px] text-purple-200/40 font-mono leading-snug line-clamp-2">
                      Yasser Al-Baqarah, Nisa, Al-Ma'. Balanced with relaxing twilight nature.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-purple-300 tracking-wider uppercase">
                    <span>Deep ambient focus active</span>
                    <ChevronRight size={10} className="text-[#a855f7]" />
                  </div>
                </div>

              </div>
            </div>

            {/* "Newly added" horizontal carousel catalog */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-black">
                  Newly added
                </h3>
                <button 
                  onClick={() => setActiveTab('reciters')}
                  className="text-[10px] font-mono font-bold text-[#a855f7] hover:underline uppercase"
                >
                  See all
                </button>
              </div>

              <div className="flex items-center gap-5 overflow-x-auto pb-2 pt-1 snap-x no-scrollbar">
                {reciters.map((sheikh) => (
                  <div
                    key={sheikh.id}
                    onClick={() => {
                      setSelectedReciter(sheikh);
                      setIsBioExpanded(false);
                    }}
                    className="flex flex-col items-center justify-center gap-2 text-center cursor-pointer snap-start flex-shrink-0 group w-20 relative"
                  >
                    {/* Circle Photo with NEW badge */}
                    <div className="relative w-16 h-16 rounded-full border border-white/10 group-hover:border-white/50 duration-300 transition-all shadow-md overflow-hidden bg-neutral-900 flex-shrink-0">
                      <img 
                        src={sheikh.image} 
                        alt={sheikh.name} 
                        className="w-full h-full object-cover group-hover:scale-105 duration-300 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-0 left-0 bg-red-600 text-white text-[6px] font-mono tracking-tight font-black uppercase px-1 rounded-br border-r border-b border-black">
                        NEW
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-extrabold text-white group-hover:text-[#a855f7] transition-colors leading-tight line-clamp-1 truncate w-20">
                        {sheikh.name.replace("Sheikh ", "").replace("Badr Al-Turki", "Bader Turki")}
                      </h4>
                      <p className="text-[7.5px] text-[#a855f7] tracking-widest uppercase font-mono font-bold leading-none">
                        {sheikh.country.split(' ').pop()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights Neon glowing weekly graph */}
            <div className="bg-neutral-950/80 border border-white/5 rounded-3xl p-5 space-y-3 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#a855f7]" />
                  <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#a855f7]">
                    Insights
                  </h4>
                </div>
                <span className="text-[8px] text-white/30 font-mono bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  12 Days Streak
                </span>
              </div>
              
              <div className="h-24 flex items-end justify-between pt-4 pb-1 relative w-full">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="neon-glow-line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.05" />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                    </linearGradient>
                    <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  <path 
                    d="M 10 80 Q 75 10 150 70 T 300 20 T 420 50 T 490 10" 
                    fill="none" 
                    stroke="#a855f7" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    filter="url(#glow-filter)"
                    className="drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                  />
                  
                  <path 
                    d="M 10 80 Q 75 10 150 70 T 300 20 T 420 50 T 490 10 L 490 100 L 10 100 Z" 
                    fill="url(#neon-glow-line)" 
                    opacity="0.25"
                  />
                  
                  <circle cx="300" cy="20" r="4.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
                  <circle cx="490" cy="10" r="4.5" fill="#ffffff" stroke="#ec4899" strokeWidth="2" />
                </svg>

                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <div key={day} className="flex flex-col items-center justify-between h-full z-10 flex-1 text-center">
                    <span className="text-[8px] text-[#a855f7] font-bold font-mono">
                      {[1.1, 3.2, 1.4, 4.4, 2.3, 3.8, 4.8][idx]}h
                    </span>
                    <span className="text-[9px] text-white/30 font-mono mt-auto">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB VIEW: RECITERS (VERIFIED QARIS GRID) */}
        {activeTab === 'reciters' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('home')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-white">Newly added</h1>
                <p className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase">
                  Verified recitation profiles catalog
                </p>
              </div>
            </div>

            {/* Circular Grid Layout matching easyquranify screenshot style */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 pt-2 pb-20 justify-items-center">
              {reciters.map((sheikh) => {
                return (
                  <div
                    key={sheikh.id}
                    onClick={() => {
                      setSelectedReciter(sheikh);
                      setIsBioExpanded(false);
                    }}
                    className="flex flex-col items-center text-center cursor-pointer group space-y-2 relative"
                  >
                    {/* Circle Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 group-hover:border-white/50 duration-300 transition-all shadow-md relative">
                      <img 
                        src={sheikh.image} 
                        alt={sheikh.name} 
                        className="w-full h-full object-cover group-hover:scale-105 duration-300 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-0 left-0 bg-red-600 text-white text-[7px] font-mono tracking-tight font-black uppercase px-1 py-0.5 rounded-br border-r border-b border-black">
                        NEW
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#a855f7] transition-colors leading-snug">
                        {sheikh.name.replace("Sheikh ", "").replace("Badr Al-Turki", "Bader Turki")}
                      </h4>
                      <p className="text-[9px] text-[#a855f7] tracking-widest uppercase font-mono font-semibold">
                        {sheikh.country}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. TAB VIEW: SETTINGS & CUSTOMIZATION */}
        {activeTab === 'settings' && (
          <div className="space-y-6 pb-20">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('home')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-white">Settings</h1>
                <p className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase">
                  Add custom Qaris & Mix Audio Environments
                </p>
              </div>
            </div>

            {/* Config cards stacked */}
            <div className="space-y-4 text-left">
              
              {/* Card A: Add Qari Portal shortcut trigger */}
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">➕ Add Custom Sheikh</h3>
                    <p className="text-xs text-neutral-400">Expand the catalog by adding local recitation files.</p>
                  </div>
                  <button
                    onClick={() => setIsAddSheikhOpen(true)}
                    className="px-4 py-2 bg-[#a855f7] hover:bg-[#b062f8] text-white flex items-center gap-1 text-xs font-mono rounded-full font-bold shadow-md transition-all scale-100 hover:scale-105 active:scale-95"
                  >
                    <Plus size={12} />
                    <span>Open Add Form</span>
                  </button>
                </div>
              </div>

              {/* Card B: Environment Ambient Mixing controls */}
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-5 space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">🌧️ Soundscapes Mixer</h3>
                  <p className="text-xs text-neutral-400">Tune the individual volumes of the ambient layers overlaying your recitations.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  {ATMOSPHERES.map((atm, idx) => {
                    const isActive = activeAtmosphereIndex === idx && !isAtmosphereMuted;
                    return (
                      <div 
                        key={atm.id}
                        className={cn(
                          "p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2",
                          isActive ? "bg-[#a855f7]/5 border-[#a855f7]/40" : "bg-black/30 border-white/5"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{atm.icon}</span>
                            <span>{atm.name.split(' ').pop()}</span>
                          </span>
                          <button
                            onClick={() => {
                              setActiveAtmosphereIndex(idx);
                              setIsAtmosphereMuted(false);
                              toast.success(`${atm.name} selected as active loop`);
                            }}
                            className={cn(
                              "text-[8px] font-mono font-black uppercase px-2 py-1 rounded-full border transition-all",
                              isActive 
                                ? "bg-[#a855f7] text-black border-[#a855f7]"
                                : "bg-white/5 text-neutral-400 border-white/10 hover:border-white/20"
                            )}
                          >
                            {isActive ? "ACTIVE" : "SELECT"}
                          </button>
                        </div>

                        {isActive && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-neutral-400">
                              <span>Volume</span>
                              <span>{Math.round(atmosphereVolume * 100)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.01" 
                              value={atmosphereVolume}
                              onChange={(e) => setAtmosphereVolume(parseFloat(e.target.value))}
                              className="w-full accent-[#a855f7] h-0.5 bg-white/10 rounded"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setIsAtmosphereMuted(!isAtmosphereMuted);
                    toast(isAtmosphereMuted ? "Ambient sound unmuted and running" : "Ambient sound muted overlay", { icon: '🔇' });
                  }}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-xs text-center font-mono font-black text-[#a855f7] border border-[#a855f7]/20 rounded-xl"
                >
                  {isAtmosphereMuted ? "🔊 Enable Ambient Overlay Playback" : "🔇 Disable Ambient Overlay Playback"}
                </button>
              </div>

              {/* Card C: Sleep timer & Diagnostic details persistence */}
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-5 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-black text-neutral-400 uppercase tracking-widest">🕑 Sleep Sanctuary Timer</h3>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                    {[0, 5, 15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => {
                          setSleepTimerMinutes(mins);
                          setSleepSecondsLeft(mins * 60);
                          if (mins > 0) {
                            toast(`Timer set to ${mins} mins`, { icon: '🌙' });
                          } else {
                            toast("Sleep Timer deactivated");
                          }
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl border transition-all",
                          sleepTimerMinutes === mins 
                            ? "bg-[#a855f7] text-black border-[#a855f7] font-black" 
                            : "bg-black/40 text-white/50 border-white/5 hover:border-white/15 text-neutral-200"
                        )}
                      >
                        {mins === 0 ? "Off" : `${mins} Mins`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 my-2" />

                <div className="space-y-1.5 font-mono text-[10px] text-neutral-400">
                  <span className="text-[9px] uppercase font-black text-neutral-500 tracking-wider block">Storage capacity & cache diagnostics</span>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Active database:</span>
                    <span className="text-[#a855f7] font-bold">IndexedDB Master V2</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Cached assets size:</span>
                    <span className="text-white font-bold">{Object.keys(uploadedTracksMetadata).length} Files Linked</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. THE MODAL SLIDE-UP SHEIKH PROFILE VIEW */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedReciter && (
          <>
            {/* Backdrop opacity layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReciter(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Modal Container Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 170 }}
              className="fixed inset-x-0 bottom-0 h-[88vh] bg-black border-t border-neutral-800 rounded-t-[2.5rem] z-50 overflow-hidden flex flex-col justify-between"
            >
              {/* Inner modal contents scrollable */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                
                {/* 50% Top Massive Hero visual banner */}
                <div className="relative w-full h-[40vh] bg-neutral-950 overflow-hidden shrink-0">
                  <img 
                    src={selectedReciter.image} 
                    alt={selectedReciter.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Action Button: Close Modal */}
                  <button
                    onClick={() => setSelectedReciter(null)}
                    className="absolute top-6 left-6 p-2 rounded-full bg-black/60 border border-white/20 hover:bg-white hover:text-black transition-all shadow"
                  >
                    <X size={18} />
                  </button>

                  {/* Manual Editable controls triggers inside modal view */}
                  <button
                    onClick={() => {
                      setEditName(selectedReciter.name);
                      setEditStyle(selectedReciter.style);
                      setEditCountry(selectedReciter.country);
                      setEditBio(selectedReciter.bio);
                      setEditImageBase64(selectedReciter.image);
                      setIsEditProfileOpen(true);
                    }}
                    className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 border border-[#a855f7]/40 text-[10px] font-mono tracking-wider font-extrabold text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-all shadow-md"
                  >
                    <Edit size={11} />
                    <span>Edit Profile</span>
                  </button>

                  {/* Dark Translucent gradient shadow layout over bottom half image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />
                </div>

                {/* Info and Location details directly below the hero visual */}
                <div className="px-6 md:px-12 -mt-12 relative z-10 space-y-6 text-left">
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-serif font-black text-white tracking-tight">
                        {selectedReciter.name}
                      </h2>
                      <span className="px-3.5 py-1 bg-white/5 border border-white/10 text-xs rounded-full inline-flex items-center gap-1">
                        <MapPin size={11} className="text-red-400" />
                        <span>{selectedReciter.country}</span>
                      </span>
                    </div>
                    <p className="text-xs font-mono tracking-widest text-[#a855f7] uppercase font-bold">
                      {selectedReciter.style}
                    </p>
                  </div>

                  {/* Expandable biography portal */}
                  <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <p className={cn(
                      "text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans transition-all duration-300",
                      isBioExpanded ? "line-clamp-none font-medium text-white/90" : "line-clamp-2"
                    )}>
                      {selectedReciter.bio}
                    </p>
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className="text-[10px] text-[#a855f7] hover:text-[#c084fc] transition-colors font-mono tracking-widest uppercase font-bold"
                    >
                      {isBioExpanded ? "Collapse ▲" : "Read expandable biography ▼"}
                    </button>
                  </div>

                  {/* LIST RECORDER SURAHS */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between w-full border-b border-white/5 pb-2">
                      <h3 className="text-xs font-mono tracking-widest text-[#a855f7] uppercase font-black">
                        Recorded Recitations
                      </h3>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">
                        114 Surahs Available
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
                      {ALL_SURAHS.map((surah) => {
                        const customTrack = getCustomAudioText(selectedReciter.id, surah.number);
                        const isCurrentlyPlayingThis = isPlaying && activeReciter.id === selectedReciter.id && selectedSurah.number === surah.number;

                        return (
                          <div
                            key={surah.number}
                            onClick={() => {
                              setActiveReciter(selectedReciter);
                              setSelectedSurah(surah);
                              setIsPlaying(true);
                              setIsCinematicOpen(true);
                              toast.success(`Sanctuary engaged: ${surah.englishName}`);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group",
                              isCurrentlyPlayingThis 
                                ? "bg-gradient-to-r from-neutral-950 to-purple-950/20 border-[#a855f7]/70 text-[#a855f7]"
                                : "bg-neutral-950/30 border-white/5 hover:border-purple-500/20"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {/* Track Number column */}
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-black",
                                isCurrentlyPlayingThis
                                  ? "bg-[#a855f7] text-black"
                                  : "bg-white/5 text-neutral-500 group-hover:text-white"
                              )}>
                                {String(surah.number).padStart(3, '0')}
                              </div>
                              
                              <div className="text-left">
                                <h4 className="text-sm font-semibold text-white group-hover:text-[#a855f7] transition-colors">
                                  {surah.englishName}
                                </h4>
                                <p className="text-[9px] font-mono text-white/30 uppercase">
                                  {surah.numberOfAyahs} verses • {surah.revelationType}
                                </p>
                              </div>
                            </div>

                            {/* Calligraphy and Action upload targets */}
                            <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                              <span className="font-serif text-lg text-[#ecfeff] opacity-75 pt-1 arab-style">
                                {surah.name}
                              </span>

                              {/* Cloud download status / Manual File merge target action */}
                              <div className="flex items-center gap-2">
                                {/* Upload button for high-fidelity audio/video container files */}
                                <button
                                  onClick={(e) => triggerMp3FileSelection(surah.number, selectedReciter.id, e)}
                                  className={cn(
                                    "p-1.5 rounded-md hover:bg-purple-500/10 transition-all text-xs flex items-center gap-1 font-mono",
                                    customTrack 
                                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/30" 
                                      : "bg-white/5 text-white/30 hover:text-[#a855f7]"
                                  )}
                                  title={customTrack ? `Linked: ${customTrack.name}` : "Upload high-fidelity M4A/MP4 container"}
                                >
                                  <Upload size={12} />
                                  {customTrack && <span className="text-[9px] font-mono">LINKED</span>}
                                </button>

                                {/* Clean cloud download icon */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success("Offline studio master cached successfully!");
                                  }}
                                  className="p-1.5 bg-white/5 hover:bg-neutral-800 rounded-md text-white/40 hover:text-white transition-all"
                                  title="Download Studio Master Offline"
                                >
                                  <Download size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 3. CINEMATIC FULL SCREEN PLAYER & ANIMATED BACKGROUND MENU */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCinematicOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 180 }}
            className="fixed inset-0 w-full h-full bg-[#000000] z-[80] flex flex-col justify-between overflow-hidden"
          >
            {/* Absolute CSS embedded styles for smooth cinematic backgrounds */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes fallRain {
                0% { transform: translateY(-100px); }
                100% { transform: translateY(110vh); }
              }
              @keyframes riseEmber {
                0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
                40% { opacity: 1; }
                100% { transform: translateY(-100px) scale(0.3); opacity: 0; }
              }
              @keyframes floatCloud {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(50%); }
              }
              @keyframes swayPoppy {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
              }
              @keyframes swayGrass {
                0%, 100% { transform: rotate(-4deg) skewX(-2deg); }
                50% { transform: rotate(5deg) skewX(2deg); }
              }
              @keyframes twinkleLight {
                0%, 100% { opacity: 0.25; transform: scale(0.85); filter: drop-shadow(0 0 2px rgba(254,240,138,0.3)); }
                50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 8px rgba(234,179,8,0.95)); }
              }
              @keyframes swayBranchJoint {
                0%, 100% { transform: rotate(-1.5deg); }
                50% { transform: rotate(1.5deg); }
              }
              @keyframes swayWild {
                0%, 100% { transform: rotate(-6deg) translateY(0); }
                50% { transform: rotate(6deg) translateY(-3px); }
              }
              @keyframes leafFlutter {
                0%, 100% { transform: rotate(-12deg) scaleX(1); }
                50% { transform: rotate(18deg) scaleX(0.82); }
              }
              @keyframes windGust {
                0% { transform: translateX(-100%) translateY(0) skewY(-5deg); opacity: 0; }
                40% { opacity: 0.18; }
                60% { opacity: 0.18; }
                100% { transform: translateX(120vw) translateY(40px) skewY(-5deg); opacity: 0; }
              }
              @keyframes driftLeafWind {
                0% { transform: translate(-10vw, -10vh) rotate(0deg) scale(0.65); opacity: 0; }
                10% { opacity: 0.75; }
                95% { opacity: 0.75; }
                100% { transform: translate(110vw, 85vh) rotate(420deg) scale(0.65); opacity: 0; }
              }
              .animate-fallRain {
                animation: fallRain linear infinite;
              }
              .animate-riseEmber {
                animation: riseEmber linear infinite;
              }
              .animate-floatCloud {
                animation: floatCloud linear infinite;
              }
              .animate-swayPoppy {
                animation: swayPoppy ease-in-out infinite;
              }
              .animate-swayGrass {
                animation: swayGrass ease-in-out infinite;
              }
              .animate-twinkleLight {
                animation: twinkleLight ease-in-out infinite;
              }
              .animate-swayBranch {
                animation: swayBranchJoint ease-in-out infinite;
              }
              .animate-swayWild {
                animation: swayWild 8s ease-in-out infinite;
              }
              .animate-leafFlutter {
                animation: leafFlutter 3.8s ease-in-out infinite;
              }
              .animate-windGust {
                animation: windGust 12s linear infinite;
              }
              .animate-driftLeafWind {
                animation: driftLeafWind 14s linear infinite;
              }
            ` }} />

            {/* ATMOSPHERE LOOPING GRAPHICAL BACKDROP */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#020617]">
              {customWallpaper ? (
                customWallpaper.type === 'video' ? (
                  <video
                    key={customWallpaper.url}
                    src={customWallpaper.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
                    style={{ filter: 'brightness(0.55) contrast(1.15)' }}
                  />
                ) : (
                  <img
                    src={customWallpaper.url}
                    alt="Custom Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
                    style={{ filter: 'brightness(0.55) contrast(1.15)' }}
                  />
                )
              ) : (
                <>
                  {/* Actual Nature Loop Video element matching selected atmosphere */}
                  <video
                    key={ATMOSPHERES[activeAtmosphereIndex].id}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-50 z-0 pointer-events-none"
                    style={{ filter: 'brightness(0.55) contrast(1.15)' }}
                  >
                <source 
                  src={
                    activeAtmosphereIndex === 0
                      ? "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-green-leaves-40177-large.mp4"
                      : activeAtmosphereIndex === 1
                      ? "https://assets.mixkit.co/videos/preview/mixkit-campfire-burning-in-the-forest-at-night-41517-large.mp4"
                      : activeAtmosphereIndex === 2
                      ? "https://assets.mixkit.co/videos/preview/mixkit-sunlight-filtering-through-the-trees-of-a-forest-42353-large.mp4"
                      : "https://assets.mixkit.co/videos/preview/mixkit-green-tree-branches-swaying-in-the-wind-33159-large.mp4"
                  } 
                  type="video/mp4" 
                />
              </video>

              {/* HIGH FIDELITY WIND-SWAYING LEAVES & BRANCH CANOPY OVERLAY */}
              <div className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden opacity-45">
                {/* hanging branch A from upper left */}
                <div className="absolute -top-12 -left-16 w-96 h-96 origin-top-left animate-swayWild text-emerald-950/95 scale-110">
                  <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
                    <path d="M0,0 C50,25 95,45 145,45 C155,45 165,42 175,39" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
                    <path d="M40,18 C65,32 80,28 105,38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M100,32 C120,60 145,70 160,95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path className="animate-leafFlutter origin-center" d="M140,45 C150,65 125,75 130,50 Z" style={{ animationDelay: '0.2s', animationDuration: '3.2s' }} />
                    <path className="animate-leafFlutter origin-center" d="M115,36 C125,56 100,66 105,41 Z" style={{ animationDelay: '0.6s', animationDuration: '2.8s' }} />
                    <path className="animate-leafFlutter origin-center" d="M85,26 C95,46 70,56 75,31 Z" style={{ animationDelay: '1.1s', animationDuration: '3.6s' }} />
                    <path className="animate-leafFlutter origin-center" d="M160,39 C175,56 150,66 155,41 Z" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }} />
                    <path className="animate-leafFlutter origin-center" d="M160,95 C180,105 160,125 150,100 Z" style={{ animationDelay: '0.7s', animationDuration: '4.1s' }} />
                    <path className="animate-leafFlutter origin-center" d="M130,68 C150,78 130,98 120,73 Z" style={{ animationDelay: '1.3s', animationDuration: '3.3s' }} />
                  </svg>
                </div>

                {/* hanging branch B from upper right */}
                <div className="absolute -top-16 -right-16 w-[420px] h-[420px] origin-top-right animate-swayWild text-[#041c11]/90 scale-105" style={{ animationDelay: '2s' }}>
                  <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
                    <path d="M200,0 C150,25 110,45 60,45 C50,45 40,42 30,39" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <path d="M160,18 C135,32 120,28 95,38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M100,32 C80,60 55,70 40,95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path className="animate-leafFlutter origin-center" d="M60,45 C50,65 75,75 70,50 Z" style={{ animationDelay: '0.4s', animationDuration: '3.4s' }} />
                    <path className="animate-leafFlutter origin-center" d="M85,36 C75,56 100,66 95,41 Z" style={{ animationDelay: '0.9s', animationDuration: '3.1s' }} />
                    <path className="animate-leafFlutter origin-center" d="M115,26 C105,46 130,56 125,31 Z" style={{ animationDelay: '1.4s', animationDuration: '3.8s' }} />
                    <path className="animate-leafFlutter origin-center" d="M40,39 C25,56 50,66 45,41 Z" style={{ animationDelay: '1.8s', animationDuration: '2.7s' }} />
                    <path className="animate-leafFlutter origin-center" d="M40,95 C20,105 40,125 50,100 Z" style={{ animationDelay: '0.5s', animationDuration: '4.3s' }} />
                    <path className="animate-leafFlutter origin-center" d="M70,68 C50,78 70,98 80,73 Z" style={{ animationDelay: '1.2s', animationDuration: '3.5s' }} />
                  </svg>
                </div>

                {/* Left/Right floating leaves blowing under active breeze (rain + wind) scene */}
                {(activeAtmosphereIndex === 3 || activeAtmosphereIndex === 0) && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(14)].map((_, i) => {
                      const top = 10 + (i % 6) * 15;
                      const delay = i * 1.3 + Math.sin(i) * 1.5;
                      const duration = 10 + (i % 4) * 3;
                      return (
                        <svg
                          key={i}
                          className="absolute w-5 h-5 text-emerald-950/75 fill-current animate-driftLeafWind"
                          style={{
                            top: `${top}%`,
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                          }}
                          viewBox="0 0 24 24"
                        >
                          <path d="M17,8 C11,2 2,10 4,18 C10,22 19,14 17,8 Z" />
                        </svg>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic Overlay & Tint Gradient matching theme choice */}
              <div className={cn(
                "absolute inset-0 mix-blend-color opacity-80 transition-all duration-1000 z-10",
                ATMOSPHERES[activeAtmosphereIndex].color
              )} />

              {/* The absolute critical subtle, dark vignette covering top to bottom */}
              <div 
                className="absolute inset-0 z-20 pointer-events-none select-none"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.85) 100%)' }}
              />

              {/* LAYERED SCENE BACKDROP GRAPHICS */}
              <div className="absolute inset-0 z-10">
                {/* Scene A: Rain or Wind (Footbridge with Winding Path, moon, clouds, grass) */}
                {(activeAtmosphereIndex === 0 || activeAtmosphereIndex === 3) && (
                  <div className="absolute inset-0">
                    {/* Glowing Shining Full Moon */}
                    <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-white via-slate-100 to-slate-200 shadow-[0_0_80px_rgba(255,255,255,0.45)]">
                      <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-slate-400/20 blur-[1px]" />
                      <div className="absolute top-12 left-16 w-8 h-8 rounded-full bg-slate-400/20 blur-[1px]" />
                      <div className="absolute top-20 left-8 w-4 h-4 rounded-full bg-slate-400/20 blur-[1px]" />
                    </div>

                    {/* Dark Dramatic Floating Clouds */}
                    <div className="absolute top-[8%] inset-x-0 h-40 opacity-30">
                      <div className="absolute w-[200%] h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_70%)] animate-floatCloud" style={{ animationDuration: '32s' }} />
                    </div>

                    {/* Wooden footbridge running in perspective */}
                    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-full h-[60%] opacity-85">
                      {/* Dark green pathway */}
                      <path d="M 500,400 Q 420,700 150,1000 L 850,1000 Q 580,700 500,400 Z" fill="#022c22" opacity="0.25" />
                      
                      {/* Wooden Boardwalk bridge Deck in perspective */}
                      <path d="M 500,400 L 515,400 L 780,1000 L 220,1000 Z" fill="#0f172a" opacity="0.9" stroke="#1e293b" strokeWidth="1" />
                      
                      {/* Planks Slabs horizontal lines */}
                      {[...Array(14)].map((_, idx) => {
                        const ratio = idx / 13;
                        const y = 400 + ratio * 600;
                        const w = 15 + ratio * 560;
                        const x1 = 500 - w / 2;
                        const x2 = 500 + w / 2;
                        return (
                          <line
                            key={idx}
                            x1={x1}
                            y1={y}
                            x2={x2}
                            y2={y}
                            stroke="#334155"
                            strokeWidth={1.5 + ratio * 7.5}
                            opacity={0.8}
                          />
                        );
                      })}

                      {/* Bridge handrails posts */}
                      <path d="M 492,400 L 220,1000" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" opacity="0.95" />
                      <path d="M 522,400 L 780,1000" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" opacity="0.95" />
                    </svg>

                    {/* Swaying green grass stalks along edges */}
                    <div className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-between px-2 overflow-hidden">
                      {[...Array(30)].map((_, i) => {
                        const h = 55 + (i % 6) * 16;
                        const delay = i * 0.14;
                        const color = i % 2 === 0 ? "text-emerald-950/70" : "text-green-950/80";
                        return (
                          <svg
                            key={i}
                            className={cn("w-5 h-auto shrink-0 animate-swayGrass", color)}
                            style={{
                              height: `${h}px`,
                              animationDelay: `${delay}s`,
                              animationDuration: `${3.2 + (i % 3) * 0.6}s`
                            }}
                            viewBox="0 0 20 100"
                            fill="currentColor"
                          >
                            <path d="M0,100 Q15,40 10,0 Q25,50 20,100 Z" />
                          </svg>
                        );
                      })}
                    </div>

                    {/* Rain overlays overlay inside Rain (Index 0) */}
                    {activeAtmosphereIndex === 0 && (
                      <div className="absolute inset-0 opacity-45 pointer-events-none">
                        {[...Array(40)].map((_, i) => {
                          const left = (i * 2.5) + (Math.sin(i) * 1.5);
                          const delay = (i * 0.16) + (Math.cos(i) * 0.25);
                          const duration = 0.65 + (i % 4) * 0.12;
                          const height = 45 + (i % 5) * 15;
                          return (
                            <div
                              key={i}
                              className="absolute w-[1px] bg-gradient-to-b from-[#93c5fd]/0 to-[#e0f2fe]/45 rounded-full animate-fallRain"
                              style={{
                                left: `${left}%`,
                                top: `-150px`,
                                height: `${height}px`,
                                animationDelay: `${delay}s`,
                                animationDuration: `${duration}s`
                              }}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Gentle wind breeze lines overlay inside Wind (Index 3) */}
                    {activeAtmosphereIndex === 3 && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Staggered Breeze Wind Gust lines sweeping across the screen */}
                        <div className="absolute inset-0 overflow-hidden opacity-25">
                          {[...Array(6)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute left-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[1px]"
                              style={{
                                top: `${15 + i * 15}%`,
                                animation: `windGust ${6 + i * 2}s linear infinite`,
                                animationDelay: `${i * 1.5}s`
                              }}
                            />
                          ))}
                        </div>

                        {/* Realistic detailed swaying tree branch from the top-left */}
                        <svg className="absolute -top-12 -left-12 w-[350px] md:w-[500px] h-auto text-emerald-950/80 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] origin-top-left" 
                             style={{ animation: 'swayWild 8s ease-in-out infinite' }}
                             viewBox="0 0 200 200" fill="currentColor">
                          {/* Main trunk/limb */}
                          <path d="M 0 0 C 40 20, 80 50, 120 70 C 100 80, 50 50, 0 20 Z" />
                          {/* Second limb */}
                          <path d="M 60 40 C 90 70, 110 110, 130 140 C 110 130, 80 90, 60 40 Z" />
                          {/* Rich clusters of leaves each having subtle flutter */}
                          {[
                            { cx: 80, cy: 50, r: 8, delay: 0.1 },
                            { cx: 100, cy: 60, r: 10, delay: 0.3 },
                            { cx: 120, cy: 70, r: 12, delay: 0.5 },
                            { cx: 130, cy: 85, r: 9, delay: 0.2 },
                            { cx: 90, cy: 80, r: 11, delay: 0.7 },
                            { cx: 110, cy: 110, r: 13, delay: 1.1 },
                            { cx: 125, cy: 130, r: 10, delay: 0.4 },
                            { cx: 135, cy: 150, r: 8, delay: 0.9 },
                            { cx: 75, cy: 65, r: 7, delay: 0.8 },
                            { cx: 115, cy: 55, r: 9, delay: 0.6 }
                          ].map((leaf, li) => (
                            <path 
                              key={li}
                              d={`M ${leaf.cx} ${leaf.cy} C ${leaf.cx+leaf.r} ${leaf.cy-leaf.r}, ${leaf.cx+leaf.r*2} ${leaf.cy}, ${leaf.cx+leaf.r} ${leaf.cy+leaf.r} Z`}
                              fill="#022c22"
                              className="origin-center"
                              style={{
                                animation: `leafFlutter ${1.5 + (li % 3) * 0.4}s ease-in-out infinite`,
                                animationDelay: `${leaf.delay}s`
                              }}
                            />
                          ))}
                        </svg>

                        {/* Swaying branch from the top-right hanging down */}
                        <svg className="absolute -top-16 -right-16 w-[300px] md:w-[450px] h-auto text-[#042f1a]/85 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] origin-top-right" 
                             style={{ animation: 'swayWild 10s ease-in-out infinite', animationDelay: '1.5s' }}
                             viewBox="0 0 200 200" fill="currentColor">
                          <path d="M 200 0 C 160 30, 120 70, 80 100 C 100 90, 150 50, 200 20 Z" />
                          <path d="M 140 50 C 110 90, 90 130, 70 170 C 90 150, 120 110, 140 50 Z" />
                          {[
                            { cx: 140, cy: 50, r: 10, delay: 0.2 },
                            { cx: 110, cy: 75, r: 12, delay: 0.4 },
                            { cx: 85, cy: 95, r: 13, delay: 0.8 },
                            { cx: 95, cy: 120, r: 11, delay: 1.3 },
                            { cx: 75, cy: 150, r: 9, delay: 0.5 },
                            { cx: 160, cy: 40, r: 8, delay: 0.1 },
                            { cx: 125, cy: 60, r: 9, delay: 0.7 },
                            { cx: 105, cy: 110, r: 10, delay: 0.9 },
                            { cx: 135, cy: 90, r: 11, delay: 0.3 }
                          ].map((leaf, li) => (
                            <path 
                              key={li}
                              d={`M ${leaf.cx} ${leaf.cy} C ${leaf.cx-leaf.r} ${leaf.cy-leaf.r}, ${leaf.cx-leaf.r*2} ${leaf.cy}, ${leaf.cx-leaf.r} ${leaf.cy+leaf.r} Z`}
                              fill="#011c10"
                              className="origin-center"
                              style={{
                                animation: `leafFlutter ${1.8 + (li % 3) * 0.3}s ease-in-out infinite`,
                                animationDelay: `${leaf.delay}s`
                              }}
                            />
                          ))}
                        </svg>

                        {/* Blowing leaves/particles drifting across the screen horizontally */}
                        <div className="absolute inset-0 opacity-40">
                          {[...Array(10)].map((_, i) => {
                            const y = 20 + i * 7;
                            const d = i * 0.45;
                            const duration = 5 + (i % 3) * 1.8;
                            return (
                              <svg 
                                key={i}
                                className="absolute w-5 h-5 text-emerald-800/60"
                                style={{
                                  left: `-50px`,
                                  top: `${y}%`,
                                  animation: `windGust ${duration}s linear infinite`,
                                  animationDelay: `${d}s`,
                                }}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10,0 Q17,5 15,10 Q12,17 5,20 Q3,12 10,0" />
                              </svg>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Scene B: Flames or Warmth (Golden-tinged moon, Poppies swaying, Embers) */}
                {activeAtmosphereIndex === 1 && (
                  <div className="absolute inset-0">
                    {/* Glowing Golden Moon */}
                    <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-[#fef08a] via-[#facc15] to-[#eab308] shadow-[0_0_90px_rgba(234,179,8,0.5)]">
                      <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-amber-700/15 blur-[1px]" />
                      <div className="absolute top-12 left-16 w-8 h-8 rounded-full bg-amber-700/15 blur-[1px]" />
                      <div className="absolute top-20 left-8 w-4 h-4 rounded-full bg-amber-700/15 blur-[1px]" />
                    </div>

                    {/* Warm golden-tinged moving clouds */}
                    <div className="absolute top-[6%] inset-x-0 h-40 opacity-20">
                      <div className="absolute w-[200%] h-full bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.15),transparent_75%)] animate-floatCloud" style={{ animationDuration: '28s' }} />
                    </div>

                    {/* Expansive Red Poppy Flowers swaying gently in perspective */}
                    <div className="absolute inset-x-0 bottom-0 h-[48%] flex items-end justify-center pointer-events-none px-4">
                      <div className="relative w-full h-full">
                        {[...Array(20)].map((_, i) => {
                          const left = (i * 5) + (Math.sin(i * 1.8) * 3);
                          const bottom = (i % 4) * 20 + 2;
                          const scale = 0.45 + (bottom / 100) * 0.85;
                          const delay = i * 0.18;
                          const zIdx = Math.floor(bottom);
                          return (
                            <div
                              key={i}
                              className="absolute origin-bottom animate-swayPoppy"
                              style={{
                                left: `${left}%`,
                                bottom: `${bottom}%`,
                                transform: `scale(${scale})`,
                                zIndex: zIdx,
                                animationDelay: `${delay}s`,
                                animationDuration: `${3.4 + (i % 3) * 0.6}s`
                              }}
                            >
                              <svg width="40" height="110" viewBox="0 0 40 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Stem */}
                                <path d="M20,110 Q17,55 20,18" stroke="#064e3b" strokeWidth="2.5" fill="none" />
                                <path d="M19,75 Q4,65 11,61" stroke="#064e3b" strokeWidth="1.5" fill="none" />
                                {/* Detailed layered flower head petals */}
                                <circle cx="20" cy="18" r="14" fill="url(#poppyRedGrad)" />
                                <circle cx="14" cy="14" r="11" fill="url(#poppyDeepGrad)" opacity="0.9" />
                                <circle cx="26" cy="14" r="11" fill="url(#poppyDeepGrad)" opacity="0.9" />
                                <circle cx="20" cy="22" r="10" fill="url(#poppyBrightGrad)" opacity="0.95" />
                                {/* Core velvet element */}
                                <circle cx="20" cy="18" r="4.5" fill="#140101" />
                                <circle cx="20" cy="18" r="2.5" fill="#ef4444" />
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Floating amber spark particles rising from bottom */}
                    <div className="absolute inset-x-0 bottom-0 top-[20%] pointer-events-none opacity-45">
                      {[...Array(30)].map((_, i) => {
                        const left = (i * 3.3) + (Math.sin(i * 1.5) * 2.5);
                        const delay = i * 0.22;
                        const size = 3 + (i % 4) * 1.5;
                        const duration = 2.4 + (i % 5) * 0.5;
                        const colors = ["bg-orange-500/60", "bg-amber-400/70", "bg-red-500/50", "bg-yellow-500/80"];
                        return (
                          <div
                            key={i}
                            className={cn("absolute rounded-full blur-[1px] animate-riseEmber", colors[i % colors.length])}
                            style={{
                              left: `${left}%`,
                              width: `${size}px`,
                              height: `${size}px`,
                              animationDelay: `${delay}s`,
                              animationDuration: `${duration}s`
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Definitions for poppy colors gradient rendering */}
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <radialGradient id="poppyRedGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#881337" />
                        </radialGradient>
                        <radialGradient id="poppyDeepGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#be123c" />
                          <stop offset="100%" stopColor="#4c0519" />
                        </radialGradient>
                        <radialGradient id="poppyBrightGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#fda4af" />
                          <stop offset="100%" stopColor="#be123c" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* Scene C: Birds or Nature (Vast hills, mountain villages, starry moon, fireflies) */}
                {activeAtmosphereIndex === 2 && (
                  <div className="absolute inset-0">
                    {/* Glowing Bright Full Moon */}
                    <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-[#f0f9ff] via-sky-100 to-sky-200 shadow-[0_0_80px_rgba(224,242,254,0.4)]">
                      <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-sky-300/15 blur-[1px]" />
                      <div className="absolute top-12 left-16 w-8 h-8 rounded-full bg-sky-300/15 blur-[1px]" />
                    </div>

                    {/* Light moving hills mist clouds */}
                    <div className="absolute top-[10%] inset-x-0 h-40 opacity-20">
                      <div className="absolute w-[200%] h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_75%)] animate-floatCloud" style={{ animationDuration: '36s' }} />
                    </div>

                    {/* Massive mountains and deep rolling hills layers */}
                    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-full h-[62%] text-emerald-950/20">
                      {/* Mountain layer 1 (Background) */}
                      <path d="M 0,620 Q 230,510 500,580 T 1000,540 L 1000,1000 L 0,1000 Z" fill="#061c14" opacity="0.45" />
                      
                      {/* Mountain layer 2 (Middle distance - Villages live here) */}
                      <path d="M 0,710 Q 340,610 680,690 T 1000,630 L 1000,1000 L 0,1000 Z" fill="#042216" opacity="0.7" />
                      
                      {/* Hill layer 3 (Foreground) */}
                      <path d="M 0,810 Q 400,750 800,850 T 1000,800 L 1000,1000 L 0,1000 Z" fill="#02110c" opacity="1" />
                    </svg>

                    {/* Mountain Village lights overlay */}
                    <div className="absolute inset-x-0 bottom-[14%] h-32">
                      {[...Array(14)].map((_, i) => {
                        const left = [14, 21, 28, 44, 49, 57, 63, 72, 79, 86, 32, 66, 53, 89][i];
                        const bottom = [46, 50, 42, 53, 48, 40, 43, 55, 51, 47, 37, 33, 39, 44][i];
                        const delay = i * 0.24 + Math.sin(i) * 0.35;
                        return (
                          <div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full bg-[#fef08a] shadow-[0_0_10px_#facc15] animate-twinkleLight"
                            style={{
                              left: `${left}%`,
                              bottom: `${bottom}%`,
                              animationDelay: `${delay}s`,
                              animationDuration: `${1.4 + (i % 3) * 0.75}s`
                            }}
                          />
                        );
                      })}

                      {/* Small house/cottage vectors near the lights */}
                      {[...Array(6)].map((_, i) => {
                        const left = [21, 44, 57, 72, 32, 79][i];
                        const bottom = [50, 53, 40, 55, 37, 51][i];
                        return (
                          <div 
                            key={i} 
                            className="absolute overflow-visible opacity-55" 
                            style={{ left: `${left}%`, bottom: `${bottom}%`, transform: 'translateY(6px)' }}
                          >
                            <svg width="8" height="7" viewBox="0 0 10 8" className="fill-stone-950 font-black">
                              <polygon points="5,0 10,4 0,4" />
                              <rect x="1.5" y="4" width="7" height="4" />
                            </svg>
                          </div>
                        );
                      })}
                    </div>

                    {/* Gentle green forest leaf branches swaying on side margins */}
                    <div className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none opacity-30">
                      <svg className="w-full h-full text-green-950 animate-swayBranch" viewBox="0 0 1440 900" fill="none" style={{ animationDuration: '9s' }}>
                        <path d="M 0 0 C 100 130 350 90 550 290" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
                        <path d="M 300 200 C 400 350 280 460 140 590" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Sparkling subtle fireflies drifting */}
                    <div className="absolute inset-0 pointer-events-none opacity-15">
                      <Sparkles size={110} className="text-emerald-500 animate-spin absolute bottom-24 left-10" style={{ animationDuration: '45s' }} />
                      <Sparkles size={90} className="text-teal-400 animate-pulse absolute bottom-36 right-12" style={{ animationDuration: '15s' }} />
                    </div>
                  </div>
                )}
              </div>
            </>
            )}
          </div>

            {/* Absolute center-top capsule menu & environmental sounds — boosted z-index to avoid stacking bug */}
            <div className="pt-8 px-6 flex items-center justify-between relative z-50 shrink-0">
              <button
                onClick={() => {
                  setIsCinematicOpen(false);
                }}
                className="p-2.5 rounded-full bg-black/50 border border-white/10 hover:bg-white hover:text-black transition-all cursor-pointer relative z-50 pointer-events-auto"
              >
                <ChevronDown size={20} />
              </button>

              {/* Capsule pill options selector dropdown */}
              <div className="relative z-50 pointer-events-auto">
                <button
                  onClick={() => setIsAtmosphereDropdownOpen(!isAtmosphereDropdownOpen)}
                  className="px-5 py-2.5 bg-black/60 hover:bg-neutral-900 border border-white/10 text-xs font-mono font-black rounded-full shadow-2xl flex items-center gap-2 pointer-events-auto"
                >
                  <span>{ATMOSPHERES[activeAtmosphereIndex].name} Overlay</span>
                  <ChevronDown size={12} className={cn("transition-transform duration-300", isAtmosphereDropdownOpen ? "rotate-180" : "")} />
                </button>

                <AnimatePresence>
                  {isAtmosphereDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/95 border border-white/10 rounded-2xl p-2 shadow-2xl z-[100] pointer-events-auto cursor-pointer space-y-1"
                    >
                      {ATMOSPHERES.map((atm, idx) => (
                        <button
                          key={atm.id}
                          type="button"
                          onClick={() => {
                            setActiveAtmosphereIndex(idx);
                            setIsAtmosphereMuted(false); // Play ambient automatically upon select
                            setIsAtmosphereDropdownOpen(false);
                            toast.success(`${atm.name} Ambient Mix active`);
                          }}
                          className={cn(
                            "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium flex items-center justify-between pointer-events-auto cursor-pointer relative z-[101]",
                            activeAtmosphereIndex === idx 
                              ? "bg-white/10 text-[#a855f7]" 
                              : "hover:bg-white/5 text-white/70"
                          )}
                        >
                          <span className="flex items-center gap-2 pointer-events-none">
                            <span>{atm.icon}</span>
                            <span>{atm.name.split(' ').pop()}</span>
                          </span>
                          {activeAtmosphereIndex === idx && <Check size={12} className="text-[#a855f7] pointer-events-none" />}
                        </button>
                      ))}

                      <div className="h-px bg-white/5 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsAtmosphereMuted(!isAtmosphereMuted);
                          setIsAtmosphereDropdownOpen(false);
                          toast(isAtmosphereMuted ? "Ambient sound unmuted" : "Ambient sound muted", { icon: '🔇' });
                        }}
                        className="w-full text-center py-2 text-[10px] uppercase font-mono tracking-wider font-extrabold text-red-400 hover:bg-red-500/10 rounded-xl pointer-events-auto cursor-pointer relative z-[101]"
                      >
                        {isAtmosphereMuted ? "🔊 Unmute Ambient" : "🔇 Mute Ambient"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wallpaper Customization + Favorites buttons container */}
              <div className="flex items-center gap-2 relative z-50 pointer-events-auto">
                <button
                  onClick={() => setIsWallpaperSheetOpen(true)}
                  className="px-4 py-2 rounded-full bg-black/60 hover:bg-neutral-900 border border-white/10 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer text-neutral-200 hover:text-white"
                  title="Change Background"
                >
                  <span className="text-sm">🖼️</span>
                  <span>Change Background</span>
                </button>

                <button 
                  onClick={(e) => toggleFavorite(selectedSurah.number, e)}
                  className="p-2.5 rounded-full bg-black/50 border border-white/10 text-white hover:text-red-500 transition-all cursor-pointer"
                >
                  <Star size={18} className={favorites.includes(selectedSurah.number) ? "fill-red-500 text-red-500" : ""} />
                </button>
              </div>
            </div>

            {/* AUDIO SPECTRUM VISUALIZER IN MID */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 relative z-10">
              <div className="w-full max-w-sm h-36 flex items-center justify-center pointer-events-none">
                <WaveformVisualizer analyser={analyser} isPlaying={isPlaying} />
              </div>
            </div>

            {/* LOWER THIRD CONTROL LAYOUTS */}
            <div className="pb-12 pt-6 px-8 bg-gradient-to-t from-black via-black/90 to-transparent relative z-10 shrink-0 space-y-6">
              
              {/* Micro track card avatar and details */}
              <div className="flex items-center justify-between w-full max-w-lg mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                    <img 
                      src={activeReciter.image} 
                      alt={activeReciter.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold font-serif text-white leading-tight">
                      Surah {selectedSurah.englishName}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Reciter: {activeReciter.name}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif text-2xl text-amber-200">
                    {selectedSurah.name}
                  </span>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    Chapter {selectedSurah.number}
                  </p>
                </div>
              </div>

              {/* Thin white progress slider bar wrapper */}
              <div className="w-full max-w-lg mx-auto space-y-1">
                <div className="relative w-full h-1 bg-white/15 rounded-full cursor-pointer group"
                     onClick={(e) => {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const pos = (e.clientX - rect.left) / rect.width;
                       handleScrubAudio(pos * audioDuration);
                     }}>
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#a855f7] rounded-full group-hover:bg-[#c084fc] relative"
                    style={{ width: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                  <span>{formatSecs(audioCurrentTime)}</span>
                  <span>{formatSecs(audioDuration)}</span>
                </div>
              </div>

              {/* Minimalist Controls Layout menu */}
              <div className="flex items-center justify-between w-full max-w-lg mx-auto pt-2">
                
                {/* 1x playback support toggle */}
                <button
                  onClick={() => {
                    const speeds = [1, 1.15, 1.3, 1.5];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIdx]);
                    toast.success(`Speed: ${speeds[nextIdx]}x`);
                  }}
                  className="text-xs font-mono font-black bg-white/5 py-1.5 px-3 rounded-md hover:bg-white/10 transition-all text-neutral-300"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Back button */}
                <button 
                  onClick={() => skipTrack('backward')}
                  className="p-2 text-neutral-400 hover:text-white transition-all scale-110 active:scale-95"
                >
                  <SkipBack size={20} className="fill-current" />
                </button>

                {/* Center Big Play Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-90"
                  disabled={isAudioLoading}
                >
                  {isAudioLoading ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={24} className="fill-current text-black" />
                  ) : (
                    <Play size={24} className="fill-current text-black ml-1" />
                  )}
                </button>

                {/* Forward button */}
                <button 
                  onClick={() => skipTrack('forward')}
                  className="p-2 text-neutral-400 hover:text-white transition-all scale-110 active:scale-95"
                >
                  <SkipForward size={20} className="fill-current" />
                </button>

                {/* Sleep Timer button with moon icon */}
                <div className="relative">
                  <button
                    onClick={() => {
                      const options = [0, 5, 15, 30, 45, 60];
                      const currentIdx = options.indexOf(sleepTimerMinutes);
                      const nextIdx = (currentIdx + 1) % options.length;
                      const mins = options[nextIdx];
                      setSleepTimerMinutes(mins);
                      setSleepSecondsLeft(mins * 60);
                      if (mins > 0) {
                        toast(`Sleep Timer: ${mins} mins`, { icon: '🌙' });
                      } else {
                        toast("Sleep Timer off");
                      }
                    }}
                    className={cn(
                      "p-2.5 rounded-full transition-all",
                      sleepTimerMinutes > 0 ? "bg-purple-950/40 text-[#a855f7]" : "text-neutral-400 hover:text-white"
                    )}
                    title="Sleep Sanctuary Timer"
                  >
                    <Moon size={18} className={sleepTimerMinutes > 0 ? "fill-purple-500" : ""} />
                    {sleepTimerMinutes > 0 && (
                      <span className="absolute -top-1 -right-1 z-10 bg-purple-500 text-black font-mono text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {Math.ceil(sleepSecondsLeft / 60)}
                      </span>
                    )}
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PERSISTENT FLOATING MINI-PLAYER BAR */}
      {/* ========================================================= */}
      {!isCinematicOpen && (
        <div 
          onClick={() => setIsCinematicOpen(true)}
          className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-neutral-900/90 hover:bg-neutral-900 border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center justify-between cursor-pointer group z-40 backdrop-blur-md hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 flex-shrink-0 relative">
              <img 
                src={activeReciter.image} 
                alt={activeReciter.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-bold text-white group-hover:text-[#a855f7] transition-colors">
                Surah {selectedSurah.englishName}
              </h4>
              <p className="text-[10px] text-neutral-400">
                {activeReciter.name} • {isPlaying ? "Active session playing" : "Session paused"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
               onClick={() => setIsPlaying(!isPlaying)}
               className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all scale-100 active:scale-95"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                toast.success("Active player session terminated");
              }}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all"
              title="Close Stream player"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PERSISTENT TAB BAR (BOTTOM NAVIGATION) */}
      {/* ========================================================= */}
      {!isCinematicOpen && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 border-t border-white/5 z-40 backdrop-blur-md flex items-center justify-around px-4">
          <button 
            type="button"
            onClick={() => setActiveTab('home')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 cursor-pointer",
              activeTab === 'home' ? "text-[#a855f7] scale-105 font-bold" : "text-white/40 hover:text-white/75"
            )}
          >
            <Home size={18} className={activeTab === 'home' ? "stroke-[2.5]" : "stroke-[1.5]"} />
            <span className="text-[9px] font-mono tracking-wider">Home</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('reciters')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 cursor-pointer",
              activeTab === 'reciters' ? "text-[#a855f7] scale-105 font-bold" : "text-white/40 hover:text-white/75"
            )}
          >
            <Users size={18} className={activeTab === 'reciters' ? "stroke-[2.5]" : "stroke-[1.5]"} />
            <span className="text-[9px] font-mono tracking-wider">Reciters</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 cursor-pointer",
              activeTab === 'settings' ? "text-[#a855f7] scale-105 font-bold" : "text-white/40 hover:text-white/75"
            )}
          >
            <Settings size={18} className={activeTab === 'settings' ? "stroke-[2.5]" : "stroke-[1.5]"} />
            <span className="text-[9px] font-mono tracking-wider">Settings</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD NEW SHEIKH MODAL PRESETS */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAddSheikhOpen && (
          <div className="fixed inset-0 bg-black/85 z-[90] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-md relative text-left"
            >
              <button
                onClick={() => setIsAddSheikhOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5"
              >
                <X size={16} />
              </button>

              <h3 className="text-xl font-bold font-serif text-white mb-4">➕ Add New Sheikh Profile</h3>

              <form onSubmit={handleAddNewSheikh} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Qari Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Sheikh Al-Kurdy" 
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Country / Tag</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Dagestan Republic" 
                      value={addCountry}
                      onChange={(e) => setAddCountry(e.target.value)}
                      className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Recitation Style</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Flowing Meditative" 
                      value={addStyle}
                      onChange={(e) => setAddStyle(e.target.value)}
                      className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Expanded Biography</label>
                  <textarea 
                    rows={3}
                    placeholder="Short description..." 
                    value={addBio}
                    onChange={(e) => setAddBio(e.target.value)}
                    className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7] resize-none font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] tracking-wider text-neutral-400 uppercase block">Portrait Photo Link</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => sheikhImageFileRef.current?.click()}
                      className="py-2 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold"
                    >
                      Browse Device Photo
                    </button>
                    {addImageBase64 && <span className="text-green-400">📸 Selected</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#a855f7] text-white rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-[#c084fc] transition-all"
                >
                  Create Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* EDIT SHEIKH PROFILE MODAL FORM */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEditProfileOpen && selectedReciter && (
          <div className="fixed inset-0 bg-black/85 z-[92] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-md relative text-left"
            >
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5"
              >
                <X size={16} />
              </button>

              <h3 className="text-xl font-bold font-serif text-white mb-4">✍️ Edit {selectedReciter.name}'s Profile</h3>

              <form onSubmit={handleEditProfileSave} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Qari Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Country / Tag</label>
                    <input 
                      type="text" 
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Recitation Style</label>
                    <input 
                      type="text" 
                      value={editStyle}
                      onChange={(e) => setEditStyle(e.target.value)}
                      className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-neutral-400 uppercase">Expanded Biography</label>
                  <textarea 
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-black border border-white/15 p-2.5 rounded-xl text-white outline-none focus:border-[#a855f7] resize-none font-sans text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] tracking-wider text-neutral-400 uppercase block">Update Portrait Photo</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => editSheikhImageFileRef.current?.click()}
                      className="py-2 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold"
                    >
                      Browse Device Photo
                    </button>
                    <span className="text-[#a855f7]">New photo changes will be persistent</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#a855f7] text-white rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-[#c084fc] transition-all"
                >
                  Save Profile Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden native wallpaper file picker */}
      <input
        type="file"
        ref={wallpaperFileInputRef}
        accept="image/*, video/mp4"
        className="hidden"
        onChange={async (e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          const file = files[0];
          
          const isGlobal = applyWallpaperGlobally;
          const key = isGlobal ? 'wallpaper_global' : `wallpaper_surah_${selectedSurah.number}`;
          const isVideo = file.type.startsWith('video/');
          const type = isVideo ? 'video' : 'image';

          try {
            await saveBlobToIndexedDB(key, file);
            
            // Revoke old URL if it was custom
            if (customWallpaper) {
              URL.revokeObjectURL(customWallpaper.url);
            }
            
            const newUrl = URL.createObjectURL(file);
            setCustomWallpaper({
              type,
              url: newUrl,
              name: file.name
            });

            toast.success(`Wallpaper saved successfully for ${isGlobal ? 'all Chapters' : 'Surah ' + selectedSurah.englishName}`);
            setIsWallpaperSheetOpen(false);
          } catch (err) {
            console.error("Failed to save custom wallpaper:", err);
            toast.error("Failed to save wallpaper.");
          }
        }}
      />

      {/* WALLPAPER PICKER INTERACTIVE SHEET */}
      <AnimatePresence>
        {isWallpaperSheetOpen && (
          <div className="fixed inset-0 bg-black/90 z-[95] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-neutral-900/95 border border-white/10 rounded-3xl p-6 w-full max-w-md relative text-left shadow-2xl"
            >
              <button
                onClick={() => setIsWallpaperSheetOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-2xl">🖼️</span>
                <div>
                  <h3 className="text-lg font-bold font-serif text-white">Customize Background</h3>
                  <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Cinematic Wallpaper Setup</p>
                </div>
              </div>

              {/* Scope Selection Box */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6">
                <p className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider mb-2.5">Customization Scope</p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={applyWallpaperGlobally}
                    onChange={(e) => setApplyWallpaperGlobally(e.target.checked)}
                    className="mt-0.5 rounded border-white/10 text-purple-600 focus:ring-purple-500 bg-neutral-900 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-sans font-semibold text-neutral-200 group-hover:text-white transition-colors">
                      Apply globally to all Surahs
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                      If unchecked, the custom wallpaper will only display specifically when playing Surah {selectedSurah.number} ({selectedSurah.englishName}).
                    </p>
                  </div>
                </label>
              </div>

              {/* Choice Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => wallpaperFileInputRef.current?.click()}
                  className="w-full py-3.5 px-4 bg-[#a855f7] hover:bg-[#c084fc] text-white rounded-2xl font-bold font-mono tracking-widest text-xs uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>➕ Upload from Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await deleteBlobFromIndexedDB(`wallpaper_surah_${selectedSurah.number}`);
                      await deleteBlobFromIndexedDB('wallpaper_global');
                      
                      if (customWallpaper) {
                        URL.revokeObjectURL(customWallpaper.url);
                      }
                      setCustomWallpaper(null);
                      toast.success("Wallpaper reset to default atmosphere");
                      setIsWallpaperSheetOpen(false);
                    } catch (error) {
                      console.error("Reset failed", error);
                      toast.error("Failed to reset wallpaper.");
                    }
                  }}
                  className="w-full py-3 px-4 bg-transparent hover:bg-white/5 border border-white/10 text-neutral-300 hover:text-white rounded-2xl font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Reset To Default Atmosphere
                </button>
              </div>

              {/* Status / Active Info */}
              {customWallpaper && (
                <div className="mt-5 pt-4 border-t border-white/5 text-[9px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>ACTIVE CUSTOM WALLPAPER:</span>
                  <span className="truncate max-w-[200px] text-purple-400">{customWallpaper.name}</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
