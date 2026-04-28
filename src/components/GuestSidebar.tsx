"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ManualInstallButton } from "@/components/ManualInstallButton";

interface GuestSidebarProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (v: boolean) => void;
  sidebarMobileOpen: boolean;
  setSidebarMobileOpen: (v: boolean) => void;
}

export function GuestSidebar({
  sidebarExpanded,
  setSidebarExpanded,
  sidebarMobileOpen,
  setSidebarMobileOpen,
}: GuestSidebarProps) {
  const pathname = usePathname() || "/guest-dashboard";
  const isOpen = sidebarExpanded || sidebarMobileOpen;

  const mainNav = [
    { icon: "dashboard", label: "Dashboard", href: "/guest-dashboard" },
  ];

  const servicesNav = [
    { icon: "chat", label: "Messages", href: "/guest-messages" },
    { icon: "map", label: "Hotel Map", href: "/guest-map" },
    { icon: "campaign", label: "Report Issue", href: "/rapid-reporting" },
    { icon: "report_problem", label: "Complaints", href: "/guest-complaints" },
  ];

  const renderNavItem = (n: { icon: string; label: string; href: string }) => {
    const isActive = pathname === n.href;
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

        <span
          className={`whitespace-nowrap text-[13px] font-semibold tracking-tight transition-all duration-500 ease-out flex-1 ${
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none invisible"
          }`}
          style={{ transitionDelay: isOpen ? '0.2s' : '0s' }}
        >
          {n.label}
        </span>
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

      <motion.aside
        initial={false}
        animate={{ 
          x: typeof window !== 'undefined' && window.innerWidth < 768 ? (sidebarMobileOpen ? 0 : -280) : 0,
          width: sidebarMobileOpen ? 280 : (sidebarExpanded ? 256 : 72)
        }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-white/95 dark:bg-[#0a0a0a]/98 backdrop-blur-xl
          border-r border-[#e4e4e7]/50 dark:border-[#1a1a1a]
          shadow-[2px_0_16px_rgba(0,0,0,0.04)] dark:shadow-[8px_0_32px_rgba(0,0,0,0.4)]
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
        <div className="md:hidden flex items-center justify-end p-4 border-b border-slate-50 dark:border-[#232845]">
           <button onClick={() => setSidebarMobileOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e2235] text-slate-500 dark:text-slate-400 flex items-center justify-center">
             <span className="material-symbols-outlined">close</span>
           </button>
        </div>

        <nav className="w-64 flex-1 flex flex-col gap-0 p-4 pt-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="mb-1.5 px-3 h-5 overflow-hidden">
             <span className={`text-[10px] font-bold uppercase tracking-[0.28em] text-[#a1a1aa] dark:text-[#52525b] transition-all duration-500 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{ transitionDelay: isOpen ? '0.2s' : '0s' }}>
               Main
             </span>
          </div>
          <div className="flex flex-col gap-1.5 mb-10">
            {mainNav.map(renderNavItem)}
          </div>

          <div className="mb-1.5 px-3 h-5 overflow-hidden">
             <span className={`text-[10px] font-bold uppercase tracking-[0.28em] text-[#a1a1aa] dark:text-[#52525b] transition-all duration-500 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{ transitionDelay: isOpen ? '0.25s' : '0s' }}>
               Services
             </span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            {servicesNav.map(renderNavItem)}
          </div>
        </nav>

        <div className={`mt-auto p-4 transition-all duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] border-t border-slate-50 dark:border-[#232845]/40 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isOpen ? '0.3s' : '0s' }}>
            <div className="mb-3">
               <ManualInstallButton />
            </div>
            
            <Link
              href="/guest-sos"
              className="relative flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-rose-500 hover:to-red-400 shadow-lg shadow-red-500/20 transition-all duration-300 overflow-hidden group"
            >
              <span className="material-symbols-outlined shrink-0 text-[24px] animate-pulse" style={{ fontVariationSettings: '"FILL" 1' }}>
                emergency_share
              </span>
              <span className="whitespace-nowrap text-[13px] font-black uppercase tracking-wider">
                Active SOS
              </span>
            </Link>
        </div>
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
