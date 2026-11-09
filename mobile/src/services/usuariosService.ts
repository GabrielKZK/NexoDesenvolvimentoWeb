import { api } from './api';
import { REFRESH_COOKIE_NAME, session } from './session';
import { TrocaSenhaRequest, UsuarioApi, ValidacaoSenha } from '../types/auth';

/** Endpoints /api/usuarios/me (espelho de usuarios.service.ts do web). */
export const usuariosService = {
  /** Edita o nome do usuário logado. */
  atualizarPerfil: (dados: { nome: string }) => api.patch<UsuarioApi>('/usuarios/me', dados).then((r) => r.data),

  /**
   * Envia a foto de perfil (URI local de um JPEG já reduzido) como multipart, no campo
   * `arquivo`. O servidor limita a 2 MB e confere o tipo pelo conteúdo.
   */
  enviarFoto: (uri: string) => {
    const corpo = new FormData();
    // No React Native o "arquivo" do FormData é um objeto { uri, name, type }.
    corpo.append('arquivo', { uri, name: 'perfil.jpg', type: 'image/jpeg' } as unknown as Blob);
    return api
      .post<UsuarioApi>('/usuarios/me/foto', corpo, {
        // Sobrescreve o JSON padrão; o RN acrescenta o boundary do multipart sozinho.
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: (dados) => dados,
        timeout: 30000,
      })
      .then((r) => r.data);
  },

  /** Volta ao avatar padrão. */
  removerFoto: () => api.delete<UsuarioApi>('/usuarios/me/foto').then((r) => r.data),

  /** "Essa senha seria aceita?" — nada é gravado. */
  validarSenha: (novaSenha: string) =>
    api.post<ValidacaoSenha>('/usuarios/me/senha/validar', { novaSenha }).then((r) => r.data),

  /**
   * O servidor encerra as OUTRAS sessões do usuário e preserva a que apresentar o cookie
   * do refresh token. Como o cookie jar nativo está desligado, o cookie é enviado à mão;
   * sem ele, a troca de senha derrubaria também a sessão deste aparelho.
   */
  trocarSenha: (dados: TrocaSenhaRequest) =>
    api
      .post<void>('/usuarios/me/senha', dados, {
        headers: session.refreshToken ? { Cookie: `${REFRESH_COOKIE_NAME}=${session.refreshToken}` } : undefined,
      })
      .then((r) => r.data),
};
