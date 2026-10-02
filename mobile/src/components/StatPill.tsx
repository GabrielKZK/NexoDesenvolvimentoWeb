import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

interface StatPillProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
  color: string;
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
});
