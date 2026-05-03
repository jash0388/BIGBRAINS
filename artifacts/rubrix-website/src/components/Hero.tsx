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

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const motes = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.1 + 0.2,
      sx: (Math.random() - 0.5) * 0.06,
      sy: -(Math.random() * 0.05 + 0.015),
      op: Math.random() * 0.08 + 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      motes.forEach(m => {
        const pulse = m.op * (0.8 + 0.2 * Math.sin(frame * 0.02 + m.phase));
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 2.2);
        grad.addColorStop(0, `rgba(61,101,244,${pulse})`);
        grad.addColorStop(1, `rgba(61,101,244,0)`);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 2.2, 0, Math.PI * 2);
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

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} />;
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.6], ["0%", "3%"]);
  const op = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", background: "linear-gradient(180deg,#F8FAFF 0%,#EEF5FF 100%)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top, rgba(61,101,244,0.08), transparent 42%)", zIndex: 0 }} />
      <AtmosphereCanvas />
      <motion.div style={{ y, opacity: op, position: "relative", zIndex: 2, width: "100%", maxWidth: "72rem", textAlign: "center", padding: "0 1.5rem", paddingTop: "6rem" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.2rem" }}>
          <span className="section-badge">Live at Sphoorthy Engineering College</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.28 }} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(3.2rem, 7.5vw, 6.4rem)", lineHeight: 0.9, letterSpacing: "-0.04em", color: "#12306A", marginBottom: "1.15rem" }}>
          The Future Of<br />
          <span style={{ background: "linear-gradient(135deg, #3D65F4, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Education</span> Begins Here
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.4 }} style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "clamp(1rem, 2vw, 1.12rem)", color: "#5B6E9A", margin: "0 auto 2.25rem", lineHeight: 1.65, maxWidth: "42rem" }}>
          Smarter practice. Instant feedback. Real results.<br />Built by students, for students — at Sphoorthy.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.55 }} style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/student/login" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 2rem", borderRadius: "999px", fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", background: "linear-gradient(135deg, #3D65F4, #0EA5E9)", textDecoration: "none", boxShadow: "0 12px 30px rgba(61,101,244,0.22)" }}>Student Login <ArrowUpRight size={16} /></a>
          <a href="/faculty/login" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 2rem", borderRadius: "999px", fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#3D65F4", background: "#fff", border: "1px solid rgba(61,101,244,0.16)", textDecoration: "none", boxShadow: "0 10px 24px rgba(61,101,244,0.08)" }}>Faculty Login</a>
        </motion.div>
      </motion.div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18%", background: "linear-gradient(to bottom, transparent, #F8FAFF)", zIndex: 3, pointerEvents: "none" }} />
    </section>
  );
}
