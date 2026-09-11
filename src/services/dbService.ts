
import { supabase } from '../lib/supabase';
import { OperationType, handleFirestoreError } from '../lib/auth';
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

// LOCAL CACHING ENGINE
const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data);
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

const createMockTimestamp = () => {
  return new Date().toISOString();
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
  getLatestScholarVideos: async () => {
    try {
      const { data, error } = await supabase
        .from('scholar_videos')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      const videos = await Promise.all((data || []).map(async (vDoc: any) => {
        const { data: scholarData } = await supabase.from('users').select('*').eq('uid', vDoc.scholar_id).single();
        return {
          ...vDoc,
          scholar_name: scholarData?.displayName || 'Unknown Scholar',
          scholar_photo: scholarData?.photoURL || null
        } as ScholarVideo;
      }));
      
      setLocal('nooraya_scholar_videos', videos);
      return videos;
    } catch (error) {
      return getLocal('nooraya_scholar_videos', getMockScholarVideos());
    }
  },

  uploadScholarVideo: async (video: Omit<ScholarVideo, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase.from('scholar_videos').insert([{
        ...video,
        created_at: createMockTimestamp(),
        is_published: true
      }]).select().single();
      
      if (error) throw error;
      
      const current = getLocal<ScholarVideo[]>('nooraya_scholar_videos', getMockScholarVideos());
      setLocal('nooraya_scholar_videos', [data, ...current]);
      return data.id;
    } catch (error) {
      console.warn("Offline - logging scholar video to local sandbox cache.");
      const fakeId = "mock_sch_vid_" + Date.now();
      const current = getLocal<ScholarVideo[]>('nooraya_scholar_videos', getMockScholarVideos());
      const newVid = { ...video, id: fakeId, created_at: createMockTimestamp(), is_published: true, scholar_name: 'Noble Scholar' } as ScholarVideo;
      setLocal('nooraya_scholar_videos', [newVid, ...current]);
      return fakeId;
    }
  },

  updateRevertStatus: async (userId: string, isRevert: boolean) => {
    try {
      await supabase.from('users').update({ isRevert, updatedAt: createMockTimestamp() }).eq('uid', userId);
      setLocal(`nooraya_user_${userId}`, { isRevert, updatedAt: createMockTimestamp() });
    } catch (error) {
      setLocal(`nooraya_user_${userId}`, { isRevert, updatedAt: createMockTimestamp() });
    }
  },

  logDream: async (userId: string, description: string, interpretation?: string) => {
    try {
      const { data, error } = await supabase.from('dreams').insert([{
        userId, description, interpretation, createdAt: createMockTimestamp()
      }]).select().single();
      if (error) throw error;
      
      const current = getLocal<DreamEntry[]>('nooraya_dreams', []);
      setLocal('nooraya_dreams', [data, ...current]);
      return data.id;
    } catch (error) {
      const fakeId = "mock_dream_" + Date.now();
      const newDream = { id: fakeId, userId, description, interpretation, createdAt: createMockTimestamp() };
      const current = getLocal<DreamEntry[]>('nooraya_dreams', []);
      setLocal('nooraya_dreams', [newDream, ...current]);
      return fakeId;
    }
  },

  getDreams: async (userId: string) => {
    try {
      const { data, error } = await supabase.from('dreams').select('*').eq('userId', userId).order('createdAt', { ascending: false });
      if (error) throw error;
      setLocal('nooraya_dreams', data);
      return data;
    } catch (error) {
      const allDreams = getLocal<DreamEntry[]>('nooraya_dreams', []);
      return allDreams.filter(d => d.userId === userId);
    }
  },

  saveResource: async (resource: Omit<SavedResource, 'id' | 'createdAt'>) => {
    try {
      const { data: existing } = await supabase.from('saved_resources')
        .select('*')
        .eq('userId', resource.userId)
        .eq('contentId', resource.contentId)
        .eq('contentType', resource.contentType)
        .single();
        
      if (existing) return existing.id;

      const { data, error } = await supabase.from('saved_resources').insert([{
        ...resource, createdAt: createMockTimestamp()
      }]).select().single();
      if (error) throw error;
      
      const current = getLocal<SavedResource[]>(`nooraya_saved_${resource.userId}`, []);
      setLocal(`nooraya_saved_${resource.userId}`, [data, ...current]);
      return data.id;
    } catch (error) {
      const fakeId = "mock_save_" + Date.now();
      const current = getLocal<SavedResource[]>(`nooraya_saved_${resource.userId}`, []);
      const existingId = current.find(c => c.contentId === resource.contentId && c.contentType === resource.contentType)?.id;
      if (existingId) return existingId;
      
      const newSaved = { ...resource, id: fakeId, createdAt: createMockTimestamp() };
      setLocal(`nooraya_saved_${resource.userId}`, [newSaved, ...current]);
      return fakeId;
    }
  },

  getSavedResources: async (userId: string) => {
    try {
      const { data, error } = await supabase.from('saved_resources').select('*').eq('userId', userId);
      if (error) throw error;
      setLocal(`nooraya_saved_${userId}`, data);
      return data;
    } catch (error) {
      return getLocal<SavedResource[]>(`nooraya_saved_${userId}`, []);
    }
  },

  unsaveResource: async (userId: string, resourceId: string) => {
    try {
      await supabase.from('saved_resources').delete().eq('id', resourceId);
      const current = getLocal<SavedResource[]>(`nooraya_saved_${userId}`, []);
      setLocal(`nooraya_saved_${userId}`, current.filter(c => c.id !== resourceId));
    } catch (error) {
      const current = getLocal<SavedResource[]>(`nooraya_saved_${userId}`, []);
      setLocal(`nooraya_saved_${userId}`, current.filter(c => c.id !== resourceId));
    }
  },

  updateProgress: async (userId: string, moduleId: string) => {
    try {
      const { data: snap } = await supabase.from('progress').select('*').eq('userId', userId).single();
      let updated: LearningProgress;
      if (snap) {
        if (!snap.completedModules.includes(moduleId)) {
          updated = {
            ...snap,
            completedModules: [...snap.completedModules, moduleId],
            points: (snap.points || 0) + 10,
            updatedAt: createMockTimestamp()
          };
          await supabase.from('progress').update({
            completedModules: updated.completedModules,
            points: updated.points,
            updatedAt: updated.updatedAt
          }).eq('userId', userId);
        } else {
          updated = snap;
        }
      } else {
        updated = {
          userId,
          completedModules: [moduleId],
          currentLevel: 1,
          points: 10,
          updatedAt: createMockTimestamp()
        };
        await supabase.from('progress').insert([updated]);
      }
      setLocal(`nooraya_progress_${userId}`, updated);
    } catch (error) {
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
        updated = { userId, completedModules: [moduleId], currentLevel: 1, points: 10, updatedAt: createMockTimestamp() };
      }
      setLocal(`nooraya_progress_${userId}`, updated);
    }
  },

  getProgress: async (userId: string) => {
    try {
      const { data, error } = await supabase.from('progress').select('*').eq('userId', userId).single();
      if (data) setLocal(`nooraya_progress_${userId}`, data);
      return data;
    } catch (error) {
      return getLocal<LearningProgress | null>(`nooraya_progress_${userId}`, null);
    }
  },

  saveNoorChat: async (userId: string, messages: any[]) => {
    try {
      const { data: snap } = await supabase.from('noor_chats').select('*').eq('userId', userId).order('updatedAt', { ascending: false }).limit(1).single();
      let docId;
      if (snap) {
        docId = snap.id;
        await supabase.from('noor_chats').update({ messages, updatedAt: createMockTimestamp() }).eq('id', snap.id);
      } else {
        const { data } = await supabase.from('noor_chats').insert([{ userId, messages, updatedAt: createMockTimestamp() }]).select().single();
        docId = data?.id;
      }
      setLocal(`nooraya_chats_${userId}`, { id: docId, userId, messages, updatedAt: createMockTimestamp() });
      return docId;
    } catch (error) {
      const fakeId = "mock_chat_" + Date.now();
      setLocal(`nooraya_chats_${userId}`, { id: fakeId, userId, messages, updatedAt: createMockTimestamp() });
      return fakeId;
    }
  },

  getArticles: async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        setLocal('nooraya_articles', data);
        return data;
      }
      return getLocal('nooraya_articles', INITIAL_ARTICLES);
    } catch (error) {
      return getLocal('nooraya_articles', INITIAL_ARTICLES);
    }
  },

  seedArticles: async (articles: any[]) => {
    try {
      setLocal('nooraya_articles', articles);
      for (const article of articles) {
        await supabase.from('articles').upsert([{ ...article, createdAt: createMockTimestamp(), is_published: true }]);
      }
    } catch (error) {
      setLocal('nooraya_articles', articles);
    }
  },

  submitVideoFeedback: async (feedback: { userId: string; videoId: string; feedback: string; type: 'positive' | 'constructive' | 'report' }) => {
    try {
      const { data, error } = await supabase.from('video_feedback').insert([{ ...feedback, createdAt: createMockTimestamp() }]).select().single();
      if (error) throw error;
      const current = getLocal<any[]>('nooraya_feedback', []);
      setLocal('nooraya_feedback', [data, ...current]);
      return data.id;
    } catch (error) {
      const fakeId = "mock_feedback_" + Date.now();
      const current = getLocal<any[]>('nooraya_feedback', []);
      setLocal('nooraya_feedback', [{ ...feedback, id: fakeId, createdAt: createMockTimestamp() }, ...current]);
      return fakeId;
    }
  },

  logTarteelSession: async (userId: string, sessionData: { verseId: string; verseName: string; errorsCount: number; fluencyPercentage: number; wrongWords: string[]; createdAt?: any; }) => {
    try {
      const { data, error } = await supabase.from('tarteel_sessions').insert([{ ...sessionData, userId, createdAt: createMockTimestamp() }]).select().single();
      if (error) throw error;
      const current = getLocal<any[]>(`nooraya_tarteel_sessions_${userId}`, []);
      setLocal(`nooraya_tarteel_sessions_${userId}`, [data, ...current]);
      return data.id;
    } catch (error) {
      const fakeId = "mock_tarteel_" + Date.now();
      const current = getLocal<any[]>(`nooraya_tarteel_sessions_${userId}`, []);
      setLocal(`nooraya_tarteel_sessions_${userId}`, [{ ...sessionData, id: fakeId, createdAt: createMockTimestamp() }, ...current]);
      return fakeId;
    }
  },

  getTarteelSessions: async (userId: string) => {
    try {
      const { data, error } = await supabase.from('tarteel_sessions').select('*').eq('userId', userId).order('createdAt', { ascending: false }).limit(15);
      if (error) throw error;
      setLocal(`nooraya_tarteel_sessions_${userId}`, data);
      return data;
    } catch (error) {
      return getLocal<any[]>(`nooraya_tarteel_sessions_${userId}`, []);
    }
  }
};
