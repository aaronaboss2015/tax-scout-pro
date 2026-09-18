-- One internal view for weekly funnel review, built on top of the existing
-- self-hosted analytics_events log. No dashboard UI -- just run this in the
-- Supabase SQL editor:
--
--   select * from public.weekly_funnel order by week desc;
--
-- One row per week, one column per funnel event, plus a unique-session count
-- so raw event volume can be read relative to actual traffic.

create or replace view public.weekly_funnel as
select
  date_trunc('week', created_at)                                 as week,
  count(*) filter (where event_name = 'landing_page_view')       as landing_page_views,
  count(*) filter (where event_name = 'demo_page_view')          as demo_page_views,
  count(*) filter (where event_name = 'calculator_page_view')    as calculator_page_views,
  count(*) filter (where event_name = 'calculator_interacted')   as calculator_interactions,
  count(*) filter (where event_name = 'about_page_view')         as about_page_views,
  count(*) filter (where event_name = 'signup_started')          as signups_started,
  count(*) filter (where event_name = 'signup_completed')        as signups_completed,
  count(*) filter (where event_name = 'onboarding_completed')    as onboarding_completed,
  count(*) filter (where event_name = 'checkout_clicked')        as checkouts_clicked,
  count(*) filter (where event_name = 'trial_ended')             as trials_ended,
  count(*) filter (where event_name = 'subscription_cancelled')  as subscriptions_cancelled,
  count(distinct session_id)                                     as unique_sessions
from public.analytics_events
group by 1
order by 1 desc;

-- analytics_events has no anon/authenticated select policy -- match that
-- posture here so the view can't be queried through the public API either,
-- only via the Supabase SQL editor or a service-role connection.
revoke all on public.weekly_funnel from anon, authenticated;
