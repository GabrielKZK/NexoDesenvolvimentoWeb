import { api } from './client';
import { Professor, ProfessorInput } from '../types/models';

// Rotas espelham ProfessorController: @RequestMapping("/api/professores")
export const professorService = {
  listarTodos: async (): Promise<Professor[]> => {
    const { data } = await api.get<Professor[]>('/api/professores');
    return data;
  },

  buscarPorId: async (id: number): Promise<Professor> => {
    const { data } = await api.get<Professor>(`/api/professores/${id}`);
    return data;
  },

  criar: async (dto: ProfessorInput): Promise<Professor> => {
    const { data } = await api.post<Professor>('/api/professores', dto);
    return data;
  },

  login: async (email: string, senha: string): Promise<Professor> => {
    const { data } = await api.post<Professor>('/api/professores/login', { email, senha });
    return data;
  },

  atualizar: async (id: number, dto: ProfessorInput): Promise<Professor> => {
    const { data } = await api.put<Professor>(`/api/professores/${id}`, dto);
    return data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/api/professores/${id}`);
  },
};
