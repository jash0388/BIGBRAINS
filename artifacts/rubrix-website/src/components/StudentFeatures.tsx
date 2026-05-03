import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Target, TrendingUp, Briefcase, Code2, Trophy } from "lucide-react";

const features = [
  { icon: Target,     num: "01", title: "Faculty-Set Tests",      desc: "Attempt tests created by your faculty. Full screen mode, auto-timer, and instant score with answer review." },
  { icon: Code2,      num: "02", title: "Coding Practice",        desc: "Submit code solutions for faculty review. Get feedback, rejection notes, and resubmit until approved." },
  { icon: TrendingUp, num: "03", title: "Live Leaderboard",       desc: "See how you rank against your peers across tests and practice. Real-time scores, all departments." },
  { icon: Trophy,     num: "04", title: "Instant Results",        desc: "After every test, review every question — see what you got right, wrong, and skipped with correct answers." },
  { icon: BookOpen,   num: "05", title: "Academic Resources",     desc: "Access notes, syllabus, and study materials curated by faculty for your semester." },
  { icon: Briefcase,  num: "06", title: "Career Guidance",        desc: "Placement prep, internship tips, and career paths tailored to CSE Data Science students." },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function StudentFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#000", padding: "7rem 1.5rem 9rem", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "20%", right: "-10%",
        width: "50vw", height: "50vh",
        background: "radial-gradient(ellipse, rgba(61,101,244,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "62rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <span className="section-badge">Student Module</span>
          </motion.div>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{
              fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 0.95, letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.95)",
              marginBottom: "1rem",
            }}>
            Everything you need,<br />
            <span style={{
              background: "linear-gradient(135deg, #6B9FFF, #10B981)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>in one place.</span>
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 300,
              fontSize: "1rem", color: "rgba(255,255,255,0.4)",
              maxWidth: "38rem", margin: "0 auto",
            }}>
            Practice coding, take tests, review answers, and track your progress — all within DataNauts.
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -6 }}
              style={{
                borderRadius: "1.5rem",
                padding: "1.75rem",
                background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 20px 60px rgba(0,0,0,0.5)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{
                  width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem",
                  background: "linear-gradient(135deg, rgba(107,159,255,0.25), rgba(16,185,129,0.15))",
                  border: "1px solid rgba(107,159,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <f.icon size={18} color="rgba(107,159,255,0.9)" />
                </div>
                <span style={{
                  fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                  fontSize: "0.8rem", color: "rgba(255,255,255,0.18)",
                }}>{f.num}</span>
              </div>
              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                fontSize: "0.95rem", color: "rgba(255,255,255,0.88)",
                marginBottom: "0.5rem",
              }}>{f.title}</p>
              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: "0.83rem", color: "rgba(255,255,255,0.4)",
                lineHeight: 1.6,
              }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div custom={10} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
          <a href="/student/login" className="liquid-glass-strong" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.875rem 2.25rem", borderRadius: "999px",
            fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.9rem",
            color: "rgba(255,255,255,0.9)", textDecoration: "none",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Enter Student Portal →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
