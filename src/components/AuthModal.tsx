import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Sparkles, LogIn, UserPlus, Shield } from 'lucide-react';
import { loginWithEmail, registerWithEmail, signInWithGoogle } from '../lib/firebase';
import { toast } from 'react-hot-toast';

const ADMIN_EMAIL = 'ibrahimfaruqolamilekan4@gmail.com';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdminEmail = email.trim().toLowerCase() === ADMIN_EMAIL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Admin email → always use Google, never password
    if (isAdminEmail) {
      await handleAdminLogin();
      return;
    }
    if (!email || !password) {
      toast.error("Please fill in all credentials.");
      return;
    }
    if (isSignUp && !name) {
      toast.error("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await registerWithEmail(email, password, name);
        toast.success("Welcome! Your soul profile is created.");
      } else {
        await loginWithEmail(email, password);
        toast.success("Welcome back! Your journey continues.");
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome back, Guardian. Access granted.", {
        icon: '🛡️',
        style: {
          borderRadius: '1rem',
          background: '#0A2F35',
          color: '#E5C158',
          border: '1px solid rgba(229,193,88,0.3)',
        },
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Guardian login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome! Connected through the light.");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Google login failed. For direct iframe usage, please register via Email & Password below!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          className={`relative w-full max-w-md border rounded-[2.5rem] p-8 md:p-10 overflow-hidden z-10 transition-all duration-500 ${
            isAdminEmail
              ? 'bg-[#0A1A10] border-gold/60 shadow-[0_0_60px_rgba(229,193,88,0.25)]'
              : 'bg-starry-teal-dark border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]'
          }`}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-gold hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>

          {/* Aesthetic background elements */}
          <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-[40px] pointer-events-none transition-all duration-500 ${isAdminEmail ? 'bg-gold/20' : 'bg-gold/10'}`} />
          <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full blur-[40px] pointer-events-none transition-all duration-500 ${isAdminEmail ? 'bg-emerald-500/10' : 'bg-gold/5'}`} />

          {/* Header */}
          <div className="text-center mb-8 relative">
            <AnimatePresence mode="wait">
              {isAdminEmail ? (
                <motion.div
                  key="admin-header"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(229,193,88,0.4)]">
                    <Shield size={28} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gold">Guardian Access</h2>
                  <p className="text-xs text-gold/50 mt-2 font-black uppercase tracking-widest">Admin portal detected</p>
                </motion.div>
              ) : (
                <motion.div
                  key="user-header"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="w-16 h-16 bg-gold/15 text-gold rounded-full flex items-center justify-center mx-auto mb-4 noor-glow">
                    {isSignUp ? <UserPlus size={28} /> : <LogIn size={28} />}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-cream">
                    {isSignUp ? "Begin Your Journey" : "Continue Your Journey"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2">
                    {isSignUp ? "Enter your path credentials below to create a sanctuary profile" : "Return to your spiritual preservation vault"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {isSignUp && !isAdminEmail && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gold font-black mb-2">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Seeker of Truth"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-cream text-sm outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gold font-black mb-2">Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isAdminEmail ? 'text-gold' : 'text-slate-400'}`} size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-12 pr-4 text-cream text-sm outline-none transition-colors ${
                    isAdminEmail ? 'border-gold/50 focus:border-gold' : 'border-white/10 focus:border-gold/50'
                  }`}
                />
              </div>
            </div>

            {/* Password field — hidden for admin email */}
            <AnimatePresence>
              {!isAdminEmail && (
                <motion.div
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-black mb-2">Secure Passcode</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="password"
                      required={!isAdminEmail}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-cream text-sm outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin one-tap button */}
            <AnimatePresence>
              {isAdminEmail && (
                <motion.button
                  key="admin-btn"
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full bg-gold text-midnight font-black uppercase tracking-widest text-[11px] py-5 rounded-2xl shadow-[0_0_30px_rgba(229,193,88,0.4)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center space-x-3 mt-2 disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? (
                    <Sparkles className="animate-spin" size={16} />
                  ) : (
                    <Shield size={16} />
                  )}
                  <span>{loading ? "Verifying Guardian..." : "Enter as Guardian"}</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Regular submit button */}
            {!isAdminEmail && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-starry-teal-dark font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl shadow-xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center space-x-2 mt-6 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <Sparkles className="animate-spin" size={14} />
                ) : (
                  isSignUp ? <UserPlus size={14} /> : <LogIn size={14} />
                )}
                <span>{loading ? "Aligning Starry Path..." : isSignUp ? "Create Sanctum Profile" : "Open Your Vault"}</span>
              </button>
            )}
          </form>

          {/* Divider + extras — hidden for admin (they only need one button) */}
          {!isAdminEmail && (
            <>
              <div className="my-6 border-t border-white/5" />
              <div className="space-y-4 text-center">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white/5 text-slate-300 font-bold uppercase tracking-widest text-[9px] py-3.5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center space-x-2 border border-white/10"
                >
                  <LogIn size={12} />
                  <span>One-Click Google Sign In (Works outside iframe)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-gold font-medium hover:underline transition"
                >
                  {isSignUp ? "Already preserved a profile? Login" : "New to Nooraya? Register here"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
