import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { StatPillProps } from './types';

export const StatPill: React.FC<StatPillProps> = ({ icon, value, label, color }) => {
  const { colors, isDark } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: isDark ? 0.3 : 0.08 }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};
