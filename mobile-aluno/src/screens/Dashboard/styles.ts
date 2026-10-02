import { StyleSheet } from "react-native";
import { brand, ThemeColors } from "../../styles/theme";

export function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 50,
      backgroundColor: theme.bgPrimary,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    nome: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textMain,
    },
    email: {
      fontSize: 13,
      color: theme.textMuted,
    },
    logout: {
      color: "#ef4444",
      fontWeight: "bold",
    },
    error: {
      color: "#ef4444",
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.bgCard,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: "center",
    },
    statValue: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textMain,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textMain,
      marginTop: 12,
      marginBottom: 8,
    },
    progressBarBackground: {
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.bgInput,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: brand.purple,
    },
    progressLabel: {
      fontSize: 13,
      color: theme.textMuted,
      marginTop: 4,
    },
    metaRow: {
      flexDirection: "row",
      marginTop: 8,
      gap: 8,
    },
    metaInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.bgInput,
      color: theme.textMain,
      padding: 10,
    },
    metaButton: {
      backgroundColor: brand.purple,
      borderRadius: 10,
      paddingHorizontal: 14,
      justifyContent: "center",
    },
    metaButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    tarefasLabel: {
      fontSize: 14,
      color: theme.textMuted,
      marginBottom: 8,
    },
    button: {
      backgroundColor: brand.green,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
    },
    buttonDisabled: {
      backgroundColor: theme.border,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    rankingRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    rankingPosicao: {
      width: 32,
      fontWeight: "bold",
      color: theme.textMain,
    },
    rankingNome: {
      flex: 1,
      color: theme.textMain,
    },
    rankingXp: {
      fontWeight: "bold",
      color: brand.purple,
    },
  });
}
