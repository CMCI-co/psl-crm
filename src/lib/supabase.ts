import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '@/env';
import type { Database } from '@/types/database';

// A single client for the app. `null` in demo mode — every repository checks
// `supabase` before using it and falls back to the mock dataset, so the UI is
// identical whether or not a backend is wired up.
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

/** Narrowing helper: throws if called in demo mode. Use after a configured check. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) throw new Error('Supabase is not configured (running in demo mode).');
  return supabase;
}
