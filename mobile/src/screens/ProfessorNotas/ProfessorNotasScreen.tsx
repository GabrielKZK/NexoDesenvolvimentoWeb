import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useTurmaSelecionada } from '../../hooks/useTurmaSelecionada';
import { professorService } from '../../services/professorService';
import { common } from '../../styles/common';
import { formatarNota, lerNota } from '../../utils/data';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { StatPill } from '../../components/StatPill';
import { Segmented } from '../../components/Segmented';
import { ChipRow } from '../../components/ChipRow';
import { EmptyState } from '../../components/EmptyState';

interface Linha {
  alunoId: number;
  aluno: string;
  periodo: string;
  p1: string;
  p2: string;
  t1: string;
  part: string;
  /** Valores como vieram do servidor, para enviar só o que mudou. */
  original: string;
}

type Filtro = 'todos' | 'aprovados' | 'risco';
const CAMPOS = [
  { chave: 'p1', rotulo: 'P1' },
  { chave: 'p2', rotulo: 'P2' },
  { chave: 't1', rotulo: 'T1' },
  { chave: 'part', rotulo: 'Part.' },
] as const;

const assinatura = (l: Pick<Linha, 'p1' | 'p2' | 't1' | 'part'>) => [l.p1, l.p2, l.t1, l.part].join('|');

/**
 * Média ponderada oficial do servidor (Nota.calcularMedia: P1 e P2 peso 3, T1 e participação peso 2,
 * só os campos preenchidos). O web exibe média simples nesta tela, mas o que o aluno e o diretor veem
 * (e o que o relatório usa) é esta; usar a mesma evita o mesmo aluno aparecer com duas médias.
 */
function mediaDe(l: Linha): number {
  const itens: [string, number][] = [[l.p1, 3], [l.p2, 3], [l.t1, 2], [l.part, 2]];
  let soma = 0;
  let pesos = 0;
  for (const [texto, peso] of itens) {
    const v = lerNota(texto);
    if (v !== null) {
      soma += v * peso;
      pesos += peso;
    }
  }
  return pesos ? Math.round((soma / pesos) * 10) / 10 : 0;
}

/**
 * Notas da turma (web: /notas-engajamento). GET /api/turmas/{id}/notas?disciplina=…
 * e PATCH /api/alunos/{id}/notas. A matéria vem de /api/professor/materias: lançar nota
 * em matéria alheia é recusado pelo servidor.
 */
export default function ProfessorNotasScreen() {
  const { colors } = useAppTheme();
  const { turmas, turmaId, setTurmaId, carregando, erro, recarregar } = useTurmaSelecionada();

  const [materias, setMaterias] = useState<string[]>([]);
  const [disciplina, setDisciplina] = useState<string | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [carregandoNotas, setCarregandoNotas] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [retorno, setRetorno] = useState<{ ok: boolean; texto: string } | null>(null);

  useEffect(() => {
    professorService
      .materias()
      .then((m) => {
        setMaterias(m);
        setDisciplina((atual) => atual ?? m[0] ?? null);
      })
      .catch(() => setMaterias([]));
  }, []);

  const carregarNotas = useCallback(async () => {
    if (turmaId == null || !disciplina) return;
    setCarregandoNotas(true);
    setRetorno(null);
    try {
      const notas = await professorService.notasDaTurma(turmaId, disciplina);
      setLinhas(
        notas.map((n) => {
          const l = {
            alunoId: n.alunoId,
            aluno: n.aluno,
            periodo: n.periodo,
            p1: formatarNota(n.p1),
            p2: formatarNota(n.p2),
            t1: formatarNota(n.t1),
            part: formatarNota(n.participacao),
          };
          return { ...l, original: assinatura(l) };
        }),
      );
    } catch (e) {
      setLinhas([]);
      setRetorno({ ok: false, texto: getErrorMessage(e, 'Não foi possível carregar as notas.') });
    } finally {
      setCarregandoNotas(false);
    }
  }, [turmaId, disciplina]);

  useEffect(() => {
    void carregarNotas();
  }, [carregarNotas]);

  const alterar = (alunoId: number, campo: (typeof CAMPOS)[number]['chave'], valor: string) =>
    setLinhas((ls) => ls.map((l) => (l.alunoId === alunoId ? { ...l, [campo]: valor } : l)));

  const visiveis = useMemo(
    () =>
      linhas.filter((l) => (filtro === 'aprovados' ? mediaDe(l) >= 6 : filtro === 'risco' ? mediaDe(l) < 6 : true)),
    [linhas, filtro],
  );
  const medias = linhas.map(mediaDe).filter((m) => m > 0);
  const mediaGeral = medias.length ? medias.reduce((s, m) => s + m, 0) / medias.length : 0;
  const taxa = medias.length ? Math.round((medias.filter((m) => m >= 6).length / medias.length) * 100) : 0;
  const alteradas = linhas.filter((l) => assinatura(l) !== l.original);
  const invalida = alteradas.some((l) =>
    [l.p1, l.p2, l.t1, l.part].some((v) => {
      const n = lerNota(v);
      return v.trim() !== '' && (n === null || n < 0 || n > 10);
    }),
  );

  const salvar = async () => {
    if (!disciplina || alteradas.length === 0 || salvando) return;
    setSalvando(true);
    setRetorno(null);
    try {
      await Promise.all(
        alteradas.map((l) =>
          professorService.editarNotas(l.alunoId, {
            disciplina,
            periodo: l.periodo,
            p1: lerNota(l.p1) ?? undefined,
            p2: lerNota(l.p2) ?? undefined,
            t1: lerNota(l.t1) ?? undefined,
            participacao: lerNota(l.part) ?? undefined,
          }),
        ),
      );
      setLinhas((ls) => ls.map((l) => ({ ...l, original: assinatura(l) })));
      setRetorno({ ok: true, texto: `Notas salvas (${alteradas.length} aluno${alteradas.length > 1 ? 's' : ''}).` });
    } catch (e) {
      setRetorno({ ok: false, texto: getErrorMessage(e, 'Falha ao salvar as notas.') });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScreenContainer>
      <AsyncState carregando={carregando} erro={erro} temDados={turmas.length > 0} onRetry={recarregar}>
        {turmas.length === 0 ? (
          <EmptyState icon="people-outline" title="Nenhuma turma atribuída" />
        ) : (
          <>
            <ChipRow opcoes={turmas.map((t) => ({ valor: t.id, rotulo: t.nome }))} valor={turmaId} onChange={setTurmaId} />
            {materias.length === 0 ? (
              <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 12 }]}>
                Nenhuma matéria vinculada ao seu cadastro.
              </Text>
            ) : (
              <ChipRow opcoes={materias.map((m) => ({ valor: m, rotulo: m }))} valor={disciplina} onChange={setDisciplina} />
            )}

            <View style={common.pills}>
              <StatPill icon="stats-chart-outline" value={mediaGeral.toFixed(1)} label="Média da turma" color={colors.brand.purple} />
              <StatPill icon="checkmark-outline" value={`${taxa}%`} label="Aprovação" color={colors.brand.green} />
              <StatPill
                icon="warning-outline"
                value={linhas.filter((l) => mediaDe(l) < 6).length}
                label="Em risco"
                color={colors.accents.amber}
              />
            </View>

            <Segmented
              opcoes={[
                { valor: 'todos', rotulo: 'Todos' },
                { valor: 'aprovados', rotulo: 'Aprovados' },
                { valor: 'risco', rotulo: 'Em risco' },
              ]}
              valor={filtro}
              onChange={setFiltro}
            />

            <AsyncState carregando={carregandoNotas} erro={null} temDados={linhas.length > 0} onRetry={carregarNotas}>
              {visiveis.length === 0 ? (
                <EmptyState icon="document-text-outline" title="Nenhum aluno aqui" />
              ) : (
                visiveis.map((l) => {
                  const m = mediaDe(l);
                  const cor = m >= 8 ? colors.brand.green : m >= 6 ? colors.accents.blue : colors.status.danger;
                  return (
                    <Card key={l.alunoId} style={common.card}>
                      <View style={common.between}>
                        <Text style={[common.title, common.flex, { color: colors.text }]} numberOfLines={1}>
                          {l.aluno}
                        </Text>
                        <Badge label={m >= 8 ? 'Excelente' : m >= 6 ? 'Bom' : 'Atenção'} color={cor} />
                        <Text style={[common.title, { color: cor, minWidth: 36, textAlign: 'right' }]}>{m.toFixed(1)}</Text>
                      </View>
                      <View style={[common.row, { marginTop: 10 }]}>
                        {CAMPOS.map((c) => (
                          <View key={c.chave} style={common.flex}>
                            <Text style={[common.sub, { color: colors.textSecondary, marginTop: 0 }]}>{c.rotulo}</Text>
                            <TextInput
                              value={l[c.chave]}
                              onChangeText={(v) => alterar(l.alunoId, c.chave, v)}
                              keyboardType="decimal-pad"
                              maxLength={5}
                              placeholder="—"
                              placeholderTextColor={colors.textSecondary}
                              accessibilityLabel={`${c.rotulo} de ${l.aluno}`}
                              style={{
                                minHeight: 44,
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                textAlign: 'center',
                                fontSize: 15,
                                color: colors.text,
                                backgroundColor: colors.input,
                                borderColor: colors.border,
                              }}
                            />
                          </View>
                        ))}
                      </View>
                    </Card>
                  );
                })
              )}
            </AsyncState>

            {retorno && (
              <Text style={[common.msg, { color: retorno.ok ? colors.status.success : colors.status.danger }]} accessibilityLiveRegion="polite">
                {retorno.texto}
              </Text>
            )}
            {invalida && <Text style={[common.msg, { color: colors.status.danger }]}>As notas devem estar entre 0 e 10.</Text>}
            <Button
              title={alteradas.length ? `Salvar alterações (${alteradas.length})` : 'Salvar alterações'}
              icon="save-outline"
              onPress={salvar}
              loading={salvando}
              disabled={alteradas.length === 0 || invalida}
            />
            <View style={common.fim} />
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
