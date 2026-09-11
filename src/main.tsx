import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
