'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AnonymousPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    supabase.from('anonymous_questions').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (!cancelled) { setQuestions(data || []); setLoading(false); } });
    return () => { cancelled = true; };
  }, [supabase]);

  const submitAnswer = async (id: string) => {
    await supabase.from('anonymous_questions').update({
      counselor_answer: answerText[id],
      status: 'answered',
      answered_at: new Date().toISOString(),
    }).eq('id', id);
    setQuestions(questions.map(q => q.id === id ? { ...q, counselor_answer: answerText[id], status: 'answered', answered_at: new Date().toISOString() } : q));
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    answered: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">匿名提问管理</h1>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-500">暂无提问</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-400">{q.category || '未分类'}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${statusColor[q.status] || 'bg-gray-100'}`}>
                  {{ pending: '待回复', answered: '已回复', archived: '已归档' }[q.status as string] || q.status}
                </span>
              </div>
              <p className="text-gray-800 font-medium mb-3">{q.question_text}</p>
              {q.counselor_answer ? (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-blue-600 font-medium">回复：</p>
                  <p className="text-gray-600 text-sm mt-1">{q.counselor_answer}</p>
                </div>
              ) : (
                <div className="mt-3">
                  <textarea className="border rounded-lg px-3 py-2 w-full h-20 mb-2" placeholder="输入回复..."
                    value={answerText[q.id] || ''} onChange={e => setAnswerText({ ...answerText, [q.id]: e.target.value })} />
                  <button onClick={() => submitAnswer(q.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    提交回复
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
