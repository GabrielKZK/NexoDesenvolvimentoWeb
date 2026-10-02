import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface SwitchRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
});
