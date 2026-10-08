import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { ChipProps } from './types';

export const Chip: React.FC<ChipProps> = ({ label, selected, onPress }) => {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.brand.purple : colors.input,
          borderColor: selected ? colors.brand.purple : colors.border,
        },
      ]}
    >
      {selected && <Ionicons name="checkmark" size={14} color="#fff" style={{ marginRight: 4 }} />}
      <Text style={[styles.label, { color: selected ? '#fff' : colors.text }]}>{label}</Text>
    </Pressable>
  );
};
