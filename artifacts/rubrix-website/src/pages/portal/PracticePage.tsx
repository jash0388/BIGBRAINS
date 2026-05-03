import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, XCircle, Loader2, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getFacultyPracticeQuestions, savePracticeAttempt, upsertRegisteredStudent,
  FacultyPracticeQuestion, PracticeAttempt,
} from "../../store/facultyDataStore";

const DIFF_BADGE: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard:   "bg-red-100 text-red-700",
};
const DIFF_LABEL: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard",
};

export default function PracticePage() {
  const { student } = useAuth();
  const [questions, setQuestions] = useState<FacultyPracticeQuestion[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [answers, setAnswers]     = useState<Record<string, number | null>>({});
  const [revealed, setRevealed]   = useState<Record<string, boolean>>({});
  const [saving, setSaving]       = useState<Record<string, boolean>>({});

  useEffect(() => {
    getFacultyPracticeQuestions().then(qs => {
      setQuestions(qs);
      setLoading(false);
    });
  }, []);

  const filtered = questions.filter(q => {
    const matchSearch = !search
      || q.title.toLowerCase().includes(search.toLowerCase())
      || q.description.toLowerCase().includes(search.toLowerCase())
      || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = difficulty === "All" || q.difficulty === difficulty.toLowerCase();
    return matchSearch && matchDiff;
  });

  const handleReveal = async (q: FacultyPracticeQuestion) => {
    const chosen = answers[q.id];
    if (chosen === null || chosen === undefined) return;
    setSaving(s => ({ ...s, [q.id]: true }));
    setRevealed(r => ({ ...r, [q.id]: true }));

    const attempt: PracticeAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      studentRoll:   student?.rollNumber  || "guest",
      studentName:   student?.fullName    || "Guest",
      questionId:    q.id,
      questionTitle: q.title,
      chosenAnswer:  chosen,
      correctAnswer: q.correctAnswer,
      isCorrect:     chosen === q.correctAnswer,
      attemptedAt:   new Date().toISOString(),
    };

    // Save attempt and upsert student in parallel
    await Promise.all([
      savePracticeAttempt(attempt),
      student
        ? upsertRegisteredStudent({
            rollNumber:  student.rollNumber,
            fullName:    student.fullName,
            email:       student.email,
            mobile:      student.mobile,
            college:     student.college,
            branch:      student.branch,
            year:        student.year,
            semester:    student.semester,
            section:     student.section,
            cgpa:        student.cgpa,
            lastLoginAt: new Date().toISOString(),
          })
        : Promise.resolve(),
    ]);
    setSaving(s => ({ ...s, [q.id]: false }));
  };

  const totalRevealed  = Object.values(revealed).filter(Boolean).length;
  const totalCorrect   = questions.filter(q => revealed[q.id] && answers[q.id] === q.correctAnswer).length;

  return (
    <div className="min-h-full bg-[#F4F6FB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} color="white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800">Practice Questions</h1>
              <p className="text-[10px] text-gray-400">Faculty-curated MCQ questions from your BigBrains portal</p>
            </div>
            {totalRevealed > 0 && (
              <div className="ml-auto flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-1.5">
                <CheckCircle2 size={12} className="text-green-500" />
                <span className="text-[11px] font-bold text-green-700">{totalCorrect}/{totalRevealed} correct</span>
              </div>
            )}
          </div>

          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
              <Search size={14} className="text-gray-300 shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search questions, topics, tags…"
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-gray-300 focus:outline-none" />
            </div>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 bg-white focus:outline-none focus:border-blue-400">
              {["All", "Easy", "Medium", "Hard"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2 text-gray-400 text-sm">
            <Loader2 size={20} className="animate-spin text-blue-400" /> Loading questions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <ShieldCheck size={28} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold">
              {questions.length === 0 ? "No questions yet" : "No questions match your filter"}
            </p>
            <p className="text-xs text-gray-300 text-center max-w-xs">
              {questions.length === 0
                ? "Your faculty hasn't added any practice questions yet. Check back soon!"
                : "Try a different search or difficulty level."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-[10px] text-gray-400 font-semibold px-1">
              {filtered.length} question{filtered.length !== 1 ? "s" : ""} · attempt to auto-register your progress
            </p>
            {filtered.map((q, idx) => {
              const chosen     = answers[q.id] ?? null;
              const isRevealed = revealed[q.id];
              const isCorrect  = isRevealed && chosen === q.correctAnswer;
              return (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Question header */}
                  <div className="flex items-start gap-3 p-4 pb-3">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-800 leading-snug">{q.title}</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${DIFF_BADGE[q.difficulty]}`}>
                          {DIFF_LABEL[q.difficulty]}
                        </span>
                      </div>
                      {q.description && (
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">{q.description}</p>
                      )}
                      {q.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-2">
                          {q.tags.map(t => (
                            <span key={t} className="text-[9px] bg-blue-50 text-blue-500 font-semibold px-1.5 py-0.5 rounded-md">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="px-4 pb-3 space-y-1.5 pl-[52px]">
                    {q.options.map((opt, oi) => {
                      let borderColor = "#E5E7EB", bg = "white", color = "#374151", fw = "500";
                      if (isRevealed) {
                        if (oi === q.correctAnswer)     { borderColor = "#22C55E"; bg = "#F0FDF4"; color = "#15803D"; fw = "700"; }
                        else if (chosen === oi)         { borderColor = "#EF4444"; bg = "#FEF2F2"; color = "#DC2626"; fw = "600"; }
                      } else if (chosen === oi)         { borderColor = "#3B82F6"; bg = "#EFF6FF"; color = "#1D4ED8"; fw = "700"; }

                      return (
                        <button key={oi} disabled={isRevealed}
                          onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left text-xs transition-all"
                          style={{ borderColor, background: bg, color, fontWeight: fw }}>
                          <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold"
                            style={{ borderColor, background: (isRevealed && oi === q.correctAnswer) || (!isRevealed && chosen === oi) ? borderColor : "white", color: "white" }}>
                            {isRevealed && oi === q.correctAnswer ? "✓" : isRevealed && chosen === oi ? "✗" : String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-3 px-4 py-3 pl-[52px] border-t border-gray-50">
                    {!isRevealed ? (
                      <button onClick={() => handleReveal(q)} disabled={chosen === null || saving[q.id]}
                        className="flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-40"
                        style={{ background: chosen !== null ? "linear-gradient(135deg,#3B82F6,#0EA5E9)" : "#F1F5F9", color: chosen !== null ? "white" : "#94A3B8" }}>
                        {saving[q.id]
                          ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
                          : "Check Answer"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {isCorrect
                          ? <><CheckCircle2 size={14} className="text-green-500" /><span className="text-xs font-bold text-green-600">Correct!</span></>
                          : <><XCircle     size={14} className="text-red-500"   /><span className="text-xs font-bold text-red-600">Wrong</span></>}
                        {q.explanation && (
                          <span className="text-[10px] text-gray-400 ml-1 border-l border-gray-200 pl-2">{q.explanation}</span>
                        )}
                      </div>
                    )}
                    <span className="ml-auto text-[9px] text-gray-300 font-semibold">
                      {isRevealed ? (isCorrect ? "✓ answered" : "✗ attempted") : chosen !== null ? "option selected" : "pick an option"}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
