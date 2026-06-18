import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService, ScholarVideo } from '../services/dbService';
import { Video, X, Loader2, Upload as UploadIcon, FileVideo, Send, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const ScholarVideoUpload = ({ onClose }: { onClose: () => void }) => {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState<ScholarVideo['category']>('Advice');
  const [loading, setLoading] = useState(false);

  // Security Check
  const isAuthorized = profile?.role === 'scholar' || profile?.role === 'cleric' || profile?.role === 'admin';

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-starry-teal-dark p-12 rounded-[2.5rem] border border-gold/20 text-center max-w-md">
           <X size={48} className="text-red-400 mx-auto mb-6" />
           <h2 className="text-2xl font-serif font-bold text-cream mb-4">Unauthorized Access</h2>
           <p className="text-slate-400 italic mb-8">Only verified scholars can share Daily Wisdom. Please contact the Guardians if you believe this is an error.</p>
           <button onClick={onClose} className="w-full bg-gold text-starry-teal-dark py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Close</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await dbService.uploadScholarVideo({
        scholar_id: user.uid,
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        category,
        is_published: true
      });
      
      toast.success('Wisdom published successfully!');
      onClose();
    } catch (err: any) {
      toast.error('Failed to publish wisdom. Check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-starry-teal-dark w-full max-w-xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl my-8">
        <div className="bg-gold p-10 text-starry-teal-dark flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center">
              <Layers size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold leading-none">Scholar Portal</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-60">Daily Wisdom Upload</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-black/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-8 islamic-pattern">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">Lesson Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Heart's Reflection..."
                className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-cream focus:border-gold/50 outline-none transition-all placeholder:text-slate-600 font-serif"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-cream focus:border-gold/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Daily Tafseer">Daily Tafseer</option>
                <option value="Prophetic Character">Prophetic Character</option>
                <option value="Advice">Advice</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">Video MP4 URL</label>
              <input 
                type="url" 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://storage.googleapis.com/..."
                className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-cream focus:border-gold/50 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">Thumbnail Image URL</label>
              <input 
                type="url" 
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-cream focus:border-gold/50 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">Summary (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief summary of the lesson..."
                className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-cream focus:border-gold/50 outline-none transition-all h-32 resize-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-starry-teal-dark py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center space-x-4 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all noor-glow"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : (
              <>
                <Send size={20} />
                <span>Publish Lesson</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
