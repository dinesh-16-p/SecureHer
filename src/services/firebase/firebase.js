import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDRxHv6y7RfjFjDq468wkYT0i8Z24usO-0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "her-a955f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "her-a955f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "her-a955f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "778742880549",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:778742880549:web:f9b68fa938b6528d4ae2cc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WF5E4M7963"
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics safely
export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {
  // Analytics not supported in non-browser context
});

export default app;
