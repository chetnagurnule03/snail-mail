-- Snail Mail — starter schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists public.characters (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Little Wanderer',
  skin_tone text not null default '#f2c9a0',
  hair_color text not null default '#7a4a2b',
  hair_style text not null default 'wanderer_cap', -- 'wanderer_cap', 'cute_bob', 'braids', 'wavy_locks'
  outfit_color text not null default '#c9a7e0',
  outfit_style text not null default 'wanderer_coat', -- 'wanderer_coat', 'cozy_sweater', 'gardener_overalls', 'fairy_dress'
  accessory text not null default 'backpack', -- 'none', 'backpack', 'cozy_scarf', 'flower_crown', 'round_glasses'
  pet1_type text not null default 'bunny',
  has_horse boolean not null default true,
  position jsonb not null default '{"x":0,"y":0,"z":0}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Add columns if table already exists
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS hair_style text DEFAULT 'wanderer_cap';
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS outfit_style text DEFAULT 'wanderer_coat';
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS accessory text DEFAULT 'backpack';
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS pet1_type text DEFAULT 'bunny';
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS has_horse boolean DEFAULT true;

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

-- Row Level Security
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
