import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '../hooks/useAppTheme';
import { LoadingView } from '../components/LoadingView';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import AlunoNavigator from './AlunoNavigator';

export default function RootNavigator() {
  const { professor, aluno, booting } = useAuth();
  const { colors, isDark } = useAppTheme();

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

  if (booting) {
    return <LoadingView label="Preparando o app..." />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {professor ? <DrawerNavigator /> : aluno ? <AlunoNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
