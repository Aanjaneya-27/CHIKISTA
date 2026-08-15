// import { useState, useRef, useEffect, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { HeartPulse, ClipboardList, Database, ChevronRight, Bell, Menu, User, LogOut, ChevronDown, X, CheckCircle2, AlertTriangle, Trash2, CheckCheck } from "lucide-react";
// import { ROLES } from "../../data/MockData";

// export function Sidebar({ role, mobileOpen, setMobileOpen, unreadCount, onOpenNotifications }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const items = [
//     { key: "/rental", label: "Rental Master", icon: ClipboardList, show: true },
//     { key: "/master", label: "Master Info", icon: Database, show: role === "super_admin" },
//   ];

//   return (
//     <>
//       <style>{`
//         @keyframes heartbeat {
//           0%, 100% { transform: scale(1); }
//           15% { transform: scale(1.3); }
//           30% { transform: scale(1); }
//           45% { transform: scale(1.2); }
//           60% { transform: scale(1); }
//         }
//         @keyframes heartbeat-glow {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.5); }
//           15% { box-shadow: 0 0 0 6px rgba(20, 184, 166, 0.15); }
//           30% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); }
//           45% { box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1); }
//           60% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
//         }
//         @keyframes heartbeat-color {
//           0%, 100% { background-color: #14b8a6; }
//           15% { background-color: #2dd4bf; }
//           30% { background-color: #14b8a6; }
//           45% { background-color: #5eead4; }
//           60% { background-color: #14b8a6; }
//         }
//         .animate-heartbeat {
//           animation: heartbeat 1.4s ease-in-out infinite;
//           transform-origin: center;
//         }
//         .heartbeat-wrapper {
//           animation: heartbeat-glow 1.4s ease-in-out infinite, heartbeat-color 1.4s ease-in-out infinite;
//         }
//       `}</style>

//       {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
//       <aside className={`fixed z-50 flex h-full w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-200 will-change-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
//         <button onClick={() => { navigate("/dashboard"); setMobileOpen(false); }} className={`flex w-full items-center gap-2.5 border-b px-5 py-5 text-left transition ${location.pathname === "/dashboard" ? "border-teal-500/30 bg-teal-500/10" : "border-white/10 hover:bg-white/5"}`}>
//           <div className="heartbeat-wrapper grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-lg shadow-teal-500/30">
//             <HeartPulse className="h-5 w-5 text-white animate-heartbeat" />
//           </div>
//           <div>
//             <p className="font-display text-sm font-extrabold leading-tight text-white">Chikitsa</p>
//             <p className="text-xs font-medium tracking-wide text-teal-400">RENTAL MASTER</p>
//           </div>
//         </button>

//         <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
//           <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Menu</p>
//           {items.filter((i) => i.show).map((item) => {
//             const Icon = item.icon;
//             const active = location.pathname.includes(item.key);
//             return (
//               <button key={item.key} onClick={() => { navigate(item.key); setMobileOpen(false); }} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${active ? "bg-teal-500/15 text-teal-300 ring-1 ring-inset ring-teal-500/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
//                 <Icon className={`h-4 w-4 ${active ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`} />
//                 <span className="flex-1 text-left">{item.label}</span>
//                 {active && <ChevronRight className="h-3.5 w-3.5 text-teal-400" />}
//               </button>
//             );
//           })}

//           <div className="my-3 border-t border-white/10" />

//           <button onClick={() => { onOpenNotifications(); setMobileOpen(false); }} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white cursor-pointer">
//             <Bell className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
//             <span className="flex-1 text-left">Notifications</span>
//             {unreadCount > 0 && <span className="grid h-5 place-items-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white" style={{ minWidth: 20 }}>{unreadCount}</span>}
//           </button>
//         </nav>
//       </aside>
//     </>
//   );
// }

// export function Topbar({ role, setMobileOpen, unreadCount, onOpenNotifications, onLogout }) {
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
//   const profileMenuRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate(); 
  
//   // 🟢 Live user read from localStorage
//   const loggedUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);

//   const isCareCenter = (role === "care_center") || (loggedUser?.role === "care_center");
//   const isSuperAdmin = (role === "super_admin" || role === "admin") || (loggedUser?.role === "super_admin");

//   const displayName = isCareCenter 
//     ? (loggedUser?.careCenterName || loggedUser?.name || "Care Center")
//     : isSuperAdmin 
//     ? (loggedUser?.name || "Super Admin")
//     : (loggedUser?.name || "User");

//   const displayRole = isCareCenter ? "Care Center" : isSuperAdmin ? "Super Admin" : (ROLES[role]?.label || role || "User");

//   const avatarInitial = displayName.trim().charAt(0).toUpperCase();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setProfileMenuOpen(false);
//       }
//     };

//     if (profileMenuOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [profileMenuOpen]);

//   const getTitle = () => {
//     if (location.pathname.includes("/dashboard")) return "Admin Dashboard";
//     if (location.pathname.includes("/rental")) return "Rental Master";
//     if (location.pathname.includes("/master")) return "Master Info";
//     if (location.pathname.includes("/profile")) return "Account Settings"; 
//     return "Chikitsa";
//   };

//   return (
//     <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6">
//       <div className="flex items-center gap-3">
//         <button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 lg:hidden cursor-pointer">
//           <Menu className="h-4 w-4" />
//         </button>
//         <div>
//           <h1 className="font-display text-lg font-extrabold text-slate-800 sm:text-xl">{getTitle()}</h1>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 sm:gap-3">
//         <button onClick={onOpenNotifications} className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 cursor-pointer">
//           <Bell className="h-4 w-4" />
//           {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}
//         </button>

//         <div className="relative" ref={profileMenuRef}>
//           <button 
//             onClick={() => setProfileMenuOpen((v) => !v)} 
//             className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-slate-50 cursor-pointer"
//           >
//             <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-600 text-xs font-bold text-white uppercase shadow-sm">
//               {avatarInitial}
//             </div>
//             <div className="hidden text-left sm:block max-w-[140px]">
//               <p className="text-xs font-semibold text-slate-700 leading-none truncate">{displayName}</p>
//               <p className="mt-1 text-[11px] text-slate-400 leading-none">{displayRole}</p>
//             </div>
//             <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} />
//           </button>

//           {profileMenuOpen && (
//             <div className="fade-slide-up absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
//               <div className="border-b border-slate-100 px-3.5 py-3 bg-slate-50/50">
//                 <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
//                 <p className="text-xs text-slate-400">{displayRole}</p>
//               </div>
              
//               <button 
//                 onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }} 
//                 className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 cursor-pointer"
//               >
//                 <User className="h-4 w-4 text-slate-400" /> Account Settings
//               </button>
              
//               <button 
//                 onClick={() => { setProfileMenuOpen(false); onLogout(); }} 
//                 className="flex w-full items-center gap-2.5 border-t border-slate-100 px-3.5 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 cursor-pointer"
//               >
//                 <LogOut className="h-4 w-4" /> Log Out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// function notifStyle(type) {
//   switch (type) {
//     case "warning": return { bg: "bg-amber-50", text: "text-amber-600", icon: AlertTriangle };
//     case "success": return { bg: "bg-emerald-50", text: "text-emerald-600", icon: CheckCircle2 };
//     default: return { bg: "bg-indigo-50", text: "text-indigo-600", icon: Bell };
//   }
// }

// export function NotificationsPanel({ open, onClose, notifications = [], onMarkRead, onMarkAllRead, onDeleteNotif }) {
//   const loggedUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);

//   const isCareCenterUser = loggedUser?.role === "care_center";
//   const myCenterId = loggedUser?.careCenterId || loggedUser?.id;
//   const myCenterName = (loggedUser?.careCenterName || loggedUser?.name || "").toLowerCase().trim();

//   const scopedNotifications = useMemo(() => {
//     if (!isCareCenterUser) return notifications;

//     return notifications.filter((n) => {
//       const nCcId = n.careCenterId || n.care_center_id || n.centerId;
//       const nCcName = (n.careCenterName || n.careCenter || n.centerName || "").toLowerCase().trim();
//       const nTitle = (n.title || "").toLowerCase();
//       const nMessage = (n.message || "").toLowerCase();

//       if (nCcId && myCenterId && String(nCcId) === String(myCenterId)) return true;
//       if (nCcName && myCenterName && (nCcName.includes(myCenterName) || myCenterName.includes(nCcName))) return true;
//       if (myCenterName && (nTitle.includes(myCenterName) || nMessage.includes(myCenterName))) return true;
//       if (!nCcId && !nCcName && n.role === "care_center") return true;

//       return false;
//     });
//   }, [notifications, isCareCenterUser, myCenterId, myCenterName]);

//   if (!open) return null;
//   const unreadCount = scopedNotifications.filter((n) => !n.read).length;

//   return (
//     <div className="fixed inset-0 z-50">
//       <div className="fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
//       <div className="slide-in-right absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
        
//         {/* Panel Header */}
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//           <div>
//             <h2 className="font-display text-base font-bold text-slate-800">Notifications</h2>
//             <p className="text-xs text-slate-400">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
//           </div>
//           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {unreadCount > 0 && (
//           <div className="flex justify-between items-center border-b border-slate-100 bg-slate-50/50 px-5 py-2">
//             <span className="text-[11px] font-semibold text-slate-400">{unreadCount} New Alerts</span>
//             <button 
//               onClick={onMarkAllRead} 
//               className="flex items-center gap-1 text-xs font-bold text-teal-600 transition hover:text-teal-700 cursor-pointer"
//             >
//               <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
//             </button>
//           </div>
//         )}

//         <div className="smooth-scroll min-h-0 flex-1 overflow-y-auto">
//           {scopedNotifications.length === 0 ? (
//             <div className="grid h-full place-items-center px-6 text-center">
//               <div>
//                 <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100">
//                   <Bell className="h-5 w-5 text-slate-400" />
//                 </div>
//                 <p className="mt-3 text-sm font-semibold text-slate-500">No notifications</p>
//                 <p className="text-xs text-slate-400 mt-1">New updates will appear here</p>
//               </div>
//             </div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {scopedNotifications.map((n) => {
//                 const s = notifStyle(n.type);
//                 const Icon = s.icon;
//                 return (
//                   <div 
//                     key={n.id} 
//                     className={`group relative flex items-start justify-between gap-3 px-5 py-4 transition hover:bg-slate-50/80 ${!n.read ? "bg-teal-50/30" : ""}`}
//                   >
//                     <div 
//                       onClick={() => onMarkRead && onMarkRead(n.id)} 
//                       className="flex flex-1 items-start gap-3 cursor-pointer min-w-0"
//                     >
//                       <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${s.bg} ${s.text}`}>
//                         <Icon className="h-4 w-4" />
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center gap-2">
//                           <p className="truncate text-sm font-semibold text-slate-700">{n.title}</p>
//                           {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />}
//                         </div>
//                         <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{n.message}</p>
//                         <p className="mt-1 text-[11px] font-medium text-slate-400">{n.time}</p>
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDeleteNotif && onDeleteNotif(n.id);
//                       }}
//                       title="Delete notification"
//                       className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 cursor-pointer"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export function Footer() {
//   return (
//     <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-4 sm:px-6 text-slate-500">
//       <div className="flex flex-col items-center justify-between gap-2.5 text-xs sm:flex-row">
//         <div className="flex items-center gap-1.5">
//           <span className="font-bold text-slate-700">
//             © 2026{" "}
//             <a
//               href="https://evoquesys.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-teal-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
//             >
//               Evoquesys
//             </a>
//             .
//           </span>
//           <span className="text-slate-400">All rights reserved.</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 rounded-full bg-teal-50 px-2.5 py-1 border border-teal-100">
//             <span className="relative flex h-2 w-2">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
//               <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
//             </span>
//             <span className="text-[11px] font-semibold text-teal-700">Chikitsa Live System</span>
//           </div>
//           <span className="hidden text-slate-300 sm:inline">|</span>
//           <span className="hidden font-medium text-slate-400 sm:inline">Healthcare Logistics Platform</span>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeartPulse, ClipboardList, Database, ChevronRight, Bell, Menu, User, LogOut, ChevronDown, X, CheckCircle2, AlertTriangle, Trash2, CheckCheck } from "lucide-react";
import { ROLES, DEMO_USER_NAMES } from "../../data/MockData";

export function Sidebar({ role, mobileOpen, setMobileOpen, unreadCount, onOpenNotifications }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/rental", label: "Rental Master", icon: ClipboardList, show: true },
    { key: "/master", label: "Master Info", icon: Database, show: role === "super_admin" },
  ];

  return (
    <>
      <style>{`
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.3); } 30% { transform: scale(1); } 45% { transform: scale(1.2); } 60% { transform: scale(1); } }
        @keyframes heartbeat-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.5); } 15% { box-shadow: 0 0 0 6px rgba(20, 184, 166, 0.15); } 30% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); } 45% { box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1); } 60% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); } }
        @keyframes heartbeat-color { 0%, 100% { background-color: #14b8a6; } 15% { background-color: #2dd4bf; } 30% { background-color: #14b8a6; } 45% { background-color: #5eead4; } 60% { background-color: #14b8a6; } }
        .animate-heartbeat { animation: heartbeat 1.4s ease-in-out infinite; transform-origin: center; }
        .heartbeat-wrapper { animation: heartbeat-glow 1.4s ease-in-out infinite, heartbeat-color 1.4s ease-in-out infinite; }
      `}</style>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed z-50 flex h-full w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-200 will-change-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => { navigate("/dashboard"); setMobileOpen(false); }} className={`flex w-full items-center gap-2.5 border-b px-5 py-5 text-left transition ${location.pathname === "/dashboard" ? "border-teal-500/30 bg-teal-500/10" : "border-white/10 hover:bg-white/5"}`}>
          <div className="heartbeat-wrapper grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-lg shadow-teal-500/30">
            <HeartPulse className="h-5 w-5 text-white animate-heartbeat" />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold leading-tight text-white">Chikitsa</p>
            <p className="text-xs font-medium tracking-wide text-teal-400">RENTAL MASTER</p>
          </div>
        </button>

        <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Menu</p>
          {items.filter((i) => i.show).map((item) => {
            const Icon = item.icon;
            const active = location.pathname.includes(item.key);
            return (
              <button key={item.key} onClick={() => { navigate(item.key); setMobileOpen(false); }} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${active ? "bg-teal-500/15 text-teal-300 ring-1 ring-inset ring-teal-500/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon className={`h-4 w-4 ${active ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 text-teal-400" />}
              </button>
            );
          })}

          <div className="my-3 border-t border-white/10" />

          <button onClick={() => { onOpenNotifications(); setMobileOpen(false); }} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white cursor-pointer">
            <Bell className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
            <span className="flex-1 text-left">Notifications</span>
            {unreadCount > 0 && <span className="grid h-5 place-items-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white" style={{ minWidth: 20 }}>{unreadCount}</span>}
          </button>
        </nav>
      </aside>
    </>
  );
}

export function Topbar({ role, setMobileOpen, unreadCount, onOpenNotifications, onLogout }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); 
  
  const loggedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isCareCenter = (role === "care_center") || (loggedUser?.role === "care_center");
  const isSuperAdmin = (role === "super_admin" || role === "admin") || (loggedUser?.role === "super_admin");

  const displayName = isCareCenter 
    ? (loggedUser?.careCenterName || loggedUser?.name || "Care Center")
    : isSuperAdmin 
    ? (loggedUser?.name || "Super Admin")
    : (loggedUser?.name || DEMO_USER_NAMES[role] || "User");

  const displayRole = isCareCenter ? "Care Center" : isSuperAdmin ? "Super Admin" : (ROLES[role]?.label || role || "User");
  const avatarInitial = displayName.trim().charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  const getTitle = () => {
    if (location.pathname.includes("/dashboard")) return "Admin Dashboard";
    if (location.pathname.includes("/rental")) return "Rental Master";
    if (location.pathname.includes("/master")) return "Master Info";
    if (location.pathname.includes("/profile")) return "Account Settings"; 
    return "Chikitsa";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 lg:hidden cursor-pointer">
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-display text-lg font-extrabold text-slate-800 sm:text-xl">{getTitle()}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onOpenNotifications} className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 cursor-pointer">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}
        </button>

        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setProfileMenuOpen((v) => !v)} 
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-slate-50 cursor-pointer"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-600 text-xs font-bold text-white uppercase shadow-sm">
              {avatarInitial}
            </div>
            <div className="hidden text-left sm:block max-w-[140px]">
              <p className="text-xs font-semibold text-slate-700 leading-none truncate">{displayName}</p>
              <p className="mt-1 text-[11px] text-slate-400 leading-none">{displayRole}</p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {profileMenuOpen && (
            <div className="fade-slide-up absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
              <div className="border-b border-slate-100 px-3.5 py-3 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
                <p className="text-xs text-slate-400">{displayRole}</p>
              </div>
              
              <button 
                onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }} 
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 cursor-pointer"
              >
                <User className="h-4 w-4 text-slate-400" /> Account Settings
              </button>
              
              <button 
                onClick={() => { setProfileMenuOpen(false); onLogout(); }} 
                className="flex w-full items-center gap-2.5 border-t border-slate-100 px-3.5 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function notifStyle(type) {
  switch (type) {
    case "warning": return { bg: "bg-amber-50", text: "text-amber-600", icon: AlertTriangle };
    case "success": return { bg: "bg-emerald-50", text: "text-emerald-600", icon: CheckCircle2 };
    default: return { bg: "bg-teal-50", text: "text-teal-600", icon: Bell };
  }
}

export function NotificationsPanel({ open, onClose, notifications = [], onMarkRead, onMarkAllRead, onDeleteNotif }) {
  const loggedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isCareCenterUser = loggedUser?.role === "care_center";
  const myCenterId = (loggedUser?.careCenterId || loggedUser?.id || "").toString().trim().toLowerCase();
  const myCenterName = (loggedUser?.careCenterName || loggedUser?.name || "").toLowerCase().trim();

  // 🔔 Reliable Filter: Super Admin gets all; Care Center gets center-relevant notifications
  const scopedNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    if (!isCareCenterUser) return notifications;

    return notifications.filter((n) => {
      const nCcId = (n.care_center_id || n.careCenterId || n.centerId || "").toString().trim().toLowerCase();
      const nCcName = (n.careCenterName || n.careCenter || n.centerName || "").toLowerCase().trim();
      const nText = `${n.title || ""} ${n.message || ""}`.toLowerCase();

      const idMatch = nCcId && myCenterId && (nCcId === myCenterId || nCcId.replace(/\D/g, "") === myCenterId.replace(/\D/g, ""));
      const nameMatch = nCcName && myCenterName && (nCcName.includes(myCenterName) || myCenterName.includes(nCcName));
      const textMatch = myCenterName && nText.includes(myCenterName);

      // Agar koi specific center tag na ho toh bhi user ko alert allow karein
      return idMatch || nameMatch || textMatch || (!nCcId && !nCcName);
    });
  }, [notifications, isCareCenterUser, myCenterId, myCenterName]);

  if (!open) return null;
  const unreadCount = scopedNotifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="slide-in-right absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-slate-800">Notifications</h2>
            <p className="text-xs text-slate-400">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="flex justify-between items-center border-b border-slate-100 bg-slate-50/50 px-5 py-2">
            <span className="text-[11px] font-semibold text-slate-400">{unreadCount} New Alerts</span>
            <button 
              onClick={onMarkAllRead} 
              className="flex items-center gap-1 text-xs font-bold text-teal-600 transition hover:text-teal-700 cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
            </button>
          </div>
        )}

        <div className="smooth-scroll min-h-0 flex-1 overflow-y-auto">
          {scopedNotifications.length === 0 ? (
            <div className="grid h-full place-items-center px-6 text-center py-16">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100">
                  <Bell className="h-5 w-5 text-slate-400" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-500">No notifications</p>
                <p className="text-xs text-slate-400 mt-1">Updates will appear here</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {scopedNotifications.map((n) => {
                const s = notifStyle(n.type);
                const Icon = s.icon;
                return (
                  <div 
                    key={n.id} 
                    className={`group relative flex items-start justify-between gap-3 px-5 py-4 transition hover:bg-slate-50/80 ${!n.read ? "bg-teal-50/30" : ""}`}
                  >
                    <div 
                      onClick={() => onMarkRead && onMarkRead(n.id)} 
                      className="flex flex-1 items-start gap-3 cursor-pointer min-w-0"
                    >
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${s.bg} ${s.text}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-700">{n.title}</p>
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{n.message}</p>
                        <p className="mt-1 text-[11px] font-medium text-slate-400">{n.time || n.created_at || "Just now"}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotif && onDeleteNotif(n.id);
                      }}
                      title="Delete notification"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-4 sm:px-6 text-slate-500">
      <div className="flex flex-col items-center justify-between gap-2.5 text-xs sm:flex-row">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-700">
            © 2026{" "}
            <a
              href="https://evoquesys.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
            >
              Evoquesys
            </a>
            .
          </span>
          <span className="text-slate-400">All rights reserved.</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-teal-50 px-2.5 py-1 border border-teal-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-teal-700">Chikitsa Live System</span>
          </div>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <span className="hidden font-medium text-slate-400 sm:inline">Healthcare Logistics Platform</span>
        </div>
      </div>
    </footer>
  );
}