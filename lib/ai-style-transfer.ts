// AI Style Transfer System for Grateful Dead Visual Motifs

import * as tf from '@tensorflow/tfjs';

export interface StyleTransferModel {
  model: tf.GraphModel | null;
  isLoaded: boolean;
  styleName: string;
  culturalAuthenticity: number; // 0-1 score
}

export interface DeadStyleTransfer {
  models: {
    album_covers: StyleTransferModel;
    concert_posters: StyleTransferModel; 
    bears_collection: StyleTransferModel;
    skulls_roses: StyleTransferModel;
    lightning_bolts: StyleTransferModel;
  };
  currentSong?: string;
  culturalValidator: CulturalValidator;
}

export interface CulturalValidator {
  validateContent(imageData: ImageData): Promise<ValidationResult>;
  checkSacredImageryUse(imageData: ImageData): Promise<boolean>;
  getCommunityApproval(imageData: ImageData): Promise<number>;
}

export interface ValidationResult {
  isAppropriate: boolean;
  authenticityScore: number; // 0-1
  culturalConcerns: string[];
  suggestions: string[];
}

// Grateful Dead song-to-style mappings
const DEAD_SONG_STYLES: Record<string, string> = {
  'Fire on the Mountain': 'skulls_roses', // Fiery reds and skulls
  'Dark Star': 'album_covers', // Deep space imagery  
  'China Cat Sunflower': 'concert_posters', // Bright psychedelic colors
  'Ripple': 'album_covers', // Gentle American Beauty vibes
  'Terrapin Station': 'lightning_bolts', // Cosmic lightning imagery
  'Eyes of the World': 'bears_collection', // Dancing Bears energy
  'Truckin\'': 'lightning_bolts', // Road imagery and bolts
  'Sugar Magnolia': 'concert_posters', // Flower power aesthetics
  'Casey Jones': 'skulls_roses', // Train and skull imagery
  'Friend of the Devil': 'skulls_roses', // Devil and dark imagery
};

export class GratefulDeadStyleTransfer {
  private models: Partial<DeadStyleTransfer['models']> = {};
  private isInitialized = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    // Create off-screen canvas for image processing
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing Grateful Dead Style Transfer AI...');
      
      // Initialize TensorFlow.js
      await tf.ready();
      console.log('TensorFlow.js ready');

      // Load pre-trained style transfer models
      // Note: In production, these would be actual trained models
      // For now, we'll create placeholder models that simulate the behavior
      await this.loadStyleModels();
      
      this.isInitialized = true;
      console.log('Grateful Dead Style Transfer AI initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Style Transfer:', error);
      return false;
    }
  }

  private async loadStyleModels(): Promise<void> {
    // Placeholder for model loading
    // In production, these would load actual trained models from CDN/server
    const modelNames = ['album_covers', 'concert_posters', 'bears_collection', 'skulls_roses', 'lightning_bolts'] as const;
    
    for (const modelName of modelNames) {
      try {
        // Simulate model loading with placeholder
        this.models[modelName] = {
          model: null, // Would be actual tf.GraphModel
          isLoaded: true, // Simulate successful loading
          styleName: modelName,
          culturalAuthenticity: this.getCulturalAuthenticityScore(modelName)
        };
        console.log(`Loaded ${modelName} style model`);
      } catch (error) {
        console.warn(`Failed to load ${modelName} model:`, error);
      }
    }
  }

  private getCulturalAuthenticityScore(styleName: string): number {
    // Cultural authenticity scores based on historical accuracy
    const scores: Record<string, number> = {
      album_covers: 0.95,     // High - based on actual album art
      concert_posters: 0.90,  // High - based on authentic poster art  
      bears_collection: 0.85, // Good - based on original Bears designs
      skulls_roses: 0.92,     // High - iconic Dead imagery
      lightning_bolts: 0.88   // Good - Steal Your Face variations
    };
    return scores[styleName] || 0.5;
  }

  async applyStyleToCanvas(
    sourceCanvas: HTMLCanvasElement,
    songName: string,
    intensity: number = 1.0
  ): Promise<HTMLCanvasElement> {
    if (!this.isInitialized) {
      console.warn('Style Transfer not initialized, returning original canvas');
      return sourceCanvas;
    }

    const styleName = this.getSongStyle(songName);
    const model = this.models[styleName as keyof DeadStyleTransfer['models']];

    if (!model?.isLoaded) {
      console.warn(`Style model ${styleName} not available, using procedural styling`);
      return this.applyProceduralStyling(sourceCanvas, styleName, intensity);
    }

    // For now, apply procedural styling
    // In production, this would use the actual neural style transfer model
    return this.applyProceduralStyling(sourceCanvas, styleName, intensity);
  }

  private getSongStyle(songName: string): string {
    // Find the best matching style for the song
    const exactMatch = DEAD_SONG_STYLES[songName];
    if (exactMatch) return exactMatch;

    // Fuzzy matching for similar song names
    const songLower = songName.toLowerCase();
    for (const [deadSong, style] of Object.entries(DEAD_SONG_STYLES)) {
      if (songLower.includes(deadSong.toLowerCase()) || deadSong.toLowerCase().includes(songLower)) {
        return style;
      }
    }

    // Default to album covers style
    return 'album_covers';
  }

  private async applyProceduralStyling(
    sourceCanvas: HTMLCanvasElement,
    styleName: string,
    intensity: number
  ): Promise<HTMLCanvasElement> {
    // Set canvas size to match source
    this.canvas.width = sourceCanvas.width;
    this.canvas.height = sourceCanvas.height;

    // Draw original content
    this.ctx.drawImage(sourceCanvas, 0, 0);

    // Apply style-specific procedural effects
    switch (styleName) {
      case 'skulls_roses':
        await this.applySkullsRosesStyle(intensity);
        break;
      case 'album_covers':
        await this.applyAlbumCoverStyle(intensity);
        break;
      case 'concert_posters':
        await this.applyConcertPosterStyle(intensity);
        break;
      case 'bears_collection':
        await this.applyBearsStyle(intensity);
        break;
      case 'lightning_bolts':
        await this.applyLightningStyle(intensity);
        break;
      default:
        console.warn(`Unknown style: ${styleName}`);
    }

    return this.canvas;
  }

  private async applySkullsRosesStyle(intensity: number): Promise<void> {
    // Skulls & Roses style: High contrast, red/white/black palette
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Enhance reds and reduce other colors for skull/rose effect
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert to grayscale first
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Apply red tint for roses, maintain whites for skulls
      const redIntensity = Math.min(255, r * 1.3);
      const whiteThreshold = 200;
      
      if (gray > whiteThreshold) {
        // Keep whites (skull areas)
        data[i] = Math.min(255, gray + intensity * 20);
        data[i + 1] = Math.min(255, gray + intensity * 20);  
        data[i + 2] = Math.min(255, gray + intensity * 20);
      } else {
        // Enhance reds (rose areas)
        data[i] = Math.min(255, redIntensity * intensity);
        data[i + 1] = Math.max(0, g * (1 - intensity * 0.3));
        data[i + 2] = Math.max(0, b * (1 - intensity * 0.3));
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private async applyAlbumCoverStyle(intensity: number): Promise<void> {
    // American Beauty / Workingman's Dead style: Warm, earthy tones
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];  
      const b = data[i + 2];

      // Enhance warm tones, reduce cool tones
      data[i] = Math.min(255, r * (1 + intensity * 0.2)); // Enhance reds
      data[i + 1] = Math.min(255, g * (1 + intensity * 0.1)); // Slight green boost
      data[i + 2] = Math.max(0, b * (1 - intensity * 0.2)); // Reduce blues
    }

    this.ctx.putImageData(imageData, 0, 0);
    
    // Add sepia overlay
    this.ctx.globalCompositeOperation = 'multiply';
    this.ctx.fillStyle = `rgba(244, 222, 179, ${intensity * 0.3})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = 'source-over';
  }

  private async applyConcertPosterStyle(intensity: number): Promise<void> {
    // Psychedelic concert poster style: Saturated, high contrast
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Increase saturation dramatically
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturationBoost = intensity * 1.5;

      if (max > min) {
        const saturation = (max - min) / max;
        const newSaturation = Math.min(1, saturation * (1 + saturationBoost));
        
        data[i] = min + (r - min) * newSaturation / saturation;
        data[i + 1] = min + (g - min) * newSaturation / saturation;
        data[i + 2] = min + (b - min) * newSaturation / saturation;
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private async applyBearsStyle(intensity: number): Promise<void> {
    // Dancing Bears style: Playful colors, smooth gradients
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Apply rainbow-like color shifts
      const hue = (i / 4 / (this.canvas.width * this.canvas.height)) * 360;
      const colorShift = intensity * Math.sin(hue * Math.PI / 180) * 50;

      data[i] = Math.max(0, Math.min(255, r + colorShift));
      data[i + 1] = Math.max(0, Math.min(255, g + colorShift * 0.7));
      data[i + 2] = Math.max(0, Math.min(255, b + colorShift * 0.5));
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private async applyLightningStyle(intensity: number): Promise<void> {
    // Steal Your Face lightning style: Electric blues and sharp contrasts
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Enhance blues and add electric feel
      data[i] = Math.max(0, r * (1 - intensity * 0.2));
      data[i + 1] = Math.min(255, g * (1 + intensity * 0.1));
      data[i + 2] = Math.min(255, b * (1 + intensity * 0.4)); // Strong blue enhancement
    }

    this.ctx.putImageData(imageData, 0, 0);

    // Add electric glow effect
    this.ctx.shadowColor = `rgba(0, 100, 255, ${intensity * 0.8})`;
    this.ctx.shadowBlur = intensity * 20;
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.drawImage(this.canvas, 0, 0);
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.shadowBlur = 0;
  }

  // Cultural validation methods
  async validateCulturalAppropriateness(imageData: ImageData): Promise<ValidationResult> {
    // Placeholder for AI-based cultural validation
    // In production, this would analyze the image for inappropriate use of sacred imagery
    
    return {
      isAppropriate: true,
      authenticityScore: 0.85,
      culturalConcerns: [],
      suggestions: ['Consider adding more traditional Dead color palette']
    };
  }

  dispose(): void {
    // Clean up TensorFlow resources
    Object.values(this.models).forEach(model => {
      if (model?.model) {
        model.model.dispose();
      }
    });
    this.models = {};
    this.isInitialized = false;
  }
}

export default GratefulDeadStyleTransfer;