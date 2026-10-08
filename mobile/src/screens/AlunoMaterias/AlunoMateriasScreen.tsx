import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { materiaService } from '../../services/materiaService';
import { Materia } from '../../types/models';
import { createStyles } from './styles';
import { AlunoMateriasScreenProps } from './types';

export default function AlunoMateriasScreen({ navigation }: AlunoMateriasScreenProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setError(null);
      setMaterias(await materiaService.listarTodas());
    } catch {
      setError('Não foi possível carregar as matérias.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const filtradas = materias.filter((m) => m.nome.toLowerCase().includes(busca.trim().toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Matérias</Text>
      <Text style={styles.subtitle}>Explore todo o conteúdo disponível por disciplina</Text>

      <TextInput
        style={styles.search}
        placeholder="Buscar matéria..."
        placeholderTextColor={colors.textSecondary}
        value={busca}
        onChangeText={setBusca}
      />

      {error && (
        <TouchableOpacity onPress={carregar}>
          <Text style={styles.error}>{error} Toque para tentar novamente.</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator color={colors.brand.purple} style={styles.loading} />}

      <FlatList
        data={filtradas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && !error ? <Text style={styles.empty}>Nenhuma matéria encontrada.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>📚</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.segmento}>{item.segmento}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('AlunoMateriaDetalhe', { materiaId: item.id })}
            >
              <Text style={styles.buttonText}>Acessar Disciplina</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
