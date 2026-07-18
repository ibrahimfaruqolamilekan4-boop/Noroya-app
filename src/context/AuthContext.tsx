import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { logout as firebaseLogout, googleProvider } from '../lib/firebase';

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
  user: FirebaseUser | null;
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await firebaseLogout();
  };

  useEffect(() => {
    // Handle return from signInWithRedirect (Google redirect flow on mobile/blocked-popup)
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log("Redirect sign-in succeeded:", result.user.email);
      }
    }).catch((err) => {
      console.warn("getRedirectResult error (usually safe to ignore):", err?.code);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        setLoading(true);
        try {
          const profileRef = doc(db, 'users', firebaseUser.uid);
          let profileSnap;
          try {
            profileSnap = await getDoc(profileRef);
          } catch (fetchErr) {
            console.error("Critical error fetching profile:", fetchErr);
            throw fetchErr;
          }
          
          let currentProfile: UserProfile;

          if (profileSnap.exists()) {
            currentProfile = profileSnap.data() as UserProfile;
            console.log("Profile loaded:", currentProfile.role);
            // Non-blocking update
            updateDoc(profileRef, { 
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp()
            }).catch(e => console.warn("Background timestamp update failed:", e));
            currentProfile.lastLogin = new Date();
          } else {
            console.log("No profile found, creating new one...");
            const isDev = firebaseUser.email?.toLowerCase() === 'ibrahimfaruqolamilekan4@gmail.com';
            currentProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Seeker',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              role: isDev ? 'admin' : 'user',
              verified: false,
              noorPoints: 0,
              noorLevel: 1,
              streakCount: 0,
              revertPathDay: 0,
              completedDeeds: [],
              createdAt: new Date().toISOString(),
            } as UserProfile;
            
            try {
              await setDoc(profileRef, {
                ...currentProfile,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              console.log("New profile created in Firestore");
            } catch (createErr: any) {
              console.error("Failed to create profile in Firestore:", createErr?.message || String(createErr));
              // Important: We continue with the currentProfile in memory so the app doesn't crash
            }
          }

          // Force admin role for developer
          if (firebaseUser.email?.toLowerCase() === 'ibrahimfaruqolamilekan4@gmail.com' && currentProfile.role !== 'admin') {
            currentProfile.role = 'admin';
            setDoc(profileRef, { role: 'admin', updatedAt: serverTimestamp() }, { merge: true })
              .catch(e => console.warn("Background admin force failed:", e));
          }
          
          setProfile(currentProfile);
        } catch (error: any) {
          console.error("AuthProvider profile sync failed:", error);
          // Only show toast for actual errors, not just being logged out
          const message = error?.message || "Spiritual connection interrupted. Please try again.";
          
          // Import toast dynamically to avoid SSR/Initial load issues
          import('react-hot-toast').then(({ toast }) => {
            toast.error(message, { id: 'auth-error' });
          });

          // Fallback profile if we can't fetch but have a user
          setProfile({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: firebaseUser.email?.toLowerCase() === 'ibrahimfaruqolamilekan4@gmail.com' ? 'admin' : 'user'
          } as any);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
