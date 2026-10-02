import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

interface MenuCardProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string];
  onPress: () => void;
}

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

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
});
