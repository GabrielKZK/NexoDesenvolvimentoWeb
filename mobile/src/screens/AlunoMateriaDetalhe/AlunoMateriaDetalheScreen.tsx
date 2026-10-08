import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { materiaService } from '../../services/materiaService';
import { Materia } from '../../types/models';
import { createStyles } from './styles';
import { AlunoMateriaDetalheScreenProps } from './types';

export default function AlunoMateriaDetalheScreen({ route }: AlunoMateriaDetalheScreenProps) {
  const { materiaId } = route.params;
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [materia, setMateria] = useState<Materia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarMateria() {
      try {
        setLoading(true);
        setMateria(await materiaService.buscarPorId(materiaId));
      } catch {
        setError('Matéria não encontrada.');
      } finally {
        setLoading(false);
      }
    }

    carregarMateria();
  }, [materiaId]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator color={colors.brand.purple} style={styles.loading} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {materia && (
        <View style={styles.header}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>📚</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{materia.nome}</Text>
            <Text style={styles.segmento}>{materia.segmento}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
