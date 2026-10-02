import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../theme/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { isEmailValido } from '../../utils/validation';
import { AuthStackParamList } from '../../navigation/types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
}

export default function LoginScreen({ navigation }: Props) {
  const { login, signingIn } = useAuth();
  const { colors } = useAppTheme();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

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
      await login(email, senha);
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={colors.brandGradient} style={styles.hero}>
          <View style={styles.logoWrap}>
            <Ionicons name="school" size={34} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Área do Professor</Text>
          <Text style={styles.heroSubtitle}>Gerencie turmas, matérias e turnos</Text>
        </LinearGradient>

        <View style={styles.form}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Entrar</Text>
          <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
            Use o e-mail e a senha cadastrados pela coordenação.
          </Text>

          <Input
            label="E-mail"
            icon="mail-outline"
            placeholder="professor@escola.com"
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

          {erro && (
            <View style={[styles.errorBox, { backgroundColor: `${colors.status.danger}18` }]}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.status.danger} />
              <Text style={[styles.errorText, { color: colors.status.danger }]}>{erro}</Text>
            </View>
          )}

          <Button title="Entrar" onPress={handleEntrar} loading={signingIn} icon="log-in-outline" />

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerLink} hitSlop={8}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              Ainda não tem conta?{' '}
              <Text style={{ color: colors.brand.purple, fontWeight: '700' }}>Cadastre-se</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 80,
    paddingBottom: 48,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginTop: 4,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
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
});
