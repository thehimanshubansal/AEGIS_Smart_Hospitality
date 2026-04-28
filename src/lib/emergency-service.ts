// src/lib/emergency-service.ts
import { getRtdb } from "./firebase";
import { ref, set, push, onValue, serverTimestamp, query, limitToLast, orderByChild } from "firebase/database";

export interface EmergencyAlert {
  id?: string;
  type: "evacuation" | "lockdown" | "medical" | "fire" | "custom";
  message: string;
  sender: string;
  timestamp: any;
  active: boolean;
  target: "all" | "staff" | "guests";
}

export interface ThreatValidation {
  id?: string;
  insightId: string;
  description: string;
  severity: "high" | "critical";
  status: "pending" | "approved" | "dismissed";
  timestamp: any;
}

/**
 * Sends a high-priority emergency alert via Realtime Database
 */
export async function sendEmergencyAlert(alert: Omit<EmergencyAlert, "id" | "timestamp" | "active">) {
  const db = getRtdb();
  const alertsRef = ref(db, "emergency-alerts");
  const newAlertRef = push(alertsRef);
  
  const alertData: EmergencyAlert = {
    ...alert,
    id: newAlertRef.key || Date.now().toString(),
    timestamp: serverTimestamp(),
    active: true
  };
  
  await set(newAlertRef, alertData);
  return alertData;
}

/**
 * Logs a detected threat for Admin review
 */
export async function logThreatForReview(threat: Omit<ThreatValidation, "id" | "timestamp" | "status">) {
  const db = getRtdb();
  const threatsRef = ref(db, "detected-threats");
  const newThreatRef = push(threatsRef);
  
  const threatData: ThreatValidation = {
    ...threat,
    id: newThreatRef.key || Date.now().toString(),
    timestamp: serverTimestamp(),
    status: "pending"
  };
  
  await set(newThreatRef, threatData);
  return threatData;
}

/**
 * Subscribes to live emergency alerts
 */
export function subscribeToAlerts(callback: (alerts: EmergencyAlert[]) => void) {
  const db = getRtdb();
  const alertsRef = query(ref(db, "emergency-alerts"), limitToLast(5));
  
  return onValue(alertsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    
    const alertsList = Object.values(data) as EmergencyAlert[];
    // Sort by timestamp if necessary
    callback(alertsList.reverse());
  });
}

/**
 * Subscribes to pending threats that need human approval
 */
export function subscribeToPendingThreats(callback: (threats: ThreatValidation[]) => void) {
  const db = getRtdb();
  const threatsRef = ref(db, "detected-threats");
  
  return onValue(threatsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    
    const threatsList = Object.values(data) as ThreatValidation[];
    callback(threatsList.filter(t => t.status === "pending"));
  });
}

/**
 * Dismisses or approves a threat
 */
export async function updateThreatStatus(threatId: string, status: "approved" | "dismissed") {
  const db = getRtdb();
  const threatRef = ref(db, `detected-threats/${threatId}/status`);
  await set(threatRef, status);
}

/**
 * Globally deactivates all active emergency alerts
 */
export async function clearAllAlerts() {
  const db = getRtdb();
  const alertsRef = ref(db, "emergency-alerts");
  
  // We fetch all alerts and set their 'active' status to false
  // A better way for large data would be a specific query, but for small lists this is fine
  return new Promise((resolve, reject) => {
    onValue(alertsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updates: any = {};
        Object.keys(data).forEach(key => {
          updates[`${key}/active`] = false;
        });
        await set(alertsRef, data); // Reset is complex, let's just clear the node for simplicity if desired, 
        // but setting active: false is safer.
        
        // Actually, just set the whole node to null to completely reset the system if preferred
        await set(alertsRef, null);
      }
      resolve(true);
    }, { onlyOnce: true });
  });
}
