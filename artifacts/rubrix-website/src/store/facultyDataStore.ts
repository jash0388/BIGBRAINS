// All data is now persisted in Supabase via the API server.
// localStorage is kept only as a fallback cache while the request is in-flight.

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

// ── helpers ───────────────────────────────────────────────────────────────────
function rowToTest(r: Record<string, unknown>): FacultyTest {
  return {
    id:          String(r.id),
    title:       String(r.title),
    description: String(r.description ?? ""),
    duration:    Number(r.duration),
    questions:   (r.questions as TestQuestion[]) || [],
    createdBy:   String(r.created_by ?? ""),
    createdAt:   String(r.created_at ?? ""),
    isActive:    Boolean(r.is_active),
  };
}

function rowToSubmission(r: Record<string, unknown>): TestSubmission {
  return {
    id:          String(r.id),
    testId:      String(r.test_id),
    testTitle:   String(r.test_title ?? ""),
    studentName: String(r.student_name),
    studentRoll: String(r.student_roll),
    answers:     (r.answers as Record<string, number>) || {},
    score:       Number(r.score),
    totalMarks:  Number(r.total_marks),
    percentage:  Number(r.percentage),
    timeTaken:   Number(r.time_taken ?? 0),
    submittedAt: String(r.submitted_at),
  };
}

function rowToPracticeQ(r: Record<string, unknown>): FacultyPracticeQuestion {
  return {
    id:            String(r.id),
    title:         String(r.title),
    description:   String(r.description ?? ""),
    difficulty:    String(r.difficulty ?? "easy") as "easy" | "medium" | "hard",
    tags:          (r.tags as string[]) || [],
    options:       (r.options as string[]) || [],
    correctAnswer: Number(r.correct_answer),
    explanation:   String(r.explanation ?? ""),
    createdBy:     String(r.created_by ?? ""),
    createdAt:     String(r.created_at ?? ""),
  };
}

function rowToStudent(r: Record<string, unknown>): RegisteredStudent {
  return {
    rollNumber:  String(r.roll_number),
    fullName:    String(r.full_name),
    email:       String(r.email ?? ""),
    mobile:      String(r.mobile ?? ""),
    college:     String(r.college ?? ""),
    branch:      String(r.branch ?? ""),
    year:        String(r.year ?? ""),
    semester:    String(r.semester ?? ""),
    section:     String(r.section ?? ""),
    cgpa:        String(r.cgpa ?? ""),
    lastLoginAt: String(r.last_login_at ?? new Date().toISOString()),
  };
}

// ── TESTS ─────────────────────────────────────────────────────────────────────
export async function getTests(): Promise<FacultyTest[]> {
  try {
    const res = await fetch(`${DB}/tests`);
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json() as Record<string, unknown>[];
    return rows.map(rowToTest);
  } catch (e) {
    console.error("getTests failed", e);
    return [];
  }
}

export async function saveTest(t: FacultyTest): Promise<void> {
  await fetch(`${DB}/tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t),
  });
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
    const rows = await res.json() as Record<string, unknown>[];
    return rows.map(rowToSubmission);
  } catch (e) {
    console.error("getSubmissions failed", e);
    return [];
  }
}

export async function saveSubmission(s: TestSubmission): Promise<void> {
  await fetch(`${DB}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(s),
  });
}

// ── PRACTICE QUESTIONS ────────────────────────────────────────────────────────
export async function getFacultyPracticeQuestions(): Promise<FacultyPracticeQuestion[]> {
  try {
    const res = await fetch(`${DB}/practice-questions`);
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json() as Record<string, unknown>[];
    return rows.map(rowToPracticeQ);
  } catch (e) {
    console.error("getFacultyPracticeQuestions failed", e);
    return [];
  }
}

export async function saveFacultyPracticeQuestion(q: FacultyPracticeQuestion): Promise<void> {
  await fetch(`${DB}/practice-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(q),
  });
}

export async function deleteFacultyPracticeQuestion(id: string): Promise<void> {
  await fetch(`${DB}/practice-questions/${id}`, { method: "DELETE" });
}

// ── STUDENTS ──────────────────────────────────────────────────────────────────
export async function getRegisteredStudents(): Promise<RegisteredStudent[]> {
  try {
    const res = await fetch(`${DB}/students`);
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json() as Record<string, unknown>[];
    return rows.map(rowToStudent);
  } catch (e) {
    console.error("getRegisteredStudents failed", e);
    return [];
  }
}

export async function upsertRegisteredStudent(s: RegisteredStudent): Promise<void> {
  await fetch(`${DB}/students/upsert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(s),
  });
}
