-- ============================================================
--  McGaw Lists — Outlook (work email → tasks)
--  Paste into Supabase → SQL Editor → Run (once). Safe to run again.
-- ============================================================

-- Each person's connected work Outlook (only the server can read this)
create table if not exists outlook_accounts (
  member        text primary key references members(id) on delete cascade,
  refresh_token text not null,
  ms_name       text,
  ms_email      text,
  connected_at  timestamptz not null default now(),
  last_pull     timestamptz,
  last_error    text
);
alter table outlook_accounts enable row level security;
-- No policies on purpose: the app can't read sign-in tokens, only the outlook function can.
