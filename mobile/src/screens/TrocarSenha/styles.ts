import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 32 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  hint: { fontSize: 13, lineHeight: 18, marginBottom: 20 },
  feedbackBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 16 },
  feedbackText: { marginLeft: 8, fontSize: 13, flex: 1 },
  gap: { height: 12 },
});
