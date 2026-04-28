import { getRtdb } from "./firebase";
import { ref, push, serverTimestamp } from "firebase/database";

export interface AlertPayload {
  type: "security" | "staff" | "system";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
}

/**
 * Pushes a realtime alert to the Aegis Hub.
 * Works on both client and server (using firebase-admin style if on server, or client SDK if initialized)
 * Note: For simplicity in this hybrid setup, we use the client SDK which works in Next.js Edge/Server if initialized correctly.
 */
export async function pushAegisAlert(payload: AlertPayload) {
  try {
    const db = getRtdb();
    const alertsRef = ref(db, "alerts");
    
    await push(alertsRef, {
      ...payload,
      timestamp: Date.now(), // serverTimestamp() can be used but Date.now() is easier for immediate client sorting
    });
    
    console.log(`[RealtimeAlert] Pushed: ${payload.title}`);
    return { success: true };
  } catch (error) {
    console.error("[RealtimeAlert] Failed to push alert:", error);
    return { success: false, error };
  }
}
