/**
 * PERIOD-ACCURATE SOUND EFFECTS
 * 
 * Authentic 60s sound effects and audio elements
 * Includes ambient sounds, music, and period-accurate audio
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface SoundEffect {
  id: string;
  name: string;
  description: string;
  category: 'ambient' | 'music' | 'voice' | 'mechanical' | 'nature' | 'urban';
  year: number;
  culturalContext: string;
  audioData: {
    duration: number; // in seconds
    sampleRate: number;
    channels: number;
    format: 'wav' | 'mp3' | 'ogg' | 'flac';
    size: number; // in bytes
  };
  usage: string[];
  culturalSignificance: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  duration: number; // in seconds
  culturalContext: string;
  lyrics?: string;
  culturalSignificance: string;
  visualElements: {
    paletteId: string;
    filterId: string;
    effectId: string;
  };
}

export interface AmbientSoundscape {
  id: string;
  name: string;
  description: string;
  location: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  sounds: {
    soundId: string;
    volume: number; // 0-1
    loop: boolean;
    fadeIn: number; // in seconds
    fadeOut: number; // in seconds
  }[];
  culturalContext: string;
}

export const PERIOD_SOUND_EFFECTS: SoundEffect[] = [
  {
    id: 'vinyl-crackle',
    name: 'Vinyl Record Crackle',
    description: 'Authentic vinyl record crackle and pop sounds',
    category: 'mechanical',
    year: 1960,
    culturalContext: 'Vinyl records were the primary music format in the 60s',
    audioData: {
      duration: 30,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 2646000,
    },
    usage: ['Music playback', 'Nostalgic effects', 'Period atmosphere'],
    culturalSignificance: 'Vinyl crackle represents the authentic sound of 60s music',
  },
  {
    id: 'reel-to-reel',
    name: 'Reel-to-Reel Tape',
    description: 'Sound of reel-to-reel tape machines starting and stopping',
    category: 'mechanical',
    year: 1965,
    culturalContext: 'Reel-to-reel tape was used for professional recording',
    audioData: {
      duration: 15,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 1323000,
    },
    usage: ['Recording studios', 'Professional audio', 'Period atmosphere'],
    culturalSignificance: 'Reel-to-reel tape represents professional audio production',
  },
  {
    id: 'tube-amp-hum',
    name: 'Tube Amplifier Hum',
    description: 'Warm hum from vacuum tube amplifiers',
    category: 'mechanical',
    year: 1960,
    culturalContext: 'Tube amplifiers were used for guitar and audio amplification',
    audioData: {
      duration: 20,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 1764000,
    },
    usage: ['Guitar amplification', 'Audio equipment', 'Period atmosphere'],
    culturalSignificance: 'Tube amp hum represents the warm sound of 60s audio equipment',
  },
  {
    id: 'coffee-house-chatter',
    name: 'Coffee House Chatter',
    description: 'Background conversation in a coffee house',
    category: 'ambient',
    year: 1960,
    culturalContext: 'Coffee houses were gathering places for the Beat Generation',
    audioData: {
      duration: 60,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 5292000,
    },
    usage: ['Coffee house atmosphere', 'Beat Generation scenes', 'Ambient background'],
    culturalSignificance: 'Coffee house chatter represents the social aspect of Beat culture',
  },
  {
    id: 'jazz-club-ambience',
    name: 'Jazz Club Ambience',
    description: 'Background sounds from a jazz club',
    category: 'ambient',
    year: 1960,
    culturalContext: 'Jazz clubs were central to Beat Generation culture',
    audioData: {
      duration: 45,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 3969000,
    },
    usage: ['Jazz club atmosphere', 'Beat Generation scenes', 'Ambient background'],
    culturalSignificance: 'Jazz club ambience represents the musical culture of the Beat Generation',
  },
  {
    id: 'fillmore-crowd',
    name: 'Fillmore West Crowd',
    description: 'Crowd sounds from Fillmore West concerts',
    category: 'ambient',
    year: 1967,
    culturalContext: 'Fillmore West was a key venue for psychedelic concerts',
    audioData: {
      duration: 90,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 7938000,
    },
    usage: ['Concert atmosphere', 'Psychedelic scenes', 'Ambient background'],
    culturalSignificance: 'Fillmore crowd sounds represent the psychedelic concert experience',
  },
  {
    id: 'lava-lamp-bubble',
    name: 'Lava Lamp Bubble',
    description: 'Subtle bubbling sounds from lava lamps',
    category: 'mechanical',
    year: 1963,
    culturalContext: 'Lava lamps were iconic decorative elements of the 60s',
    audioData: {
      duration: 30,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 2646000,
    },
    usage: ['Ambient decoration', 'Period atmosphere', 'Relaxing background'],
    culturalSignificance: 'Lava lamp sounds represent the relaxed, contemplative side of 60s culture',
  },
  {
    id: 'typewriter-clack',
    name: 'Typewriter Clack',
    description: 'Sound of typing on a manual typewriter',
    category: 'mechanical',
    year: 1960,
    culturalContext: 'Typewriters were used for writing Beat poetry and literature',
    audioData: {
      duration: 20,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 1764000,
    },
    usage: ['Writing scenes', 'Beat Generation atmosphere', 'Period atmosphere'],
    culturalSignificance: 'Typewriter sounds represent the literary culture of the Beat Generation',
  },
  {
    id: 'vinyl-scratch',
    name: 'Vinyl Record Scratch',
    description: 'Sound of a vinyl record being scratched',
    category: 'mechanical',
    year: 1960,
    culturalContext: 'Vinyl scratching was used in DJ culture and experimental music',
    audioData: {
      duration: 5,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 441000,
    },
    usage: ['DJ effects', 'Experimental music', 'Period atmosphere'],
    culturalSignificance: 'Vinyl scratching represents the experimental side of 60s music',
  },
  {
    id: 'hippie-chant',
    name: 'Hippie Chant',
    description: 'Chanting sounds from hippie gatherings',
    category: 'voice',
    year: 1967,
    culturalContext: 'Chanting was used in hippie spiritual and political gatherings',
    audioData: {
      duration: 30,
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      size: 2646000,
    },
    usage: ['Hippie gatherings', 'Spiritual scenes', 'Political demonstrations'],
    culturalSignificance: 'Hippie chants represent the spiritual and political aspects of the movement',
  },
];

export const PERIOD_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'lucy-in-the-sky',
    title: 'Lucy in the Sky with Diamonds',
    artist: 'The Beatles',
    year: 1967,
    genre: 'Psychedelic Rock',
    duration: 208,
    culturalContext: 'Iconic psychedelic song from Sgt. Pepper\'s Lonely Hearts Club Band',
    lyrics: 'Picture yourself in a boat on a river...',
    culturalSignificance: 'This song represents the peak of psychedelic rock and the Beatles\' experimentation with psychedelic themes',
    visualElements: {
      paletteId: 'psychedelic-sunset',
      filterId: 'psychedelic-glow',
      effectId: 'morphing-organic',
    },
  },
  {
    id: 'purple-haze',
    title: 'Purple Haze',
    artist: 'Jimi Hendrix',
    year: 1967,
    genre: 'Psychedelic Rock',
    duration: 180,
    culturalContext: 'Revolutionary guitar work and psychedelic lyrics',
    lyrics: 'Purple haze all in my brain...',
    culturalSignificance: 'This song represents the revolutionary guitar techniques and psychedelic themes of Jimi Hendrix',
    visualElements: {
      paletteId: 'acid-test',
      filterId: 'acid-wash',
      effectId: 'strobe-flash',
    },
  },
  {
    id: 'white-rabbit',
    title: 'White Rabbit',
    artist: 'Jefferson Airplane',
    year: 1967,
    genre: 'Psychedelic Rock',
    duration: 150,
    culturalContext: 'Psychedelic interpretation of Alice in Wonderland',
    lyrics: 'One pill makes you larger and one pill makes you small...',
    culturalSignificance: 'This song represents the psychedelic interpretation of classic literature and the counterculture movement',
    visualElements: {
      paletteId: 'flower-power',
      filterId: 'flower-child',
      effectId: 'kaleidoscope-mandala',
    },
  },
  {
    id: 'light-my-fire',
    title: 'Light My Fire',
    artist: 'The Doors',
    year: 1967,
    genre: 'Psychedelic Rock',
    duration: 420,
    culturalContext: 'Epic psychedelic rock song with extended instrumental sections',
    lyrics: 'You know that it would be untrue...',
    culturalSignificance: 'This song represents the epic, extended format of psychedelic rock and the Doors\' unique sound',
    visualElements: {
      paletteId: 'psychedelic-sunset',
      filterId: 'psychedelic-glow',
      effectId: 'oil-projector-waves',
    },
  },
  {
    id: 'truckin',
    title: 'Truckin\'',
    artist: 'Grateful Dead',
    year: 1970,
    genre: 'Psychedelic Rock',
    duration: 300,
    culturalContext: 'Anthem of the counterculture movement',
    lyrics: 'What a long, strange trip it\'s been...',
    culturalSignificance: 'This song represents the Grateful Dead\'s role in the counterculture movement and their unique approach to psychedelic rock',
    visualElements: {
      paletteId: 'acid-test',
      filterId: 'acid-wash',
      effectId: 'lava-lamp-flow',
    },
  },
  {
    id: 'blowin-in-the-wind',
    title: 'Blowin\' in the Wind',
    artist: 'Bob Dylan',
    year: 1963,
    genre: 'Folk',
    duration: 180,
    culturalContext: 'Anthem of the civil rights and peace movements',
    lyrics: 'How many roads must a man walk down...',
    culturalSignificance: 'This song represents the political and social consciousness of the 60s folk movement',
    visualElements: {
      paletteId: 'flower-power',
      filterId: 'flower-child',
      effectId: 'lava-lamp-flow',
    },
  },
  {
    id: 'satisfaction',
    title: '(I Can\'t Get No) Satisfaction',
    artist: 'The Rolling Stones',
    year: 1965,
    genre: 'Rock',
    duration: 210,
    culturalContext: 'Anthem of youthful rebellion and dissatisfaction',
    lyrics: 'I can\'t get no satisfaction...',
    culturalSignificance: 'This song represents the rebellious spirit of rock and roll and the British Invasion',
    visualElements: {
      paletteId: 'mod-madness',
      filterId: 'mod-sharp',
      effectId: 'strobe-flash',
    },
  },
  {
    id: 'my-generation',
    title: 'My Generation',
    artist: 'The Who',
    year: 1965,
    genre: 'Rock',
    duration: 240,
    culturalContext: 'Anthem of the Mod movement and youth culture',
    lyrics: 'People try to put us down...',
    culturalSignificance: 'This song represents the Mod movement and the generational conflict of the 60s',
    visualElements: {
      paletteId: 'mod-madness',
      filterId: 'mod-sharp',
      effectId: 'op-art-illusion',
    },
  },
];

export const AMBIENT_SOUNDSCAPES: AmbientSoundscape[] = [
  {
    id: 'fillmore-west-concert',
    name: 'Fillmore West Concert',
    description: 'Ambient sounds from a Fillmore West concert',
    location: 'Fillmore West',
    timeOfDay: 'evening',
    season: 'summer',
    sounds: [
      { soundId: 'fillmore-crowd', volume: 0.8, loop: true, fadeIn: 5, fadeOut: 5 },
      { soundId: 'vinyl-crackle', volume: 0.3, loop: true, fadeIn: 2, fadeOut: 2 },
      { soundId: 'tube-amp-hum', volume: 0.2, loop: true, fadeIn: 3, fadeOut: 3 },
    ],
    culturalContext: 'Fillmore West was a key venue for psychedelic concerts and light shows',
  },
  {
    id: 'coffee-house-beat',
    name: 'Coffee House Beat',
    description: 'Ambient sounds from a Beat Generation coffee house',
    location: 'Coffee House',
    timeOfDay: 'afternoon',
    season: 'autumn',
    sounds: [
      { soundId: 'coffee-house-chatter', volume: 0.6, loop: true, fadeIn: 3, fadeOut: 3 },
      { soundId: 'typewriter-clack', volume: 0.4, loop: true, fadeIn: 2, fadeOut: 2 },
      { soundId: 'jazz-club-ambience', volume: 0.5, loop: true, fadeIn: 4, fadeOut: 4 },
    ],
    culturalContext: 'Coffee houses were gathering places for the Beat Generation',
  },
  {
    id: 'hippie-gathering',
    name: 'Hippie Gathering',
    description: 'Ambient sounds from a hippie gathering',
    location: 'Golden Gate Park',
    timeOfDay: 'afternoon',
    season: 'summer',
    sounds: [
      { soundId: 'hippie-chant', volume: 0.7, loop: true, fadeIn: 4, fadeOut: 4 },
      { soundId: 'lava-lamp-bubble', volume: 0.3, loop: true, fadeIn: 2, fadeOut: 2 },
      { soundId: 'vinyl-crackle', volume: 0.2, loop: true, fadeIn: 1, fadeOut: 1 },
    ],
    culturalContext: 'Hippie gatherings were central to the counterculture movement',
  },
  {
    id: 'mod-club',
    name: 'Mod Club',
    description: 'Ambient sounds from a Mod club',
    location: 'Carnaby Street',
    timeOfDay: 'night',
    season: 'spring',
    sounds: [
      { soundId: 'vinyl-scratch', volume: 0.5, loop: true, fadeIn: 1, fadeOut: 1 },
      { soundId: 'tube-amp-hum', volume: 0.4, loop: true, fadeIn: 2, fadeOut: 2 },
      { soundId: 'vinyl-crackle', volume: 0.3, loop: true, fadeIn: 1, fadeOut: 1 },
    ],
    culturalContext: 'Mod clubs were central to British Mod culture',
  },
];

export function getSoundEffect(soundId: string): SoundEffect | undefined {
  return PERIOD_SOUND_EFFECTS.find(sound => sound.id === soundId);
}

export function getMusicTrack(trackId: string): MusicTrack | undefined {
  return PERIOD_MUSIC_TRACKS.find(track => track.id === trackId);
}

export function getAmbientSoundscape(soundscapeId: string): AmbientSoundscape | undefined {
  return AMBIENT_SOUNDSCAPES.find(soundscape => soundscape.id === soundscapeId);
}

export function getSoundsByCategory(category: SoundEffect['category']): SoundEffect[] {
  return PERIOD_SOUND_EFFECTS.filter(sound => sound.category === category);
}

export function getMusicByGenre(genre: string): MusicTrack[] {
  return PERIOD_MUSIC_TRACKS.filter(track => 
    track.genre.toLowerCase().includes(genre.toLowerCase())
  );
}

export function getMusicByYear(year: number): MusicTrack[] {
  return PERIOD_MUSIC_TRACKS.filter(track => track.year === year);
}

export function getSoundscapesByLocation(location: string): AmbientSoundscape[] {
  return AMBIENT_SOUNDSCAPES.filter(soundscape => 
    soundscape.location.toLowerCase().includes(location.toLowerCase())
  );
}

export function getSoundscapesByTimeOfDay(timeOfDay: AmbientSoundscape['timeOfDay']): AmbientSoundscape[] {
  return AMBIENT_SOUNDSCAPES.filter(soundscape => soundscape.timeOfDay === timeOfDay);
}
