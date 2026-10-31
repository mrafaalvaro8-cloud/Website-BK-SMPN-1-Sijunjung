'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      // browser client detects the session from the URL hash and stores cookies
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login?error=auth_failed');
      }
    };
    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Memproses login...</p>
      </div>
    </div>
  );
}
