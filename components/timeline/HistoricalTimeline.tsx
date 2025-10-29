/**
 * HISTORICAL TIMELINE INTEGRATION
 * 
 * Interactive timeline component for 60s cultural history
 * Integrates with liquid light system to provide historical context
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React, { useState, useEffect, useRef } from 'react';
import { AUTHENTIC_60S_PALETTES, VINTAGE_60S_FILTERS } from '@/lib/palette/Authentic60sPalettes';
import { PERIOD_ACCURATE_EFFECTS, EFFECT_PRESETS } from '@/lib/visual/PeriodAccurateEffects';

export interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  category: 'cultural' | 'artistic' | 'musical' | 'political' | 'technological';
  significance: 'low' | 'medium' | 'high' | 'critical';
  visualElements: {
    paletteId?: string;
    filterId?: string;
    effectId?: string;
    presetId?: string;
  };
  relatedEvents: string[];
  culturalImpact: string;
  visualCharacteristics: string[];
}

export interface TimelineProps {
  startYear?: number;
  endYear?: number;
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  onEventSelect?: (event: TimelineEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  showVisualElements?: boolean;
  interactive?: boolean;
}

const HISTORICAL_EVENTS: TimelineEvent[] = [
  {
    id: 'beat-generation',
    year: 1960,
    title: 'Beat Generation Peak',
    description: 'Beat poetry and jazz culture reach their peak influence',
    category: 'cultural',
    significance: 'high',
    visualElements: {
      paletteId: 'beat-generation',
      filterId: 'beat-worn',
    },
    relatedEvents: ['jazz-clubs', 'coffee-houses'],
    culturalImpact: 'Foundation for later psychedelic movement',
    visualCharacteristics: ['Muted, earthy tones', 'Bohemian lifestyle', 'Jazz club aesthetics'],
  },
  {
    id: 'british-invasion',
    year: 1964,
    title: 'British Invasion',
    description: 'Beatles arrive in America, Mod culture explodes',
    category: 'musical',
    significance: 'critical',
    visualElements: {
      paletteId: 'mod-madness',
      filterId: 'mod-sharp',
    },
    relatedEvents: ['carnaby-street', 'mod-fashion'],
    culturalImpact: 'Youth culture revolution, fashion explosion',
    visualCharacteristics: ['Bold, geometric colors', 'Sharp contrasts', 'Carnaby Street fashion'],
  },
  {
    id: 'acid-tests',
    year: 1966,
    title: 'Acid Tests Begin',
    description: 'Ken Kesey and Merry Pranksters start Acid Test parties',
    category: 'cultural',
    significance: 'critical',
    visualElements: {
      paletteId: 'acid-test',
      filterId: 'acid-wash',
      presetId: 'acid-test-party',
    },
    relatedEvents: ['merry-pranksters', 'grateful-dead'],
    culturalImpact: 'Defined psychedelic culture and visual language',
    visualCharacteristics: ['Neon-bright colors', 'Electric intensity', 'Experimental techniques'],
  },
  {
    id: 'fillmore-west',
    year: 1966,
    title: 'Fillmore West Opens',
    description: 'Bill Graham opens Fillmore West with iconic light shows',
    category: 'artistic',
    significance: 'critical',
    visualElements: {
      paletteId: 'psychedelic-sunset',
      filterId: 'psychedelic-glow',
      presetId: 'fillmore-west',
    },
    relatedEvents: ['joshua-light-show', 'psychedelic-posters'],
    culturalImpact: 'Established psychedelic light show as art form',
    visualCharacteristics: ['Vibrant, saturated colors', 'Organic shapes', 'Electric intensity'],
  },
  {
    id: 'summer-of-love',
    year: 1967,
    title: 'Summer of Love',
    description: 'San Francisco becomes center of hippie movement',
    category: 'cultural',
    significance: 'critical',
    visualElements: {
      paletteId: 'flower-power',
      filterId: 'flower-child',
    },
    relatedEvents: ['monterey-pop', 'woodstock'],
    culturalImpact: 'Peak of hippie movement, peace and love',
    visualCharacteristics: ['Soft, pastel colors', 'Natural tones', 'Peaceful aesthetic'],
  },
  {
    id: 'monterey-pop',
    year: 1967,
    title: 'Monterey Pop Festival',
    description: 'First major rock festival with psychedelic visuals',
    category: 'musical',
    significance: 'high',
    visualElements: {
      paletteId: 'psychedelic-sunset',
      filterId: 'psychedelic-glow',
    },
    relatedEvents: ['summer-of-love', 'jimi-hendrix'],
    culturalImpact: 'Established rock festival as cultural phenomenon',
    visualCharacteristics: ['Concert visuals', 'Psychedelic lighting', 'Art installations'],
  },
  {
    id: 'joshua-light-show',
    year: 1967,
    title: 'Joshua Light Show',
    description: 'Joshua White pioneers liquid light show techniques',
    category: 'artistic',
    significance: 'high',
    visualElements: {
      paletteId: 'psychedelic-sunset',
      filterId: 'psychedelic-glow',
      presetId: 'joshua-light-show',
    },
    relatedEvents: ['fillmore-west', 'psychedelic-art'],
    culturalImpact: 'Pioneered modern light show techniques',
    visualCharacteristics: ['Slide projections', 'Morphing effects', 'Color mixing'],
  },
  {
    id: 'woodstock',
    year: 1969,
    title: 'Woodstock Festival',
    description: 'Peak of 60s counterculture with massive visual displays',
    category: 'cultural',
    significance: 'critical',
    visualElements: {
      paletteId: 'flower-power',
      filterId: 'flower-child',
    },
    relatedEvents: ['summer-of-love', 'hippie-movement'],
    culturalImpact: 'Culmination of 60s counterculture',
    visualCharacteristics: ['Peaceful colors', 'Natural aesthetics', 'Community spirit'],
  },
  {
    id: 'apollo-11',
    year: 1969,
    title: 'Apollo 11 Moon Landing',
    description: 'Space age optimism influences visual culture',
    category: 'technological',
    significance: 'high',
    visualElements: {
      paletteId: 'space-age',
      filterId: 'mod-sharp',
    },
    relatedEvents: ['space-race', 'atomic-age'],
    culturalImpact: 'Space age aesthetics influence design',
    visualCharacteristics: ['Futuristic colors', 'Atomic age aesthetics', 'Space themes'],
  },
  {
    id: 'underground-comix',
    year: 1968,
    title: 'Underground Comics',
    description: 'Robert Crumb and Zap Comix define counterculture art',
    category: 'artistic',
    significance: 'high',
    visualElements: {
      paletteId: 'underground-comix',
      filterId: 'acid-wash',
    },
    relatedEvents: ['counterculture', 'zap-comix'],
    culturalImpact: 'Alternative media and counterculture expression',
    visualCharacteristics: ['Raw, vibrant colors', 'Experimental techniques', 'Anti-establishment'],
  },
];

const HistoricalTimeline: React.FC<TimelineProps> = ({
  startYear = 1960,
  endYear = 1969,
  selectedYear,
  onYearChange,
  onEventSelect,
  className = '',
  style = {},
  showVisualElements = true,
  interactive = true,
}) => {
  const [currentYear, setCurrentYear] = useState(selectedYear || startYear);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const filteredEvents = HISTORICAL_EVENTS.filter(
    event => event.year >= startYear && event.year <= endYear
  );

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    onYearChange?.(year);
  };

  const handleEventSelect = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onEventSelect?.(event);
  };

  const getEventPosition = (event: TimelineEvent): number => {
    return ((event.year - startYear) / (endYear - startYear)) * 100;
  };

  const getYearPosition = (year: number): number => {
    return ((year - startYear) / (endYear - startYear)) * 100;
  };

  const getVisualElements = (event: TimelineEvent) => {
    if (!showVisualElements) return null;

    const { paletteId, filterId, effectId, presetId } = event.visualElements;
    const palette = paletteId ? AUTHENTIC_60S_PALETTES.find(p => p.id === paletteId) : null;
    const filter = filterId ? VINTAGE_60S_FILTERS.find(f => f.id === filterId) : null;
    const effect = effectId ? PERIOD_ACCURATE_EFFECTS.find(e => e.id === effectId) : null;
    const preset = presetId ? EFFECT_PRESETS.find(p => p.id === presetId) : null;

    return { palette, filter, effect, preset };
  };

  return (
    <div
      ref={timelineRef}
      className={`historical-timeline ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        ...style,
      }}
    >
      {/* Timeline track */}
      <div
        className="timeline-track"
        style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #ff6b35, #f7931e, #ffd23f, #06ffa5, #3b82f6, #8b5cf6)',
          transform: 'translateY(-50%)',
          borderRadius: '2px',
        }}
      />

      {/* Year markers */}
      {Array.from({ length: endYear - startYear + 1 }, (_, i) => {
        const year = startYear + i;
        const position = getYearPosition(year);
        return (
          <div
            key={year}
            className="year-marker"
            style={{
              position: 'absolute',
              left: `${position}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: year === currentYear ? '#ff6b35' : '#666',
              cursor: interactive ? 'pointer' : 'default',
            }}
            onClick={() => interactive && handleYearChange(year)}
          >
            <div
              className="year-label"
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                fontWeight: 'bold',
                color: year === currentYear ? '#ff6b35' : '#666',
              }}
            >
              {year}
            </div>
          </div>
        );
      })}

      {/* Events */}
      {filteredEvents.map((event) => {
        const position = getEventPosition(event);
        const visualElements = getVisualElements(event);
        const isSelected = selectedEvent?.id === event.id;

        return (
          <div
            key={event.id}
            className={`timeline-event ${isSelected ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left: `${position}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: isSelected ? '#ff6b35' : '#999',
              cursor: interactive ? 'pointer' : 'default',
              zIndex: 2,
            }}
            onClick={() => interactive && handleEventSelect(event)}
          >
            {/* Event tooltip */}
            <div
              className="event-tooltip"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                opacity: isSelected ? 1 : 0,
                transition: 'opacity 0.3s',
                pointerEvents: 'none',
              }}
            >
              {event.title}
            </div>

            {/* Visual elements indicator */}
            {showVisualElements && visualElements && (
              <div
                className="visual-indicator"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#06ffa5',
                  border: '2px solid white',
                }}
              />
            )}
          </div>
        );
      })}

      {/* Selected event details */}
      {selectedEvent && (
        <div
          className="event-details"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            marginTop: '20px',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#ff6b35' }}>
            {selectedEvent.title}
          </h3>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            {selectedEvent.description}
          </p>
          <div style={{ fontSize: '12px', color: '#ccc' }}>
            <div>Category: {selectedEvent.category}</div>
            <div>Significance: {selectedEvent.significance}</div>
            <div>Cultural Impact: {selectedEvent.culturalImpact}</div>
          </div>
          
          {showVisualElements && (
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Visual Elements:</h4>
              <div style={{ fontSize: '12px' }}>
                {selectedEvent.visualElements.paletteId && (
                  <div>Palette: {selectedEvent.visualElements.paletteId}</div>
                )}
                {selectedEvent.visualElements.filterId && (
                  <div>Filter: {selectedEvent.visualElements.filterId}</div>
                )}
                {selectedEvent.visualElements.effectId && (
                  <div>Effect: {selectedEvent.visualElements.effectId}</div>
                )}
                {selectedEvent.visualElements.presetId && (
                  <div>Preset: {selectedEvent.visualElements.presetId}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoricalTimeline;

// Hook for using timeline
export function useHistoricalTimeline(startYear: number = 1960, endYear: number = 1969) {
  const [currentYear, setCurrentYear] = useState(startYear);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const filteredEvents = HISTORICAL_EVENTS.filter(
    event => event.year >= startYear && event.year <= endYear
  );

  const getEventsByYear = (year: number) => {
    return filteredEvents.filter(event => event.year === year);
  };

  const getEventsByCategory = (category: TimelineEvent['category']) => {
    return filteredEvents.filter(event => event.category === category);
  };

  const getEventsBySignificance = (significance: TimelineEvent['significance']) => {
    return filteredEvents.filter(event => event.significance === significance);
  };

  return {
    currentYear,
    setCurrentYear,
    selectedEvent,
    setSelectedEvent,
    filteredEvents,
    getEventsByYear,
    getEventsByCategory,
    getEventsBySignificance,
  };
}
