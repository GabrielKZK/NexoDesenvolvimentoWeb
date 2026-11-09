import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { alunoService } from '../../services/alunoService';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './styles';

/** Matérias da etapa do aluno, com o progresso real (web: /materias → GET /api/aluno/materias). */
export default function AlunoMateriasScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { dados, carregando, atualizando, erro, recarregar } = useCarregar(alunoService.materias);
  const [busca, setBusca] = useState('');

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (dados ?? []).filter((m) => m.nome.toLowerCase().includes(termo));
  }, [dados, busca]);

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <View style={[styles.busca, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.buscaInput, { color: colors.text }]}
          placeholder="Buscar matéria"
          placeholderTextColor={colors.textSecondary}
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
        />
      </View>

      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {filtradas.length === 0 ? (
          <EmptyState icon="book-outline" title="Nenhuma matéria encontrada" />
        ) : (
          filtradas.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => navigation.navigate('MateriaDetalhe', { materiaId: m.id, nome: m.nome })}
              accessibilityRole="button"
              accessibilityLabel={`${m.nome}, ${m.percentual}% concluído`}
            >
              <Card style={styles.card}>
                <View style={styles.row}>
                  <Text style={[styles.nome, { color: colors.text }]}>{m.nome}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </View>
                <Text style={[styles.sub, { color: colors.textSecondary }]}>
                  {m.conteudosConcluidos} de {m.totalConteudos} conteúdos · {m.percentual}%
                </Text>
                <ProgressBar percent={m.percentual} color={colors.brand.deep} />
              </Card>
            </Pressable>
          ))
        )}
      </AsyncState>
    </ScreenContainer>
  );
}
