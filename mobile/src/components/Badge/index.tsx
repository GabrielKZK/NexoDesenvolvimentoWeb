import React from 'react';
import { Text, View } from 'react-native';
import { hexToRgba } from '../../utils/color';
import { styles } from './styles';
import { BadgeProps } from './types';

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
