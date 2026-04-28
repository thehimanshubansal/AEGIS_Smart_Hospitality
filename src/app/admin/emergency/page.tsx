"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import { useRadio } from "@/hooks/useRadio";
import { useSosTransport } from "@/hooks/useSosTransport";
import {
  getTransportLabel,
  type SosTransport,
  type TransportChannels,
} from "@/lib/sos-transport";
import { clearAllAlerts } from "@/lib/emergency-service";
import { type SOSIncidentReport } from "@/lib/agents/sos-monitor-agent";
import { Terminal, Brain, FileText, CheckCircle2, ShieldAlert, RefreshCcw, X, Mic } from "lucide-react";
import { useTranscription } from "@/hooks/useTranscription";

interface Alert {
  incidentId: string;
  guestId?: string;
  guestName: string;
  roomId: string;
  audioChannel: string;
  timestamp?: string;
  type?: string;
  originRole?: "guest" | "staff";
  activeTransport?: SosTransport;
  transportMode?: "auto" | "manual";
  transportChannels?: TransportChannels;
}

export default function AdminEmergency() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [activeRadioChannel, setActiveRadioChannel] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [lastReceivedEvent, setLastReceivedEvent] = useState<{ type: string, payload: any } | null>(null);
  const [transportSelections, setTransportSelections] = useState<
    Record<string, SosTransport>
  >({});
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [viewingReport, setViewingReport] = useState<SOSIncidentReport | null>(null);
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});

  const socket = useSocket("admin");
  const { isMicActive, toggleMic } = useRadio(socket, activeRadioChannel || "");
  const { transcript: adminTranscript, clearTranscript: clearAdminTranscript } = useTranscription(isMicActive);

  // Sync admin's own transcript segments to local store
  useEffect(() => {
    if (adminTranscript && selectedAlertId) {
      setTranscripts(prev => ({
        ...prev,
        [selectedAlertId]: (prev[selectedAlertId] || "") + " [ADMIN]: " + adminTranscript
      }));
      clearAdminTranscript();
    }
  }, [adminTranscript, selectedAlertId, clearAdminTranscript]);

  const {
    activeTransport: adminTransport,
    manualTransport,
    setManualTransport,
    recommendedLabel,
    assessment,
  } = useSosTransport({ mode: "manual" });

  // 1. Initial Fetch on Mount
  useEffect(() => {
    let active = true;
    const fetchExistingIncidents = async () => {
      console.log("[Admin] Fetching incidents from database...");
      try {
        const res = await fetch("/api/admin/incidents", { cache: "no-store" });
        const data = await res.json();
        if (active && data.success && Array.isArray(data.incidents)) {
          const activeOnly = data.incidents
            .filter((inc: any) => (inc.status || "Active").toLowerCase() !== "resolved")
            .map((inc: any) => ({
              incidentId: inc.id,
              guestName: inc.title.includes("SOS") ? "Guest Distress" : (inc.title.includes("Staff") ? "Staff Distress" : "Front Desk Caller"),
              roomId: inc.roomId || "N/A",
              audioChannel: inc.title.includes("Staff") ? `channel-staff-${(inc.roomId || "unknown").toLowerCase()}` : `channel-guest-room-${inc.roomId || 'unknown'}`,
              timestamp: inc.timestamp,
              type: inc.title,
              originRole: inc.title.includes("Staff") ? "staff" : "guest",
              activeTransport: "internet",
              transportChannels: {
                internet: inc.title.includes("Staff") ? `channel-staff-${(inc.roomId || "unknown").toLowerCase()}` : `channel-guest-room-${inc.roomId || 'unknown'}`,
                ip: inc.title.includes("Staff") ? `channel-staff-${(inc.roomId || "unknown").toLowerCase()}-ip` : `channel-guest-room-${inc.roomId || 'unknown'}-ip`,
                ble: inc.title.includes("Staff") ? `channel-staff-${(inc.roomId || "unknown").toLowerCase()}-ble` : `channel-guest-room-${inc.roomId || 'unknown'}-ble`
              }
            }));
          
          console.log("[Admin] Initial active alerts loaded:", activeOnly);
          setActiveAlerts(activeOnly);
        }
      } catch (err) {
        console.error("Failed to fetch existing incidents:", err);
      }
    };

    void fetchExistingIncidents();

    const handleRefresh = () => {
      void fetchExistingIncidents();
    };
    window.addEventListener('refresh-incidents', handleRefresh);

    return () => {
      active = false;
      window.removeEventListener('refresh-incidents', handleRefresh);
    };
  }, []); // Only run ONCE on mount

  // 2. Socket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("sos-alert", (payload: Alert) => {
      console.log("[Admin] Received sos-alert event:", payload);
      setActiveAlerts((prev) => {
        const existingIndex = prev.findIndex(
          (alert) => alert.incidentId === payload.incidentId
        );

        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = { ...next[existingIndex], ...payload };
          return next;
        }

        return [payload, ...prev];
      });

      setTransportSelections((prev) => ({
        ...prev,
        [payload.incidentId]: payload.activeTransport || prev[payload.incidentId] || "internet",
      }));
    });

    socket.on("alert-resolved", (payload: { incidentId: string }) => {
      setActiveAlerts((prev) =>
        prev.filter((alert) => alert.incidentId !== payload.incidentId)
      );
      setTransportSelections((prev) => {
        const next = { ...prev };
        delete next[payload.incidentId];
        return next;
      });
      if (selectedAlertId === payload.incidentId) {
        setSelectedAlertId(null);
        setActiveRadioChannel(null);
      }
    });
    socket.on("call-front-desk", (payload: Alert) => {
      console.log("[Admin] Received call-front-desk event:", payload);
      setLastReceivedEvent({ type: "Call", payload });
      setActiveAlerts((prev) => {
         const exists = prev.find(a => a.incidentId === payload.incidentId);
         if (exists) return prev;
         return [payload, ...prev];
      });
    });
    socket.on('transcript-segment', (payload: { incidentId: string, text: string, senderRole: string }) => {
      setTranscripts(prev => ({
        ...prev,
        [payload.incidentId]: (prev[payload.incidentId] || "") + ` [${payload.senderRole.toUpperCase()}]: ${payload.text}`
      }));
    });

    return () => {
      socket.off("sos-alert");
      socket.off("alert-resolved");
      socket.off("call-front-desk");
      socket.off("transcript-segment");
    };
  }, [socket, selectedAlertId]); // Don't trigger on selectedAlertId changes unless needed for listener logic

  // Toast notification state

  useEffect(() => {
    if (lastReceivedEvent) {
      const timer = setTimeout(() => setLastReceivedEvent(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastReceivedEvent]);

  const getAlertOriginLabel = (alert: Alert) =>
    alert.originRole === "staff" ? alert.roomId : `Room ${alert.roomId}`;

  const getAlertIdentityLabel = (alert: Alert) =>
    alert.originRole === "staff" ? "Identified Staff" : "Identified Guest";

  const resolveAlertChannel = (alert: Alert) => {
    const selectedTransport =
      transportSelections[alert.incidentId] || alert.activeTransport || "internet";

    if (alert.transportChannels?.[selectedTransport]) {
      return alert.transportChannels[selectedTransport];
    }

    return alert.audioChannel;
  };

  const joinAlertRadio = async (alert: Alert) => {
    const selectedTransport =
      transportSelections[alert.incidentId] || alert.activeTransport || "internet";

    setSelectedAlertId(alert.incidentId);
    setManualTransport(selectedTransport);
    setActiveRadioChannel(resolveAlertChannel(alert));

    setTimeout(async () => {
      if (!isMicActive) {
        await toggleMic();
      }
    }, 200);
  };

  const handleTransportSelection = (alert: Alert, transport: SosTransport) => {
    setTransportSelections((prev) => ({
      ...prev,
      [alert.incidentId]: transport,
    }));
    setManualTransport(transport);

    if (selectedAlertId === alert.incidentId) {
      setActiveRadioChannel(alert.transportChannels?.[transport] || alert.audioChannel);
    }
  };

  const handleResolve = async (alert: Alert) => {
    const currentChannel = resolveAlertChannel(alert);

    if (activeRadioChannel === currentChannel && isMicActive) {
      await toggleMic();
      setActiveRadioChannel(null);
      setSelectedAlertId(null);
    }

    // 1. Update Database Status to 'Resolved'
    try {
      await fetch("/api/admin/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: alert.incidentId,
          status: "Resolved"
        }),
      });
      console.log(`[Admin] Incident ${alert.incidentId} marked as Resolved in DB.`);
    } catch (err) {
      console.error("Failed to update incident status in DB:", err);
    }

    // 2. Broadcast to all clients (including Guest) via Socket
    // 2. Notify clients via Socket.io
    socket?.emit("resolve-alert", alert);

    // 3. Automatically generate intelligence report from conversation
    await handleGenerateReport(alert);

    // 4. Update local UI state
    setActiveAlerts((prev) =>
      prev.filter((item) => item.incidentId !== alert.incidentId)
    );
    setTransportSelections((prev) => {
      const next = { ...prev };
      delete next[alert.incidentId];
      return next;
    });
  };

  const handleGenerateReport = async (alert: Alert) => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch("/api/admin/emergency/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId: alert.incidentId,
          callerName: alert.guestName,
          location: getAlertOriginLabel(alert),
          transport: getTransportLabel(alert.activeTransport || "internet"),
          metadata: { origin: alert.originRole, type: alert.type },
          transcript: transcripts[alert.incidentId] || ""
        })
      });
      const data = await res.json();
      if (data.success) {
        setViewingReport(data.report);
      }
    } catch (err) {
      console.error("Report generation failed:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="bg-[#fafafa] dark:bg-[#0a0a0a] text-[#09090b] dark:text-[#e5e2e1] min-h-screen flex flex-col font-['Sora'] relative">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(150,150,150,0.08) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {activeAlerts.length > 0 && (
        <div className="absolute inset-0 z-0 pointer-events-none animate-pulse border-4 border-red-500/50 blur-sm" />
      )}

      <DashboardHeader
        title="Emergency Control"
        userName="Administrator"
        role="Director of Operations"
        onMenuClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
      />

      <div className="relative z-10 flex h-[calc(100vh-64px)] flex-1 overflow-hidden pt-16">
        <AdminSidebar
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarMobileOpen={sidebarMobileOpen}
          setSidebarMobileOpen={setSidebarMobileOpen}
        />

        <main className="mx-auto w-full max-w-[1600px] flex-1 overflow-auto p-4 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeAlerts.length > 0 ? (
                  <span className="h-3 w-3 animate-ping rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]" />
                ) : (
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                )}
                <h1
                  className={`text-3xl font-light tracking-tight ${
                    activeAlerts.length > 0 ? "text-red-600 dark:text-red-400" : ""
                  }`}
                >
                  {activeAlerts.length > 0 ? "Active SOS Alerts" : "System Secure"}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to TERMINATE all active emergency broadcasts? This will clear the alert for ALL guests and staff.")) {
                      await clearAllAlerts();
                      const evt = new Event('refresh-incidents');
                      window.dispatchEvent(evt);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 dark:bg-red-500/5 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <ShieldAlert size={14} />
                  Stop Broadcast
                </button>
                <button 
                  onClick={() => {
                    const evt = new Event('refresh-incidents');
                    window.dispatchEvent(evt);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-[#e4e4e7] dark:border-white/5 rounded-xl text-xs font-bold hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-all"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Refresh Grid
                </button>
              </div>
            </div>
            <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
              Real-time emergency broadcast tracking with manual admin transport switching.
            </p>
          </div>

          <AnimatePresence>
            {lastReceivedEvent && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-white/20"
              >
                <span className="material-symbols-outlined animate-bounce">warning</span>
                <div>
                  <p className="font-black uppercase tracking-widest text-[10px] opacity-80">Incoming {lastReceivedEvent.type}</p>
                  <p className="font-bold">Room {lastReceivedEvent.payload.roomId} needs assistance</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex h-[500px] flex-col rounded-2xl border border-[#e4e4e7] bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0f0f0f] lg:col-span-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-medium">Property Grid Isolation</h3>
                {activeAlerts.length > 0 && (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-700 dark:bg-red-950 dark:text-red-400">
                    {activeAlerts.length} Active Signal
                  </span>
                )}
              </div>

              <div
                className={`relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-dashed bg-[#fafafa] dark:bg-[#050505] ${
                  activeAlerts.length > 0
                    ? "border-red-500/50"
                    : "border-[#e4e4e7] dark:border-[#27272a]"
                }`}
              >
                {activeAlerts.length === 0 && (
                  <div className="flex flex-col items-center text-xs opacity-50 text-[#71717a]">
                    <span className="material-symbols-outlined mb-2 text-4xl">radar</span>
                    Monitoring Grid Active
                  </div>
                )}

                {activeAlerts.map((alert, index) => {
                  const selectedTransport =
                    transportSelections[alert.incidentId] ||
                    alert.activeTransport ||
                    "internet";
                  const resolvedChannel = resolveAlertChannel(alert);
                  const isSelectedActive =
                    selectedAlertId === alert.incidentId &&
                    activeRadioChannel === resolvedChannel &&
                    isMicActive;
                  const isExpanded = selectedAlertId === alert.incidentId || activeAlerts.length === 1;

                  return (
                    <motion.div
                      key={alert.incidentId}
                      layout
                      className={`absolute flex flex-col items-center transition-all ${
                        isExpanded ? "z-50" : "z-10"
                      }`}
                      style={{ 
                        top: `${15 + (index % 4) * 20}%`, 
                        left: `${10 + (Math.floor(index / 4) % 3) * 30}%` 
                      }}
                    >
                      <div 
                        onClick={() => setSelectedAlertId(alert.incidentId)}
                        className="cursor-pointer group flex flex-col items-center"
                      >
                        <span className={`material-symbols-outlined text-3xl transition-transform ${
                          isExpanded ? "text-red-600 scale-110" : "text-red-500 group-hover:scale-110"
                        } animate-bounce`}>
                          location_on
                        </span>
                        <span className={`mt-1 rounded border px-2 py-0.5 text-[9px] font-bold uppercase transition-colors ${
                          isExpanded ? "bg-red-600 text-white border-red-600" : "bg-white text-red-600 border-red-500 dark:bg-black"
                        }`}>
                          {getAlertOriginLabel(alert)}
                        </span>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-2 flex flex-col items-center gap-2"
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); void joinAlertRadio(alert); }}
                              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase ${
                                isSelectedActive ? "bg-green-500 text-white" : "bg-black text-white dark:bg-white dark:text-black"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {isSelectedActive ? "mic" : "headset_mic"}
                              </span>
                              {isSelectedActive ? "Live Open" : "Connect"}
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); void handleResolve(alert); }}
                              className="rounded-full bg-red-100 px-4 py-1.5 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300"
                            >
                              Resolve
                            </button>

                            <div className="w-[180px] rounded-xl border border-[#175ead]/20 bg-white p-2 shadow-xl dark:bg-[#0f0f0f]">
                              <div className="grid grid-cols-3 gap-1">
                                {(["internet", "ip", "ble"] as const).map((transport) => (
                                  <button
                                    key={transport}
                                    onClick={(e) => { e.stopPropagation(); handleTransportSelection(alert, transport); }}
                                    className={`rounded py-1 text-[8px] font-bold uppercase ${
                                      selectedTransport === transport ? "bg-[#175ead] text-white" : "bg-gray-100 dark:bg-zinc-800"
                                    }`}
                                  >
                                    {transport === "ble" ? "Beacon" : getTransportLabel(transport)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <div
                className={`rounded-2xl p-8 transition-all ${
                  activeAlerts.length > 0
                    ? "border border-red-500/30 bg-white shadow-[0_0_30px_rgba(239,68,68,0.05)] dark:bg-[#0f0f0f]"
                    : "border border-[#e4e4e7] bg-white shadow-sm dark:border-white/5 dark:bg-[#0f0f0f]"
                }`}
              >
                <h3
                  className={`mb-6 text-sm font-medium ${
                    activeAlerts.length > 0 ? "text-red-600 dark:text-red-400" : ""
                  }`}
                >
                  Protocol Execution
                </h3>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#175ead]/20 bg-[#e2efff]/40 p-4 dark:border-white/10 dark:bg-[#121212]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#175ead] dark:text-[#72aafe]">
                      Admin Call Routing
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#081d2c] dark:text-white">
                      Manual route: {getTransportLabel(adminTransport)}
                    </p>
                    <p className="mt-1 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                      Recommendation: {recommendedLabel}. Admin transport never auto-switches.
                    </p>
                    <p className="mt-1 text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                      Network health: {assessment.qualityLabel}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {(["internet", "ip", "ble"] as const).map((transport) => (
                        <button
                          key={transport}
                          onClick={() => setManualTransport(transport)}
                          className={`rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${
                            manualTransport === transport
                              ? "border-[#175ead] bg-[#175ead] text-white dark:border-[#72aafe] dark:bg-[#72aafe] dark:text-[#081d2c]"
                              : "border-[#c1c6d5]/40 bg-white text-[#414753] dark:border-white/10 dark:bg-[#1a1a1a] dark:text-[#c1c6d5]"
                          }`}
                        >
                          {transport === "ble" ? "Beacon" : getTransportLabel(transport)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 py-4 font-semibold text-white shadow-sm transition-colors hover:bg-red-700">
                    <span className="material-symbols-outlined">campaign</span>
                    Broadcast Evacuation
                  </button>

                  <button 
                    onClick={async () => {
                      await clearAllAlerts();
                      // Show some feedback
                      alert("ALL ACTIVE BROADCASTS TERMINATED");
                    }}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/50 bg-red-500/10 py-4 font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-500/20"
                  >
                    <ShieldAlert size={20} />
                    Stop All Broadcasts
                  </button>

                  <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#f4f4f5] py-4 font-semibold text-[#09090b] shadow-sm transition-colors hover:bg-[#e4e4e7] dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#252525]">
                    <span className="material-symbols-outlined">lock</span>
                    Seal Sector 3
                  </button>
                  <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-transparent bg-[#f4f4f5] py-4 font-semibold text-[#09090b] shadow-sm transition-colors hover:border-blue-500 hover:bg-[#e4e4e7] dark:bg-[#27272a] dark:text-white dark:hover:bg-[#3f3f46]">
                    <span className="material-symbols-outlined text-blue-500">local_police</span>
                    Dispatch Authorities
                  </button>
                </div>
              </div>

              <div className="flex-1 rounded-2xl border border-[#e4e4e7] bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0f0f0f]">
                <h3 className="mb-4 text-sm font-medium">Latest Signal Details</h3>
                {activeAlerts.length > 0 ? (
                  <div className="space-y-4 border-t border-[#f4f4f5] pt-4 text-sm dark:border-[#27272a]">
                    <div className="flex justify-between border-b border-dashed border-[#e4e4e7] pb-2 dark:border-[#27272a]">
                      <span className="text-xs font-medium text-[#a1a1aa]">Origin</span>
                      <span className="text-xs font-semibold text-[#09090b] dark:text-white">
                        {getAlertOriginLabel(activeAlerts[0])}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#e4e4e7] pb-2 dark:border-[#27272a]">
                      <span className="text-xs font-medium text-[#a1a1aa]">
                        {getAlertIdentityLabel(activeAlerts[0])}
                      </span>
                      <span className="text-xs font-semibold text-[#09090b] dark:text-white">
                        {activeAlerts[0].guestName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#e4e4e7] pb-2 dark:border-[#27272a]">
                      <span className="text-xs font-medium text-[#a1a1aa]">Signal ID</span>
                      <span className="font-mono text-xs text-[#09090b] dark:text-white">
                        {activeAlerts[0].incidentId}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#e4e4e7] pb-2 dark:border-[#27272a]">
                      <span className="text-xs font-medium text-[#a1a1aa]">Caller Route</span>
                      <span className="text-xs font-semibold text-[#09090b] dark:text-white">
                        {getTransportLabel(activeAlerts[0].activeTransport || "internet")}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-xs font-medium text-[#a1a1aa]">Admin Route</span>
                      <span className="text-xs font-semibold text-[#09090b] dark:text-white">
                        {getTransportLabel(
                          transportSelections[activeAlerts[0].incidentId] || manualTransport
                        )}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleGenerateReport(activeAlerts[0])}
                      disabled={isGeneratingReport}
                      className="w-full mt-4 flex items-center justify-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 py-4 font-semibold text-cyan-600 shadow-sm transition-all hover:bg-cyan-500/10 disabled:opacity-50"
                    >
                      {isGeneratingReport ? (
                        <>
                          <RefreshCcw className="animate-spin" size={18} />
                          Analyzing Logs...
                        </>
                      ) : (
                        <>
                          <Brain size={18} />
                          Generate Sentinel Report
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="border-t border-[#f4f4f5] pt-4 text-xs text-[#a1a1aa] dark:border-[#27272a]">
                    Awaiting incoming transmissions...
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sentinel Report Modal */}
      <AnimatePresence>
        {viewingReport && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingReport(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-cyan-900/30 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.1)]"
            >
              <div className="bg-cyan-500/10 px-8 py-6 border-b border-cyan-900/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <FileText className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Tactical Incident Report</h2>
                    <p className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.2em]">Sentinel-02 // ${viewingReport.agentSignature}</p>
                  </div>
                </div>
                <button onClick={() => setViewingReport(null)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal size={14} className="text-cyan-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500/80">Executive Summary</h3>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                    {viewingReport.summary}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldAlert size={14} className="text-amber-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">Threat Assessment</h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                      {viewingReport.threatAssessment}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Recommended Actions</h3>
                    </div>
                    <p className="text-xs text-zinc-300 font-bold">
                      {viewingReport.recommendedFollowUp}
                    </p>
                  </section>
                </div>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={14} className="text-purple-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-500/80">Operational Insights</h3>
                  </div>
                  <div className="space-y-2">
                    {viewingReport.operationalInsights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5 text-[11px] text-zinc-400">
                        <span className="text-cyan-500 font-black">0{idx + 1}</span>
                        {insight}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="bg-zinc-900/50 px-8 py-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest">Aegis Intelligence Matrix v2.5</span>
                <button 
                  onClick={() => window.print()}
                  className="text-[9px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
                >
                  Export Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
