import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { usuariosService } from '../../services/usuariosService';
import { MAX_SENHA, MIN_SENHA } from '../../constants/auth';
import { ApiErro } from '../../types/api';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { styles } from './styles';

/**
 * Troca de senha. Com `precisaTrocarSenha` (senha provisória) é a única tela liberada
 * pelo RootNavigator — equivalente ao authGuard + /trocar-senha do web.
 */
export default function TrocarSenhaScreen() {
  const { usuario, atualizarUsuario, logout } = useAuth();
  const navigation = useNavigation();
  const { colors } = useAppTheme();

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [motivoInvalida, setMotivoInvalida] = useState<string | null>(null);
  const [erroSenhaAtual, setErroSenhaAtual] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Checagem prévia no servidor (a política vive lá), com debounce.
  useEffect(() => {
    setMotivoInvalida(null);
    if (novaSenha.length < MIN_SENHA) return;
    const id = setTimeout(() => {
      usuariosService
        .validarSenha(novaSenha)
        .then((r) => setMotivoInvalida(r.valida ? null : (r.motivo ?? 'Senha não aceita.')))
        .catch(() => setMotivoInvalida(null)); // a decisão final é do POST
    }, 400);
    return () => clearTimeout(id);
  }, [novaSenha]);

  const erroNova =
    novaSenha.length > 0 && novaSenha.length < MIN_SENHA
      ? `Use ao menos ${MIN_SENHA} caracteres.`
      : (motivoInvalida ?? null);
  const erroConfirmar = confirmar.length > 0 && confirmar !== novaSenha ? 'As senhas não coincidem.' : null;
  const pronto =
    !!senhaAtual && novaSenha.length >= MIN_SENHA && confirmar === novaSenha && !motivoInvalida && !enviando;

  const salvar = async () => {
    setErro(null);
    setErroSenhaAtual(null);
    setEnviando(true);
    try {
      await usuariosService.trocarSenha({ senhaAtual, novaSenha });
      // Obrigatória: o RootNavigator troca de tela sozinho ao limpar a flag. Voluntária: volta ao Perfil.
      atualizarUsuario({ precisaTrocarSenha: false });
      if (!usuario?.precisaTrocarSenha && navigation.canGoBack()) navigation.goBack();
    } catch (e) {
      // O backend manda o texto e o campo no envelope de erro (message + fields).
      const corpo = axios.isAxiosError(e) ? (e.response?.data as Partial<ApiErro> | undefined) : undefined;
      if (corpo?.fields?.senhaAtual) setErroSenhaAtual(corpo.fields.senhaAtual);
      else if (corpo?.fields?.novaSenha) setMotivoInvalida(corpo.fields.novaSenha);
      else setErro(getErrorMessage(e, 'Não foi possível trocar a senha.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Defina uma senha nova</Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {usuario?.precisaTrocarSenha
            ? 'Você entrou com uma senha provisória. Escolha uma senha só sua para continuar.'
            : 'Informe a senha atual e a nova senha.'}
        </Text>

        <Input
          label="Senha atual"
          icon="lock-closed-outline"
          isPassword
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          error={erroSenhaAtual}
        />
        <Input
          label="Nova senha"
          icon="key-outline"
          isPassword
          maxLength={MAX_SENHA}
          value={novaSenha}
          onChangeText={setNovaSenha}
          error={erroNova}
        />
        <Input
          label="Confirmar nova senha"
          icon="key-outline"
          isPassword
          maxLength={MAX_SENHA}
          value={confirmar}
          onChangeText={setConfirmar}
          error={erroConfirmar}
        />

        {erro && (
          <View style={[styles.feedbackBox, { backgroundColor: `${colors.status.danger}18` }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.status.danger} />
            <Text style={[styles.feedbackText, { color: colors.status.danger }]}>{erro}</Text>
          </View>
        )}

        <Button title="Salvar nova senha" onPress={salvar} loading={enviando} disabled={!pronto} icon="checkmark-outline" />
        {usuario?.precisaTrocarSenha && (
          <>
            <View style={styles.gap} />
            <Button title="Sair" variant="ghost" onPress={logout} icon="log-out-outline" />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
