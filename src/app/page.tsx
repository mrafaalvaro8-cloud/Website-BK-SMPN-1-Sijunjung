import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">BK</span>
          </div>
          <span className="text-white font-semibold">SMPN 1 Sijunjung</span>
        </div>
        <Link href="/login" className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          登录
        </Link>
      </nav>

      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Layanan Bimbingan dan Konseling
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Platform digital untuk layanan konseling, kuesioner, dan monitoring siswa SMPN 1 Sijunjung
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Kuesioner Konseling</h3>
              <p className="text-blue-100 text-sm">Isi kuesioner konseling sesuai kelas untuk membantu proses bimbingan.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Booking Konseling</h3>
              <p className="text-blue-100 text-sm">Ajukan jadwal konseling dengan guru BK sesuai waktu yang tersedia.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9V18a2 2 0 01-2-2v-3H5a2 2 0 01-2-2v-6a2 2 0 012-2h2V6a2 2 0 01-2-2V3a2 2 0 012-2h14a2 2 0 012 2v3z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Pertanyaan Anonim</h3>
              <p className="text-blue-100 text-sm">Ajukan pertanyaan secara anonim kepada guru BK tanpa takut dikenal.</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
