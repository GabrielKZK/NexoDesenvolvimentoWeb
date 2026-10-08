import { StyleSheet } from "react-native";
import { ThemeColors } from "../../styles/theme";

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
      marginBottom: 24,
    },
    loading: {
      marginVertical: 12,
    },
    error: {
      color: "#ef4444",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      width: 92,
      height: 92,
      borderRadius: 16,
      backgroundColor: theme.bgCard,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
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
      fontWeight: "bold",
      color: theme.textMain,
    },
    segmento: {
      fontSize: 14,
      color: theme.textMuted,
      marginTop: 8,
    },
  });
}
