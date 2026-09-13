import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Camera, Image as ImageIcon, Video, Send, Loader2, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const CreatePostModal = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [surahAyah, setSurahAyah] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('File size must be under 100MB');
      return;
    }

    const type = selected.type.startsWith('video/') ? 'video' : 'image';
    setMediaType(type);
    setFile(selected);
    
    // Create preview
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setStep('preview');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to post');
      return;
    }
    if (!file || !mediaType) return;

    setLoading(true);
    try {
      // Bucket logic
      const bucket = mediaType === 'video' ? 'quranic_videos' : 'quranic_images';
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Insert into posts table
      const { error: dbError } = await supabase.from('posts').insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: mediaType,
        caption: hashtags.trim() ? `${caption.trim()}\n\n${hashtags.trim()}` : caption.trim(),
        surah_ayah_ref: surahAyah.trim() || null,
        created_at: new Date().toISOString()
      });

      if (dbError) throw dbError;

      toast.success('Content published successfully!');
      onClose();
    } catch (err: any) {
      console.error('Upload Error:', err);
      toast.error(err.message || 'Failed to upload content');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-md bg-starry-teal-dark sm:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 shrink-0">
            <h2 className="text-xl font-serif font-bold text-cream">
              {step === 'select' ? 'Create Content' : 'New Post'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-gold hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar relative z-10">
            {step === 'select' ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => triggerFileSelect('video/*')}
                  className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-gold/30 transition-all group active:scale-95"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Video size={32} />
                  </div>
                  <span className="font-bold text-cream">Video</span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Upload or Record</span>
                </button>

                <button
                  onClick={() => triggerFileSelect('image/*')}
                  className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-gold/30 transition-all group active:scale-95"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} />
                  </div>
                  <span className="font-bold text-cream">Reflection</span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Post an Image</span>
                </button>
              </div>
            ) : (
              <form id="create-post-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Preview */}
                <div className="w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden relative shadow-inner">
                  {mediaType === 'video' ? (
                    <video
                      src={previewUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('select');
                      setFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-black mb-2">Caption</label>
                    <textarea
                      required
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write something beautiful..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-cream text-sm outline-none focus:border-gold/50 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-black mb-2">Hashtags (Optional)</label>
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="#Quran #Reflection #Peace"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-cream text-sm outline-none focus:border-gold/50 transition-colors mb-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-black mb-2">Surah / Ayah Reference (Optional)</label>
                    <input
                      type="text"
                      value={surahAyah}
                      onChange={(e) => setSurahAyah(e.target.value)}
                      placeholder="e.g. Al-Baqarah 2:255"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-cream text-sm outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          {step === 'preview' && (
            <div className="p-6 border-t border-white/5 shrink-0 bg-starry-teal-dark/95 backdrop-blur-xl relative z-10">
              <button
                type="submit"
                form="create-post-form"
                disabled={loading}
                className="w-full bg-gold text-starry-teal-dark font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                <span>{loading ? "Publishing..." : "Post"}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
