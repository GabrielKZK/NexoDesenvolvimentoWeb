import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ButtonProps {
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

export type Variant = 'primary' | 'outline' | 'danger' | 'ghost';
