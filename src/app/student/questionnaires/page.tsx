'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  ends_at: string;
  is_active: boolean;
}

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchQuestionnaires() {
      const { data } = await supabase
        .from('questionnaires')
        .select('id, title, description, ends_at, is_active')
        .eq('is_active', true)
        .gte('starts_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      setQuestionnaires(data || []);
      setLoading(false);
    }
    fetchQuestionnaires();
  }, [supabase]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Kuesioner Saya</h1>
      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : questionnaires.length === 0 ? (
        <p className="text-gray-500">Tidak ada kuesioner yang harus diisi</p>
      ) : (
        <div className="space-y-4">
          {questionnaires.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 text-lg">{q.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{q.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-gray-400">Batas akhir: {new Date(q.ends_at).toLocaleDateString('id')}</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Isi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
