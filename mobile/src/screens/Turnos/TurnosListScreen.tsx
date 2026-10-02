import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeContext';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Fab } from '../../components/Fab';
import { EmptyState } from '../../components/EmptyState';
import { LoadingView } from '../../components/LoadingView';
import { turnoService } from '../../api/turnoService';
import { Turno } from '../../types/models';
import { TurnosStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../api/client';
import { formatHora } from '../../utils/format';

interface Props {
  navigation: NativeStackNavigationProp<TurnosStackParamList, 'TurnosList'>;
}

export default function TurnosListScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const lista = await turnoService.listarTodos();
      setTurnos(lista);
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
          <EmptyState
            icon="time-outline"
            title="Nenhum turno cadastrado"
            subtitle="Toque no botão + para criar o primeiro turno."
          />
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

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 15, fontWeight: '800' },
});
