import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '../hooks/useAppTheme';
import { LoadingView } from '../components/LoadingView';
import LoginScreen from '../screens/Login/LoginScreen';
import TrocarSenhaScreen from '../screens/TrocarSenha/TrocarSenhaScreen';
import AlunoMateriaDetalheScreen from '../screens/AlunoMateriaDetalhe/AlunoMateriaDetalheScreen';
import QuizScreen from '../screens/Quiz/QuizScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';
import ConfiguracoesScreen from '../screens/Configuracoes/ConfiguracoesScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ConversaScreen from '../screens/Conversa/ConversaScreen';
import InscricoesScreen from '../screens/Inscricoes/InscricoesScreen';
import CadastroScreen from '../screens/Cadastro/CadastroScreen';
import AuditoriaScreen from '../screens/Auditoria/AuditoriaScreen';
import CatalogoMateriaScreen from '../screens/CatalogoMateria/CatalogoMateriaScreen';
import TabsNavigator from './TabsNavigator';
import { useStackScreenOptions } from './useStackScreenOptions';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Fluxo de acesso igual ao dos guards do web: sem sessão → Login; senha provisória →
 * somente TrocarSenha; caso contrário → app do papel. Como só as telas do estado atual
 * existem no navegador, não há rota por onde "fugir" da troca de senha.
 */
export default function RootNavigator() {
  const { usuario, booting } = useAuth();
  const { colors, isDark } = useAppTheme();
  const screenOptions = useStackScreenOptions();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.brand.purple,
    },
  };

  if (booting) return <LoadingView label="Preparando o app..." />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        {!usuario ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : usuario.precisaTrocarSenha ? (
          <Stack.Screen
            name="TrocarSenha"
            component={TrocarSenhaScreen}
            options={{ title: 'Trocar senha', headerBackVisible: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
            <Stack.Screen
              name="MateriaDetalhe"
              component={AlunoMateriaDetalheScreen}
              options={({ route }) => ({ title: route.params.nome })}
            />
            <Stack.Screen name="Quiz" component={QuizScreen} options={({ route }) => ({ title: route.params.titulo })} />
            <Stack.Screen name="TrocarSenha" component={TrocarSenhaScreen} options={{ title: 'Trocar senha' }} />
            <Stack.Screen name="PerfilStack" component={PerfilScreen} options={{ title: 'Perfil' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
            <Stack.Screen name="Conversa" component={ConversaScreen} options={({ route }) => ({ title: route.params.contato.nome })} />
            <Stack.Screen name="Inscricoes" component={InscricoesScreen} options={{ title: 'Inscrições' }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
            <Stack.Screen name="CatalogoMateria" component={CatalogoMateriaScreen} options={({ route }) => ({ title: route.params.nome })} />
            {usuario.role === 'admin' && <Stack.Screen name="Auditoria" component={AuditoriaScreen} options={{ title: 'Auditoria e logs' }} />}
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ title: 'Configurações' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
