import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Crown, Zap, FolderOpen, User, LogOut, ClipboardList, ShieldCheck, Trophy, MoreHorizontal, X, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFacultyAuth } from "../../context/FacultyAuthContext";

const ADMIN_ROLLS = ["24N81A6758", "24N81A6786"];

const NAV = [
  { href: "/student/academics",   icon: BookOpen,      label: "Academics",   color: "#3B82F6", bg: "#EFF6FF", glow: "#3B82F620" },
  { href: "/student/career",      icon: Crown,         label: "Career",      color: "#EC4899", bg: "#FDF2F8", glow: "#EC489920" },
  { href: "/student/practice",    icon: Zap,           label: "Practice",    color: "#F59E0B", bg: "#FFFBEB", glow: "#F59E0B20" },
  { href: "/student/tests",       icon: ClipboardList, label: "Tests",       color: "#0EA5E9", bg: "#F0F9FF", glow: "#0EA5E920" },
  { href: "/student/leaderboard", icon: Trophy,        label: "Leaderboard", color: "#D97706", bg: "#FFFBEB", glow: "#D9770620" },
  { href: "/student/resource",    icon: FolderOpen,    label: "Resources",   color: "#10B981", bg: "#ECFDF5", glow: "#10B98120" },
  { href: "/student/profile",     icon: User,          label: "Profile",     color: "#06B6D4", bg: "#ECFEFF", glow: "#06B6D420" },
];

// 5 tabs shown in bottom bar; the rest go into "More"
const PRIMARY  = NAV.slice(0, 4); // Academics, Career, Practice, Tests
const PROFILE_TAB = NAV[6];       // Profile always last primary slot
const MORE_NAV = [NAV[4], NAV[5]]; // Leaderboard, Resources

/* ── Desktop sidebar item ───────────────────────────────────────── */
function SideNavItem({ href, icon: Icon, label, color, bg }: typeof NAV[0]) {
  const [location] = useLocation();
  const active = location.startsWith(href);
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
        style={active ? { background: bg } : { background: "transparent" }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#F8FAFC"; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: active ? color : "#F1F5F9" }}>
          <Icon size={15} strokeWidth={2.5} color={active ? "#fff" : "#94A3B8"} />
        </div>
        <span className="text-sm font-bold" style={{ color: active ? color : "#64748B" }}>{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      </div>
    </Link>
  );
}

/* ── Mobile bottom tab ──────────────────────────────────────────── */
function BottomTab({ href, icon: Icon, label, color, bg, onClose }: typeof NAV[0] & { onClose?: () => void }) {
  const [location] = useLocation();
  const active = location.startsWith(href);
  return (
    <Link href={href} onClick={onClose} className="flex-1">
      <div className="flex flex-col items-center justify-center w-full cursor-pointer select-none py-2">
        <div
          className="flex items-center justify-center rounded-2xl transition-all duration-200 mb-1"
          style={{ width: active ? 48 : 38, height: 30, background: active ? bg : "transparent" }}>
          <Icon size={active ? 19 : 18} strokeWidth={active ? 2.5 : 1.8} color={active ? color : "#94A3B8"} />
        </div>
        <span className="text-[10px] font-bold leading-none" style={{ color: active ? color : "#94A3B8" }}>
          {label}
        </span>
        {active && (
          <div className="w-1 h-1 rounded-full mt-1" style={{ background: color }} />
        )}
      </div>
    </Link>
  );
}

/* ── Layout ─────────────────────────────────────────────────────── */
export default function PortalLayout({ children }: { children: ReactNode }) {
  const { student, logout } = useAuth();
  const { login: facultyLogin } = useFacultyAuth();
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isAdmin = student ? ADMIN_ROLLS.includes(student.rollNumber) : false;

  const handleLogout = () => { logout(); navigate("/student/login"); };
  const handleAdminClick = () => { setMoreOpen(false); facultyLogin("1234567890"); navigate("/faculty/dashboard"); };

  const initials = student
    ? (`${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`).toUpperCase() || "S"
    : "?";
  const current = NAV.find(n => location.startsWith(n.href));

  // Check if the current route is in "More"
  const moreActive = MORE_NAV.some(n => location.startsWith(n.href));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F4F6FB", fontFamily: "'Sora', sans-serif" }}>

      {/* ═══════ DESKTOP SIDEBAR ═══════ */}
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col py-5 px-3 bg-white border-r border-slate-100"
        style={{ boxShadow: "2px 0 16px rgba(0,0,0,0.04)" }}>
        <Link href="/">
          <div className="flex items-center gap-2.5 mb-6 px-1 cursor-pointer">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 4px 12px #3B82F640" }}>
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

        {student && (
          <div className="mb-5 rounded-2xl p-3" style={{ background: "linear-gradient(135deg,#F0F9FF,#FFF0F6)", border: "1px solid #BFDBFE" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-extrabold"
                style={{ background: "linear-gradient(135deg,#3B82F6,#EC4899)", boxShadow: "0 4px 10px #3B82F640" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 text-xs font-extrabold truncate">{student.fullName || student.rollNumber}</p>
                <p className="text-blue-400 text-[9px] font-bold mt-0.5 truncate">{student.rollNumber}</p>
              </div>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {student.year && <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-white text-blue-600 border border-blue-100 shadow-sm">{student.year}</span>}
              {student.semester && <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-white text-emerald-600 border border-emerald-100 shadow-sm">SEM {student.semester}</span>}
              {isAdmin && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg shadow-sm"
                  style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", color: "white" }}>Admin</span>
              )}
            </div>
          </div>
        )}

        <div className="h-px bg-slate-100 mb-4" />
        <div className="flex flex-col gap-0.5 flex-1">
          {NAV.map(item => <SideNavItem key={item.href} {...item} />)}
        </div>
        <div className="h-px bg-slate-100 mt-4 mb-3" />

        {isAdmin && (
          <button onClick={handleAdminClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left mb-2 transition-all duration-150"
            style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)", border: "1.5px solid #BFDBFE" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#3B82F6,#0EA5E9)"; (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #3B82F6"; (e.currentTarget as HTMLButtonElement).querySelectorAll("span").forEach(s => { (s as HTMLSpanElement).style.color = "white"; }); }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#EFF6FF,#F0F9FF)"; (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #BFDBFE"; (e.currentTarget as HTMLButtonElement).querySelectorAll("span").forEach(s => { (s as HTMLSpanElement).style.color = ""; }); }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 3px 8px #3B82F640" }}>
              <ShieldCheck size={15} strokeWidth={2.5} color="white" />
            </div>
            <span className="text-sm font-extrabold text-blue-600">Admin Panel</span>
          </button>
        )}

        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 transition-all duration-150 w-full text-left"
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FFF1F2"; (e.currentTarget as HTMLButtonElement).style.color = "#E11D48"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8"; }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50">
            <LogOut size={14} strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </aside>

      {/* ═══════ CONTENT AREA ═══════ */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Mobile top header */}
        <header className="md:hidden flex items-center justify-between px-4 shrink-0 bg-white"
          style={{ height: 58, borderBottom: "1px solid #F1F5F9", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: current ? `linear-gradient(135deg,${current.color},${current.color}cc)` : "linear-gradient(135deg,#3B82F6,#0EA5E9)",
                boxShadow: current ? `0 3px 10px ${current.glow}` : "none",
              }}>
              {current ? <current.icon size={15} strokeWidth={2.5} color="#fff" /> : (
                <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4">
                  <rect x="3" y="3" width="11" height="11" rx="2.5" fill="white" />
                  <rect x="18" y="3" width="11" height="11" rx="2.5" fill="white" opacity="0.45" />
                  <rect x="3" y="18" width="11" height="11" rx="2.5" fill="white" opacity="0.45" />
                  <rect x="18" y="18" width="11" height="11" rx="2.5" fill="white" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-800 leading-tight">{current?.label || "Student Portal"}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">{student?.college || "Sphoorthy Engineering College"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={handleAdminClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white text-[10px] font-extrabold"
                style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 3px 10px #3B82F640" }}>
                <ShieldCheck size={11} strokeWidth={2.5} />
                Admin
              </button>
            )}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-600">Live</span>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-extrabold shrink-0"
              style={{ background: "linear-gradient(135deg,#3B82F6,#EC4899)" }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Desktop top bar */}
        {student && (
          <div className="hidden md:flex items-center justify-between px-6 py-3 bg-white shrink-0"
            style={{ borderBottom: "1px solid #F1F5F9", boxShadow: "0 2px 10px rgba(59,130,246,0.05)" }}>
            <div className="flex items-center gap-3">
              {current && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: current.color, boxShadow: `0 4px 12px ${current.glow}` }}>
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

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}>
            {children}
          </div>
        </main>

        {/* Desktop branding strip */}
        <div className="hidden md:flex shrink-0 items-center justify-center gap-2.5 py-1.5 px-4"
          style={{ background: "rgba(10,12,28,0.88)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-[9.5px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.38)" }}>Modified by</span>
          <span className="text-[10px] font-black tracking-widest uppercase"
            style={{ background: "linear-gradient(90deg,#3B82F6,#0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Big Brains</span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>·</span>
          <span className="text-[9.5px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>Startup by</span>
          <span className="text-[10px] font-bold" style={{ color: "rgba(96,165,250,0.9)" }}>Jashwanth &amp; Team</span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>·</span>
          <span className="text-[9.5px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>Sphoorthy Engineering College</span>
        </div>

        {/* ═══════ MOBILE BOTTOM NAV ═══════ */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white"
          style={{
            borderTop: "1px solid #EEF2FF",
            boxShadow: "0 -8px 32px rgba(59,130,246,0.10)",
            paddingBottom: "env(safe-area-inset-bottom)",
            height: "calc(64px + env(safe-area-inset-bottom))",
          }}>
          <div className="flex items-stretch h-16">

            {/* Primary 4 tabs */}
            {PRIMARY.map(item => {
              const active = location.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <div className="flex flex-col items-center justify-center h-16 gap-0.5 relative cursor-pointer select-none">
                    {active && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{ background: item.color }} />
                    )}
                    <div className="flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200"
                      style={{ background: active ? item.bg : "transparent" }}>
                      <Icon size={18} strokeWidth={active ? 2.5 : 1.8} color={active ? item.color : "#94A3B8"} />
                    </div>
                    <span className="text-[10px] font-bold"
                      style={{ color: active ? item.color : "#94A3B8" }}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* "More" button */}
            <button className="flex-1 flex flex-col items-center justify-center h-16 gap-0.5 relative cursor-pointer select-none"
              onClick={() => setMoreOpen(true)}>
              {moreActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-slate-400" />
              )}
              <div className="flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200"
                style={{ background: moreActive ? "#F1F5F9" : "transparent" }}>
                <MoreHorizontal size={18} strokeWidth={1.8} color={moreActive ? "#64748B" : "#94A3B8"} />
              </div>
              <span className="text-[10px] font-bold" style={{ color: moreActive ? "#64748B" : "#94A3B8" }}>More</span>
            </button>

            {/* Profile tab */}
            {(() => {
              const active = location.startsWith(PROFILE_TAB.href);
              const Icon = PROFILE_TAB.icon;
              return (
                <Link href={PROFILE_TAB.href} className="flex-1">
                  <div className="flex flex-col items-center justify-center h-16 gap-0.5 relative cursor-pointer select-none">
                    {active && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{ background: PROFILE_TAB.color }} />
                    )}
                    <div className="flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200"
                      style={{ background: active ? PROFILE_TAB.bg : "transparent" }}>
                      <Icon size={18} strokeWidth={active ? 2.5 : 1.8} color={active ? PROFILE_TAB.color : "#94A3B8"} />
                    </div>
                    <span className="text-[10px] font-bold"
                      style={{ color: active ? PROFILE_TAB.color : "#94A3B8" }}>
                      Profile
                    </span>
                  </div>
                </Link>
              );
            })()}
          </div>
        </nav>

        {/* ═══════ "MORE" SLIDE-UP SHEET ═══════ */}
        {moreOpen && (
          <>
            {/* Backdrop */}
            <div className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setMoreOpen(false)} />

            {/* Sheet */}
            <div className="md:hidden fixed left-0 right-0 z-[60] rounded-t-3xl bg-white px-4 pt-4 pb-8"
              style={{
                bottom: 0,
                boxShadow: "0 -16px 48px rgba(0,0,0,0.15)",
                animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              }}>

              {/* Drag handle */}
              <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />

              {/* Sheet header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-extrabold text-slate-800">More</p>
                <button onClick={() => setMoreOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={14} className="text-gray-500" />
                </button>
              </div>

              {/* More nav items */}
              <div className="space-y-2 mb-3">
                {MORE_NAV.map(item => {
                  const active = location.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}>
                      <div className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all"
                        style={{ background: active ? item.bg : "#F8FAFC", border: active ? `1.5px solid ${item.color}30` : "1.5px solid transparent" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: active ? item.color : "#EEF2FF" }}>
                          <Icon size={18} strokeWidth={2.2} color={active ? "white" : "#94A3B8"} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-extrabold" style={{ color: active ? item.color : "#334155" }}>{item.label}</p>
                        </div>
                        {active && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />}
                        {!active && <ChevronRight size={15} className="text-gray-300 shrink-0" />}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-3" />

              {/* Admin button in sheet */}
              {isAdmin && (
                <button onClick={handleAdminClick}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-2"
                  style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)", border: "1.5px solid #BFDBFE" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 4px 12px #3B82F640" }}>
                    <ShieldCheck size={18} strokeWidth={2.2} color="white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-extrabold text-blue-600">Faculty Admin Panel</p>
                    <p className="text-[10px] text-blue-400">Manage tests, questions & students</p>
                  </div>
                  <ChevronRight size={15} className="text-blue-300 shrink-0" />
                </button>
              )}

              {/* Sign out */}
              <button onClick={() => { setMoreOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl"
                style={{ background: "#FFF1F2", border: "1.5px solid #FFE4E6" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                  <LogOut size={17} strokeWidth={2.2} className="text-red-400" />
                </div>
                <p className="text-sm font-extrabold text-red-500">Sign Out</p>
              </button>

              {/* Branding */}
              <p className="text-center text-[9px] text-gray-300 font-medium mt-4">
                BigBrains · Jashwanth &amp; Team · Sphoorthy Engineering College
              </p>
            </div>
          </>
        )}

      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
