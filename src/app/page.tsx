import Link from 'next/link';

export const dynamic = 'force-dynamic';

const FEATURES = [
  {
    id: 'kuesioner',
    label: 'Kuesioner Konseling',
    desc: 'Isi kuesioner konseling sesuai kelas untuk membantu proses bimbingan.',
    color: 'bg-blue-600',
    icon: 'K',
  },
  {
    id: 'booking',
    label: 'Booking Konseling',
    desc: 'Ajukan jadwal konseling dengan guru BK sesuai waktu yang tersedia.',
    color: 'bg-green-600',
    icon: 'J',
  },
  {
    id: 'anonim',
    label: 'Pertanyaan Anonim',
    desc: 'Ajukan pertanyaan secara anonim kepada guru BK tanpa takut dikenal.',
    color: 'bg-purple-600',
    icon: '?',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tight">BK</span>
          </div>
          <span className="font-semibold text-slate-900 text-sm">SMPN 1 Sijunjung</span>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
        >
          Masuk
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-4 font-medium">
            Layanan Bimbingan dan Konseling
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            Ruang aman untuk{' '}
            <span className="text-blue-600">berbicara.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10">
            Platform digital untuk layanan konseling, kuesioner, dan monitoring siswa SMPN 1 Sijunjung.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors"
            >
              Mulai Sekarang
            </Link>
            <a
              href="#fitur"
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-100 transition-colors"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Link
                key={f.id}
                href="/login"
                className="block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
              >
                <div className={`w-12 h-12 ${f.color} rounded-lg flex items-center justify-center mb-5`}>
                  <span className="text-white font-bold text-lg">{f.icon}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {f.label}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-16 md:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap memulai?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Login dengan akun Google sekolah Anda dan akses semua layanan BK.
          </p>
          <Link
            href="/login"
            className="inline-flex px-8 py-3 bg-white text-slate-900 font-semibold rounded-md hover:bg-slate-100 transition-colors"
          >
            Masuk ke Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">BK</span>
            </div>
            <span className="text-sm text-slate-600">
              BK SMPN 1 Sijunjung &copy; 2026
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Khusus untuk Siswa dan Guru BK SMPN 1 Sijunjung
          </p>
        </div>
      </footer>
    </div>
  );
}
