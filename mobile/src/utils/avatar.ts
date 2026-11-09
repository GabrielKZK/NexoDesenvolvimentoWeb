import { API_URL } from '../services/config';

/**
 * Converte o valor de `foto` da API na URL que o <Image> deve usar.
 * Fotos enviadas ficam em `/api/fotos/{id}` (relativo à API, endpoint público);
 * sem foto devolve null e a UI mostra o avatar padrão.
 */
export function resolverFoto(foto: string | null | undefined): string | null {
  const caminho = foto?.trim();
  if (!caminho) return null;
  if (caminho.startsWith('/api/')) return API_URL + caminho.substring('/api'.length);
  return caminho;
}
