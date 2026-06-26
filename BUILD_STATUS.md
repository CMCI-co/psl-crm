# BUILD_STATUS.md

Handoff / continuation doc for the **Phi Sigma Lambda CRM** build. If this chat
ends, a new session (or you) can pick up from here. It records what's done, what's
scaffolded, the architecture, the exact next steps, and the decisions made along
the way.

**Status:** Pass 1 complete and runnable. The app **builds clean** (`tsc --noEmit`
passes; `npm run build` succeeds — 176 modules) and **runs today on mock data with
no backend**. The Directory and Profile slices are built end-to-end; the remaining
screens are scaffolded with their specs.

---

## How to run

```bash
npm install
npm run dev        # http://localhost:5173 — opens on Active Members
npm run build      # tsc --noEmit && vite build  (verified passing)
npm run typecheck
```

Mock mode needs no env vars or backend. To use Supabase, see "Flipping to
Supabase" below.

---

## ✅ Done — built end-to-end (works in mock mode)

**Foundation**
- Vite + React 18 + TypeScript, path alias `@ → src`, single `tsconfig.json`
  (no project refs), ESLint. Build pipeline verified.
- Theme system (`src/theme/`): exact prototype tokens, 3 brand palettes
  (Navy/Evergreen/Maroon), light/dark, comfortable/compact density, persisted to
  localStorage. `ThemeProvider` + `useTheme`.
- Domain model (`src/types/domain.ts`): `Stage`, `Member`, `Task`, `Interaction`,
  `Milestone`, `PrayerRequest`, notifications/activity, `STAGE_FLOW` (the one-way
  lifecycle), `STAGE_LABEL`, `fullName()`.
- **Swappable data layer** (`src/data/`) — the key architectural move:
  `DataSource` interface, `mockDataSource` (in-memory, seeded from prototype),
  `supabaseDataSource` (real, type-correct), `index.ts` picks via
  `VITE_DATA_SOURCE`, `queries.ts` (TanStack Query hooks with invalidation).
- Collab store (`src/store/collab.ts`, Zustand): toasts, notifications, activity
  feed, tasks; `announceStage` / `announceStageMany` / `announceReassign`; never
  notifies the acting user. Batch-selection store (`src/store/useBatch.ts`).
- Roles/permissions (`src/auth/`): 4 roles, `canManage` gating, persisted role,
  maps conceptually to Supabase RLS.

**Directory** (`src/features/directory/`)
- Shell: TopBar + Sidebar + content; per-view KPI chips; responsive (sidebar
  collapses into the drawer below the tablet breakpoint).
- All four stage bodies:
  - `ActiveBody` — grouped **By class** / **By cohort** / flat **Table** (segmented
    control in the header); tinted group band with 3px accent marker + count pill;
    compact density drops the secondary chip line.
  - `CandidateBody` — per-row *Promote to Member*, "crossing over" intro band,
    empty/done state.
  - `ApplicantBody` — interview score + derived recommendation chip, per-row
    advance, row → Application Review.
  - `AlumniBody` — expanded fields (grad year, work, location, open-to-connect);
    terminal stage, no transition.
- **All three lifecycle paths work**: single-from-list (row action),
  single-from-profile (sub-bar button), and **batch** (Select → checkboxes with
  select-all + indeterminate → floating `BatchBar`). All persist via the data
  source and fan out collab notifications.

**Profile** (`src/features/profile/ProfilePage.tsx`)
- Built on the traveling **Profile Card** (`src/components/cards/ProfileCard.tsx`):
  stage-tinted banner, ΦΣΛ crest, member no., identity grid, current (gold) + past
  offices, "carries with this profile" card grid.
- Plus the three ported traveling cards
  (`src/components/cards/TravelingCards.tsx`): Interview Scorecard, Milestones
  timeline, Prayer Requests.
- Stage-aware sub-bar actions (Edit / Log interaction / Promote). Responsive: two
  columns on desktop, tab strip on mobile. Follow-up assignment modal wired.

**Chrome** (`src/components/chrome/`): `TopBar`, `SubBar` (breadcrumb), `Sidebar`
(stage nav with live counts + contextual filter groups) — all on real React
Router navigation. Collab chrome (`src/components/collab/`): Toasts, ModeToggle,
IdentitySwitcher, NotifBell, Batch controls, NewFollowupForm.

**Backend** (`supabase/`): `schema.sql` (full DDL, enums, triggers, all domain
tables), `policies.sql` (RLS for all four roles via `auth_role()` / `auth_chapter()`
/ `can_manage()` helpers), `seed.sql` (mirrors the mock dataset so the app looks
identical pre/post cutover).

---

## 🟡 Scaffolded — shell + spec in place, UI not built yet

These render with the real app chrome and a notice listing what they'll contain
(`src/features/Stubs.tsx`). Build them next.

| Screen | Route | Prototype source to port | Spec |
|---|---|---|---|
| **Relationship Tracker** | `/tracker` | `prototype/features.jsx` (Relationship Tracker) | KPI tiles; Contact Queue with segment filters (Everyone / Call Today / Call This Week / My guys / Open to help) and columns Member · Owner(reassign) · Last contact · Open to · Up next(due badge); 312px right rail = My follow-ups + activity feed (both already powered by the collab store). |
| **Application Review** | `/application/:id` | `prototype/features.jsx` (ApplicationReview) | Partly built: identity + recommendation + Scorecard render. Add the full application form (essays, references, candidacy checklist) and the **editable** reviewer scorecard (mock scorecard is currently read-only). |
| **Resources** | `/resources` | `prototype/features.jsx` (ResourcesView) | File/library list on Supabase Storage; upload/categorize/download; role-gated upload. |
| **Training** | `/training` | `prototype/training-*.jsx` | Self-contained sub-app: lesson library, player, builder, interactive games; candidate formation progress. |
| **Profile engagement sections** | (in `/profile/:id`) | `prototype/engagement.jsx` (ProfileDetail) | The fuller right-column sections beyond the 3 traveling cards: How they're doing (life areas), Call log, Follow-ups, Giving, Ways to help. Tables already exist in `schema.sql`. |

---

## ▶️ Next steps, in priority order

1. **Relationship Tracker** (`/tracker`) — highest value. The collab store and the
   `tasks` / `interactions` data already exist; this is mostly UI. Port from
   `prototype/features.jsx`. Add `listTasks` / `toggleTask` / `reassign` reads to
   the data source (mock first), or read tasks straight from the collab store as
   the prototype does.
2. **Profile engagement sections** — flesh out `engagement.jsx`'s ProfileDetail
   sections in the profile right column. Wire to `life_areas`, `interactions`,
   `tasks`, `giving`, `ways_to_help`.
3. **Application Review** — upgrade the scaffold to the full form + editable
   scorecard; persist scores to `interview_scores`; recompute the average that
   feeds `recommend()`.
4. **Resources** — Supabase Storage bucket + `resources` table CRUD.
5. **Training sub-app** — port `training-*.jsx`; back with `training_lessons` /
   `training_progress`.
6. **Wire the sidebar filters** — they render correctly but are visual-only.
   Lift filter state into `DirectoryPage`, pass into the bodies, and/or push into
   `MemberQuery` for the Supabase path.
7. **Tighten identity** — `owner_id` / `by_id` / `to_id` are leader **display
   names** in this pass (matching the prototype's collab model). Migrate to real
   `profiles(id)` FKs and update the matching RLS policies + the collab store.
8. **Auth UI** — add a Supabase sign-in screen and an auth guard once moving off
   mock. Mock mode intentionally needs no auth.

---

## Architecture map (where things live)

```
src/
  theme/        tokens.ts (exact prototype values) · ThemeProvider.tsx
  types/        domain.ts (model + STAGE_FLOW + helpers)
  data/         DataSource.ts · mockDataSource.ts · supabaseDataSource.ts
                index.ts (switch) · queries.ts (TanStack hooks) · mockData.ts (seed)
  store/        collab.ts (toasts/notifs/activity/tasks) · useBatch.ts
  auth/         roles.ts · RoleContext.tsx
  lib/          supabase.ts · offices.ts (current/past/top role) · recommend.ts
  components/
    atoms/      Avatar · Tag · Field · OfficeChip · CardGlyph · Btn · Placeholder
    responsive/ useViewport.ts · Drawer.tsx (Drawer + TabStrip)
    collab/     Chrome (Toasts/ModeToggle/IdentitySwitcher) · NotifBell · Batch · NewFollowupForm · OwnerMenu
    chrome/     TopBar.tsx · SubBar.tsx · Sidebar.tsx
    cards/      ProfileCard.tsx · TravelingCards.tsx · DuePill.tsx
  features/
    directory/  DirectoryPage.tsx (+ exports DirectoryView/VIEW_STAGE)
                ActiveBody · CandidateBody · ApplicantBody · AlumniBody
    profile/    ProfilePage.tsx
    Stubs.tsx   TrackerPage · ResourcesPage · TrainingPage · ApplicationPage
  App.tsx       providers + routes        main.tsx  entry
supabase/       schema.sql · policies.sql · seed.sql
```

Routes: `/` → `/directory/active`; `/directory/:view` (active|candidate|applicant|
alumni); `/profile/:id`; `/application/:id`; `/tracker`; `/resources`; `/training`.

---

## Decisions & known gaps (so they aren't re-litigated)

- **Mock-first, swappable data source.** The whole app runs with no backend; the
  Supabase implementation is written and type-correct and activates with one env
  var. UI/collab/lifecycle code is identical in both modes.
- **Styling = prototype's theme-driven inline styles**, reproduced faithfully
  (the design is a fixed contract). A CSS-variable migration is a possible future
  step, not required.
- **Navigation** uses real React Router URLs (replacing the prototype's
  `window.PSLNav`).
- **`owner_id` / `by_id` / `to_id` are display names** in this pass (the prototype
  models people by name). See next-step #7 to migrate to profile FKs.
- **Sidebar filters are visual-only** for now (next-step #6).
- **Traveling cards are hero-scoped** (seeded for Marcus Bellamy) exactly as the
  prototype demonstrates; making them per-member queries is part of next-step #2.
- **`noUnusedLocals` is off** to keep the faithful port frictionless; a cleanup
  pass can turn it on.

---

## Flipping to Supabase

1. Create a Supabase project.
2. SQL editor, in order: `supabase/schema.sql` → `supabase/policies.sql` →
   `supabase/seed.sql`.
3. `.env.local`:
   ```
   VITE_DATA_SOURCE=supabase
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
4. Create your account via Supabase Auth, then run the commented `UPDATE` at the
   bottom of `seed.sql` to set your profile's role + chapter so RLS shows the
   roster.
5. `npm run dev`.

---

## Source prototype → build mapping

`/mnt/project/` (read-only reference) mapped into the build as:
`kit.jsx` → theme/tokens + atoms + mockData; `collab.jsx` → store/collab +
collab components; `crm-app.jsx` → App router + chrome; `cards.jsx` →
cards/ProfileCard + TravelingCards + DuePill; `directory.jsx` → chrome/Sidebar +
features/directory/*; `features.jsx` / `engagement.jsx` / `training-*.jsx` →
**not yet ported** (the scaffolded screens above).
