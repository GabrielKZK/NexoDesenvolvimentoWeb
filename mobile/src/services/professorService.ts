import { api } from './api';
import {
  AlunoResumoDTO,
  AvaliacaoDTO,
  AvisoDTO,
  ConteudoDTO,
  ConversaDTO,
  DuvidaDTO,
  MensagemDTO,
  NotaDTO,
  ObservacaoDTO,
  PresencaAluno,
  ProfessorDashboardDTO,
  QuestaoDTO,
  ResumoFrequencia,
  TurmaDTO,
} from '../types/api';

export type TipoQuestao = 'OBJETIVA' | 'DISSERTATIVA';
export type DificuldadeQuestao = 'FACIL' | 'MEDIA' | 'DIFICIL';

export interface QuestaoInput {
  enunciado: string;
  disciplina?: string;
  tipo?: TipoQuestao;
  dificuldade?: DificuldadeQuestao;
}

export interface NotasInput {
  disciplina?: string;
  periodo?: string;
  p1?: number;
  p2?: number;
  t1?: number;
  participacao?: number;
}

/**
 * Endpoints do professor logado. O recorte (turmas, alunos, matérias) é feito pelo
 * servidor; o papel exigido está em cada @PreAuthorize do backend.
 */
export const professorService = {
  dashboard: () => api.get<ProfessorDashboardDTO>('/professor/dashboard').then((r) => r.data),
  /** Matérias que o docente leciona (nota de matéria alheia é recusada no salvamento). */
  materias: () => api.get<string[]>('/professor/materias').then((r) => r.data),

  // ── Turmas / diário de classe ────────────────────────────────────────────
  turmas: () => api.get<TurmaDTO[]>('/turmas').then((r) => r.data),
  frequenciaDoDia: (turmaId: number, data: string) =>
    api.get<PresencaAluno[]>(`/turmas/${turmaId}/frequencia`, { params: { data } }).then((r) => r.data),
  salvarFrequencia: (turmaId: number, data: string, presencas: { alunoId: number; presente: boolean }[]) =>
    api.post<ResumoFrequencia>(`/turmas/${turmaId}/frequencia`, { data, presencas }).then((r) => r.data),
  historicoConteudos: (turmaId: number) =>
    api.get<ConteudoDTO[]>(`/turmas/${turmaId}/conteudos`).then((r) => r.data),
  registrarConteudo: (
    turmaId: number,
    conteudo: { titulo: string; descricao?: string; observacoes?: string; data?: string },
  ) => api.post<ConteudoDTO>(`/turmas/${turmaId}/conteudos`, conteudo).then((r) => r.data),

  // ── Notas e observações ──────────────────────────────────────────────────
  notasDaTurma: (turmaId: number, disciplina?: string, periodo?: string) =>
    api.get<NotaDTO[]>(`/turmas/${turmaId}/notas`, { params: { disciplina, periodo } }).then((r) => r.data),
  editarNotas: (alunoId: number, notas: NotasInput) =>
    api.patch<NotaDTO>(`/alunos/${alunoId}/notas`, notas).then((r) => r.data),
  alunos: () => api.get<AlunoResumoDTO[]>('/alunos').then((r) => r.data),
  observacoes: (alunoId: number) => api.get<ObservacaoDTO[]>(`/alunos/${alunoId}/observacoes`).then((r) => r.data),
  criarObservacao: (alunoId: number, texto: string) =>
    api.post<ObservacaoDTO>(`/alunos/${alunoId}/observacoes`, { texto }).then((r) => r.data),

  // ── Avaliações e banco de questões ───────────────────────────────────────
  avaliacoes: () => api.get<AvaliacaoDTO[]>('/avaliacoes').then((r) => r.data),
  filaCorrecao: () => api.get<AvaliacaoDTO[]>('/avaliacoes/fila-correcao').then((r) => r.data),
  criarAvaliacao: (a: { titulo: string; turmaId: number; tipo: string; disciplina: string; data?: string }) =>
    api.post<AvaliacaoDTO>('/avaliacoes', a).then((r) => r.data),
  questoes: () => api.get<QuestaoDTO[]>('/questoes').then((r) => r.data),
  criarQuestao: (q: QuestaoInput) => api.post<QuestaoDTO>('/questoes', q).then((r) => r.data),
  atualizarQuestao: (id: number, q: QuestaoInput) => api.put<QuestaoDTO>(`/questoes/${id}`, q).then((r) => r.data),
  excluirQuestao: (id: number) => api.delete<void>(`/questoes/${id}`),

  // ── Comunicação ──────────────────────────────────────────────────────────
  conversas: (caixa: 'entrada' | 'enviada' = 'entrada') =>
    api.get<ConversaDTO[]>('/mensagens', { params: { caixa } }).then((r) => r.data),
  responderConversa: (conversaId: number, texto: string) =>
    api.post<MensagemDTO>(`/mensagens/${conversaId}/responder`, { texto }).then((r) => r.data),
  avisos: () => api.get<AvisoDTO[]>('/avisos').then((r) => r.data),
  publicarAviso: (aviso: { titulo: string; conteudo: string; destino?: string }) =>
    api.post<AvisoDTO>('/avisos', aviso).then((r) => r.data),
  duvidas: () => api.get<DuvidaDTO[]>('/duvidas').then((r) => r.data),
  responderDuvida: (id: number, texto: string) =>
    api.post<DuvidaDTO>(`/duvidas/${id}/responder`, { texto }).then((r) => r.data),
};
