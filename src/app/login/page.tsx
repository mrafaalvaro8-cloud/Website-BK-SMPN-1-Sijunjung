import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Konfigurasi Belum Lengkap</h1>
          <p className="text-slate-500 text-sm">
            Silakan atur variabel lingkungan SUPABASE_URL dan SUPABASE_ANON_KEY di Vercel Dashboard agar aplikasi ini dapat berjalan.
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Header Branding */}
      <nav className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-blue-700 font-extrabold text-sm">BK</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SMPN 1 Sijunjung</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Login */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 ring-4 ring-blue-100">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Masuk ke BK Digital</h1>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Platform Bimbingan dan Konseling SMPN 1 Sijunjung.<br/>
                Aman, Privat, dan Siap Mendukungmu.
              </p>
            </div>

            <div className="space-y-4">
              <GoogleLoginButton />
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Khusus untuk siswa dan guru BK SMPN 1 Sijunjung.
              </p>
            </div>
          </div>

          {/* Edukatif Footer */}
          <div className="flex items-center justify-between gap-4 text-blue-100 text-xs">
            <p>© 2026 SMPN 1 Sijunjung</p>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Aman & Terverifikasi</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
