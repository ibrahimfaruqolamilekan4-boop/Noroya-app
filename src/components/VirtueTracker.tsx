import React from 'react';
import { motion } from 'motion/react';
import { Award, Zap, Heart, Shield, Star, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const VIRTUES = [
  { name: 'Sabr (Patience)', level: 4, progress: 65, icon: Shield, color: 'amber' },
  { name: 'Ihsan (Excellence)', level: 2, progress: 40, icon: Sparkles, color: 'blue' },
  { name: 'Sidq (Truthfulness)', level: 5, progress: 90, icon: Star, color: 'emerald' },
  { name: 'Mahabbah (Love)', level: 3, progress: 20, icon: Heart, color: 'rose' }
];

export const VirtueTracker = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-24">
      <div className="flex items-center space-x-6 mb-12">
        <div className="w-16 h-16 bg-gold/10 rounded-[2rem] flex items-center justify-center text-gold border border-gold/20 shadow-xl">
          <Award size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-cream tracking-tight">The Virtue Garden</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60 mt-2">Nourish your character traits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {VIRTUES.map((virtue) => (
          <motion.div
            key={virtue.name}
            whileHover={{ y: -5 }}
            className="glass-card p-8 border-white/5 relative overflow-hidden group"
          >
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br",
              virtue.color === 'amber' && "from-amber-500",
              virtue.color === 'blue' && "from-blue-500",
              virtue.color === 'emerald' && "from-emerald-500",
              virtue.color === 'rose' && "from-rose-500"
            )} />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                  virtue.color === 'amber' && "bg-amber-500/10 text-amber-500",
                  virtue.color === 'blue' && "bg-blue-500/10 text-blue-500",
                  virtue.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                  virtue.color === 'rose' && "bg-rose-500/10 text-rose-500"
                )}>
                  <virtue.icon size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-cream tracking-tight">{virtue.name}</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Tier {virtue.level}</p>
                </div>
              </div>
              <div className="bg-white/5 px-4 py-1 rounded-full border border-white/10 flex items-center space-x-2">
                <Zap size={14} className="text-gold" />
                <span className="text-[10px] font-black text-gold">Level Up</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Progress to Tier {virtue.level + 1}</span>
                <span>{virtue.progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${virtue.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={cn(
                    "h-full shadow-[0_0_10px_rgba(0,0,0,0.3)]",
                    virtue.color === 'amber' && "bg-amber-500",
                    virtue.color === 'blue' && "bg-blue-500",
                    virtue.color === 'emerald' && "bg-emerald-500",
                    virtue.color === 'rose' && "bg-rose-500"
                  )}
                />
              </div>
              <p className="text-[11px] font-serif italic text-slate-600 leading-relaxed">
                Refined through {virtue.name.split(' ')[0]} tasks completed this month.
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
