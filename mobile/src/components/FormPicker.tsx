import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '../theme/ThemeContext';

export interface PickerOption {
  label: string;
  value: string;
}

interface FormPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
}

export const FormPicker: React.FC<FormPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder = 'Selecione...',
}) => {
  const { colors } = useAppTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.container, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(v) => onValueChange(String(v))}
          style={{ color: colors.text }}
          dropdownIconColor={colors.textSecondary}
        >
          <Picker.Item label={placeholder} value="" color={colors.textSecondary} />
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} color={colors.text} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  container: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
