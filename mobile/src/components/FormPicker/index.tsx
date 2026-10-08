import React from 'react';
import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { FormPickerProps } from './types';

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

export * from './types';
