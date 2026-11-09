import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { gestaoService } from '../../services/gestaoService';
import { common } from '../../styles/common';
import { tempoRelativo } from '../../utils/tempo';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { StatPill } from '../../components/StatPill';
import { ProgressBar } from '../../components/ProgressBar';
import { Avatar } from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';

const buscar = async () => {
  const [desempenho, risco, docentes] = await Promise.all([
    gestaoService.desempenho(),
    gestaoService.riscoEvasao(),
    gestaoService.monitoramentoProfessores(),
  ]);
  return { desempenho, risco, docentes };
};

/** Painel do diretor (web: /diretor-dashboards): KPIs, alertas, alunos em risco e turmas. */
export default function DiretorDashboardScreen() {
  const { colors } = useAppTheme();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(buscar);

  const corRisco = (r: string) => (r === 'ALTO' ? colors.status.danger : colors.status.warning);

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (() => {
          const { desempenho: d, risco, docentes } = dados;
          const total = risco.length || d.totalAlunos;
          const altos = risco.filter((a) => a.risco === 'ALTO').length;
          const taxaEvasao = total ? Math.round((altos / total) * 1000) / 10 : 0;
          const baixaFreq = risco.filter((a) => a.percentualFaltas > 40).length;
          const pendentes = docentes.reduce((s, p) => s + p.correcoesPendentes, 0);
          const emRisco = risco.filter((a) => a.risco !== 'BAIXO').slice(0, 3);

          const alertas: { titulo: string; desc: string; grave: boolean }[] = [];
          if (altos > 0) alertas.push({ titulo: 'Risco de evasão', desc: `${altos} aluno(s) com risco alto`, grave: true });
          if (pendentes > 0)
            alertas.push({ titulo: 'Correções pendentes', desc: `${pendentes} aguardando os professores`, grave: pendentes > 20 });
          if (baixaFreq > 0)
            alertas.push({ titulo: 'Baixa frequência', desc: `${baixaFreq} aluno(s) com mais de 40% de faltas`, grave: true });

          return (
            <>
              <View style={common.pills}>
                <StatPill icon="people-outline" value={d.totalAlunos} label="Alunos" color={colors.accents.blue} />
                <StatPill icon="person-remove-outline" value={`${taxaEvasao}%`} label="Evasão (risco alto)" color={colors.status.danger} />
                <StatPill icon="flash-outline" value={`${d.engajamentoMedio}%`} label="Engajamento" color={colors.brand.green} />
                <StatPill icon="trending-up-outline" value={d.mediaGeral} label="Média geral" color={colors.brand.purple} />
              </View>

              <Text style={[common.section, { color: colors.text }]}>Alertas</Text>
              {alertas.length === 0 ? (
                <Text style={[common.sub, { color: colors.textSecondary }]}>Nenhum alerta no momento.</Text>
              ) : (
                alertas.map((a) => (
                  <Card key={a.titulo} style={common.card}>
                    <View style={common.between}>
                      <Text style={[common.title, common.flex, { color: colors.text }]}>{a.titulo}</Text>
                      <Badge label={a.grave ? 'Alta' : 'Média'} color={a.grave ? colors.status.danger : colors.status.warning} />
                    </View>
                    <Text style={[common.sub, { color: colors.textSecondary }]}>{a.desc}</Text>
                  </Card>
                ))
              )}

              <Text style={[common.section, { color: colors.text }]}>Alunos em risco</Text>
              {emRisco.length === 0 ? (
                <Text style={[common.sub, { color: colors.textSecondary }]}>Nenhum aluno em risco.</Text>
              ) : (
                emRisco.map((a) => (
                  <Card key={a.alunoId} style={common.card}>
                    <View style={common.row}>
                      <Avatar nome={a.nome} foto={a.foto} size={40} />
                      <View style={common.flex}>
                        <Text style={[common.title, { color: colors.text }]} numberOfLines={1}>
                          {a.nome}
                        </Text>
                        <Text style={[common.sub, { color: colors.textSecondary }]}>
                          {a.turma ?? 'Sem turma'} · frequência {Math.max(0, Math.round(100 - a.percentualFaltas))}%
                          {a.ultimoAcessoEm ? ` · ${tempoRelativo(a.ultimoAcessoEm)}` : ''}
                        </Text>
                      </View>
                      <Badge label={a.risco === 'ALTO' ? 'Alto' : 'Médio'} color={corRisco(a.risco)} />
                    </View>
                  </Card>
                ))
              )}

              <Text style={[common.section, { color: colors.text }]}>Desempenho por turma</Text>
              {d.turmas.length === 0 ? (
                <EmptyState icon="bar-chart-outline" title="Sem dados de turmas" />
              ) : (
                d.turmas.map((t) => (
                  <Card key={t.turma} style={common.card}>
                    <View style={common.between}>
                      <Text style={[common.title, common.flex, { color: colors.text }]}>{t.turma}</Text>
                      <Text style={[common.title, { color: colors.brand.purple }]}>{t.media.toFixed(1)}</Text>
                    </View>
                    <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>
                      {t.alunos} alunos · frequência {t.frequencia}%
                    </Text>
                    <ProgressBar percent={t.frequencia} color={colors.brand.deep} />
                  </Card>
                ))
              )}
              <View style={common.fim} />
            </>
          );
        })()}
      </AsyncState>
    </ScreenContainer>
  );
}
