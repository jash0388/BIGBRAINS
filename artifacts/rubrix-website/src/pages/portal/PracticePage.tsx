import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2, Loader2, Search, Code2, Send, ChevronDown, ChevronUp,
  Clock, XCircle, AlertCircle, RefreshCw, ExternalLink, Link2, Trophy,
  Zap, Target,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getCodingQuestions, saveCodeSubmission, getCodeSubmissions,
  CodingQuestion, CodeSubmission,
} from "../../store/facultyDataStore";
import { useLCProblems, fetchLCUser, type LCUserStats } from "../../hooks/useLeetCode";

const DIFF_BADGE: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard:   "bg-red-100 text-red-700",
};
const LC_DIFF_COLOR: Record<string, string> = {
  Easy:   "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-700",
};

const LS_LC = "dn_leetcode_user";

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

// ─── LeetCode User Stats Mini Card ────────────────────────────────────────────
function LCStatsCard({ username }: { username: string }) {
  const [stats, setStats]   = useState<LCUserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLCUser(username).then(d => { setStats(d); setLoading(false); });
  }, [username]);

  if (loading) return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4 flex items-center gap-2 text-sm text-gray-400">
      <Loader2 size={14} className="animate-spin text-orange-400" /> Loading your LeetCode stats…
    </div>
  );

  const user = stats?.matchedUser;
  if (!user) return (
    <div className="bg-orange-50 rounded-2xl border border-orange-200 px-4 py-3 text-xs text-orange-600 font-semibold">
      ⚠ Username "{username}" not found on LeetCode. Check your username in Profile → Connect Accounts.
    </div>
  );

  const acNums  = user.submitStats.acSubmissionNum;
  const easy    = acNums.find(n => n.difficulty === "Easy")?.count   ?? 0;
  const medium  = acNums.find(n => n.difficulty === "Medium")?.count ?? 0;
  const hard    = acNums.find(n => n.difficulty === "Hard")?.count   ?? 0;
  const total   = acNums.find(n => n.difficulty === "All")?.count    ?? (easy + medium + hard);
  const ranking = user.profile.ranking;
  const streak  = user.userCalendar?.streak ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#FFA116" }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800">{user.username}</p>
            <p className="text-[10px] text-gray-400">LeetCode Profile</p>
          </div>
        </div>
        <a href={`https://leetcode.com/${user.username}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:underline">
          <ExternalLink size={10} /> Open
        </a>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Solved",  value: total,   color: "text-slate-800" },
          { label: "Easy",    value: easy,    color: "text-green-600" },
          { label: "Medium",  value: medium,  color: "text-amber-600" },
          { label: "Hard",    value: hard,    color: "text-red-600"   },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-2 text-center">
            <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100">
        {ranking > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Trophy size={11} className="text-amber-400" />
            <span>Rank <span className="font-bold text-slate-700">{ranking.toLocaleString()}</span></span>
          </div>
        )}
        {streak > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Zap size={11} className="text-orange-400" />
            <span><span className="font-bold text-slate-700">{streak}</span> day streak</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LeetCode Problems Tab ────────────────────────────────────────────────────
function LeetCodeTab() {
  const lcUsername = localStorage.getItem(LS_LC) || "";
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch]         = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage]             = useState(0);
  const PAGE_SIZE = 30;

  const debouncedSearch = useCallback(
    (() => {
      let t: ReturnType<typeof setTimeout>;
      return (val: string) => { clearTimeout(t); t = setTimeout(() => setSearch(val || "All"), 500); };
    })(),
    [],
  );

  const { data, loading, error } = useLCProblems({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    difficulty: difficulty === "All" ? undefined : difficulty,
    search: search === "All" ? undefined : search,
  });

  return (
    <div className="space-y-4">
      {/* Stats card if username is set */}
      {lcUsername ? (
        <LCStatsCard username={lcUsername} />
      ) : (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
          <Link2 size={16} className="text-orange-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-orange-700">Connect your LeetCode account</p>
            <p className="text-[10px] text-orange-500 mt-0.5">Go to Profile → Connect Accounts to add your LeetCode username and see your personal stats.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Easy", "Medium", "Hard"].map(d => (
          <button key={d} onClick={() => { setDifficulty(d); setPage(0); }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors"
            style={difficulty === d
              ? { background: d === "All" ? "#3B82F6" : d === "Easy" ? "#10B981" : d === "Medium" ? "#F59E0B" : "#EF4444", color: "white", borderColor: "transparent" }
              : { background: "white", color: "#64748B", borderColor: "#E5E7EB" }}>
            {d}
          </button>
        ))}
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 min-w-[160px]">
          <Search size={13} className="text-gray-300 shrink-0" />
          <input
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); debouncedSearch(e.target.value); setPage(0); }}
            placeholder="Search problems…"
            className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-gray-300 focus:outline-none"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
          <Loader2 size={18} className="animate-spin text-orange-400" /> Loading LeetCode problems…
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <AlertCircle size={32} className="text-orange-300" />
          <p className="text-sm font-semibold">Couldn't load LeetCode problems</p>
          <p className="text-xs text-gray-300 text-center max-w-xs">LeetCode's API may be temporarily unavailable. Problems will load when the service is back.</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <p className="text-[10px] text-gray-400 font-semibold px-1">
            Showing {data.questions.length} of {data.total?.toLocaleString() ?? "—"} problems
          </p>
          <div className="space-y-2">
            {data.questions.map((q) => (
              <div key={q.titleSlug} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[9px] text-gray-400 font-mono shrink-0">#{q.frontendQuestionId}</span>
                    <p className="text-sm font-bold text-slate-800 truncate">{q.title}</p>
                    {q.paidOnly && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-yellow-100 text-yellow-700 shrink-0">Premium</span>}
                  </div>
                  <div className="flex gap-1.5 flex-wrap items-center">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${LC_DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
                    <span className="text-[9px] text-gray-300">·</span>
                    <span className="text-[9px] text-gray-400">{q.acRate.toFixed(1)}% acceptance</span>
                    {q.topicTags.slice(0, 3).map(t => (
                      <span key={t.slug} className="text-[9px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-md">{t.name}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={`https://leetcode.com/problems/${q.titleSlug}/`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-white shrink-0 transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#FFA116,#F59E0B)" }}>
                  <ExternalLink size={11} /> Solve
                </a>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-slate-600 disabled:opacity-30 hover:border-gray-300 transition-colors">
              ← Prev
            </button>
            <span className="text-[10px] text-gray-400 font-semibold">Page {page + 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={data.questions.length < PAGE_SIZE}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-slate-600 disabled:opacity-30 hover:border-gray-300 transition-colors">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Faculty Problems Tab (existing) ─────────────────────────────────────────
function FacultyProblemsTab() {
  const { student } = useAuth();
  const [codingQs, setCodingQs]     = useState<CodingQuestion[]>([]);
  const [loading, setLoading]       = useState(true);
  const [subMap, setSubMap]         = useState<Record<string, CodeSubmission>>({});
  const [codeMap, setCodeMap]       = useState<Record<string, string>>({});
  const [expandedQ, setExpandedQ]   = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [search, setSearch]         = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    const roll = student?.rollNumber;
    Promise.all([getCodingQuestions(), getCodeSubmissions()]).then(([qs, allSubs]) => {
      setCodingQs(qs);
      const map: Record<string, CodeSubmission> = {};
      const mine = allSubs.filter(s => !roll || s.studentRoll === roll);
      mine.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
      mine.forEach(s => { map[s.questionId] = s; });
      setSubMap(map);
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
      id: `cs_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      questionId: q.id, questionTitle: q.title,
      studentRoll: student?.rollNumber || "guest",
      studentName: student?.fullName   || "Guest",
      code, language: q.language,
      submittedAt: new Date().toISOString(),
      status: "pending", facultyNotes: "", reviewedAt: "",
    };
    await saveCodeSubmission(newSub);
    setSubMap(m => ({ ...m, [q.id]: newSub }));
    setSubmitting(s => ({ ...s, [q.id]: false }));
  };

  const counts = { easy: 0, medium: 0, hard: 0 };
  codingQs.forEach(q => { counts[q.difficulty]++; });

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap">
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

      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-4 focus-within:border-green-400 transition-colors">
        <Search size={14} className="text-gray-300 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search problems by name, topic or tag…"
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-gray-300 focus:outline-none" />
        {search && <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-2 text-gray-400 text-sm">
          <Loader2 size={20} className="animate-spin text-green-400" /> Loading problems…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <Code2 size={32} className="opacity-30" />
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
            const sub        = subMap[q.id];
            const status     = sub?.status;
            const isRejected = status === "rejected";
            const isLocked   = status === "pending" || status === "approved";

            return (
              <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
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
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${DIFF_BADGE[q.difficulty]}`}>{q.difficulty}</span>
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

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                    {isRejected && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle size={14} className="text-red-500 shrink-0" />
                          <p className="text-xs font-extrabold text-red-700">Submission Rejected</p>
                        </div>
                        {sub.facultyNotes
                          ? <p className="text-[11px] text-red-600 leading-relaxed ml-5"><span className="font-bold">Faculty note: </span>{sub.facultyNotes}</p>
                          : <p className="text-[11px] text-red-400 ml-5">No reason given. Please revise and resubmit.</p>}
                        <div className="flex items-center gap-1.5 mt-2 ml-5">
                          <RefreshCw size={11} className="text-red-400" />
                          <p className="text-[10px] text-red-500 font-semibold">Edit your code below and resubmit.</p>
                        </div>
                      </div>
                    )}
                    {status === "approved" && (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                        <div>
                          <p className="text-xs font-extrabold text-green-700">Approved by Faculty!</p>
                          {sub.facultyNotes && <p className="text-[11px] text-green-600 mt-0.5"><span className="font-bold">Note: </span>{sub.facultyNotes}</p>}
                        </div>
                      </div>
                    )}
                    {status === "pending" && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center gap-2">
                        <Clock size={14} className="text-amber-500 shrink-0" />
                        <div>
                          <p className="text-xs font-extrabold text-amber-700">Under Review</p>
                          <p className="text-[11px] text-amber-600 mt-0.5">Your solution has been submitted. Faculty will review it soon.</p>
                        </div>
                      </div>
                    )}
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
                        rows={10} spellCheck={false}
                        placeholder={`# Write your ${q.language} solution here…\n\ndef solution():\n    pass`}
                        className="w-full bg-slate-900 text-green-300 font-mono text-[12px] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y leading-relaxed placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      {isLocked ? (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                          style={{ background: status === "approved" ? "#F0FDF4" : "#FEFCE8", border: `1px solid ${status === "approved" ? "#BBF7D0" : "#FDE68A"}` }}>
                          {status === "approved"
                            ? <CheckCircle2 size={14} className="text-green-500" />
                            : <Clock size={14} className="text-amber-500" />}
                          <span className="text-xs font-bold" style={{ color: status === "approved" ? "#15803D" : "#92400E" }}>
                            {status === "approved" ? "Approved — well done!" : "Awaiting faculty review…"}
                          </span>
                        </div>
                      ) : (
                        <button onClick={() => handleSubmitCode(q)} disabled={!code.trim() || isSending}
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
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<"faculty" | "leetcode">("faculty");

  return (
    <div className="min-h-full bg-[#F4F6FB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
              <Code2 size={17} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800">Coding Practice</h1>
              <p className="text-[10px] text-gray-400">Faculty problems · LeetCode · Career prep</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            <button onClick={() => setActiveTab("faculty")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={activeTab === "faculty"
                ? { background: "white", color: "#10B981", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }
                : { color: "#94A3B8" }}>
              <Target size={12} /> Faculty Problems
            </button>
            <button onClick={() => setActiveTab("leetcode")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={activeTab === "leetcode"
                ? { background: "white", color: "#FFA116", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }
                : { color: "#94A3B8" }}>
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
              </svg>
              LeetCode
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        {activeTab === "faculty"   && <FacultyProblemsTab />}
        {activeTab === "leetcode"  && <LeetCodeTab />}
      </div>
    </div>
  );
}
