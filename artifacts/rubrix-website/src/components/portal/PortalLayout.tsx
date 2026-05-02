import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Crown, Zap, FolderOpen, User } from "lucide-react";

const navItems = [
  { href: "/student/academics", icon: BookOpen, label: "Academics" },
  { href: "/student/career", icon: Crown, label: "Career" },
  { href: "/student/practice", icon: Zap, label: "Practice" },
  { href: "/student/resource", icon: Resource, label: "Resource" },
  { href: "/student/profile", icon: User, label: "Profile" },
];

function Resource(props: any) {
  return <FolderOpen {...props} />;
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const [location] = useLocation();
  const active = location.startsWith(href);
  return (
    <Link href={href}>
      <div
        title={label}
        className={`w-full flex flex-col items-center gap-1 py-3 px-1 rounded-xl cursor-pointer transition-all duration-200 ${
          active
            ? "bg-[#3D65F4] text-white shadow-md shadow-blue-900/30"
            : "text-blue-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon size={19} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[8px] font-bold leading-none uppercase tracking-wide">{label}</span>
      </div>
    </Link>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F9FBFF] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[62px] bg-[#182B68] flex flex-col items-center pt-3 pb-4 gap-1.5 shrink-0 shadow-xl">
        {/* Logo */}
        <Link href="/">
          <div className="mb-3 mt-1 cursor-pointer" title="Back to Home">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <rect x="2" y="2" width="12" height="12" rx="3" fill="white"/>
              <rect x="18" y="2" width="12" height="12" rx="3" fill="white" opacity="0.55"/>
              <rect x="2" y="18" width="12" height="12" rx="3" fill="white" opacity="0.55"/>
              <rect x="18" y="18" width="12" height="12" rx="3" fill="white"/>
            </svg>
          </div>
        </Link>

        <div className="w-8 h-px bg-white/10 mb-1" />

        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
