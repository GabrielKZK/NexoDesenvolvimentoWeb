import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '../hooks/useAppTheme';
import AlunoDashboardScreen from '../screens/AlunoDashboard/AlunoDashboardScreen';
import AlunoMateriasScreen from '../screens/AlunoMaterias/AlunoMateriasScreen';
import DesafiosScreen from '../screens/Desafios/DesafiosScreen';
import NotasScreen from '../screens/Notas/NotasScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';
import DiretorDashboardScreen from '../screens/DiretorDashboard/DiretorDashboardScreen';
import EvasaoScreen from '../screens/Evasao/EvasaoScreen';
import RelatoriosScreen from '../screens/Relatorios/RelatoriosScreen';
import MonitoramentoScreen from '../screens/Monitoramento/MonitoramentoScreen';
import AdminDashboardScreen from '../screens/AdminDashboard/AdminDashboardScreen';
import ContasScreen from '../screens/Contas/ContasScreen';
import CatalogoScreen from '../screens/Catalogo/CatalogoScreen';
import MaisScreen from '../screens/Mais/MaisScreen';
import ProfessorDashboardScreen from '../screens/ProfessorDashboard/ProfessorDashboardScreen';
import DiarioScreen from '../screens/Diario/DiarioScreen';
import ProfessorNotasScreen from '../screens/ProfessorNotas/ProfessorNotasScreen';
import ProfessorAvaliacoesScreen from '../screens/ProfessorAvaliacoes/ProfessorAvaliacoesScreen';
import ComunicacaoScreen from '../screens/Comunicacao/ComunicacaoScreen';
import { HeaderActions } from './HeaderActions';
import { TabsParamList } from './types';

const Tab = createBottomTabNavigator<TabsParamList>();

type Icone = keyof typeof Ionicons.glyphMap;
const icone = (nome: Icone, nomeAtivo: Icone) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={focused ? nomeAtivo : nome} size={size} color={color} />
  );

/**
 * Abas por papel (aluno 5, professor 5, diretor 5, admin 4), espelhando o menu de cada papel no web.
 * Barra inferior respeita a área segura (gesto/home indicator).
 */
export default function TabsNavigator() {
  const { usuario } = useAuth();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const professor = usuario?.role === 'professor';

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        // Chat em aluno/professor/diretor (o backend não libera o admin). Só o aluno tem aba de
        // Perfil; os demais papéis chegam a ele pelo ícone do cabeçalho.
        headerRight: () => <HeaderActions comChat={usuario?.role !== 'admin'} comPerfil={usuario?.role !== 'aluno'} />,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.brand.purple,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 56 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6,
        },
      }}
    >
      {usuario?.role === 'aluno' ? (
        <>
          <Tab.Screen name="Inicio" component={AlunoDashboardScreen} options={{ title: 'Início', tabBarIcon: icone('home-outline', 'home') }} />
          <Tab.Screen name="Materias" component={AlunoMateriasScreen} options={{ title: 'Matérias', tabBarIcon: icone('book-outline', 'book') }} />
          <Tab.Screen name="Desafios" component={DesafiosScreen} options={{ title: 'Desafios', tabBarIcon: icone('trophy-outline', 'trophy') }} />
          <Tab.Screen name="Notas" component={NotasScreen} options={{ title: 'Notas', tabBarIcon: icone('stats-chart-outline', 'stats-chart') }} />
        </>
      ) : professor ? (
        <>
          <Tab.Screen name="Inicio" component={ProfessorDashboardScreen} options={{ title: 'Início', tabBarIcon: icone('home-outline', 'home') }} />
          <Tab.Screen name="Diario" component={DiarioScreen} options={{ title: 'Diário', tabBarIcon: icone('calendar-outline', 'calendar') }} />
          <Tab.Screen name="NotasProf" component={ProfessorNotasScreen} options={{ title: 'Notas', tabBarIcon: icone('create-outline', 'create') }} />
          <Tab.Screen name="Avaliacoes" component={ProfessorAvaliacoesScreen} options={{ title: 'Avaliações', tabBarIcon: icone('document-text-outline', 'document-text') }} />
          <Tab.Screen name="Comunicacao" component={ComunicacaoScreen} options={{ title: 'Comunicação', tabBarIcon: icone('chatbubbles-outline', 'chatbubbles') }} />
        </>
      ) : usuario?.role === 'diretor' ? (
        <>
          <Tab.Screen name="Inicio" component={DiretorDashboardScreen} options={{ title: 'Início', tabBarIcon: icone('home-outline', 'home') }} />
          <Tab.Screen name="Evasao" component={EvasaoScreen} options={{ title: 'Evasão', tabBarIcon: icone('warning-outline', 'warning') }} />
          <Tab.Screen name="Relatorios" component={RelatoriosScreen} options={{ title: 'Relatórios', tabBarIcon: icone('bar-chart-outline', 'bar-chart') }} />
          <Tab.Screen name="Docentes" component={MonitoramentoScreen} options={{ title: 'Docentes', tabBarIcon: icone('people-outline', 'people') }} />
          <Tab.Screen name="Mais" component={MaisScreen} options={{ title: 'Mais', tabBarIcon: icone('ellipsis-horizontal-circle-outline', 'ellipsis-horizontal-circle') }} />
        </>
      ) : (
        <>
          <Tab.Screen name="Inicio" component={AdminDashboardScreen} options={{ title: 'Início', tabBarIcon: icone('home-outline', 'home') }} />
          <Tab.Screen name="Contas" component={ContasScreen} options={{ title: 'Contas', tabBarIcon: icone('people-outline', 'people') }} />
          <Tab.Screen name="Catalogo" component={CatalogoScreen} options={{ title: 'Catálogo', tabBarIcon: icone('library-outline', 'library') }} />
          <Tab.Screen name="Mais" component={MaisScreen} options={{ title: 'Mais', tabBarIcon: icone('ellipsis-horizontal-circle-outline', 'ellipsis-horizontal-circle') }} />
        </>
      )}
      {usuario?.role === 'aluno' && (
        <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil', tabBarIcon: icone('person-outline', 'person') }} />
      )}
    </Tab.Navigator>
  );
}
