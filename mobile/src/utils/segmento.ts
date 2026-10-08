import { SEGMENTO_ACCENT_KEYS } from '../constants/accents';

/** Escolhe sempre a mesma cor de destaque para um segmento (hash do nome). */
export function corDoSegmento(segmento: string, palette: Record<string, string>) {
  let hash = 0;
  for (let i = 0; i < segmento.length; i++) hash = segmento.charCodeAt(i) + ((hash << 5) - hash);
  const chave = SEGMENTO_ACCENT_KEYS[Math.abs(hash) % SEGMENTO_ACCENT_KEYS.length];
  return palette[chave];
}
