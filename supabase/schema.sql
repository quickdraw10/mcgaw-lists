-- ============================================================
--  McGaw Lists — database setup
--  Paste this whole file into Supabase → SQL Editor → Run.
--  BEFORE running: replace the four example emails below with
--  the real email each of you will log in with.
--  (Do this in the SQL editor only — don't commit real emails
--  to the public GitHub repo.)
-- ============================================================

-- ---------- Family ----------
create table if not exists members (
  id          text primary key,              -- 'mike', 'louise', ...
  name        text not null,
  role_label  text,
  email       text not null unique,
  colour      text not null,
  sort        int  not null default 0
);

insert into members (id, name, role_label, email, colour, sort) values
  ('mike',   'Mike',   'Dad', 'mike@example.com',   '#0A84FF', 1),
  ('louise', 'Louise', 'Mum', 'louise@example.com', '#FF375F', 2),
  ('esme',   'Esme',   null,  'esme@example.com',   '#BF5AF2', 3),
  ('oscar',  'Oscar',  null,  'oscar@example.com',  '#30D158', 4)
on conflict (id) do update set email = excluded.email;

-- Who is logged in? Matches the login email to a family member.
create or replace function me() returns text
language sql stable security definer set search_path = public as $$
  select id from members
  where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

-- ---------- Lists & sharing ----------
create table if not exists lists (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('shopping','todo','work','christmas','packing','meals','notice')),
  title      text not null,
  colour     text,
  owner      text not null default me() references members(id),
  settings   jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists list_access (
  list_id  uuid not null references lists(id) on delete cascade,
  member   text not null references members(id),
  role     text not null default 'member' check (role in ('member','admin')),
  added_by text default me() references members(id),
  added_at timestamptz not null default now(),
  primary key (list_id, member)
);

create or replace function can_see(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from lists where id = l and owner = me())
      or exists (select 1 from list_access where list_id = l and member = me())
$$;

create or replace function is_list_admin(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from lists where id = l and owner = me())
      or exists (select 1 from list_access where list_id = l and member = me() and role = 'admin')
$$;

create or replace function is_list_owner(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from lists where id = l and owner = me())
$$;

-- Nobody can change who owns a list
create or replace function lists_guard() returns trigger language plpgsql as $$
begin
  if new.owner <> old.owner then raise exception 'The owner of a list cannot be changed'; end if;
  return new;
end $$;
drop trigger if exists lists_guard on lists;
create trigger lists_guard before update on lists for each row execute function lists_guard();

-- ---------- Items (tasks, shopping, gifts, packing, notices) ----------
create table if not exists items (
  id          uuid primary key default gen_random_uuid(),
  list_id     uuid not null references lists(id) on delete cascade,
  parent_id   uuid references items(id) on delete cascade,   -- sub-tasks
  text        text not null,
  notes       text,
  done        boolean not null default false,
  done_by     text references members(id),
  done_at     timestamptz,
  assignees   text[] not null default '{}',
  due         date,
  priority    smallint not null default 0,
  status      text,
  category    text,
  quantity    text,
  hidden_from text[] not null default '{}',                  -- Christmas secrets
  data        jsonb not null default '{}',
  position    double precision not null default extract(epoch from now()),
  created_by  text default me() references members(id),
  created_at  timestamptz not null default now()
);
create index if not exists items_list on items(list_id);
create index if not exists items_parent on items(parent_id);

-- ---------- Meal planner ----------
create table if not exists meal_slots (
  list_id    uuid not null references lists(id) on delete cascade,
  day        date not null,
  slot       text not null check (slot in ('breakfast','lunch','dinner')),
  meal       text,
  cook       text references members(id),
  notes      text,
  ingredients text,
  updated_by text default me() references members(id),
  primary key (list_id, day, slot)
);

create table if not exists meal_presence (
  list_id uuid not null references lists(id) on delete cascade,
  day     date not null,
  slot    text not null check (slot in ('breakfast','lunch','dinner')),
  member  text not null references members(id),
  status  text not null check (status in ('home','out','late')),
  primary key (list_id, day, slot, member)
);

-- ---------- Notifications ----------
create table if not exists notifications (
  id         bigserial primary key,
  member     text not null references members(id),    -- who receives it
  actor      text references members(id),
  kind       text not null,
  list_id    uuid references lists(id) on delete cascade,
  item_id    uuid,
  body       text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_member on notifications(member, created_at desc);

create table if not exists push_subscriptions (
  endpoint   text primary key,
  member     text not null default me() references members(id),
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

-- ---------- Notification triggers ----------
create or replace function notify_access() returns trigger
language plpgsql security definer set search_path = public as $$
declare actor text := coalesce(me(), new.added_by);
        actor_name text; list_title text;
begin
  select name into actor_name from members where id = actor;
  select title into list_title from lists where id = new.list_id;
  if new.member is distinct from actor then
    if tg_op = 'INSERT' then
      insert into notifications(member, actor, kind, list_id, body)
      values (new.member, actor, 'added', new.list_id,
              coalesce(actor_name,'Someone') || ' added you to “' || list_title || '”'
              || case when new.role = 'admin' then ' as an admin' else '' end);
    elsif tg_op = 'UPDATE' and new.role = 'admin' and old.role <> 'admin' then
      insert into notifications(member, actor, kind, list_id, body)
      values (new.member, actor, 'admin', new.list_id,
              coalesce(actor_name,'Someone') || ' made you an admin of “' || list_title || '”');
    end if;
  end if;
  return new;
end $$;
drop trigger if exists notify_access on list_access;
create trigger notify_access after insert or update on list_access
  for each row execute function notify_access();

create or replace function notify_assign() returns trigger
language plpgsql security definer set search_path = public as $$
declare actor text := coalesce(me(), new.created_by);
        actor_name text; list_title text; m text;
begin
  select name into actor_name from members where id = actor;
  select title into list_title from lists where id = new.list_id;
  foreach m in array new.assignees loop
    if m is distinct from actor
       and (tg_op = 'INSERT' or not (m = any(old.assignees))) then
      insert into notifications(member, actor, kind, list_id, item_id, body)
      values (m, actor, 'assigned', new.list_id, new.id,
              coalesce(actor_name,'Someone') || ' assigned you “' || left(new.text, 60) || '” in ' || list_title);
    end if;
  end loop;
  return new;
end $$;
drop trigger if exists notify_assign on items;
create trigger notify_assign after insert or update of assignees on items
  for each row execute function notify_assign();

-- ---------- Security (row level) ----------
alter table members            enable row level security;
alter table lists              enable row level security;
alter table list_access        enable row level security;
alter table items              enable row level security;
alter table meal_slots         enable row level security;
alter table meal_presence      enable row level security;
alter table notifications      enable row level security;
alter table push_subscriptions enable row level security;

drop policy if exists "family reads family" on members;
create policy "family reads family" on members for select using (me() is not null);

-- Lists: you see lists you own or that are shared with you.
drop policy if exists "see lists"   on lists;
drop policy if exists "make lists"  on lists;
drop policy if exists "edit lists"  on lists;
drop policy if exists "drop lists"  on lists;
create policy "see lists"  on lists for select using (owner = me() or can_see(id));
create policy "make lists" on lists for insert with check (owner = me());
create policy "edit lists" on lists for update using (is_list_admin(id));
create policy "drop lists" on lists for delete using (owner = me());

-- Sharing: only the owner decides who sees a list. Anyone can leave.
drop policy if exists "see access"    on list_access;
drop policy if exists "owner shares"  on list_access;
drop policy if exists "owner changes" on list_access;
drop policy if exists "owner or self removes" on list_access;
create policy "see access"    on list_access for select using (can_see(list_id));
create policy "owner shares"  on list_access for insert with check (is_list_owner(list_id));
create policy "owner changes" on list_access for update using (is_list_owner(list_id));
create policy "owner or self removes" on list_access for delete using (is_list_owner(list_id) or member = me());

-- Items: anyone on the list can add/tick/edit; admins or the creator can delete.
drop policy if exists "see items"  on items;
drop policy if exists "add items"  on items;
drop policy if exists "edit items" on items;
drop policy if exists "drop items" on items;
create policy "see items"  on items for select using (can_see(list_id) and not (me() = any(hidden_from)));
create policy "add items"  on items for insert with check (can_see(list_id));
create policy "edit items" on items for update using (can_see(list_id) and not (me() = any(hidden_from)));
create policy "drop items" on items for delete using (is_list_admin(list_id) or created_by = me());

drop policy if exists "meal slots" on meal_slots;
create policy "meal slots" on meal_slots for all using (can_see(list_id)) with check (can_see(list_id));
drop policy if exists "meal presence" on meal_presence;
create policy "meal presence" on meal_presence for all using (can_see(list_id)) with check (can_see(list_id));

drop policy if exists "my notifications" on notifications;
create policy "my notifications" on notifications for select using (member = me());
drop policy if exists "read my notifications" on notifications;
create policy "read my notifications" on notifications for update using (member = me());
drop policy if exists "clear my notifications" on notifications;
create policy "clear my notifications" on notifications for delete using (member = me());

drop policy if exists "my devices" on push_subscriptions;
create policy "my devices" on push_subscriptions for all using (member = me()) with check (member = me());

-- ---------- Live updates ----------
do $$
declare t text;
begin
  foreach t in array array['lists','list_access','items','meal_slots','meal_presence','notifications'] loop
    begin
      execute format('alter publication supabase_realtime add table %I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
