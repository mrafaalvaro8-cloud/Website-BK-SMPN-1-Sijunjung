'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Appointment {
  id: string;
  title: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  counselor_notes: string | null;
  created_at: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const statusLabel: Record<string, string> = {
    pending: '待审批',
    approved: '已批准',
    rejected: '已拒绝',
    completed: '已完成',
    cancelled: '已取消',
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  useEffect(() => {
    async function fetchAppointments() {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      setAppointments(data || []);
      setLoading(false);
    }
    fetchAppointments();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('appointments').insert({
      title,
      description,
      preferred_date: date,
      preferred_time: time,
    });
    if (!error) {
      setShowForm(false);
      setTitle(''); setDescription(''); setDate(''); setTime('');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">预约咨询</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + 新建预约
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input className="border rounded-lg px-3 py-2" placeholder="预约主题" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="date" className="border rounded-lg px-3 py-2" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <input type="time" className="border rounded-lg px-3 py-2 w-full mb-4" value={time} onChange={e => setTime(e.target.value)} required />
          <textarea className="border rounded-lg px-3 py-2 w-full mb-4" placeholder="问题描述（可选）" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">提交申请</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">取消</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">暂无预约记录</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{a.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{a.preferred_date} {a.preferred_time}</p>
                {a.counselor_notes && <p className="text-sm text-gray-400 mt-1">备注: {a.counselor_notes}</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColor[a.status as string]}`}>
                {statusLabel[a.status] || a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
