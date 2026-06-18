import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, AudioLines, Video } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const QAModal = ({ isOpen, onClose, clericName, clericId }: { isOpen: boolean, onClose: () => void, clericName: string, clericId: string }) => {
  const [content, setContent] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to ask a question");
      return;
    }
    if (!content.trim()) return;

    try {
      await addDoc(collection(db, 'questions'), {
        userId: user.uid,
        userName: user.displayName,
        clericId,
        clericName,
        content,
        status: 'pending',
        isPaid,
        price: isPaid ? 10 : 0,
        createdAt: serverTimestamp(),
      });
      toast.success("Your question has been sent!");
      setContent('');
      onClose();
    } catch (error) {
      toast.error("Failed to send question");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-cream w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="bg-islamic-green p-6 text-cream">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-serif font-bold">Ask {clericName}</h2>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X />
                </button>
              </div>
              <p className="text-white/70 text-sm italic">Get personalized guidance and spiritual counseling.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Question</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-islamic-green/20 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={cn(
                    "flex-1 p-4 rounded-2xl border-2 transition-all text-left",
                    !isPaid ? "border-islamic-green bg-islamic-green/5" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <p className="font-bold text-slate-800">Free Q&A</p>
                  <p className="text-xs text-slate-500">Public response, standard priority</p>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={cn(
                    "flex-1 p-4 rounded-2xl border-2 transition-all text-left",
                    isPaid ? "border-gold bg-gold/5" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div className="flex justify-between">
                    <p className="font-bold text-slate-800">Private Session</p>
                    <span className="text-gold font-bold">$10</span>
                  </div>
                  <p className="text-xs text-slate-500">Priority response, private chat</p>
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex space-x-2">
                  <button type="button" className="p-2 text-slate-400 hover:text-islamic-green transition-colors"><AudioLines size={20}/></button>
                  <button type="button" className="p-2 text-slate-400 hover:text-islamic-green transition-colors"><Video size={20}/></button>
                </div>
                <button 
                  type="submit"
                  className="bg-islamic-green text-cream px-8 py-3 rounded-full font-bold flex items-center space-x-2 hover:bg-islamic-green-light transition-all shadow-lg shadow-islamic-green/20"
                >
                  <span>Send Question</span>
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
