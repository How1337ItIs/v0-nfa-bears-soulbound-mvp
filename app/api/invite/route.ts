import { NextResponse } from 'next/server';

const inviteCodes = new Map<string, { issuedAt: number }>();

export async function POST() {
  const code = `nfa-${Math.random().toString(16).slice(2, 6)}`;
  inviteCodes.set(code, { issuedAt: Date.now() });
  
  return NextResponse.json({ code });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const invite = inviteCodes.get(code);
  if (!invite) {
    return NextResponse.json({ valid: false });
  }

  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  const valid = invite.issuedAt >= tenMinutesAgo;
  
  return NextResponse.json({ valid });
} 