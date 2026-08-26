# Snail Mail — Agent Instructions

This file is read by agents (e.g. in Google Antigravity) working in this
repository. Keep it up to date as the project grows.

## What this is

A React Three Fiber 3D storybook world where users create a character,
keep a pet and garden, and send digital letters that travel via an
animated snail. Full product spec lives at `docs/Snail_Mail_PRD_v2.docx`
— every feature decision should trace back to a numbered section there.

## Stack

- **Frontend**: React 18 + Vite, React Three Fiber (`@react-three/fiber`)
  + drei (`@react-three/drei`) for 3D, plain CSS-in-JS style objects for
  HUD/overlay UI (no CSS framework yet).
- **Backend**: Supabase — Postgres, Auth (email magic link + anonymous
  guest sessions), Realtime, Row Level Security on every table.
- **No global state library** — data flows through small hooks
  (`src/hooks/*`) that wrap Supabase queries; components consume them
  directly. Keep this pattern unless a real need for something heavier
  shows up.

## Project structure

src/ components/ 3D scene pieces + UI screens (GardenScene, AuthGate, ...) hooks/ useAuth, useCharacter, and future useX per entity supabaseClient.js supabase/ schema.sql Source of truth for DB schema — update this file whenever a table changes, don't just run ad-hoc SQL.


## Conventions

- One Supabase table per PRD entity (`characters`, and eventually `pets`,
  `gardens`, `garden_items`, `letters`, `notifications` — see PRD §23).
  Each gets: a table in `schema.sql` with RLS "own rows only" policies,
  a `use<Entity>` hook for load/save, and a component to render it.
- Every table needs Row Level Security enabled before it ships — no
  exceptions, since letters/characters carry personal data (PRD §21
  Trust & Safety).
- Respect the product's "no pressure" philosophy: no streaks, no decay,
  no daily-login mechanics, nothing that punishes the user for being
  away. If a feature request implies one of these, flag it rather than
  building it silently.
- Guest (anonymous) sessions must work for the receiver flow — don't
  add features that assume every user has a permanent account without
  checking `user.is_anonymous` first.
- 3D assets/materials should stay in the soft pastel storybook palette
  established in `GardenScene.jsx` (creams, sage green, pink, lavender,
  peach, warm brown) — avoid photorealistic materials or harsh lighting.

## Before committing

- Run `npm run build` to catch obvious breakage (no CI configured yet).
- If you added/changed a table, update `supabase/schema.sql` in the same
  change, and note the migration in this file's changelog below if it's
  a breaking change to existing rows.

## Changelog (schema-affecting changes only)

- Initial scaffold: `characters` table (name, skin_tone, hair_color,
  outfit_color, position), RLS by `user_id`.
