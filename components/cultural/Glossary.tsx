'use client';

/**
 * DEADHEAD TERMINOLOGY GLOSSARY
 *
 * Interactive glossary of Grateful Dead and liquid light show terminology.
 * Educational component for newcomers to the culture.
 *
 * Features:
 * - Alphabetically organized terms
 * - Search functionality
 * - Category filtering
 * - Expandable definitions
 *
 * Usage:
 * ```typescript
 * <Glossary />
 * ```
 */

import React, { useState } from 'react';

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'music' | 'culture' | 'venue' | 'visual' | 'technical';
  relatedTerms?: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Dark Star',
    definition: 'Signature Grateful Dead jam song, known for extended improvisational journeys into cosmic, space-rock territory. Often exceeding 20 minutes, "Dark Star" became a vehicle for the band\'s most experimental work.',
    category: 'music',
    relatedTerms: ['Terrapin Station', 'Playing in the Band'],
  },
  {
    term: 'Fire on the Mountain',
    definition: 'High-energy Grateful Dead song typically paired with "Scarlet Begonias." Known for its driving rhythm and extended jams. Written by Robert Hunter and Mickey Hart.',
    category: 'music',
    relatedTerms: ['Scarlet Begonias', 'Scarlet > Fire'],
  },
  {
    term: 'Joshua Light Show',
    definition: 'Pioneering liquid light show collective founded by Joshua White in 1967. Became the house light show at the Fillmore East, revolutionizing concert visuals with overhead projectors, slides, and organic liquids.',
    category: 'visual',
    relatedTerms: ['Fillmore East', 'Liquid Light Show'],
  },
  {
    term: 'Liquid Light Show',
    definition: 'Psychedelic visual art form using overhead projectors, colored liquids, oils, and slides to create organic, flowing patterns. Popular in 1960s concerts. Colors created through thin-film interference and hand-manipulated fluids.',
    category: 'visual',
    relatedTerms: ['Joshua Light Show', 'Thin-Film Interference'],
  },
  {
    term: 'Thin-Film Interference',
    definition: 'Optical phenomenon where light waves reflecting off thin layers (like oil on water) create iridescent colors. The physics behind liquid light show colors. Wavelength-dependent interference creates the characteristic rainbow shimmer.',
    category: 'technical',
    relatedTerms: ['Wavelength', 'Iridescence'],
  },
  {
    term: 'Fillmore East',
    definition: 'Legendary New York City concert venue (1968-1971) operated by Bill Graham. Home to the Joshua Light Show. Capacity 2,700. Site of countless iconic performances by Grateful Dead, Allman Brothers, and others.',
    category: 'venue',
    relatedTerms: ['Joshua Light Show', 'Bill Graham', 'Winterland'],
  },
  {
    term: 'Winterland',
    definition: 'San Francisco concert venue (1966-1978) operated by Bill Graham. Former ice rink. 5,400 capacity. Site of Grateful Dead\'s final show on New Year\'s Eve 1978. Also hosted The Band\'s "Last Waltz."',
    category: 'venue',
    relatedTerms: ['Fillmore East', 'Bill Graham'],
  },
  {
    term: 'Deadhead',
    definition: 'Devoted fan of the Grateful Dead. Known for following the band on tour, trading tapes, and fostering a unique communal culture. The Deadhead community continues decades after Jerry Garcia\'s passing.',
    category: 'culture',
    relatedTerms: ['Tape Trading', 'Tour'],
  },
  {
    term: 'Terrapin Station',
    definition: 'Epic Grateful Dead suite from 1977. Multi-movement composition with literary influences. Known for contemplative, storytelling quality and beautiful melodic themes. Often featured extended improvisational sections.',
    category: 'music',
    relatedTerms: ['Estimated Prophet', 'Dark Star'],
  },
  {
    term: 'China Cat Sunflower',
    definition: 'Upbeat Grateful Dead song typically segueing into "I Know You Rider." Written by Robert Hunter and Jerry Garcia. Known for its playful, sunny energy and intricate lyrics.',
    category: 'music',
    relatedTerms: ['I Know You Rider', 'China > Rider'],
  },
  {
    term: 'Scarlet Begonias',
    definition: 'Popular Grateful Dead song often paired with "Fire on the Mountain" in the classic "Scarlet > Fire" combination. Mid-tempo groover known for vibrant energy and extended jams.',
    category: 'music',
    relatedTerms: ['Fire on the Mountain', 'Scarlet > Fire'],
  },
  {
    term: 'Tape Trading',
    definition: 'Grateful Dead tradition of fans recording and freely sharing concert tapes. The band encouraged recording, creating a vast archive of live performances. Predated internet file-sharing by decades.',
    category: 'culture',
    relatedTerms: ['Deadhead', 'Archive.org'],
  },
  {
    term: 'Bill Graham',
    definition: 'Legendary rock concert promoter who operated the Fillmore East, Fillmore West, and Winterland. Champion of the San Francisco sound and advocate for artists. Known for New Year\'s Eve spectaculars.',
    category: 'culture',
    relatedTerms: ['Fillmore East', 'Winterland'],
  },
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  // Filter terms
  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (term: string) => {
    const newExpanded = new Set(expandedTerms);
    if (newExpanded.has(term)) {
      newExpanded.delete(term);
    } else {
      newExpanded.add(term);
    }
    setExpandedTerms(newExpanded);
  };

  return (
    <div className="glossary max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Glossary</h1>
      <p className="text-white/70 mb-6">
        Learn the terminology of the Grateful Dead and liquid light show culture
      </p>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
          aria-label="Search glossary terms"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="music">Music</option>
          <option value="culture">Culture</option>
          <option value="venue">Venues</option>
          <option value="visual">Visual Arts</option>
          <option value="technical">Technical</option>
        </select>
      </div>

      {/* Glossary Terms */}
      <div className="space-y-3">
        {filteredTerms.map(term => {
          const isExpanded = expandedTerms.has(term.term);

          return (
            <div
              key={term.term}
              className="bg-black/40 border border-white/10 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(term.term)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition"
                aria-expanded={isExpanded}
                aria-controls={`definition-${term.term}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-white">
                    {term.term}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded">
                    {term.category}
                  </span>
                </div>
                <span className="text-white/60 text-xl">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {isExpanded && (
                <div
                  id={`definition-${term.term}`}
                  className="px-4 pb-4"
                >
                  <p className="text-white/80 mb-3">
                    {term.definition}
                  </p>

                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-xs text-white/50">Related: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {term.relatedTerms.map(related => (
                          <button
                            key={related}
                            onClick={() => toggleExpand(related)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 text-xs rounded transition"
                          >
                            {related}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredTerms.length === 0 && (
          <div className="text-center py-12 text-white/60">
            No terms found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 pt-4 border-t border-white/10 text-sm text-white/60 text-center">
        Showing {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
      </div>
    </div>
  );
}

/**
 * Get term definition
 * @param termName - Term to look up
 * @returns Definition or null
 */
export function getGlossaryTerm(termName: string): GlossaryTerm | null {
  return GLOSSARY_TERMS.find(t => t.term.toLowerCase() === termName.toLowerCase()) || null;
}

/**
 * Inline glossary tooltip
 */
export function GlossaryTooltip({ term }: { term: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const glossaryTerm = getGlossaryTerm(term);

  if (!glossaryTerm) return <span>{term}</span>;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="underline decoration-dotted decoration-purple-400 cursor-help">
        {term}
      </span>

      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-purple-500/50 rounded text-xs w-64 z-50">
          {glossaryTerm.definition}
        </span>
      )}
    </span>
  );
}
