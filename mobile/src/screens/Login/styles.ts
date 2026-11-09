import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 72,
    paddingBottom: 40,
    paddingHorizontal: 40,
    alignItems: 'center',
    backgroundColor: '#5B21B6',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  // 900x270 (proporção 10:3) da logo v2 branca, como no painel do login do web (300x90).
  logo: {
    width: '70%',
    maxWidth: 300,
    aspectRatio: 10 / 3,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  // Web: .btn-tema (44x44, borda --nx-line, raio 10), 16px do topo e da direita do lado do formulário.
  btnTema: {
    position: 'absolute',
    // Acima do título/subtítulo (Text de largura total), que senão interceptam o toque.
    zIndex: 10,
    elevation: 10,
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1,
  },
  registerLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  registerHint: {
    fontSize: 13,
  },
  registerAction: {
    fontWeight: '700',
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
