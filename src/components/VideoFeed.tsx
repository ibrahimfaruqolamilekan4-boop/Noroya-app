import React, { useEffect, useState } from 'react';
import { VideoItem } from './VideoItem';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Loader2, Film, Youtube, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { searchIslamicVideos } from '../services/youtubeService';
import { getIslamicTikToks } from '../services/tiktokService';

export const VideoFeed = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    // 1. Fetch Local Videos from Firestore
    let q = query(collection(db, 'videos'));
    
    let localVideos: any[] = [];
    let ytVideos: any[] = [];
    let ttVideos: any[] = [];

    const fetchSocialVideos = async () => {
      console.log("VideoFeed: Starting social fetch...");
      try {
        // Randomize search terms for YouTube variety
        const terms = ['Islamic nasheeds', 'Quran recitation beautiful', 'Prophet stories animation', 'Islamic motivation shorts', 'Halal lifestyle vlogs'];
        const randomTerm = terms[Math.floor(Math.random() * terms.length)];
        
        // Fetch from YouTube and TikTok in parallel
        const [ytResults, ttResults] = await Promise.all([
          searchIslamicVideos(randomTerm, 12),
          getIslamicTikToks(5)
        ]);
        
        // Comprehensive fixtures/fallbacks for YT
        const fixtures: any[] = [
          { id: 'VO4ovS_Zp9I', title: 'Life of the Prophet', clericName: 'Yasir Qadhi', channelTitle: 'Yasir Qadhi', thumbnail: 'https://img.youtube.com/vi/VO4ovS_Zp9I/hqdefault.jpg', categoryId: '29', platform: 'youtube' },
          { id: 'TFS7i_Y8W_s', title: 'Quran Recitation', clericName: 'Mishary Rashid', channelTitle: 'Mishary Rashid', thumbnail: 'https://img.youtube.com/vi/TFS7i_Y8W_s/hqdefault.jpg', categoryId: '29', platform: 'youtube' },
          { id: 'fX7Wp5u5u_g', title: 'Purpose of Life', clericName: 'Omar Suleiman', channelTitle: 'Omar Suleiman', thumbnail: 'https://img.youtube.com/vi/fX7Wp5u5u_g/hqdefault.jpg', categoryId: '29', platform: 'youtube' },
          { id: 'vGZc78_S_zM', title: 'Dealing with Anxiety', clericName: 'Mufti Menk', channelTitle: 'Mufti Menk', thumbnail: 'https://img.youtube.com/vi/vGZc78_S_zM/hqdefault.jpg', categoryId: '29', platform: 'youtube' },
          { id: 'M3-YhL-n_vM', title: 'Morning Remembrance', clericName: 'Saad Al Ghamdi', channelTitle: 'Saad Al Ghamdi', thumbnail: 'https://img.youtube.com/vi/M3-YhL-n_vM/hqdefault.jpg', categoryId: '29', platform: 'youtube' }
        ];

        let finalYT: any[] = ytResults && ytResults.length > 0 ? ytResults : fixtures;
        finalYT = [...finalYT].sort(() => Math.random() - 0.5);

        ytVideos = finalYT.map((v: any) => ({
          id: v.id,
          clericId: 'youtube',
          clericName: v.clericName || v.channelTitle || 'Scholar',
          title: v.title,
          description: v.description || 'A beautiful reminder about the path of faith and wisdom.',
          videoUrl: v.videoUrl || `https://www.youtube.com/watch?v=${v.id}`,
          likes: Math.floor(Math.random() * 5000) + 1000,
          comments: Math.floor(Math.random() * 500),
          shares: Math.floor(Math.random() * 200),
          isVerified: true,
          platform: 'youtube'
        }));

        ttVideos = (ttResults || []).map((v: any) => ({
          ...v,
          clericId: 'tiktok',
          description: 'Trending Islamic content from the community.',
          likes: Math.floor(Math.random() * 10000) + 5000,
          comments: Math.floor(Math.random() * 1000) + 100,
          shares: Math.floor(Math.random() * 1000),
          isVerified: true,
          platform: 'tiktok'
        }));

        combineVideos();
      } catch (err: any) {
        console.error("Home social fetch error:", err?.message || String(err));
        combineVideos();
      }
    };

    const combineVideos = () => {
      // Sort local videos in memory
      localVideos.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || new Date(a.createdAt).getTime() || 0;
        const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || new Date(b.createdAt).getTime() || 0;
        return timeB - timeA;
      });

      // Create a mixed list: local -> yt -> tt -> yt -> yt -> tt ...
      const social = [...ytVideos];
      ttVideos.forEach((v, i) => {
        const pos = Math.min((i + 1) * 3, social.length);
        social.splice(pos, 0, v);
      });

      const combined = [...localVideos];
      social.forEach((v, i) => {
        const pos = Math.min((i + 1) * 2, combined.length);
        combined.splice(pos, 0, v);
      });

      setVideos(combined);
      setLoading(false);
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
      localVideos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      fetchSocialVideos();
    }, (error) => {
      const fetchErrorHelper = async () => {
        try {
          const { handleFirestoreError, OperationType } = await import('../lib/firebase');
          handleFirestoreError(error, OperationType.LIST, 'videos');
        } catch (e: any) {
          console.error("VideoFeed query failed (error helper also failed):", e?.message || String(e));
        }
      };
      
      fetchErrorHelper();
      console.error("VideoFeed query failed:", error?.message || String(error));
      fetchSocialVideos();
    });

    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Refreshing wisdom...', { icon: '✨' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-starry-teal-dark islamic-pattern">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-gold/10 rounded-[2rem] noor-glow"></div>
          <div className="absolute inset-0 border-t-4 border-gold rounded-[2rem] animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold animate-pulse" size={24} />
        </div>
        <p className="text-gold font-serif font-bold animate-pulse tracking-[0.2em] uppercase text-xs">Gathering Sacred Insights...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-starry-teal-dark islamic-pattern text-slate-400 p-8 text-center min-h-[calc(100vh-64px)]">
        <div className="w-24 h-24 bg-gold/10 text-gold rounded-[2rem] flex items-center justify-center mb-8 noor-glow">
          <Film size={36} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-cream mb-6 tracking-tight">No Insights Yet</h2>
        <p className="max-w-md mb-12 text-slate-400 italic leading-relaxed">The guiding lights are currently preparing new reflections. May your journey remain patient and purposeful.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gold text-starry-teal-dark px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all noor-glow"
        >
          Refresh Library
        </button>
      </div>
    );
  }

  return (
    <div className="video-container h-[calc(100vh-64px)] w-full lg:max-w-[450px] mx-auto relative bg-black shadow-2xl overflow-hidden islamic-pattern">
      <div className="absolute top-0 left-0 right-0 p-8 z-30 flex items-center justify-between">
        <div className="flex space-x-8">
          <button className="text-white text-xs font-serif font-black opacity-60 hover:opacity-100 transition-opacity drop-shadow-lg tracking-[0.2em] uppercase">Following</button>
          <button className="text-white text-xs font-serif font-black border-b-2 border-gold pb-1 drop-shadow-lg tracking-[0.2em] uppercase text-shadow-sm">For You</button>
        </div>
        <button 
          onClick={handleRefresh}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:rotate-180"
          title="Refresh Feed"
        >
          <Loader2 size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      <div className="video-container h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth" id="video-feed-scroll">
        {videos.map((video, index) => (
          <div key={video.id} className="h-full w-full snap-start">
            <VideoItem 
              {...video} 
              active={true} // For now since it uses IntersectionObserver internally anyway
              onError={() => {
                const container = document.getElementById('video-feed-scroll');
                if (container) {
                  const nextElement = container.children[index + 1];
                  if (nextElement) {
                    nextElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
