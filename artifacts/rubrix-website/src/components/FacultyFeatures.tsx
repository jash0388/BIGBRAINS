import { motion } from "framer-motion";
import { Cpu, FileText, BarChart2, Calendar } from "lucide-react";

const features = [
  { icon: FileText, title: "Auto-Generate Course Material", desc: "Create lecture notes, assignments, and question banks in seconds using AI trained on your syllabus." },
  { icon: Cpu, title: "AI Grading Assistant", desc: "Evaluate descriptive answers and assignments at scale. Consistent, unbiased, and instant feedback." },
  { icon: BarChart2, title: "Student Performance Analytics", desc: "Spot at-risk students early with predictive analytics. Intervene before it's too late." },
  { icon: Calendar, title: "Smart Curriculum Planning", desc: "Map learning outcomes to course objectives automatically. Stay aligned with OBE frameworks." },
];

export default function FacultyFeatures() {
  return (
    <section id="faculty" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-[#F9FBFF] rounded-3xl p-8 border border-blue-100 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3D65F4] to-[#5B3CF4] flex items-center justify-center">
                  <Cpu size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#182B68]">AI Faculty Agent</p>
                  <p className="text-xs text-gray-400">Active — Processing</p>
                </div>
              </div>

              {[
                { label: "Generating Course Material", pct: 78, color: "#3D65F4" },
                { label: "Evaluating Assignments", pct: 56, color: "#7C5CFC" },
                { label: "Building Question Bank", pct: 91, color: "#00C2CB" },
              ].map((item) => (
                <div key={item.label} className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold" style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Lectures Generated", value: "124" },
                  { label: "Students Assessed", value: "1,840" },
                  { label: "Hours Saved", value: "320" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-3 text-center border border-blue-50">
                    <p className="text-lg font-extrabold text-[#3D65F4]">{stat.value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#F5F0FF] text-[#7C5CFC] mb-4 uppercase tracking-wider">
              Faculty Module
            </span>
            <h2 className="text-4xl font-extrabold text-[#182B68] mb-4 leading-tight">
              AI Faculty Agents —{" "}
              <span style={{ color: "#7C5CFC" }}>Built for Modern Educators</span>
            </h2>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              Let AI handle the repetitive work. Faculty spend less time on paperwork and more time on what matters — inspiring students and driving outcomes.
            </p>
            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F5F0FF] flex items-center justify-center shrink-0">
                    <f.icon size={16} className="text-[#7C5CFC]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#182B68]">{f.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
