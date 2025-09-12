// Advanced Psychedelic Effects Library
// Expert-level implementation combining modern techniques

export interface PsychedelicConfig {
  intensity: number; // 0-1
  speed: number; // 0-1
  colorShift: boolean;
  fluidSimulation: boolean;
  blendModes: boolean;
  performance: 'low' | 'medium' | 'high';
}

export class PsychedelicEffects {
  private config: PsychedelicConfig;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private particles: FluidParticle[] = [];
  private time = 0;

  constructor(config: Partial<PsychedelicConfig> = {}) {
    this.config = {
      intensity: 0.7,
      speed: 0.5,
      colorShift: true,
      fluidSimulation: true,
      blendModes: true,
      performance: 'medium',
      ...config
    };
  }

  // Advanced CSS-based psychedelic effects
  static createAdvancedCSS(): string {
    return `
      /* Expert-level psychedelic CSS effects */
      
      /* Advanced conic gradients with multiple color stops */
      .psychedelic-conic-advanced {
        background: conic-gradient(
          from 0deg at 50% 50%,
          #ff0080 0deg,
          #8000ff 60deg,
          #0080ff 120deg,
          #00ff80 180deg,
          #ffff00 240deg,
          #ff8000 300deg,
          #ff0080 360deg
        );
        animation: psychedelic-conic-rotate 20s linear infinite;
      }
      
      @keyframes psychedelic-conic-rotate {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      
      /* Advanced backdrop-filter effects */
      .psychedelic-glassmorphism {
        backdrop-filter: blur(20px) saturate(1.8) hue-rotate(0deg);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 
          0 8px 32px rgba(255, 0, 128, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        animation: psychedelic-glassmorphism-shift 15s ease-in-out infinite;
      }
      
      @keyframes psychedelic-glassmorphism-shift {
        0% { 
          backdrop-filter: blur(20px) saturate(1.8) hue-rotate(0deg);
          box-shadow: 0 8px 32px rgba(255, 0, 128, 0.1);
        }
        25% { 
          backdrop-filter: blur(25px) saturate(2.0) hue-rotate(90deg);
          box-shadow: 0 8px 32px rgba(128, 0, 255, 0.1);
        }
        50% { 
          backdrop-filter: blur(30px) saturate(2.2) hue-rotate(180deg);
          box-shadow: 0 8px 32px rgba(0, 128, 255, 0.1);
        }
        75% { 
          backdrop-filter: blur(25px) saturate(2.0) hue-rotate(270deg);
          box-shadow: 0 8px 32px rgba(255, 255, 0, 0.1);
        }
        100% { 
          backdrop-filter: blur(20px) saturate(1.8) hue-rotate(360deg);
          box-shadow: 0 8px 32px rgba(255, 0, 128, 0.1);
        }
      }
      
      /* Advanced mix-blend-mode effects */
      .psychedelic-blend-advanced {
        mix-blend-mode: multiply;
        animation: psychedelic-blend-shift 12s ease-in-out infinite;
      }
      
      @keyframes psychedelic-blend-shift {
        0% { mix-blend-mode: multiply; filter: hue-rotate(0deg); }
        20% { mix-blend-mode: screen; filter: hue-rotate(72deg); }
        40% { mix-blend-mode: overlay; filter: hue-rotate(144deg); }
        60% { mix-blend-mode: soft-light; filter: hue-rotate(216deg); }
        80% { mix-blend-mode: color-dodge; filter: hue-rotate(288deg); }
        100% { mix-blend-mode: multiply; filter: hue-rotate(360deg); }
      }
      
      /* Advanced text effects with multiple layers */
      .psychedelic-text-expert {
        background: linear-gradient(45deg, 
          #ff0080, #8000ff, #0080ff, #00ff80, #ffff00, #ff8000, #ff0080);
        background-size: 400% 400%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: psychedelic-text-flow 8s ease-in-out infinite;
        text-shadow: 
          0 0 10px rgba(255, 0, 128, 0.3),
          0 0 20px rgba(128, 0, 255, 0.2),
          0 0 30px rgba(0, 128, 255, 0.1),
          0 0 40px rgba(255, 255, 0, 0.1);
        position: relative;
      }
      
      .psychedelic-text-expert::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(45deg, 
          #ff0080, #8000ff, #0080ff, #00ff80, #ffff00, #ff8000, #ff0080);
        background-size: 400% 400%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: psychedelic-text-flow 8s ease-in-out infinite reverse;
        z-index: -1;
        filter: blur(2px);
      }
      
      @keyframes psychedelic-text-flow {
        0% { 
          background-position: 0% 50%;
          transform: scale(1) rotate(0deg);
        }
        25% { 
          background-position: 100% 50%;
          transform: scale(1.02) rotate(1deg);
        }
        50% { 
          background-position: 0% 50%;
          transform: scale(1) rotate(0deg);
        }
        75% { 
          background-position: 100% 50%;
          transform: scale(1.02) rotate(-1deg);
        }
        100% { 
          background-position: 0% 50%;
          transform: scale(1) rotate(0deg);
        }
      }
      
      /* Advanced button effects */
      .psychedelic-button-expert {
        position: relative;
        background: linear-gradient(45deg, 
          rgba(255, 0, 128, 0.8), 
          rgba(128, 0, 255, 0.8),
          rgba(0, 128, 255, 0.8));
        border: none;
        border-radius: 25px;
        padding: 15px 30px;
        color: white;
        font-weight: 600;
        overflow: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 
          0 10px 25px rgba(255, 0, 128, 0.3),
          0 0 20px rgba(128, 0, 255, 0.2);
      }
      
      .psychedelic-button-expert::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
          from 0deg,
          rgba(255, 255, 255, 0.1) 0deg,
          rgba(255, 0, 128, 0.2) 60deg,
          rgba(128, 0, 255, 0.2) 120deg,
          rgba(0, 128, 255, 0.2) 180deg,
          rgba(255, 255, 0, 0.2) 240deg,
          rgba(255, 0, 128, 0.2) 300deg,
          rgba(255, 255, 255, 0.1) 360deg
        );
        animation: psychedelic-button-rotate 3s linear infinite;
        z-index: -1;
      }
      
      .psychedelic-button-expert::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 255, 255, 0.3), 
          transparent);
        transition: left 0.5s ease;
      }
      
      .psychedelic-button-expert:hover::after {
        left: 100%;
      }
      
      .psychedelic-button-expert:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 
          0 15px 35px rgba(255, 0, 128, 0.4),
          0 0 30px rgba(128, 0, 255, 0.3);
      }
      
      @keyframes psychedelic-button-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Advanced card effects */
      .psychedelic-card-expert {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 25px;
        box-shadow: 
          0 8px 32px rgba(255, 0, 128, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .psychedelic-card-expert::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
          from 0deg,
          rgba(255, 0, 128, 0.1) 0deg,
          rgba(128, 0, 255, 0.08) 60deg,
          rgba(0, 128, 255, 0.06) 120deg,
          rgba(255, 255, 0, 0.04) 180deg,
          rgba(255, 0, 128, 0.1) 360deg
        );
        animation: psychedelic-card-rotate 25s linear infinite;
        z-index: -1;
      }
      
      .psychedelic-card-expert:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 
          0 15px 45px rgba(255, 0, 128, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
      
      @keyframes psychedelic-card-rotate {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      
      /* Performance optimizations */
      .psychedelic-optimized {
        will-change: transform, filter, background;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .psychedelic-conic-advanced,
        .psychedelic-glassmorphism,
        .psychedelic-blend-advanced,
        .psychedelic-text-expert,
        .psychedelic-button-expert,
        .psychedelic-card-expert {
          animation: none;
        }
      }
    `;
  }

  // Initialize fluid simulation
  initFluidSimulation(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.resizeCanvas();
    this.initParticles();
    this.startAnimation();
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private initParticles(): void {
    if (!this.canvas) return;
    
    this.particles = [];
    const particleCount = this.config.performance === 'high' ? 100 : 
                         this.config.performance === 'medium' ? 50 : 25;
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5 * this.config.speed,
        vy: (Math.random() - 0.5) * 0.5 * this.config.speed,
        size: Math.random() * 4 + 1,
        color: this.generatePsychedelicColor(),
        opacity: Math.random() * 0.4 + 0.1,
        life: Math.random() * 1000 + 500
      });
    }
  }

  private generatePsychedelicColor(): string {
    const hues = [280, 300, 320, 340, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260];
    const hue = hues[Math.floor(Math.random() * hues.length)];
    const saturation = 70 + Math.random() * 30;
    const lightness = 50 + Math.random() * 30;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  private startAnimation(): void {
    const animate = () => {
      this.updateParticles();
      this.renderParticles();
      this.time += 0.016; // ~60fps
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updateParticles(): void {
    if (!this.canvas) return;

    this.particles.forEach(particle => {
      // Organic movement with noise
      const noise = Math.sin(this.time * 0.001 + particle.x * 0.01) * 0.02;
      particle.vx += noise * this.config.intensity;
      particle.vy += Math.cos(this.time * 0.001 + particle.y * 0.01) * 0.02 * this.config.intensity;
      
      // Damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas!.width;
      if (particle.x > this.canvas!.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas!.height;
      if (particle.y > this.canvas!.height) particle.y = 0;
      
      // Color shifting
      if (this.config.colorShift) {
        const hue = (parseFloat(particle.color.match(/\d+/)?.[0] || '280') + 0.5) % 360;
        particle.color = particle.color.replace(/\d+/, hue.toString());
      }
      
      // Life cycle
      particle.life--;
      if (particle.life <= 0) {
        particle.x = Math.random() * this.canvas!.width;
        particle.y = Math.random() * this.canvas!.height;
        particle.life = Math.random() * 1000 + 500;
        particle.color = this.generatePsychedelicColor();
      }
    });
  }

  private renderParticles(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create gradient background
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
    );
    gradient.addColorStop(0, 'rgba(255, 0, 128, 0.05)');
    gradient.addColorStop(0.5, 'rgba(128, 0, 255, 0.03)');
    gradient.addColorStop(1, 'rgba(0, 128, 255, 0.01)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections between nearby particles
    this.particles.forEach((particle, i) => {
      this.particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.15 * this.config.intensity;
          this.ctx!.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          this.ctx!.lineWidth = 1;
          this.ctx!.beginPath();
          this.ctx!.moveTo(particle.x, particle.y);
          this.ctx!.lineTo(otherParticle.x, otherParticle.y);
          this.ctx!.stroke();
        }
      });
    });
    
    // Draw particles
    this.particles.forEach(particle => {
      this.ctx!.save();
      this.ctx!.globalAlpha = particle.opacity * this.config.intensity;
      
      // Create particle glow
      const particleGradient = this.ctx!.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 4
      );
      particleGradient.addColorStop(0, particle.color);
      particleGradient.addColorStop(1, 'transparent');
      
      this.ctx!.fillStyle = particleGradient;
      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
      this.ctx!.fill();
      
      // Draw core particle
      this.ctx!.fillStyle = particle.color;
      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx!.fill();
      
      this.ctx!.restore();
    });
  }

  // Cleanup
  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

interface FluidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

// Utility functions for advanced psychedelic effects
export const PsychedelicUtils = {
  // Generate psychedelic color palette
  generateColorPalette(count: number = 8): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 45) % 360;
      const saturation = 70 + Math.random() * 30;
      const lightness = 50 + Math.random() * 30;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  },

  // Create CSS custom properties for dynamic theming
  createCSSVariables(colors: string[]): string {
    return colors.map((color, index) => 
      `--psychedelic-color-${index}: ${color};`
    ).join('\n');
  },

  // Generate organic blob SVG path
  generateBlobPath(complexity: number = 4): string {
    const points = [];
    for (let i = 0; i < complexity; i++) {
      const angle = (i / complexity) * Math.PI * 2;
      const radius = 50 + Math.random() * 30;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      points.push(`${x},${y}`);
    }
    return `M ${points[0]} Q ${points[1]} ${points[2]} Q ${points[3]} ${points[0]} Z`;
  }
};
