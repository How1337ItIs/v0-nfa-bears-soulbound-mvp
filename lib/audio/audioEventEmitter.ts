/**
 * AUDIO EVENT EMITTER - Decoupled audio event system
 *
 * Event-driven architecture for audio milestones.
 * Allows visual components to react to audio events without direct coupling.
 *
 * Events:
 * - beat: Regular beat detected
 * - onset: Sudden transient/attack detected
 * - drop: Major energy drop (build-up release)
 * - buildup: Gradual energy increase
 * - silence: Extended silence period
 * - tempo-change: Tempo shifted significantly
 *
 * Usage:
 * ```typescript
 * const audioEvents = new AudioEventEmitter();
 *
 * audioEvents.on('beat', (data) => {
 *   triggerBeatAnimation(data.confidence);
 * });
 *
 * audioEvents.on('drop', () => {
 *   explosionEffect();
 * });
 *
 * // In audio analysis loop
 * if (beatDetected) {
 *   audioEvents.emit('beat', { confidence: 0.9, bpm: 120 });
 * }
 * ```
 */

type AudioEventType = 'beat' | 'onset' | 'drop' | 'buildup' | 'silence' | 'tempo-change';

type EventHandler<T = any> = (data: T) => void;

export interface BeatEventData {
  confidence: number; // 0-1
  bpm: number; // Estimated BPM
  timestamp: number;
}

export interface OnsetEventData {
  strength: number; // 0-1
  timestamp: number;
}

export interface DropEventData {
  energyBefore: number;
  energyAfter: number;
  magnitude: number; // How big the drop
  timestamp: number;
}

export interface BuildupEventData {
  startEnergy: number;
  currentEnergy: number;
  duration: number; // ms
  timestamp: number;
}

export interface SilenceEventData {
  duration: number; // ms of silence
  timestamp: number;
}

export interface TempoChangeEventData {
  oldBPM: number;
  newBPM: number;
  change: number; // BPM delta
  timestamp: number;
}

export class AudioEventEmitter {
  private listeners: Map<AudioEventType, Set<EventHandler>> = new Map();
  private eventHistory: Array<{ type: AudioEventType; data: any; timestamp: number }> = [];
  private maxHistorySize = 100;

  /**
   * Register event listener
   * @param event - Event type to listen for
   * @param handler - Callback function
   */
  on(event: AudioEventType, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(handler);
  }

  /**
   * Unregister event listener
   * @param event - Event type
   * @param handler - Callback function to remove
   */
  off(event: AudioEventType, handler: EventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit an event
   * @param event - Event type
   * @param data - Event data
   */
  emit(event: AudioEventType, data: any): void {
    // Record in history
    this.eventHistory.push({ type: event, data, timestamp: Date.now() });

    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify listeners
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (error) {
          console.error(`[AudioEventEmitter] Error in ${event} handler:`, error);
        }
      }
    }
  }

  /**
   * Emit beat event
   * @param data - Beat data
   */
  emitBeat(data: BeatEventData): void {
    this.emit('beat', data);
  }

  /**
   * Emit onset event
   * @param data - Onset data
   */
  emitOnset(data: OnsetEventData): void {
    this.emit('onset', data);
  }

  /**
   * Emit drop event (energy drop)
   * @param data - Drop data
   */
  emitDrop(data: DropEventData): void {
    this.emit('drop', data);
  }

  /**
   * Emit buildup event (energy increase)
   * @param data - Buildup data
   */
  emitBuildup(data: BuildupEventData): void {
    this.emit('buildup', data);
  }

  /**
   * Emit silence event
   * @param data - Silence data
   */
  emitSilence(data: SilenceEventData): void {
    this.emit('silence', data);
  }

  /**
   * Emit tempo change event
   * @param data - Tempo change data
   */
  emitTempoChange(data: TempoChangeEventData): void {
    this.emit('tempo-change', data);
  }

  /**
   * Get event history
   * @param eventType - Filter by event type (optional)
   * @param limit - Maximum events to return (default: 20)
   * @returns Event history
   */
  getHistory(eventType?: AudioEventType, limit: number = 20): any[] {
    let history = [...this.eventHistory];

    if (eventType) {
      history = history.filter(e => e.type === eventType);
    }

    return history.slice(-limit);
  }

  /**
   * Get event count by type
   * @param eventType - Event type
   * @returns Count of events in history
   */
  getEventCount(eventType: AudioEventType): number {
    return this.eventHistory.filter(e => e.type === eventType).length;
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  /**
   * Get statistics
   */
  getStats() {
    const eventCounts: Partial<Record<AudioEventType, number>> = {};

    for (const type of ['beat', 'onset', 'drop', 'buildup', 'silence', 'tempo-change'] as AudioEventType[]) {
      eventCounts[type] = this.getEventCount(type);
    }

    return {
      totalEvents: this.eventHistory.length,
      eventCounts,
      listenerCounts: Object.fromEntries(
        Array.from(this.listeners.entries()).map(([type, handlers]) => [type, handlers.size])
      ),
    };
  }
}

/**
 * Global audio event emitter instance
 * Singleton for application-wide audio events
 */
export const globalAudioEvents = new AudioEventEmitter();

/**
 * React hook for audio events
 * @param event - Event type to listen for
 * @param handler - Callback function
 */
export function useAudioEvent(event: AudioEventType, handler: EventHandler): void {
  if (typeof window === 'undefined') return;

  React.useEffect(() => {
    globalAudioEvents.on(event, handler);

    return () => {
      globalAudioEvents.off(event, handler);
    };
  }, [event, handler]);
}

// TypeScript declaration for React
declare const React: any;
