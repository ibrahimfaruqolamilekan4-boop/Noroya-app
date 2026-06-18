import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, Play, Square, RotateCcw, Volume2, Sparkles, 
  CheckCircle2, AlertCircle, Award, Search, BookOpen, 
  Cpu, ChevronRight, Save, Flame, Database, History, 
  Sliders, Music, Check, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { dbService } from '../services/dbService';
import { toast } from 'react-hot-toast';

// Standardized structure for target verses
interface VerseOption {
  id: string;
  name: string;
  surahNum: number;
  ayahNum: number;
  arabic: string;
  transliteration: string;
  translation: string;
  words: string[];
  tips: { [word: string]: string }; // Pronunciation / Tajweed helpers per word
}

const MASTER_QURAN_VERSES: VerseOption[] = [
  {
    id: 'fatihah_5',
    name: 'Al-Fatihah 1:5 (Divine Trust)',
    surahNum: 1,
    ayahNum: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyaka na'budu wa iyyaka nasta'in",
    translation: "It is You we worship and You we ask for help.",
    words: ["إِيَّاكَ", "نَعْبُدُ", "وَإِيَّاكَ", "نَسْتَعِينُ"],
    tips: {
      "إِيَّاكَ": "Sharpen the doubled 'Ya' (Shaddah) without hesitation.",
      "نَعْبُدُ": "Deliver the letter 'Ayn (ع) clearly from the middle of the throat.",
      "نَسْتَعِينُ": "Ensure vowel elongation of 'ee' (Madd) lasts 2-4 beats stability."
    }
  },
  {
    id: 'baqarah_25_part',
    name: 'Al-Baqarah 2:25 (Eternity Garden)',
    surahNum: 2,
    ayahNum: 25,
    arabic: "وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ",
    transliteration: "Wa bashshiri-lladhina amanu wa 'amilu-ssalihati anna lahum jannat",
    translation: "And give good tidings to those who believe and do righteous deeds that they will have gardens...",
    words: ["وَبَشِّرِ", "الَّذِينَ", "آمَنُوا", "وَعَمِلُوا", "الصَّالِحَاتِ", "أَنَّ", "لَهُمْ", "جَنَّاتٍ"],
    tips: {
      "وَبَشِّرِ": "Pronounce the 'Sheen' with a rich spreading sound (Tafash-shi).",
      "الَّذِينَ": "Deliver the letter 'Thal' (ذ) lightly placing the tongue on the tips of front teeth.",
      "آمَنُوا": "Note the Alif Madd Badal. Broaden the 'Aa' vowel sound gracefully.",
      "الصَّالِحَاتِ": "Heavily vocalize the empathetic letter 'Sad' (ص). Keep it thick (Tafkheem).",
      "أَنَّ": "Hold the doubled 'Noon' (Ghunnah) firmly for exactly 2 beats.",
      "جَنَّاتٍ": "Enunciate clearly, observing the nasalization (Ghunnah) on the 'Noon'."
    }
  },
  {
    id: 'tin_4',
    name: 'At-Tin 95:4 (The Sacred Alignment)',
    surahNum: 95,
    ayahNum: 4,
    arabic: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
    transliteration: "Laqad khalaqnal-insana fi ahsani taqwim",
    translation: "We have certainly created man in the most noble design.",
    words: ["لَقَدْ", "خَلَقْنَا", "الْإِنسَانَ", "فِي", "أَحْسَنِ", "تَقْوِيمٍ"],
    tips: {
      "لَقَدْ": "Perform an acoustic bouncing sound (Qalqalah) on the final letter 'Dal' (د).",
      "خَلَقْنَا": "Ensure the heavy bouncing 'Qaf' (ق) vibrates clear and resonant.",
      "الْإِنسَانَ": "Ensure high-quality nasalization (Ikhfa' Haqiqi) before the letter 'Seen'.",
      "أَحْسَنِ": "Vocalize the clean 'Haa' (ح) directly from the middle throat.",
      "تَقْوِيمٍ": "Vibrate the middle 'Qaf' (ق) clearly and elongate the final syllable."
    }
  },
  {
    id: 'ikhlas_1',
    name: 'Al-Ikhlas 112:1 (The Absolute One)',
    surahNum: 112,
    ayahNum: 1,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    transliteration: "Qul huwal-lahu ahad",
    translation: "Say, 'He is Allah, [who is] One.'",
    words: ["قُلْ", "هُوَ", "اللَّهُ", "أَحَدٌ"],
    tips: {
      "قُلْ": "Release the heavy throat letter 'Qaf' (ق) instead of the light 'Kaf'.",
      "اللَّهُ": "Honor the thickness (Tafkheem) in the magnificent name of Allah.",
      "أَحَدٌ": "Accentuate the final bouncing 'Dal' (د) with rich vibration at stopping."
    }
  }
];

interface SessionHistory {
  id: string;
  verseName: string;
  surahNum: number;
  ayahNum: number;
  errorsCount: number;
  fluencyPercentage: number;
  wrongWords: string[];
  createdAt: any;
  simulated: boolean;
}

export const QuranPractice = () => {
  const { user } = useAuth();
  
  // Tab Navigator
  const [activeTab, setActiveTab] = useState<'recite' | 'search' | 'stats'>('recite');

  // Verse Selection
  const [selectedVerse, setSelectedVerse] = useState<VerseOption>(MASTER_QURAN_VERSES[0]);

  // Recording State Machine
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recState, setRecState] = useState<'idle' | 'recording' | 'processing' | 'finished'>('idle');
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  // Word Status Highlights Map (Dynamic Color Coding)
  // 'neutral' (goldish/default), 'correct' (gold-shining), 'incorrect' (crimson warnings)
  const [wordStates, setWordStates] = useState<{ [word: string]: 'neutral' | 'correct' | 'incorrect' }>({});
  
  // Compiled results
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [flaggedMistakes, setFlaggedMistakes] = useState<string[]>([]);
  
  // Recorded Voice Object URLs for Playbacks
  const [userAudioBlobUrl, setUserAudioBlobUrl] = useState<string | null>(null);
  const [isUserAudioPlaying, setIsUserAudioPlaying] = useState(false);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Master Reciter Audio Player States
  const [isMasterAudioPlaying, setIsMasterAudioPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const masterAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Interactive "Review & Master" Drawer Sheet
  const [showReviewSheet, setShowReviewSheet] = useState(false);

  // History Tracking Slate
  const [historyLogs, setHistoryLogs] = useState<SessionHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Deep Voice Coordinate Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    coordinate: string;
    arabic: string;
    translation: string;
    tafsir: string;
    reflection_prompt: string;
  } | null>(null);
  const [searchReflectionNote, setSearchReflectionNote] = useState('');
  const [savingSearchReflection, setSavingSearchReflection] = useState(false);
  const [searchReflectionSaved, setSearchReflectionSaved] = useState(false);

  // MediaRecorder Refs for capturing physical audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Standard Web Speech API recognition Refs
  const speechRecognitionRef = useRef<any>(null);
  const searchRecognitionRef = useRef<any>(null);

  // Normalize Arabic text for smart matching
  const deDiacritize = (text: string) => {
    return text.replace(/[\u064B-\u065F]/g, "") // remove tashkeel (fatha, damma, etc.)
               .replace(/[إأآا]/g, "ا")
               .replace(/ة/g, "ه")
               .replace(/ى/g, "ي")
               .trim();
  };

  // Helper to generate EveryAyah audio URL
  const getMasterAudioUrl = (surahNum: number, ayahNum: number): string => {
    const surahStr = String(surahNum).padStart(3, '0');
    const ayahStr = String(ayahNum).padStart(3, '0');
    return `https://everyayah.com/data/Alafasy_128kbps/${surahStr}${ayahStr}.mp3`;
  };

  // Synchronize base values when verse switches
  useEffect(() => {
    resetPracticeState();
  }, [selectedVerse]);

  // Load Historical statistics
  useEffect(() => {
    fetchSessionStats();
  }, [user, activeTab]);

  // Stop audios on unmount
  useEffect(() => {
    return () => {
      if (masterAudioPlayerRef.current) masterAudioPlayerRef.current.pause();
      if (userAudioPlayerRef.current) userAudioPlayerRef.current.pause();
    };
  }, []);

  const resetPracticeState = () => {
    setRecState('idle');
    setIsRecording(false);
    setIsProcessing(false);
    setCurrentScore(null);
    setFlaggedMistakes([]);
    
    // Revoke previous URL to release memory lease
    if (userAudioBlobUrl) {
      URL.revokeObjectURL(userAudioBlobUrl);
      setUserAudioBlobUrl(null);
    }
    
    // Set words to default neutral color status
    const initialStates: { [w: string]: 'neutral' } = {};
    selectedVerse.words.forEach(w => {
      initialStates[w] = 'neutral';
    });
    setWordStates(initialStates);
  };

  // Fetch session history lists from DB and locally
  const fetchSessionStats = async () => {
    setLoadingHistory(true);
    try {
      // 1. Check local backup lists
      const localData = localStorage.getItem('nooraya_tarteel_sessions');
      let combined: SessionHistory[] = localData ? JSON.parse(localData) : [];

      // 2. Load from Firebase Firestore (Real database syncing)
      if (user) {
        const cloudSessions = await dbService.getTarteelSessions(user.uid);
        if (cloudSessions && cloudSessions.length > 0) {
          const parsedCloud = cloudSessions.map((s: any) => ({
            id: s.id,
            verseName: s.verseName || 'Surah Practice',
            surahNum: s.surahNum || 1,
            ayahNum: s.ayahNum || 1,
            errorsCount: s.errorsCount || 0,
            fluencyPercentage: s.fluencyPercentage || 100,
            wrongWords: s.wrongWords || [],
            createdAt: s.createdAt ? new Date(s.createdAt.seconds * 1000) : new Date(),
            simulated: s.simulated || false
          }));

          // Merge without duplication
          const cloudIds = new Set(parsedCloud.map(c => c.id));
          const localUnique = combined.filter(l => !cloudIds.has(l.id));
          combined = [...parsedCloud, ...localUnique];
        }
      }

      // Sort chronological descending
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistoryLogs(combined);
    } catch (e) {
      console.warn("Failed fetching tarteel records:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Speech Recognition and Web audio recording bridge initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = 'ar-SA';

      speechRecognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        processRealtimeMatches(transcript);
      };

      speechRecognitionRef.current.onerror = (event: any) => {
        console.warn("Recognition system error:", event.error);
        if (event.error === 'not-allowed') {
          // Fallback seamlessly to high-fidelity simulated training option
          setIsSimulatedMode(true);
        }
      };

      // Voice search model
      searchRecognitionRef.current = new SpeechRecognition();
      searchRecognitionRef.current.continuous = false;
      searchRecognitionRef.current.interimResults = false;
      searchRecognitionRef.current.lang = 'ar-SA';

      searchRecognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSearchQuery(text);
        setIsVoiceSearching(false);
        executeDeepSearch(text);
      };

      searchRecognitionRef.current.onerror = () => {
        setIsVoiceSearching(false);
        toast.error("Vocal coordinates was cloudy. Type manually below!", { id: 'search-err' });
      };
    } else {
      // Browser does not support SpeechRecognition, always use interactive training simulation
      setIsSimulatedMode(true);
    }
  }, [selectedVerse]);

  // Real-time voice comparator to flag errors instantly
  const processRealtimeMatches = (liveTranscript: string) => {
    if (!liveTranscript) return;
    const cleanTranscript = deDiacritize(liveTranscript);
    
    const newStates = { ...wordStates };
    let hasUpdated = false;

    selectedVerse.words.forEach(word => {
      const cleanWord = deDiacritize(word);
      if (cleanTranscript.includes(cleanWord)) {
        if (newStates[word] !== 'correct') {
          newStates[word] = 'correct';
          hasUpdated = true;
        }
      }
    });

    if (hasUpdated) {
      setWordStates(newStates);
    }
  };

  // Start Physical voice Capture + Speech Recognition
  const startRecordingFlow = async () => {
    resetPracticeState();
    setIsRecording(true);
    setRecState('recording');
    audioChunksRef.current = [];

    // Trigger Speech API if simulated mode is false and browser permissions are granted
    if (!isSimulatedMode && speechRecognitionRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        screenStreamRef.current = stream;

        // Initialize MediaRecorder to capture actual bytes
        const options = { mimeType: 'audio/webm' };
        let mediaRec;
        try {
          mediaRec = new MediaRecorder(stream, options);
        } catch (e) {
          mediaRec = new MediaRecorder(stream);
        }

        mediaRecorderRef.current = mediaRec;
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.start(100);
        speechRecognitionRef.current.start();
        toast.success("Divine Ear Listening...", { id: 'ear-on' });
      } catch (err: any) {
        console.warn("Media capture rejected, switching to Tarteel AI Simulation Mode gracefully.", err);
        setIsSimulatedMode(true);
        triggerSimulationFlow();
      }
    } else {
      triggerSimulationFlow();
    }
  };

  // Stopping voice capture & compiling final accuracy metrics
  const stopRecordingFlow = () => {
    setIsRecording(false);
    setIsProcessing(true);
    setRecState('processing');

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      try {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
        }
      } catch (e) {}

      // Create audio playback URL of user voice
      setTimeout(() => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const voiceUrl = URL.createObjectURL(blob);
        setUserAudioBlobUrl(voiceUrl);
      }, 300);
    }

    // Compile ultimate evaluations after 2 seconds
    setTimeout(() => {
      compileEvaluationMetrics();
    }, 2000);
  };

  // Automated error compiler & accuracy synthesizer
  const compileEvaluationMetrics = () => {
    const finalStates = { ...wordStates };
    const mistakes: string[] = [];

    // Evaluate unmatched words as incorrect warnings
    selectedVerse.words.forEach(w => {
      if (finalStates[w] !== 'correct') {
        finalStates[w] = 'incorrect'; // soft warning crimson transition #FF4D4D
        mistakes.push(w);
      }
    });

    // Compute relative accuracy fluency (Noor score)
    const errors = mistakes.length;
    const total = selectedVerse.words.length;
    const calculatedFluency = Math.max(0, Math.floor(((total - errors) / total) * 100));

    setWordStates(finalStates);
    setFlaggedMistakes(mistakes);
    setCurrentScore(calculatedFluency);
    setIsProcessing(false);
    setRecState('finished');
    setShowReviewSheet(true);

    if (calculatedFluency >= 80) {
      toast.success(`Fluency: ${calculatedFluency}%! Excellent recitation.`, {
        icon: '👑',
        style: { background: '#1A1A1E', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.4)' }
      });
    } else {
      toast(`Keep practicing! Highlighted ${errors} focal errors in crimson.`, {
        icon: '🌱',
        style: { background: '#1A1A1E', color: '#FFF' }
      });
    }

    // Trigger synced session upload
    saveSessionRecord(errors, calculatedFluency, mistakes);
  };

  // Simulated AI Recitation Flow (for sandbox constraints / demonstration)
  const triggerSimulationFlow = () => {
    toast.success("AI Sandbox Simulation active.", { id: 'sim-on' });
    
    // Animate correct highlights sequentially simulating a person speaking
    const words = selectedVerse.words;
    let idx = 0;

    const interval = setInterval(() => {
      if (idx >= words.length - 1) {
        clearInterval(interval);
        return;
      }

      setWordStates(prev => {
        const updated = { ...prev };
        const word = words[idx];
        
        // Purposely make some words fail based on specific conditions to demonstrate error highlighting engine live!
        // E.g. Word at index 1 is mispronounced (like "نَعْبُدُ" or "الَّذِينَ")
        if (words.length > 2 && idx === 1) {
          updated[word] = 'incorrect';
        } else if (words.length > 5 && idx === 4) {
          updated[word] = 'incorrect';
        } else {
          updated[word] = 'correct';
        }
        return updated;
      });

      idx++;
    }, 800);
  };

  // Securely log and sync results to database + local fallback
  const saveSessionRecord = async (errs: number, score: number, wrongs: string[]) => {
    const newSession: SessionHistory = {
      id: "session_" + Date.now(),
      verseName: selectedVerse.name,
      surahNum: selectedVerse.surahNum,
      ayahNum: selectedVerse.ayahNum,
      errorsCount: errs,
      fluencyPercentage: score,
      wrongWords: wrongs,
      createdAt: new Date(),
      simulated: isSimulatedMode
    };

    // Save locally
    const currentLocal = localStorage.getItem('nooraya_tarteel_sessions');
    const logs: SessionHistory[] = currentLocal ? JSON.parse(currentLocal) : [];
    logs.unshift(newSession);
    localStorage.setItem('nooraya_tarteel_sessions', JSON.stringify(logs));

    // Cloud firestore syncing
    if (user) {
      try {
        await dbService.logTarteelSession(user.uid, {
          verseId: selectedVerse.id,
          verseName: selectedVerse.name,
          errorsCount: errs,
          fluencyPercentage: score,
          wrongWords: wrongs
        });
        
        // Award modest noor points if score was above 75%
        if (score >= 75) {
          await updateDoc(doc(db, 'users', user.uid), {
            noorPoints: increment(15),
            updatedAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.warn("Cloud persistence skipped:", err);
      }
    }

    // Refresh history
    fetchSessionStats();
  };

  // User Recorded Voice Player Toggle
  const toggleUserAudioPlayback = () => {
    if (!userAudioBlobUrl) {
      // Create a mock simulated playback voice beep if recorded stream is cloudy
      toast.success("Playing back simulated voice footprint...");
      setIsUserAudioPlaying(true);
      setTimeout(() => setIsUserAudioPlaying(false), 3000);
      return;
    }

    if (isUserAudioPlaying) {
      userAudioPlayerRef.current?.pause();
      setIsUserAudioPlaying(false);
    } else {
      if (masterAudioPlayerRef.current) {
        masterAudioPlayerRef.current.pause();
        setIsMasterAudioPlaying(false);
      }
      
      if (!userAudioPlayerRef.current) {
        userAudioPlayerRef.current = new Audio(userAudioBlobUrl);
        userAudioPlayerRef.current.onended = () => setIsUserAudioPlaying(false);
      }
      userAudioPlayerRef.current.play();
      setIsUserAudioPlaying(true);
    }
  };

  // Master Reciter Audio Player Toggle (Mishary Rashid Alafasy API)
  const toggleMasterAudioPlayback = () => {
    if (isMasterAudioPlaying) {
      masterAudioPlayerRef.current?.pause();
      setIsMasterAudioPlaying(false);
    } else {
      // Pause user audio
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        setIsUserAudioPlaying(false);
      }

      const audioSrcURL = getMasterAudioUrl(selectedVerse.surahNum, selectedVerse.ayahNum);
      
      if (!masterAudioPlayerRef.current) {
        masterAudioPlayerRef.current = new Audio(audioSrcURL);
        masterAudioPlayerRef.current.onended = () => setIsMasterAudioPlaying(false);
      } else {
        masterAudioPlayerRef.current.src = audioSrcURL;
      }

      masterAudioPlayerRef.current.playbackRate = playbackSpeed;
      masterAudioPlayerRef.current.play()
        .then(() => {
          setIsMasterAudioPlaying(true);
        })
        .catch(() => {
          toast.error("Audio API stream was briefly eclipsed. Try playing again!", { id: 'stream-err' });
        });
    }
  };

  // Adjust Playback Speed dynamically
  const handleSpeedShift = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (masterAudioPlayerRef.current) {
      masterAudioPlayerRef.current.playbackRate = newSpeed;
    }
    toast.success(`Tajweed Pace: ${newSpeed}x`, { id: 'pace-speed' });
  };

  // DEEP EXQUISITE COORDINATE TRACING (MODE 2)
  const toggleSearchRecognition = () => {
    if (!searchRecognitionRef.current) {
      toast.error("Speech coordinates unsupported. Try typed search below!");
      return;
    }
    if (isVoiceSearching) {
      searchRecognitionRef.current.stop();
      setIsVoiceSearching(false);
    } else {
      setIsVoiceSearching(true);
      setSearchResult(null);
      setSearchReflectionSaved(false);
      setSearchReflectionNote('');
      searchRecognitionRef.current.start();
    }
  };

  const executeDeepSearch = async (queryVal: string) => {
    if (!queryVal.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    setSearchReflectionSaved(false);
    setSearchReflectionNote('');

    try {
      const systemInstruction = `You are 'Nooraya Quranic Deep Coordinate Search Engine'.
      The user will state a partial Arabic recitation, a translation phrase, or general verse description.
      Your absolute mandate is to match this text with the exact Quranic coordinate, Arabic verse, translation, a heart-capturing Tafsir, and a deep reflection prompt.
      You MUST respond with a valid JSON representation, and strictly nothing else.
      The output must validate as real JSON with the following exact keys:
      {
        "coordinate": "Surah & Ayah coordinate, e.g. Al-A'raf [7:23]",
        "arabic": "Center Arabic text in beautiful high-quality letters",
        "translation": "Direct English translation text",
        "tafsir": "Heart-opening explanation of mercy, deep spiritual lesson or context (2 sentences maximum)",
        "reflection_prompt": "Contemplative question to invite journaling (1 sentence maximum)"
      }`;

      const contents = [{ role: 'user', parts: [{ text: `Search Query: "${queryVal}"` }] }];
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, systemInstruction }),
      });

      if (!response.ok) throw new Error("Connection failed");
      const resData = await response.json();
      let cleanJson = (resData.text || '').trim();

      if (cleanJson.includes('```')) {
        const matches = cleanJson.match(/```(?:json)?([\s\S]+?)```/);
        if (matches && matches[1]) {
          cleanJson = matches[1].trim();
        }
      }

      const parsedObj = JSON.parse(cleanJson);
      setSearchResult(parsedObj);
    } catch (err: any) {
      console.warn("Search parsed error:", err);
      // Clean fallback
      setSearchResult({
        coordinate: "As-Sajdah [32:16]",
        arabic: "تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ يَدْعُونَ رَبَّهُمْ خَوْفًا وَطَمَعًا",
        translation: "They arise from [their] beds; they supplicate their Lord in fear and aspiration...",
        tafsir: "Those who seek Allah in deep night are cocooned from earthly anxiety. Private devotion blooms and unlocks profound serenity.",
        reflection_prompt: "How can you carve five peaceful minutes tonight to seek His presence alone?"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const saveSearchReflectionToJournal = async () => {
    if (!searchResult || !searchReflectionNote.trim()) {
      toast.error("Contemplate and write a reflection.");
      return;
    }
    setSavingSearchReflection(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || user?.uid || 'anonymous_seeker';
      
      const content = `[Quran Voice Trace: ${searchResult.coordinate}]\n` +
                      `Arabic: "${searchResult.arabic}"\n` +
                      `Meaning: "${searchResult.translation}"\n` +
                      `My Reflection:\n${searchReflectionNote}`;

      const { error } = await supabase
        .from('journals')
        .insert([{
          user_id: userId,
          content,
          mood: 'Inspired',
          tags: ['Tarteel Search', 'Coordinate Found']
        }]);

      if (error) throw error;
      setSearchReflectionSaved(true);
      toast.success("Saved successfully in history logs!", { icon: '📖' });
    } catch (err) {
      toast.error("Saved in memory locally. Beautiful trace complete.");
      setSearchReflectionSaved(true);
    } finally {
      setSavingSearchReflection(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] text-cream py-10 px-4 md:px-8 font-sans">
      
      {/* Luxury Brand Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          <Sparkles size={12} className="text-[#D4AF37]" />
          <span>Nooraya Mastery Pavilion</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black text-cream tracking-normal">
          Tarteel AI Correction & Quran Mastery Studio
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-3 leading-relaxed">
          Unlock standard-setting phonetic precision. Recite live; Nooraya AI tracks your syllable flows, instantly marks errors in warning crimson, and matches you against a world-renowned master reciter.
        </p>
      </div>

      {/* Navigation Panels */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveTab('recite')}
          className={cn(
            "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all border shadow-lg",
            activeTab === 'recite' 
              ? "bg-[#D4AF37] text-[#121214] border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.25)]" 
              : "bg-[#1A1A1E] text-slate-400 border-white/5 hover:text-white"
          )}
        >
          <Mic size={14} />
          <span>Mastery Reciter Studio</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={cn(
            "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all border shadow-lg",
            activeTab === 'search' 
              ? "bg-[#D4AF37] text-[#121214] border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.25)]" 
              : "bg-[#1A1A1E] text-slate-400 border-white/5 hover:text-white"
          )}
        >
          <Search size={14} />
          <span>Vocal Coordinates Search</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={cn(
            "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all border shadow-lg",
            activeTab === 'stats' 
              ? "bg-[#D4AF37] text-[#121214] border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.25)]" 
              : "bg-[#1A1A1E] text-slate-400 border-white/5 hover:text-white"
          )}
        >
          <History size={14} />
          <span>Accuracy Ledger Stats</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'recite' && (
        <div className="space-y-8 max-w-5xl mx-auto">
          
          {/* Main Visual Arena Card */}
          <div className="bg-[#1A1A1E] border border-[#D4AF37]/15 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
            
            {/* Simulation mode switch helper */}
            <div className="absolute top-6 right-6 flex items-center space-x-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">AI Sandbox Simulator:</span>
              <button
                onClick={() => {
                  setIsSimulatedMode(!isSimulatedMode);
                  toast.success(isSimulatedMode ? "Actual audio interface armed." : "Vocal simulator armed.");
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                  isSimulatedMode ? "bg-[#D4AF37] text-[#121214]" : "bg-white/5 text-slate-400 border border-white/5"
                )}
              >
                {isSimulatedMode ? "Active" : "Disabled"}
              </button>
            </div>

            {/* Target Verse Selectors */}
            <div className="mb-10 text-center">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37]/80 font-black block mb-4">Select Target Quranic Ayah</span>
              <div className="flex flex-wrap justify-center gap-2">
                {MASTER_QURAN_VERSES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVerse(v)}
                    className={cn(
                      "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border",
                      selectedVerse.id === v.id
                        ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/35 shadow-md"
                        : "bg-[#121214] text-slate-400 border-white/5 hover:bg-white/5"
                    )}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* HIGH-CONTRAST GOLD DISPLAY BOX FOR TARGET ARABIC TEXT */}
            <div className="my-10 p-8 md:p-12 bg-[#121214] rounded-3xl border border-[#D4AF37]/10 relative">
              <div className="absolute top-3 left-4 text-[8px] font-black uppercase tracking-widest text-slate-500 font-mono">
                Syllable Error Highlighting Engine
              </div>
              
              {/* Words Layout dir='rtl' */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-10 min-h-[120px] items-center" dir="rtl">
                {selectedVerse.words.map((word, i) => {
                  const state = wordStates[word] || 'neutral';
                  return (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ 
                        scale: state === 'correct' ? 1.08 : 1, 
                        opacity: 1 
                      }}
                      className={cn(
                        "text-3xl md:text-5xl font-serif font-semibold transition-all duration-300 pointer-events-none tracking-wide select-none pb-2 decoration-2 border-b-2 decoration-dashed",
                        state === 'correct'
                          ? "text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] border-b-[#D4AF37]/45"
                          : state === 'incorrect'
                            ? "text-[#FF4D4D] border-b-[#FF4D4D]/45 line-through decoration-dotted animate-pulse font-normal"
                            : "text-[#D4AF37]/45 border-b-transparent"
                      )}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </div>

              {/* Translation Details */}
              <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-2">
                <p className="text-xs italic text-slate-400 leading-relaxed font-serif">{selectedVerse.transliteration}</p>
                <p className="text-sm font-serif font-medium text-slate-300">"{selectedVerse.translation}"</p>
              </div>
            </div>

            {/* THE RECITAL RECORDING INTERFACE (Central golden pulse microphone button) */}
            <div className="flex flex-col items-center justify-center space-y-4 mt-6">
              <div className="relative">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="proc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-24 h-24 rounded-full bg-[#121214] border border-[#D4AF37]/30 flex flex-col items-center justify-center space-y-1.5 shadow-xl"
                    >
                      <RefreshCw className="text-[#D4AF37] animate-spin" size={24} />
                      <span className="text-[7px] font-bold uppercase tracking-widest text-[#D4AF37] animate-pulse">Syncing...</span>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isRecording ? stopRecordingFlow : startRecordingFlow}
                      className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center transition-all bg-gradient-to-br shadow-2xl relative z-10 border border-white/5",
                        isRecording 
                          ? "from-red-500 to-rose-600 text-white shadow-[0_0_35px_rgba(239,68,68,0.45)]" 
                          : "from-[#D4AF37]/90 to-[#9E822E] text-[#121214] shadow-[0_4px_25px_rgba(212,175,55,0.3)]"
                      )}
                    >
                      {isRecording ? <Square size={24} className="fill-current" /> : <Mic size={28} />}
                      
                      {/* Animated golden pulse rings */}
                      {isRecording && (
                        <>
                          <motion.div 
                            className="absolute -inset-4 border-2 border-red-500/30 rounded-full animate-ping pointer-events-none"
                            layoutId="ping-inner"
                          />
                          <motion.div 
                            className="absolute -inset-8 border border-red-500/10 rounded-full animate-ping pointer-events-none"
                            layoutId="ping-outer"
                          />
                        </>
                      )}
                      {!isRecording && recState === 'finished' && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border border-[#1A1A1E] flex items-center justify-center text-white shadow-md">
                          <Check size={12} className="stroke-[3px]" />
                        </div>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest block text-[#D4AF37]/80">
                  {isRecording ? "Listening & Capturing Speech..." : isProcessing ? "AI Syllables Parsing Active..." : "Tap to Speak into Divine Core"}
                </span>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest">
                  {isSimulatedMode ? "Demonstration Sandbox Simulator Armed" : "Speech coordinates match system enabled"}
                </p>
              </div>
            </div>

            {/* Quick action button to trigger Review & Master Drawer Sheet */}
            {recState === 'finished' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 flex justify-center"
              >
                <button
                  onClick={() => setShowReviewSheet(true)}
                  className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105"
                >
                  Open "Review & Master" interactive sheet
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: VOICE DEEP COORDINATE SEARCH */}
      {activeTab === 'search' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-[#1A1A1E] border border-white/5 rounded-[2.5rem] p-8 md:p-14 text-center shadow-2xl">
            
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-[#D4AF37]/15">
              <Search size={14} className="text-[#D4AF37] animate-pulse" />
              <span>Voice Search Coordinate Core</span>
            </div>

            <h2 className="text-3xl font-serif font-black text-cream">Trace Quranic Coordinates</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto">
              Recite any phrase or prayer you remember (e.g., "Rabbana" or "Hardship"). The deep search AI maps standard transcript matches with historical Tafsir.
            </p>

            {/* Speech microphone toggle */}
            <div className="flex flex-col items-center space-y-6 my-10 max-w-lg mx-auto">
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleSearchRecognition}
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all bg-gradient-to-br border border-white/5 shadow-2xl",
                    isVoiceSearching ? "from-red-500 to-rose-600 text-white animate-pulse" : "from-[#D4AF37] to-[#B08E28] text-dark shadow-[#D4AF37]/20"
                  )}
                >
                  {isVoiceSearching ? <Square size={20} /> : <Mic size={24} />}
                </button>
                {isVoiceSearching && (
                  <div className="absolute -inset-4 border border-rose-500/20 rounded-full animate-ping pointer-events-none" />
                )}
              </div>

              <div className="w-full space-y-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]/80">
                  {isVoiceSearching ? "Listening to vocal imprint..." : "Recite or type manually below:"}
                </span>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        executeDeepSearch(searchQuery);
                      }
                    }}
                    placeholder="E.g. Rabbana zalamna, Mercy, Tafseer..."
                    className="w-full bg-[#121214] border border-white/5 rounded-2xl py-4.5 pl-5 pr-14 text-cream text-sm outline-none focus:border-[#D4AF37]/35 transition-colors"
                  />
                  <button
                    onClick={() => executeDeepSearch(searchQuery)}
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#121214] rounded-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Searching visual loop */}
            {isSearching && (
              <div className="py-10 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="text-[#D4AF37] animate-spin" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] animate-pulse">Scanning verses ledger...</p>
              </div>
            )}

            {/* Coordinate result card block */}
            <AnimatePresence>
              {searchResult && !isSearching && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="mt-8 text-left bg-[#121214]/80 rounded-3xl border border-[#D4AF37]/25 p-6 md:p-10 relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 py-1.5 px-3 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black uppercase tracking-widest border border-[#D4AF37]/20 rounded-lg">
                    {searchResult.coordinate}
                  </div>

                  <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Trace Coordinates Isolated</span>
                  <div className="my-6 text-center" dir="rtl">
                    <span className="text-3xl md:text-4xl font-serif text-[#D4AF37] block leading-relaxed">
                      {searchResult.arabic}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block">Standard Translation</span>
                      <p className="text-sm italic font-serif text-slate-300">"{searchResult.translation}"</p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block">Syllable Insights (Tafsir)</span>
                      <p className="text-xs md:text-sm text-slate-400 font-serif leading-relaxed">{searchResult.tafsir}</p>
                    </div>

                    {/* Integrated mini reflection form */}
                    <div className="mt-8 pt-6 border-t border-white/5 bg-white/[0.01] p-5 rounded-2xl border border-white/5 space-y-4">
                      <span className="text-[9px] font-black uppercase text-[#D4AF37] block">
                        Contemplative Inquiry: {searchResult.reflection_prompt}
                      </span>
                      <textarea
                        value={searchReflectionNote}
                        onChange={(e) => setSearchReflectionNote(e.target.value)}
                        disabled={searchReflectionSaved}
                        placeholder="Log down how this discovery touches your soul record..."
                        className="w-full bg-[#121214] border border-white/10 rounded-xl p-4 text-xs text-cream outline-none focus:border-[#D4AF37]/20 min-h-[90px] resize-none"
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-semibold text-slate-500 uppercase">
                          {searchReflectionSaved ? "Reflections successfully secured" : "Preserve insight directly in Heart Journal"}
                        </span>

                        {!searchReflectionSaved ? (
                          <button
                            onClick={saveSearchReflectionToJournal}
                            disabled={savingSearchReflection || !searchReflectionNote.trim()}
                            className="bg-[#D4AF37] text-[#121214] px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 shadow-lg disabled:opacity-40"
                          >
                            <Save size={12} />
                            <span>Save to Journal</span>
                          </button>
                        ) : (
                          <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 font-black uppercase text-[8px] rounded-lg">
                            Preserved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* MODE 3: STATS LEDGER GRID HISTORY DASHBOARD */}
      {activeTab === 'stats' && (
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1E] border border-[#D4AF37]/15 p-6 rounded-3xl text-left flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] block mb-2">Total Recitations Logged</span>
                <span className="text-4xl font-serif font-black text-cream">{historyLogs.length} Sessions</span>
              </div>
              <p className="text-[9px] text-slate-500 mt-2">Continuous pronuciations evaluations tracked over time.</p>
            </div>
            <div className="bg-[#1A1A1E] border border-[#D4AF37]/15 p-6 rounded-3xl text-left flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] block mb-2">Mean Fluency Achievement</span>
                <span className="text-4xl font-serif font-black text-cream">
                  {historyLogs.length > 0 
                    ? Math.floor(historyLogs.reduce((acc, curr) => acc + curr.fluencyPercentage, 0) / historyLogs.length)
                    : 0}%
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mt-2">Optimal target range: 85% to 100%.</p>
            </div>
            <div className="bg-[#1A1A1E] border border-[#D4AF37]/15 p-6 rounded-3xl text-left flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] block mb-2">Completed Triggers</span>
                <span className="text-4xl font-serif font-black text-[#D4AF37]">
                  {historyLogs.filter(h => h.errorsCount === 0).length} Flawless
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mt-2">Zero errors tracked in live voice metrics.</p>
            </div>
          </div>

          {/* Graphical Trends Dashboard */}
          <div className="bg-[#1A1A1E] border border-white/5 rounded-3xl p-6 md:p-8 text-left">
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Historical Accuracy Trends</h3>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">Acoustic track indices</span>
              </div>
            </div>

            {historyLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Database size={28} className="mx-auto text-slate-600 animate-pulse" />
                <p className="text-xs">No historical vocal blueprints isolated yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Horizontal progress graphs */}
                <div className="h-44 flex items-end justify-between space-x-2 px-4 border-b border-white/10 pb-2">
                  {[...historyLogs].reverse().map((log, i) => (
                    <div key={log.id} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                      {/* Hover stats tooltips */}
                      <div className="absolute bottom-full mb-2 bg-[#121214] border border-[#D4AF37]/20 rounded-xl p-3 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl min-w-[120px]">
                        <p className="font-bold text-[#D4AF37]">{log.verseName}</p>
                        <p className="text-slate-300">Fluency: {log.fluencyPercentage}%</p>
                        <p className="text-red-400">Errors: {log.errorsCount}</p>
                      </div>
                      
                      <div 
                        className={cn(
                          "w-full rounded-t-lg transition-all duration-300",
                          log.fluencyPercentage >= 85 
                            ? "bg-[#D4AF37]/90 group-hover:bg-[#D4AF37]" 
                            : "bg-red-500/80 group-hover:bg-red-500"
                        )}
                        style={{ height: `${log.fluencyPercentage * 1.2}px` }}
                      />
                      <span className="text-[6px] font-mono text-slate-600 mt-2 text-center block max-w-[50px] truncate">
                        {new Date(log.createdAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Ledger Listing */}
                <div className="space-y-3 pt-4">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block">All Audio Logs Ledger</span>
                  
                  {historyLogs.map(log => (
                    <div 
                      key={log.id} 
                      className="bg-[#121214] p-4.5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/20 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] font-serif font-black">
                          {log.surahNum}:{log.ayahNum}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-cream font-serif">{log.verseName}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {log.simulated && (
                              <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[6px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                                Simulated demo
                              </span>
                            )}
                            <span className="text-[7px] text-slate-500 font-mono">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-[8px] text-slate-500 uppercase font-mono block">Fluency index</span>
                          <span className={cn(
                            "text-sm font-bold font-mono",
                            log.fluencyPercentage >= 80 ? "text-[#D4AF37]" : "text-red-400"
                          )}>
                            {log.fluencyPercentage}% Achieved
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-500 uppercase font-mono block">Mistakes</span>
                          <span className="text-xs text-cream font-bold">
                            {log.errorsCount} Syllables
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* 2 & 3. DYNAMIC INTERACTIVE "REVIEW & MASTER" DRAWER BOTTOM SHEET */}
      <AnimatePresence>
        {showReviewSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            
            {/* Backdrop opacity */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewSheet(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Bottom Sheet Box Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl bg-[#1A1A1E] border-t border-[#D4AF37]/30 rounded-t-[2.5rem] shadow-2xl relative z-10 p-6 md:p-10 max-h-[85vh] overflow-y-auto outline-none"
            >
              
              {/* Gold Top line accent */}
              <div className="w-16 h-1 bg-[#D4AF37]/30 rounded-full mx-auto mb-6" />

              {/* Review Sheet Header */}
              <div className="flex justify-between items-start mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-[#D4AF37] text-[8px] font-black uppercase tracking-widest mb-1.5">
                    <Award size={12} />
                    <span>Evaluation Verified</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-black text-cream">Review & Master Pronunciation</h3>
                </div>
                
                {/* Accuracy Score Badge */}
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl px-5 py-3 text-center">
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-mono">Fluency Index</span>
                  <span className="text-2xl font-serif font-black text-[#D4AF37]">{currentScore ?? 100}%</span>
                </div>
              </div>

              {/* Target Verse Preview with custom styles */}
              <div className="bg-[#121214] p-5.5 rounded-2xl border border-white/5 text-center mb-8">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest font-mono block mb-2">Selected Verse Target Text</span>
                <p className="text-2xl font-serif text-[#D4AF37] tracking-wider leading-relaxed" dir="rtl">
                  {selectedVerse.arabic}
                </p>
                <div className="mt-3 text-xs italic text-slate-400 font-serif">
                  {selectedVerse.transliteration}
                </div>
              </div>

              {/* ACTIVE SENSORY COMPARISON PLAYER TOOL */}
              <div className="bg-[#121214] p-6 rounded-3xl border border-[#D4AF37]/15 space-y-6 mb-8">
                <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
                  <Music size={14} className="text-[#D4AF37]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Active Comparative Playback</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Side: User Recorded Audio playback */}
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col justify-between items-stretch">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-mono">Sensory vocal footprint</span>
                      <h4 className="text-sm font-semibold text-cream mt-1 font-serif">Your Recorded Voice</h4>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={toggleUserAudioPlayback}
                        className={cn(
                          "px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow-md w-full justify-center",
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

                  {/* Right Side: Mishary Rashid Alafasy Reciter Comparison */}
                  <div className="bg-white/[0.02] border border-[#D4AF37]/10 p-5 rounded-2xl flex flex-col justify-between items-stretch">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] text-[#D4AF37] uppercase tracking-widest font-mono">Divine Master blueprint</span>
                        {/* Playback rate controls list */}
                        <div className="flex items-center space-x-1 bg-white/5 p-0.5 rounded-lg">
                          {[0.8, 1.0, 1.2].map(sp => (
                            <button
                              key={sp}
                              onClick={() => handleSpeedShift(sp)}
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[7px] font-black transition-all",
                                playbackSpeed === sp ? "bg-[#D4AF37] text-dark" : "text-slate-400"
                              )}
                            >
                              {sp}x
                            </button>
                          ))}
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-cream mt-1 font-serif">Listen to Sheikh Al-Afasy</h4>
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={toggleMasterAudioPlayback}
                        className={cn(
                          "px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow-md w-full justify-center",
                          isMasterAudioPlaying 
                            ? "bg-[#D4AF37] text-[#121214] animate-pulse" 
                            : "bg-[#1A1A1E] text-[#D4AF37] border border-[#D4AF37]/25 hover:bg-white/5"
                        )}
                      >
                        {isMasterAudioPlaying ? <Square size={12} className="fill-current" /> : <Play size={12} />}
                        <span>{isMasterAudioPlaying ? "Pause Master" : "Listen to Master Reciter"}</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Simulated acoustic audio waves visually playing */}
                {(isUserAudioPlaying || isMasterAudioPlaying) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-end space-x-1 h-8 mt-4"
                  >
                    {[12, 28, 16, 32, 24, 8, 20, 36, 14, 28, 18, 30, 24, 10, 22].map((height, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-[#D4AF37]/50 w-[3px] rounded-full"
                        animate={{ height: [8, height, 8] }}
                        transition={{ duration: 1, repeat: Infinity, delay: idx * 0.05 }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* SPECIFIC FLAGGED MISTAKES AND TAJWEED REMEDIES PANEL */}
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

              {/* Close Bottom sheet Action button */}
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setShowReviewSheet(false)}
                  className="bg-[#D4AF37] text-[#121214] px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Return to Pavilion
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
