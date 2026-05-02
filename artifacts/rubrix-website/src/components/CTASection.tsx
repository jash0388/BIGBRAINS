import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-24 bg-[#F9FBFF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-[#182B68] mb-4 leading-tight">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Join 100+ institutions that have already elevated their academic outcomes, placement rates, and accreditation readiness with DataNauts.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "contact@datanauts.ai" },
                { icon: Phone, label: "+91 98765 43210" },
                { icon: MapPin, label: "Hyderabad, Telangana, India" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-gray-600">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
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
            className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl"
          >
            <h3 className="text-xl font-bold text-[#182B68] mb-6">Request A Demo</h3>
            <div className="space-y-4">
              {[
                { label: "Institution Name", placeholder: "e.g. MVSR Engineering College" },
                { label: "Your Name", placeholder: "e.g. Dr. K. Srinivasa Rao" },
                { label: "Email Address", placeholder: "contact@institution.ac.in" },
                { label: "Phone Number", placeholder: "+91 98765 43210" },
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
                style={{ background: "linear-gradient(135deg, #3D65F4, #5B3CF4)" }}
              >
                Request Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
