-- ============================================================
--  McGaw Lists — Microsoft To Do sync tables
--  Paste into Supabase → SQL Editor → Run (once).
-- ============================================================

-- Track when items change, so the sync knows which side is newer
alter table items add column if not exists updated_at timestamptz not null default now();
create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists items_touch on items;
create trigger items_touch before update on items for each row execute function touch_updated_at();

-- Each person's connected Microsoft account (only the server can read this)
create table if not exists ms_accounts (
  member        text primary key references members(id),
  refresh_token text not null,
  ms_name       text,
  ms_email      text,
  connected_at  timestamptz not null default now(),
  last_sync     timestamptz,
  last_error    text
);

-- Short-lived codes used while signing in to Microsoft
create table if not exists ms_auth_states (
  state      text primary key,
  member     text not null references members(id),
  created_at timestamptz not null default now()
);

-- What's linked: a whole To Do list, single tasks, or a #tag
create table if not exists todo_links (
  id             uuid primary key default gen_random_uuid(),
  member         text not null references members(id),
  kind           text not null check (kind in ('list','task','tag')),
  todo_list_id   text,
  todo_list_name text,
  todo_task_id   text,
  tag            text,
  list_id        uuid not null references lists(id) on delete cascade,
  two_way        boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Which To Do task matches which McGaw item
create table if not exists todo_map (
  id           bigserial primary key,
  member       text not null references members(id),
  link_id      uuid not null references todo_links(id) on delete cascade,
  item_id      uuid,
  todo_list_id text not null,
  todo_task_id text not null,
  children     jsonb not null default '{}',
  sig          text not null default ''
);
create index if not exists todo_map_link on todo_map(link_id);
create index if not exists todo_links_member on todo_links(member);

-- Locked down: only the sync function (server) can read or change these
alter table ms_accounts    enable row level security;
alter table ms_auth_states enable row level security;
alter table todo_links     enable row level security;
alter table todo_map       enable row level security;
