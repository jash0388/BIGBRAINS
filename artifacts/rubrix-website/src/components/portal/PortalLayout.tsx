import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Crown, Zap, FolderOpen, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { href: "/student/academics", icon: BookOpen,  label: "Academics",  bg: "#EEF2FF", ic: "#4F46E5" },
  { href: "/student/career",    icon: Crown,     label: "Career",     bg: "#F5F3FF", ic: "#7C3AED" },
  { href: "/student/practice",  icon: Zap,       label: "Practice",   bg: "#E0F9FF", ic: "#0284C7" },
  { href: "/student/resource",  icon: FolderOpen, label: "Resources", bg: "#ECFDF5", ic: "#059669" },
  { href: "/student/profile",   icon: User,      label: "Profile",    bg: "#FFF7ED", ic: "#EA580C" },
];

function NavItem({ href, icon: Icon, label, bg, ic }: typeof NAV[0]) {
  const [location] = useLocation();
  const active = location.startsWith(href);
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
        style={active
          ? { background: bg, boxShadow: `0 2px 8px ${ic}20` }
          : { background: "transparent" }
        }
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#F8FAFC"; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: active ? ic : "#F1F5F9" }}
        >
          <Icon size={15} strokeWidth={2.5} color={active ? "#fff" : "#94A3B8"} />
        </div>
        <span
          className="text-sm font-bold"
          style={{ color: active ? ic : "#64748B" }}
        >
          {label}
        </span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: ic }} />
        )}
      </div>
    </Link>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { student, logout } = useAuth();
  const [, navigate] = useLocation();
  const [location] = useLocation();

  const handleLogout = () => { logout(); navigate("/student/login"); };
  const initials = student
    ? (`${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`).toUpperCase() || "S"
    : "?";
  const current = NAV.find(n => location.startsWith(n.href));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F4F6FB", fontFamily: "'Sora', sans-serif" }}>

      {/* Sidebar */}
      <aside
        className="w-[220px] shrink-0 flex flex-col py-5 px-3 bg-white border-r border-slate-100"
        style={{ boxShadow: "2px 0 16px rgba(0,0,0,0.04)" }}
      >
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5 mb-6 px-1 cursor-pointer">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", boxShadow: "0 4px 12px #4F46E540" }}
            >
              <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                <rect x="3" y="3" width="11" height="11" rx="2.5" fill="white" />
                <rect x="18" y="3" width="11" height="11" rx="2.5" fill="white" opacity="0.45" />
                <rect x="3" y="18" width="11" height="11" rx="2.5" fill="white" opacity="0.45" />
                <rect x="18" y="18" width="11" height="11" rx="2.5" fill="white" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-800 leading-tight">DataNauts</p>
              <p className="text-[10px] text-slate-400 font-medium">Student Portal</p>
            </div>
          </div>
        </Link>

        {/* Student card */}
        {student && (
          <div className="mb-5 rounded-2xl p-3" style={{ background: "linear-gradient(135deg,#F0F4FF,#F5F0FF)", border: "1px solid #E0E7FF" }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-extrabold"
                style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", boxShadow: "0 4px 10px #4F46E540" }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 text-xs font-extrabold truncate">{student.fullName || student.rollNumber}</p>
                <p className="text-indigo-400 text-[9px] font-bold mt-0.5 truncate">{student.rollNumber}</p>
              </div>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {student.year && <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-white text-indigo-600 border border-indigo-100 shadow-sm">{student.year}</span>}
              {student.semester && <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-white text-emerald-600 border border-emerald-100 shadow-sm">SEM {student.semester}</span>}
            </div>
          </div>
        )}

        <div className="h-px bg-slate-100 mb-4" />

        {/* Nav */}
        <div className="flex flex-col gap-0.5 flex-1">
          {NAV.map(item => <NavItem key={item.href} {...item} />)}
        </div>

        <div className="h-px bg-slate-100 mt-4 mb-3" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 transition-all duration-150 w-full text-left"
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FFF1F2"; (e.currentTarget as HTMLButtonElement).style.color = "#E11D48"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8"; }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50">
            <LogOut size={14} strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0" style={{ background: "#F4F6FB" }}>

        {/* Topbar */}
        {student && (
          <div
            className="flex items-center justify-between px-6 py-3 bg-white shrink-0"
            style={{ borderBottom: "1px solid #EEF0FF", boxShadow: "0 2px 10px rgba(79,70,229,0.05)" }}
          >
            <div className="flex items-center gap-3">
              {current && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: current.ic, boxShadow: `0 4px 12px ${current.ic}40` }}
                >
                  <current.icon size={15} strokeWidth={2.5} color="#fff" />
                </div>
              )}
              <div>
                <p className="text-sm font-extrabold text-slate-800">{current?.label || "Portal"}</p>
                <p className="text-[10px] text-slate-400 font-medium">{student.college || "Sphoorthy Engineering College"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {student.branch && (
                <span className="hidden sm:flex text-[10px] font-bold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  {student.branch.includes("Data") ? "Data Science" : student.branch}
                </span>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600">Live</span>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Big Brains branding strip — frosted glass dark bar */}
        <div
          className="shrink-0 flex items-center justify-center gap-2.5 py-1.5 px-4"
          style={{
            background: "rgba(10,12,28,0.88)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span className="text-[9.5px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.38)" }}>Modified by</span>
          <span
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ background: "linear-gradient(90deg,#818CF8,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Big Brains
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>·</span>
          <span className="text-[9.5px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>Startup by</span>
          <span className="text-[10px] font-bold" style={{ color: "rgba(167,139,250,0.85)" }}>Jashwanth &amp; Team</span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>·</span>
          <span className="text-[9.5px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>Sphoorthy Engineering College</span>
        </div>
      </div>
    </div>
  );
}
