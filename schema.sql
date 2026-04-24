-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create events table
create table public.events (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    category text,
    deadline timestamp with time zone,
    unstop_url text,
    created_at timestamp with time zone default now()
);

-- Create teams table
create table public.teams (
    id uuid default uuid_generate_v4() primary key,
    event_id uuid references public.events(id) on delete cascade,
    name text not null,
    captain_email text,
    created_at timestamp with time zone default now()
);

-- Create members table
create table public.members (
    id uuid default uuid_generate_v4() primary key,
    team_id uuid references public.teams(id) on delete cascade,
    name text not null,
    email text,
    role text, -- 'Leader' or 'Member'
    created_at timestamp with time zone default now()
);

-- Create admins list (or use RLS directly)
create table public.admins (
    email text primary key
);

-- Seed admins
insert into public.admins (email) values 
('aruneshownsty1@gmail.com'),
('harinisrim27@gmail.com')
on conflict (email) do nothing;

-- Basic RLS setup
alter table public.events enable row level security;
alter table public.teams enable row level security;
alter table public.members enable row level security;
alter table public.admins enable row level security;

-- Policies: everyone can read
create policy "Allow public read access to events" on public.events for select using (true);
create policy "Allow public read access to teams" on public.teams for select using (true);
create policy "Allow public read access to members" on public.members for select using (true);

-- Policies: only admins can insert/update/delete
create policy "Allow admin write to events" on public.events for all 
using (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Allow admin write to teams" on public.teams for all 
using (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Allow admin write to members" on public.members for all 
using (auth.jwt() ->> 'email' in (select email from public.admins));
