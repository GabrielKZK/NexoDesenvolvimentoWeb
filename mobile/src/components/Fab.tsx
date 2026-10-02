import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

interface FabProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

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

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    shadowColor: '#9b2fff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
