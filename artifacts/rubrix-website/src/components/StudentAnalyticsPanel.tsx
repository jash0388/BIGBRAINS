import { useState, useEffect } from "react";
import {
  ArrowLeft, Trophy, Zap, Target, Code2, ExternalLink,
  Loader2, BarChart3, CheckCircle2, Clock, XCircle,
  Activity, Star,
} from "lucide-react";
import { fetchLCUser, type LCUserStats } from "../hooks/useLeetCode";
import {
  RegisteredStudent, CodeSubmission, TestSubmission, PracticeAttempt,
} from "../store/facultyDataStore";

interface Props {
  student:          RegisteredStudent;
  codeSubs:         CodeSubmission[];
  testSubs:         TestSubmission[];
  practiceAttempts: PracticeAttempt[];
  onBack:           () => void;
}

function StatBox({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-[#F9FBFF] rounded-xl p-3 text-center border border-blue-50">
      <p className={`text-xl font-extrabold ${color ?? "text-slate-800"}`}>{value}</p>
      <p className="text-[9px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function StudentAnalyticsPanel({ student, codeSubs, testSubs, practiceAttempts, onBack }: Props) {
  const lcUsername = student.leetcodeUsername || "";
  const hrUsername = student.hackerrankUsername || "";

  const [lcStats, setLcStats]       = useState<LCUserStats | null>(null);
  const [lcLoading, setLcLoading]   = useState(false);
  const [lcError, setLcError]       = useState(false);

  useEffect(() => {
    if (!lcUsername) return;
    setLcLoading(true);
    setLcError(false);
    fetchLCUser(lcUsername).then(d => {
      setLcStats(d);
      setLcLoading(false);
      if (!d) setLcError(true);
    });
  }, [lcUsername]);

  // Per-student stats
  const myCodeSubs     = codeSubs.filter(s => s.studentRoll === student.rollNumber);
  const myTestSubs     = testSubs.filter(s => s.studentRoll === student.rollNumber);
  const myAttempts     = practiceAttempts.filter(a => a.studentRoll === student.rollNumber);
  const approvedCode   = myCodeSubs.filter(s => s.status === "approved").length;
  const pendingCode    = myCodeSubs.filter(s => s.status === "pending").length;
  const rejectedCode   = myCodeSubs.filter(s => s.status === "rejected").length;
  const correctMCQ     = myAttempts.filter(a => a.isCorrect).length;
  const avgTestScore   = myTestSubs.length
    ? Math.round(myTestSubs.reduce((a, s) => a + s.percentage, 0) / myTestSubs.length)
    : 0;

  // LeetCode breakdown
  const lcUser     = lcStats?.matchedUser;
  const acNums     = lcUser?.submitStats.acSubmissionNum ?? [];
  const lcEasy     = acNums.find(n => n.difficulty === "Easy")?.count   ?? 0;
  const lcMedium   = acNums.find(n => n.difficulty === "Medium")?.count ?? 0;
  const lcHard     = acNums.find(n => n.difficulty === "Hard")?.count   ?? 0;
  const lcTotal    = acNums.find(n => n.difficulty === "All")?.count    ?? (lcEasy + lcMedium + lcHard);
  const lcRanking  = lcUser?.profile.ranking ?? 0;
  const lcStreak   = lcUser?.userCalendar?.streak ?? 0;
  const recentSubs = lcStats?.recentAcSubmissionList ?? [];

  const initials = student.fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "ST";

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
      {/* Back button + header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:border-gray-300 transition-colors">
          <ArrowLeft size={13} /> All Students
        </button>
        <div className="flex-1" />
      </div>

      {/* Student card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
          style={{ background: "linear-gradient(135deg,#3B82F6,#EC4899)" }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-extrabold text-slate-800">{student.fullName}</h2>
          <p className="text-[11px] text-gray-400 font-mono">{student.rollNumber}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {student.cgpa && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">CGPA {student.cgpa}</span>}
            {student.branch && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{student.branch.length > 22 ? "CSE – Data Science" : student.branch}</span>}
            {student.year && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">Year {student.year}</span>}
            {student.semester && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">SEM {student.semester}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          {student.email && <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{student.email}</p>}
          {student.mobile && <p className="text-[10px] text-gray-400">{student.mobile}</p>}
        </div>
      </div>

      {/* Overall platform activity */}
      <div>
        <p className="text-xs font-extrabold text-slate-700 mb-2 px-1">Platform Activity</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox label="Code Approved"  value={approvedCode}  color="text-green-600" />
          <StatBox label="Code Pending"   value={pendingCode}   color="text-amber-600" />
          <StatBox label="Tests Taken"    value={myTestSubs.length} color="text-blue-600" />
          <StatBox label="Avg Test Score" value={myTestSubs.length ? `${avgTestScore}%` : "—"} color="text-indigo-600" />
        </div>
      </div>

      {/* MCQ performance */}
      {myAttempts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-blue-500" />
            <p className="text-xs font-extrabold text-slate-800">MCQ Practice</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <p className="text-lg font-extrabold text-slate-800">{myAttempts.length}</p>
              <p className="text-[9px] text-gray-400">Attempted</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2 text-center">
              <p className="text-lg font-extrabold text-green-600">{correctMCQ}</p>
              <p className="text-[9px] text-gray-400">Correct</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-2 text-center">
              <p className="text-lg font-extrabold text-blue-600">
                {Math.round((correctMCQ / myAttempts.length) * 100)}%
              </p>
              <p className="text-[9px] text-gray-400">Accuracy</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${Math.round((correctMCQ / myAttempts.length) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Test results */}
      {myTestSubs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={14} className="text-indigo-500" />
            <p className="text-xs font-extrabold text-slate-800">Test Results</p>
          </div>
          <div className="space-y-2">
            {myTestSubs.map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700 truncate">{s.testTitle}</p>
                  <p className="text-[9px] text-gray-400">{new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs font-extrabold"
                    style={{ color: s.percentage >= 80 ? "#059669" : s.percentage >= 60 ? "#D97706" : "#DC2626" }}>
                    {s.percentage}%
                  </span>
                  <p className="text-[9px] text-gray-400">{s.score}/{s.totalMarks} pts</p>
                </div>
                <div className="w-16 bg-gray-100 rounded-full h-1.5 shrink-0">
                  <div className="h-1.5 rounded-full"
                    style={{
                      width: `${s.percentage}%`,
                      background: s.percentage >= 80 ? "#059669" : s.percentage >= 60 ? "#D97706" : "#DC2626",
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code submission history */}
      {myCodeSubs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-green-500" />
              <p className="text-xs font-extrabold text-slate-800">Code Submissions</p>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold">
              <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">{approvedCode} Approved</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{pendingCode} Pending</span>
              {rejectedCode > 0 && <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700">{rejectedCode} Rejected</span>}
            </div>
          </div>
          <div className="space-y-2">
            {myCodeSubs.slice(0, 8).map(s => (
              <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50">
                {s.status === "approved" ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                  : s.status === "rejected" ? <XCircle size={12} className="text-red-400 shrink-0" />
                    : <Clock size={12} className="text-amber-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700 truncate">{s.questionTitle}</p>
                  <p className="text-[9px] text-gray-400">{s.language} · {new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                  s.status === "approved" ? "bg-green-100 text-green-700"
                    : s.status === "rejected" ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LeetCode Section */}
      <div>
        <p className="text-xs font-extrabold text-slate-700 mb-2 px-1 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#FFA116]">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
          </svg>
          LeetCode Profile
        </p>

        {!lcUsername ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-4 text-xs text-orange-600 font-semibold">
            This student hasn't connected their LeetCode account yet.
          </div>
        ) : lcLoading ? (
          <div className="bg-white rounded-2xl border border-orange-100 p-4 flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={14} className="animate-spin text-orange-400" /> Fetching LeetCode stats for @{lcUsername}…
          </div>
        ) : lcError || !lcUser ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 text-xs text-orange-600 font-semibold">
            Couldn't load LeetCode data for "{lcUsername}". Profile may be private or username incorrect.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFA116" }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800">@{lcUser.username}</p>
                  {lcUser.profile.realName && <p className="text-[9px] text-gray-400">{lcUser.profile.realName}</p>}
                </div>
              </div>
              <a href={`https://leetcode.com/${lcUser.username}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:underline">
                <ExternalLink size={10} /> Profile
              </a>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Solved",  value: lcTotal,  color: "text-slate-800" },
                { label: "Easy",    value: lcEasy,   color: "text-green-600" },
                { label: "Medium",  value: lcMedium, color: "text-amber-600" },
                { label: "Hard",    value: lcHard,   color: "text-red-600"   },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-100">
              {lcRanking > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Trophy size={11} className="text-amber-400" />
                  <span>Global Rank <span className="font-bold">{lcRanking.toLocaleString()}</span></span>
                </div>
              )}
              {lcStreak > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Zap size={11} className="text-orange-400" />
                  <span><span className="font-bold">{lcStreak}</span> day streak</span>
                </div>
              )}
              {lcUser.userCalendar?.totalActiveDays != null && (
                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Activity size={11} className="text-blue-400" />
                  <span><span className="font-bold">{lcUser.userCalendar.totalActiveDays}</span> active days</span>
                </div>
              )}
            </div>

            {recentSubs.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-500 mb-2">Recent Accepted Submissions</p>
                <div className="space-y-1.5">
                  {recentSubs.slice(0, 8).map(s => (
                    <a key={s.id}
                      href={`https://leetcode.com/problems/${s.titleSlug}/`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group">
                      <CheckCircle2 size={11} className="text-green-500 shrink-0" />
                      <p className="text-[11px] font-semibold text-slate-700 flex-1 truncate">{s.title}</p>
                      <span className="text-[9px] text-gray-400 shrink-0">
                        {new Date(parseInt(s.timestamp) * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                      <ExternalLink size={9} className="text-gray-300 group-hover:text-green-500 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HackerRank Section */}
      {hrUsername && (
        <div>
          <p className="text-xs font-extrabold text-slate-700 mb-2 px-1 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#2EC866]">
              <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.143-.117-.258-.26-.258-.143 0-.258.115-.258.258v9.886c0 .143.115.258.258.258.143 0 .26-.115.26-.258v-4.255h4.074v4.255c0 .143.117.258.258.258.143 0 .258-.115.258-.258V7.057c0-.143-.115-.258-.258-.258z"/>
            </svg>
            HackerRank Profile
          </p>
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#2EC866" }}>
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="white">
                  <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.143-.117-.258-.26-.258-.143 0-.258.115-.258.258v9.886c0 .143.115.258.258.258.143 0 .26-.115.26-.258v-4.255h4.074v4.255c0 .143.117.258.258.258.143 0 .258-.115.258-.258V7.057c0-.143-.115-.258-.258-.258z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">@{hrUsername}</p>
                <p className="text-[10px] text-gray-400">HackerRank Profile</p>
              </div>
            </div>
            <a href={`https://www.hackerrank.com/profile/${hrUsername}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-white"
              style={{ background: "#2EC866" }}>
              <ExternalLink size={11} /> Open Profile
            </a>
          </div>
        </div>
      )}

      {/* No connected platforms fallback */}
      {!lcUsername && !hrUsername && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-2 text-center">
          <Star size={24} className="text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No coding platforms connected</p>
          <p className="text-xs text-gray-400">Student needs to connect their LeetCode/HackerRank account from Profile → Connect Accounts.</p>
        </div>
      )}
    </div>
  );
}
