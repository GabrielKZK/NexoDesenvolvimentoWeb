export type ThemeMode = 'light' | 'dark';

export const brand = {
  purple: '#9b2fff',
  green: '#06d25e',
};

export const brandGradient = [brand.purple, brand.green] as const;

export const accents = {
  blue: '#2e73f6',
  cyan: '#10c6df',
  amber: '#f59e0b',
  orange: '#ff6a00',
  green: '#06d25e',
  red: '#ef4444',
  purple: '#9b2fff',
  pink: '#f2389d',
  teal: '#14b8a6',
  indigo: '#6366f1',
};

export const status = {
  success: '#00c853',
  info: '#2979ff',
  warning: '#ffab00',
  danger: '#ff4d4d',
};

const darkPalette = {
  background: '#0d1117',
  card: '#161f30',
  input: '#0d121f',
  text: '#e2e8f0',
  textSecondary: '#8892a4',
  border: '#243048',
};

const lightPalette = {
  background: '#f6f6f7',
  card: '#ffffff',
  input: '#f0f2f5',
  text: '#12284a',
  textSecondary: '#6c757d',
  border: '#dddddf',
};

export function getPalette(mode: ThemeMode) {
  const base = mode === 'dark' ? darkPalette : lightPalette;
  return {
    ...base,
    brand,
    brandGradient,
    accents,
    status,
    white: '#ffffff',
    black: '#000000',
    overlay: mode === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(18,40,74,0.35)',
  };
}

export type Palette = ReturnType<typeof getPalette>;
