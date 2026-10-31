import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

exports.dynamic = 'force-dynamic';
export default async function LogoutPage() {
  const supabase = await createSupabaseClient();
  await supabase.auth.signOut();
  redirect('/login');
}
