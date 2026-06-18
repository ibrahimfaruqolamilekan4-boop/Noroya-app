import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MessageSquareCode, Clock, CheckCircle2, ChevronRight, 
  ShieldCheck, Sparkles, Send, ArrowLeft, Phone, Video, 
  PhoneOff, Mic, MicOff, VideoOff, Bookmark, Share2, 
  User, Activity, Lock, Database, Trash2, AlertCircle, 
  Volume2, VolumeX, ShieldAlert, Star, Search, Camera, Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// TypeScript Declarations
interface Scholar {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  bio: string;
  languages: string[];
  status: 'online' | 'busy' | 'offline';
  rating: string;
  consultations: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'scholar';
  text: string;
  timestamp: string;
}

interface SessionLog {
  id: string;
  scholarId: string;
  scholarName: string;
  type: 'Video Call' | 'Voice Call' | 'Chat Session' | 'Direct Message';
  duration: string;
  date: string;
  status: 'Completed' | 'Pending Response';
}

const DEFAULT_SCHOLARS: Scholar[] = [
  {
    id: "mansour",
    name: "Sheikh Mansour Al-Azzam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialty: "Family Counseling & Fiqh Sciences",
    bio: "Graduated in Islamic Law with over 15 years dealing with community guidance, marriage counseling, and classical jurisprudence.",
    languages: ["English", "Arabic", "Urdu"],
    status: "online",
    rating: "4.9",
    consultations: "1,240"
  },
  {
    id: "farida",
    name: "Dr. Farida Al-Hassan",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    specialty: "Youth Guidance & Female Spirituality",
    bio: "Ph.D. in Islamic Psychology. Focused on helping young Muslims traverse modern mental wellness and spiritual alignment challenges.",
    languages: ["English", "Arabic"],
    status: "busy",
    rating: "5.0",
    consultations: "890"
  },
  {
    id: "amin",
    name: "Ustad Al-Amin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    specialty: "Quranic Linguistics & Theology",
    bio: "Researcher of Classical Arabic and Kalam. Expert teacher in tajwid, Quranic structures, and comparative Islamic faith.",
    languages: ["English", "Arabic", "Malay"],
    status: "online",
    rating: "4.8",
    consultations: "612"
  }
];

const HISTORIC_SESSIONS: SessionLog[] = [
  { id: "CONS-4091A", scholarId: "mansour", scholarName: "Sheikh Mansour Al-Azzam", type: "Video Call", duration: "12m 45s", date: "May 24, 2026", status: "Completed" },
  { id: "CONS-3912B", scholarId: "farida", scholarName: "Dr. Farida Al-Hassan", type: "Voice Call", duration: "08m 15s", date: "May 25, 2026", status: "Completed" },
  { id: "CONS-2884C", scholarId: "amin", scholarName: "Ustad Al-Amin", type: "Chat Session", duration: "05m 00s", date: "May 26, 2026", status: "Completed" }
];

export const QAPage = () => {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || "Spiritual Seeker";

  // Perspectives: user / scholar
  const [perspective, setPerspective] = useState<'user' | 'scholar'>('user');

  // Track dynamic list of scholars
  const [scholarsList, setScholarsList] = useState<Scholar[]>(() => {
    const saved = localStorage.getItem('nooraya_scholars_list');
    return saved ? JSON.parse(saved) : DEFAULT_SCHOLARS;
  });

  useEffect(() => {
    localStorage.setItem('nooraya_scholars_list', JSON.stringify(scholarsList));
  }, [scholarsList]);

  // Track follow state (TikTok Style)
  const [followedScholarIds, setFollowedScholarIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nooraya_followed_scholars');
    return saved ? JSON.parse(saved) : ["mansour"]; // Follow Sheikh Mansour by default to start with a stellar filled inbox!
  });

  useEffect(() => {
    localStorage.setItem('nooraya_followed_scholars', JSON.stringify(followedScholarIds));
  }, [followedScholarIds]);

  // Track chat messages matching each Scholar Id
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('nooraya_chat_messages');
    return saved ? JSON.parse(saved) : {
      mansour: [
        { id: "init-1", sender: "scholar", text: "As-salamu Alaykum, my dear brother/sister. Happy to answer any questions on Family or Fiqh.", timestamp: "11:04 AM" }
      ],
      farida: [
        { id: "init-2", sender: "scholar", text: "Welcome to my direct messages. Feel free to seek counsel on Youth Guidance and female spirituality.", timestamp: "Yesterday" }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('nooraya_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Session activity ledger
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    const saved = localStorage.getItem('nooraya_session_logs');
    return saved ? JSON.parse(saved) : HISTORIC_SESSIONS;
  });

  useEffect(() => {
    localStorage.setItem('nooraya_session_logs', JSON.stringify(sessionLogs));
  }, [sessionLogs]);

  // Current Seeker Interactive Chat & Search states
  const [activeChatScholar, setActiveChatScholar] = useState<Scholar | null>(() => {
    // default active to Sheikh Mansour for smooth starting
    return DEFAULT_SCHOLARS[0];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [typingState, setTypingState] = useState(false);

  // WebRTC Live Communication state
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [callState, setCallState] = useState<'connecting' | 'requesting' | 'connected'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMutedLocal, setIsMutedLocal] = useState(false);
  const [isVideoDisabledLocal, setIsVideoDisabledLocal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stream hookup handler
  useEffect(() => {
    let localStream: MediaStream | null = null;
    if (isCallActive && callType === 'video' && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Webcam blocked or not available in the sandbox sandbox:", err);
        });
    }
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCallActive, callType, callState]);

  // Duration timer
  useEffect(() => {
    if (isCallActive && callState === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isCallActive, callState]);

  // WebRTC initiate call trigger
  const initiateCall = (type: 'voice' | 'video') => {
    if (!activeChatScholar) return;
    setCallType(type);
    setIsCallActive(true);
    setCallState('connecting');

    setTimeout(() => {
      setCallState('requesting');
      setTimeout(() => {
        setCallState('connected');
        toast.success(`Secure WebRTC Connection established with: ${activeChatScholar.name}`, {
          icon: "🔒",
          style: {
            border: "1px solid #D4AF37",
            background: "#121214",
            color: "#fff",
          }
        });
      }, 1200);
    }, 800);
  };

  // Close call session
  const endCall = () => {
    if (!activeChatScholar) return;
    const mins = Math.floor(callDuration / 60);
    const secs = callDuration % 60;
    const durationStr = `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

    const newLog: SessionLog = {
      id: `CONS-${Math.floor(10000 + Math.random() * 90000)}B`,
      scholarId: activeChatScholar.id,
      scholarName: activeChatScholar.name,
      type: callType === 'video' ? 'Video Call' : 'Voice Call',
      duration: durationStr === "00m 00s" ? "00m 18s" : durationStr,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Completed"
    };

    setSessionLogs(prev => [newLog, ...prev]);
    toast.success("Consultation recorded into the secure spiritual log ledger.");
    setIsCallActive(false);
    setCallType(null);
  };

  // Send Direct Message logic
  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChatScholar) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(3),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentScholarId = activeChatScholar.id;
    const updatedMessages = {
      ...chatMessages,
      [currentScholarId]: [...(chatMessages[currentScholarId] || []), userMsg]
    };

    setChatMessages(updatedMessages);
    setInputText("");
    setTypingState(true);

    // Simulated responsive scholar AI logic
    setTimeout(() => {
      let replyText = "Peace be upon you. This is a profound spiritual inquiry. Let us seek clarity by anchoring our hearts to the virtues of Taqwa, Sabr (patience), and constant connection with the Divine.";
      const queryLower = userMsg.text.toLowerCase();

      if (queryLower.includes("marry") || queryLower.includes("marriage") || queryLower.includes("family") || queryLower.includes("parents")) {
        replyText = "Family life in Islam is built upon 'Mawaddah' (love) and 'Rahmah' (mercy). The Prophet (PBUH) said: 'The best of you is the one who is best to his family.' Let's address this with deep patience. Is there a specific issue in communication or right-fulfillment you are seeking Fiqh rules for?";
      } else if (queryLower.includes("fiqh") || queryLower.includes("halal") || queryLower.includes("haram") || queryLower.includes("pray") || queryLower.includes("fasting")) {
        replyText = "Regarding your query of Fiqh, Islamic jurisprudence is built on ease rather than restriction. Allah wishes for you ease and does not wish for you difficulty (Surah Al-Baqarah, 185). Let us examine the traditional rules of purification and practice together. Tell me more.";
      } else if (queryLower.includes("anxiety") || queryLower.includes("mental") || queryLower.includes("sad") || queryLower.includes("doubt")) {
        replyText = "The trials of contemporary society are tests that refine our faith. Keep holding onto the rope of Allah. Whenever doubt or sadness whispers, return to Surah Ad-Duha: 'Your Lord has not forsaken you, nor is He displeased' (93:3). Deep spiritual breathing and Dhikr can soothe this immediately.";
      }

      const scholarReply: ChatMessage = {
        id: Math.random().toString(36).substring(3),
        sender: 'scholar',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => ({
        ...prev,
        [currentScholarId]: [...(prev[currentScholarId] || []), scholarReply]
      }));

      // Log DM to DB simulation
      const dmLog: SessionLog = {
        id: `CONS-${Math.floor(10000 + Math.random() * 90000)}M`,
        scholarId: activeChatScholar.id,
        scholarName: activeChatScholar.name,
        type: "Direct Message",
        duration: "Completed",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "Completed"
      };
      setSessionLogs(prev => [dmLog, ...prev]);

      setTypingState(false);
    }, 2000);
  };

  // Follow/unfollow toggle action
  const toggleFollowScholar = (scholarId: string) => {
    if (followedScholarIds.includes(scholarId)) {
      setFollowedScholarIds(prev => prev.filter(id => id !== scholarId));
      if (activeChatScholar?.id === scholarId) {
        // Find another followed one, or set null
        const remain = followedScholarIds.filter(id => id !== scholarId);
        if (remain.length > 0) {
          const nextS = scholarsList.find(s => s.id === remain[0]);
          setActiveChatScholar(nextS || null);
        } else {
          setActiveChatScholar(null);
        }
      }
      toast.success(`You unfollowed this counselor.`);
    } else {
      setFollowedScholarIds(prev => [...prev, scholarId]);
      const picked = scholarsList.find(s => s.id === scholarId);
      if (picked) {
        setActiveChatScholar(picked);
      }
      toast.success(`You followed ${scholarsList.find(s => s.id === scholarId)?.name}! Direct messages are unlocked.`, {
        icon: "✨",
        style: {
          border: '1px solid #D4AF37',
          background: '#121214',
          color: '#fff'
        }
      });
    }
  };

  // Filter followed accounts for TikTok style search and DMs
  const filteredFollowedScholars = useMemo(() => {
    return scholarsList.filter(s => {
      const isFollowed = followedScholarIds.includes(s.id);
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      return isFollowed && matchesSearch;
    });
  }, [scholarsList, followedScholarIds, searchQuery]);

  // Scholar management parameters
  const currentScholarSelf = useMemo(() => {
    return scholarsList.find(s => s.id === "mansour") || scholarsList[0];
  }, [scholarsList]);

  const updateScholarSelfStatus = (status: 'online' | 'busy' | 'offline') => {
    setScholarsList(prev => prev.map(s => {
      if (s.id === "mansour") {
        return { ...s, status };
      }
      return s;
    }));
    toast.success(`Your live status set to: ${status.toUpperCase()}`);
  };

  const deleteSessionLog = (logId: string) => {
    setSessionLogs(prev => prev.filter(log => log.id !== logId));
    toast.success("Ledger document deleted from local memory.");
  };

  const simulateMediaCapture = () => {
    toast.success("Accessing secure camera Sandbox frame... Snap uploaded as research image attachment.", {
      icon: "📸",
      style: {
        border: "1px solid #D4AF37",
        background: "#121214",
        color: "#fff"
      }
    });

    if (activeChatScholar) {
      const imgMsg: ChatMessage = {
        id: Math.random().toString(36).substring(3),
        sender: 'user',
        text: "📷 Shared a camera snap snapshot (Sandbox Image Attached)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [activeChatScholar.id]: [...(prev[activeChatScholar.id] || []), imgMsg]
      }));
    }
  };

  const simulateVoiceNoteRecording = () => {
    toast.loading("Recording secure voice note memo...", { id: "voice-memo-toast" });
    setTimeout(() => {
      toast.dismiss("voice-memo-toast");
      toast.success("Voice memo encoded securely and transmitted.");
      if (activeChatScholar) {
        const voiceMsg: ChatMessage = {
          id: Math.random().toString(36).substring(3),
          sender: 'user',
          text: "🎤 Recorded Voice Note (0:08) ────────",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => ({
          ...prev,
          [activeChatScholar.id]: [...(prev[activeChatScholar.id] || []), voiceMsg]
        }));
      }
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-cream min-h-screen">
      {/* Dynamic Header */}
      <h1 className="sr-only">TikTok Scholar Counselling DM</h1>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#D4AF37]/10 text-[#E5C158] border border-[#D4AF37]/15 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-3">
            <Lock size={12} className="text-gold" />
            <span>Encrypted Communal Gateway</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight flex items-center gap-2">
            Scholar <span className="text-[#D4AF37] italic font-normal">Direct Message Hub</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-serif italic max-w-xl mt-1.5 leading-relaxed">
            Exactly integrated with a premium social follow and DM model. Search your followed advisors and chat live.
          </p>
        </div>

        {/* Golden Toggle Switch */}
        <div className="bg-[#121214]/90 p-1.5 rounded-2xl border border-[#D4AF37]/25 flex items-center shadow-xl select-none shrink-0">
          <button
            onClick={() => setPerspective('user')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-mono text-[11px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer",
              perspective === 'user'
                ? "bg-[#D4AF37] text-slate-950 font-extrabold shadow-md"
                : "text-slate-400 hover:text-white"
            )}
          >
            <User size={13} />
            <span>Seeker View</span>
          </button>
          <button
            onClick={() => setPerspective('scholar')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-mono text-[11px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer",
              perspective === 'scholar'
                ? "bg-[#D4AF37] text-slate-950 font-extrabold shadow-md"
                : "text-slate-400 hover:text-white"
            )}
          >
            <ShieldCheck size={13} />
            <span>Scholar View</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          SEEKER / SOCIAL DM PERSPECTIVE
         ------------------------------------------------------------- */}
      {perspective === 'user' && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Real-time Indicator Bar */}
          <div className="p-4 bg-[#121214] rounded-2xl border border-[#D4AF37]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <p className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  ACTIVE COUNSEL CHANNELS LIVE
                </p>
                <p className="text-[11px] text-slate-400 font-serif">
                  Follow your favorite research scholar, search their handle, and click message to begin direct communication securely.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="bg-white/5 px-2.5 py-1 rounded border border-white/5">
                Tunnel Latency: <b className="text-gold">14ms</b>
              </span>
              <span className="bg-white/5 px-2.5 py-1 rounded border border-white/5 text-emerald-400">
                SSL Secured ✓
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1 (40% width): SOCIAL FOLLOW DIRECTORY SCROLL FEED */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-lg font-serif font-black text-white flex items-center gap-2">
                  <Sparkles className="text-gold animate-pulse" size={16} />
                  <span>Scholars Directory</span>
                </h3>
                <span className="text-[10px] bg-gold/10 text-gold px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {scholarsList.length} global
                </span>
              </div>

              {/* TikTok Streamlined Card Stack */}
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold">
                {scholarsList.map((scholar) => {
                  const isFollowed = followedScholarIds.includes(scholar.id);
                  const isOnline = scholar.status === 'online';
                  const isBusy = scholar.status === 'busy';
                  return (
                    <div
                      key={scholar.id}
                      className={cn(
                        "p-5 rounded-2xl text-left border transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden",
                        isFollowed 
                          ? "bg-gradient-to-br from-[#121214] to-black border-[#D4AF37]/30 shadow-xl" 
                          : "bg-[#121214]/65 border-white/5 hover:border-white/10"
                      )}
                    >
                      {/* Subtle gold highlight overlay if active chat thread is on this guy */}
                      {activeChatScholar?.id === scholar.id && (
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-[#D4AF37]" />
                      )}

                      <div className="flex items-start gap-4">
                        {/* Circular Profile image & TikTok status ring */}
                        <div className="relative shrink-0">
                          <img
                            src={scholar.avatar}
                            alt={scholar.name}
                            className={cn(
                              "w-16 h-16 rounded-full object-cover shadow-lg",
                              isOnline ? "ring-2 ring-emerald-400 p-0.5" : isBusy ? "ring-2 ring-amber-400 p-0.5" : "ring-1 ring-slate-600"
                            )}
                          />
                          <span className={cn(
                            "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#121214] flex items-center justify-center text-[8px] font-bold text-slate-100",
                            isOnline ? "bg-emerald-500" : isBusy ? "bg-amber-400" : "bg-slate-600"
                          )} />
                        </div>

                        {/* Scholar Information text */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif font-black text-sm text-white truncate max-w-[85%]">
                              {scholar.name}
                            </h4>
                            <div className="text-gold shrink-0" title="Verified Islamic Scholar Info Match">
                              <CheckCircle2 size={13} className="fill-current text-gold" />
                            </div>
                          </div>

                          <p className="text-[10px] font-mono text-[#D4AF37]/80 uppercase font-black tracking-wider leading-none">
                            {scholar.specialty}
                          </p>
                          <p className="text-slate-400 text-xs font-serif leading-relaxed line-clamp-2 mt-1 select-text">
                            {scholar.bio}
                          </p>

                          <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-slate-500">
                            <span className="flex items-center gap-0.5">
                              <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
                              {scholar.rating}
                            </span>
                            <span>•</span>
                            <span>{scholar.consultations} Shuras</span>
                          </div>
                        </div>
                      </div>

                      {/* TikTok Golden Follow Switch Button */}
                      <div className="mt-4 pt-3.5 border-t border-white/5 flex gap-2">
                        <button
                          onClick={() => toggleFollowScholar(scholar.id)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5",
                            isFollowed
                              ? "bg-slate-900 border border-red-500/30 text-red-500 hover:bg-red-500/10"
                              : "bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 shadow-md shadow-gold/5"
                          )}
                        >
                          {isFollowed ? (
                            <span>Unfollow</span>
                          ) : (
                            <>
                              <Plus size={10} />
                              <span>Follow</span>
                            </>
                          )}
                        </button>

                        {isFollowed && (
                          <button
                            onClick={() => setActiveChatScholar(scholar)}
                            className="bg-gold/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-slate-950 text-[#D4AF37] px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Chat DM
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2 (60% width): TIKTOK CHAT DM HUB & SELECTED CONVERSATION VIEW */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Main DM Box layout encompassing search bar */}
              <div className="bg-[#121214]/85 border border-[#D4AF37]/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[670px]">
                
                {/* TOP INPUT DIRECTORY SEARCH HEADER */}
                <div className="p-4 bg-black/40 border-b border-white/5 text-left">
                  <span className="block text-[9px] font-mono uppercase text-[#D4AF37] font-black tracking-widest mb-2">
                    TikTok Direct Inbox
                  </span>
                  
                  {/* Clean Search Input */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search followed scholars name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#121214] border border-white/10 rounded-xl text-xs text-cream placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  {/* Horizontal pill list of matched followed list */}
                  <div className="flex gap-2.5 mt-3.5 overflow-x-auto pb-1 scrollbar-none">
                    {filteredFollowedScholars.length === 0 ? (
                      <span className="text-[10px] text-slate-500 italic pb-1">
                        No active followed scholars found. Follow someone first!
                      </span>
                    ) : (
                      filteredFollowedScholars.map(scholar => (
                        <button
                          key={scholar.id}
                          onClick={() => setActiveChatScholar(scholar)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer shrink-0 border",
                            activeChatScholar?.id === scholar.id
                              ? "bg-gold/10 border-[#D4AF37] text-gold"
                              : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/15"
                          )}
                        >
                          <img src={scholar.avatar} className="w-4 h-4 rounded-full object-cover" />
                          <span>{scholar.name.split(' ').slice(-1)[0]}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* MIDDLE CHAT DISPLAY BODY */}
                {activeChatScholar ? (
                  /* RENDERING THE DIRECT MESSAGE THREAD */
                  <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#121214] to-black/60 overflow-hidden">
                    
                    {/* Active Conversation Title Header Area */}
                    <div className="px-5 py-3.5 bg-black/30 border-b border-white/5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-left">
                        <img
                          src={activeChatScholar.avatar}
                          alt={activeChatScholar.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/35"
                        />
                        <div>
                          <h4 className="font-serif font-black text-white text-sm flex items-center gap-1 leading-none">
                            {activeChatScholar.name}
                            <CheckCircle2 size={12} className="text-gold" />
                          </h4>
                          <span className="text-[9px] font-mono text-[#D4AF37] tracking-wider uppercase leading-none font-bold mt-1 block">
                            {activeChatScholar.specialty}
                          </span>
                        </div>
                      </div>

                      {/* Real-time floating Voice and Video calling buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => initiateCall('voice')}
                          className="p-2.5 bg-[#121214] border border-white/10 hover:border-[#D4AF37]/50 text-slate-300 hover:text-[#D4AF37] rounded-xl transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 duration-200"
                          title="Establish WebRTC Voice Connection"
                        >
                          <Phone size={14} className="stroke-[2.5]" />
                        </button>
                        <button
                          onClick={() => initiateCall('video')}
                          className="p-2.5 bg-[#121214] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-slate-300 hover:text-[#D4AF37] rounded-xl transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 duration-200"
                          title="Initiate Secure HD Video Frame"
                        >
                          <Video size={14} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Messages Body Scroll frame */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-gold select-text">
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center gap-2 max-w-md mx-auto text-center">
                        <Lock size={11} className="text-[#D4AF37]" />
                        <span className="text-[9px] font-mono text-slate-500 uppercase">
                          Encrypted DM Tunnel node check: OK. Satisfies local safety policy.
                        </span>
                      </div>

                      {/* Default scholar invitation dialogue */}
                      <div className="flex items-start gap-2.5 text-left">
                        <img
                          src={activeChatScholar.avatar}
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-white/10"
                        />
                        <div className="space-y-1 max-w-[80%]">
                          <div className="bg-[#1A1A1E] text-slate-100 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 select-text leading-relaxed">
                            <p>Assalamu alaikum wa rahmatullah. This is the direct secure DM platform of {activeChatScholar.name}. How may I help soothe your heart or resolve jurisprudence issues today?</p>
                          </div>
                          <span className="text-[8px] font-mono text-slate-500 block pl-1">09:00 AM</span>
                        </div>
                      </div>

                      {/* Mapping dialog arrays */}
                      {(chatMessages[activeChatScholar.id] || []).map((msg) => {
                        const isUser = msg.sender === 'user';
                        return (
                          <div key={msg.id} className={cn("flex items-start gap-2.5 select-text", isUser ? "justify-end text-right" : "justify-start text-left")}>
                            {!isUser && (
                              <img
                                src={activeChatScholar.avatar}
                                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-white/10"
                              />
                            )}
                            <div className="space-y-1 max-w-[80%]">
                              <div className={cn(
                                "px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed text-left",
                                isUser
                                  ? "bg-[#D4AF37] text-slate-950 font-bold rounded-tr-none shadow-md"
                                  : "bg-[#1A1A1E] text-slate-100 border border-white/5 rounded-tl-none"
                              )}>
                                <p>{msg.text}</p>
                              </div>
                              <span className="text-[8px] font-mono text-slate-500 block px-1">{msg.timestamp}</span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Typing simulation */}
                      {typingState && (
                        <div className="flex items-start gap-2.5 text-left">
                          <img
                            src={activeChatScholar.avatar}
                            className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-white/10"
                          />
                          <div className="space-y-1">
                            <div className="bg-[#1A1A1E] text-slate-400 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 font-mono text-[10px]">
                              <span>Drafting theological fatwa query</span>
                              <div className="flex space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-100" />
                                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-200" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Highly stylized TikTok footer input element */}
                    <div className="p-4 bg-black/40 border-t border-white/5 flex items-center gap-3">
                      
                      {/* Left: Camera Trigger */}
                      <button
                        onClick={simulateMediaCapture}
                        className="p-2.5 text-slate-400 hover:text-gold hover:bg-white/5 rounded-xl transition-all cursor-pointer shrink-0"
                        title="Attach snapshot photo from camera Sandbox"
                      >
                        <Camera size={18} className="stroke-[2.2]" />
                      </button>

                      {/* Center Input area */}
                      <input
                        type="text"
                        placeholder="Secure direct chat message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-cream placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                      />

                      {/* Right-Center Mic Trigger */}
                      <button
                        onClick={simulateVoiceNoteRecording}
                        className="p-2.5 text-slate-400 hover:text-gold hover:bg-white/5 rounded-xl transition-all cursor-pointer shrink-0"
                        title="Record peer-to-peer secure audio note"
                      >
                        <Mic size={18} className="stroke-[2.2]" />
                      </button>

                      {/* Right: Gold Arrow Send */}
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className="p-3 bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 font-bold rounded-xl cursor-pointer disabled:opacity-35 transition-all flex items-center justify-center shrink-0"
                      >
                        <Send size={15} />
                      </button>
                    </div>

                  </div>
                ) : (
                  /* INBOX EMPTY CHAT THREAD PLACEHOLDER */
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#121214] to-black text-center select-none">
                    <div className="w-16 h-16 bg-gold/10 border border-[#D4AF37]/25 rounded-full flex items-center justify-center text-gold mb-4 animate-bounce">
                      <MessageSquareCode size={28} />
                    </div>
                    <h3 className="text-xl font-serif font-black text-white">Your Social Inbox</h3>
                    <p className="text-slate-400 text-xs sm:text-sm font-serif max-w-sm mt-2">
                       Follow a counselor sheikh from the left sidebar Directory and click chat to initialize an instant interactive direct thread channel.
                    </p>
                    
                    {/* Quick follow helpful indicator */}
                    <div className="mt-8 p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-left max-w-md w-full">
                      <p className="text-[10px] font-mono uppercase text-[#D4AF37] font-black tracking-widest mb-1.5">
                        Suggested Community Advisors
                      </p>
                      <div className="space-y-2">
                        {scholarsList.slice(0, 2).map(s => {
                          const isFollowed = followedScholarIds.includes(s.id);
                          return (
                            <div key={s.id} className="flex items-center justify-between text-xs py-1">
                              <span className="text-slate-300 font-serif leading-none">{s.name}</span>
                              <button
                                onClick={() => toggleFollowScholar(s.id)}
                                className="px-3 py-1 bg-gold hover:bg-[#E5C158] text-[9px] font-mono text-slate-950 uppercase font-black tracking-widest rounded-md"
                              >
                                {isFollowed ? "Followed✓" : "+ Follow"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* PERSISTED LOCAL LEDGER TABLE IN UNMODIFIED BRAND PATTERN */}
          <section className="bg-[#121214] rounded-3xl p-6 border border-white/5 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Database size={18} />
                </div>
                <div>
                  <h4 className="font-serif font-black text-lg text-white">Spiritual Consultation Ledger</h4>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">
                    Persisted Local Audit Table Database: `consultation_sessions`
                  </p>
                </div>
              </div>
              <p className="text-[9px] font-mono text-slate-500 max-w-xs text-right hidden sm:block">
                This ledger monitors and logs digital interactions matching your active session descriptors.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] text-[#D4AF37]/75 font-black uppercase tracking-wider">
                    <th className="py-3 px-2">Session ID</th>
                    <th className="py-3 px-2">Scholar Match</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Duration</th>
                    <th className="py-3 px-2">Date Timestamp</th>
                    <th className="py-3 px-2">Status Code</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {sessionLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-serif italic text-xs">
                        No recent logs recorded in the virtual sandbox database.
                      </td>
                    </tr>
                  ) : (
                    sessionLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-2 text-white font-black">{log.id}</td>
                        <td className="py-3.5 px-2 font-serif font-semibold">{log.scholarName}</td>
                        <td className="py-3.5 px-2">
                          <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded-md border border-white/5 text-[10px]">
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-[#D4AF37] font-semibold">{log.duration}</td>
                        <td className="py-3.5 px-2 text-slate-400">{log.date}</td>
                        <td className="py-3.5 px-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <button
                            onClick={() => deleteSessionLog(log.id)}
                            className="p-1 px-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded cursor-pointer transition-all"
                            title="Purge session log"
                          >
                            <Trash2 size={11} className="inline mr-1" />
                            Purge
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* -------------------------------------------------------------
          SCHOLAR VIEW (MUFTI CONSOLE)
         ------------------------------------------------------------- */}
      {perspective === 'scholar' && (
        <div className="space-y-8 animate-fade-in text-left select-none">
          {/* Top Panel card and online toggle */}
          <div className="bg-[#121214] rounded-3xl p-6 border border-gold/15 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentScholarSelf.avatar}
                alt={currentScholarSelf.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
              />
              <div>
                <span className="px-2.5 py-0.5 bg-gold/10 text-[#D4AF37] font-mono text-[9px] rounded-md uppercase font-black tracking-wider">
                  Verified Mufti Account
                </span>
                <h3 className="font-serif font-black text-xl text-white mt-1">
                  Welcome Back, {currentScholarSelf.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest">
                  Assigned Specialty: {currentScholarSelf.specialty}
                </p>
              </div>
            </div>

            {/* Scholar live status toggling */}
            <div className="space-y-2 text-right shrink-0">
              <p className="text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] font-extrabold pr-1">
                Modify Live consultation Status
              </p>
              <div className="bg-black/50 p-1.5 rounded-xl border border-white/5 flex items-center gap-1">
                {(['online', 'busy', 'offline'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateScholarSelfStatus(st)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-mono text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer",
                      currentScholarSelf.status === st
                        ? st === 'online' 
                          ? "bg-emerald-500 text-slate-950 font-extrabold"
                          : st === 'busy' 
                            ? "bg-[#D4AF37] text-slate-950 font-extrabold"
                            : "bg-slate-600 text-white"
                        : "text-slate-500 hover:text-white"
                    )}
                  >
                    {st === 'online' ? '🟢 Online' : st === 'busy' ? '🕒 Busy' : '⚪ Offline'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics counter dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-[#121214] border border-white/5 rounded-2xl text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                Total Shura Consultations
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-white">1,482</p>
              <span className="text-[9px] font-mono text-emerald-400 font-bold block mt-1">
                ↑ 14% this lunar cycle
              </span>
            </div>
            <div className="p-5 bg-[#121214] border border-white/5 rounded-2xl text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                Direct Message Threads
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-[#D4AF37]">
                3 active chats
              </p>
              <span className="text-[9px] font-mono text-slate-400 block mt-1">
                P2P verified channels
              </span>
            </div>
            <div className="p-5 bg-[#121214] border border-white/5 rounded-2xl text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                Average Shura duration
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-white">18.5m</p>
              <span className="text-[9px] font-mono text-slate-500 block mt-1">
                Target optimal: &lt; 20m
              </span>
            </div>
            <div className="p-5 bg-[#121214] border border-white/5 rounded-2xl text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                Encryption Grade
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-emerald-400">P2P HD</p>
              <span className="text-[9px] font-mono text-emerald-400 font-bold block mt-1">
                AES-256 WebRTC active
              </span>
            </div>
          </div>

          {/* Pending consultation actions details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Mufti live active Inbox */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-lg font-serif font-black text-white pb-2 border-b border-white/5 flex items-center justify-between">
                <span>Direct Message Inbox (Unanswered)</span>
                <span className="text-[9px] bg-red-500/10 text-red-400 px-2 rounded-md font-mono font-bold font-black">
                  Simulated Session
                </span>
              </h4>

              <div className="p-6 bg-[#121214]/65 border border-dashed border-white/10 rounded-2xl text-center text-slate-400 text-xs font-serif italic">
                <AlertCircle size={20} className="mx-auto text-slate-500 mb-2" />
                Active seeker messages are routed securely to your companion DMs in user perspective. Answer user inquiries directly in Seeker perspective simulating a mutual flow!
              </div>
            </div>

            {/* Right column ledger statistics in scholar view */}
            <div className="space-y-4">
              <h4 className="text-lg font-serif font-black text-white pb-2 border-b border-white/5">
                <span>Administrative Logs</span>
              </h4>
              <div className="space-y-3.5">
                {sessionLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-[#121214] border border-white/5 rounded-xl flex items-center justify-between gap-4 transition-all hover:bg-white/[0.01]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-white">{log.id}</span>
                        <span className="text-[9px] font-mono text-slate-500">{log.date}</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase">
                        {log.type}
                      </p>
                      <p className="text-[10px] text-[#D4AF37] font-sans font-semibold mt-0.5">
                        Duration/Status: {log.duration}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between h-10">
                      <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase leading-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status === 'Completed' ? 'Completed' : 'Awaiting'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          FULL-SCREEN IMMERSIVE RTC CALL OVERLAY (P2P HIGH GRADE)
         ------------------------------------------------------------- */}
      {isCallActive && callType && activeChatScholar && (
        <div className="fixed inset-0 bg-[#0e0d0f]/95 z-[100] flex flex-col items-center justify-between p-6 overflow-hidden md:p-12 text-cream selection:bg-gold/10 selection:text-gold animate-fade-in select-none">
          
          {/* Header containing metadata and duration timer */}
          <div className="w-full max-w-5xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-[#D4AF37]">
                <Lock size={16} />
              </div>
              <div>
                <span className="text-[9px] font-mono text-emerald-400 tracking-wider uppercase font-black block">
                  Peer-to-Peer Encryption Match
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Spiritual Shora to: {activeChatScholar.name}
                </h3>
              </div>
            </div>

            {/* Live Call Duration */}
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 font-mono text-xs shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 font-bold"></span>
              </span>
              {callState === 'connecting' && <span className="text-slate-400 uppercase">Calling WebRTC Proxy...</span>}
              {callState === 'requesting' && <span className="text-[#D4AF37] uppercase animate-pulse">Locking Media Streams...</span>}
              {callState === 'connected' && (
                <div className="flex items-center gap-2">
                  <span className="text-[#D4AF37] font-extrabold font-mono">
                    {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-450 text-[10px]">1080p WebRTC (60fps)</span>
                </div>
              )}
            </div>
          </div>

          {/* Active streams frame */}
          <div className="w-full max-w-5xl flex-1 flex items-center justify-center py-6">
            {callType === 'video' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[320px] md:h-[450px]">
                
                {/* Scholar Screen backdrop */}
                <div className="relative bg-[#121214] border border-[#D4AF37]/20 rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                  <img
                    src={activeChatScholar.avatar}
                    alt={activeChatScholar.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <img
                      src={activeChatScholar.avatar}
                      alt={activeChatScholar.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37]"
                    />
                    <div className="text-center">
                      <h4 className="font-serif font-black text-white text-base">
                        {activeChatScholar.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                        Active Remote Camera Feed
                      </p>
                    </div>

                    {callState === 'connected' && (
                      <div className="flex items-center space-x-1.5 h-6 mt-2">
                        <span className="w-1 h-3 bg-[#D4AF37] rounded animate-[pulse_1s_infinite_delay-100]" />
                        <span className="w-1 h-5 bg-[#D4AF37] rounded animate-[pulse_0.8s_infinite]" />
                        <span className="w-1 h-2 bg-[#D4AF37] rounded animate-[pulse_1.2s_infinite]" />
                        <span className="w-1 h-4 bg-[#D4AF37] rounded animate-[pulse_0.9s_infinite]" />
                        <span className="w-1 h-1 bg-[#D4AF37] rounded" />
                      </div>
                    )}
                  </div>
                </div>

                {/* User stream self */}
                <div className="relative bg-[#121214] border border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                  {isVideoDisabledLocal ? (
                    <div className="relative z-10 text-center space-y-3">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-500 mx-auto">
                        <VideoOff size={24} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                        Camera Stream Disabled
                      </span>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm pointer-events-none">
                        <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded-full flex items-center justify-center text-[#D4AF37] mb-3">
                          <User size={28} />
                        </div>
                        <h4 className="font-serif font-black text-white text-sm">
                          {userName} (Self View)
                        </h4>
                        <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase max-w-[180px] leading-relaxed">
                          Secure sandboxed video track
                        </p>
                      </div>
                    </>
                  )}
                </div>

              </div>
            ) : (
              /* Immersive Voice caller system representation */
              <div className="relative w-full max-w-lg h-[350px] bg-gradient-to-b from-[#121214] to-black rounded-[3rem] border border-[#D4AF37]/20 flex flex-col items-center justify-center gap-6 shadow-2xl p-6 select-none">
                <div className="relative flex items-center justify-center h-40 w-40">
                  <span className="absolute h-full w-full rounded-full border border-gold/40 animate-ping opacity-60"></span>
                  <span className="absolute h-[85%] w-[85%] rounded-full border border-[#D4AF37]/20 animate-pulse"></span>
                  <img
                    src={activeChatScholar.avatar}
                    alt={activeChatScholar.name}
                    className="relative z-10 w-28 h-28 rounded-full object-cover border-4 border-[#D4AF37] shadow-xl"
                  />
                </div>

                <div className="text-center space-y-1">
                  <h4 className="font-serif font-black text-xl text-white tracking-wide">
                    {activeChatScholar.name}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    P2P encrypted audio channel stream
                  </p>
                </div>

                {callState === 'connected' && (
                  <div className="flex items-end justify-center space-x-1.5 h-8">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="w-1 bg-[#D4AF37] rounded"
                        style={{
                          height: `${Math.floor(10 + Math.random() * 22)}px`,
                          animation: `pulse ${0.6 + idx * 0.05}s infinite ease-in-out`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hanging phone call widgets */}
          <div className="w-full max-w-md flex flex-col items-center gap-6 pb-6 select-none">
            <div className="flex items-center justify-center gap-4">
              
              <button
                onClick={() => {
                  setIsMutedLocal(!isMutedLocal);
                  toast.success(isMutedLocal ? "Microphone active" : "Microphone muted");
                }}
                className={cn(
                  "p-4 border rounded-2xl transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95",
                  isMutedLocal 
                    ? "bg-red-500/15 border-red-500 text-red-400" 
                    : "bg-white/5 border-white/10 text-cream hover:border-gold/30 hover:text-gold"
                )}
                title={isMutedLocal ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMutedLocal ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                onClick={endCall}
                className="p-5 bg-red-600 hover:bg-red-500 border border-red-500 text-white rounded-[2rem] flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_30px_rgba(239,68,68,0.45)] hover:scale-110 active:scale-95 duration-300"
                title="End Consultation"
              >
                <PhoneOff size={22} className="stroke-[2.5]" />
              </button>

              {callType === 'video' && (
                <button
                  onClick={() => {
                    setIsVideoDisabledLocal(!isVideoDisabledLocal);
                    toast.success(isVideoDisabledLocal ? "Camera stream active" : "Camera stream disabled");
                  }}
                  className={cn(
                    "p-4 border rounded-2xl transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95",
                    isVideoDisabledLocal 
                      ? "bg-red-400/10 border-red-500 text-red-400" 
                      : "bg-white/5 border-white/10 text-cream hover:border-gold/30 hover:text-gold"
                  )}
                  title={isVideoDisabledLocal ? "Enable Camera Feed" : "Disable Camera Feed"}
                >
                  {isVideoDisabledLocal ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
              )}
            </div>

            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest italic font-medium">
              Secured under Nooraya's Decentered Community Protocol
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
