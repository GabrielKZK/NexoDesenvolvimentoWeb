import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Fab } from '../../components/Fab';
import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { turmaService } from '../../api/turmaService';
import { Turma } from '../../types/models';
import { TurmasStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../api/client';
import { pluralizar } from '../../utils/format';

interface Props {
  navigation: NativeStackNavigationProp<TurmasStackParamList, 'TurmasList'>;
}

export default function TurmasListScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { professor } = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const lista = await turmaService.listarTodas();
      setTurmas(lista);
    } catch (e) {
      Alert.alert('Erro', getErrorMessage(e));
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregar();
  };

  const excluir = (turma: Turma) => {
    Alert.alert('Excluir turma', `Deseja realmente excluir "${turma.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await turmaService.excluir(turma.id);
            setTurmas((prev) => prev.filter((t) => t.id !== turma.id));
          } catch (e) {
            Alert.alert('Erro', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  const filtradas = turmas.filter((t) => t.nome.toLowerCase().includes(busca.toLowerCase()));

  if (carregando) return <LoadingView label="Carregando turmas..." />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Input
          placeholder="Buscar turma..."
          icon="search-outline"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title={busca ? 'Nenhuma turma encontrada' : 'Nenhuma turma cadastrada'}
            subtitle={busca ? 'Tente buscar por outro nome.' : 'Toque no botão + para criar a primeira turma.'}
          />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('TurmaForm', { id: item.id })}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    Ano letivo {item.anoLetivo}
                    {item.idProfessor === professor?.id ? ' · minha turma' : ''}
                  </Text>
                </View>
                <Pressable onPress={() => excluir(item)} hitSlop={10} style={{ padding: 4 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.status.danger} />
                </Pressable>
              </View>

              <View style={styles.badgesRow}>
                {item.nomeTurno && <Badge label={item.nomeTurno} color={colors.accents.amber} />}
                {item.nomeProfessor && <Badge label={item.nomeProfessor} color={colors.accents.indigo} />}
                <Badge
                  label={pluralizar(item.materiaIds?.length ?? 0, 'matéria', 'matérias')}
                  color={colors.accents.cyan}
                />
              </View>
            </Card>
          </Pressable>
        )}
      />

      <Fab onPress={() => navigation.navigate('TurmaForm', undefined)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  nome: { fontSize: 16, fontWeight: '800' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
});
