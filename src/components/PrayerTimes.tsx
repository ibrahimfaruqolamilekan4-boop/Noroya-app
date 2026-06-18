import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Navigation, MapPin, Sun, Moon, Sunrise, Sunset, Wind } from 'lucide-react';
import { cn } from '../lib/utils';

const PRAYERS = [
  { name: 'Fajr', time: '04:12', icon: Sunrise, active: false },
  { name: 'Sunrise', time: '05:45', icon: Sun, active: false },
  { name: 'Dhuhr', time: '13:02', icon: Sun, active: true },
  { name: 'Asr', time: '16:55', icon: Wind, active: false },
  { name: 'Maghrib', time: '20:18', icon: Sunset, active: false },
  { name: 'Isha', time: '21:45', icon: Moon, active: false }
];

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

export const PrayerTimes = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const iosEvent = e as DeviceOrientationEventiOS;
      if (iosEvent.webkitCompassHeading) {
        setRotation(360 - iosEvent.webkitCompassHeading);
      } else if (e.alpha !== null) {
        setRotation(360 - e.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-24 lg:flex gap-8">
      {/* Prayer Times Card */}
      <div className="flex-1 glass-card p-10 border-gold/20 mb-8 lg:mb-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 transition-transform duration-[10s] group-hover:scale-110" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <Clock className="text-gold" size={24} />
              <div>
                <h3 className="text-2xl font-serif font-bold text-cream">Celestial Times</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60 mt-1">London, United Kingdom</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-serif font-bold text-gold">13:02</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-2">Dhuhr in 0m</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRAYERS.map((prayer) => (
              <div 
                key={prayer.name}
                className={cn(
                  "p-6 rounded-3xl border transition-all duration-500",
                  prayer.active 
                    ? "bg-gold text-starry-teal-dark border-gold shadow-2xl noor-glow" 
                    : "bg-white/5 border-white/5 text-slate-400"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <prayer.icon size={18} className={prayer.active ? "text-starry-teal-dark" : "text-gold/60"} />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{prayer.name}</span>
                </div>
                <p className="text-2xl font-serif font-bold tracking-tight">{prayer.time}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <MapPin size={16} className="text-gold" />
             <p className="text-xs text-slate-500 font-serif italic">Your location is used for precise spiritual timing.</p>
          </div>
        </div>
      </div>

      {/* Qibla Finder Card */}
      <div className="lg:w-96 glass-card p-10 border-emerald-500/20 text-center flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-8 border border-emerald-500/20">
            <Navigation size={24} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-cream mb-2">Qibla Finder</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-12">Facing Ka'bah</p>

          <div className="relative w-48 h-48 mx-auto">
            {/* Compass Base */}
            <div className="absolute inset-0 rounded-full border-4 border-white/5 shadow-inner" />
            
            {/* Compass Details */}
            <div className="absolute inset-4 rounded-full border border-white/10 flex items-center justify-center">
               <span className="absolute top-2 text-[10px] font-black text-slate-600">N</span>
               <span className="absolute bottom-2 text-[10px] font-black text-slate-600">S</span>
               <span className="absolute left-2 text-[10px] font-black text-slate-600">W</span>
               <span className="absolute right-2 text-[10px] font-black text-slate-600">E</span>
            </div>

            {/* Moving Compass */}
            <motion.div 
              style={{ rotate: rotation }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-1 h-full bg-gradient-to-t from-transparent via-emerald-500/20 to-transparent absolute" />
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent absolute" />
              
              {/* Qibla Indicator */}
              <div className="absolute top-[-10px] flex flex-col items-center">
                 <div className="w-4 h-4 bg-emerald-500 rounded-full noor-glow" />
                 <div className="w-0.5 h-12 bg-emerald-500 mt-[-1px]" />
              </div>
            </motion.div>
          </div>

          <div className="mt-12 space-y-4">
             <p className="text-5xl font-serif font-bold text-cream tracking-tight">119° <span className="text-xl text-slate-600">SE</span></p>
             <p className="text-[11px] font-serif italic text-slate-500 max-w-xs mx-auto">
                Align the emerald pulse with the horizon. Most accurate when the device is flat.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
