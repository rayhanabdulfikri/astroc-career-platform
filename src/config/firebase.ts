import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth,
  User as FirebaseUser,
} from 'firebase/auth';

// Check if real Firebase credentials are configured
const metaEnv = (import.meta as any).env || {};
const FIREBASE_API_KEY = metaEnv.VITE_FIREBASE_API_KEY;
const hasRealFirebaseConfig = FIREBASE_API_KEY &&
  FIREBASE_API_KEY !== 'AIzaSyDemoFallbackKey1234567890' &&
  FIREBASE_API_KEY.startsWith('AIzaSy') &&
  FIREBASE_API_KEY.length > 20;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY || 'AIzaSyDemoFallbackKey1234567890',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || 'astroc-career-platform.firebaseapp.com',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'astroc-career-platform',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || 'astroc-career-platform.appspot.com',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '1:000000000000:web:000000000000',
};

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;

// Only initialize Firebase if we have real credentials
if (hasRealFirebaseConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(app);
  } catch (err: any) {
    console.warn('⚠️ Firebase initialization skipped:', err?.message);
    app = null;
    _auth = null;
  }
} else {
  console.info(
    'ℹ️ Firebase auth disabled: VITE_FIREBASE_API_KEY not configured. ' +
    'Set this in Vercel Environment Variables to enable Google/Email auth.'
  );
}

export const auth = _auth;
export const googleProvider = new GoogleAuthProvider();
export const isFirebaseEnabled = hasRealFirebaseConfig && _auth !== null;

// Safe wrappers — return null/noop if Firebase is not configured
export { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
export type { FirebaseUser };
