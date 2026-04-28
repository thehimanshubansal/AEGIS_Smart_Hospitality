
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import path from "path";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

console.log("Testing Firebase Config:");
console.log(JSON.stringify({ ...firebaseConfig, apiKey: "REDACTED" }, null, 2));

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getDatabase(app);
  console.log("Firebase initialized successfully.");
  console.log("Database URL used:", (db as any).repo_.repoInfo_.host);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}
