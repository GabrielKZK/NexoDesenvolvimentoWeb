import { StyleSheet } from 'react-native';
import { Palette } from '../../styles/theme';

export function createStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      backgroundColor: colors.background,
    },
    loading: {
      marginVertical: 12,
    },
    error: {
      color: '#ef4444',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 92,
      height: 92,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconText: {
      fontSize: 44,
    },
    info: {
      flex: 1,
      marginLeft: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.text,
    },
    segmento: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
    },
  });
}
