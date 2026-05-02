import { motion } from "framer-motion";

const institutions = [
  "JNTUK", "VNIT", "SRM University", "KL University", "VIT", "GITAM",
  "MVSR", "Osmania University", "CBIT", "MGIT",
];

export default function TrustedBy() {
  return (
    <section className="py-16 bg-white border-y border-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
        >
          Trusted by 100+ Institutions across India
        </motion.p>
        <div className="flex flex-wrap justify-center gap-6 items-center">
          {institutions.map((name, i) => (
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
