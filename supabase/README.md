# Supabase setup

Run these three files in order in the **SQL editor** of a fresh Supabase project
(or via `supabase db push` if you use the CLI):

1. **`schema.sql`** — extensions, enums, tables (chapters, profiles, members,
   offices, lifecycle, relationship tracker, alumni engagement, notifications,
   resources, training), the `handle_new_user()` trigger, and the `is_editor()`
   helper. Also creates the `module-media` storage bucket.
2. **`policies.sql`** — Row Level Security for all tables. Two roles are
   "editors" (`national_staff`, `campus_director`); the rest are read-mostly.
3. **`seed.sql`** — the UNC Charlotte chapter plus the 26-person demo roster and
   their offices. These mirror `src/data/mock.ts` exactly, so a seeded database
   looks identical to demo mode.

## Wiring the app to the database

Copy `.env.example` to `.env` and fill in your project's values:

```bash
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

With those set, the app reads live data; without them it runs on the bundled
demo dataset. Restart `npm run dev` after changing `.env`.

## Making yourself an editor

New sign-ups default to the `member` role. To grant yourself full access:

```sql
update profiles set role = 'national_staff' where id = '<your-auth-user-id>';
```

## Regenerating types

After changing the schema, regenerate the typed client:

```bash
npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
```
