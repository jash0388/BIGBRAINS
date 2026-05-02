import { useState, useEffect } from "react";
import { ChevronDown, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { curriculum, type Course } from "../../data/curriculum";
import { useAuth } from "../../context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SelectedTopic { unitTitle: string; topicName: string; }

// ─── Topic Learn View ─────────────────────────────────────────────────────────
function TopicLearnView({
  course,
  topic,
  onBack,
}: {
  course: Course;
  topic: SelectedTopic;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<"learn" | "quiz">("learn");
  const [studyMode, setStudyMode] = useState(false);
  const [markedDone, setMarkedDone] = useState(false);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left – narrow course outline */}
      <div className="w-52 shrink-0 border-r border-gray-100 overflow-y-auto">
        <button
          onClick={onBack}
          className="w-full flex items-center gap-2 px-4 py-3 border-b border-gray-100 text-xs font-bold text-[#3D65F4] hover:bg-[#F9FBFF] transition-colors"
        >
          <ChevronLeft size={14} /> {course.name}
        </button>
        <div className="p-3 space-y-1">
          <button className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-[#3D65F4] hover:bg-[#F9FBFF] transition-all">
            About &amp; Course Outcomes
          </button>
          {course.units.map((unit, ui) => (
            <div key={ui} className="mt-2">
              <p className="text-[10px] font-bold text-[#3D65F4] px-1 mb-1.5 leading-tight">{unit.title}</p>
              <div className="relative ml-2 pl-3 border-l-2 border-[#3D65F4]/20 space-y-1">
                {unit.topics.map((t, ti) => {
                  const isActive = t === topic.topicName;
                  return (
                    <div key={ti} className="relative">
                      <div className="absolute -left-[15px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-[#3D65F4]/40 bg-white" />
                      <div className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer leading-tight ${
                        isActive
                          ? "bg-[#3D65F4] text-white"
                          : "text-gray-600 hover:bg-[#F0F4FF]"
                      }`}>
                        {t}
                      </div>
                    </div>
                  );
                })}
                <div className="space-y-1 mt-1">
                  <div className="px-2 py-1.5 border border-yellow-200 rounded-lg bg-yellow-50 text-[10px] font-semibold text-yellow-700 text-center">Unit Test</div>
                  <div className="px-2 py-1.5 border border-red-200 rounded-lg bg-red-50 text-[10px] font-semibold text-red-600 text-center">Assignment</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right – content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex gap-4">
            {(["learn", "quiz"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm font-semibold capitalize border-b-2 pb-1 transition-all ${
                  tab === t ? "border-[#3D65F4] text-[#3D65F4]" : "border-transparent text-gray-400"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Study Mode</span>
              <button
                onClick={() => setStudyMode(s => !s)}
                className={`relative w-9 h-5 rounded-full transition-colors ${studyMode ? "bg-[#3D65F4]" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${studyMode ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>
            <button
              onClick={() => setMarkedDone(d => !d)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                markedDone
                  ? "border-green-300 text-green-600 bg-green-50"
                  : "border-[#3D65F4]/30 text-[#3D65F4] hover:bg-[#EEF2FF]"
              }`}
            >
              {markedDone ? "✓ Done" : "✓ Mark as Done"}
            </button>
          </div>
        </div>

        {tab === "learn" ? (
          <div className="px-8 py-6 max-w-3xl">
            <h1 className="text-2xl font-extrabold text-[#182B68] mb-4">
              Topic Overview: {topic.topicName}
            </h1>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Welcome to this topic in our course on <strong>{course.name}</strong>! In this session,
              we'll explore the concepts and principles that form the foundation of <em>{topic.topicName}</em>.
              Understanding this topic is not merely about memorizing definitions — it's about grasping
              the 'why' behind the 'what', and connecting theory with real-world applications.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              This unit — <strong>{topic.unitTitle}</strong> — sets the stage for everything that follows.
              By the end of this topic, you'll have a solid conceptual foundation that will help you
              excel in tests, assignments, and your overall academic journey.
            </p>

            <h2 className="text-lg font-extrabold text-[#182B68] mb-3">Background and Prerequisites</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Before diving in, make sure you're comfortable with the foundational concepts from earlier
              units. Prior knowledge of the subject area will significantly help your understanding of
              this topic.
            </p>

            <div className="bg-[#F9FBFF] border border-[#3D65F4]/20 rounded-xl p-4 mb-6">
              <p className="text-xs font-bold text-[#3D65F4] mb-2">Key Learning Objectives</p>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-2"><span className="text-[#3D65F4] font-bold mt-0.5">→</span> Understand the core concepts of {topic.topicName}</li>
                <li className="flex items-start gap-2"><span className="text-[#3D65F4] font-bold mt-0.5">→</span> Apply theoretical knowledge to practical problems</li>
                <li className="flex items-start gap-2"><span className="text-[#3D65F4] font-bold mt-0.5">→</span> Analyze and evaluate different approaches to the subject matter</li>
                <li className="flex items-start gap-2"><span className="text-[#3D65F4] font-bold mt-0.5">→</span> Prepare effectively for unit tests and final examinations</li>
              </ul>
            </div>

            <p className="text-[10px] text-gray-400 italic mb-4">Some of the content might be AI generated</p>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#FFB800]">⭐</span>
                <p className="text-xs font-bold text-gray-700">Resources</p>
              </div>
              <div className="bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity group">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[18px] border-t-transparent border-b-transparent border-l-white ml-1" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">{topic.topicName} — Video Lecture</p>
            </div>
          </div>
        ) : (
          <div className="px-8 py-6 max-w-2xl">
            <h2 className="text-xl font-extrabold text-[#182B68] mb-2">Quiz: {topic.topicName}</h2>
            <p className="text-sm text-gray-500 mb-6">Test your understanding with a quick quiz on this topic.</p>
            <div className="flex items-center justify-center py-12 flex-col gap-3 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
              <span className="text-3xl">📝</span>
              <p className="text-sm font-semibold">Quiz coming soon</p>
              <p className="text-xs text-gray-300">Questions for this topic will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Course Outline Panel ─────────────────────────────────────────────────────
function CourseOutline({
  course,
  onSelectTopic,
  onBack,
}: {
  course: Course;
  onSelectTopic: (t: SelectedTopic) => void;
  onBack?: () => void;
}) {
  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Mobile back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden flex items-center gap-1.5 text-xs font-bold text-blue-500 mb-3 px-1"
        >
          <ChevronLeft size={15} />
          All Courses
        </button>
      )}

      {/* Course header */}
      <div className="border-2 border-[#3D65F4]/20 rounded-xl p-3 mb-3 text-sm font-bold text-[#182B68] bg-[#F9FBFF] text-center">
        {course.name}
      </div>

      {/* About button */}
      <button className="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#3D65F4] hover:bg-[#F9FBFF] transition-all mb-4">
        About &amp; Course Outcomes
      </button>

      {/* Units */}
      <div className="space-y-5">
        {course.units.map((unit, ui) => (
          <div key={ui}>
            {/* Unit label */}
            <p className="text-[10px] font-extrabold text-[#3D65F4] uppercase tracking-wider mb-2.5 px-1">
              {unit.title}
            </p>

            {/* Topics — timeline with continuous line */}
            <div className="relative pl-5">
              {/* Continuous vertical line — from top of first dot to bottom of last dot */}
              <div
                className="absolute"
                style={{
                  left: 9,
                  top: 9,
                  bottom: 9,
                  width: 2,
                  background: "rgba(59,130,246,0.18)",
                  borderRadius: 2,
                }}
              />

              {unit.topics.map((topic, ti) => (
                <div key={ti} className="relative flex items-start gap-3 mb-2">
                  {/* Dot — centered on the line */}
                  <div
                    className="absolute rounded-full bg-white z-10"
                    style={{
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 10,
                      height: 10,
                      border: "2px solid rgba(59,130,246,0.45)",
                    }}
                  />
                  {/* Topic button */}
                  <button
                    onClick={() => onSelectTopic({ unitTitle: unit.title, topicName: topic })}
                    className="w-full text-left px-3 py-2 border border-gray-100 rounded-lg text-xs text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all bg-white"
                  >
                    {topic}
                  </button>
                </div>
              ))}
            </div>

            {/* Unit Test + Assignment — outside the timeline, as floating badges */}
            <div className="flex gap-2 mt-2 ml-8">
              <div className="flex-1 px-3 py-1.5 rounded-lg border border-yellow-200 bg-yellow-50 text-[10px] font-bold text-yellow-700 text-center">
                📝 Unit Test
              </div>
              <div className="flex-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-[10px] font-bold text-red-600 text-center">
                📋 Assignment
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function CourseCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="px-3 pt-3 pb-0">
        <div
          className="h-5 w-20 rounded-xl mb-2.5"
          style={{ background: "linear-gradient(90deg,#e8eaf6 25%,#d1d5f7 50%,#e8eaf6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }}
        />
      </div>
      <div className="px-3 pb-3 space-y-2">
        <div
          className="h-3 w-full rounded-lg"
          style={{ background: "linear-gradient(90deg,#f1f2fb 25%,#e4e6f7 50%,#f1f2fb 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.1s" }}
        />
        <div
          className="h-3 w-3/5 rounded-lg"
          style={{ background: "linear-gradient(90deg,#f1f2fb 25%,#e4e6f7 50%,#f1f2fb 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.2s" }}
        />
        <div
          className="h-4 w-12 rounded-lg mt-1"
          style={{ background: "linear-gradient(90deg,#e8eaf6 25%,#d1d5f7 50%,#e8eaf6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.15s" }}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AcademicsPage() {
  const { student } = useAuth();
  const [selectedSem, setSelectedSem]       = useState(4);
  const [showPractical, setShowPractical]   = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic]   = useState<SelectedTopic | null>(null);
  const [gridLoading, setGridLoading]       = useState(true);

  const semData    = curriculum.find(s => s.sem === selectedSem);
  const allCourses = semData?.courses || [];
  const courses    = showPractical ? allCourses.filter(c => c.type === "Lab") : allCourses;

  const branch  = student?.branch  || "B.Tech CSE (Data Science)";
  const college = student?.college || "Sphoorthy Engineering College";

  // Navigate between sems
  const semIndex   = curriculum.findIndex(s => s.sem === selectedSem);
  const prevSem    = semIndex > 0 ? curriculum[semIndex - 1] : null;
  const nextSem    = semIndex < curriculum.length - 1 ? curriculum[semIndex + 1] : null;

  // Trigger skeleton whenever sem changes
  useEffect(() => {
    setGridLoading(true);
    const t = setTimeout(() => setGridLoading(false), 650);
    return () => clearTimeout(t);
  }, [selectedSem, showPractical]);

  const handleSelectCourse = (c: Course) => {
    setSelectedCourse(c);
    setSelectedTopic(null);
  };

  // If a topic is selected — show the 3-panel Learn view
  if (selectedTopic && selectedCourse) {
    return (
      <TopicLearnView
        course={selectedCourse}
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab header */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-100 flex items-center gap-6">
        <span className="text-sm font-bold text-[#3D65F4] border-b-2 border-[#3D65F4] pb-2.5 inline-block">Curriculum</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left panel: Course grid ── (hidden on mobile when a course is selected) */}
        <div className={`shrink-0 border-r border-gray-100 overflow-y-auto transition-all
          ${selectedCourse
            ? "hidden md:block md:w-[400px]"
            : "w-full md:max-w-[600px]"
          }`}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-base font-extrabold text-[#182B68]">My Academic Courses</h1>
                <p className="text-[11px] text-gray-400 mt-0.5">{branch} · {college}</p>
              </div>

              {/* Semester selector */}
              <div className="relative">
                <select
                  value={selectedSem}
                  onChange={e => { setSelectedSem(Number(e.target.value)); setSelectedCourse(null); setSelectedTopic(null); }}
                  className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-[#182B68] bg-white focus:outline-none focus:border-[#3D65F4] cursor-pointer"
                >
                  {curriculum.map(s => <option key={s.sem} value={s.sem}>{s.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* All / Practical tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => prevSem && setSelectedSem(prevSem.sem)}
                disabled={!prevSem}
                className="p-1.5 border border-gray-200 rounded-lg hover:border-[#3D65F4] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => { setShowPractical(false); setSelectedCourse(null); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${!showPractical ? "bg-[#3D65F4] text-white border-[#3D65F4]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                All Courses
              </button>
              <button
                onClick={() => { setShowPractical(true); setSelectedCourse(null); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${showPractical ? "bg-[#3D65F4] text-white border-[#3D65F4]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                Practical Courses
              </button>
              <button
                onClick={() => nextSem && setSelectedSem(nextSem.sem)}
                disabled={!nextSem}
                className="p-1.5 border border-gray-200 rounded-lg hover:border-[#3D65F4] disabled:opacity-30 transition-colors ml-auto"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Course grid */}
            <div className="grid grid-cols-2 gap-3">
              {gridLoading
                ? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
                : courses.map(course => {
                const isActive = selectedCourse?.code === course.code;
                const typeGrad: Record<string, { grad: string; glow: string; badge: string; badgeText: string }> = {
                  Theory:   { grad: "135deg,#3B82F6,#60A5FA", glow: "#3B82F630", badge: "rgba(59,130,246,0.12)", badgeText: "#2563EB" },
                  Lab:      { grad: "135deg,#059669,#10B981", glow: "#05966930", badge: "rgba(5,150,105,0.12)",  badgeText: "#059669" },
                  Elective: { grad: "135deg,#06B6D4,#22D3EE", glow: "#06B6D430", badge: "rgba(6,182,212,0.12)",  badgeText: "#0891B2" },
                  Project:  { grad: "135deg,#EA580C,#F97316", glow: "#EA580C30", badge: "rgba(234,88,12,0.12)",  badgeText: "#EA580C" },
                };
                const t = typeGrad[course.type] || typeGrad.Theory;
                return (
                  <button
                    key={course.code}
                    onClick={() => handleSelectCourse(course)}
                    className="text-left rounded-2xl overflow-hidden transition-all duration-200 group"
                    style={isActive
                      ? { background: `linear-gradient(${t.grad})`, boxShadow: `0 8px 24px ${t.glow}`, border: "1.5px solid rgba(255,255,255,0.4)" }
                      : { background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }
                    }
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${t.glow}`; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                  >
                    {/* Glass code badge at top */}
                    <div className="px-3 pt-3 pb-0">
                      <div
                        className="inline-flex items-center px-2.5 py-1 rounded-xl mb-2.5"
                        style={isActive
                          ? { background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.35)" }
                          : { background: t.badge, border: `1px solid ${t.badgeText}22` }
                        }
                      >
                        <span
                          className="text-[9px] font-extrabold tracking-wide leading-tight"
                          style={{ color: isActive ? "#fff" : t.badgeText }}
                        >
                          {course.code}
                        </span>
                      </div>
                    </div>
                    {/* Name + type */}
                    <div className="px-3 pb-3">
                      <p className={`text-xs font-bold leading-snug mb-1.5 ${isActive ? "text-white" : "text-slate-800"}`}>
                        {course.name}
                      </p>
                      <span
                        className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-lg"
                        style={isActive
                          ? { background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }
                          : { background: t.badge, color: t.badgeText }
                        }
                      >
                        {course.type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right panel: Course outline OR empty (always visible on desktop, full-screen on mobile) ── */}
        <div className={`flex-1 overflow-hidden ${selectedCourse ? "block" : "hidden md:flex"}`}>
          {selectedCourse ? (
            <CourseOutline
              course={selectedCourse}
              onSelectTopic={t => setSelectedTopic(t)}
              onBack={() => setSelectedCourse(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={28} className="text-blue-400 opacity-60" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Select a course</p>
                <p className="text-xs text-gray-300 mt-1">to view full syllabus &amp; units</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
