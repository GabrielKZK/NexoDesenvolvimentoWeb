import React from 'react';
import { Switch, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { SwitchRowProps } from './types';

export const SwitchRow: React.FC<SwitchRowProps> = ({ label, description, value, onValueChange }) => {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.input, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {description && <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? colors.brand.green : '#f4f3f4'}
        trackColor={{ false: colors.border, true: `${colors.brand.green}66` }}
      />
    </View>
  );
};
