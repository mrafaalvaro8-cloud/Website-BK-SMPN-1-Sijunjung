'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CLASSES } from '@/lib/classes';

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('7A');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const todayRecords: Record<string, string> = {};

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('class_id', selectedClass)
        .eq('attendance_date', date)
        .order('student_id');
      setRecords(data || []);
      setLoading(false);
    }
    load();
  }, [supabase, selectedClass, date]);

  const updateRecord = async (recordId: string | undefined, status: string) => {
    if (!recordId) return;
    await supabase.from('attendance').update({ status }).eq('id', recordId);
    setRecords(records.map(r => r.id === recordId ? { ...r, status } : r));
  };

  const stats = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Absensi & EWS</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex gap-4 items-center flex-wrap">
        <select className="border rounded-lg px-3 py-2" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {CLASSES.flatMap(({ grade, sections }) => sections.map(s => (
            <option key={`${grade}${s}`}>{grade}{s}</option>
          )))}
        </select>
        <input type="date" className="border rounded-lg px-3 py-2" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={() => { /* re-fetch */ }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Muat Ulang</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[['hadir', 'Hadir', 'bg-green-100 text-green-700'], ['alpha', 'Alpha', 'bg-red-100 text-red-700'], ['sakit', 'Sakit', 'bg-yellow-100 text-yellow-700'], ['izin', 'Izin', 'bg-blue-100 text-blue-700']].map(([key, label, cls]) => (
          <div key={key} className={`${cls} rounded-lg p-4 text-center`}>
            <div className="text-2xl font-bold">{stats[key] || 0}</div>
            <div className="text-sm">{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-500">Belum ada data</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Siswa</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.student_id || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      r.status === 'hadir' ? 'bg-green-100 text-green-700' :
                      r.status === 'alpha' ? 'bg-red-100 text-red-700' :
                      r.status === 'sakit' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {{ hadir: 'Hadir', alpha: 'Alpha', sakit: 'Sakit', izin: 'Izin' }[r.status as string]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {['hadir', 'alpha', 'sakit', 'izin'].map(s => (
                        <button key={s} onClick={() => updateRecord(r.id, s)}
                          className={`px-2 py-1 rounded text-xs ${r.status === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {{ hadir: 'Hadir', alpha: 'Alpha', sakit: 'Sakit', izin: 'Izin' }[s]}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
