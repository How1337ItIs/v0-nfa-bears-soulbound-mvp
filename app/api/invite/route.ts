import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { generateTimeSecret, VENUE } from '@/lib/location';
import crypto from 'crypto';

async function ensureRedisConnection() {
  if (redis.status === 'ready') {
    return true;
  }

  console.log('Redis not ready, attempting to connect...');
  try {
    await redis.connect();
    console.log('Redis connection established');
    return true;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return false;
  }
}

export async function POST(req: Request) {
  console.log('POST /api/invite - Starting request');
  try {
    // Ensure Redis connection
    const isConnected = await ensureRedisConnection();
    if (!isConnected) {
      return NextResponse.json({ 
        error: 'Failed to connect to Redis',
        details: 'Could not establish connection to Redis server'
      }, { status: 500 });
    }

    console.log('Generating new invite...');
    const code = 'nfa-' + crypto.randomUUID().slice(0, 4);
    const timestamp = Date.now();
    const secret = generateTimeSecret();
    
    console.log('Generated code:', code);
    console.log('Generated secret:', secret);
    
    const inviteData = {
      timestamp,
      venueId: VENUE.id,
      secret,
      coordinates: VENUE.coordinates,
      beaconId: VENUE.beaconId
    };
    
    console.log('Storing invite data:', inviteData);
    
    try {
      console.log('Attempting to store data in Redis...');
      await redis.set(`invite:${code}`, JSON.stringify(inviteData), 'EX', 900);
      console.log('Successfully stored invite data in Redis');
    } catch (redisError) {
      console.error('Redis error during set operation:', redisError);
      return NextResponse.json({ 
        error: 'Failed to store invite data',
        details: redisError instanceof Error ? redisError.message : 'Unknown Redis error'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      code,
      secret,
      venue: {
        id: VENUE.id,
        name: VENUE.name
      }
    });
  } catch (error) {
    console.error('Unexpected error in invite generation:', error);
    return NextResponse.json({ 
      error: 'Failed to generate invite',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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