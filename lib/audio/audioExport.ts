/**
 * @file audioExport.ts
 * @description Audio export and recording capabilities
 */

export interface AudioExportConfig {
  // Export format
  format: 'wav' | 'mp3' | 'ogg';
  // Sample rate (Hz)
  sampleRate: number;
  // Bit depth
  bitDepth: 16 | 24 | 32;
  // Channels
  channels: 1 | 2;
  // Quality (0-1)
  quality: number;
}

export interface RecordingSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  data: Float32Array[];
  config: AudioExportConfig;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private recordingData: Float32Array[] = [];
  private isRecording: boolean = false;
  private config: Required<AudioExportConfig>;

  constructor(config: Partial<AudioExportConfig> = {}) {
    this.config = {
      format: config.format ?? 'wav',
      sampleRate: config.sampleRate ?? 44100,
      bitDepth: config.bitDepth ?? 16,
      channels: config.channels ?? 2,
      quality: config.quality ?? 0.8,
    };
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate,
      });

      // Create source node
      this.sourceNode = this.audioContext.createMediaStreamSource(stream);

      // Create processor node for data capture
      this.processorNode = this.audioContext.createScriptProcessor(4096, this.config.channels, this.config.channels);

      // Process audio data
      this.processorNode.onaudioprocess = (event) => {
        if (!this.isRecording) return;

        const inputBuffer = event.inputBuffer;
        const channelData = inputBuffer.getChannelData(0);
        
        // Store audio data
        this.recordingData.push(new Float32Array(channelData));
      };

      // Connect nodes
      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.isRecording = true;
      this.recordingData = [];

    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  /**
   * Stop recording and return session
   */
  stopRecording(): RecordingSession {
    if (!this.isRecording) {
      throw new Error('Not recording');
    }

    this.isRecording = false;

    // Disconnect nodes
    if (this.sourceNode && this.processorNode) {
      this.sourceNode.disconnect();
      this.processorNode.disconnect();
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
    }

    const session: RecordingSession = {
      id: `recording_${Date.now()}`,
      startTime: performance.now(),
      endTime: performance.now(),
      duration: 0, // Will be calculated
      data: [...this.recordingData],
      config: this.config,
    };

    return session;
  }

  /**
   * Export recording to file
   */
  async exportRecording(session: RecordingSession): Promise<Blob> {
    const { data, config } = session;

    if (data.length === 0) {
      throw new Error('No audio data to export');
    }

    // Convert to WAV format
    const wavBlob = this.createWAVBlob(data, config);
    return wavBlob;
  }

  /**
   * Create WAV file blob from audio data
   */
  private createWAVBlob(audioData: Float32Array[], config: AudioExportConfig): Blob {
    const sampleRate = config.sampleRate;
    const channels = config.channels;
    const bitDepth = config.bitDepth;
    
    // Calculate total length
    const totalLength = audioData.reduce((sum, chunk) => sum + chunk.length, 0);
    const bytesPerSample = bitDepth / 8;
    const dataLength = totalLength * channels * bytesPerSample;
    const bufferLength = 44 + dataLength;

    // Create buffer
    const buffer = new ArrayBuffer(bufferLength);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // RIFF header
    writeString(0, 'RIFF');
    view.setUint32(4, bufferLength - 8, true);
    writeString(8, 'WAVE');

    // Format chunk
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // Chunk size
    view.setUint16(20, 1, true); // Audio format (PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * bytesPerSample, true);
    view.setUint16(32, channels * bytesPerSample, true);
    view.setUint16(34, bitDepth, true);

    // Data chunk
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    // Write audio data
    let offset = 44;
    for (const chunk of audioData) {
      for (let i = 0; i < chunk.length; i++) {
        const sample = Math.max(-1, Math.min(1, chunk[i]));
        const intSample = Math.round(sample * (Math.pow(2, bitDepth - 1) - 1));
        
        if (bitDepth === 16) {
          view.setInt16(offset, intSample, true);
          offset += 2;
        } else if (bitDepth === 24) {
          view.setInt8(offset, intSample & 0xFF);
          view.setInt8(offset + 1, (intSample >> 8) & 0xFF);
          view.setInt8(offset + 2, (intSample >> 16) & 0xFF);
          offset += 3;
        } else if (bitDepth === 32) {
          view.setInt32(offset, intSample, true);
          offset += 4;
        }
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  /**
   * Download recording as file
   */
  async downloadRecording(session: RecordingSession, filename?: string): Promise<void> {
    const blob = await this.exportRecording(session);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `recording_${session.id}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Get recording status
   */
  getStatus() {
    return {
      isRecording: this.isRecording,
      dataLength: this.recordingData.length,
      config: this.config,
    };
  }
}

/**
 * Audio export utilities
 */
export class AudioExporter {
  /**
   * Export current audio visualization as image
   */
  static exportVisualization(canvas: HTMLCanvasElement, filename?: string): void {
    const link = document.createElement('a');
    link.download = filename || `visualization_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export audio data as JSON
   */
  static exportAudioData(audioData: any[], filename?: string): void {
    const json = JSON.stringify(audioData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `audio_data_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}
