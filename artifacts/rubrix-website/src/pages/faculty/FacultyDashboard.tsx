import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Users, BarChart3, PlusCircle, LogOut, Search,
  BookOpen, CheckCircle2, Clock, Star, Activity, ChevronRight,
  Trash2, ShieldCheck, X,
  ClipboardList, FileText, ToggleLeft, ToggleRight, Plus, Eye, ArrowLeft,
  Code2, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp,
} from "lucide-react";
import { useFacultyAuth } from "../../context/FacultyAuthContext";
import { useAuth } from "../../context/AuthContext";
import {
  getTests, saveTest, deleteTest, toggleTest,
  getSubmissions, getFacultyPracticeQuestions, deleteFacultyPracticeQuestion,
  saveFacultyPracticeQuestion, getRegisteredStudents, getPracticeAttempts,
  getCodingQuestions, saveCodingQuestion, deleteCodingQuestion,
  getCodeSubmissions, reviewCodeSubmission,
  FacultyTest, TestQuestion, TestSubmission, RegisteredStudent, PracticeAttempt,
  FacultyPracticeQuestion, CodingQuestion, CodeSubmission,
} from "../../store/facultyDataStore";

const DIFF_COLOR: Record<string, string> = { easy: "#10B981", medium: "#F59E0B", hard: "#EF4444" };
const DIFF_BG:    Record<string, string> = { easy: "#ECFDF5", medium: "#FFFBEB", hard: "#FEF2F2" };
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function pad(n: number) { return String(n).padStart(2, "0"); }

// ─── Add Coding Question Form ─────────────────────────────────────────────────
function AddCodingQuestionForm({ onAdded }: { onAdded: () => void }) {
  const { faculty } = useFacultyAuth();
  const [form, setForm] = useState({
    title: "", description: "", difficulty: "easy", tags: "",
    starterCode: "", sampleInput: "", expectedOutput: "", language: "python",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { setError("Title and description are required."); return; }
    setSubmitting(true); setError("");
    const q: CodingQuestion = {
      id: `cq_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      title: form.title.trim(), description: form.description.trim(),
      difficulty: form.difficulty as "easy" | "medium" | "hard",
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      starterCode: form.starterCode, sampleInput: form.sampleInput,
      expectedOutput: form.expectedOutput, language: form.language,
      createdBy: faculty?.name || "Faculty", createdAt: new Date().toISOString(),
    };
    await saveCodingQuestion(q);
    setSuccess(true); setSubmitting(false);
    setTimeout(() => { setSuccess(false); onAdded(); }, 1000);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <p className="text-lg font-extrabold text-slate-800">Coding Question Added!</p>
        <p className="text-sm text-gray-400 text-center">Students can now see and submit code for this problem.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 p-4 md:p-6 pb-10">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 mb-0.5">Add Coding Question</h2>
        <p className="text-xs text-gray-400">Students will write and submit code — you review and approve/reject</p>
      </div>
      {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Problem Title *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Fibonacci Series, Find Duplicates..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Problem Description *</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4} placeholder="Describe the problem clearly with constraints and examples..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Difficulty</label>
          <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-white">
            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Language</label>
          <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-white">
            <option value="python">Python</option><option value="java">Java</option>
            <option value="c">C</option><option value="cpp">C++</option><option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tags (comma separated)</label>
          <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            placeholder="loops, functions, arrays..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Starter Code (optional)</label>
          <textarea value={form.starterCode} onChange={e => setForm(f => ({ ...f, starterCode: e.target.value }))} rows={4}
            placeholder="def solution():&#10;    # write your code here&#10;    pass"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Sample Input</label>
          <textarea value={form.sampleInput} onChange={e => setForm(f => ({ ...f, sampleInput: e.target.value }))} rows={3}
            placeholder="5"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Expected Output</label>
          <textarea value={form.expectedOutput} onChange={e => setForm(f => ({ ...f, expectedOutput: e.target.value }))} rows={3}
            placeholder="0 1 1 2 3"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 focus:outline-none focus:border-blue-400 transition-all resize-none" />
        </div>
      </div>
      <button type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", boxShadow: "0 8px 20px rgba(59,130,246,0.3)" }}>
        {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><Code2 size={16} /> Publish Coding Problem</>}
      </button>
    </form>
  );
}

// ─── Add MCQ Form (inline in Questions tab) ───────────────────────────────────
function AddMcqForm({ onAdded, onCancel }: { onAdded: () => void; onCancel: () => void }) {
  const { faculty } = useFacultyAuth();
  const [form, setForm] = useState({
    title: "", description: "", difficulty: "easy", tags: "",
    options: ["", "", "", ""], correctAnswer: 0, explanation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (form.options.some(o => !o.trim())) { setError("All 4 options must be filled."); return; }
    setSubmitting(true); setError("");
    const q: FacultyPracticeQuestion = {
      id: `pq_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      title: form.title.trim(), description: form.description.trim(),
      difficulty: form.difficulty as "easy" | "medium" | "hard",
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      options: [...form.options], correctAnswer: form.correctAnswer,
      explanation: form.explanation.trim(),
      createdBy: faculty?.name || "Faculty", createdAt: new Date().toISOString(),
    };
    await saveFacultyPracticeQuestion(q);
    setSubmitting(false);
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">New MCQ Question</p>
        <button type="button" onClick={onCancel}><X size={14} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      {error && <p className="text-[11px] text-red-500 font-semibold bg-red-50 px-3 py-1.5 rounded-xl">{error}</p>}
      <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="Question text *" required
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
      <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        placeholder="Brief context / description (optional)"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
      <div className="grid grid-cols-2 gap-2">
        <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-400">
          <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
        </select>
        <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          placeholder="tags: python, loops..."
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Options — click radio to mark correct</p>
      <div className="grid grid-cols-2 gap-2">
        {form.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="radio" name="correct" checked={form.correctAnswer === i}
              onChange={() => setForm(f => ({ ...f, correctAnswer: i }))} className="accent-blue-500 shrink-0" />
            <input value={opt} onChange={e => setForm(f => { const o = [...f.options]; o[i] = e.target.value; return { ...f, options: o }; })}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
          </div>
        ))}
      </div>
      <input value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
        placeholder="Explanation for correct answer (optional)"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-all" />
      <button type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
        {submitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={13} /> Save MCQ Question</>}
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

  const handleSave = async () => {
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
    await saveTest(test);
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
  const { isLoggedIn: isStudentLoggedIn, student } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"overview" | "students" | "questions" | "coding" | "tests" | "results" | "reviews">("overview");
  const [search, setSearch]       = useState("");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [tests, setTests]             = useState<FacultyTest[]>([]);
  const [submissions, setSubmissions]  = useState<TestSubmission[]>([]);
  const [realStudents, setRealStudents] = useState<RegisteredStudent[]>([]);
  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([]);
  const [practiceQs, setPracticeQs] = useState<FacultyPracticeQuestion[]>([]);
  const [codingQs, setCodingQs] = useState<CodingQuestion[]>([]);
  const [codeSubmissions, setCodeSubmissions] = useState<CodeSubmission[]>([]);
  const [showAddMcq, setShowAddMcq] = useState(false);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [resultFilter, setResultFilter] = useState("all");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const handleLogout = () => { logout(); navigate("/faculty/login"); };
  const handleBackToPortal = () => { navigate("/student/academics"); };

  const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

  const loadData = async () => {
    const [t, s, st, pq, pa, cq, cs] = await Promise.all([
      getTests(), getSubmissions(), getRegisteredStudents(),
      getFacultyPracticeQuestions(), getPracticeAttempts(),
      getCodingQuestions(), getCodeSubmissions(),
    ]);
    setTests(t);
    setSubmissions(s);
    setRealStudents(st);
    setPracticeQs(pq);
    setPracticeAttempts(pa);
    setCodingQs(cq);
    setCodeSubmissions(cs);
  };

  const seedSampleTests = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await fetch(`${BASE_URL}/api/setup/seed-tests`, { method: "POST" });
      const data = await res.json();
      const seeded = Object.values(data.results).filter((v: unknown) => v === "Seeded").length;
      setSeedMsg(`✓ ${seeded} sample test${seeded !== 1 ? "s" : ""} seeded!`);
      await loadData();
    } catch { setSeedMsg("Error seeding tests."); }
    setSeeding(false);
  };

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    await reviewCodeSubmission(id, status, reviewNotes);
    setReviewingId(null);
    setReviewNotes("");
    await loadData();
  };

  // Load once on mount only — caching in facultyDataStore prevents redundant API calls
  useEffect(() => { loadData(); }, []);

  // Merge students from login tracking + test submissions (deduplicated by roll)
  const allStudents: RegisteredStudent[] = [...realStudents];
  submissions.forEach(sub => {
    if (!allStudents.find(s => s.rollNumber === sub.studentRoll)) {
      allStudents.push({
        rollNumber: sub.studentRoll,
        fullName:   sub.studentName,
        email: "", mobile: "", college: "", branch: "",
        year: "", semester: "", section: "", cgpa: "",
        lastLoginAt: sub.submittedAt,
      });
    }
  });

  const filteredStudents = allStudents.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const avgCgpa = allStudents.length > 0
    ? (allStudents.filter(s => s.cgpa).reduce((a, s) => a + (parseFloat(s.cgpa) || 0), 0) /
       (allStudents.filter(s => s.cgpa).length || 1)).toFixed(1)
    : "—";

  const TABS = [
    { id: "overview",  label: "Overview",  icon: BarChart3     },
    { id: "students",  label: "Students",  icon: Users         },
    { id: "questions", label: "Questions", icon: BookOpen      },
    { id: "coding",    label: "Coding Q",  icon: Code2         },
    { id: "tests",     label: "Tests",     icon: ClipboardList },
    { id: "results",   label: "Results",   icon: FileText      },
    { id: "reviews",   label: "Reviews",   icon: Eye           },
  ] as const;

  const initials = faculty?.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "F";

  const filteredSubs = resultFilter === "all"
    ? submissions
    : submissions.filter(s => s.testId === resultFilter);

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
          {/* Back to Portal — only visible when the user came from the student portal */}
          {isStudentLoggedIn && student && (
            <button
              onClick={handleBackToPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
              style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)", border: "1.5px solid #BFDBFE", color: "#2563EB" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#3B82F6,#0EA5E9)"; (e.currentTarget as HTMLButtonElement).style.color = "white"; (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #3B82F6"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#EFF6FF,#F0F9FF)"; (e.currentTarget as HTMLButtonElement).style.color = "#2563EB"; (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #BFDBFE"; }}
            >
              <ArrowLeft size={12} strokeWidth={2.5} />
              <span className="hidden sm:inline">My Portal</span>
            </button>
          )}
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

          {/* Back to student portal — only shown for admin students */}
          {isStudentLoggedIn && student && (
            <button
              onClick={() => { setMenuOpen(false); handleBackToPortal(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold mb-1 transition-colors"
              style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)", color: "#2563EB", border: "1px solid #BFDBFE" }}
            >
              <ArrowLeft size={13} />
              Back to My Portal
              <span className="ml-auto text-[9px] bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-md font-bold truncate max-w-[80px]">{student.rollNumber}</span>
            </button>
          )}

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
                style={{ background: "rgba(255,255,255,0.18)" }}>{initials}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Students",       value: allStudents.length,  icon: Users,         color: "#3B82F6", bg: "#EFF6FF" },
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
              {allStudents.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-gray-400">
                  No students yet. Students will appear here once they submit a test.
                </div>
              ) : (
                [...allStudents].slice(0, 5).map((s, i) => (
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
                <p className="text-2xl font-extrabold text-blue-600">{allStudents.length}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Total Students</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-amber-50 shadow-sm">
                <p className="text-2xl font-extrabold text-amber-600">{avgCgpa}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Avg CGPA</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-green-50 shadow-sm">
                <p className="text-2xl font-extrabold text-green-600">{allStudents.filter(s => parseFloat(s.cgpa) >= 8).length}</p>
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

            {allStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Users size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold">No students yet</p>
                <p className="text-xs text-gray-300 text-center max-w-xs">Students appear here automatically the moment they submit any test you have created.</p>
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

        {/* QUESTIONS — MCQ */}
        {tab === "questions" && (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800">MCQ Practice Questions</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">{practiceQs.length} question{practiceQs.length !== 1 ? "s" : ""} · students see these on the Practice page</p>
              </div>
              <button onClick={() => setShowAddMcq(s => !s)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                <PlusCircle size={13} /> {showAddMcq ? "Cancel" : "Add MCQ"}
              </button>
            </div>

            {showAddMcq && (
              <AddMcqForm
                onAdded={() => { setShowAddMcq(false); loadData(); }}
                onCancel={() => setShowAddMcq(false)}
              />
            )}

            {practiceQs.length === 0 && !showAddMcq ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <BookOpen size={36} className="opacity-30" />
                <p className="text-sm font-semibold">No MCQ questions yet</p>
                <button onClick={() => setShowAddMcq(true)} className="mt-2 px-5 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold">Add First Question</button>
              </div>
            ) : (
              <div className="space-y-2">
                {practiceQs.map(q => (
                  <div key={q.id} className="bg-white rounded-xl p-3 border border-blue-100 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600">MCQ</span>
                        <p className="text-xs font-bold text-slate-800 truncate">{q.title}</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${q.difficulty === "easy" ? "bg-green-100 text-green-700" : q.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{q.difficulty}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate max-w-xs">{q.description}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {q.tags.map(t => <span key={t} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-semibold">{t}</span>)}
                      </div>
                    </div>
                    <button onClick={() => { deleteFacultyPracticeQuestion(q.id).then(() => loadData()); }} className="ml-auto shrink-0 p-1">
                      <Trash2 size={13} className="text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CODING QUESTIONS */}
        {tab === "coding" && <AddCodingQuestionForm onAdded={() => { loadData(); }} />}
        {tab === "coding" && codingQs.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 md:px-6 pb-10 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{codingQs.length} coding problem{codingQs.length !== 1 ? "s" : ""} published</p>
            {codingQs.map(q => (
              <div key={q.id} className="bg-white rounded-xl p-3 border border-green-100 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-green-50 text-green-700">{q.language}</span>
                    <p className="text-xs font-bold text-slate-800 truncate">{q.title}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${q.difficulty === "easy" ? "bg-green-100 text-green-700" : q.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{q.difficulty}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-2">{q.description}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {q.tags.map(t => <span key={t} className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-md font-semibold">{t}</span>)}
                  </div>
                </div>
                <button onClick={() => { deleteCodingQuestion(q.id).then(() => loadData()); }} className="ml-auto shrink-0 p-1">
                  <Trash2 size={13} className="text-red-400 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}

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
                    <p className="text-xs text-gray-300">Create your first test or load our 4 sample tests.</p>
                    <div className="flex gap-2 mt-2 flex-wrap justify-center">
                      <button onClick={() => setShowCreateTest(true)}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-bold"
                        style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                        Create First Test
                      </button>
                      <button onClick={seedSampleTests} disabled={seeding}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold border border-blue-200 text-blue-600 bg-blue-50 disabled:opacity-50">
                        {seeding ? "Loading…" : "Load 4 Sample Tests"}
                      </button>
                    </div>
                    {seedMsg && <p className="text-xs font-bold text-green-600">{seedMsg}</p>}
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
                              <button onClick={() => { toggleTest(test.id).then(() => loadData()); }}
                                className="text-gray-400 hover:text-blue-500 transition-colors">
                                {test.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                              </button>
                              <button onClick={() => { deleteTest(test.id).then(() => loadData()); }}>
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

        {/* REVIEWS */}
        {tab === "reviews" && (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

            {/* ── Code Submissions (with approve/reject) ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <Code2 size={16} className="text-green-500" /> Code Submissions
                  </h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {codeSubmissions.length} submission{codeSubmissions.length !== 1 ? "s" : ""} ·{" "}
                    {codeSubmissions.filter(s => s.status === "pending").length} pending review
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                    {codeSubmissions.filter(s => s.status === "pending").length} pending
                  </span>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-green-50 text-green-600 border border-green-100">
                    {codeSubmissions.filter(s => s.status === "approved").length} approved
                  </span>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-red-50 text-red-500 border border-red-100">
                    {codeSubmissions.filter(s => s.status === "rejected").length} rejected
                  </span>
                </div>
              </div>

              {codeSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400 bg-white rounded-2xl border border-gray-100">
                  <Code2 size={28} className="opacity-25" />
                  <p className="text-sm font-semibold">No code submissions yet</p>
                  <p className="text-xs text-gray-300 text-center max-w-xs">Students submit code from the Practice page. Add a coding question in the "Coding Q" tab first.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {codeSubmissions.map(sub => {
                    const statusColor = sub.status === "approved" ? "#10B981" : sub.status === "rejected" ? "#EF4444" : "#F59E0B";
                    const statusBg    = sub.status === "approved" ? "#ECFDF5" : sub.status === "rejected" ? "#FEF2F2" : "#FFFBEB";
                    const isReviewing = reviewingId === sub.id;
                    const isExpanded  = expandedCode === sub.id;
                    return (
                      <div key={sub.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-start gap-3 p-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-extrabold shrink-0"
                            style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                            {sub.studentName.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-extrabold text-slate-800">{sub.studentName}</p>
                              <span className="text-[9px] font-mono text-gray-400">{sub.studentRoll}</span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: statusBg, color: statusColor }}>
                                {sub.status === "approved" ? "✓ Approved" : sub.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                              </span>
                            </div>
                            <p className="text-[11px] text-green-600 font-semibold mt-0.5">{sub.questionTitle}</p>
                            <div className="flex gap-3 mt-1 text-[10px] text-gray-400 flex-wrap">
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{sub.language}</span>
                              <span>{new Date(sub.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                              <span>{new Date(sub.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                            {sub.facultyNotes && (
                              <p className="text-[10px] text-gray-500 mt-1 italic bg-gray-50 px-2 py-1 rounded-lg">{sub.facultyNotes}</p>
                            )}
                          </div>
                        </div>

                        {/* Code viewer */}
                        <div className="px-4 pb-2">
                          <button onClick={() => setExpandedCode(isExpanded ? null : sub.id)}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors">
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            {isExpanded ? "Hide code" : "View submitted code"}
                          </button>
                          {isExpanded && (
                            <pre className="mt-2 bg-slate-900 text-green-300 text-[11px] font-mono p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                              {sub.code}
                            </pre>
                          )}
                        </div>

                        {/* Review actions */}
                        {sub.status === "pending" && !isReviewing && (
                          <div className="flex gap-2 px-4 pb-4">
                            <button onClick={() => { setReviewingId(sub.id); setReviewNotes(""); }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
                              style={{ background: "linear-gradient(135deg,#3B82F6,#0EA5E9)" }}>
                              Review
                            </button>
                          </div>
                        )}
                        {isReviewing && (
                          <div className="px-4 pb-4 space-y-2 border-t border-gray-50 pt-3">
                            <textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)}
                              rows={2} placeholder="Optional notes for student (e.g. 'Good logic!' or 'Fix your loop bounds')"
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 resize-none transition-all" />
                            <div className="flex gap-2">
                              <button onClick={() => handleReview(sub.id, "approved")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                                style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                                <ThumbsUp size={12} /> Approve
                              </button>
                              <button onClick={() => handleReview(sub.id, "rejected")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                                style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)" }}>
                                <ThumbsDown size={12} /> Reject
                              </button>
                              <button onClick={() => setReviewingId(null)}
                                className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── MCQ Attempts ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <BookOpen size={15} className="text-blue-500" /> MCQ Attempts
                  </h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {practiceAttempts.length} attempt{practiceAttempts.length !== 1 ? "s" : ""} · {practiceAttempts.filter(a => a.isCorrect).length} correct
                  </p>
                </div>
                {practiceAttempts.length > 0 && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                    <CheckCircle2 size={13} className="text-blue-400" />
                    <span className="text-[11px] font-bold text-blue-600">
                      {Math.round((practiceAttempts.filter(a => a.isCorrect).length / practiceAttempts.length) * 100)}% accuracy
                    </span>
                  </div>
                )}
              </div>

              {practiceAttempts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400 bg-white rounded-2xl border border-gray-100">
                  <Eye size={24} className="opacity-25" />
                  <p className="text-sm font-semibold">No MCQ attempts yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {practiceAttempts.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-extrabold shrink-0"
                          style={{ background: a.isCorrect ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                          {a.studentName.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-extrabold text-slate-800">{a.studentName}</p>
                            <span className="text-[9px] font-mono text-gray-400">{a.studentRoll}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${a.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                              {a.isCorrect ? "✓ Correct" : "✗ Wrong"}
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-600 font-semibold mt-0.5 line-clamp-1">{a.questionTitle}</p>
                          <div className="flex gap-4 mt-1 text-[11px] text-gray-400 flex-wrap">
                            <span>Chose: Option {String.fromCharCode(65 + a.chosenAnswer)}</span>
                            <span>Correct: Option {String.fromCharCode(65 + a.correctAnswer)}</span>
                            <span>{new Date(a.attemptedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            <span>{new Date(a.attemptedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Bottom branding */}
      <div className="shrink-0 flex items-center justify-center gap-2 py-1.5"
        style={{ background: "#0A0C1C", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="text-[8.5px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>BigBrains</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 9 }}>·</span>
        <span className="text-[8.5px] font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>Startup by Jashwanth &amp; Team</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 9 }}>·</span>
        <span className="text-[8.5px] font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>Sphoorthy Engineering College</span>
      </div>
    </div>
  );
}
