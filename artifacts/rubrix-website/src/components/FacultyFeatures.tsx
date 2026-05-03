import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, BarChart2, Code2, ClipboardCheck } from "lucide-react";

const features = [
  { icon: FileText,       title: "Create Tests",            desc: "Build MCQ tests with duration, marks per question, and difficulty. Publish instantly to all students." },
  { icon: Code2,          title: "Review Code Submissions", desc: "See every student's submitted code. Approve, reject, or add a note — students get notified instantly." },
  { icon: ClipboardCheck, title: "Track All Results",       desc: "Every test submission, score, time taken, and answer breakdown — all in the Faculty Dashboard." },
  { icon: BarChart2,      title: "Leaderboard Oversight",   desc: "See who's leading, who's falling behind. Drill into any student's full submission history." },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function FacultyFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#030303", padding: "7rem 1.5rem 9rem", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "10%", left: "-10%",
        width: "55vw", height: "55vh",
        background: "radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "62rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">

          {/* Left text */}
          <div>
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              style={{ marginBottom: "1.25rem" }}>
              <span className="section-badge">Faculty Module</span>
            </motion.div>
            <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              style={{
                fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                lineHeight: 1, letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.95)",
                marginBottom: "1.25rem",
              }}>
              Full control.<br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Zero paperwork.</span>
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: "1rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7,
                marginBottom: "2.5rem",
              }}>
              One dashboard to create tests, review code, track submissions, and give feedback — all without leaving Rubrix.
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {features.map((f, i) => (
                <motion.div key={f.title} custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{
                    width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", flexShrink: 0,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <f.icon size={15} color="rgba(107,159,255,0.8)" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "0.2rem" }}>{f.title}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div custom={8} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              style={{ marginTop: "2.5rem" }}>
              <a href="/faculty/login" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.75rem 1.75rem", borderRadius: "999px",
                fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                color: "#000", background: "rgba(255,255,255,0.92)",
                textDecoration: "none", transition: "opacity 0.2s",
              }}>
                Faculty Login →
              </a>
            </motion.div>
          </div>

          {/* Right — live dashboard mock */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <div className="liquid-glass" style={{ borderRadius: "1.5rem", padding: "1.75rem" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "2.25rem", height: "2.25rem", borderRadius: "0.75rem",
                  background: "linear-gradient(135deg, #3D65F4, #0EA5E9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <BarChart2 size={16} color="white" />
                </div>
                <div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>Faculty Dashboard</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>Live · Sphoorthy Engineering College</p>
                </div>
              </div>

              {/* Progress bars */}
              {[
                { label: "Tests Published",      pct: 82, color: "#6B9FFF" },
                { label: "Code Reviews Done",    pct: 61, color: "#10B981" },
                { label: "Student Submissions",  pct: 94, color: "#0EA5E9" },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: "1.1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${item.pct}%` } : { width: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                      style={{ height: "100%", borderRadius: "999px", background: item.color }}
                    />
                  </div>
                </div>
              ))}

              {/* Mini stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginTop: "1.5rem" }}>
                {[
                  { label: "Students",  value: "342" },
                  { label: "Tests",     value: "18"  },
                  { label: "Pending",   value: "7"   },
                ].map(s => (
                  <div key={s.label} style={{
                    background: "rgba(255,255,255,0.04)", borderRadius: "0.875rem",
                    padding: "0.75rem", textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "rgba(255,255,255,0.85)" }}>{s.value}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>{s.label}</p>
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
