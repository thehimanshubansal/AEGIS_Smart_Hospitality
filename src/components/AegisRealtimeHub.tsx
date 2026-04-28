"use client";

import { useEffect, useState } from "react";
import { getRtdb } from "@/lib/firebase";
import { ref, onValue, query, limitToLast, off } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export interface AegisAlert {
  id: string;
  type: "security" | "staff" | "system";
  title: string;
  message: string;
  timestamp: number;
  severity: "info" | "warning" | "critical";
}

export function AegisRealtimeHub() {
  const [alerts, setAlerts] = useState<AegisAlert[]>([]);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    const db = getRtdb();
    const alertsRef = query(ref(db, "alerts"), limitToLast(5));

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: AegisAlert[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        
        // Only show alerts from the last 1 minute to avoid spamming old alerts on load
        const now = Date.now();
        const recent = list.filter(a => (now - a.timestamp) < 60000)
                           .sort((a, b) => b.timestamp - a.timestamp);
        
        setAlerts(recent);
      }
    });

    return () => off(alertsRef);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (isAdminPage) return null;

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-80">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
              alert.severity === "critical"
                ? "bg-red-500/90 border-red-400 text-white"
                : alert.severity === "warning"
                ? "bg-amber-500/90 border-amber-400 text-white"
                : "bg-blue-500/90 border-blue-400 text-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  {alert.severity === "critical" ? "gpp_maybe" : "notifications_active"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  {alert.type} Alert
                </span>
              </div>
              <button 
                onClick={() => removeAlert(alert.id)}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <h4 className="mt-2 font-bold text-sm leading-tight">{alert.title}</h4>
            <p className="mt-1 text-xs opacity-90 line-clamp-2">{alert.message}</p>
            
            <div className="mt-3 flex justify-between items-center opacity-70 text-[9px] font-medium">
              <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
              <span>Aegis Shield v2.5</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
