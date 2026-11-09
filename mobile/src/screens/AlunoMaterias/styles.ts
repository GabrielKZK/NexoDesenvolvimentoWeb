import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    minHeight: 44,
    marginBottom: 14,
  },
  buscaInput: { flex: 1, fontSize: 15, paddingVertical: 8 },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nome: { fontSize: 16, fontWeight: '700', flex: 1 },
  sub: { fontSize: 12, marginTop: 2, marginBottom: 10 },
});
