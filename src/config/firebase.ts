import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoFallbackKey1234567890',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'astroc-career-platform.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'astroc-career-platform',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'astroc-career-platform.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};

export type { FirebaseUser };
