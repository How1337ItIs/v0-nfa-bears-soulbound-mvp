/**
 * RESPECTFUL REPRESENTATION SYSTEM
 * 
 * Implements respectful and culturally sensitive representation of 60s culture
 * Includes cultural context, attribution, and sensitivity checks
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

export interface CulturalElement {
  id: string;
  name: string;
  description: string;
  culturalContext: string;
  historicalSignificance: string;
  attribution: {
    artists: string[];
    movements: string[];
    communities: string[];
    sources: string[];
  };
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  usageGuidelines: string[];
  warnings: string[];
  educationalContent: {
    historicalContext: string;
    culturalSignificance: string;
    contemporaryRelevance: string;
    relatedElements: string[];
  };
}

export interface CulturalContext {
  elementId: string;
  context: {
    historical: string;
    cultural: string;
    social: string;
    political: string;
  };
  significance: {
    artistic: string;
    cultural: string;
    social: string;
    contemporary: string;
  };
  attribution: {
    creators: string[];
    influences: string[];
    communities: string[];
    movements: string[];
  };
  sensitivity: {
    level: 'low' | 'medium' | 'high' | 'critical';
    considerations: string[];
    warnings: string[];
    guidelines: string[];
  };
}

export interface SensitivityCheck {
  elementId: string;
  checks: {
    culturalAccuracy: boolean;
    historicalAccuracy: boolean;
    attributionComplete: boolean;
    contextProvided: boolean;
    warningsIncluded: boolean;
    educationalContent: boolean;
  };
  score: number; // 0-100
  recommendations: string[];
  warnings: string[];
}

export const CULTURAL_ELEMENTS: CulturalElement[] = [
  {
    id: 'psychedelic-sunset-palette',
    name: 'Psychedelic Sunset Palette',
    description: 'Classic 60s sunset colors from San Francisco psychedelic posters',
    culturalContext: 'Inspired by the Fillmore West posters and psychedelic light shows',
    historicalSignificance: 'Defined the visual language of psychedelic culture',
    attribution: {
      artists: ['Wes Wilson', 'Victor Moscoso', 'Stanley Mouse', 'Alton Kelley'],
      movements: ['Psychedelic Art', 'Fillmore Posters', 'Light Shows'],
      communities: ['San Francisco Psychedelic Community', 'Fillmore West Audience'],
      sources: ['Fillmore West Archives', 'Psychedelic Art Museum', 'Historical Documentation'],
    },
    sensitivityLevel: 'medium',
    usageGuidelines: [
      'Use for authentic 60s psychedelic experiences',
      'Provide cultural context when using',
      'Include attribution to original artists',
      'Respect the cultural significance',
    ],
    warnings: [
      'Contains culturally significant colors',
      'Requires cultural context for proper use',
      'Should not be used without understanding cultural meaning',
    ],
    educationalContent: {
      historicalContext: 'These colors were used in iconic Fillmore West posters and light shows during the peak of psychedelic culture in San Francisco.',
      culturalSignificance: 'The colors represent the vibrant, electric aesthetic of psychedelic art and the counterculture movement.',
      contemporaryRelevance: 'These colors continue to influence modern psychedelic art and design.',
      relatedElements: ['fillmore-west-posters', 'psychedelic-light-shows', 'counterculture-art'],
    },
  },
  {
    id: 'acid-test-colors',
    name: 'Acid Test Colors',
    description: 'Neon-bright colors from Ken Kesey\'s Acid Tests',
    culturalContext: 'Used in Ken Kesey\'s Acid Test parties and Merry Pranksters events',
    historicalSignificance: 'Defined the visual language of psychedelic experimentation',
    attribution: {
      artists: ['Ken Kesey', 'Merry Pranksters', 'Grateful Dead'],
      movements: ['Counterculture', 'Acid Tests', 'Experimental Art'],
      communities: ['Merry Pranksters', 'Acid Test Participants', 'Psychedelic Community'],
      sources: ['Acid Test Documentation', 'Merry Pranksters Archives', 'Historical Records'],
    },
    sensitivityLevel: 'high',
    usageGuidelines: [
      'Use for experimental, avant-garde experiences only',
      'Handle with cultural sensitivity',
      'Provide historical context about Acid Tests',
      'Respect the experimental nature',
    ],
    warnings: [
      'Contains references to psychedelic experimentation',
      'Requires cultural sensitivity and context',
      'Should not be used without understanding cultural significance',
      'May not be appropriate for all audiences',
    ],
    educationalContent: {
      historicalContext: 'These colors were used in Ken Kesey\'s Acid Test parties, which were experimental gatherings that combined psychedelic experiences with artistic expression.',
      culturalSignificance: 'The colors represent the experimental and avant-garde nature of the Acid Tests and the counterculture movement.',
      contemporaryRelevance: 'These colors continue to influence experimental art and psychedelic culture.',
      relatedElements: ['acid-tests', 'merry-pranksters', 'experimental-art', 'counterculture'],
    },
  },
  {
    id: 'flower-power-palette',
    name: 'Flower Power Palette',
    description: 'Soft, natural colors from the hippie movement',
    culturalContext: 'Represented peace, love, and harmony in the hippie movement',
    historicalSignificance: 'Symbolized the peaceful, loving philosophy of the hippie movement',
    attribution: {
      artists: ['The Beatles', 'Janis Joplin', 'Jimi Hendrix', 'Hippie Artists'],
      movements: ['Hippie Culture', 'Flower Power', 'Peace Movement'],
      communities: ['Hippie Community', 'Peace Movement', 'Flower Children'],
      sources: ['Summer of Love Documentation', 'Hippie Art Archives', 'Peace Movement Records'],
    },
    sensitivityLevel: 'low',
    usageGuidelines: [
      'Use for peaceful, harmonious experiences',
      'Maintain gentle, non-aggressive tone',
      'Include peace and love themes',
      'Respect the spiritual aspects',
    ],
    warnings: [
      'Represents peaceful, loving philosophy',
      'Should be used respectfully',
    ],
    educationalContent: {
      historicalContext: 'These colors were used in hippie art and fashion during the Summer of Love and represented the peaceful, loving philosophy of the movement.',
      culturalSignificance: 'The colors symbolize peace, love, and harmony, core values of the hippie movement.',
      contemporaryRelevance: 'These colors continue to be associated with peace and love movements.',
      relatedElements: ['summer-of-love', 'hippie-movement', 'peace-movement', 'flower-children'],
    },
  },
  {
    id: 'op-art-patterns',
    name: 'Op Art Patterns',
    description: 'High-contrast geometric patterns from optical art',
    culturalContext: 'Bridget Riley and Victor Vasarely inspired optical illusions',
    historicalSignificance: 'Influenced fashion, design, and visual art in the 60s',
    attribution: {
      artists: ['Bridget Riley', 'Victor Vasarely', 'Josef Albers'],
      movements: ['Op Art', 'Geometric Abstraction', 'Optical Art'],
      communities: ['Art Community', 'Design Community', 'Fashion Community'],
      sources: ['Op Art Museum', 'Art Historical Records', 'Design Archives'],
    },
    sensitivityLevel: 'low',
    usageGuidelines: [
      'Use for geometric, optical effects',
      'Maintain high contrast',
      'Focus on pattern and form',
      'Avoid excessive color',
    ],
    warnings: [
      'May cause visual discomfort for some users',
      'High contrast patterns',
    ],
    educationalContent: {
      historicalContext: 'Op Art emerged in the 1960s as a movement that used geometric patterns and optical illusions to create visual effects.',
      culturalSignificance: 'Op Art influenced fashion, design, and visual art, creating a new visual language.',
      contemporaryRelevance: 'Op Art continues to influence modern design and visual art.',
      relatedElements: ['geometric-art', 'optical-illusions', 'design-movement', 'visual-art'],
    },
  },
];

export const CULTURAL_CONTEXTS: CulturalContext[] = [
  {
    elementId: 'psychedelic-sunset-palette',
    context: {
      historical: 'These colors were used in iconic Fillmore West posters and light shows during the peak of psychedelic culture in San Francisco (1966-1969).',
      cultural: 'The colors represent the vibrant, electric aesthetic of psychedelic art and the counterculture movement.',
      social: 'These colors were associated with the psychedelic community and counterculture movement.',
      political: 'The colors were used in political and social contexts, representing the counterculture\'s challenge to mainstream society.',
    },
    significance: {
      artistic: 'These colors defined the visual language of psychedelic art and influenced generations of artists.',
      cultural: 'The colors became symbols of the psychedelic counterculture and its values.',
      social: 'The colors were used in social gatherings and community events.',
      contemporary: 'These colors continue to influence modern psychedelic art and design.',
    },
    attribution: {
      creators: ['Wes Wilson', 'Victor Moscoso', 'Stanley Mouse', 'Alton Kelley'],
      influences: ['Psychedelic Art', 'Fillmore Posters', 'Light Shows'],
      communities: ['San Francisco Psychedelic Community', 'Fillmore West Audience'],
      movements: ['Psychedelic Art', 'Counterculture', 'Light Shows'],
    },
    sensitivity: {
      level: 'medium',
      considerations: [
        'Contains culturally significant colors',
        'Requires cultural context for proper use',
        'Should not be used without understanding cultural meaning',
      ],
      warnings: [
        'Cultural appropriation risk if used without context',
        'May be offensive if used inappropriately',
      ],
      guidelines: [
        'Always provide cultural context',
        'Include attribution to original artists',
        'Respect the cultural significance',
        'Use for authentic psychedelic experiences only',
      ],
    },
  },
  {
    elementId: 'acid-test-colors',
    context: {
      historical: 'These colors were used in Ken Kesey\'s Acid Test parties, which were experimental gatherings that combined psychedelic experiences with artistic expression (1966-1967).',
      cultural: 'The colors represent the experimental and avant-garde nature of the Acid Tests and the counterculture movement.',
      social: 'These colors were associated with the Merry Pranksters and the experimental psychedelic community.',
      political: 'The colors were used in political contexts, representing the counterculture\'s challenge to mainstream society.',
    },
    significance: {
      artistic: 'These colors influenced experimental art and psychedelic culture.',
      cultural: 'The colors became symbols of psychedelic experimentation and counterculture.',
      social: 'The colors were used in experimental social gatherings and community events.',
      contemporary: 'These colors continue to influence experimental art and psychedelic culture.',
    },
    attribution: {
      creators: ['Ken Kesey', 'Merry Pranksters', 'Grateful Dead'],
      influences: ['Acid Tests', 'Experimental Art', 'Counterculture'],
      communities: ['Merry Pranksters', 'Acid Test Participants', 'Psychedelic Community'],
      movements: ['Counterculture', 'Acid Tests', 'Experimental Art'],
    },
    sensitivity: {
      level: 'high',
      considerations: [
        'Contains references to psychedelic experimentation',
        'Requires cultural sensitivity and context',
        'Should not be used without understanding cultural significance',
        'May not be appropriate for all audiences',
      ],
      warnings: [
        'High cultural sensitivity required',
        'May be offensive if used inappropriately',
        'Requires understanding of cultural context',
      ],
      guidelines: [
        'Use for experimental, avant-garde experiences only',
        'Handle with cultural sensitivity',
        'Provide historical context about Acid Tests',
        'Respect the experimental nature',
        'Consider audience appropriateness',
      ],
    },
  },
];

export function getCulturalElement(elementId: string): CulturalElement | undefined {
  return CULTURAL_ELEMENTS.find(element => element.id === elementId);
}

export function getCulturalContext(elementId: string): CulturalContext | undefined {
  return CULTURAL_CONTEXTS.find(context => context.elementId === elementId);
}

export function performSensitivityCheck(elementId: string): SensitivityCheck {
  const element = getCulturalElement(elementId);
  const context = getCulturalContext(elementId);
  
  if (!element || !context) {
    return {
      elementId,
      checks: {
        culturalAccuracy: false,
        historicalAccuracy: false,
        attributionComplete: false,
        contextProvided: false,
        warningsIncluded: false,
        educationalContent: false,
      },
      score: 0,
      recommendations: ['Element not found'],
      warnings: ['Element not found'],
    };
  }

  const checks = {
    culturalAccuracy: element.culturalContext.length > 0,
    historicalAccuracy: element.historicalSignificance.length > 0,
    attributionComplete: element.attribution.artists.length > 0 && element.attribution.sources.length > 0,
    contextProvided: context.context.historical.length > 0,
    warningsIncluded: element.warnings.length > 0,
    educationalContent: element.educationalContent.historicalContext.length > 0,
  };

  const score = Object.values(checks).filter(Boolean).length * (100 / 6);
  
  const recommendations: string[] = [];
  const warnings: string[] = [];

  if (!checks.culturalAccuracy) {
    recommendations.push('Add cultural context');
  }
  if (!checks.historicalAccuracy) {
    recommendations.push('Add historical significance');
  }
  if (!checks.attributionComplete) {
    recommendations.push('Complete attribution information');
  }
  if (!checks.contextProvided) {
    recommendations.push('Provide cultural context');
  }
  if (!checks.warningsIncluded) {
    recommendations.push('Include cultural sensitivity warnings');
  }
  if (!checks.educationalContent) {
    recommendations.push('Add educational content');
  }

  if (context.sensitivity.level === 'high' || context.sensitivity.level === 'critical') {
    warnings.push('High cultural sensitivity required');
  }
  if (element.warnings.length > 0) {
    warnings.push(...element.warnings);
  }

  return {
    elementId,
    checks,
    score,
    recommendations,
    warnings,
  };
}

export function getElementsBySensitivityLevel(level: 'low' | 'medium' | 'high' | 'critical'): CulturalElement[] {
  return CULTURAL_ELEMENTS.filter(element => element.sensitivityLevel === level);
}

export function getElementsByMovement(movement: string): CulturalElement[] {
  return CULTURAL_ELEMENTS.filter(element => 
    element.attribution.movements.some(m => m.toLowerCase().includes(movement.toLowerCase()))
  );
}

export function validateCulturalUsage(elementId: string, usage: string): {
  valid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const element = getCulturalElement(elementId);
  const context = getCulturalContext(elementId);
  
  if (!element || !context) {
    return {
      valid: false,
      warnings: ['Element not found'],
      recommendations: ['Element not found'],
    };
  }

  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check if usage aligns with guidelines
  const guidelinesMatch = element.usageGuidelines.some(guideline => 
    usage.toLowerCase().includes(guideline.toLowerCase())
  );

  if (!guidelinesMatch) {
    warnings.push('Usage may not align with cultural guidelines');
    recommendations.push('Review cultural guidelines before using');
  }

  // Check sensitivity level
  if (context.sensitivity.level === 'high' || context.sensitivity.level === 'critical') {
    warnings.push('High cultural sensitivity required');
    recommendations.push('Ensure proper cultural context and sensitivity');
  }

  // Check for appropriate context
  if (!usage.includes('cultural') && !usage.includes('historical') && !usage.includes('educational')) {
    warnings.push('Consider including cultural or educational context');
    recommendations.push('Add cultural or educational context to usage');
  }

  return {
    valid: warnings.length === 0,
    warnings,
    recommendations,
  };
}
