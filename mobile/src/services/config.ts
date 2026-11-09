import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Endereço do backend do Nexo (o mesmo do projeto web: Spring Boot na porta 8080,
 * API sob `/api` e WebSocket do chat sob `/ws`).
 *
 * Ordem de resolução:
 *  1. `expo.extra.apiBaseUrl` no app.json (produção, ex.: "https://nexo.exemplo.com");
 *  2. `LAN_IP_OVERRIDE`, se preenchido;
 *  3. IP do computador que serve o Metro (celular físico com Expo Go);
 *  4. 10.0.2.2 no emulador Android, localhost no iOS Simulator.
 */
const API_PORT = 8080;

/** Só preencha se a detecção automática falhar (ex.: '192.168.0.10'). */
const LAN_IP_OVERRIDE = '';

function getDevServerHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;
  return hostUri.split(':')[0] || null;
}

function resolveRootUrl(): string {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  if (extra?.apiBaseUrl) return extra.apiBaseUrl.replace(/\/+$/, '');

  if (LAN_IP_OVERRIDE) return `http://${LAN_IP_OVERRIDE}:${API_PORT}`;

  const devHost = getDevServerHost();
  if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
    return `http://${devHost}:${API_PORT}`;
  }
  if (Platform.OS === 'android') return `http://10.0.2.2:${API_PORT}`;
  return `http://localhost:${API_PORT}`;
}

/** Ex.: http://192.168.0.10:8080 */
export const ROOT_URL = resolveRootUrl();

/** Base de todos os endpoints REST (equivale a `environment.apiUrl` do web). */
export const API_URL = `${ROOT_URL}/api`;

/** Base do WebSocket do chat (equivale a `environment.wsUrl` do web). */
export const WS_URL = `${ROOT_URL.replace(/^http/, 'ws')}/ws`;
