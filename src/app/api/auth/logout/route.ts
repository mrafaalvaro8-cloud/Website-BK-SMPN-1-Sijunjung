import { createSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return NextResponse.json({ ok: !error });
}
