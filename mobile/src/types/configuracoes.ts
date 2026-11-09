/**
 * Configurações do aluno — espelho de configuracao-aluno.model.ts do web.
 * Seções vêm de GET /api/configuracoes; cada seção é gravada por PATCH /api/configuracoes/{secao}.
 */
export interface AlunoGamificacaoConfig {
  exibirXpTempoReal: boolean;
  animacoesConquista: boolean;
  /** Mostrar o quadro de ranking da turma no dashboard (preferência de exibição). */
  rankingTurma: boolean;
}

export interface AlunoPrivacidadeConfig {
  perfilPublico: boolean;
  /** Aparecer no ranking dos colegas. Desligado → o dashboard vem com foraDoRanking=true. */
  exibirNoRanking: boolean;
}

/** Só as seções que o app já usa; as demais ficam como o servidor devolveu (não são tocadas). */
export interface AlunoSettings {
  gamificacao: AlunoGamificacaoConfig;
  privacidade: AlunoPrivacidadeConfig;
}

export type SecaoAluno = keyof AlunoSettings;

/** Defaults idênticos aos do backend (ConfiguracaoService.defaultsPara(ALUNO)). */
export const ALUNO_DEFAULTS: AlunoSettings = {
  gamificacao: { exibirXpTempoReal: true, animacoesConquista: true, rankingTurma: true },
  privacidade: { perfilPublico: true, exibirNoRanking: true },
};
