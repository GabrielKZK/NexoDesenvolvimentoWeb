import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string | null;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, icon, error, isPassword, style, ...rest }) => {
  const { colors } = useAppTheme();
  const [secure, setSecure] = useState(!!isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.input,
            borderColor: error ? colors.status.danger : focused ? colors.brand.purple : colors.border,
          },
        ]}
      >
        {icon && <Ionicons name={icon} size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />}
        <TextInput
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secure}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, { color: colors.text }, style]}
        />
        {isPassword && (
          <Pressable onPress={() => setSecure((s) => !s)} hitSlop={10}>
            <Ionicons name={secure ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {error && <Text style={[styles.error, { color: colors.status.danger }]}>{error}</Text>}
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
