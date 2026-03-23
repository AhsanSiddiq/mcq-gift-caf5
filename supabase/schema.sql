-- Fix: Change questions.id from UUID to TEXT to support string IDs like 'c1q1'
-- Run this in Supabase SQL Editor BEFORE re-running the seed script.

-- Drop existing tables and recreate with text IDs
-- (safe to run if tables are empty)

drop table if exists public.attempts cascade;
drop table if exists public.options cascade;
drop table if exists public.questions cascade;

-- Recreate questions with TEXT primary key
create table public.questions (
  id            text primary key,              -- e.g. 'c1q1', 'c2q5'
  subject_id    text not null,
  level         text not null,
  topic         text,
  chapter       int,
  question_text text not null,
  explanation   text,
  difficulty    text default 'medium',
  source        text,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_questions_subject on public.questions(subject_id);
create index if not exists idx_questions_topic   on public.questions(subject_id, topic);

alter table public.questions enable row level security;

create policy "Allow public read" on public.questions
  for select using (is_active = true);

-- Recreate options (FK still references questions.id, now text)
create table public.options (
  id           uuid primary key default gen_random_uuid(),
  question_id  text not null references public.questions(id) on delete cascade,
  option_key   char(1) not null,
  option_text  text not null,
  is_correct   boolean not null default false
);

create index if not exists idx_options_question on public.options(question_id);

alter table public.options enable row level security;

create policy "Allow public read" on public.options
  for select using (true);

-- Recreate attempts
create table public.attempts (
  id           uuid primary key default gen_random_uuid(),
  session_id   text not null,
  question_id  text not null references public.questions(id),
  selected_key char(1) not null,
  is_correct   boolean not null,
  time_taken   int,
  created_at   timestamptz default now()
);

create index if not exists idx_attempts_session on public.attempts(session_id);

alter table public.attempts enable row level security;

create policy "Allow session insert" on public.attempts
  for insert with check (true);

create policy "Allow session read" on public.attempts
  for select using (true);

-- Auto-update trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_questions_updated_at
  before update on public.questions
  for each row execute procedure public.set_updated_at();
