import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle2, UserPlus, Film, User, Volume2, VolumeX, Youtube, Music, AlertTriangle, Flag, MessageSquare, ThumbsUp, Send, X, Loader2, Sparkles, Link as LinkIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

interface VideoProps {
  id: string;
  clericId?: string;
  clericName: string;
  clericPhoto?: string;
  videoUrl: string;
  title: string;
  description?: string;
  isVerified: boolean;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  active?: boolean;
  onError?: () => void;
}

export const VideoItem: React.FC<VideoProps> = ({
  id,
  clericId,
  clericName,
  clericPhoto,
  videoUrl,
  title,
  description,
  isVerified,
  likes,
  comments,
  isLiked: initialIsLiked = false,
  isSaved: initialIsSaved = false,
  active = false,
  onError,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [showHeart, setShowHeart] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<'network' | 'format' | 'unknown' | 'aborted' | 'decode'>('unknown');
  const [detailedError, setDetailedError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [reported, setReported] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'constructive' | 'report'>('positive');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { profile } = useAuth();

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) {
      toast.error("Please sign in to provide feedback.");
      return;
    }
    if (!feedbackText.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      await dbService.submitVideoFeedback({
        userId: profile.uid,
        videoId: id,
        feedback: feedbackText,
        type: feedbackType
      });
      toast.success("Shukran for your feedback!", {
        icon: '🤲',
        style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
      });
      setIsFeedbackModalOpen(false);
      setFeedbackText('');
    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to submit feedback. Trial again later.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleReportIssue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReported(true);
    toast.success("Issue reported to our team. Thank you for your patience.", {
      icon: '🙏',
      style: {
        borderRadius: '1rem',
        background: '#0a1a1a',
        color: '#D4AF37',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }
    });
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.warn("Autoplay failed:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    setIsLiked(true);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleVideoError = (e: any) => {
    // Correct way to get the error message from a video element event
    const videoError = e.currentTarget?.error;
    let message = "";
    let type: typeof errorType = 'unknown';

    if (videoError) {
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaError
      switch (videoError.code) {
        case 1: // MEDIA_ERR_ABORTED
          type = 'aborted';
          message = "The video playback was aborted.";
          break;
        case 2: // MEDIA_ERR_NETWORK
          type = 'network';
          message = "A network error caused the video download to fail.";
          break;
        case 3: // MEDIA_ERR_DECODE
          type = 'decode';
          message = "The video playback was aborted due to a corruption problem or unsupported features.";
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          type = 'format';
          message = "The video format is not supported or the source is unavailable.";
          break;
        default:
          message = videoError.message || "An unknown playback error occurred.";
      }
    } else {
      message = e?.message || String(e);
    }

    setDetailedError(message);
    setVideoLoading(false);
    console.error("Video element error:", message);
    
    if (retryCount < 1) {
      setRetryCount(prev => prev + 1);
      retryPlayback();
      return;
    }

    setHasError(true);
    setErrorType(type);

    // Skip broken video after a small delay if it's currently active
    if (active && onError) {
      setTimeout(onError, 3000);
    }
  };

  const retryPlayback = () => {
    setHasError(false);
    setVideoLoading(true);
    setErrorType('unknown');
    // For native video, trying to reload the source
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  // Intersection observer to play/pause on scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().catch(e => console.warn("Autoplay blocked:", e));
              }
            });
          }
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [retryCount]);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    try {
      // If it's already just an 11-char ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

      // Handle standard and short URLs
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|live\/)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) return match[2];
      
      // Handle mobile and other variants via URL API
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
      if (urlObj.hostname.includes('youtube.com')) {
        const v = urlObj.searchParams.get('v');
        if (v && v.length === 11) return v;
        
        // Handle path-based IDs like /v/ID or /embed/ID or /shorts/ID
        const pathParts = urlObj.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        const prevPart = pathParts[pathParts.length - 2];
        
        if (lastPart && lastPart.length === 11) return lastPart;
        if (prevPart === 'v' || prevPart === 'embed' || prevPart === 'shorts') return lastPart;
      }
      
      if (urlObj.hostname === 'youtu.be') {
        const v = urlObj.pathname.slice(1).split(/[?#]/)[0];
        if (v && v.length === 11) return v;
      }
    } catch (e) {
      // Fallback: search for 11 chars after a slash or equals
      const match = url.match(/[?&/]v[=/]([a-zA-Z0-9_-]{11})/) || 
                    url.match(/[/]([a-zA-Z0-9_-]{11})([?#]|$)/);
      if (match && match[1].length === 11) return match[1];
    }
    return null;
  };

  const getTiktokId = (url: string) => {
    try {
      if (!url) return null;
      // Matches: tiktok.com/@user/video/123 or tiktok.com/v/123 or vm.tiktok.com/abc
      const match = url.match(/video\/(\d+)/) || url.match(/\/v\/(\d+)/);
      if (match) return match[1];

      // Handle simple numeric ID
      if (/^\d{15,}$/.test(url)) return url;
      
      // Attempt to find any long numeric string in the URL
      const longNum = url.match(/\d{15,}/);
      if (longNum) return longNum[0];
    } catch (e) {
      return null;
    }
    return null;
  };

  const youtubeId = getYoutubeId(videoUrl);
  const tiktokId = getTiktokId(videoUrl);
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v|3gp|mkv)$|supabase|firebasestorage|googlevideo|clouddn|aws|digitaloceanspaces/i.test(videoUrl);
  const isPlatformLink = /youtube\.com|youtu\.be|tiktok\.com|vimeo\.com|instagram\.com|facebook\.com/i.test(videoUrl);

  return (
    <div className="video-card w-full h-full flex items-center justify-center bg-black overflow-hidden relative">
      {videoLoading && !hasError && !youtubeId && !tiktokId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
          />
        </div>
      )}

      {hasError ? (
        <div className="flex flex-col items-center justify-center text-white bg-slate-950 absolute inset-0 text-center p-8 z-[100] bg-gradient-to-b from-slate-900 to-black">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
          <p className="font-serif font-bold text-2xl text-cream">Signal Lost</p>
          <div className="space-y-2 mt-4">
            <p className="text-sm text-cream/70 max-w-[280px] leading-relaxed">
              {errorType === 'network' 
                ? "Connectivity issues are preventing this wisdom from reaching you."
                : errorType === 'format' 
                ? "This video format is incompatible with your current device."
                : errorType === 'decode'
                ? "The video file appears to be corrupted or invalid."
                : "This content is temporarily unavailable. Peace be upon you."}
            </p>
            {!isDirectVideo && !youtubeId && !tiktokId && (
              <p className="text-[10px] text-gold mt-2 uppercase tracking-widest font-black">
                Link format might be unsupported
              </p>
            )}
            {detailedError && (
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">
                Code: {detailedError}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-3 mt-10 w-full max-w-[220px]">
            <button 
              onClick={retryPlayback}
              className="px-6 py-4 bg-gold text-starry-teal-dark rounded-full text-xs font-black uppercase tracking-widest shadow-xl noor-glow hover:scale-105 active:scale-95 transition-all"
            >
              Try to Reconnect
            </button>
            {videoUrl.startsWith('http') && (
              <a 
                href={videoUrl}
                target="_blank"
                rel="no-referrer"
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-cream hover:bg-white/10 transition-all text-center"
              >
                Open Original Content
              </a>
            )}
            <button 
              onClick={() => onError?.()}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-full text-xs font-black uppercase tracking-widest text-cream transition-all border border-white/10"
            >
              Skip Wisdom Marker
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleReportIssue}
                disabled={reported}
                className={cn(
                  "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border",
                  reported 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                {reported ? <CheckCircle2 size={14} /> : <Flag size={14} />}
                {reported ? "Reported" : "Report"}
              </button>
              <button 
                onClick={() => setHasError(false)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ) : youtubeId ? (
        <div className="w-full h-full bg-slate-900 border-none flex items-center justify-center">
          <iframe
            key={`${youtubeId}-${isMuted}`}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
            className="w-full h-full aspect-[9/16]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="no-referrer"
            allowFullScreen
          ></iframe>
        </div>
      ) : tiktokId ? (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="no-referrer"
          allowFullScreen
        ></iframe>
      ) : (isPlatformLink && !youtubeId && !tiktokId) ? (
        <div className="flex flex-col items-center justify-center text-white bg-slate-950 absolute inset-0 text-center p-8 z-[100] bg-gradient-to-b from-slate-900 to-black">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
            <LinkIcon size={36} className="text-amber-500" />
          </div>
          <p className="font-serif font-bold text-2xl text-cream">Link Resolution Needed</p>
          <p className="text-sm text-cream/70 mt-4 max-w-[280px]">
            This social link needs to be opened directly to view its wisdom.
          </p>
          <div className="flex flex-col gap-3 mt-10 w-full max-w-[220px]">
            <a 
              href={videoUrl}
              target="_blank"
              rel="no-referrer"
              className="px-6 py-4 bg-gold text-starry-teal-dark rounded-full text-xs font-black uppercase tracking-widest shadow-xl noor-glow text-center"
            >
              Open External Source
            </a>
            <button 
              onClick={() => onError?.()}
              className="px-6 py-4 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest text-cream transition-all border border-white/10"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlay}
          onDoubleClick={handleDoubleClick}
          onError={handleVideoError}
          onLoadStart={() => setVideoLoading(true)}
          onWaiting={() => setVideoLoading(true)}
          onPlaying={() => setVideoLoading(false)}
          onLoadedData={() => setVideoLoading(false)}
        />
      )}

      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-20 text-white"
          >
            <Heart size={80} fill="white" className="drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Sidebar */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-20">
        <div className="relative mb-4 group cursor-pointer">
          <div className="w-14 h-14 rounded-full border-2 border-cream/50 overflow-hidden ring-4 ring-islamic-green/10 bg-slate-200 transition-transform duration-300 group-hover:scale-110 shadow-2xl">
            {clericPhoto ? (
              <img src={clericPhoto} alt={clericName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-cream">
                <User size={24} />
              </div>
            )}
          </div>
          <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold text-white rounded-full p-1.5 hover:bg-gold/90 transition-colors shadow-lg">
            <UserPlus size={16} />
          </button>
        </div>

        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center group"
        >
          <div className={cn(
            "p-3.5 rounded-full glass-morphism border-white/30 transition-all group-active:scale-90",
            isLiked ? "text-red-500 bg-red-50/50" : "text-white"
          )}>
            <Heart size={26} fill={isLiked ? "currentColor" : "none"} />
          </div>
          <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md tracking-wider">{likes + (isLiked ? 1 : 0)}</span>
        </button>

        <button className="flex flex-col items-center group">
          <div className="p-3.5 rounded-full glass-morphism border-white/30 text-white transition-all group-active:scale-90">
            <MessageCircle size={26} />
          </div>
          <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md tracking-wider">{comments}</span>
        </button>

        <button 
          onClick={() => setIsSaved(!isSaved)}
          className="flex flex-col items-center group"
        >
          <div className={cn(
            "p-3.5 rounded-full glass-morphism border-white/30 transition-all group-active:scale-90",
            isSaved ? "text-gold bg-gold/10" : "text-white"
          )}>
            <Bookmark size={26} fill={isSaved ? "currentColor" : "none"} />
          </div>
          <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md tracking-wider">Save</span>
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            toast.success("Creating Branded Story Clip...", {
              icon: '🎬',
              style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
            });
            setTimeout(() => {
              toast.success("Ready for Instagram/TikTok!", {
                icon: '🚀',
                style: { borderRadius: '1rem', background: '#0a1a1a', color: '#D4AF37' }
              });
            }, 1500);
          }}
          className="flex flex-col items-center group"
        >
          <div className="p-3.5 rounded-full glass-morphism border-white/30 text-white transition-all group-active:scale-90 hover:bg-gold hover:text-starry-teal-dark">
            <Sparkles size={26} />
          </div>
          <span className="text-white text-[10px] font-black uppercase mt-1.5 drop-shadow-md tracking-wider">Story</span>
        </button>

        <button className="flex flex-col items-center group">
          <div className="p-3.5 rounded-full glass-morphism border-white/30 text-white transition-all group-active:scale-90">
            <Share2 size={26} />
          </div>
          <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md tracking-wider">Share</span>
        </button>

        <button 
          onClick={toggleMute}
          className="flex flex-col items-center group"
        >
          <div className={cn(
            "p-3.5 rounded-full glass-morphism border-white/30 transition-all group-active:scale-90",
            !isMuted ? "text-gold bg-gold/10" : "text-white"
          )}>
            {!isMuted ? <Volume2 size={26} /> : <VolumeX size={26} />}
          </div>
          <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md tracking-wider">
            {!isMuted ? 'Sound On' : 'Muted'}
          </span>
        </button>

        <button 
          onClick={() => setIsFeedbackModalOpen(true)}
          className="flex flex-col items-center group"
        >
          <div className="p-3.5 rounded-full glass-morphism border-white/30 text-white transition-all group-active:scale-90 hover:bg-white/10">
            <MessageSquare size={26} />
          </div>
          <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md tracking-wider">Feedback</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-14 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
        <div className="flex items-center space-x-3 mb-3 pointer-events-auto group w-max">
          <div className="bg-glass-morphism px-3 py-1.5 rounded-full border border-white/20 flex items-center space-x-2 backdrop-blur-md">
            {videoUrl.includes('tiktok.com') ? (
              <Music size={14} className="text-cyan-400" />
            ) : videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
              <Youtube size={14} className="text-red-500" />
            ) : (
              <Film size={14} className="text-gold" />
            )}
            <h3 className="text-white font-serif font-bold text-sm">@{clericName}</h3>
            {isVerified && <CheckCircle2 size={14} className="text-blue-400 fill-blue-400" />}
          </div>
        </div>
        <h4 className="text-white font-serif font-bold text-xl mb-2 line-clamp-1 drop-shadow-lg tracking-tight">{title}</h4>
        <p className="text-cream/80 text-sm line-clamp-2 leading-relaxed drop-shadow-md max-w-[85%] font-medium">
          {description}
        </p>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-sm p-8 border-gold/30 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gold/20 rounded-xl text-gold">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-xl font-serif font-bold text-cream">Video Feedback</h3>
              </div>

              <div className="flex bg-slate-900/50 p-1 rounded-2xl mb-6 border border-white/5">
                {[
                  { id: 'positive', label: 'Positive', icon: ThumbsUp },
                  { id: 'constructive', label: 'Idea', icon: Sparkles },
                  { id: 'report', label: 'Report', icon: AlertTriangle }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFeedbackType(type.id as any)}
                    className={cn(
                      "flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      feedbackType === type.id 
                        ? "bg-gold text-starry-teal-dark shadow-lg" 
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <type.icon size={12} />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    feedbackType === 'positive' ? "What did you love about this lesson?" :
                    feedbackType === 'constructive' ? "How can we make this even better?" :
                    "What's the issue with this content?"
                  }
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 min-h-[120px] resize-none placeholder:text-slate-600"
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmittingFeedback || !feedbackText.trim()}
                  className="w-full bg-gold text-starry-teal-dark py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl noor-glow flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                >
                  {isSubmittingFeedback ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Feedback</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-[9px] text-slate-500 mt-6 uppercase tracking-[0.2em] font-medium transition-all">
                Your feedback helps the community grow
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
