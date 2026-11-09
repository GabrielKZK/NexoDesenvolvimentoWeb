import axios, { AxiosResponse } from 'axios';
import { API_URL } from './config';
import { extrairRefreshDoSetCookie, REFRESH_COOKIE_NAME, session } from './session';
import { TokenResponse, Usuario, UsuarioApi } from '../types/auth';
import { resolverFoto } from '../utils/avatar';

/**
 * Cliente SEM interceptors, só para /auth/*: evita laço (o interceptor de 401 chama
 * a renovação, que não pode passar por ele de novo). withCredentials=false desliga o
 * cookie jar nativo — o cookie do refresh é tratado à mão (ver session.ts).
 */
const authHttp = axios.create({
  baseURL: `${API_URL}/auth`,
  timeout: 12000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

export function toUsuario(u: UsuarioApi): Usuario {
  return {
    id: u.id,
    nome: u.nome,
    cargo: u.cargo,
    foto: resolverFoto(u.foto),
    role: u.role.toLowerCase() as Usuario['role'],
    precisaTrocarSenha: u.precisaTrocarSenha,
  };
}

/** Guarda access token (memória), refresh (SecureStore) e perfil a partir de uma resposta de login/refresh. */
async function guardarSessao(resposta: AxiosResponse<TokenResponse>): Promise<Usuario> {
  const { token, usuario } = resposta.data;
  session.setAccessToken(token);

  const refresh = extrairRefreshDoSetCookie(resposta.headers?.['set-cookie']);
  if (refresh) {
    await session.saveRefresh(refresh);
  } else if (__DEV__) {
    console.warn(
      `[auth] O cabeçalho Set-Cookie não trouxe "${REFRESH_COOKIE_NAME}" — a sessão não poderá ser renovada ` +
        'após 15 min. Verifique se a plataforma expõe Set-Cookie ao JavaScript.',
    );
  }

  const normalizado = toUsuario(usuario);
  await session.saveUsuario(normalizado);
  return normalizado;
}

export async function login(loginInformado: string, senha: string): Promise<Usuario> {
  const resposta = await authHttp.post<TokenResponse>('/login', { login: loginInformado.trim(), senha });
  return guardarSessao(resposta);
}

/** Renovação em andamento, compartilhada por quem chamar ao mesmo tempo. */
let renovacaoEmVoo: Promise<Usuario> | null = null;

/**
 * Rotaciona o refresh token. Só uma renovação existe por vez e os chamadores
 * concorrentes esperam por ela: o servidor trata a reapresentação de um refresh
 * já rotacionado como vazamento e revoga TODAS as sessões do usuário (ver o
 * AuthService do web). Lança erro com `response` quando o servidor recusa
 * (sessão acabou) e sem `response` quando é só falta de rede.
 */
export function renovar(): Promise<Usuario> {
  renovacaoEmVoo ??= (async () => {
    const refresh = session.refreshToken;
    if (!refresh) throw new Error('Sem refresh token.');
    const resposta = await authHttp.post<TokenResponse>(
      '/refresh',
      {},
      { headers: { Cookie: `${REFRESH_COOKIE_NAME}=${refresh}` } },
    );
    return guardarSessao(resposta);
  })().finally(() => {
    renovacaoEmVoo = null;
  });
  return renovacaoEmVoo;
}

/** Revoga a sessão no servidor (melhor esforço) e esquece tudo no aparelho. */
export async function logout(): Promise<void> {
  const token = session.accessToken;
  const refresh = session.refreshToken;
  if (token) {
    await authHttp
      .post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(refresh ? { Cookie: `${REFRESH_COOKIE_NAME}=${refresh}` } : {}),
          },
        },
      )
      .catch(() => {});
  }
  await session.clear();
}

/** O servidor recusou a sessão (≠ falta de rede)? */
export function sessaoRecusada(erro: unknown): boolean {
  return axios.isAxiosError(erro) && !!erro.response && [400, 401, 403].includes(erro.response.status);
}
