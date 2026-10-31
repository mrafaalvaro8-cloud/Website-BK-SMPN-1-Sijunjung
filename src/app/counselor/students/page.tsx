'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CLASSES } from '@/lib/classes';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const allClasses = ['all', ...CLASSES.flatMap(({ grade, sections }) =>
    sections.map((s) => `${grade}${s}`)
  )];

  useEffect(() => {
    async function fetchStudents() {
      let query = supabase.from('students').select('*').order('class_id');
      if (selectedClass !== 'all') {
        query = query.eq('class_id', selectedClass);
      }
      const { data } = await query;
      setStudents(data || []);
      setLoading(false);
    }
    fetchStudents();
  }, [supabase, selectedClass]);

  const totalByClass: Record<string, number> = {};
  students.forEach((s) => {
    totalByClass[s.class_id] = (totalByClass[s.class_id] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">学生名册</h1>
        <span className="text-sm text-gray-500">共 {students.length} 名学生</span>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {allClasses.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              selectedClass === c
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {c === 'all' ? '全部' : c}
            {c !== 'all' && totalByClass[c] != null && (
              <span className="ml-1 text-xs opacity-70">({totalByClass[c]})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">暂无学生数据</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">姓名</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">班级</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">电话</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">备注</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.class_id}</td>
                  <td className="px-4 py-3 text-gray-500">{s.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-400">{s.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
