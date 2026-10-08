import { Ionicons } from '@expo/vector-icons';

export interface MenuCardProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string];
  onPress: () => void;
}
