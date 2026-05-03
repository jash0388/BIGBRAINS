import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// ── TESTS ─────────────────────────────────────────────────────────────────────
router.get("/tests", async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("faculty_tests").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/tests", async (req: Request, res: Response) => {
  const t = req.body;
  const { data, error } = await supabase.from("faculty_tests").upsert({
    id: t.id, title: t.title, description: t.description,
    duration: t.duration, questions: t.questions,
    created_by: t.createdBy, created_at: t.createdAt, is_active: t.isActive,
  }, { onConflict: "id" }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete("/tests/:id", async (req: Request, res: Response) => {
  const { error } = await supabase.from("faculty_tests").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.patch("/tests/:id/toggle", async (req: Request, res: Response) => {
  const { data: existing, error: fetchErr } = await supabase
    .from("faculty_tests").select("is_active").eq("id", req.params.id).single();
  if (fetchErr) return res.status(500).json({ error: fetchErr.message });
  const { error } = await supabase.from("faculty_tests")
    .update({ is_active: !existing.is_active }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, is_active: !existing.is_active });
});

// ── SUBMISSIONS ───────────────────────────────────────────────────────────────
router.get("/submissions", async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("test_submissions").select("*").order("submitted_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/submissions", async (req: Request, res: Response) => {
  const s = req.body;
  const { data, error } = await supabase.from("test_submissions").insert({
    id: s.id, test_id: s.testId, test_title: s.testTitle,
    student_name: s.studentName, student_roll: s.studentRoll,
    answers: s.answers, score: s.score, total_marks: s.totalMarks,
    percentage: s.percentage, time_taken: s.timeTaken,
    submitted_at: s.submittedAt,
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── PRACTICE QUESTIONS ────────────────────────────────────────────────────────
router.get("/practice-questions", async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("practice_questions").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/practice-questions", async (req: Request, res: Response) => {
  const q = req.body;
  const { data, error } = await supabase.from("practice_questions").upsert({
    id: q.id, title: q.title, description: q.description,
    difficulty: q.difficulty, tags: q.tags, options: q.options,
    correct_answer: q.correctAnswer, explanation: q.explanation,
    created_by: q.createdBy, created_at: q.createdAt,
  }, { onConflict: "id" }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete("/practice-questions/:id", async (req: Request, res: Response) => {
  const { error } = await supabase.from("practice_questions").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── STUDENTS ──────────────────────────────────────────────────────────────────
router.get("/students", async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("registered_students").select("*").order("last_login_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/students/upsert", async (req: Request, res: Response) => {
  const s = req.body;
  const { data, error } = await supabase.from("registered_students").upsert({
    roll_number: s.rollNumber, full_name: s.fullName,
    email: s.email, mobile: s.mobile, college: s.college,
    branch: s.branch, year: s.year, semester: s.semester,
    section: s.section, cgpa: s.cgpa,
    last_login_at: s.lastLoginAt,
  }, { onConflict: "roll_number" }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
