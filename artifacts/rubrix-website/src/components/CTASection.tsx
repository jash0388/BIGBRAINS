import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-[#F9FBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#182B68] mb-4 leading-tight">
              Built for Sphoorthy.<br />
              <span style={{ color: "#3D65F4" }}>By Students. For Everyone.</span>
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base">
              Rubrix is a student-led initiative by Big Brains — a startup born inside Sphoorthy Engineering College. We're building the tools we wished we had: smarter practice, faster feedback, and real results.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail,   label: "bigbrains@sphoorthyengg.ac.in"          },
                { icon: Phone,  label: "+91 80747 72823"                         },
                { icon: MapPin, label: "Sphoorthy Engineering College, Hyderabad" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-gray-600">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-[#3D65F4]" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — login CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 md:p-10 border border-blue-100 shadow-xl flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#3D65F4,#0EA5E9)" }}>
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                <rect x="2" y="2" width="12" height="12" rx="3" fill="white"/>
                <rect x="18" y="2" width="12" height="12" rx="3" fill="white" opacity="0.6"/>
                <rect x="2" y="18" width="12" height="12" rx="3" fill="white" opacity="0.6"/>
                <rect x="18" y="18" width="12" height="12" rx="3" fill="white"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#182B68] mb-2">Ready to get started?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Log in with your roll number as a student, or use the faculty code to access the dashboard.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a href="/student/login"
                className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm text-center shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#3D65F4,#0EA5E9)" }}>
                Student Login
              </a>
              <a href="/faculty/login"
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-center border-2 border-[#3D65F4] text-[#3D65F4] hover:bg-[#EEF2FF] transition-all">
                Faculty Login
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
