"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { StaffSidebar } from "@/components/StaffSidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useSocket } from "@/hooks/useSocket";
import { useRadio } from "@/hooks/useRadio";
import { useTranscription } from "@/hooks/useTranscription";
import { useSosTransport } from "@/hooks/useSosTransport";
import { getBeaconModeCopy } from "@/lib/beacon-mode";
import { getDb } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  buildTransportChannels,
  getTransportLabel,
} from "@/lib/sos-transport";
import { getRtdb } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { type SOSIncidentReport } from "@/lib/agents/sos-monitor-agent";
import { Brain, FileText, Shield, Terminal } from "lucide-react";

export default function StaffSOSPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [intelligenceReport, setIntelligenceReport] = useState<SOSIncidentReport | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const { dbUser } = useAuthSync("staff");

  const staffName = dbUser?.name || "Staff Member";
  const role = dbUser?.staffRole || dbUser?.role || "Staff";
  const employeeId = dbUser?.employeeId || "OPS-001";
  const sector = dbUser?.department || "Operations";
  const beaconCopy = getBeaconModeCopy();
  const incidentBaseChannel = useMemo(
    () => `channel-staff-${employeeId.toLowerCase()}`,
    [employeeId]
  );
  const transportChannels = useMemo(
    () => buildTransportChannels(incidentBaseChannel),
    [incidentBaseChannel]
  );
  const { activeTransport, activeLabel, assessment } = useSosTransport({
    mode: "auto",
  });
  const audioChannel = transportChannels[activeTransport];

  const socket = useSocket("staff");
  const { isMicActive, toggleMic } = useRadio(socket, audioChannel);
  const { transcript, clearTranscript } = useTranscription(isMicActive);
  const isMicActiveRef = useRef(isMicActive);

  useEffect(() => {
    isMicActiveRef.current = isMicActive;
  }, [isMicActive]);

  // Broadcast transcript segments for agent monitoring
  useEffect(() => {
    if (transcript && activeIncidentId && socket) {
      socket.emit("transcript-segment", {
        incidentId: activeIncidentId,
        text: transcript,
        senderRole: "staff"
      });
      clearTranscript();
    }
  }, [transcript, activeIncidentId, socket, clearTranscript]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleResolved = async (payload: { incidentId?: string }) => {
      if (payload.incidentId && payload.incidentId === activeIncidentId) {
        setSosActive(false);
        // We keep activeIncidentId set so we can still view the report until they dismiss it
        if (isMicActiveRef.current) {
          await toggleMic();
        }
      }
    };

    socket.on("alert-resolved", handleResolved);

    return () => {
      socket.off("alert-resolved", handleResolved);
    };
  }, [activeIncidentId, socket, toggleMic]);

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

  useEffect(() => {
    if (!socket || !sosActive || !activeIncidentId) {
      return;
    }

    socket.emit("sos-alert", {
      incidentId: activeIncidentId,
      guestId: employeeId,
      guestName: staffName,
      roomId: sector,
      audioChannel,
      activeTransport,
      transportMode: "auto",
      transportChannels,
      originRole: "staff",
      type: "Staff SOS",
    });
  }, [
    activeIncidentId,
    activeTransport,
    audioChannel,
    employeeId,
    sector,
    socket,
    sosActive,
    staffName,
    transportChannels,
  ]);

  const startPress = () => {
    if (sosActive) {
      return;
    }

    pressTimer.current = setTimeout(() => {
      void handleSOSTrigger();
    }, 3000);
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleSOSTrigger = async () => {
    if (sosActive) return;

    const incidentId = `STF-${Math.floor(Math.random() * 10000)}`;
    setSosActive(true);
    setActiveIncidentId(incidentId);

    console.log(`[Staff SOS] Triggering emergency: ${incidentId} for Sector ${sector}`);

    // 1. Save to Central Database (Data Connect)
    try {
      await fetch("/api/admin/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Staff Emergency SOS",
          description: `STAFF EMERGENCY TRIGGERED - Sector: ${sector}`,
          severity: "Critical",
          roomId: sector,
          status: "Active",
        }),
      });
      console.log("[Staff SOS] Successfully saved to database");
    } catch (err) {
      console.error("[Staff SOS] Failed to save Staff SOS incident to database:", err);
    }

    // 2. Broadcast via Socket.io
    if (socket) {
      socket.emit("sos-alert", {
        incidentId,
        guestId: employeeId,
        guestName: staffName,
        roomId: sector,
        audioChannel,
        activeTransport,
        transportMode: "auto",
        transportChannels,
        originRole: "staff",
        type: "Staff SOS",
      });
      console.log("[Staff SOS] Emitted socket event: sos-alert");
    }

    // 3. Open Mic
    try {
      await toggleMic();
      console.log("[Staff SOS] Microphone activated");
    } catch (err) {
      console.error("[Staff SOS] Failed to activate mic for staff SOS:", err);
    }
  };

  const handleCancel = async () => {
    setSosActive(false);
    setActiveIncidentId(null);

    if (isMicActive) {
      await toggleMic();
    }

    socket?.emit("resolve-alert", {
      incidentId: activeIncidentId || "STAFF-CANCEL",
      roomId: sector,
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] font-['Outfit'] text-[#081d2c] transition-colors dark:bg-[#0a0a0a] dark:text-[#e5e2e1]">
      <DashboardHeader
        title="Staff Emergency SOS"
        subtitle="Operational fallback routing"
        userName={staffName}
        role={role}
        onMenuClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
      />

      <div className="relative z-10 flex h-[calc(100vh-64px)] flex-1 overflow-hidden pt-16">
        <StaffSidebar
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarMobileOpen={sidebarMobileOpen}
          setSidebarMobileOpen={setSidebarMobileOpen}
        />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center overflow-auto p-4 md:p-8">
          <div className="rounded-[32px] border border-white/40 bg-white/80 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/5 dark:bg-[#131313]/80">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#175ead] dark:text-[#72aafe]">
                  Staff SOS Chain
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-[#081d2c] dark:text-white">
                  {beaconCopy.transportHeadline}
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-bold text-[#414753] dark:text-[#c1c6d5]">
                  Staff trigger auto-routing follows the same fallback order as guest SOS.
                  Admin can monitor it, but transport changes stay manual on the control side.
                </p>
              </div>
              <div className="rounded-2xl border border-[#175ead]/20 bg-[#e2efff]/70 px-4 py-3 dark:border-white/10 dark:bg-[#141414]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#717785] dark:text-[#8e95a8]">
                  Current Route
                </p>
                <p className="mt-2 text-sm font-black text-[#175ead] dark:text-[#72aafe]">
                  {activeLabel}
                </p>
                <p className="mt-1 text-xs font-bold text-[#414753] dark:text-[#c1c6d5]">
                  {assessment.summary}
                </p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {(["internet", "ip", "ble"] as const).map((transport) => {
                const active = activeTransport === transport;
                return (
                  <div
                    key={transport}
                    className={`rounded-2xl border px-5 py-4 ${
                      active
                        ? "border-[#175ead] bg-[#175ead]/10 dark:border-[#72aafe] dark:bg-[#72aafe]/10"
                        : "border-[#c1c6d5]/40 bg-[#f7f9ff]/70 dark:border-white/10 dark:bg-[#111111]"
                    }`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#717785] dark:text-[#8e95a8]">
                      {getTransportLabel(transport)}
                    </p>
                    <p className="mt-2 text-sm font-black text-[#081d2c] dark:text-white">
                      {active ? "Active transport" : "Fallback standby"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center rounded-[28px] border border-[#bc000a]/20 bg-[#ffdad6]/30 p-8 text-center dark:border-[#ff5449]/20 dark:bg-[#280a0a]/40">
              <button
                onPointerDown={startPress}
                onPointerUp={endPress}
                onPointerLeave={endPress}
                className={`flex h-48 w-48 items-center justify-center rounded-full border-[6px] text-white shadow-[inset_0_-15px_30px_rgba(0,0,0,0.4),_0_20px_40px_rgba(188,0,10,0.5)] transition-all duration-500 md:h-60 md:w-60 ${
                  sosActive
                    ? "animate-pulse border-red-500 bg-red-900 ring-8 ring-red-500/40"
                    : "border-white/90 bg-gradient-to-t from-[#bc000a] to-[#ff5449]"
                }`}
                aria-label="Trigger staff SOS"
              >
                <div>
                  <span
                    className="material-symbols-outlined mb-3 block text-6xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    {isMicActive ? "mic" : "sos"}
                  </span>
                  <span className="text-lg font-black uppercase tracking-[0.2em]">
                    {sosActive ? "Live" : "Staff SOS"}
                  </span>
                </div>
              </button>

              <p className="mt-6 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#bc000a]">
                {sosActive
                  ? "Admin notified. Mic stays on current route."
                  : "Hold for 3 seconds to trigger staff emergency"}
              </p>

              {sosActive && (
                <button
                  onClick={() => void handleCancel()}
                  className="mt-4 rounded-full border border-red-500 px-6 py-2 text-xs font-bold uppercase tracking-widest text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                >
                  Cancel Emergency
                </button>
              )}
            </div>

            {/* SENTINEL INTELLIGENCE REPORT VIEW */}
            {intelligenceReport && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500">
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
          </div>
        </main>
      </div>
    </div>
  );
}
