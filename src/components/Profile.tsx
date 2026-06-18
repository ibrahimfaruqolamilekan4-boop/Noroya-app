import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Save, LogOut, Sparkles, Upload, Activity } from 'lucide-react';
import { logout, handleFirestoreError, OperationType, signInWithGoogle } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { VideoUpload } from './VideoUpload';

export const Profile = () => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        bio,
        updatedAt: serverTimestamp(),
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 max-w-md mx-auto text-center px-6">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6 noor-glow">
          <User size={48} className="text-gold opacity-50" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-cream mb-2">Your Spiritual Portal</h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Sign in to save your favorite reminders, ask questions to scholars, and personalize your journey of light.
        </p>
        <button 
          onClick={signInWithGoogle}
          className="w-full bg-gold text-starry-teal-dark py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl noor-glow flex items-center justify-center space-x-3"
        >
          <User size={20} />
          <span>Continue with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 islamic-pattern min-h-screen">
      <div className="glass-card p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex items-center justify-between mb-12 relative z-10">
          <h1 className="text-4xl font-serif font-bold text-cream tracking-tight">Profile</h1>
          <button 
            onClick={() => logout()}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors font-black uppercase tracking-widest text-[10px]"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12 mb-16 relative z-10">
          <div className="relative group">
            <div className={cn(
              "p-1.5 rounded-[3.5rem] transition-all duration-1000",
              (profile?.noorLevel || 1) < 5 ? "bg-gradient-to-tr from-slate-400 to-slate-200 shadow-[0_0_30px_rgba(148,163,184,0.3)]" :
              (profile?.noorLevel || 1) < 15 ? "bg-gradient-to-tr from-gold via-amber-200 to-gold shadow-[0_0_50px_rgba(212,175,55,0.4)]" :
              "bg-gradient-to-tr from-teal-500 via-cyan-300 to-teal-500 shadow-[0_0_60px_rgba(20,184,166,0.5)]"
            )}>
              <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-2 border-white/20 shadow-2xl bg-starry-teal-dark">
                <img 
                  src={profile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'User')}&background=D4AF37&color=051A1D`} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 p-4 bg-gold text-starry-teal-dark rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <span className="px-3 py-1 bg-gold text-starry-teal-dark font-black text-[10px] rounded-full uppercase tracking-widest noor-glow">
                  Level {profile?.noorLevel || 1}
                </span>
                <span className="text-gold/60 text-[10px] font-black uppercase tracking-widest">
                  {profile?.noorPoints || 0} Noor Points
                </span>
              </div>
              <h2 className="text-4xl font-serif font-bold text-cream">{profile?.displayName}</h2>
              <p className="text-slate-400 flex items-center justify-center md:justify-start text-sm">
                <Mail size={14} className="mr-2 text-gold/50" />
                {profile?.email}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-5 py-3 bg-gold/10 border border-gold/20 rounded-[1.5rem] flex items-center space-x-3 noor-glow-sm">
                <Activity size={18} className="text-gold animate-pulse" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gold/60 leading-none mb-1">Streak</p>
                  <p className="text-lg font-serif font-bold text-gold leading-none">{profile?.streakCount || 0} Days</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center space-x-3">
                <Shield size={18} className="text-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gold italic">
                  {profile?.role === 'cleric' ? 'Verified Scholar' : profile?.role === 'admin' ? 'System Guardian' : profile?.noorLevel && profile.noorLevel >= 10 ? 'Guardian of Wisdom' : 'Spiritual Seeker'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-3 ml-2">Spiritual Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder:text-slate-600"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-3 ml-2">Soul Description (Bio)</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-cream focus:ring-2 focus:ring-gold/50 outline-none transition-all h-32 resize-none placeholder:text-slate-600"
                  placeholder="Tell your story..."
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-gold text-starry-teal-dark py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:scale-[1.02] transition-all disabled:opacity-50 noor-glow"
              >
                <Save size={18} />
                <span>{loading ? 'Manifesting...' : 'Seal Changes'}</span>
              </button>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-white/5 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-12 relative z-10">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-4">The Book of Life</h3>
              <p className="text-slate-300 leading-relaxed italic text-lg font-serif">
                {profile?.bio ? `"${profile.bio}"` : "This soul hasn't written its bio yet. Tap below to begin your narrative."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gold/10 text-gold border border-gold/20 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-gold/20 transition-all noor-glow"
              >
                Update Spiritual Identity
              </button>

              {(profile?.role === 'cleric' || profile?.role === 'admin') && (
                <button 
                  onClick={() => setIsUploading(true)}
                  className="flex-1 bg-gold text-starry-teal-dark py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all noor-glow flex items-center justify-center space-x-2 shadow-xl shadow-gold/20"
                >
                  <Upload size={16} />
                  <span>Share Wisdom</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {isUploading && (
        <VideoUpload onClose={() => setIsUploading(false)} />
      )}
    </div>
  );
};
