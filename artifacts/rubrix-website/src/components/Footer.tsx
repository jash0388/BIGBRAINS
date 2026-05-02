import { Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F1A45] text-blue-200 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7">
                <svg viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="3" fill="#3D65F4"/>
                  <rect x="18" y="2" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.6"/>
                  <rect x="2" y="18" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.6"/>
                  <rect x="18" y="18" width="12" height="12" rx="3" fill="#3D65F4"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base">Rubrix.ai</span>
            </div>
            <p className="text-xs text-blue-300 leading-relaxed mb-4">India's First Institutional Excellence Platform — powering academics, placements, and accreditation.</p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#3D65F4] transition-colors">
                  <Icon size={14} className="text-white" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Platform", links: ["Student Portal", "Faculty Portal", "NBA Module", "Analytics"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-blue-300 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-blue-400">© 2024 Rubrix.ai. All rights reserved.</p>
          <p className="text-xs text-blue-400">Made with care in Hyderabad, India</p>
        </div>
      </div>
    </footer>
  );
}
