import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AlunoStackParamList } from './types';
import { useStackScreenOptions } from './useStackScreenOptions';
import AlunoDashboardScreen from '../screens/AlunoDashboard/AlunoDashboardScreen';
import AlunoMateriasScreen from '../screens/AlunoMaterias/AlunoMateriasScreen';
import AlunoMateriaDetalheScreen from '../screens/AlunoMateriaDetalhe/AlunoMateriaDetalheScreen';

const Stack = createNativeStackNavigator<AlunoStackParamList>();

export default function AlunoNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="AlunoDashboard" component={AlunoDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AlunoMaterias" component={AlunoMateriasScreen} options={{ title: 'Matérias' }} />
      <Stack.Screen name="AlunoMateriaDetalhe" component={AlunoMateriaDetalheScreen} options={{ title: 'Matéria' }} />
    </Stack.Navigator>
  );
}
