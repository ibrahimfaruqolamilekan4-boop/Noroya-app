import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, where } from 'firebase/firestore';
import { Shield, Check, X, Users, Video, AlertCircle, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [pendingClerics, setPendingClerics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'cleric'));
        const snap = await getDocs(q);
        // Filter in memory to avoid needing a composite index for (role, verified)
        const allClerics = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPendingClerics(allClerics.filter((c: any) => c.verified === false));
      } catch (err: any) {
        console.error("Admin fetch error:", err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleVerify = async (userId: string, status: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { verified: status });
      setPendingClerics(prev => prev.filter(p => p.id !== userId));
      toast.success(status ? "Cleric verified!" : "Verification rejected");
    } catch (err: any) {
      console.error("Verification error:", err?.message || String(err));
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gold/10 rounded-[2rem] flex items-center justify-center text-gold noor-glow">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold text-cream tracking-tight">Guardian Command</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mt-1">Registry of Wisdom</p>
          </div>
        </div>
        <div className="flex space-x-4">
           <div className="bg-white/5 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 flex items-center space-x-4">
             <Users className="text-gold" size={24}/>
             <div>
               <p className="text-[10px] font-black text-gold/40 uppercase tracking-widest leading-none">Total Souls</p>
               <p className="text-2xl font-black font-serif text-cream mt-1">1.2k</p>
             </div>
           </div>
           <div className="bg-white/5 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 flex items-center space-x-4">
             <Video className="text-gold" size={24}/>
             <div>
               <p className="text-[10px] font-black text-gold/40 uppercase tracking-widest leading-none">Manifestations</p>
               <p className="text-2xl font-black font-serif text-cream mt-1">450</p>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-[2.5rem] overflow-hidden">
            <div className="bg-white/5 px-10 py-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Pilgrim Verifications</h2>
              <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gold/20">
                {pendingClerics.length} Pending
              </span>
            </div>
            
            <div className="divide-y divide-white/5">
              {pendingClerics.length > 0 ? (
                pendingClerics.map((cleric) => (
                  <div key={cleric.id} className="p-10 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 overflow-hidden group-hover:border-gold/50 transition-all noor-glow">
                        <img src={cleric.photoURL || `https://ui-avatars.com/api/?name=${cleric.displayName}&background=0A2F35&color=D4AF37`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xl font-serif font-bold text-cream leading-none">{cleric.displayName}</p>
                        <p className="text-sm text-slate-400 mt-2">{cleric.email}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <span className="text-[10px] font-black bg-gold/10 text-gold px-3 py-1 rounded-lg uppercase tracking-widest border border-gold/10 uppercase">
                            {cleric.specialty || 'General Wisdom'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                       <button 
                        onClick={() => handleVerify(cleric.id, true)}
                        className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-xl hover:shadow-emerald-500/20"
                       >
                         <Check size={24} />
                       </button>
                       <button 
                         onClick={() => handleVerify(cleric.id, false)}
                         className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-xl hover:shadow-rose-500/20"
                       >
                         <X size={24} />
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-slate-500">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="opacity-20" size={48} />
                  </div>
                  <p className="text-sm italic font-serif">The registry is clear. No souls awaiting initiation.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gold text-starry-teal-dark p-10 rounded-[2.5rem] shadow-2xl noor-glow relative overflow-hidden group">
             <div className="relative z-10">
               <h3 className="text-2xl font-serif font-bold mb-4 tracking-tight">Wisdom Guard</h3>
               <p className="text-starry-teal-dark/70 text-sm mb-8 leading-relaxed">Oversee the collective consciousness and ensure the light remains pure.</p>
               <button className="w-full bg-starry-teal-dark text-gold py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl">
                 Audit Manifestations (4)
               </button>
             </div>
             <Shield className="absolute -right-12 -bottom-12 text-black/5 w-64 h-64 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Tarteel AI Studio card */}
          <Link to="/admin/tarteel" className="block">
            <div className="glass-card p-10 rounded-[2.5rem] group cursor-pointer relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-[1.2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
                  <Mic size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-cream mb-2">Tarteel AI Studio</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">Word-by-word Quran memorization with live speech recognition and accuracy review.</p>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  Open Studio →
                </span>
              </div>
              <Mic className="absolute -right-8 -bottom-8 text-emerald-500/5 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </Link>

          <div className="glass-card p-10 rounded-[2.5rem]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-8">Abundance Flow</h3>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm italic font-serif">Soul Pledges</span>
                <span className="font-serif font-bold text-emerald-400">$4,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm italic font-serif">Wisdom Exchange</span>
                <span className="font-serif font-bold text-emerald-400">$1,120</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)] rounded-full" />
              </div>
              <p className="text-[10px] text-slate-500 italic tracking-wider">75% of collective abundance target reached</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
