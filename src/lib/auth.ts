import { supabase } from './supabase';

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

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) throw error;
  return data;
};

export const registerWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  });
  if (error) throw error;
  return data.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error("Supabase Error:", error, operationType, path);
  throw new Error(error instanceof Error ? error.message : String(error));
}
