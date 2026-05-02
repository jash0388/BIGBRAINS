import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Crown, Zap, FolderOpen, User, LogOut, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { href: "/student/academics", icon: BookOpen, label: "Academics" },
  { href: "/student/career", icon: Crown, label: "Career" },
  { href: "/student/practice", icon: Zap, label: "Practice" },
  { href: "/student/resource", icon: FolderOpen, label: "Resource" },
  { href: "/student/profile", icon: User, label: "Profile" },
];

function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  const [location] = useLocation();
  const active = location.startsWith(href);
  return (
    <Link href={href}>
      <div
        title={label}
        className="w-full flex flex-col items-center gap-1 py-3 px-1 rounded-xl cursor-pointer transition-all duration-200 group"
        style={{
          background: active ? "rgba(61,101,244,0.9)" : "transparent",
          boxShadow: active ? "0 4px 14px rgba(61,101,244,0.4)" : "none",
        }}
      >
        <Icon
          size={19}
          strokeWidth={active ? 2.5 : 1.8}
          className={active ? "text-white" : "text-blue-300 group-hover:text-white transition-colors"}
        />
        <span className={`text-[8px] font-extrabold leading-none uppercase tracking-widest transition-colors ${active ? "text-white" : "text-blue-400 group-hover:text-white"}`}>
          {label}
        </span>
      </div>
    </Link>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { student, logout } = useAuth();
  const [, navigate] = useLocation();

  function handleLogout() {
    logout();
    navigate("/student/login");
  }

  const initials = student
    ? `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <div className="flex h-screen bg-[#F7F9FF] overflow-hidden" style={{ fontFamily: "'Sora', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside className="w-[62px] shrink-0 flex flex-col items-center pt-4 pb-4 gap-1"
        style={{ background: "linear-gradient(180deg, #0F1A45 0%, #182B68 100%)" }}>

        {/* Logo → home */}
        <Link href="/">
          <div title="Home" className="mb-3 mt-1 w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <rect x="2" y="2" width="12" height="12" rx="2.5" fill="white" />
              <rect x="18" y="2" width="12" height="12" rx="2.5" fill="white" opacity="0.5" />
              <rect x="2" y="18" width="12" height="12" rx="2.5" fill="white" opacity="0.5" />
              <rect x="18" y="18" width="12" height="12" rx="2.5" fill="white" />
            </svg>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-8 h-px bg-white/10 mb-1" />

        {/* Nav */}
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Avatar */}
        {student && (
          <Link href="/student/profile">
            <div
              title={student.fullName}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/30 transition-all mb-1 shrink-0"
              style={{ background: "linear-gradient(135deg, #3D65F4, #7C5CFC)" }}
            >
              <span className="text-white font-extrabold text-xs">{initials}</span>
            </div>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-full flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut size={16} strokeWidth={2} />
          <span className="text-[7px] font-extrabold uppercase tracking-widest">Out</span>
        </button>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Top bar */}
        {student && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100/80 shrink-0"
            style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #3D65F4, #7C5CFC)" }}>
                <span className="text-white font-extrabold text-[11px]">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0F1A45] leading-tight truncate">{student.fullName}</p>
                <p className="text-[10px] text-gray-400 truncate">{student.rollNumber} · {student.college}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {student.year && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#EEF2FF", color: "#3D65F4" }}>
                  {student.year}
                </span>
              )}
              {student.semester && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#ECFDF5", color: "#059669" }}>
                  SEM {student.semester}
                </span>
              )}
              {student.branch && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:inline-flex"
                  style={{ background: "#FFF4EE", color: "#FF6B4A" }}>
                  {student.branch.includes("Data") ? "Data Science" : student.branch.split(" ")[0]}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
