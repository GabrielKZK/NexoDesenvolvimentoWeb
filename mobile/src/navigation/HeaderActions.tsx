import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { useChat } from '../hooks/useChat';
import { RootStackParamList } from './types';

interface Props {
  /** Admin não tem chat no backend. */
  comChat: boolean;
  /** Papéis cujas abas não têm "Perfil" ganham o atalho do perfil no cabeçalho. */
  comPerfil: boolean;
}

/** Ações do cabeçalho das abas: chat (com contador de não lidas) e, se preciso, perfil. */
export function HeaderActions({ comChat, comPerfil }: Props) {
  const { colors } = useAppTheme();
  const { totalNaoLidas } = useChat();
  const stack = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 8 }}>
      {comChat && (
      <Pressable
        onPress={() => stack.navigate('Chat')}
        accessibilityRole="button"
        accessibilityLabel={totalNaoLidas ? `Abrir chat, ${totalNaoLidas} mensagens novas` : 'Abrir chat'}
        hitSlop={8}
        style={{ paddingHorizontal: 8 }}
      >
        <Ionicons name="chatbubbles-outline" size={26} color={colors.text} />
        {totalNaoLidas > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: 0,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              paddingHorizontal: 4,
              backgroundColor: colors.status.dangerSolid,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{totalNaoLidas > 99 ? '99+' : totalNaoLidas}</Text>
          </View>
        )}
      </Pressable>
      )}
      {comPerfil && (
        <Pressable
          onPress={() => stack.navigate('PerfilStack')}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
          hitSlop={8}
          style={{ paddingHorizontal: 8 }}
        >
          <Ionicons name="person-circle-outline" size={28} color={colors.text} />
        </Pressable>
      )}
    </View>
  );
}
