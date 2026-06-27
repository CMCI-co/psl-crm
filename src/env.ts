// env.ts — typed access to the Vite environment.
// When the Supabase vars are absent the app runs in demo mode on the
// prototype's mock data, so `npm run dev` works with zero backend setup.

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const env = { supabaseUrl: url, supabaseAnonKey: anonKey };

export const isSupabaseConfigured = Boolean(url && anonKey);

/** Where data comes from this session. Surfaced in the UI so it's never a mystery. */
export const dataSource: 'supabase' | 'demo' = isSupabaseConfigured ? 'supabase' : 'demo';
