import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    name: "Dr. P. Rajesh Kumar",
    title: "HOD – CSE Data Science, Sphoorthy Engineering College",
    quote: "DataNauts has completely changed how we track student progress. Faculty can assign tests, review code, and monitor every student — all from one dashboard. A true game changer.",
    initials: "PR",
    color: "#6B9FFF",
  },
  {
    name: "Prof. S. Lakshmi Prasanna",
    title: "Faculty – Computer Science, Sphoorthy Engineering College",
    quote: "I can create coding problems, review submissions with feedback notes, and track who submitted what — without any paperwork. Students get instant feedback and know exactly where they stand.",
    initials: "SL",
    color: "#0EA5E9",
  },
  {
    name: "Neanavth Jashwanth Singh",
    title: "B.Tech CSE-DS, 2nd Year · Roll 24N81A6758",
    quote: "Having tests, coding practice, results, and a leaderboard all in one app is incredible. I can see my score the moment I submit and review where I went wrong. Built for us.",
    initials: "NJ",
    color: "#10B981",
  },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#000", padding: "7rem 1.5rem 9rem", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "60vw", height: "50vh",
        background: "radial-gradient(ellipse, rgba(107,159,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "62rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <span className="section-badge">What Sphoorthy Says</span>
          </motion.div>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{
              fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 0.95, letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.95)",
            }}>
            Real words from<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>real people.</span>
          </motion.h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i + 2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -5 }}
              style={{
                borderRadius: "1.5rem",
                padding: "1.75rem",
                background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 60px rgba(0,0,0,0.5)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${t.color}40, transparent)`,
              }} />
              <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="14" height="14" fill="#FBBF24" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>

              <p style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: "0.875rem", color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic",
              }}>
                "{t.quote}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "2.5rem", height: "2.5rem", borderRadius: "50%", flexShrink: 0,
                  background: `${t.color}22`,
                  border: `1px solid ${t.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Barlow', sans-serif", fontWeight: 600,
                  fontSize: "0.8rem", color: t.color,
                }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>{t.name}</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.1rem" }}>{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
