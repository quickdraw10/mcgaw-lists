-- ============================================================
--  McGaw Lists — November 2026 update
--  Paste this whole file into Supabase → SQL Editor → Run (once).
--  Safe to run again if needed.
-- ============================================================

-- ---------- 1. Security tightening ----------

-- "Added by" is always the person signed in (can't be faked)
create or replace function force_item_creator() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if me() is not null then new.created_by := me(); end if;
  return new;
end $$;
drop trigger if exists items_creator on items;
create trigger items_creator before insert on items for each row execute function force_item_creator();

create or replace function force_access_adder() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if me() is not null then new.added_by := me(); end if;
  return new;
end $$;
drop trigger if exists access_adder on list_access;
create trigger access_adder before insert on list_access for each row execute function force_access_adder();

-- The person a gift is for can't change who it's for (that would reveal if it's been bought)
create or replace function gift_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if me() is not null and (old.data ->> 'for') = me()
     and (new.data ->> 'for') is distinct from (old.data ->> 'for') then
    raise exception 'You can’t change who your own gift idea is for';
  end if;
  return new;
end $$;
drop trigger if exists items_gift_guard on items;
create trigger items_gift_guard before update on items for each row execute function gift_guard();

-- Fixed search paths (keeps Supabase's Security Advisor happy)
do $$ begin
  alter function lists_guard() set search_path = public;
  alter function touch_updated_at() set search_path = public;
exception when undefined_function then null; end $$;

-- ---------- 2. Christmas: bought / wrapped is hidden from the person it's for ----------
create table if not exists gift_status (
  item_id    uuid primary key references items(id) on delete cascade,
  status     text not null default 'idea' check (status in ('idea','bought','wrapped')),
  buyer      text references members(id),
  note       text,
  updated_by text default me() references members(id),
  updated_at timestamptz not null default now()
);

create or replace function gift_visible(i uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from items
    where id = i
      and can_see(list_id)
      and coalesce(data ->> 'for', '') <> coalesce(me(), '')
      and not (coalesce(me(), '') = any(hidden_from))
  )
$$;

alter table gift_status enable row level security;
drop policy if exists "gift status" on gift_status;
create policy "gift status" on gift_status for all
  using (gift_visible(item_id)) with check (gift_visible(item_id));

-- Move any existing bought/wrapped ticks into the private table
insert into gift_status (item_id, status, updated_by)
select i.id, i.data ->> 'status', i.created_by
from items i join lists l on l.id = i.list_id
where l.type = 'christmas' and i.parent_id is null and i.data ->> 'status' in ('bought','wrapped')
on conflict (item_id) do nothing;

update items i set data = i.data - 'status', done = false, done_by = null, done_at = null
from lists l
where l.id = i.list_id and l.type = 'christmas' and i.parent_id is null
  and (i.data ? 'status' or i.done);

-- ---------- 3. Countdowns ----------
create table if not exists countdowns (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  target     timestamptz not null,
  colour     text,
  kind       text not null default 'general',
  list_id    uuid references lists(id) on delete set null,
  owner      text not null default me() references members(id),
  members    text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table countdowns add column if not exists style text not null default 'standard';
create index if not exists countdowns_list on countdowns(list_id);

alter table countdowns enable row level security;
drop policy if exists "see countdowns"  on countdowns;
drop policy if exists "make countdowns" on countdowns;
drop policy if exists "edit countdowns" on countdowns;
drop policy if exists "drop countdowns" on countdowns;
create policy "see countdowns" on countdowns for select
  using (owner = me() or me() = any(members) or (list_id is not null and can_see(list_id)));
create policy "make countdowns" on countdowns for insert
  with check (owner = me() and (list_id is null or can_see(list_id)));
create policy "edit countdowns" on countdowns for update
  using (owner = me() or me() = any(members) or (list_id is not null and can_see(list_id)))
  with check (list_id is null or can_see(list_id));
create policy "drop countdowns" on countdowns for delete
  using (owner = me() or (list_id is not null and is_list_admin(list_id)));

-- ---------- 4. Monthly budget (Mike & Louise only) ----------
alter table members add column if not exists can_budget boolean not null default false;
update members set can_budget = (id in ('mike','louise'));

create or replace function can_budget() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select can_budget from members where id = me()), false)
$$;

create table if not exists budget_accounts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  colour     text,
  sort       double precision not null default extract(epoch from now()),
  created_at timestamptz not null default now()
);

create table if not exists budget_pots (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  colour     text,
  target     numeric(12,2),
  opening    numeric(12,2) not null default 0,
  sort       double precision not null default extract(epoch from now()),
  created_at timestamptz not null default now()
);

create table if not exists budget_entries (
  id            uuid primary key default gen_random_uuid(),
  series        uuid not null default gen_random_uuid(),
  month         date not null check (extract(day from month) = 1),
  kind          text not null check (kind in ('in','out','save','transfer')),
  name          text not null,
  amount        numeric(12,2) not null default 0,
  account_id    uuid references budget_accounts(id) on delete cascade,
  to_account_id uuid references budget_accounts(id) on delete set null,
  pot_id        uuid references budget_pots(id) on delete set null,
  category      text,
  day           smallint check (day between 1 and 31),
  included      boolean not null default true,
  note          text,
  created_by    text default me() references members(id),
  created_at    timestamptz not null default now()
);
create index if not exists budget_entries_month on budget_entries(month);

-- Regular payments: set once, they fill every month they apply to
create table if not exists budget_recurring (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null check (kind in ('in','out','save','transfer')),
  name          text not null,
  amount        numeric(12,2) not null default 0,
  account_id    uuid references budget_accounts(id) on delete cascade,
  to_account_id uuid references budget_accounts(id) on delete set null,
  pot_id        uuid references budget_pots(id) on delete set null,
  category      text,
  freq          text not null default 'monthly' check (freq in ('weekly','fortnightly','4weekly','monthly','yearly')),
  day           smallint check (day between 0 and 31),
  weekday       smallint check (weekday between 0 and 6),
  start_date    date not null default current_date,
  end_date      date,
  note          text,
  created_by    text default me() references members(id),
  created_at    timestamptz not null default now()
);
-- A row here with rule_id set = a one-month change to a regular payment
alter table budget_entries add column if not exists rule_id uuid references budget_recurring(id) on delete cascade;
alter table budget_entries add column if not exists custom_amount boolean not null default false;
create index if not exists budget_entries_rule on budget_entries(rule_id);

-- Bank statement transactions (imported from downloaded statement files)
create table if not exists budget_transactions (
  id           uuid primary key default gen_random_uuid(),
  account_id   uuid not null references budget_accounts(id) on delete cascade,
  date         date not null,
  amount       numeric(12,2) not null,
  description  text not null default '',
  fingerprint  text not null unique,
  batch_id     uuid,
  matched_rule uuid references budget_recurring(id) on delete set null,
  ignored      boolean not null default false,
  note         text,
  created_by   text default me() references members(id),
  created_at   timestamptz not null default now()
);
create index if not exists budget_transactions_acc_date on budget_transactions(account_id, date);

alter table budget_accounts enable row level security;
alter table budget_pots     enable row level security;
alter table budget_entries  enable row level security;
alter table budget_recurring enable row level security;
alter table budget_transactions enable row level security;
drop policy if exists "budget accounts" on budget_accounts;
drop policy if exists "budget pots"     on budget_pots;
drop policy if exists "budget entries"  on budget_entries;
create policy "budget accounts" on budget_accounts for all using (can_budget()) with check (can_budget());
create policy "budget pots"     on budget_pots     for all using (can_budget()) with check (can_budget());
create policy "budget entries"  on budget_entries  for all using (can_budget()) with check (can_budget());
drop policy if exists "budget recurring" on budget_recurring;
create policy "budget recurring" on budget_recurring for all using (can_budget()) with check (can_budget());
drop policy if exists "budget transactions" on budget_transactions;
create policy "budget transactions" on budget_transactions for all using (can_budget()) with check (can_budget());

-- ---------- 5. Live updates for the new tables ----------
do $$
declare t text;
begin
  foreach t in array array['gift_status','countdowns','budget_accounts','budget_pots','budget_entries','budget_recurring','budget_transactions'] loop
    begin
      execute format('alter publication supabase_realtime add table %I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
