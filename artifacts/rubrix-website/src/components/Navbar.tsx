import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        padding: "1rem 1.5rem",
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: "56rem",
          height: "3.5rem",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.25rem",
          background: scrolled ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset"
            : "0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.08) inset",
          transition: "box-shadow 0.3s, background 0.3s",
        }}
      >
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: 28, height: 28 }}>
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="3" fill="#6B9FFF"/>
              <rect x="18" y="2" width="12" height="12" rx="3" fill="#6B9FFF" opacity="0.5"/>
              <rect x="2" y="18" width="12" height="12" rx="3" fill="#6B9FFF" opacity="0.5"/>
              <rect x="18" y="18" width="12" height="12" rx="3" fill="#6B9FFF"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.01em",
          }}>DataNauts</span>
        </a>

        <div className="hidden md:flex items-center gap-2">
          <a href="/student/login" style={{
            padding: "0.45rem 1.1rem",
            borderRadius: "999px",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.75)",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            textDecoration: "none",
            transition: "background 0.2s",
          }}>
            Student Login
          </a>
          <a href="/faculty/login" style={{
            padding: "0.45rem 1.25rem",
            borderRadius: "999px",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#000",
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(255,255,255,0.2)",
            textDecoration: "none",
            transition: "background 0.2s",
          }}>
            Faculty Login
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              position: "absolute",
              top: "5rem",
              left: "1.5rem",
              right: "1.5rem",
              borderRadius: "1.25rem",
              padding: "1rem",
              background: "rgba(10,10,10,0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            <a href="/student/login" onClick={() => setMenuOpen(false)} style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              textDecoration: "none",
              textAlign: "center",
            }}>Student Login</a>
            <a href="/faculty/login" onClick={() => setMenuOpen(false)} style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#000",
              background: "rgba(255,255,255,0.92)",
              textDecoration: "none",
              textAlign: "center",
            }}>Faculty Login</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
