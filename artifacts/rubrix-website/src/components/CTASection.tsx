import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="contact" style={{ background: "#000", padding: "7rem 1.5rem 10rem", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)",
        width: "60vw", height: "40vh",
        background: "radial-gradient(ellipse, rgba(61,101,244,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <span className="section-badge">Get Started</span>
        </motion.div>

        <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            lineHeight: 0.95, letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.96)",
            marginBottom: "1.5rem",
          }}>
          Built for Sphoorthy.<br />
          <span style={{ color: "rgba(255,255,255,0.35)" }}>By students. For everyone.</span>
        </motion.h2>

        <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: "1rem", color: "rgba(255,255,255,0.38)",
            marginBottom: "3rem", lineHeight: 1.7, maxWidth: "34rem", margin: "0 auto 3rem",
          }}>
          DataNauts is a student-led startup by Big Brains — born inside Sphoorthy Engineering College. Log in and start your journey.
        </motion.p>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}>
          <a href="/student/login" className="liquid-glass-strong" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "1rem 2.25rem", borderRadius: "999px",
            fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "1rem",
            color: "rgba(255,255,255,0.92)", textDecoration: "none",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Student Login <ArrowUpRight size={16} />
          </a>
          <a href="/faculty/login" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "1rem 2.25rem", borderRadius: "999px",
            fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: "1rem",
            color: "rgba(255,255,255,0.55)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            textDecoration: "none",
            transition: "color 0.2s, border-color 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            Faculty Login
          </a>
        </motion.div>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
          {[
            { icon: Mail,   label: "bigbrains@sphoorthyengg.ac.in"          },
            { icon: Phone,  label: "+91 80747 72823"                         },
            { icon: MapPin, label: "Sphoorthy Engineering College, Hyderabad" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <item.icon size={13} color="rgba(255,255,255,0.3)" />
              <span style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 300,
                fontSize: "0.8rem", color: "rgba(255,255,255,0.3)",
              }}>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
