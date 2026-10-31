import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

let _serverClient: ReturnType<typeof createServerClient> | null = null;

export async function createSupabaseClient() {
  if (_serverClient) return _serverClient;
  const cookieStore = await cookies();
  _serverClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
  return _serverClient;
}

export async function getSession() {
  const supabase = await createSupabaseClient();
  return supabase.auth.getSession();
}

export async function getUser() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
