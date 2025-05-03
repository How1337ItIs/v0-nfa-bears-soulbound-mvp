import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createHmac } from 'crypto';
import { redis } from '@/lib/redis';
import { validateVenue } from '@/lib/venues';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { venueId } = await request.json();

    if (!venueId || !validateVenue(venueId)) {
      return NextResponse.json(
        { error: 'Invalid venue ID' },
        { status: 400 }
      );
    }

    const code = `${venueId}:${nanoid(6)}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const expiresAt = timestamp + (15 * 60); // 15 minutes from now

    // Create HMAC signature
    const hmac = createHmac('sha256', process.env.SECRET_KEY || '');
    hmac.update(`${code}|${timestamp}`);
    const signature = hmac.digest('hex');

    // Store in Redis with 15-minute TTL
    const key = `invite:${code}`;
    const success = await redis.set(key, '1', 'EX', 15 * 60, 'NX');

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to generate invite' },
        { status: 500 }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${code}?t=${timestamp}&s=${signature}`;

    return NextResponse.json({
      url,
      expiresAt: new Date(expiresAt * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error generating invite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  console.log('GET /api/invite - Starting request');
  try {
    const code = new URL(req.url).searchParams.get('code');
    if (!code) {
      console.log('No code provided in request');
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    // Ensure Redis connection
    const isConnected = await ensureRedisConnection();
    if (!isConnected) {
      return NextResponse.json({ 
        error: 'Failed to connect to Redis',
        details: 'Could not establish connection to Redis server'
      }, { status: 500 });
    }
    
    console.log('Verifying code:', code);
    
    try {
      console.log('Attempting to get data from Redis...');
      const data = await redis.get(`invite:${code}`);
      if (!data) {
        console.log('No data found for code:', code);
        return NextResponse.json({ valid: false });
      }

      console.log('Data found, parsing...');
      const { timestamp, secret, venueId } = JSON.parse(data);
      const now = Date.now();
      const isRecent = now - timestamp < 5 * 60 * 1000; // 5 minutes
      
      return NextResponse.json({ 
        valid: true,
        isRecent,
        venueId,
        requiresLocation: true
      });
    } catch (redisError) {
      console.error('Redis error during get operation:', redisError);
      return NextResponse.json({ 
        error: 'Failed to verify invite',
        details: redisError instanceof Error ? redisError.message : 'Unknown Redis error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error in invite verification:', error);
    return NextResponse.json({ 
      error: 'Failed to verify invite',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 