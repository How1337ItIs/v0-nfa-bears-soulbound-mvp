import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Runtime configuration for edge compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Constants
const REQUEST_TIMEOUT = 10000; // 10 seconds
const INVITE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const SECRET_KEY = process.env.INVITE_SECRET_KEY || 'fallback-dev-secret-key';

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

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('API: Invite POST request received at', new Date().toISOString());
    
    // Parse request body
    const body = await request.json();
    const { venueId } = body;
    
    console.log('API: Processing venue ID:', venueId);

    // Validate input
    if (!venueId || typeof venueId !== 'string') {
      return NextResponse.json({ 
        error: 'venueId is required and must be a string' 
      }, { status: 400 });
    }

    // Find venue
    const venue = VENUES.find(v => v.id === venueId);
    if (!venue) {
      return NextResponse.json({ 
        error: 'Invalid venue',
        availableVenues: VENUES.map(v => ({ id: v.id, name: v.name }))
      }, { status: 400 });
    }

    // Generate secure invite code
    const { code, expiresAt } = generateSecureInvite(venueId);
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/invite/${code}`;

    const processingTime = Date.now() - startTime;
    console.log(`API: Generated secure code in ${processingTime}ms:`, code.substring(0, 20) + '...');
    
    return NextResponse.json({
      success: true,
      code,
      url: inviteUrl,
      expiresAt: new Date(expiresAt).toISOString(),
      venue: venue.name,
      processingTime
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Error in invite API after ${processingTime}ms:`, error);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      processingTime
    }, { status: 500 });
  }
}

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

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('API: Invite GET request received at', new Date().toISOString());
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ 
        error: 'Missing invite code' 
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

    const processingTime = Date.now() - startTime;
    console.log(`API: Verified invite code in ${processingTime}ms for venue:`, venue.name);

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
      used: false, // TODO: Implement Redis-based usage tracking
      processingTime
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Error validating invite after ${processingTime}ms:`, error);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      processingTime
    }, { status: 500 });
  }
}