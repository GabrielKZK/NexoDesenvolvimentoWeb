import { StyleSheet } from 'react-native';

/** Estilos de layout compartilhados pelas telas (cores sempre vêm do tema, inline). */
export const common = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  card: { marginBottom: 10 },
  title: { fontSize: 15, fontWeight: '700' },
  sub: { fontSize: 12, marginTop: 2 },
  section: { fontSize: 17, fontWeight: '800', marginTop: 12, marginBottom: 10 },
  text: { fontSize: 14, lineHeight: 20 },
  msg: { fontSize: 13, marginBottom: 10 },
  rotulo: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  gap: { height: 10 },
  fim: { height: 24 },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
});
