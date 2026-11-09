import { api } from './api';

type Secoes = Record<string, Record<string, unknown>>;

/** GET/PATCH /api/configuracoes (todos os papéis; as seções dependem do papel). */
export const configuracoesService = {
  obter: () => api.get<Secoes>('/configuracoes').then((r) => r.data),
  atualizarSecao: (secao: string, valores: Record<string, unknown>) =>
    api.patch<Secoes>(`/configuracoes/${secao}`, valores).then((r) => r.data),
};
