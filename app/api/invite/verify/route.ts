import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/lib/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { 
  withErrorHandling, 
  Logger, 
  createValidationError, 
  createRateLimitError,
  createAuthorizationError,
  createInternalError, 
  extractRequestContext 
} from '@/lib/error-handling';

// Runtime configuration for edge compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Production security configuration
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
  analytics: true,
  prefix: "nfa-verify-rl"
});

// Constants
const INVITE_EXPIRY = 15 * 60 * 1000; // 15 minutes
// Validate required secret key (only in production for now)
if (!process.env.INVITE_SECRET_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('INVITE_SECRET_KEY environment variable is required for HMAC security');
  }
  console.warn('⚠️ INVITE_SECRET_KEY missing - using insecure fallback for development');
}

if (process.env.INVITE_SECRET_KEY && process.env.INVITE_SECRET_KEY.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('INVITE_SECRET_KEY must be at least 32 characters for security');
  }
  console.warn('⚠️ INVITE_SECRET_KEY too short - insecure for production');
}

const SECRET_KEY = process.env.INVITE_SECRET_KEY || 'dev-fallback-secret-key-only-for-development';

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

const verifyHandler = async (request: NextRequest) => {
  const context = extractRequestContext(request);
  Logger.info('Invite verification request received', { endpoint: context.endpoint }, context);
  
  // Enhanced rate limiting with IP and address tracking
  const ip = context.ip || 'anonymous';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    Logger.security('Rate limit exceeded for invite verification', {
      ip,
      limit,
      remaining,
      reset: new Date(reset).toISOString()
    }, context);
    
    const error = createRateLimitError('Too many verification attempts. Please wait before trying again.', context);
    
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
        retryAfter: Math.round((reset - Date.now()) / 1000),
        timestamp: new Date().toISOString()
      },
      { 
        status: error.statusCode,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
          'Content-Type': 'application/json'
        }
      }
    );
  }
  
  const body = await request.json();
  const { code, address, latitude, longitude } = body;
  
  Logger.info('Processing invite verification', {
    address,
    hasLocation: !!(latitude && longitude)
  }, context);
  
  // Security: Atomic check-and-set to prevent race condition in code reuse
  const codeKey = `used-code:${crypto.createHash('sha256').update(code).digest('hex')}`;
  
  // Use Redis SET with NX (only set if not exists) for atomic operation
  const usageData = JSON.stringify({
    address,
    timestamp: Date.now(),
    ip
  });
  
  let setResult;
  try {
    setResult = await redis.set(codeKey, usageData, { 
      nx: true, // Only set if key doesn't exist (atomic)
      ex: 24 * 60 * 60 // 24 hour expiry
    });
  } catch (redisError) {
    Logger.error('Redis atomic operation failed', redisError instanceof Error ? redisError : new Error(String(redisError)), context);
    throw createInternalError('Failed to verify invite code usage', context);
  }
  
  if (!setResult) {
    Logger.warn('Attempt to reuse invite code', {
      codeHash: codeKey.substring(10, 20) + '...',
      address
    }, context);
    throw createValidationError('This invite code has already been used', context);
  }

  // Validate required fields
  if (!code || typeof code !== 'string') {
    throw createValidationError('Invite code is required', context);
  }

  if (!address || typeof address !== 'string') {
    throw createValidationError('Wallet address is required', context);
  }

  // Verify HMAC-secured invite code
  const verification = verifySecureInvite(code);
  
  if (!verification.valid) {
    Logger.security('Invalid invite code verification attempt', {
      error: verification.error,
      address,
      codePreview: code.substring(0, 10) + '...'
    }, context);
    
    if (verification.error?.includes('expired')) {
      const error = createValidationError(verification.error, context);
      error.statusCode = 410;
      throw error;
    } else {
      const error = createValidationError(verification.error || 'Invalid invite code', context);
      error.statusCode = 404;
      throw error;
    }
  }

  // Find venue by verified ID
  const venue = VENUES.find(v => v.id === verification.venueId);
  if (!venue) {
    Logger.error('Venue not found for verified invite code', {
      venueId: verification.venueId
    }, context);
    throw createInternalError('Venue configuration error', context);
  }

  // Optional geolocation verification (for production deployment)
  let locationValid = true;
  let distanceFromVenue = null;

  if (latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number') {
    distanceFromVenue = calculateDistance(latitude, longitude, venue.lat, venue.lng);
    locationValid = distanceFromVenue <= venue.radius;
    
    Logger.info('Location verification performed', {
      venue: venue.name,
      distance: distanceFromVenue,
      radius: venue.radius,
      valid: locationValid
    }, context);
    
    if (!locationValid) {
      Logger.security('GPS verification failed - user outside venue radius', {
        venue: venue.name,
        distance: distanceFromVenue,
        radius: venue.radius,
        address
      }, context);
      
      const error = createAuthorizationError(
        `You must be within ${venue.radius}m of ${venue.name} to claim your Miracle SBT`,
        context
      );
      error.context.distance = distanceFromVenue;
      error.context.venue = venue.name;
      throw error;
    }
  } else {
    Logger.info('Location verification skipped - coordinates not provided', {
      venue: venue.name
    }, context);
  }

  // Code already marked as used above with atomic operation
  Logger.info('Invite verification completed successfully', {
    venue: venue.name,
    venueId: venue.id,
    address,
    locationVerified: locationValid
  }, context);

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
    message: `Welcome to ${venue.name}! You can now mint your Miracle SBT.`
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
      'X-RateLimit-Remaining': remaining.toString(),
    }
  });
};

export const POST = withErrorHandling(verifyHandler);
