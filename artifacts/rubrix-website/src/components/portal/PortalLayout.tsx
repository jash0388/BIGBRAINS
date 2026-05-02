import { ReactNode, useState } from "react";
import { Link, useRoute } from "wouter";
import { BookOpen, Crown, Zap, FolderOpen, User } from "lucide-react";

const navItems = [
  { href: "/student/academics", icon: BookOpen, label: "Academics" },
  { href: "/student/career", icon: Crown, label: "Career" },
  { href: "/student/practice", icon: Zap, label: "Practice" },
  { href: "/student/resource", icon: FolderOpen, label: "Resource" },
  { href: "/student/profile", icon: User, label: "Profile" },
];

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const [active] = useRoute(href + "/*?");
  return (
    <Link href={href}>
      <div
        className={`w-full flex flex-col items-center gap-1 py-3 px-2 rounded-xl cursor-pointer transition-all ${
          active ? "bg-[#3D65F4] text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon size={20} />
        <span className="text-[9px] font-semibold leading-none">{label}</span>
      </div>
    </Link>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[60px] bg-[#182B68] flex flex-col items-center py-4 gap-2 shrink-0">
        <div className="mb-4">
          <div className="w-8 h-8">
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="3" fill="white"/>
              <rect x="18" y="2" width="12" height="12" rx="3" fill="white" opacity="0.6"/>
              <rect x="2" y="18" width="12" height="12" rx="3" fill="white" opacity="0.6"/>
              <rect x="18" y="18" width="12" height="12" rx="3" fill="white"/>
            </svg>
          </div>
        </div>
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
