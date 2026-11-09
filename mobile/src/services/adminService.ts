import { api } from './api';
import {
  AlunoCriado,
  CadastroAlunoRequest,
  CadastroProfessorRequest,
  ContaDTO,
  ConteudoAdminDTO,
  DashboardAdminDTO,
  DesafioAdminDTO,
  EventoAuditoriaDTO,
  InscricaoDTO,
  LogAplicacaoDTO,
  MateriaCatalogoDTO,
  MateriaDTO,
  NivelLog,
  PageEnvelope,
  PapelConta,
  ProfessorCriado,
  ResumoSistemaDTO,
  SenhaRedefinidaDTO,
  TipoEvento,
  TurmaDTO,
} from '../types/api';

interface Paginacao {
  page?: number;
  size?: number;
}

/** Contas, catálogo e logs. /api/admin é de ADMIN e DIRETOR; /api/auditoria só de ADMIN. */
export const adminService = {
  dashboard: () => api.get<DashboardAdminDTO>('/admin/dashboard').then((r) => r.data),

  contas: (filtro: { papel?: PapelConta; busca?: string } & Paginacao = {}) =>
    api.get<PageEnvelope<ContaDTO>>('/admin/contas', { params: filtro }).then((r) => r.data),
  /** Desativar derruba as sessões abertas da conta. */
  atualizarAtivo: (id: number, ativo: boolean) =>
    api.patch<ContaDTO>(`/admin/contas/${id}/ativo`, { ativo }).then((r) => r.data),
  /** A senha em claro só existe nesta resposta. */
  redefinirSenha: (id: number) =>
    api.post<SenhaRedefinidaDTO>(`/admin/contas/${id}/senha-provisoria`, {}).then((r) => r.data),

  catalogo: () => api.get<MateriaCatalogoDTO[]>('/admin/catalogo').then((r) => r.data),
  conteudosDaMateria: (materiaId: number) =>
    api.get<ConteudoAdminDTO[]>(`/admin/catalogo/materias/${materiaId}/conteudos`).then((r) => r.data),
  publicarConteudo: (id: number, publicado: boolean) =>
    api.patch<ConteudoAdminDTO>(`/admin/catalogo/conteudos/${id}/publicado`, { publicado }).then((r) => r.data),
  /** A ordem é do conjunto: vai a lista inteira da matéria, na sequência desejada. */
  reordenar: (materiaId: number, conteudoIds: number[]) =>
    api.patch<ConteudoAdminDTO[]>(`/admin/catalogo/materias/${materiaId}/ordem`, { conteudoIds }).then((r) => r.data),
  desafios: () => api.get<DesafioAdminDTO[]>('/admin/catalogo/desafios').then((r) => r.data),
  publicarDesafio: (id: number, publicado: boolean) =>
    api.patch<DesafioAdminDTO>(`/admin/catalogo/desafios/${id}/publicado`, { publicado }).then((r) => r.data),

  eventos: (filtro: { tipo?: TipoEvento; busca?: string; periodo?: number } & Paginacao = {}) =>
    api.get<PageEnvelope<EventoAuditoriaDTO>>('/auditoria/eventos', { params: filtro }).then((r) => r.data),
  logsSistema: (filtro: { nivel?: NivelLog; busca?: string; periodo?: number } & Paginacao = {}) =>
    api.get<PageEnvelope<LogAplicacaoDTO>>('/auditoria/sistema/logs', { params: filtro }).then((r) => r.data),
  resumoSistema: () => api.get<ResumoSistemaDTO>('/auditoria/sistema/resumo').then((r) => r.data),
};

/** Inscrições aluno↔turma (DIRETOR e ADMIN). */
export const inscricoesService = {
  listar: (filtro: { ativo?: boolean; turma?: number; busca?: string } & Paginacao = {}) =>
    api.get<PageEnvelope<InscricaoDTO>>('/inscricoes', { params: filtro }).then((r) => r.data),
  atualizarAtivo: (id: number, ativo: boolean) =>
    api.patch<InscricaoDTO>(`/inscricoes/${id}/ativo`, { ativo }).then((r) => r.data),
  transferirTurma: (id: number, turmaId: number) =>
    api.patch<InscricaoDTO>(`/inscricoes/${id}/turma`, { turmaId }).then((r) => r.data),
};

/** Cadastros: aluno (DIRETOR e ADMIN) e professor (só DIRETOR). Login e senha são gerados no servidor. */
export const cadastroService = {
  turmas: () => api.get<TurmaDTO[]>('/turmas').then((r) => r.data),
  materias: () => api.get<MateriaDTO[]>('/materias').then((r) => r.data),
  cadastrarAluno: (dados: CadastroAlunoRequest) => api.post<AlunoCriado>('/alunos', dados).then((r) => r.data),
  cadastrarProfessor: (dados: CadastroProfessorRequest) =>
    api.post<ProfessorCriado>('/professores', dados).then((r) => r.data),
};
