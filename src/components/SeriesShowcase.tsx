
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, List, X, Clock, PlayCircle, BookOpen, Volume2, Info } from 'lucide-react';
import { Series, propheticSeries, SeriesEpisode } from '../data/seriesData';
import { cn } from '../lib/utils';

export const SeriesShowcase = () => {
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<SeriesEpisode | null>(null);
  const [viewMode, setViewMode] = useState<'video' | 'article'>('video');

  const handleSeriesSelect = (series: Series) => {
    setSelectedSeries(series);
    setActiveEpisode(series.episodes[0]);
    setViewMode('video');
  };

  const closeModal = () => {
    setSelectedSeries(null);
    setActiveEpisode(null);
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-8 bg-gold rounded-full" />
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800">Sacred Series</h2>
            <p className="text-sm text-slate-500 font-medium">Immersive journeys through Islamic history</p>
          </div>
        </div>
        <button className="text-gold font-bold text-xs uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {propheticSeries.map((series) => (
          <motion.div 
            key={series.id}
            whileHover={{ y: -5 }}
            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
            onClick={() => handleSeriesSelect(series)}
          >
            <img 
              src={series.coverImage} 
              alt={series.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                {series.category}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-gold font-bold text-xs uppercase tracking-widest mb-2 flex items-center">
                <span className="w-4 h-[1px] bg-gold mr-2" /> {series.cleric}
              </p>
              <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-gold transition-colors">
                {series.title}
              </h3>
              <p className="text-white/60 text-sm mb-6 line-clamp-2 leading-relaxed">
                {series.description}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-white/80 text-xs font-bold">
                  <PlayCircle size={14} className="mr-1.5 text-gold" />
                  {series.totalEpisodes} Episodes
                </div>
                <div className="pill-button bg-gold text-white text-[10px] uppercase font-black py-2 px-4 flex items-center group-hover:bg-gold-light">
                  Watch Now
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSeries && activeEpisode && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-white md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-full md:h-[90vh]"
            >
              {/* Header */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-white">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-white font-serif font-bold text-lg leading-tight">{selectedSeries.title}</h2>
                    <p className="text-gold text-[10px] uppercase font-black tracking-widest">{selectedSeries.cleric}</p>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Main Player Area */}
                <div className="flex-1 overflow-y-auto bg-black flex flex-col">
                  {/* View Toggle */}
                  <div className="p-6 flex flex-col items-center shrink-0 bg-slate-900/50 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">Choose Your Experience</p>
                    <div className="bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] flex space-x-2 ring-1 ring-white/10 shadow-2xl">
                      <button 
                        onClick={() => setViewMode('video')}
                        className={cn(
                          "px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all flex items-center space-x-3",
                          viewMode === 'video' ? "bg-white text-slate-950 shadow-2xl scale-105" : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <PlayCircle size={18} fill={viewMode === 'video' ? 'currentColor' : 'none'} />
                        <span>Watch Video</span>
                      </button>
                      <button 
                        onClick={() => setViewMode('article')}
                        className={cn(
                          "px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all flex items-center space-x-3",
                          viewMode === 'article' ? "bg-white text-slate-950 shadow-2xl scale-105" : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <BookOpen size={18} />
                        <span>Read Story</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-950">
                    <AnimatePresence mode="wait">
                      {viewMode === 'video' ? (
                        <motion.div 
                          key="video"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full"
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${activeEpisode.youtubeId}?autoplay=1&rel=0&modestbranding=1&origin=${window.location.origin}`}
                            title={activeEpisode.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="no-referrer"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="article"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="w-full h-full overflow-y-auto px-8 md:px-16 py-12 bg-cream text-slate-800"
                        >
                          <div className="max-w-2xl mx-auto">
                            <div className="flex items-center space-x-2 text-gold font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                              <Info size={14} />
                              <span>Episode {selectedSeries.episodes.indexOf(activeEpisode) + 1} Insights</span>
                            </div>
                            <h1 className="text-4xl font-serif font-bold mb-8 text-islamic-green-dark leading-tight border-b border-islamic-green/10 pb-8">
                              {activeEpisode.title}
                            </h1>
                            <div className="prose prose-lg prose-slate max-w-none">
                              <p className="text-xl leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gold">
                                {activeEpisode.article || "This episode focuses on " + activeEpisode.title + ". Detailed textual commentary is currently being prepared to accompany this sacred visual journey."}
                              </p>
                              <div className="mt-12 p-8 bg-islamic-green/5 rounded-[2rem] border border-islamic-green/10 italic text-islamic-green-dark font-medium">
                                "Indeed, in their stories, there is a lesson for people of understanding." — Quran 12:111
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Episode List Sidebar */}
                <div className="md:w-80 bg-white border-l border-slate-100 flex flex-col h-[40vh] md:h-auto">
                  <div className="p-6 border-b border-slate-50 shrink-0">
                    <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                       <List size={18} className="text-gold" />
                       <span>Course Content</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {selectedSeries.episodes.length} Lessons Available
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
                    {selectedSeries.episodes.map((episode, idx) => (
                      <button 
                        key={episode.id}
                        onClick={() => setActiveEpisode(episode)}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl transition-all flex items-start space-x-3 group",
                          activeEpisode.id === episode.id 
                            ? "bg-white shadow-xl shadow-gold/10 ring-1 ring-gold/20" 
                            : "hover:bg-white hover:shadow-md"
                        )}
                      >
                         <div className={cn(
                           "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors",
                           activeEpisode.id === episode.id ? "bg-gold text-white" : "bg-slate-100 text-slate-400 group-hover:bg-gold/10 group-hover:text-gold"
                         )}>
                           {idx + 1}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className={cn(
                             "text-xs font-bold leading-snug truncate",
                             activeEpisode.id === episode.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                           )}>
                             {episode.title}
                           </h4>
                           <div className="flex items-center text-[9px] font-black uppercase tracking-wider text-slate-400 mt-1">
                             <Clock size={10} className="mr-1" /> {episode.duration}
                           </div>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
