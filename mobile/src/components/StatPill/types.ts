import { Ionicons } from '@expo/vector-icons';

export interface StatPillProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
  color: string;
}
