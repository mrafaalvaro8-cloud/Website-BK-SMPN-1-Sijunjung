export const DB_SCHEMA = `
-- 1. Auth profiles (linked to Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('siswa', 'guru_bk')),
  class_id text,  -- e.g. '7A', '8B', '9C' — only for siswa
  created_at timestamptz not null default now()
);

-- 2. Classes
create table if not exists classes (
  id text primary key,  -- '7A', '7B', ..., '9E'
  name text not null,   -- 'Kelas 7A'
  grade int not null,
  section text not null,
  created_at timestamptz not null default now()
);

-- 3. Students (supplementary student data beyond auth)
create table if not exists students (
  id uuid primary key references auth.users(id) on delete cascade,
  nis text unique,
  full_name text not null,
  class_id text not null references classes(id),
  phone text,
  address text,
  created_at timestamptz not null default now()
);

-- 4. Questionnaires (created by guru BK)
create table if not exists questionnaires (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  class_id text references classes(id),  -- null = all classes
  target_role text not null default 'siswa' check (target_role in ('siswa')),
  is_active boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 5. Questions (per questionnaire)
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references questionnaires(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('text', 'multiple_choice', 'rating', 'scale')),
  options text[],  -- for multiple_choice
  max_value int default 5,  -- for scale
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. Answers (student responses)
create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references questionnaires(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  answer_text text,
  answer_value text,
  submitted_at timestamptz not null default now(),
  unique(questionnaire_id, student_id, question_id)
);

-- 7. Counseling sessions
create table if not exists counseling_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  counselor_id uuid not null references profiles(id),
  title text not null,
  description text,
  session_type text not null check (session_type in ('individual', 'group')),
  scheduled_at timestamptz,
  completed_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

-- 8. Appointments (student booking)
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  counselor_id uuid references profiles(id),
  title text not null,
  description text,
  preferred_date date not null,
  preferred_time text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  counselor_notes text,
  created_at timestamptz not null default now()
);

-- 9. Anonymous questions
create table if not exists anonymous_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  category text,
  status text not null default 'pending' check (status in ('pending', 'answered', 'archived')),
  counselor_answer text,
  answered_by uuid references profiles(id),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

-- 10. Attendance (for EWS)
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  class_id text not null references classes(id),
  attendance_date date not null,
  status text not null check (status in ('hadir', 'alpha', 'sakit', 'izin')),
  noted_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique(student_id, attendance_date)
);

-- 11. Violations
create table if not exists violations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  class_id text not null references classes(id),
  violation_type text not null,
  description text,
  severity text not null check (severity in ('ringan', 'sedang', 'berat')),
  reported_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 12. Achievements
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  class_id text not null references classes(id),
  achievement_type text not null,
  description text,
  date date not null,
  noted_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table questionnaires enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;
alter table counseling_sessions enable row level security;
alter table appointments enable row level security;
alter table anonymous_questions enable row level security;
alter table attendance enable row level security;
alter table violations enable row level security;
alter table achievements enable row level security;
alter table students enable row level security;

-- Profiles: users can read own, guru_bk can read all
create policy "users read own profile" on profiles for select using (auth.uid() = id or exists (select 1 from profiles p2 where p2.id = auth.uid() and p2.role = 'guru_bk'));
create policy "users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Questionnaires: anyone can read active ones, guru can manage
create policy "questionnaires read all" on questionnaires for select using (true);
create policy "questionnaires insert guru" on questionnaires for insert with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "questionnaires update guru" on questionnaires for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- Answers: siswa can insert own, guru can read all
create policy "answers insert own" on answers for insert with check (auth.uid() = student_id);
create policy "answers read guru" on answers for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- Counseling sessions: siswa can see own, guru can see all
create policy "counseling own" on counseling_sessions for select using (auth.uid() = student_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "counseling insert siswa" on counseling_sessions for insert with check (auth.uid() = student_id);
create policy "counseling update guru" on counseling_sessions for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- Appointments: similar
create policy "appointments own" on appointments for select using (auth.uid() = student_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "appointments insert siswa" on appointments for insert with check (auth.uid() = student_id);
create policy "appointments update guru" on appointments for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- Anonymous questions: anyone can insert, guru can read/update
create policy "anon questions insert" on anonymous_questions for insert with check (true);
create policy "anon questions read guru" on anonymous_questions for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "anon questions update guru" on anonymous_questions for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- Attendance, violations, achievements: guru only
create policy "attendance guru" on attendance for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "violations guru" on violations for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "achievements guru" on achievements for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- Students: guru can read all
create policy "students read guru" on students for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
`;
