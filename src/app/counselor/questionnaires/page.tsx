'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CLASSES } from '@/lib/classes';

export default function QuestionnairesPage() {
  const [list, setList] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('all');
  const [endsAt, setEndsAt] = useState('');
  const supabase = createClient();

  useEffect(() => {
    supabase.from('questionnaires').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setList(data || []));
  }, [supabase]);

  const handleCreate = async () => {
    if (!title.trim() || !endsAt) return;
    await supabase.from('questionnaires').insert({
      title, description: description || undefined,
      class_id: classId === 'all' ? null : classId,
      starts_at: new Date().toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      created_by: null,
    });
    setShowCreate(false);
    setTitle(''); setDescription(''); setClassId('all'); setEndsAt('');
    window.location.reload();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('questionnaires').update({ is_active: !active }).eq('id', id);
    setList(list.map(q => q.id === id ? { ...q, is_active: !active } : q));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kuesioner管理</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {showCreate ? '取消' : '+ 新建Kuesioner'}
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <input className="border rounded-lg px-3 py-2 w-full mb-3" placeholder="标题" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="border rounded-lg px-3 py-2 w-full mb-3" placeholder="描述（可选）" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select className="border rounded-lg px-3 py-2" value={classId} onChange={e => setClassId(e.target.value)}>
              <option value="all">所有班级</option>
              {CLASSES.flatMap(({ grade, sections }) => sections.map(s => (
                <option key={`${grade}${s}`}>{grade}{s}</option>
              )))}
            </select>
            <input type="date" className="border rounded-lg px-3 py-2" value={endsAt} onChange={e => setEndsAt(e.target.value)} />
          </div>
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">创建</button>
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-gray-500">暂无Kuesioner</p>
        ) : list.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{q.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {q.class_id ? `班级: ${q.class_id}` : '全校'} · 截止: {new Date(q.ends_at).toLocaleDateString('id')}
              </p>
            </div>
            <button
              onClick={() => toggleActive(q.id, q.is_active)}
              className={`px-3 py-1.5 rounded-lg text-sm ${q.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
            >
              {q.is_active ? '已启用' : '已停用'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
