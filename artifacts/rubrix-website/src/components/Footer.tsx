import { Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <svg viewBox="0 0 32 32" fill="none" style={{ width: 22, height: 22 }}>
            <rect x="2" y="2" width="12" height="12" rx="3" fill="#6B9FFF"/>
            <rect x="18" y="2" width="12" height="12" rx="3" fill="#6B9FFF" opacity="0.5"/>
            <rect x="2" y="18" width="12" height="12" rx="3" fill="#6B9FFF" opacity="0.5"/>
            <rect x="18" y="18" width="12" height="12" rx="3" fill="#6B9FFF"/>
          </svg>
          <span style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
            fontSize: "1.1rem", color: "rgba(255,255,255,0.7)",
          }}>DataNauts</span>
        </div>

        <p style={{
          fontFamily: "'Barlow', sans-serif", fontWeight: 300,
          fontSize: "0.78rem", color: "rgba(255,255,255,0.25)",
          marginBottom: "1.5rem",
        }}>
          Student excellence platform — built at Sphoorthy Engineering College.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.625rem", marginBottom: "2rem" }}>
          {[Linkedin, Twitter, Mail].map((Icon, i) => (
            <a key={i} href="#" style={{
              width: "2rem", height: "2rem", borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(107,159,255,0.15)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <Icon size={13} color="rgba(255,255,255,0.45)" />
            </a>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: "0.72rem", color: "rgba(255,255,255,0.2)",
            marginBottom: "0.5rem",
          }}>
            © 2025 DataNauts. All rights reserved.
          </p>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: "0.68rem",
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.375rem",
            color: "rgba(255,255,255,0.18)",
          }}>
            <span>A</span>
            <span style={{
              background: "linear-gradient(90deg,#818CF8,#A78BFA)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}>Big Brains</span>
            <span>initiative ·</span>
            <span style={{ color: "rgba(167,139,250,0.6)", fontWeight: 500 }}>Jashwanth & Team</span>
            <span>· Sphoorthy Engineering College</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
