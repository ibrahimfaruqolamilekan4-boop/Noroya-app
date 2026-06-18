import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Bot, User, Sparkles, Shield, Trash2, Info, Moon, Sun, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const askNoorAI = async (contents: any[], systemInstruction: string) => {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contents, systemInstruction }),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "The celestial connection was briefly eclipsed.");
  }
  const data = await response.json();
  return data.text;
};

export const AICounselor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  // Load History
  useEffect(() => {
    const loadHistory = async () => {
      if (profile?.uid) {
        setIsInitialLoad(true);
        try {
          const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          
          const q = query(
            collection(db, 'noor_chats'),
            where('userId', '==', profile.uid),
            orderBy('updatedAt', 'desc'),
            limit(1)
          );
          
          const snap = await getDocs(q);
          if (!snap.empty) {
            const data = snap.docs[0].data();
            setMessages(data.messages || []);
          }
        } catch (error) {
          console.error("Failed to load history:", error);
        } finally {
          setIsInitialLoad(false);
        }
      } else {
        setIsInitialLoad(false);
      }
    };
    
    loadHistory();
  }, [profile?.uid]);

  useEffect(() => {
    if (location.state?.initialMessage && messages.length === 0 && !isInitialLoad) {
      handleAutoSubmit(location.state.initialMessage);
      // Clear state so it doesn't trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isInitialLoad]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAutoSubmit = async (text: string) => {
    const userMessage: Message = { role: 'user', text };
    setMessages([{ role: 'user', text }]);
    setIsLoading(true);

    try {
      const systemInstruction = `You are 'Noor', an Islamic AI Counselor. 
      The user has just taken their Shahada (Declaration of Faith). 
      Respond with extreme warmth, joy, and welcome. 
      Provide a 'Welcome Message' that guides them on their first steps (how to pray, where to learn more).
      Keep it celebratory and light.`;

      const contents = [{ role: 'user', parts: [{ text }] }];
      const modelText = await askNoorAI(contents, systemInstruction);

      const newMessages: Message[] = [{ role: 'user', text }, { role: 'model', text: modelText || "Welcome home! I am here to guide you." }];
      setMessages(newMessages);
      
      // Persist if not secret
      if (!isSecretMode && profile?.uid) {
        dbService.saveNoorChat(profile.uid, newMessages).catch(console.error);
      }
    } catch (error: any) {
      console.error("AI Error:", error?.message || String(error));
      setMessages(prev => [...prev, { role: 'model', text: "Welcome home! I am reflecting on your beautiful transition. How can I assist your first steps?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemInstruction = `You are 'Noor', an Islamic AI Counselor and Dream Interpreter. 
      Your mission is to provide Nasiha (sincere advice) to help users grow closer to Allah.
      
      Guidelines:
      1. Base your advice on the Quran and Verified Sunnah.
      2. Use empathetic, comforting language. Incorporate Ayahs and Hadiths where appropriate.
      3. Dream Interpretation: Always state: 'This is an educational insight based on Islamic tradition, not divine prophecy. Allah knows best.'
      4. When users express distress, offer words of Sabr (patience) and Tawakkul (trust in Allah).
      5. Keep responses concise yet deeply meaningful.
      6. If a question is outside Islamic scope or harmful, gently redirect them to spiritual growth.
      7. Be inclusive to both Muslims and those curious about Islam.`;

      const contents = [...messages, userMessage].map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const modelText = await askNoorAI(contents, systemInstruction);

      setMessages(prev => {
        const newMessages: Message[] = [...prev, { role: 'model', text: modelText || "I am reflecting on your words. Please try again." }];
        // Persist if not secret
        if (!isSecretMode && profile?.uid) {
          dbService.saveNoorChat(profile.uid, newMessages).catch(console.error);
        }
        return newMessages;
      });
    } catch (error: any) {
      console.error("AI Error:", error?.message || String(error));
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I am currently disconnected from the light. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (confirm("Clear your heart and this conversation?")) {
      setMessages([]);
      if (!isSecretMode && profile?.uid) {
        try {
          const { collection, query, where, getDocs, deleteDoc, doc } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const q = query(collection(db, 'noor_chats'), where('userId', '==', profile.uid));
          const snap = await getDocs(q);
          const deletes = snap.docs.map(d => deleteDoc(doc(db, 'noor_chats', d.id)));
          await Promise.all(deletes);
        } catch (e) {
          console.error("Failed to clear cloud history:", e);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-8 islamic-pattern">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 noor-glow">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-gold transition-colors mr-2 hidden sm:block"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-2xl text-gold font-serif noor-glow-sm">نور</span>
            <div className="h-8 w-px bg-gold/20" />
            <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center shadow-lg">
              <Bot size={28} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-cream">Noor AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-gold font-black">Celestial Counselor</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsSecretMode(!isSecretMode)}
            className={cn(
              "p-3 rounded-full transition-all flex items-center space-x-2 border",
              isSecretMode ? "bg-gold text-starry-teal border-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" : "bg-white/5 text-slate-400 border-white/10 hover:border-gold/30"
            )}
          >
            <Shield size={18} />
            <span className="text-[10px] font-black uppercase tracking-tighter hidden sm:block">Secret Mode</span>
          </button>
          <button 
            onClick={clearChat}
            className="p-3 rounded-full bg-white/5 text-slate-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-6 scrollbar-hide">
        {isInitialLoad ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="animate-spin text-gold mb-4" size={32} />
            <p className="text-gold/60 text-[10px] font-black uppercase tracking-[0.3em]">Restoring Sanctuary...</p>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6 noor-glow">
                <Sparkles size={40} />
              </div>
              <h2 className="text-2xl font-serif mb-4 text-cream">Salam, I am Noor.</h2>
              <p className="text-slate-400 max-w-xs mx-auto text-sm">
                Ask about faith, share your dreams, or seek a moment of peace. 
                Everything discussed here is between your soul and the light.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 max-w-md mx-auto">
                {[
                  "Help me understand a dream...",
                  "I'm feeling anxious today...",
                  "Explain an Ayah about mercy...",
                  "Seeking advice on patience..."
                ].map((hint) => (
                  <button 
                    key={hint}
                    onClick={() => setInput(hint)}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-300 hover:border-gold/50 hover:bg-gold/5 transition-all text-left group"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-[2rem] p-6 shadow-xl",
                message.role === 'user' 
                  ? "bg-gold text-starry-teal-dark font-medium rounded-tr-none" 
                  : "glass-card rounded-tl-none text-slate-100"
              )}>
                <div className="flex items-center space-x-2 mb-2 opacity-50">
                  {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {message.role === 'user' ? 'You' : 'Noor'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-card rounded-[2rem] rounded-tl-none p-6 flex space-x-2">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-gold rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-gold rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-gold rounded-full" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-2 pr-4 shadow-2xl focus-within:border-gold/50 transition-all">
          <button type="button" className="p-4 text-slate-400 hover:text-gold transition-colors">
            <Info size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for peace..."
            className="flex-1 bg-transparent border-none outline-none text-cream px-2 py-4 text-sm placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gold text-starry-teal-dark p-4 rounded-full shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center mt-4 text-[9px] text-slate-500 uppercase tracking-widest font-black">
          {isSecretMode ? "Locked in Secret Mode • No logs kept" : "Noor AI • Spiritual Guidance Assistant"}
        </p>
      </form>
    </div>
  );
};
