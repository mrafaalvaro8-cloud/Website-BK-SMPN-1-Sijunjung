import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CallbackPage() {
  const supabase = await createSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    return redirect('/login?error=auth_failed');
  }
  redirect('/dashboard');
}
