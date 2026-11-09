import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { api } from './api';
import { API_URL } from './config';
import { session } from './session';
import { AlunoRiscoDTO, DesempenhoDTO, ProfessorMonitorDTO, RiscoEvasao } from '../types/api';

export type FormatoRelatorio = 'pdf' | 'xlsx';

const TIPOS: Record<FormatoRelatorio, { mime: string; uti: string }> = {
  pdf: { mime: 'application/pdf', uti: 'com.adobe.pdf' },
  xlsx: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uti: 'org.openxmlformats.spreadsheetml.sheet',
  },
};

/** Evasão, relatórios e monitoramento do diretor (agregações calculadas no servidor; só DIRETOR). */
export const gestaoService = {
  riscoEvasao: (filtro: { risco?: RiscoEvasao; turma?: number; busca?: string } = {}) =>
    api.get<AlunoRiscoDTO[]>('/evasao/risco', { params: filtro }).then((r) => r.data),

  desempenho: (periodo?: string) =>
    api.get<DesempenhoDTO>('/relatorios/desempenho', { params: { periodo } }).then((r) => r.data),

  periodos: () => api.get<string[]>('/relatorios/periodos').then((r) => r.data),

  monitoramentoProfessores: () => api.get<ProfessorMonitorDTO[]>('/monitoramento/professores').then((r) => r.data),

  /**
   * Baixa o relatório (GET /relatorios/desempenho/export) para o cache do app e abre a folha
   * de compartilhamento do sistema. Devolve false se o aparelho não puder compartilhar.
   */
  async exportarDesempenho(formato: FormatoRelatorio, periodo?: string): Promise<boolean> {
    // O download nativo não passa pelo interceptor do axios: uma chamada leve antes renova o
    // access token vencido (15 min) e garante que o Bearer abaixo seja válido.
    await gestaoService.periodos();
    const token = session.accessToken;
    const query = `formato=${formato}${periodo ? `&periodo=${encodeURIComponent(periodo)}` : ''}`;
    const destino = new File(Paths.cache, `relatorio-desempenho${periodo ? `-${periodo}` : ''}.${formato}`);
    const arquivo = await File.downloadFileAsync(`${API_URL}/relatorios/desempenho/export?${query}`, destino, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      idempotent: true,
    });
    if (!(await Sharing.isAvailableAsync())) return false;
    await Sharing.shareAsync(arquivo.uri, {
      mimeType: TIPOS[formato].mime,
      UTI: TIPOS[formato].uti,
      dialogTitle: 'Relatório de desempenho',
    });
    return true;
  },
};
