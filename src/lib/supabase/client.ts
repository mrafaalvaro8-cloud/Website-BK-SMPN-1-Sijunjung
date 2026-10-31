import { createBrowserClient } from '@supabase/ssr';

let _client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      // Return a no-op client to avoid build errors when env vars are missing
      _client = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithOAuth: async () => ({ data: null, error: { message: 'Not configured' } }),
          signOut: async () => ({ error: null }),
        },
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
          eq: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      } as any;
      return _client;
    }
    _client = createBrowserClient(url, key);
  }
  return _client;
}
