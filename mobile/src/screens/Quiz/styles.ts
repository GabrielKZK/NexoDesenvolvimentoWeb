import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 2, marginBottom: 14 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, marginBottom: 14 },
  bannerTexto: { flex: 1, fontSize: 13, lineHeight: 19 },
  card: { marginBottom: 12 },
  enunciado: { fontSize: 15, fontWeight: '700', marginBottom: 10, lineHeight: 21 },
  alternativa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
    marginBottom: 8,
  },
  letra: { width: 18, fontSize: 13, fontWeight: '800' },
  altTexto: { flex: 1, fontSize: 14, lineHeight: 20 },
  erro: { fontSize: 13, marginBottom: 10 },
  fim: { height: 24 },
});
