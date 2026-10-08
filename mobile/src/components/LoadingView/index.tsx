import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { LoadingViewProps } from './types';

export const LoadingView: React.FC<LoadingViewProps> = ({ label = 'Carregando...' }) => {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.brand.purple} />
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};
