import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useBuscaDebounce } from '../../hooks/useBuscaDebounce';
import { useCarregar } from '../../hooks/useCarregar';
import { usePaginado } from '../../hooks/usePaginado';
import { adminService } from '../../services/adminService';
import { EventoAuditoriaDTO, LogAplicacaoDTO, NivelLog, TipoEvento } from '../../types/api';
import { common } from '../../styles/common';
import { tempoRelativo } from '../../utils/tempo';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { ChipRow } from '../../components/ChipRow';
import { Input } from '../../components/Input';
import { Segmented } from '../../components/Segmented';
import { StatPill } from '../../components/StatPill';
import { EmptyState } from '../../components/EmptyState';
import { ScreenContainer } from '../../components/ScreenContainer';

type Aba = 'resumo' | 'eventos' | 'logs';
const PERIODOS = [
  { valor: 1, rotulo: '24 h' },
  { valor: 7, rotulo: '7 dias' },
  { valor: 30, rotulo: '30 dias' },
];
const TIPOS: TipoEvento[] = ['LOGIN', 'LOGOUT', 'ACESSO', 'ALTERACAO', 'ERRO'];
const NIVEIS: NivelLog[] = ['ERROR', 'WARN', 'INFO'];

function formatarUptime(seg: number) {
  const d = Math.floor(seg / 86400);
  const h = Math.floor((seg % 86400) / 3600);
  return d ? `${d}d ${h}h` : `${h}h ${Math.floor((seg % 3600) / 60)}min`;
}

/** Auditoria e logs do sistema (web: /auditoria) — só ADMIN. Resumo de saúde, eventos e log da aplicação. */
export default function AuditoriaScreen() {
  const [aba, setAba] = useState<Aba>('resumo');
  return (
    <View style={common.flex}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Segmented
          valor={aba}
          onChange={setAba}
          opcoes={[
            { valor: 'resumo', rotulo: 'Resumo' },
            { valor: 'eventos', rotulo: 'Eventos' },
            { valor: 'logs', rotulo: 'Logs' },
          ]}
        />
      </View>
      {aba === 'resumo' ? <Resumo /> : aba === 'eventos' ? <Eventos /> : <Logs />}
    </View>
  );
}

function Resumo() {
  const { colors } = useAppTheme();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(adminService.resumoSistema);
  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar} style={{ paddingTop: 0 }}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados && (
          <>
            <View style={common.pills}>
              <StatPill icon="alert-circle-outline" value={dados.erros24h} label="Erros (24 h)" color={colors.status.danger} />
              <StatPill icon="warning-outline" value={dados.avisos24h} label="Avisos (24 h)" color={colors.status.warning} />
              <StatPill icon="lock-closed-outline" value={dados.falhasDeAcesso24h} label="Falhas de acesso" color={colors.accents.orange} />
              <StatPill icon="time-outline" value={formatarUptime(dados.uptimeSegundos)} label="No ar há" color={colors.brand.green} />
            </View>
            <Card style={common.card}>
              <Text style={[common.title, { color: colors.text }]}>Saúde</Text>
              <Text style={[common.text, { color: colors.text, marginTop: 6 }]}>
                Banco de dados: {dados.bancoOk ? 'ok' : 'com falha'} ({dados.bancoMs} ms)
              </Text>
              <Text style={[common.text, { color: colors.text }]}>
                Memória: {dados.heapUsadoMb}/{dados.heapMaxMb} MB
              </Text>
              <Text style={[common.text, { color: colors.text }]}>Alerta por webhook: {dados.alertaAtivo ? 'ativo' : 'desligado'}</Text>
              {dados.ultimoErro && (
                <Text style={[common.sub, { color: colors.textSecondary, marginTop: 4 }]}>Último erro {tempoRelativo(dados.ultimoErro)}</Text>
              )}
              {dados.logsDescartados > 0 && (
                <Text style={[common.sub, { color: colors.status.warning }]}>{dados.logsDescartados} log(s) descartado(s) por excesso</Text>
              )}
            </Card>
            <Text style={[common.section, { color: colors.text }]}>Principais problemas</Text>
            {dados.principaisProblemas.length === 0 ? (
              <Text style={[common.sub, { color: colors.textSecondary }]}>Nenhum problema recorrente.</Text>
            ) : (
              dados.principaisProblemas.map((p, i) => (
                <Card key={`${p.origem}-${i}`} style={common.card}>
                  <View style={common.between}>
                    <Badge label={p.nivel} color={p.nivel === 'ERROR' ? colors.status.danger : colors.status.warning} />
                    <Text style={[common.sub, { color: colors.textSecondary }]}>
                      {p.total}× · {tempoRelativo(p.ultimaVez)}
                    </Text>
                  </View>
                  <Text style={[common.text, { color: colors.text, marginTop: 6 }]}>{p.mensagem}</Text>
                  <Text style={[common.sub, { color: colors.textSecondary }]}>
                    {p.origem}
                    {p.metodo && p.caminho ? ` · ${p.metodo} ${p.caminho}` : ''}
                  </Text>
                </Card>
              ))
            )}
            <View style={common.fim} />
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}

function Eventos() {
  const { colors } = useAppTheme();
  const [tipo, setTipo] = useState<TipoEvento | 'TODOS'>('TODOS');
  const [periodo, setPeriodo] = useState(7);
  const [textoBusca, setTextoBusca] = useState('');
  const busca = useBuscaDebounce(textoBusca);
  const buscar = useCallback(
    (page: number) => adminService.eventos({ tipo: tipo === 'TODOS' ? undefined : tipo, periodo, busca: busca || undefined, page, size: 25 }),
    [tipo, periodo, busca],
  );
  const lista = usePaginado(buscar, `${tipo}|${periodo}|${busca}`);
  const cor = (t: TipoEvento) => (t === 'ERRO' ? colors.status.danger : t === 'ALTERACAO' ? colors.status.warning : colors.accents.blue);

  return (
    <>
      <View style={{ paddingHorizontal: 16 }}>
        <Input icon="search-outline" placeholder="Buscar por usuário ou ação" value={textoBusca} onChangeText={setTextoBusca} autoCapitalize="none" />
        <ChipRow valor={tipo} onChange={setTipo} opcoes={[{ valor: 'TODOS', rotulo: 'Todos' }, ...TIPOS.map((t) => ({ valor: t, rotulo: t }))]} />
        <ChipRow valor={periodo} onChange={setPeriodo} opcoes={PERIODOS} />
      </View>
      <AsyncState carregando={lista.carregando} erro={lista.erro} temDados={lista.itens.length > 0} onRetry={lista.tentarDeNovo}>
        <FlatList<EventoAuditoriaDTO>
          data={lista.itens}
          keyExtractor={(e) => String(e.id)}
          contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={lista.atualizando} onRefresh={lista.recarregar} tintColor={colors.brand.purple} />}
          onEndReached={lista.carregarMais}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<EmptyState icon="list-outline" title="Nenhum evento no período" />}
          ListFooterComponent={lista.carregandoMais ? <ActivityIndicator color={colors.brand.purple} style={{ margin: 16 }} /> : <View style={common.fim} />}
          renderItem={({ item: e }) => (
            <Card style={common.card}>
              <View style={common.between}>
                <Badge label={e.tipo} color={cor(e.tipo)} />
                <Text style={[common.sub, { color: colors.textSecondary }]}>{tempoRelativo(e.criadoEm)}</Text>
              </View>
              <Text style={[common.text, { color: colors.text, marginTop: 6 }]}>{e.acao}</Text>
              {e.detalhe && <Text style={[common.sub, { color: colors.textSecondary }]}>{e.detalhe}</Text>}
              <Text style={[common.sub, { color: colors.textSecondary }]}>
                {e.usuario ?? 'anônimo'}
                {e.ip ? ` · ${e.ip}` : ''}
              </Text>
            </Card>
          )}
        />
      </AsyncState>
    </>
  );
}

function Logs() {
  const { colors } = useAppTheme();
  const [nivel, setNivel] = useState<NivelLog | 'TODOS'>('TODOS');
  const [periodo, setPeriodo] = useState(1);
  const [textoBusca, setTextoBusca] = useState('');
  const busca = useBuscaDebounce(textoBusca);
  const [aberto, setAberto] = useState<number | null>(null);
  const buscar = useCallback(
    (page: number) => adminService.logsSistema({ nivel: nivel === 'TODOS' ? undefined : nivel, periodo, busca: busca || undefined, page, size: 25 }),
    [nivel, periodo, busca],
  );
  const lista = usePaginado(buscar, `${nivel}|${periodo}|${busca}`);
  const cor = (n: NivelLog) => (n === 'ERROR' ? colors.status.danger : n === 'WARN' ? colors.status.warning : colors.accents.blue);

  return (
    <>
      <View style={{ paddingHorizontal: 16 }}>
        <Input icon="search-outline" placeholder="Buscar na mensagem" value={textoBusca} onChangeText={setTextoBusca} autoCapitalize="none" />
        <ChipRow valor={nivel} onChange={setNivel} opcoes={[{ valor: 'TODOS', rotulo: 'Todos' }, ...NIVEIS.map((n) => ({ valor: n, rotulo: n }))]} />
        <ChipRow valor={periodo} onChange={setPeriodo} opcoes={PERIODOS} />
      </View>
      <AsyncState carregando={lista.carregando} erro={lista.erro} temDados={lista.itens.length > 0} onRetry={lista.tentarDeNovo}>
        <FlatList<LogAplicacaoDTO>
          data={lista.itens}
          keyExtractor={(l) => String(l.id)}
          contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={lista.atualizando} onRefresh={lista.recarregar} tintColor={colors.brand.purple} />}
          onEndReached={lista.carregarMais}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<EmptyState icon="checkmark-circle-outline" title="Nenhum log no período" />}
          ListFooterComponent={lista.carregandoMais ? <ActivityIndicator color={colors.brand.purple} style={{ margin: 16 }} /> : <View style={common.fim} />}
          renderItem={({ item: l }) => (
            <Card style={common.card}>
              <View style={common.between}>
                <Badge label={l.nivel} color={cor(l.nivel)} />
                <Text style={[common.sub, { color: colors.textSecondary }]}>{tempoRelativo(l.criadoEm)}</Text>
              </View>
              <Text
                onPress={() => setAberto(aberto === l.id ? null : l.id)}
                numberOfLines={aberto === l.id ? undefined : 3}
                style={[common.text, { color: colors.text, marginTop: 6 }]}
              >
                {l.mensagem}
              </Text>
              <Text style={[common.sub, { color: colors.textSecondary }]}>
                {l.origem}
                {l.metodo && l.caminho ? ` · ${l.metodo} ${l.caminho}` : ''}
                {l.duracaoMs !== null ? ` · ${l.duracaoMs} ms` : ''}
                {l.usuario ? ` · ${l.usuario}` : ''}
              </Text>
              {aberto === l.id && l.excecao && (
                <Text selectable style={[common.sub, { color: colors.status.danger, marginTop: 6 }]}>
                  {l.excecao}
                </Text>
              )}
            </Card>
          )}
        />
      </AsyncState>
    </>
  );
}
