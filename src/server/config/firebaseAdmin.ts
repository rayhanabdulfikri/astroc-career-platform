import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseAdminApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (firebaseAdminApp) return firebaseAdminApp;

  const apps = getApps();
  if (apps.length > 0) {
    firebaseAdminApp = apps[0];
    return firebaseAdminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      firebaseAdminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('🔒 Firebase Admin SDK initialized with Service Account Credentials.');
      return firebaseAdminApp;
    } catch (err) {
      console.error('Error initializing Firebase Admin SDK with credentials:', err);
    }
  }

  try {
    firebaseAdminApp = initializeApp({
      projectId: projectId || 'astroc-career-platform',
    });
    console.log('🔒 Firebase Admin SDK initialized with default project configuration.');
    return firebaseAdminApp;
  } catch (err) {
    console.warn('⚠️ Firebase Admin SDK fallback initialization note:', err);
    return null;
  }
}

export { getAuth };
