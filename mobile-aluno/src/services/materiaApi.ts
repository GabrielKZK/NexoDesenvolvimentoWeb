import api from "./api";
import { MateriaDTO } from "../types/materia";

// O backend responde 204 (sem corpo) quando não há matérias.
export async function listarMaterias(): Promise<MateriaDTO[]> {
  const response = await api.get<MateriaDTO[]>("/api/materias");
  return Array.isArray(response.data) ? response.data : [];
}

export async function buscarMateria(id: number): Promise<MateriaDTO> {
  const response = await api.get<MateriaDTO>(`/api/materias/${id}`);
  return response.data;
}
