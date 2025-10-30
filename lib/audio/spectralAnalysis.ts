/**
 * SPECTRAL ANALYSIS UTILITIES
 *
 * Advanced audio analysis beyond basic frequency bands.
 * Provides spectral centroid, rolloff, flux, and harmonic analysis.
 *
 * Features:
 * - Spectral centroid (brightness measure)
 * - Spectral rolloff (frequency cutoff)
 * - Spectral flux (change rate)
 * - Harmonic vs percussive content
 *
 * Usage:
 * ```typescript
 * const centroid = calculateSpectralCentroid(fftData);
 * // High centroid = bright, treble-heavy
 * // Low centroid = dark, bass-heavy
 *
 * // Map to color temperature
 * const colorTemp = mapCentroidToTemperature(centroid);
 * ```
 */

/**
 * Calculate spectral centroid (center of mass of spectrum)
 * Indicates "brightness" of sound
 *
 * @param fftData - FFT magnitude data
 * @param sampleRate - Audio sample rate (default: 44100)
 * @returns Centroid frequency in Hz
 */
export function calculateSpectralCentroid(
  fftData: Float32Array,
  sampleRate: number = 44100
): number {
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < fftData.length; i++) {
    const magnitude = fftData[i];
    const frequency = (i * sampleRate) / (fftData.length * 2);

    numerator += frequency * magnitude;
    denominator += magnitude;
  }

  return denominator > 0 ? numerator / denominator : 0;
}

/**
 * Calculate spectral rolloff (frequency below which 85% of energy lies)
 *
 * @param fftData - FFT magnitude data
 * @param sampleRate - Audio sample rate
 * @param threshold - Energy threshold (default: 0.85)
 * @returns Rolloff frequency in Hz
 */
export function calculateSpectralRolloff(
  fftData: Float32Array,
  sampleRate: number = 44100,
  threshold: number = 0.85
): number {
  // Calculate total energy
  let totalEnergy = 0;
  for (let i = 0; i < fftData.length; i++) {
    totalEnergy += fftData[i] * fftData[i];
  }

  const targetEnergy = totalEnergy * threshold;

  // Find frequency where cumulative energy reaches threshold
  let cumulativeEnergy = 0;
  for (let i = 0; i < fftData.length; i++) {
    cumulativeEnergy += fftData[i] * fftData[i];

    if (cumulativeEnergy >= targetEnergy) {
      return (i * sampleRate) / (fftData.length * 2);
    }
  }

  return sampleRate / 2; // Nyquist frequency
}

/**
 * Calculate spectral flux (rate of change in spectrum)
 * High flux = rapid changes (drums, attacks)
 * Low flux = steady state (sustained tones)
 *
 * @param currentFFT - Current FFT data
 * @param previousFFT - Previous FFT data
 * @returns Flux value (0+)
 */
export function calculateSpectralFlux(
  currentFFT: Float32Array,
  previousFFT: Float32Array
): number {
  if (currentFFT.length !== previousFFT.length) {
    throw new Error('FFT arrays must be same length');
  }

  let flux = 0;

  for (let i = 0; i < currentFFT.length; i++) {
    const diff = currentFFT[i] - previousFFT[i];
    // Only positive differences (energy increases)
    if (diff > 0) {
      flux += diff * diff;
    }
  }

  return Math.sqrt(flux);
}

/**
 * Analyze harmonic vs percussive content
 *
 * @param fftData - FFT magnitude data
 * @returns Harmonic and percussive energy levels (0-1)
 */
export function analyzeHarmonicContent(fftData: Float32Array): {
  harmonic: number;
  percussive: number;
} {
  // Simplified Harmonic-Percussive Separation (HPS)
  let harmonicEnergy = 0;
  let percussiveEnergy = 0;

  const lowFreqCutoff = Math.floor(fftData.length * 0.3);
  const highFreqCutoff = Math.floor(fftData.length * 0.5);

  // Low frequencies with sustained energy = harmonic
  for (let i = 0; i < lowFreqCutoff; i++) {
    const magnitude = fftData[i];
    if (magnitude > 0.5) {
      harmonicEnergy += magnitude;
    }
  }

  // High frequencies with sharp peaks = percussive
  for (let i = highFreqCutoff; i < fftData.length; i++) {
    const magnitude = fftData[i];
    if (magnitude > 0.7) {
      percussiveEnergy += magnitude;
    }
  }

  // Normalize
  const harmonicNorm = harmonicEnergy / lowFreqCutoff;
  const percussiveNorm = percussiveEnergy / (fftData.length - highFreqCutoff);

  return {
    harmonic: Math.min(1, harmonicNorm),
    percussive: Math.min(1, percussiveNorm),
  };
}

/**
 * Map spectral centroid to color temperature
 *
 * @param centroid - Centroid frequency in Hz
 * @returns Color temperature multiplier (0-1, 0=cool, 1=warm)
 */
export function mapCentroidToTemperature(centroid: number): number {
  // Low centroid (< 1000 Hz) = cool colors (blue, cyan)
  // High centroid (> 5000 Hz) = warm colors (orange, red)

  const minCentroid = 500;
  const maxCentroid = 8000;

  const normalized = (centroid - minCentroid) / (maxCentroid - minCentroid);
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Spectral Analyzer - Maintains spectral analysis state over time
 */
export class SpectralAnalyzer {
  private previousFFT: Float32Array | null = null;
  private centroidHistory: number[] = [];
  private fluxHistory: number[] = [];
  private historySize = 60; // 1 second at 60fps

  /**
   * Analyze FFT data
   * @param fftData - Current FFT magnitude data
   * @param sampleRate - Audio sample rate
   * @returns Analysis results
   */
  analyze(fftData: Float32Array, sampleRate: number = 44100) {
    const centroid = calculateSpectralCentroid(fftData, sampleRate);
    const rolloff = calculateSpectralRolloff(fftData, sampleRate);
    const harmonic = analyzeHarmonicContent(fftData);

    // Calculate flux if we have previous data
    let flux = 0;
    if (this.previousFFT && this.previousFFT.length === fftData.length) {
      flux = calculateSpectralFlux(fftData, this.previousFFT);
    }

    // Update history
    this.centroidHistory.push(centroid);
    this.fluxHistory.push(flux);

    if (this.centroidHistory.length > this.historySize) {
      this.centroidHistory.shift();
      this.fluxHistory.shift();
    }

    // Store for next frame
    this.previousFFT = new Float32Array(fftData);

    return {
      centroid,
      rolloff,
      flux,
      harmonic: harmonic.harmonic,
      percussive: harmonic.percussive,
      colorTemperature: mapCentroidToTemperature(centroid),
    };
  }

  /**
   * Get average centroid over history
   */
  getAverageCentroid(): number {
    if (this.centroidHistory.length === 0) return 0;
    return this.centroidHistory.reduce((a, b) => a + b) / this.centroidHistory.length;
  }

  /**
   * Get average flux over history
   */
  getAverageFlux(): number {
    if (this.fluxHistory.length === 0) return 0;
    return this.fluxHistory.reduce((a, b) => a + b) / this.fluxHistory.length;
  }

  /**
   * Reset analyzer state
   */
  reset(): void {
    this.previousFFT = null;
    this.centroidHistory = [];
    this.fluxHistory = [];
  }
}
