'use client';

/**
 * EDUCATIONAL MODE - Guided Tour
 *
 * Interactive guided tour explaining liquid light physics, cultural history,
 * and system features. Educational tool for newcomers.
 *
 * Features:
 * - Step-by-step tour
 * - Interactive demonstrations
 * - Physics explanations
 * - Cultural context
 * - Skip/replay controls
 *
 * Usage:
 * ```typescript
 * <EducationalMode
 *   onComplete={() => setTourComplete(true)}
 * />
 * ```
 */

import React, { useState } from 'react';

export interface TourStep {
  title: string;
  explanation: string;
  demo: () => void;
  visual?: string; // Visual aid description
  duration?: number; // Suggested viewing time (ms)
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Liquid Light',
    explanation: 'Welcome to an authentic recreation of 1960s liquid light shows. This interactive experience honors the Joshua Light Show and Grateful Dead visual legacy using modern web technology.',
    demo: () => console.log('Welcome step'),
    visual: 'Show classic-60s palette gently flowing',
    duration: 5000,
  },
  {
    title: 'What is a Liquid Light Show?',
    explanation: 'In the 1960s, artists like Joshua White created mesmerizing visuals by projecting colored liquids and oils through overhead projectors. The fluids\' natural motion created organic, ever-changing patterns that accompanied psychedelic rock concerts.',
    demo: () => console.log('History step'),
    visual: 'Show historical context image or fluid simulation',
    duration: 8000,
  },
  {
    title: 'The Physics of Color',
    explanation: 'The iridescent colors you see come from thin-film interference - the same physics that creates rainbow patterns on soap bubbles and oil slicks. Light waves interfere constructively and destructively based on film thickness and viewing angle.',
    demo: () => console.log('Enable thin-film effect'),
    visual: 'Show thin-film interference with wavelength labels',
    duration: 10000,
  },
  {
    title: 'Wavelength and Color',
    explanation: 'Each color corresponds to a specific wavelength of light. Red is ~650 nanometers, blue is ~475nm. Our system uses scientifically accurate wavelength-to-RGB conversion, just like in real thin-film interference.',
    demo: () => console.log('Show wavelength spectrum'),
    visual: 'Display wavelength spectrum 380-750nm',
    duration: 8000,
  },
  {
    title: 'Audio Reactivity',
    explanation: 'Like the original performers, we sync visuals to music. Bass frequencies drive splat force, mids control flow rate, and treble shifts color phase. Real-time audio analysis creates a truly reactive experience.',
    demo: () => console.log('Enable audio reactivity'),
    visual: 'Show audio levels reacting to music',
    duration: 10000,
  },
  {
    title: 'Cultural Authenticity',
    explanation: 'Each color palette is inspired by specific Grateful Dead songs or historic venues. "Dark Star" for cosmic jams, "Fire on the Mountain" for high energy, "Terrapin Station" for contemplative flows. Choose palettes that match the music.',
    demo: () => console.log('Cycle through palettes'),
    visual: 'Show different palettes with cultural context',
    duration: 10000,
  },
  {
    title: 'Performance & Accessibility',
    explanation: 'The system adapts to your device - from simple gradients on basic phones to full effects on powerful desktops. Accessibility features include keyboard navigation, screen reader support, and reduced motion modes.',
    demo: () => console.log('Show tier adaptation'),
    visual: 'Demonstrate quality tiers',
    duration: 8000,
  },
  {
    title: 'Explore & Enjoy',
    explanation: 'You\'re ready to explore! Try different palettes, adjust intensity, enable trip mode for kaleidoscope effects. Most importantly: enjoy the show and honor the legacy of psychedelic visual art.',
    demo: () => console.log('End tour'),
    visual: 'Show controls overview',
    duration: 6000,
  },
];

export default function EducationalMode({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsActive(false);
      onComplete?.();
    } else {
      setCurrentStep(prev => prev + 1);
      step.demo();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    onComplete?.();
  };

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg z-50"
      >
        📚 Take the Tour
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/95 to-black/95 border border-purple-500/30 rounded-xl p-8 max-w-3xl w-full shadow-2xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-white/60 mb-2">
            <span>Step {currentStep + 1} of {TOUR_STEPS.length}</span>
            <span>{Math.round(((currentStep + 1) / TOUR_STEPS.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-white mb-4">
          {step.title}
        </h2>

        <p className="text-white/90 text-lg mb-6 leading-relaxed">
          {step.explanation}
        </p>

        {/* Visual Aid */}
        {step.visual && (
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-6 text-white/70 text-sm italic">
            💡 Visual Demo: {step.visual}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-white/60 hover:text-white transition"
          >
            Skip Tour
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              {isLastStep ? 'Finish Tour' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Check if user has completed the tour
 */
export function hasCompletedTour(): boolean {
  return localStorage.getItem('educational-tour-completed') === 'true';
}

/**
 * Mark tour as completed
 */
export function markTourCompleted(): void {
  localStorage.setItem('educational-tour-completed', 'true');
}

/**
 * Reset tour (for testing)
 */
export function resetTour(): void {
  localStorage.removeItem('educational-tour-completed');
}
