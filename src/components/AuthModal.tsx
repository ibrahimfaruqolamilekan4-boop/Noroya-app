import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { loginWithEmail, registerWithEmail, signInWithGoogle } from '../lib/firebase';
import { toast } from 'react-hot-toast';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          className="relative w-full max-w-md bg-starry-teal-dark border border-gold/30 rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] z-10"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-gold hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>

          {/* Aesthetic background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="w-16 h-16 bg-gold/15 text-gold rounded-full flex items-center justify-center mx-auto mb-4 noor-glow">
              {isSignUp ? <UserPlus size={28} /> : <LogIn size={28} />}
            </div>
            <h2 className="text-2xl font-serif font-bold text-cream">
              {isSignUp ? "Begin Your Journey" : "Continue Your Journey"}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              {isSignUp ? "Enter your path credentials below to create a sanctuary profile" : "Return to your spiritual preservation vault"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {isSignUp && (
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
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-cream text-sm outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gold font-black mb-2">Secure Passcode</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-cream text-sm outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

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
          </form>

          {/* Fallback info */}
          <div className="my-6 border-t border-white/5" />

          {/* Google Sign-in toggle */}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
