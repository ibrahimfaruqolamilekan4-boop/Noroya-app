import React, { useState, useEffect } from 'react';
import { Heart, Plus, Calendar, Sparkles, Trash2, Loader2, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface GratitudeEntry {
  id: string;
  text: string;
  category: string;
  createdAt: any;
}

export const GratitudeJournal = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'gratitude'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GratitudeEntry[];
      setEntries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gratitude');
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !auth.currentUser) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'gratitude'), {
        userId: auth.currentUser.uid,
        text: input,
        createdAt: serverTimestamp(),
      });
      setInput('');
      toast.success('Alhamdulillah for everything.', {
        style: { background: '#D4AF37', color: '#051A1D', fontWeight: 'bold' }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'gratitude');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gratitude', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'gratitude');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-3xl font-serif font-bold text-cream mb-2">Gratitude Journal</h2>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gold">Count Your Blessings (Shukr)</p>
      </header>

      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card p-2 pr-4 flex items-center focus-within:ring-2 ring-gold/20 transition-all">
          <div className="p-4 text-gold">
            <Heart size={24} fill={isSubmitting ? 'currentColor' : 'none'} className={cn(isSubmitting && "animate-ping")} />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Today, I am grateful to Allah for..."
            className="flex-1 bg-transparent border-none outline-none text-cream px-2 py-4 text-sm placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isSubmitting}
            className="bg-gold text-starry-teal-dark font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all text-xs"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Log Shukr'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 opacity-40">
            <PenTool size={48} className="mx-auto mb-4" />
            <p className="text-sm font-serif">Your journal is waiting for its first blessing.</p>
          </div>
        ) : (
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-6 flex items-start justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={12} className="text-gold/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold/50">
                      {entry.createdAt?.toDate().toLocaleDateString() || 'Today'}
                    </span>
                  </div>
                  <p className="text-cream text-lg font-serif italic">"{entry.text}"</p>
                </div>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="text-center">
        <p className="text-[10px] text-gold/40 font-black uppercase tracking-widest leading-relaxed">
          "If you are grateful, I will surely increase you [in favor]." <br/>
          — Quran 14:7
        </p>
      </div>
    </div>
  );
};
