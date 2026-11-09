import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { useConfiguracoes } from '../../hooks/useConfiguracoes';
import { alunoService } from '../../services/alunoService';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { StatPill } from '../../components/StatPill';
import { EmptyState } from '../../components/EmptyState';
import { tempoRelativo } from '../../utils/tempo';
import { styles } from './styles';

/** Dashboard do aluno (web: Dashboards → GET /api/aluno/dashboard). */
export default function AlunoDashboardScreen() {
  const { colors } = useAppTheme();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(alunoService.dashboard);
  const mostrarRanking = useConfiguracoes().aluno.gamificacao.rankingTurma;

  const pctMeta = dados && dados.metaSemanalXp ? Math.min(100, Math.round((dados.xpSemana / dados.metaSemanalXp) * 100)) : 0;
  const pctTarefas = dados && dados.tarefasHoje ? Math.round((dados.tarefasFeitasHoje / dados.tarefasHoje) * 100) : 0;

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (
          <>
            <Text style={[styles.saudacao, { color: colors.text }]}>Olá, {dados.nome.split(' ')[0]}!</Text>
            {!!dados.turmaNome && <Text style={[styles.sub, { color: colors.textSecondary }]}>{dados.turmaNome}</Text>}

            <View style={styles.pills}>
              <StatPill icon="flash-outline" value={dados.xpTotal} label="XP total" color={colors.accents.amber} />
              <StatPill icon="flame-outline" value={dados.ofensivaDias} label="Ofensiva (dias)" color={colors.accents.orange} />
              <StatPill icon="ribbon-outline" value={`Nível ${dados.nivel}`} label="Nível" color={colors.accents.indigo} />
            </View>

            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Meta semanal</Text>
              <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                {dados.xpSemana} de {dados.metaSemanalXp} XP ({pctMeta}%)
              </Text>
              <ProgressBar percent={pctMeta} color={colors.brand.deep} height={10} />
            </Card>

            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Tarefas de hoje</Text>
              <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                {dados.tarefasFeitasHoje} de {dados.tarefasHoje} concluídas
              </Text>
              <ProgressBar percent={pctTarefas} color={colors.accents.blue} height={10} />
            </Card>

            <Text style={[styles.section, { color: colors.text }]}>Atividades recentes</Text>
            {dados.atividades.length === 0 ? (
              <EmptyState icon="school-outline" title="Nada por aqui ainda" subtitle="Conclua conteúdos e desafios para ganhar XP." />
            ) : (
              dados.atividades.map((a, i) => (
                <Card key={`${a.titulo}-${i}`} style={styles.card}>
                  <View style={styles.row}>
                    <View style={styles.flex}>
                      <Text style={[styles.cardTitle, { color: colors.text }]}>{a.titulo}</Text>
                      <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                        {a.materia} · {tempoRelativo(a.criadaEm)}
                      </Text>
                    </View>
                    <Text style={[styles.xp, { color: colors.brand.green }]}>+{a.xp} XP</Text>
                  </View>
                </Card>
              ))
            )}

            {/* Preferência de exibição (Configurações → Gamificação): esconde o quadro, não tira ninguém do ranking.
                Quem desligou "Exibir no ranking" vem com foraDoRanking=true e sem linha própria. */}
            {mostrarRanking && (
              <Text style={[styles.section, { color: colors.text }]}>Ranking da turma</Text>
            )}
            {mostrarRanking && dados.foraDoRanking && (
              <Text style={[styles.cardSub, { color: colors.textSecondary }]}>Você está fora do ranking.</Text>
            )}
            {mostrarRanking && dados.ranking.map((r) => (
              <Card key={r.posicao} style={r.isMe ? { ...styles.card, borderColor: colors.brand.purple } : styles.card}>
                <View style={styles.row}>
                  <Text style={[styles.pos, { color: colors.textSecondary }]}>#{r.posicao}</Text>
                  <Text style={[styles.flex, styles.rankNome, { color: colors.text }]} numberOfLines={1}>
                    {r.nome}
                    {r.isMe ? ' (você)' : ''}
                  </Text>
                  <Ionicons name="flash" size={14} color={colors.accents.amber} />
                  <Text style={[styles.rankXp, { color: colors.text }]}>{r.xp}</Text>
                </View>
              </Card>
            ))}
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
