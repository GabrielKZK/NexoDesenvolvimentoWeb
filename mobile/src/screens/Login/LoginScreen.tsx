import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { RoleSelector } from '../../components/RoleSelector';
import { ResetPasswordModal } from '../../components/ResetPasswordModal';
import { isEmailValido } from '../../utils/validation';
import { UserRole } from '../../types/models';
import { styles } from './styles';
import { LoginScreenProps } from './types';

const HERO_TEXT: Record<UserRole, { title: string; subtitle: string; hint: string; placeholder: string }> = {
  professor: {
    title: 'Área do Professor',
    subtitle: 'Gerencie turmas, matérias e turnos',
    hint: 'Use o e-mail e a senha cadastrados pela coordenação.',
    placeholder: 'professor@escola.com',
  },
  aluno: {
    title: 'Área do Aluno',
    subtitle: 'Acompanhe suas matérias, metas e ranking',
    hint: 'Acesse sua conta institucional para continuar.',
    placeholder: 'seuemail@instituicao.edu',
  },
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, loginAluno, signingIn } = useAuth();
  const { colors } = useAppTheme();

  const [role, setRole] = useState<UserRole>('professor');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [recuperarVisivel, setRecuperarVisivel] = useState(false);

  const texto = HERO_TEXT[role];

  const handleEntrar = async () => {
    setErro(null);
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha para continuar.');
      return;
    }
    if (!isEmailValido(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    try {
      if (role === 'professor') {
        await login(email, senha);
      } else {
        await loginAluno(email, senha);
      }
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
        <LinearGradient colors={colors.brandGradient} style={styles.hero}>
          <View style={styles.logoWrap}>
            <Image source={require('../../assets/images/logo.jpg')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.heroTitle}>{texto.title}</Text>
          <Text style={styles.heroSubtitle}>{texto.subtitle}</Text>
        </LinearGradient>

        <View style={styles.form}>
          <RoleSelector value={role} onChange={setRole} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Entrar</Text>
          <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>{texto.hint}</Text>

          <Input
            label="E-mail"
            icon="mail-outline"
            placeholder={texto.placeholder}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Senha"
            icon="lock-closed-outline"
            placeholder="••••••••"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />

          {role === 'aluno' && (
            <Pressable onPress={() => setRecuperarVisivel(true)} hitSlop={8} style={styles.forgotLink}>
              <Text style={[styles.forgotText, { color: colors.brand.purple }]}>Esqueceu a senha?</Text>
            </Pressable>
          )}

          {erro && (
            <View style={[styles.errorBox, { backgroundColor: `${colors.status.danger}18` }]}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.status.danger} />
              <Text style={[styles.errorText, { color: colors.status.danger }]}>{erro}</Text>
            </View>
          )}

          <Button title="Entrar" onPress={handleEntrar} loading={signingIn} icon="log-in-outline" />

          <Pressable onPress={() => navigation.navigate('Register', { role })} style={styles.registerLink} hitSlop={8}>
            <Text style={[styles.registerHint, { color: colors.textSecondary }]}>
              Ainda não tem conta? <Text style={[styles.registerAction, { color: colors.brand.purple }]}>Cadastre-se</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ResetPasswordModal visible={recuperarVisivel} initialEmail={email} onClose={() => setRecuperarVisivel(false)} />
    </KeyboardAvoidingView>
  );
}
