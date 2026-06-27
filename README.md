# Phi Sigma Lambda CRM

Relationship-management for a Christian college fraternity — tracking people
through the full lifecycle (**Applicant → Candidate → Active Member → Alumni**),
the relationships around them, and the formation that forms them.

Built with **Vite · React 18 · TypeScript · React Router · TanStack Query ·
Supabase**. It is a production rebuild of the HTML/React prototype, ported 1:1
to a typed component system with a real backend.

---

## Quick start

```bash
npm install
npm run dev
```

Open the printed URL. **No backend needed** — the app boots in *demo mode* on a
bundled sample chapter (the same data the prototype used). A "Demo data" badge
in the top bar shows when you're on demo vs. live data.

To run against Supabase, see [`supabase/README.md`](./supabase/README.md):

```bash
cp .env.example .env   # then add your project URL + anon key
```

| Script            | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the dev server (Vite)               |
| `npm run build`   | Type-check (`tsc --noEmit`) + production build |
| `npm run preview` | Preview the production build              |
| `npm run typecheck` | Type-check only                         |

---

## How it's organized

```
src/
  theme/        Design tokens (3 brands × light/dark) + ThemeProvider/useTheme
  components/
    ui/         Ported atoms (Avatar, Tag, OfficeChip, Button, …)
    layout/     AppShell, TopBar, SubBar, nav controls
  routes/       One component per URL (DirectoryPage, RecordPage, …)
  features/
    directory/  The directory: sidebar + the four lifecycle bodies
  data/         Repositories + React Query hooks; mock dataset; row↔model mapping
  types/        domain.ts (app model) + database.ts (Supabase types)
  lib/          supabase client, viewport hook
supabase/       schema.sql · policies.sql · seed.sql · setup guide
```

### Demo ↔ live, one code path

Every screen reads through a repository (e.g. `useMembers()`). When Supabase env
vars are present the repository queries the database; when they're absent it
returns the mock dataset. Components never know which source they got, so the UI
is identical either way and `seed.sql` mirrors `src/data/mock.ts` 1:1.

### Theming

`ThemeProvider` resolves a brand (Heritage Navy / Evergreen & Cream / Maroon &
Stone) × mode (light/dark) × density (comfortable/compact) into a typed token
object used in inline styles **and** mirrored as CSS variables on `<html>`.
Choices persist to `localStorage` and the first visit honors the OS dark-mode
preference. Switch brand/density from the appearance menu in the top bar.

---

## What's built (Phases 1–2)

- Project scaffold, theme system, and app shell with **real-URL routing**
  (sidebar collapses to a drawer on narrow screens).
- The signature **Active Members** directory — grouped by class year with the
  tinted band, accent marker, and count pills from the prototype; comfortable
  and compact densities; desktop grid + mobile card layouts.
- Bespoke **Candidates / Applicants / Alumni** bodies (search + status filter):
  the candidate "crossing-over" promote rail, the applicant decision-night
  triage with interview scores and Advance / Discuss / Hold recommendations,
  and the alumni roster with an open-to-connect signal and grad-year / major /
  map view switch. All stat chips and banners are computed from live data.
- **Lifecycle transitions** — advance or promote a person singly or in a batch.
  The change is optimistic (they move between views instantly) and, when
  Supabase is configured, persists a `stage_transitions` row + updates
  `members.stage`; a toast confirms each action.
- **Record pages** for profiles, applications, and alumni that read live from
  the data source and show an identity header + key facts.
- Full backend: **`schema.sql` + `policies.sql` (RLS) + `seed.sql`**, with the
  data layer ready to switch from demo to live by adding env vars.

## Roadmap

- **Phase 3** — Profile workspace + Profile Card; Resources; Training (builder +
  player + knowledge checks); Cohorts view.
- **Phase 4** — Relationship Tracker with owners, follow-ups, life areas, and
  real-time collaboration; notifications.

Build order follows the prototype README's "Suggested build order."
