import { StyleSheet } from 'react-native';
import { brand, Palette } from '../../styles/theme';

export function createStyles(colors: Palette) {
  return StyleSheet.create({
    loading: {
      marginVertical: 12,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 50,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    nome: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    email: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    logout: {
      color: '#ef4444',
      fontWeight: 'bold',
    },
    error: {
      color: '#ef4444',
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 12,
      marginBottom: 8,
    },
    progressBarBackground: {
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.input,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: brand.purple,
    },
    progressLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    metaRow: {
      flexDirection: 'row',
      marginTop: 8,
      gap: 8,
    },
    metaInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.input,
      color: colors.text,
      padding: 10,
    },
    metaButton: {
      backgroundColor: brand.purple,
      borderRadius: 10,
      paddingHorizontal: 14,
      justifyContent: 'center',
    },
    metaButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    tarefasLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    button: {
      backgroundColor: brand.green,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    materiasButton: {
      backgroundColor: brand.purple,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 4,
    },
    buttonDisabled: {
      backgroundColor: colors.border,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    rankingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rankingPosicao: {
      width: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    rankingNome: {
      flex: 1,
      color: colors.text,
    },
    rankingXp: {
      fontWeight: 'bold',
      color: brand.purple,
    },
  });
}
