import { useEffect, useState } from "react";
import { Sparkles, Shield, Building2, X, Activity, } from "lucide-react";

export default function WelcomeBanner({ user, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const entryTimer = setTimeout(() => setVisible(true), 50);

    const handleDismiss = () => {
      setVisible(false);
      setTimeout(onClose, 300);
    };

    const clickTimer = setTimeout(() => {
      window.addEventListener("click", handleDismiss);
      window.addEventListener("touchstart", handleDismiss);
      window.addEventListener("keydown", handleDismiss);
    }, 150);

    const autoClose = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(clickTimer);
      clearTimeout(autoClose);
      window.removeEventListener("click", handleDismiss);
      window.removeEventListener("touchstart", handleDismiss);
      window.removeEventListener("keydown", handleDismiss);
    };
  }, [onClose]);

  if (!user) return null;

  const isSuperAdmin = user.role === "super_admin" || user.role === "admin";
  const displayName = isSuperAdmin 
    ? (user.name || "Super Admin") 
    : (user.careCenterName || user.name || "Care Center Partner");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className={`fixed top-5 right-5 z-50 transition-all duration-500 ease-out transform cursor-pointer select-none ${visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-6 opacity-0 scale-95"}`}>
      <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-slate-950/95 p-5 text-white shadow-2xl shadow-teal-500/20 backdrop-blur-xl ring-1 ring-white/10 w-96 hover:border-teal-400/50 transition-colors">
        
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />

        <button 
          onClick={(e) => { e.stopPropagation(); setVisible(false); setTimeout(onClose, 300); }}
          className="absolute top-3.5 right-3.5 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-lg shadow-teal-500/30">
            {isSuperAdmin ? <Shield className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
            </span>
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-400">
              <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{greeting}</span>
            </div>

            <h3 className="mt-0.5 font-display text-base font-extrabold text-white truncate">
              {displayName}
            </h3>

            <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">
              {isSuperAdmin 
                ? "Full administrative control is active. All live centers synced."
                : "Your facility dashboard is ready. Manage requisitions & inventory seamlessly."}
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/10 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Activity className="h-3 w-3 animate-pulse" />
                <span>System Online</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal"></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}