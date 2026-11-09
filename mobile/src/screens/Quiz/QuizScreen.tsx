import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { alunoService } from '../../services/alunoService';
import { RootStackParamList } from '../../navigation/types';
import { DesafioDTO, QuizPerguntaDTO, QuizResultadoDTO } from '../../types/desafios';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { styles } from './styles';

const LETRAS = 'ABCDEFGH';

/**
 * Quiz de um desafio (web: /desafios/:id/quiz). Regra: só conclui quem acerta tudo.
 *  - Gabaritou → XP creditado e o quiz vira modo revisão, com o gabarito visível
 *    (o backend só devolve `respostaCorreta` depois de CONCLUIDO).
 *  - Errou algo → "tente de novo", sem XP, seleções limpas e NADA revelado.
 */
export default function QuizScreen() {
  const { colors } = useAppTheme();
  const { desafioId } = useRoute<RouteProp<RootStackParamList, 'Quiz'>>().params;

  const [desafio, setDesafio] = useState<DesafioDTO | null>(null);
  const [perguntas, setPerguntas] = useState<QuizPerguntaDTO[]>([]);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [resultado, setResultado] = useState<QuizResultadoDTO | null>(null);
  const [reprovado, setReprovado] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [d, p] = await Promise.all([alunoService.desafio(desafioId), alunoService.perguntas(desafioId)]);
      setDesafio(d);
      setTentativas(d.tentativas ?? 0);
      setPerguntas(p);
    } catch (e) {
      setErro(getErrorMessage(e, 'Não foi possível carregar o desafio.'));
    } finally {
      setCarregando(false);
    }
  }, [desafioId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const revisao = resultado?.aprovado === true || desafio?.status === 'CONCLUIDO';
  const respondidas = Object.keys(respostas).length;
  const pronto = perguntas.length > 0 && respondidas === perguntas.length;

  const placar = useMemo(() => {
    if (resultado?.aprovado) {
      return { acertos: resultado.acertos ?? resultado.totalPerguntas, total: resultado.totalPerguntas, xp: resultado.xpGanho };
    }
    if (desafio?.status === 'CONCLUIDO' && desafio.acertos !== null && desafio.totalPerguntas !== null) {
      return { acertos: desafio.acertos, total: desafio.totalPerguntas, xp: 0 };
    }
    return null;
  }, [resultado, desafio]);

  const enviar = async () => {
    if (!pronto) {
      setErroEnvio('Responda todas as perguntas antes de enviar.');
      return;
    }
    setErroEnvio(null);
    setEnviando(true);
    try {
      const itens = Object.entries(respostas).map(([perguntaId, alternativaEscolhida]) => ({
        perguntaId: Number(perguntaId),
        alternativaEscolhida,
      }));
      const r = await alunoService.finalizarQuiz(desafioId, itens);
      setTentativas(r.tentativas ?? tentativas + 1);
      // `aprovado` é a fonte de verdade; sem ele, cai no placar (acertou tudo).
      const aprovado = typeof r.aprovado === 'boolean' ? r.aprovado : r.acertos !== null && r.acertos === r.totalPerguntas;
      if (!aprovado) {
        setRespostas({});
        setReprovado(true);
        return;
      }
      setReprovado(false);
      setResultado({ ...r, aprovado: true });
      // Recarrega para receber o gabarito oficial (só vem depois de CONCLUIDO).
      const [d, p] = await Promise.all([alunoService.desafio(desafioId), alunoService.perguntas(desafioId)]);
      setDesafio(d);
      setPerguntas(p);
    } catch (e) {
      setErroEnvio(getErrorMessage(e, 'Não foi possível enviar suas respostas.'));
    } finally {
      setEnviando(false);
    }
  };

  const estilo = (p: QuizPerguntaDTO, i: number) => {
    const escolhida = respostas[p.id];
    if (!revisao) {
      return escolhida === i
        ? { borderColor: colors.brand.purple, backgroundColor: `${colors.brand.purple}18` }
        : { borderColor: colors.border, backgroundColor: colors.card };
    }
    // Revisão só existe para quem gabaritou: o que está marcado/gabarito é correto.
    const correta = p.respostaCorreta === null ? escolhida === i : p.respostaCorreta === i;
    return correta
      ? { borderColor: colors.brand.green, backgroundColor: `${colors.brand.green}18` }
      : { borderColor: colors.border, backgroundColor: colors.card };
  };

  return (
    <ScreenContainer>
      <AsyncState carregando={carregando} erro={erro} temDados={!!desafio} onRetry={carregar}>
        {desafio && (
          <>
            <Text style={[styles.titulo, { color: colors.text }]}>{desafio.titulo}</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              {desafio.materia} · {desafio.xp} XP · {tentativas === 1 ? '1 tentativa' : `${tentativas} tentativas`}
            </Text>

            {placar && (
              <View style={[styles.banner, { backgroundColor: `${colors.brand.green}18` }]} accessibilityLiveRegion="polite">
                <Ionicons name="trophy" size={20} color={colors.brand.green} />
                <Text style={[styles.bannerTexto, { color: colors.text }]}>
                  Parabéns, você acertou tudo! {placar.acertos} de {placar.total}.
                  {placar.xp > 0 ? ` +${placar.xp} XP creditado.` : ' Desafio já concluído antes.'}
                </Text>
              </View>
            )}

            {reprovado && !revisao && (
              <View style={[styles.banner, { backgroundColor: `${colors.status.warning}22` }]} accessibilityLiveRegion="polite">
                <Ionicons name="refresh" size={20} color={colors.status.warning} />
                <Text style={[styles.bannerTexto, { color: colors.text }]}>
                  Ainda não foi dessa vez. É preciso acertar todas as perguntas para concluir. Revise o conteúdo e tente de novo — nenhum XP foi creditado.
                </Text>
              </View>
            )}

            {perguntas.map((p, idx) => (
              <Card key={p.id} style={styles.card}>
                <Text style={[styles.enunciado, { color: colors.text }]}>
                  {idx + 1}. {p.enunciado}
                </Text>
                {p.alternativas.map((alt, i) => (
                  <Pressable
                    key={i}
                    disabled={revisao}
                    onPress={() => setRespostas((r) => ({ ...r, [p.id]: i }))}
                    style={[styles.alternativa, estilo(p, i)]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: respostas[p.id] === i, disabled: revisao }}
                  >
                    <Text style={[styles.letra, { color: colors.textSecondary }]}>{LETRAS[i] ?? i + 1}</Text>
                    <Text style={[styles.altTexto, { color: colors.text }]}>{alt}</Text>
                  </Pressable>
                ))}
              </Card>
            ))}

            {erroEnvio && <Text style={[styles.erro, { color: colors.status.danger }]}>{erroEnvio}</Text>}

            {!revisao && (
              <Button
                title={`Enviar respostas (${respondidas}/${perguntas.length})`}
                onPress={enviar}
                loading={enviando}
                disabled={!pronto}
                icon="paper-plane-outline"
              />
            )}
            <View style={styles.fim} />
          </>
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
