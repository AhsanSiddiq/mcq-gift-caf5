-- One row per (day, exam body, channel) the social auto-poster has published.
create table if not exists public.social_posts (
  day date not null,
  body_id text not null,
  channel text not null,
  external_id text,
  created_at timestamptz not null default now(),
  primary key (day, body_id, channel)
);
alter table public.social_posts enable row level security;
