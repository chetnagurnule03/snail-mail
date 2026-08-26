# Snail Mail — starter scaffold

A React + React Three Fiber scaffold for the Snail Mail PRD, wired to
Supabase for auth and a first save/load round trip (character config).
This is intentionally the smallest working slice, not the full MVP —
see the PRD's section 26 for what's still ahead (pets, garden items,
letters, the snail journey, etc.), each of which can follow the exact
same pattern as `characters`.

## What's included

- **Vite + React** app shell (`src/App.jsx`)
- **React Three Fiber** garden scene (`src/components/GardenScene.jsx`) —
  pastel ground, sky, sparkles, a placeholder character capsule you can
  click-to-move, a mailbox, and a few flowers
- **Supabase Auth**: email magic link, or an anonymous "guest" session
  matching the PRD's guest-receiver flow (`src/hooks/useAuth.js`)
- **Supabase save/load**: character config (name, colors, position) is
  loaded on login and upserted back on change (`src/hooks/useCharacter.js`)
- **SQL schema** for the `characters` table with row-level security so
  each user (including guests) can only touch their own row
  (`supabase/schema.sql`)

## Setup

1. **Install dependencies** (needs network access, so run this locally):
```bash
   npm install
```

2. **Create a Supabase project** at supabase.com if you don't have one.

3. **Run the schema**: open your project's SQL editor and paste in the
   contents of `supabase/schema.sql`, then run it.

4. **Enable anonymous sign-ins** (for the guest flow): in the Supabase
   dashboard, go to Authentication → Providers → Anonymous, and turn it on.

5. **Copy your API keys**: Project Settings → API → copy the Project URL
   and the `anon public` key.

6. **Set up your env file**:
```bash
   cp .env.example .env
   # then edit .env and paste in your URL + anon key
```

7. **Run it**:
```bash
   npm run dev
```
   Open the printed localhost URL. Sign in with a magic-link email, or
   tap "Peek inside as a guest" for an anonymous session.

## How the save/load loop works

- On sign-in, `useCharacter` fetches the row from `characters` where
  `user_id` matches the logged-in user. If none exists yet, it seeds a
  default character in memory (not yet saved).
- Clicking "Change outfit color" calls `save()`, which upserts the full
  character object back to Supabase, keyed on `user_id`.
- Clicking the ground moves the character's on-screen position (this
  part is local-only for now — wiring `position` into `save()` on
  move-end is a natural next step once you want persisted garden
  placement).

## Next steps toward the full PRD

Each of these is the same shape as `characters`: a table with RLS, a
`use<Thing>` hook, and a component that renders it.

- `pets` — species, name, accessories (PRD §6, §23)
- `gardens` / `garden_items` — persistent flowers, keepsakes, seeds (§9, §23)
- `letters` — composition, bouquet, surprise, snail, journey stage,
  private token (§10–§16, §23)
- `notifications` — sent/delivered/opened/replied events (§23)
- Realtime: subscribe to a letter's `journey_stage` column via Supabase
  Realtime so the sender/receiver Journey View updates live (§15)
