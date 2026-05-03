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
    <motion.nav initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", padding: "1rem 1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "56rem", height: "3.5rem", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", background: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(61,101,244,0.12)", boxShadow: scrolled ? "0 8px 30px rgba(61,101,244,0.12)" : "0 4px 18px rgba(61,101,244,0.08)", transition: "box-shadow 0.3s, background 0.3s" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: 28, height: 28 }}>
            <svg viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" fill="#3D65F4"/><rect x="18" y="2" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.5"/><rect x="2" y="18" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.5"/><rect x="18" y="18" width="12" height="12" rx="3" fill="#3D65F4"/></svg>
          </div>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "1.1rem", color: "#12306A", letterSpacing: "-0.01em" }}>DataNauts</span>
        </a>
        <div className="hidden md:flex items-center gap-2">
          <a href="/student/login" style={{ padding: "0.45rem 1.1rem", borderRadius: "999px", fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#3D65F4", background: "rgba(61,101,244,0.08)", border: "1px solid rgba(61,101,244,0.12)", textDecoration: "none" }}>Student Login</a>
          <a href="/faculty/login" style={{ padding: "0.45rem 1.25rem", borderRadius: "999px", fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#fff", background: "linear-gradient(135deg,#3D65F4,#0EA5E9)", textDecoration: "none" }}>Faculty Login</a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "#3D65F4", background: "none", border: "none", cursor: "pointer" }}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ position: "absolute", top: "5rem", left: "1.5rem", right: "1.5rem", borderRadius: "1.25rem", padding: "1rem", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(24px)", border: "1px solid rgba(61,101,244,0.12)", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <a href="/student/login" onClick={() => setMenuOpen(false)} style={{ padding: "0.75rem 1.25rem", borderRadius: "0.75rem", fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#3D65F4", background: "rgba(61,101,244,0.08)", border: "1px solid rgba(61,101,244,0.12)", textDecoration: "none", textAlign: "center" }}>Student Login</a>
        <a href="/faculty/login" onClick={() => setMenuOpen(false)} style={{ padding: "0.75rem 1.25rem", borderRadius: "0.75rem", fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#fff", background: "linear-gradient(135deg,#3D65F4,#0EA5E9)", textDecoration: "none", textAlign: "center" }}>Faculty Login</a>
      </motion.div>}</AnimatePresence>
    </motion.nav>
  );
}
