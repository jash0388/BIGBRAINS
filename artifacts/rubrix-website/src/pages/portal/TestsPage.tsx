import { useState, useEffect, useRef } from "react";
import { ClipboardList, Clock, CheckCircle2, XCircle, ArrowLeft, AlertTriangle, Trophy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getTests, saveSubmission, getSubmissions,
  FacultyTest, TestSubmission,
} from "../../store/facultyDataStore";

function pad(n: number) { return String(n).padStart(2, "0"); }

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

function ResultScreen({ sub, onBack }: { sub: TestSubmission; onBack: () => void }) {
  const pct = sub.percentage;
  const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "F";
  const color = pct >= 60 ? "#10B981" : "#EF4444";
  const mins = Math.floor(sub.timeTaken / 60);
  const secs = sub.timeTaken % 60;
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center max-w-md mx-auto w-full gap-5">
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
          { label: "Score", value: `${sub.score}/${sub.totalMarks}` },
          { label: "Time Taken", value: `${mins}m ${pad(secs)}s` },
          { label: "Submitted", value: new Date(sub.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-3 border border-gray-100 text-center shadow-sm">
            <p className="text-sm font-extrabold text-slate-800">{c.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">Your result has been saved to Supabase and sent to your faculty!</p>
      <button onClick={onBack} className="px-6 py-3 rounded-2xl font-bold text-sm text-white"
        style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
        Back to Tests
      </button>
    </div>
  );
}

function TakeTest({ test, studentName, studentRoll, onDone }: {
  test: FacultyTest; studentName: string; studentRoll: string; onDone: (sub: TestSubmission) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const startRef = useRef(Date.now());

  const handleSubmit = async () => {
    setSaving(true);
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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-2xl mx-auto w-full">
      <div className="sticky top-0 z-10 bg-[#F4F6FB] pb-3 pt-1 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-slate-800 text-sm truncate">{test.title}</p>
          <p className="text-[10px] text-gray-400">{answered}/{total} answered</p>
        </div>
        <Timer seconds={test.duration * 60} onExpire={handleSubmit} />
      </div>

      <div className="space-y-5 mt-2">
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
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style={{ background: "#10B981" }}>
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
  );
}

export default function TestsPage() {
  const { student } = useAuth();
  const [tests, setTests]           = useState<FacultyTest[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [loading, setLoading]       = useState(true);
  const [active, setActive]         = useState<FacultyTest | null>(null);
  const [result, setResult]         = useState<TestSubmission | null>(null);
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

  if (result) {
    return (
      <div className="flex flex-col h-full">
        <ResultScreen sub={result} onBack={() => { setResult(null); setActive(null); loadAll(); }} />
      </div>
    );
  }

  if (active) {
    return (
      <div className="flex flex-col" style={{ minHeight: "100%" }}>
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button onClick={() => setActive(null)} className="text-blue-500 flex items-center gap-1 text-xs font-semibold">
            <ArrowLeft size={14} /> Back
          </button>
          <p className="text-xs text-gray-400">Test in progress — do not close this page</p>
        </div>
        <TakeTest
          test={active}
          studentName={student?.fullName || student?.rollNumber || "Student"}
          studentRoll={myRoll}
          onDone={sub => { setResult(sub); }}
        />
      </div>
    );
  }

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
                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-green-600" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {submissions.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">My Past Results</p>
          <div className="space-y-2">
            {[...submissions].reverse().map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
