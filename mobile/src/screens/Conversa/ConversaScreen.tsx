import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { ChatMensagem, chatService } from '../../services/chatService';
import { RootStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { hexToRgba } from '../../utils/color';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './styles';

const LIMITE_TEXTO = 1000;

const hora = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};
const dia = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR');
};

/** Conversa direta em tempo real (web: /chat). Histórico por REST; envio e recebimento por WebSocket. */
export default function ConversaScreen() {
  const { contato } = useRoute<RouteProp<RootStackParamList, 'Conversa'>>().params;
  const { usuario } = useAuth();
  const { colors } = useAppTheme();
  const { conectado, enviar, assinar, definirConversaAberta } = useChat();
  const alturaCabecalho = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const meuId = usuario?.id ?? -1;

  // Ordem cronológica; a lista é invertida na tela, então o fim da conversa fica junto ao teclado.
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [falhaEnvio, setFalhaEnvio] = useState(false);

  const anexar = useCallback((msg: ChatMensagem) => {
    setMensagens((lista) => (msg.id !== null && lista.some((m) => m.id === msg.id) ? lista : [...lista, msg]));
  }, []);

  const carregarHistorico = useCallback(async () => {
    setErro(null);
    setCarregando(true);
    try {
      const historico = await chatService.historico(contato.id);
      // Mantém o que chegou ao vivo durante a busca e ainda não está no histórico.
      setMensagens((ao_vivo) => {
        const ids = new Set(historico.map((m) => m.id));
        return [...historico, ...ao_vivo.filter((m) => m.id === null || !ids.has(m.id))];
      });
    } catch (e) {
      setErro(getErrorMessage(e, 'Não foi possível carregar a conversa.'));
    } finally {
      setCarregando(false);
    }
  }, [contato.id]);

  useEffect(() => {
    definirConversaAberta(contato.id);
    const cancelar = assinar((msg) => {
      const pertence = (msg.de === meuId && msg.para === contato.id) || (msg.de === contato.id && msg.para === meuId);
      if (pertence) anexar(msg);
    });
    void carregarHistorico();
    return () => {
      cancelar();
      definirConversaAberta(null);
    };
  }, [contato.id, meuId, assinar, anexar, carregarHistorico, definirConversaAberta]);

  // Reconectou: busca o que possa ter chegado enquanto o socket estava fora.
  const [jaConectou, setJaConectou] = useState(false);
  useEffect(() => {
    if (!conectado) return;
    if (jaConectou) void carregarHistorico();
    else setJaConectou(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conectado]);

  const aoEnviar = () => {
    const limpo = texto.trim();
    if (!limpo) return;
    // O servidor persiste e ecoa a mensagem pelo socket: ela entra na lista por `assinar`.
    if (enviar(contato.id, limpo)) {
      setTexto('');
      setFalhaEnvio(false);
    } else {
      setFalhaEnvio(true);
    }
  };

  const invertidas = [...mensagens].reverse();

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? alturaCabecalho : 0}
    >
      {!conectado && (
        <Text style={[styles.aviso, { color: colors.status.warning, backgroundColor: colors.card }]}>
          Sem conexão com o chat. Reconectando...
        </Text>
      )}

      {carregando && mensagens.length === 0 ? (
        <View style={styles.centro}>
          <ActivityIndicator color={colors.brand.purple} />
        </View>
      ) : erro && mensagens.length === 0 ? (
        <EmptyState icon="cloud-offline-outline" title="Não foi possível carregar" subtitle={erro} actionLabel="Tentar de novo" onAction={carregarHistorico} />
      ) : (
        <FlatList
          data={invertidas}
          inverted
          keyExtractor={(m, i) => (m.id !== null ? `m${m.id}` : `t${m.criadaEm}-${i}`)}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            // A lista está invertida: o estilo desfaz o espelhamento do conteúdo vazio.
            <View style={styles.vazioInvertido}>
              <EmptyState icon="chatbubble-ellipses-outline" title="Nenhuma mensagem ainda" subtitle={`Diga olá para ${contato.nome}.`} />
            </View>
          }
          renderItem={({ item, index }) => {
            const minha = item.de === meuId;
            // Com a lista invertida, o item "anterior" no tempo é o seguinte no array.
            const anterior = invertidas[index + 1];
            const novoDia = !anterior || dia(anterior.criadaEm) !== dia(item.criadaEm);
            return (
              <View>
                {novoDia && (
                  <Text style={[styles.dia, { color: colors.textSecondary }]}>{dia(item.criadaEm)}</Text>
                )}
                <View
                  style={[
                    styles.bolha,
                    minha ? styles.minha : styles.dele,
                    {
                      backgroundColor: minha ? colors.brand.deep : colors.card,
                      borderColor: minha ? colors.brand.deep : colors.border,
                    },
                  ]}
                >
                  <Text selectable style={{ color: minha ? '#fff' : colors.text, fontSize: 15, lineHeight: 21 }}>
                    {item.texto}
                  </Text>
                  <Text style={[styles.hora, { color: minha ? hexToRgba('#ffffff', 0.75) : colors.textSecondary }]}>
                    {hora(item.criadaEm)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      {falhaEnvio && (
        <Text style={[styles.aviso, { color: colors.status.danger, backgroundColor: colors.card }]}>
          Não foi possível enviar: sem conexão com o chat. Tente de novo em instantes.
        </Text>
      )}

      <View
        style={[
          styles.barra,
          { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 8) },
        ]}
      >
        <TextInput
          value={texto}
          onChangeText={(t) => {
            setTexto(t);
            if (falhaEnvio) setFalhaEnvio(false);
          }}
          placeholder="Digite uma mensagem..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={LIMITE_TEXTO}
          style={[styles.campo, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
        />
        <Pressable
          onPress={aoEnviar}
          disabled={!texto.trim()}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensagem"
          style={[styles.enviar, { backgroundColor: colors.brand.deep, opacity: texto.trim() ? 1 : 0.4 }]}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
