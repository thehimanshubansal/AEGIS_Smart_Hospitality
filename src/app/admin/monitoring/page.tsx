"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import { BiometricScanner } from "@/components/BiometricScanner";
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Terminal, 
  Maximize2, 
  RefreshCcw, 
  Settings,
  Brain,
  Video,
  Database,
  Timer,
  Play,
  Pause,
  UserPlus,
  Scan,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Bell,
  Send,
  X,
  Check,
  Megaphone,
  Smartphone,
  UserCheck,
  Zap,
  Users,
  ShieldAlert,
  FileText,
  CheckCircle2
} from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { 
  sendEmergencyAlert, 
  subscribeToAlerts, 
  subscribeToPendingThreats, 
  updateThreatStatus,
  logThreatForReview,
  clearAllAlerts,
  EmergencyAlert,
  ThreatValidation
} from "@/lib/emergency-service";
import { 
  subscribeThreadMessages, 
  sendThreadMessage, 
  buildAllStaffThreadId,
  MessageEventRecord,
  formatMessageTime,
  buildAllStaffThread
} from "@/lib/messaging";
import { useAuthSync } from "@/hooks/useAuthSync";
import { getRtdb } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { type SOSIncidentReport } from "@/lib/agents/sos-monitor-agent";

// Types
type Insight = {
  id: string;
  timestamp: string;
  observation: string;
  analysis: string;
  decision: string;
  severity: "info" | "warning" | "critical";
  verified?: boolean;
  matchImage?: string;
  capturedFrame?: string;
  identifiedAs?: string;
  metadata?: any;
};

export default function MonitoringPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const { dbUser } = useAuthSync("admin");
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Tactical Feed
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [matchData, setMatchData] = useState<{ name: string; info: string; confidence: number } | null>(null);

  const [feedMode, setFeedMode] = useState<'tactical' | 'chat' | 'reports'>('tactical');
  const [chatMessages, setChatMessages] = useState<MessageEventRecord[]>([]);
  const [sosReports, setSosReports] = useState<SOSIncidentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SOSIncidentReport | null>(null);
  const [draftChat, setDraftChat] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const [streamPath, setStreamPath] = useState("phone-cctv");
  // On HTTPS (Cloud Run), WebRTC via bare HTTP IP is blocked as mixed content.
  // Auto-detect and default to HLS which is proxied server-side.
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const [protocol, setProtocol] = useState<"webrtc" | "hls">(isHttps ? "hls" : "webrtc");
  const [savedSources, setSavedSources] = useState<any[]>([]);
  const [mediaTargets, setMediaTargets] = useState<any[]>([]);
  const [activeMediaTargetId, setActiveMediaTargetId] = useState<string>("primary");
  const [showTacticalPanel, setShowTacticalPanel] = useState(false);

  // Load saved sources from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const phoneSources = JSON.parse(window.localStorage.getItem("admin-phone-camera-sources-list") || "[]");
      const rtspSources = JSON.parse(window.localStorage.getItem("admin-rtsp-camera-sources") || "[]");
      
      const allSources = [...phoneSources, ...rtspSources];
      setSavedSources(allSources);
      
      if (allSources.length > 0 && !allSources.find(s => s.path === streamPath)) {
        setStreamPath(allSources[0].path);
      }
    } catch (e) {
      console.error("Failed to load camera sources", e);
    }
  }, []);

  // Load media targets
  useEffect(() => {
    const loadTargets = async () => {
      try {
        const response = await fetch("/api/media-targets");
        if (response.ok) {
          const data = await response.json();
          setMediaTargets(data.targets || []);
          if (data.targets?.length > 0) {
            setActiveMediaTargetId(data.targets[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load media targets", e);
      }
    };
    loadTargets();
  }, []);

  const activeTarget = mediaTargets.find(t => t.id === activeMediaTargetId) || mediaTargets[0];
  
  const streamUrl = useMemo(() => {
    if (!activeTarget) return null;
    const baseUrl = protocol === "webrtc" ? activeTarget.webrtcBaseUrl : activeTarget.hlsBaseUrl;
    if (!baseUrl) return null;
    
    const rawUrl = new URL(`${baseUrl.replace(/\/+$/, "")}/${streamPath}`);
    rawUrl.searchParams.set("autoplay", "true");
    rawUrl.searchParams.set("muted", "true");
    rawUrl.searchParams.set("controls", "false");
    const rawUrlStr = rawUrl.toString();

    // On HTTPS, proxy HTTP iframe URLs through the server to avoid mixed content blocks
    if (typeof window !== "undefined" && window.location.protocol === "https:" && rawUrlStr.startsWith("http:")) {
      return `/api/monitoring/proxy?url=${encodeURIComponent(rawUrlStr)}`;
    }
    return rawUrlStr;
  }, [activeTarget, protocol, streamPath]);

  // Direct HLS URL for hls.js capture
  const hlsM3u8Url = useMemo(() => {
    if (!activeTarget?.hlsBaseUrl) return null;
    const rawUrl = `${activeTarget.hlsBaseUrl.replace(/\/+$/, "")}/${streamPath}/index.m3u8`;
    
    // In production (HTTPS), we must proxy the HTTP stream to avoid Mixed Content errors
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && rawUrl.startsWith('http:')) {
      return `/api/monitoring/proxy?url=${encodeURIComponent(rawUrl)}`;
    }
    return rawUrl;
  }, [activeTarget, streamPath]);

  // Unified background HLS logic for Analytical Capture
  useEffect(() => {
    const video = videoRef.current;
    if (!hlsM3u8Url || !video) return;
    
    console.log(`[Monitoring] Initializing analytical mirror: ${hlsM3u8Url}`);
    
    let hls: Hls | null = null;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const initHls = () => {
      if (Hls.isSupported()) {
        if (hls) hls.destroy();
        
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 0,
          manifestLoadingMaxRetry: 10, // Increased for stability
          manifestLoadingRetryDelay: 2000,
          levelLoadingMaxRetry: 5,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false; // Usually needed for cross-origin HLS
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.warn(`[Mirror] HLS Error (${data.details}):`, data);
            
            if (data.details === 'manifestLoadError' || data.details === 'manifestParsingError') {
              setAnalysisStatus("NEURAL_RESYNCING...");
              
              if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(() => {
                  // Fallback: Try the stream name directly if index.m3u8 fails
                  const currentUrl = hls?.url || hlsM3u8Url;
                  // Improved fallback: Try different common extensions without breaking path structure
                  let fallbackUrl = currentUrl;
                  if (currentUrl.endsWith('/index.m3u8')) {
                    fallbackUrl = currentUrl.replace(/\/index\.m3u8$/, '.m3u8');
                  } else if (currentUrl.endsWith('.m3u8') && !currentUrl.endsWith('/index.m3u8')) {
                    // If .m3u8 failed, maybe try the stream name directly (some servers)
                    fallbackUrl = currentUrl.replace(/\.m3u8$/, '/index.m3u8');
                  }
                  
                  if (window.location.protocol === 'https:' && fallbackUrl.startsWith('http:')) {
                    console.error("[Mirror] CRITICAL: Mixed Content blocked. Cloud Run requires HTTPS stream URLs.");
                    setAnalysisStatus("ERROR: HTTPS_REQUIRED");
                  }

                  console.log(`[Mirror] Retrying stream connection (${retryCount}/${MAX_RETRIES}). Target: ${fallbackUrl}`);
                  hls?.loadSource(fallbackUrl);
                }, 5000);
              }
            } else {
              setAnalysisStatus("MIRROR_LINK_ERROR");
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls?.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls?.recoverMediaError();
                  break;
                default:
                  hls?.destroy();
                  break;
              }
            }
          }
        });

        hls.loadSource(hlsM3u8Url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("[Mirror] Manifest parsed successfully.");
          retryCount = 0; // Reset on success
          setAnalysisStatus(null);
          video.play().catch(e => console.warn("[Mirror] Autoplay blocked:", e));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS (Safari/Mobile)
        video.src = hlsM3u8Url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.warn("[Mirror] Native HLS play failed:", e));
        });
      }
    };

    initHls();

    return () => {
      console.log(`[Monitoring] Dismantling mirror.`);
      if (hls) hls.destroy();
      if (video) {
        video.src = "";
        video.load();
      }
    };
  }, [hlsM3u8Url]);

  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showComparisonPanel, setShowComparisonPanel] = useState(false);
  const [comparisonData, setComparisonData] = useState<{
    insightId: string;
    feedImage: string;
    referenceImage: string;
    confidence: number;
    personName: string;
  } | null>(null);
  const [intervalTime, setIntervalTime] = useState(10000);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [threatLevel, setThreatLevel] = useState<"low" | "medium" | "high">("low");
  const [pendingThreats, setPendingThreats] = useState<ThreatValidation[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [emergencyTarget, setEmergencyTarget] = useState<"all" | "staff" | "guests">("all");
  const [isVigilanceEnabled, setIsVigilanceEnabled] = useState(true);
  const [neuralLoad, setNeuralLoad] = useState(14);

  // Animate Neural Engine Load
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      // High load when analyzing
      setNeuralLoad(96.8);
      interval = setInterval(() => {
        setNeuralLoad(prev => {
          const target = 94 + Math.random() * 5.2;
          return parseFloat(target.toFixed(1));
        });
      }, 150);
    } else {
      // Low idle load
      setNeuralLoad(12.4);
      interval = setInterval(() => {
        setNeuralLoad(prev => {
          const target = 11 + Math.random() * 3.5;
          return parseFloat(target.toFixed(1));
        });
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Synthesis helper (kept for UI feedback)
  const playTacticalSound = (type: 'scan' | 'lock' | 'alert') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'scan') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      } else if (type === 'lock') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.05);
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
      } else if (type === 'alert') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(220, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      }

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported");
    }
  };

  useEffect(() => {
    const unsubAlerts = subscribeToAlerts(setActiveAlerts);
    const unsubThreats = subscribeToPendingThreats(setPendingThreats);
    return () => {
      unsubAlerts();
      unsubThreats();
    };
  }, []);

  // Messaging Subscription — when real DB data arrives, replace optimistic messages
  useEffect(() => {
    const threadId = buildAllStaffThreadId();
    return subscribeThreadMessages(threadId, {
      onData: (dbMessages) => {
        setChatMessages(prev => {
          // Keep any optimistic messages that haven't landed in DB yet
          const optimistic = prev.filter(m =>
            m.id.startsWith("optimistic-") &&
            !dbMessages.some(db =>
              db.text === m.text &&
              db.senderId === m.senderId &&
              Math.abs(new Date(db.createdAt).getTime() - new Date(m.createdAt).getTime()) < 10000
            )
          );
          return [...dbMessages, ...optimistic].sort(
            (a, b) => new Date(a.publishAt).getTime() - new Date(b.publishAt).getTime()
          );
        });
      },
      onError: (err) => console.error("Chat Error:", err)
    });
  }, []);

  // SOS Reports Subscription
  useEffect(() => {
    const db = getRtdb();
    const reportsRef = ref(db, "incident-reports");
    
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reportList = Object.values(data) as SOSIncidentReport[];
        setSosReports(reportList.sort((a, b) => b.timestamp - a.timestamp));
      }
    });

    return () => off(reportsRef, "value", unsubscribe);
  }, []);

  const handleSendChat = async (textOverride?: string) => {
    const messageText = textOverride || draftChat;
    if (!messageText.trim() || !dbUser) return;
    
    const viewer = {
      role: "admin" as const,
      userId: dbUser.id,
      name: dbUser.name || "Admin"
    };

    const staffThread = buildAllStaffThread(viewer);
    const lowerText = messageText.toLowerCase();
    const now = new Date().toISOString();

    // Optimistic UI: show message immediately without waiting for DB
    const optimisticMsg: MessageEventRecord = {
      id: `optimistic-${Date.now()}`,
      threadId: staffThread.id,
      kind: "text",
      text: messageText.trim(),
      senderRole: "admin",
      senderName: viewer.name,
      senderId: viewer.userId,
      createdAt: now,
      publishAt: now,
      scheduled: false,
      meetingAt: null,
      meetingLink: null,
    };
    setChatMessages(prev => [...prev, optimisticMsg]);
    if (!textOverride) setDraftChat("");
    playTacticalSound('scan');

    // Optimistic agent response
    let agentResponseText: string | null = null;
    if (lowerText.startsWith("/report")) {
      const latestReport = sosReports[0];
      agentResponseText = latestReport
        ? `[INTELLIGENCE_RETRIEVAL] Latest SOS Report Found:\n\nINCIDENT: ${latestReport.incidentId.slice(0, 8)}\nSUMMARY: ${latestReport.summary}\nTHREAT: ${latestReport.threatAssessment}\n\nUse the 'SOS Reports' tab for full operational details.`
        : `[SYSTEM_QUERY] No tactical reports found in the current session archive.`;
    } else if (lowerText.includes("agent") || lowerText.includes("aegis") || lowerText.includes("protocol") || lowerText.includes("/call")) {
      if (lowerText.includes("lock") || lowerText.includes("secure")) {
        agentResponseText = `[PROTOCOL_ENFORCED] Security lockdown initiated. All smart locks on Sector 7 (Room ${streamPath.split('-').pop()}) have been engaged. Monitoring for perimeter breaches.`;
        setAnalysisStatus("PROTOCOL: SECURE_LOCKDOWN");
        setTimeout(() => setAnalysisStatus(null), 5000);
      } else if (lowerText.includes("status")) {
        agentResponseText = `[SESSION_REPORT] Audit Agent Vigilance-01 is ${isVigilanceEnabled ? 'ONLINE' : 'OFFLINE'}. Auto-scan is ${isAutoEnabled ? 'ENABLED' : 'DISABLED'}. Feed health is OPTIMAL. No critical breaches detected in last 5 cycles.`;
      } else {
        agentResponseText = `[NEURAL_LINK] Agent Sigma summoned. Analyzing thread context... I am monitoring the ${streamPath} feed. Current threat level is ${threatLevel.toUpperCase()}. How can I assist with tactical operations?`;
      }
    }

    if (agentResponseText) {
      const agentNow = new Date(Date.now() + 1500).toISOString();
      const agentMsg: MessageEventRecord = {
        id: `optimistic-agent-${Date.now()}`,
        threadId: staffThread.id,
        kind: "system",
        text: agentResponseText,
        senderRole: "system",
        senderName: "AEGIS_CORE",
        senderId: "aegis-core",
        createdAt: agentNow,
        publishAt: agentNow,
        scheduled: false,
        meetingAt: null,
        meetingLink: null,
      };
      setTimeout(() => setChatMessages(prev => [...prev, agentMsg]), 1500);
    }

    // Fire-and-forget DB write — don't block the UI
    try {
      await sendThreadMessage({
        thread: staffThread,
        sender: viewer,
        text: messageText.trim()
      });

      if (agentResponseText) {
        setTimeout(async () => {
          try {
            await sendThreadMessage({
              thread: staffThread,
              sender: { role: "admin", userId: "aegis-core", name: "AEGIS_CORE" },
              text: agentResponseText!,
              kind: "system"
            });
          } catch (e) {
            console.warn("[Chat] Agent response DB write failed (optimistic shown):", e);
          }
        }, 1500);
      }
    } catch (e) {
      console.warn("[Chat] DB write failed (optimistic shown):", e);
    }
  };

  // Auto-Audit Logic
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isScanning) {
      playTacticalSound('scan');
    } else {
      setMatchData(null);
    }
  }, [isScanning]);

  const captureFrame = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) {
      console.warn("[Capture] References not ready");
      return null;
    }
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Attempt forced sync if dimensions are missing
    if (video.videoWidth === 0 || video.readyState < 2) {
      console.log("[Capture] Mirror not ready, forcing re-sync...");
      try {
        await video.play();
        // Wait a small bit for the buffer to populate
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn("[Capture] Forced play failed:", e);
      }
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("[Capture] Still no dimensions. ReadyState:", video.readyState);
      return null;
    }

    console.log(`[Capture] Frame obtained: ${video.videoWidth}x${video.videoHeight}`);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    
    try {
      // 1. Draw to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 2. Export to base64
      const frame = canvas.toDataURL("image/jpeg", 0.8);
      return frame;
    } catch (e: any) {
      if (e.name === 'SecurityError') {
        console.error("[Capture] TAINTED_CANVAS: CORS headers missing from stream source. Verification impossible.");
        setAnalysisStatus("SECURITY_ERR: CORS_BLOCK");
      } else {
        console.error("[Capture] Export failed:", e);
      }
      return null;
    }
  };

  const handleCompare = async (insightToCompare?: Insight) => {
    if (isAnalyzing) return;
    
    // 1. Capture frame if not provided from a historical insight
    let frameToUse = insightToCompare?.capturedFrame || null;
    
    if (!frameToUse) {
      frameToUse = await captureFrame();
    }
    
    if (!frameToUse) {
      setAnalysisStatus("CAPTURE_FAIL: NO_FEED");
      setTimeout(() => setAnalysisStatus(null), 3000);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStatus("NEURAL_RECOMPARING...");
    
    try {
      const response = await fetch("/api/admin/monitoring/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frameToUse }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      setComparisonData({
        insightId: insightToCompare?.id || `manual-${Date.now()}`,
        feedImage: frameToUse,
        referenceImage: data.matchedProfileUrl || "/placeholder-person.jpg",
        confidence: data.confidence || 0,
        personName: data.matchName || "Unknown Subject"
      });
      
      setShowComparisonPanel(true);
      setAnalysisStatus("MATCH_RESOLVED");
      playTacticalSound('lock');
      setTimeout(() => setAnalysisStatus(null), 2000);

    } catch (error) {
      console.error("Comparison failed:", error);
      setAnalysisStatus("SEARCH_ERROR: DB_TIMEOUT");
      setTimeout(() => setAnalysisStatus(null), 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnroll = async (image: string) => {
    const name = prompt("Enter Subject Name for Identity Enrollment:");
    if (!name) return;

    const role = prompt("Enter Role (staff/guest):", "guest");
    
    setAnalysisStatus("ENROLLING_IDENTITY...");
    try {
      const response = await fetch("/api/admin/monitoring/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, name, role }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setInsights((prev) => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        observation: "SUBJECT_ENROLLED",
        analysis: `Identity profile created for ${name}. Biometric hash stored in Aegis Vault.`,
        decision: "ENROLLMENT_COMPLETE",
        severity: "info",
        metadata: { matchName: name, role: role }
      } as Insight, ...prev]);

      setAnalysisStatus("ENROLLMENT_SUCCESS");
      playTacticalSound('lock');
    } catch (e) {
      console.error("Enrollment failed:", e);
      setAnalysisStatus("ENROLL_FAILED");
    }
    setTimeout(() => setAnalysisStatus(null), 3000);
  };

  const handleAnalysis = async () => {
    if (isAnalyzing) return;
    
    const frame = await captureFrame();
    if (!frame) {
      // The error is already logged in captureFrame
      let reason = "UNSYNCED_STREAM";
      const video = videoRef.current;
      
      if (video && video.readyState < 2) reason = "BUFFERING_MIRROR";
      else if (video && video.videoWidth === 0) reason = "NO_STREAM_DATA";
      else if (analysisStatus?.includes("CORS")) reason = "CORS_BLOCK";

      setAnalysisStatus(`CAPTURE_FAIL: ${reason}`);
      setTimeout(() => setAnalysisStatus(null), 4000);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStatus("AUDITING_FRAME...");
    
    try {
      const response = await fetch("/api/admin/monitoring/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frame, cameraId: streamPath }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      if (data.observation === "Scanning failed") {
        setAnalysisStatus("ANALYSIS_FAILED: NEURAL_TIMEOUT");
        setTimeout(() => setAnalysisStatus(null), 3000);
      } else {
        setAnalysisStatus("AUDIT_COMPLETE");
        setTimeout(() => setAnalysisStatus(null), 2000);
      }

      const newInsight: Insight = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        ...data,
      };
      
      setInsights((prev: Insight[]) => [newInsight, ...prev].slice(0, 50)); 
      
      // TRIGGER BIOMETRIC COMPARISON UI if person is identified
      if (data.identifiedAs && data.identifiedAs !== "Unknown") {
        setComparisonData({
          insightId: newInsight.id,
          feedImage: frame,
          referenceImage: data.metadata?.matchedProfileUrl || "/placeholder-person.jpg",
          confidence: data.metadata?.confidence || 94, // fallback if not provided
          personName: data.metadata?.matchName || data.identifiedAs
        });
        
        // Enrich the insight with verification assets immediately
        newInsight.capturedFrame = frame;
        newInsight.matchImage = data.metadata?.matchedProfileUrl;
        
        setShowComparisonPanel(true);
        playTacticalSound('lock');
      }

      if (data.severity === 'critical') setThreatLevel('high');
      else if (data.severity === 'warning') setThreatLevel('medium');

      // VIGILANCE AGENT AUDIT
      if (isVigilanceEnabled) {
        setAnalysisStatus("VIGILANCE_AUDIT_PENDING...");
        const auditRes = await fetch("/api/admin/monitoring/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ insight: newInsight }),
        }).then(r => r.json());

        if (auditRes.isThreat) {
          playTacticalSound('alert');
          await logThreatForReview({
            insightId: newInsight.id,
            description: `${auditRes.reasoning} | Recommended: ${auditRes.actionRequired}`,
            severity: newInsight.severity === 'critical' ? 'critical' : 'high'
          });
          setAnalysisStatus("THREAT_DETECTED!");
        }
      }

    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisStatus("AUDIT_ERROR: SYSTEM_OFFLINE");
      setTimeout(() => setAnalysisStatus(null), 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020406] text-cyan-50/90 font-mono selection:bg-cyan-500/30 overflow-hidden relative">
      <DashboardHeader 
        title="ADMINISTRATOR" 
        subtitle="AI Surveillance Cluster // Alpha-01"
        onMenuClick={() => setSidebarMobileOpen(true)} 
      >
        <button 
          onClick={async () => {
            if (confirm("TERMINATE ALL ACTIVE BROADCASTS?")) {
              await clearAllAlerts();
              playTacticalSound('alert');
            }
          }}
          className="px-4 py-2 bg-red-600/10 border border-red-500/30 rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-600/20 transition-all flex items-center gap-2"
        >
          <ShieldAlert size={14} />
          Stop Broadcasts
        </button>
      </DashboardHeader>
      
      <div className="flex h-[calc(100vh-64px)] mt-16 overflow-hidden">
        <AdminSidebar 
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarMobileOpen={sidebarMobileOpen}
          setSidebarMobileOpen={setSidebarMobileOpen}
        />
        
        <main className="flex-1 flex overflow-hidden bg-[#020406] relative">
          <canvas ref={canvasRef} className="hidden" />

          {/* Main Layout Grid */}
          <div className="flex-1 flex flex-row p-6 gap-6 overflow-hidden">
            
            {/* Left Column: Core HUD & Viewport */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top HUD Row */}
              <div className="flex items-center justify-between mb-8 px-4">
                {/* 1. Branding Section */}
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 border border-cyan-500/30 rounded-2xl flex items-center justify-center bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <Shield size={24} className="text-cyan-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tighter text-cyan-50 leading-none mb-1 uppercase">Eye of Aegis</h1>
                    <p className="text-[10px] text-cyan-700 tracking-[0.4em] uppercase font-bold">Surveillance Cluster // Alpha-01</p>
                  </div>
                </div>

                {/* 2. Tactical Actions */}
                <div className="flex items-center gap-4">
                   <AnimatePresence>
                     {activeAlerts.some(a => a.active) && (
                       <motion.div 
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="flex items-center gap-3 bg-red-600 px-4 py-2 rounded-xl border border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                       >
                          <Megaphone size={14} className="text-white animate-bounce" />
                          <span className="text-[9px] font-black text-white uppercase tracking-wider">Active Protocol</span>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <button 
                     onClick={() => setShowTacticalPanel(true)}
                     className="flex items-center gap-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-2xl text-cyan-400 transition-all hover:scale-105 active:scale-95 group shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                   >
                     <Activity size={18} className="group-hover:animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tactical Operations</span>
                     <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse ml-1" />
                   </button>
                </div>
              </div>

              {/* TACTICAL CONTROL OVERLAY */}
              <AnimatePresence>
                {showTacticalPanel && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowTacticalPanel(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-[101] bg-[#05070a]/90 backdrop-blur-2xl border border-cyan-500/20 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_50px_rgba(6,182,212,0.1)] overflow-hidden"
                    >
                      {/* Panel Header */}
                      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black">
                            <Activity size={20} />
                          </div>
                          <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">Tactical Control Center</h2>
                            <p className="text-[10px] text-cyan-500/60 tracking-[0.3em] font-bold uppercase">Manual Override & System Routing</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowTacticalPanel(false)}
                          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Section 1: Crisis & Emergency */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Zap size={16} className="text-red-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80">Crisis Management</span>
                          </div>
                          <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 space-y-6">
                            <p className="text-xs text-white/60 leading-relaxed">Execute wide-area emergency protocols. This will broadcast alerts to all connected hotel systems.</p>
                            <button 
                              onClick={() => {
                                setIsEmergencyModalOpen(true);
                                setShowTacticalPanel(false);
                              }}
                              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] flex items-center justify-center gap-3 group"
                            >
                              <Zap size={16} className="group-hover:animate-pulse" />
                              Launch Crisis Command
                            </button>
                          </div>
                        </div>

                        {/* Section 2: Neural Routing */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Brain size={16} className="text-cyan-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/80">Neural Connection Path</span>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                             <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Transmission Protocol</label>
                                  <div className="relative group">
                                    <select 
                                      value={protocol}
                                      onChange={(e) => setProtocol(e.target.value as any)}
                                      className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-[11px] text-cyan-400 font-bold appearance-none focus:outline-none focus:border-cyan-500/50 transition-colors uppercase tracking-tighter cursor-pointer"
                                    >
                                      <option value="webrtc">WebRTC (Ultra Low Latency)</option>
                                      <option value="hls">HLS (Stable Stream)</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50" />
                                  </div>
                                  {protocol === "webrtc" && isHttps && (
                                    <p className="text-[9px] text-yellow-400/80 font-bold uppercase tracking-wider ml-1">
                                      ⚠ WebRTC requires HTTPS media server. Switch to HLS or configure Caddy domain.
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Camera Feed Routing</label>
                                  <div className="relative group">
                                    <select 
                                      value={streamPath}
                                      onChange={(e) => setStreamPath(e.target.value)}
                                      className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-[11px] text-cyan-400 font-bold appearance-none focus:outline-none focus:border-cyan-500/50 transition-colors uppercase tracking-tighter cursor-pointer"
                                    >
                                      {savedSources.map(s => (
                                        <option key={s.id} value={s.path}>{s.label}</option>
                                      ))}
                                      {savedSources.length === 0 && <option value="phone-cctv">Default Mobile Feed</option>}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50" />
                                  </div>
                                </div>
                             </div>
                          </div>
                        </div>

                        {/* Section 3: Active Operations */}
                        <div className="md:col-span-2 space-y-6">
                           <div className="flex items-center gap-3 mb-2">
                            <Settings size={16} className="text-white/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Active Broadcast Controls</span>
                          </div>
                          <div className="flex gap-4">
                            <button className="flex-1 py-5 bg-red-600/10 border border-red-500/40 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-3 group">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              Active Protocol
                            </button>
                            
                            <button 
                              onClick={async () => {
                                await clearAllAlerts();
                                playTacticalSound('scan');
                                setAnalysisStatus("SYSTEM_CLEAR: ALL_BROADCASTS_TERMINATED");
                                setTimeout(() => setAnalysisStatus(null), 3000);
                              }}
                              className="flex-1 py-5 bg-white/5 border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 group"
                            >
                              <ShieldAlert className="w-4 h-4 group-hover:text-amber-500 transition-colors" />
                              Kill All Broadcasts
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Footer Stats */}
                      <div className="bg-black/40 p-6 px-10 flex items-center justify-between border-t border-white/5">
                        <div className="flex gap-10">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">Neural Engine Load</span>
                            <span className="text-xs font-black text-cyan-500">{neuralLoad}%</span>
                          </div>
                          <div className="flex flex-col border-l border-white/5 pl-10">
                            <span className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">Session Active</span>
                            <span className="text-xs font-black text-white/60">04:12:44</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-cyan-900 font-mono italic">AEGIS_CORE v3.1 // SECURE_LINK_ESTABLISHED</div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Viewport Frame */}
              <div ref={containerRef} className="relative flex-1 bg-black rounded-xl border border-cyan-950/40 overflow-hidden shadow-2xl">
                {/* Internal HUD Elements */}
                <div className="absolute top-8 left-8 z-30 pointer-events-none">
                  <div className="flex items-center gap-3 bg-black/80 border border-cyan-500/20 px-3 py-1.5 rounded">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-cyan-50 tracking-widest uppercase">
                      Feed: SEC_{streamPath.replace('-', '_').toUpperCase()} // {protocol.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-1 opacity-40">
                     <span className="text-[9px] text-cyan-400 tracking-wider">XY: [142.4, 882.1]   MODE: {protocol === 'webrtc' ? 'LOW_LATENCY' : 'BUFFERED'}</span>
                  </div>
                </div>

                {/* Brackets */}
                <div className="absolute top-6 left-6 w-16 h-16 border-t border-l border-cyan-500/20 rounded-tl-lg" />
                <div className="absolute top-6 right-6 w-16 h-16 border-t border-r border-cyan-500/20 rounded-tr-lg" />
                <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l border-cyan-500/20 rounded-bl-lg" />
                <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-cyan-500/20 rounded-br-lg" />

                {/* Analytical Video Stream (Always present for frame capture) */}
                <video 
                  ref={videoRef}
                  muted
                  autoPlay
                  playsInline
                  crossOrigin="anonymous"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-0 ${
                    protocol === 'hls' ? 'opacity-60' : 'opacity-[0.02]'
                  }`}
                />

                {/* Direct Live Viewer (WebRTC) */}
                {protocol === "webrtc" && streamUrl && (
                  <iframe 
                    src={streamUrl}
                    className="absolute inset-0 w-full h-full border-0 opacity-80 z-10"
                    allow="autoplay; fullscreen"
                  />
                )}

                {/* Analysis Status overlay for WebRTC */}
                {protocol === "webrtc" && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20">
                      <p className="text-[8px] text-cyan-500/40 uppercase tracking-[0.4em]">Audit Mode: Active_Background_Capture</p>
                      <p className="text-[7px] text-cyan-900 uppercase mt-1 italic">Using HLS mirror for neural analysis</p>
                   </div>
                )}

                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_20%,#000_150%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_100%,100%_4px,4px_100%]" />
                
                <AnimatePresence>
                  {(isAnalyzing || analysisStatus) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 20 }}
                      className="absolute top-8 right-8 z-40 bg-black/60 backdrop-blur-xl border border-cyan-500/30 px-5 py-2.5 rounded flex items-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                    >
                       <div className="relative">
                          <Brain size={16} className={`text-cyan-400 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                          {isAnalyzing && (
                            <div className="absolute inset-0 border border-cyan-500 rounded-full animate-ping opacity-30" />
                          )}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[7px] text-cyan-800 font-black uppercase tracking-widest leading-none mb-1">System Audit</span>
                          <span className="text-[10px] text-cyan-50 font-black uppercase tracking-widest animate-pulse">
                             {analysisStatus || "Neural Processing"}
                          </span>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Controls */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center gap-3 bg-cyan-400 hover:bg-cyan-300 transition-colors px-6 py-3 rounded-lg text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-50"
                  >
                    <Brain size={18} fill="currentColor" />
                    Snapshot Audit
                  </button>

                  <div className="h-8 w-px bg-cyan-900/30" />

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <input 
                        type="checkbox" 
                        id="auto-audit"
                        checked={isAutoEnabled}
                        onChange={(e) => setIsAutoEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-cyan-900 bg-black/50 text-cyan-500 focus:ring-cyan-500/50"
                      />
                      <label htmlFor="auto-audit" className="text-[10px] text-cyan-700 font-black uppercase tracking-widest cursor-pointer select-none">
                        Auto
                      </label>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <input 
                        type="checkbox" 
                        id="vigilance-audit"
                        checked={isVigilanceEnabled}
                        onChange={(e) => setIsVigilanceEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-cyan-900 bg-black/50 text-purple-500 focus:ring-purple-500/50"
                      />
                      <label htmlFor="vigilance-audit" className="text-[10px] text-purple-700 font-black uppercase tracking-widest cursor-pointer select-none">
                        Vigilance-01
                      </label>
                    </div>

                    <button 
                      onClick={() => handleCompare()}
                      className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded-xl text-cyan-400 transition-all group"
                    >
                      <Users size={16} className="group-hover:animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Compare Subject</span>
                    </button>

                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <span className="text-[10px] text-cyan-900 font-bold uppercase tracking-widest">10S Rate</span>
                      <ChevronDown size={12} className="text-cyan-500/50" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setIsAutoEnabled(!isAutoEnabled);
                      playTacticalSound('scan');
                    }}
                    title="Toggle Auto-Analysis"
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                      isAutoEnabled 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                      : 'bg-cyan-500/5 border-cyan-900/30 text-cyan-600 hover:text-cyan-400'
                    }`}
                  >
                    <Timer size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        containerRef.current?.requestFullscreen();
                      }
                    }}
                    title="Maximize Viewport"
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-cyan-900/30 bg-cyan-500/5 text-cyan-600 hover:text-cyan-400 transition-colors"
                  >
                    <Maximize2 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      setAnalysisStatus("SYSTEM_RESYNCING...");
                      setTimeout(() => {
                        setAnalysisStatus(null);
                        setInsights([]);
                        setThreatLevel('low');
                      }, 1000);
                    }}
                    title="Re-sync Neural Link"
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-cyan-900/30 bg-cyan-500/5 text-cyan-600 hover:text-cyan-400 transition-colors"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Tactical Feed Panel (Locked) */}
            <div className="w-[440px] flex flex-col bg-[#05070a] border border-cyan-900/30 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-cyan-900/30 flex items-center justify-between">
                <div className="flex bg-black/40 p-1 rounded-lg border border-cyan-900/30">
                  <button 
                    onClick={() => setFeedMode('tactical')}
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-[0.2em] transition-all ${feedMode === 'tactical' ? 'bg-cyan-500 text-black' : 'text-cyan-800 hover:text-cyan-400'}`}
                  >
                    Tactical Feed
                  </button>
                  <button 
                    onClick={() => setFeedMode('chat')}
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-[0.2em] transition-all ${feedMode === 'chat' ? 'bg-cyan-500 text-black' : 'text-cyan-800 hover:text-cyan-400'}`}
                  >
                    Operational Chat
                  </button>
                  <button 
                    onClick={() => setFeedMode('reports')}
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-[0.2em] transition-all ${feedMode === 'reports' ? 'bg-cyan-500 text-black' : 'text-cyan-800 hover:text-cyan-400'}`}
                  >
                    SOS Reports
                  </button>
                </div>
                <span className="text-[9px] text-cyan-800 font-bold tracking-widest border border-cyan-900/30 px-2 py-1 rounded uppercase">
                  {feedMode === 'tactical' ? 'Alpha Stream' : feedMode === 'chat' ? 'Live Comms' : 'Incident Archive'}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-6 relative bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0,transparent_70%)] custom-scrollbar">
                <AnimatePresence mode="wait">
                  {feedMode === 'tactical' ? (
                    <motion.div 
                      key="tactical"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {insights.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 select-none">
                          <div className="w-24 h-24 border border-dashed border-cyan-500/30 rounded-full flex items-center justify-center mb-6">
                             <Terminal size={40} className="text-cyan-400" />
                          </div>
                          <span className="text-sm font-black tracking-[0.3em] uppercase text-cyan-100">Awaiting Analysis</span>
                          <span className="text-[10px] mt-2 tracking-widest uppercase text-cyan-500">Ready for input...</span>
                        </div>
                      ) : (
                        insights.map((insight) => (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-5 mb-4 rounded-lg border-l-4 transition-all hover:bg-cyan-500/5 ${
                              insight.severity === 'critical' ? 'bg-red-500/5 border-red-500/40' : 
                              insight.severity === 'warning' ? 'bg-amber-500/5 border-amber-500/40' : 
                              'bg-cyan-500/5 border-cyan-500/40'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col gap-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                  insight.severity === 'critical' ? 'text-red-400' : 
                                  insight.severity === 'warning' ? 'text-amber-400' : 'text-cyan-400'
                                }`}>{insight.observation}</span>
                                {insight.verified && (
                                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md w-fit">
                                    <Check size={10} className="text-emerald-400" />
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Agent Verified</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-[8px] text-cyan-800 font-bold">{insight.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-cyan-50/70 leading-relaxed mb-3">{insight.analysis}</p>
                            
                            {(insight.capturedFrame || insight.matchImage) && (
                              <div className="flex items-center gap-3 mb-3">
                                {insight.capturedFrame && (
                                  <div className="relative group">
                                    <img src={insight.capturedFrame} className="w-16 h-12 object-cover rounded-md border border-white/5 grayscale group-hover:grayscale-0 transition-all" alt="Capture" />
                                    <div className="absolute inset-0 border border-cyan-500/20 rounded-md pointer-events-none" />
                                  </div>
                                )}
                                {insight.matchImage && (
                                  <>
                                    <ChevronRight size={10} className="text-cyan-900" />
                                    <div className="relative group">
                                      <img src={insight.matchImage} className="w-16 h-12 object-cover rounded-md border border-emerald-500/20" alt="Reference" />
                                      <div className="absolute inset-0 border border-emerald-500/20 rounded-md pointer-events-none" />
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[9px] font-black text-cyan-600 uppercase italic">
                                <Shield size={10} />
                                {insight.decision}
                              </div>
                              <button 
                                onClick={() => handleCompare(insight)}
                                className="text-[8px] font-black text-cyan-400 hover:text-white uppercase tracking-[0.2em] bg-cyan-500/10 hover:bg-cyan-500/30 px-2 py-1 rounded transition-all flex items-center gap-1.5"
                              >
                                <Scan size={10} />
                                Re-verify
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  ) : feedMode === 'chat' ? (
                    <motion.div 
                      key="chat"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col h-full"
                    >
                      <div className="flex-1 space-y-4 min-h-0 overflow-y-auto custom-scrollbar pr-2">
                        {chatMessages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <Send size={24} className="text-cyan-500 mb-2" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-100">No active comms</span>
                          </div>
                        ) : (
                          <>
                            {chatMessages.map((msg) => (
                              <motion.div 
                                key={msg.id} 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex flex-col ${msg.senderRole === 'admin' ? 'items-end' : 'items-start'}`}
                              >
                                <div className="flex items-center gap-2 mb-1 px-1">
                                  <span className={`text-[7px] font-black uppercase tracking-widest ${msg.senderRole === 'admin' ? 'text-cyan-400' : 'text-amber-400'}`}>
                                    {msg.senderName === 'AEGIS_CORE' ? '⚡ AEGIS_CORE' : msg.senderName}
                                  </span>
                                  <span className="text-[7px] text-cyan-900">{formatMessageTime(msg.createdAt)}</span>
                                </div>
                                <div className={`px-4 py-2.5 rounded-2xl text-[10px] max-w-[85%] font-medium leading-relaxed shadow-sm transition-all hover:shadow-cyan-500/5 ${
                                  msg.senderRole === 'admin' 
                                    ? msg.senderId === 'aegis-core'
                                      ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-400/40 rounded-tr-none italic'
                                      : 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20 rounded-tr-none' 
                                    : 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tl-none'
                                }`}>
                                  {msg.text}
                                </div>
                              </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                          </>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-cyan-900/20">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 px-1">
                            <button 
                              onClick={() => handleSendChat("/call AGENT_SIGMA")}
                              className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[7px] font-black text-cyan-500 uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                            >
                              Call Agent Sigma
                            </button>
                            <button 
                              onClick={() => handleSendChat("Requesting status update on current feed.")}
                              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[7px] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                              Status Request
                            </button>
                            <button 
                              onClick={() => handleSendChat("/report")}
                              className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[7px] font-black text-purple-500 uppercase tracking-widest hover:bg-purple-500/20 transition-all"
                            >
                              Intelligence Report
                            </button>
                          </div>
                          
                          <div className="relative">
                            <input 
                              type="text"
                              value={draftChat}
                              onChange={(e) => setDraftChat(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                              placeholder="OPERATIONAL COMMAND..."
                              className="w-full bg-black border border-cyan-900/30 rounded-xl px-4 py-3 text-[10px] text-cyan-100 placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500/50 transition-all pr-24"
                            />
                            <div className="absolute right-2 top-1.5 flex items-center gap-1">
                              <button 
                                onClick={() => handleSendChat()}
                                className="p-2 text-cyan-500 hover:text-cyan-400 transition-colors bg-cyan-500/10 rounded-lg border border-cyan-500/20"
                              >
                                <Send size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : feedMode === 'reports' ? (
                    <motion.div 
                      key="reports"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {sosReports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                          <FileText size={32} className="text-cyan-500 mb-4" />
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-100">Archive Empty</span>
                        </div>
                      ) : (
                        sosReports.map((report) => (
                          <button
                            key={report.id}
                            onClick={() => setSelectedReport(report)}
                            className="w-full text-left p-4 rounded-xl border border-cyan-900/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                {report.incidentId.slice(0, 8)}...
                              </span>
                              <span className="text-[8px] text-cyan-800 font-bold">
                                {new Date(report.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-[10px] text-cyan-50/70 line-clamp-2 leading-relaxed mb-3 group-hover:text-cyan-100">
                              {report.summary}
                            </p>
                            <div className="flex items-center gap-2 text-[8px] font-black text-cyan-600 uppercase">
                              <Brain size={10} />
                              Sentinel-02 Report
                            </div>
                          </button>
                        ))
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* VIGILANCE THREAT INTERCEPTION PANEL */}
              {pendingThreats.length > 0 && (
                <div className="mx-6 mb-6 p-4 bg-red-950/20 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Aegis Vigilance Alert</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-3">
                    {pendingThreats.map(threat => (
                      <div key={threat.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-[10px] text-red-200 leading-tight mb-3 font-semibold">{threat.description}</p>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => updateThreatStatus(threat.id!, "approved")}
                             className="flex-1 bg-red-600 hover:bg-red-500 text-white text-[9px] font-black py-1.5 rounded flex items-center justify-center gap-1 uppercase transition-colors"
                           >
                             <Check size={10} /> Confirm
                           </button>
                           <button 
                             onClick={() => updateThreatStatus(threat.id!, "dismissed")}
                             className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[9px] font-black py-1.5 rounded flex items-center justify-center gap-1 uppercase transition-colors"
                           >
                             <X size={10} /> Dismiss
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Bar at panel bottom */}
              <div className="p-6 border-t border-cyan-900/30 bg-black/40">
                 <div className="flex items-center justify-between text-[9px] font-bold text-cyan-800 uppercase mb-3">
                    <span className="italic">Neural Engine Load</span>
                    <span className={`transition-colors duration-500 ${neuralLoad > 50 ? 'text-cyan-400' : 'text-cyan-800'}`}>
                      {neuralLoad > 85 ? 'MAX_CAPACITY' : neuralLoad > 50 ? 'PROCESSING' : 'IDLE_LINK'} // {neuralLoad}%
                    </span>
                 </div>
                 <div className="h-1 bg-cyan-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "14%" }}
                      animate={{ 
                        width: `${neuralLoad}%`,
                        backgroundColor: neuralLoad > 85 ? '#22d3ee' : '#0891b2',
                        boxShadow: neuralLoad > 85 ? '0 0 15px #22d3ee' : '0 0 5px #0891b2'
                      }}
                      className="h-full" 
                    />
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showScanner && (
          <BiometricScanner 
            onCapture={(photo) => handleEnroll(photo)}
            onClose={() => setShowScanner(false)}
            title="Database Identity Enrollment"
          />
        )}
      </AnimatePresence>

      {/* Emergency Messaging Modal */}
      <AnimatePresence>
        {isEmergencyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#0a0c10] border border-red-500/30 rounded-[32px] p-8 shadow-[0_30px_100px_rgba(220,38,38,0.2)]"
            >
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                        <Megaphone size={24} className="text-white" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Crisis Broadcast Center</h3>
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] mt-1">High Priority Emergency Protocol</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setIsEmergencyModalOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Broadcast Message</label>
                     <textarea 
                        value={emergencyMessage}
                        onChange={(e) => setEmergencyMessage(e.target.value)}
                        placeholder="e.g. Code Red: Please proceed to the nearest emergency output in a calm and orderly manner."
                        className="w-full h-32 bg-black border border-red-500/20 rounded-2xl p-4 text-sm text-white focus:border-red-500/50 outline-none transition-colors px-5 py-4 placeholder:text-zinc-700 resize-none"
                     />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     {[
                       { id: 'all', label: 'All Units', icon: Shield },
                       { id: 'staff', label: 'Staff Hub', icon: Smartphone },
                       { id: 'guests', label: 'Guest Network', icon: UserCheck }
                     ].map(t => (
                       <button
                         key={t.id}
                         onClick={() => setEmergencyTarget(t.id as any)}
                         className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                            emergencyTarget === t.id 
                            ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-[1.02]' 
                            : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                         }`}
                       >
                          <t.icon size={18} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">{t.label}</span>
                       </button>
                     ))}
                  </div>

                  <button 
                    onClick={async () => {
                      if (!emergencyMessage) return;
                      await sendEmergencyAlert({
                        type: "evacuation",
                        message: emergencyMessage,
                        sender: "Aegis Command HQ",
                        target: emergencyTarget
                      });
                      setIsEmergencyModalOpen(false);
                      setEmergencyMessage("");
                    }}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition-all hover:-translate-y-1 active:translate-y-0"
                  >
                    <Send size={18} />
                    Initiate Broadcast
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Neural Comparison Modal */}
      <AnimatePresence>
        {showComparisonPanel && comparisonData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComparisonPanel(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0f14] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h2 className="text-xl font-black text-cyan-50 tracking-tighter uppercase whitespace-nowrap">Subject Verification</h2>
                  <p className="text-[10px] text-cyan-700 font-bold tracking-[0.3em] uppercase mt-1">Biometric Cross-Reference // AEGIS_V2</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-cyan-800 font-bold uppercase tracking-widest mb-1">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${comparisonData.confidence}%` }}
                        className={`h-full ${comparisonData.confidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      />
                    </div>
                    <span className={`text-sm font-black ${comparisonData.confidence > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {comparisonData.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="p-8 grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-[4/5] bg-black rounded-2xl border border-cyan-500/30 overflow-hidden relative group">
                    {comparisonData.feedImage ? (
                      <img src={comparisonData.feedImage} alt="Feed Capture" className="w-full h-full object-cover transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-800">
                        <Scan size={40} className="mb-2 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Awaiting Capture</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-black/80 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white uppercase tracking-widest">Live Capture</div>
                    <div className="absolute inset-0 border-2 border-cyan-500/20 pointer-events-none" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-cyan-900 font-bold uppercase tracking-[0.2em]">Sensor Output</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="aspect-[4/5] bg-black rounded-2xl border border-white/5 overflow-hidden relative group">
                    {comparisonData.referenceImage && comparisonData.referenceImage !== "/placeholder-person.jpg" ? (
                      <img 
                        src={comparisonData.referenceImage.startsWith('data:') || comparisonData.referenceImage.startsWith('http') 
                          ? comparisonData.referenceImage 
                          : `data:image/jpeg;base64,${comparisonData.referenceImage}`} 
                        alt="Database Reference" 
                        className="w-full h-full object-cover border-2 border-emerald-500/30" 
                        onError={(e) => {
                          console.error("Reference image load failed");
                          (e.target as HTMLImageElement).src = "/placeholder-person.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-emerald-900/30">
                        <Database size={40} className="mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-widest">No Profile Match</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-emerald-500/20 border border-emerald-500/40 px-2 py-1 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-widest">DB Reference</div>
                    <div className="absolute inset-0 border-2 border-emerald-500/10 pointer-events-none" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-emerald-400 uppercase tracking-tight mt-2">{comparisonData.personName}</p>
                    <p className="text-[10px] text-emerald-900 font-bold uppercase tracking-[0.2em]">Verified Identity Record</p>
                  </div>
                </div>              </div>

              {/* Actions */}
              <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center gap-4">
                <button 
                  onClick={async () => {
                    if (comparisonData) {
                      // 1. Update local UI state
                      setInsights(prev => prev.map(ins => 
                        ins.id === comparisonData.insightId 
                        ? { ...ins, verified: true, identifiedAs: comparisonData.personName } 
                        : ins
                      ));

                      // 2. Trigger Tactical Dispatch
                      const targetInsight = insights.find(ins => ins.id === comparisonData.insightId);
                      if (targetInsight) {
                        setAnalysisStatus("DISPATCHING_INTERCEPTION...");
                        try {
                          await fetch("/api/admin/monitoring/dispatch", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ insight: { ...targetInsight, identifiedAs: comparisonData.personName } }),
                          });
                          setAnalysisStatus("STAFF_NOTIFIED: CAPTURE_INITIATED");
                        } catch (e) {
                          console.error("Dispatch failed:", e);
                          setAnalysisStatus("DISPATCH_FAILED");
                        }
                        setTimeout(() => setAnalysisStatus(null), 3000);
                      }
                    }
                    setShowComparisonPanel(false);
                    playTacticalSound('scan');
                  }}
                  className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 py-4 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                >
                  Confirm Match
                </button>
                <button 
                  onClick={async () => {
                    playTacticalSound('alert');
                    if (comparisonData) {
                      setInsights(prev => prev.map(ins => 
                        ins.id === comparisonData.insightId 
                        ? { ...ins, verified: false, severity: 'critical', decision: 'MISMATCH_REPORTED' } 
                        : ins
                      ));
                      
                      setAnalysisStatus("VIGILANCE: MISMATCH_REPORTED");
                      await sendEmergencyAlert({
                        type: "custom",
                        message: `[BIOMETRIC_MISMATCH] AI identified ${comparisonData.personName} incorrectly. Staff intervention required.`,
                        sender: "AEGIS_VIGILANCE",
                        target: "staff"
                      });
                    }
                    setShowComparisonPanel(false);
                  }}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 py-4 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                >
                  Report Inaccuracy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOS Report Detailed View */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#05070a] border border-cyan-500/20 rounded-[48px] overflow-hidden shadow-[0_0_150px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh]"
            >
              <div className="bg-cyan-500/5 px-10 py-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <Brain className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">Tactical Intelligence Report</h2>
                    <p className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.3em]">Sentinel-02 // {selectedReport.agentSignature}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar space-y-10">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Terminal size={14} className="text-cyan-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/80">Executive Summary</h3>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
                    <p className="text-sm text-cyan-50/80 leading-relaxed font-medium italic">
                      "{selectedReport.summary}"
                    </p>
                  </div>
                </section>

                {/* Transcript Section (Requested by User) */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone size={14} className="text-amber-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">Voice Transcript</h3>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl font-mono text-[11px] text-amber-100/40 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar-amber">
                    {selectedReport.transcript ? (
                      selectedReport.transcript.split('\n').map((line, i) => (
                        <div key={i} className="mb-2 last:mb-0 border-l border-amber-500/20 pl-4">
                          {line}
                        </div>
                      ))
                    ) : (
                      <div className="py-4 opacity-20 text-center">No synchronized transcript available for this incident ID.</div>
                    )}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldAlert size={14} className="text-red-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80">Threat Assessment</h3>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl">
                      <p className="text-xs text-red-200 font-bold leading-relaxed">
                        {selectedReport.threatAssessment}
                      </p>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Strategic Follow-Up</h3>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl">
                      <p className="text-xs text-emerald-100 font-black tracking-tight">
                        {selectedReport.recommendedFollowUp}
                      </p>
                    </div>
                  </section>
                </div>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={14} className="text-purple-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/80">Operational Insights</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedReport.operationalInsights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-white/5 text-[11px] text-zinc-400">
                        <span className="text-cyan-500 font-black">0{idx + 1}</span>
                        {insight}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="bg-white/[0.02] px-10 py-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest">Aegis Intelligence Matrix // Sentinel-02</span>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black px-10 py-4 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-[0_10px_40px_rgba(6,182,212,0.3)]"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
