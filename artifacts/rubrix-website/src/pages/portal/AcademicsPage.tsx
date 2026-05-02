import { useState } from "react";
import { ChevronDown, BookOpen, ChevronRight } from "lucide-react";
import { curriculum, type Course } from "../../data/curriculum";

function UnitTestBadge() {
  return (
    <div className="px-3 py-1.5 border border-yellow-200 rounded-lg bg-yellow-50 text-xs font-semibold text-yellow-700 text-center">
      Unit Test
    </div>
  );
}

function AssignmentBadge() {
  return (
    <div className="px-3 py-1.5 border border-red-200 rounded-lg bg-red-50 text-xs font-semibold text-red-600 text-center">
      Assignment
    </div>
  );
}

function CourseDetail({ course }: { course: Course }) {
  const [openUnit, setOpenUnit] = useState<number | null>(0);

  return (
    <div className="h-full overflow-y-auto p-5">
      {/* Course header */}
      <div className="border-2 border-[#3D65F4]/25 rounded-xl p-3 mb-4 bg-[#F9FBFF] flex items-center justify-between">
        <span className="text-sm font-bold text-[#182B68]">{course.name}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </div>

      {/* About */}
      <button className="w-full text-left flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg mb-4 hover:border-[#3D65F4] hover:bg-[#F9FBFF] transition-all text-sm font-medium text-gray-700">
        About &amp; Course Outcomes
      </button>

      {/* Units */}
      <div className="space-y-2">
        {course.units.map((unit, ui) => (
          <div key={ui}>
            <button
              onClick={() => setOpenUnit(openUnit === ui ? null : ui)}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-[#F0F4FF] hover:bg-[#E5ECFF] transition-colors flex items-center justify-between"
            >
              <span className="text-xs font-bold text-[#3D65F4]">{unit.title}</span>
              <ChevronDown
                size={13}
                className={`text-[#3D65F4] transition-transform ${openUnit === ui ? "rotate-180" : ""}`}
              />
            </button>

            {openUnit === ui && (
              <div className="ml-3 mt-1.5 space-y-1 border-l-2 border-[#3D65F4]/20 pl-3 pb-1">
                {unit.topics.map((topic, ti) => (
                  <div key={ti}>
                    <div className="px-3 py-2 border border-gray-100 rounded-lg text-xs text-gray-700 hover:border-[#3D65F4]/40 hover:bg-[#F9FBFF] cursor-pointer transition-all bg-white flex items-center justify-between group">
                      <span>{topic}</span>
                      <ChevronRight size={11} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {ti === Math.ceil(unit.topics.length / 2) - 1 && (
                      <div className="space-y-1 my-1.5">
                        <UnitTestBadge />
                        <AssignmentBadge />
                      </div>
                    )}
                  </div>
                ))}
                {unit.topics.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <UnitTestBadge />
                    <AssignmentBadge />
                  </div>
                )}
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
    <div className="h-full flex flex-col bg-white">
      {/* Top tab */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-100">
        <span className="text-sm font-bold text-[#3D65F4] border-b-2 border-[#3D65F4] pb-2.5 inline-block">
          Curriculum
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[500px] shrink-0 p-5 overflow-y-auto border-r border-gray-100">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-base font-extrabold text-[#182B68]">My Academic Courses</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                B.Tech CSE (Data Science) · 2nd Year · Sphoorthy Engineering College
              </p>
            </div>
            <div className="relative">
              <select
                value={selectedSem}
                onChange={(e) => {
                  setSelectedSem(Number(e.target.value));
                  setSelectedCourse(null);
                  setShowPractical(false);
                }}
                className="appearance-none pr-7 pl-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-[#182B68] bg-white focus:outline-none focus:border-[#3D65F4] cursor-pointer hover:border-[#3D65F4] transition-colors"
              >
                {curriculum.map((s) => (
                  <option key={s.sem} value={s.sem}>
                    {s.label} — Year {s.year}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Tab pills */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => { setShowPractical(false); setSelectedCourse(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !showPractical ? "bg-[#3D65F4] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => { setShowPractical(true); setSelectedCourse(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                showPractical ? "bg-[#3D65F4] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Practical Courses
            </button>
            <span className="ml-auto text-[10px] text-gray-400 font-medium">
              {courses.length} courses
            </span>
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {courses.map((course) => {
              const isActive = selectedCourse?.code === course.code;
              const typeColor = { Theory: "#3D65F4", Lab: "#059669", Elective: "#7C5CFC", Project: "#FF6B4A" }[course.type];
              return (
                <button
                  key={course.code}
                  onClick={() => setSelectedCourse(course)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? "border-[#3D65F4] bg-[#3D65F4] shadow-md shadow-blue-200"
                      : "border-gray-200 hover:border-[#3D65F4]/50 hover:shadow-sm bg-white"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold mb-1.5 ${isActive ? "text-blue-200" : ""}`}
                    style={{ color: isActive ? undefined : typeColor }}
                  >
                    {course.code}
                  </p>
                  <p className={`text-xs font-semibold leading-tight ${isActive ? "text-white" : "text-[#182B68]"}`}>
                    {course.name}
                  </p>
                  <span
                    className={`inline-block text-[9px] font-bold mt-1.5 px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : course.type === "Lab"
                        ? "bg-green-50 text-green-600"
                        : course.type === "Elective"
                        ? "bg-purple-50 text-purple-600"
                        : course.type === "Project"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-[#EEF2FF] text-[#3D65F4]"
                    }`}
                  >
                    {course.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-hidden">
          {selectedCourse ? (
            <CourseDetail course={selectedCourse} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={28} className="text-[#3D65F4] opacity-50" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Select a course</p>
                <p className="text-xs text-gray-300 mt-1">to view full syllabus</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
