import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST() {
  const code = 'nfa-' + crypto.randomUUID().slice(0, 4);
  await redis.set(`invite:${code}`, '0', 'EX', 900); // 15 min TTL
  return NextResponse.json({ code });
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }
  
  const exists = await redis.exists(`invite:${code}`);
  return NextResponse.json({ valid: Boolean(exists) });
} 
} 