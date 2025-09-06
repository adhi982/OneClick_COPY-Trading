// Firebase Configuration for OneClick Copy Trading Platform
// This file sets up Firebase Auth and other Firebase services

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize Firebase app (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Cloud Messaging (only in browser environment)
export const messaging = typeof window !== 'undefined' && isSupported() 
  ? getMessaging(app) 
  : null;

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    // Auth emulator
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    
    // Firestore emulator
    if (!db.app.automaticDataCollectionEnabled) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    // Storage emulator
    if (!storage.app.automaticDataCollectionEnabled) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } catch (error) {
    console.log('Firebase emulators connection error:', error);
  }
}

// Auth helper functions
export const authHelpers = {
  // Get current user's ID token
  getCurrentUserToken: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  },

  // Get current user's claims
  getCurrentUserClaims: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      const tokenResult = await user.getIdTokenResult();
      return tokenResult.claims;
    } catch (error) {
      console.error('Error getting user claims:', error);
      return null;
    }
  },

  // Refresh user token
  refreshUserToken: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken(true); // Force refresh
    } catch (error) {
      console.error('Error refreshing user token:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!auth.currentUser;
  },

  // Get user's UID
  getCurrentUserId: () => {
    return auth.currentUser?.uid || null;
  },

  // Get user's email
  getCurrentUserEmail: () => {
    return auth.currentUser?.email || null;
  },

  // Check if user's email is verified
  isEmailVerified: () => {
    return auth.currentUser?.emailVerified || false;
  }
};

// Firebase Cloud Messaging helpers
export const messagingHelpers = {
  // Request notification permission
  requestNotificationPermission: async () => {
    if (!messaging) return null;
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  // Get FCM token
  getFCMToken: async () => {
    if (!messaging) return null;
    
    try {
      const { getToken } = await import('firebase/messaging');
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },

  // Listen for foreground messages
  onForegroundMessage: (callback: (payload: any) => void) => {
    if (!messaging) return () => {};
    
    const { onMessage } = require('firebase/messaging');
    return onMessage(messaging, callback);
  }
};

// Custom hooks for Firebase Auth
export const useFirebaseAuth = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

// Error handling helper
export const handleFirebaseError = (error: any) => {
  const errorCode = error.code;
  const errorMessage = error.message;

  // Common Firebase Auth error messages
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please log in again to complete this action.',
    'auth/expired-action-code': 'The action code has expired.',
    'auth/invalid-action-code': 'The action code is invalid.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-token-expired': 'Your session has expired. Please log in again.',
    'auth/invalid-credential': 'Invalid credentials provided.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.'
  };

  return {
    code: errorCode,
    message: errorMessages[errorCode] || errorMessage || 'An unexpected error occurred.',
    originalError: error
  };
};

// Firebase configuration validation
export const validateFirebaseConfig = () => {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.error('Missing Firebase environment variables:', missingVars);
    return false;
  }
  
  return true;
};

export default app;
