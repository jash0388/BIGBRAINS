import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { curriculum, type Course } from "../../data/curriculum";

function CourseDetail({ course }: { course: Course }) {
  const [openUnit, setOpenUnit] = useState<number | null>(0);
  return (
    <div className="h-full overflow-y-auto p-5 border-l border-gray-100">
      <div className="border border-[#3D65F4]/30 rounded-xl p-3 mb-4 bg-[#F9FBFF] flex items-center justify-between">
        <span className="text-sm font-bold text-[#182B68]">{course.name}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </div>
      <button className="w-full text-left flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg mb-4 hover:border-[#3D65F4] transition-colors text-sm text-[#182B68] font-medium">
        About &amp; Course Outcomes
      </button>
      <div className="space-y-2">
        {course.units.map((unit, ui) => (
          <div key={ui}>
            <button
              onClick={() => setOpenUnit(openUnit === ui ? null : ui)}
              className="w-full text-left px-3 py-2 rounded-lg bg-[#F0F4FF] hover:bg-[#E5ECFF] transition-colors"
            >
              <span className="text-xs font-semibold text-[#3D65F4]">{unit.title}</span>
            </button>
            {openUnit === ui && (
              <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#3D65F4]/30 pl-3">
                {unit.topics.map((topic, ti) => (
                  <div key={ti}>
                    <div className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#3D65F4]/50 cursor-pointer bg-white">
                      {topic}
                    </div>
                    {ti === Math.floor(unit.topics.length / 2) - 1 && (
                      <div className="space-y-1 my-1">
                        <div className="px-3 py-1.5 border border-yellow-200 rounded-lg bg-yellow-50 text-xs font-semibold text-yellow-700 text-center">Unit Test</div>
                        <div className="px-3 py-1.5 border border-red-200 rounded-lg bg-red-50 text-xs font-semibold text-red-700 text-center">Assignment</div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="space-y-1 mt-1">
                  <div className="px-3 py-1.5 border border-yellow-200 rounded-lg bg-yellow-50 text-xs font-semibold text-yellow-700 text-center">Unit Test</div>
                  <div className="px-3 py-1.5 border border-red-200 rounded-lg bg-red-50 text-xs font-semibold text-red-700 text-center">Assignment</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AcademicsPage() {
  const [selectedSem, setSelectedSem] = useState(4);
  const [showPractical, setShowPractical] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const semData = curriculum.find((s) => s.sem === selectedSem);
  const allCourses = semData?.courses || [];
  const courses = showPractical ? allCourses.filter((c) => c.type === "Lab") : allCourses;

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-4 pb-2 border-b border-gray-100">
        <span className="text-sm font-bold text-[#3D65F4] border-b-2 border-[#3D65F4] pb-1 inline-block">Curriculum</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[480px] shrink-0 p-5 overflow-y-auto border-r border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base font-extrabold text-[#182B68]">My Academic Courses</h1>
            <div className="relative">
              <select
                value={selectedSem}
                onChange={(e) => { setSelectedSem(Number(e.target.value)); setSelectedCourse(null); }}
                className="appearance-none pr-7 pl-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-[#182B68] bg-white focus:outline-none focus:border-[#3D65F4] cursor-pointer"
              >
                {curriculum.map((s) => (
                  <option key={s.sem} value={s.sem}>{s.label} — Year {s.year}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => { setShowPractical(false); setSelectedCourse(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${!showPractical ? "bg-[#3D65F4] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All Courses
            </button>
            <button
              onClick={() => { setShowPractical(true); setSelectedCourse(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${showPractical ? "bg-[#3D65F4] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Practical Courses
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {courses.map((course) => (
              <button
                key={course.code}
                onClick={() => setSelectedCourse(course)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  selectedCourse?.code === course.code
                    ? "border-[#3D65F4] bg-[#3D65F4] text-white shadow-md"
                    : "border-gray-200 hover:border-[#3D65F4] hover:shadow-sm bg-white"
                }`}
              >
                <p className={`text-[10px] font-bold mb-1 ${selectedCourse?.code === course.code ? "text-blue-200" : "text-[#3D65F4]"}`}>
                  {course.code}
                </p>
                <p className={`text-xs font-semibold leading-tight ${selectedCourse?.code === course.code ? "text-white" : "text-[#182B68]"}`}>
                  {course.name}
                </p>
              </button>
            ))}
          </div>
        </div>
        {/* Right panel */}
        <div className="flex-1 overflow-hidden">
          {selectedCourse ? (
            <CourseDetail course={selectedCourse} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300">
              <div className="text-center">
                <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium text-gray-400">Select a course to view syllabus</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
