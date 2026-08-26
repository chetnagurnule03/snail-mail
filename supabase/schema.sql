-- Snail Mail — starter schema
-- Run this in the Supabase SQL editor for your project.
-- This covers just the character save/load slice of the PRD's data
-- model (section 23). Pets, gardens, letters and notifications follow
-- the same pattern: one table per entity, user_id FK, RLS "own rows only".

create table if not exists public.characters (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Little Wanderer',
  skin_tone text not null default '#f2c9a0',
  hair_color text not null default '#7a4a2b',
  outfit_color text not null default '#c9a7e0',
  position jsonb not null default '{"x":0,"y":0,"z":0}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every save.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists characters_set_updated_at on public.characters;
create trigger characters_set_updated_at
  before update on public.characters
  for each row execute procedure public.set_updated_at();

-- Row Level Security: a user (including anonymous/guest sessions)
-- can only read and write their own character row.
alter table public.characters enable row level security;

drop policy if exists "characters_select_own" on public.characters;
create policy "characters_select_own"
  on public.characters for select
  using (auth.uid() = user_id);

drop policy if exists "characters_upsert_own" on public.characters;
create policy "characters_upsert_own"
  on public.characters for insert
  with check (auth.uid() = user_id);

drop policy if exists "characters_update_own" on public.characters;
create policy "characters_update_own"
  on public.characters for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
