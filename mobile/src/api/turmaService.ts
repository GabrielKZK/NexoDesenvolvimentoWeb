import { api } from './client';
import { Turma, TurmaInput } from '../types/models';

// Rotas espelham TurmaController: @RequestMapping("/turma")
export const turmaService = {
  listarTodas: async (): Promise<Turma[]> => {
    const { data } = await api.get<Turma[]>('/turma');
    return Array.isArray(data) ? data : [];
  },

  buscarPorId: async (id: number): Promise<Turma> => {
    const { data } = await api.get<Turma>(`/turma/${id}`);
    return data;
  },

  criar: async (dto: TurmaInput): Promise<Turma> => {
    const { data } = await api.post<Turma>('/turma', dto);
    return data;
  },

  alterar: async (id: number, dto: TurmaInput): Promise<Turma> => {
    const { data } = await api.put<Turma>(`/turma/${id}`, dto);
    return data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/turma/${id}`);
  },

  vincularMateria: async (turmaId: number, materiaId: number): Promise<Turma> => {
    const { data } = await api.post<Turma>(`/turma/${turmaId}/materias/${materiaId}`);
    return data;
  },

  desvincularMateria: async (turmaId: number, materiaId: number): Promise<Turma> => {
    const { data } = await api.delete<Turma>(`/turma/${turmaId}/materias/${materiaId}`);
    return data;
  },

  /** Aplica a seleção final de matérias de uma turma, vinculando/desvinculando apenas o que mudou. */
  sincronizarMaterias: async (turmaId: number, materiaIdsAtuais: number[], materiaIdsNovos: number[]): Promise<void> => {
    const paraVincular = materiaIdsNovos.filter((id) => !materiaIdsAtuais.includes(id));
    const paraDesvincular = materiaIdsAtuais.filter((id) => !materiaIdsNovos.includes(id));

    for (const materiaId of paraVincular) {
      await turmaService.vincularMateria(turmaId, materiaId);
    }
    for (const materiaId of paraDesvincular) {
      await turmaService.desvincularMateria(turmaId, materiaId);
    }
  },
};
