import { Platform } from "react-native";

/**
 * IP da máquina rodando o backend Spring Boot, usado apenas quando o app
 * roda no Expo Go de um celular físico (nesse caso "localhost" apontaria
 * para o próprio celular, não para o computador). Ex: "192.168.0.10".
 */
const LOCAL_NETWORK_IP: string = "SEU_IP_LOCAL";

function resolveBaseUrl(): string {
  if (LOCAL_NETWORK_IP !== "SEU_IP_LOCAL") {
    return `http://${LOCAL_NETWORK_IP}:8080`;
  }

  // Emulador Android usa 10.0.2.2 para acessar o "localhost" do host.
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  // iOS simulator e Web acessam o host normalmente por localhost.
  return "http://localhost:8080";
}

export const API_BASE_URL = resolveBaseUrl();
