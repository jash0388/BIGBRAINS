import { motion } from "framer-motion";
import { CheckCircle, FileCheck, BarChart, BookOpen, Shield } from "lucide-react";

const nodes = [
  { label: "Scoring",       angle: 0   },
  { label: "Attainments",   angle: 72  },
  { label: "Pre-Qualifiers",angle: 144 },
  { label: "OBE",           angle: 216 },
  { label: "Digital SAR",   angle: 288 },
];

const features = [
  { icon: FileCheck, title: "Digital SAR Generation",          desc: "Auto-populate Self Assessment Reports from your institution data. One click, fully formatted." },
  { icon: BookOpen,  title: "OBE Mapping",                     desc: "Map Course Outcomes to Program Outcomes seamlessly. Stay compliant with NBA criteria." },
  { icon: BarChart,  title: "Pre-Qualifier Scoring",           desc: "Real-time eligibility tracking across all NBA pre-qualifiers. Know where you stand before visit day." },
  { icon: Shield,    title: "Automated Attainment Calculations",desc: "Direct and indirect attainment computed automatically from assessment data." },
];

export default function NBASection() {
  return (
    <section id="nba" className="py-16 md:py-24 bg-[#F9FBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FFF0EB] text-[#FF6B4A] mb-4 uppercase tracking-wider"
          >
            Accreditation Module
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-[#182B68] mb-4"
          >
            Simplify <span style={{ color: "#FF6B4A" }}>NBA & NAAC</span> Accreditation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base"
          >
            India's most comprehensive accreditation platform. Reduce manual effort by 80% and walk into every NBA visit with confidence.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* NBA Node Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#EEF2FF] to-[#EFF6FF] border-2 border-dashed border-[#3D65F4]/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3D65F4] to-[#0EA5E9] flex items-center justify-center shadow-xl">
                  <span className="text-white font-black text-lg">NBA</span>
                </div>
              </div>
              {nodes.map((node, i) => {
                const rad = (node.angle - 90) * (Math.PI / 180);
                const r = 118;
                const x = 50 + (r / 144) * 50 * Math.cos(rad);
                const y = 50 + (r / 144) * 50 * Math.sin(rad);
                return (
                  <motion.div
                    key={node.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className="bg-white border border-[#3D65F4]/30 rounded-full px-2.5 py-1 text-[10px] md:text-xs font-semibold text-[#182B68] shadow-md whitespace-nowrap">
                      {node.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Features */}
          <div className="space-y-4 md:space-y-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start bg-white rounded-2xl p-4 md:p-5 border border-orange-50 hover:border-[#FF6B4A]/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-[#FF6B4A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#182B68]">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                </div>
                <CheckCircle size={16} className="text-green-400 shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
