-- Run this in the Supabase SQL editor to add Stripe subscription tracking
-- to an existing database (schema.sql already applied).

alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists subscription_status text;
alter table public.profiles add column if not exists subscription_plan text;
alter table public.profiles add column if not exists current_period_end timestamptz;

create unique index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;
