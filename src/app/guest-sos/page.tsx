"use client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useRadio } from "@/hooks/useRadio";
import { useSosTransport } from "@/hooks/useSosTransport";
import { getDb } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  buildTransportChannels,
  getTransportLabel,
} from "@/lib/sos-transport";

import { GuestSidebar } from "@/components/GuestSidebar";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useTranscription } from "@/hooks/useTranscription";
import { getRtdb } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { type SOSIncidentReport } from "@/lib/agents/sos-monitor-agent";
import { Brain, FileText, Shield, Terminal } from "lucide-react";

export default function GuestSOS() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [intelligenceReport, setIntelligenceReport] = useState<SOSIncidentReport | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    if (sosActive) return;
    pressTimer.current = setTimeout(() => {
        handleSOSTrigger();
    }, 3000);
  };

  const endPress = () => {
     if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
     }
  };

  // 1. Initialize Realtime Hooks
  const { dbUser } = useAuthSync();
  const userName = dbUser?.name || "Guest";
  const roomId = dbUser?.roomNumber || dbUser?.room || "Pending";
  const incidentBaseChannel = useMemo(() => `channel-guest-room-${roomId}`, [roomId]);
  const transportChannels = useMemo(
    () => buildTransportChannels(incidentBaseChannel),
    [incidentBaseChannel]
  );
  const {
    activeTransport,
    assessment,
    activeLabel,
  } = useSosTransport({ mode: "auto" });
  const audioChannel = transportChannels[activeTransport];
  // Note: activeIncidentId is already defined above in the state section

  const socket = useSocket('guest');
  const { isMicActive, toggleMic } = useRadio(socket, audioChannel);
  const { transcript, clearTranscript } = useTranscription(isMicActive);

  // Sync transcript to admin
  useEffect(() => {
    if (socket && transcript && activeIncidentId) {
      socket.emit('transcript-segment', {
        incidentId: activeIncidentId,
        text: transcript,
        senderRole: 'guest'
      });
      clearTranscript();
    }
  }, [socket, transcript, activeIncidentId, clearTranscript]);

  const isMicActiveRef = useRef(isMicActive);
  useEffect(() => {
     isMicActiveRef.current = isMicActive;
  }, [isMicActive]);

  interface AlertResolvedPayload {
    roomId: string;
    incidentId: string;
  }

  useEffect(() => {
    if (!socket) return;
    const handleResolved = async (payload: AlertResolvedPayload) => {
        if (payload.roomId === roomId) {
            setSosActive(false);
            // We keep activeIncidentId set so we can still view the report until they dismiss it
            if (isMicActiveRef.current) {
                await toggleMic();
            }
        }
    };
    socket.on('alert-resolved', handleResolved);
    return () => { socket.off('alert-resolved', handleResolved); };
  }, [socket, toggleMic, roomId]);

  // Listen for Intelligence Report
  useEffect(() => {
    if (!activeIncidentId) {
      setIntelligenceReport(null);
      return;
    }

    const db = getRtdb();
    const reportRef = ref(db, `incident-reports/${activeIncidentId}`);
    
    const unsubscribe = onValue(reportRef, (snapshot) => {
      if (snapshot.exists()) {
        setIntelligenceReport(snapshot.val());
      }
    });

    return () => off(reportRef, "value", unsubscribe);
  }, [activeIncidentId]);

  const handleCancel = async () => {
      setSosActive(false);
      const incidentId = activeIncidentId || "GUEST-CANCEL";
      setActiveIncidentId(null);
      if (isMicActive) {
          await toggleMic();
      }
      socket?.emit('resolve-alert', { roomId: roomId, incidentId });
  };

  const handleSOSTrigger = async () => {
    if (sosActive) return;
    const incidentId = `INC-${Math.floor(Math.random() * 10000)}`;
    setSosActive(true);
    setActiveIncidentId(incidentId);

    console.log(`[SOS] Triggering emergency: ${incidentId} for Room ${roomId}`);

    // 1. Save to Central Database (Data Connect) - DO THIS FIRST
    try {
      await fetch("/api/admin/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "SOS Emergency Distress",
          description: `GUEST SOS TRIGGERED - Room ${roomId}`,
          severity: "Critical",
          roomId,
          status: "Active",
        }),
      });
      console.log("[SOS] Successfully saved to database");
    } catch (err) {
      console.error("[SOS] Failed to save incident to database:", err);
    }

    // 2. Broadcast via Socket.io - DO THIS SECOND
    if (socket) {
      socket.emit('sos-alert', {
        incidentId,
        guestName: userName,
        roomId: roomId,
        audioChannel,
        activeTransport,
        transportMode: "auto",
        transportChannels,
        originRole: "guest",
      });
      console.log("[SOS] Emitted socket event: sos-alert");
    } else {
      console.warn("[SOS] Socket not connected, alert not emitted via socket");
    }

    // 3. Auto-open Mic - DO THIS LAST
    try {
      if (!isMicActive) {
        await toggleMic();
        console.log("[SOS] Microphone activated");
      }
    } catch (err) {
      console.error("[SOS] Failed to activate mic:", err);
    }
  };

  const handleSOSKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      await handleSOSTrigger();
    }
  };

  const handleCallFrontDesk = async () => {
    const incidentId = `CALL-${Math.floor(Math.random() * 10000)}`;
    console.log(`[CALL] Calling Front Desk: ${incidentId} from Room ${roomId}`);

    // 1. Save to Central Database (Data Connect)
    try {
      await fetch("/api/admin/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Front Desk Assistance Call",
          description: `Guest calling from Room ${roomId}`,
          severity: "Medium",
          roomId,
          status: "Active",
        }),
      });
      console.log("[CALL] Successfully saved to database");
    } catch (err) {
      console.error("[CALL] Failed to save call to database:", err);
    }

    // 2. Broadcast via Socket.io
    if (socket) {
      socket.emit('call-front-desk', {
        incidentId,
        guestName: userName,
        roomId: roomId,
        type: "Front Desk Call",
        audioChannel,
        activeTransport,
        transportMode: "auto",
        transportChannels,
        originRole: "guest",
      });
      console.log("[CALL] Emitted socket event: call-front-desk");
    }

    // 3. Open Mic
    try {
      if (!isMicActive) {
        await toggleMic();
        console.log("[CALL] Microphone activated");
      }
    } catch (err) {
      console.error("[CALL] Failed to activate mic for call:", err);
    }
  };

  useEffect(() => {
    if (!socket || !sosActive || !activeIncidentId) {
      return;
    }

    socket.emit("sos-alert", {
      incidentId: activeIncidentId,
      guestName: userName,
      roomId,
      audioChannel,
      activeTransport,
      transportMode: "auto",
      transportChannels,
      originRole: "guest",
    });
  }, [
    activeIncidentId,
    activeTransport,
    audioChannel,
    roomId,
    socket,
    sosActive,
    transportChannels,
    userName,
  ]);

  return (
    <div className="bg-[#f5f6fa] dark:bg-[#151824] text-[#081d2c] dark:text-[#e5e2e1] min-h-screen flex flex-col font-['Outfit'] transition-colors relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#bc000a]/10 dark:bg-[#e2241f]/10 rounded-full blur-[120px] animate-blob" />
      </div>

      <DashboardHeader
        title="Emergency SOS"
        subtitle="Aegis Smart Hotel"
        userName={userName}
        role={`Room ${roomId}`}
        onMenuClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative z-10 h-[calc(100vh-64px)] pt-16">
        <GuestSidebar 
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarMobileOpen={sidebarMobileOpen}
          setSidebarMobileOpen={setSidebarMobileOpen}
        />

        <main className="flex-1 overflow-auto p-4 md:p-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center space-y-8 font-['Space_Grotesk']">
          <div className="w-full bg-white/80 dark:bg-[#131313]/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-2xl border border-white/50 dark:border-white/5 relative flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700 min-h-[400px]">

            <div className="relative group flex items-center justify-center cursor-pointer mb-6 mt-4 hover:scale-105 active:scale-95 transition-transform duration-300">
              <div className="absolute inset-0 bg-[#bc000a] dark:bg-[#ff5449] rounded-full blur-[40px] opacity-60 animate-pulse hidden md:block"></div>

              {/* DYNAMIC SOS BUTTON */}
              <button
                onPointerDown={startPress}
                onPointerUp={endPress}
                onPointerLeave={endPress}
                onKeyDown={handleSOSKeyDown}
                className={`w-48 h-48 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center shadow-[inset_0_-15px_30px_rgba(0,0,0,0.4),_0_20px_40px_rgba(188,0,10,0.5)] border-[6px] relative z-10 transition-all duration-500
                    ${sosActive
                    ? "bg-red-900 border-red-500 animate-pulse ring-8 ring-red-500/50"
                    : "bg-gradient-to-t from-[#bc000a] to-[#ff5449] border-white/90 dark:border-[#1a1a1a]"
                  }
                  `}
                aria-label={sosActive ? "SOS Active - Emergency Transmitting" : "Activate SOS - Hold for 3 seconds"}
                role="button"
                tabIndex={0}
              >
                <span className="material-symbols-outlined text-6xl md:text-7xl text-white mb-2 drop-shadow-lg" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {isMicActive ? "mic" : "sos"}
                </span>
                <span className="font-black font-['Space_Grotesk'] tracking-[0.2em] text-lg text-white uppercase drop-shadow-md">
                  {sosActive ? "Transmitting" : "Distress Call"}
                </span>
              </button>
            </div>

            <p className={`text-xs font-bold tracking-[0.3em] uppercase font-['Space_Grotesk'] mb-8 px-4 py-2 rounded-xl transition-colors
                ${sosActive ? "text-red-500 bg-red-500/10 animate-pulse" : "text-[#bc000a] bg-[#bc000a]/10 dark:bg-[#ffb4aa]/10"}
             `}>
              {sosActive ? "Staff Notified. Microphone Active." : "Hold completely for 3 seconds"}
            </p>

            <div className="mb-6 w-full rounded-2xl border border-[#175ead]/20 bg-[#e2efff]/40 dark:bg-[#111827]/60 p-5 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#003d79] dark:text-[#72aafe]">
                    Auto Transport Routing
                  </p>
                  <p className="mt-2 text-sm font-black text-[#081d2c] dark:text-white">
                    Live path: {activeLabel}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#414753] dark:text-[#c1c6d5]">
                    {assessment.summary}
                  </p>
                </div>
                <span className="rounded-full border border-[#175ead]/20 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#175ead] dark:border-white/10 dark:bg-[#1a1a1a] dark:text-[#72aafe]">
                  {assessment.qualityLabel}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {(["internet", "ip", "ble"] as const).map((transport) => {
                  const active = activeTransport === transport;
                  return (
                    <div
                      key={transport}
                      className={`rounded-2xl border px-4 py-3 transition-colors ${
                        active
                          ? "border-[#175ead] bg-[#175ead]/10 dark:border-[#72aafe] dark:bg-[#72aafe]/10"
                          : "border-[#175ead]/15 bg-white/60 dark:border-white/10 dark:bg-[#151515]"
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#717785] dark:text-[#8e95a8]">
                        {getTransportLabel(transport)}
                      </p>
                      <p className="mt-2 text-xs font-bold text-[#081d2c] dark:text-white">
                        {active ? "Currently active" : "Standby fallback"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {sosActive && (
                <button onClick={handleCancel} className="mb-6 px-6 py-2 border border-red-500 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                   Cancel Emergency
                </button>
            )}

            </div>

            {/* SENTINEL INTELLIGENCE REPORT VIEW */}
            {intelligenceReport && (
              <div className="mt-8 w-full overflow-hidden rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500 text-left">
                <div className="flex items-center justify-between bg-purple-500/10 px-6 py-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <Brain className="text-purple-400" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-200">Sentinel-02 Tactical Intelligence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Report Verified</span>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-purple-400 mb-2">Executive Summary</h4>
                    <p className="text-xs text-purple-50/90 leading-relaxed font-medium">{intelligenceReport.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <h4 className="text-[8px] font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                        <Shield size={12} /> Threat Assessment
                      </h4>
                      <p className="text-[11px] text-white/80 leading-relaxed">{intelligenceReport.threatAssessment}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <h4 className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
                        <Terminal size={12} /> Operational Insights
                      </h4>
                      <ul className="space-y-2">
                        {intelligenceReport.operationalInsights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-2 text-[10px] text-white/70">
                            <span className="text-cyan-500 mt-1">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-2">Recommended Follow-up</h4>
                    <p className="text-xs text-emerald-50/80 font-medium">{intelligenceReport.recommendedFollowUp}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[8px] font-mono text-purple-500/60">{intelligenceReport.agentSignature}</span>
                    <button 
                      onClick={() => setActiveIncidentId(null)}
                      className="text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                      Dismiss Report
                    </button>
                  </div>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
