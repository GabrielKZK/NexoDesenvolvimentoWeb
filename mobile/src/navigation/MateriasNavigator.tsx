import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MateriasStackParamList } from './types';
import { useStackScreenOptions } from './useStackScreenOptions';
import MateriasListScreen from '../screens/Materias/MateriasListScreen';
import MateriaFormScreen from '../screens/Materias/MateriaFormScreen';

const Stack = createNativeStackNavigator<MateriasStackParamList>();

export default function MateriasNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="MateriasList" component={MateriasListScreen} options={{ title: 'Matérias' }} />
      <Stack.Screen
        name="MateriaForm"
        component={MateriaFormScreen}
        options={({ route }) => ({ title: route.params?.id ? 'Editar matéria' : 'Nova matéria' })}
      />
    </Stack.Navigator>
  );
}
