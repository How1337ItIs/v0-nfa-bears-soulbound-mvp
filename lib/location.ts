import crypto from 'crypto';

interface Coordinates {
  lat: number;
  lng: number;
  radius: number; // meters
}

interface VenueConfig {
  id: string;
  name: string;
  coordinates: Coordinates;
  beaconId?: string;
}

// Venue configuration - in production this would come from a database
export const VENUE: VenueConfig = {
  id: process.env.VENUE_ID || 'default-venue',
  name: process.env.VENUE_NAME || 'Default Venue',
  coordinates: {
    lat: Number(process.env.VENUE_LAT) || 0,
    lng: Number(process.env.VENUE_LNG) || 0,
    radius: Number(process.env.VENUE_RADIUS) || 100 // meters
  },
  beaconId: process.env.VENUE_BEACON_ID
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// Verify if coordinates are within venue radius
export function verifyCoordinates(userLat: number, userLng: number): boolean {
  const distance = calculateDistance(
    userLat,
    userLng,
    VENUE.coordinates.lat,
    VENUE.coordinates.lng
  );
  return distance <= VENUE.coordinates.radius;
}

// Generate time-based secret for QR codes
export function generateTimeSecret(): string {
  const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute windows
  return crypto.createHmac('sha256', process.env.SECRET_KEY || 'default-secret')
    .update(timestamp.toString())
    .digest('hex')
    .slice(0, 8);
}

// Verify time-based secret
export function verifyTimeSecret(secret: string): boolean {
  const currentSecret = generateTimeSecret();
  const previousSecret = crypto.createHmac('sha256', process.env.SECRET_KEY || 'default-secret')
    .update((Math.floor(Date.now() / (5 * 60 * 1000)) - 1).toString())
    .digest('hex')
    .slice(0, 8);
  
  return secret === currentSecret || secret === previousSecret;
} 