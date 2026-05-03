import { motion } from "framer-motion";

function StudentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-[210px] border border-blue-50"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {["Personalisation", "Interview", "Career Paths", "Placement", "Internship", "Project"].map((tag, i) => (
          <span
            key={tag}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: ["#EEF2FF","#F0FFF4","#FFF7ED","#EFF6FF","#FDF2F8","#F0F9FF"][i % 6],
              color:      ["#3D65F4","#059669","#EA580C","#1D4ED8","#DB2777","#0284C7"][i % 6],
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="w-full h-24 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <circle cx="40" cy="28" r="14" fill="#93C5FD"/>
          <ellipse cx="40" cy="62" rx="22" ry="14" fill="#BFDBFE"/>
        </svg>
      </div>
    </motion.div>
  );
}

function AIAgentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75, duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-[230px] border border-blue-50"
    >
      <p className="text-xs font-bold text-[#182B68] mb-3">AI Faculty Agents</p>
      <div className="mb-3">
        <p className="text-[10px] text-gray-500 mb-1">Generating Course Material</p>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "62%" }}
            transition={{ delay: 1.2, duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-[#3D65F4] to-[#0EA5E9]"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12">
          <svg viewBox="0 0 48 48" className="w-12 h-12">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4"/>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#3D65F4" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 20 * 0.56} ${2 * Math.PI * 20 * 0.44}`}
              strokeDashoffset={2 * Math.PI * 20 * 0.25}
              strokeLinecap="round"/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#3D65F4]">56%</span>
        </div>
        <div>
          <p className="text-[9px] text-gray-400">Assignments</p>
          <p className="text-[9px] text-gray-400">Evaluated</p>
        </div>
        <div className="ml-auto bg-[#F0F4FF] text-[#3D65F4] text-[9px] font-semibold px-2 py-1 rounded-lg">
          Exam Prep
        </div>
      </div>
    </motion.div>
  );
}

function NBACard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-[220px] border border-blue-50"
    >
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <span className="text-[#3D65F4] font-black text-sm tracking-tight">NBA</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {["Scoring", "Attainments", "Pre-Qualifiers", "OBE", "Digital SAR"].map((node) => (
          <span key={node} className="bg-gray-50 border border-gray-200 text-[9px] text-gray-600 font-medium px-2 py-0.5 rounded-full">
            {node}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(61,101,244,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(61,101,244,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F9FBFF] pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          style={{
            background: "linear-gradient(135deg, #3D65F4 0%, #182B68 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          The Future Of Education Begins Here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-semibold text-[#182B68] mb-10"
        >
          Improve{" "}
          <span style={{ color: "#00C2CB" }}>Academics.</span>{" "}
          Maximize{" "}
          <span style={{ color: "#FF6B4A" }}>Placements.</span>
          <br />
          Simplify{" "}
          <span style={{ color: "#3D65F4" }}>Accreditation.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="/student/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-center"
            style={{ background: "linear-gradient(135deg, #3D65F4, #0EA5E9)" }}
          >
            Student Login
          </a>
          <a
            href="/faculty/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base border-2 border-[#3D65F4] text-[#3D65F4] hover:bg-[#EEF2FF] transition-all duration-300 text-center"
          >
            Faculty Login
          </a>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <StudentCard />
          <AIAgentCard />
          <NBACard />
        </div>
      </div>
    </section>
  );
}
