import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const departments = [
  "CSE – Data Science",
  "CSE – Artificial Intelligence",
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
];

export default function TrustedBy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ background: "#000", padding: "5rem 1.5rem 6rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)", marginBottom: "0.5rem",
          }}
        >
          Powering all departments at
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            color: "rgba(255,255,255,0.85)", marginBottom: "0.5rem",
          }}
        >
          Sphoorthy Engineering College
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: "0.8rem", color: "rgba(255,255,255,0.25)",
            marginBottom: "2.5rem",
          }}
        >
          Hyderabad, Telangana · AICTE Approved · JNTUH Affiliated
        </motion.p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.625rem" }}>
          {departments.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1.1rem",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                fontFamily: "'Barlow', sans-serif", fontWeight: 400,
                fontSize: "0.82rem", color: "rgba(255,255,255,0.55)",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(107,159,255,0.7)", flexShrink: 0, display: "inline-block" }} />
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
