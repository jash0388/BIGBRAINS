import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Users, Zap, BarChart3, PlusCircle, LogOut, Search,
  ChevronRight, BookOpen, CheckCircle2, Clock, Star,
  Trash2, ShieldCheck, TrendingUp, Activity, X,
  ClipboardList, FileText, ToggleLeft, ToggleRight, Plus,
} from "lucide-react";
import { useFacultyAuth } from "../../context/FacultyAuthContext";
import {
  getTests, saveTest, deleteTest, toggleTest,
  getSubmissions, getFacultyPracticeQuestions, deleteFacultyPracticeQuestion,
  getRegisteredStudents,
  FacultyTest, TestQuestion, TestSubmission, RegisteredStudent,
} from "../../store/facultyDataStore";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiQuestion {
  _id: string;
  name: string;
  description: string;
  difficulty_level: "easy" | "medium" | "hard";
  tags: string[];
  time_limit: number;
  is_active: boolean;
}


const DIFF_COLOR: Record<string, string> = { easy: "#10B981", medium: "#F59E0B", hard: "#EF4444" };
const DIFF_BG:    Record<string, string> = { easy: "#ECFDF5", medium: "#FFFBEB", hard: "#FEF2F2" };
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function pad(n: number) { return String(n).padStart(2, "0"); }

// ─── Add Question Form ────────────────────────────────────────────────────────
function AddQuestionForm({ onAdded }: { onAdded: () => void }) {
  const { faculty } = useFacultyAuth();
  const [form, setForm] = useState({
    name: "", description: "", difficulty_level: "easy",
    tags: "", time_limit: 30, memory_limit: 256,
    sample_input: "", sample_output: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) { setError("Name and description are required."); return; }
    setSubmitting(true); setError("");
    try {
      const payload = {
        name: form.name.trim(), description: form.description.trim(),
        difficulty_level: form.difficulty_level,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        time_limit: Number(form.time_limit), memory_limit: Number(form.memory_limit),
        sample_testcase: [{ testcase: form.sample_input, output: form.sample_output }],
        is_active: true, added_by: faculty?.name || "Faculty",
      };
      await fetch(`${BASE}/api/proxy/assessments/ourocode/questions`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
    } catch { /* optimistic */ }
    setSuccess(true); setSubmitting(false); onAdded();
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <p className="text-lg font-extrabold text-slate-800">Question Added!</p>
        <p className="text-sm text-gray-400 text-center">The practice question has been submitted to the platform.</p>
        <button onClick={() => setSuccess(false)} className="mt-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold">Add Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 p-4 md:p-6 pb-10">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 mb-0.5">Add Practice Question</h2>
        <p className="text-xs text-gray-400">Publish a new coding problem for students</p>
      </div>
      {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Question Title *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Two Sum, Fibonacci Series..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Problem Description *</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={5} placeholder="Describe the problem clearly with constraints and examples..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Difficulty</label>
          <select value={form.difficulty_level} onChange={e => setForm(f => ({ ...f, difficulty_level: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-white">
            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tags (comma separated)</label>
          <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            placeholder="arrays, sorting, dp..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Time Limit (seconds)</label>
          <input type="number" min={1} max={300} value={form.time_limit} onChange={e => setForm(f => ({ ...f, time_limit: Number(e.target.value) }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Memory Limit (MB)</label>
          <input type="number" min={16} max={1024} value={form.memory_limit} onChange={e => setForm(f => ({ ...f, memory_limit: Number(e.target.value) }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Sample Input</label>
          <textarea value={form.sample_input} onChange={e => setForm(f => ({ ...f, sample_input: e.target.value }))} rows={3}
            placeholder="5&#10;1 2 3 4 5"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Expected Output</label>
          <textarea value={form.sample_output} onChange={e => setForm(f => ({ ...f, sample_output: e.target.value }))} rows={3}
            placeholder="15"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        </div>
      </div>
      <button type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 8px 20px rgba(59,130,246,0.3)" }}>
        {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><PlusCircle size={16} /> Publish Question</>}
      </button>
    </form>
  );
}

// ─── Create Test Form ─────────────────────────────────────────────────────────
function CreateTestForm({ onSaved, faculty }: { onSaved: () => void; faculty: { name: string } | null }) {
  const [meta, setMeta] = useState({ title: "", description: "", duration: 30 });
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [qForm, setQForm] = useState({ question: "", options: ["", "", "", ""], correctAnswer: 0, marks: 1 });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => {
    if (!qForm.question.trim()) { setError("Question text is required."); return; }
    if (qForm.options.some(o => !o.trim())) { setError("All 4 options must be filled."); return; }
    setError("");
    const q: TestQuestion = { id: `q_${Date.now()}_${Math.random()}`, ...qForm, options: [...qForm.options] };
    setQuestions(qs => [...qs, q]);
    setQForm({ question: "", options: ["", "", "", ""], correctAnswer: 0, marks: 1 });
  };

  const handleSave = () => {
    if (!meta.title.trim()) { setError("Test title is required."); return; }
    if (questions.length === 0) { setError("Add at least one question."); return; }
    const test: FacultyTest = {
      id: `test_${Date.now()}`,
      ...meta,
      questions,
      createdBy: faculty?.name || "Faculty",
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    saveTest(test);
    setSaved(true);
    setTimeout(() => { setSaved(false); onSaved(); }, 1200);
  };

  if (saved) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <p className="text-lg font-extrabold text-slate-800">Test Published!</p>
        <p className="text-sm text-gray-400 text-center">Students can now see and take this test.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-12 space-y-5">
      <div>
        <h2 className="text-base font-extrabold text-slate-800">Create New Test</h2>
        <p className="text-xs text-gray-400">Students will see this in their Tests section</p>
      </div>
      {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Test Details</p>
        <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))}
          placeholder="Test Title e.g. Unit Test 1 — Arrays & Sorting"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
        <textarea value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))}
          rows={2} placeholder="Brief description of what this test covers..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500">Duration (minutes):</label>
          <input type="number" min={5} max={180} value={meta.duration}
            onChange={e => setMeta(m => ({ ...m, duration: Number(e.target.value) }))}
            className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Add Question</p>
        <textarea value={qForm.question} onChange={e => setQForm(f => ({ ...f, question: e.target.value }))}
          rows={2} placeholder="Question text..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        <div className="grid grid-cols-2 gap-2">
          {qForm.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={qForm.correctAnswer === i}
                onChange={() => setQForm(f => ({ ...f, correctAnswer: i }))}
                className="accent-blue-500 shrink-0"
                title="Mark as correct answer"
              />
              <input value={opt}
                onChange={e => setQForm(f => { const o = [...f.options]; o[i] = e.target.value; return { ...f, options: o }; })}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400">Select the radio button next to the correct answer</p>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500">Marks:</label>
          <input type="number" min={1} max={10} value={qForm.marks}
            onChange={e => setQForm(f => ({ ...f, marks: Number(e.target.value) }))}
            className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
          <button type="button" onClick={addQuestion}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
            <Plus size={13} /> Add Question
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">{questions.length} Question{questions.length !== 1 ? "s" : ""} Added</p>
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-start gap-3">
              <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{q.question}</p>
                <p className="text-[10px] text-green-600 mt-0.5 font-semibold">Correct: {q.options[q.correctAnswer]}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-gray-400">{q.marks}m</span>
                <button onClick={() => setQuestions(qs => qs.filter(x => x.id !== q.id))}>
                  <Trash2 size={13} className="text-red-400 hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
          <div className="pt-1">
            <p className="text-[10px] text-gray-400">Total: {questions.reduce((a, q) => a + q.marks, 0)} marks · {meta.duration} min</p>
          </div>
        </div>
      )}

      <button onClick={handleSave}
        className="w-full py-3.5 rounded-2xl font-bold text-sm text-white"
        style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 8px 20px rgba(59,130,246,0.3)" }}>
        Publish Test to Students
      </button>
    </div>
  );
}

// ─── Main Faculty Dashboard ───────────────────────────────────────────────────
export default function FacultyDashboard() {
  const { faculty, logout } = useFacultyAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"overview" | "students" | "questions" | "add" | "tests" | "results">("overview");
  const [search, setSearch]       = useState("");
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [qLoading, setQLoading]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [tests, setTests]             = useState<FacultyTest[]>([]);
  const [submissions, setSubmissions]  = useState<TestSubmission[]>([]);
  const [realStudents, setRealStudents] = useState<RegisteredStudent[]>([]);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [resultFilter, setResultFilter] = useState("all");

  const handleLogout = () => { logout(); navigate("/faculty/login"); };

  const loadData = () => {
    setTests(getTests());
    setSubmissions(getSubmissions());
    setRealStudents(getRegisteredStudents());
  };

  useEffect(() => { loadData(); }, [tab]);

  useEffect(() => {
    if (tab !== "questions" && tab !== "overview") return;
    setQLoading(true);
    fetch(`${BASE}/api/proxy/assessments/ourocode/questions`, { headers: { Accept: "application/json" } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { const q = data?.questions || data?.data || []; setQuestions(Array.isArray(q) ? q : []); })
      .catch(() => setQuestions([]))
      .finally(() => setQLoading(false));
  }, [tab]);

  const filteredStudents = realStudents.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const avgCgpa = realStudents.length > 0
    ? (realStudents.reduce((a, s) => a + (parseFloat(s.cgpa) || 0), 0) / realStudents.length).toFixed(1)
    : "—";

  const TABS = [
    { id: "overview",  label: "Overview",  icon: BarChart3     },
    { id: "students",  label: "Students",  icon: Users         },
    { id: "questions", label: "Questions", icon: BookOpen      },
    { id: "add",       label: "Add Q",     icon: PlusCircle    },
    { id: "tests",     label: "Tests",     icon: ClipboardList },
    { id: "results",   label: "Results",   icon: FileText      },
  ] as const;

  const initials = faculty?.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "F";

  const filteredSubs = resultFilter === "all"
    ? submissions
    : submissions.filter(s => s.testId === resultFilter);

  const facultyPracticeQs = getFacultyPracticeQuestions();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4F6FB", fontFamily: "'Sora', sans-serif" }}>

      {/* ── Top header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 shrink-0 bg-white"
        style={{ height: 58, borderBottom: "1px solid #F1F5F9", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 4px 12px rgba(59,130,246,0.35)" }}>
            <ShieldCheck size={15} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800 leading-tight">Faculty Portal</p>
            <p className="text-[9px] text-slate-400 font-medium">BigBrains · Sphoorthy Engg College</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-600">Live</span>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 cursor-pointer"
            style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}
            onClick={() => setMenuOpen(m => !m)}>
            {initials}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed top-[62px] right-4 z-50 rounded-2xl p-4 w-64 shadow-2xl"
          style={{ background: "white", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-sm">{initials}</div>
            <div>
              <p className="text-sm font-extrabold text-slate-800">{faculty?.name}</p>
              <p className="text-[10px] text-blue-500 font-semibold">{faculty?.role}</p>
              <p className="text-[9px] text-gray-400">{faculty?.department}</p>
            </div>
          </div>
          <div className="text-[10px] text-gray-400 mb-3 font-mono bg-gray-50 px-2 py-1 rounded-lg">Code: {faculty?.code}</div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 text-xs font-bold hover:bg-red-50 transition-colors">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      )}
      {menuOpen && <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />}

      {/* ── Tab bar ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 flex items-center gap-1 overflow-x-auto">
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setShowCreateTest(false); }}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all shrink-0"
              style={{ borderColor: active ? "#3B82F6" : "transparent", color: active ? "#3B82F6" : "#94A3B8" }}>
              <t.icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">
            <div className="rounded-3xl p-5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#1E3A5F,#3B82F6)", boxShadow: "0 12px 32px rgba(59,130,246,0.25)" }}>
              <div>
                <p className="text-white/60 text-xs font-semibold mb-0.5">Welcome back,</p>
                <p className="text-white font-extrabold text-lg">{faculty?.name} 👋</p>
                <p className="text-white/50 text-[10px] mt-1">{faculty?.role} · {faculty?.department}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>{initials}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Registered Students", value: realStudents.length,  icon: Users,         color: "#3B82F6", bg: "#EFF6FF" },
                { label: "Faculty Tests",        value: tests.length,         icon: ClipboardList, color: "#F59E0B", bg: "#FFFBEB" },
                { label: "Test Submissions",     value: submissions.length,   icon: FileText,      color: "#10B981", bg: "#ECFDF5" },
                { label: "Avg CGPA",             value: avgCgpa,              icon: Activity,      color: "#EC4899", bg: "#FDF2F8" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                    <s.icon size={15} color={s.color} />
                  </div>
                  <p className="text-xl font-extrabold text-slate-800">{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-extrabold text-slate-800">Registered Students</p>
                <button onClick={() => setTab("students")} className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                  See all <ChevronRight size={11} />
                </button>
              </div>
              {realStudents.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-gray-400">
                  No students have logged in yet. Students will appear here after their first login.
                </div>
              ) : (
                [...realStudents].slice(0, 5).map((s, i) => (
                  <div key={s.rollNumber} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-[10px] font-extrabold text-gray-300 w-4">{i + 1}</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white text-[9px] font-extrabold shrink-0">
                      {s.fullName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{s.fullName}</p>
                      <p className="text-[9px] text-gray-400">{s.rollNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {s.cgpa ? <span className="text-[10px] font-bold text-amber-600">CGPA {s.cgpa}</span>
                        : <span className="text-[10px] text-gray-300">—</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            {submissions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-extrabold text-slate-800">Recent Test Submissions</p>
                  <button onClick={() => setTab("results")} className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                    View all <ChevronRight size={11} />
                  </button>
                </div>
                {[...submissions].reverse().slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-[9px] font-extrabold shrink-0">
                      {s.studentName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{s.studentName}</p>
                      <p className="text-[9px] text-gray-400">{s.testTitle}</p>
                    </div>
                    <span className="text-xs font-extrabold shrink-0"
                      style={{ color: s.percentage >= 60 ? "#10B981" : "#EF4444" }}>
                      {s.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 text-center border border-blue-50 shadow-sm">
                <p className="text-2xl font-extrabold text-blue-600">{realStudents.length}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Registered</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-amber-50 shadow-sm">
                <p className="text-2xl font-extrabold text-amber-600">{avgCgpa}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Avg CGPA</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-green-50 shadow-sm">
                <p className="text-2xl font-extrabold text-green-600">{realStudents.filter(s => parseFloat(s.cgpa) >= 8).length}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">CGPA ≥ 8</p>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {tab === "students" && (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2.5 border border-gray-100 shadow-sm">
              <Search size={15} className="text-gray-300 shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or roll number…"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-gray-300 focus:outline-none" />
              {search && <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500"><X size={13} /></button>}
            </div>

            <p className="text-[10px] text-gray-400 font-semibold px-1">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} registered
            </p>

            {realStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Users size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold">No students yet</p>
                <p className="text-xs text-gray-300 text-center max-w-xs">Students will appear here automatically once they log in to the student portal for the first time.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map(s => {
                  const myTestSubs = submissions.filter(sub => sub.studentRoll === s.rollNumber);
                  const lastLogin  = new Date(s.lastLoginAt);
                  const isToday    = new Date().toDateString() === lastLogin.toDateString();
                  const lastSeen   = isToday
                    ? `Today ${lastLogin.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : lastLogin.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                  return (
                    <div key={s.rollNumber} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                          style={{ background: "linear-gradient(135deg,#3B82F6,#EC4899)" }}>
                          {s.fullName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-extrabold text-slate-800">{s.fullName}</p>
                            <div className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className="text-[9px] font-semibold text-gray-400">{lastSeen}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {s.rollNumber}{s.section ? ` · Sec ${s.section}` : ""}{s.year ? ` · Year ${s.year}` : ""}{s.semester ? ` · Sem ${s.semester}` : ""}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {s.cgpa && <div className="flex items-center gap-1"><Star size={10} className="text-amber-400" /><span className="text-[10px] font-bold text-amber-600">CGPA {s.cgpa}</span></div>}
                            {s.branch && <span className="text-[9px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-md">{s.branch.length > 20 ? "Data Science" : s.branch}</span>}
                            {myTestSubs.length > 0 && (
                              <div className="flex items-center gap-1">
                                <ClipboardList size={10} className="text-blue-400" />
                                <span className="text-[10px] font-bold text-blue-600">{myTestSubs.length} test{myTestSubs.length !== 1 ? "s" : ""} taken</span>
                              </div>
                            )}
                          </div>
                          {myTestSubs.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {myTestSubs.map(sub => (
                                <span key={sub.id} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: sub.percentage >= 60 ? "#ECFDF5" : "#FEF2F2", color: sub.percentage >= 60 ? "#059669" : "#DC2626" }}>
                                  {sub.testTitle.slice(0, 22)}: {sub.percentage}%
                                </span>
                              ))}
                            </div>
                          )}
                          {s.email && (
                            <p className="text-[9px] text-gray-300 mt-1 truncate">{s.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* QUESTIONS */}
        {tab === "questions" && (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800">Practice Questions</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Live from Rubrix Assessments API · {facultyPracticeQs.length} faculty MCQ added</p>
              </div>
              <button onClick={() => setTab("add")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                <PlusCircle size={13} /> Add New
              </button>
            </div>

            {facultyPracticeQs.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Faculty Added (MCQ)</p>
                <div className="space-y-2">
                  {facultyPracticeQs.map(q => (
                    <div key={q.id} className="bg-white rounded-xl p-3 border border-blue-100 flex items-start gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{q.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-xs">{q.description}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {q.tags.map(t => <span key={t} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-semibold">{t}</span>)}
                        </div>
                      </div>
                      <button onClick={() => { deleteFacultyPracticeQuestion(q.id); loadData(); }} className="ml-auto shrink-0">
                        <Trash2 size={13} className="text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {qLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <BookOpen size={36} className="opacity-30" />
                <p className="text-sm font-semibold">No API questions found</p>
                <button onClick={() => setTab("add")} className="mt-2 px-5 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold">Add a Question</button>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div key={q._id || i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-lg"
                            style={{ background: DIFF_BG[q.difficulty_level] || "#F9FAFB", color: DIFF_COLOR[q.difficulty_level] || "#6B7280" }}>
                            {q.difficulty_level?.toUpperCase()}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full ${q.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{q.name}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(q.tags || []).slice(0, 5).map((tag, ti) => (
                            <span key={ti} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] text-gray-400">Time</p>
                        <p className="text-[10px] font-bold text-slate-600 flex items-center gap-0.5"><Clock size={9} /> {q.time_limit}s</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD QUESTION */}
        {tab === "add" && <AddQuestionForm onAdded={() => setTab("questions")} />}

        {/* TESTS */}
        {tab === "tests" && (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            {showCreateTest ? (
              <CreateTestForm faculty={faculty} onSaved={() => { setShowCreateTest(false); loadData(); }} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">Manage Tests</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">{tests.length} test{tests.length !== 1 ? "s" : ""} created</p>
                  </div>
                  <button onClick={() => setShowCreateTest(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                    <Plus size={13} /> Create Test
                  </button>
                </div>

                {tests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <ClipboardList size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold">No tests created yet</p>
                    <p className="text-xs text-gray-300">Create your first test and assign it to students.</p>
                    <button onClick={() => setShowCreateTest(true)}
                      className="mt-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold"
                      style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                      Create First Test
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...tests].reverse().map(test => {
                      const testSubs = submissions.filter(s => s.testId === test.id);
                      const avgPct = testSubs.length > 0
                        ? Math.round(testSubs.reduce((a, s) => a + s.percentage, 0) / testSubs.length)
                        : null;
                      return (
                        <div key={test.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="text-sm font-extrabold text-slate-800">{test.title}</p>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${test.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                  {test.isActive ? "Active" : "Hidden"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mb-2 line-clamp-1">{test.description}</p>
                              <div className="flex gap-4 text-[11px] text-gray-400 flex-wrap">
                                <span className="flex items-center gap-1"><Clock size={11} /> {test.duration} min</span>
                                <span>{test.questions.length} questions</span>
                                <span>{test.questions.reduce((a, q) => a + q.marks, 0)} marks</span>
                                <span>{testSubs.length} submission{testSubs.length !== 1 ? "s" : ""}</span>
                                {avgPct !== null && <span className="font-bold text-blue-600">Avg: {avgPct}%</span>}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <button onClick={() => { toggleTest(test.id); loadData(); }}
                                className="text-gray-400 hover:text-blue-500 transition-colors">
                                {test.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                              </button>
                              <button onClick={() => { deleteTest(test.id); loadData(); }}>
                                <Trash2 size={14} className="text-red-400 hover:text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* RESULTS */}
        {tab === "results" && (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-base font-extrabold text-slate-800">Student Test Results</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">{submissions.length} total submission{submissions.length !== 1 ? "s" : ""}</p>
              </div>
              <select value={resultFilter} onChange={e => setResultFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-400">
                <option value="all">All Tests</option>
                {tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>

            {filteredSubs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <FileText size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold">No results yet</p>
                <p className="text-xs text-gray-300">Students haven't submitted any tests yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...filteredSubs].reverse().map(s => {
                  const mins = Math.floor(s.timeTaken / 60);
                  const secs = s.timeTaken % 60;
                  return (
                    <div key={s.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-extrabold shrink-0"
                          style={{ background: s.percentage >= 60 ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#EF4444,#DC2626)" }}>
                          {s.studentName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-extrabold text-slate-800">{s.studentName}</p>
                            <span className="text-[9px] font-mono text-gray-400">{s.studentRoll}</span>
                          </div>
                          <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{s.testTitle}</p>
                          <div className="flex gap-4 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1"><Clock size={10} /> {mins}m {pad(secs)}s</span>
                            <span>{s.score}/{s.totalMarks} marks</span>
                            <span>{new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span>{new Date(s.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-extrabold" style={{ color: s.percentage >= 60 ? "#10B981" : "#EF4444" }}>{s.percentage}%</p>
                          <p className="text-[10px] text-gray-400">{s.percentage >= 90 ? "A+" : s.percentage >= 80 ? "A" : s.percentage >= 70 ? "B" : s.percentage >= 60 ? "C" : "F"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom branding */}
      <div className="shrink-0 flex items-center justify-center gap-2 py-1.5"
        style={{ background: "rgba(10,12,28,0.88)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="text-[8.5px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>BigBrains</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 9 }}>·</span>
        <span className="text-[8.5px] font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>Startup by Jashwanth &amp; Team</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 9 }}>·</span>
        <span className="text-[8.5px] font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>Sphoorthy Engineering College</span>
      </div>
    </div>
  );
}
