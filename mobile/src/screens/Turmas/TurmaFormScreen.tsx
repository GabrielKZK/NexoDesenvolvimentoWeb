import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FormPicker } from '../../components/FormPicker';
import { Chip } from '../../components/Chip';
import { LoadingView } from '../../components/LoadingView';
import { turmaService } from '../../api/turmaService';
import { turnoService } from '../../api/turnoService';
import { materiaService } from '../../api/materiaService';
import { professorService } from '../../api/professorService';
import { Materia, Professor, Turno } from '../../types/models';
import { TurmasStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../api/client';

interface Props {
  navigation: NativeStackNavigationProp<TurmasStackParamList, 'TurmaForm'>;
  route: RouteProp<TurmasStackParamList, 'TurmaForm'>;
}

export default function TurmaFormScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const { professor } = useAuth();
  const id = route.params?.id;
  const editando = !!id;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState('');
  const [anoLetivo, setAnoLetivo] = useState(String(new Date().getFullYear()));
  const [idTurno, setIdTurno] = useState('');
  const [idProfessor, setIdProfessor] = useState('');
  const [materiaIdsOriginais, setMateriaIdsOriginais] = useState<number[]>([]);
  const [materiaIdsSelecionadas, setMateriaIdsSelecionadas] = useState<number[]>([]);

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);

  const carregarDados = useCallback(async () => {
    try {
      const [turnosRes, professoresRes, materiasRes] = await Promise.all([
        turnoService.listarTodos(),
        professorService.listarTodos(),
        materiaService.listarTodas(),
      ]);
      setTurnos(turnosRes);
      setProfessores(professoresRes);
      setMaterias(materiasRes);

      if (editando && id) {
        const turma = await turmaService.buscarPorId(id);
        setNome(turma.nome);
        setAnoLetivo(String(turma.anoLetivo));
        setIdTurno(turma.idTurno ? String(turma.idTurno) : '');
        setIdProfessor(turma.idProfessor ? String(turma.idProfessor) : '');
        setMateriaIdsOriginais(turma.materiaIds ?? []);
        setMateriaIdsSelecionadas(turma.materiaIds ?? []);
      } else if (professor) {
        setIdProfessor(String(professor.id));
      }
    } catch (e) {
      Alert.alert('Erro', getErrorMessage(e));
    } finally {
      setCarregando(false);
    }
  }, [editando, id, professor]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const alternarMateria = (materiaId: number) => {
    setMateriaIdsSelecionadas((prev) =>
      prev.includes(materiaId) ? prev.filter((m) => m !== materiaId) : [...prev, materiaId]
    );
  };

  const salvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome da turma.');
      return;
    }
    const anoNumero = Number(anoLetivo);
    if (!anoNumero || anoNumero < 2000 || anoNumero > 2100) {
      Alert.alert('Atenção', 'Informe um ano letivo válido.');
      return;
    }

    setSalvando(true);
    try {
      const dto = {
        nome: nome.trim(),
        anoLetivo: anoNumero,
        idTurno: idTurno ? Number(idTurno) : null,
        idProfessor: idProfessor ? Number(idProfessor) : null,
        materiaIds: materiaIdsSelecionadas,
      };

      if (editando && id) {
        await turmaService.alterar(id, dto);
        await turmaService.sincronizarMaterias(id, materiaIdsOriginais, materiaIdsSelecionadas);
      } else {
        const criada = await turmaService.criar(dto);
        await turmaService.sincronizarMaterias(criada.id, [], materiaIdsSelecionadas);
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
    Alert.alert('Excluir turma', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await turmaService.excluir(id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Erro', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  if (carregando) return <LoadingView label="Carregando dados da turma..." />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Input label="Nome da turma" placeholder="Ex: 3º Ano DS" value={nome} onChangeText={setNome} icon="people-outline" />
      <Input
        label="Ano letivo"
        placeholder="2026"
        keyboardType="number-pad"
        value={anoLetivo}
        onChangeText={setAnoLetivo}
        icon="calendar-outline"
      />

      <FormPicker
        label="Turno"
        selectedValue={idTurno}
        onValueChange={setIdTurno}
        options={turnos.map((t) => ({ label: t.nome, value: String(t.id) }))}
        placeholder="Sem turno definido"
      />

      <FormPicker
        label="Professor responsável"
        selectedValue={idProfessor}
        onValueChange={setIdProfessor}
        options={professores.map((p) => ({ label: p.nome, value: String(p.id) }))}
        placeholder="Sem professor definido"
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Matérias vinculadas</Text>
      {materias.length === 0 ? (
        <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 16 }}>
          Nenhuma matéria cadastrada ainda.
        </Text>
      ) : (
        <View style={styles.chipsWrap}>
          {materias.map((m) => (
            <Chip
              key={m.id}
              label={m.nome}
              selected={materiaIdsSelecionadas.includes(m.id)}
              onPress={() => alternarMateria(m.id)}
            />
          ))}
        </View>
      )}

      <Button
        title={editando ? 'Salvar alterações' : 'Criar turma'}
        onPress={salvar}
        loading={salvando}
        icon="checkmark-circle-outline"
        style={{ marginTop: 8 }}
      />

      {editando && (
        <Button
          title="Excluir turma"
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
  label: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
});
