-- ============================================================
-- BK App 数据库初始化脚本 (Supabase PostgreSQL)
-- 在 Supabase Dashboard → SQL Editor 中执行
-- ============================================================

-- 1. 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- 2. 创建枚举类型 (PostgreSQL 兼容语法)
do $$ begin
  create type user_role as enum ('siswa', 'guru_bk');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type attendance_status as enum ('hadir', 'alpha', 'sakit', 'izin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type appointment_status as enum ('pending', 'approved', 'rejected', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type session_status as enum ('scheduled', 'in_progress', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type violation_severity as enum ('ringan', 'sedang', 'berat');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type questionnaire_type as enum ('text', 'multiple_choice', 'rating', 'scale');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type anon_status as enum ('pending', 'answered', 'archived');
exception when duplicate_object then null;
end $$;

-- 3. 创建班级表
create table if not exists classes (
  id text primary key,
  name text not null,
  grade int not null,
  section text not null,
  created_at timestamptz not null default now()
);

-- 插入13个班级
insert into classes (id, name, grade, section) values
('7A', 'Kelas 7A', 7, 'A'), ('7B', 'Kelas 7B', 7, 'B'), ('7C', 'Kelas 7C', 7, 'C'), ('7D', 'Kelas 7D', 7, 'D'),
('8A', 'Kelas 8A', 8, 'A'), ('8B', 'Kelas 8B', 8, 'B'), ('8C', 'Kelas 8C', 8, 'C'), ('8D', 'Kelas 8D', 8, 'D'),
('9A', 'Kelas 9A', 9, 'A'), ('9B', 'Kelas 9B', 9, 'B'), ('9C', 'Kelas 9C', 9, 'C'), ('9D', 'Kelas 9D', 9, 'D'), ('9E', 'Kelas 9E', 9, 'E')
on conflict (id) do nothing;

-- 4. 创建 profiles 表（关联 auth.users）
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'siswa',
  class_id text references classes(id),
  created_at timestamptz not null default now()
);

-- 5. 创建学生表
create table if not exists students (
  id uuid primary key references auth.users(id) on delete cascade,
  nis text unique,
  full_name text not null,
  class_id text not null references classes(id),
  phone text,
  address text,
  created_at timestamptz not null default now()
);

-- 6. 创建问卷表
create table if not exists questionnaires (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  class_id text references classes(id),
  target_role text not null default 'siswa',
  is_active boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 7. 创建问题表
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references questionnaires(id) on delete cascade,
  question_text text not null,
  question_type questionnaire_type not null,
  options text[],
  max_value int default 5,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- 8. 创建答案表
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

-- 9. 创建咨询会话表
create table if not exists counseling_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  counselor_id uuid not null references profiles(id),
  title text not null,
  description text,
  session_type text not null check (session_type in ('individual', 'group')),
  scheduled_at timestamptz,
  completed_at timestamptz,
  status session_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

-- 10. 创建预约表
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  counselor_id uuid references profiles(id),
  title text not null,
  description text,
  preferred_date date not null,
  preferred_time text not null,
  status appointment_status not null default 'pending',
  counselor_notes text,
  created_at timestamptz not null default now()
);

-- 11. 创建匿名提问表
create table if not exists anonymous_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  category text,
  status anon_status not null default 'pending',
  counselor_answer text,
  answered_by uuid references profiles(id),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

-- 12. 创建考勤表
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  class_id text not null references classes(id),
  attendance_date date not null,
  status attendance_status not null,
  noted_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique(student_id, attendance_date)
);

-- 13. 创建违纪表
create table if not exists violations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  class_id text not null references classes(id),
  violation_type text not null,
  description text,
  severity violation_severity not null,
  reported_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 14. 创建成就表
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

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- profiles
alter table profiles enable row level security;
create policy "users read own" on profiles for select using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "users insert own" on profiles for insert with check (auth.uid() = id);

-- questionnaires
alter table questionnaires enable row level security;
create policy "questionnaires read all" on questionnaires for select using (true);
create policy "questionnaires insert guru" on questionnaires for insert with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "questionnaires update guru" on questionnaires for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- answers
alter table answers enable row level security;
create policy "answers insert own" on answers for insert with check (auth.uid() = student_id);
create policy "answers read guru" on answers for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- counseling_sessions
alter table counseling_sessions enable row level security;
create policy "sessions own" on counseling_sessions for select using (auth.uid() = student_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "sessions insert siswa" on counseling_sessions for insert with check (auth.uid() = student_id);
create policy "sessions update guru" on counseling_sessions for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- appointments
alter table appointments enable row level security;
create policy "appointments own" on appointments for select using (auth.uid() = student_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "appointments insert siswa" on appointments for insert with check (auth.uid() = student_id);
create policy "appointments update guru" on appointments for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- anonymous_questions
alter table anonymous_questions enable row level security;
create policy "anon insert" on anonymous_questions for insert with check (true);
create policy "anon read guru" on anonymous_questions for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));
create policy "anon update guru" on anonymous_questions for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- attendance, violations, achievements (guru only)
alter table attendance enable row level security;
create policy "attendance guru" on attendance for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

alter table violations enable row level security;
create policy "violations guru" on violations for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

alter table achievements enable row level security;
create policy "achievements guru" on achievements for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

alter table students enable row level security;
create policy "students read guru" on students for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'guru_bk'));

-- ============================================================
-- 自动创建 profile 触发器
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'siswa')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();