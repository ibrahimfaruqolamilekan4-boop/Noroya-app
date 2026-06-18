import { createClient } from '@supabase/supabase-js';

// Helper to validate URL
const isValidHttpUrl = (string: string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

// @ts-ignore
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// @ts-ignore
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = isValidHttpUrl(supabaseUrl) && !!supabaseAnonKey;

// Safe initialization to prevent blank page if credentials are missing
// We use a mock object that implements necessary methods to prevent crashes
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      storage: { 
        from: () => ({ 
          upload: async () => ({ error: new Error('Supabase not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        }) 
      },
      from: () => ({
        select: () => ({
          order: () => ({
            limit: () => ({
              data: [],
              error: null
            })
          })
        }),
        insert: () => ({ error: new Error('Supabase not configured') })
      })
    } as any;
