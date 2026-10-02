import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from './types';
import { useAppTheme } from '../theme/ThemeContext';
import { CustomDrawerContent } from './CustomDrawerContent';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';
import TurmasNavigator from './TurmasNavigator';
import MateriasNavigator from './MateriasNavigator';
import TurnosNavigator from './TurnosNavigator';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const { colors } = useAppTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        drawerActiveTintColor: colors.brand.purple,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: `${colors.brand.purple}18`,
        drawerLabelStyle: { fontWeight: '600', marginLeft: -12 },
        drawerStyle: { backgroundColor: colors.background, width: 280 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Início',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="TurmasStack"
        component={TurmasNavigator}
        options={{
          title: 'Turmas',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="MateriasStack"
        component={MateriasNavigator}
        options={{
          title: 'Matérias',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="TurnosStack"
        component={TurnosNavigator}
        options={{
          title: 'Turnos',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          title: 'Meu perfil',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
