import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Sun, MessageCircle, HandHeart, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  addDoc, 
  collection,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface CommunityStats {
  totalPrayers: number;
  totalFasting: number;
  totalCharity: number;
  totalSmiles: number;
  totalDhikr: number;
}

const DEED_TYPES = [
  { id: 'totalPrayers', label: 'Prayers', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'totalDhikr', label: 'Dhikr', icon: Star, color: 'text-gold', bg: 'bg-gold/10' },
  { id: 'totalSmiles', label: 'Smiles', icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'totalCharity', label: 'Charity', icon: HandHeart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

export const CommunitySadaqahTracker = () => {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogging, setIsLogging] = useState<string | null>(null);

  useEffect(() => {
    // Listen to global stats
    const statsRef = doc(db, 'community_stats', 'global');
    
    // Check if doc exists, if not create it (one-time setup for demo)
    getDoc(statsRef).then(docSnap => {
      if (!docSnap.exists()) {
        setDoc(statsRef, {
          totalPrayers: 0,
          totalFasting: 0,
          totalCharity: 0,
          totalSmiles: 0,
          totalDhikr: 0,
          updatedAt: serverTimestamp()
        }).catch(e => console.error("Error initializing stats:", e?.message || String(e)));
      }
    });

    const unsubscribe = onSnapshot(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.data() as CommunityStats);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'community_stats/global');
    });

    return unsubscribe;
  }, []);

  const logDeed = async (typeId: string, label: string) => {
    if (!auth.currentUser) {
      toast.error("Please sign in to log your deeds.");
      return;
    }

    setIsLogging(typeId);
    try {
      // 1. Log individual deed (for user history)
      await addDoc(collection(db, 'sadaqah'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Spiritual Seeker',
        type: typeId.replace('total', '').toLowerCase(),
        count: 1,
        createdAt: serverTimestamp()
      });

      // 2. Update global stats
      const statsRef = doc(db, 'community_stats', 'global');
      await updateDoc(statsRef, {
        [typeId]: increment(1),
        updatedAt: serverTimestamp()
      });

      toast.success(`Masha'Allah! Your ${label.toLowerCase()} added to the light.`, {
        icon: '✨',
        style: { background: '#0A2F35', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.2)' }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'community_stats/global');
    } finally {
      setIsLogging(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gold/10 px-4 py-2 rounded-full mb-6">
          <TrendingUp size={16} className="text-gold" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Real-time Good Deeds</span>
        </div>
        <h2 className="text-4xl font-serif font-bold text-cream mb-6 tracking-tight">The Community Pulse</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed italic">
          "The most beloved of deeds to Allah are those that are most consistent, even if they are small."
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {DEED_TYPES.map((deed) => (
          <motion.div
            key={deed.id}
            whileHover={{ scale: 1.05 }}
            className="glass-card p-8 text-center relative group"
          >
            <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 noor-glow transition-all", deed.bg, deed.color)}>
              <deed.icon size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">{deed.label}</h3>
              <p className="text-3xl font-serif font-bold text-cream">
                {stats ? (stats as any)[deed.id].toLocaleString() : '0'}
              </p>
            </div>
            
            <button
              onClick={() => logDeed(deed.id, deed.label)}
              disabled={isLogging !== null}
              className="mt-6 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold hover:text-starry-teal-dark transition-all disabled:opacity-50"
            >
              {isLogging === deed.id ? <Loader2 className="animate-spin mx-auto text-gold" size={14} /> : '+ Log Deed'}
            </button>
            
            {/* Ambient Glow */}
            <div className={cn("absolute -inset-1 rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity", deed.bg)} />
          </motion.div>
        ))}
      </div>

      <div className="bg-gold/5 border border-gold/10 p-10 rounded-[3rem] text-center max-w-2xl mx-auto">
        <Sparkles className="text-gold mx-auto mb-6" size={32} />
        <h3 className="text-2xl font-serif font-bold text-cream mb-4">Together in Faith</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Every time you pray, smile, or help someone, you aren't just growing personally—you're lifting the entire community. Join the thousands of souls contributing to this collective light.
        </p>
        <div className="flex items-center justify-center space-x-6 text-[10px] font-black uppercase tracking-[0.2em] text-gold/60">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Sync Active</span>
          </div>
          <div>•</div>
          <span>{auth.currentUser ? `Logged in as ${auth.currentUser.displayName}` : 'Sign in to participate'}</span>
        </div>
      </div>
    </div>
  );
};
