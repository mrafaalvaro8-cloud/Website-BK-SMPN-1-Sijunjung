import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const origin = request.headers.get('origin') || 'http://localhost:3000';
  return NextResponse.json({
    url: `${origin}/login`,
    error: 'Supabase not configured',
  });
}
