import { useState, useEffect, useRef } from "react";
import { ChevronDown, BookOpen, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, FileText, Upload, AlertCircle } from "lucide-react";
import { curriculum, type Course } from "../../data/curriculum";
import { useAuth } from "../../context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SelectedTopic { unitTitle: string; topicName: string; }
interface UnitTarget { course: Course; unit: { title: string; topics: string[] }; }

// ─── MCQ question generator (based on real topic names) ───────────────────────
function buildQuestions(unit: { title: string; topics: string[] }) {
  const t = unit.topics;
  const shuffled = [...t].sort(() => Math.random() - 0.5).slice(0, 5);
  return shuffled.map((topic, i) => {
    const wrongs = t.filter(x => x !== topic).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [topic, ...wrongs].sort(() => Math.random() - 0.5);
    const templates = [
      `Which concept is a fundamental part of ${unit.title.replace(/^Unit \w+: /, "")}?`,
      `What does the topic "${topic}" primarily focus on?`,
      `In the context of this unit, which of the following represents "${topic}"?`,
      `Which of the following best describes "${topic}"?`,
      `Which term is directly related to "${topic}" in this unit?`,
    ];
    return {
      id: i,
      question: templates[i % templates.length],
      options: opts,
      answer: topic,
    };
  });
}

// ─── Unit Test View ───────────────────────────────────────────────────────────
function UnitTestView({ target, onBack }: { target: UnitTarget; onBack: () => void }) {
  const [questions] = useState(() => buildQuestions(target.unit));
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (submitted) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setSubmitted(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [submitted]);

  const score = questions.filter(q => selected[q.id] === q.answer).length;
  const pct = Math.round((score / questions.length) * 100);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const timerRed = timeLeft < 120;

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-blue-500">
          <ChevronLeft size={15} /> Back
        </button>
        <div className="text-center">
          <p className="text-xs font-extrabold text-slate-800">Unit Test</p>
          <p className="text-[10px] text-gray-400">{target.unit.title.replace(/^Unit \w+: /, "")}</p>
        </div>
        {!submitted ? (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${timerRed ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
            <Clock size={11} /> {mm}:{ss}
          </div>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {submitted ? (
        /* ── Results ── */
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className={`rounded-2xl p-6 mb-6 text-center ${pct >= 60 ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
            <div className={`text-5xl font-extrabold mb-1 ${pct >= 60 ? "text-green-600" : "text-red-500"}`}>{pct}%</div>
            <p className={`text-sm font-bold ${pct >= 60 ? "text-green-700" : "text-red-600"}`}>
              {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good job!" : "Needs improvement"}
            </p>
            <p className="text-xs text-gray-500 mt-1">{score} / {questions.length} correct</p>
          </div>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAns = selected[q.id];
              const correct = userAns === q.answer;
              return (
                <div key={i} className={`rounded-xl p-4 border ${correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? <CheckCircle2 size={15} className="text-green-500 mt-0.5 shrink-0" /> : <XCircle size={15} className="text-red-400 mt-0.5 shrink-0" />}
                    <p className="text-xs font-semibold text-gray-800">{q.question}</p>
                  </div>
                  {!correct && (
                    <div className="ml-5 space-y-1">
                      <p className="text-[10px] text-red-500">Your answer: <span className="font-bold">{userAns || "Not answered"}</span></p>
                      <p className="text-[10px] text-green-600">Correct: <span className="font-bold">{q.answer}</span></p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={onBack} className="mt-6 w-full py-3 rounded-xl bg-blue-500 text-white text-sm font-bold">
            Back to Course
          </button>
        </div>
      ) : (
        /* ── Questions ── */
        <div className="max-w-xl mx-auto px-4 py-4 space-y-5 pb-32">
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
            <span>{target.course.name}</span>
            <span>{Object.keys(selected).length}/{questions.length} answered</span>
          </div>
          {questions.map((q, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-800 mb-1">Q{i + 1}.</p>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const letter = ["A", "B", "C", "D"][oi];
                  const isChosen = selected[q.id] === opt;
                  return (
                    <button
                      key={oi}
                      onClick={() => setSelected(s => ({ ...s, [q.id]: opt }))}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs transition-all ${
                        isChosen
                          ? "border-blue-400 bg-blue-50 text-blue-700 font-semibold"
                          : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 text-gray-600"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-extrabold shrink-0 ${isChosen ? "border-blue-400 bg-blue-500 text-white" : "border-gray-300 text-gray-400"}`}>
                        {letter}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit bar */}
      {!submitted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${(Object.keys(selected).length / questions.length) * 100}%` }} />
          </div>
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selected).length === 0}
            className="px-5 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold disabled:opacity-40 transition-opacity"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Assignment View ───────────────────────────────────────────────────────────
function AssignmentView({ target, onBack }: { target: UnitTarget; onBack: () => void }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const unitNum = target.unit.title.match(/Unit (\w+)/)?.[1] || "I";
  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-blue-500">
          <ChevronLeft size={15} /> Back
        </button>
        <div>
          <p className="text-xs font-extrabold text-slate-800">Assignment — Unit {unitNum}</p>
          <p className="text-[10px] text-gray-400">{target.course.name}</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-5 space-y-4 pb-10">
        {/* Meta */}
        <div className="flex gap-3">
          <div className="flex-1 bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
            <p className="text-[10px] text-orange-500 font-bold mb-0.5">DUE DATE</p>
            <p className="text-xs font-extrabold text-orange-700">{deadline}</p>
          </div>
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
            <p className="text-[10px] text-blue-500 font-bold mb-0.5">MAX MARKS</p>
            <p className="text-xs font-extrabold text-blue-700">20</p>
          </div>
          <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-3 text-center">
            <p className="text-[10px] text-green-500 font-bold mb-0.5">STATUS</p>
            <p className="text-xs font-extrabold text-green-700">{submitted ? "Submitted" : "Pending"}</p>
          </div>
        </div>

        {/* Description */}
        <div className="border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-blue-500" />
            <p className="text-xs font-extrabold text-slate-800">Assignment Description</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            This assignment covers the key concepts from <strong>{target.unit.title.replace(/^Unit \w+: /, "")}</strong> in <em>{target.course.name}</em>.
          </p>
          <div className="space-y-2">
            {target.unit.topics.map((topic, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-blue-400 font-bold mt-0.5">Q{i + 1}.</span>
                <span>Explain the concept of <strong>{topic}</strong> with a suitable example. How does it apply in real-world scenarios?</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle size={13} className="text-amber-500" />
            <p className="text-[10px] font-bold text-amber-700">SUBMISSION GUIDELINES</p>
          </div>
          <ul className="space-y-1 text-[10px] text-amber-700">
            <li>• Answer all questions clearly and concisely</li>
            <li>• Include diagrams or examples where applicable</li>
            <li>• Plagiarism will result in zero marks</li>
            <li>• Submit before the deadline to avoid late penalty</li>
          </ul>
        </div>

        {/* Submission box */}
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-extrabold text-green-700 mb-1">Assignment Submitted!</p>
            <p className="text-xs text-green-600">Your response has been recorded. Results will be published after evaluation.</p>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Your Answer</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Write your answers here... (Q1, Q2, Q3...)"
              rows={8}
              className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-700 resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <div className="flex items-center gap-3 mt-3">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-blue-300 transition-colors">
                <Upload size={13} /> Attach File
              </button>
              <button
                onClick={() => { if (answer.trim()) setSubmitted(true); }}
                disabled={!answer.trim()}
                className="flex-1 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold disabled:opacity-40 transition-opacity"
              >
                Submit Assignment
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">Your submission will be timestamped automatically</p>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [showTopicsDrawer, setShowTopicsDrawer] = useState(false);

  return (
    <div className="h-full flex overflow-hidden relative">
      {/* ── Left sidebar – hidden on mobile ── */}
      <div className="hidden md:block w-52 shrink-0 border-r border-gray-100 overflow-y-auto">
        <button
          onClick={onBack}
          className="w-full flex items-center gap-2 px-4 py-3 border-b border-gray-100 text-xs font-bold text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <ChevronLeft size={14} /> {course.name}
        </button>
        <div className="p-3 space-y-1">
          <button className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
            About &amp; Course Outcomes
          </button>
          {course.units.map((unit, ui) => (
            <div key={ui} className="mt-2">
              <p className="text-[10px] font-bold text-blue-500 px-1 mb-1.5 leading-tight">{unit.title}</p>
              <div className="relative ml-2 pl-3 border-l-2 border-blue-100 space-y-1">
                {unit.topics.map((t, ti) => {
                  const isActive = t === topic.topicName;
                  return (
                    <div key={ti} className="relative">
                      <div className="absolute -left-[15px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-blue-300 bg-white" />
                      <div className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer leading-tight ${
                        isActive ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-blue-50"
                      }`}>{t}</div>
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

      {/* ── Right – content (full width on mobile) ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button onClick={onBack} className="flex items-center gap-1 text-blue-500 text-xs font-bold">
            <ChevronLeft size={15} /> {course.name}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMarkedDone(d => !d)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                markedDone ? "border-green-300 text-green-600 bg-green-50" : "border-blue-200 text-blue-500"
              }`}
            >
              {markedDone ? "✓ Done" : "Mark Done"}
            </button>
            <button
              onClick={() => setShowTopicsDrawer(true)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-500 border border-blue-100"
            >
              Topics ☰
            </button>
          </div>
        </div>

        {/* Desktop tab bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex gap-4">
            {(["learn", "quiz"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm font-semibold capitalize border-b-2 pb-1 transition-all ${
                  tab === t ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Study Mode</span>
              <button onClick={() => setStudyMode(s => !s)}
                className={`relative w-9 h-5 rounded-full transition-colors ${studyMode ? "bg-blue-500" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${studyMode ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>
            <button onClick={() => setMarkedDone(d => !d)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                markedDone ? "border-green-300 text-green-600 bg-green-50" : "border-blue-200 text-blue-500 hover:bg-blue-50"
              }`}
            >
              {markedDone ? "✓ Done" : "✓ Mark as Done"}
            </button>
          </div>
        </div>

        {/* Mobile tab switcher */}
        <div className="md:hidden flex gap-1 px-4 pt-3 pb-2">
          {(["learn", "quiz"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                tab === t ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "learn" ? (
          <div className="px-4 md:px-8 py-4 md:py-6 max-w-3xl">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#182B68] mb-3 md:mb-4">
              Topic Overview: {topic.topicName}
            </h1>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Welcome to this topic in our course on <strong>{course.name}</strong>! In this session,
              we'll explore the concepts and principles that form the foundation of <em>{topic.topicName}</em>.
              Understanding this topic is not merely about memorizing definitions — it's about grasping
              the 'why' behind the 'what', and connecting theory with real-world applications.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-5">
              This unit — <strong>{topic.unitTitle}</strong> — sets the stage for everything that follows.
              By the end of this topic, you'll have a solid conceptual foundation that will help you
              excel in tests, assignments, and your overall academic journey.
            </p>
            <h2 className="text-base md:text-lg font-extrabold text-[#182B68] mb-2">Background and Prerequisites</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              Before diving in, make sure you're comfortable with the foundational concepts from earlier
              units. Prior knowledge of the subject area will significantly help your understanding of this topic.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
              <p className="text-xs font-bold text-blue-600 mb-2">Key Learning Objectives</p>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span> Understand the core concepts of {topic.topicName}</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span> Apply theoretical knowledge to practical problems</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span> Analyze and evaluate different approaches to the subject matter</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span> Prepare effectively for unit tests and final examinations</li>
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
          <div className="px-4 md:px-8 py-4 md:py-6 max-w-2xl">
            <h2 className="text-lg md:text-xl font-extrabold text-[#182B68] mb-2">Quiz: {topic.topicName}</h2>
            <p className="text-sm text-gray-500 mb-6">Test your understanding with a quick quiz on this topic.</p>
            <div className="flex items-center justify-center py-12 flex-col gap-3 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
              <span className="text-3xl">📝</span>
              <p className="text-sm font-semibold">Quiz coming soon</p>
              <p className="text-xs text-gray-300">Questions for this topic will appear here.</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Topics Drawer (bottom sheet) ── */}
      {showTopicsDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowTopicsDrawer(false)} />
          <div className="relative bg-white rounded-t-3xl max-h-[70vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              <p className="text-sm font-extrabold text-slate-800">Topics — {course.name}</p>
              <button onClick={() => setShowTopicsDrawer(false)} className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Done</button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3 pb-8">
              {course.units.map((unit, ui) => (
                <div key={ui}>
                  <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider mb-2">{unit.title}</p>
                  <div className="space-y-1">
                    {unit.topics.map((t, ti) => {
                      const isActive = t === topic.topicName;
                      return (
                        <button key={ti}
                          onClick={() => setShowTopicsDrawer(false)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive ? "bg-blue-500 text-white font-bold" : "bg-gray-50 text-gray-700"
                          }`}
                        >{t}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Course Outline Panel ─────────────────────────────────────────────────────
function CourseOutline({
  course,
  onSelectTopic,
  onUnitTest,
  onAssignment,
  onBack,
}: {
  course: Course;
  onSelectTopic: (t: SelectedTopic) => void;
  onUnitTest: (unit: { title: string; topics: string[] }) => void;
  onAssignment: (unit: { title: string; topics: string[] }) => void;
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
              {/* Continuous vertical line */}
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
                  {/* Dot */}
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

            {/* Unit Test + Assignment — real buttons */}
            <div className="flex gap-2 mt-2 ml-8">
              <button
                onClick={() => onUnitTest(unit)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-yellow-200 bg-yellow-50 text-[10px] font-bold text-yellow-700 text-center hover:bg-yellow-100 hover:border-yellow-300 active:scale-95 transition-all cursor-pointer"
              >
                📝 Unit Test
              </button>
              <button
                onClick={() => onAssignment(unit)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-[10px] font-bold text-red-600 text-center hover:bg-red-100 hover:border-red-300 active:scale-95 transition-all cursor-pointer"
              >
                📋 Assignment
              </button>
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
  const [selectedSem, setSelectedSem]         = useState(4);
  const [showPractical, setShowPractical]     = useState(false);
  const [selectedCourse, setSelectedCourse]   = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic]     = useState<SelectedTopic | null>(null);
  const [unitTestTarget, setUnitTestTarget]   = useState<UnitTarget | null>(null);
  const [assignmentTarget, setAssignmentTarget] = useState<UnitTarget | null>(null);
  const [gridLoading, setGridLoading]         = useState(true);

  const semData    = curriculum.find(s => s.sem === selectedSem);
  const allCourses = semData?.courses || [];
  const courses    = showPractical ? allCourses.filter(c => c.type === "Lab") : allCourses;

  const branch  = student?.branch  || "B.Tech CSE (Data Science)";
  const college = student?.college || "Sphoorthy Engineering College";

  const semIndex = curriculum.findIndex(s => s.sem === selectedSem);
  const prevSem  = semIndex > 0 ? curriculum[semIndex - 1] : null;
  const nextSem  = semIndex < curriculum.length - 1 ? curriculum[semIndex + 1] : null;

  useEffect(() => {
    setGridLoading(true);
    const t = setTimeout(() => setGridLoading(false), 650);
    return () => clearTimeout(t);
  }, [selectedSem, showPractical]);

  const handleSelectCourse = (c: Course) => {
    setSelectedCourse(c);
    setSelectedTopic(null);
    setUnitTestTarget(null);
    setAssignmentTarget(null);
  };

  const handleUnitTest = (course: Course, unit: { title: string; topics: string[] }) => {
    setUnitTestTarget({ course, unit });
    setAssignmentTarget(null);
    setSelectedTopic(null);
  };

  const handleAssignment = (course: Course, unit: { title: string; topics: string[] }) => {
    setAssignmentTarget({ course, unit });
    setUnitTestTarget(null);
    setSelectedTopic(null);
  };

  // Full-screen overlay views (highest priority)
  if (unitTestTarget) {
    return <UnitTestView target={unitTestTarget} onBack={() => setUnitTestTarget(null)} />;
  }
  if (assignmentTarget) {
    return <AssignmentView target={assignmentTarget} onBack={() => setAssignmentTarget(null)} />;
  }

  // Topic learn view
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
        {/* ── Left panel: Course grid ── */}
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

        {/* ── Right panel: Course outline OR empty ── */}
        <div className={`flex-1 overflow-hidden ${selectedCourse ? "block" : "hidden md:flex"}`}>
          {selectedCourse ? (
            <CourseOutline
              course={selectedCourse}
              onSelectTopic={t => setSelectedTopic(t)}
              onUnitTest={unit => handleUnitTest(selectedCourse, unit)}
              onAssignment={unit => handleAssignment(selectedCourse, unit)}
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
