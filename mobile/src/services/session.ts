import * as SecureStore from 'expo-secure-store';
import { Usuario } from '../types/auth';

/**
 * Estado de sessão fora do React, para o interceptor do axios poder lê-lo.
 *
 * Onde cada coisa vive (mesma política do AuthService do web):
 *  - access token  → só em memória. Some ao fechar o app e é refeito a partir do refresh;
 *  - refresh token → expo-secure-store (Keychain/Keystore). É a credencial de vida longa (7 dias);
 *  - perfil        → expo-secure-store também (nome, cargo, foto, papel). Não é credencial,
 *                    serve para a UI abrir sem piscar enquanto a sessão é renovada.
 *
 * Sobre o refresh token: o backend do web o entrega só em cookie HttpOnly (`nexo_refresh`,
 * Path=/api/auth) e o lê via @CookieValue — o corpo do login não o traz. O app lê o cookie do
 * cabeçalho Set-Cookie (o RN não o esconde como um navegador faria), guarda o valor no
 * SecureStore e o reenvia manualmente em `Cookie:` nas chamadas a /auth/refresh e /auth/logout.
 * O cookie jar nativo fica desligado (withCredentials=false) para não competir com isso.
 */
export const REFRESH_COOKIE_NAME = 'nexo_refresh';

const REFRESH_KEY = 'nexo.refresh';
const USUARIO_KEY = 'nexo.usuario';

let accessToken: string | null = null;
let refreshToken: string | null = null;
let usuario: Usuario | null = null;
let onExpired: (() => void) | null = null;

export const session = {
  get accessToken() {
    return accessToken;
  },
  get refreshToken() {
    return refreshToken;
  },
  get usuario() {
    return usuario;
  },

  setAccessToken(token: string | null) {
    accessToken = token;
  },

  /** Registra o que deve acontecer quando a renovação falha de vez (volta ao login). */
  setOnExpired(fn: (() => void) | null) {
    onExpired = fn;
  },
  notifyExpired() {
    onExpired?.();
  },

  /** Lê o disco no arranque do app. */
  async load(): Promise<{ usuario: Usuario | null; temRefresh: boolean }> {
    try {
      refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      const raw = await SecureStore.getItemAsync(USUARIO_KEY);
      usuario = raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      refreshToken = null;
      usuario = null;
    }
    return { usuario, temRefresh: !!refreshToken };
  },

  async saveRefresh(valor: string) {
    refreshToken = valor;
    await SecureStore.setItemAsync(REFRESH_KEY, valor).catch(() => {});
  },

  async saveUsuario(u: Usuario) {
    usuario = u;
    await SecureStore.setItemAsync(USUARIO_KEY, JSON.stringify(u)).catch(() => {});
  },

  /** Esquece tudo (logout ou sessão revogada). */
  async clear() {
    accessToken = null;
    refreshToken = null;
    usuario = null;
    await Promise.all([
      SecureStore.deleteItemAsync(REFRESH_KEY).catch(() => {}),
      SecureStore.deleteItemAsync(USUARIO_KEY).catch(() => {}),
    ]);
  },
};

/**
 * Extrai o valor de `nexo_refresh` de um cabeçalho Set-Cookie. O RN pode entregá-lo como
 * string (vários cookies unidos por vírgula) ou como lista. Valor vazio (cookie sendo
 * apagado no logout) devolve null.
 */
export function extrairRefreshDoSetCookie(header: unknown): string | null {
  const texto = Array.isArray(header) ? header.join('\n') : typeof header === 'string' ? header : '';
  const match = new RegExp(`(?:^|[\\s,;])${REFRESH_COOKIE_NAME}=([^;,\\s]+)`).exec(texto);
  return match?.[1] ?? null;
}
