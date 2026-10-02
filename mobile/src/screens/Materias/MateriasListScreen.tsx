import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Fab } from '../../components/Fab';
import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { materiaService } from '../../api/materiaService';
import { Materia } from '../../types/models';
import { MateriasStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../api/client';
import { pluralizar } from '../../utils/format';

interface Props {
  navigation: NativeStackNavigationProp<MateriasStackParamList, 'MateriasList'>;
}

function corDoSegmento(segmento: string, palette: Record<string, string>) {
  const chaves = ['blue', 'cyan', 'amber', 'orange', 'green', 'red', 'purple', 'pink', 'teal', 'indigo'];
  let hash = 0;
  for (let i = 0; i < segmento.length; i++) hash = segmento.charCodeAt(i) + ((hash << 5) - hash);
  const chave = chaves[Math.abs(hash) % chaves.length];
  return palette[chave];
}

export default function MateriasListScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const lista = await materiaService.listarTodas();
      setMaterias(lista);
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

  const excluir = (materia: Materia) => {
    Alert.alert('Excluir matéria', `Deseja realmente excluir "${materia.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await materiaService.excluir(materia.id);
            setMaterias((prev) => prev.filter((m) => m.id !== materia.id));
          } catch (e) {
            Alert.alert('Erro', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  const filtradas = materias.filter((m) => m.nome.toLowerCase().includes(busca.toLowerCase()));

  if (carregando) return <LoadingView label="Carregando matérias..." />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Input placeholder="Buscar matéria..." icon="search-outline" value={busca} onChangeText={setBusca} />
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title={busca ? 'Nenhuma matéria encontrada' : 'Nenhuma matéria cadastrada'}
            subtitle={busca ? 'Tente buscar por outro nome.' : 'Toque no botão + para criar a primeira matéria.'}
          />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('MateriaForm', { id: item.id })}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
                  <View style={{ marginTop: 8 }}>
                    <Badge label={item.segmento} color={corDoSegmento(item.segmento, colors.accents)} />
                  </View>
                </View>
                <Pressable onPress={() => excluir(item)} hitSlop={10} style={{ padding: 4 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.status.danger} />
                </Pressable>
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 10 }}>
                {pluralizar(item.turmaIds?.length ?? 0, 'turma', 'turmas')} ·{' '}
                {pluralizar(item.alunoIds?.length ?? 0, 'aluno', 'alunos')}
              </Text>
            </Card>
          </Pressable>
        )}
      />

      <Fab onPress={() => navigation.navigate('MateriaForm', undefined)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  nome: { fontSize: 16, fontWeight: '800' },
});
