import { motion } from "framer-motion";

const stats = [
  { value: "100+", label: "Institutions", color: "#3D65F4" },
  { value: "50,000+", label: "Students", color: "#7C5CFC" },
  { value: "95%", label: "Accreditation Success Rate", color: "#FF6B4A" },
  { value: "3x", label: "Placement Improvement", color: "#00C2CB" },
];

export default function Stats() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#182B68] to-[#0F1A45]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-blue-300 text-sm font-semibold uppercase tracking-widest mb-12"
        >
          Rubrix.ai by the Numbers
        </motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-5xl font-extrabold mb-2" style={{ color: s.color }}>{s.value}</p>
              <p className="text-blue-200 text-sm font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
