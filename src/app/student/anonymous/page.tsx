'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AnonymousQ {
  id: string;
  question_text: string;
  category: string | null;
  counselor_answer: string | null;
  answered_at: string | null;
  created_at: string;
}

export default function AnonymousPage() {
  const [questions, setQuestions] = useState<AnonymousQ[]>([]);
  const [newQ, setNewQ] = useState('');
  const [category, setCategory] = useState('学习压力');
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const categories = ['学习压力', '人际关系', '情绪困扰', '家庭教育', '职业规划', '其他'];

  useEffect(() => {
    supabase.from('anonymous_questions').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setQuestions(data || []));
  }, [supabase]);

  const handleSubmit = async () => {
    if (!newQ.trim()) return;
    await supabase.from('anonymous_questions').insert({ question_text: newQ, category });
    setNewQ('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">匿名提问</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <p className="text-gray-500 text-sm mb-4">您的提问将匿名提交给老师，请放心表达。</p>
        <select className="border rounded-lg px-3 py-2 mb-3 w-full" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <textarea className="border rounded-lg px-3 py-2 w-full h-24 mb-3" placeholder="请输入您的问题..." value={newQ} onChange={e => setNewQ(e.target.value)} />
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {submitted ? '已提交 ✓' : '提交问题'}
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-4">历史提问</h2>
      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-gray-500">暂无提问记录</p>
        ) : questions.filter(q => q.counselor_answer).slice(0, 5).map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{q.category}</span>
              <span>{new Date(q.created_at).toLocaleDateString('id')}</span>
            </div>
            <p className="text-gray-800 font-medium">{q.question_text}</p>
            {q.counselor_answer && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-blue-600 font-medium">老师回复：</p>
                <p className="text-gray-600 text-sm mt-1">{q.counselor_answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
