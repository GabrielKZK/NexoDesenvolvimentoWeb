import { useAppTheme } from '../theme/ThemeContext';

export function useStackScreenOptions() {
  const { colors } = useAppTheme();
  return {
    headerStyle: { backgroundColor: colors.card },
    headerTintColor: colors.text,
    headerTitleStyle: { fontWeight: '700' as const },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.background },
  };
}
