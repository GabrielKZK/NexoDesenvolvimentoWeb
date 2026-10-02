import { StyleSheet } from "react-native";
import { brand, ThemeColors } from "../../styles/theme";

export function createStyles(theme: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.bgPrimary,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    card: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: theme.bgCard,
      padding: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.textMain,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textMuted,
      textAlign: "center",
      marginBottom: 28,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textMain,
      marginBottom: 6,
    },
    input: {
      height: 46,
      fontSize: 14,
      borderRadius: 10,
      backgroundColor: theme.bgInput,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.textMain,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    inputLast: {
      height: 46,
      fontSize: 14,
      borderRadius: 10,
      backgroundColor: theme.bgInput,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.textMain,
      paddingHorizontal: 14,
    },
    helperText: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 6,
    },
    error: {
      color: "#ef4444",
      fontSize: 13,
      textAlign: "center",
      marginTop: 16,
    },
    submitButton: {
      marginTop: 24,
      height: 46,
      borderRadius: 10,
      backgroundColor: brand.purple,
      alignItems: "center",
      justifyContent: "center",
    },
    submitText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600",
    },
    linkButton: {
      marginTop: 16,
      alignItems: "center",
    },
    linkText: {
      color: brand.purple,
      fontSize: 13,
    },
  });
}
