// src/lib/supabase.ts
// Lazily-created Supabase browser client. Only constructed when
// VITE_DATA_SOURCE=supabase and the URL/key are present, so the app runs fine in
// pure-mock mode with no Supabase env at all.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, ' +
        'or set VITE_DATA_SOURCE=mock to run without a backend.',
    );
  }
  _client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _client;
}
