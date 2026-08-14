-- TaxScout real data schema
-- Run this in the Supabase SQL editor for project hdrwbgpskjaextwbdtgc

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  profession text,
  city text,
  state text,
  annual_income numeric,
  stripe_customer_id text,
  subscription_status text,
  subscription_plan text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  merchant text not null,
  amount numeric not null,
  category text not null,
  irs_line text not null,
  confidence smallint not null default 90,
  status text not null check (status in ('deductible', 'personal', 'review')),
  note text,
  reasoning text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_date_idx
  on public.transactions (user_id, date desc);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "transactions: select own" on public.transactions;
create policy "transactions: select own" on public.transactions
  for select using (auth.uid() = user_id);
drop policy if exists "transactions: insert own" on public.transactions;
create policy "transactions: insert own" on public.transactions
  for insert with check (auth.uid() = user_id);
drop policy if exists "transactions: update own" on public.transactions;
create policy "transactions: update own" on public.transactions
  for update using (auth.uid() = user_id);
drop policy if exists "transactions: delete own" on public.transactions;
create policy "transactions: delete own" on public.transactions
  for delete using (auth.uid() = user_id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
