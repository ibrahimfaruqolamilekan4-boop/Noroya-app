import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  updateDoc,
  addDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ARTICLES as INITIAL_ARTICLES } from '../data/articles';

// TYPES
export interface DreamEntry {
  id?: string;
  userId: string;
  description: string;
  interpretation?: string;
  mood?: string;
  createdAt: any;
}

export interface SavedResource {
  id?: string;
  userId: string;
  contentType: 'video' | 'ayah' | 'story' | 'miracle';
  contentId: string;
  metadata?: any;
  createdAt: any;
}

export interface LearningProgress {
  userId: string;
  completedModules: string[];
  currentLevel: number;
  points: number;
  updatedAt: any;
}

export interface NoorChat {
  id?: string;
  userId: string;
  messages: {
    role: 'user' | 'model';
    text: string;
    timestamp: any;
  }[];
  updatedAt: any;
}

export interface ScholarVideo {
  id: string;
  scholar_id: string;
  scholar_name?: string;
  scholar_photo?: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category: 'Daily Tafseer' | 'Prophetic Character' | 'Advice';
  created_at: any;
  is_published: boolean;
}

// RESILIENT CONNECTION ERROR DETECTOR
const isConnectionError = (error: any): boolean => {
  const errMsg = (error?.message || String(error)).toLowerCase();
  return (
    errMsg.includes('unavailable') ||
    errMsg.includes('could not reach cloud firestore') ||
    errMsg.includes('offline') ||
    errMsg.includes('failed to get document') ||
    errMsg.includes('network') ||
    errMsg.includes('quota exceeded') ||
    (error?.code && (
      error.code === 'unavailable' || 
      error.code === 'failed-precondition' || 
      error.code === 'resource-exhausted' ||
      error.code === 'permission-denied'
    ))
  );
};

// LOCAL CACHING ENGINE
const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    return normalizeTimestamps(parsed);
  } catch (e) {
    return fallback;
  }
};

const setLocal = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Local Storage caching issue:", e);
  }
};

// Helper to mimic Firestore Timestamps with a toDate() function
const normalizeTimestamps = (data: any): any => {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map(item => normalizeTimestamps(item));
  }
  if (typeof data === 'object') {
    if (data.seconds !== undefined) {
      return {
        ...data,
        toDate: () => new Date(data.seconds * 1000)
      };
    }
    const updated: any = {};
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (val && typeof val === 'object' && val.seconds !== undefined) {
        updated[key] = {
          ...val,
          toDate: () => new Date(val.seconds * 1000)
        };
      } else if (key.toLowerCase().endsWith('at') && typeof val === 'string' && !isNaN(Date.parse(val))) {
        const d = new Date(val);
        updated[key] = {
          seconds: Math.floor(d.getTime() / 1000),
          nanoseconds: 0,
          toDate: () => d
        };
      } else {
        updated[key] = normalizeTimestamps(val);
      }
    }
    return updated;
  }
  return data;
};

const createMockTimestamp = () => {
  const d = new Date();
  return {
    seconds: Math.floor(d.getTime() / 1000),
    nanoseconds: 0,
    toDate: () => d
  };
};

const getMockScholarVideos = (): ScholarVideo[] => [
  {
    id: "v1",
    scholar_id: "s1",
    scholar_name: "Sheikh Abdul Nasser Jangda",
    scholar_photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    title: "The Sweetness of Prayer",
    description: "Discover deep spiritual techniques to reach Khushu (concentration) and tranquility in Al-Salah.",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    category: "Advice",
    created_at: createMockTimestamp(),
    is_published: true
  },
  {
    id: "v2",
    scholar_id: "s2",
    scholar_name: "Imam Omar Suleiman",
    scholar_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    title: "Angels in Your Presence",
    description: "An contemplation of the spiritual entities that surround believers during private remembrance.",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1518005020251-58296d87e382?auto=format&fit=crop&q=80&w=800",
    category: "Prophetic Character",
    created_at: createMockTimestamp(),
    is_published: true
  }
];

// SERVICE METHODS
export const dbService = {
  // SCHOLAR VIDEOS
  getLatestScholarVideos: async () => {
    const path = 'scholar_videos';
    try {
      const q = query(
        collection(db, path),
        where('is_published', '==', true),
        orderBy('created_at', 'desc'),
        limit(5)
      );
      const snap = await getDocs(q);
      
      const videos = await Promise.all(snap.docs.map(async (vDoc) => {
        const videoData = vDoc.data() as ScholarVideo;
        let scholarData = null;
        try {
          const scholarSnap = await getDoc(doc(db, `users/${videoData.scholar_id}`));
          scholarData = scholarSnap.exists() ? scholarSnap.data() : null;
        } catch (e) {
          console.warn("Could not load scholar sub-profile, continuing cleanly:", videoData.scholar_id);
        }
        
        return {
          ...videoData,
          id: vDoc.id,
          scholar_name: scholarData?.displayName || 'Unknown Scholar',
          scholar_photo: scholarData?.photoURL || null
        } as ScholarVideo;
      }));
      
      setLocal('nooraya_scholar_videos', videos);
      return videos;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore unavailable gracefully mapping local fallback scholar videos list.");
        return getLocal('nooraya_scholar_videos', getMockScholarVideos());
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  uploadScholarVideo: async (video: Omit<ScholarVideo, 'id' | 'created_at'>) => {
    const path = 'scholar_videos';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...video,
        created_at: serverTimestamp(),
        is_published: true
      });
      const current = getLocal<ScholarVideo[]>('nooraya_scholar_videos', getMockScholarVideos());
      const newVid: ScholarVideo = {
        ...video,
        id: docRef.id,
        created_at: createMockTimestamp(),
        scholar_name: 'Noble Scholar',
        scholar_photo: undefined,
        is_published: true
      };
      setLocal('nooraya_scholar_videos', [newVid, ...current]);
      return docRef.id;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - logging scholar video to local sandbox cache.");
        const fakeId = "mock_sch_vid_" + Date.now();
        const current = getLocal<ScholarVideo[]>('nooraya_scholar_videos', getMockScholarVideos());
        const newVid: ScholarVideo = {
          ...video,
          id: fakeId,
          created_at: createMockTimestamp(),
          scholar_name: 'Noble Scholar',
          scholar_photo: undefined,
          is_published: true
        };
        setLocal('nooraya_scholar_videos', [newVid, ...current]);
        return fakeId;
      }
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // USER PROFILE
  updateRevertStatus: async (userId: string, isRevert: boolean) => {
    const path = `users/${userId}`;
    try {
      await updateDoc(doc(db, path), {
        isRevert,
        updatedAt: serverTimestamp()
      });
      setLocal(`nooraya_user_${userId}`, { isRevert, updatedAt: new Date().toISOString() });
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - saved user revert status locally.");
        setLocal(`nooraya_user_${userId}`, { isRevert, updatedAt: new Date().toISOString() });
        return;
      }
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // DREAMS
  logDream: async (userId: string, description: string, interpretation?: string) => {
    const path = 'dreams';
    try {
      const docRef = await addDoc(collection(db, path), {
        userId,
        description,
        interpretation,
        createdAt: serverTimestamp()
      });
      const current = getLocal<DreamEntry[]>('nooraya_dreams', []);
      const newDream: DreamEntry = {
        id: docRef.id,
        userId,
        description,
        interpretation,
        createdAt: createMockTimestamp()
      };
      setLocal('nooraya_dreams', [newDream, ...current]);
      return docRef.id;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - logged dream to local storage.");
        const fakeId = "mock_dream_" + Date.now();
        const current = getLocal<DreamEntry[]>('nooraya_dreams', []);
        const newDream: DreamEntry = {
          id: fakeId,
          userId,
          description,
          interpretation,
          createdAt: createMockTimestamp()
        };
        setLocal('nooraya_dreams', [newDream, ...current]);
        return fakeId;
      }
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getDreams: async (userId: string) => {
    const path = 'dreams';
    try {
      const q = query(
        collection(db, path), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const dreams = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DreamEntry));
      setLocal('nooraya_dreams', dreams);
      return dreams;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - querying dreams locally.");
        const allDreams = getLocal<DreamEntry[]>('nooraya_dreams', []);
        return allDreams.filter(d => d.userId === userId);
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  // SAVED CONTENT
  saveResource: async (resource: Omit<SavedResource, 'id' | 'createdAt'>) => {
    const path = `users/${resource.userId}/saved`;
    try {
      const q = query(
        collection(db, path),
        where('contentId', '==', resource.contentId),
        where('contentType', '==', resource.contentType)
      );
      const existing = await getDocs(q);
      if (!existing.empty) return existing.docs[0].id;

      const docRef = await addDoc(collection(db, path), {
        ...resource,
        createdAt: serverTimestamp()
      });
      const current = getLocal<SavedResource[]>(`nooraya_saved_${resource.userId}`, []);
      const newSaved: SavedResource = {
        ...resource,
        id: docRef.id,
        createdAt: createMockTimestamp()
      };
      setLocal(`nooraya_saved_${resource.userId}`, [newSaved, ...current]);
      return docRef.id;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - resource saved locally.");
        const current = getLocal<SavedResource[]>(`nooraya_saved_${resource.userId}`, []);
        const existingId = current.find(c => c.contentId === resource.contentId && c.contentType === resource.contentType)?.id;
        if (existingId) return existingId;
        
        const fakeId = "mock_save_" + Date.now();
        const newSaved: SavedResource = {
          ...resource,
          id: fakeId,
          createdAt: createMockTimestamp()
        };
        setLocal(`nooraya_saved_${resource.userId}`, [newSaved, ...current]);
        return fakeId;
      }
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getSavedResources: async (userId: string) => {
    const path = `users/${userId}/saved`;
    try {
      const snap = await getDocs(collection(db, path));
      const saved = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedResource));
      setLocal(`nooraya_saved_${userId}`, saved);
      return saved;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - loading saved content locally.");
        return getLocal<SavedResource[]>(`nooraya_saved_${userId}`, []);
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  unsaveResource: async (userId: string, resourceId: string) => {
    const path = `users/${userId}/saved/${resourceId}`;
    try {
      await deleteDoc(doc(db, path));
      const current = getLocal<SavedResource[]>(`nooraya_saved_${userId}`, []);
      setLocal(`nooraya_saved_${userId}`, current.filter(c => c.id !== resourceId));
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - unsaved resource in local cache.");
        const current = getLocal<SavedResource[]>(`nooraya_saved_${userId}`, []);
        setLocal(`nooraya_saved_${userId}`, current.filter(c => c.id !== resourceId));
        return;
      }
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // LEARNING PROGRESS
  updateProgress: async (userId: string, moduleId: string) => {
    const path = `users/${userId}/progress/stats`;
    try {
      const docRef = doc(db, path);
      const snap = await getDoc(docRef);
      
      let updated: LearningProgress;
      if (snap.exists()) {
        const data = snap.data() as LearningProgress;
        if (!data.completedModules.includes(moduleId)) {
          updated = {
            ...data,
            completedModules: [...data.completedModules, moduleId],
            points: (data.points || 0) + 10,
            updatedAt: createMockTimestamp()
          };
          await updateDoc(docRef, {
            completedModules: updated.completedModules,
            points: updated.points,
            updatedAt: serverTimestamp()
          });
        } else {
          updated = data;
        }
      } else {
        updated = {
          userId,
          completedModules: [moduleId],
          currentLevel: 1,
          points: 10,
          updatedAt: createMockTimestamp()
        };
        await setDoc(docRef, {
          userId,
          completedModules: updated.completedModules,
          currentLevel: updated.currentLevel,
          points: updated.points,
          updatedAt: serverTimestamp()
        });
      }
      setLocal(`nooraya_progress_${userId}`, updated);
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - logged progress locally.");
        const current = getLocal<LearningProgress | null>(`nooraya_progress_${userId}`, null);
        let updated: LearningProgress;
        if (current) {
          if (!current.completedModules.includes(moduleId)) {
            updated = {
              ...current,
              completedModules: [...current.completedModules, moduleId],
              points: (current.points || 0) + 10,
              updatedAt: createMockTimestamp()
            };
          } else {
            updated = current;
          }
        } else {
          updated = {
            userId,
            completedModules: [moduleId],
            currentLevel: 1,
            points: 10,
            updatedAt: createMockTimestamp()
          };
        }
        setLocal(`nooraya_progress_${userId}`, updated);
        return;
      }
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  getProgress: async (userId: string) => {
    const path = `users/${userId}/progress/stats`;
    try {
      const snap = await getDoc(doc(db, path));
      const stats = snap.exists() ? snap.data() as LearningProgress : null;
      if (stats) {
        setLocal(`nooraya_progress_${userId}`, stats);
      }
      return stats;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - fallback to local progress cache.");
        return getLocal<LearningProgress | null>(`nooraya_progress_${userId}`, null);
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  // NOOR CHATS
  saveNoorChat: async (userId: string, messages: any[]) => {
    const path = 'noor_chats';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        limit(1)
      );
      const snap = await getDocs(q);
      
      let docId: string;
      if (!snap.empty) {
        const lastChat = snap.docs[0];
        docId = lastChat.id;
        await updateDoc(doc(db, path, lastChat.id), {
          messages,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, path), {
          userId,
          messages,
          updatedAt: serverTimestamp()
        });
        docId = docRef.id;
      }
      
      setLocal(`nooraya_chats_${userId}`, { id: docId, userId, messages, updatedAt: new Date().toISOString() });
      return docId;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - cached advisor thread locally.");
        const fakeId = "mock_chat_" + Date.now();
        setLocal(`nooraya_chats_${userId}`, { id: fakeId, userId, messages, updatedAt: new Date().toISOString() });
        return fakeId;
      }
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // ARTICLES
  getArticles: async () => {
    const path = 'articles';
    try {
      const q = query(collection(db, path), orderBy('id', 'asc'));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ ...doc.data() } as any));
      if (fetched.length > 0) {
        setLocal('nooraya_articles', fetched);
        return fetched;
      }
      return getLocal('nooraya_articles', INITIAL_ARTICLES);
    } catch (error) {
      if (isConnectionError(error) || true) { // Graceful pre-seeded fallback by default
        console.warn("Firestore offline - loading articles from static preseed collection.");
        return getLocal('nooraya_articles', INITIAL_ARTICLES);
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  seedArticles: async (articles: any[]) => {
    const path = 'articles';
    try {
      setLocal('nooraya_articles', articles);
      for (const article of articles) {
        await setDoc(doc(db, path, article.id), {
          ...article,
          createdAt: serverTimestamp(),
          is_published: true
        });
      }
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - articles cached in client browser sandbox.");
        setLocal('nooraya_articles', articles);
        return;
      }
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // FEEDBACK
  submitVideoFeedback: async (feedback: { userId: string; videoId: string; feedback: string; type: 'positive' | 'constructive' | 'report' }) => {
    const path = 'video_feedback';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...feedback,
        createdAt: serverTimestamp()
      });
      const current = getLocal<any[]>('nooraya_feedback', []);
      const newFeedback = {
        ...feedback,
        id: docRef.id,
        createdAt: createMockTimestamp()
      };
      setLocal('nooraya_feedback', [newFeedback, ...current]);
      return docRef.id;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - feedback recorded locally.");
        const fakeId = "mock_feedback_" + Date.now();
        const current = getLocal<any[]>('nooraya_feedback', []);
        const newFeedback = {
          ...feedback,
          id: fakeId,
          createdAt: createMockTimestamp()
        };
        setLocal('nooraya_feedback', [newFeedback, ...current]);
        return fakeId;
      }
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // TARTEEL SESSIONS
  logTarteelSession: async (userId: string, sessionData: {
    verseId: string;
    verseName: string;
    errorsCount: number;
    fluencyPercentage: number;
    wrongWords: string[];
    createdAt?: any;
  }) => {
    const path = `users/${userId}/tarteel_sessions`;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...sessionData,
        createdAt: serverTimestamp()
      });
      
      const current = getLocal<any[]>(`nooraya_tarteel_sessions_${userId}`, []);
      const newSession = {
        ...sessionData,
        id: docRef.id,
        createdAt: createMockTimestamp()
      };
      setLocal(`nooraya_tarteel_sessions_${userId}`, [newSession, ...current]);
      return docRef.id;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - tarteel sessions saved in local sandboxed storage.");
        const fakeId = "mock_tarteel_" + Date.now();
        const current = getLocal<any[]>(`nooraya_tarteel_sessions_${userId}`, []);
        const newSession = {
          ...sessionData,
          id: fakeId,
          createdAt: createMockTimestamp()
        };
        setLocal(`nooraya_tarteel_sessions_${userId}`, [newSession, ...current]);
        return fakeId;
      }
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getTarteelSessions: async (userId: string) => {
    const path = `users/${userId}/tarteel_sessions`;
    try {
      const snap = await getDocs(query(collection(db, path), orderBy('createdAt', 'desc'), limit(15)));
      const sessions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setLocal(`nooraya_tarteel_sessions_${userId}`, sessions);
      return sessions;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn("Firestore offline - pulling local tarteel sessions ledger.");
        return getLocal<any[]>(`nooraya_tarteel_sessions_${userId}`, []);
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  }
};
