import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useFacultyAuth } from "../../context/FacultyAuthContext";
import { ShieldCheck, ArrowRight, Eye, EyeOff, ChevronLeft } from "lucide-react";

export default function FacultyLoginPage() {
  const { login, isLoggedIn } = useFacultyAuth();
  const [, navigate] = useLocation();

  const [code, setCode]       = useState("");
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Navigate only AFTER React has processed the isLoggedIn state update
  useEffect(() => {
    if (isLoggedIn) navigate("/faculty/dashboard");
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 10 || !/^\d+$/.test(code)) {
      setError("Faculty code must be exactly 10 digits.");
      triggerShake();
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(code);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Invalid code.");
      triggerShake();
    }
    // Navigation is handled by the useEffect above
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(160deg,#0F172A 0%,#1E3A5F 60%,#0F172A 100%)" }}>

      {/* Back to student portal */}
      <button
        onClick={() => navigate("/student/login")}
        className="absolute top-5 left-5 flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white/80 transition-colors"
      >
        <ChevronLeft size={14} /> Student Portal
      </button>

      {/* Glassmorphism card */}
      <div
        className="w-full max-w-sm rounded-3xl p-8"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 6px 20px rgba(59,130,246,0.4)" }}
          >
            <ShieldCheck size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-extrabold text-base leading-tight">Faculty Portal</p>
            <p className="text-white/40 text-[10px] font-medium">BigBrains · Sphoorthy Engg College</p>
          </div>
        </div>

        <h1 className="text-white font-extrabold text-2xl mb-1">Welcome, Faculty! 👋</h1>
        <p className="text-white/40 text-xs mb-7 leading-relaxed">
          Enter your unique 10-digit faculty access code to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code input */}
          <div>
            <label className="block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">
              Faculty Access Code
            </label>
            <div
              className={`flex items-center gap-2 rounded-2xl px-4 transition-all ${shake ? "animate-[shake_0.4s_ease]" : ""}`}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: error ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.12)",
              }}
            >
              <input
                ref={inputRef}
                type={show ? "text" : "password"}
                value={code}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setCode(v);
                  if (error) setError("");
                }}
                placeholder="••••••••••"
                maxLength={10}
                inputMode="numeric"
                className="flex-1 bg-transparent py-3.5 text-white font-mono text-lg tracking-widest placeholder:text-white/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {/* Progress dots */}
              <div className="flex gap-0.5 shrink-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width: 4, height: 4,
                      background: i < code.length ? "#3B82F6" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-[10px] font-semibold mt-1.5 ml-1">{error}</p>
            )}
            <p className="text-white/25 text-[10px] mt-1.5 ml-1">
              {code.length}/10 digits entered
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || code.length !== 10}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg,#3B82F6,#0EA5E9)",
              boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
            }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Access Faculty Portal <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        {/* Hint */}
        <div className="mt-6 rounded-xl p-3" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <p className="text-[10px] text-blue-300/70 leading-relaxed">
            <span className="font-bold text-blue-300">Demo codes:</span> Try <span className="font-mono">1234567890</span> (Admin) or any 10-digit number for guest access.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-white/20 text-[10px] text-center">
        BigBrains · Startup by Jashwanth &amp; Team · Sphoorthy Engineering College
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
