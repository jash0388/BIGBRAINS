import { Router, Request, Response } from "express";

const router = Router();

const SUPABASE_URL            = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Extract project ref from URL  e.g. https://abcxyz.supabase.co → abcxyz
const projectRef = SUPABASE_URL.replace("https://", "").split(".")[0];

const CREATE_SQL = `
create table if not exists faculty_tests (
  id text primary key,
  title text not null,
  description text,
  duration integer not null default 30,
  questions jsonb not null default '[]',
  created_by text,
  created_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table if not exists test_submissions (
  id text primary key,
  test_id text not null,
  test_title text,
  student_name text not null,
  student_roll text not null,
  answers jsonb not null default '{}',
  score integer not null default 0,
  total_marks integer not null default 0,
  percentage numeric(5,2) not null default 0,
  time_taken integer,
  submitted_at timestamptz not null default now()
);

create table if not exists practice_questions (
  id text primary key,
  title text not null,
  description text,
  difficulty text default 'easy',
  tags text[] default '{}',
  options jsonb not null default '[]',
  correct_answer integer not null default 0,
  explanation text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists registered_students (
  roll_number text primary key,
  full_name text not null,
  email text,
  mobile text,
  college text,
  branch text,
  year text,
  semester text,
  section text,
  cgpa text,
  last_login_at timestamptz not null default now()
);
`;

router.post("/init-db", async (_req: Request, res: Response) => {
  try {
    const mgmtRes = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ query: CREATE_SQL }),
      }
    );

    const text = await mgmtRes.text();
    res.status(mgmtRes.status).json({ status: mgmtRes.status, body: text });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/check-tables", async (_req: Request, res: Response) => {
  const tables = ["faculty_tests", "test_submissions", "practice_questions", "registered_students"];
  const results: Record<string, string> = {};
  for (const t of tables) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${t}?limit=1`, {
      headers: {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });
    results[t] = r.ok ? "OK" : `MISSING (${r.status})`;
  }
  res.json({ results });
});

export default router;
