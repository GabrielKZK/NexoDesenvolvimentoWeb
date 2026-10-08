import { api } from './api';
import { Aluno, AlunoCadastroInput, AlunoLoginInput } from '../types/models';

// Rotas espelham AlunoController: @RequestMapping("/api/alunos")
export const alunoService = {
  cadastrar: async (dto: AlunoCadastroInput): Promise<Aluno> => {
    const { data } = await api.post<Aluno>('/api/alunos/cadastrar', dto);
    return data;
  },

  login: async (dto: AlunoLoginInput): Promise<Aluno> => {
    const { data } = await api.post<Aluno>('/api/alunos/login', dto);
    return data;
  },

  redefinirSenha: async (emailInstitucional: string, novaSenha: string): Promise<void> => {
    await api.patch('/api/alunos/senha/redefinir', { emailInstitucional, novaSenha });
  },

  concluirTarefa: async (id: number): Promise<Aluno> => {
    const { data } = await api.post<Aluno>(`/api/alunos/${id}/tarefas/concluir`);
    return data;
  },

  definirMetaSemanal: async (id: number, xp: number): Promise<Aluno> => {
    const { data } = await api.patch<Aluno>(`/api/alunos/${id}/meta`, null, { params: { xp } });
    return data;
  },

  progressoDaMetaSemanal: async (id: number): Promise<number> => {
    const { data } = await api.get<number>(`/api/alunos/${id}/progresso`);
    return data;
  },

  top10Geral: async (): Promise<Aluno[]> => {
    const { data } = await api.get<Aluno[]>('/api/alunos/ranking/top10');
    return Array.isArray(data) ? data : [];
  },
};
