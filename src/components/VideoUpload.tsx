import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { supabase, supabaseUrl } from '../lib/supabase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Video, Type, AlignLeft, Link as LinkIcon, Send, X, Loader2, Upload as UploadIcon, FileVideo } from 'lucide-react';
import toast from 'react-hot-toast';
import * as tus from 'tus-js-client';

export const VideoUpload = ({ onClose }: { onClose: () => void }) => {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'upload' | 'link'>('upload');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // Increase to 500MB as we use resumable
        toast.error('File too large. Max 500MB.');
        return;
      }
      setUploadFile(file);
    }
  };

  const uploadToSupabaseResumable = async (file: File): Promise<string> => {
    if (!supabase || !supabaseUrl) throw new Error('Supabase is not configured. Please check your environment variables.');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session found. Please sign in again.');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.uid}/${Date.now()}.${fileExt}`;
    const bucketName = 'videos';

    // Ensure URL is clean
    const cleanUrl = supabaseUrl.replace(/\/$/, '');

    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `${cleanUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName,
          objectName: fileName,
          contentType: file.type || 'video/mp4',
        },
        chunkSize: 6 * 1024 * 1024, // 6MB chunks
        onError: (error: any) => {
          console.error('TUS upload error:', error?.message || String(error));
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = (bytesUploaded / bytesTotal) * 100;
          setProgress(percentage);
        },
        onSuccess: () => {
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          resolve(publicUrl);
        },
      });

      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to contribute');
      return;
    }

    if (!title) {
      toast.error('Please add a title');
      return;
    }

    if (uploadMode === 'link' && !videoUrl) {
      toast.error('Please provide a video URL');
      return;
    }

    if (uploadMode === 'upload' && !uploadFile) {
      toast.error('Please select a video file');
      return;
    }

    setLoading(true);
    setProgress(0);
    try {
      let finalVideoUrl = videoUrl;

      if (uploadMode === 'upload' && uploadFile) {
        toast.loading('Starting resumable upload...', { id: 'upload' });
        finalVideoUrl = await uploadToSupabaseResumable(uploadFile);
        toast.dismiss('upload');
      }

      const videoData = {
        clericId: user.uid,
        clericName: profile?.displayName || user.displayName || 'Scholar',
        clericPhoto: profile?.photoURL || user.photoURL || null,
        title: title.trim(),
        description: description.trim() || null,
        videoUrl: finalVideoUrl,
        likes: 0,
        comments: 0,
        views: 0,
        shares: 0,
        createdAt: serverTimestamp(),
        isVerified: !!(profile?.role === 'admin' || profile?.role === 'cleric'),
      };

      try {
        await addDoc(collection(db, 'videos'), videoData);
        setProgress(100);
      } catch (error: any) {
        console.error("Firestore addDoc error:", error?.message || String(error));
        handleFirestoreError(error, OperationType.CREATE, 'videos');
        throw error;
      }
      
      toast.success('Wisdom shared successfully!');
      onClose();
    } catch (err: any) {
      console.error("Upload error details:", err?.message || String(err));
      toast.dismiss('upload');
      const errorMessage = err?.message || 'Upload failed. Network issue?';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-gold p-8 text-starry-teal-dark flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Video size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold leading-none">Share Wisdom</h2>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Manifest Your Light</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-white/5 bg-starry-teal-dark/50 backdrop-blur-md">
          <button 
            onClick={() => setUploadMode('upload')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'upload' ? 'text-gold border-b-2 border-gold' : 'text-slate-500 hover:text-slate-400'}`}
          >
            Gallery Upload
          </button>
          <button 
            onClick={() => setUploadMode('link')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'link' ? 'text-gold border-b-2 border-gold' : 'text-slate-500 hover:text-slate-400'}`}
          >
            Video Link
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-starry-teal-dark islamic-pattern">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">
                Sacred Title
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Power of Tawakkul..."
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">
                Soul Context (Description)
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Let the truth flow..."
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream focus:ring-2 focus:ring-gold/50 outline-none transition-all h-24 resize-none placeholder:text-slate-600"
              />
            </div>

            {uploadMode === 'upload' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">
                  Manifest Source
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-6 py-12 rounded-3xl border-2 border-dashed border-white/10 hover:border-gold/50 hover:bg-gold/5 cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                  />
                  {uploadFile ? (
                    <div className="flex items-center space-x-3 text-gold font-bold">
                      <FileVideo size={32} />
                      <span className="truncate max-w-[200px]">{uploadFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadIcon className="text-gold/40 group-hover:text-gold transition-colors" size={32} />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Click to select from your archives</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] ml-2">
                  Celestial Link (MP4 Only)
                </label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://sacred-storage.com/wisdom.mp4"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream focus:ring-2 focus:ring-gold/50 outline-none transition-all"
                />
              </div>
            )}
          </div>

          {loading && uploadMode === 'upload' && progress > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black text-gold/60 uppercase tracking-widest px-2">
                <span>Ascending...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-starry-teal-dark py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 shadow-2xl noor-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={20} />
                <span>Publish Growth</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
