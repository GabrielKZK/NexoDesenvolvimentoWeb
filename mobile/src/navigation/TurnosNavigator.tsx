import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TurnosStackParamList } from './types';
import { useStackScreenOptions } from './useStackScreenOptions';
import TurnosListScreen from '../screens/Turnos/TurnosListScreen';
import TurnoFormScreen from '../screens/Turnos/TurnoFormScreen';

const Stack = createNativeStackNavigator<TurnosStackParamList>();

export default function TurnosNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="TurnosList" component={TurnosListScreen} options={{ title: 'Turnos' }} />
      <Stack.Screen
        name="TurnoForm"
        component={TurnoFormScreen}
        options={({ route }) => ({ title: route.params?.id ? 'Editar turno' : 'Novo turno' })}
      />
    </Stack.Navigator>
  );
}
