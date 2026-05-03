import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-[#F9FBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
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
              Rubrix is a student-led initiative by Big Brains — a startup born inside Sphoorthy Engineering College. We're building the tools we wish we had: smarter practice, faster feedback, and real results.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail,   label: "bigbrains@sphoorthyengg.ac.in"   },
                { icon: Phone,  label: "+91 98765 43210"                  },
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

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-blue-100 shadow-xl"
          >
            <h3 className="text-xl font-bold text-[#182B68] mb-1">Get Access</h3>
            <p className="text-xs text-gray-400 mb-6">Students & faculty at Sphoorthy can request an account below.</p>
            <div className="space-y-4">
              {[
                { label: "Full Name",    placeholder: "e.g. Neanavth Jashwanth Singh"     },
                { label: "Roll Number", placeholder: "e.g. 24N81A6758"                    },
                { label: "Department",  placeholder: "e.g. CSE – Data Science"            },
                { label: "Mobile",      placeholder: "+91 XXXXX XXXXX"                    },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-semibold text-[#182B68] mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#3D65F4] focus:ring-2 focus:ring-[#3D65F4]/10 transition-all"
                  />
                </div>
              ))}
              <button
                className="w-full py-4 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 mt-2"
                style={{ background: "linear-gradient(135deg, #3D65F4, #0EA5E9)" }}
              >
                Request Access
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
