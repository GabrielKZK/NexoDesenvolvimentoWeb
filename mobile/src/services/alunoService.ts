import { api } from './api';
import { AlunoDashboardDTO, AlunoNotaDTO, ConteudoMateriaDTO, MateriaProgressoDTO } from '../types/api';
import { DesafiosResponse, DesafioDTO, QuizPerguntaDTO, QuizResultadoDTO, RespostaItem } from '../types/desafios';

/** Endpoints do aluno logado (/api/aluno/**, /api/materias/{id}/conteudos). Papel ALUNO. */
export const alunoService = {
  dashboard: () => api.get<AlunoDashboardDTO>('/aluno/dashboard').then((r) => r.data),
  notas: () => api.get<AlunoNotaDTO[]>('/aluno/notas').then((r) => r.data),

  materias: () => api.get<MateriaProgressoDTO[]>('/aluno/materias').then((r) => r.data),
  conteudos: (materiaId: number) =>
    api.get<ConteudoMateriaDTO[]>(`/materias/${materiaId}/conteudos`).then((r) => r.data),
  conteudosConcluidos: (materiaId: number) =>
    api.get<number[]>(`/aluno/materias/${materiaId}/concluidos`).then((r) => r.data),
  concluirConteudo: (conteudoId: number) => api.put<void>(`/aluno/conteudos/${conteudoId}/concluido`, {}),
  desmarcarConteudo: (conteudoId: number) => api.delete<void>(`/aluno/conteudos/${conteudoId}/concluido`),

  desafios: () => api.get<DesafiosResponse>('/aluno/desafios').then((r) => r.data),
  desafio: (id: number) => api.get<DesafioDTO>(`/aluno/desafios/${id}`).then((r) => r.data),
  perguntas: (id: number) => api.get<QuizPerguntaDTO[]>(`/aluno/desafios/${id}/quiz`).then((r) => r.data),
  finalizarQuiz: (id: number, respostas: RespostaItem[]) =>
    api.post<QuizResultadoDTO>(`/aluno/desafios/${id}/quiz/finalizar`, { respostas }).then((r) => r.data),
};
