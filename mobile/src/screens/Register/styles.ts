import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, paddingTop: 56, paddingBottom: 48 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 24, lineHeight: 18 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: { marginLeft: 8, fontSize: 13, flex: 1 },
});
