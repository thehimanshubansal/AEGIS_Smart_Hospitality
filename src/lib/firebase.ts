// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { getDatabase, Database, connectDatabaseEmulator } from "firebase/database";
import { connectorConfig } from "@/dataconnect-generated";

declare global {
  interface Window {
    __AEGIS_PUBLIC_ENV__?: Record<string, string | undefined>;
  }
}

// Environment check helper - works on both server and client
function isServer(): boolean {
  return typeof window === 'undefined';
}

function getPublicEnv(key: string): string | undefined {
  if (typeof window !== "undefined") {
    const env = (window as any).__AEGIS_PUBLIC_ENV__;
    return env ? env[key] : undefined;
  }
  return undefined;
}

// Singleton storage
let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;
let databaseInstance: Database | null = null;
let dcInstance: any = null;
let isInitialized = false;
let publicEnvLoadPromise: Promise<boolean> | null = null;

// Get Firebase config from environment
function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || getPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY");
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || getPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  
  // Use fallbacks for development if config is missing
  const effectiveApiKey = apiKey || (process.env.NODE_ENV === 'development' ? 'dev-aegis-key-12345' : undefined);
  const effectiveProjectId = projectId || (process.env.NODE_ENV === 'development' ? 'demo-hospitality-work' : undefined);
  const effectiveAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || getPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID") || (process.env.NODE_ENV === 'development' ? '1:1234567890:web:dev1234567890' : undefined);

  const isConfigured = !!(effectiveApiKey && effectiveProjectId && effectiveApiKey !== "undefined" && effectiveProjectId !== "undefined");

  if (!isServer() && !isConfigured) {
    console.warn('[Firebase] Config check in browser failed.', { 
      apiKeyPresent: !!effectiveApiKey, 
      projectIdPresent: !!effectiveProjectId,
      apiKeySource: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'env' : 'runtime',
      env: process.env.NODE_ENV
    });
  } else if (!isServer() && !apiKey && !projectId && isConfigured) {
    console.info('[Firebase] Using development fallbacks for configuration');
  }

  return {
    apiKey: effectiveApiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || getPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") || (effectiveProjectId ? `${effectiveProjectId}.firebaseapp.com` : undefined),
    projectId: effectiveProjectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || getPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") || (effectiveProjectId ? `${effectiveProjectId}.firebasestorage.app` : undefined),
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || getPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") || (process.env.NODE_ENV === 'development' ? '1234567890' : undefined),
    appId: effectiveAppId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || getPublicEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || getPublicEnv("NEXT_PUBLIC_FIREBASE_DATABASE_URL"),
    isConfigured,
  };
}

async function loadRuntimeFirebaseConfig(): Promise<boolean> {
  if (isServer()) return false;

  // If already configured, no need to fetch
  if (getFirebaseConfig().isConfigured) {
    return true;
  }

  // If already fetching, return the existing promise
  if (publicEnvLoadPromise) {
    return publicEnvLoadPromise;
  }

  console.log('[Firebase] Fetching runtime config from /api/public-env...');
  
  publicEnvLoadPromise = fetch("/api/public-env", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const payload = (await response.json()) as { config?: Record<string, string | undefined> };
      
      if (!payload.config) {
        console.error('[Firebase] Runtime config payload missing "config" field');
        return false;
      }

      console.log('[Firebase] Received runtime config keys:', Object.keys(payload.config));
      
      // Store in window for getPublicEnv to find
      (window as any).__AEGIS_PUBLIC_ENV__ = { 
        ...((window as any).__AEGIS_PUBLIC_ENV__ || {}), 
        ...payload.config 
      };

      const finalConfig = getFirebaseConfig();
      console.log('[Firebase] Runtime config applied. isConfigured:', finalConfig.isConfigured);
      
      return finalConfig.isConfigured;
    })
    .catch((error) => {
      console.error("[Firebase] Failed to load runtime Firebase config:", error);
      return false;
    })
    .finally(() => {
      publicEnvLoadPromise = null;
    });

  return publicEnvLoadPromise;
}

// Initialize Firebase
function initializeFirebase(): boolean {
  // If already initialized with Auth (on client), we're good
  if (!isServer() && authInstance) return true;
  // If already initialized (on server), we're good for Data Connect
  if (isServer() && appInstance) return true;

  const config = getFirebaseConfig();

  if (!config.isConfigured) {
    if (isServer()) {
       console.error('[Firebase] Server-side initialization aborted: Missing config');
    } else {
       console.error('[Firebase] Client-side initialization aborted: Missing config');
    }
    return false;
  }

  try {
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
      measurementId: config.measurementId,
      databaseURL: config.databaseURL,
    };

    if (!appInstance) {
      appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }
    
    // Initialize Data Connect
    if (!dcInstance) {
      console.log(`[Firebase] Initializing Data Connect for service ${connectorConfig.service} in ${connectorConfig.location}`);
      dcInstance = getDataConnect(appInstance, connectorConfig);
      
      const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';
      if (useEmulator) {
        try {
          // Use 127.0.0.1 for better compatibility on Node 18+ / Windows
          connectDataConnectEmulator(dcInstance, '127.0.0.1', 9399);
          console.log(`[Firebase] Connected to Data Connect emulator (127.0.0.1:9399)`);
        } catch (err) {
          console.warn('[Firebase] Data Connect emulator connection warning:', err);
        }
      }
    }

    if (!databaseInstance) {
      databaseInstance = getDatabase(appInstance);
      // Connect emulator if in development
      const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';
      if (useEmulator) {
        try {
          // Use 127.0.0.1 for RTDB emulator
          connectDatabaseEmulator(databaseInstance, '127.0.0.1', 9000);
          console.log(`[Firebase] Connected to RTDB emulator (127.0.0.1:9000)`);
        } catch (err) {
          // Ignore "already connected" errors
        }
      }
    }

    if (!isServer()) {
      if (!dbInstance) dbInstance = getFirestore(appInstance);
      if (!authInstance) authInstance = getAuth(appInstance);

      if (!googleProviderInstance) googleProviderInstance = new GoogleAuthProvider();

      isSupported().then(supported => {
        if (supported && appInstance && config.measurementId) {
          getAnalytics(appInstance);
        }
      });
    }

    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return false;
  }
}

// Safe getters
export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) initializeFirebase();
  if (!appInstance) throw new Error('Firebase app not initialized.');
  return appInstance;
}

export function getDb(): Firestore {
  if (!dbInstance) initializeFirebase();
  if (!dbInstance) throw new Error('Firestore not initialized.');
  return dbInstance;
}

export function getAuthInstance(): Auth {
  if (!authInstance) initializeFirebase();
  if (!authInstance) throw new Error('Auth not initialized.');
  return authInstance;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProviderInstance) initializeFirebase();
  if (!googleProviderInstance) throw new Error('GoogleAuthProvider not initialized.');
  return googleProviderInstance;
}

export function getRtdb(): Database {
  if (!databaseInstance) initializeFirebase();
  if (!databaseInstance) throw new Error('Realtime Database not initialized.');
  return databaseInstance;
}

export function getDataConnectInstance() {
  if (!dcInstance) initializeFirebase();
  if (!dcInstance) throw new Error('Data Connect not initialized.');
  return dcInstance;
}

// Check if Firebase is ready
export function isFirebaseReady(): boolean {
  return !!authInstance;
}

// Check if configured
export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig().isConfigured;
}

export async function ensureFirebaseConfigured(): Promise<boolean> {
  if (getFirebaseConfig().isConfigured) {
    initializeFirebase();
    return true;
  }

  const loaded = await loadRuntimeFirebaseConfig();
  if (loaded) {
    initializeFirebase();
  }

  return getFirebaseConfig().isConfigured;
}

// Initialize on load for server
if (isServer()) {
  initializeFirebase();
}
