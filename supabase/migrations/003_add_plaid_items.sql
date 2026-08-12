-- Run this in the Supabase SQL editor to add Plaid bank-connection storage.
-- access_token grants read access to real bank data, so this table is
-- intentionally NOT readable via the anon/user key at all -- only the
-- service_role key (used server-side in webhook/API routes) can touch it.

create table if not exists public.plaid_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  access_token text not null,
  item_id text not null unique,
  institution_name text,
  cursor text,
  created_at timestamptz not null default now()
);

create index if not exists plaid_items_user_id_idx on public.plaid_items (user_id);

alter table public.plaid_items enable row level security;
-- No policies are created: with RLS enabled and zero policies, every
-- request using the anon/user key is denied by default. Only the
-- service_role key (which bypasses RLS entirely) can read or write here.
