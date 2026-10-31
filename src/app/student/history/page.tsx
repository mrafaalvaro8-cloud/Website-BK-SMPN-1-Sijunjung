'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Session {
  id: string;
  title: string;
  session_type: string;
  scheduled_at: string;
  completed_at: string | null;
  status: string;
  notes: string | null;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('counseling_sessions').select('*').order('scheduled_at', { ascending: false })
      .then(({ data }) => { setSessions(data || []); setLoading(false); });
  }, [supabase]);

  const statusColor: Record<string, string> = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Konseling</h1>
      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">Belum ada riwayat konseling</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(s.scheduled_at).toLocaleDateString('id')} · {s.session_type === 'individual' ? 'Individu' : 'Kelompok'}
                  </p>
                  {s.notes && <p className="text-sm text-gray-400 mt-2">{s.notes}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColor[s.status] || 'bg-gray-100'}`}>
                  {{ scheduled: 'Dijadwalkan', in_progress: 'Berlangsung', completed: 'Selesai', cancelled: 'Dibatalkan' }[s.status] || s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
