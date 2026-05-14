import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// ── TESTS ─────────────────────────────────────────────────────────────────────
router.get("/tests", async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("faculty_tests").select("*").order("created_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.post("/tests", async (req: Request, res: Response): Promise<void> => {
  const t = req.body;
  const { data, error } = await supabase.from("faculty_tests").upsert({
    id: t.id, title: t.title, description: t.description,
    duration: t.duration, questions: t.questions,
    created_by: t.createdBy, created_at: t.createdAt, is_active: t.isActive,
  }, { onConflict: "id" }).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.delete("/tests/:id", async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase.from("faculty_tests").delete().eq("id", req.params.id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true });
});
router.patch("/tests/:id/toggle", async (req: Request, res: Response): Promise<void> => {
  const { data: existing, error: fetchErr } = await supabase.from("faculty_tests").select("is_active").eq("id", req.params.id).single();
  if (fetchErr) { res.status(500).json({ error: fetchErr.message }); return; }
  const { error } = await supabase.from("faculty_tests").update({ is_active: !existing.is_active }).eq("id", req.params.id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true, is_active: !existing.is_active });
});

// ── SUBMISSIONS ───────────────────────────────────────────────────────────────
router.get("/submissions", async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("test_submissions").select("*").order("submitted_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.post("/submissions", async (req: Request, res: Response): Promise<void> => {
  const s = req.body;
  const { data, error } = await supabase.from("test_submissions").insert({
    id: s.id, test_id: s.testId, test_title: s.testTitle,
    student_name: s.studentName, student_roll: s.studentRoll,
    answers: s.answers, score: s.score, total_marks: s.totalMarks,
    percentage: s.percentage, time_taken: s.timeTaken, submitted_at: s.submittedAt,
  }).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

// ── PRACTICE QUESTIONS ────────────────────────────────────────────────────────
router.get("/practice-questions", async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("practice_questions").select("*").order("created_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.post("/practice-questions", async (req: Request, res: Response): Promise<void> => {
  const q = req.body;
  const { data, error } = await supabase.from("practice_questions").upsert({
    id: q.id, title: q.title, description: q.description,
    difficulty: q.difficulty, tags: q.tags, options: q.options,
    correct_answer: q.correctAnswer, explanation: q.explanation,
    created_by: q.createdBy, created_at: q.createdAt,
  }, { onConflict: "id" }).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.delete("/practice-questions/:id", async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase.from("practice_questions").delete().eq("id", req.params.id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true });
});

// ── STUDENTS ──────────────────────────────────────────────────────────────────
router.get("/students", async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("registered_students").select("*").order("last_login_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.post("/students/upsert", async (req: Request, res: Response): Promise<void> => {
  const s = req.body;
  const { data, error } = await supabase.from("registered_students").upsert({
    roll_number: s.rollNumber, full_name: s.fullName,
    email: s.email, mobile: s.mobile, college: s.college,
    branch: s.branch, year: s.year, semester: s.semester,
    section: s.section, cgpa: s.cgpa, last_login_at: s.lastLoginAt,
  }, { onConflict: "roll_number" }).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.patch("/students/:roll/platforms", async (req: Request, res: Response): Promise<void> => {
  const { leetcodeUsername, hackerrankUsername } = req.body as { leetcodeUsername?: string; hackerrankUsername?: string };
  const { data, error } = await supabase.from("registered_students").update({
    leetcode_username:   leetcodeUsername   ?? "",
    hackerrank_username: hackerrankUsername ?? "",
  }).eq("roll_number", req.params.roll).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

// ── PRACTICE ATTEMPTS ─────────────────────────────────────────────────────────
router.get("/practice-attempts", async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("practice_attempts").select("*").order("attempted_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.post("/practice-attempts", async (req: Request, res: Response): Promise<void> => {
  const a = req.body;
  const { data, error } = await supabase.from("practice_attempts").insert({
    id: a.id, student_roll: a.studentRoll, student_name: a.studentName,
    question_id: a.questionId, question_title: a.questionTitle,
    chosen_answer: a.chosenAnswer, correct_answer: a.correctAnswer,
    is_correct: a.isCorrect, attempted_at: a.attemptedAt,
  }).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

// ── CODING QUESTIONS ──────────────────────────────────────────────────────────
router.get("/coding-questions", async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("coding_questions").select("*").order("created_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.post("/coding-questions", async (req: Request, res: Response): Promise<void> => {
  const q = req.body;
  const { data, error } = await supabase.from("coding_questions").upsert({
    id: q.id, title: q.title, description: q.description,
    difficulty: q.difficulty, tags: q.tags,
    starter_code: q.starterCode, sample_input: q.sampleInput,
    expected_output: q.expectedOutput, language: q.language,
    created_by: q.createdBy, created_at: q.createdAt,
  }, { onConflict: "id" }).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.delete("/coding-questions/:id", async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase.from("coding_questions").delete().eq("id", req.params.id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true });
});

// ── CODE SUBMISSIONS ──────────────────────────────────────────────────────────
router.get("/code-submissions", async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from("code_submissions").select("*").order("submitted_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.post("/code-submissions", async (req: Request, res: Response): Promise<void> => {
  const s = req.body;
  const { data, error } = await supabase.from("code_submissions").insert({
    id: s.id, question_id: s.questionId, question_title: s.questionTitle,
    student_roll: s.studentRoll, student_name: s.studentName,
    code: s.code, language: s.language, status: "pending",
    submitted_at: s.submittedAt,
  }).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});
router.patch("/code-submissions/:id/review", async (req: Request, res: Response): Promise<void> => {
  const { status, facultyNotes } = req.body;
  const { data, error } = await supabase.from("code_submissions").update({
    status, faculty_notes: facultyNotes, reviewed_at: new Date().toISOString(),
  }).eq("id", req.params.id).select().single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

export default router;
