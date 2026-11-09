import { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { FormatoRelatorio, gestaoService } from '../../services/gestaoService';
import { common } from '../../styles/common';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { StatPill } from '../../components/StatPill';
import { ProgressBar } from '../../components/ProgressBar';
import { ChipRow } from '../../components/ChipRow';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';

const TODOS = '__todos__';

/** Relatório de desempenho (web: /relatorios): filtro por período e exportação em PDF/Excel. */
export default function RelatoriosScreen() {
  const { colors } = useAppTheme();
  const [periodos, setPeriodos] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState<string>(TODOS);
  const [exportando, setExportando] = useState<FormatoRelatorio | null>(null);

  useEffect(() => {
    gestaoService.periodos().then(setPeriodos).catch(() => setPeriodos([]));
  }, []);

  const buscar = useCallback(() => gestaoService.desempenho(periodo === TODOS ? undefined : periodo), [periodo]);
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(buscar);

  const exportar = async (formato: FormatoRelatorio) => {
    setExportando(formato);
    try {
      const ok = await gestaoService.exportarDesempenho(formato, periodo === TODOS ? undefined : periodo);
      if (!ok) Alert.alert('Compartilhamento indisponível', 'Este aparelho não permite compartilhar arquivos.');
    } catch (e) {
      Alert.alert('Não foi possível exportar', getErrorMessage(e, 'Tente de novo em instantes.'));
    } finally {
      setExportando(null);
    }
  };

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      {periodos.length > 0 && (
        <ChipRow
          valor={periodo}
          onChange={setPeriodo}
          opcoes={[{ valor: TODOS, rotulo: 'Todos os períodos' }, ...periodos.map((p) => ({ valor: p, rotulo: p }))]}
        />
      )}
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (
          <>
            <View style={common.pills}>
              <StatPill icon="checkmark-circle-outline" value={`${dados.taxaAprovacao}%`} label="Aprovação" color={colors.brand.green} />
              <StatPill icon="trending-up-outline" value={dados.mediaGeral} label="Média geral" color={colors.brand.purple} />
              <StatPill icon="calendar-outline" value={`${dados.frequenciaMedia}%`} label="Frequência" color={colors.accents.blue} />
              <StatPill icon="flash-outline" value={`${dados.engajamentoMedio}%`} label="Engajamento" color={colors.accents.orange} />
            </View>

            <Text style={[common.section, { color: colors.text }]}>Exportar</Text>
            <View style={common.row}>
              <Button title="PDF" icon="document-outline" variant="outline" loading={exportando === 'pdf'} disabled={!!exportando} onPress={() => exportar('pdf')} style={common.flex} />
              <Button title="Excel" icon="grid-outline" variant="outline" loading={exportando === 'xlsx'} disabled={!!exportando} onPress={() => exportar('xlsx')} style={common.flex} />
            </View>

            <Text style={[common.section, { color: colors.text }]}>Por turma ({dados.totalAlunos} alunos)</Text>
            {dados.turmas.length === 0 ? (
              <EmptyState icon="bar-chart-outline" title="Sem notas lançadas neste período" />
            ) : (
              dados.turmas.map((t) => (
                <Card key={t.turma} style={common.card}>
                  <View style={common.between}>
                    <Text style={[common.title, common.flex, { color: colors.text }]}>{t.turma}</Text>
                    <Text style={[common.title, { color: colors.brand.purple }]}>{t.media.toFixed(1)}</Text>
                  </View>
                  <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>
                    {t.alunos} alunos · frequência {t.frequencia}%
                  </Text>
                  <ProgressBar percent={Math.min(100, t.media * 10)} color={colors.brand.deep} />
                </Card>
              ))
            )}
            <View style={common.fim} />
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
