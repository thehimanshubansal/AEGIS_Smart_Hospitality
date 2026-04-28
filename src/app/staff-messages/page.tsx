"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MessageTimeline } from "@/components/messaging/MessageTimeline";
import { ThreadList } from "@/components/messaging/ThreadList";
import { StaffSidebar } from "@/components/StaffSidebar";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  MessageEventRecord,
  MessageThreadRecord,
  MessagingViewer,
  buildAllStaffThread,
  buildDepartmentThread,
  buildStaffDirectThread,
  canViewerReply,
  ensureThreads,
  sendThreadMessage,
  subscribeAllThreads,
  subscribeThreadMessages,
  threadVisibleToViewer,
} from "@/lib/messaging";
import { useAuthSync } from "@/hooks/useAuthSync";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Send, Shield, Info, Wifi, WifiOff } from "lucide-react";

export default function StaffMessages() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [threads, setThreads] = useState<MessageThreadRecord[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageEventRecord[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const { dbUser, loading } = useAuthSync("staff");

  const viewer = useMemo<MessagingViewer | null>(() => {
    if (!dbUser?.id) return null;

    const profileId = dbUser.profileId || dbUser.id;

    return {
      role: "staff",
      userId: profileId,
      aliasIds: [dbUser.id, dbUser.loginId ?? null, dbUser.firebaseUid, dbUser.employeeId ?? null].filter(
        (value): value is string => Boolean(value)
      ),
      name: dbUser.name || "Staff",
      department: dbUser.department || "Operations",
    };
  }, [dbUser]);

  const baseThreads = useMemo(() => {
    if (!viewer) return [];

    return [
      buildStaffDirectThread(viewer, {
        id: viewer.userId,
        name: viewer.name,
        department: viewer.department,
      }),
      buildAllStaffThread(viewer),
      buildDepartmentThread(viewer, viewer.department || "Operations"),
    ];
  }, [viewer]);

  useEffect(() => {
    if (!viewer || !isFirebaseConfigured()) return;

    let cancelled = false;

    void (async () => {
      try {
        await ensureThreads(baseThreads);
        if (!cancelled) {
          setActiveThreadId((current) => current ?? baseThreads[0]?.id ?? null);
        }
      } catch (threadError) {
        console.error("Failed to initialize staff messaging:", threadError);
        if (!cancelled) {
          setError("Messaging is unavailable right now.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baseThreads, viewer]);

  useEffect(() => {
    if (!viewer || !isFirebaseConfigured()) return;

    return subscribeAllThreads(
      (nextThreads) => {
        const visibleThreads = nextThreads.filter((thread) => threadVisibleToViewer(thread, viewer));
        const orderedThreads = baseThreads
          .map((thread) => visibleThreads.find((candidate) => candidate.id === thread.id) ?? thread)
          .filter(Boolean);

        setThreads(orderedThreads);
        setActiveThreadId((current) => current ?? orderedThreads[0]?.id ?? null);
      },
      (subscriptionError) => {
        console.error("Failed to subscribe to staff threads:", subscriptionError);
        setError("Messaging is unavailable right now.");
      }
    );
  }, [baseThreads, viewer]);

  useEffect(() => {
    if (!activeThreadId || !isFirebaseConfigured()) {
      setMessages([]);
      return;
    }

    return subscribeThreadMessages(activeThreadId, {
      onData: setMessages,
      onError: (subscriptionError) => {
        console.error("Failed to subscribe to staff messages:", subscriptionError);
        setError("Messages could not be loaded.");
      },
    });
  }, [activeThreadId]);

  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? null;
  const canReply = activeThread && viewer ? canViewerReply(activeThread, viewer) : false;
  const directThread = threads.find((thread) => thread.staffId === viewer?.userId) ?? null;

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!viewer || !activeThread || !canReply || !draftMessage.trim()) return;

    try {
      setSending(true);
      setError(null);
      await sendThreadMessage({
        thread: activeThread,
        sender: viewer,
        text: draftMessage.trim(),
      });
      setDraftMessage("");
    } catch (sendError) {
      console.error("Failed to send staff message:", sendError);
      setError("Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const handleRequestVoiceCall = async () => {
    if (!viewer || !directThread) return;

    try {
      setError(null);
      await sendThreadMessage({
        thread: directThread,
        sender: viewer,
        kind: "voice-request",
        text: `${viewer.name} requested a voice call from ${viewer.department || "Operations"}.`,
      });
      setActiveThreadId(directThread.id);
    } catch (sendError) {
      console.error("Failed to request staff voice call:", sendError);
      setError("Voice call request could not be sent.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#05070a] font-['Sora'] text-[#e5e2e1] overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <DashboardHeader
        title="Tactical Comms"
        userName={dbUser?.name || "Unit-01"}
        role={dbUser?.staffRole || "Operational Unit"}
        onMenuClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden pt-16">
        <StaffSidebar
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarMobileOpen={sidebarMobileOpen}
          setSidebarMobileOpen={setSidebarMobileOpen}
        />

        <main className="flex-1 flex overflow-hidden p-4 lg:p-8">
          <div className="flex w-full h-full rounded-2xl border border-cyan-900/30 bg-black/40 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Thread Sidebar */}
            <aside className="w-full max-w-[320px] hidden md:flex flex-col border-r border-cyan-900/20 bg-black/20">
              <div className="p-6 border-b border-cyan-900/20 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-800">Operational Channels</span>
                <Wifi size={14} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <ThreadList
                  threads={threads}
                  activeThreadId={activeThreadId}
                  onSelect={(thread) => setActiveThreadId(thread.id)}
                />
              </div>
            </aside>

            {/* Main Chat Section */}
            <section className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-transparent to-cyan-500/[0.02]">
              <div className="flex items-center justify-between px-8 py-6 border-b border-cyan-900/20 bg-black/40">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-cyan-500" />
                    <h2 className="text-base font-black tracking-tight text-white uppercase">
                      {activeThread?.title || "Select Channel"}
                    </h2>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-800">
                    {activeThread?.subtitle || "Aegis Secure Line"}
                  </p>
                </div>
                
                <button
                  onClick={() => void handleRequestVoiceCall()}
                  disabled={!directThread}
                  className="group flex items-center gap-3 px-5 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Phone size={14} className="group-hover:animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Voice Bridge</span>
                </button>
              </div>

              {!isFirebaseConfigured() && (
                <div className="m-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center gap-3 text-amber-200">
                  <WifiOff size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Network Disconnected: Firebase Missing</span>
                </div>
              )}

              {error && (
                <div className="m-4 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center gap-3 text-red-200">
                  <Info size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <MessageTimeline
                  viewer={
                    viewer || {
                      role: "staff",
                      userId: "staff-fallback",
                      name: "Staff",
                    }
                  }
                  messages={messages}
                  emptyLabel={
                    loading ? "Initializing neural link..." : "No operational logs found in this channel."
                  }
                />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-cyan-900/20 bg-black/40">
                <form onSubmit={handleSend} className="relative group">
                  <input
                    type="text"
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    disabled={!canReply || sending || !activeThread}
                    placeholder={canReply ? "Type mission update..." : "READ-ONLY CHANNEL"}
                    className="w-full bg-[#0a0c10] border border-cyan-900/30 rounded-2xl px-6 py-4 pr-16 text-sm text-white placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={!canReply || sending || !draftMessage.trim()}
                    className="absolute right-3 top-3 p-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-20 disabled:grayscale transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="mt-3 flex items-center justify-between px-2">
                  <div className="flex items-center gap-4 text-[8px] font-black text-cyan-900 uppercase tracking-widest">
                    <span>Latency: 14ms</span>
                    <span>Encrypted: AES-256</span>
                  </div>
                  <span className="text-[8px] font-black text-cyan-900 uppercase tracking-widest">Aegis Secure Comms v4.0</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
