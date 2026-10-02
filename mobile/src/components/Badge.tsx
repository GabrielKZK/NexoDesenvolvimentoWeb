import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  label: string;
  color: string;
  variant?: 'solid' | 'soft';
}

function hexToRgba(hex: string, alpha: number) {
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, variant = 'soft' }) => {
  const isSolid = variant === 'solid';
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isSolid ? color : hexToRgba(color, 0.16) },
      ]}
    >
      <Text style={[styles.text, { color: isSolid ? '#fff' : color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
