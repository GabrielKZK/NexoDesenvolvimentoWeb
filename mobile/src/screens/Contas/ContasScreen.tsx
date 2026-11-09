import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../hooks/useAuth';
import { useBuscaDebounce } from '../../hooks/useBuscaDebounce';
import { usePaginado } from '../../hooks/usePaginado';
import { adminService } from '../../services/adminService';
import { ContaDTO, PapelConta } from '../../types/api';
import { common } from '../../styles/common';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ChipRow } from '../../components/ChipRow';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';

type FiltroPapel = PapelConta | 'TODOS';
const ROTULO: Record<PapelConta, string> = { ALUNO: 'Aluno', PROFESSOR: 'Professor', DIRETOR: 'Diretor', ADMIN: 'Admin' };

/** Contas de acesso (web: /contas): busca, ativar/desativar e senha provisória. */
export default function ContasScreen() {
  const { colors } = useAppTheme();
  const { usuario } = useAuth();
  const [papel, setPapel] = useState<FiltroPapel>('TODOS');
  const [textoBusca, setTextoBusca] = useState('');
  const busca = useBuscaDebounce(textoBusca);
  const [ocupado, setOcupado] = useState<number | null>(null);

  const buscar = useCallback(
    (page: number) => adminService.contas({ papel: papel === 'TODOS' ? undefined : papel, busca: busca || undefined, page, size: 20 }),
    [papel, busca],
  );
  const lista = usePaginado(buscar, `${papel}|${busca}`);

  const alternarAtivo = (c: ContaDTO) => {
    const acao = c.ativo ? 'Desativar' : 'Reativar';
    Alert.alert(
      `${acao} conta?`,
      c.ativo ? `${c.nome} perde o acesso e as sessões abertas são encerradas.` : `${c.nome} volta a poder entrar.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: acao,
          style: c.ativo ? 'destructive' : 'default',
          onPress: async () => {
            setOcupado(c.id);
            try {
              const nova = await adminService.atualizarAtivo(c.id, !c.ativo);
              lista.setItens((atual) => atual.map((x) => (x.id === nova.id ? nova : x)));
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

  const redefinirSenha = (c: ContaDTO) =>
    Alert.alert('Gerar senha provisória?', `A senha atual de ${c.nome} deixa de valer e ${c.nome.split(' ')[0]} terá de trocar no próximo acesso.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Gerar',
        onPress: async () => {
          setOcupado(c.id);
          try {
            const r = await adminService.redefinirSenha(c.id);
            Alert.alert('Senha provisória', `Login: ${r.login}\nSenha: ${r.senhaProvisoria}\n\nEla aparece só agora.`, [
              { text: 'Copiar', onPress: () => void Clipboard.setStringAsync(`Login: ${r.login}\nSenha provisória: ${r.senhaProvisoria}`) },
              { text: 'Fechar', style: 'cancel' },
            ]);
          } catch (e) {
            Alert.alert('Não foi possível gerar', getErrorMessage(e, 'Tente de novo.'));
          } finally {
            setOcupado(null);
          }
        },
      },
    ]);

  return (
    <View style={[common.flex, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Input icon="search-outline" placeholder="Buscar por nome ou login" value={textoBusca} onChangeText={setTextoBusca} autoCapitalize="none" />
        <ChipRow
          valor={papel}
          onChange={setPapel}
          opcoes={[{ valor: 'TODOS', rotulo: 'Todos' }, ...(Object.keys(ROTULO) as PapelConta[]).map((p) => ({ valor: p, rotulo: ROTULO[p] }))]}
        />
        <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>{lista.total} conta(s)</Text>
      </View>
      <AsyncState carregando={lista.carregando} erro={lista.erro} temDados={lista.itens.length > 0} onRetry={lista.tentarDeNovo}>
        <FlatList
          data={lista.itens}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={lista.atualizando} onRefresh={lista.recarregar} tintColor={colors.brand.purple} />}
          onEndReached={lista.carregarMais}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<EmptyState icon="people-outline" title="Nenhuma conta encontrada" />}
          ListFooterComponent={lista.carregandoMais ? <ActivityIndicator color={colors.brand.purple} style={{ margin: 16 }} /> : <View style={common.fim} />}
          renderItem={({ item: c }) => {
            const eu = c.id === usuario?.id;
            return (
              <Card style={common.card}>
                <View style={common.between}>
                  <Text style={[common.title, common.flex, { color: colors.text }]} numberOfLines={1}>
                    {c.nome}
                  </Text>
                  <Badge label={ROTULO[c.papel]} color={colors.brand.purple} />
                </View>
                <Text style={[common.sub, { color: colors.textSecondary }]} numberOfLines={1}>
                  {c.login}
                  {c.cargo ? ` · ${c.cargo}` : ''}
                </Text>
                <View style={[common.row, { marginTop: 6 }]}>
                  <Badge label={c.ativo ? 'Ativa' : 'Inativa'} color={c.ativo ? colors.brand.green : colors.status.danger} />
                  {eu && <Badge label="Você" color={colors.accents.blue} />}
                </View>
                {!eu && (
                  <View style={[common.row, { marginTop: 10 }]}>
                    <Button
                      title={c.ativo ? 'Desativar' : 'Reativar'}
                      variant="outline"
                      tintColor={c.ativo ? colors.status.danger : undefined}
                      loading={ocupado === c.id}
                      disabled={ocupado !== null}
                      onPress={() => alternarAtivo(c)}
                      style={common.flex}
                    />
                    <Button title="Nova senha" variant="outline" disabled={ocupado !== null} onPress={() => redefinirSenha(c)} style={common.flex} />
                  </View>
                )}
              </Card>
            );
          }}
        />
      </AsyncState>
    </View>
  );
}
