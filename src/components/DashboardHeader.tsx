"use client";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthSync } from "@/hooks/useAuthSync";
import { HeaderNotificationItem } from "@/lib/header-notifications";
import { Shield } from "lucide-react";

function mergeNotifications(
  nextNotifications: HeaderNotificationItem[],
  currentNotifications: HeaderNotificationItem[]
) {
  const readState = new Map(
    currentNotifications.map((notification) => [notification.id, notification.unread])
  );

  return nextNotifications.map((notification) => ({
    ...notification,
    unread: readState.get(notification.id) ?? notification.unread,
  }));
}

export function DashboardHeader({
  title,
  subtitle,
  userName: propUserName,
  role: propRole,
  search = false,
  onMenuClick,
  notifications: propNotifications,
  children
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  userName?: string;
  role?: string;
  search?: boolean;
  onMenuClick?: () => void;
  notifications?: HeaderNotificationItem[];
  children?: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const routeRole =
    pathname.startsWith("/admin") ? "admin" : pathname.startsWith("/staff") ? "staff" : "guest";
  const { dbUser, loading } = useAuthSync(routeRole);
  const userName = dbUser ? (dbUser.name || dbUser.displayName || "User") : (loading ? "Loading..." : (propUserName || "Guest"));
  const rawRole = dbUser ? (dbUser.staffRole || dbUser.role || "Role") : (loading ? "..." : (propRole || "Role"));
  const role = typeof rawRole === "string" ? rawRole.charAt(0).toUpperCase() + rawRole.slice(1) : rawRole;
  const notificationRole = dbUser?.role || routeRole;
  const initialNotifications = propNotifications || [];
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>(initialNotifications);
  
  let profileLink = "/guest-profile";
  let settingsLink = "/guest-settings";
  if (pathname.startsWith("/admin")) {
    profileLink = "/admin/profile";
    settingsLink = "/admin/settings";
  } else if (pathname.startsWith("/staff")) {
    profileLink = "/staff-profile";
    settingsLink = "/staff-settings";
  } else if (dbUser?.role?.toLowerCase() === "admin") {
    profileLink = "/admin/profile";
    settingsLink = "/admin/settings";
  } else if (dbUser?.role?.toLowerCase() === "staff") {
    profileLink = "/staff-profile";
    settingsLink = "/staff-settings";
  }

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (!propNotifications) return;

    setNotifications((current) => mergeNotifications(propNotifications, current));
  }, [propNotifications]);

  useEffect(() => {
    if (propNotifications) return;
    if (notificationRole !== "admin" && loading) return;
    if (notificationRole !== "admin" && !dbUser?.firebaseUid) {
      setNotifications([]);
      return;
    }

    let active = true;

    const loadNotifications = async () => {
      try {
        const params = new URLSearchParams({ role: notificationRole });
        if (notificationRole !== "admin" && dbUser?.firebaseUid) {
          params.set("uid", dbUser.firebaseUid);
        }

        const res = await fetch(`/api/header-notifications?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!active || !data.success || !Array.isArray(data.notifications)) {
          return;
        }

        setNotifications((current) => mergeNotifications(data.notifications, current));
      } catch (error) {
        console.error("Failed to load header notifications:", error);
      }
    };

    void loadNotifications();

    // Add socket listener for real-time notification refresh on emergency
    let cleanupSocket: (() => void) | undefined;
    if (notificationRole === "admin") {
      // We import io here to avoid SSR issues if not already handled
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://aegis-socket-server-427243605190.europe-west1.run.app';
      import('socket.io-client').then(({ io }) => {
        const socket = io(socketUrl, {
          transports: ['websocket'],
          upgrade: false,
        });
        socket.on('connect', () => socket.emit('join-role', 'admin'));
        socket.on('sos-alert', (payload) => {
          console.log("[Header] SOS Alert received from socket:", payload);
          void loadNotifications();
        });
        socket.on('call-front-desk', (payload) => {
          console.log("[Header] Front Desk Call received from socket:", payload);
          void loadNotifications();
        });
        cleanupSocket = () => socket.disconnect();
      });
    }

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
      if (cleanupSocket) cleanupSocket();
    };
  }, [dbUser?.firebaseUid, loading, notificationRole, propNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 flex justify-between items-center w-full px-4 md:px-8 py-0 h-16 bg-white/70 dark:bg-[#09090b]/80 backdrop-blur-2xl border-b border-[#e4e4e7]/60 dark:border-white/10 z-[60] shrink-0 font-['Sora'] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-4 lg:gap-8 transition-all duration-300">
        {onMenuClick && (
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#1a1a1a] hover:text-[#09090b] dark:hover:text-white rounded-2xl transition-all duration-200"
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </motion.button>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] shadow-lg shadow-black/5 dark:shadow-white/5 transition-transform duration-300 hover:scale-105">
            <Shield size={20} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-extrabold text-sm tracking-tight text-[#09090b] dark:text-[#f4f4f5] whitespace-nowrap uppercase tracking-[0.15em] flex items-center">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.25em] hidden md:block mt-0.5 font-black opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {search && (
          <div className="relative items-center hidden xl:flex">
            <span className="material-symbols-outlined absolute left-3 text-[#a1a1aa] text-[18px]">search</span>
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#f4f4f5] dark:bg-[#1a1a1a] border border-transparent focus:border-[#09090b] dark:focus:border-white text-[#09090b] dark:text-white text-xs py-2 pl-9 pr-4 placeholder:text-[#a1a1aa] outline-none rounded-xl transition-all duration-200 w-64"
              placeholder="Search…"
              type="text"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        {children}
        <div className="flex items-center gap-2 pr-2 sm:pr-4 border-r border-[#e4e4e7]/60 dark:border-white/10">
          <ThemeToggle />
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="p-2.5 hover:bg-[#f4f4f5] dark:hover:bg-white/5 text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white transition-all duration-200 relative rounded-2xl"
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              aria-expanded={notifOpen}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-[23px]">notifications</span>
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#09090b]"
                  />
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-14 right-0 w-[340px] sm:w-[380px] bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl z-[100] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7] dark:border-[#27272a] bg-gradient-to-r from-white to-[#fafafa] dark:from-[#0f0f0f] dark:to-[#111111]">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-[#09090b] dark:text-white">Notifications</h3>
                      <AnimatePresence>
                        {unreadCount > 0 && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] font-semibold hover:text-[#09090b] dark:hover:text-white transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                      {notifications.map(n => (
                        <motion.button key={n.id} layout
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                          onClick={() => markRead(n.id)}
                          className={`w-full text-left flex items-start gap-4 px-5 py-4 transition-all duration-150 hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a] ${n.unread ? "bg-[#fafafa]/60 dark:bg-[#111111]/60" : "bg-transparent"}`}
                        >
                          <motion.div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.iconBg}`} whileHover={{ scale: 1.08 }}>
                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>{n.icon}</span>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-snug mb-0.5 ${n.unread ? "font-semibold text-[#09090b] dark:text-white" : "font-medium text-[#71717a] dark:text-[#a1a1aa]"}`}>{n.title}</p>
                            <p className="text-[11px] text-[#71717a] dark:text-[#52525b] leading-relaxed line-clamp-2">{n.body}</p>
                            <p className="text-[10px] text-[#a1a1aa] dark:text-[#3f3f46] mt-1.5 font-medium uppercase tracking-wide">{n.time}</p>
                          </div>
                          <AnimatePresence>
                            {n.unread && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                    {notifications.length === 0 && (
                      <div className="px-5 py-8 text-center text-sm text-[#71717a] dark:text-[#a1a1aa]">No live notifications yet.</div>
                    )}
                  </div>

                  <div className="px-5 py-3 border-t border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111]">
                    <button className="text-xs text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white font-medium transition-colors w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative flex items-center gap-3 sm:gap-4 transition-all duration-300" ref={profileRef}>
          <div className="text-right hidden sm:block">
            <p className="font-bold text-[13px] tracking-tight text-[#09090b] dark:text-[#f4f4f5] leading-tight">{userName}</p>
            <p className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] tracking-[0.2em] uppercase whitespace-nowrap mt-0.5 font-medium opacity-70">{role}</p>
          </div>
          <motion.button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="w-10 h-10 bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7] dark:from-white/10 dark:to-white/5 border border-[#e4e4e7] dark:border-white/10 flex items-center justify-center rounded-2xl hover:border-[#09090b] dark:hover:border-white/40 transition-all duration-300 overflow-hidden shadow-sm"
            aria-label="User profile menu"
            aria-expanded={profileOpen}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-[21px] text-[#71717a] dark:text-[#cbd5e1]">person</span>
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute top-12 right-0 min-w-52 bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] shadow-2xl shadow-black/10 dark:shadow-black/40 py-2 flex flex-col z-[100] rounded-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[#e4e4e7] dark:border-[#27272a] sm:hidden">
                  <p className="font-semibold text-sm text-[#09090b] dark:text-white">{userName}</p>
                  <p className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.18em] mt-0.5">{role}</p>
                </div>
                <div className="px-4 py-2 text-[10px] text-[#a1a1aa] uppercase font-bold tracking-[0.2em] hidden sm:block">Account</div>
                <Link href={profileLink} onClick={() => setProfileOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-[#09090b] dark:text-[#e5e2e1] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a] flex items-center gap-3 transition-all duration-150">
                  <span className="material-symbols-outlined text-[18px] text-[#71717a] dark:text-[#a1a1aa]">manage_accounts</span> Profile Info
                </Link>
                <Link href={settingsLink} onClick={() => setProfileOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-[#09090b] dark:text-[#e5e2e1] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a] flex items-center gap-3 transition-all duration-150">
                  <span className="material-symbols-outlined text-[18px] text-[#71717a] dark:text-[#a1a1aa]">settings</span> Settings
                </Link>
                <div className="my-1 border-b border-[#e4e4e7] dark:border-[#27272a]" />
                <Link href="/" className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-3 transition-all duration-150 font-medium">
                  <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
