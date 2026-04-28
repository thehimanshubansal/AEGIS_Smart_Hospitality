"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GuestSidebar } from "@/components/GuestSidebar";
import { MessageTimeline } from "@/components/messaging/MessageTimeline";
import { ThreadList } from "@/components/messaging/ThreadList";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  MessageEventRecord,
  MessageThreadRecord,
  MessagingViewer,
  buildAllGuestsThread,
  buildGuestDirectThread,
  canViewerReply,
  ensureThreads,
  sendThreadMessage,
  subscribeAllThreads,
  subscribeThreadMessages,
  threadVisibleToViewer,
} from "@/lib/messaging";
import { useAuthSync } from "@/hooks/useAuthSync";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Send, Sparkles, Info, Wifi, WifiOff, MessageSquare, Shield } from "lucide-react";

export default function GuestMessages() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [threads, setThreads] = useState<MessageThreadRecord[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageEventRecord[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const { dbUser, loading } = useAuthSync("guest");

  const viewer = useMemo<MessagingViewer | null>(() => {
    if (!dbUser?.id) return null;

    const profileId = dbUser.profileId || dbUser.id;

    return {
      role: "guest",
      userId: profileId,
      aliasIds: [dbUser.id, dbUser.loginId ?? null, dbUser.firebaseUid].filter(
        (value): value is string => Boolean(value)
      ),
      name: dbUser.name || "Guest",
      roomNumber: dbUser.roomNumber || dbUser.room || null,
    };
  }, [dbUser]);

  const baseThreads = useMemo(() => {
    if (!viewer) return [];

    return [
      buildGuestDirectThread(viewer, {
        id: viewer.userId,
        name: viewer.name,
        roomNumber: viewer.roomNumber,
      }),
      buildAllGuestsThread(viewer),
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
        console.error("Failed to initialize guest messaging:", threadError);
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
        console.error("Failed to subscribe to guest threads:", subscriptionError);
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
        console.error("Failed to subscribe to guest messages:", subscriptionError);
        setError("Messages could not be loaded.");
      },
    });
  }, [activeThreadId]);

  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? null;
  const canReply = activeThread && viewer ? canViewerReply(activeThread, viewer) : false;
  const directThread = threads.find((thread) => thread.guestId === viewer?.userId) ?? null;

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
      console.error("Failed to send guest message:", sendError);
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
        text: `${viewer.name} requested a voice call${viewer.roomNumber ? ` for room ${viewer.roomNumber}` : ""}.`,
      });
      setActiveThreadId(directThread.id);
    } catch (sendError) {
      console.error("Failed to request voice call:", sendError);
      setError("Voice call request could not be sent.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafafa] font-['Sora'] text-[#09090b] dark:bg-[#05070a] dark:text-[#e5e2e1] overflow-hidden">
      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(150,150,150,0.1) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <DashboardHeader
        title="Concierge Chat"
        userName={dbUser?.name || "Guest"}
        role={`Room ${dbUser?.roomNumber || dbUser?.room || "Pending"}`}
        onMenuClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden pt-16">
        <GuestSidebar
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarMobileOpen={sidebarMobileOpen}
          setSidebarMobileOpen={setSidebarMobileOpen}
        />

        <main className="flex-1 flex overflow-hidden p-4 lg:p-8">
          <div className="flex w-full h-full rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-xl overflow-hidden shadow-2xl dark:border-white/5 dark:bg-black/40">
            
            {/* Thread Sidebar */}
            <aside className="w-full max-w-[300px] hidden md:flex flex-col border-r border-zinc-100 bg-zinc-50/50 dark:border-white/5 dark:bg-black/20">
              <div className="p-6 border-b border-zinc-100 dark:border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600">Your Conversations</span>
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
            <section className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 bg-white/50 dark:border-white/5 dark:bg-black/40">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
                      {activeThread?.title || "Welcome Guest"}
                    </h2>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                    {activeThread?.subtitle || "Elite Support Network"}
                  </p>
                </div>
                
                <button
                  onClick={() => void handleRequestVoiceCall()}
                  disabled={!directThread}
                  className="flex items-center gap-3 px-6 py-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100 transition-all dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 disabled:opacity-30"
                >
                  <Phone size={14} className="text-amber-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Voice Support</span>
                </button>
              </div>

              {!isFirebaseConfigured() && (
                <div className="m-4 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3 text-amber-600 dark:text-amber-300">
                  <WifiOff size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Concierge System Offline</span>
                </div>
              )}

              {error && (
                <div className="m-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center gap-3 text-red-600 dark:text-red-300">
                  <Info size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <MessageTimeline
                  viewer={
                    viewer || {
                      role: "guest",
                      userId: "guest-fallback",
                      name: "Guest",
                    }
                  }
                  messages={messages}
                  emptyLabel={
                    loading ? "Establishing secure link..." : "Your luxury experience starts here. Message us for any request."
                  }
                />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-zinc-100 bg-white/50 dark:border-white/5 dark:bg-black/40">
                <form onSubmit={handleSend} className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 group-focus-within:text-amber-500 transition-colors">
                    <MessageSquare size={18} />
                  </div>
                  <input
                    type="text"
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    disabled={!canReply || sending || !activeThread}
                    placeholder={canReply ? "How can we assist you today?" : "READ-ONLY CHANNEL"}
                    className="w-full bg-zinc-100 border border-transparent rounded-2xl px-14 py-5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-200 focus:ring-4 focus:ring-amber-500/5 transition-all dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600 dark:focus:bg-black dark:focus:border-white/10 disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={!canReply || sending || !draftMessage.trim()}
                    className="absolute right-3 top-3 p-3 rounded-2xl bg-zinc-900 text-white hover:bg-black disabled:opacity-20 transition-all dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-xl"
                  >
                    <Send size={20} />
                  </button>
                </form>
                <div className="mt-4 flex items-center justify-center gap-6 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] dark:text-zinc-600">
                  <span className="flex items-center gap-1.5"><Shield size={10} className="text-emerald-500" /> End-to-End Encrypted</span>
                  <span className="flex items-center gap-1.5"><Sparkles size={10} className="text-amber-500" /> Premium Priority Link</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
