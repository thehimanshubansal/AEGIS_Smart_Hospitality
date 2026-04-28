"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (v: boolean) => void;
  sidebarMobileOpen: boolean;
  setSidebarMobileOpen: (v: boolean) => void;
  alertCount?: number;
}

export function AdminSidebar({
  sidebarExpanded,
  setSidebarExpanded,
  sidebarMobileOpen,
  setSidebarMobileOpen,
  alertCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname() || "/admin";
  const isOpen = sidebarExpanded || sidebarMobileOpen;

  const mainNav = [
    { icon: "dashboard", label: "Dashboard", href: "/admin" },
    { icon: "map", label: "Tactical Map", href: "/admin/tactical-map" },
    { icon: "chat", label: "Messages", href: "/admin/messages", badge: "3" },
    { icon: "emergency", label: "Emergency SOS", href: "/admin/emergency" },
  ];

  const managementNav = [
    { icon: "meeting_room", label: "Room Allocation", href: "/admin/rooms" },
    { icon: "videocam", label: "Camera Access", href: "/admin/cameras" },
    { icon: "analytics", label: "AI Monitoring", href: "/admin/monitoring" },
    { icon: "badge", label: "Staff Details", href: "/admin/staff" },
    { icon: "person", label: "Guest Details", href: "/admin/guests" },
    { icon: "add_home", label: "Manage Rooms", href: "/admin/manage-rooms" },
  ];

  const renderNavItem = (n: { icon: string; label: string; href: string; badge?: string }) => {
    const isActive =
      pathname === n.href || (n.label === "Dashboard" && pathname === "/admin");
    return (
      <Link
        href={n.href}
        key={n.label}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] shadow-md shadow-black/10"
            : "text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#1a1a1a] hover:text-[#09090b] dark:hover:text-white"
        }`}
      >
        <span
          className={`material-symbols-outlined shrink-0 text-[22px] transition-transform duration-200 group-hover:scale-105 ${
            isActive ? "text-white dark:text-[#09090b]" : ""
          }`}
          style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
        >
          {n.icon}
        </span>

        {/* Label */}
        <span
          className={`whitespace-nowrap text-[13px] font-semibold tracking-tight flex-1 overflow-hidden`}
          style={{
            transition: isOpen
              ? "opacity 280ms ease 180ms, transform 280ms ease 180ms, max-width 500ms cubic-bezier(0.4,0,0.2,1)"
              : "opacity 120ms ease, transform 120ms ease, max-width 500ms cubic-bezier(0.4,0,0.2,1)",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateX(0)" : "translateX(-8px)",
            maxWidth: isOpen ? "160px" : "0px",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {n.label}
        </span>

        {/* Badge */}
        {n.badge && (
          <span
            className={`shrink-0 text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full ${
              isActive ? "bg-white/25 dark:bg-black/20 text-white dark:text-[#09090b]" : "bg-red-500 text-white"
            }`}
            style={{
              transition: "opacity 180ms ease, transform 180ms ease",
              transitionDelay: isOpen ? "230ms" : "0ms",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "scale(1)" : "scale(0)",
            }}
          >
            {n.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000]/40 backdrop-blur-sm z-[45] md:hidden"
            onClick={() => setSidebarMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: typeof window !== 'undefined' && window.innerWidth < 768 ? (sidebarMobileOpen ? 0 : -280) : 0,
          width: sidebarMobileOpen ? 280 : (sidebarExpanded ? 256 : 72)
        }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-white/80 dark:bg-[#050505]/90 backdrop-blur-3xl
          border-r border-[#e4e4e7]/60 dark:border-white/5
          shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[12px_0_48px_rgba(0,0,0,0.5)]
          overflow-hidden
        `}
      >
        {/* Mobile Header Branding & Close */}
        <div className="md:hidden flex items-center justify-between h-16 px-6 border-b border-[#e4e4e7]/10 dark:border-[#1a1a1a]/50">
           <span className="text-[11px] font-black tracking-[0.25em] text-[#09090b] dark:text-white">
             AEGIS AI
           </span>
           <button 
             onClick={() => setSidebarMobileOpen(false)} 
             className="w-10 h-10 rounded-xl bg-[#f4f4f5] dark:bg-[#1a1a1a] text-[#71717a] dark:text-[#a1a1aa] flex items-center justify-center"
           >
             <span className="material-symbols-outlined text-[20px]">close</span>
           </button>
        </div>

        {/* Desktop Spacer */}
        <div className="hidden md:block h-16 shrink-0" />

        {/* Toggle Button - Desktop */}
        <div className={`hidden md:flex items-center h-12 border-b border-[#e4e4e7]/10 dark:border-[#1a1a1a]/50 transition-all duration-500 ${sidebarExpanded ? "justify-between px-4" : "justify-center"}`}>
          {sidebarExpanded && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] font-black tracking-[0.25em] text-[#09090b] dark:text-white"
            >
              AEGIS AI
            </motion.span>
          )}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-10 h-10 rounded-xl bg-[#f4f4f5] dark:bg-[#1a1a1a] text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">
              {sidebarExpanded ? "keyboard_double_arrow_left" : "keyboard_double_arrow_right"}
            </span>
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="w-64 flex-1 flex flex-col gap-0 p-3 pt-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* MAIN segment */}
          <div className="mb-2 px-3">
             <span
               className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#71717a] dark:text-[#a1a1aa] block"
               style={{
                 transition: "opacity 220ms ease, transform 220ms ease",
                 transitionDelay: isOpen ? "160ms" : "0ms",
                 opacity: isOpen ? 1 : 0,
                 transform: isOpen ? "translateX(0)" : "translateX(-10px)",
               }}
             >
               Main
             </span>
          </div>
          <div className="flex flex-col gap-1 mb-8">
            {mainNav.map(renderNavItem)}
          </div>

          {/* MANAGEMENT segment */}
          <div className="mb-2 px-3">
             <span
               className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#71717a] dark:text-[#a1a1aa] block"
               style={{
                 transition: "opacity 220ms ease, transform 220ms ease",
                 transitionDelay: isOpen ? "200ms" : "0ms",
                 opacity: isOpen ? 1 : 0,
                 transform: isOpen ? "translateX(0)" : "translateX(-10px)",
               }}
             >
               Management
             </span>
          </div>
          <div className="flex flex-col gap-1">
            {managementNav.map(renderNavItem)}
          </div>
        </nav>

        {/* Sidebar Footer or Bottom Navigation could go here */}

      </motion.aside>

      <motion.div
        initial={false}
        animate={{ width: sidebarExpanded ? 256 : 72 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className="hidden md:block shrink-0"
      />
    </>
  );
}
