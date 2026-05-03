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

const TESTS_KEY      = "bigbrains_faculty_tests";
const SUBS_KEY       = "bigbrains_test_submissions";
const PRACTICE_KEY   = "bigbrains_faculty_practice_qs";
const STUDENTS_KEY   = "bigbrains_registered_students";

export function getTests(): FacultyTest[] {
  try { return JSON.parse(localStorage.getItem(TESTS_KEY) || "[]"); } catch { return []; }
}
export function saveTest(t: FacultyTest) {
  const list = getTests().filter(x => x.id !== t.id);
  localStorage.setItem(TESTS_KEY, JSON.stringify([...list, t]));
}
export function deleteTest(id: string) {
  localStorage.setItem(TESTS_KEY, JSON.stringify(getTests().filter(t => t.id !== id)));
}
export function toggleTest(id: string) {
  const list = getTests().map(t => t.id === id ? { ...t, isActive: !t.isActive } : t);
  localStorage.setItem(TESTS_KEY, JSON.stringify(list));
}

export function getSubmissions(): TestSubmission[] {
  try { return JSON.parse(localStorage.getItem(SUBS_KEY) || "[]"); } catch { return []; }
}
export function saveSubmission(s: TestSubmission) {
  localStorage.setItem(SUBS_KEY, JSON.stringify([...getSubmissions(), s]));
}

export function getFacultyPracticeQuestions(): FacultyPracticeQuestion[] {
  try { return JSON.parse(localStorage.getItem(PRACTICE_KEY) || "[]"); } catch { return []; }
}
export function saveFacultyPracticeQuestion(q: FacultyPracticeQuestion) {
  const list = getFacultyPracticeQuestions().filter(x => x.id !== q.id);
  localStorage.setItem(PRACTICE_KEY, JSON.stringify([...list, q]));
}
export function deleteFacultyPracticeQuestion(id: string) {
  localStorage.setItem(PRACTICE_KEY, JSON.stringify(getFacultyPracticeQuestions().filter(q => q.id !== id)));
}

export function getRegisteredStudents(): RegisteredStudent[] {
  try { return JSON.parse(localStorage.getItem(STUDENTS_KEY) || "[]"); } catch { return []; }
}
export function upsertRegisteredStudent(s: RegisteredStudent) {
  const list = getRegisteredStudents().filter(x => x.rollNumber !== s.rollNumber);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify([...list, s]));
}
