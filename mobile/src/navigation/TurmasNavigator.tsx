import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TurmasStackParamList } from './types';
import { useStackScreenOptions } from './useStackScreenOptions';
import TurmasListScreen from '../screens/Turmas/TurmasListScreen';
import TurmaFormScreen from '../screens/Turmas/TurmaFormScreen';

const Stack = createNativeStackNavigator<TurmasStackParamList>();

export default function TurmasNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="TurmasList" component={TurmasListScreen} options={{ title: 'Turmas' }} />
      <Stack.Screen
        name="TurmaForm"
        component={TurmaFormScreen}
        options={({ route }) => ({ title: route.params?.id ? 'Editar turma' : 'Nova turma' })}
      />
    </Stack.Navigator>
  );
}
