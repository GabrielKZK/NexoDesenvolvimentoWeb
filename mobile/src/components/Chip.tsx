import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

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

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
