import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { gestaoService } from '../../services/gestaoService';
import { RootStackParamList } from '../../navigation/types';
import { ProfessorMonitorDTO } from '../../types/api';
import { common } from '../../styles/common';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';

/** Monitoramento docente (web: /monitoramento): carga de correção, resposta e botão de conversa. */
export default function MonitoramentoScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(gestaoService.monitoramentoProfessores);

  const conversar = (p: ProfessorMonitorDTO) => {
    if (p.usuarioId === null) return;
    navigation.navigate('Conversa', { contato: { id: p.usuarioId, nome: p.nome, papel: 'PROFESSOR', foto: p.foto } });
  };

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && dados.length === 0 ? (
          <EmptyState icon="people-outline" title="Nenhum professor cadastrado" />
        ) : (
          dados?.map((p) => {
            const pct = p.tarefasTotal ? Math.round((p.tarefasConcluidas / p.tarefasTotal) * 100) : 0;
            return (
              <Card key={p.id} style={common.card}>
                <View style={common.row}>
                  <Avatar nome={p.nome} foto={p.foto} size={44} />
                  <View style={common.flex}>
                    <Text style={[common.title, { color: colors.text }]} numberOfLines={1}>
                      {p.nome}
                    </Text>
                    <Text style={[common.sub, { color: colors.textSecondary }]} numberOfLines={2}>
                      {p.disciplina}
                      {p.turmas ? ` · ${p.turmas}` : ''}
                    </Text>
                  </View>
                  <Badge label={p.status} color={colors.brand.purple} />
                </View>
                <Text style={[common.sub, { color: colors.textSecondary, marginTop: 10 }]}>
                  Correções pendentes: {p.correcoesPendentes} · resposta em {p.tempoRespostaDias} dia(s) · {p.interacoesSemana} interações na semana · avaliação {p.avaliacao.toFixed(1)}
                </Text>
                <Text style={[common.sub, { color: colors.textSecondary, marginTop: 6, marginBottom: 6 }]}>
                  Tarefas: {p.tarefasConcluidas}/{p.tarefasTotal}
                </Text>
                <ProgressBar percent={pct} color={colors.brand.deep} />
                {p.usuarioId !== null && (
                  <Button title="Conversar" icon="chatbubble-outline" variant="outline" onPress={() => conversar(p)} style={{ marginTop: 12 }} />
                )}
              </Card>
            );
          })
        )}
        <View style={common.fim} />
      </AsyncState>
    </ScreenContainer>
  );
}
