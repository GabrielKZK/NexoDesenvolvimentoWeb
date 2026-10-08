import { Platform } from 'react-native';

/**
 * Endereço do backend Spring Boot (porta padrão 8080, sem context-path).
 *
 * - Emulador Android: usa 10.0.2.2 (alias da máquina host dentro do emulador).
 * - iOS Simulator / Web: localhost funciona normalmente.
 * - Celular físico: troque pelo IP da sua máquina na rede local, ex: 'http://192.168.0.10:8080'.
 *
 * IP atual (Wi-Fi) desta máquina, detectado em 2026-10-01: 172.20.141.77
 * Se você trocar de rede (ex: outro Wi-Fi, outra sala), rode `ipconfig` de novo
 * e atualize o valor abaixo.
 */
const LAN_IP = '172.20.141.77'; // <- IP da sua máquina para testar em um aparelho físico

function resolveBaseUrl(): string {
  if (LAN_IP) {
    return `http://${LAN_IP}:8080`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  return 'http://localhost:8080';
}

export const API_BASE_URL = resolveBaseUrl();
