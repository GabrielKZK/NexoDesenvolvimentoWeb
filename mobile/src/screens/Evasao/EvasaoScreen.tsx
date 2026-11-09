import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { useBuscaDebounce } from '../../hooks/useBuscaDebounce';
import { gestaoService } from '../../services/gestaoService';
import { AlunoRiscoDTO, RiscoEvasao } from '../../types/api';
import { common } from '../../styles/common';
import { tempoRelativo } from '../../utils/tempo';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { ChipRow } from '../../components/ChipRow';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';

const ROTULO: Record<RiscoEvasao, string> = { ALTO: 'Alto', MEDIO: 'Médio', BAIXO: 'Baixo' };

type FiltroRisco = RiscoEvasao | 'TODOS';

/** Gestão de evasão (web: /evasao → GET /api/evasao/risco). Filtros aplicados no servidor. */
export default function EvasaoScreen() {
  const { colors } = useAppTheme();
  const [risco, setRisco] = useState<FiltroRisco>('TODOS');
  const [turma, setTurma] = useState<string>('TODAS');
  const [textoBusca, setTextoBusca] = useState('');
  const busca = useBuscaDebounce(textoBusca);
  const [aberto, setAberto] = useState<number | null>(null);

  // Carrega todos os alunos uma vez; risco, turma e busca filtram no aparelho, sem nova
  // chamada (as turmas vêm dos próprios dados, como no web).
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(() => gestaoService.riscoEvasao());

  const turmas = useMemo(
    () => Array.from(new Set((dados ?? []).map((a) => a.turma ?? 'Sem turma'))).sort(),
    [dados],
  );

  const lista = useMemo(() => {
    const termo = busca.toLowerCase();
    return (dados ?? []).filter(
      (a) =>
        (risco === 'TODOS' || a.risco === risco) &&
        (turma === 'TODAS' || (a.turma ?? 'Sem turma') === turma) &&
        (!termo || a.nome.toLowerCase().includes(termo) || a.matricula.includes(termo)),
    );
  }, [dados, risco, turma, busca]);

  const cor = (r: RiscoEvasao) =>
    r === 'ALTO' ? colors.status.danger : r === 'MEDIO' ? colors.status.warning : colors.brand.green;

  const linha = (a: AlunoRiscoDTO) => {
    const expandido = aberto === a.alunoId;
    return (
      <Pressable key={a.alunoId} onPress={() => setAberto(expandido ? null : a.alunoId)} accessibilityRole="button" accessibilityState={{ expanded: expandido }}>
        <Card style={common.card}>
          <View style={common.row}>
            <Avatar nome={a.nome} foto={a.foto} size={42} />
            <View style={common.flex}>
              <Text style={[common.title, { color: colors.text }]} numberOfLines={1}>
                {a.nome}
              </Text>
              <Text style={[common.sub, { color: colors.textSecondary }]}>
                {a.turma ?? 'Sem turma'} · média {a.media.toFixed(1)} · faltas {Math.round(a.percentualFaltas)}%
              </Text>
            </View>
            <Badge label={ROTULO[a.risco]} color={cor(a.risco)} />
          </View>
          {expandido && (
            <View style={{ marginTop: 10, gap: 4 }}>
              <Text style={[common.text, { color: colors.text }]}>Motivo principal: {a.motivoPrincipal}</Text>
              <Text style={[common.sub, { color: colors.textSecondary }]}>Matrícula {a.matricula}</Text>
              <Text style={[common.sub, { color: colors.textSecondary }]}>Engajamento {Math.round(a.engajamento)}%</Text>
              <Text style={[common.sub, { color: colors.textSecondary }]}>
                Último acesso: {a.ultimoAcessoEm ? tempoRelativo(a.ultimoAcessoEm) : 'nunca acessou'}
              </Text>
              <Text style={[common.sub, { color: colors.textSecondary }]}>
                Intervenções: {a.intervencoes}
                {a.ultimaIntervencaoEm ? ` (última ${tempoRelativo(a.ultimaIntervencaoEm)})` : ''}
              </Text>
            </View>
          )}
        </Card>
      </Pressable>
    );
  };

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <Input icon="search-outline" placeholder="Buscar por nome ou matrícula" value={textoBusca} onChangeText={setTextoBusca} autoCapitalize="none" />
      <ChipRow
        valor={risco}
        onChange={setRisco}
        opcoes={[
          { valor: 'TODOS', rotulo: 'Todos' },
          { valor: 'ALTO', rotulo: 'Risco alto' },
          { valor: 'MEDIO', rotulo: 'Risco médio' },
          { valor: 'BAIXO', rotulo: 'Risco baixo' },
        ]}
      />
      {turmas.length > 1 && (
        <ChipRow valor={turma} onChange={setTurma} opcoes={[{ valor: 'TODAS', rotulo: 'Todas as turmas' }, ...turmas.map((t) => ({ valor: t, rotulo: t }))]} />
      )}
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>{lista.length} aluno(s)</Text>
        {lista.length === 0 ? <EmptyState icon="shield-checkmark-outline" title="Nenhum aluno encontrado" /> : lista.map(linha)}
        <View style={common.fim} />
      </AsyncState>
    </ScreenContainer>
  );
}
