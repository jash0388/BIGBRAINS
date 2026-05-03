import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Search, Code2, Send, ChevronDown, ChevronUp, Clock, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getCodingQuestions, saveCodeSubmission, getCodeSubmissions,
  CodingQuestion, CodeSubmission,
} from "../../store/facultyDataStore";

const DIFF_BADGE: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard:   "bg-red-100 text-red-700",
};
const DIFF_LABEL: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard",
};

// Status pill shown in the problem header
function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved") return (
    <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
      <CheckCircle2 size={9} /> Approved
    </span>
  );
  if (status === "rejected") return (
    <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
      <XCircle size={9} /> Rejected
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
      <Clock size={9} /> Under Review
    </span>
  );
}

export default function PracticePage() {
  const { student } = useAuth();

  const [codingQs, setCodingQs]   = useState<CodingQuestion[]>([]);
  const [loading, setLoading]     = useState(true);
  // Map questionId → the student's latest submission for that question
  const [subMap, setSubMap]       = useState<Record<string, CodeSubmission>>({});
  // Map questionId → code the student is typing (for new/retry)
  const [codeMap, setCodeMap]     = useState<Record<string, string>>({});
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [search, setSearch]       = useState("");
  const [difficulty, setDifficulty] = useState("All");

  // Load problems + existing submissions together on mount
  useEffect(() => {
    const roll = student?.rollNumber;
    Promise.all([
      getCodingQuestions(),
      getCodeSubmissions(),
    ]).then(([qs, allSubs]) => {
      setCodingQs(qs);
      // Build a map: questionId → latest submission by this student
      const map: Record<string, CodeSubmission> = {};
      const mine = allSubs.filter(s => !roll || s.studentRoll === roll);
      // Sort by submittedAt ascending so the latest one wins
      mine.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
      mine.forEach(s => { map[s.questionId] = s; });
      setSubMap(map);
      // Pre-fill code box with previously submitted code (so they can see what they wrote)
      const codes: Record<string, string> = {};
      mine.forEach(s => { codes[s.questionId] = s.code; });
      setCodeMap(codes);
      setLoading(false);
    });
  }, [student?.rollNumber]);

  const filtered = codingQs.filter(q => {
    const matchSearch = !search
      || q.title.toLowerCase().includes(search.toLowerCase())
      || q.description.toLowerCase().includes(search.toLowerCase())
      || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = difficulty === "All" || q.difficulty === difficulty.toLowerCase();
    return matchSearch && matchDiff;
  });

  const handleSubmitCode = async (q: CodingQuestion) => {
    const code = codeMap[q.id]?.trim();
    if (!code) return;
    setSubmitting(s => ({ ...s, [q.id]: true }));

    const newSub: CodeSubmission = {
      id:            `cs_${Date.now()}_${Math.random().toString(36).slice(2)}`,
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
    };
    await saveCodeSubmission(newSub); // saveCodeSubmission already invalidates the cache internally
    setSubMap(m => ({ ...m, [q.id]: newSub }));
    setSubmitting(s => ({ ...s, [q.id]: false }));
  };

  const counts = { easy: 0, medium: 0, hard: 0 };
  codingQs.forEach(q => { counts[q.difficulty]++; });

  return (
    <div className="min-h-full bg-[#F4F6FB]">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
              <Code2 size={17} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800">Coding Practice</h1>
              <p className="text-[10px] text-gray-400">Write your solution · submit for faculty review</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100">
                {codingQs.length} problems
              </span>
            </div>
          </div>

          {/* Difficulty chips */}
          {!loading && (
            <div className="flex gap-2 mb-4">
              {(["All", "Easy", "Medium", "Hard"] as const).map(d => {
                const active = difficulty === d;
                const count  = d === "All" ? codingQs.length : counts[d.toLowerCase() as keyof typeof counts];
                return (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors"
                    style={active
                      ? { background: d === "All" ? "#3B82F6" : d === "Easy" ? "#10B981" : d === "Medium" ? "#F59E0B" : "#EF4444", color: "white", borderColor: "transparent" }
                      : { background: "white", color: "#64748B", borderColor: "#E5E7EB" }}>
                    {d} <span className="opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-green-400 transition-colors">
            <Search size={14} className="text-gray-300 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search problems by name, topic or tag…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-gray-300 focus:outline-none" />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Problem list ── */}
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2 text-gray-400 text-sm">
            <Loader2 size={20} className="animate-spin text-green-400" /> Loading problems…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Code2 size={28} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold">
              {codingQs.length === 0 ? "No coding problems yet" : "No problems match your filter"}
            </p>
            <p className="text-xs text-gray-300 text-center max-w-xs">
              {codingQs.length === 0
                ? "Your faculty hasn't published any coding problems yet. Check back soon!"
                : "Try a different search or difficulty level."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 font-semibold px-1 mb-2">
              {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
            </p>

            {filtered.map((q, idx) => {
              const isExpanded = expandedQ === q.id;
              const isSending  = submitting[q.id];
              const code       = codeMap[q.id] || "";
              const sub        = subMap[q.id]; // existing submission (if any)
              const status     = sub?.status;  // "pending" | "approved" | "rejected" | undefined
              const isRejected = status === "rejected";
              // Locked = pending or approved. Rejected can resubmit.
              const isLocked   = status === "pending" || status === "approved";

              return (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* Problem header */}
                  <button
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedQ(isExpanded ? null : q.id)}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold"
                      style={{
                        background: status === "approved" ? "#DCFCE7" : status === "rejected" ? "#FEE2E2" : status === "pending" ? "#FEF9C3" : "#F0FDF4",
                        color:      status === "approved" ? "#16A34A" : status === "rejected" ? "#DC2626" : status === "pending" ? "#CA8A04" : "#10B981",
                      }}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-800 leading-snug">{q.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                          {sub && <StatusBadge status={sub.status} />}
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">{q.language}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${DIFF_BADGE[q.difficulty]}`}>
                            {DIFF_LABEL[q.difficulty]}
                          </span>
                          {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{q.description}</p>
                      {q.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1.5">
                          {q.tags.map(t => (
                            <span key={t} className="text-[9px] bg-green-50 text-green-600 font-semibold px-1.5 py-0.5 rounded-md">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Expanded view */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">

                      {/* ── Rejection notice with faculty note ── */}
                      {isRejected && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle size={14} className="text-red-500 shrink-0" />
                            <p className="text-xs font-extrabold text-red-700">Submission Rejected</p>
                          </div>
                          {sub.facultyNotes ? (
                            <p className="text-[11px] text-red-600 leading-relaxed ml-5">
                              <span className="font-bold">Faculty note: </span>{sub.facultyNotes}
                            </p>
                          ) : (
                            <p className="text-[11px] text-red-400 ml-5">No reason given. Please revise and resubmit.</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-2 ml-5">
                            <RefreshCw size={11} className="text-red-400" />
                            <p className="text-[10px] text-red-500 font-semibold">Edit your code below and resubmit.</p>
                          </div>
                        </div>
                      )}

                      {/* ── Approved notice ── */}
                      {status === "approved" && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                          <div>
                            <p className="text-xs font-extrabold text-green-700">Approved by Faculty!</p>
                            {sub.facultyNotes && (
                              <p className="text-[11px] text-green-600 mt-0.5">
                                <span className="font-bold">Note: </span>{sub.facultyNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ── Pending notice ── */}
                      {status === "pending" && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center gap-2">
                          <Clock size={14} className="text-amber-500 shrink-0" />
                          <div>
                            <p className="text-xs font-extrabold text-amber-700">Under Review</p>
                            <p className="text-[11px] text-amber-600 mt-0.5">Your solution has been submitted. Faculty will review it soon.</p>
                          </div>
                        </div>
                      )}

                      {/* Problem statement */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-slate-700 mb-1.5">Problem Statement</p>
                        <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">{q.description}</p>
                        {q.sampleInput && (
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <p className="text-[10px] font-bold text-gray-500 mb-0.5">Example Input</p>
                            <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap bg-white rounded-lg p-2 mt-1">{q.sampleInput}</pre>
                          </div>
                        )}
                        {q.expectedOutput && (
                          <div className="mt-2">
                            <p className="text-[10px] font-bold text-gray-500 mb-0.5">Expected Output</p>
                            <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap bg-white rounded-lg p-2 mt-1">{q.expectedOutput}</pre>
                          </div>
                        )}
                      </div>

                      {/* Code editor */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Code2 size={12} className="text-green-500" />
                            {isLocked ? "Your Submitted Solution" : isRejected ? "Revise Your Solution" : "Your Solution"}
                            <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{q.language}</span>
                          </p>
                          {!isLocked && <span className="text-[9px] text-gray-300">{code.length} chars</span>}
                        </div>
                        <textarea
                          value={code}
                          onChange={e => !isLocked && setCodeMap(m => ({ ...m, [q.id]: e.target.value }))}
                          disabled={isLocked}
                          rows={10}
                          spellCheck={false}
                          placeholder={`# Write your ${q.language} solution here…\n\ndef solution():\n    pass`}
                          className="w-full bg-slate-900 text-green-300 font-mono text-[12px] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y leading-relaxed placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Submit / status row */}
                      <div className="flex items-center justify-between gap-3">
                        {isLocked ? (
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                            style={{ background: status === "approved" ? "#F0FDF4" : "#FEFCE8", border: `1px solid ${status === "approved" ? "#BBF7D0" : "#FDE68A"}` }}>
                            {status === "approved"
                              ? <CheckCircle2 size={14} className="text-green-500" />
                              : <Clock size={14} className="text-amber-500" />}
                            <span className="text-xs font-bold"
                              style={{ color: status === "approved" ? "#15803D" : "#92400E" }}>
                              {status === "approved" ? "Approved — well done!" : "Awaiting faculty review…"}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSubmitCode(q)}
                            disabled={!code.trim() || isSending}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-opacity"
                            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                            {isSending
                              ? <><Loader2 size={13} className="animate-spin" /> Submitting…</>
                              : isRejected
                                ? <><RefreshCw size={13} /> Resubmit Solution</>
                                : <><Send size={13} /> Submit Solution</>}
                          </button>
                        )}

                        {!sub && (
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                            <AlertCircle size={11} />
                            <span>Faculty reviews in Admin panel</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
