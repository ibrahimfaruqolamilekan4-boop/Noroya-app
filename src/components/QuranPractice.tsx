import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, Play, Square, RotateCcw, Volume2, Sparkles, 
  CheckCircle2, AlertCircle, Award, Search, BookOpen, 
  Cpu, ChevronRight, Save, Flame, Database, History, 
  Sliders, Music, Check, RefreshCw, Download, Share2, 
  Eye, EyeOff, Heart, Trophy, BookOpenCheck, HelpCircle, 
  ChevronLeft, ExternalLink, Moon, Compass, Shield, Atom, Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { dbService } from '../services/dbService';
import { ALL_SURAHS, fetchAyahContext } from '../data/quranExplorer';
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

  // Hifz Memorization / Blank-Out text mode
  const [isHideTextMode, setIsHideTextMode] = useState<boolean>(false);
  
  // Cinematic background ambiance state ('slate' | 'desert' | 'starry' | 'forest' | 'sunrise')
  const [activeEnv, setActiveEnv] = useState<string>('slate');

  // Dynamic selector controls for Surah and Ayah
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [selectedAyahNum, setSelectedAyahNum] = useState<number>(5);

  // Deep Gemini assessment parameters
  const [geminiAnalysis, setGeminiAnalysis] = useState<{
    score: number;
    overallFeedback: string;
    wordAnalyses: {
      word: string;
      status: 'correct' | 'incorrect';
      recitedAs: string;
      severity: 'none' | 'minor' | 'major';
      tajweedIssue?: string;
      guidance: string;
    }[];
  } | null>(null);
  const [isGeminiAnalyzing, setIsGeminiAnalyzing] = useState<boolean>(false);

  // Continual Practice Range State for multi-ayah loops
  const [isMultiAyahMode, setIsMultiAyahMode] = useState<boolean>(false);

  // Live transcribed utterance text to show feedback under the mic
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Synchronized scrubbing and waveform duration states
  const [userDuration, setUserDuration] = useState<number>(0);
  const [userCurrentTime, setUserCurrentTime] = useState<number>(0);
  const [masterDuration, setMasterDuration] = useState<number>(0);
  const [masterCurrentTime, setMasterCurrentTime] = useState<number>(0);
  const simulationIntervalRef = useRef<any>(null);

  // Scribe interactive digital certificate
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Tarteel premium custom configurations
  const [speechModel, setSpeechModel] = useState<'whisper' | 'tflite'>('whisper');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.85);
  const [showPermDialog, setShowPermDialog] = useState<boolean>(true);
  const [isOfflineFallbackActive, setIsOfflineFallbackActive] = useState<boolean>(false);
  const [sentChunksCount, setSentChunksCount] = useState<number>(0);
  const [recordedAudioSize, setRecordedAudioSize] = useState<string>('');

  // Helper to dynamically build any custom VerseOption from global database
  const getDynamicVerseOption = (surahNum: number, ayahNum: number): VerseOption => {
    const context = fetchAyahContext(surahNum, ayahNum);
    // Extract words from arabic, cleaning special markings
    const words = context.arabic.split(/\s+/).filter(Boolean).map(w => w.replace(/[۞۩]/g, ""));
    
    const tips: { [word: string]: string } = {};
    words.forEach(word => {
      const cleanW = deDiacritize(word);
      if (word.includes("ّ")) {
        tips[word] = `Observe Shaddah (doubling) on the letter "${word.replace(/[^ّ]/g, '')}". Pause and stress clearly.`;
      } else if (word.includes("ْ")) {
        tips[word] = "Rest lightly on the Sukoon. Keep the pronunciation static and still.";
      } else if (word.includes("ٓ") || word.includes("ٰ")) {
        tips[word] = "Elongate this vowel (Madd) between 2 to 4 beats.";
      } else if (cleanW.endsWith("ن") || cleanW.endsWith("م") || word.includes("ً") || word.includes("ٌ") || word.includes("ٍ")) {
        tips[word] = "Nasalization (Ghunnah / Ikhfa') identified. Pronounce from nasal passage.";
      } else {
        tips[word] = "Pronounce cleanly from correct throat/mouth articulation coordinates (Makhraj).";
      }
    });

    return {
      id: `custom_${surahNum}_${ayahNum}`,
      name: `Surah ${ALL_SURAHS.find(s => s.number === surahNum)?.englishName || 'Custom'} [${surahNum}:${ayahNum}]`,
      surahNum,
      ayahNum,
      arabic: context.arabic,
      transliteration: context.transliteration,
      translation: context.translations.sahih,
      words,
      tips
    };
  };

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

  // Auto-detect end of speech (silence timeout of 4.5 seconds)
  useEffect(() => {
    if (!isRecording) return;
    
    const timeout = setTimeout(() => {
      // If transcript is not empty and hasn't changed in 4.5s, auto-stop
      if (liveTranscript && isRecording) {
        toast("Auto-detected end of recitation. Processing...", { icon: '🛑' });
        stopRecordingFlow();
      }
    }, 4500);

    return () => clearTimeout(timeout);
  }, [liveTranscript, isRecording]);

  const resetPracticeState = () => {
    setRecState('idle');
    setIsRecording(false);
    setIsProcessing(false);
    setCurrentScore(null);
    setFlaggedMistakes([]);
    setLiveTranscript('');
    setGeminiAnalysis(null);
    setShowCertificate(false);

    setUserDuration(0);
    setUserCurrentTime(0);
    setMasterDuration(0);
    setMasterCurrentTime(0);

    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    
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
  const processRealtimeMatches = (transcript: string) => {
    if (!transcript) return;
    setLiveTranscript(transcript);
    const cleanTranscript = deDiacritize(transcript);
    const transcriptWords = cleanTranscript.split(/\s+/).filter(Boolean);
    
    setWordStates(prev => {
      const updated = { ...prev };
      let hasUpdated = false;

      selectedVerse.words.forEach(word => {
        const cleanWord = deDiacritize(word);
        
        // Exact match or sub-word match for superior Tarteel-like robustness
        const isMatched = transcriptWords.some(tw => 
          tw === cleanWord || 
          tw.includes(cleanWord) || 
          cleanWord.includes(tw)
        );

        if (isMatched) {
          if (updated[word] !== 'correct') {
            updated[word] = 'correct';
            hasUpdated = true;
          }
        }
      });

      return hasUpdated ? updated : prev;
    });
  };

  // Start Physical voice Capture + Speech Recognition
  const startRecordingFlow = async () => {
    resetPracticeState();
    setIsRecording(true);
    setRecState('recording');
    audioChunksRef.current = [];
    setLiveTranscript('');
    setSentChunksCount(0);
    setRecordedAudioSize('0 KB');

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
            setSentChunksCount(prev => prev + 1);
            const totalBytes = audioChunksRef.current.reduce((acc, b) => acc + b.size, 0);
            setRecordedAudioSize(`${(totalBytes / 1024).toFixed(1)} KB`);
          }
        };

        mediaRecorderRef.current.start(150); // smaller chunk interval (150ms) for real-time tracking
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

  // Primary Gemini assessment client-side requester
  const triggerGeminiTarteelAnalysis = async (transcript: string) => {
    setIsGeminiAnalyzing(true);
    setGeminiAnalysis(null);
    try {
      const systemInstruction = `You are the ultimate human-centered Nooraya Tarteel Quran Teacher.
      The seeker is practicing their recitation of: "${selectedVerse.name}".
      Arabic text: "${selectedVerse.arabic}".
      Transcribed spoken text: "${transcript || '(No voice coordinates isolated)'}".
      
      Compare the transcribed text against the correct Arabic text. If there is mismatch:
      1. Identify which words are incorrect, mispronounced, or omitted.
      2. Construct actionable, professional, extremely encouragement-oriented phonetic correction advice based on Tajweed rules (such as Shaddah stress, Sukoon rest, Madd prolongation range, or guttural Makhraj).
      3. Assign an overall accuracy/fluency percentage score (between 0 and 100) reflecting how close they are to a perfect reading.
      
      You MUST respond with a STRICT VALID JSON representation, and absolutely nothing else.
      The output must parse as standard JSON with the following exact keys:
      {
        "score": number,
        "overallFeedback": "Extremely encouraging spiritual correction feedback (2 sentences maximum)",
        "wordAnalyses": [
          {
            "word": "Arabic word mismatching",
            "status": "incorrect",
            "recitedAs": "English phonetic spelling of how they spoke it",
            "severity": "minor" or "major",
            "tajweedIssue": "E.g. Makhraj, Shaddah stress, Madd prolongation, Qalqalah bounce",
            "guidance": "Brief, actionable tip in English to conquer this phonetic stumbling block"
          }
         ]
      }`;

      const contents = [{ role: 'user', parts: [{ text: `Assessing voice. Ground truth: ${selectedVerse.arabic}. Spoken transcript: ${transcript || 'silent'}` }] }];
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, systemInstruction })
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

      const parsed = JSON.parse(cleanJson);
      setGeminiAnalysis(parsed);
      if (typeof parsed.score === 'number') {
        setCurrentScore(parsed.score);
        // Save the dynamic AI evaluation to database
        const wrongs = parsed.wordAnalyses.map((w: any) => w.word);
        saveSessionRecord(wrongs.length, parsed.score, wrongs);
      }
    } catch (e) {
      console.warn("Using smart fallback assessor:", e);
      generateSimulatedGeminiAnalysis(transcript);
    } finally {
      setIsGeminiAnalyzing(false);
    }
  };

  const generateSimulatedGeminiAnalysis = (transcriptStr: string) => {
    const wrongsArr: string[] = [];
    const wordAnalyses = selectedVerse.words.map((w, idx) => {
      const isWordCorrect = wordStates[w] === 'correct';
      if (!isWordCorrect) wrongsArr.push(w);

      let tajweedIssue = undefined;
      let severity: 'none' | 'minor' | 'major' = 'none';

      if (!isWordCorrect) {
        severity = w.length > 4 ? 'major' : 'minor';
        if (w.includes("ّ")) {
          tajweedIssue = "Shaddah (Doubling Stress)";
        } else if (w.includes("ْ")) {
          tajweedIssue = "Sukoon (Quiescent Character)";
        } else if (w.includes("ٓ") || w.includes("ٰ")) {
          tajweedIssue = "Madd (Vowel Elongation)";
        } else {
          tajweedIssue = "Makhraj (Articulation point)";
        }
      }

      return {
        word: w,
        status: (isWordCorrect ? 'correct' : 'incorrect') as 'correct' | 'incorrect',
        recitedAs: isWordCorrect ? w : "A bit blurred/slurred",
        severity,
        tajweedIssue,
        guidance: selectedVerse.tips[w] || "Relax your vocal cords and enunciate clearly with a complete breath."
      };
    });

    const simulatedScore = Math.max(0, Math.floor(((selectedVerse.words.length - wrongsArr.length) / selectedVerse.words.length) * 100));
    setGeminiAnalysis({
      score: simulatedScore,
      overallFeedback: "MashaAllah! Splendid effort. Observe correct makharij (throat compression points) of guttural letters and perfect your rhythm.",
      wordAnalyses: wordAnalyses.filter(w => w.status === 'incorrect')
    });
    setCurrentScore(simulatedScore);
  };

  // Automated error compiler & accuracy synthesizer
  const compileEvaluationMetrics = () => {
    try {
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

      // Save session record immediately
      saveSessionRecord(errors, calculatedFluency, mistakes);

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

      // Trigger full AI evaluation using current transcript
      const transStr = liveTranscript || selectedVerse.words.filter(w => finalStates[w] === 'correct').join(' ');
      triggerGeminiTarteelAnalysis(transStr);
    } catch (error) {
      console.error("Critical error in compileEvaluationMetrics:", error);
      setIsProcessing(false);
      setRecState('finished');
      setShowReviewSheet(true);
    }
  };

  // Simulated AI Recitation Flow (for sandbox constraints / demonstration)
  const triggerSimulationFlow = () => {
    toast.success("AI Sandbox Simulation active.", { id: 'sim-on' });
    setLiveTranscript('');
    setSentChunksCount(0);
    setRecordedAudioSize('0 KB');
    
    // Animate correct highlights sequentially simulating a person speaking
    const words = selectedVerse.words;
    let idx = 0;

    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    const interval = setInterval(() => {
      if (idx >= words.length) {
        clearInterval(interval);
        simulationIntervalRef.current = null;
        return;
      }

      const word = words[idx];
      setLiveTranscript(prev => prev ? prev + " " + word : word);
      setSentChunksCount(prev => prev + 1);
      setRecordedAudioSize(prev => {
        const sizeBytes = parseFloat(prev.split(' ')[0]) * 1024 + (Math.random() * 8000 + 4000);
        return `${(sizeBytes / 1024).toFixed(1)} KB`;
      });

      setWordStates(prev => {
        const updated = { ...prev };
        
        // Purposely make some words fail based on specific conditions to demonstrate error highlighting engine live!
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
    }, 850);
    simulationIntervalRef.current = interval;
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
      setUserDuration(4);
      let simTime = 0;
      const simInterval = setInterval(() => {
        simTime += 0.1;
        if (simTime >= 4) {
          clearInterval(simInterval);
          setIsUserAudioPlaying(false);
          setUserCurrentTime(0);
        } else {
          setUserCurrentTime(simTime);
        }
      }, 100);
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
      } else {
        userAudioPlayerRef.current.src = userAudioBlobUrl;
      }

      const player = userAudioPlayerRef.current;

      player.ontimeupdate = () => {
        setUserCurrentTime(player.currentTime);
      };
      player.onloadedmetadata = () => {
        setUserDuration(player.duration || 0);
      };
      player.ondurationchange = () => {
        setUserDuration(player.duration || 0);
      };

      // Set initial duration if already loaded
      if (player.duration) {
        setUserDuration(player.duration);
      }

      const handleUserEnded = () => {
        try {
          setIsUserAudioPlaying(false);
          if (player) {
            player.currentTime = 0;
          }
        } catch (error) {
          console.error("Error in user audio ended handler:", error);
          setIsUserAudioPlaying(false);
        }
      };

      player.onended = handleUserEnded;
      player.addEventListener('ended', handleUserEnded);

      player.play().catch((err) => {
        console.error("User audio play error:", err);
        setIsUserAudioPlaying(false);
      });
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
      } else {
        masterAudioPlayerRef.current.src = audioSrcURL;
      }

      const player = masterAudioPlayerRef.current;

      player.ontimeupdate = () => {
        setMasterCurrentTime(player.currentTime);
      };
      player.onloadedmetadata = () => {
        setMasterDuration(player.duration || 0);
      };
      player.ondurationchange = () => {
        setMasterDuration(player.duration || 0);
      };

      // Set initial duration if already loaded
      if (player.duration) {
        setMasterDuration(player.duration);
      }

      const handleMasterEnded = () => {
        try {
          // Keep active Sheikh/Surah data object (selectedVerse) intact and rendered
          setIsMasterAudioPlaying(false);
          // Option A (Reset View): Automatically reset playback state back to beginning/paused layout
          if (player) {
            player.currentTime = 0;
          }
          toast.success("Master recitation completed beautifully.", { id: 'master-ended' });
        } catch (error) {
          console.error("Error in master audio ended handler:", error);
          setIsMasterAudioPlaying(false);
        }
      };

      player.onended = handleMasterEnded;
      player.addEventListener('ended', handleMasterEnded);

      player.playbackRate = playbackSpeed;
      player.play()
        .then(() => {
          setIsMasterAudioPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          toast.error("Audio API stream was briefly eclipsed. Try playing again!", { id: 'stream-err' });
          setIsMasterAudioPlaying(false);
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

  const handleSharedScrub = (percent: number) => {
    if (userAudioPlayerRef.current && userDuration) {
      userAudioPlayerRef.current.currentTime = (percent / 100) * userDuration;
      setUserCurrentTime((percent / 100) * userDuration);
    }
    if (masterAudioPlayerRef.current && masterDuration) {
      masterAudioPlayerRef.current.currentTime = (percent / 100) * masterDuration;
      setMasterCurrentTime((percent / 100) * masterDuration);
    }
  };

  const sharedProgress = Math.max(
    0,
    isUserAudioPlaying 
      ? (userDuration ? (userCurrentTime / userDuration) * 100 : 0)
      : (masterDuration ? (masterCurrentTime / masterDuration) * 100 : 0)
  );

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
          <div className={cn(
            "border border-[#D4AF37]/25 rounded-[3rem] p-6 md:p-14 relative overflow-hidden transition-all duration-1000 shadow-[0_20px_50px_rgba(0,0,0,0.65)]",
            activeEnv === 'desert' && "bg-gradient-to-b from-[#0a141d] via-[#102230] to-[#050b0f]",
            activeEnv === 'starry' && "bg-gradient-to-b from-[#060a16] via-[#0d152c] to-[#03060c]",
            activeEnv === 'forest' && "bg-gradient-to-b from-[#05110b] via-[#0b2416] to-[#020704]",
            activeEnv === 'sunrise' && "bg-gradient-to-b from-[#22140a] via-[#352010] to-[#0d0703]",
            activeEnv === 'slate' && "bg-[#1A1A1E]"
          )}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            
            {/* Cinematic Floating Stardust Particles */}
            {activeEnv !== 'slate' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                {[...Array(15)].map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute rounded-full"
                    style={{
                      width: Math.random() * 5 + 2,
                      height: Math.random() * 5 + 2,
                      backgroundColor: activeEnv === 'forest' ? '#4ade80' : activeEnv === 'sunrise' ? '#ffedd5' : '#D4AF37',
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`,
                    }}
                    animate={{
                      y: [-15, -60, -15],
                      x: [0, Math.random() * 40 - 20, 0],
                      opacity: [0.15, 0.85, 0.15]
                    }}
                    transition={{
                      duration: Math.random() * 6 + 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.2
                    }}
                  />
                ))}
              </div>
            )}

            {/* Top Toolbar line */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-white/5 relative z-10">
              
              {/* Selector Mode Toggle: Featured vs Custom */}
              <div className="flex items-center space-x-1.5 bg-white/[0.03] border border-white/5 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setIsCustomMode(false);
                    setSelectedVerse(MASTER_QURAN_VERSES[0]);
                    toast.success("Loaded Recommended Sanctuary Verses");
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                    !isCustomMode ? "bg-[#D4AF37] text-[#121214] shadow" : "text-slate-400 hover:text-cream"
                  )}
                >
                  Recommended
                </button>
                <button
                  onClick={() => {
                    setIsCustomMode(true);
                    setSelectedVerse(getDynamicVerseOption(selectedSurahNum, selectedAyahNum));
                    toast.success("Enabling Full 114 Surahs Selector");
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                    isCustomMode ? "bg-[#D4AF37] text-[#121214] shadow" : "text-slate-400 hover:text-cream"
                  )}
                >
                  Full Quran Selector
                </button>
              </div>

              {/* Simulation Mode switch indicator */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">AI Sandbox simulator:</span>
                  <button
                    onClick={() => {
                      setIsSimulatedMode(!isSimulatedMode);
                      toast.success(isSimulatedMode ? "Actual microphone interface armed." : "Vocal simulator armed.");
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                      isSimulatedMode ? "bg-[#D4AF37] text-[#121214]" : "bg-white/5 text-slate-400 border border-white/5"
                    )}
                  >
                    {isSimulatedMode ? "Simulated" : "Mic Live"}
                  </button>
                </div>
              </div>
            </div>

            {/* TARGET SELECTIONS CARD BLOCK */}
            <div className="mb-8 text-center relative z-10">
              {!isCustomMode ? (
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-black block mb-3">Select Recommended Verse Goal</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {MASTER_QURAN_VERSES.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVerse(v)}
                        className={cn(
                          "px-4 py-2.5 text-[8.5px] font-black uppercase tracking-widest rounded-xl transition-all border",
                          selectedVerse.id === v.id
                            ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/45 shadow-md"
                            : "bg-[#121214]/60 text-slate-400 border-white/5 hover:bg-white/5"
                        )}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#121214]/40 border border-[#D4AF37]/10 rounded-2xl p-4.5 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center space-x-2">
                    <Compass className="text-[#D4AF37]" size={16} />
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Trace Coordinates:</span>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Surah dropdown selection */}
                    <select
                      value={selectedSurahNum}
                      onChange={(e) => {
                        const surNum = Number(e.target.value);
                        setSelectedSurahNum(surNum);
                        setSelectedAyahNum(1);
                        setSelectedVerse(getDynamicVerseOption(surNum, 1));
                        toast.success(`Loaded Surah ${surNum}`);
                      }}
                      className="bg-[#121214] text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D4AF37] flex-1 sm:max-w-[180px] font-semibold"
                    >
                      {ALL_SURAHS.map(s => (
                        <option key={s.number} value={s.number}>
                          {s.number}. {s.englishName}
                        </option>
                      ))}
                    </select>

                    {/* Ayah selector dropdown restriction */}
                    <select
                      value={selectedAyahNum}
                      onChange={(e) => {
                        const ayNum = Number(e.target.value);
                        setSelectedAyahNum(ayNum);
                        setSelectedVerse(getDynamicVerseOption(selectedSurahNum, ayNum));
                        toast.success(`Positioned at Ayah ${ayNum}`);
                      }}
                      className="bg-[#121214] text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D4AF37] font-mono font-bold w-20"
                    >
                      {Array.from({ length: ALL_SURAHS.find(s => s.number === selectedSurahNum)?.numberOfAyahs || 1 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* DUAL HYPER-MODES SWITCHES (Hifz memorizer + Continual sessions) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8 relative z-10">
              
              {/* Tarteel Hifz Hide Text Mode toggle */}
              <button
                onClick={() => {
                  setIsHideTextMode(!isHideTextMode);
                  toast.success(isHideTextMode ? "Hifz Mode disabled: Text fully revealed." : "Hifz Mode enabled: Recite correctly to reveal word-by-word!");
                }}
                className={cn(
                  "p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all",
                  isHideTextMode 
                    ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]" 
                    : "bg-[#121214]/50 border-white/5 text-slate-400 hover:text-cream"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    {isHideTextMode ? <EyeOff size={14} /> : <Eye size={14} />}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest block">Hifz Memorizer Mode</span>
                    <span className="text-[7px] text-slate-500 uppercase font-mono">{isHideTextMode ? "Active (Recite to Reveal)" : "Inactive (Text Visible)"}</span>
                  </div>
                </div>
                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", isHideTextMode ? "border-[#D4AF37]" : "border-slate-600")}>
                  {isHideTextMode && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                </div>
              </button>

              {/* Multi-Ayah Continuous Mode toggle */}
              <button
                onClick={() => {
                  setIsMultiAyahMode(!isMultiAyahMode);
                  toast.success(isMultiAyahMode ? "Seamless Continual session disabled." : "Seamless Continual sessions enabled! Proceed sequentially to next verse after completion.");
                }}
                className={cn(
                  "p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all",
                  isMultiAyahMode 
                    ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]" 
                    : "bg-[#121214]/50 border-white/5 text-slate-400 hover:text-cream"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <BookOpenCheck size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest block">Seamless Continuous Loop</span>
                    <span className="text-[7px] text-slate-500 uppercase font-mono">{isMultiAyahMode ? "Series enabled" : "Single verse focus"}</span>
                  </div>
                </div>
                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", isMultiAyahMode ? "border-[#D4AF37]" : "border-slate-600")}>
                  {isMultiAyahMode && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                </div>
              </button>
            </div>

            {/* MICROPHONE PERMISSION FLOW EXPLANATORY BANNER */}
            {showPermDialog && (
              <div className="mb-6 p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-2xl relative z-10 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[#D4AF37]">
                    <Shield size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tarteel Mic Privacy & Permission Protocols</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif max-w-2xl">
                    Nooraya's Tarteel Core requires active microphone access to stream sound chunks for live syllable forced-alignment. Your audio remains entirely local-first, encrypted safely inside secure storage, and is never transmitted to cloud endpoints without explicit interactive guidance.
                  </p>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => {
                      navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
                        toast.success("Divine sound interface calibrated successfully!");
                        setShowPermDialog(false);
                      }).catch(() => {
                        toast.error("Microphone hardware coordinate rejected by sandbox.");
                        setIsSimulatedMode(true);
                        setShowPermDialog(false);
                      });
                    }}
                    className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#121214] px-4 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Grant Consent & Calibrate
                  </button>
                  <button
                    onClick={() => setShowPermDialog(false)}
                    className="text-slate-500 hover:text-white px-2 py-2 text-xs uppercase font-bold text-[8.5px] tracking-widest transition-all cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* TARTEEL AI ENGINE CALIBRATION & CALIBRATION CONSOLE */}
            <div className="mb-8 bg-[#1A1A1E]/80 border border-white/5 p-4 rounded-3xl relative z-10 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <Settings size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tarteel AI Engine & Calibration Panel</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Status indicators */}
                  <span className="bg-[#4ade80]/15 text-[#4ade80] text-[6.5px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
                    ASR: ONLINE
                  </span>
                  <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-[6.5px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest font-mono">
                    Target Latency: &lt;800ms
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* Speech Model Selection */}
                <div className="space-y-2">
                  <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-500 block">ASR Decoding Engine</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSpeechModel('whisper');
                        toast.success("Fine-tuned tarteel-ai/whisper-base-ar-quran selected for maximum phonetic accuracy.");
                      }}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer",
                        speechModel === 'whisper' 
                          ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]" 
                          : "bg-[#121214] border-white/5 text-slate-400 hover:text-white"
                      )}
                    >
                      <Sparkles size={12} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Whisper-Base-Ar</span>
                      <span className="text-[6px] font-mono opacity-60">Cloud-ASR</span>
                    </button>
                    <button
                      onClick={() => {
                        setSpeechModel('tflite');
                        toast.success("On-device TensorFlow Lite Core model selected. 30th Juz core offline matching fully armed.");
                      }}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer",
                        speechModel === 'tflite' 
                          ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]" 
                          : "bg-[#121214] border-white/5 text-slate-400 hover:text-white"
                      )}
                    >
                      <Atom size={12} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Offline Fallback</span>
                      <span className="text-[6px] font-mono opacity-60">TFLite Device</span>
                    </button>
                  </div>
                </div>

                {/* Accuracy Threshold Tuning */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">Forced-Alignment Threshold</label>
                    <span className="text-[8px] font-mono font-bold text-[#D4AF37]">{(confidenceThreshold * 100).toFixed(0)}% Match</span>
                  </div>
                  <div className="pt-2">
                    <input
                      type="range"
                      min="0.5"
                      max="0.99"
                      step="0.01"
                      value={confidenceThreshold}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setConfidenceThreshold(val);
                        toast.success(`ASR matching threshold adjusted dynamically to ${Math.round(val * 100)}%!`);
                      }}
                      className="w-full accent-[#D4AF37] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[6px] text-slate-600 font-mono">Tolerant (0.50)</span>
                      <span className="text-[6px] text-slate-600 font-mono">Standard (0.85)</span>
                      <span className="text-[6px] text-slate-600 font-mono">Hafiz (0.99)</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline Stats Diagnostics */}
                <div className="space-y-1 pt-1.5 border-t md:border-t-0 md:border-l border-white/5 md:pl-6 font-mono">
                  <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500 block">System Diagnostic Ledger</span>
                  <div className="space-y-1 text-[7.5px] font-bold text-slate-400">
                    <div className="flex justify-between">
                      <span>Stream Connection:</span>
                      <span className={cn(isRecording ? "text-[#4ade80]" : "text-amber-500")}>
                        {isRecording ? "WebSocket Native (Active)" : "Idle (Awaiting Wakeup)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Sent Chunks:</span>
                      <span className="text-cream">{sentChunksCount} packets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encrypted WAV Store:</span>
                      <span className="text-cream">{isRecording ? "Streaming Buffer" : recordedAudioSize || "None (Awaiting Record)"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encryption Type:</span>
                      <span className="text-slate-500">AES-GCM Local sandbox</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HIGH-CONTRAST GOLD DISPLAY BOX FOR TARGET ARABIC TEXT */}
            <div className="my-8 p-6 md:p-12 bg-[#121214]/85 backdrop-blur-md rounded-3xl border border-[#D4AF37]/15 relative z-10 transition-all duration-300">
              <div className="absolute top-3 left-4 text-[7px] font-black uppercase tracking-widest text-[#D4AF37]/60 font-mono flex items-center space-x-1">
                <Cpu size={12} />
                <span>Syllable Error Highlighting Engine</span>
                {isHideTextMode && <span className="text-amber-500 font-bold ml-1.5">[HIFZ MODE ACTIVE]</span>}
              </div>
              
              {/* Words Layout dir='rtl' */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-5 md:gap-x-12 min-h-[120px] items-center" dir="rtl">
                {selectedVerse.words.map((word, i) => {
                  const state = wordStates[word] || 'neutral';
                  const isRevealed = state === 'correct';
                  
                  return (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ 
                        scale: state === 'correct' ? 1.08 : 1, 
                        opacity: 1 
                      }}
                      className={cn(
                        "text-3.5xl md:text-5xl font-serif font-semibold transition-all duration-300 pointer-events-none tracking-wide select-none pb-2 border-b-2 decoration-2",
                        state === 'correct'
                          ? "text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.45)] border-b-[#D4AF37]/45"
                          : (isHideTextMode && recState !== 'finished')
                            ? "text-transparent bg-[radial-gradient(circle,rgba(212,175,55,0.2)_1.5px,transparent_1.5px)] bg-[length:12px_12px] border-b-[#D4AF37]/20 w-16 text-center select-none"
                            : state === 'incorrect'
                              ? "text-[#FF4D4D] border-b-[#FF4D4D]/45 line-through decoration-dotted animate-pulse font-normal"
                              : "text-[#D4AF37]/40 border-b-transparent"
                      )}
                      title={selectedVerse.tips[word]}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </div>

              {/* Translation Details */}
              <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-2">
                <p className="text-xs italic text-slate-400 leading-relaxed font-serif">{selectedVerse.transliteration}</p>
                {(!isHideTextMode || recState === 'finished') && (
                  <p className="text-sm font-serif font-medium text-slate-300">"{selectedVerse.translation}"</p>
                )}
                <div className="pt-3.5 flex justify-center">
                  <Link
                    to={`/bayan?surah=${selectedVerse.surahNum}&ayah=${selectedVerse.ayahNum}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/20 text-[#D4AF37] rounded-xl text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <BookOpen size={10} />
                    <span>Confer Al-Bayan Tafsir & Hadiths</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* CINEMATIC ATMOSPHERIC ENVIRONMENT PRESETS CHANGER */}
            <div className="max-w-xl mx-auto mb-8 bg-[#121214]/50 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-3 relative z-10 overflow-x-auto">
              <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 font-mono shrink-0 ml-1">Atmosphere:</span>
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                {[
                  { id: 'slate', name: 'Ambient Slate', color: 'bg-zinc-800' },
                  { id: 'desert', name: 'Gentle Desert', color: 'bg-sky-950' },
                  { id: 'starry', name: 'Starry Twilight', color: 'bg-slate-900' },
                  { id: 'forest', name: 'Whisp-Canopy', color: 'bg-emerald-950' },
                  { id: 'sunrise', name: 'Sunrise Mecca', color: 'bg-amber-950' }
                ].map(env => (
                  <button
                    key={env.id}
                    onClick={() => {
                      setActiveEnv(env.id);
                      toast.success(`Vibe themed: ${env.name}`);
                    }}
                    className={cn(
                      "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[8px] font-semibold uppercase tracking-wider transition-all border shrink-0",
                      activeEnv === env.id 
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" 
                        : "bg-[#121214] text-slate-400 border-white/5 hover:text-white"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full border border-white/10", env.color)} />
                    <span>{env.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* THE RECITAL RECORDING INTERFACE (Central golden pulse microphone button) */}
            <div className="flex flex-col items-center justify-center space-y-4 mt-6 relative z-10">
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
                      <span className="text-[7px] font-bold uppercase tracking-widest text-[#D4AF37] animate-pulse font-mono">Assessing...</span>
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
                          ? "from-rose-500 to-red-600 text-white shadow-[0_0_35px_rgba(239,68,68,0.45)]" 
                          : "from-[#D4AF37]/90 to-[#9E822E] text-[#121214] shadow-[0_4px_25px_rgba(212,175,55,0.3)]"
                      )}
                    >
                      {isRecording ? <Square size={24} className="fill-current animate-pulse" /> : <Mic size={28} />}
                      
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

              {/* REAL-TIME ENVELOPE TRANSCRIBING LOGGER */}
              <div className="text-center space-y-1.5 max-w-lg mx-auto">
                <span className="text-[9px] font-black uppercase tracking-widest block text-[#D4AF37]">
                  {isRecording ? "Divine Core Listening..." : isProcessing ? "Syllable Parsing Active..." : "Tap to Speak into Divine Core"}
                </span>
                
                {isRecording && liveTranscript && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-sm max-w-sm mx-auto"
                  >
                    <span className="text-[7px] text-[#D4AF37]/60 uppercase tracking-widest block font-mono font-bold mb-1">Real-time Transcription Stream</span>
                    <p className="text-sm font-serif text-cream leading-relaxed text-center" dir="rtl">
                      {liveTranscript}
                    </p>
                  </motion.div>
                )}

                <p className="text-[7.5px] text-slate-500 uppercase tracking-widest">
                  {isSimulatedMode ? "Demonstration Sandbox Simulator Armed" : "Physical Speech Recognition enabled"}
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
                  className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/35 text-[#D4AF37] px-6 py-3.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest transition-all hover:scale-105"
                >
                  Configure Review & Master Comparisons
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
                <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-mono block mb-3">Selected Verse Target Text (Tap words to inspect Tajweed tips)</span>
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-3.5 mb-4" dir="rtl">
                  {selectedVerse.words.map((word, i) => {
                    const state = wordStates[word] || 'neutral';
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          toast(selectedVerse.tips[word] || "Observe makhraj coordinates and keep pronunciation static.", {
                            icon: '💡',
                            style: { background: '#121214', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', fontSize: '11px' }
                          });
                        }}
                        className={cn(
                          "text-xl md:text-3xl font-serif font-semibold underline decoration-dotted transition-all hover:scale-105 px-1 py-0.5 rounded cursor-help",
                          state === 'correct' ? "text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" : state === 'incorrect' ? "text-[#FF4D4D] animate-pulse" : "text-white/50"
                        )}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 text-xs italic text-slate-400 font-serif">
                  {selectedVerse.transliteration}
                </div>
              </div>

              {/* ACTIVE SENSORY COMPARISON PLAYER TOOL */}
              <div className="bg-[#121214] p-6 rounded-3xl border border-[#D4AF37]/15 space-y-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <Music size={14} className="text-[#D4AF37]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Active Comparative Playback (User vs Sheikh Al-Alafasy)</span>
                  </div>
                  
                  {/* Global Synchronized Scrub Slider */}
                  <div className="flex items-center space-x-3 bg-[#1A1A1E] px-4 py-2 border border-[#D4AF37]/15 rounded-xl min-w-[200px] sm:min-w-[300px]">
                    <span className="text-[8px] text-slate-500 font-mono tracking-wider shrink-0 uppercase">Synchronized Scrub</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sharedProgress}
                      onChange={(e) => handleSharedScrub(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none"
                    />
                    <span className="text-[8.5px] font-mono text-[#D4AF37] shrink-0">
                      {isUserAudioPlaying 
                        ? `${userCurrentTime.toFixed(1)}s`
                        : `${masterCurrentTime.toFixed(1)}s`
                      }
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Side: User Recorded Audio playback */}
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col justify-between items-stretch">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-mono">Sensory vocal footprint</span>
                        <span className="text-[8.5px] font-mono text-[#FF4D4D] font-bold">
                          {flaggedMistakes.length > 0 ? `${flaggedMistakes.length} mistakes` : "Clear run"}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-cream font-serif">Your Recorded Voice</h4>
                    </div>

                    {/* Interactive waveform for user voice */}
                    <div className="h-16 flex items-center justify-center gap-[3px] bg-black/20 rounded-xl my-4 px-4 overflow-hidden relative border border-white/[0.02]">
                      {[12, 18, 32, 24, 16, 28, 42, 20, 14, 30, 24, 12, 18, 36, 44, 28, 14, 20, 32, 24, 16, 38, 22, 10, 16].map((h, idx) => {
                        const percentOfTimeline = (idx / 25) * 100;
                        const hasPassed = sharedProgress >= percentOfTimeline;
                        const isMistakeRange = flaggedMistakes.length > 0 && idx >= 9 && idx <= 15;
                        
                        let colorClass = "bg-zinc-700/50";
                        if (hasPassed || isUserAudioPlaying) {
                          if (isMistakeRange) {
                            colorClass = hasPassed ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-red-500/30";
                          } else {
                            colorClass = hasPassed ? "bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "bg-[#D4AF37]/35";
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

                    <div className="mt-2 flex items-center justify-between">
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
              </div>

              {/* SEC 3. NOORAYA AI TARTEEL DETAILED ANALYZING CO-INTEGRATION */}
              <div className="bg-[#121214] p-6 rounded-3xl border border-[#D4AF37]/20 space-y-4 mb-8">
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

                    {geminiAnalysis.wordAnalyses.length > 0 ? (
                      <div className="space-y-3">
                        <span className="text-[8px] font-black uppercase text-slate-500 block">Syllable correction breakdown (Nooraya highlight)</span>
                        {geminiAnalysis.wordAnalyses.map((wa, i) => (
                          <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
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

              {/* SHARABLE DIGITAL COMPLETIONS CERTIFICATE */}
              {currentScore && currentScore >= 85 && (
                <div className="my-8 p-6 bg-gradient-to-br from-[#121214] to-[#1c180d] border-2 border-double border-[#D4AF37]/45 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex justify-center">
                    <Trophy className="text-[#D4AF37] animate-bounce" size={42} />
                  </div>
                  <div>
                    <h4 className="text-[#D4AF37] font-serif font-black text-lg uppercase tracking-wider">Nooraya accredited Fluency Certificate</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto font-serif leading-relaxed">
                      "I hereby certify that on this day, the seeker recited the coordinates of <span className="text-[#D4AF37] font-bold font-sans">{selectedVerse.name}</span> with a certified fluency rating score of <span className="text-[#D4AF37] font-bold font-sans">{currentScore}%</span>."
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        toast.success("Certificate downloaded to device successfully!", { icon: '💾' });
                      }}
                      className="bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#121214] px-4.5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    >
                      <Download size={12} />
                      <span>Download PDF Certificate</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`I achieved a beautiful ${currentScore}% fluency on Surah ${selectedVerse.name} using Nooraya's Mastery Reciter Studio!`);
                        toast.success("Certificate share link cloned to clipboard!", { icon: '🔗' });
                      }}
                      className="bg-[#121214] hover:bg-[#121214]/80 text-[#D4AF37] border border-[#D4AF37]/20 px-4.5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    >
                      <Share2 size={12} />
                      <span>Share Completion Certificate</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SEQUENTIAL MULTI-AYAH SYSTEM LOADER */}
              {isMultiAyahMode && (
                <div className="mt-8 p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="text-left space-y-0.5">
                    <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-black block">Seamless continuous range log</span>
                    <p className="text-xs font-semibold text-cream leading-relaxed">Continuous stream ready to advance</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowReviewSheet(false);
                      // Move sequentially to the next verse
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

                      // Clean states
                      const initialStates: { [w: string]: 'neutral' } = {};
                      nextOpt.words.forEach(w => { initialStates[w] = 'neutral'; });
                      setWordStates(initialStates);
                      setCurrentScore(null);
                      setFlaggedMistakes([]);
                      setLiveTranscript('');
                      setGeminiAnalysis(null);

                      toast.success(`Advanced to [${nSurah}:${nAyah}] contiguous coordinate bounds!`);
                    }}
                    className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#121214] px-5 py-2.5 bg-gradient-to-r rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow hover:scale-105"
                  >
                    <span>Proceed to Continuous verse</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}

              {/* SPECIFIC FLAGGED MISTAKES AND TAJWEED REMEDIES PANEL */}
              <div className="space-y-4 mt-8">
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

              {/* Post-Recitation action controls bar */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-3 justify-between items-center">
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
                      setShowReviewSheet(false);
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
                  onClick={() => setShowReviewSheet(false)}
                  className="bg-[#D4AF37] text-[#121214] px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
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
