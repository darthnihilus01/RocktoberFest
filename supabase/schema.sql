-- Run in Supabase SQL editor for live admin sync
create table if not exists event_content (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table event_content enable row level security;

-- public read
create policy "public read" on event_content for select using (true);
-- authenticated write (create an admin user in Supabase Auth first)
create policy "auth write" on event_content for insert with check (auth.role() = 'authenticated');
create policy "auth update" on event_content for update using (auth.role() = 'authenticated');
