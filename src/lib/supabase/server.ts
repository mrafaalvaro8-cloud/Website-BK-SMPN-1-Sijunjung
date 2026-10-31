import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

export async function getSession() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { data: { session: null }, error: null };
  const supabase = await createSupabaseClient();
  return supabase.auth.getSession();
}

export async function getUser() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
