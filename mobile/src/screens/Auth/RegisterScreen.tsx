import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { professorService } from '../../api/professorService';
import { getErrorMessage } from '../../api/client';
import { isEmailValido } from '../../utils/validation';
import { AuthStackParamList } from '../../navigation/types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
}

export default function RegisterScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { login } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const cadastrar = async () => {
    setErro(null);

    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha nome, e-mail e senha para continuar.');
      return;
    }
    if (!isEmailValido(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setSalvando(true);
    try {
      await professorService.criar({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        disciplina: disciplina.trim(),
        telefone: telefone.trim(),
        ativo: true,
      });
      // já cria a sessão direto após o cadastro
      await login(email.trim(), senha);
    } catch (e) {
      setErro(
        getErrorMessage(
          e,
          'Não foi possível criar o cadastro. Verifique se este e-mail já está em uso.'
        )
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>Criar cadastro</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Crie seu acesso de professor para gerenciar turmas, matérias e turnos.
        </Text>

        <Input label="Nome completo" placeholder="Seu nome" icon="person-outline" value={nome} onChangeText={setNome} />
        <Input
          label="E-mail"
          placeholder="professor@escola.com"
          icon="mail-outline"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Disciplina (opcional)"
          placeholder="Ex: Desenvolvimento Mobile"
          icon="book-outline"
          value={disciplina}
          onChangeText={setDisciplina}
        />
        <Input
          label="Telefone (opcional)"
          placeholder="(00) 00000-0000"
          icon="call-outline"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
        <Input label="Senha" placeholder="••••••••" icon="lock-closed-outline" isPassword value={senha} onChangeText={setSenha} />
        <Input
          label="Confirmar senha"
          placeholder="••••••••"
          icon="lock-closed-outline"
          isPassword
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {erro && (
          <View style={[styles.errorBox, { backgroundColor: `${colors.status.danger}18` }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.status.danger} />
            <Text style={[styles.errorText, { color: colors.status.danger }]}>{erro}</Text>
          </View>
        )}

        <Button title="Criar cadastro" onPress={cadastrar} loading={salvando} icon="person-add-outline" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 56, paddingBottom: 48 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 24, lineHeight: 18 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: { marginLeft: 8, fontSize: 13, flex: 1 },
});
