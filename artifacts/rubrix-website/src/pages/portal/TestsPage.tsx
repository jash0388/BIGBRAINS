import { useState, useEffect, useRef } from "react";
import {
  ClipboardList, Clock, CheckCircle2, XCircle, AlertTriangle,
  Trophy, ChevronDown, ChevronUp, Maximize, Minimize,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getTests, saveSubmission, getSubmissions,
  FacultyTest, TestSubmission,
} from "../../store/facultyDataStore";

function pad(n: number) { return String(n).padStart(2, "0"); }

// ── Fullscreen helpers ────────────────────────────────────────────────────────
function enterFullscreen() {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
  };
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
}
function exitFullscreen() {
  const doc = document as Document & {
    webkitExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
  };
  if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
  else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
  else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function Timer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => setLeft(p => {
      if (p <= 1) { clearInterval(ref.current!); onExpire(); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(ref.current!);
  }, []);
  const pct = (left / seconds) * 100;
  const color = pct > 50 ? "#10B981" : pct > 20 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm" style={{ background: `${color}15`, color }}>
      <Clock size={13} />
      {pad(Math.floor(left / 60))}:{pad(left % 60)}
    </div>
  );
}

// ── Result + Answer Review ────────────────────────────────────────────────────
function ResultScreen({ sub, test, onBack }: { sub: TestSubmission; test: FacultyTest; onBack: () => void }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const pct   = sub.percentage;
  const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "F";
  const color = pct >= 60 ? "#10B981" : "#EF4444";
  const mins  = Math.floor(sub.timeTaken / 60);
  const secs  = sub.timeTaken % 60;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-2xl mx-auto w-full">
      {/* Score card */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${color}15` }}>
          <Trophy size={36} color={color} />
        </div>
        <div className="text-center">
          <p className="text-2xl font-extrabold text-slate-800">{Math.round(pct)}%</p>
          <p className="text-4xl font-black mt-1" style={{ color }}>Grade {grade}</p>
          <p className="text-sm text-gray-400 mt-1">{sub.testTitle}</p>
        </div>
        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { label: "Score",     value: `${sub.score}/${sub.totalMarks}` },
            { label: "Time",      value: `${mins}m ${pad(secs)}s` },
            { label: "Submitted", value: new Date(sub.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl p-3 border border-gray-100 text-center shadow-sm">
              <p className="text-sm font-extrabold text-slate-800">{c.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">Your result has been saved and sent to your faculty!</p>
      </div>

      {/* Answer review toggle */}
      <button
        onClick={() => setShowAnswers(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all mb-3"
        style={{ background: showAnswers ? "#EFF6FF" : "white", color: "#3B82F6", border: "1.5px solid #BFDBFE" }}>
        <span className="flex items-center gap-2">
          <ClipboardList size={15} />
          {showAnswers ? "Hide Answers" : "Review Answers"}
        </span>
        {showAnswers ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {/* Answer breakdown */}
      {showAnswers && (
        <div className="space-y-3 mb-6">
          {test.questions.map((q, idx) => {
            const chosen  = sub.answers[q.id] ?? null;
            const correct = q.correctAnswer;
            const isRight = chosen === correct;
            const skipped = chosen === null || chosen === undefined;
            return (
              <div key={q.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm"
                style={{ borderColor: skipped ? "#E5E7EB" : isRight ? "#BBF7D0" : "#FECACA" }}>
                {/* Question */}
                <div className="flex items-start gap-3 p-4 pb-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 text-white"
                    style={{ background: skipped ? "#9CA3AF" : isRight ? "#10B981" : "#EF4444" }}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{q.question}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{q.marks} {q.marks === 1 ? "mark" : "marks"}</p>
                  </div>
                  <div className="shrink-0">
                    {skipped
                      ? <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Skipped</span>
                      : isRight
                        ? <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">+{q.marks}</span>
                        : <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">0</span>}
                  </div>
                </div>

                {/* Options */}
                <div className="px-4 pb-4 space-y-1.5 pl-[52px]">
                  {q.options.map((opt, oi) => {
                    const isCorrectOpt = oi === correct;
                    const isChosen     = oi === chosen;
                    let bg = "white", border = "#E5E7EB", textColor = "#374151", fw = "500";
                    if (isCorrectOpt)              { bg = "#F0FDF4"; border = "#22C55E"; textColor = "#15803D"; fw = "700"; }
                    else if (isChosen && !isRight) { bg = "#FEF2F2"; border = "#EF4444"; textColor = "#DC2626"; fw = "600"; }
                    return (
                      <div key={oi}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs"
                        style={{ background: bg, borderColor: border, color: textColor, fontWeight: fw }}>
                        <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold"
                          style={{ borderColor: border, background: isCorrectOpt || (isChosen && !isRight) ? border : "white", color: "white" }}>
                          {isCorrectOpt ? "✓" : isChosen ? "✗" : String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrectOpt && <span className="text-[9px] font-bold text-green-600 shrink-0">Correct Answer</span>}
                        {isChosen && !isRight && <span className="text-[9px] font-bold text-red-500 shrink-0">Your Answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={onBack}
        className="w-full py-3 rounded-2xl font-bold text-sm text-white mb-6"
        style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
        Back to Tests
      </button>
    </div>
  );
}

// ── Take Test (fullscreen) ────────────────────────────────────────────────────
function TakeTest({ test, studentName, studentRoll, onDone }: {
  test: FacultyTest;
  studentName: string;
  studentRoll: string;
  onDone: (sub: TestSubmission) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [isFs, setIsFs]       = useState(false);
  const startRef = useRef(Date.now());

  // Enter fullscreen on mount
  useEffect(() => {
    enterFullscreen();
    const onFsChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    exitFullscreen();
    const timeTaken = Math.floor((Date.now() - startRef.current) / 1000);
    let score = 0, totalMarks = 0;
    test.questions.forEach(q => {
      totalMarks += q.marks;
      if (answers[q.id] === q.correctAnswer) score += q.marks;
    });
    const sub: TestSubmission = {
      id: `sub_${Date.now()}`,
      testId: test.id, testTitle: test.title,
      studentName, studentRoll,
      answers, score, totalMarks,
      percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
      timeTaken,
      submittedAt: new Date().toISOString(),
    };
    await saveSubmission(sub);
    setSaving(false);
    onDone(sub);
  };

  const answered = Object.keys(answers).length;
  const total    = test.questions.length;

  return (
    <div className="flex flex-col min-h-full bg-[#F4F6FB]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-slate-800 text-sm truncate">{test.title}</p>
          <p className="text-[10px] text-gray-400">{answered}/{total} answered</p>
        </div>
        <Timer seconds={test.duration * 60} onExpire={handleSubmit} />
        {/* Fullscreen toggle button */}
        <button
          onClick={() => isFs ? exitFullscreen() : enterFullscreen()}
          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          title={isFs ? "Exit fullscreen" : "Fullscreen"}>
          {isFs ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="space-y-5">
          {test.questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                <p className="text-sm font-semibold text-slate-800 flex-1">{q.question}</p>
                <span className="text-[10px] text-gray-400 shrink-0">{q.marks} {q.marks === 1 ? "mark" : "marks"}</span>
              </div>
              <div className="space-y-2 pl-8">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  return (
                    <button key={oi} onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm transition-all"
                      style={{
                        borderColor: selected ? "#3B82F6" : "#E5E7EB",
                        background:  selected ? "#EFF6FF" : "white",
                        color:       selected ? "#1D4ED8" : "#374151",
                        fontWeight:  selected ? 700 : 500,
                      }}>
                      <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold"
                        style={{ borderColor: selected ? "#3B82F6" : "#D1D5DB", background: selected ? "#3B82F6" : "white", color: "white" }}>
                        {selected ? "✓" : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit section */}
        <div className="mt-6 pb-8">
          {confirm ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <p className="text-sm font-bold text-amber-800">Submit Test?</p>
              </div>
              <p className="text-xs text-amber-700">You've answered {answered} of {total} questions. You cannot change answers after submitting.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600">Cancel</button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: "#10B981" }}>
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm Submit"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 8px 20px rgba(59,130,246,0.3)" }}>
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tests list page ───────────────────────────────────────────────────────────
export default function TestsPage() {
  const { student } = useAuth();
  const [tests, setTests]           = useState<FacultyTest[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [loading, setLoading]       = useState(true);
  const [active, setActive]         = useState<FacultyTest | null>(null);
  const [result, setResult]         = useState<{ sub: TestSubmission; test: FacultyTest } | null>(null);
  const myRoll = student?.rollNumber || "";

  const loadAll = async () => {
    setLoading(true);
    const [allTests, allSubs] = await Promise.all([getTests(), getSubmissions()]);
    setTests(allTests.filter(t => t.isActive));
    setSubmissions(allSubs.filter(s => s.studentRoll === myRoll));
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [myRoll]);

  const attempted = new Set(submissions.map(s => s.testId));

  // ── Result screen ──
  if (result) {
    return (
      <div className="flex flex-col h-full bg-[#F4F6FB]">
        <div className="bg-white border-b border-gray-100 px-4 py-3 shrink-0">
          <p className="text-xs font-bold text-slate-500">Test Complete</p>
        </div>
        <ResultScreen
          sub={result.sub}
          test={result.test}
          onBack={() => { setResult(null); setActive(null); loadAll(); }}
        />
      </div>
    );
  }

  // ── Test in progress ──
  if (active) {
    return (
      <TakeTest
        test={active}
        studentName={student?.fullName || student?.rollNumber || "Student"}
        studentRoll={myRoll}
        onDone={sub => setResult({ sub, test: active })}
      />
    );
  }

  // ── Tests list ──
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold">
          <span className="text-[#3B82F6]">Faculty</span>{" "}
          <span style={{ color: "#F59E0B" }}>Tests</span>
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Tests assigned by your faculty. Submit to send results directly to them.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400 text-sm">
          <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          Loading tests…
        </div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <ClipboardList size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold">No tests available yet</p>
          <p className="text-xs text-gray-300">Your faculty hasn't published any tests. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map(test => {
            const done  = attempted.has(test.id);
            const mySub = submissions.find(s => s.testId === test.id);
            return (
              <div key={test.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-extrabold text-slate-800">{test.title}</p>
                      {done && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle2 size={9} /> Submitted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{test.description}</p>
                    <div className="flex gap-3 text-[11px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={11} /> {test.duration} min</span>
                      <span>{test.questions.length} questions</span>
                      <span>{test.questions.reduce((a, q) => a + q.marks, 0)} marks</span>
                      <span className="text-[10px] text-gray-400">by {test.createdBy}</span>
                    </div>
                    {done && mySub && (
                      <div className="mt-2 flex gap-3 text-[11px] flex-wrap">
                        <span className="font-bold text-blue-600">Score: {mySub.score}/{mySub.totalMarks}</span>
                        <span className="font-bold" style={{ color: mySub.percentage >= 60 ? "#10B981" : "#EF4444" }}>{mySub.percentage}%</span>
                        <span className="text-gray-400">{Math.floor(mySub.timeTaken / 60)}m {pad(mySub.timeTaken % 60)}s</span>
                      </div>
                    )}
                  </div>
                  {!done ? (
                    <button onClick={() => setActive(test)}
                      className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                      Start Test
                    </button>
                  ) : (
                    <button
                      onClick={() => mySub && setResult({ sub: mySub, test })}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                      <ClipboardList size={12} /> Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past results */}
      {submissions.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">My Past Results</p>
          <div className="space-y-2">
            {[...submissions].reverse().map(s => {
              const t = tests.find(tt => tt.id === s.testId);
              return (
                <div key={s.id}
                  className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 hover:border-blue-100 transition-colors"
                  onClick={() => t && setResult({ sub: s, test: t })}
                  style={{ cursor: t ? "pointer" : "default" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: s.percentage >= 60 ? "#ECFDF5" : "#FEF2F2" }}>
                    {s.percentage >= 60
                      ? <CheckCircle2 size={15} className="text-green-600" />
                      : <XCircle size={15} className="text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{s.testTitle}</p>
                    <p className="text-[10px] text-gray-400">{new Date(s.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold" style={{ color: s.percentage >= 60 ? "#10B981" : "#EF4444" }}>{s.percentage}%</p>
                    <p className="text-[10px] text-gray-400">{s.score}/{s.totalMarks}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
