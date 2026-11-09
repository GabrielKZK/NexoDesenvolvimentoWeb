import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { professorService } from '../../services/professorService';
import { AlunoResumoDTO, ConversaDTO, DuvidaDTO, NotaDTO, ObservacaoDTO } from '../../types/api';
import { common } from '../../styles/common';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { tempoRelativo } from '../../utils/tempo';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Segmented } from '../../components/Segmented';
import { ChipRow } from '../../components/ChipRow';
import { EmptyState } from '../../components/EmptyState';

type Aba = 'mensagens' | 'duvidas' | 'avisos' | 'alunos';

/** Mensagens, dúvidas, avisos e observações sobre alunos (web: /comunicacao). */
export default function ComunicacaoScreen() {
  const [aba, setAba] = useState<Aba>('mensagens');
  return (
    <ScreenContainer>
      <Segmented
        opcoes={[
          { valor: 'mensagens', rotulo: 'Mensagens' },
          { valor: 'duvidas', rotulo: 'Dúvidas' },
          { valor: 'avisos', rotulo: 'Avisos' },
          { valor: 'alunos', rotulo: 'Alunos' },
        ]}
        valor={aba}
        onChange={setAba}
      />
      {aba === 'mensagens' && <Mensagens />}
      {aba === 'duvidas' && <Duvidas />}
      {aba === 'avisos' && <Avisos />}
      {aba === 'alunos' && <Alunos />}
      <View style={common.fim} />
    </ScreenContainer>
  );
}

// ── Mensagens ───────────────────────────────────────────────────────────────

function Mensagens() {
  const { colors } = useAppTheme();
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(() => professorService.conversas('entrada'));
  const [abertaId, setAbertaId] = useState<number | null>(null);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const aberta: ConversaDTO | undefined = dados?.find((c) => c.id === abertaId);

  const enviar = async () => {
    if (!aberta || !texto.trim() || enviando) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      const msg = await professorService.responderConversa(aberta.id, texto.trim());
      setDados((lista) => (lista ?? []).map((c) => (c.id === aberta.id ? { ...c, mensagens: [...c.mensagens, msg] } : c)));
      setTexto('');
    } catch (e) {
      setErroEnvio(getErrorMessage(e, 'Não foi possível enviar a resposta.'));
    } finally {
      setEnviando(false);
    }
  };

  if (aberta) {
    return (
      <>
        <Button title="Voltar às conversas" variant="ghost" icon="arrow-back-outline" onPress={() => setAbertaId(null)} />
        <Text style={[common.section, { color: colors.text }]}>{aberta.assunto}</Text>
        <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 10 }]}>
          {aberta.participante} · {aberta.papel}
        </Text>
        {aberta.mensagens.map((m) => (
          <View
            key={m.id}
            style={{
              alignSelf: m.minha ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              marginBottom: 8,
              padding: 10,
              borderRadius: 14,
              backgroundColor: m.minha ? `${colors.brand.purple}22` : colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={[common.text, { color: colors.text }]}>{m.texto}</Text>
            <Text style={[common.sub, { color: colors.textSecondary }]}>{tempoRelativo(m.criadaEm)}</Text>
          </View>
        ))}
        <Input label="Responder" value={texto} onChangeText={setTexto} multiline maxLength={2000} />
        {erroEnvio && <Text style={[common.msg, { color: colors.status.danger }]}>{erroEnvio}</Text>}
        <Button title="Enviar resposta" icon="send-outline" onPress={enviar} loading={enviando} disabled={!texto.trim()} />
      </>
    );
  }

  return (
    <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
      {(dados ?? []).length === 0 ? (
        <EmptyState icon="chatbubbles-outline" title="Nenhuma conversa" />
      ) : (
        (dados ?? []).map((c) => (
          <Card key={c.id} style={common.card}>
            <Text style={[common.title, { color: colors.text }]}>{c.assunto}</Text>
            <Text style={[common.sub, { color: colors.textSecondary }]}>
              {c.participante} · {tempoRelativo(c.atualizadaEm)}
            </Text>
            <Text style={[common.text, { color: colors.textSecondary, marginVertical: 6 }]} numberOfLines={2}>
              {c.mensagens[c.mensagens.length - 1]?.texto}
            </Text>
            <Button title="Abrir conversa" variant="outline" icon="chatbubble-outline" onPress={() => setAbertaId(c.id)} />
          </Card>
        ))
      )}
    </AsyncState>
  );
}

// ── Dúvidas ─────────────────────────────────────────────────────────────────

function Duvidas() {
  const { colors } = useAppTheme();
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(professorService.duvidas);
  const [respondendoId, setRespondendoId] = useState<number | null>(null);
  const [resposta, setResposta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const responder = async (d: DuvidaDTO) => {
    if (!resposta.trim() || enviando) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      const atualizada = await professorService.responderDuvida(d.id, resposta.trim());
      setDados((l) => (l ?? []).map((x) => (x.id === d.id ? atualizada : x)));
      setRespondendoId(null);
      setResposta('');
    } catch (e) {
      setErroEnvio(getErrorMessage(e, 'Não foi possível enviar a resposta.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
      {(dados ?? []).length === 0 ? (
        <EmptyState icon="help-circle-outline" title="Nenhuma dúvida" />
      ) : (
        (dados ?? []).map((d) => {
          const aberta = d.status === 'ABERTA';
          return (
            <Card key={d.id} style={common.card}>
              <View style={common.between}>
                <Text style={[common.title, common.flex, { color: colors.text }]}>{d.aluno}</Text>
                <Badge label={aberta ? 'Pendente' : 'Respondida'} color={aberta ? colors.accents.orange : colors.brand.green} />
              </View>
              <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 6 }]}>
                {d.disciplina} · {tempoRelativo(d.criadaEm)}
              </Text>
              <Text style={[common.text, { color: colors.text }]}>{d.pergunta}</Text>
              {!aberta && !!d.resposta && (
                <Text style={[common.text, { color: colors.textSecondary, marginTop: 8 }]}>Resposta: {d.resposta}</Text>
              )}
              {aberta && respondendoId !== d.id && (
                <Button
                  title="Responder"
                  variant="outline"
                  icon="return-down-forward-outline"
                  onPress={() => {
                    setRespondendoId(d.id);
                    setResposta('');
                    setErroEnvio(null);
                  }}
                  style={{ marginTop: 10 }}
                />
              )}
              {aberta && respondendoId === d.id && (
                <View style={{ marginTop: 10 }}>
                  <Input label="Sua resposta" value={resposta} onChangeText={setResposta} multiline maxLength={2000} />
                  {erroEnvio && <Text style={[common.msg, { color: colors.status.danger }]}>{erroEnvio}</Text>}
                  <View style={common.row}>
                    <Button title="Cancelar" variant="ghost" onPress={() => setRespondendoId(null)} style={common.flex} />
                    <Button title="Enviar" icon="send-outline" onPress={() => responder(d)} loading={enviando} disabled={!resposta.trim()} style={common.flex} />
                  </View>
                </View>
              )}
            </Card>
          );
        })
      )}
    </AsyncState>
  );
}

// ── Avisos ──────────────────────────────────────────────────────────────────

function Avisos() {
  const { colors } = useAppTheme();
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(professorService.avisos);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [publicando, setPublicando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const publicar = async () => {
    if (!titulo.trim() || !conteudo.trim() || publicando) return;
    setPublicando(true);
    setErroEnvio(null);
    try {
      const novo = await professorService.publicarAviso({ titulo: titulo.trim(), conteudo: conteudo.trim() });
      setDados((l) => [novo, ...(l ?? [])]);
      setTitulo('');
      setConteudo('');
      setMostrarForm(false);
    } catch (e) {
      setErroEnvio(getErrorMessage(e, 'Não foi possível publicar o aviso.'));
    } finally {
      setPublicando(false);
    }
  };

  return (
    <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
      <Button
        title={mostrarForm ? 'Fechar' : 'Publicar aviso'}
        icon={mostrarForm ? 'close-outline' : 'megaphone-outline'}
        variant="outline"
        onPress={() => setMostrarForm((v) => !v)}
        style={{ marginBottom: 12 }}
      />
      {mostrarForm && (
        <Card style={common.card}>
          <Input label="Título" value={titulo} onChangeText={setTitulo} maxLength={150} />
          <Input label="Conteúdo" value={conteudo} onChangeText={setConteudo} multiline style={common.multiline} maxLength={2000} />
          {erroEnvio && <Text style={[common.msg, { color: colors.status.danger }]}>{erroEnvio}</Text>}
          <Button title="Publicar" icon="send-outline" onPress={publicar} loading={publicando} disabled={!titulo.trim() || !conteudo.trim()} />
        </Card>
      )}
      {(dados ?? []).length === 0 ? (
        <EmptyState icon="megaphone-outline" title="Nenhum aviso publicado" />
      ) : (
        (dados ?? []).map((a) => (
          <Card key={a.id} style={common.card}>
            <Text style={[common.title, { color: colors.text }]}>{a.titulo}</Text>
            <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 6 }]}>
              {a.autor} · {a.destino || 'Todas as turmas'} · {tempoRelativo(a.criadoEm)}
            </Text>
            <Text style={[common.text, { color: colors.text }]}>{a.conteudo}</Text>
          </Card>
        ))
      )}
    </AsyncState>
  );
}

// ── Alunos (notas + observações pedagógicas) ────────────────────────────────

function Alunos() {
  const { colors } = useAppTheme();
  const { dados, carregando, erro, recarregar } = useCarregar(professorService.alunos);
  const [turma, setTurma] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [aluno, setAluno] = useState<AlunoResumoDTO | null>(null);

  const turmas = useMemo(() => Array.from(new Set((dados ?? []).map((a) => a.turma ?? 'Sem turma'))).sort(), [dados]);
  useEffect(() => {
    if (turma === null && turmas.length) setTurma(turmas[0]);
  }, [turmas, turma]);

  const lista = (dados ?? []).filter(
    (a) => (a.turma ?? 'Sem turma') === turma && a.nome.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  if (aluno) return <AlunoDetalhe aluno={aluno} onVoltar={() => setAluno(null)} />;

  return (
    <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
      {turmas.length === 0 ? (
        <EmptyState icon="people-outline" title="Nenhum aluno nas suas turmas" />
      ) : (
        <>
          <ChipRow opcoes={turmas.map((t) => ({ valor: t, rotulo: t }))} valor={turma} onChange={setTurma} />
          <Input placeholder="Buscar aluno" icon="search-outline" value={busca} onChangeText={setBusca} autoCorrect={false} />
          {lista.map((a) => (
            <Card key={a.id} style={common.card}>
              <View style={common.between}>
                <Text style={[common.title, common.flex, { color: colors.text }]} numberOfLines={1}>
                  {a.nome}
                </Text>
                <Button title="Abrir" variant="outline" icon="chevron-forward" onPress={() => setAluno(a)} />
              </View>
            </Card>
          ))}
        </>
      )}
    </AsyncState>
  );
}

function AlunoDetalhe({ aluno, onVoltar }: { aluno: AlunoResumoDTO; onVoltar: () => void }) {
  const { colors } = useAppTheme();
  const [notas, setNotas] = useState<NotaDTO[]>([]);
  const [observacoes, setObservacoes] = useState<ObservacaoDTO[]>([]);
  const [texto, setTexto] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (aluno.turmaId != null) {
      professorService
        .notasDaTurma(aluno.turmaId)
        .then((l) => setNotas(l.filter((n) => n.alunoId === aluno.id)))
        .catch(() => setNotas([]));
    }
    professorService.observacoes(aluno.id).then(setObservacoes).catch(() => setObservacoes([]));
  }, [aluno]);

  const salvar = async () => {
    if (!texto.trim() || salvando) return;
    setSalvando(true);
    setErro(null);
    try {
      const nova = await professorService.criarObservacao(aluno.id, texto.trim());
      setObservacoes((l) => [nova, ...l]);
      setTexto('');
    } catch (e) {
      setErro(getErrorMessage(e, 'Não foi possível salvar a observação.'));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Button title="Voltar aos alunos" variant="ghost" icon="arrow-back-outline" onPress={onVoltar} />
      <Text style={[common.section, { color: colors.text }]}>{aluno.nome}</Text>
      <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 10 }]}>{aluno.turma ?? 'Sem turma'}</Text>

      <Text style={[common.title, { color: colors.text, marginBottom: 8 }]}>Notas</Text>
      {notas.length === 0 ? (
        <Text style={[common.sub, { color: colors.textSecondary }]}>Sem notas lançadas.</Text>
      ) : (
        notas.map((n) => (
          <Card key={n.id} style={common.card}>
            <View style={common.between}>
              <Text style={[common.title, { color: colors.text }]}>{n.disciplina}</Text>
              <Text style={[common.title, { color: colors.brand.purple }]}>{n.media != null ? n.media.toFixed(1) : '—'}</Text>
            </View>
          </Card>
        ))
      )}

      <Text style={[common.section, { color: colors.text }]}>Observações pedagógicas</Text>
      <Input label="Nova observação" value={texto} onChangeText={setTexto} multiline maxLength={1000} />
      {erro && <Text style={[common.msg, { color: colors.status.danger }]}>{erro}</Text>}
      <Button title="Salvar observação" icon="save-outline" onPress={salvar} loading={salvando} disabled={!texto.trim()} style={{ marginBottom: 12 }} />
      {observacoes.map((o) => (
        <Card key={o.id} style={common.card}>
          <Text style={[common.text, { color: colors.text }]}>{o.texto}</Text>
          <Text style={[common.sub, { color: colors.textSecondary }]}>
            {o.autor} · {tempoRelativo(o.criadaEm)}
          </Text>
        </Card>
      ))}
    </>
  );
}
