import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function AtmosphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const motes = Array.from({ length: 180 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.4 + 0.3,
      sx: (Math.random() - 0.5) * 0.14,
      sy: -(Math.random() * 0.18 + 0.04),
      op: Math.random() * 0.45 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      motes.forEach(m => {
        const pulse = m.op * (0.7 + 0.3 * Math.sin(frame * 0.02 + m.phase));
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 2.4);
        grad.addColorStop(0, `rgba(255,255,255,${pulse})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        m.x += m.sx;
        m.y += m.sy;
        if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
        if (m.x < -10) m.x = W + 10;
        if (m.x > W + 10) m.x = -10;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
    />
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y  = useTransform(scrollYProgress, [0, 0.6], ["0%", "6%"]);
  const op = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", background: "#000", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Deep blue glow from center bottom */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "70vw", height: "50vh",
        background: "radial-gradient(ellipse, rgba(61,101,244,0.18) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
        animation: "glow-pulse 9s ease-in-out infinite",
      }} />

      {/* Ambient top glow */}
      <div style={{
        position: "absolute", top: "-5%", left: "30%",
        width: "40vw", height: "35vh",
        background: "radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
      }} />

      {/* Floating particles */}
      <AtmosphereCanvas />

      {/* Hero content */}
      <motion.div
        style={{ y, opacity: op, position: "relative", zIndex: 2, textAlign: "center", maxWidth: "60rem", padding: "0 1.5rem", paddingTop: "6rem" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}
        >
          <span className="section-badge">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            Live at Sphoorthy Engineering College
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(3rem, 9vw, 6.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.96)",
            marginBottom: "1.75rem",
          }}
        >
          The Future Of<br />
          <span style={{
            background: "linear-gradient(135deg, #6B9FFF 0%, #0EA5E9 50%, #10B981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Education
          </span>{" "}
          <span style={{ color: "rgba(255,255,255,0.96)" }}>Begins Here</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "2.75rem",
            lineHeight: 1.6,
          }}
        >
          Smarter practice. Instant feedback. Real results.<br />
          Built by students, for students — at Sphoorthy.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <a href="/student/login" className="liquid-glass-strong" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.875rem 2rem",
            borderRadius: "999px",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#fff",
            textDecoration: "none",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Student Login <ArrowUpRight size={16} />
          </a>
          <a href="/faculty/login" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.875rem 2rem",
            borderRadius: "999px",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.6)",
            textDecoration: "none",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "color 0.2s, border-color 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            Faculty Login
          </a>
        </motion.div>

        {/* Tagline row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
          style={{
            marginTop: "4rem",
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {["Practice", "Tests", "Leaderboard", "Faculty Reviews"].map(label => (
            <span key={label} style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}>{label}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "20%",
        background: "linear-gradient(to bottom, transparent, #000)",
        zIndex: 3, pointerEvents: "none",
      }} />
    </section>
  );
}
