# Phi Sigma Lambda CRM

A relationship-management app for a Christian college fraternity chapter. People move through a one-way lifecycle — **Applicant → Candidate → Active Member → Alumni** — and a single **Profile Card** travels with each person the whole way.

This repository is a production React + Supabase application built from the design prototype. It **runs today on in-memory mock data** (no backend required) and flips to Supabase by changing one environment variable.

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173. It starts on the **Active Members** directory with the full seeded roster. No backend or keys are needed in mock mode.

Other scripts:

```bash
npm run build      # type-check + production build
npm run typecheck  # tsc --noEmit
npm run preview    # preview the production build
npm run lint       # eslint
```

Requirements: Node 18+ (Node 20 recommended).

---

## What works right now (mock mode)

- **Directory** with all four stage views — Applicants, Candidates, Active Members, Alumni — reachable from the sidebar and by URL.
  - Active Members can be grouped **By class**, **By cohort**, or shown as a flat **Table**. Class/cohort groups get the tinted band with a count pill.
  - Applicants show an interview score and an auto-derived **recommendation** (Advance / Discuss / Hold / Awaiting).
  - Alumni show expanded fields (graduating class, work, location, open-to-connect).
- **Lifecycle transitions**, all three ways:
  1. **Single from a list** — the per-row action (e.g. *Promote to Member*).
  2. **Single from a profile** — the stage-aware button in the profile sub-bar.
  3. **Batch** — toggle **Select**, choose rows (with select-all + indeterminate), then act from the floating batch bar.
- **Profile** built on the traveling **Profile Card**, plus the Interview Scorecard, Milestones timeline, and Prayer Requests cards. Responsive: two columns on desktop, a tab strip on mobile.
- **Collaboration layer** — promotions, reassignments, and new follow-ups fan out **toasts, notifications, and an activity feed** (you never notify yourself). Switch the acting user from the top bar to see it.
- **Theming** — Navy / Evergreen / Maroon brand palettes, light/dark, comfortable/compact density. Fully responsive down to phone widths (drawer nav, stacked cards).
- **Roles** — National Staff, Campus Director (default), Member, Candidate. Management actions are gated by role.

See [`BUILD_STATUS.md`](./BUILD_STATUS.md) for exactly what is built, what is scaffolded, and the next steps.

---

## Architecture

```
src/
  theme/        design tokens (exact prototype values) + ThemeProvider
  types/        the domain model (Stage, Member, Task, …) + lifecycle flow
  data/         the swappable data layer  ← key design decision
  store/        Zustand: collab (toasts/notifs/activity) + batch selection
  auth/         role context + permission helpers (maps to Supabase RLS)
  lib/          supabase client, office helpers, recommend()
  components/   atoms, responsive (drawer), collab chrome, chrome (bars), cards
  features/     directory/, profile/, and scaffolds for the rest
supabase/       schema.sql, policies.sql, seed.sql
```

### The swappable data source (the important bit)

Every screen talks to a single `DataSource` interface (`src/data/DataSource.ts`) through TanStack Query hooks (`src/data/queries.ts`). There are two implementations:

- `mockDataSource` — in-memory, seeded from the prototype. Runs with no backend.
- `supabaseDataSource` — the real Postgres-backed implementation.

`src/data/index.ts` picks one based on `VITE_DATA_SOURCE`. **Nothing else in the app changes** when you switch — the UI, the collab store, and the lifecycle logic are identical in both modes. This is what lets the app run today and move to Supabase later without a rewrite.

---

## Moving to Supabase

1. Create a Supabase project.
2. In the SQL editor, run, in order:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
   - `supabase/seed.sql`
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   VITE_DATA_SOURCE=supabase
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
4. Create your account through Supabase Auth, then link it to the seeded chapter so RLS lets you see the roster (see the commented `UPDATE` at the bottom of `seed.sql`).
5. `npm run dev`.

The seed mirrors the mock dataset, so the app looks the same before and after the cutover.

---

## Notes

- Styling follows the prototype faithfully (theme-driven inline styles). Brand palettes, dark mode, and density all come from `src/theme/tokens.ts`.
- The prototype's `window.PSLNav` navigation is replaced by real React Router URLs.
- This is an honest first pass: the Directory and Profile slices are built end-to-end; the Relationship Tracker, Resources, full Application Review, and Training are scaffolded with their specs. See `BUILD_STATUS.md`.
