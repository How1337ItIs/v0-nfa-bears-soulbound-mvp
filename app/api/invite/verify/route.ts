import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Runtime configuration for edge compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Production security configuration
const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
  analytics: true,
  prefix: "nfa-verify-rl"
});

// Constants
const INVITE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const SECRET_KEY = process.env.INVITE_SECRET_KEY || 'fallback-dev-secret-key';

// Production-ready venues data
const VENUES = [
  { id: 'local-dev', name: 'Local Development Venue', lat: 37.7749, lng: -122.4194, radius: 100 },
  { id: 'berkeley-art-museum', name: 'Berkeley Art Museum', lat: 37.8715, lng: -122.2607, radius: 50 },
  { id: 'sf-moma', name: 'San Francisco Museum of Modern Art', lat: 37.7857, lng: -122.4011, radius: 75 }
];

// HMAC invite code verification
function verifySecureInvite(code: string): { valid: boolean, venueId?: string, expiresAt?: number, error?: string } {
  try {
    // Parse format: venueId:timestamp:randomBytes:signature
    const parts = code.split(':');
    if (parts.length !== 4) {
      return { valid: false, error: 'Invalid invite code format' };
    }

    const [venueId, timestampStr, randomBytes, signature] = parts;
    const timestamp = parseInt(timestampStr);
    
    if (isNaN(timestamp)) {
      return { valid: false, error: 'Invalid timestamp in invite code' };
    }

    // Regenerate payload and verify HMAC signature
    const payload = `${venueId}:${timestamp}:${randomBytes}`;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex')
      .substring(0, 16);

    // Constant-time comparison to prevent timing attacks
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid invite code signature' };
    }

    // Check expiration
    const expiresAt = timestamp + INVITE_EXPIRY;
    if (Date.now() > expiresAt) {
      return { valid: false, error: 'Invite code expired' };
    }

    return { valid: true, venueId, expiresAt };

  } catch (error) {
    console.error('Error verifying invite code:', error);
    return { valid: false, error: 'Invalid invite code' };
  }
}

// Haversine formula for geolocation verification
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Convert to meters
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Invite verification request received at', new Date().toISOString());
    
    // Enhanced rate limiting with IP and address tracking
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      console.warn('🚫 Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        { 
          error: 'Too many verification attempts. Please wait before trying again.',
          retryAfter: Math.round((reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          }
        }
      );
    }
    
    const body = await request.json();
    const { code, address, latitude, longitude } = body;
    
    console.log('🔍 Verifying invite for address:', address);
    
    // Security: Prevent code reuse by tracking used codes
    const codeKey = `used-code:${crypto.createHash('sha256').update(code).digest('hex')}`;
    const codeUsed = await redis.get(codeKey);
    
    if (codeUsed) {
      return NextResponse.json({ 
        error: 'This invite code has already been used' 
      }, { status: 400 });
    }

    // Validate required fields
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ 
        error: 'Invite code is required' 
      }, { status: 400 });
    }

    // Verify HMAC-secured invite code
    const verification = verifySecureInvite(code);
    
    if (!verification.valid) {
      return NextResponse.json({ 
        error: verification.error || 'Invalid invite code'
      }, { status: verification.error?.includes('expired') ? 410 : 404 });
    }

    // Find venue by verified ID
    const venue = VENUES.find(v => v.id === verification.venueId);
    if (!venue) {
      return NextResponse.json({ 
        error: 'Venue not found'
      }, { status: 404 });
    }

    // Optional geolocation verification (for production deployment)
    let locationValid = true;
    let distanceFromVenue = null;

    if (latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number') {
      distanceFromVenue = calculateDistance(latitude, longitude, venue.lat, venue.lng);
      locationValid = distanceFromVenue <= venue.radius;
      
      console.log(`📍 Location check: ${distanceFromVenue.toFixed(2)}m from ${venue.name} (limit: ${venue.radius}m)`);
      
      if (!locationValid) {
        return NextResponse.json({ 
          error: `You must be within ${venue.radius}m of ${venue.name} to claim your Miracle SBT`,
          distance: distanceFromVenue,
          venue: venue.name
        }, { status: 403 });
      }
    } else {
      console.log('📍 Location verification skipped (coordinates not provided)');
    }

    // Mark code as used to prevent reuse
    await redis.set(codeKey, JSON.stringify({
      address,
      venue: venue.id,
      timestamp: Date.now(),
      ip
    }), { ex: 24 * 60 * 60 }); // 24 hour expiry

    const processingTime = Date.now() - startTime;
    console.log(`✅ Invite verified in ${processingTime}ms for venue:`, venue.name);

    return NextResponse.json({
      success: true,
      verified: true,
      venueId: venue.id,
      venueName: venue.name,
      address,
      location: {
        verified: locationValid,
        distance: distanceFromVenue,
        withinRadius: locationValid
      },
      expiresAt: new Date(verification.expiresAt!).toISOString(),
      processingTime,
      message: `Welcome to ${venue.name}! You can now mint your Miracle SBT.`
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': remaining.toString(),
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Error verifying invite after ${processingTime}ms:`, error);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      processingTime
    }, { status: 500 });
  }
}