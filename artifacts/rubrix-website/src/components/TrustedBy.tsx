import { motion } from "framer-motion";

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
  return (
    <section className="py-16 bg-white border-y border-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3"
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Powering All Departments at
          </p>
          <p className="text-xl font-extrabold text-[#182B68]">Sphoorthy Engineering College</p>
          <p className="text-xs text-gray-400 mt-1">Hyderabad, Telangana · Approved by AICTE · Affiliated to JNTUH</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mt-8 items-center">
          {departments.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F9FBFF] border border-blue-100 text-[#182B68] font-semibold text-sm hover:border-[#3D65F4] hover:shadow-sm transition-all"
            >
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#3D65F4] to-[#182B68] opacity-80" />
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
