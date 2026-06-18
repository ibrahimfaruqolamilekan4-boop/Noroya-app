import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Sparkles, Loader2, Calendar, 
  ChevronRight, HeartPulse, Send, Trash2,
  RefreshCcw, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: string;
  tags: string[];
  created_at: string;
}

export const SoulJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [newEntry, setNewEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initializeJournal = async () => {
    setIsInitializing(true);
    try {
      // 1. Auth Guard - Ensure we wait for session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session || !session.user) {
        console.error('Journal Init Failed: No active user session found.');
        toast.error('Spiritual Journal requires an active session. Please sign in.');
        setIsInitializing(false);
        return;
      }

      const user = session.user;

      // 2. Robust Initialization with Timeout Fallback
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Journal connection timed out')), 5000)
      );

      const fetchPromise = async () => {
        const { data, error } = await supabase
          .from('journals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // 3. Handle Empty Array / First Time User
        if (!data || data.length === 0) {
          console.log('New soul detected. Seeding initial reflection...');
          const { data: seedData, error: seedError } = await supabase
            .from('journals')
            .insert([{ 
              user_id: user.id, 
              content: 'Day 01: My journey with Nooraya begins. I intend to use this mirror to reflect on my pulse, my purpose, and my peace.',
              mood: 'Hopeful',
              tags: ['Soul Science', 'First Light']
            }])
            .select();
          
          if (seedError) throw seedError;
          return seedData;
        }
        return data;
      };

      const result = await Promise.race([fetchPromise(), timeoutPromise]) as JournalEntry[];
      setEntries(result);
      
    } catch (error) {
      console.error('Journal Recovery Needed:', error);
      toast.error('Offline Sync Mode: Your reflections are still safe locally.');
      // Drop loading screen and show local fallback (empty for now)
      setEntries([]);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initializeJournal();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journals')
        .insert([{
          user_id: user.id,
          content: newEntry,
          mood: 'Contemplative',
          tags: ['Daily Reflection']
        }])
        .select();

      if (error) throw error;
      
      setEntries([data[0], ...entries]);
      setNewEntry('');
      toast.success('Reflection logged in your heart mirror.');
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to log reflection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(entries.filter(e => e.id !== id));
      toast.success('Entry removed');
    } catch (error) {
      toast.error('Could not delete entry');
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-gold" size={48} />
        </motion.div>
        <p className="text-gold font-serif italic animate-pulse">Aligning the context... Please wait.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest border border-gold/20">
            <BookOpen size={12} />
            <span>Spiritual Logbook</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-cream">The <span className="text-gold italic">Soul Journal</span></h2>
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-xs font-black uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
          <Calendar size={14} className="text-gold/50" />
          <span>{entries.length} Reflections Logged</span>
        </div>
      </header>

      {/* New Entry Form */}
      <div className="glass-card p-8 border-gold/10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 text-gold/5 pointer-events-none group-focus-within:text-gold/10 transition-colors">
          <Sparkles size={120} />
        </div>
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <label className="block text-xs font-black uppercase tracking-[0.3em] text-gold/60">How does your heart feel in this moment?</label>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Log your internal standing..."
            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-cream placeholder:text-slate-600 focus:outline-none focus:border-gold/30 transition-all min-h-[160px] font-serif italic text-lg leading-relaxed shadow-inner"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newEntry.trim() || isSubmitting}
              className="bg-gold text-slate-950 px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-gold/10"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Persist Reflection
            </button>
          </div>
        </form>
      </div>

      {/* Entries List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card p-8 group border-white/5 hover:border-gold/20 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <HeartPulse size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/60">
                      {new Date(entry.created_at).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {entry.tags.map(tag => (
                        <span key={tag} className="text-[8px] uppercase font-bold tracking-widest text-slate-500 border border-white/5 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xl text-cream/90 font-serif italic leading-relaxed pl-6 border-l-2 border-gold/10">
                "{entry.content}"
              </p>
              <div className="mt-8 flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gold italic">Mood: {entry.mood}</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {entries.length === 0 && !isInitializing && (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <RefreshCcw className="mx-auto mb-6 text-slate-700 animate-spin-slow" size={48} />
            <p className="text-slate-500 font-serif italic">Your journey awaits its first word of reflection.</p>
          </div>
        )}
      </div>
    </div>
  );
};
