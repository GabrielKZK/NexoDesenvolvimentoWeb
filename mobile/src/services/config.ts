import { Platform } from 'react-native';
import Constants from 'expo-constants';

const API_PORT = 8080;

/**
 * Só preencha se a detecção automática não funcionar (ex: '192.168.0.10').
 * Deixe vazio para o app descobrir sozinho o IP do computador.
 */
const LAN_IP_OVERRIDE = '';

/**
 * Host do computador que serve o app (Metro/Expo). Em celular físico com Expo Go
 * o `hostUri` vem como "192.168.0.10:8081", então reaproveitamos o IP — assim não
 * precisa editar nada quando a rede/IP mudar.
 */
function getDevServerHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;
  const host = hostUri.split(':')[0];
  return host || null;
}

function resolveBaseUrl(): string {
  if (LAN_IP_OVERRIDE) {
    return `http://${LAN_IP_OVERRIDE}:${API_PORT}`;
  }

  const devHost = getDevServerHost();
  if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
    return `http://${devHost}:${API_PORT}`;
  }

  // Emulador Android acessa o "localhost" do computador via 10.0.2.2.
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}`;
  }

  // iOS Simulator e Web acessam o computador por localhost.
  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();
