import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  hero: {
    paddingTop: 48,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  nome: { color: '#fff', fontSize: 18, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  content: { padding: 20, paddingBottom: 48 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 14 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionLabel: { marginLeft: 10, fontSize: 14, fontWeight: '600' },
});
