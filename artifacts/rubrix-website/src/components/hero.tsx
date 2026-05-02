import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, GraduationCap, CheckCircle2, TrendingUp, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            India's First Institutional Excellence Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            <span className="bg-gradient-to-r from-primary to-rubrix-navy bg-clip-text text-transparent">
              The Future Of Education Begins Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-rubrix-navy mb-10 leading-relaxed">
            Improve <span className="text-rubrix-teal">Academics.</span> Maximize <span className="text-rubrix-orange">Placements.</span> Simplify <span className="text-rubrix-purple">Accreditation.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/student/login"
              className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all bg-primary text-white hover:bg-[#2D55E4]"
            >
              Student Login
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold rounded-full border-2 border-primary text-primary hover:bg-blue-50 transition-all"
            >
              Faculty Login
            </a>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-rubrix-teal"></div>
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-rubrix-teal">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-4">Personalisation</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Interview', 'Career Paths', 'Placement', 'Internship', 'Project'].map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-50 rounded-md text-gray-600 border border-gray-100">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden transform md:-translate-y-8"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <h3 className="text-xl font-bold mb-6">AI Faculty Agents</h3>
            <div className="w-full space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>Generating Course Material</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-blue-50 p-3 rounded-lg">
                <CheckCircle2 className="text-green-500 w-8 h-8" />
                <div className="text-left">
                  <div className="font-bold text-lg">56%</div>
                  <div className="text-xs text-gray-600">Assignments Evaluated</div>
                </div>
              </div>
              <Button className="w-full mt-2 bg-primary text-white">Exam Prep</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-rubrix-purple"></div>
            <h3 className="text-xl font-bold text-rubrix-purple mb-6">Accreditation</h3>
            <div className="relative w-full h-32 flex items-center justify-center">
              <div className="absolute w-full flex justify-between px-4 z-10">
                <div className="bg-white text-xs font-bold px-2 py-1 rounded shadow border text-gray-700">Scoring</div>
                <div className="bg-white text-xs font-bold px-2 py-1 rounded shadow border text-gray-700">OBE</div>
              </div>
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-rubrix-purple shadow-inner z-20">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="absolute w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 20 50 Q 50 20 80 50" stroke="#7C5CFC" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                  <path d="M 20 50 Q 50 80 80 50" stroke="#7C5CFC" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded font-medium">Digital SAR</span>
              <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded font-medium">Attainments</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
