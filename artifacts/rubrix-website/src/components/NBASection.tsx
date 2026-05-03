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
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
};

export default function NBASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="nba" style={{ background: "#F8FAFF", padding: "7rem 1.5rem 9rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: "0%", right: "-5%", width: "45vw", height: "45vh", background: "radial-gradient(ellipse, rgba(61,101,244,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "62rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <span className="section-badge">Accreditation Module</span>
          </motion.div>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#12306A", marginBottom: "1rem" }}>
            Simplify <span style={{ color: "#FF6B4A" }}>NBA & NAAC</span><br />Accreditation
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "1rem", color: "#5B6E9A", maxWidth: "38rem", margin: "0 auto" }}>
            Reduce manual effort by 80% and walk into every NBA visit with confidence.
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "260px", height: "260px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(61,101,244,0.05)", border: "1.5px dashed rgba(61,101,244,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "5rem", height: "5rem", borderRadius: "50%", background: "linear-gradient(135deg, #3D65F4, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(61,101,244,0.2)" }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "white" }}>NBA</span>
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
                const r = 118;
                const x = 50 + (r / 130) * 50 * Math.cos(rad);
                const y = 50 + (r / 130) * 50 * Math.sin(rad);
                return (
                  <motion.div key={node.label} initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.4 + i * 0.1 }} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(61,101,244,0.12)", borderRadius: "999px", padding: "0.25rem 0.75rem", fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: "0.72rem", color: "#5B6E9A", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(61,101,244,0.06)" }}>{node.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i + 4} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.25rem", borderRadius: "1.25rem", background: "#fff", border: "1px solid rgba(61,101,244,0.10)", boxShadow: "0 10px 28px rgba(61,101,244,0.06)" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", flexShrink: 0, background: "rgba(255,107,74,0.10)", border: "1px solid rgba(255,107,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <f.icon size={16} color="#FF6B4A" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#12306A", marginBottom: "0.25rem" }}>{f.title}</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.8rem", color: "#5B6E9A", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
                <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0, marginTop: "0.25rem" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
