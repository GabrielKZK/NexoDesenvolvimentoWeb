import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

type Variant = 'primary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  /** Sobrescreve a cor do texto/ícone/borda nas variantes 'outline' e 'ghost' (ex: vermelho para ações destrutivas). */
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  tintColor,
  style,
  textStyle,
}) => {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;
  const isTintable = variant === 'outline' || variant === 'ghost';
  const foreground = isTintable ? tintColor ?? colors.brand.purple : '#fff';

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={foreground} style={{ marginRight: 8 }} />}
          <Text style={[styles.text, { color: foreground }, textStyle]}>{title}</Text>
        </>
      )}
    </>
  );

  if (variant === 'primary' || variant === 'danger') {
    const gradientColors =
      variant === 'danger' ? ([colors.status.danger, '#c62828'] as const) : colors.brandGradient;
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
        <LinearGradient
          colors={isDisabled ? ['#9aa1ac', '#7c828c'] : gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, styles.row]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles.row,
        variant === 'outline'
          ? { borderWidth: 1.5, borderColor: tintColor ?? colors.brand.purple, backgroundColor: 'transparent' }
          : { backgroundColor: 'transparent' },
        isDisabled && { opacity: 0.5 },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
});
