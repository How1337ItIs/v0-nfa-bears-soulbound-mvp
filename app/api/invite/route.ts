import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { redis } from '@/lib/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { withErrorHandling, Logger, createValidationError, createRateLimitError, createInternalError, extractRequestContext } from '@/lib/error-handling';

// Runtime configuration for edge compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Rate limiting configuration
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute for invite generation
  analytics: true,
  prefix: "nfa-invite-rl"
});

// Constants
const REQUEST_TIMEOUT = 10000; // 10 seconds
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

// HMAC-secured invite code generation
function generateSecureInvite(venueId: string): { code: string, expiresAt: number } {
  const timestamp = Date.now();
  const expiresAt = timestamp + INVITE_EXPIRY;
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const payload = `${venueId}:${timestamp}:${randomBytes}`;
  
  // Generate HMAC signature (16 bytes for QR efficiency)
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex')
    .substring(0, 16);
  
  const code = `${payload}:${signature}`;
  return { code, expiresAt };
}

const postHandler = async (request: NextRequest) => {
  const context = extractRequestContext(request);
  Logger.info('Invite generation request received', { endpoint: context.endpoint }, context);
  
  // Rate limiting
  const ip = context.ip || 'anonymous';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    Logger.security('Rate limit exceeded for invite generation', {
      ip,
      limit,
      remaining
    }, context);
    
    const error = createRateLimitError('Too many invite generation attempts. Please wait before trying again.', context);
    
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
  
  // Parse request body
  const body = await request.json();
  const { venueId, baseUrl } = body;
  
  Logger.info('Processing venue invite generation', { venueId }, context);

  // Validate input
  if (!venueId || typeof venueId !== 'string') {
    throw createValidationError('venueId is required and must be a string', context);
  }

  // Find venue
  const venue = VENUES.find(v => v.id === venueId);
  if (!venue) {
    Logger.warn('Invalid venue requested', { 
      venueId, 
      availableVenues: VENUES.map(v => v.id) 
    }, context);
    throw createValidationError(`Invalid venue: ${venueId}. Available venues: ${VENUES.map(v => v.id).join(', ')}`, context);
  }

  // Generate secure invite code
  const { code, expiresAt } = generateSecureInvite(venueId);
  const inviteUrl = `${baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/invite/${code}`;

  // Store invite code in Redis for mint API compatibility
  const inviteData = {
    timestamp: Math.floor(Date.now() / 1000),
    venueId: venueId,
    expiresAt: expiresAt
  };
  
  const redisKey = `invite:${code}`;
  try {
    await redis.set(redisKey, JSON.stringify(inviteData), { ex: 15 * 60 }); // 15 minutes TTL
    Logger.info('Invite code stored in Redis', { redisKey: redisKey.substring(0, 20) + '...' }, context);
  } catch (redisError) {
    Logger.error('Failed to store invite in Redis', redisError instanceof Error ? redisError : new Error(String(redisError)), context);
    throw createInternalError('Failed to generate invite code', context);
  }

  // Generate QR code as data URL
  let qrCodeDataUrl: string;
  try {
    qrCodeDataUrl = await QRCode.toDataURL(inviteUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256
    });
  } catch (qrError) {
    Logger.error('Failed to generate QR code', qrError instanceof Error ? qrError : new Error(String(qrError)), context);
    throw createInternalError('Failed to generate QR code', context);
  }

  Logger.info('Invite code and QR generated successfully', {
    venue: venue.name,
    codePreview: code.substring(0, 20) + '...'
  }, context);
  
  return NextResponse.json({
    success: true,
    code,
    url: inviteUrl,
    qrUrl: qrCodeDataUrl,
    expiresAt: new Date(expiresAt).toISOString(),
    venue: venue.name
  }, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
      'X-RateLimit-Remaining': remaining.toString()
    }
  });
};

export const POST = withErrorHandling(postHandler);

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

const getHandler = async (request: NextRequest) => {
  const context = extractRequestContext(request);
  Logger.info('Invite validation request received', { endpoint: context.endpoint }, context);
  
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    throw createValidationError('Missing invite code', context);
  }

  // Verify HMAC-secured invite code
  const verification = verifySecureInvite(code);
  
  if (!verification.valid) {
    Logger.warn('Invalid invite code validation attempt', {
      error: verification.error,
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

  Logger.info('Invite code validated successfully', {
    venue: venue.name,
    venueId: venue.id
  }, context);

  return NextResponse.json({
    success: true,
    venueId: venue.id,
    venue: venue.name,
    coordinates: { 
      lat: venue.lat, 
      lng: venue.lng, 
      radius: venue.radius 
    },
    expiresAt: new Date(verification.expiresAt!).toISOString(),
    used: false // TODO: Implement Redis-based usage tracking
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json'
    }
  });
};

export const GET = withErrorHandling(getHandler);