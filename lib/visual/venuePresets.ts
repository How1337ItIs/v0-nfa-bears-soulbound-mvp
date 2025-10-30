/**
 * VENUE-SPECIFIC PRESETS
 *
 * Visual configurations matching famous venues from psychedelic rock history.
 * Recreates the atmosphere and technical characteristics of legendary spaces.
 *
 * Features:
 * - Historical venue configurations
 * - Aspect ratios matching projection screens
 * - Lighting characteristics
 * - Cultural context
 *
 * Usage:
 * ```typescript
 * const venue = VENUE_PRESETS['fillmore-east'];
 * applyVenueSettings(venue);
 * ```
 */

export interface VenuePreset {
  // Identity
  venueName: string;
  location: string;
  era: string;

  // Visual Configuration
  palette: string; // Default palette ID
  aspectRatio: string; // Screen aspect ratio
  intensity: number; // 0-1
  vignette: boolean;
  vignetteIntensity?: number;

  // Effects
  effects: {
    thinFilm: boolean;
    shimmer: boolean;
    flowField: boolean;
    kaleidoscope: boolean;
  };

  // Atmosphere
  ambientLighting: 'dark' | 'dim' | 'moderate';
  projection: 'overhead' | 'rear' | 'front';

  // Cultural Context
  significantShows: string[];
  culturalNotes: string;
  capacity: number;
  yearOpened: number;
  yearClosed?: number;
}

export const VENUE_PRESETS: Record<string, VenuePreset> = {
  'fillmore-east': {
    venueName: 'Fillmore East',
    location: 'New York City, NY',
    era: '1968-1971',

    palette: 'joshua-light-show',
    aspectRatio: '4:3', // Traditional projection screen
    intensity: 0.8,
    vignette: true,
    vignetteIntensity: 0.85,

    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      kaleidoscope: false, // More traditional
    },

    ambientLighting: 'dark',
    projection: 'rear',

    significantShows: [
      'Grateful Dead (1970-02-11)',
      'Allman Brothers Band residencies',
      'The Who (1968-10-06)',
    ],
    culturalNotes: 'Legendary venue where Joshua Light Show perfected their craft. Intimate 2,700-capacity theater known for impeccable acoustics and Bill Graham\'s curation.',
    capacity: 2700,
    yearOpened: 1968,
    yearClosed: 1971,
  },

  'winterland': {
    venueName: 'Winterland Ballroom',
    location: 'San Francisco, CA',
    era: '1966-1978',

    palette: 'grateful-dead',
    aspectRatio: '16:9',
    intensity: 0.85,
    vignette: true,
    vignetteIntensity: 0.7,

    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      kaleidoscope: false,
    },

    ambientLighting: 'dim',
    projection: 'overhead',

    significantShows: [
      'Grateful Dead final show (1978-12-31)',
      'The Band farewell concert (1976-11-25)',
      'Sex Pistols final show (1978-01-14)',
    ],
    culturalNotes: 'Former ice skating rink turned legendary rock venue. 5,400 capacity. Home to countless historic performances and Bill Graham\'s New Year\'s Eve celebrations.',
    capacity: 5400,
    yearOpened: 1966,
    yearClosed: 1978,
  },

  'carousel-ballroom': {
    venueName: 'Carousel Ballroom',
    location: 'San Francisco, CA',
    era: '1968',

    palette: 'classic-60s',
    aspectRatio: '4:3',
    intensity: 0.75,
    vignette: true,

    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: false,
      kaleidoscope: false,
    },

    ambientLighting: 'moderate',
    projection: 'front',

    significantShows: [
      'Grateful Dead (1968-02-14)',
      'Jefferson Airplane',
      'Quicksilver Messenger Service',
    ],
    culturalNotes: 'Briefly operated by Grateful Dead and partners as a musician-owned venue. Later became Fillmore West. Represented the idealistic cooperative spirit of the era.',
    capacity: 1200,
    yearOpened: 1968,
    yearClosed: 1968, // Brief existence
  },

  'avalon-ballroom': {
    venueName: 'Avalon Ballroom',
    location: 'San Francisco, CA',
    era: '1966-1968',

    palette: 'classic-60s',
    aspectRatio: '4:3',
    intensity: 0.8,
    vignette: true,
    vignetteIntensity: 0.9,

    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      kaleidoscope: true, // Early psychedelic experimentation
    },

    ambientLighting: 'dark',
    projection: 'overhead',

    significantShows: [
      'Grateful Dead early shows',
      'Big Brother and the Holding Company',
      'Janis Joplin performances',
    ],
    culturalNotes: 'One of the original psychedelic ballrooms. Featured pioneering light shows by the Family Dog collective. Helped define the San Francisco sound.',
    capacity: 1000,
    yearOpened: 1966,
    yearClosed: 1968,
  },

  'red-rocks': {
    venueName: 'Red Rocks Amphitheatre',
    location: 'Morrison, CO',
    era: '1947-present',

    palette: 'fire-on-the-mountain',
    aspectRatio: '16:9',
    intensity: 0.9,
    vignette: false, // Outdoor, natural

    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      kaleidoscope: false,
    },

    ambientLighting: 'dim', // Outdoor evening
    projection: 'front',

    significantShows: [
      'Grateful Dead (1978-07-08)',
      'Grateful Dead (1987-08-09-10)',
      'Many legendary outdoor concerts',
    ],
    culturalNotes: 'Iconic outdoor amphitheater carved into red rock formations. Natural acoustics. Grateful Dead played many legendary shows here, especially in the 1980s.',
    capacity: 9525,
    yearOpened: 1947,
  },

  'greek-theatre': {
    venueName: 'Greek Theatre',
    location: 'Berkeley, CA',
    era: '1903-present',

    palette: 'terrapin-station',
    aspectRatio: '16:9',
    intensity: 0.75,
    vignette: false,

    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: false,
      kaleidoscope: false,
    },

    ambientLighting: 'dim',
    projection: 'front',

    significantShows: [
      'Grateful Dead Greek Theatre Run (1984)',
      'Many Bay Area classic rock shows',
    ],
    culturalNotes: 'Beautiful outdoor amphitheater on UC Berkeley campus. Grateful Dead\'s 1984 run here is legendary. Intimate 8,500-capacity setting with excellent acoustics.',
    capacity: 8500,
    yearOpened: 1903,
  },

  // Modern festival setting
  'modern-festival': {
    venueName: 'Modern Festival Stage',
    location: 'Various',
    era: '2000s-present',

    palette: 'grateful-dead',
    aspectRatio: '21:9', // Ultra-wide LED walls
    intensity: 0.9,
    vignette: false,

    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      kaleidoscope: false,
    },

    ambientLighting: 'dark',
    projection: 'front',

    significantShows: [
      'Dead & Company tours',
      'Fare Thee Well (2015)',
      'Modern jam band festivals',
    ],
    culturalNotes: 'Contemporary festival stages with massive LED walls and modern projection mapping. Honors the legacy while using cutting-edge technology.',
    capacity: 50000,
    yearOpened: 2000,
  },
};

/**
 * Get venue preset by name
 * @param venueName - Venue identifier
 * @returns Venue preset or null
 */
export function getVenuePreset(venueName: string): VenuePreset | null {
  return VENUE_PRESETS[venueName] || null;
}

/**
 * Get all available venues
 * @returns Array of venue names
 */
export function getAllVenues(): string[] {
  return Object.keys(VENUE_PRESETS);
}

/**
 * Search venues by era
 * @param era - Era string (e.g., "1960s", "1970s")
 * @returns Matching venues
 */
export function getVenuesByEra(era: string): VenuePreset[] {
  return Object.values(VENUE_PRESETS).filter(venue =>
    venue.era.includes(era)
  );
}

/**
 * Search venues by location
 * @param location - Location string
 * @returns Matching venues
 */
export function getVenuesByLocation(location: string): VenuePreset[] {
  return Object.values(VENUE_PRESETS).filter(venue =>
    venue.location.toLowerCase().includes(location.toLowerCase())
  );
}

/**
 * Get recommended venue based on context
 * @param outdoor - Whether outdoor venue
 * @param capacity - Desired capacity
 * @returns Recommended venue
 */
export function recommendVenue(outdoor: boolean, capacity: number): VenuePreset {
  const venues = Object.values(VENUE_PRESETS);

  // Filter by outdoor preference
  const outdoorVenues = ['red-rocks', 'greek-theatre', 'modern-festival'];
  const filtered = outdoor
    ? venues.filter(v => outdoorVenues.includes(v.venueName.toLowerCase().replace(/\s+/g, '-')))
    : venues.filter(v => !outdoorVenues.includes(v.venueName.toLowerCase().replace(/\s+/g, '-')));

  // Find closest capacity match
  const sorted = filtered.sort((a, b) => {
    const diffA = Math.abs(a.capacity - capacity);
    const diffB = Math.abs(b.capacity - capacity);
    return diffA - diffB;
  });

  return sorted[0] || VENUE_PRESETS['fillmore-east'];
}
