import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../theme/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SwitchRow } from '../../components/SwitchRow';
import { LoadingView } from '../../components/LoadingView';
import { turnoService } from '../../api/turnoService';
import { TurnosStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../api/client';
import { formatHora, paraLocalTime } from '../../utils/format';
import { isHoraValida } from '../../utils/validation';

interface Props {
  navigation: NativeStackNavigationProp<TurnosStackParamList, 'TurnoForm'>;
  route: RouteProp<TurnosStackParamList, 'TurnoForm'>;
}

export default function TurnoFormScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const id = route.params?.id;
  const editando = !!id;

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [ativo, setAtivo] = useState(true);

  const carregar = useCallback(async () => {
    if (!id) return;
    try {
      const turno = await turnoService.buscarPorId(id);
      setNome(turno.nome);
      setHoraInicio(formatHora(turno.horaInicio));
      setHoraFim(formatHora(turno.horaFim));
      setAtivo(turno.ativo);
    } catch (e) {
      Alert.alert('Erro', getErrorMessage(e));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const salvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do turno (ex: Matutino).');
      return;
    }
    if (!isHoraValida(horaInicio) || !isHoraValida(horaFim)) {
      Alert.alert('Atenção', 'Informe os horários no formato HH:MM, ex: 08:00.');
      return;
    }

    setSalvando(true);
    try {
      const dto = {
        nome: nome.trim(),
        horaInicio: paraLocalTime(horaInicio),
        horaFim: paraLocalTime(horaFim),
        ativo,
      };
      if (editando && id) {
        await turnoService.atualizar(id, dto);
      } else {
        await turnoService.criar(dto);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar', getErrorMessage(e));
    } finally {
      setSalvando(false);
    }
  };

  const excluir = () => {
    if (!id) return;
    Alert.alert('Excluir turno', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await turnoService.deletar(id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Erro', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  if (carregando) return <LoadingView label="Carregando turno..." />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Input label="Nome do turno" placeholder="Ex: Matutino" value={nome} onChangeText={setNome} icon="sunny-outline" />
      <Input
        label="Horário de início"
        placeholder="08:00"
        value={horaInicio}
        onChangeText={setHoraInicio}
        icon="time-outline"
        keyboardType="numbers-and-punctuation"
        maxLength={5}
      />
      <Input
        label="Horário de término"
        placeholder="12:00"
        value={horaFim}
        onChangeText={setHoraFim}
        icon="time-outline"
        keyboardType="numbers-and-punctuation"
        maxLength={5}
      />

      <SwitchRow
        label="Turno ativo"
        description="Turnos inativos deixam de aparecer para novas turmas."
        value={ativo}
        onValueChange={setAtivo}
      />

      <Button
        title={editando ? 'Salvar alterações' : 'Criar turno'}
        onPress={salvar}
        loading={salvando}
        icon="checkmark-circle-outline"
        style={{ marginTop: 8 }}
      />

      {editando && (
        <Button
          title="Excluir turno"
          onPress={excluir}
          variant="outline"
          icon="trash-outline"
          tintColor={colors.status.danger}
          style={{ marginTop: 12 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
});
