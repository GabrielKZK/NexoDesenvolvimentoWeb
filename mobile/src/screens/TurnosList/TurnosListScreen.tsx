import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Fab } from '../../components/Fab';
import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { turnoService } from '../../services/turnoService';
import { Turno } from '../../types/models';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { formatHora } from '../../utils/format';
import { styles } from './styles';
import { TurnosListScreenProps } from './types';

export default function TurnosListScreen({ navigation }: TurnosListScreenProps) {
  const { colors } = useAppTheme();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const lista = await turnoService.listarTodos();
      setTurnos(lista);
    } catch (e) {
      setErro(getErrorMessage(e));
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

  const excluir = (turno: Turno) => {
    Alert.alert('Excluir turno', `Deseja realmente excluir "${turno.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await turnoService.deletar(turno.id);
            setTurnos((prev) => prev.filter((t) => t.id !== turno.id));
          } catch (e) {
            Alert.alert('Erro', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  if (carregando) return <LoadingView label="Carregando turnos..." />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={turnos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          erro ? (
            <EmptyState
              icon="cloud-offline-outline"
              title="Não foi possível carregar"
              subtitle={erro}
              actionLabel="Tentar novamente"
              onAction={carregar}
            />
          ) : (
            <EmptyState
              icon="time-outline"
              title="Nenhum turno cadastrado"
              subtitle="Toque no botão + para criar o primeiro turno."
            />
          )
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('TurnoForm', { id: item.id })}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: `${colors.accents.amber}22` }]}>
                  <Ionicons name="time" size={20} color={colors.accents.amber} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                    {formatHora(item.horaInicio)} às {formatHora(item.horaFim)}
                  </Text>
                </View>
                <Badge
                  label={item.ativo ? 'Ativo' : 'Inativo'}
                  color={item.ativo ? colors.status.success : colors.status.danger}
                />
                <Pressable onPress={() => excluir(item)} hitSlop={10} style={{ marginLeft: 10 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.status.danger} />
                </Pressable>
              </View>
            </Card>
          </Pressable>
        )}
      />

      <Fab onPress={() => navigation.navigate('TurnoForm', undefined)} />
    </View>
  );
}
