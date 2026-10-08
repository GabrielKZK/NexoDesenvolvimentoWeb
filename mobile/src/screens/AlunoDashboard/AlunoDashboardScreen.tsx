import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../hooks/useAuth';
import { alunoService } from '../../services/alunoService';
import { Aluno } from '../../types/models';
import { createStyles } from './styles';
import { AlunoDashboardScreenProps } from './types';

export default function AlunoDashboardScreen({ navigation }: AlunoDashboardScreenProps) {
  const { aluno, setAluno, logout } = useAuth();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [ranking, setRanking] = useState<Aluno[]>([]);
  const [progresso, setProgresso] = useState(0);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [novaMeta, setNovaMeta] = useState(String(aluno?.metaSemanalXp ?? ''));
  const [actionError, setActionError] = useState<string | null>(null);

  const alunoId = aluno?.id;

  const carregarDados = useCallback(async () => {
    if (alunoId === undefined) return;
    try {
      setLoadingRanking(true);
      const [top10, prog] = await Promise.all([
        alunoService.top10Geral(),
        alunoService.progressoDaMetaSemanal(alunoId),
      ]);
      setRanking(top10);
      setProgresso(prog);
    } catch {
      setActionError('Não foi possível carregar o ranking.');
    } finally {
      setLoadingRanking(false);
    }
  }, [alunoId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  if (!aluno) return null;

  const handleConcluirTarefa = async () => {
    try {
      setActionError(null);
      setAluno(await alunoService.concluirTarefa(aluno.id));
      setProgresso(await alunoService.progressoDaMetaSemanal(aluno.id));
    } catch {
      setActionError('Não foi possível concluir a tarefa.');
    }
  };

  const handleSalvarMeta = async () => {
    const xp = parseInt(novaMeta, 10);
    if (Number.isNaN(xp) || xp <= 0) {
      setActionError('Informe uma meta de XP válida.');
      return;
    }
    try {
      setActionError(null);
      setAluno(await alunoService.definirMetaSemanal(aluno.id, xp));
      setProgresso(await alunoService.progressoDaMetaSemanal(aluno.id));
    } catch {
      setActionError('Não foi possível salvar a meta.');
    }
  };

  const tarefasConcluidas = aluno.tarefasFeitasHoje >= aluno.tarefasHoje;

  return (
    <FlatList
      style={styles.container}
      data={ranking}
      keyExtractor={(item, index) => `${item.id ?? item.emailInstitucional ?? index}`}
      ListHeaderComponent={
        <View>
          <View style={styles.header}>
            <View>
              <Text style={styles.nome}>{aluno.nome}</Text>
              <Text style={styles.email}>{aluno.emailInstitucional}</Text>
            </View>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.logout}>Sair</Text>
            </TouchableOpacity>
          </View>

          {actionError && <Text style={styles.error}>{actionError}</Text>}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{aluno.xpTotal}</Text>
              <Text style={styles.statLabel}>XP total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>🔥 {aluno.ofensivaDias}</Text>
              <Text style={styles.statLabel}>dias de ofensiva</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.materiasButton} onPress={() => navigation.navigate('AlunoMaterias')}>
            <Text style={styles.buttonText}>📚 Minhas matérias</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Meta semanal</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {aluno.xpSemana} / {aluno.metaSemanalXp} XP ({progresso}%)
          </Text>
          <View style={styles.metaRow}>
            <TextInput
              style={styles.metaInput}
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={novaMeta}
              onChangeText={setNovaMeta}
            />
            <TouchableOpacity style={styles.metaButton} onPress={handleSalvarMeta}>
              <Text style={styles.metaButtonText}>Salvar meta</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Tarefas de hoje</Text>
          <Text style={styles.tarefasLabel}>
            {aluno.tarefasFeitasHoje} / {aluno.tarefasHoje} concluídas
          </Text>
          <TouchableOpacity
            style={[styles.button, tarefasConcluidas && styles.buttonDisabled]}
            onPress={handleConcluirTarefa}
            disabled={tarefasConcluidas}
          >
            <Text style={styles.buttonText}>
              {tarefasConcluidas ? 'Todas as tarefas concluídas' : 'Concluir tarefa'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>🏆 Ranking geral - Top 10</Text>
          {loadingRanking && <ActivityIndicator color={colors.brand.purple} style={styles.loading} />}
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={styles.rankingRow}>
          <Text style={styles.rankingPosicao}>{index + 1}º</Text>
          <Text style={styles.rankingNome}>{item.nome}</Text>
          <Text style={styles.rankingXp}>{item.xpTotal} XP</Text>
        </View>
      )}
    />
  );
}
