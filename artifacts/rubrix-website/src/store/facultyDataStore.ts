const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const DB   = `${BASE}/api/db`;

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface FacultyTest {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: TestQuestion[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface TestSubmission {
  id: string;
  testId: string;
  testTitle: string;
  studentName: string;
  studentRoll: string;
  answers: Record<string, number>;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number;
  submittedAt: string;
}

export interface FacultyPracticeQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  options: string[];
  correctAnswer: number;
  explanation: string;
  createdBy: string;
  createdAt: string;
}

export interface CodingQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  starterCode: string;
  sampleInput: string;
  expectedOutput: string;
  language: string;
  createdBy: string;
  createdAt: string;
}

export interface CodeSubmission {
  id: string;
  questionId: string;
  questionTitle: string;
  studentRoll: string;
  studentName: string;
  code: string;
  language: string;
  status: "pending" | "approved" | "rejected";
  facultyNotes: string;
  submittedAt: string;
  reviewedAt: string;
}

export interface RegisteredStudent {
  rollNumber: string;
  fullName: string;
  email: string;
  mobile: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
  section: string;
  cgpa: string;
  lastLoginAt: string;
}

export interface PracticeAttempt {
  id: string;
  studentRoll: string;
  studentName: string;
  questionId: string;
  questionTitle: string;
  chosenAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  attemptedAt: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function rowToTest(r: Record<string, unknown>): FacultyTest {
  return {
    id: String(r.id), title: String(r.title),
    description: String(r.description ?? ""), duration: Number(r.duration),
    questions: (r.questions as TestQuestion[]) || [],
    createdBy: String(r.created_by ?? ""), createdAt: String(r.created_at ?? ""),
    isActive: Boolean(r.is_active),
  };
}
function rowToSubmission(r: Record<string, unknown>): TestSubmission {
  return {
    id: String(r.id), testId: String(r.test_id), testTitle: String(r.test_title ?? ""),
    studentName: String(r.student_name), studentRoll: String(r.student_roll),
    answers: (r.answers as Record<string, number>) || {},
    score: Number(r.score), totalMarks: Number(r.total_marks),
    percentage: Number(r.percentage), timeTaken: Number(r.time_taken ?? 0),
    submittedAt: String(r.submitted_at),
  };
}
function rowToPracticeQ(r: Record<string, unknown>): FacultyPracticeQuestion {
  return {
    id: String(r.id), title: String(r.title), description: String(r.description ?? ""),
    difficulty: String(r.difficulty ?? "easy") as "easy" | "medium" | "hard",
    tags: (r.tags as string[]) || [], options: (r.options as string[]) || [],
    correctAnswer: Number(r.correct_answer), explanation: String(r.explanation ?? ""),
    createdBy: String(r.created_by ?? ""), createdAt: String(r.created_at ?? ""),
  };
}
function rowToCodingQ(r: Record<string, unknown>): CodingQuestion {
  return {
    id: String(r.id), title: String(r.title), description: String(r.description ?? ""),
    difficulty: String(r.difficulty ?? "easy") as "easy" | "medium" | "hard",
    tags: (r.tags as string[]) || [],
    starterCode: String(r.starter_code ?? ""),
    sampleInput: String(r.sample_input ?? ""),
    expectedOutput: String(r.expected_output ?? ""),
    language: String(r.language ?? "python"),
    createdBy: String(r.created_by ?? ""), createdAt: String(r.created_at ?? ""),
  };
}
function rowToCodeSubmission(r: Record<string, unknown>): CodeSubmission {
  return {
    id: String(r.id), questionId: String(r.question_id),
    questionTitle: String(r.question_title ?? ""),
    studentRoll: String(r.student_roll), studentName: String(r.student_name),
    code: String(r.code ?? ""), language: String(r.language ?? "python"),
    status: String(r.status ?? "pending") as "pending" | "approved" | "rejected",
    facultyNotes: String(r.faculty_notes ?? ""),
    submittedAt: String(r.submitted_at ?? ""),
    reviewedAt: String(r.reviewed_at ?? ""),
  };
}
function rowToStudent(r: Record<string, unknown>): RegisteredStudent {
  return {
    rollNumber: String(r.roll_number), fullName: String(r.full_name),
    email: String(r.email ?? ""), mobile: String(r.mobile ?? ""),
    college: String(r.college ?? ""), branch: String(r.branch ?? ""),
    year: String(r.year ?? ""), semester: String(r.semester ?? ""),
    section: String(r.section ?? ""), cgpa: String(r.cgpa ?? ""),
    lastLoginAt: String(r.last_login_at ?? new Date().toISOString()),
  };
}
function rowToAttempt(r: Record<string, unknown>): PracticeAttempt {
  return {
    id: String(r.id), studentRoll: String(r.student_roll),
    studentName: String(r.student_name), questionId: String(r.question_id),
    questionTitle: String(r.question_title ?? ""),
    chosenAnswer: Number(r.chosen_answer), correctAnswer: Number(r.correct_answer),
    isCorrect: Boolean(r.is_correct), attemptedAt: String(r.attempted_at),
  };
}

// ── TESTS ─────────────────────────────────────────────────────────────────────
export async function getTests(): Promise<FacultyTest[]> {
  try {
    const res = await fetch(`${DB}/tests`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as Record<string, unknown>[]).map(rowToTest);
  } catch (e) { console.error("getTests failed", e); return []; }
}
export async function saveTest(t: FacultyTest): Promise<void> {
  await fetch(`${DB}/tests`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) });
}
export async function deleteTest(id: string): Promise<void> {
  await fetch(`${DB}/tests/${id}`, { method: "DELETE" });
}
export async function toggleTest(id: string): Promise<void> {
  await fetch(`${DB}/tests/${id}/toggle`, { method: "PATCH" });
}

// ── SUBMISSIONS ───────────────────────────────────────────────────────────────
export async function getSubmissions(): Promise<TestSubmission[]> {
  try {
    const res = await fetch(`${DB}/submissions`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as Record<string, unknown>[]).map(rowToSubmission);
  } catch (e) { console.error("getSubmissions failed", e); return []; }
}
export async function saveSubmission(s: TestSubmission): Promise<void> {
  await fetch(`${DB}/submissions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
}

// ── PRACTICE QUESTIONS (MCQ) ──────────────────────────────────────────────────
export async function getFacultyPracticeQuestions(): Promise<FacultyPracticeQuestion[]> {
  try {
    const res = await fetch(`${DB}/practice-questions`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as Record<string, unknown>[]).map(rowToPracticeQ);
  } catch (e) { console.error("getFacultyPracticeQuestions failed", e); return []; }
}
export async function saveFacultyPracticeQuestion(q: FacultyPracticeQuestion): Promise<void> {
  await fetch(`${DB}/practice-questions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
}
export async function deleteFacultyPracticeQuestion(id: string): Promise<void> {
  await fetch(`${DB}/practice-questions/${id}`, { method: "DELETE" });
}

// ── CODING QUESTIONS ──────────────────────────────────────────────────────────
export async function getCodingQuestions(): Promise<CodingQuestion[]> {
  try {
    const res = await fetch(`${DB}/coding-questions`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as Record<string, unknown>[]).map(rowToCodingQ);
  } catch (e) { console.error("getCodingQuestions failed", e); return []; }
}
export async function saveCodingQuestion(q: CodingQuestion): Promise<void> {
  await fetch(`${DB}/coding-questions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
}
export async function deleteCodingQuestion(id: string): Promise<void> {
  await fetch(`${DB}/coding-questions/${id}`, { method: "DELETE" });
}

// ── CODE SUBMISSIONS ──────────────────────────────────────────────────────────
export async function getCodeSubmissions(): Promise<CodeSubmission[]> {
  try {
    const res = await fetch(`${DB}/code-submissions`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as Record<string, unknown>[]).map(rowToCodeSubmission);
  } catch (e) { console.error("getCodeSubmissions failed", e); return []; }
}
export async function saveCodeSubmission(s: CodeSubmission): Promise<void> {
  await fetch(`${DB}/code-submissions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
}
export async function reviewCodeSubmission(id: string, status: "approved" | "rejected", facultyNotes: string): Promise<void> {
  await fetch(`${DB}/code-submissions/${id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, facultyNotes }),
  });
}

// ── STUDENTS ──────────────────────────────────────────────────────────────────
export async function getRegisteredStudents(): Promise<RegisteredStudent[]> {
  try {
    const res = await fetch(`${DB}/students`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as Record<string, unknown>[]).map(rowToStudent);
  } catch (e) { console.error("getRegisteredStudents failed", e); return []; }
}
export async function upsertRegisteredStudent(s: RegisteredStudent): Promise<void> {
  await fetch(`${DB}/students/upsert`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
}

// ── PRACTICE ATTEMPTS ─────────────────────────────────────────────────────────
export async function getPracticeAttempts(): Promise<PracticeAttempt[]> {
  try {
    const res = await fetch(`${DB}/practice-attempts`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as Record<string, unknown>[]).map(rowToAttempt);
  } catch (e) { console.error("getPracticeAttempts failed", e); return []; }
}
export async function savePracticeAttempt(a: PracticeAttempt): Promise<void> {
  await fetch(`${DB}/practice-attempts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a) });
}
