/** Contratos de /api/aluno/desafios — espelho de nexo/src/app/api/desafios.service.ts (web). */

export type NivelDesafio = 'FACIL' | 'MEDIO' | 'DIFICIL';
export type StatusDesafio = 'ABERTO' | 'PROGRESSO' | 'CONCLUIDO';

export interface DesafioDTO {
  id: number;
  titulo: string;
  materia: string;
  nivel: NivelDesafio;
  xp: number;
  tempoMin: number;
  status: StatusDesafio;
  progresso: number;
  /** Só vem preenchido quando o aluno gabaritou o desafio. */
  acertos: number | null;
  totalPerguntas: number | null;
  /** Quantas vezes o aluno já enviou o quiz (reprovadas incluídas). */
  tentativas: number;
}

export interface DesafiosStats {
  concluidos: number;
  total: number;
  taxaSucesso: number;
  sequenciaDias: number;
}

export interface DesafiosResponse {
  stats: DesafiosStats;
  desafios: DesafioDTO[];
}

export interface QuizPerguntaDTO {
  id: number;
  enunciado: string;
  alternativas: string[];
  /** Só vem preenchido para quem já gabaritou o desafio (modo revisão). */
  respostaCorreta: number | null;
}

export interface RespostaItem {
  perguntaId: number;
  alternativaEscolhida: number;
}

export interface QuizResultadoDTO {
  /** Acertou 100% — única forma de concluir o desafio e ganhar XP. */
  aprovado: boolean;
  /** null em tentativa reprovada: o aluno não vê quantas errou. */
  acertos: number | null;
  totalPerguntas: number;
  xpGanho: number;
  status: string;
  tentativas: number;
}
