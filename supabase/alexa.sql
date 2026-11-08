-- ============================================================
--  McGaw Lists — Alexa
--  Paste into Supabase → SQL Editor → Run (once). Safe to run again.
-- ============================================================

-- A short-lived code made in the app, said to Alexa to link a voice to a person
create table if not exists alexa_codes (
  code       text primary key check (code ~ '^[0-9]{4}$'),
  member     text not null default me() references members(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '10 minutes'
);
-- Alexa voice ID (one per person per skill) → family member
create table if not exists alexa_voices (
  person_id  text primary key,
  member     text not null references members(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table alexa_codes  enable row level security;
alter table alexa_voices enable row level security;
drop policy if exists "own codes"  on alexa_codes;
drop policy if exists "own voices" on alexa_voices;
drop policy if exists "forget own voice" on alexa_voices;
-- You can only make, see and delete your own codes. Only the Alexa function links voices.
create policy "own codes" on alexa_codes for all using (member = me()) with check (member = me());
create policy "own voices" on alexa_voices for select using (member = me());
create policy "forget own voice" on alexa_voices for delete using (member = me());

-- Tidy away old codes whenever a new one is made
create or replace function alexa_codes_tidy() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from alexa_codes where expires_at < now() or member = new.member;
  return new;
end $$;
drop trigger if exists alexa_codes_tidy on alexa_codes;
create trigger alexa_codes_tidy before insert on alexa_codes for each row execute function alexa_codes_tidy();
