import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { RoleSelector } from '../../components/RoleSelector';
import { professorService } from '../../services/professorService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { isEmailValido } from '../../utils/validation';
import { MIN_SENHA_ALUNO, MIN_SENHA_PROFESSOR } from '../../constants/auth';
import { UserRole } from '../../types/models';
import { styles } from './styles';
import { RegisterScreenProps } from './types';

export default function RegisterScreen({ navigation, route }: RegisterScreenProps) {
  const { colors } = useAppTheme();
  const { login, cadastrarAluno } = useAuth();

  const [role, setRole] = useState<UserRole>(route.params?.role ?? 'professor');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const isProfessor = role === 'professor';
  const minSenha = isProfessor ? MIN_SENHA_PROFESSOR : MIN_SENHA_ALUNO;

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
    if (senha.length < minSenha) {
      setErro(`A senha deve ter pelo menos ${minSenha} caracteres.`);
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setSalvando(true);
    try {
      if (isProfessor) {
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
      } else {
        await cadastrarAluno({ nome: nome.trim(), emailInstitucional: email.trim(), senha });
      }
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
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>Criar cadastro</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {isProfessor
            ? 'Crie seu acesso de professor para gerenciar turmas, matérias e turnos.'
            : 'Junte-se ao Nexo e comece a estudar.'}
        </Text>

        <RoleSelector value={role} onChange={setRole} />

        <Input label="Nome completo" placeholder="Seu nome" icon="person-outline" value={nome} onChangeText={setNome} />
        <Input
          label="E-mail"
          placeholder={isProfessor ? 'professor@escola.com' : 'seuemail@instituicao.edu'}
          icon="mail-outline"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {isProfessor && (
          <>
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
          </>
        )}
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
