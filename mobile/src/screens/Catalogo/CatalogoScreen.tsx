import { useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { adminService } from '../../services/adminService';
import { RootStackParamList } from '../../navigation/types';
import { common } from '../../styles/common';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Segmented } from '../../components/Segmented';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';

type Aba = 'materias' | 'desafios';

/** Catálogo (web: /catalogo): matérias → conteúdos, e desafios, com publicar/despublicar. */
export default function CatalogoScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [aba, setAba] = useState<Aba>('materias');
  const [ocupado, setOcupado] = useState<number | null>(null);

  const materias = useCarregar(adminService.catalogo);
  const desafios = useCarregar(adminService.desafios);
  const atual = aba === 'materias' ? materias : desafios;

  const publicarDesafio = async (id: number, publicado: boolean) => {
    setOcupado(id);
    try {
      const novo = await adminService.publicarDesafio(id, publicado);
      desafios.setDados((lista) => lista?.map((d) => (d.id === novo.id ? novo : d)) ?? lista);
    } catch (e) {
      Alert.alert('Não foi possível alterar', getErrorMessage(e, 'Tente de novo.'));
    } finally {
      setOcupado(null);
    }
  };

  return (
    <ScreenContainer refreshing={atual.atualizando} onRefresh={atual.recarregar}>
      <Segmented
        valor={aba}
        onChange={setAba}
        opcoes={[
          { valor: 'materias', rotulo: 'Matérias' },
          { valor: 'desafios', rotulo: 'Desafios' },
        ]}
      />
      <AsyncState carregando={atual.carregando} erro={atual.erro} temDados={!!atual.dados} onRetry={atual.recarregar}>
        {aba === 'materias' ? (
          materias.dados?.length ? (
            materias.dados.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => navigation.navigate('CatalogoMateria', { materiaId: m.id, nome: m.nome })}
                accessibilityRole="button"
                accessibilityLabel={`Abrir conteúdos de ${m.nome}`}
              >
                <Card style={common.card}>
                  <View style={common.between}>
                    <Text style={[common.title, common.flex, { color: colors.text }]}>{m.nome}</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                  </View>
                  <Text style={[common.sub, { color: colors.textSecondary, marginBottom: 8 }]}>
                    {m.conteudosPublicados}/{m.conteudos} conteúdos no ar
                  </Text>
                  <ProgressBar percent={m.conteudos ? (m.conteudosPublicados / m.conteudos) * 100 : 0} color={colors.brand.deep} />
                </Card>
              </Pressable>
            ))
          ) : (
            <EmptyState icon="book-outline" title="Nenhuma matéria no catálogo" />
          )
        ) : desafios.dados?.length ? (
          desafios.dados.map((d) => (
            <Card key={d.id} style={common.card}>
              <View style={common.between}>
                <View style={common.flex}>
                  <Text style={[common.title, { color: colors.text }]}>{d.titulo}</Text>
                  <Text style={[common.sub, { color: colors.textSecondary }]}>
                    {[d.materia, d.nivel].filter(Boolean).join(' · ')} · {d.xp} XP · {d.tempoMin} min
                  </Text>
                </View>
                <Switch
                  value={d.publicado}
                  disabled={ocupado === d.id}
                  onValueChange={(v) => publicarDesafio(d.id, v)}
                  accessibilityLabel={`Publicar ${d.titulo}`}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: colors.border, true: colors.brand.deep }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginTop: 6 }}>
                <Badge label={d.publicado ? 'No ar' : 'Fora do ar'} color={d.publicado ? colors.brand.green : colors.textSecondary} />
              </View>
            </Card>
          ))
        ) : (
          <EmptyState icon="trophy-outline" title="Nenhum desafio cadastrado" />
        )}
        <View style={common.fim} />
      </AsyncState>
    </ScreenContainer>
  );
}
