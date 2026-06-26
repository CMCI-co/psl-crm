# Handoff: Phi Sigma Lambda CRM

A relationship-management app for a Christian college fraternity. Leaders track every member's
journey — **Applicant → Candidate → Active Member → Alumni** — manage relationships and follow-ups
as a team, review applications, and run member training.

---

## ⚠️ Read this first — what these files are

The files in `prototype/` are a **high-fidelity design reference built in HTML/React-via-Babel**.
They are a *prototype*: every screen, interaction, and piece of logic runs in the browser on
**hard-coded mock data**. There is **no backend, no auth, and nothing persists** — a page refresh
resets all state.

**Your job is NOT to ship this HTML.** It is to **rebuild this as a real production application** in
a proper codebase, using the prototype as the exact specification for look, behavior, and data shape,
and wiring it to a real backend (Supabase is the intended target — see `reference/`).

Treat the prototype as a pixel-and-behavior contract. The visual design, flows, state logic, and data
model all carry over faithfully; the *code organization* should be redone for production (real build
tooling, a component library, a typed data layer, real auth, etc.).

### Recommended target stack
The prototype is React. The cleanest path:
- **React + Vite + TypeScript** (or Next.js if SSR/routing is wanted)
- **Supabase** for Postgres + Auth + Row-Level Security + Storage (avatars, resource files)
- A styling approach of your choice — the prototype uses inline-style objects driven by a theme token
  object; this maps cleanly to CSS variables + Tailwind, vanilla-extract, or styled-components.
- **TanStack Query** (or Supabase realtime subscriptions) for the live, multi-user collaboration data.

---

## Fidelity: HIGH

These are pixel-level mockups with final colors, typography, spacing, interactions, light/dark mode,
and three brand color directions. Recreate the UI faithfully. Exact tokens are in the **Design Tokens**
section and in `prototype/kit.jsx` (the `THEMES` / `THEMES_DARK` / `STAGES` objects).

---

## How the prototype is organized (file map)

The app loads as one HTML file pulling in React + Babel, then a series of `.jsx` files in order.
Each file is global-scoped and exports onto `window` at the end (a prototyping convenience — in
production these become normal ES module imports).

| File | Responsibility |
|---|---|
| `kit.jsx` | **Design tokens** (`THEMES`, `THEMES_DARK`, `STAGES`), shared atoms (`Avatar`, `Tag`, `Dot`, `Field`, `OfficeChip`), the `useViewport` hook + breakpoints (`BP`), and the **mock datasets** (`PROFILE`, `ROSTER`, `ALUMNI`, `APPLICANTS`). |
| `cards.jsx` | The **Profile Card** — the credential that travels the whole journey. Includes the **"Permanent record"** group (Application, Interview Scorecard, Candidacy Testing, Certifications, Milestones) whose chips open a read-only viewer, and a **cohort chip that links to its cohort**. The standalone Scorecard/Milestones/Prayer card components live here too (reused by the record viewer). |
| `collab.jsx` | The **team-collaboration layer**: a shared client store (`PSLStore`), `useStore` hook, person-picker (`OwnerMenu`/`OwnerChip`), assignment form (`NewFollowupForm`), notifications (`NotifBell`), identity switcher, toasts, the **batch-selection system** (`useBatch`, `SelChk`, `SelectToggle`, `BatchBar`), the lifecycle stage machine (`STAGE_FLOW`), and the light/dark `ModeToggle`. **This file defines most of the real app behavior — read it carefully.** |
| `directory.jsx` | The **Directory**: top bar (incl. the **Generate report** button → `reportBuilder` route), sidebar (stage nav whose selected highlight/splash **mirrors the stage color** + filters), the four roster bodies — `ApplicantBody`, `CandidateBody`, `ActiveBody` (grouped by class), `AlumniBody` — plus `CohortView` (accepts a `focus` cohort to highlight). Contains the batch lifecycle transitions. |
| `features.jsx` | The **Relationship Tracker** (care queue, KPI tiles, my-follow-ups rail, activity feed), `ApplicationReview`, and `ResourcesView`. |
| `engagement.jsx` | The **Profile detail page** (`ProfileDetail`) — identity card + accordion/tab sections: How they're doing, Call log, Follow-ups, Prayer, Giving, Ways to help. This is the **living, editable engagement workspace** (distinct from the read-only permanent record). Stage-aware promote actions live here. |
| `records.jsx` | The **Permanent Record viewer** (`RecordViewer` + `RecordViewerHost`, opened via `window.PSLRecords.open`) — read-only modals for the artifacts that travel with a profile forever. |
| `report-builder.jsx` | The **Report Builder** (`ReportBuilder`) — a print/PDF-first analytics screen. Record populations (`POP`) + field schemas (`POP_META`) + query/aggregation + the SVG chart library (bar/hbar/100%-stacked/donut/funnel/line/dot-plot). |
| `training*.jsx` | The **Training** module: library, lesson player, builder, and interactive games. Self-contained sub-app. |
| `crm-app.jsx` | The **app shell + router** (`window.PSLNav`, incl. `reportBuilder` route), theme/tweak wiring, the role/permission selector, and the app-root `RecordViewerHost`. Mounts everything. |
| `tweaks-panel.jsx` | A design-time control panel (theme/density/role switches). **Not part of the product** — drop it in production; replace "role" with real auth roles. |

---

## Roles & permissions

The prototype has a role switcher (`crm-app.jsx`, default "Campus Director"). In production these
become **auth roles enforced by Supabase Row-Level Security**, not a client toggle.

| Role | Can see | Can do |
|---|---|---|
| **National Staff** | All chapters, all members | Everything; cross-chapter |
| **Campus Director** | Their chapter | Full CRUD on members, advance/promote stages, assign to anyone, review applications |
| **Member** | Their chapter roster (limited fields), own profile | Log their own interactions, see assigned follow-ups |
| **Candidate** | Limited | View training, own formation progress |

The `editable` prop threaded through profile views is gated on role (Campus Director / National Staff).
Promote/advance buttons, the Assign action, and edit affordances only render when `editable` is true.

---

## The lifecycle (central concept)

Every person is on a one-way journey with four **stages**:

```
Applicant ──advance──▶ Candidate ──promote──▶ Active Member ──move──▶ Alumni
```

Defined in `collab.jsx` as `STAGE_FLOW`:
- `applicant → candidate` — label "Advance to Candidate", verb "advanced"
- `candidate → member` — label "Promote to Member", verb "promoted"
- `member → alumni` — label "Move to Alumni", verb "moved"

Transitions can happen **three ways**, all of which must work in production:
1. **Single, from a list** — a per-row button/arrow on each directory body.
2. **Single, from the profile** — a stage-aware button in the profile header.
3. **Batch** — a "Select" toggle reveals checkboxes (per-row + a select-all header checkbox with an
   indeterminate state); a floating `BatchBar` shows the count and the correct transition action, and
   applies it to all selected at once. Checkboxes are **only visible while selecting**.

A transition changes the person's `stage`, which moves them between directory lists and (for the
relationship side) between profile vs. engagement-record routing. In the prototype this is an in-memory
override map (`PSLStore.stages`); in production it's an `UPDATE members SET stage = …` plus an audit row.

---

## Screens / Views

> Layout note: desktop is a fixed top bar (56px) over a `flex` row of **sidebar (236px) + content**.
> Below the `tablet` breakpoint the sidebar collapses into a drawer and tables reflow into stacked cards.
> Breakpoints (`kit.jsx` → `BP`): `phone` and `tablet`. The Relationship Tracker's right rail (312px)
> drops below the main column under ~1240px.

### 1. Directory — Active Members
- **Purpose:** browse/manage the active roster.
- **Layout:** top bar → sidebar (stage nav + Campus / Status / Class / Cohort / Major / Leadership
  filters) → content. The selected stage nav item's highlight + left-edge splash **mirror that stage's
  color** — Applicants amber, Candidates azure, Members green, Alumni steel (`STAGES[stage].solid`).
  Content = page header (chapter name, "By class / By cohort / Table" segmented
  control, **Select** toggle, KPI stat chips) then a table **grouped by class year** (Freshman →
  Super Senior).
- **Class group header:** a tinted band (`groupBg`) with a 3px accent marker, an UPPERCASE label in
  `groupInk`, and a count pill. (Standout visual element — recreate exactly.)
- **Row columns:** Member (avatar + name + stage tag + current office chip), Class, Major, Hometown,
  Home Church, Cohort, Status (active/inactive dot). Click a row → Profile. In compact density rows
  shrink and hide the secondary chip line.
- **Batch mode:** Select → a 34px checkbox column appears at the front of the grid; header gets a
  select-all checkbox; `BatchBar` offers "Move to Alumni".

### 2. Directory — Candidates
- Same shell; lists stage=`candidate`. Each row has a **Promote to Member** button (single), and
  Select enables batch "Promote to Member". An intro band explains "crossing over".

### 3. Directory — Applicants
- Lists applicants with interview score and a **recommendation** derived from score
  (`recommend()` in `kit.jsx`: ≥8.5 Advance / ≥6.5 Discuss / else Hold). Per-row advance arrow +
  batch "Advance to Candidate". Row click → Application Review.

### 4. Directory — Alumni
- Expanded fields (work, location, marital, kids, open-to-connect, church). Filters by graduating
  class, major, connection, leadership legacy. Row click → engagement record.

### 5. Profile detail (`ProfileDetail`, engagement.jsx)
- **Purpose:** the full record for one person, built **on** the Profile Card.
- **Layout (desktop):** breadcrumb subbar with stage-aware actions (Edit profile / Promote / Log
  interaction) → two columns: the **Profile Card** (identity credential) on the left, accordion
  **sections** on the right. On narrow screens the sections become a **tab strip** that swaps the body.
- **Sections:** How they're doing (life-area status: Personal/Work/Spiritual/Family, each with a tone
  pill + note + "updated by"), Call log (channel-tagged entries; a composer that logs Call/Text/Email/
  Visit with a note), Follow-ups (tasks with owner, due, channel, priority; assign + reassign + check
  off), Prayer requests, Giving, Ways to help.
- **The Profile Card** (`cards.jsx`): a banner colored by stage (`STAGES[stage].solid`), large avatar/
  initials, name, class · campus, cohort chip, a **call-priority pill** ("Call Today" / "Call This
  Week" tied to the relationship cadence), then fields (phone, email, address, birthday, church, major,
  roles/offices). Current offices ride with the card; past offices become historic labels. This card is
  the same component everywhere the person appears. The **cohort chip is a link** → opens `CohortView`
  with that cohort highlighted. At the bottom, the **Permanent record** group (see screen 10) lists the
  immutable artifacts; clicking a chip opens its read-only viewer.

### 6. Relationship Tracker (`features.jsx`)
- **Purpose:** stay in cadence with everyone a leader is responsible for (members + alumni).
- **Layout:** header (title + KPI tiles: In your care, Call this month, Overdue, Open follow-ups,
  Thriving) → body = **Contact Queue** (left) + rail (right, 312px). Under ~1240px the rail stacks below.
- **Contact Queue:** segmented filters (Everyone / Call Today / Call This Week / My guys / Open to help,
  with counts) and a table: Member, **Owner** (click to reassign via person-picker), Last contact,
  Open to (engagement tags), **Up next** (a due badge — "Call Today" amber / "Call This Week" red /
  "On track" green — plus next-touch date). Click a row → that person's profile/record.
- **Rail:** "My follow-ups" (the current user's task list, with Assign + reassign + complete) and a
  live **activity feed** (every logged touch across the chapter, newest first).

### 7. Application Review (`features.jsx`) — full application + interview scorecard for one applicant.

### 8. Resources (`features.jsx`) — shared file/library list (needs Supabase Storage).

### 9. Training (`training*.jsx`) — lesson library, player, builder, and interactive games. Self-contained.

### 10. Permanent Record viewer (`records.jsx`, `RecordViewer`)
- **Purpose:** read-only archive of the artifacts that ride with a person forever — **Application,
  Interview Scorecard, Candidacy Testing, Certifications, Milestones**. Surfaced as the Profile Card's
  "Permanent record" chip group; clicking a chip calls `window.PSLRecords.open(key, name)`, handled by a
  single `RecordViewerHost` mounted at the app root (`crm-app.jsx`).
- **Key design decision:** separate the **permanent record** (immutable, read-only, always available)
  from the **living engagement workspace** (`engagement.jsx` — Call log, Follow-ups, Prayer, etc., which
  are editable). Prayer requests live ONLY in the living workspace — deliberately removed from the
  permanent record to avoid the duplication that existed before. In production the record viewer reads
  historical/locked rows; the workspace reads mutable rows.

### 11. Report Builder (`report-builder.jsx`, `ReportBuilder`) — print/PDF-first analytics
- **Purpose:** leaders assemble a chapter report from any **non-personal** data, then export/print it.
  Opened from the Directory top bar's **Generate report** button → route `reportBuilder`.
- **Layout:** app chrome (`.no-print`) → left **rail** (report title/subtitle, editable **Headline
  figures**, and an **Add data** palette grouped Membership / Pipeline / Alumni / Giving) + a center
  **"paper"** canvas (Letter width, letterhead, KPI strip, sections, footer). Rail stacks above the paper
  below the tablet breakpoint. The paper renders on a fixed **light** palette regardless of dark mode so
  exports read professionally.
- **Sections are live queries, not static charts.** Each section = `{ pop, filters, groupBy, chart }`
  over a record population (Members / Alumni / Applicants). Hitting **Edit** reveals an inline editor:
  **Population** (segmented), **Break down by** (any field, or "Total (count only)"), and a **Filters**
  grid (one "All ▾" select per non-personal field). Title, insight caption, and chart recompute live —
  e.g. Population=Alumni, filter Major=Engineering, group by Graduating class →
  "Alumni · Engineering by graduating class". `groupBy: 'none'` renders a single big **count** card
  (e.g. "11 of 18 alumni · Married").
- **Chart formats** (per-section switcher, `.no-print`): columns (`bar`), horizontal (`hbar`),
  **100% stacked bar** (`stack100`, the "% split by color" view), donut, funnel, line, dot-plot — all
  light data-driven SVG.
- **Headline figures** (KPI strip): fully editable — label+value fields, add/remove, or **Fill from
  data** (e.g. Members by class → Freshman/Sophomore/Junior/Senior/Super Sr.). Defaults are
  Active members / Candidates / Applicants / Alumni.
- **Export:** "Export PDF" / "Print" call `window.print()`. The print stylesheet in the HTML `<head>`
  hides everything except `.report-print-root` (and keeps `.no-print` hidden); `@page { size: letter;
  margin: .5in }`. Each section uses `break-inside: avoid`.
- **Mock data → production:** `POP` is seeded mock records whose marginals match the headline counts.
  **In production every section becomes a SQL `GROUP BY` / `COUNT(...)` with a `WHERE` for the filters**
  over the real `members` / `alumni` / `applicants` tables. Keep `POP_META` as the canonical list of
  groupable/filterable **non-personal** dimensions (members: class, major, relationship, home church,
  home state, cohort, leadership, standing; alumni: grad class, major, industry, relationship, open-to-
  connect, location; applicants: major, interview score, recommendation). Personal contact fields
  (email, phone, address) are intentionally excluded from reporting.

---

## Interactions & behavior

- **Routing:** `window.PSLNav` (`crm-app.jsx`) is a tiny stack router: `go(name, params)`, `replace`,
  `setView`, `back`, `home`. Routes: `directory` (param `view`: active|candidate|applicant|alumni),
  `profile`, `application`, `tracker`, `alumniRecord`, `resources`, `training`, `builder`, `player`,
  `cohort` (param `focus` = cohort name to highlight), `reportBuilder`. Replace with your framework's router; keep these as real URLs.
- **Live collaboration:** every owner reassignment, task assignment, stage change, and logged
  interaction updates a shared store and **fans out to other users** as notifications + activity feed
  entries + a toast. In production this is the multi-user heart of the app — use Supabase realtime so
  teammates see changes live. Notifications never fire for your own actions.
- **Identity switcher** (prototype only): lets you "become" any leader to feel the hand-off. In
  production this is just the logged-in user; the picker collapses to a profile menu.
- **Light/dark + brand theme:** always-visible `ModeToggle` in the top bar; three brand directions
  (Navy / Evergreen / Maroon). Persist the user's choice.
- **Responsive:** tables → stacked cards, sidebar → drawer, profile sections → tab strip, below the
  breakpoints. Hit targets ≥ 44px on touch.
- **Empty / done states** exist (e.g. "every candidate has crossed over"); preserve them.

---

## Data model (proposed Supabase schema)

Derived from the prototype datasets in `kit.jsx` and `features.jsx`. Field names are suggestions.

### `members` — the core person record (covers all four stages)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `chapter_id` | uuid FK → chapters | multi-chapter ready |
| `first_name`, `last_name`, `middle` | text | |
| `stage` | enum(`applicant`,`candidate`,`member`,`alumni`) | the lifecycle |
| `status` | enum(`active`,`inactive`) | members only |
| `email`, `phone`, `address`, `birthday` | text/date | |
| `school`, `major`, `minor`, `class_year` | text | class_year: Freshman…Super Senior / Alumni |
| `hometown`, `church`, `employer`, `relationship` | text | |
| `cohort` | text | e.g. "Fall 2024" |
| `member_no` | text | e.g. "PSL-0418" |
| `grad_year` | text | alumni |
| `work`, `location`, `marital`, `kids`, `open_to_connect` | text/bool | alumni fields |
| `owner_id` | uuid FK → members(staff) | relationship owner (reassignable) |
| `avatar_url` | text | Supabase Storage |
| `created_at`, `updated_at` | timestamptz | |

### `roles_history` — offices held (current + past, travel with the person)
`id, member_id FK, title, term (e.g. "2025–26"), is_current bool`

### `applications` + `interview_scores` — application + scorecard (score drives `recommend()`).

### `interactions` — the call/activity log (powers Call log + activity feed)
`id, member_id FK (subject), by_id FK (logger), type enum(Call,Text,Email,Visit), note text, occurred_at`

### `tasks` — follow-ups
`id, member_id FK (about), owner_id FK (assignee), created_by FK, title, channel, priority enum(high,med,low), due_date, status enum(todo,doing,done), created_at`

### `life_areas` — "How they're doing"
`id, member_id FK, area enum(Personal,Work,Spiritual,Family,…), tone enum(thriving,steady,watch), note, updated_by FK, updated_at`

### `prayer_requests`, `giving`, `ways_to_help` — profile sections (see `engagement.jsx`).

### `notifications`
`id, to_id FK, text, sub, read bool, created_at` — generated on assignment/reassignment/stage change.

### `stage_transitions` — audit trail
`id, member_id FK, from_stage, to_stage, by_id FK, occurred_at` — write one on every advance/promote/move.

### `resources` — shared files (Supabase Storage), `training_*` — lessons/modules/progress.
`chapters`, and a `staff`/`profiles` table joined to Supabase `auth.users` for roles.

**Cadence / "due" logic:** the prototype's due states (Call Today / Call This Week / On track) are
mock. In production derive them from a per-relationship **cadence** (e.g. days-since-last-interaction vs.
a target interval) computed from `interactions`.

**Reporting & permanent records:** the Report Builder needs no new analytics tables — every section is a
`GROUP BY`/`COUNT` over `members`/`alumni`/`applications` filtered by the same non-personal columns
already in the schema (discard `report-builder.jsx`'s mock `POP`). The permanent-record viewer (screen 10)
reads `applications`, `interview_scores`, a `certifications` table (`id, member_id, name, org, status,
expires_at`), a `testing_modules` + progress table, and `stage_transitions` + milestone rows for the timeline.

---

## Design tokens

Source of truth: `prototype/kit.jsx`. Three brand directions × light/dark. **Navy is the default.**

### Light — Heritage Navy (default)
| Token | Value |
|---|---|
| ink / sub / faint | `#1a2233` / `#5d6577` / `#8b91a0` |
| bg / panel / panel2 / line | `#ffffff` / `#f6f7f9` / `#eef0f4` / `#e4e7ec` |
| chrome / chromeLine / groupBg / groupInk | `#eceff5` / `#d8deea` / `#e4eaf6` / `#2c4178` |
| accent / accentDeep / accentSoft / onAccent | `#22386b` / `#16264c` / `#eef1f8` / `#ffffff` |
| gold | `#a9852f` |

(Evergreen accent `#1f4f3f`, Maroon accent `#7a2230` — full sets in `kit.jsx`.)

### Dark — shared neutral base (midpoint slate), per-brand accent
| Token | Value |
|---|---|
| ink / sub / faint | `#f1f2f6` / `#c2c6cf` / `#9095a1` |
| bg / panel / panel2 / line | `#2e313b` / `#25272f` / `#3a3d48` / `#43464f` |
| chrome / chromeLine / chromeInk / groupBg | `#1c1e24` / `#383b44` / `#e6e8ee` / `#2a2c35` |
| accent (Navy / Evergreen / Maroon) | `#6885d2` / `#4cb084` / `#d2616f` |

### Stage colors (semantic, shared across themes)
| Stage | solid (banner) | fg (light) | bg tint (light) |
|---|---|---|---|
| Applicant | `#bd7526` | `#a3641f` | `#f6ead8` |
| Candidate | `#0a86dd` | `#0080d8` | `#e0eefc` |
| Member | `#3f7a52` | `#3f7a52` | `#e6f1ea` |
| Alumni | `#454d78` | `#454d78` | `#eaebf4` |

Dark variants in `STAGES_DARK`.

### Type, radius, spacing
- **UI font:** Hanken Grotesk (400/500/600/700). **Serif/display:** Newsreader. **Mono:** Space Mono.
- **Radius:** chips/pills 999px; buttons/inputs 8–9px; cards 12–16px.
- **Density:** comfortable vs. compact (row padding 10–12px vs. 6–8px), a global toggle.
- Card shadow on dark surfaces is subtle; light mode leans on 1px borders, not shadows.

---

## Assets
- **Fonts:** Google Fonts (Hanken Grotesk, Newsreader, Space Mono) — see the `<link>` in the HTML.
- **Icons:** all inline hand-drawn SVG (no icon library). Swap for your preferred icon set or keep them.
- **Logo:** "ΦΣΛ" set in the serif font — no image asset.
- **Avatars:** initials-on-tint (`Avatar` in `kit.jsx`); production should support uploaded photos
  (Supabase Storage) with initials fallback.
- No third-party brand assets are used.

---

## Files in this bundle
- `Phi Sigma Lambda CRM - Standalone (demo).html` — a **single self-contained file** (all React, scripts, fonts, and data inlined). Double-click to run the entire prototype offline — the easiest way to demo it. Same app as `prototype/`, just pre-bundled.
- `prototype/` — the full working prototype as separate source files. Open `Phi Sigma Lambda CRM.html` in a browser to run it.
- `reference/Launch Guide.html` and `reference/Supabase Setup Guide.html` — existing planning docs
  (open in a browser): provisioning Supabase, schema/auth notes, and launch steps.
- `README.md` — this document; self-sufficient for implementation.

## Suggested build order
1. Supabase project + `chapters`, `members`, auth/`profiles` + RLS for the four roles.
2. Directory (the four stage bodies) reading real `members`, with the class-grouped Active view.
3. The lifecycle transition system (single + batch) writing `stage` + `stage_transitions`.
4. Profile detail + Profile Card, then the section tables (`interactions`, `tasks`, `life_areas`, …).
5. Relationship Tracker + the live collaboration layer (owners, tasks, notifications, activity) on realtime.
6. Application review, Resources (Storage), Training.
7. Theming (light/dark + brand) and responsive passes.
