import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  aviso: { fontSize: 12, fontWeight: '600', textAlign: 'center', paddingVertical: 6, paddingHorizontal: 16 },
  lista: { paddingHorizontal: 12, paddingVertical: 12, gap: 6, flexGrow: 1 },
  vazioInvertido: { flex: 1, transform: [{ scaleY: -1 }] },
  dia: { textAlign: 'center', fontSize: 12, fontWeight: '600', marginVertical: 8 },
  bolha: { maxWidth: '82%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  minha: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  dele: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  hora: { fontSize: 11, marginTop: 2, alignSelf: 'flex-end' },
  barra: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 8, borderTopWidth: 1 },
  campo: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 21,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
  },
  enviar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
