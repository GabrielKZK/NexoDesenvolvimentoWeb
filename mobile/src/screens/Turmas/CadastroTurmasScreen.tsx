import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/models';
import { tema } from '../../theme/temaTurma';
import { turmaService } from '../../api/turmaService';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroTurma'>;

export default function CadastroTurmasScreen({ navigation }: Props) {
  const [nomeTurma, setNomeTurma] = useState("");
  const [anoLetivo, setAnoLetivo] = useState("");
  const [idTurno, setIdTurno] = useState("");
  const [idProfessor, setIdProfessor] = useState("");

  const cadastrarTurma = () => {
    if (nomeTurma.trim() === "" || anoLetivo.trim() === "") {
      Alert.alert("Atenção", "Preencha os campos obrigatórios (Nome e Ano Letivo).");
      return;
    }

    const novaTurma = {
      nome: nomeTurma,
      anoLetivo: parseInt(anoLetivo),
      idTurno: idTurno.trim() === "" ? null : parseInt(idTurno),
      idProfessor: idProfessor.trim() === "" ? null : parseInt(idProfessor),
      materiaIds: []
    };

    turmaService.criar(novaTurma)
      .then(() => {
        Alert.alert("Sucesso", "Turma salva com sucesso!");
        navigation.goBack();
      })
      .catch((error) => console.error("Erro ao salvar:", error));
  }; // <-- Faltava esta chave fechando a função!

  return (
    <View style={tema.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tema.formCard}>
          
          <Text style={tema.label}>Nome da Turma *</Text>
          <TextInput 
            style={tema.input}
            placeholder="Ex: 9º Ano A"
            placeholderTextColor="#6B7280"
            value={nomeTurma}
            onChangeText={setNomeTurma}
          />

          <Text style={tema.label}>Ano Letivo *</Text>
          <TextInput 
            style={tema.input}
            placeholder="Ex: 2026"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={anoLetivo}
            onChangeText={setAnoLetivo}
          />

          <Text style={tema.label}>ID do Turno (Opcional)</Text>
          <TextInput 
            style={tema.input}
            placeholder="Ex: 1"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={idTurno}
            onChangeText={setIdTurno}
          />

          <Text style={tema.label}>ID do Professor (Opcional)</Text>
          <TextInput 
            style={tema.input}
            placeholder="Ex: 2"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={idProfessor}
            onChangeText={setIdProfessor}
          />

          <TouchableOpacity style={tema.botaoPrincipal} onPress={cadastrarTurma}>
            <Text style={tema.textoBotao}>Salvar Turma</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}