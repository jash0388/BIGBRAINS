import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="12" height="12" rx="3" fill="#3D65F4"/>
              <rect x="18" y="2" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.6"/>
              <rect x="2" y="18" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.6"/>
              <rect x="18" y="18" width="12" height="12" rx="3" fill="#3D65F4"/>
            </svg>
          </div>
          <span className="text-[#182B68] font-bold text-lg tracking-tight">Rubrix.ai</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {["Student Login", "Faculty Login", "NBA Login", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Student Login" ? "https://learn.rubrix.ai/login" : "#contact"}
              target={item === "Student Login" ? "_blank" : undefined}
              rel={item === "Student Login" ? "noopener noreferrer" : undefined}
              className="text-[#6B4EFF] font-medium text-sm hover:text-[#3D65F4] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <button className="md:hidden text-[#182B68]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4"
          >
            {["Student Login", "Faculty Login", "NBA Login", "Contact"].map((item) => (
              <a
                key={item}
                href={item === "Student Login" ? "https://learn.rubrix.ai/login" : "#contact"}
                className="text-[#6B4EFF] font-medium text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
