import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

export const LoadingView: React.FC<{ label?: string }> = ({ label = 'Carregando...' }) => {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.brand.purple} />
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 12, fontSize: 13 },
});
