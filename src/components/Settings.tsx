
import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, CircleUser, Moon, Globe, LogOut, ChevronRight, HelpCircle, Music, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

export const Settings = () => {
  const { user, profile, logout } = useAuth();
  const { isPlaying, volume, togglePlay, setVolume } = useAudio();

  const sections = [
    {
      title: 'Account',
      Icon: CircleUser,
      items: [
        { label: 'Profile Information', sub: profile?.displayName || user?.email || '', icon: CircleUser },
        { label: 'Privacy & Security', sub: 'Manage your data', icon: Shield },
      ]
    },
    {
      title: 'Atmosphere',
      Icon: Music,
      items: [],
      customContent: (
        <div className="space-y-6 pt-4">
           <div className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5">
             <div className="flex items-center space-x-5">
               <div className={cn(
                 "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                 isPlaying ? "bg-gold text-starry-teal-dark shadow-lg shadow-gold/20" : "bg-white/5 text-slate-500"
               )}>
                 <Music size={22} />
               </div>
               <div className="text-left">
                 <p className="text-sm font-bold text-cream">Background Wisdom</p>
                 <p className="text-[10px] text-slate-500 font-bold tracking-tight mt-0.5">Subtle ambient serenity</p>
               </div>
             </div>
             <button 
               onClick={togglePlay}
               className={cn(
                 "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                 isPlaying ? "bg-gold text-starry-teal-dark noor-glow" : "bg-white/10 text-cream hover:bg-white/20"
               )}
             >
               {isPlaying ? 'Disable' : 'Enable'}
             </button>
           </div>

           {isPlaying && (
             <div className="px-5 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Volume2 size={12} />
                    <span>Harmony Volume</span>
                  </div>
                  <span className="text-gold">{Math.round(volume * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                />
             </div>
           )}
        </div>
      )
    },
    {
      title: 'Preferences',
      Icon: SettingsIcon,
      items: [
        { label: 'Notifications', sub: 'Enabled', icon: Bell },
        { label: 'Language', sub: 'English', icon: Globe },
        { label: 'Dark Mode', sub: 'On', icon: Moon },
      ]
    },
    {
      title: 'Journey Role',
      Icon: Shield,
      items: [
        { 
          label: profile?.role === 'cleric' ? 'Scholar Mode Active' : 'Apply for Scholar Access', 
          sub: profile?.role === 'cleric' ? 'You can now share wisdom videos' : 'Share your knowledge with the Ummah', 
          icon: Shield,
          onClick: async () => {
            if (profile?.role === 'user') {
              if (confirm("Would you like to register as a Scholar? This allows you to upload lessons and answer counseling requests.")) {
                try {
                  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
                  const { db, handleFirestoreError, OperationType } = await import('../lib/firebase');
                  await updateDoc(doc(db, 'users', user!.uid), { 
                    role: 'cleric', 
                    verified: true,
                    updatedAt: serverTimestamp()
                  });
                  toast.success('Congratulations! You are now a Scholar of Light.');
                  setTimeout(() => window.location.reload(), 1500);
                } catch (err: any) {
                  console.error("Scholar registration failed:", err?.message || String(err));
                  toast.error("Manifestation failed. Please try again.");
                }
              }
            }
          }
        },
      ]
    },
    {
      title: 'Support',
      Icon: HelpCircle,
      items: [
        { label: 'Help Center', sub: '', icon: HelpCircle },
        { label: 'About Nooraya', sub: 'v1.0.0', icon: Shield },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 islamic-pattern min-h-screen">
      <div className="flex items-center space-x-6 mb-12">
        <div className="w-20 h-20 bg-gold/20 text-gold rounded-[2rem] flex items-center justify-center shadow-xl noor-glow border border-gold/20 overflow-hidden">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <SettingsIcon size={36} />
          )}
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-cream">{profile?.displayName || 'Seeker'}</h1>
          <p className="text-gold font-black uppercase tracking-widest text-[10px] mt-1">
            {profile?.role === 'cleric' ? 'Verified Scholar' : 'Spiritual Traveler'}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="glass-card p-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60 mb-8">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item: any) => (
                <button 
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-5 rounded-3xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-white/5 text-gold rounded-2xl flex items-center justify-center group-hover:bg-gold group-hover:text-starry-teal transition-all">
                      <item.icon size={22} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-cream group-hover:text-gold transition-colors">{item.label}</p>
                      {item.sub && <p className="text-[10px] text-slate-500 font-bold tracking-tight mt-0.5">{item.sub}</p>}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-600 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              {section.customContent}
            </div>
          </section>
        ))}

        <button 
          onClick={() => logout()}
          className="w-full mt-12 bg-red-500/10 text-red-400 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-xl"
        >
          <LogOut size={20} />
          <span>Surrender Session (Sign Out)</span>
        </button>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-black text-slate-600 tracking-[0.3em] uppercase">Nooraya • Spiritual Intelligence</p>
      </div>
    </div>
  );
};
