import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Heart, Quote, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

const QUOTES = [
  {
    text: "Remember when Prophet Ayub said: 'Indeed, adversity has touched me, and you are the Most Merciful...'",
    source: "Surah Al-Anbiya 21:83",
    theme: "Patience",
    color: "from-amber-400 to-amber-600"
  },
  {
    text: "So naturally, with hardship, there is ease. Indeed, with hardship, there is ease.",
    source: "Surah Ash-Sharh 94:5-6",
    theme: "Hope",
    color: "from-emerald-400 to-emerald-600"
  },
  {
    text: "Do not lose heart, nor fall into despair; for you must gain mastery if you are true in Faith.",
    source: "Surah Al-Imran 3:139",
    theme: "Courage",
    color: "from-indigo-400 to-indigo-600"
  },
  {
    text: "Be patient for the decision of your Lord, for indeed, you are in Our eyes.",
    source: "Surah At-Tur 52:48",
    theme: "Love",
    color: "from-rose-400 to-rose-600"
  }
];

export const DailyLight = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Show only if not shown today
    const lastShown = localStorage.getItem('lastNoorQuoteDate');
    const today = new Date().toDateString();
    
    if (lastShown !== today) {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setQuote(randomQuote);
      
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('lastNoorQuoteDate', new Date().toDateString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-10 left-6 right-6 md:left-auto md:right-10 md:w-96 z-[200]"
        >
          <div className="glass-card p-1 relative overflow-hidden rounded-[2.5rem] border-gold/30 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", quote.color)} />
            
            <div className="bg-starry-teal-dark/95 backdrop-blur-2xl rounded-[2.4rem] p-8 border border-white/5 relative z-10">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-gold transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold animate-pulse">
                  <Sparkles size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">Noor Quote</span>
              </div>

              <div className="space-y-6">
                <Quote size={24} className="text-gold/20" />
                <p className="text-xl md:text-2xl font-serif font-bold text-cream leading-tight italic">
                  "{quote.text}"
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{quote.source}</span>
                  <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-xl", "bg-gradient-to-r " + quote.color)}>
                    {quote.theme}
                  </div>
                </div>

                <button 
                  onClick={handleClose}
                  className="w-full bg-white text-starry-teal-dark py-4 rounded-full font-black uppercase tracking-[0.2em] text-[9px] transition-all hover:scale-105 active:scale-95 shadow-2xl mt-4"
                >
                  JazakAllah Khair
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
