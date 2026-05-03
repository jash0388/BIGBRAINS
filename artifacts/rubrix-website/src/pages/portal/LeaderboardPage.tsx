import { useState, useEffect } from "react";
import { Trophy, Loader2, Code2, CheckCircle2, Target, Zap, Medal } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getRegisteredStudents, getPracticeAttempts, getCodeSubmissions,
  RegisteredStudent, PracticeAttempt, CodeSubmission,
} from "../../store/facultyDataStore";

interface LeaderEntry {
  rollNumber:    string;
  fullName:      string;
  branch:        string;
  year:          string;
  totalMcq:      number;
  correctMcq:    number;
  accuracy:      number;
  codeApproved:  number;
  codePending:   number;
  score:         number;
}

function computeScore(e: LeaderEntry) {
  // 3 pts per correct MCQ + 10 pts per approved code submission
  return e.correctMcq * 3 + e.codeApproved * 10;
}

const MEDAL = ["🥇", "🥈", "🥉"];
const RANK_GRAD = [
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#94A3B8,#64748B)",
  "linear-gradient(135deg,#B45309,#92400E)",
];

export default function LeaderboardPage() {
  const { student } = useAuth();
  const [loading, setLoading] = useState(true);
  const [board, setBoard]     = useState<LeaderEntry[]>([]);
  const [tab, setTab]         = useState<"overall" | "mcq" | "coding">("overall");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [students, attempts, codeSubs] = await Promise.all([
        getRegisteredStudents(),
        getPracticeAttempts(),
        getCodeSubmissions(),
      ]);

      // Build map from roll → entry
      const map = new Map<string, LeaderEntry>();

      const ensure = (roll: string, name: string, branch = "", year = "") => {
        if (!map.has(roll)) {
          map.set(roll, { rollNumber: roll, fullName: name, branch, year,
            totalMcq: 0, correctMcq: 0, accuracy: 0,
            codeApproved: 0, codePending: 0, score: 0 });
        }
        return map.get(roll)!;
      };

      // Seed from registered students (gives branch/year)
      students.forEach((s: RegisteredStudent) => {
        ensure(s.rollNumber, s.fullName, s.branch, s.year);
      });

      // Tally MCQ attempts
      (attempts as PracticeAttempt[]).forEach(a => {
        const e = ensure(a.studentRoll, a.studentName);
        e.totalMcq++;
        if (a.isCorrect) e.correctMcq++;
      });

      // Tally code submissions
      (codeSubs as CodeSubmission[]).forEach(s => {
        const e = ensure(s.studentRoll, s.studentName);
        if (s.status === "approved") e.codeApproved++;
        else if (s.status === "pending") e.codePending++;
      });

      // Compute derived fields
      const entries: LeaderEntry[] = [];
      map.forEach(e => {
        e.accuracy = e.totalMcq > 0 ? Math.round((e.correctMcq / e.totalMcq) * 100) : 0;
        e.score    = computeScore(e);
        if (e.totalMcq > 0 || e.codeApproved > 0 || e.codePending > 0) entries.push(e);
      });

      // Sort overall by score
      entries.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
      setBoard(entries);
      setLoading(false);
    })();
  }, []);

  const myRoll = student?.rollNumber;

  const sorted = tab === "mcq"
    ? [...board].sort((a, b) => b.accuracy - a.accuracy || b.correctMcq - a.correctMcq)
    : tab === "coding"
    ? [...board].sort((a, b) => b.codeApproved - a.codeApproved || b.codePending - a.codePending)
    : board;

  const myRank = sorted.findIndex(e => e.rollNumber === myRoll) + 1;

  const topThree = sorted.slice(0, 3);
  const rest     = sorted.slice(3);

  return (
    <div className="min-h-full bg-[#F4F6FB]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              <Trophy size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800">Leaderboard</h1>
              <p className="text-[10px] text-gray-400">
                {sorted.length} student{sorted.length !== 1 ? "s" : ""} ranked · 3 pts/correct MCQ · 10 pts/approved code
              </p>
            </div>
            {myRank > 0 && (
              <div className="ml-auto flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5 shrink-0">
                <Medal size={12} className="text-blue-500" />
                <span className="text-[11px] font-extrabold text-blue-600">Your rank: #{myRank}</span>
              </div>
            )}
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {(["overall", "mcq", "coding"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize"
                style={tab === t
                  ? { background: t === "overall" ? "linear-gradient(135deg,#F59E0B,#D97706)"
                      : t === "mcq" ? "linear-gradient(135deg,#3B82F6,#0EA5E9)"
                      : "linear-gradient(135deg,#10B981,#059669)", color: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }
                  : { background: "transparent", color: "#64748B" }}>
                {t === "overall" ? "🏆 Overall" : t === "mcq" ? "📝 MCQ" : "💻 Coding"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">

        {loading ? (
          <div className="flex items-center justify-center py-28 gap-2 text-gray-400 text-sm">
            <Loader2 size={20} className="animate-spin text-amber-400" /> Building leaderboard…
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Trophy size={28} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold">No activity yet</p>
            <p className="text-xs text-gray-300 text-center max-w-xs">
              Start answering practice MCQs or submit code solutions to appear on the leaderboard!
            </p>
          </div>
        ) : (
          <>
            {/* ── Top 3 podium ── */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {/* Reorder: 2nd | 1st | 3rd */}
                {([1, 0, 2] as number[]).map(idx => {
                  const e = topThree[idx];
                  if (!e) return <div key={idx} />;
                  const isMe = e.rollNumber === myRoll;
                  const heights = ["h-24", "h-32", "h-20"];
                  return (
                    <div key={e.rollNumber}
                      className={`flex flex-col items-center justify-end ${heights[idx]} rounded-2xl pt-3 pb-3 px-2 relative`}
                      style={{
                        background: isMe
                          ? "linear-gradient(135deg,#EFF6FF,#F0F9FF)"
                          : idx === 0 ? "linear-gradient(135deg,#FFFBEB,#FEF3C7)"
                          : "linear-gradient(135deg,#F8FAFC,#F1F5F9)",
                        border: isMe ? "2px solid #3B82F6" : idx === 0 ? "2px solid #F59E0B" : "1.5px solid #E2E8F0",
                        boxShadow: idx === 0 ? "0 8px 24px rgba(245,158,11,0.2)" : "0 4px 12px rgba(0,0,0,0.05)",
                      }}>
                      {isMe && (
                        <span className="absolute top-1.5 right-1.5 text-[8px] font-extrabold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">You</span>
                      )}
                      <div className="text-xl mb-1">{MEDAL[idx]}</div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-extrabold shrink-0 mb-1"
                        style={{ background: RANK_GRAD[idx] }}>
                        {e.fullName.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                      </div>
                      <p className="text-[10px] font-extrabold text-slate-800 text-center leading-tight line-clamp-2">{e.fullName.split(" ")[0]}</p>
                      <p className="text-[11px] font-extrabold mt-1"
                        style={{ color: idx === 0 ? "#D97706" : "#64748B" }}>
                        {tab === "coding" ? `${e.codeApproved} ✓` : tab === "mcq" ? `${e.accuracy}%` : `${e.score} pts`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Full ranked list ── */}
            <div className="space-y-2">
              {sorted.map((e, i) => {
                const isMe = e.rollNumber === myRoll;
                const rank = i + 1;
                return (
                  <div key={e.rollNumber}
                    className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border transition-all"
                    style={{
                      border: isMe ? "2px solid #3B82F6" : "1px solid #F1F5F9",
                      boxShadow: isMe ? "0 4px 20px rgba(59,130,246,0.12)" : "0 1px 6px rgba(0,0,0,0.04)",
                      background: isMe ? "linear-gradient(135deg,#FAFEFF,#EFF6FF)" : "white",
                    }}>

                    {/* Rank */}
                    <div className="w-8 text-center shrink-0">
                      {rank <= 3
                        ? <span className="text-lg leading-none">{MEDAL[rank - 1]}</span>
                        : <span className="text-xs font-extrabold text-gray-400">#{rank}</span>}
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
                      style={{ background: isMe ? "linear-gradient(135deg,#3B82F6,#0EA5E9)" : "linear-gradient(135deg,#94A3B8,#64748B)" }}>
                      {e.fullName.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-extrabold text-slate-800 truncate">{e.fullName}</p>
                        {isMe && <span className="text-[9px] font-extrabold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full shrink-0">You</span>}
                      </div>
                      <p className="text-[10px] font-mono text-gray-400">{e.rollNumber}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* MCQ */}
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Target size={10} className="text-blue-400" />
                          <span className="text-[11px] font-extrabold text-blue-600">{e.accuracy}%</span>
                        </div>
                        <span className="text-[9px] text-gray-300">{e.correctMcq}/{e.totalMcq}</span>
                      </div>

                      {/* Code */}
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Code2 size={10} className="text-green-400" />
                          <span className="text-[11px] font-extrabold text-green-600">{e.codeApproved}</span>
                        </div>
                        <span className="text-[9px] text-gray-300">approved</span>
                      </div>

                      {/* Score */}
                      <div className="flex flex-col items-center min-w-[40px]">
                        <div className="flex items-center gap-1">
                          <Zap size={10} className="text-amber-400" />
                          <span className="text-[13px] font-extrabold text-amber-600">{e.score}</span>
                        </div>
                        <span className="text-[9px] text-gray-300">pts</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <Target size={11} className="text-blue-400" /> MCQ accuracy
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <CheckCircle2 size={11} className="text-green-400" /> Approved code
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <Zap size={11} className="text-amber-400" /> Total score
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
