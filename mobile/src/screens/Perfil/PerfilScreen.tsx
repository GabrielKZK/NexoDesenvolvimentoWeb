import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../hooks/useAppTheme';
import { usuariosService } from '../../services/usuariosService';
import { RootStackParamList } from '../../navigation/types';
import { RoleCliente } from '../../types/auth';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { OrigemFoto, escolherFotoPerfil } from '../../utils/fotoPerfil';
import { resolverFoto } from '../../utils/avatar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SwitchRow } from '../../components/SwitchRow';
import { styles } from './styles';

const ROTULO: Record<RoleCliente, string> = {
  aluno: 'Aluno',
  professor: 'Professor',
  diretor: 'Diretor',
  admin: 'Administrador',
};

/** Perfil de qualquer papel (web: /perfil → PATCH /api/usuarios/me). */
export default function PerfilScreen() {
  const { usuario, atualizarUsuario, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);

  if (!usuario) return null;
  const alterado = nome.trim() !== usuario.nome && nome.trim().length > 0;

  const salvar = async () => {
    setMsg(null);
    setSalvando(true);
    try {
      const atualizado = await usuariosService.atualizarPerfil({ nome: nome.trim() });
      atualizarUsuario({ nome: atualizado.nome, cargo: atualizado.cargo });
      setMsg({ ok: true, texto: 'Perfil atualizado.' });
    } catch (e) {
      setMsg({ ok: false, texto: getErrorMessage(e, 'Não foi possível salvar o perfil.') });
    } finally {
      setSalvando(false);
    }
  };

  const trocarFoto = async (origem: OrigemFoto) => {
    setMsg(null);
    try {
      const uri = await escolherFotoPerfil(origem);
      if (!uri) return; // cancelou
      setEnviandoFoto(true);
      const u = await usuariosService.enviarFoto(uri);
      atualizarUsuario({ foto: resolverFoto(u.foto) });
      setMsg({ ok: true, texto: 'Foto atualizada.' });
    } catch (e) {
      setMsg({ ok: false, texto: getErrorMessage(e, 'Não foi possível enviar a foto.') });
    } finally {
      setEnviandoFoto(false);
    }
  };

  const removerFoto = async () => {
    setMsg(null);
    setEnviandoFoto(true);
    try {
      await usuariosService.removerFoto();
      atualizarUsuario({ foto: null });
    } catch (e) {
      setMsg({ ok: false, texto: getErrorMessage(e, 'Não foi possível remover a foto.') });
    } finally {
      setEnviandoFoto(false);
    }
  };

  const abrirOpcoesFoto = () =>
    Alert.alert('Foto de perfil', undefined, [
      { text: 'Tirar foto', onPress: () => void trocarFoto('camera') },
      { text: 'Escolher da galeria', onPress: () => void trocarFoto('galeria') },
      ...(usuario.foto ? [{ text: 'Remover foto', style: 'destructive' as const, onPress: () => void removerFoto() }] : []),
      { text: 'Cancelar', style: 'cancel' as const },
    ]);

  return (
    <ScreenContainer>
      <View style={styles.topo}>
        <Pressable
          onPress={abrirOpcoesFoto}
          disabled={enviandoFoto}
          accessibilityRole="button"
          accessibilityLabel="Alterar foto de perfil"
        >
          {usuario.foto ? (
            <Image source={{ uri: usuario.foto }} style={styles.avatar} accessibilityLabel="Foto de perfil" />
          ) : (
            <View style={[styles.avatar, styles.avatarVazio, { backgroundColor: colors.input }]}>
              <Ionicons name="person" size={40} color={colors.textSecondary} />
            </View>
          )}
          <View style={[styles.camera, { backgroundColor: colors.brand.deep }]}>
            {enviandoFoto ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="camera" size={16} color="#fff" />}
          </View>
        </Pressable>
        <Text style={[styles.papel, { color: colors.brand.purple }]}>{ROTULO[usuario.role]}</Text>
        {!!usuario.cargo && <Text style={[styles.cargo, { color: colors.textSecondary }]}>{usuario.cargo}</Text>}
      </View>

      <Card style={styles.card}>
        <Input label="Nome" icon="person-outline" value={nome} onChangeText={setNome} maxLength={120} />
        {msg && (
          <Text style={[styles.msg, { color: msg.ok ? colors.status.success : colors.status.danger }]}>{msg.texto}</Text>
        )}
        <Button title="Salvar" onPress={salvar} loading={salvando} disabled={!alterado} icon="checkmark-outline" />
      </Card>

      <Card style={styles.card}>
        <SwitchRow label="Tema escuro" value={isDark} onValueChange={toggleTheme} />
      </Card>

      {usuario.role === 'aluno' && (
        <Button
          title="Configurações"
          variant="outline"
          icon="settings-outline"
          onPress={() => navigation.navigate('Configuracoes')}
          style={styles.botao}
        />
      )}
      <Button
        title="Trocar senha"
        variant="outline"
        icon="key-outline"
        onPress={() => navigation.navigate('TrocarSenha')}
        style={styles.botao}
      />
      <Button title="Sair" variant="danger" icon="log-out-outline" onPress={logout} />
    </ScreenContainer>
  );
}
