import { useState } from "react";
import { HeartPulse, Lock, User, ArrowRight } from "lucide-react";
import { PrimaryButton, TextInput, Field } from "../components/UiComponents";
import API from "../utils/api";

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter ID/Mobile Number and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/users/login", {
        identifier: identifier.trim(),
        password: password.trim()
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user.role, response.data.user);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 font-body">

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl" />

      <style>{`
        @keyframes heartbeat {
          0%   { transform: scale(1); }
          14%  { transform: scale(1.3); }
          28%  { transform: scale(1); }
          42%  { transform: scale(1.3); }
          70%  { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes heartbeatRing {
          0%   { transform: scale(1); opacity: 0.55; }
          70%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .heartbeat-icon {
          animation: heartbeat 1.8s ease-in-out infinite;
        }
        .heartbeat-ring {
          animation: heartbeatRing 1.8s ease-out infinite;
        }
      `}</style>

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-teal-900/10 border border-slate-100">

        {/* Teal Header */}
        <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 px-8 py-10 text-center">
          <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center">
            {/* Pulsing rings behind the icon */}
            <span className="heartbeat-ring absolute inset-0 rounded-2xl bg-white/40" />
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner ring-1 ring-white/30">
              <HeartPulse className="heartbeat-icon h-8 w-8 text-white drop-shadow-sm" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">Chikitsa</h1>
          <p className="mt-1 text-sm font-medium text-teal-100">
            Rental Master Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-600 border border-rose-200">
                {error}
              </div>
            )}

            {/* Login Identifier */}
            <Field label="User ID / Mobile Number">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  type="text"
                  required
                  placeholder="Superadmin ID or 10-digit Mobile"
                  className="pl-9"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </Field>

            {/* Password / Passcode */}
            <Field label="Password / Passcode">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  type="password"
                  required
                  placeholder="Password or Last 4 Digits of Mobile"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </Field>

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full justify-center py-2.5 mt-2 text-base cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? "Authenticating..." : "Sign In"} <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
          </form>
        </div>

      </div>
    </div>
  );
}
