import { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import {
  DificuldadeQuestao,
  professorService,
  QuestaoInput,
  TipoQuestao,
} from '../../services/professorService';
import { AvaliacaoDTO, QuestaoDTO, StatusAvaliacao, TurmaDTO } from '../../types/api';
import { common } from '../../styles/common';
import { formatarDataBR } from '../../utils/data';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { StatPill } from '../../components/StatPill';
import { Segmented } from '../../components/Segmented';
import { ChipRow } from '../../components/ChipRow';
import { EmptyState } from '../../components/EmptyState';

type Aba = 'ativas' | 'fila' | 'questoes';

const STATUS_ROTULO: Record<StatusAvaliacao, string> = {
  RASCUNHO: 'Rascunho',
  PUBLICADA: 'Aguardando',
  EM_CORRECAO: 'Em correção',
  CORRIGIDA: 'Concluída',
};
const TIPOS_AVALIACAO = ['Prova', 'Trabalho', 'Quiz', 'Exercício'];
const DIFICULDADE_ROTULO: Record<DificuldadeQuestao, string> = { FACIL: 'Fácil', MEDIA: 'Média', DIFICIL: 'Difícil' };
const TIPO_ROTULO: Record<TipoQuestao, string> = { OBJETIVA: 'Objetiva', DISSERTATIVA: 'Discursiva' };

const FORM_QUESTAO_VAZIO: Required<QuestaoInput> = { enunciado: '', disciplina: '', tipo: 'OBJETIVA', dificuldade: 'MEDIA' };

/**
 * Avaliações (web: /avaliacao): lista, fila de correção e banco de questões (CRUD).
 * /api/avaliacoes, /api/avaliacoes/fila-correcao e /api/questoes.
 */
export default function ProfessorAvaliacoesScreen() {
  const { colors } = useAppTheme();
  const [aba, setAba] = useState<Aba>('ativas');
  const [retorno, setRetorno] = useState<{ ok: boolean; texto: string } | null>(null);

  const aval = useCarregar(professorService.avaliacoes);
  const fila = useCarregar(professorService.filaCorrecao);
  const quest = useCarregar(professorService.questoes);

  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [materias, setMaterias] = useState<string[]>([]);
  useEffect(() => {
    professorService.turmas().then(setTurmas).catch(() => {});
    professorService
      .materias()
      .then((lista) => {
        setMaterias(lista);
        // Quem leciona uma só matéria não precisa escolher.
        if (lista.length === 1) setDisciplina((atual) => atual ?? lista[0]);
      })
      .catch(() => {});
  }, []);

  // ── Nova avaliação ──
  const [mostrarFormAval, setMostrarFormAval] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<string | null>(null);
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [disciplina, setDisciplina] = useState<string | null>(null);
  const [dataAplicacao, setDataAplicacao] = useState('');
  const [criando, setCriando] = useState(false);

  // ── Questão (criar/editar) ──
  const [mostrarFormQ, setMostrarFormQ] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formQ, setFormQ] = useState<Required<QuestaoInput>>(FORM_QUESTAO_VAZIO);
  const [salvandoQ, setSalvandoQ] = useState(false);

  const criarAvaliacao = useCallback(async () => {
    if (!titulo.trim()) return setRetorno({ ok: false, texto: 'O título da avaliação é obrigatório.' });
    if (!tipo) return setRetorno({ ok: false, texto: 'Selecione o tipo de avaliação.' });
    if (turmaId == null) return setRetorno({ ok: false, texto: 'Selecione a turma.' });
    if (!disciplina) return setRetorno({ ok: false, texto: 'Selecione a matéria.' });
    if (dataAplicacao && !/^\d{4}-\d{2}-\d{2}$/.test(dataAplicacao)) {
      return setRetorno({ ok: false, texto: 'Use a data no formato AAAA-MM-DD.' });
    }
    setCriando(true);
    setRetorno(null);
    try {
      const criada = await professorService.criarAvaliacao({
        titulo: titulo.trim(),
        tipo,
        turmaId,
        disciplina,
        data: dataAplicacao || undefined,
      });
      aval.setDados((l) => [criada, ...(l ?? [])]);
      setTitulo('');
      setTipo(null);
      setTurmaId(null);
      setDisciplina(materias.length === 1 ? materias[0] : null);
      setDataAplicacao('');
      setMostrarFormAval(false);
      setRetorno({ ok: true, texto: 'Avaliação criada.' });
    } catch (e) {
      setRetorno({ ok: false, texto: getErrorMessage(e, 'Falha ao criar a avaliação.') });
    } finally {
      setCriando(false);
    }
  }, [titulo, tipo, turmaId, disciplina, materias, dataAplicacao, aval]);

  const abrirQuestao = (q?: QuestaoDTO) => {
    setRetorno(null);
    setEditandoId(q?.id ?? null);
    setFormQ(
      q
        ? { enunciado: q.enunciado, disciplina: q.disciplina ?? '', tipo: q.tipo, dificuldade: q.dificuldade }
        : { ...FORM_QUESTAO_VAZIO, disciplina: materias.length === 1 ? materias[0] : '' },
    );
    setMostrarFormQ(true);
  };

  const salvarQuestao = async () => {
    if (!formQ.enunciado.trim()) return setRetorno({ ok: false, texto: 'O enunciado da questão é obrigatório.' });
    // O servidor exige a matéria de quem leciona (professor); sem matérias atribuídas não há o que escolher.
    if (materias.length > 0 && !formQ.disciplina.trim()) return setRetorno({ ok: false, texto: 'Selecione a matéria da questão.' });
    setSalvandoQ(true);
    setRetorno(null);
    const payload: QuestaoInput = {
      enunciado: formQ.enunciado.trim(),
      disciplina: formQ.disciplina.trim() || undefined,
      tipo: formQ.tipo,
      dificuldade: formQ.dificuldade,
    };
    try {
      const salva =
        editandoId != null
          ? await professorService.atualizarQuestao(editandoId, payload)
          : await professorService.criarQuestao(payload);
      quest.setDados((l) =>
        editandoId != null ? (l ?? []).map((x) => (x.id === editandoId ? salva : x)) : [salva, ...(l ?? [])],
      );
      setMostrarFormQ(false);
      setEditandoId(null);
      setFormQ({ ...FORM_QUESTAO_VAZIO, disciplina: materias.length === 1 ? materias[0] : '' });
    } catch (e) {
      setRetorno({ ok: false, texto: getErrorMessage(e, 'Falha ao salvar a questão.') });
    } finally {
      setSalvandoQ(false);
    }
  };

  const excluirQuestao = (q: QuestaoDTO) =>
    Alert.alert('Excluir questão', `Excluir "${q.enunciado.slice(0, 60)}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await professorService.excluirQuestao(q.id);
            quest.setDados((l) => (l ?? []).filter((x) => x.id !== q.id));
          } catch (e) {
            setRetorno({ ok: false, texto: getErrorMessage(e, 'Falha ao excluir a questão.') });
          }
        },
      },
    ]);

  const lista: AvaliacaoDTO[] = aval.dados ?? [];
  const pendentes = lista.reduce((s, a) => s + a.pendentesCorrecao, 0);
  const concluidas = lista.filter((a) => a.status === 'CORRIGIDA').length;

  const feedback = retorno && (
    <Text style={[common.msg, { color: retorno.ok ? colors.status.success : colors.status.danger }]} accessibilityLiveRegion="polite">
      {retorno.texto}
    </Text>
  );

  return (
    <ScreenContainer
      refreshing={aval.atualizando || fila.atualizando || quest.atualizando}
      onRefresh={() => {
        void aval.recarregar();
        void fila.recarregar();
        void quest.recarregar();
      }}
    >
      <View style={common.pills}>
        <StatPill icon="journal-outline" value={lista.length - concluidas} label="Ativas" color={colors.accents.blue} />
        <StatPill icon="time-outline" value={pendentes} label="A corrigir" color={colors.accents.orange} />
        <StatPill icon="checkmark-done-outline" value={concluidas} label="Concluídas" color={colors.brand.green} />
      </View>

      <Segmented
        opcoes={[
          { valor: 'ativas', rotulo: 'Avaliações' },
          { valor: 'fila', rotulo: 'Correção' },
          { valor: 'questoes', rotulo: 'Questões' },
        ]}
        valor={aba}
        onChange={(v) => {
          setAba(v);
          setRetorno(null);
        }}
      />

      {aba === 'ativas' && (
        <AsyncState carregando={aval.carregando} erro={aval.erro} temDados={!!aval.dados} onRetry={aval.recarregar}>
          <Button
            title={mostrarFormAval ? 'Fechar' : 'Nova avaliação'}
            icon={mostrarFormAval ? 'close-outline' : 'add-circle-outline'}
            variant="outline"
            onPress={() => setMostrarFormAval((v) => !v)}
            style={{ marginBottom: 12 }}
          />
          {mostrarFormAval && (
            <Card style={common.card}>
              <Input label="Título" value={titulo} onChangeText={setTitulo} maxLength={150} />
              <Text style={[common.rotulo, { color: colors.textSecondary }]}>Tipo</Text>
              <ChipRow opcoes={TIPOS_AVALIACAO.map((t) => ({ valor: t, rotulo: t }))} valor={tipo} onChange={setTipo} />
              <Text style={[common.rotulo, { color: colors.textSecondary }]}>Turma</Text>
              <ChipRow opcoes={turmas.map((t) => ({ valor: t.id, rotulo: t.nome }))} valor={turmaId} onChange={setTurmaId} />
              <Text style={[common.rotulo, { color: colors.textSecondary }]}>Matéria</Text>
              {materias.length > 0 ? (
                <ChipRow opcoes={materias.map((m) => ({ valor: m, rotulo: m }))} valor={disciplina} onChange={setDisciplina} />
              ) : (
                <Text style={[common.sub, { color: colors.status.warning, marginBottom: 12 }]}>
                  Nenhuma matéria atribuída ao seu usuário.
                </Text>
              )}
              <Input
                label="Data de aplicação (opcional)"
                placeholder="AAAA-MM-DD"
                value={dataAplicacao}
                onChangeText={setDataAplicacao}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
              {feedback}
              <Button title="Criar avaliação" icon="checkmark-outline" onPress={criarAvaliacao} loading={criando} />
            </Card>
          )}
          {!mostrarFormAval && feedback}
          {lista.length === 0 ? (
            <EmptyState icon="journal-outline" title="Nenhuma avaliação" />
          ) : (
            lista.map((a) => (
              <Card key={a.id} style={common.card}>
                <View style={common.between}>
                  <Text style={[common.title, common.flex, { color: colors.text }]}>{a.titulo}</Text>
                  <Badge label={STATUS_ROTULO[a.status]} color={a.status === 'CORRIGIDA' ? colors.brand.green : colors.accents.blue} />
                </View>
                <Text style={[common.sub, { color: colors.textSecondary }]}>
                  {a.tipo} · {a.turma ?? '—'} · {formatarDataBR(a.data)}
                </Text>
                <Text style={[common.sub, { color: colors.textSecondary }]}>
                  {Math.max(0, a.entregas - a.pendentesCorrecao)} de {a.entregas} corrigidas
                </Text>
              </Card>
            ))
          )}
        </AsyncState>
      )}

      {aba === 'fila' && (
        <AsyncState carregando={fila.carregando} erro={fila.erro} temDados={!!fila.dados} onRetry={fila.recarregar}>
          {(fila.dados ?? []).length === 0 ? (
            <EmptyState icon="checkmark-done-outline" title="Nada para corrigir" />
          ) : (
            (fila.dados ?? []).map((a) => (
              <Card key={a.id} style={common.card}>
                <View style={common.between}>
                  <Text style={[common.title, common.flex, { color: colors.text }]}>{a.titulo}</Text>
                  <Badge label={`${a.pendentesCorrecao} pendente${a.pendentesCorrecao === 1 ? '' : 's'}`} color={colors.accents.orange} />
                </View>
                <Text style={[common.sub, { color: colors.textSecondary }]}>
                  {a.turma ?? '—'} · {formatarDataBR(a.data)}
                </Text>
              </Card>
            ))
          )}
        </AsyncState>
      )}

      {aba === 'questoes' && (
        <AsyncState carregando={quest.carregando} erro={quest.erro} temDados={!!quest.dados} onRetry={quest.recarregar}>
          <Button
            title={mostrarFormQ ? 'Fechar' : 'Nova questão'}
            icon={mostrarFormQ ? 'close-outline' : 'add-circle-outline'}
            variant="outline"
            onPress={() => (mostrarFormQ ? setMostrarFormQ(false) : abrirQuestao())}
            style={{ marginBottom: 12 }}
          />
          {mostrarFormQ && (
            <Card style={common.card}>
              <Input
                label="Enunciado"
                value={formQ.enunciado}
                onChangeText={(v) => setFormQ((f) => ({ ...f, enunciado: v }))}
                multiline
                style={common.multiline}
              />
              {materias.length > 0 && <Text style={[common.rotulo, { color: colors.textSecondary }]}>Matéria</Text>}
              {materias.length > 0 && (
                <ChipRow
                  opcoes={materias.map((m) => ({ valor: m, rotulo: m }))}
                  valor={formQ.disciplina || null}
                  onChange={(v) => setFormQ((f) => ({ ...f, disciplina: v }))}
                />
              )}
              <ChipRow
                opcoes={(Object.keys(TIPO_ROTULO) as TipoQuestao[]).map((t) => ({ valor: t, rotulo: TIPO_ROTULO[t] }))}
                valor={formQ.tipo}
                onChange={(v) => setFormQ((f) => ({ ...f, tipo: v }))}
              />
              <ChipRow
                opcoes={(Object.keys(DIFICULDADE_ROTULO) as DificuldadeQuestao[]).map((d) => ({ valor: d, rotulo: DIFICULDADE_ROTULO[d] }))}
                valor={formQ.dificuldade}
                onChange={(v) => setFormQ((f) => ({ ...f, dificuldade: v }))}
              />
              {feedback}
              <Button title={editandoId != null ? 'Salvar alterações' : 'Adicionar ao banco'} icon="save-outline" onPress={salvarQuestao} loading={salvandoQ} />
            </Card>
          )}
          {!mostrarFormQ && feedback}
          {(quest.dados ?? []).length === 0 ? (
            <EmptyState icon="help-circle-outline" title="Banco de questões vazio" />
          ) : (
            (quest.dados ?? []).map((q) => (
              <Card key={q.id} style={common.card}>
                <Text style={[common.text, { color: colors.text }]}>{q.enunciado}</Text>
                <View style={[common.row, { marginTop: 8, flexWrap: 'wrap' }]}>
                  <Badge label={TIPO_ROTULO[q.tipo]} color={colors.accents.blue} />
                  <Badge label={DIFICULDADE_ROTULO[q.dificuldade]} color={colors.accents.amber} />
                  {!!q.disciplina && <Badge label={q.disciplina} color={colors.brand.purple} />}
                </View>
                <View style={[common.row, { marginTop: 10 }]}>
                  <Button title="Editar" variant="outline" icon="create-outline" onPress={() => abrirQuestao(q)} style={common.flex} />
                  <Button title="Excluir" variant="outline" icon="trash-outline" tintColor={colors.status.danger} onPress={() => excluirQuestao(q)} style={common.flex} />
                </View>
              </Card>
            ))
          )}
        </AsyncState>
      )}
      <View style={common.fim} />
    </ScreenContainer>
  );
}
