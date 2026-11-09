import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { styles } from './styles';

export default function LoginScreen() {
  const { login, signingIn } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const handleEntrar = async () => {
    setErro(null);
    if (!usuario.trim() || !senha) {
      setErro('Preencha o login e a senha para continuar.');
      return;
    }
    try {
      await login(usuario, senha);
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Painel de marca do web: roxo fixo nos dois temas, para a logo branca ter sempre contraste. */}
        <View style={styles.hero}>
          <Image source={require('../../assets/images/logo-nexo-branco.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Nexo" />
        </View>

        <View style={styles.form}>
          {/* Alternar claro/escuro — mesmo botão do login do web (canto superior direito do formulário). */}
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
            style={[styles.btnTema, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Entrar</Text>
          <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
            Acesse sua conta para continuar
          </Text>

          <Input
            label="Login"
            icon="person-outline"
            placeholder="Digite seu login"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            value={usuario}
            onChangeText={setUsuario}
          />
          <Input
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Digite sua senha"
            isPassword
            textContentType="password"
            value={senha}
            onChangeText={setSenha}
            onSubmitEditing={handleEntrar}
          />

          {erro && (
            <View style={[styles.errorBox, { backgroundColor: `${colors.status.danger}18` }]}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.status.danger} />
              <Text style={[styles.errorText, { color: colors.status.danger }]}>{erro}</Text>
            </View>
          )}

          <Button title="Entrar" onPress={handleEntrar} loading={signingIn} icon="log-in-outline" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
