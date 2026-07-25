import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('⚠️ Supabase credentials missing (SUPABASE_URL / SUPABASE_ANON_KEY). Repositories will fallback gracefully if needed.');
    return null;
  }

  supabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });

  return supabaseClient;
}
