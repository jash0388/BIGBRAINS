import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, XCircle, Loader2, Search, Code2, Send, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getFacultyPracticeQuestions, savePracticeAttempt, upsertRegisteredStudent,
  getCodingQuestions, saveCodeSubmission,
  FacultyPracticeQuestion, PracticeAttempt, CodingQuestion,
} from "../../store/facultyDataStore";

const DIFF_BADGE: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard:   "bg-red-100 text-red-700",
};
const DIFF_LABEL: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard",
};

type ActiveSection = "mcq" | "coding";

export default function PracticePage() {
  const { student } = useAuth();
  const [section, setSection] = useState<ActiveSection>("mcq");

  // ── MCQ state ──
  const [questions, setQuestions]   = useState<FacultyPracticeQuestion[]>([]);
  const [loadingMcq, setLoadingMcq] = useState(true);
  const [search, setSearch]         = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [answers, setAnswers]       = useState<Record<string, number | null>>({});
  const [revealed, setRevealed]     = useState<Record<string, boolean>>({});
  const [saving, setSaving]         = useState<Record<string, boolean>>({});

  // ── Coding state ──
  const [codingQs, setCodingQs]         = useState<CodingQuestion[]>([]);
  const [loadingCode, setLoadingCode]   = useState(true);
  const [codeMap, setCodeMap]           = useState<Record<string, string>>({});
  const [expandedQ, setExpandedQ]       = useState<string | null>(null);
  const [submitting, setSubmitting]     = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted]       = useState<Record<string, boolean>>({});
  const [codeSearch, setCodeSearch]     = useState("");

  useEffect(() => {
    getFacultyPracticeQuestions().then(qs => { setQuestions(qs); setLoadingMcq(false); });
    getCodingQuestions().then(qs => { setCodingQs(qs); setLoadingCode(false); });
  }, []);

  // ── MCQ ──────────────────────────────────────────────────────────────────────

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
    await Promise.all([
      savePracticeAttempt(attempt),
      student
        ? upsertRegisteredStudent({
            rollNumber: student.rollNumber, fullName: student.fullName,
            email: student.email, mobile: student.mobile, college: student.college,
            branch: student.branch, year: student.year, semester: student.semester,
            section: student.section, cgpa: student.cgpa,
            lastLoginAt: new Date().toISOString(),
          })
        : Promise.resolve(),
    ]);
    setSaving(s => ({ ...s, [q.id]: false }));
  };

  const totalRevealed = Object.values(revealed).filter(Boolean).length;
  const totalCorrect  = questions.filter(q => revealed[q.id] && answers[q.id] === q.correctAnswer).length;

  // ── Coding ────────────────────────────────────────────────────────────────────

  const filteredCoding = codingQs.filter(q =>
    !codeSearch
      || q.title.toLowerCase().includes(codeSearch.toLowerCase())
      || q.description.toLowerCase().includes(codeSearch.toLowerCase())
      || q.tags.some(t => t.toLowerCase().includes(codeSearch.toLowerCase()))
  );

  const handleSubmitCode = async (q: CodingQuestion) => {
    const code = codeMap[q.id]?.trim();
    if (!code) return;
    setSubmitting(s => ({ ...s, [q.id]: true }));
    await saveCodeSubmission({
      id: `cs_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      questionId:    q.id,
      questionTitle: q.title,
      studentRoll:   student?.rollNumber || "guest",
      studentName:   student?.fullName   || "Guest",
      code,
      language:      q.language,
      submittedAt:   new Date().toISOString(),
      status:        "pending",
      facultyNotes:  "",
      reviewedAt:    "",
    });
    setSubmitted(s => ({ ...s, [q.id]: true }));
    setSubmitting(s => ({ ...s, [q.id]: false }));
  };

  return (
    <div className="min-h-full bg-[#F4F6FB]">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} color="white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800">Practice</h1>
              <p className="text-[10px] text-gray-400">Faculty-curated MCQ and coding problems</p>
            </div>
            {section === "mcq" && totalRevealed > 0 && (
              <div className="ml-auto flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-1.5">
                <CheckCircle2 size={12} className="text-green-500" />
                <span className="text-[11px] font-bold text-green-700">{totalCorrect}/{totalRevealed} correct</span>
              </div>
            )}
          </div>

          {/* Section toggle */}
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setSection("mcq")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={section === "mcq"
                ? { background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", color: "white", boxShadow: "0 2px 8px rgba(59,130,246,0.25)" }
                : { background: "transparent", color: "#64748B" }}>
              MCQ Questions
            </button>
            <button
              onClick={() => setSection("coding")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={section === "coding"
                ? { background: "linear-gradient(135deg,#10B981,#059669)", color: "white", boxShadow: "0 2px 8px rgba(16,185,129,0.25)" }
                : { background: "transparent", color: "#64748B" }}>
              <Code2 size={11} /> Coding
            </button>
          </div>
        </div>
      </div>

      {/* ── MCQ Section ── */}
      {section === "mcq" && (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          {/* Search + filter */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
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

          {loadingMcq ? (
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
                  ? "Your faculty hasn't added any MCQ questions yet. Check back soon!"
                  : "Try a different search or difficulty level."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] text-gray-400 font-semibold px-1">
                {filtered.length} question{filtered.length !== 1 ? "s" : ""} · attempt to auto-register your progress
              </p>
              {filtered.map((q, idx) => {
                const chosen     = answers[q.id] ?? null;
                const isRevealed = revealed[q.id];
                const isCorrect  = isRevealed && chosen === q.correctAnswer;
                return (
                  <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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

                    <div className="px-4 pb-3 space-y-1.5 pl-[52px]">
                      {q.options.map((opt, oi) => {
                        let borderColor = "#E5E7EB", bg = "white", color = "#374151", fw = "500";
                        if (isRevealed) {
                          if (oi === q.correctAnswer)   { borderColor = "#22C55E"; bg = "#F0FDF4"; color = "#15803D"; fw = "700"; }
                          else if (chosen === oi)       { borderColor = "#EF4444"; bg = "#FEF2F2"; color = "#DC2626"; fw = "600"; }
                        } else if (chosen === oi)       { borderColor = "#3B82F6"; bg = "#EFF6FF"; color = "#1D4ED8"; fw = "700"; }
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

                    <div className="flex items-center gap-3 px-4 py-3 pl-[52px] border-t border-gray-50">
                      {!isRevealed ? (
                        <button onClick={() => handleReveal(q)} disabled={chosen === null || saving[q.id]}
                          className="flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-40"
                          style={{ background: chosen !== null ? "linear-gradient(135deg,#3B82F6,#0EA5E9)" : "#F1F5F9", color: chosen !== null ? "white" : "#94A3B8" }}>
                          {saving[q.id] ? <><Loader2 size={11} className="animate-spin" /> Saving…</> : "Check Answer"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {isCorrect
                            ? <><CheckCircle2 size={14} className="text-green-500" /><span className="text-xs font-bold text-green-600">Correct!</span></>
                            : <><XCircle size={14} className="text-red-500" /><span className="text-xs font-bold text-red-600">Wrong</span></>}
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
            </div>
          )}
        </div>
      )}

      {/* ── Coding Section ── */}
      {section === "coding" && (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-green-400 transition-colors mb-4">
            <Search size={14} className="text-gray-300 shrink-0" />
            <input value={codeSearch} onChange={e => setCodeSearch(e.target.value)}
              placeholder="Search coding problems…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-gray-300 focus:outline-none" />
          </div>

          {loadingCode ? (
            <div className="flex items-center justify-center py-24 gap-2 text-gray-400 text-sm">
              <Loader2 size={20} className="animate-spin text-green-400" /> Loading problems…
            </div>
          ) : filteredCoding.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Code2 size={28} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold">
                {codingQs.length === 0 ? "No coding problems yet" : "No problems match your search"}
              </p>
              <p className="text-xs text-gray-300 text-center max-w-xs">
                {codingQs.length === 0
                  ? "Your faculty hasn't published any coding problems yet. Check back soon!"
                  : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] text-gray-400 font-semibold px-1">
                {filteredCoding.length} problem{filteredCoding.length !== 1 ? "s" : ""} · write your solution and submit for faculty review
              </p>
              {filteredCoding.map((q, idx) => {
                const isExpanded  = expandedQ === q.id;
                const isSubmitted = submitted[q.id];
                const isSending   = submitting[q.id];
                const code        = codeMap[q.id] || "";
                return (
                  <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Problem header */}
                    <button
                      className="w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-gray-50"
                      onClick={() => setExpandedQ(isExpanded ? null : q.id)}>
                      <span className="w-6 h-6 rounded-full bg-green-50 text-green-600 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-bold text-slate-800 leading-snug">{q.title}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-green-50 text-green-700">{q.language}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${DIFF_BADGE[q.difficulty]}`}>
                              {DIFF_LABEL[q.difficulty]}
                            </span>
                            {isExpanded ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{q.description}</p>
                        {q.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {q.tags.map(t => (
                              <span key={t} className="text-[9px] bg-green-50 text-green-600 font-semibold px-1.5 py-0.5 rounded-md">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Expanded editor */}
                    {isExpanded && (
                      <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
                        {/* Full description */}
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-slate-700 mb-1">Problem Statement</p>
                          <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">{q.description}</p>
                          {q.sampleInput && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-[10px] font-bold text-gray-500 mb-0.5">Example Input</p>
                              <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap">{q.sampleInput}</pre>
                            </div>
                          )}
                          {q.expectedOutput && (
                            <div className="mt-1">
                              <p className="text-[10px] font-bold text-gray-500 mb-0.5">Expected Output</p>
                              <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap">{q.expectedOutput}</pre>
                            </div>
                          )}
                        </div>

                        {/* Code editor */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Code2 size={12} className="text-green-500" /> Your Solution
                              <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{q.language}</span>
                            </p>
                            <span className="text-[9px] text-gray-300">{code.length} chars</span>
                          </div>
                          <textarea
                            value={code}
                            onChange={e => setCodeMap(m => ({ ...m, [q.id]: e.target.value }))}
                            disabled={isSubmitted}
                            rows={10}
                            spellCheck={false}
                            placeholder={`Write your ${q.language} solution here…\n\n# Example:\ndef solution():\n    pass`}
                            className="w-full bg-slate-900 text-green-300 font-mono text-[12px] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y leading-relaxed placeholder:text-slate-600 transition-all disabled:opacity-60"
                          />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between">
                          {isSubmitted ? (
                            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
                              <CheckCircle2 size={14} className="text-green-500" />
                              <span className="text-xs font-bold text-green-700">Submitted! Awaiting faculty review.</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSubmitCode(q)}
                              disabled={!code.trim() || isSending}
                              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                              style={{ background: code.trim() ? "linear-gradient(135deg,#10B981,#059669)" : "#E5E7EB" }}>
                              {isSending
                                ? <><Loader2 size={13} className="animate-spin" /> Submitting…</>
                                : <><Send size={13} /> Submit Solution</>}
                            </button>
                          )}
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                            <Clock size={11} />
                            <span>Faculty reviews submissions in the Reviews tab</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
