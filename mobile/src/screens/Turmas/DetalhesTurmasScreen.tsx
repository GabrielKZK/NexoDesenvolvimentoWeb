import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/models';
import { tema } from '../../theme/temaTurma';
import { turmaService } from '../../api/turmaService';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhesTurma'>;

export default function DetalhesTurmasScreen({ route, navigation }: Props) {
  const { turma } = route.params; 

  const [isEditing, setIsEditing] = useState(false);

  const [nome, setNome] = useState(turma.nome);
  const [anoLetivo, setAnoLetivo] = useState(turma.anoLetivo.toString());
  const [idTurno, setIdTurno] = useState(turma.idTurno ? turma.idTurno.toString() : "");
  const [idProfessor, setIdProfessor] = useState(turma.idProfessor ? turma.idProfessor.toString() : "");

  const handleExcluir = () => {
    Alert.alert(
      "Excluir Turma",
      "Tem certeza que deseja excluir esta turma?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => {
            turmaService.excluir(turma.id!)
              .then(() => {
                Alert.alert("Sucesso", "Turma excluída!");
                navigation.goBack();
              })
              .catch(err => console.error("Erro ao excluir", err));
          }
        }
      ]
    );
  };

  const handleSalvar = () => {
    if (nome.trim() === "" || anoLetivo.trim() === "") {
      Alert.alert("Atenção", "Preencha os campos obrigatórios (Nome e Ano Letivo).");
      return;
    }

    const turmaAtualizada = {
      ...turma,
      nome: nome,
      anoLetivo: parseInt(anoLetivo),
      idTurno: idTurno.trim() === "" ? null : parseInt(idTurno),
      idProfessor: idProfessor.trim() === "" ? null : parseInt(idProfessor),
    };

    turmaService.alterar(turma.id!, turmaAtualizada)
      .then(() => {
        Alert.alert("Sucesso", "Dados atualizados!");
        setIsEditing(false);
      })
      .catch(err => console.error("Erro ao atualizar", err));
  };

  return (
    <View style={tema.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tema.card}>
          <Text style={tema.label}>Nome da Turma *</Text>
          {isEditing ? (
            <TextInput style={tema.input} value={nome} onChangeText={setNome} />
          ) : (
            <Text style={tema.valor}>{nome}</Text>
          )}

          <Text style={tema.label}>Ano Letivo *</Text>
          {isEditing ? (
            <TextInput style={tema.input} value={anoLetivo} onChangeText={setAnoLetivo} keyboardType="numeric" />
          ) : (
            <Text style={tema.valor}>{anoLetivo}</Text>
          )}

          <Text style={tema.label}>Turno:</Text>
          {isEditing ? (
            <TextInput style={tema.input} value={idTurno} onChangeText={setIdTurno} keyboardType="numeric" placeholder="ID do Turno" placeholderTextColor="#6B7280" />
          ) : (
            <Text style={tema.valor}>{turma.nomeTurno || turma.idTurno || "Não informado"}</Text>
          )}

          <Text style={tema.label}>Professor:</Text>
          {isEditing ? (
            <TextInput style={tema.input} value={idProfessor} onChangeText={setIdProfessor} keyboardType="numeric" placeholder="ID do Professor" placeholderTextColor="#6B7280" />
          ) : (
            <Text style={tema.valor}>{turma.nomeProfessor || turma.idProfessor || "Não informado"}</Text>
          )}
        </View>

        <View style={tema.botoesContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={[tema.botao, tema.botaoSalvar]} onPress={handleSalvar}>
                <Text style={tema.textoBotao}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[tema.botao, tema.botaoCancelar]} onPress={() => setIsEditing(false)}>
                <Text style={tema.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[tema.botao, tema.botaoEditar]} onPress={() => setIsEditing(true)}>
                <Text style={tema.textoBotao}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[tema.botao, tema.botaoExcluir]} onPress={handleExcluir}>
                <Text style={tema.textoBotao}>Excluir</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}