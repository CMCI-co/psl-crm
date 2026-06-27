# RESUME — Phi Sigma Lambda CRM

A cold-start brief for picking the build back up in a fresh chat. Read this
first, then continue at **Phase 3** below — no need to re-derive context.

## Status

- **Phases 1 & 2 are complete.** `tsc --noEmit` passes and `npm run build`
  succeeds (155 modules). This repo is the canonical, compile-clean state.
- **Stack:** Vite 5 · React 18 · TypeScript 5.5 (strict) · react-router-dom 6 ·
  TanStack Query 5 · Supabase JS 2. Styling is **typed inline styles** via
  `useTheme()` / `t.*` (no Tailwind) — a faithful 1:1 port of the prototype.
- **Demo mode:** with no env vars the data layer serves the in-memory mock
  roster, so `npm install && npm run dev` runs with zero backend. Add
  `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` to `.env` and run the three
  files in `supabase/` (`schema.sql` → `policies.sql` → `seed.sql`) to go live.

## What already works

- Theme system: 3 brands (Navy / Evergreen / Maroon) × light/dark × density,
  persisted, with OS dark-mode detection.
- App shell: sticky top bar, sidebar that collapses to a drawer, real-URL routing.
- **Directory (all four lifecycle views):**
  - Active Members — class-grouped bands, desktop grid + mobile cards.
  - Candidates — *Promote to Member* (single + batch via Select).
  - Applicants — interview score + Advance/Discuss/Hold recommendation; advance
    (single + batch).
  - Alumni — open-to-connect signal; By grad year / By major / Map switch.
- **Lifecycle store** (`src/lib/lifecycle.tsx`): optimistic stage overrides so a
  promotion moves a person between views instantly and updates sidebar counts;
  persists a `stage_transitions` row + updates `members.stage` when Supabase is
  live; `Toasts` confirm each action; `useEffectiveMembers()` is the
  override-aware members hook every directory surface reads through.
- Record pages (`/profile/:id`, `/application/:id`, `/alumni/:id`) — currently a
  basic identity header + facts grid. **Phase 3 expands these into the full
  Profile workspace.**

## Resume here — Phase 3

Build order. Each step is its own compile-clean sub-checkpoint: write to disk →
`tsc --noEmit` → `npm run build` → zip to `/mnt/user-data/outputs` →
`present_files`. Re-zip at each step; never hold all code in chat.

1. **Profile Card** (the "traveling" card that follows a person across stages) —
   port from `cards.jsx`. Then `ScoreCard`, `MilestonesCard`, `PrayerCard`.
2. **Profile workspace / `ProfileDetail`** with accordion sections — port from
   `engagement.jsx`; wire into `RecordPage` for `kind="profile"`.
3. **Resources** view — from `features.jsx`.
4. **Relationship Tracker** + **ApplicationReview** — from `features.jsx`
   (large file, ~86 KB; scope each carefully into its own checkpoint).
5. **Training** builder / player / library / games — from the `training-*.jsx`
   files.
6. Wire repositories for the profile sub-resources (interactions, tasks,
   life_areas, prayer_requests, giving, ways_to_help) — tables already exist in
   `supabase/schema.sql`; follow the mock-or-Supabase pattern in
   `src/data/members.ts`.

## Patterns to keep (do not drift)

- Typed inline styles via `useTheme()`; design is a **fixed contract** —
  recreate the prototype faithfully, don't reinterpret.
- `canEdit` prop gates every write action in profile screens.
- Batch selection keys by `person.id` (not name).
- Notifications never fire for the current user's own actions.
- Every new data type gets a mock-or-Supabase repository + a React Query hook,
  exactly like `src/data/members.ts`.

## Prototype source (read-only at `/mnt/project/`)

`cards.jsx`, `engagement.jsx`, `features.jsx`, `training-*.jsx`, plus
`kit.jsx` (tokens/atoms/mock), `collab.jsx` (store/batch), `directory.jsx`.

## Shell gotchas (this build environment)

- Heredocs need a quoted delimiter: `cat > f <<'PSLEOF'`.
- `mkdir -p {a,b}` brace-expansion does **not** work — call mkdir per path.
- Background `&` processes don't persist across separate tool calls (run
  `npm install` synchronously).
- `create_file` errors if the path exists — use `cat >` or `str_replace` to edit.

## Dead code

`src/features/directory/RosterBody.tsx` is no longer imported (Phase 2 replaced
it with the three bespoke bodies). Safe to delete; harmless if left.
