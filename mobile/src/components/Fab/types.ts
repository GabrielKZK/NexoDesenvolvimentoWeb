import { Ionicons } from '@expo/vector-icons';

export interface FabProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}
