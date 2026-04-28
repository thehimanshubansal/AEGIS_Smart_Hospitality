// src/components/EmergencyAlertListener.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToAlerts, EmergencyAlert } from "@/lib/emergency-service";
import { Megaphone, X, ShieldAlert, AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthSync } from "@/hooks/useAuthSync";

export function EmergencyAlertListener() {
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { dbUser } = useAuthSync();
  
  const isAdminPath = pathname?.startsWith("/admin");
  const isUserAdmin = dbUser?.role === "admin" || dbUser?.staffRole === "admin";
  const shouldHide = isAdminPath || isUserAdmin;

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const setupSubscription = async () => {
      try {
        // Attempt to subscribe
        unsubscribe = subscribeToAlerts((alerts) => {
          // Find the most recent active alert
          const current = alerts.find(a => a.active);
          if (current && (!activeAlert || current.id !== activeAlert.id)) {
            setActiveAlert(current);
            setIsVisible(true);
            playEmergencyChime();
          } else if (!current) {
            setIsVisible(false);
          }
        });
      } catch (error) {
        console.error("[EmergencyAlertListener] Failed to subscribe to alerts:", error);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeAlert]);

  const playEmergencyChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 2);
    } catch (e) {
      console.warn("Audio blocked");
    }
  };

  if (!activeAlert || shouldHide) return null;

  // Filter based on target role if specified
  if (activeAlert.target === "staff" && dbUser?.role !== "staff") return null;
  if (activeAlert.target === "guests" && dbUser?.role !== "guest") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-xl px-4"
        >
          <div className="bg-red-600 border-2 border-red-400 rounded-3xl p-6 shadow-[0_20px_50px_rgba(220,38,38,0.5)] flex items-start gap-6 relative overflow-hidden">
            {/* Animated Background Pulse */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0,transparent_70%)] animate-pulse" />
            
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
               <Megaphone className="text-white animate-bounce" size={28} />
            </div>

            <div className="flex-1 relative z-10">
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Priority Emergency Alert</span>
                  <div className="h-px flex-1 bg-white/20" />
               </div>
               <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight mb-2">
                 {activeAlert.type === 'evacuation' ? 'EVACUATE IMMEDIATELY' : 'EMERGENCY BROADCAST'}
               </h4>
               <p className="text-sm font-medium text-white/90 leading-relaxed bg-black/10 p-3 rounded-xl border border-white/5">
                 {activeAlert.message}
               </p>
               <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
                     <ShieldAlert size={12} className="text-white" />
                     <span className="text-[9px] font-bold text-white uppercase tracking-widest">Aegis Secure Line</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/60 uppercase ml-auto">Sender: {activeAlert.sender}</span>
               </div>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
