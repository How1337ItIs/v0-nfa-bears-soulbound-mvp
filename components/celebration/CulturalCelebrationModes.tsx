/**
 * CULTURAL CELEBRATION MODES
 * 
 * Special celebration modes for cultural events and holidays
 * Includes themed visuals, music, and interactive elements
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React, { useState, useEffect } from 'react';
import { AUTHENTIC_60S_PALETTES } from '@/lib/palette/Authentic60sPalettes';
import { VINTAGE_60S_FILTERS } from '@/lib/palette/Authentic60sPalettes';
import { EFFECT_PRESETS } from '@/lib/visual/PeriodAccurateEffects';

export interface CelebrationMode {
  id: string;
  name: string;
  description: string;
  culturalEvent: string;
  date: {
    month: number;
    day: number;
    recurring: boolean;
  };
  visualTheme: {
    paletteId: string;
    filterId: string;
    effectId: string;
    presetId: string;
  };
  musicTheme: {
    genre: string;
    artists: string[];
    songs: string[];
  };
  interactiveElements: {
    type: 'timeline' | 'gallery' | 'quiz' | 'game' | 'story';
    content: any;
  }[];
  educationalContent: {
    title: string;
    content: string;
    culturalSignificance: string;
  };
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high' | 'extreme';
}

export interface CelebrationModeProps {
  modeId: string;
  onModeChange?: (mode: CelebrationMode) => void;
  onVisualChange?: (visuals: any) => void;
  onMusicChange?: (music: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

const CELEBRATION_MODES: CelebrationMode[] = [
  {
    id: 'summer-of-love',
    name: 'Summer of Love Celebration',
    description: 'Celebrate the 1967 Summer of Love with authentic visuals and music',
    culturalEvent: 'Summer of Love',
    date: {
      month: 6, // June
      day: 21, // Summer solstice
      recurring: true,
    },
    visualTheme: {
      paletteId: 'flower-power',
      filterId: 'flower-child',
      effectId: 'lava-lamp-flow',
      presetId: 'summer-of-love',
    },
    musicTheme: {
      genre: 'Psychedelic Rock',
      artists: ['The Beatles', 'Janis Joplin', 'Jimi Hendrix', 'Grateful Dead'],
      songs: ['Lucy in the Sky with Diamonds', 'Purple Haze', 'White Rabbit', 'Truckin\''],
    },
    interactiveElements: [
      {
        type: 'timeline',
        content: {
          title: 'Summer of Love Timeline',
          events: [
            { date: '1967-06-21', title: 'Summer Solstice', description: 'Beginning of the Summer of Love' },
            { date: '1967-07-01', title: 'Monterey Pop Festival', description: 'First major rock festival' },
            { date: '1967-08-15', title: 'Woodstock Planning', description: 'Planning begins for Woodstock' },
          ],
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Summer of Love Art Gallery',
          artworks: [
            { title: 'Fillmore West Posters', artist: 'Wes Wilson', year: '1967' },
            { title: 'Hippie Fashion', artist: 'Various', year: '1967' },
            { title: 'Peace Symbols', artist: 'Various', year: '1967' },
          ],
        },
      },
    ],
    educationalContent: {
      title: 'The Summer of Love',
      content: 'The Summer of Love was a cultural phenomenon that took place in San Francisco in 1967, centered around the hippie community and psychedelic culture.',
      culturalSignificance: 'The Summer of Love represented the peak of the hippie movement and psychedelic culture, with thousands of young people gathering in San Francisco to embrace peace, love, and alternative lifestyles.',
    },
    duration: 60,
    intensity: 'high',
  },
  {
    id: 'woodstock-anniversary',
    name: 'Woodstock Anniversary',
    description: 'Celebrate the iconic Woodstock Festival with period-accurate visuals',
    culturalEvent: 'Woodstock Festival',
    date: {
      month: 8, // August
      day: 15, // August 15-18, 1969
      recurring: true,
    },
    visualTheme: {
      paletteId: 'flower-power',
      filterId: 'flower-child',
      effectId: 'overhead-projector-shadows',
      presetId: 'summer-of-love',
    },
    musicTheme: {
      genre: 'Rock and Folk',
      artists: ['Jimi Hendrix', 'Janis Joplin', 'The Who', 'Crosby, Stills, Nash & Young'],
      songs: ['Star Spangled Banner', 'Piece of My Heart', 'Pinball Wizard', 'Suite: Judy Blue Eyes'],
    },
    interactiveElements: [
      {
        type: 'timeline',
        content: {
          title: 'Woodstock Timeline',
          events: [
            { date: '1969-08-15', title: 'Day 1', description: 'Richie Havens opens the festival' },
            { date: '1969-08-16', title: 'Day 2', description: 'Janis Joplin performs' },
            { date: '1969-08-17', title: 'Day 3', description: 'Jimi Hendrix closes the festival' },
          ],
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Woodstock Art Gallery',
          artworks: [
            { title: 'Woodstock Poster', artist: 'Arnold Skolnick', year: '1969' },
            { title: 'Festival Photography', artist: 'Various', year: '1969' },
            { title: 'Peace and Love Art', artist: 'Various', year: '1969' },
          ],
        },
      },
    ],
    educationalContent: {
      title: 'Woodstock Festival',
      content: 'Woodstock was a music festival held in August 1969 that became a symbol of the counterculture movement and the end of the 60s era.',
      culturalSignificance: 'Woodstock represented the culmination of 60s counterculture and became a symbol of peace, love, and music.',
    },
    duration: 90,
    intensity: 'extreme',
  },
  {
    id: 'beatles-anniversary',
    name: 'Beatles Anniversary',
    description: 'Celebrate the Beatles\' influence on 60s culture',
    culturalEvent: 'Beatles Cultural Impact',
    date: {
      month: 2, // February
      day: 9, // Beatles arrive in America (1964)
      recurring: true,
    },
    visualTheme: {
      paletteId: 'mod-madness',
      filterId: 'mod-sharp',
      effectId: 'slide-projector-morphing',
      presetId: 'mod-madness',
    },
    musicTheme: {
      genre: 'British Invasion',
      artists: ['The Beatles', 'The Rolling Stones', 'The Who', 'The Kinks'],
      songs: ['I Want to Hold Your Hand', 'Satisfaction', 'My Generation', 'You Really Got Me'],
    },
    interactiveElements: [
      {
        type: 'timeline',
        content: {
          title: 'British Invasion Timeline',
          events: [
            { date: '1964-02-09', title: 'Beatles Arrive', description: 'Beatles arrive in America' },
            { date: '1964-02-11', title: 'Ed Sullivan Show', description: 'Beatles perform on Ed Sullivan' },
            { date: '1964-04-04', title: 'Top 5 Songs', description: 'Beatles have top 5 songs on Billboard' },
          ],
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'British Invasion Art Gallery',
          artworks: [
            { title: 'Beatles Album Covers', artist: 'Various', year: '1964-1969' },
            { title: 'Mod Fashion', artist: 'Mary Quant', year: '1964' },
            { title: 'Carnaby Street Style', artist: 'Various', year: '1964' },
          ],
        },
      },
    ],
    educationalContent: {
      title: 'The British Invasion',
      content: 'The British Invasion was a cultural phenomenon in the mid-1960s when British rock and pop music became popular in the United States.',
      culturalSignificance: 'The British Invasion changed American music and culture, introducing new sounds, styles, and attitudes.',
    },
    duration: 45,
    intensity: 'medium',
  },
  {
    id: 'psychedelic-art-day',
    name: 'Psychedelic Art Day',
    description: 'Celebrate the art and artists of the psychedelic movement',
    culturalEvent: 'Psychedelic Art Movement',
    date: {
      month: 4, // April
      day: 19, // Bicycle Day (LSD discovery)
      recurring: true,
    },
    visualTheme: {
      paletteId: 'psychedelic-sunset',
      filterId: 'psychedelic-glow',
      effectId: 'oil-projector-waves',
      presetId: 'fillmore-west',
    },
    musicTheme: {
      genre: 'Psychedelic Rock',
      artists: ['Pink Floyd', 'The Doors', 'Jefferson Airplane', 'Cream'],
      songs: ['Interstellar Overdrive', 'Light My Fire', 'White Rabbit', 'Sunshine of Your Love'],
    },
    interactiveElements: [
      {
        type: 'gallery',
        content: {
          title: 'Psychedelic Art Gallery',
          artworks: [
            { title: 'Fillmore West Posters', artist: 'Wes Wilson', year: '1966-1969' },
            { title: 'Psychedelic Paintings', artist: 'Alex Grey', year: '1960s' },
            { title: 'Light Show Art', artist: 'Joshua White', year: '1967' },
          ],
        },
      },
      {
        type: 'quiz',
        content: {
          title: 'Psychedelic Art Quiz',
          questions: [
            {
              question: 'Who created the iconic Fillmore West posters?',
              options: ['Wes Wilson', 'Andy Warhol', 'Pablo Picasso', 'Salvador Dali'],
              correct: 'Wes Wilson',
            },
          ],
        },
      },
    ],
    educationalContent: {
      title: 'Psychedelic Art Movement',
      content: 'The psychedelic art movement emerged in the 1960s, characterized by vibrant colors, flowing shapes, and mind-bending visual effects.',
      culturalSignificance: 'Psychedelic art defined the visual language of the counterculture and continues to influence modern art and design.',
    },
    duration: 75,
    intensity: 'high',
  },
  {
    id: 'peace-and-love-day',
    name: 'Peace and Love Day',
    description: 'Celebrate the values of peace, love, and harmony',
    culturalEvent: 'Peace and Love Movement',
    date: {
      month: 1, // January
      day: 1, // New Year's Day
      recurring: true,
    },
    visualTheme: {
      paletteId: 'flower-power',
      filterId: 'flower-child',
      effectId: 'lava-lamp-flow',
      presetId: 'summer-of-love',
    },
    musicTheme: {
      genre: 'Folk and Rock',
      artists: ['Bob Dylan', 'Joan Baez', 'Pete Seeger', 'The Mamas & The Papas'],
      songs: ['Blowin\' in the Wind', 'We Shall Overcome', 'Where Have All the Flowers Gone', 'California Dreamin\''],
    },
    interactiveElements: [
      {
        type: 'story',
        content: {
          title: 'Peace and Love Story',
          story: 'The story of how peace and love became the defining values of the 60s counterculture movement.',
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Peace and Love Art Gallery',
          artworks: [
            { title: 'Peace Symbols', artist: 'Various', year: '1960s' },
            { title: 'Flower Power Art', artist: 'Various', year: '1967' },
            { title: 'Love and Harmony', artist: 'Various', year: '1960s' },
          ],
        },
      },
    ],
    educationalContent: {
      title: 'Peace and Love Movement',
      content: 'The peace and love movement was a central theme of 60s counterculture, promoting non-violence, harmony, and universal love.',
      culturalSignificance: 'Peace and love became the defining values of the hippie movement and continue to influence modern peace movements.',
    },
    duration: 30,
    intensity: 'low',
  },
];

const CulturalCelebrationModes: React.FC<CelebrationModeProps> = ({
  modeId,
  onModeChange,
  onVisualChange,
  onMusicChange,
  className = '',
  style = {},
}) => {
  const [currentMode, setCurrentMode] = useState<CelebrationMode | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const mode = CELEBRATION_MODES.find(m => m.id === modeId);
    if (mode) {
      setCurrentMode(mode);
      setTimeRemaining(mode.duration * 60); // Convert to seconds
      onModeChange?.(mode);
    }
  }, [modeId, onModeChange]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setIsActive(false);
    }
  }, [isActive, timeRemaining]);

  const handleStart = () => {
    setIsActive(true);
    if (currentMode) {
      onVisualChange?.(currentMode.visualTheme);
      onMusicChange?.(currentMode.musicTheme);
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeRemaining(currentMode?.duration ? currentMode.duration * 60 : 0);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!currentMode) {
    return (
      <div className={`celebration-mode-error ${className}`} style={style}>
        <p>Celebration mode not found</p>
      </div>
    );
  }

  return (
    <div className={`cultural-celebration-mode ${className}`} style={style}>
      <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.8)', color: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#ff6b35', marginBottom: '20px' }}>
          {currentMode.name}
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p>{currentMode.description}</p>
          <div style={{ fontSize: '14px', color: '#ccc' }}>
            Cultural Event: {currentMode.culturalEvent} | Duration: {currentMode.duration} min | Intensity: {currentMode.intensity}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Educational Content:</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '4px' }}>
            <h4 style={{ color: '#ff6b35', marginBottom: '10px' }}>
              {currentMode.educationalContent.title}
            </h4>
            <p style={{ marginBottom: '10px' }}>
              {currentMode.educationalContent.content}
            </p>
            <p style={{ fontSize: '14px', color: '#ccc' }}>
              <strong>Cultural Significance:</strong> {currentMode.educationalContent.culturalSignificance}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Visual Theme:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px' }}>
              <strong>Palette:</strong> {currentMode.visualTheme.paletteId}
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px' }}>
              <strong>Filter:</strong> {currentMode.visualTheme.filterId}
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px' }}>
              <strong>Effect:</strong> {currentMode.visualTheme.effectId}
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px' }}>
              <strong>Preset:</strong> {currentMode.visualTheme.presetId}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Music Theme:</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Genre:</strong> {currentMode.musicTheme.genre}</p>
            <p><strong>Artists:</strong> {currentMode.musicTheme.artists.join(', ')}</p>
            <p><strong>Songs:</strong> {currentMode.musicTheme.songs.join(', ')}</p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Interactive Elements:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {currentMode.interactiveElements.map((element, index) => (
              <div key={index} style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px' }}>
                <strong>{element.type.charAt(0).toUpperCase() + element.type.slice(1)}:</strong> {element.content.title}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Controls:</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleStart}
              disabled={isActive}
              style={{
                background: isActive ? '#666' : '#06ffa5',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: isActive ? 'not-allowed' : 'pointer',
              }}
            >
              {isActive ? 'Running...' : 'Start Celebration'}
            </button>
            
            <button
              onClick={handleStop}
              disabled={!isActive}
              style={{
                background: !isActive ? '#666' : '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: !isActive ? 'not-allowed' : 'pointer',
              }}
            >
              Stop Celebration
            </button>
            
            {isActive && (
              <div style={{ color: '#06ffa5', fontWeight: 'bold' }}>
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Status:</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isActive ? '#06ffa5' : '#666',
              }}
            />
            <span>{isActive ? 'Celebration Active' : 'Celebration Inactive'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalCelebrationModes;

// Hook for using celebration modes
export function useCelebrationMode(modeId: string) {
  const [currentMode, setCurrentMode] = useState<CelebrationMode | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const mode = CELEBRATION_MODES.find(m => m.id === modeId);
    if (mode) {
      setCurrentMode(mode);
    }
  }, [modeId]);

  const startCelebration = () => {
    setIsActive(true);
  };

  const stopCelebration = () => {
    setIsActive(false);
  };

  return {
    currentMode,
    isActive,
    startCelebration,
    stopCelebration,
    isAvailable: !!currentMode,
  };
}

// Utility function to get celebration modes by date
export function getCelebrationModesByDate(month: number, day: number): CelebrationMode[] {
  return CELEBRATION_MODES.filter(mode => 
    mode.date.month === month && mode.date.day === day
  );
}

// Utility function to get celebration modes by intensity
export function getCelebrationModesByIntensity(intensity: 'low' | 'medium' | 'high' | 'extreme'): CelebrationMode[] {
  return CELEBRATION_MODES.filter(mode => mode.intensity === intensity);
}

// Utility function to get celebration modes by cultural event
export function getCelebrationModesByEvent(event: string): CelebrationMode[] {
  return CELEBRATION_MODES.filter(mode => 
    mode.culturalEvent.toLowerCase().includes(event.toLowerCase())
  );
}
