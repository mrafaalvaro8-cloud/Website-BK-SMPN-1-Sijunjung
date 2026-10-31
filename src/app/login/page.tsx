import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 w-full max-w-sm text-center shadow-sm">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Konfigurasi Belum Lengkap</h1>
          <p className="text-slate-500 text-sm">
            Silakan setel variabel lingkungan SUPABASE_URL dan SUPABASE_ANON_KEY di Vercel Dashboard.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">BK</span>
          </div>
          <span className="font-semibold text-slate-900 text-sm">SMPN 1 Sijunjung</span>
        </div>
        <a href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          Kembali
        </a>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl border border-slate-200 p-8 w-full max-w-sm shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Login dengan akun Google sekolah Anda
            </p>
          </div>
          <GoogleLoginButton />
          <p className="text-xs text-slate-400 text-center mt-6">
            Khusus untuk Siswa dan Guru BK SMPN 1 Sijunjung
          </p>
        </div>
      </div>
    </div>
  );
}
