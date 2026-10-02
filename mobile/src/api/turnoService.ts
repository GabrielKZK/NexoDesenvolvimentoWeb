import { api } from './client';
import { Turno, TurnoInput } from '../types/models';

// Rotas espelham TurnoController: @RequestMapping("/api/turnos")
export const turnoService = {
  listarTodos: async (): Promise<Turno[]> => {
    const { data } = await api.get<Turno[]>('/api/turnos');
    return data;
  },

  buscarPorId: async (id: number): Promise<Turno> => {
    const { data } = await api.get<Turno>(`/api/turnos/${id}`);
    return data;
  },

  criar: async (dto: TurnoInput): Promise<Turno> => {
    const { data } = await api.post<Turno>('/api/turnos', dto);
    return data;
  },

  atualizar: async (id: number, dto: TurnoInput): Promise<Turno> => {
    const { data } = await api.put<Turno>(`/api/turnos/${id}`, dto);
    return data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/api/turnos/${id}`);
  },
};
