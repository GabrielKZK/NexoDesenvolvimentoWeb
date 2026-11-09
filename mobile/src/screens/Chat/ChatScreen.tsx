import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { useChat } from '../../hooks/useChat';
import { ChatContato, chatService } from '../../services/chatService';
import { RootStackParamList } from '../../navigation/types';
import { AsyncState } from '../../components/AsyncState';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './styles';

export const PAPEL_ROTULO: Record<string, string> = { DIRETOR: 'Diretor', PROFESSOR: 'Professor', ALUNO: 'Aluno' };

/** Lista de contatos do chat (web: /chat → GET /api/chat/contatos). */
export default function ChatScreen() {
  const { colors } = useAppTheme();
  const { conectado, naoLidas } = useChat();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(chatService.contatos);

  const contatos: ChatContato[] = dados ?? [];

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      {!conectado && (
        <Text style={[styles.aviso, { color: colors.status.warning, backgroundColor: colors.card }]}>
          Reconectando ao chat... as mensagens novas chegam assim que a conexão voltar.
        </Text>
      )}
      <AsyncState carregando={carregando} erro={erro} temDados={dados !== null} onRetry={recarregar}>
        <FlatList
          data={contatos}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={contatos.length ? styles.lista : styles.vazio}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={recarregar} tintColor={colors.brand.purple} />}
          ListEmptyComponent={
            <EmptyState icon="chatbubbles-outline" title="Nenhum contato disponível" subtitle="Você ainda não tem com quem conversar." />
          }
          renderItem={({ item }) => {
            const qtd = naoLidas[item.id] ?? 0;
            return (
              <Pressable
                onPress={() => navigation.navigate('Conversa', { contato: item })}
                accessibilityRole="button"
                accessibilityLabel={`Conversar com ${item.nome}${qtd ? `, ${qtd} mensagens novas` : ''}`}
                style={({ pressed }) => [
                  styles.item,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Avatar nome={item.nome} foto={item.foto} />
                <View style={styles.flex}>
                  <Text style={[styles.nome, { color: colors.text }]} numberOfLines={1}>
                    {item.nome}
                  </Text>
                  <View style={styles.papel}>
                    <Badge label={PAPEL_ROTULO[item.papel] ?? item.papel} color={colors.brand.purple} />
                  </View>
                </View>
                {qtd > 0 && (
                  <View style={[styles.contador, { backgroundColor: colors.status.dangerSolid }]}>
                    <Text style={styles.contadorTexto}>{qtd > 99 ? '99+' : qtd}</Text>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </AsyncState>
    </View>
  );
}
