import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../theme/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { LoadingView } from '../../components/LoadingView';
import { materiaService } from '../../api/materiaService';
import { MateriasStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../api/client';

interface Props {
  navigation: NativeStackNavigationProp<MateriasStackParamList, 'MateriaForm'>;
  route: RouteProp<MateriasStackParamList, 'MateriaForm'>;
}

const SEGMENTOS_SUGERIDOS = ['Fundamental', 'Médio', 'Técnico', 'Superior'];

export default function MateriaFormScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const id = route.params?.id;
  const editando = !!id;

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState('');
  const [segmento, setSegmento] = useState('');

  const carregar = useCallback(async () => {
    if (!id) return;
    try {
      const materia = await materiaService.buscarPorId(id);
      setNome(materia.nome);
      setSegmento(materia.segmento);
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
    if (!nome.trim() || !segmento.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e o segmento da matéria.');
      return;
    }
    setSalvando(true);
    try {
      const dto = { nome: nome.trim(), segmento: segmento.trim(), turmaIds: [], alunoIds: [] };
      if (editando && id) {
        await materiaService.alterar(id, dto);
      } else {
        await materiaService.criar(dto);
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
    Alert.alert('Excluir matéria', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await materiaService.excluir(id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Erro', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  if (carregando) return <LoadingView label="Carregando matéria..." />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Input label="Nome da matéria" placeholder="Ex: Desenvolvimento Mobile" value={nome} onChangeText={setNome} icon="book-outline" />
      <Input
        label="Segmento"
        placeholder="Ex: Técnico"
        value={segmento}
        onChangeText={setSegmento}
        icon="layers-outline"
      />

      <Text style={[styles.sugestoesLabel, { color: colors.textSecondary }]}>Sugestões</Text>
      <View style={styles.chipsWrap}>
        {SEGMENTOS_SUGERIDOS.map((s) => (
          <Chip key={s} label={s} selected={segmento === s} onPress={() => setSegmento(s)} />
        ))}
      </View>

      <Button
        title={editando ? 'Salvar alterações' : 'Criar matéria'}
        onPress={salvar}
        loading={salvando}
        icon="checkmark-circle-outline"
        style={{ marginTop: 8 }}
      />

      {editando && (
        <Button
          title="Excluir matéria"
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
  sugestoesLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, marginTop: -8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
});
