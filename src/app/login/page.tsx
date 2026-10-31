import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';

exports.dynamic = 'force-dynamic';
export default async function LoginPage() {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BK SMPN 1 Sijunjung</h1>
          <p className="text-gray-500 mt-1">Layanan Bimbingan dan Konseling</p>
        </div>
        <GoogleLoginButton />
        <p className="text-xs text-gray-400 text-center mt-6">
          Khusus untuk Siswa dan Guru BK SMPN 1 Sijunjung
        </p>
      </div>
    </div>
  );
}
