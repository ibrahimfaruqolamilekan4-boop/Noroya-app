/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import { Navbar, Sidebar, MobileNav } from './components/Navigation';
import { VideoFeed } from './components/VideoFeed';
import { QAModal } from './components/QAModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Explore } from './components/Explore';
import { QAPage } from './components/QAPage';
import { MiraclesOfQuran } from './components/MiraclesOfQuran';
import { AICounselor } from './components/AICounselor';
import { ShahadaPortal } from './components/ShahadaPortal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { MessageCircle, Loader2, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { cn } from './lib/utils';

import { DailyLight } from './components/DailyLight';
import { AudioAtmosphere } from './components/AudioAtmosphere';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-midnight">
        <Loader2 className="animate-spin text-gold" size={48} />
      </div>
    );
  }
  
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const ProtectedWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <MainLayout>
      {children}
    </MainLayout>
  </ProtectedRoute>
);

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isRTL } = useLanguage();
  return (
    <div className="min-h-screen bg-midnight islamic-pattern selection:bg-gold/10 selection:text-gold overflow-x-hidden">
      <Toaster position="top-right" toastOptions={{
        className: 'font-serif glass-card border border-gold/10',
        duration: 3000,
      }} />
      <DailyLight />
      <AudioAtmosphere />
      <Navbar />
      <Sidebar />
      <main className={cn(
        "pt-16 min-h-[calc(100vh-64px)] transition-all duration-300 ease-in-out",
        isRTL ? "sm:mr-20 md:mr-64" : "sm:ml-20 md:ml-64"
      )}>
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

import { Dashboard } from './components/Dashboard';
import { PrayerGuide } from './components/PrayerGuide';
import { DuaLibrary } from './components/DuaLibrary';
import { RevertPath } from './components/RevertPath';
import { AlBayan } from './components/AlBayan';
import { QuranPlayer } from './components/QuranPlayer';
import { TarteelAIStudio } from './components/TarteelAIStudio';
import { Mic } from 'lucide-react';

export default function App() {
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <AudioProvider>
          <AuthProvider>
            <Routes>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/feed" element={
            <MainLayout>
              <div className="h-[calc(100vh-64px)] overflow-hidden flex justify-center">
                <VideoFeed />
              </div>
              <button 
                onClick={() => setIsQAModalOpen(true)}
                className="fixed bottom-32 sm:bottom-8 right-6 sm:right-8 z-[55] w-16 h-16 bg-gold text-midnight rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-gold/30 hover:scale-110 hover:rotate-6 active:scale-95 transition-all group noor-glow"
              >
                <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                <MessageCircle size={30} className="relative z-10" />
                <span className="absolute right-20 bg-gold text-midnight px-4 py-2 rounded-2xl text-xs font-serif font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-xl border border-gold/10">
                  Seek Guidance
                </span>
              </button>
              <QAModal 
                isOpen={isQAModalOpen} 
                onClose={() => setIsQAModalOpen(false)} 
                clericName="Sheikh Mansour" 
                clericId="mansour_id"
              />
            </MainLayout>
          } />
          <Route path="/prayer" element={
            <MainLayout>
              <PrayerGuide />
            </MainLayout>
          } />
          <Route path="/library" element={
            <MainLayout>
              <DuaLibrary />
            </MainLayout>
          } />
          <Route path="/revert" element={
            <ProtectedWrapper>
              <RevertPath />
            </ProtectedWrapper>
          } />
          <Route path="/noor" element={
            <ProtectedWrapper>
              <AICounselor />
            </ProtectedWrapper>
          } />
          <Route path="/tarteel" element={
            <MainLayout>
              <TarteelAIStudio />
            </MainLayout>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </AdminRoute>
          } />
          <Route path="/admin/tarteel" element={
            <MainLayout>
              <TarteelAIStudio />
            </MainLayout>
          } />
          <Route path="/explore" element={
            <MainLayout>
              <Explore />
            </MainLayout>
          } />
          <Route path="/qa" element={
            <MainLayout>
              <QAPage />
            </MainLayout>
          } />
          <Route path="/miracles" element={
            <MainLayout>
              <MiraclesOfQuran />
            </MainLayout>
          } />
          <Route path="/bayan" element={
            <MainLayout>
              <AlBayan />
            </MainLayout>
          } />
          <Route path="/quran" element={
            <QuranPlayer />
          } />
          <Route path="/shahada" element={
            <ProtectedRoute>
              <ShahadaPortal />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedWrapper>
              <Profile />
            </ProtectedWrapper>
          } />
          <Route path="/settings" element={
            <ProtectedWrapper>
              <Settings />
            </ProtectedWrapper>
          } />
          <Route path="*" element={
            <MainLayout>
              <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6 noor-glow">
                  <UserPlus size={48} className="text-gold opacity-50 rotate-45" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-cream mb-4 tracking-tight">Path Not Found</h2>
                <p className="text-slate-400 mb-8 max-w-md italic">The spiritual path you seek is currently veiled or does not exist. May your journey always be guided towards light.</p>
                <Link to="/" className="bg-gold text-midnight px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl noor-glow hover:scale-105 transition-all">
                  Return to Home
                </Link>
              </div>
            </MainLayout>
          } />
        </Routes>
          </AuthProvider>
        </AudioProvider>
      </LanguageProvider>
    </BrowserRouter>
);
}
