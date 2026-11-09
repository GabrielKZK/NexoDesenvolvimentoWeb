import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  aviso: { fontSize: 12, fontWeight: '600', textAlign: 'center', paddingVertical: 6, paddingHorizontal: 16 },
  lista: { padding: 16, gap: 10 },
  vazio: { flexGrow: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  nome: { fontSize: 15, fontWeight: '700' },
  papel: { flexDirection: 'row', marginTop: 4 },
  contador: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  contadorTexto: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
