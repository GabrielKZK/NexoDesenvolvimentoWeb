import React from 'react';
import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { styles } from './styles';
import { FabProps } from './types';

export const Fab: React.FC<FabProps> = ({ onPress, icon = 'add' }) => {
  const { colors } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.85 : 1 }]}>
      <LinearGradient colors={colors.brandGradient} style={styles.fab}>
        <Ionicons name={icon} size={28} color="#fff" />
      </LinearGradient>
    </Pressable>
  );
};
