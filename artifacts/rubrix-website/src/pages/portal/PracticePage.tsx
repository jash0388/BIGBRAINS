import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, ArrowLeft, Play, Send, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useRubrixData } from "../../hooks/useRubrixData";
import { useAuth } from "../../context/AuthContext";
import { getFacultyPracticeQuestions, FacultyPracticeQuestion } from "../../store/facultyDataStore";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiQuestion {
  _id: string;
  name: string;
  description: string;
  difficulty_level: "easy" | "medium" | "hard";
  tags: string[];
  time_limit: number;
  memory_limit: number;
  sample_testcase: Array<{ testcase: string; output: string }>;
  is_active: boolean;
}
interface QuestionsResponse { questions: ApiQuestion[]; }
interface ProgressStats {
  problems_attempted: number;
  problems_completed: number;
  problems_in_progress: number;
  average_score: number;
  average_performance: string;
}
interface CodeLanguage { id: number; name: string; editor: string; }
type LanguagesMap = Record<string, CodeLanguage>;

// ─── Constants ────────────────────────────────────────────────────────────────
const DIFF_BADGE: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-orange-100 text-orange-700",
  hard:   "bg-red-100 text-red-700",
};
const DIFF_LABEL: Record<string, string> = {
  easy: "Beginner", medium: "Intermediate", hard: "Advanced",
};

const CODE_TEMPLATES: Record<string, string> = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code here
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    // your code here
    return 0;
}`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // your code here
    }
}`,
  python: `import sys
input = sys.stdin.readline

def solve():
    # your code here
    pass

solve()`,
  csharp: `using System;

class Program {
    static void Main() {
        // your code here
    }
}`,
  javascript: `process.stdin.resume();
process.stdin.setEncoding('utf8');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
    const lines = input.split('\\n');
    // your code here
});`,
  typescript: `process.stdin.resume();
process.stdin.setEncoding('utf8');
let input = '';
process.stdin.on('data', (d: string) => input += d);
process.stdin.on('end', () => {
    const lines = input.split('\\n');
    // your code here
});`,
  go: `package main

import "fmt"

func main() {
    _ = fmt.Println
    // your code here
}`,
  php: `<?php
// your code here
?>`,
  r: `# your code here`,
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Coding IDE ───────────────────────────────────────────────────────────────
function CodingIDE({ problem, onBack }: { problem: ApiQuestion; onBack: () => void }) {
  const { student } = useAuth();
  const { data: langsRaw } = useRubrixData<LanguagesMap>("node", "/student/code/languages");

  const languages: CodeLanguage[] = useMemo(() => {
    if (!langsRaw || typeof langsRaw !== "object") return [];
    return Object.values(langsRaw as LanguagesMap);
  }, [langsRaw]);

  const [selectedLangEditor, setSelectedLangEditor] = useState<string>("cpp");
  const [codeByLang, setCodeByLang] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [customInput, setCustomInput] = useState(problem.sample_testcase[0]?.testcase || "");
  // Mobile: which panel is visible
  const [mobilePanel, setMobilePanel] = useState<"problem" | "code">("problem");

  const currentLang = useMemo(() => {
    if (languages.length === 0) return null;
    return languages.find(l => l.editor === selectedLangEditor) || languages[0];
  }, [languages, selectedLangEditor]);

  const currentCode = codeByLang[selectedLangEditor] ?? CODE_TEMPLATES[selectedLangEditor] ?? "// your code here";

  const handleCodeChange = (val: string) => setCodeByLang(prev => ({ ...prev, [selectedLangEditor]: val }));
  const handleReset = () => { setCodeByLang(prev => ({ ...prev, [selectedLangEditor]: CODE_TEMPLATES[selectedLangEditor] || "" })); setOutput(null); };

  const handleRun = async () => {
    if (!currentLang) return;
    setRunning(true); setOutput(null);
    try {
      const raw = localStorage.getItem("dn_auth");
      const sess = raw ? JSON.parse(raw) : null;
      const jwt = sess?.token || "";
      const resp = await fetch("/api/proxy/node/student/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ language_id: currentLang.id, source_code: currentCode, stdin: customInput }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setOutput(data.stdout ?? data.stderr ?? data.output ?? JSON.stringify(data));
      } else { setOutput(`Run failed (${resp.status}). Please try again.`); }
    } catch { setOutput("Network error during code execution."); }
    setRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 shrink-0 gap-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold shrink-0">
          <ArrowLeft size={15} /> <span className="hidden sm:inline">Back to Practice</span><span className="sm:hidden">Back</span>
        </button>

        {/* Mobile panel toggle */}
        <div className="flex md:hidden items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
          <button onClick={() => setMobilePanel("problem")}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${mobilePanel === "problem" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
            Problem
          </button>
          <button onClick={() => { setMobilePanel("code"); }}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${mobilePanel === "code" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
            Code
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={handleReset} className="px-2.5 py-1.5 border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg transition-colors">Reset</button>
          <button className="px-2.5 py-1.5 border border-blue-400 text-xs font-semibold text-blue-500 rounded-lg transition-colors">Save</button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Problem panel — full width on mobile when mobilePanel=problem, hidden when code */}
        <div className={`border-r border-gray-200 overflow-y-auto p-4 md:p-5
          ${mobilePanel === "problem" ? "flex flex-col w-full md:w-[42%]" : "hidden md:flex md:flex-col md:w-[42%]"}`}>
          <h2 className="text-sm font-extrabold text-[#182B68] mb-3">{problem.name}</h2>
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_BADGE[problem.difficulty_level] || "bg-gray-100 text-gray-600"}`}>
              {DIFF_LABEL[problem.difficulty_level] || problem.difficulty_level}
            </span>
            {problem.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
          <div className="text-xs text-gray-700 leading-relaxed space-y-2 mb-4 [&_pre]:whitespace-pre-wrap [&_pre]:bg-transparent [&_pre]:font-sans"
            dangerouslySetInnerHTML={{ __html: problem.description }} />
          {problem.sample_testcase.map((tc, i) => (
            <div key={i} className="mb-3">
              <p className="text-xs font-bold text-gray-500 mb-1">Input {i + 1}</p>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 whitespace-pre-wrap">{tc.testcase}</pre>
              <p className="text-xs font-bold text-gray-500 mt-2 mb-1">Output {i + 1}</p>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 whitespace-pre-wrap">{tc.output}</pre>
            </div>
          ))}
          <div className="flex gap-4 text-[11px] text-gray-400 border-t pt-3 mt-auto">
            <span>Time: <strong className="text-gray-600">{problem.time_limit}s</strong></span>
            <span>Memory: <strong className="text-gray-600">{Math.round(problem.memory_limit / 1000)}MB</strong></span>
          </div>
          {/* Mobile: go to code button */}
          <button onClick={() => setMobilePanel("code")}
            className="md:hidden mt-4 w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2">
            <Play size={14} /> Open Code Editor
          </button>
        </div>

        {/* Editor panel — full width on mobile when mobilePanel=code */}
        <div className={`flex-col overflow-hidden
          ${mobilePanel === "code" ? "flex flex-1" : "hidden md:flex md:flex-1"}`}>
          {/* Language bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0 flex-wrap">
            <select value={selectedLangEditor} onChange={e => { setSelectedLangEditor(e.target.value); setOutput(null); }}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white focus:outline-none cursor-pointer">
              {languages.length > 0
                ? languages.map(l => <option key={l.id} value={l.editor}>{l.name}</option>)
                : Object.entries({ cpp: "C++", c: "C", java: "Java", python: "Python", csharp: "C#", javascript: "JS" }).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))
              }
            </select>
          </div>

          {/* Code textarea */}
          <textarea value={currentCode} onChange={e => handleCodeChange(e.target.value)}
            className="flex-1 font-mono text-[13px] bg-[#1E1E1E] text-[#D4D4D4] p-4 resize-none outline-none leading-relaxed"
            spellCheck={false} style={{ minHeight: 0 }} />

          {/* Output */}
          {output !== null && (
            <div className="border-t border-gray-700 bg-[#1a1a1a] px-4 py-3 max-h-36 overflow-y-auto shrink-0">
              <p className="text-[10px] font-bold text-gray-500 mb-1">Output</p>
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          )}

          {/* Bottom bar */}
          <div className="flex items-end gap-2 px-3 py-2.5 border-t border-gray-200 bg-white shrink-0">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 mb-1">Custom Input</p>
              <textarea value={customInput} onChange={e => setCustomInput(e.target.value)} rows={2}
                className="w-full text-xs font-mono border border-gray-200 rounded-lg px-2 py-1.5 resize-none outline-none focus:border-blue-400 transition-colors" />
            </div>
            <button onClick={handleRun} disabled={running}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#182B68] text-white text-xs font-bold disabled:opacity-60 transition-colors shrink-0">
              {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
              <span className="hidden sm:inline">Run Code</span><span className="sm:hidden">Run</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-bold transition-colors shrink-0">
              <Send size={13} /> <span className="hidden sm:inline">Submit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Key Metrics Sidebar ──────────────────────────────────────────────────────
function PracticeStatsSidebar() {
  const { data, loading } = useRubrixData<ProgressStats>("assessments", "/ourocode-dashboard/progress");
  const s = (data as ProgressStats) || {};
  const solved    = s.problems_completed   ?? 0;
  const attempted = s.problems_attempted   ?? 0;
  const inProg    = s.problems_in_progress ?? 0;
  const avgScore  = s.average_score        ?? 0;
  const perf      = s.average_performance  ?? (solved === 0 ? "Not started" : "In Progress");
  const pct       = Math.min(100, avgScore);
  const circ      = 2 * Math.PI * 28;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-[#182B68]">Key Metrics</p>
        {loading && <Loader2 size={13} className="animate-spin text-[#3D65F4]" />}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: String(solved),    label: "Problems Solved",    color: "text-[#3D65F4]" },
          { value: perf,              label: "Avg. Performance",   color: "text-green-500" },
          { value: String(attempted), label: "Problems Attempted", color: "text-[#3D65F4]" },
          { value: String(inProg),    label: "In Progress",        color: "text-[#3D65F4]" },
        ].map(m => (
          <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className={`text-xl font-extrabold ${m.color}`}>{m.value}</p>
            <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-gray-50 rounded-xl p-3 text-center">
        <div className="relative w-16 h-16 mx-auto mb-2">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="6" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="#3D65F4" strokeWidth="6"
              strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#3D65F4]">
            {pct > 0 ? `${Math.round(pct)}%` : "0%"}
          </span>
        </div>
        <p className="text-[9px] text-gray-400">Average Test Score</p>
      </div>
    </div>
  );
}

// ─── Practice List ────────────────────────────────────────────────────────────
const VISIBLE_TAGS = 7;

function PracticeListView({ onSelect }: { onSelect: (q: ApiQuestion) => void }) {
  const { data: tagsRaw, loading: tagsLoading } = useRubrixData<string[]>("assessments", "/ourocode/questions/tags");
  const { data: qRaw, loading: qLoading } = useRubrixData<QuestionsResponse>("assessments", "/ourocode/questions");

  const allTags = useMemo(() => {
    const raw = Array.isArray(tagsRaw) ? (tagsRaw as string[]) : [];
    return ["All", ...raw];
  }, [tagsRaw]);

  const questions: ApiQuestion[] = useMemo(() => {
    const r = qRaw as QuestionsResponse | null;
    return r?.questions?.filter(q => q.is_active) || [];
  }, [qRaw]);

  const [search, setSearch]         = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [tagOffset, setTagOffset]   = useState(0);

  const visibleTags = allTags.slice(tagOffset, tagOffset + VISIBLE_TAGS);

  const filtered = useMemo(() => questions.filter(q => {
    const matchSearch = !search
      || q.name.toLowerCase().includes(search.toLowerCase())
      || stripHtml(q.description).toLowerCase().includes(search.toLowerCase());
    const matchTag  = selectedTag === "All" || q.tags.includes(selectedTag);
    const matchDiff = difficulty === "All" || q.difficulty_level === difficulty.toLowerCase();
    return matchSearch && matchTag && matchDiff;
  }), [questions, search, selectedTag, difficulty]);

  const loading = tagsLoading || qLoading;

  return (
    <div className="flex flex-1 overflow-hidden p-4 md:p-5 gap-5 min-h-0">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <h2 className="text-xl font-extrabold mb-4">
          <span className="text-[#3D65F4]">Search for concepts</span>{" "}
          <span className="text-[#FF6B4A]">to practice</span>
        </h2>

        {/* Search + difficulty filter */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 mb-3 focus-within:border-[#3D65F4] bg-white transition-colors">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300"
            placeholder="Search for what you want to practice"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1 border-l pl-3 border-gray-200 shrink-0">
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="text-xs font-semibold text-gray-500 bg-transparent outline-none cursor-pointer"
            >
              {["All", "Easy", "Medium", "Hard"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Tag chips */}
        {!tagsLoading && allTags.length > 1 && (
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setTagOffset(Math.max(0, tagOffset - 1))}
              disabled={tagOffset === 0}
              className="p-1 rounded border border-gray-200 hover:border-[#3D65F4] disabled:opacity-30 transition-colors shrink-0"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="flex gap-1.5 overflow-hidden flex-1">
              {visibleTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? "bg-[#3D65F4] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              onClick={() => setTagOffset(Math.min(allTags.length - VISIBLE_TAGS, tagOffset + 1))}
              disabled={tagOffset + VISIBLE_TAGS >= allTags.length}
              className="p-1 rounded border border-gray-200 hover:border-[#3D65F4] disabled:opacity-30 transition-colors shrink-0"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
            <Loader2 size={18} className="animate-spin text-[#3D65F4]" /> Loading practice problems…
          </div>
        )}

        {/* Faculty MCQ questions */}
        <FacultyMCQSection />

        {/* API Problems list */}
        <div className="space-y-3">
          {filtered.map(q => (
            <div
              key={q._id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3D65F4] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-1.5">
                <h3 className="text-sm font-bold text-[#182B68]">{q.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${DIFF_BADGE[q.difficulty_level] || "bg-gray-100 text-gray-600"}`}>
                  {DIFF_LABEL[q.difficulty_level] || q.difficulty_level}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2.5">{stripHtml(q.description)}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {q.tags.map(t => (
                    <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => onSelect(q)}
                  className="text-xs font-semibold text-[#3D65F4] hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                >
                  Practice <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-10">No problems found for this filter.</p>
          )}
        </div>
      </div>

      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block w-60 shrink-0">
        <PracticeStatsSidebar />
      </div>
    </div>
  );
}

// ─── Faculty MCQ Section ───────────────────────────────────────────────────────
function FacultyMCQSection() {
  const questions = getFacultyPracticeQuestions();
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (questions.length === 0) return null;

  const DIFF_BADGE: Record<string, string> = {
    easy:   "bg-green-100 text-green-700",
    medium: "bg-orange-100 text-orange-700",
    hard:   "bg-red-100 text-red-700",
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-lg bg-blue-500 flex items-center justify-center">
          <ShieldCheck size={11} color="white" />
        </div>
        <p className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">Faculty Added Questions</p>
        <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">{questions.length} MCQ</span>
      </div>
      <div className="space-y-3">
        {questions.map((q: FacultyPracticeQuestion) => {
          const chosen = answers[q.id] ?? null;
          const isRevealed = revealed[q.id];
          return (
            <div key={q.id} className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-bold text-slate-800">{q.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${DIFF_BADGE[q.difficulty] || "bg-gray-100 text-gray-600"}`}>
                  {q.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{q.description}</p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  let style = "border-gray-200 bg-white text-gray-700";
                  if (isRevealed) {
                    if (oi === q.correctAnswer) style = "border-green-400 bg-green-50 text-green-800 font-bold";
                    else if (chosen === oi) style = "border-red-300 bg-red-50 text-red-700";
                  } else if (chosen === oi) {
                    style = "border-blue-400 bg-blue-50 text-blue-800 font-bold";
                  }
                  return (
                    <button key={oi} disabled={isRevealed}
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs text-left transition-all ${style}`}>
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 text-[9px] font-bold">
                        {isRevealed && oi === q.correctAnswer ? "✓" : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-3">
                {!isRevealed ? (
                  <button
                    onClick={() => setRevealed(r => ({ ...r, [q.id]: true }))}
                    disabled={chosen === null}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-lg disabled:opacity-40 transition-all"
                    style={{ background: chosen !== null ? "linear-gradient(135deg,#3B82F6,#0EA5E9)" : "#F1F5F9", color: chosen !== null ? "white" : "#94A3B8" }}>
                    Check Answer
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {chosen === q.correctAnswer
                      ? <><CheckCircle2 size={13} className="text-green-500" /><span className="text-[11px] font-bold text-green-600">Correct!</span></>
                      : <><span className="text-[11px] font-bold text-red-600">Wrong.</span></>
                    }
                    {q.explanation && <span className="text-[10px] text-gray-400 ml-1">{q.explanation}</span>}
                  </div>
                )}
                {q.tags.slice(0, 2).map(t => (
                  <span key={t} className="ml-auto text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md font-semibold">{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Assessments tab (placeholder) ───────────────────────────────────────────
function AssessmentsView() {
  return (
    <div className="flex flex-1 overflow-hidden p-4 md:p-5 gap-5 min-h-0">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-extrabold mb-4">
          <span className="text-[#3D65F4]">Available</span>{" "}
          <span className="text-[#FF6B4A]">Assessments</span>
        </h2>
        <div className="flex items-center justify-center py-20 flex-col gap-3 text-gray-400">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-sm font-semibold">No assessments available right now</p>
          <p className="text-xs text-gray-300">Check back soon for new assessments.</p>
        </div>
      </div>
      <div className="hidden md:block w-60 shrink-0"><PracticeStatsSidebar /></div>
    </div>
  );
}

// ─── Interview tab (placeholder) ──────────────────────────────────────────────
function InterviewView() {
  return (
    <div className="flex flex-1 overflow-hidden p-4 md:p-5 gap-5 min-h-0">
      <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-400">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
          <span className="text-2xl">🎤</span>
        </div>
        <p className="text-sm font-semibold">Interview Prep</p>
        <p className="text-xs text-gray-300">Coming soon — curated interview questions.</p>
      </div>
      <div className="hidden md:block w-60 shrink-0"><PracticeStatsSidebar /></div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<"practice" | "assessments" | "interview">("practice");
  const [activeProblem, setActiveProblem] = useState<ApiQuestion | null>(null);

  if (activeProblem) {
    return <CodingIDE problem={activeProblem} onBack={() => setActiveProblem(null)} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-4 pb-0 border-b border-gray-100 flex gap-6 shrink-0">
        {(["practice", "assessments", "interview"] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 capitalize ${
              activeTab === t
                ? "border-[#3D65F4] text-[#3D65F4]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "practice"    && <PracticeListView onSelect={setActiveProblem} />}
      {activeTab === "assessments" && <AssessmentsView />}
      {activeTab === "interview"   && <InterviewView />}
    </div>
  );
}
