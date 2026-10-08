import React from 'react';
import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { MenuCardProps } from './types';

export const MenuCard: React.FC<MenuCardProps> = ({ title, subtitle, icon, gradient, onPress }) => {
  const { colors, isDark } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
          shadowOpacity: isDark ? 0.3 : 0.08,
        },
      ]}
    >
      <LinearGradient colors={gradient} style={styles.iconWrap}>
        <Ionicons name={icon} size={22} color="#fff" />
      </LinearGradient>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </Pressable>
  );
};
