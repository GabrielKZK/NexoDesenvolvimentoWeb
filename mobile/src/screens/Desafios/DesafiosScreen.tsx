import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { alunoService } from '../../services/alunoService';
import { RootStackParamList } from '../../navigation/types';
import { NivelDesafio, StatusDesafio } from '../../types/desafios';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Chip } from '../../components/Chip';
import { StatPill } from '../../components/StatPill';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './styles';

type Filtro = 'todos' | StatusDesafio;

const NIVEL: Record<NivelDesafio, string> = { FACIL: 'Fácil', MEDIO: 'Médio', DIFICIL: 'Difícil' };
const STATUS: Record<StatusDesafio, string> = { ABERTO: 'Não iniciado', PROGRESSO: 'Em andamento', CONCLUIDO: 'Concluído' };
const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'ABERTO', rotulo: 'Não iniciados' },
  { valor: 'PROGRESSO', rotulo: 'Em andamento' },
  { valor: 'CONCLUIDO', rotulo: 'Concluídos' },
];

/** Catálogo de desafios do aluno (web: /desafios → GET /api/aluno/desafios). */
export default function DesafiosScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(alunoService.desafios);
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const corNivel: Record<NivelDesafio, string> = {
    FACIL: colors.status.success,
    MEDIO: colors.status.warning,
    DIFICIL: colors.status.danger,
  };

  const lista = useMemo(
    () => (dados?.desafios ?? []).filter((d) => filtro === 'todos' || d.status === filtro),
    [dados, filtro],
  );

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (
          <>
            <View style={styles.pills}>
              <StatPill icon="trophy-outline" value={dados.stats.concluidos} label="Concluídos" color={colors.accents.amber} />
              <StatPill icon="locate-outline" value={`${dados.stats.taxaSucesso}%`} label="Taxa de sucesso" color={colors.brand.green} />
              <StatPill icon="flame-outline" value={dados.stats.sequenciaDias} label="Sequência (dias)" color={colors.accents.orange} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
              {FILTROS.map((f) => (
                <Chip key={f.valor} label={f.rotulo} selected={filtro === f.valor} onPress={() => setFiltro(f.valor)} />
              ))}
            </ScrollView>

            {lista.length === 0 ? (
              <EmptyState icon="trophy-outline" title="Nenhum desafio aqui" subtitle="Troque o filtro para ver outros." />
            ) : (
              lista.map((d) => (
                <Pressable
                  key={d.id}
                  onPress={() => navigation.navigate('Quiz', { desafioId: d.id, titulo: d.titulo })}
                  accessibilityRole="button"
                  accessibilityLabel={`${d.titulo}, ${STATUS[d.status]}`}
                >
                  <Card style={styles.card}>
                    <Text style={[styles.titulo, { color: colors.text }]}>{d.titulo}</Text>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                      {d.materia} · {d.tempoMin} min · {d.xp} XP
                    </Text>
                    <View style={styles.badges}>
                      <Badge label={NIVEL[d.nivel]} color={corNivel[d.nivel]} />
                      <Badge label={STATUS[d.status]} color={d.status === 'CONCLUIDO' ? colors.brand.green : colors.accents.blue} />
                    </View>
                    {d.status === 'PROGRESSO' && <ProgressBar percent={d.progresso} color={colors.accents.blue} />}
                  </Card>
                </Pressable>
              ))
            )}
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
