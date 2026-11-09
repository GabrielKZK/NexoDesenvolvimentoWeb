import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { alunoService } from '../../services/alunoService';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { StatPill } from '../../components/StatPill';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './styles';

/** XP por nível e títulos — mesma regra de meus-niveis-notas.ts do web. */
const XP_POR_NIVEL = 400;
const tituloNivel = (n: number) =>
  n < 5 ? 'Iniciante' : n < 10 ? 'Estudante Dedicado' : n < 15 ? 'Avançado' : 'Mestre dos Estudos';

const fmt = (n: number | null) => (n === null ? '—' : n.toFixed(1));

/** Níveis e notas do aluno (web: /meus-niveis-notas → /aluno/dashboard + /aluno/notas). */
export default function NotasScreen() {
  const { colors } = useAppTheme();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(async () => {
    const [dash, notas] = await Promise.all([alunoService.dashboard(), alunoService.notas()]);
    return { dash, notas };
  });

  const medias = (dados?.notas ?? []).map((n) => n.media).filter((m): m is number => m !== null);
  const mediaGeral = medias.length ? medias.reduce((s, m) => s + m, 0) / medias.length : null;
  const melhor = medias.length ? Math.max(...medias) : null;
  const xpAtual = dados ? dados.dash.xpTotal % XP_POR_NIVEL : 0;

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (
          <>
            <Card style={styles.card}>
              <Text style={[styles.nivel, { color: colors.text }]}>
                Nível {dados.dash.nivel} · {tituloNivel(dados.dash.nivel)}
              </Text>
              <Text style={[styles.sub, { color: colors.textSecondary }]}>
                {xpAtual} / {XP_POR_NIVEL} XP — faltam {XP_POR_NIVEL - xpAtual} para o nível {dados.dash.nivel + 1}
              </Text>
              <ProgressBar percent={(xpAtual / XP_POR_NIVEL) * 100} height={10} />
            </Card>

            <View style={styles.pills}>
              <StatPill icon="stats-chart-outline" value={fmt(mediaGeral)} label="Média geral" color={colors.brand.purple} />
              <StatPill icon="trending-up-outline" value={fmt(melhor)} label="Melhor nota" color={colors.brand.green} />
              <StatPill icon="flash-outline" value={dados.dash.xpTotal} label="XP total" color={colors.accents.blue} />
              <StatPill
                icon="trophy-outline"
                value={dados.dash.foraDoRanking ? '—' : `#${dados.dash.posicao}`}
                label="Ranking"
                color={colors.accents.amber}
              />
            </View>

            <Text style={[styles.secao, { color: colors.text }]}>Notas por disciplina</Text>
            {dados.notas.length === 0 ? (
              <EmptyState icon="document-text-outline" title="Ainda não há notas lançadas" />
            ) : (
              dados.notas.map((n) => (
                <Card key={n.disciplina} style={styles.card}>
                  <View style={styles.linha}>
                    <Text style={[styles.disciplina, { color: colors.text }]}>{n.disciplina}</Text>
                    <Text style={[styles.media, { color: colors.brand.purple }]}>{fmt(n.media)}</Text>
                  </View>
                  <Text style={[styles.sub, { color: colors.textSecondary }]}>
                    P1 {fmt(n.p1)} · P2 {fmt(n.p2)} · T1 {fmt(n.t1)} · Participação {fmt(n.participacao)}
                  </Text>
                </Card>
              ))
            )}
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
