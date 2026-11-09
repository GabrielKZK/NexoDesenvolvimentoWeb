export type ThemeMode = 'light' | 'dark';

/**
 * Paleta do app = tokens do redesign do web (`nexo/src/styles/nexo-tokens.scss`, prefixo
 * `--nx-*`), claro e escuro. Mapeamento:
 *   background → --nx-bg      card → --nx-card       input → --nx-field
 *   text → --nx-text          textSecondary → --nx-muted     border → --nx-line
 *   brand.purple → --nx-brand (texto, ícone, foco)    brand.deep → --nx-brand-deep (fundo de botão/barra)
 *   accents.cyan → --nx-accent    status.danger → --nx-danger    status.success → --nx-ok
 * Regra do web: sem gradiente roxo→verde — botões, cabeçalho e barras de progresso são roxo sólido.
 */
const light = {
  background: '#E9E6F1',
  card: '#FFFFFF',
  input: '#FFFFFF',
  text: '#1A1030',
  textSecondary: '#4B4566',
  border: '#B2A8CC',
  soft: '#DDD7EA',
  brand: { purple: '#6D28D9', deep: '#5B21B6', green: '#15803D' },
  accents: {
    blue: '#1976D2',
    cyan: '#0FA3C2',
    amber: '#F59E0B',
    orange: '#F59E0B',
    green: '#15803D',
    red: '#DC2626',
    purple: '#5B21B6',
    pink: '#DB2777',
    teal: '#0E7490',
    indigo: '#6366F1',
  },
  status: { success: '#14663F', info: '#1976D2', warning: '#B45309', danger: '#B3261E', dangerSolid: '#DC2626' },
  overlay: 'rgba(26,16,48,0.35)',
};

const dark: typeof light = {
  background: '#0B0716',
  card: '#171128',
  input: '#221A3A',
  text: '#F4F1FF',
  textSecondary: '#C9C1E6',
  border: '#5A4A8F',
  soft: '#2A2048',
  brand: { purple: '#A78BFA', deep: '#7C3AED', green: '#7BE0A8' },
  accents: {
    blue: '#60A5FA',
    cyan: '#5EE0F2',
    amber: '#FBBF24',
    orange: '#FBBF24',
    green: '#7BE0A8',
    red: '#FF8A80',
    purple: '#A78BFA',
    pink: '#F472B6',
    teal: '#5EE0F2',
    indigo: '#818CF8',
  },
  status: { success: '#7BE0A8', info: '#60A5FA', warning: '#FBBF24', danger: '#FF8A80', dangerSolid: '#DC2626' },
  overlay: 'rgba(0,0,0,0.55)',
};

export function getPalette(mode: ThemeMode) {
  const p = mode === 'dark' ? dark : light;
  return {
    ...p,
    /** Sólido de propósito (o web só aprova gradiente nos blocos de XP); mantido como par para o LinearGradient. */
    brandGradient: [p.brand.deep, p.brand.deep] as const,
    white: '#FFFFFF',
    black: '#000000',
  };
}

export type Palette = ReturnType<typeof getPalette>;
