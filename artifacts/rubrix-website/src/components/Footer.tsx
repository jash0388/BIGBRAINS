import { Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#F8FAFF", borderTop: "1px solid rgba(61,101,244,0.08)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <svg viewBox="0 0 32 32" fill="none" style={{ width: 22, height: 22 }}><rect x="2" y="2" width="12" height="12" rx="3" fill="#3D65F4"/><rect x="18" y="2" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.5"/><rect x="2" y="18" width="12" height="12" rx="3" fill="#3D65F4" opacity="0.5"/><rect x="18" y="18" width="12" height="12" rx="3" fill="#3D65F4"/></svg>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "1.1rem", color: "#12306A" }}>DataNauts</span>
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.78rem", color: "#5B6E9A", marginBottom: "1.5rem" }}>Student excellence platform — built at Sphoorthy Engineering College.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.625rem", marginBottom: "2rem" }}>
          {[Linkedin, Twitter, Mail].map((Icon, i) => <a key={i} href="#" style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "rgba(61,101,244,0.08)", border: "1px solid rgba(61,101,244,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={13} color="#3D65F4" /></a>)}
        </div>
        <div style={{ borderTop: "1px solid rgba(61,101,244,0.08)", paddingTop: "1.5rem" }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.72rem", color: "#5B6E9A", marginBottom: "0.5rem" }}>© 2025 DataNauts. All rights reserved.</p>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.68rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.375rem", color: "#7A8EBB" }}><span>Big Brains</span><span>initiative ·</span><span>Jashwanth & Team</span><span>· Sphoorthy Engineering College</span></p>
        </div>
      </div>
    </footer>
  );
}
