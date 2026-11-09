import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titulos: { flex: 1, minHeight: 44, justifyContent: 'center' },
  titulo: { fontSize: 15, fontWeight: '700' },
  resumo: { fontSize: 12, marginTop: 2, marginBottom: 6 },
  check: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  corpo: { marginTop: 8, gap: 10 },
  paragrafo: { fontSize: 14, lineHeight: 21 },
  exemplo: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 },
  exemploRotulo: { fontSize: 12, fontWeight: '800' },
  erro: { fontSize: 13, marginBottom: 10 },
});
