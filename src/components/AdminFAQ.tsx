import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight, MessageSquare, Sparkles, TrendingUp, Search } from 'lucide-react';
import { cn } from '../lib/utils';

const FAQS = [
  {
    question: "How do I maintain focus (Khushu) in prayer while being busy?",
    answer: "Focus in prayer begins before the Takbir. Spend 2 minutes in silence to leave the world behind. Remember that you are standing before the King of kings. Recite slowly and understand even one word you say.",
    category: "Salah",
    reads: "12.4k"
  },
  {
    question: "Is it okay to feel low on faith sometimes?",
    answer: "Faith (Iman) is like the moon; it waxes and wanes. The Prophet (ﷺ) taught us that every heart has a cloud like the cloud that covers the moon. Increase your small good deeds, and wait for the light to return.",
    category: "Spiritual Health",
    reads: "8.9k"
  },
  {
    question: "How can I forgive someone who hurt me deeply?",
    answer: "Forgiveness is not for them; it is for your own heart to heal. Think of the Prophet (ﷺ) at the conquest of Makkah, forgiving those who spent years attacking him. Allah loves the Muhsineen (doers of good).",
    category: "Character",
    reads: "15.1k"
  }
];

export const AdminFAQ = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-400 border border-blue-500/20">
            <HelpCircle size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-cream tracking-tight">Trending Guidance</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mt-2">Scholarly answers to your heart's questions</p>
          </div>
        </div>
        <div className="relative group max-w-xs w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search questions..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-12 text-xs text-cream outline-none focus:border-gold transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <motion.div
            key={idx}
            className={cn(
              "glass-card border-white/5 overflow-hidden transition-all duration-500",
              expandedIdx === idx ? "border-gold/30 bg-gold/5" : "hover:bg-white/5"
            )}
          >
            <button 
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="w-full p-8 flex items-center justify-between text-left group"
            >
              <div className="flex items-center space-x-6 flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  expandedIdx === idx ? "bg-gold text-starry-teal-dark" : "bg-white/5 text-slate-600"
                )}>
                  <MessageSquare size={18} />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gold/40">{faq.category}</span>
                  <h3 className="text-lg md:text-xl font-serif font-bold text-cream leading-tight">
                    {faq.question}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-8 ml-4">
                 <div className="hidden sm:flex items-center space-x-2 text-slate-600">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{faq.reads}</span>
                 </div>
                 <ChevronRight 
                   className={cn(
                     "text-gold transition-transform duration-500",
                     expandedIdx === idx ? "rotate-90" : "group-hover:translate-x-1"
                   )} 
                   size={20} 
                 />
              </div>
            </button>

            <AnimatePresence>
              {expandedIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'circOut' }}
                >
                  <div className="px-8 pb-10 pt-2 ml-16 border-l-2 border-gold/10">
                    <div className="flex items-start space-x-4">
                       <Sparkles size={18} className="text-gold shrink-0 mt-1" />
                       <div className="space-y-6">
                         <p className="text-lg text-slate-400 font-serif italic leading-relaxed">
                           {faq.answer}
                         </p>
                         <button className="text-[10px] font-black uppercase tracking-widest text-gold border-b border-gold/20 pb-1 hover:text-cream hover:border-cream transition-all">
                           Read Detailed Fatwa
                         </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
