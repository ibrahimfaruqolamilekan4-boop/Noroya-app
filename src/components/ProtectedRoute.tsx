import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ShieldAlert, LogIn, Sparkles } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-starry-teal-dark flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-starry-teal-dark flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 max-w-md relative z-10 border-gold/30"
        >
          <div className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-8 noor-glow">
            <ShieldAlert size={40} />
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-cream mb-4">Sacred Entry Only</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This part of Nooraya is reserved for those who wish to preserve their journey. Please sign in to access your private vault.
          </p>

          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full bg-gold text-starry-teal-dark py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center space-x-3 hover:scale-105 transition-all"
            >
              <LogIn size={16} />
              <span>Continue Your Journey</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-white/5 text-slate-400 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
            >
              Return Home
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-2 text-gold/40 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} />
            <span>Encrypted & Private</span>
          </div>
        </motion.div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return <>{children}</>;
};
