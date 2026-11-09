/** Papel no cliente, em minúsculo (igual ao `RoleCliente` do web). */
export type RoleCliente = 'aluno' | 'professor' | 'diretor' | 'admin';

export type RoleApi = 'ALUNO' | 'PROFESSOR' | 'DIRETOR' | 'ADMIN';

/** Usuário como a API devolve em POST /auth/login e /auth/refresh. */
export interface UsuarioApi {
  id: number;
  nome: string;
  cargo: string;
  foto: string | null;
  role: RoleApi;
  precisaTrocarSenha: boolean;
}

/** O refresh token não vem aqui: viaja no cookie `nexo_refresh` (ver services/session.ts). */
export interface TokenResponse {
  token: string;
  usuario: UsuarioApi;
}

/** Usuário da sessão, já normalizado para a UI. */
export interface Usuario {
  id: number;
  nome: string;
  cargo: string;
  /** URL absoluta da foto, ou null quando o usuário não enviou (usar avatar padrão). */
  foto: string | null;
  role: RoleCliente;
  /** Senha provisória em uso: só a tela de troca de senha fica liberada. */
  precisaTrocarSenha: boolean;
}

/** Resposta de POST /usuarios/me/senha/validar. */
export interface ValidacaoSenha {
  valida: boolean;
  codigo: string | null;
  motivo: string | null;
}

export interface TrocaSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}
