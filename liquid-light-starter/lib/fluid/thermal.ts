/**
 * Helpers that add authentic "thermal" and slow rotational motion to the fluid,
 * without modifying the underlying engine.
 */

export type FluidInstance = {
  splat?: (x: number, y: number, dx: number, dy: number, color?: [number, number, number]) => void;
  dispose?: () => void;
};

export function addThermalSplat(fluid: FluidInstance, canvas: HTMLCanvasElement) {
  if (!fluid?.splat) return;
  const x = Math.random() * canvas.width;
  const y = canvas.height * (0.8 + Math.random() * 0.2); // near bottom
  const force = 15 + Math.random() * 10; // gentle upward push
  const color: [number, number, number] = [1.0, 0.85, 0.3]; // warm
  fluid.splat(x, y, 0, -force, color);
}

export function addSlowRotation(fluid: FluidInstance, canvas: HTMLCanvasElement, phase: number) {
  if (!fluid?.splat) return;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) * 0.3;
  const x = cx + Math.cos(phase) * radius;
  const y = cy + Math.sin(phase) * radius;
  const vx = -Math.sin(phase) * 2;
  const vy = Math.cos(phase) * 2;
  const grey: [number, number, number] = [0.5, 0.5, 0.5];
  fluid.splat(x, y, vx, vy, grey);
}
