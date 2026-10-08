import { useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { alunoService } from '../../services/alunoService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { isEmailValido } from '../../utils/validation';
import { MIN_SENHA_ALUNO } from '../../constants/auth';
import { Input } from '../Input';
import { Button } from '../Button';
import { styles } from './styles';
import { ResetPasswordModalProps } from './types';

/** Redefinição de senha do aluno (PATCH /api/alunos/senha/redefinir). */
export const ResetPasswordModal = ({ visible, initialEmail = '', onClose }: ResetPasswordModalProps) => {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState(initialEmail);
  const [novaSenha, setNovaSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    if (visible) {
      setEmail(initialEmail);
      setNovaSenha('');
      setErro(null);
      setConcluido(false);
    }
  }, [visible, initialEmail]);

  const redefinir = async () => {
    if (!isEmailValido(email)) {
      setErro('Informe seu e-mail institucional.');
      return;
    }
    if (novaSenha.length < MIN_SENHA_ALUNO) {
      setErro(`A nova senha deve ter no mínimo ${MIN_SENHA_ALUNO} caracteres.`);
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await alunoService.redefinirSenha(email.trim(), novaSenha);
      setConcluido(true);
    } catch (e) {
      setErro(getErrorMessage(e, 'Não foi possível redefinir a senha. Tente novamente.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Recuperar senha</Text>

          {concluido ? (
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Senha redefinida com sucesso! Já pode entrar com a nova senha.
            </Text>
          ) : (
            <>
              <Text style={[styles.text, { color: colors.textSecondary }]}>
                Informe seu e-mail institucional e a nova senha.
              </Text>
              <Input
                label="E-mail institucional"
                icon="mail-outline"
                placeholder="seuemail@instituicao.edu"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <Input
                label="Nova senha"
                icon="lock-closed-outline"
                placeholder={`Mínimo ${MIN_SENHA_ALUNO} caracteres`}
                isPassword
                value={novaSenha}
                onChangeText={setNovaSenha}
              />
              {erro && <Text style={[styles.error, { color: colors.status.danger }]}>{erro}</Text>}
            </>
          )}

          <View style={styles.actions}>
            <Button
              title={concluido ? 'Fechar' : 'Cancelar'}
              variant="outline"
              onPress={onClose}
              style={styles.action}
            />
            {!concluido && <Button title="Redefinir" onPress={redefinir} loading={enviando} style={styles.action} />}
          </View>
        </View>
      </View>
    </Modal>
  );
};
