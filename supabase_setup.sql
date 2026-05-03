-- Run this in your Supabase Dashboard → SQL Editor

-- Faculty Tests
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

-- Test Submissions
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

-- Practice Questions
create table if not exists practice_questions (
  id text primary key,
  title text not null,
  description text,
  difficulty text check (difficulty in ('easy','medium','hard')) default 'easy',
  tags text[] default '{}',
  options jsonb not null default '[]',
  correct_answer integer not null default 0,
  explanation text,
  created_by text,
  created_at timestamptz not null default now()
);

-- Registered Students
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

-- Enable Row Level Security (open for now since we use service_role on server)
alter table faculty_tests       enable row level security;
alter table test_submissions    enable row level security;
alter table practice_questions  enable row level security;
alter table registered_students enable row level security;

-- Allow all operations via service_role (server-side only)
create policy "service_role full access" on faculty_tests       for all using (true);
create policy "service_role full access" on test_submissions    for all using (true);
create policy "service_role full access" on practice_questions  for all using (true);
create policy "service_role full access" on registered_students for all using (true);
