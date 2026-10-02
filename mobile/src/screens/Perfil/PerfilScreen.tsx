import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../theme/ThemeContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { professorService } from '../../api/professorService';
import { getErrorMessage } from '../../api/client';
import { iniciais } from '../../utils/format';
import { isEmailValido } from '../../utils/validation';

export default function PerfilScreen() {
  const { professor, applyProfileUpdate, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();

  const [nome, setNome] = useState(professor?.nome ?? '');
  const [email, setEmail] = useState(professor?.email ?? '');
  const [telefone, setTelefone] = useState(professor?.telefone ?? '');
  const [disciplina, setDisciplina] = useState(professor?.disciplina ?? '');
  const [novaSenha, setNovaSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  if (!professor) return null;

  const salvar = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Nome e e-mail são obrigatórios.');
      return;
    }
    if (!isEmailValido(email)) {
      Alert.alert('Atenção', 'Digite um e-mail válido.');
      return;
    }

    setSalvando(true);
    try {
      const dto = {
        nome: nome.trim(),
        email: email.trim(),
        // Em branco = backend mantém a senha atual (só troca se vier preenchida).
        senha: novaSenha.trim(),
        disciplina: disciplina.trim(),
        telefone: telefone.trim(),
        ativo: professor.ativo,
      };
      const atualizado = await professorService.atualizar(professor.id, dto);
      await applyProfileUpdate(atualizado, novaSenha.trim() || undefined);
      setNovaSenha('');
      Alert.alert('Pronto', 'Seu perfil foi atualizado com sucesso.');
    } catch (e) {
      Alert.alert('Erro ao salvar', getErrorMessage(e));
    } finally {
      setSalvando(false);
    }
  };

  const confirmarSaida = () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScreenContainer padded={false}>
      <LinearGradient colors={colors.brandGradient} style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais(professor.nome)}</Text>
        </View>
        <Text style={styles.nome} numberOfLines={1}>
          {professor.nome}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {professor.email}
        </Text>
        <View style={{ marginTop: 10 }}>
          <Badge
            label={professor.ativo ? 'Cadastro ativo' : 'Cadastro inativo'}
            color={professor.ativo ? '#ffffff' : '#ffe0e0'}
            variant="soft"
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Dados pessoais</Text>
          <Input label="Nome completo" value={nome} onChangeText={setNome} icon="person-outline" />
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            icon="call-outline"
            keyboardType="phone-pad"
            placeholder="(00) 00000-0000"
          />
          <Input
            label="Disciplina principal"
            value={disciplina}
            onChangeText={setDisciplina}
            icon="book-outline"
            placeholder="Ex: Desenvolvimento Mobile"
          />
          <Input
            label="Nova senha (opcional)"
            value={novaSenha}
            onChangeText={setNovaSenha}
            icon="lock-closed-outline"
            isPassword
            placeholder="Deixe em branco para manter a atual"
          />

          <Button title="Salvar alterações" onPress={salvar} loading={salvando} icon="checkmark-circle-outline" />
        </Card>

        <Card style={{ marginTop: 16 }}>
          <View style={styles.optionRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.textSecondary} />
              <Text style={[styles.optionLabel, { color: colors.text }]}>
                Tema {isDark ? 'escuro' : 'claro'}
              </Text>
            </View>
            <Button title="Alternar" onPress={toggleTheme} variant="ghost" />
          </View>
        </Card>

        <Button
          title="Sair da conta"
          onPress={confirmarSaida}
          variant="outline"
          icon="log-out-outline"
          style={{ marginTop: 16, borderColor: colors.status.danger }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
