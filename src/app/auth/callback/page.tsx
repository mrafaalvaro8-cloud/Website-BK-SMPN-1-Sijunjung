import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CallbackPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Konfigurasi Supabase belum lengkap.</p>
          <p className="text-gray-500 text-sm mt-2">Setel env vars di Vercel Dashboard.</p>
        </div>
      </div>
    );
  }
  const supabase = await createSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    return redirect('/login?error=auth_failed');
  }
  redirect('/dashboard');
}
