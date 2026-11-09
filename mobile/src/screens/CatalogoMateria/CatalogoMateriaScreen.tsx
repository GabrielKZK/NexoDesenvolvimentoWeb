import { useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCarregar } from '../../hooks/useCarregar';
import { adminService } from '../../services/adminService';
import { RootStackParamList } from '../../navigation/types';
import { common } from '../../styles/common';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AsyncState } from '../../components/AsyncState';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';

/** Conteúdos de uma matéria: publicar/despublicar e reordenar (PATCH …/ordem com a lista inteira). */
export default function CatalogoMateriaScreen() {
  const { materiaId } = useRoute<RouteProp<RootStackParamList, 'CatalogoMateria'>>().params;
  const { colors } = useAppTheme();
  const { dados, setDados, carregando, atualizando, erro, recarregar } = useCarregar(() => adminService.conteudosDaMateria(materiaId));
  const [ocupado, setOcupado] = useState<number | null>(null);
  const [reordenando, setReordenando] = useState(false);

  const publicar = async (id: number, publicado: boolean) => {
    setOcupado(id);
    try {
      const novo = await adminService.publicarConteudo(id, publicado);
      setDados((lista) => lista?.map((c) => (c.id === novo.id ? novo : c)) ?? lista);
    } catch (e) {
      Alert.alert('Não foi possível alterar', getErrorMessage(e, 'Tente de novo.'));
    } finally {
      setOcupado(null);
    }
  };

  const mover = async (indice: number, delta: -1 | 1) => {
    if (!dados) return;
    const alvo = indice + delta;
    if (alvo < 0 || alvo >= dados.length) return;
    const nova = [...dados];
    [nova[indice], nova[alvo]] = [nova[alvo], nova[indice]];
    setDados(nova); // otimista; volta ao estado do servidor se falhar
    setReordenando(true);
    try {
      setDados(await adminService.reordenar(materiaId, nova.map((c) => c.id)));
    } catch (e) {
      setDados(dados);
      Alert.alert('Não foi possível reordenar', getErrorMessage(e, 'Tente de novo.'));
    } finally {
      setReordenando(false);
    }
  };

  return (
    <ScreenContainer refreshing={atualizando} onRefresh={recarregar}>
      <AsyncState carregando={carregando} erro={erro} temDados={!!dados} onRetry={recarregar}>
        {dados?.length ? (
          dados.map((c, i) => (
            <Card key={c.id} style={common.card}>
              <View style={common.row}>
                <View style={{ gap: 2 }}>
                  <Pressable onPress={() => mover(i, -1)} disabled={reordenando || i === 0} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Subir ${c.titulo}`}>
                    <Ionicons name="chevron-up" size={22} color={i === 0 || reordenando ? colors.border : colors.text} />
                  </Pressable>
                  <Pressable onPress={() => mover(i, 1)} disabled={reordenando || i === dados.length - 1} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Descer ${c.titulo}`}>
                    <Ionicons name="chevron-down" size={22} color={i === dados.length - 1 || reordenando ? colors.border : colors.text} />
                  </Pressable>
                </View>
                <View style={common.flex}>
                  <Text style={[common.title, { color: colors.text }]}>
                    {i + 1}. {c.titulo}
                  </Text>
                  <Text style={[common.sub, { color: colors.textSecondary }]} numberOfLines={2}>
                    {c.minutos} min{c.resumo ? ` · ${c.resumo}` : ''}
                  </Text>
                </View>
                <Switch
                  value={c.publicado}
                  disabled={ocupado === c.id}
                  onValueChange={(v) => publicar(c.id, v)}
                  accessibilityLabel={`Publicar ${c.titulo}`}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: colors.border, true: colors.brand.deep }}
                />
              </View>
            </Card>
          ))
        ) : (
          <EmptyState icon="document-text-outline" title="Esta matéria ainda não tem conteúdos" />
        )}
        <View style={common.fim} />
      </AsyncState>
    </ScreenContainer>
  );
}
