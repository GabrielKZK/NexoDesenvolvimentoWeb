import { StyleSheet } from 'react-native';
import { brand, Palette } from '../../styles/theme';

export function createStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 16,
    },
    search: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.input,
      color: colors.text,
      padding: 12,
      marginBottom: 16,
    },
    error: {
      color: '#ef4444',
      marginBottom: 12,
    },
    loading: {
      marginVertical: 12,
    },
    list: {
      paddingBottom: 30,
    },
    empty: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 24,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: colors.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconText: {
      fontSize: 26,
    },
    info: {
      flex: 1,
      marginLeft: 16,
    },
    name: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.text,
    },
    segmento: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    button: {
      alignSelf: 'flex-start',
      backgroundColor: brand.purple,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 18,
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
}
