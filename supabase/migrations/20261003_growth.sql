-- Growth & monetization tables. Run in the Supabase SQL editor.
-- All tables are written only from server routes using the service key,
-- so RLS is enabled with no public policies.

-- 1. Waitlist for exam bodies that are not live yet (demand validation)
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  body_id     text not null,
  country     text,
  level       text,
  created_at  timestamptz default now(),
  unique (email, body_id)
);
create index if not exists idx_waitlist_body on public.waitlist(body_id);
alter table public.waitlist enable row level security;

-- 2. Pro memberships (one row per email)
create table if not exists public.pro_members (
  email        text primary key,
  plan         text not null,              -- 'monthly' | 'sitting'
  status       text not null default 'active', -- 'active' | 'cancelled' | 'expired'
  source       text not null,              -- 'lemonsqueezy' | 'manual'
  external_id  text,                       -- provider subscription / order id
  expires_at   timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table public.pro_members enable row level security;

-- 3. Manual local-payment requests (JazzCash / Easypaisa / bank / UPI / bKash)
create table if not exists public.payment_requests (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  plan         text not null,
  currency     text not null,
  amount       numeric not null,
  method       text not null,
  reference    text not null,              -- transaction id entered by the student
  country      text,
  status       text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at   timestamptz default now(),
  reviewed_at  timestamptz
);
create index if not exists idx_payment_requests_status on public.payment_requests(status);
alter table public.payment_requests enable row level security;

-- 4. OTP brute-force protection (verify-otp locks a code after 5 wrong tries)
alter table public.otp_sessions add column if not exists attempts int not null default 0;

-- 5. AI tutor: shared answer cache + per-day usage counters
create table if not exists public.tutor_cache (
  cache_key   text primary key,          -- question_id|mode|chosen
  answer      text not null,
  created_at  timestamptz default now()
);
alter table public.tutor_cache enable row level security;

create table if not exists public.tutor_usage (
  usage_key   text not null,             -- email or ip:<addr>
  day         date not null,
  count       int not null default 0,
  primary key (usage_key, day)
);
alter table public.tutor_usage enable row level security;
