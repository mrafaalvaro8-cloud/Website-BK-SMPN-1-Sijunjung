import { getUser } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">BK</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">SMPN 1 Sijunjung</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard href="/student/questionnaires" title="Isi Kuesioner" description="Kuesioner yang tersedia untuk kelas Anda" icon={<DocumentIcon />} />
          <DashboardCard href="/student/appointments" title="Booking Konseling" description="Ajukan jadwal konseling" icon={<CalendarIcon />} />
          <DashboardCard href="/student/anonymous" title="Pertanyaan Anonim" description="Ajukan pertanyaan tanpa nama" icon={<MessageIcon />} />
          <DashboardCard href="/student/history" title="Riwayat Konseling" description="Lihat sesi konseling sebelumnya" icon={<ClockIcon />} />
          <DashboardCard href="/counselor/students" title="Daftar Siswa" description="13 kelas, ~450 siswa" icon={<UsersIcon />} />
          <DashboardCard href="/counselor/questionnaires" title="Kuesioner" description="Buat & kelola kuesioner" icon={<DocumentIcon />} />
          <DashboardCard href="/counselor/appointments" title="Janji Temu" description="Kelola jadwal konseling" icon={<CalendarIcon />} />
          <DashboardCard href="/counselor/attendance" title="Absensi & EWS" description="Monitoring kehadiran" icon={<ChartIcon />} />
          <DashboardCard href="/counselor/reports" title="Laporan" description="Analisis & cetak laporan" icon={<FileIcon />} />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}

function UsersIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>; }
function DocumentIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function CalendarIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function ChartIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>; }
function MessageIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9V18a2 2 0 01-2-2v-3H5a2 2 0 01-2-2v-6a2 2 0 012-2h2V6a2 2 0 01-2-2V3a2 2 0 012-2h14a2 2 0 012 2v3z" /></svg>; }
function FileIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>; }
function ClockIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
