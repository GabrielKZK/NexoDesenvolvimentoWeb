import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useBuscaDebounce } from '../../hooks/useBuscaDebounce';
import { usePaginado } from '../../hooks/usePaginado';
import { cadastroService, inscricoesService } from '../../services/adminService';
import { InscricaoDTO, TurmaDTO } from '../../types/api';
import { common } from '../../styles/common';
import { formatarDataBR } from '../../utils/data';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ChipRow } from '../../components/ChipRow';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';

type FiltroAtivo = 'todas' | 'ativas' | 'inativas';

/** Inscrições aluno↔turma (web: /inscricoes). Filtros e paginação no servidor; liga/desliga acesso e transfere de turma. */
export default function InscricoesScreen() {
  const { colors } = useAppTheme();
  const [filtro, setFiltro] = useState<FiltroAtivo>('todas');
  const [turmaFiltro, setTurmaFiltro] = useState<number | 0>(0);
  const [textoBusca, setTextoBusca] = useState('');
  const busca = useBuscaDebounce(textoBusca);
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [transferindo, setTransferindo] = useState<number | null>(null);
  const [ocupado, setOcupado] = useState<number | null>(null);

  useEffect(() => {
    cadastroService.turmas().then(setTurmas).catch(() => setTurmas([]));
  }, []);

  const buscar = useCallback(
    (page: number) =>
      inscricoesService.listar({
        ativo: filtro === 'todas' ? undefined : filtro === 'ativas',
        turma: turmaFiltro || undefined,
        busca: busca || undefined,
        page,
        size: 20,
      }),
    [filtro, turmaFiltro, busca],
  );
  const lista = usePaginado(buscar, `${filtro}|${turmaFiltro}|${busca}`);

  const aplicar = (nova: InscricaoDTO) => lista.setItens((atual) => atual.map((i) => (i.id === nova.id ? nova : i)));

  const alternarAtivo = (i: InscricaoDTO) => {
    const acao = i.ativo ? 'Desativar' : 'Reativar';
    Alert.alert(
      `${acao} inscrição?`,
      i.ativo
        ? `${i.aluno} deixa de ver o conteúdo da turma. O progresso dele é mantido.`
        : `${i.aluno} volta a ver o conteúdo da turma.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: acao,
          style: i.ativo ? 'destructive' : 'default',
          onPress: async () => {
            setOcupado(i.id);
            try {
              aplicar(await inscricoesService.atualizarAtivo(i.id, !i.ativo));
            } catch (e) {
              Alert.alert('Não foi possível alterar', getErrorMessage(e, 'Tente de novo.'));
            } finally {
              setOcupado(null);
            }
          },
        },
      ],
    );
  };

  const transferir = async (i: InscricaoDTO, turmaId: number) => {
    if (turmaId === i.turmaId) return setTransferindo(null);
    setOcupado(i.id);
    try {
      aplicar(await inscricoesService.transferirTurma(i.id, turmaId));
      setTransferindo(null);
    } catch (e) {
      Alert.alert('Não foi possível transferir', getErrorMessage(e, 'Tente de novo.'));
    } finally {
      setOcupado(null);
    }
  };

  return (
    <View style={[common.flex, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
              <Input icon="search-outline" placeholder="Buscar aluno" value={textoBusca} onChangeText={setTextoBusca} autoCapitalize="none" />
              <ChipRow
                valor={filtro}
                onChange={setFiltro}
                opcoes={[
                  { valor: 'todas', rotulo: 'Todas' },
                  { valor: 'ativas', rotulo: 'Ativas' },
                  { valor: 'inativas', rotulo: 'Inativas' },
                ]}
              />
              {turmas.length > 0 && (
                <ChipRow
                  valor={turmaFiltro}
                  onChange={setTurmaFiltro}
                  opcoes={[{ valor: 0, rotulo: 'Todas as turmas' }, ...turmas.map((t) => ({ valor: t.id, rotulo: t.nome }))]}
                />
              )}
              <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>{lista.total} inscrição(ões)</Text>
      </View>
      <AsyncState carregando={lista.carregando} erro={lista.erro} temDados={lista.itens.length > 0} onRetry={lista.tentarDeNovo}>
        <FlatList
          data={lista.itens}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={lista.atualizando} onRefresh={lista.recarregar} tintColor={colors.brand.purple} />}
          onEndReached={lista.carregarMais}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<EmptyState icon="school-outline" title="Nenhuma inscrição encontrada" />}
          ListFooterComponent={lista.carregandoMais ? <ActivityIndicator color={colors.brand.purple} style={{ margin: 16 }} /> : <View style={common.fim} />}
          renderItem={({ item: i }) => (
            <Card style={common.card}>
              <View style={common.between}>
                <Text style={[common.title, common.flex, { color: colors.text }]} numberOfLines={1}>
                  {i.aluno}
                </Text>
                <Badge label={i.ativo ? 'Ativa' : 'Inativa'} color={i.ativo ? colors.brand.green : colors.textSecondary} />
              </View>
              <Text style={[common.sub, { color: colors.textSecondary }]}>
                {i.turma ?? 'Sem turma'} · desde {formatarDataBR(i.criadaEm.slice(0, 10))}
              </Text>
              <View style={[common.row, { marginTop: 10 }]}>
                <Button
                  title={i.ativo ? 'Desativar' : 'Reativar'}
                  variant="outline"
                  tintColor={i.ativo ? colors.status.danger : undefined}
                  loading={ocupado === i.id}
                  disabled={ocupado !== null}
                  onPress={() => alternarAtivo(i)}
                  style={common.flex}
                />
                <Button title="Trocar turma" variant="outline" disabled={ocupado !== null} onPress={() => setTransferindo(transferindo === i.id ? null : i.id)} style={common.flex} />
              </View>
              {transferindo === i.id && (
                <View style={{ marginTop: 10 }}>
                  <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 6 }]}>Transferir para:</Text>
                  <ChipRow valor={i.turmaId} onChange={(id) => transferir(i, id)} opcoes={turmas.map((t) => ({ valor: t.id, rotulo: t.nome }))} />
                </View>
              )}
            </Card>
          )}
        />
      </AsyncState>
    </View>
  );
}
