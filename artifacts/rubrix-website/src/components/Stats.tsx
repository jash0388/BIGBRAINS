import { motion } from "framer-motion";

const stats = [
  { value: "2,000+",  label: "Students at Sphoorthy",          color: "#3D65F4" },
  { value: "120+",    label: "Faculty Members",                 color: "#0EA5E9" },
  { value: "8",       label: "Departments Onboarded",           color: "#FF6B4A" },
  { value: "100%",    label: "Digital — Zero Paperwork",        color: "#10B981" },
];

export default function Stats() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#182B68] to-[#0F1A45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest">
            Rubrix at Sphoorthy Engineering College
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: s.color }}>{s.value}</p>
              <p className="text-blue-200 text-xs md:text-sm font-medium leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
