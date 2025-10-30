export type ThinFilmPreset = {
  thickness: number;
  ior: number;
  blendMode: 'screen' | 'overlay' | 'normal';
  intensity: number; // 0-1
};

export const THIN_FILM_PRESETS: Record<string, ThinFilmPreset> = {
  oil: {
    thickness: 200,
    ior: 1.5,
    blendMode: 'screen',
    intensity: 0.6,
  },
  soap: {
    thickness: 150,
    ior: 1.33,
    blendMode: 'overlay',
    intensity: 0.7,
  },
  intense: {
    thickness: 300,
    ior: 1.8,
    blendMode: 'screen',
    intensity: 0.9,
  },
  subtle: {
    thickness: 120,
    ior: 1.45,
    blendMode: 'normal',
    intensity: 0.4,
  },
};

