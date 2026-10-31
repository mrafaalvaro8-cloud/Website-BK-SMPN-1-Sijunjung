import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LogoutPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return redirect('/login?error=not_configured');
  }
  // Client-side logout via form submission
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Logging out...</p>
    </div>
  );
}
