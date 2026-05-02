import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dr. K. Srinivasa Rao",
    title: "Principal, MVSR Engineering College",
    quote: "Rubrix.ai transformed how we approach NBA accreditation. What used to take months of manual work now happens automatically. Our SAR was ready in days.",
    initials: "KS",
    color: "#3D65F4",
  },
  {
    name: "Prof. Anitha Reddy",
    title: "Dean of Academics, KL University",
    quote: "The AI Faculty Agents are a game changer. My faculty spend 60% less time on routine tasks and more time mentoring students. Results speak for themselves.",
    initials: "AR",
    color: "#7C5CFC",
  },
  {
    name: "Dr. Ramesh Babu",
    title: "Training & Placement Officer, GITAM",
    quote: "Our placement numbers jumped 40% in the first year with Rubrix.ai. Students get personalized prep and we finally have visibility into their readiness.",
    initials: "RB",
    color: "#FF6B4A",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-[#182B68] mb-3">
            Loved by Institutions Across India
          </h2>
          <p className="text-gray-500">Real results from real educators</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#F9FBFF] rounded-2xl p-7 border border-blue-50 hover:shadow-lg transition-all"
            >
              <div className="flex mb-3 gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="#FBBF24" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[#182B68] text-sm leading-relaxed mb-5 font-medium">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#182B68]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
