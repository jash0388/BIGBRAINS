import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, FileCheck, BarChart, BookOpen, Shield } from "lucide-react";

const features = [
  { icon: FileCheck, title: "Digital SAR Generation", desc: "Auto-populate Self Assessment Reports from your institution data. One click, fully formatted." },
  { icon: BookOpen, title: "OBE Mapping", desc: "Map Course Outcomes to Program Outcomes seamlessly. Stay compliant with NBA criteria." },
  { icon: BarChart, title: "Pre-Qualifier Scoring", desc: "Real-time eligibility tracking across all NBA pre-qualifiers. Know where you stand." },
  { icon: Shield, title: "Automated Attainment Calculations", desc: "Direct and indirect attainment computed automatically from assessment data." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] } }),
};

export default function NBASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="nba" style={{ background: "#F8FAFF", padding: "5rem 1.25rem 6rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%, rgba(61,101,244,0.05), transparent 36%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "center", marginBottom: "0.9rem" }}>
            <span className="section-badge">Accreditation Module</span>
          </motion.div>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(1.95rem, 9vw, 3.35rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#12306A", marginBottom: "0.9rem" }}>
            Simplify <span style={{ color: "#FF6B4A" }}>NBA & NAAC</span><br />Accreditation
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.98rem", color: "#5B6E9A", maxWidth: "36rem", margin: "0 auto" }}>
            Reduce manual effort by 80% and walk into every NBA visit with confidence.
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "240px", height: "240px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(61,101,244,0.05)", border: "1.5px dashed rgba(61,101,244,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "4.5rem", height: "4.5rem", borderRadius: "50%", background: "linear-gradient(135deg, #3D65F4, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 32px rgba(61,101,244,0.18)" }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white" }}>NBA</span>
                </div>
              </div>
              {[
                { label: "Scoring", angle: 0 },
                { label: "Attainments", angle: 72 },
                { label: "Pre-Qualifiers", angle: 144 },
                { label: "OBE", angle: 216 },
                { label: "Digital SAR", angle: 288 },
              ].map((node, i) => {
                const rad = (node.angle - 90) * (Math.PI / 180);
                const r = 106;
                const x = 50 + (r / 120) * 50 * Math.cos(rad);
                const y = 50 + (r / 120) * 50 * Math.sin(rad);
                return (
                  <motion.div key={node.label} initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.35 + i * 0.08 }} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(61,101,244,0.12)", borderRadius: "999px", padding: "0.22rem 0.65rem", fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: "0.68rem", color: "#5B6E9A", whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(61,101,244,0.06)" }}>{node.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i + 4} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start", padding: "1rem", borderRadius: "1.1rem", background: "#fff", border: "1px solid rgba(61,101,244,0.10)", boxShadow: "0 10px 24px rgba(61,101,244,0.05)" }}>
                <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.7rem", flexShrink: 0, background: "rgba(255,107,74,0.10)", border: "1px solid rgba(255,107,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <f.icon size={15} color="#FF6B4A" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.86rem", color: "#12306A", marginBottom: "0.18rem" }}>{f.title}</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.78rem", color: "#5B6E9A", lineHeight: 1.55 }}>{f.desc}</p>
                </div>
                <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
