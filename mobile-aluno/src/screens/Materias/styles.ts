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
    back: {
      color: theme.textMain,
      fontSize: 15,
      fontWeight: "500",
      marginBottom: 16,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: theme.textMain,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textMuted,
      marginTop: 4,
      marginBottom: 16,
    },
    search: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.bgInput,
      color: theme.textMain,
      padding: 12,
      marginBottom: 16,
    },
    error: {
      color: "#ef4444",
      marginBottom: 12,
    },
    loading: {
      marginVertical: 12,
    },
    list: {
      paddingBottom: 30,
    },
    empty: {
      color: theme.textMuted,
      textAlign: "center",
      marginTop: 24,
    },
    card: {
      backgroundColor: theme.bgCard,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: theme.bgInput,
      alignItems: "center",
      justifyContent: "center",
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
      fontWeight: "bold",
      color: theme.textMain,
    },
    segmento: {
      fontSize: 13,
      color: theme.textMuted,
      marginTop: 4,
    },
    button: {
      alignSelf: "flex-start",
      backgroundColor: brand.purple,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 18,
      marginTop: 16,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
}
