/**
 * PALETTE EXPORT FORMATS
 *
 * Export palettes to various formats for use in external tools.
 *
 * Supported Formats:
 * - JSON (universal)
 * - CSS (web development)
 * - GIMP Palette (.gpl)
 * - Adobe Swatch Exchange (.ase)
 * - Hex array (simple)
 *
 * Usage:
 * ```typescript
 * const cssExport = exportToCSS(palette);
 * const gimpExport = exportToGPL(palette);
 * downloadFile('palette.gpl', gimpExport);
 * ```
 */

import type { Palette } from './PaletteDirector';

/**
 * Convert RGB (0-1) to hex string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const rHex = Math.round(r * 255).toString(16).padStart(2, '0');
  const gHex = Math.round(g * 255).toString(16).padStart(2, '0');
  const bHex = Math.round(b * 255).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`;
}

/**
 * Export palette as JSON
 * @param palette - Palette to export
 * @returns JSON string
 */
export function exportToJSON(palette: Palette): string {
  return JSON.stringify(palette, null, 2);
}

/**
 * Export palette as CSS custom properties
 * @param palette - Palette to export
 * @param prefix - CSS variable prefix (default: 'palette')
 * @returns CSS string
 */
export function exportToCSS(palette: Palette, prefix: string = 'palette'): string {
  let css = `:root {\n`;
  css += `  /* ${palette.name} */\n`;

  palette.colors.forEach((color, i) => {
    const r = Math.round(color[0] * 255);
    const g = Math.round(color[1] * 255);
    const b = Math.round(color[2] * 255);
    const hex = rgbToHex(color[0], color[1], color[2]);

    css += `  --${prefix}-${i + 1}: ${hex}; /* rgb(${r}, ${g}, ${b}) */\n`;
  });

  css += `}\n`;

  return css;
}

/**
 * Export palette as GIMP Palette (.gpl)
 * @param palette - Palette to export
 * @returns GPL format string
 */
export function exportToGPL(palette: Palette): string {
  let gpl = `GIMP Palette\n`;
  gpl += `Name: ${palette.name}\n`;
  gpl += `Columns: ${palette.colors.length}\n`;
  gpl += `#\n`;

  for (const color of palette.colors) {
    const r = Math.round(color[0] * 255);
    const g = Math.round(color[1] * 255);
    const b = Math.round(color[2] * 255);

    gpl += `${r.toString().padStart(3)} ${g.toString().padStart(3)} ${b.toString().padStart(3)} Untitled\n`;
  }

  return gpl;
}

/**
 * Export palette as Adobe Swatch Exchange (.ase)
 * @param palette - Palette to export
 * @returns ASE format (binary data as base64)
 */
export function exportToASE(palette: Palette): string {
  // ASE is a binary format
  // This is a simplified implementation

  const buffer: number[] = [];

  // Header
  buffer.push(...[0x41, 0x53, 0x45, 0x46]); // 'ASEF'
  buffer.push(...[0x00, 0x01, 0x00, 0x00]); // Version 1.0

  // Number of blocks
  const numBlocks = palette.colors.length;
  buffer.push(...[
    (numBlocks >> 24) & 0xFF,
    (numBlocks >> 16) & 0xFF,
    (numBlocks >> 8) & 0xFF,
    numBlocks & 0xFF,
  ]);

  // Color blocks
  for (let i = 0; i < palette.colors.length; i++) {
    const [r, g, b] = palette.colors[i];

    // Block type (0x0001 = Color)
    buffer.push(...[0x00, 0x01]);

    // Block length (will calculate)
    const blockStart = buffer.length;
    buffer.push(...[0x00, 0x00, 0x00, 0x00]); // Placeholder

    // Color name (UTF-16 BE)
    const name = `Color ${i + 1}`;
    buffer.push(...[0x00, name.length + 1]); // Length including null terminator

    for (let j = 0; j < name.length; j++) {
      buffer.push(0x00, name.charCodeAt(j));
    }
    buffer.push(0x00, 0x00); // Null terminator

    // Color model ('RGB ')
    buffer.push(...[0x52, 0x47, 0x42, 0x20]); // 'RGB '

    // RGB values (32-bit floats)
    const rBytes = floatToBytes(r);
    const gBytes = floatToBytes(g);
    const bBytes = floatToBytes(b);

    buffer.push(...rBytes, ...gBytes, ...bBytes);

    // Color type (0x0002 = Global)
    buffer.push(...[0x00, 0x02]);

    // Update block length
    const blockLength = buffer.length - blockStart - 4;
    buffer[blockStart] = (blockLength >> 24) & 0xFF;
    buffer[blockStart + 1] = (blockLength >> 16) & 0xFF;
    buffer[blockStart + 2] = (blockLength >> 8) & 0xFF;
    buffer[blockStart + 3] = blockLength & 0xFF;
  }

  // Convert to base64
  const bytes = new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Convert float to 4 bytes (big-endian IEEE 754)
 */
function floatToBytes(value: number): number[] {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, false); // Big-endian

  return [
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3),
  ];
}

/**
 * Export palette as hex array
 * @param palette - Palette to export
 * @returns Array of hex strings
 */
export function exportToHexArray(palette: Palette): string[] {
  return palette.colors.map(color => rgbToHex(...color));
}

/**
 * Export palette as Tailwind config
 * @param palette - Palette to export
 * @param name - Palette name for config
 * @returns Tailwind config string
 */
export function exportToTailwind(palette: Palette, name: string = 'liquid'): string {
  let config = `// ${palette.name}\n`;
  config += `module.exports = {\n`;
  config += `  theme: {\n`;
  config += `    extend: {\n`;
  config += `      colors: {\n`;
  config += `        ${name}: {\n`;

  palette.colors.forEach((color, i) => {
    const hex = rgbToHex(...color);
    config += `          ${(i + 1) * 100}: '${hex}',\n`;
  });

  config += `        },\n`;
  config += `      },\n`;
  config += `    },\n`;
  config += `  },\n`;
  config += `};\n`;

  return config;
}

/**
 * Download palette as file
 * @param filename - Output filename
 * @param content - File content
 * @param mimeType - MIME type
 */
export function downloadPalette(
  filename: string,
  content: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Export palette in all formats
 * @param palette - Palette to export
 * @returns Object with all export formats
 */
export function exportAllFormats(palette: Palette) {
  return {
    json: exportToJSON(palette),
    css: exportToCSS(palette),
    gpl: exportToGPL(palette),
    ase: exportToASE(palette),
    hex: exportToHexArray(palette),
    tailwind: exportToTailwind(palette),
  };
}
