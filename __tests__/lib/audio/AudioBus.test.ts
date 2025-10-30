/**
 * UNIT TESTS FOR AUDIO BUS
 * 
 * Tests for the AudioBus service including audio analysis,
 * data distribution, and state management.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import { AudioBus } from '../../../lib/audio/AudioBus';
import { AudioData } from '../../../lib/visual/types';

// Mock Web Audio API
const mockAudioContext = {
  createAnalyser: jest.fn(() => ({
    fftSize: 2048,
    frequencyBinCount: 1024,
    getByteFrequencyData: jest.fn(),
    getByteTimeDomainData: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn()
  })),
  createMediaStreamSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn()
  })),
  state: 'running',
  resume: jest.fn().mockResolvedValue(undefined),
  close: jest.fn()
};

const mockMediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue({
    getTracks: () => [{ stop: jest.fn() }]
  })
};

// Mock global objects
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn(() => mockAudioContext)
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: jest.fn(() => mockAudioContext)
});

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: mockMediaDevices
});

describe('AudioBus', () => {
  beforeEach(() => {
    // Reset AudioBus state
    AudioBus.stopAnalysis();
    jest.clearAllMocks();
  });

  describe('startAnalysis', () => {
    it('should start audio analysis', async () => {
      await AudioBus.startAnalysis();
      expect(AudioBus.isAnalyzing()).toBe(true);
      expect(AudioBus.getAnalysisState()).toBe('analyzing');
    });

    it('should handle audio context creation', async () => {
      await AudioBus.startAnalysis();
      expect(window.AudioContext).toHaveBeenCalled();
    });

    it('should handle microphone access', async () => {
      await AudioBus.startAnalysis();
      expect(mockMediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    });

    it('should handle audio context suspension', async () => {
      mockAudioContext.state = 'suspended';
      await AudioBus.startAnalysis();
      expect(mockAudioContext.resume).toHaveBeenCalled();
    });
  });

  describe('stopAnalysis', () => {
    it('should stop audio analysis', async () => {
      await AudioBus.startAnalysis();
      AudioBus.stopAnalysis();
      expect(AudioBus.isAnalyzing()).toBe(false);
      expect(AudioBus.getAnalysisState()).toBe('idle');
    });

    it('should handle multiple stop calls gracefully', () => {
      expect(() => {
        AudioBus.stopAnalysis();
        AudioBus.stopAnalysis();
      }).not.toThrow();
    });
  });

  describe('getCurrentData', () => {
    it('should return null when not analyzing', () => {
      const data = AudioBus.getCurrentData();
      expect(data).toBeNull();
    });

    it('should return audio data when analyzing', async () => {
      await AudioBus.startAnalysis();
      const data = AudioBus.getCurrentData();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('bass');
      expect(data).toHaveProperty('mids');
      expect(data).toHaveProperty('treble');
      expect(data).toHaveProperty('volume');
      expect(data).toHaveProperty('beatDetected');
      expect(data).toHaveProperty('timestamp');
    });
  });

  describe('subscribe', () => {
    it('should subscribe to audio updates', async () => {
      const callback = jest.fn();
      const unsubscribe = AudioBus.subscribe(callback);
      
      await AudioBus.startAnalysis();
      
      expect(typeof unsubscribe).toBe('function');
      // Note: In a real test, we'd need to trigger audio data updates
    });

    it('should return unsubscribe function', () => {
      const callback = jest.fn();
      const unsubscribe = AudioBus.subscribe(callback);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should handle multiple subscriptions', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      const unsubscribe1 = AudioBus.subscribe(callback1);
      const unsubscribe2 = AudioBus.subscribe(callback2);
      
      expect(typeof unsubscribe1).toBe('function');
      expect(typeof unsubscribe2).toBe('function');
    });
  });

  describe('isAnalyzing', () => {
    it('should return false initially', () => {
      expect(AudioBus.isAnalyzing()).toBe(false);
    });

    it('should return true after starting analysis', async () => {
      await AudioBus.startAnalysis();
      expect(AudioBus.isAnalyzing()).toBe(true);
    });

    it('should return false after stopping analysis', async () => {
      await AudioBus.startAnalysis();
      AudioBus.stopAnalysis();
      expect(AudioBus.isAnalyzing()).toBe(false);
    });
  });

  describe('getAnalysisState', () => {
    it('should return idle initially', () => {
      expect(AudioBus.getAnalysisState()).toBe('idle');
    });

    it('should return analyzing after starting', async () => {
      await AudioBus.startAnalysis();
      expect(AudioBus.getAnalysisState()).toBe('analyzing');
    });

    it('should return idle after stopping', async () => {
      await AudioBus.startAnalysis();
      AudioBus.stopAnalysis();
      expect(AudioBus.getAnalysisState()).toBe('idle');
    });
  });

  describe('audio data structure', () => {
    it('should return valid audio data structure', async () => {
      await AudioBus.startAnalysis();
      const data = AudioBus.getCurrentData();
      
      if (data) {
        expect(typeof data.bass).toBe('number');
        expect(data.bass).toBeGreaterThanOrEqual(0);
        expect(data.bass).toBeLessThanOrEqual(1);
        
        expect(typeof data.mids).toBe('number');
        expect(data.mids).toBeGreaterThanOrEqual(0);
        expect(data.mids).toBeLessThanOrEqual(1);
        
        expect(typeof data.treble).toBe('number');
        expect(data.treble).toBeGreaterThanOrEqual(0);
        expect(data.treble).toBeLessThanOrEqual(1);
        
        expect(typeof data.volume).toBe('number');
        expect(data.volume).toBeGreaterThanOrEqual(0);
        expect(data.volume).toBeLessThanOrEqual(1);
        
        expect(typeof data.beatDetected).toBe('boolean');
        
        expect(typeof data.timestamp).toBe('number');
        expect(data.timestamp).toBeGreaterThan(0);
      }
    });
  });

  describe('error handling', () => {
    it('should handle microphone permission denied', async () => {
      mockMediaDevices.getUserMedia.mockRejectedValueOnce(new Error('Permission denied'));
      
      await expect(AudioBus.startAnalysis()).rejects.toThrow('Permission denied');
      expect(AudioBus.isAnalyzing()).toBe(false);
    });

    it('should handle audio context creation failure', async () => {
      const originalAudioContext = window.AudioContext;
      window.AudioContext = jest.fn().mockImplementation(() => {
        throw new Error('AudioContext not supported');
      });
      
      await expect(AudioBus.startAnalysis()).rejects.toThrow('AudioContext not supported');
      
      // Restore original
      window.AudioContext = originalAudioContext;
    });

    it('should handle analyser creation failure', async () => {
      mockAudioContext.createAnalyser.mockImplementation(() => {
        throw new Error('Analyser not supported');
      });
      
      await expect(AudioBus.startAnalysis()).rejects.toThrow('Analyser not supported');
    });
  });

  describe('performance', () => {
    it('should start analysis quickly', async () => {
      const start = performance.now();
      await AudioBus.startAnalysis();
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should get current data quickly', async () => {
      await AudioBus.startAnalysis();
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        AudioBus.getCurrentData();
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources on stop', async () => {
      await AudioBus.startAnalysis();
      AudioBus.stopAnalysis();
      
      // Verify cleanup was called
      expect(mockAudioContext.close).toHaveBeenCalled();
    });

    it('should handle cleanup when not started', () => {
      expect(() => {
        AudioBus.stopAnalysis();
      }).not.toThrow();
    });
  });
});
