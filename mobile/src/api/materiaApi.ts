import api from './api';
import { Materia } from '../data/materia';

export async function listarMaterias(): Promise<Materia[]> {
  const response = await api.get('/materias');

  return response.data;
}

export async function listarMateriaPorId(
  id: number
): Promise<Materia> {

  const response = await api.get(`/materias/${id}`);

  return response.data;
}
