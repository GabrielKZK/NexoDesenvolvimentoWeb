import { api } from './client';
import { Materia, MateriaInput } from '../types/models';

// O backend (MateriaController) tem uma inconsistência conhecida:
// GET /materias e GET /materias/nome retornam a ENTIDADE completa (com
// listas aninhadas de turmas/alunos), enquanto os demais endpoints
// retornam o MateriaDto (com turmaIds/alunoIds). Normalizamos aqui para
// que o restante do app sempre enxergue o mesmo formato.
function normalizar(raw: any): Materia {
  const turmaIds: number[] = raw.turmaIds ?? (raw.turmas ?? []).map((t: any) => t.id);
  const alunoIds: number[] = raw.alunoIds ?? (raw.alunos ?? []).map((a: any) => a.id);
  return {
    id: raw.id,
    nome: raw.nome,
    segmento: raw.segmento,
    turmaIds,
    alunoIds,
  };
}

export const materiaService = {
  listarTodas: async (): Promise<Materia[]> => {
    const { data } = await api.get<any[]>('/materias');
    return Array.isArray(data) ? data.map(normalizar) : [];
  },

  buscarPorId: async (id: number): Promise<Materia> => {
    const { data } = await api.get<any>(`/materias/${id}`);
    return normalizar(data);
  },

  buscarPorNome: async (nome: string): Promise<Materia[]> => {
    const { data } = await api.get<any[]>('/materias/nome', { params: { nome } });
    return Array.isArray(data) ? data.map(normalizar) : [];
  },

  criar: async (dto: MateriaInput): Promise<Materia> => {
    const { data } = await api.post<any>('/materias', dto);
    return normalizar(data);
  },

  alterar: async (id: number, dto: MateriaInput): Promise<Materia> => {
    const { data } = await api.put<any>(`/materias/${id}`, dto);
    return normalizar(data);
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/materias/${id}`);
  },
};
