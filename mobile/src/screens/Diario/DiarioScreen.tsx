import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useTurmaSelecionada } from '../../hooks/useTurmaSelecionada';
import { professorService } from '../../services/professorService';
import { ConteudoDTO, PresencaAluno } from '../../types/api';
import { common } from '../../styles/common';
import { formatarDataBR, hojeISO, somarDias } from '../../utils/data';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { StatPill } from '../../components/StatPill';
import { Segmented } from '../../components/Segmented';
import { ChipRow } from '../../components/ChipRow';
import { EmptyState } from '../../components/EmptyState';

type Aba = 'chamada' | 'conteudo';
type Retorno = { ok: boolean; texto: string } | null;

/**
 * Diário de classe (web: /diario-classe-professor): chamada do dia e conteúdo ministrado.
 * GET/POST /api/turmas/{id}/frequencia e /api/turmas/{id}/conteudos.
 */
export default function DiarioScreen() {
  const { colors } = useAppTheme();
  const { turmas, turmaId, setTurmaId, carregando, erro, recarregar } = useTurmaSelecionada();

  const [aba, setAba] = useState<Aba>('chamada');
  const [data, setData] = useState(hojeISO());
  const [alunos, setAlunos] = useState<PresencaAluno[]>([]);
  const [presentes, setPresentes] = useState<Record<number, boolean>>({});
  const [historico, setHistorico] = useState<ConteudoDTO[]>([]);
  const [carregandoTurma, setCarregandoTurma] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [retorno, setRetorno] = useState<Retorno>(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [registrando, setRegistrando] = useState(false);

  const carregarTurma = useCallback(async () => {
    if (turmaId == null) return;
    setCarregandoTurma(true);
    setRetorno(null);
    try {
      const [freq, hist] = await Promise.all([
        professorService.frequenciaDoDia(turmaId, data),
        professorService.historicoConteudos(turmaId).catch(() => [] as ConteudoDTO[]),
      ]);
      setAlunos(freq);
      // Sem registro no dia (presente null) assume presente, como no web.
      setPresentes(Object.fromEntries(freq.map((p) => [p.alunoId, p.presente ?? true])));
      setHistorico(hist);
    } catch (e) {
      setRetorno({ ok: false, texto: getErrorMessage(e, 'Não foi possível carregar a turma.') });
    } finally {
      setCarregandoTurma(false);
    }
  }, [turmaId, data]);

  useEffect(() => {
    void carregarTurma();
  }, [carregarTurma]);

  const totalPresentes = useMemo(() => alunos.filter((a) => presentes[a.alunoId]).length, [alunos, presentes]);
  const taxa = alunos.length ? Math.round((totalPresentes / alunos.length) * 100) : 0;

  const salvarChamada = async () => {
    if (turmaId == null || salvando) return;
    setSalvando(true);
    setRetorno(null);
    try {
      const resumo = await professorService.salvarFrequencia(
        turmaId,
        data,
        alunos.map((a) => ({ alunoId: a.alunoId, presente: presentes[a.alunoId] === true })),
      );
      setRetorno({ ok: true, texto: `Frequência salva: ${resumo.presentes} presentes, ${resumo.ausentes} ausentes.` });
    } catch (e) {
      setRetorno({ ok: false, texto: getErrorMessage(e, 'Falha ao salvar a frequência.') });
    } finally {
      setSalvando(false);
    }
  };

  const registrarConteudo = async () => {
    if (turmaId == null) return;
    if (!titulo.trim()) return setRetorno({ ok: false, texto: 'O título da aula é obrigatório.' });
    if (!descricao.trim()) return setRetorno({ ok: false, texto: 'Descreva o conteúdo ministrado.' });
    setRegistrando(true);
    setRetorno(null);
    try {
      const novo = await professorService.registrarConteudo(turmaId, {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        observacoes: observacoes.trim(),
        data,
      });
      setHistorico((h) => [novo, ...h]);
      setTitulo('');
      setDescricao('');
      setObservacoes('');
      setRetorno({ ok: true, texto: 'Conteúdo registrado no histórico.' });
    } catch (e) {
      setRetorno({ ok: false, texto: getErrorMessage(e, 'Falha ao registrar o conteúdo.') });
    } finally {
      setRegistrando(false);
    }
  };

  const feedback = retorno && (
    <Text style={[common.msg, { color: retorno.ok ? colors.status.success : colors.status.danger }]} accessibilityLiveRegion="polite">
      {retorno.texto}
    </Text>
  );

  return (
    <ScreenContainer>
      <AsyncState carregando={carregando} erro={erro} temDados={turmas.length > 0} onRetry={recarregar}>
        {turmas.length === 0 ? (
          <EmptyState icon="people-outline" title="Nenhuma turma atribuída" />
        ) : (
          <>
            <ChipRow opcoes={turmas.map((t) => ({ valor: t.id, rotulo: t.nome }))} valor={turmaId} onChange={setTurmaId} />

            <View style={[common.between, { marginBottom: 12 }]}>
              <Pressable onPress={() => setData(somarDias(data, -1))} hitSlop={10} accessibilityLabel="Dia anterior" style={{ padding: 8 }}>
                <Ionicons name="chevron-back" size={22} color={colors.text} />
              </Pressable>
              <Text style={[common.title, { color: colors.text }]}>{formatarDataBR(data)}</Text>
              <Pressable
                onPress={() => setData(somarDias(data, 1))}
                disabled={data >= hojeISO()}
                hitSlop={10}
                accessibilityLabel="Próximo dia"
                style={{ padding: 8, opacity: data >= hojeISO() ? 0.3 : 1 }}
              >
                <Ionicons name="chevron-forward" size={22} color={colors.text} />
              </Pressable>
            </View>

            <Segmented
              opcoes={[
                { valor: 'chamada', rotulo: 'Chamada' },
                { valor: 'conteudo', rotulo: 'Conteúdo da aula' },
              ]}
              valor={aba}
              onChange={(v) => {
                setAba(v);
                setRetorno(null);
              }}
            />

            {aba === 'chamada' ? (
              <AsyncState carregando={carregandoTurma} erro={null} temDados={alunos.length > 0} onRetry={carregarTurma}>
                <View style={common.pills}>
                  <StatPill icon="people-outline" value={alunos.length} label="Alunos" color={colors.accents.blue} />
                  <StatPill icon="checkmark-circle-outline" value={totalPresentes} label="Presentes" color={colors.brand.green} />
                  <StatPill icon="close-circle-outline" value={alunos.length - totalPresentes} label="Ausentes" color={colors.status.danger} />
                  <StatPill icon="pie-chart-outline" value={`${taxa}%`} label="Frequência" color={colors.brand.purple} />
                </View>

                {alunos.length === 0 ? (
                  <EmptyState icon="people-outline" title="Turma sem alunos" />
                ) : (
                  <>
                    <Button
                      title="Marcar todos presentes"
                      variant="outline"
                      icon="checkmark-done-outline"
                      onPress={() => setPresentes(Object.fromEntries(alunos.map((a) => [a.alunoId, true])))}
                      style={{ marginBottom: 12 }}
                    />
                    {alunos.map((a) => (
                      <Card key={a.alunoId} style={common.card}>
                        <View style={common.between}>
                          <Text style={[common.title, common.flex, { color: colors.text }]} numberOfLines={1}>
                            {a.nome}
                          </Text>
                          <Text style={[common.sub, { color: presentes[a.alunoId] ? colors.brand.green : colors.status.danger }]}>
                            {presentes[a.alunoId] ? 'Presente' : 'Ausente'}
                          </Text>
                          <Switch
                            value={!!presentes[a.alunoId]}
                            onValueChange={(v) => setPresentes((p) => ({ ...p, [a.alunoId]: v }))}
                            thumbColor="#FFFFFF"
                            trackColor={{ false: colors.border, true: colors.brand.deep }}
                            accessibilityLabel={`Presença de ${a.nome}`}
                          />
                        </View>
                      </Card>
                    ))}
                    {feedback}
                    <Button title="Salvar chamada" icon="save-outline" onPress={salvarChamada} loading={salvando} />
                  </>
                )}
              </AsyncState>
            ) : (
              <>
                <Card style={common.card}>
                  <Input label="Título da aula" value={titulo} onChangeText={setTitulo} maxLength={150} />
                  <Input label="Conteúdo ministrado" value={descricao} onChangeText={setDescricao} multiline style={common.multiline} />
                  <Input label="Observações (opcional)" value={observacoes} onChangeText={setObservacoes} multiline />
                  {feedback}
                  <Button title="Registrar conteúdo" icon="add-circle-outline" onPress={registrarConteudo} loading={registrando} />
                </Card>

                <Text style={[common.section, { color: colors.text }]}>Histórico</Text>
                {historico.length === 0 ? (
                  <Text style={[common.sub, { color: colors.textSecondary }]}>Nenhum conteúdo registrado.</Text>
                ) : (
                  historico.map((c) => (
                    <Card key={c.id} style={common.card}>
                      <Text style={[common.title, { color: colors.text }]}>{c.titulo}</Text>
                      <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 6 }]}>{formatarDataBR(c.data)}</Text>
                      <Text style={[common.text, { color: colors.text }]}>{c.descricao}</Text>
                    </Card>
                  ))
                )}
              </>
            )}
            <View style={common.fim} />
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
