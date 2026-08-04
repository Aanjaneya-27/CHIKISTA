import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, Trash2, CheckCircle2, XCircle, X } from "lucide-react";

function statusStyle(status) {
  switch (status) {
    case "Active":
    case "Delivered": return { wrap: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" };
    case "Pending":
    case "Pending Dispatch": return { wrap: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" };
    case "Overdue": return { wrap: "bg-rose-50 text-rose-700 ring-rose-600/20", dot: "bg-rose-500" };
    case "Returned": return { wrap: "bg-slate-100 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" };
    case "Dispatched": return { wrap: "bg-indigo-50 text-indigo-700 ring-indigo-600/20", dot: "bg-indigo-500" };
    default: return { wrap: "bg-slate-100 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" };
  }
}

export function StatusBadge({ status, glow = false }) {
  const s = statusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s.wrap}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${glow ? "pulse-dot" : ""}`} />
      {status}
    </span>
  );
}

export function Field({ label, required, error, children, hint }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 flex items-center gap-1 text-xs font-medium text-rose-500"><AlertCircle className="h-3 w-3" /> {error}</p>}
    </div>
  );
}

const inputBase = "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400";

export function TextInput({ error, className = "", ...props }) {
  return <input {...props} className={`${inputBase} ${error ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-teal-500"} ${className}`} />;
}

export function Select({ error, className = "", children, ...props }) {
  return <select {...props} className={`${inputBase} appearance-none pr-8 ${error ? "border-rose-300" : "border-slate-200 focus:border-teal-500"} ${className}`}>{children}</select>;
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button {...props} className={`inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 active:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button {...props} className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 ${className}`}>
      {children}
    </button>
  );
}

export function IconAction({ title, onClick, tone = "slate", children }) {
  const tones = {
    slate: "hover:bg-slate-100 text-slate-500 hover:text-slate-700",
    teal: "hover:bg-teal-50 text-slate-500 hover:text-teal-600",
    rose: "hover:bg-rose-50 text-slate-500 hover:text-rose-600",
  };
  return (
    <button title={title} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-lg transition ${tones[tone]}`}>
      {children}
    </button>
  );
}

export function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-rose-50">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
        </div>
        <h3 className="font-display text-base font-bold text-slate-800">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-500">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
          <button onClick={onConfirm} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

let toastCallback = null;

// eslint-disable-next-line react-refresh/only-export-components
export const toast = {
  success: (message) => toastCallback && toastCallback({ type: "success", message }),
  error: (message) => toastCallback && toastCallback({ type: "error", message }),
};

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastCallback = (newToast) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...newToast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000); // 3 seconds timeout
    };
    return () => { toastCallback = null; };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl transition-all fade-slide-up pointer-events-auto ${
          t.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"
        }`}>
          {t.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" />}
          <p className="text-sm font-bold">{t.message}</p>
          <button onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))} className="ml-2 text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}