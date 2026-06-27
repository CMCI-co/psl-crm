# RESUME — Phi Sigma Lambda CRM

A cold-start brief for picking the build back up in a fresh chat. Read this
first, then continue at **Phase 3** below — no need to re-derive context.

## Status

- **Phases 1 & 2 are complete. Phase 3 is in progress — checkpoints A (the
  traveling cards), B1 (the collaboration store + collab UI atoms), and B2 (the
  `ProfileDetail` engagement workspace) are done.** `tsc --noEmit` passes and
  `npm run build` succeeds (172 modules). This repo is the canonical,
  compile-clean state.
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

1. ✅ **DONE — Profile Card + traveling cards.** Ported from `cards.jsx` into
   `src/features/profile/`: `ProfileCard` (+ `DuePill`, `Cadence` type),
   `ScoreCard`, `MilestonesCard`, `PrayerCard`, and `traveling-cards.ts`
   (`TravelingCardChip` + `DEFAULT_TRAVELING_CARDS`). Added the `CardGlyph` atom
   + `CardGlyphKind` to `components/ui`. The hero record (Marcus) is enriched in
   `data/mock.ts` (`HERO_DETAIL`) so the card renders complete contact detail.
   **Interim wiring:** `RecordPage` renders `<ProfileBody>` (the `ProfileCard` in
   a centered card) for `kind="profile"`; `ScoreCard`/`MilestonesCard`/
   `PrayerCard` are exported and ready, consumed by the workspace in step 2.
2. ✅ **DONE — Collaboration store + collab UI atoms (checkpoint B1).** Added
   `src/lib/collab.tsx` (`CollabProvider` / `useCollab`): identity ("View as"),
   relationship `owners`, follow-up `tasks`, the `activity` feed, and in-app
   `notifs` — nested inside `LifecycleProvider`, routing confirmation toasts
   through lifecycle's single stack. `role`/`canEdit` derive from the selected
   identity (only Campus Director / National Staff can edit), so "View as Anthony
   Reyes" demonstrates permission gating. Exports `EDIT_ROLES`/`canEdit`. Added
   `src/components/collab/` primitives: `MiniAvatar`, `ChannelIcon`,
   `ChannelBadge`, `TaskStatusIcon`, `PriorityFlag` (`atoms.tsx`), `OwnerMenu` /
   `OwnerChip`, and `NewFollowupForm` (+ `PersonRef`). Compiled but not yet
   rendered — consumed by `ProfileDetail` in the next step.
3. ✅ **DONE — Profile workspace / `ProfileDetail` (checkpoint B2).** Ported from
   `engagement.jsx` into `src/features/profile/`: `ProfileDetail` (orchestrator),
   `AccordionCard` (collapsible section shell), `sections.tsx` (the six section
   bodies — How They're Doing, Call Log, Follow-ups, Prayer, Giving, Ways to
   Help), `engagement-atoms.tsx` (`AreaIcon` / `StatusPill`), and
   `engagement-data.ts` (the fixed `LIFE_AREAS` / `CALLS` / `FOLLOWUPS` /
   `PRAYER` / `GIVING` / `HELP` datasets, copied verbatim). It's a desktop
   two-column layout (sticky `ProfileCard` left + accordions right) that
   collapses to a `TabStrip` "card system" on narrow (`w < BP.tab`). `RecordPage`
   now delegates the profile kind to `<ProfileDetail member={…}/>`, which owns its
   own `SubBar` (breadcrumb + Edit / Promote / Log actions) inside RecordPage's
   `AppShell`. Live store items (logged calls, assigned follow-ups) layer over the
   static datasets, filtered by the person; "Promote to Member" routes through
   `useLifecycle().promote(member)`; the Save-log / Assign / reassign / toggle
   writes are all gated by the collab store's `canEdit`. `TabStrip` is now also
   exported from the `ui` barrel. The remaining demo-vs-live wiring of the
   engagement datasets happens in the Supabase sub-resource step below.
4. **Resources** view — from `features.jsx`.
5. **Relationship Tracker** + **ApplicationReview** — from `features.jsx`
   (large file, ~86 KB; scope each carefully into its own checkpoint). The
   Relationship Tracker is where the `ProfileCard` `cadence` prop + `DuePill`
   come into play (the traveling "Next due" cadence).
6. **Training** builder / player / library / games — from the `training-*.jsx`
   files.
7. Wire repositories for the profile sub-resources (interactions, tasks,
   life_areas, prayer_requests, giving, ways_to_help) — tables already exist in
   `supabase/schema.sql`; follow the mock-or-Supabase pattern in
   `src/data/members.ts`. This is also where `ProfileDetail`'s fixed engagement
   datasets and the four cards' fixed demo data (ScoreCard rubric,
   MilestonesCard events, PrayerCard items, the traveling-card chip metas) get
   swapped for live records.

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
