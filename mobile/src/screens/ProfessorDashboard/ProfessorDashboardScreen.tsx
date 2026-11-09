import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { professorService } from '../../services/professorService';
import { common } from '../../styles/common';
import { tempoRelativo } from '../../utils/tempo';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { StatPill } from '../../components/StatPill';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';

/** Dashboard do professor (web: /professor-dashboard → GET /api/professor/dashboard). */
export default function ProfessorDashboardScreen() {
  const { colors } = useAppTheme();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(professorService.dashboard);

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (
          <>
            <View style={common.pills}>
              <StatPill icon="people-outline" value={dados.turmasAtivas} label="Turmas ativas" color={colors.accents.blue} />
              <StatPill icon="school-outline" value={dados.totalAlunos} label="Alunos" color={colors.brand.green} />
              <StatPill icon="create-outline" value={dados.correcoesPendentes} label="Correções pendentes" color={colors.accents.orange} />
              <StatPill icon="document-text-outline" value={dados.avaliacoesMes} label="Avaliações no mês" color={colors.brand.purple} />
            </View>

            <Text style={[common.section, { color: colors.text }]}>Minhas turmas</Text>
            {dados.turmas.length === 0 ? (
              <EmptyState icon="people-outline" title="Nenhuma turma atribuída" />
            ) : (
              dados.turmas.map((t, i) => (
                <Card key={`${t.nome}-${t.disciplina}-${i}`} style={common.card}>
                  <View style={common.between}>
                    <Text style={[common.title, common.flex, { color: colors.text }]}>{t.nome}</Text>
                    <Text style={[common.title, { color: colors.brand.purple }]}>{t.mediaGeral.toFixed(1)}</Text>
                  </View>
                  <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>
                    {t.disciplina} · {t.alunos} alunos · progresso {t.progresso}%
                  </Text>
                  <ProgressBar percent={t.progresso} color={colors.brand.deep} />
                </Card>
              ))
            )}

            <Text style={[common.section, { color: colors.text }]}>Próximas aulas</Text>
            {dados.proximasAulas.length === 0 ? (
              <Text style={[common.sub, { color: colors.textSecondary }]}>Nenhuma aula agendada.</Text>
            ) : (
              dados.proximasAulas.map((a, i) => (
                <Card key={`${a.turma}-${a.data}-${i}`} style={common.card}>
                  <Text style={[common.title, { color: colors.text }]}>
                    {a.disciplina} — {a.turma}
                  </Text>
                  <Text style={[common.sub, { color: colors.textSecondary }]}>
                    {a.data} às {a.hora} · Sala {a.sala} · {a.alunos} alunos
                  </Text>
                </Card>
              ))
            )}

            <Text style={[common.section, { color: colors.text }]}>Alunos que precisam de atenção</Text>
            {dados.alunosAtencao.length === 0 ? (
              <Text style={[common.sub, { color: colors.textSecondary }]}>Nenhum aluno em alerta.</Text>
            ) : (
              dados.alunosAtencao.map((a, i) => (
                <Card key={`${a.nome}-${i}`} style={common.card}>
                  <View style={common.between}>
                    <Text style={[common.title, common.flex, { color: colors.text }]} numberOfLines={1}>
                      {a.nome}
                    </Text>
                    <Badge
                      label={a.status === 'critico' ? 'Crítico' : 'Atenção'}
                      color={a.status === 'critico' ? colors.status.danger : colors.status.warning}
                    />
                  </View>
                  <Text style={[common.sub, { color: colors.textSecondary }]}>
                    {a.turma} · média {a.mediaAtual.toFixed(1)} · frequência {a.frequencia}%
                    {a.ultimaAtividade ? ` · ${tempoRelativo(a.ultimaAtividade)}` : ''}
                  </Text>
                </Card>
              ))
            )}

            <Text style={[common.section, { color: colors.text }]}>Atividade recente</Text>
            {dados.atividades.map((a, i) => (
              <Card key={`${a.descricao}-${i}`} style={common.card}>
                <Text style={[common.text, { color: colors.text }]}>{a.descricao}</Text>
                <Text style={[common.sub, { color: colors.textSecondary }]}>
                  {a.turma} · {tempoRelativo(a.criadaEm)}
                </Text>
              </Card>
            ))}
            <View style={common.fim} />
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
