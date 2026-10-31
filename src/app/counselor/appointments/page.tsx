'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function AppointmentsPage() {
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState('pending');
  const supabase = createClient();

  useEffect(() => {
    const q = supabase.from('appointments').select('*').order('created_at', { ascending: false });
    q.then(({ data }) => setList(data || []));
  }, [supabase]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    setList(list.map(a => a.id === id ? { ...a, status } : a));
  };

  const filtered = filter === 'all' ? list : list.filter(a => a.status === filter);
  const tabs = ['all', 'pending', 'approved', 'rejected', 'completed'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">预约管理</h1>
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-lg text-sm ${filter === t ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {t === 'all' ? '全部' : { pending: '待审批', approved: '已批准', rejected: '已拒绝', completed: '已完成' }[t]}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500">暂无记录</p>
      ) : filtered.map((a) => (
        <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 mb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{a.preferred_date} {a.preferred_time}</p>
              {a.description && <p className="text-sm text-gray-400 mt-1">{a.description}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[a.status as string]}`}>
              {{ pending: '待审批', approved: '已批准', rejected: '已拒绝', completed: '已完成', cancelled: '已取消' }[a.status as string]}
            </span>
          </div>
          {a.status === 'pending' && (
            <div className="mt-4 flex gap-3">
              <button onClick={() => updateStatus(a.id, 'approved')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">批准</button>
              <button onClick={() => updateStatus(a.id, 'rejected')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">拒绝</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
