-- Minimal, self-hosted funnel tracking. No third-party analytics service,
-- no cookies beyond a random session id in localStorage.
--
-- Write-only from the client: anon/authenticated can INSERT (so anonymous
-- visitors can log funnel events before signing up), but nobody can SELECT
-- through the public key -- only service_role (used from a server route or
-- direct DB access) can read events back out.

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  event_name text not null,
  properties jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics_events: insert anyone" on public.analytics_events;
create policy "analytics_events: insert anyone" on public.analytics_events
  for insert with check (true);
-- No select policy: reads are denied by default for anon/authenticated.
