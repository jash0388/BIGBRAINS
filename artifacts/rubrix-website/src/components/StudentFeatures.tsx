import { motion } from "framer-motion";
import { BookOpen, Briefcase, Target, TrendingUp, Users, Award } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Personalised Learning Paths", desc: "AI curates a unique academic roadmap for each student based on their goals, strengths, and placement targets." },
  { icon: Target, title: "AI Interview Preparation", desc: "Practice with AI-driven mock interviews tailored to your dream company and role — real questions, instant feedback." },
  { icon: TrendingUp, title: "Placement Analytics", desc: "Track your placement readiness score, skill gaps, and compare with peers in real time." },
  { icon: Briefcase, title: "Internship & Project Tracker", desc: "Log internships, projects, and certifications in one place. Auto-sync to your digital resume." },
  { icon: Users, title: "Mentorship Connect", desc: "Get matched with alumni mentors from top companies for guided career advice and referrals." },
  { icon: Award, title: "Skill Certifications", desc: "Complete skill tracks and earn verified badges recognized by 500+ hiring partners." },
];

export default function StudentFeatures() {
  return (
    <section id="students" className="py-24 bg-[#F9FBFF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#3D65F4] mb-4 uppercase tracking-wider">
              Student Module
            </span>
            <h2 className="text-4xl font-extrabold text-[#182B68] mb-4 leading-tight">
              Empower Every Student to Reach Their{" "}
              <span style={{ color: "#3D65F4" }}>Dream Career</span>
            </h2>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              From day one to placement day, DataNauts walks beside every student — building skills, tracking progress, and opening doors to the right opportunities.
            </p>
            <a
              href="/student/login"
              target={undefined}
              rel={undefined}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #3D65F4, #5B3CF4)" }}
            >
              Student Login
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-5 border border-blue-50 hover:border-[#3D65F4] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3 group-hover:bg-[#3D65F4] transition-colors">
                  <f.icon size={18} className="text-[#3D65F4] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-[#182B68] mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
