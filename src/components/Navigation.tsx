import React, { useState } from 'react';
import { Home, Compass, MessageSquareCode, User, Plus, Search, Bell, Shield, Menu, X, Settings as SettingsIcon, Sparkles, LogOut, Atom, UserPlus, Globe, BookCopy, Activity, Wind, Star, Music, Footprints, MoreHorizontal, Play, Pause, BookOpen, Mic } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { logout } from '../lib/firebase';
import { AuthModal } from './AuthModal';
import { VideoUpload } from './VideoUpload';
import { ScholarVideoUpload } from './ScholarVideoUpload';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, profile } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { isPlaying, togglePlay } = useAudio();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(false);
  const [showScholarUpload, setShowScholarUpload] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleToggle = () => setIsMenuOpen(prev => !prev);
    window.addEventListener('toggle-mobile-menu', handleToggle);
    return () => window.removeEventListener('toggle-mobile-menu', handleToggle);
  }, []);

  const handleShareApp = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    toast.success(isRTL ? 'تمت مشاركة السلام! تم نسخ الرابط.' : 'Peace shared! Link copied.', {
      icon: '✨',
      style: {
        borderRadius: '1rem',
        background: '#0A2F35',
        color: '#D4AF37',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      },
    });
  };

  const handleLangToggle = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    toast.success(newLang === 'en' ? 'Language set to English' : 'تم ضبط اللغة إلى العربية', {
      icon: '🌐',
      style: {
        borderRadius: '1rem',
        background: '#0A2F35',
        color: '#D4AF37',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      },
    });
  };

  const drawerNavItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/' },
    { icon: Footprints, label: 'Revert Path', path: '/revert' },
    { icon: Activity, label: t('nav.feed'), path: '/feed' },
    { icon: Compass, label: t('nav.explore'), path: '/explore' },
    { icon: MessageSquareCode, label: 'Scholar Hub', path: '/qa' },
    { icon: BookOpen, label: 'Al-Bayan', path: '/bayan' },
    { icon: Play, label: 'Quran Player', path: '/quran' },
    { icon: Mic, label: 'Tarteel Studio', path: '/tarteel' },
    { icon: Star, label: 'Shahada Portal', path: '/shahada' },
    { icon: Sparkles, label: t('nav.noor'), path: '/noor' },
    { icon: BookCopy, label: t('nav.library'), path: '/library' },
    { icon: Wind, label: t('nav.prayer'), path: '/prayer' },
    { icon: Atom, label: 'Quran Miracles', path: '/miracles' },
    { icon: User, label: t('nav.profile'), path: '/profile' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-midnight/80 backdrop-blur-xl border-b border-white/5 z-[60] px-4 md:px-8 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-2">
          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 sm:hidden text-cream hover:bg-white/5 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 ring-1 ring-gold/30 bg-midnight rounded-full flex items-center justify-center text-gold font-serif font-bold text-xl shadow-lg shadow-midnight/20 group-hover:scale-105 transition-transform duration-300 relative">
              N
              {isPlaying && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-islamic-green rounded-full flex items-center justify-center border-2 border-starry-teal-dark"
                >
                  <div className="flex items-end space-x-0.5 h-1.5 pt-0.5">
                    <motion.div 
                      animate={{ height: [2, 6, 2] }} 
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
                      className="w-0.5 bg-white rounded-full" 
                    />
                    <motion.div 
                      animate={{ height: [2, 6, 2] }} 
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      className="w-0.5 bg-white rounded-full" 
                    />
                    <motion.div 
                      animate={{ height: [2, 6, 2] }} 
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                      className="w-0.5 bg-white rounded-full" 
                    />
                  </div>
                </motion.div>
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-serif font-bold text-cream leading-none tracking-tight">Nooraya</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mt-0.5">Light of the Soul</p>
            </div>
          </Link>
        </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-islamic-green transition-colors" size={17} />
          <input 
            type="text" 
            placeholder="Search scholars, topics..." 
            className="w-full bg-slate-100/50 border border-transparent focus:border-islamic-green/20 focus:bg-white rounded-full py-2.5 pl-11 pr-4 outline-none transition-all text-sm soft-shadow"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={handleLangToggle}
          className="px-3 py-1.5 bg-white/5 border border-gold/10 rounded-xl text-gold font-black text-[10px] tracking-widest hover:bg-gold hover:text-midnight transition-all hidden sm:flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Globe size={14} />
          <span className="uppercase">{language}</span>
        </button>

        <button 
          onClick={togglePlay}
          className={cn(
            "p-2.5 rounded-xl transition-all border flex items-center space-x-2 group relative",
            isPlaying ? "bg-gold text-midnight border-gold noor-glow" : "text-gold bg-white/5 border-gold/10"
          )}
          title={isPlaying ? "Stop Quran" : "Play Quran"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
            {isPlaying ? 'Stop Quran' : 'Play Quran'}
          </span>
          {isPlaying && (
            <motion.div 
              layoutId="audio-pulse"
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-midnight"
            />
          )}
        </button>

        <button 
          onClick={handleShareApp}
          className="p-2.5 text-gold hover:bg-gold hover:text-starry-teal rounded-full md:rounded-xl transition-all flex items-center md:space-x-2 border border-gold/10 soft-shadow group"
          title="Share app to invite others"
        >
          <Share2 size={19} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold hidden md:block">Invite</span>
        </button>

        {user ? (
          <>
            <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors relative">
              <Bell size={22} />
              <span className={cn(
                "absolute top-2 w-2 h-2 bg-gold rounded-full noor-glow",
                isRTL ? "left-2" : "right-2"
              )} />
            </button>
            <div className="flex items-center space-x-4 ml-4 rtl:space-x-reverse rtl:mr-4 rtl:ml-0">
              <div className="text-right hidden sm:block rtl:text-left">
                <p className="text-sm font-bold text-cream leading-none">{user.displayName}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gold mt-1">
                  {profile?.role === 'cleric' ? 'Scholar' : profile?.role === 'admin' ? 'Guardian' : 'Seeker'}
                </p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="relative group w-10 h-10"
              >
                {/* Progress Ring */}
                <svg className="absolute -inset-1 w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="125.6"
                    initial={{ strokeDashoffset: 125.6 }}
                    animate={{ strokeDashoffset: 125.6 - (125.6 * ((profile?.noorPoints || 0) % 100)) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-gold noor-glow"
                  />
                </svg>
                <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-gold/20 shadow-xl relative z-10">
                  <img src={user.photoURL || ''} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gold text-starry-teal-dark px-8 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl noor-glow"
          >
            Login
          </button>
        )}
      </div>
    </nav>

    {/* Side Drawer Overlay */}
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] sm:hidden"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-starry-teal-dark border-r border-white/5 z-[80] sm:hidden flex flex-col p-8 islamic-pattern"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-midnight ring-1 ring-gold/30 rounded-full flex items-center justify-center text-gold font-serif font-bold text-2xl shadow-xl noor-glow">N</div>
                <div>
                  <h1 className="text-xl font-serif font-bold text-cream leading-none">Nooraya</h1>
                  <p className="text-[10px] uppercase tracking-widest text-gold font-bold mt-1">Celestial Light</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto">
              {drawerNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center space-x-4 p-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[9px]",
                      isActive ? "bg-gold text-midnight shadow-xl noor-glow" : "text-slate-400 hover:bg-white/5 hover:text-gold"
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Admin & Scholar Links in Drawer */}
              {(profile?.role === 'admin' || profile?.role === 'cleric' || profile?.role === 'scholar') && (
                <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                  <p className="text-[9px] font-bold text-gold/40 uppercase tracking-widest px-4 mb-2">Sacred Tools</p>
                  {(profile?.role === 'admin' || profile?.role === 'cleric' || profile?.role === 'scholar') && (
                    <button
                      onClick={() => { setShowScholarUpload(true); setIsMenuOpen(false); }}
                      className="w-full flex items-center space-x-4 p-3 rounded-2xl text-gold hover:bg-gold/10 transition-all font-black uppercase tracking-widest text-[9px]"
                    >
                      <Plus size={18} />
                      <span>Create</span>
                    </button>
                  )}
                  {(profile?.role === 'admin' || profile?.role === 'cleric') && (
                    <button
                      onClick={() => { setShowUpload(true); setIsMenuOpen(false); }}
                      className="w-full flex items-center space-x-4 p-3 rounded-2xl text-gold hover:bg-gold/10 transition-all font-black uppercase tracking-widest text-[9px]"
                    >
                      <Plus size={18} />
                      <span>Public</span>
                    </button>
                  )}
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => { navigate('/admin/tarteel'); setIsMenuOpen(false); }}
                      className={cn(
                        "w-full flex items-center space-x-4 p-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[9px]",
                        location.pathname === '/admin/tarteel'
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "text-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-400"
                      )}
                    >
                      <Mic size={18} />
                      <span>Tarteel Studio</span>
                    </button>
                  )}
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                      className="w-full flex items-center space-x-4 p-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-black uppercase tracking-widest text-[9px]"
                    >
                      <Shield size={18} />
                      <span>Admin</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
               <button 
                onClick={handleShareApp}
                className="w-full flex items-center space-x-3 p-3 text-gold font-black uppercase tracking-widest text-[9px]"
               >
                 <Share2 size={18} />
                 <span>Share Growth</span>
               </button>
               {user && (
                 <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 text-red-400 font-black uppercase tracking-widest text-[9px]"
                 >
                   <LogOut size={18} />
                   <span>End Session</span>
                 </button>
               )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    {showUpload && <VideoUpload onClose={() => setShowUpload(false)} />}
    {showScholarUpload && <ScholarVideoUpload onClose={() => setShowScholarUpload(false)} />}
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
  </>
);
};

export const Sidebar = () => {
  const { user, profile } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpload, setShowUpload] = React.useState(false);
  
    const sidebarNavItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/' },
    { icon: Footprints, label: 'Revert Path', path: '/revert' },
    { icon: Activity, label: t('nav.feed'), path: '/feed' },
    { icon: Compass, label: t('nav.explore'), path: '/explore' },
    { icon: MessageSquareCode, label: 'Scholar Hub', path: '/qa' },
    { icon: BookOpen, label: 'Al-Bayan', path: '/bayan' },
    { icon: Play, label: 'Quran Player', path: '/quran' },
    { icon: Mic, label: 'Tarteel Studio', path: '/tarteel' },
    { icon: Star, label: 'Shahada Portal', path: '/shahada' },
    { icon: Sparkles, label: t('nav.noor'), path: '/noor' },
    { icon: BookCopy, label: t('nav.library'), path: '/library' },
    { icon: Wind, label: t('nav.prayer'), path: '/prayer' },
    { icon: Atom, label: 'Quran Miracles', path: '/miracles' },
    { icon: User, label: t('nav.profile'), path: '/profile' },
  ];

  const [showScholarUpload, setShowScholarUpload] = React.useState(false);
  const [showMoreTools, setShowMoreTools] = React.useState(false);

  return (
    <>
      <aside className={cn(
        "fixed top-16 bottom-0 w-20 md:w-64 bg-midnight border-white/5 z-40 hidden sm:flex flex-col p-6 islamic-pattern",
        isRTL ? "right-0 border-l" : "left-0 border-r"
      )}>
        <div className="space-y-2 overflow-y-auto">
          {sidebarNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => item.path !== '#' && navigate(item.path)}
                className={cn(
                  "w-full flex items-center justify-center md:justify-start space-x-5 rtl:space-x-reverse p-4 rounded-[1.5rem] transition-all duration-300 group",
                  isActive 
                    ? "bg-gold text-midnight shadow-2xl shadow-gold/20 scale-[1.02] noor-glow" 
                    : "text-slate-400 hover:bg-white/5 hover:text-gold"
                )}
              >
                <item.icon size={22} className={cn("transition-transform duration-300", !isActive && "group-hover:scale-110")} />
                <span className={cn("font-black uppercase tracking-[0.2em] text-[10px] hidden md:block", isActive ? "text-starry-teal" : "text-slate-400")}>{item.label}</span>
              </button>
            );
          })}

          {(profile?.role === 'admin' || profile?.role === 'cleric' || profile?.role === 'scholar') && (
            <div className="mt-8 space-y-4">
              <button
                onClick={() => setShowMoreTools(!showMoreTools)}
                className={cn(
                   "w-full flex items-center justify-center md:justify-start space-x-5 p-4 rounded-[1.5rem] transition-all border border-gold/10 text-gold hover:bg-gold/10",
                   showMoreTools && "bg-gold/20"
                )}
              >
                <MoreHorizontal size={24} />
                <span className="font-black uppercase tracking-[0.2em] text-[10px] hidden md:block">More Tools</span>
              </button>

              <AnimatePresence>
                {showMoreTools && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {(profile?.role === 'admin' || profile?.role === 'cleric' || profile?.role === 'scholar') && (
                      <button
                        onClick={() => setShowScholarUpload(true)}
                        className="w-full flex items-center justify-center md:justify-start space-x-5 p-5 rounded-[1.5rem] transition-all bg-starry-teal text-gold border border-gold/20 shadow-2xl hover:bg-gold hover:text-starry-teal-dark hover:scale-[1.02] group active:scale-95 noor-glow"
                      >
                        <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px] hidden md:block">Create</span>
                      </button>
                    )}

                    {(profile?.role === 'admin' || profile?.role === 'cleric') && (
                      <button
                        onClick={() => setShowUpload(true)}
                        className="w-full flex items-center justify-center md:justify-start space-x-5 p-5 rounded-[1.5rem] transition-all bg-gold text-starry-teal shadow-2xl shadow-gold/20 hover:scale-[1.02] group active:scale-95 noor-glow"
                      >
                        <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px] hidden md:block">Public</span>
                      </button>
                    )}

                    {profile?.role === 'admin' && (
                      <button
                        onClick={() => navigate('/admin/tarteel')}
                        className={cn(
                          "w-full flex items-center justify-center md:justify-start space-x-5 p-4 rounded-[1.5rem] transition-all border border-transparent",
                          location.pathname === '/admin/tarteel'
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                            : "text-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-400"
                        )}
                      >
                        <Mic size={24} />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px] hidden md:block">Tarteel Studio</span>
                      </button>
                    )}
                    {profile?.role === 'admin' && (
                      <button
                        onClick={() => navigate('/admin')}
                        className={cn(
                          "w-full flex items-center justify-center md:justify-start space-x-5 p-4 rounded-[1.5rem] transition-all border border-transparent",
                          location.pathname === '/admin'
                            ? "bg-red-500/20 text-red-400 border-red-500/20"
                            : "text-red-400/60 hover:bg-red-500/10 hover:text-red-400"
                        )}
                      >
                        <Shield size={24} />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px] hidden md:block">Admin</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-auto space-y-6">
          {user && (
            <div className="p-4 bg-white/5 rounded-2xl hidden md:block border border-white/5">
              <p className="text-[9px] font-black text-gold/40 uppercase tracking-widest mb-2">Soul ID</p>
              <p className="text-[10px] font-mono text-slate-500 break-all select-all cursor-pointer hover:text-gold transition-colors" title="Click to copy soul identity">
                {user.uid}
              </p>
            </div>
          )}

          <div className="p-6 bg-gold/5 rounded-[2.5rem] border border-gold/10 hidden md:block group">
            <p className="text-[10px] font-black text-gold/60 uppercase tracking-widest mb-6">Guiding Lights</p>
            <div className="space-y-5">
               {['Sheikh Mansour', 'Dr. Amina Khalid', 'Imam Omar'].map(name => (
                 <div key={name} className="flex items-center space-x-3 cursor-pointer group/item">
                   <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group-hover/item:border-gold/50 transition-colors">
                     <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A2F35&color=D4AF37`} alt={name} className="w-full h-full opacity-60 group-hover/item:opacity-100 transition-opacity" />
                   </div>
                   <span className="text-xs font-bold text-slate-400 group-hover/item:text-cream truncate transition-colors">{name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </aside>
      {showUpload && <VideoUpload onClose={() => setShowUpload(false)} />}
      {showScholarUpload && <ScholarVideoUpload onClose={() => setShowScholarUpload(false)} />}
    </>
  );
};

export const MobileNav = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { isPlaying } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpload, setShowUpload] = React.useState(false);
  const [showScholarUpload, setShowScholarUpload] = React.useState(false);

  const navItems: { icon: any, label: string, path?: string, isMore?: boolean }[] = [
    { icon: Home, label: t('nav.dashboard'), path: '/' },
    { icon: BookOpen, label: 'Al-Bayan', path: '/bayan' },
    { icon: Compass, label: t('nav.explore'), path: '/explore' },
    { icon: Play, label: 'Quran', path: '/quran' },
    { icon: User, label: t('nav.profile'), path: '/profile' },
    { icon: MoreHorizontal, label: 'More', isMore: true },
  ];

  return (
    <>
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-midnight/90 backdrop-blur-2xl border border-white/10 z-[100] flex items-center justify-around px-2 sm:hidden shadow-2xl rounded-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.isMore) {
                  window.dispatchEvent(new CustomEvent('toggle-mobile-menu'));
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 p-2 rounded-2xl transition-all",
                isActive ? "text-gold" : "text-slate-400"
              )}
            >
              <item.icon size={20} className={cn("transition-all", isActive && "drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]")} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </nav>
      {showUpload && <VideoUpload onClose={() => setShowUpload(false)} />}
      {showScholarUpload && <ScholarVideoUpload onClose={() => setShowScholarUpload(false)} />}
    </>
  );
};
