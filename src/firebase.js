import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
let authInstance;
let dbInstance;

try {
  authInstance = getAuth(app);
} catch (error) {
  console.warn("Firebase Auth failed to initialize. Check your .env keys.", error);
  authInstance = null;
}

try {
  if (firebaseConfig.apiKey) {
    dbInstance = getFirestore(app);
  } else {
    console.warn("No API Key found. disabling DB.");
    dbInstance = null;
  }
} catch (error) {
  console.warn("Firebase Firestore failed to initialize.", error);
  dbInstance = null;
}

export const auth = authInstance;
export const db = dbInstance;
