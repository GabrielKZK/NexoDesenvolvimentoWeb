import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  topo: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 10 },
  avatarVazio: { alignItems: 'center', justifyContent: 'center' },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  papel: { fontSize: 14, fontWeight: '800' },
  cargo: { fontSize: 13, marginTop: 2 },
  card: { marginBottom: 12 },
  msg: { fontSize: 13, marginBottom: 10 },
  botao: { marginBottom: 12 },
});
