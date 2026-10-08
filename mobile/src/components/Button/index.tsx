import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { ButtonProps } from './types';

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

export * from './types';
