import React from 'react';
import { Microscope, Brain, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

const topics = [
  {
    title: 'Islam & Science',
    icon: Microscope,
    color: 'emerald',
    content: 'The Quran describes planetary orbits, embryology, and the water cycle in detail—centuries before modern science confirmed them. Islam views the universe as a series of signs (Ayat) to be explored with reason and logic.'
  },
  {
    title: 'Mental Health in Faith',
    icon: Brain,
    color: 'blue',
    content: 'Islamic tradition pioneered the first psychiatric hospitals in history (Bimaristans). It balances the soul (Ruh), mind (Aql), and body, viewing emotional struggle not as a lack of faith, but as a journey towards healing.'
  },
  {
    title: 'Jesus (Isa AS) in Islam',
    icon: Heart,
    color: 'red',
    content: 'Jesus is one of the most beloved and mentioned prophets in the Quran. Muslims revere him as a miracle birth and a mighty messenger of peace, compassion, and divine wisdom.'
  }
];

export const CommonGround = () => {
  return (
    <div className="space-y-12 py-12 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-gold/10 px-4 py-2 rounded-full mb-6">
          <Sparkles size={16} className="text-gold" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">A Bridge of Peace</span>
        </div>
        <h2 className="text-4xl font-serif font-bold text-cream mb-6">The Common Ground</h2>
        <p className="text-slate-400 leading-relaxed italic">
          Exploring the intersections of faith, reason, and humanity. For those seeking truth and understanding across all paths.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-10 flex flex-col h-full group"
          >
            <div className="w-16 h-16 bg-white/5 text-gold rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform noor-glow">
              <topic.icon size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-cream mb-4">{topic.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">
              {topic.content}
            </p>
            <button className="mt-8 text-gold text-xs font-black uppercase tracking-widest flex items-center space-x-2 hover:translate-x-2 transition-all">
              <span>Read More</span>
              <Sparkles size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-gold/5 border border-gold/10 p-12 rounded-[3rem] text-center max-w-4xl mx-auto mt-20">
        <h3 className="text-2xl font-serif font-bold text-gold mb-4">Curious about the Journey?</h3>
        <p className="text-slate-300 text-sm mb-8 leading-relaxed max-w-lg mx-auto">
          We invite you to a 7-day "Introduction to Peace" journey. No pressure, just a walk through the landscape of the soul.
        </p>
        <button className="bg-gold text-starry-teal-dark font-bold px-10 py-5 rounded-[2rem] hover:scale-105 active:scale-95 transition-all noor-glow shadow-2xl">
          Start the 7-Day Roadmap
        </button>
      </div>
    </div>
  );
};
