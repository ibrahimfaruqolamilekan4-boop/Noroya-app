import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, User, Clock, ChevronRight, Settings, Subtitles } from 'lucide-react';
import { dbService, ScholarVideo } from '../services/dbService';
import { cn } from '../lib/utils';

export const DailyWisdom = () => {
  const [videos, setVideos] = useState<ScholarVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<ScholarVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const latestVideos = await dbService.getLatestScholarVideos();
        if (latestVideos) {
          setVideos(latestVideos);
        }
      } catch (error) {
        console.error("Error fetching latest wisdom:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (isLoading) return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (videos.length === 0) return null;

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-serif font-bold text-cream">Daily <span className="text-gold italic">Wisdom</span></h2>
          <p className="text-slate-400 italic font-serif">Recent reflections from our beloved scholars.</p>
        </div>
        <button className="text-gold flex items-center space-x-2 group">
          <span className="text-xs font-black uppercase tracking-widest">View All Lessons</span>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex overflow-x-auto pb-12 gap-8 custom-scrollbar scroll-smooth">
        {videos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedVideo(video)}
            className="flex-shrink-0 w-80 group cursor-pointer"
          >
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-6 group-hover:scale-[1.02] transition-all duration-500 shadow-2xl">
              <img 
                src={video.thumbnail_url || `https://images.unsplash.com/photo-1518005020251-58296d87e382?auto=format&fit=crop&q=80&w=800`} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-starry-teal-dark via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-starry-teal-dark/20 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gold text-starry-teal-dark rounded-full flex items-center justify-center noor-glow">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-6 left-6 px-4 py-1 bg-gold/10 backdrop-blur-md border border-gold/20 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-gold">{video.category}</span>
              </div>
            </div>

            <div className="space-y-4 px-2">
              <h3 className="text-xl font-serif font-bold text-cream group-hover:text-gold transition-colors line-clamp-1">
                {video.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-gold/20 overflow-hidden">
                    {video.scholar_photo ? (
                      <img src={video.scholar_photo} alt={video.scholar_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold/30">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-300">{video.scholar_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock size={12} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    {new Date(video.created_at?.toDate()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-starry-teal-dark/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-white/10"
            >
              {/* Virtual Video Player UI */}
              <div className="absolute inset-0">
                <video 
                  src={selectedVideo.video_url} 
                  autoPlay 
                  controls 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Custom Overlay Controls */}
              <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
                <div>
                  <h4 className="text-gold font-black text-[10px] uppercase tracking-[0.4em] mb-2">Streaming Now</h4>
                  <p className="text-2xl font-serif font-bold text-cream">{selectedVideo.title}</p>
                </div>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="p-4 bg-white/5 hover:bg-white/10 text-cream rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="absolute bottom-8 right-8 flex items-center space-x-6 z-10">
                <button 
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={cn(
                    "flex items-center space-x-3 px-6 py-3 rounded-2xl border transition-all",
                    showSubtitles ? "bg-gold text-starry-teal-dark border-gold" : "bg-white/5 text-cream border-white/10"
                  )}
                >
                  <Subtitles size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Subtitles</span>
                </button>
                
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-3 space-x-4">
                  <Settings size={18} className="text-gold" />
                  <select 
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="bg-transparent text-cream text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <option key={speed} value={speed} className="bg-starry-teal-dark">{speed}x Speed</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mock Subtitles */}
              {showSubtitles && (
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center w-full px-12 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 inline-block"
                  >
                    <p className="text-cream text-lg font-serif italic">
                      "Remember that your heart is the vessel for divine light..."
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
