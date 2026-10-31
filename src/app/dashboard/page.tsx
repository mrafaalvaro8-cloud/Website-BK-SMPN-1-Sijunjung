import { getUser } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">BK</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">SMPN 1 Sijunjung</h1>
              <p className="text-xs text-slate-500 font-medium">Bimbingan Konseling Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-full">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Banner Edukatif */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-blue-500/40 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Ruang BK Ramah Siswa</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-3">Selamat Datang di Portal Layanan Konseling</h2>
            <p className="text-blue-100 mt-2 max-w-xl text-sm leading-relaxed">
              Konseling bukan hanya untuk menyelesaikan masalah, tapi juga tempat berkembang, merencanakan masa depan, dan mencurahkan inspirasi dengan aman.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4">Menu Layanan Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            href="/student/questionnaires"
            title="Kuesioner Siswa"
            badge="Kebutuhan Belajar"
            description="Isi kuesioner pengembangan diri dan peminatan untuk membantu guru BK mengenali kebutuhan belajarmu."
            icon={<DocumentIcon />}
          />
          <DashboardCard
            href="/student/appointments"
            title="Booking Konseling"
            badge="Jadwal Tatap Muka"
            description="Ajukan jadwal pertemuan secara pribadi dengan Guru BK untuk berdiskusi seputar akademik atau pribadi."
            icon={<CalendarIcon />}
          />
          <DashboardCard
            href="/student/anonymous"
            title="Tanya Anonim"
            badge="Privasi Terjaga"
            description="Punya pertanyaan sensitif? Ajukan secara rahasia tanpa takut identitasmu diketahui teman sebaya."
            icon={<MessageIcon />}
          />
          <DashboardCard
            href="/student/history"
            title="Riwayat Konseling"
            badge="Catatan Perkembangan"
            description="Lihat kembali catatan bimbingan dan progress positif yang telah kamu capai bersama guru BK."
            icon={<ClockIcon />}
          />
          <DashboardCard
            href="/counselor/students"
            title="Daftar Siswa (Guru)"
            badge="Monitoring 13 Kelas"
            description="Akses rekapitulasi data seluruh siswa kelas 7, 8, dan 9 SMPN 1 Sijunjung."
            icon={<UsersIcon />}
          />
          <DashboardCard
            href="/counselor/attendance"
            title="Absensi & EWS (Guru)"
            badge="Early Warning System"
            description="Pantau kehadiran harian dan deteksi dini siswa yang membutuhkan perhatian khusus."
            icon={<ChartIcon />}
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ href, title, description, badge, icon }: { href: string; title: string; description: string; badge: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-600 rounded-xl flex items-center justify-center text-blue-600 group-hover:text-white transition-colors shadow-sm">
            {icon}
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">{badge}</span>
        </div>
        <h4 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
        <span>Buka Layanan</span>
        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function UsersIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>; }
function DocumentIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function CalendarIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function ChartIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>; }
function MessageIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9V18a2 2 0 01-2-2v-3H5a2 2 0 01-2-2v-6a2 2 0 012-2h2V6a2 2 0 01-2-2V3a2 2 0 012-2h14a2 2 0 012 2v3z" /></svg>; }
function ClockIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
