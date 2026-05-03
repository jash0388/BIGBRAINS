import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, BarChart2, Code2, ClipboardCheck } from "lucide-react";

const features = [
  { icon: FileText, title: "Create Tests", desc: "Build MCQ tests with duration, marks per question, and difficulty. Publish instantly to all students." },
  { icon: Code2, title: "Review Code Submissions", desc: "See every student's submitted code. Approve, reject, or add a note — students get notified instantly." },
  { icon: ClipboardCheck, title: "Track All Results", desc: "Every test submission, score, time taken, and answer breakdown — all in the Faculty Dashboard." },
  { icon: BarChart2, title: "Leaderboard Oversight", desc: "See who's leading, who's falling behind. Drill into any student's full submission history." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function FacultyFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#EEF5FF", padding: "5rem 1.25rem 6rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "55vw", height: "55vh", background: "radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "2rem", alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
          <div>
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ marginBottom: "0.9rem" }}>
              <span className="section-badge">Faculty Module</span>
            </motion.div>
            <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(1.95rem, 9vw, 3.1rem)", lineHeight: 1, letterSpacing: "-0.03em", color: "#12306A", marginBottom: "0.9rem" }}>
              Full control.<br />
              <span style={{ color: "#5B6E9A" }}>Zero paperwork.</span>
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.98rem", color: "#5B6E9A", lineHeight: 1.7, marginBottom: "1.4rem" }}>
              One dashboard to create tests, review code, track submissions, and give feedback — all without leaving DataNauts.
            </motion.p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {features.map((f, i) => (
                <motion.div key={f.title} custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start", padding: "0.95rem 1rem", borderRadius: "1rem", background: "#fff", border: "1px solid rgba(61,101,244,0.10)", boxShadow: "0 10px 22px rgba(61,101,244,0.05)" }}>
                  <div style={{ width: "2.1rem", height: "2.1rem", borderRadius: "0.6rem", flexShrink: 0, background: "rgba(61,101,244,0.08)", border: "1px solid rgba(61,101,244,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <f.icon size={15} color="#3D65F4" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.86rem", color: "#12306A", marginBottom: "0.14rem" }}>{f.title}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.78rem", color: "#5B6E9A", lineHeight: 1.55 }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <div className="liquid-glass" style={{ borderRadius: "1.3rem", padding: "1.15rem", background: "#fff", boxShadow: "0 16px 38px rgba(61,101,244,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1rem" }}>
                <div style={{ width: "2.1rem", height: "2.1rem", borderRadius: "0.7rem", background: "linear-gradient(135deg, #3D65F4, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BarChart2 size={15} color="white" />
                </div>
                <div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#12306A" }}>Faculty Dashboard</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.7rem", color: "#5B6E9A" }}>Live · Sphoorthy Engineering College</p>
                </div>
              </div>

              {[
                { label: "Tests Published", pct: 82, color: "#3D65F4" },
                { label: "Code Reviews Done", pct: 61, color: "#0EA5E9" },
                { label: "Student Submissions", pct: 94, color: "#10B981" },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: "0.76rem", color: "#5B6E9A" }}>{item.label}</span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.76rem", color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "999px", background: "rgba(61,101,244,0.08)", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={inView ? { width: `${item.pct}%` } : { width: 0 }} transition={{ duration: 1.0, ease: "easeOut", delay: 0.45 }} style={{ height: "100%", borderRadius: "999px", background: item.color }} />
                  </div>
                </div>
              ))}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.55rem", marginTop: "1rem" }}>
                {[
                  { label: "Students", value: "342" },
                  { label: "Tests", value: "18" },
                  { label: "Pending", value: "7" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(61,101,244,0.06)", borderRadius: "0.8rem", padding: "0.65rem", textAlign: "center", border: "1px solid rgba(61,101,244,0.10)" }}>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#12306A" }}>{s.value}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.65rem", color: "#5B6E9A", marginTop: "0.12rem" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
