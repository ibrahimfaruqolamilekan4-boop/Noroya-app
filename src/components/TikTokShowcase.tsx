
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Music, CheckCircle2, Heart, MessageCircle } from 'lucide-react';
import { getIslamicTikToks, TikTokVideo } from '../services/tiktokService';

export const TikTokShowcase = () => {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVids = async () => {
      const vids = await getIslamicTikToks(6);
      setVideos(vids);
      setLoading(false);
    };
    fetchVids();
  }, []);

  if (loading) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-8 bg-pink-500 rounded-full" />
          <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            TikTok Trends <span className="bg-gradient-to-r from-pink-500 to-cyan-400 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">New</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {videos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden relative mb-3 shadow-lg group-hover:shadow-xl transition-all h-[250px] w-full">
              {/* This would be an embed, but for a 1/6 grid we show a nice card/link */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
              <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
                <Music size={12} />
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-[10px] font-bold opacity-80 truncate">@{video.clericName}</span>
                  <CheckCircle2 size={10} className="text-cyan-400 fill-cyan-400" />
                </div>
                <h4 className="text-xs font-bold line-clamp-2 leading-tight opacity-95 group-hover:text-gold transition-colors">{video.title}</h4>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold border border-white/20 shadow-xl">
                  Watch Trend
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 px-1 text-slate-400">
              <div className="flex items-center space-x-1">
                <Heart size={12} />
                <span className="text-[10px] font-bold">{(Math.random() * 50).toFixed(1)}k</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={12} />
                <span className="text-[10px] font-bold">{(Math.random() * 5).toFixed(1)}k</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
