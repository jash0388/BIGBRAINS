import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, delay: 0.08 }} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", padding: "0.8rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "72rem", height: "3.55rem", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.84)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(61,101,244,0.12)", boxShadow: "0 8px 24px rgba(61,101,244,0.08)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: 28, height: 28 }}>
            <svg viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" fill="#3D65F4"/><rect x="18" y="2" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.5"/><rect x="2" y="18" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.5"/><rect x="18" y="18" width="12" height="12" rx="3" fill="#3D65F4"/></svg>
          </div>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "1.02rem", color: "#12306A" }}>DataNauts</span>
        </a>
        <div className="hidden md:flex items-center gap-2">
          <a href="/student/login" style={{ padding: "0.48rem 1rem", borderRadius: "999px", fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.84rem", color: "#3D65F4", background: "rgba(61,101,244,0.08)", border: "1px solid rgba(61,101,244,0.12)", textDecoration: "none" }}>Student Login</a>
          <a href="/faculty/login" style={{ padding: "0.48rem 1.08rem", borderRadius: "999px", fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.84rem", color: "#fff", background: "linear-gradient(135deg,#3D65F4,#0EA5E9)", textDecoration: "none" }}>Faculty Login</a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "#3D65F4", background: "none", border: "none", cursor: "pointer" }}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ position: "absolute", top: "4.9rem", left: "1rem", right: "1rem", borderRadius: "1rem", padding: "0.85rem", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(24px)", border: "1px solid rgba(61,101,244,0.12)", display: "flex", flexDirection: "column", gap: "0.55rem", boxShadow: "0 18px 40px rgba(61,101,244,0.1)" }}>
        <a href="/student/login" onClick={() => setMenuOpen(false)} style={{ padding: "0.72rem 1rem", borderRadius: "0.75rem", fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.86rem", color: "#3D65F4", background: "rgba(61,101,244,0.08)", border: "1px solid rgba(61,101,244,0.12)", textDecoration: "none", textAlign: "center" }}>Student Login</a>
        <a href="/faculty/login" onClick={() => setMenuOpen(false)} style={{ padding: "0.72rem 1rem", borderRadius: "0.75rem", fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.86rem", color: "#fff", background: "linear-gradient(135deg,#3D65F4,#0EA5E9)", textDecoration: "none", textAlign: "center" }}>Faculty Login</a>
      </motion.div>}</AnimatePresence>
    </motion.nav>
  );
}
