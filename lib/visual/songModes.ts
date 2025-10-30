/**
 * SONG-SPECIFIC VISUAL MODES
 *
 * Maps Grateful Dead songs to distinct visual configurations.
 * Each song has unique palette, intensity, effects, and flow characteristics.
 *
 * Usage:
 * ```typescript
 * const mode = SONG_MODES['dark-star'];
 * applyVisualMode(mode);
 * // Visual character matches song's energy and vibe
 * ```
 */

export interface SongVisualMode {
  // Identity
  songTitle: string;
  artist: string;

  // Visual Configuration
  palette: string; // Palette ID
  intensity: number; // 0-1
  thermalRate: 'low' | 'medium' | 'high' | 'ultra';

  // Effect Enablement
  effects: {
    thinFilm: boolean;
    shimmer: boolean;
    flowField: boolean;
    chromatic: boolean;
    kaleidoscope: boolean;
    vignette: boolean;
  };

  // Audio Mapping
  audioSensitivity: number; // 0-1, how reactive to audio
  beatBurstMultiplier: number; // 1.0-2.5

  // Flow Characteristics
  viscosity: number; // 0.3-0.6
  flowSpeed: number; // 0.5-2.0

  // Jam Character
  jamDuration: 'short' | 'medium' | 'extended' | 'epic';
  transitionStyle: 'smooth' | 'sharp' | 'psychedelic';

  // Cultural Context
  culturalNotes: string;
  typicalTempo: number; // BPM
  era: string; // e.g., "1969-1974"
}

export const SONG_MODES: Record<string, SongVisualMode> = {
  'dark-star': {
    songTitle: 'Dark Star',
    artist: 'Grateful Dead',
    palette: 'dark-star',
    intensity: 0.9,
    thermalRate: 'high',
    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      chromatic: true,
      kaleidoscope: true, // Cosmic, trippy jams
      vignette: false,
    },
    audioSensitivity: 0.9,
    beatBurstMultiplier: 1.8,
    viscosity: 0.4,
    flowSpeed: 1.2,
    jamDuration: 'epic',
    transitionStyle: 'psychedelic',
    culturalNotes: 'Signature jam vehicle. Extended improvisations, cosmic themes, space-rock territory.',
    typicalTempo: 100,
    era: '1968-1974 (peak)',
  },

  'fire-on-the-mountain': {
    songTitle: 'Fire on the Mountain',
    artist: 'Grateful Dead',
    palette: 'fire-on-the-mountain',
    intensity: 1.0,
    thermalRate: 'ultra',
    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      chromatic: false,
      kaleidoscope: false,
      vignette: true, // Focus on flames
    },
    audioSensitivity: 1.0,
    beatBurstMultiplier: 2.0,
    viscosity: 0.3, // Fast-flowing like fire
    flowSpeed: 1.8,
    jamDuration: 'extended',
    transitionStyle: 'sharp',
    culturalNotes: 'High-energy, fiery jam. Often paired with Scarlet Begonias. Fast-paced, intense.',
    typicalTempo: 130,
    era: '1977-1995',
  },

  'china-cat-sunflower': {
    songTitle: 'China Cat Sunflower',
    artist: 'Grateful Dead',
    palette: 'china-cat-sunflower',
    intensity: 0.7,
    thermalRate: 'medium',
    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: false,
      chromatic: true,
      kaleidoscope: false,
      vignette: false,
    },
    audioSensitivity: 0.7,
    beatBurstMultiplier: 1.5,
    viscosity: 0.45,
    flowSpeed: 1.0,
    jamDuration: 'medium',
    transitionStyle: 'smooth',
    culturalNotes: 'Bright, playful energy. Often flows into I Know You Rider. Sunny, whimsical vibe.',
    typicalTempo: 110,
    era: '1968-1995',
  },

  'terrapin-station': {
    songTitle: 'Terrapin Station',
    artist: 'Grateful Dead',
    palette: 'terrapin-station',
    intensity: 0.75,
    thermalRate: 'medium',
    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      chromatic: false,
      kaleidoscope: false,
      vignette: true,
    },
    audioSensitivity: 0.75,
    beatBurstMultiplier: 1.6,
    viscosity: 0.45,
    flowSpeed: 0.9,
    jamDuration: 'extended',
    transitionStyle: 'smooth',
    culturalNotes: 'Epic suite with multiple movements. Contemplative, flowing, storytelling quality.',
    typicalTempo: 95,
    era: '1977-1990',
  },

  'scarlet-begonias': {
    songTitle: 'Scarlet Begonias',
    artist: 'Grateful Dead',
    palette: 'scarlet-begonias',
    intensity: 0.85,
    thermalRate: 'high',
    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      chromatic: true,
      kaleidoscope: false,
      vignette: false,
    },
    audioSensitivity: 0.85,
    beatBurstMultiplier: 1.7,
    viscosity: 0.35,
    flowSpeed: 1.4,
    jamDuration: 'extended',
    transitionStyle: 'smooth',
    culturalNotes: 'Vibrant, passionate. Often paired with Fire on the Mountain. Mid-tempo groover.',
    typicalTempo: 115,
    era: '1974-1995',
  },

  // Generic/default modes for non-Dead songs
  'ambient': {
    songTitle: 'Ambient Mode',
    artist: 'Generic',
    palette: 'classic-60s',
    intensity: 0.5,
    thermalRate: 'low',
    effects: {
      thinFilm: false,
      shimmer: true,
      flowField: false,
      chromatic: false,
      kaleidoscope: false,
      vignette: true,
    },
    audioSensitivity: 0.5,
    beatBurstMultiplier: 1.2,
    viscosity: 0.5,
    flowSpeed: 0.5,
    jamDuration: 'medium',
    transitionStyle: 'smooth',
    culturalNotes: 'Gentle, flowing visuals for ambient music.',
    typicalTempo: 80,
    era: 'Contemporary',
  },

  'dance-floor': {
    songTitle: 'Dance Floor Mode',
    artist: 'Generic',
    palette: 'grateful-dead',
    intensity: 0.9,
    thermalRate: 'ultra',
    effects: {
      thinFilm: true,
      shimmer: true,
      flowField: true,
      chromatic: true,
      kaleidoscope: false,
      vignette: false,
    },
    audioSensitivity: 1.0,
    beatBurstMultiplier: 2.0,
    viscosity: 0.3,
    flowSpeed: 1.8,
    jamDuration: 'short',
    transitionStyle: 'sharp',
    culturalNotes: 'High-energy visuals for dance music.',
    typicalTempo: 128,
    era: 'Contemporary',
  },
};

/**
 * Get visual mode for song
 * @param songKey - Song identifier (kebab-case)
 * @returns Visual mode configuration
 */
export function getSongMode(songKey: string): SongVisualMode | null {
  return SONG_MODES[songKey] || null;
}

/**
 * Get all available song modes
 * @returns Array of song mode keys
 */
export function getAllSongModes(): string[] {
  return Object.keys(SONG_MODES);
}

/**
 * Search song modes by artist
 * @param artist - Artist name
 * @returns Array of matching song modes
 */
export function getSongModesByArtist(artist: string): SongVisualMode[] {
  return Object.values(SONG_MODES).filter(mode =>
    mode.artist.toLowerCase().includes(artist.toLowerCase())
  );
}

/**
 * Search song modes by tempo range
 * @param minBPM - Minimum BPM
 * @param maxBPM - Maximum BPM
 * @returns Array of matching song modes
 */
export function getSongModesByTempo(minBPM: number, maxBPM: number): SongVisualMode[] {
  return Object.values(SONG_MODES).filter(mode =>
    mode.typicalTempo >= minBPM && mode.typicalTempo <= maxBPM
  );
}

/**
 * Get recommended song mode based on detected audio characteristics
 * @param bpm - Detected BPM
 * @param energy - Energy level (0-1)
 * @returns Recommended song mode
 */
export function recommendSongMode(bpm: number, energy: number): SongVisualMode {
  // High energy, fast tempo
  if (bpm > 120 && energy > 0.8) {
    return SONG_MODES['fire-on-the-mountain'];
  }

  // Slow, cosmic
  if (bpm < 90 && energy > 0.7) {
    return SONG_MODES['dark-star'];
  }

  // Medium tempo, moderate energy
  if (bpm >= 90 && bpm <= 120 && energy > 0.6) {
    return SONG_MODES['scarlet-begonias'];
  }

  // Low energy
  if (energy < 0.6) {
    return SONG_MODES['ambient'];
  }

  // Default to dance floor
  return SONG_MODES['dance-floor'];
}
