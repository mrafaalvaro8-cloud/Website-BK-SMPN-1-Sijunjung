'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CLASSES } from '@/lib/classes';

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchStats = async () => {
    setLoading(true);
    let q = supabase.from('questionnaires').select('id, title');
    const { data: qs } = await q;

    let countQ = supabase.from('questionnaires').select('id');
    const { data: allQs } = await countQ;

    let countA = supabase.from('answers').select('id');
    const { data: allAs } = await countA;

    let countAppt = supabase.from('appointments').select('id');
    const { data: allAppts } = await countAppt;

    let countAnon = supabase.from('anonymous_questions').select('id');
    const { data: allAnons } = await countAnon;

    setStats({
      totalQuestionnaires: allQs?.length || 0,
      totalAnswers: allAs?.length || 0,
      totalAppointments: allAppts?.length || 0,
      totalAnonymous: allAnons?.length || 0,
      questionnaires: qs || [],
    });
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, [supabase]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Laporan Statistik</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Kuesioner', value: stats?.totalQuestionnaires || 0, color: 'bg-blue-500' },
          { label: 'Total Jawaban', value: stats?.totalAnswers || 0, color: 'bg-green-500' },
          { label: 'Total Jadwal', value: stats?.totalAppointments || 0, color: 'bg-purple-500' },
          { label: 'Pertanyaan Anonim', value: stats?.totalAnonymous || 0, color: 'bg-orange-500' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-5 text-white`}>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold mb-4">Progress Kuesioner</h2>
        {loading ? <p className="text-gray-500">Memuat...</p> :
         !stats?.questionnaires?.length ? <p className="text-gray-500">Belum ada data</p> :
         stats.questionnaires.map((q: any) => (
           <div key={q.id} className="flex justify-between py-3 border-b last:border-none">
             <span>{q.title}</span>
             <span className="text-gray-400 text-sm">ID: {q.id.slice(0, 8)}</span>
           </div>
         ))
        }
      </div>
    </div>
  );
}
