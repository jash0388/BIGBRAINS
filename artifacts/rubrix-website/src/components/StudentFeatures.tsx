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
    <section ref={ref} style={{ background: "#F8FAFF", padding: "7rem 1.5rem 9rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", right: "-10%", width: "50vw", height: "50vh", background: "radial-gradient(ellipse, rgba(61,101,244,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "62rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <span className="section-badge">Student Module</span>
          </motion.div>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#12306A", marginBottom: "1rem" }}>
            Everything you need,<br />
            <span style={{ background: "linear-gradient(135deg, #3D65F4, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in one place.</span>
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "1rem", color: "#5B6E9A", maxWidth: "38rem", margin: "0 auto" }}>
            Practice coding, take tests, review answers, and track your progress — all within DataNauts.
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {features.map((f, i) => (
            <motion.div key={f.title} custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} whileHover={{ y: -6 }} style={{ borderRadius: "1.5rem", padding: "1.75rem", background: "#fff", backdropFilter: "blur(20px)", border: "1px solid rgba(61,101,244,0.10)", boxShadow: "0 12px 32px rgba(61,101,244,0.08)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(61,101,244,0.18), transparent)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: "linear-gradient(135deg, rgba(61,101,244,0.12), rgba(14,165,233,0.10))", border: "1px solid rgba(61,101,244,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <f.icon size={18} color="#3D65F4" />
                </div>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.8rem", color: "rgba(18,48,106,0.25)" }}>{f.num}</span>
              </div>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#12306A", marginBottom: "0.5rem" }}>{f.title}</p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.83rem", color: "#5B6E9A", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
