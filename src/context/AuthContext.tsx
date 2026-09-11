import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { logout as supabaseLogout } from '../lib/auth';

// @ts-nocheck
const db = {};
const auth = { currentUser: { uid: '123' } };
const doc = (...args: any[]) => args;
const updateDoc = async (...args: any[]) => {};
const setDoc = async (...args: any[]) => {};
const deleteDoc = async (...args: any[]) => {};
const getDoc = async (...args: any[]) => ({ exists: () => false, data: () => ({}) });
const addDoc = async (...args: any[]) => ({ id: '123' });
const query = (...args: any[]) => args;
const where = (...args: any[]) => args;
const orderBy = (...args: any[]) => args;
const onSnapshot = (...args: any[]) => { return () => {}; };
const getDocs = async (...args: any[]) => ({ docs: [], empty: true });
const limit = (...args: any[]) => args;
const increment = (...args: any[]) => args;

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'user' | 'cleric' | 'admin' | 'scholar';
  verified?: boolean;
  isRevert?: boolean;
  bio?: string;
  specialty?: string;
  noorPoints?: number;
  noorLevel?: number;
  streakCount?: number;
  lastActive?: any;
  lastLogin?: any;
  revertPathDay?: number;
  lastRevertDayCompletedAt?: any;
  completedDeeds?: string[];
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true,
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await supabaseLogout();
  };

  useEffect(() => {
    const fetchProfile = async (sessionUser: any) => {
      try {
        const { data: profileSnap, error } = await supabase
          .from('users')
          .select('*')
          .eq('uid', sessionUser.id)
          .single();

        let currentProfile: UserProfile;

        if (profileSnap && !error) {
          currentProfile = profileSnap as UserProfile;
          console.log("Profile loaded:", currentProfile.role);
          
          await supabase.from('users').update({
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }).eq('uid', sessionUser.id);
          
          currentProfile.lastLogin = new Date();
        } else {
          console.log("No profile found, creating new one...");
          const isDev = sessionUser.email?.toLowerCase() === 'ibrahimfaruqolamilekan4@gmail.com';
          currentProfile = {
            uid: sessionUser.id,
            displayName: sessionUser.user_metadata?.full_name || 'Seeker',
            email: sessionUser.email,
            photoURL: sessionUser.user_metadata?.avatar_url,
            role: isDev ? 'admin' : 'user',
            verified: false,
            noorPoints: 0,
            noorLevel: 1,
            streakCount: 0,
            revertPathDay: 0,
            completedDeeds: [],
          } as UserProfile;
          
          try {
            await supabase.from('users').insert([{
              ...currentProfile,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }]);
            console.log("New profile created in Supabase");
          } catch (createErr: any) {
            console.error("Failed to create profile in Supabase:", createErr);
          }
        }

        if (sessionUser.email?.toLowerCase() === 'ibrahimfaruqolamilekan4@gmail.com' && currentProfile.role !== 'admin') {
          currentProfile.role = 'admin';
          supabase.from('users').update({ role: 'admin', updatedAt: new Date().toISOString() }).eq('uid', sessionUser.id).then();
        }
        
        setProfile(currentProfile);
      } catch (error: any) {
        console.error("AuthProvider profile sync failed:", error);
        import('react-hot-toast').then(({ toast }) => {
          toast.error(error?.message || "Spiritual connection interrupted. Please try again.", { id: 'auth-error' });
        });
        setProfile({
          uid: sessionUser.id,
          displayName: sessionUser.user_metadata?.full_name,
          email: sessionUser.email,
          photoURL: sessionUser.user_metadata?.avatar_url,
          role: sessionUser.email?.toLowerCase() === 'ibrahimfaruqolamilekan4@gmail.com' ? 'admin' : 'user'
        } as any);
      } finally {
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        fetchProfile(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
