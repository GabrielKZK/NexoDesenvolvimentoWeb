import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './config';
import { renovar, sessaoRecusada } from './authService';
import { session } from './session';

/**
 * Cliente HTTP da API do Nexo. Mesmo comportamento do authInterceptor do web:
 *  - anexa `Authorization: Bearer` a tudo, exceto /auth/login e /auth/refresh;
 *  - em 401 com sessão ativa, tenta UMA renovação (compartilhada) e repete a chamada;
 *  - renovação recusada pelo servidor → limpa a sessão e volta ao login.
 * Erros seguem como AxiosError; o corpo é o envelope `ApiErro` (ver types/api.ts).
 */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 12000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

const ROTAS_PUBLICAS = ['/auth/login', '/auth/refresh'];

type Config = InternalAxiosRequestConfig & { _tentouRenovar?: boolean };

const ehPublica = (url?: string) => !!url && ROTAS_PUBLICAS.some((r) => url.includes(r));

api.interceptors.request.use((config) => {
  const token = session.accessToken;
  if (token && !ehPublica(config.url)) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro: unknown) => {
    if (!axios.isAxiosError(erro) || !erro.config) throw erro;

    const original = erro.config as Config;
    const podeRenovar =
      erro.response?.status === 401 && !!session.usuario && !original._tentouRenovar && !ehPublica(original.url);
    if (!podeRenovar) throw erro;

    original._tentouRenovar = true;
    try {
      await renovar();
    } catch (erroRefresh) {
      // Servidor recusou (cookie vencido/revogado): sessão acabou. Sem rede: só propaga o erro original.
      if (sessaoRecusada(erroRefresh)) {
        await session.clear();
        session.notifyExpired();
      }
      throw erro;
    }
    original.headers.set('Authorization', `Bearer ${session.accessToken}`);
    return api(original);
  },
);
