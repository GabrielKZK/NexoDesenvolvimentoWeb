import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { CardProps } from './types';

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const { colors, isDark } = useAppTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0.3 : 0.08,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
