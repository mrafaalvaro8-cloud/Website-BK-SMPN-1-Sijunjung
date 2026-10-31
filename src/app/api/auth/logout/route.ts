import { NextResponse } from 'next/server';

export async function POST() {
  // Client handles signout via Supabase browser client
  return NextResponse.json({ ok: true });
}
