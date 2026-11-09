import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { alunoService } from '../../services/alunoService';
import { RootStackParamList } from '../../navigation/types';
import { ConteudoMateriaDTO } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './styles';

/** Conteúdos de uma matéria e marcação de concluído (web: /disciplina/:id). */
export default function AlunoMateriaDetalheScreen() {
  const { colors } = useAppTheme();
  const { materiaId } = useRoute<RouteProp<RootStackParamList, 'MateriaDetalhe'>>().params;

  const [conteudos, setConteudos] = useState<ConteudoMateriaDTO[] | null>(null);
  const [concluidos, setConcluidos] = useState<ReadonlySet<number>>(new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aberto, setAberto] = useState<number | null>(null);
  const [salvandoId, setSalvandoId] = useState<number | null>(null);
  const [erroMarcar, setErroMarcar] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [lista, ids] = await Promise.all([
        alunoService.conteudos(materiaId),
        alunoService.conteudosConcluidos(materiaId).catch(() => [] as number[]),
      ]);
      setConteudos([...lista].sort((a, b) => a.ordem - b.ordem));
      setConcluidos(new Set(ids));
    } catch (e) {
      setErro(getErrorMessage(e, 'Não foi possível carregar os conteúdos.'));
    } finally {
      setCarregando(false);
    }
  }, [materiaId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const aplicar = (id: number, concluido: boolean) =>
    setConcluidos((atual) => {
      const novo = new Set(atual);
      if (concluido) novo.add(id);
      else novo.delete(id);
      return novo;
    });

  /** Muda na tela antes da resposta; se o servidor recusar, volta ao que era. */
  const alternar = async (c: ConteudoMateriaDTO) => {
    const estava = concluidos.has(c.id);
    setErroMarcar(null);
    setSalvandoId(c.id);
    aplicar(c.id, !estava);
    try {
      if (estava) await alunoService.desmarcarConteudo(c.id);
      else await alunoService.concluirConteudo(c.id);
    } catch (e) {
      aplicar(c.id, estava);
      setErroMarcar(getErrorMessage(e, 'Não foi possível salvar. Tente de novo.'));
    } finally {
      setSalvandoId(null);
    }
  };

  const total = conteudos?.length ?? 0;
  const feitos = useMemo(() => (conteudos ?? []).filter((c) => concluidos.has(c.id)).length, [conteudos, concluidos]);
  const percentual = total === 0 ? 0 : Math.round((feitos * 100) / total);

  return (
    <ScreenContainer>
      <AsyncState carregando={carregando} erro={erro} temDados={!!conteudos} onRetry={carregar}>
        <Card style={styles.card}>
          <Text style={[styles.resumo, { color: colors.textSecondary }]}>
            {feitos} de {total} conteúdos concluídos · {percentual}%
          </Text>
          <ProgressBar percent={percentual} color={colors.brand.deep} height={10} />
        </Card>

        {erroMarcar && <Text style={[styles.erro, { color: colors.status.danger }]}>{erroMarcar}</Text>}

        {total === 0 ? (
          <EmptyState icon="document-text-outline" title="Sem conteúdos publicados" />
        ) : (
          (conteudos ?? []).map((c) => {
            const feito = concluidos.has(c.id);
            const expandido = aberto === c.id;
            return (
              <Card key={c.id} style={styles.card}>
                <View style={styles.cabecalho}>
                  <Pressable
                    style={styles.titulos}
                    onPress={() => setAberto(expandido ? null : c.id)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: expandido }}
                  >
                    <Text style={[styles.titulo, { color: colors.text }]}>{c.titulo}</Text>
                    <Text style={[styles.resumo, { color: colors.textSecondary }]}>
                      {c.resumo} · {c.minutos} min
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => alternar(c)}
                    disabled={salvandoId === c.id}
                    hitSlop={10}
                    style={styles.check}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: feito }}
                    accessibilityLabel={`Concluído: ${c.titulo}`}
                  >
                    <Ionicons
                      name={feito ? 'checkmark-circle' : 'ellipse-outline'}
                      size={30}
                      color={feito ? colors.brand.green : colors.textSecondary}
                    />
                  </Pressable>
                </View>

                {expandido && (
                  <View style={styles.corpo}>
                    {c.texto.split(/\n\s*\n/).map((p, i) => (
                      <Text key={i} style={[styles.paragrafo, { color: colors.text }]}>
                        {p.trim()}
                      </Text>
                    ))}
                    {!!c.exemplo && (
                      <View style={[styles.exemplo, { backgroundColor: colors.input, borderColor: colors.border }]}>
                        <Text style={[styles.exemploRotulo, { color: colors.brand.purple }]}>Exemplo</Text>
                        <Text style={[styles.paragrafo, { color: colors.text }]}>{c.exemplo}</Text>
                      </View>
                    )}
                  </View>
                )}
              </Card>
            );
          })
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
