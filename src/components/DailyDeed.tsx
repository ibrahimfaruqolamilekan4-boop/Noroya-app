import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Sparkles, Trophy, Star, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

const DAILY_DEEDS = [
  { id: 'smile', task: 'Smile at a stranger or family member today. It is charity.', points: 10, trait: 'Kindness' },
  { id: 'water', task: 'Give water to a bird, plant, or animal.', points: 15, trait: 'Mercy' },
  { id: 'dua', task: 'Pray for someone who has hurt you in the past.', points: 25, trait: 'Forgiveness' },
  { id: 'dhikr', task: 'Say "SubhanAllah" 33 times after your next prayer.', points: 10, trait: 'Devotion' },
  { id: 'parents', task: 'Call your parents or a relative and ask how they are.', points: 20, trait: 'Duty' }
];

export const DailyDeed = () => {
  const [completed, setCompleted] = useState(false);
  const [deed, setDeed] = useState(DAILY_DEEDS[0]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Select daily deed based on date
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setDeed(DAILY_DEEDS[dayOfYear % DAILY_DEEDS.length]);
    
    // Load completion state
    const lastDone = localStorage.getItem('lastDeedDoneDate');
    if (lastDone === new Date().toDateString()) {
      setCompleted(true);
    }
    
    const savedPoints = localStorage.getItem('spiritualPoints');
    if (savedPoints) setPoints(parseInt(savedPoints));
  }, []);

  const handleComplete = () => {
    if (completed) return;
    
    setCompleted(true);
    const newPoints = points + deed.points;
    setPoints(newPoints);
    
    localStorage.setItem('lastDeedDoneDate', new Date().toDateString());
    localStorage.setItem('spiritualPoints', newPoints.toString());
    
    toast.success(`Alhamdulillah! +${deed.points} ${deed.trait} points`, {
      icon: '✨',
      style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-16">
      <div className="glass-card p-8 border-gold/20 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-emerald-500/5 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <Star size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">Sunnah Action</p>
                <h3 className="text-lg font-serif font-bold text-cream">Deed of the Day</h3>
              </div>
            </div>
            <div className="px-4 py-2 bg-gold/10 rounded-full border border-gold/20 flex items-center space-x-2">
              <Trophy size={14} className="text-gold" />
              <span className="text-xs font-black text-gold">{points} LP</span>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xl font-serif text-cream leading-relaxed italic">
              "{deed.task}"
            </p>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {deed.trait}
                </span>
                <span className="text-[10px] font-black text-gold/40">+{deed.points} Points</span>
              </div>
              
              <button
                onClick={handleComplete}
                disabled={completed}
                className={cn(
                  "flex items-center space-x-3 px-6 py-3 rounded-full transition-all active:scale-95 group/btn",
                  completed 
                    ? "bg-emerald-500/20 text-emerald-400 cursor-default" 
                    : "bg-gold text-starry-teal-dark hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                )}
              >
                {completed ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                  </>
                ) : (
                  <>
                    <Circle size={16} className="group-hover/btn:hidden" />
                    <CheckCircle2 size={16} className="hidden group-hover/btn:block" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Done Today</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
